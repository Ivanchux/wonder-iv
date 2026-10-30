'use strict';
// Bot de pruebas de WONDER IV. Uso: node bot.js <carpeta-del-juego> <partidas> [salida.json]
const vm = require('vm');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { createGame } = require('./harness');

const N = 49, COLS = 7, ROWS = 7;

// ── utilidades de rejilla (copia rápida de la regla de findMatches) ──
function readGrid(board) {
  const t = new Int8Array(N), g = new Uint8Array(N), area = new Uint8Array(N);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const x = board[r][c], i = r * COLS + c;
    if (x.kind === 'gem-line' || x.kind === 'gem-area') { t[i] = -1; g[i] = 1; area[i] = x.kind === 'gem-area' ? 1 : 0; }
    else t[i] = x.t;
  }
  return { t, g, area };
}
const mark = new Uint8Array(N);
function markMatches(t) {
  mark.fill(0); let n = 0;
  for (let r = 0; r < ROWS; r++) {
    let c = 0;
    while (c < COLS) {
      const v = t[r * COLS + c]; if (v < 0) { c++; continue; }
      let e = c + 1; while (e < COLS && t[r * COLS + e] === v) e++;
      if (e - c >= 3) for (let i = c; i < e; i++) if (!mark[r * COLS + i]) { mark[r * COLS + i] = 1; n++; }
      c = e;
    }
  }
  for (let c = 0; c < COLS; c++) {
    let r = 0;
    while (r < ROWS) {
      const v = t[r * COLS + c]; if (v < 0) { r++; continue; }
      let e = r + 1; while (e < ROWS && t[e * COLS + c] === v) e++;
      if (e - r >= 3) for (let i = r; i < e; i++) if (!mark[i * COLS + c]) { mark[i * COLS + c] = 1; n++; }
      r = e;
    }
  }
  return n;
}
function lineHit(t, i) {
  const v = t[i]; if (v < 0) return false;
  const r = (i / COLS) | 0, c = i % COLS;
  let n = 1, k = c - 1; while (k >= 0 && t[r * COLS + k] === v) { n++; k--; }
  k = c + 1; while (k < COLS && t[r * COLS + k] === v) { n++; k++; }
  if (n >= 3) return true;
  n = 1; k = r - 1; while (k >= 0 && t[k * COLS + c] === v) { n++; k--; }
  k = r + 1; while (k < ROWS && t[k * COLS + c] === v) { n++; k++; }
  return n >= 3;
}
function legalMoves(gr) {
  const { t, g } = gr;
  const pre = markMatches(t) > 0;
  const out = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const a = r * COLS + c;
    for (const b of [c < COLS - 1 ? a + 1 : -1, r < ROWS - 1 ? a + COLS : -1]) {
      if (b < 0) continue;
      if (g[a] || g[b]) { out.push({ a, b, gem: true }); continue; }
      let tmp = t[a]; t[a] = t[b]; t[b] = tmp;
      const ok = pre ? markMatches(t) > 0 : (lineHit(t, a) || lineHit(t, b));
      const cnt = ok ? markMatches(t) : 0;
      tmp = t[a]; t[a] = t[b]; t[b] = tmp;
      if (ok) out.push({ a, b, gem: false, cnt: pre ? cnt : cnt });
    }
  }
  return { moves: out, pre };
}

// ── políticas ──
function blastSize(gr, a, b) {
  const { g, area } = gr;
  const ga = g[a], gb = g[b];
  const cellsOf = (i, kind) => {
    const r = (i / COLS) | 0, c = i % COLS, s = new Set();
    if (kind === 0) { for (let k = 0; k < COLS; k++) s.add(r * COLS + k); for (let k = 0; k < ROWS; k++) s.add(k * COLS + c); }
    else for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const nr = r + dr, nc = c + dc; if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) s.add(nr * COLS + nc); }
    return s;
  };
  if (ga && gb) return area[a] && area[b] ? 25 : (!area[a] && !area[b] ? 25 : 30);
  return (ga ? cellsOf(a, area[a]) : cellsOf(b, area[b])).size;
}
const POLICIES = {
  aleatorio(ms, gr, rnd) { return ms[(rnd() * ms.length) | 0]; },
  progreso(ms, gr, rnd) {
    let best = -1, pick = [];
    for (const m of ms) {
      const v = m.gem ? 0 : Math.max(1, Math.floor(m.cnt / 3));
      if (v > best) { best = v; pick = [m]; } else if (v === best) pick.push(m);
    }
    return pick[(rnd() * pick.length) | 0];
  },
  peor(ms, gr, rnd) {
    // adversario: prefiere intercambios con gema (sin avance inmediato) y, si no, la combinación más pequeña
    let best = 1e9, pick = [];
    for (const m of ms) {
      const v = m.gem ? -1 : Math.max(1, Math.floor(m.cnt / 3));
      if (v < best) { best = v; pick = [m]; } else if (v === best) pick.push(m);
    }
    return pick[(rnd() * pick.length) | 0];
  },
  puntos(ms, gr, rnd) {
    let best = -1, pick = [];
    for (const m of ms) {
      const v = m.gem ? blastSize(gr, m.a, m.b) * 120 : m.cnt * 100;
      if (v > best) { best = v; pick = [m]; } else if (v === best) pick.push(m);
    }
    return pick[(rnd() * pick.length) | 0];
  },
};

function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ── una partida ──
async function playGame(G, wonderIdx, policyName, seed, check) {
  const { ev, ctx, flush } = G;
  G.seed(seed);
  ev(`__R = { ended:false, win:null, stars:0, score:0, movesLeft:0, shuffles:0, procs:[], eraRatios:[], shuffleLeftover:[] }; busy=false;`);
  ev(`startLevel(${wonderIdx})`);
  flush();
  const board = ev('board');
  const st = new vm.Script('({moves,score,wonderProg,busy,level,currentEra,objCollected,combo,stages:WONDERS[level].stages})');
  const getSt = () => st.runInContext(ctx);
  const doSwap = ev('doSwap'), useShuffle = ev('useShuffle'), findMatches = ev('findMatches'), hasMoves = ev('hasMoves');
  const activatePowerup = ev('activatePowerup'), applyPowerupAt = ev('applyPowerupAt');
  const rnd = rngOf(seed * 7919 + 13);
  const res = { win: false, stars: 0, score: 0, movesLeft: 0, steps: 0, deadlock: false, deadlockWhy: '', unresolved: 0, orphan: 0, domBad: 0, engineHasMovesMismatch: 0, nullTiles: 0, initialNoMoves: false, stageLog: [] };
  const R = () => ev('__R');
  const checkInvariants = () => {
    flush();
    let nulls = 0;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) { const x = board[r][c]; if (!x || x.t === undefined || x.t < 0 || x.t > 6) nulls++; }
    if (nulls) res.nullTiles++;
    const um = findMatches().length; if (um) res.unresolved++;
    const el = G.els.get('board');
    const cd = ev('cellDom');
    const known = new Set();
    let bad = 0;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const e = cd[r] && cd[r][c];
      if (!e) { bad++; continue; }
      known.add(e);
      if (+e.dataset.r !== r || +e.dataset.c !== c) bad++;
      const want = ev(`tileClass(board[${r}][${c}])`).split(' ');
      for (const w of want) if (!e._cls.has(w)) { bad++; break; }
    }
    if (bad) res.domBad++;
    const cells = el.children.filter(x => x.classList.contains('cell'));
    const orphans = cells.filter(x => !known.has(x)).length;
    if (orphans) res.orphan++;
    // coherencia hasMoves del motor vs. enumeración propia
    if (!getSt().busy) {
      const { moves: lm } = legalMoves(readGrid(board));
      const eng = hasMoves();
      if (eng !== (lm.some(m => !m.gem))) res.engineHasMovesMismatch++;
    }
  };

  let guard = 0;
  while (!R().ended && guard++ < 300) {
    const s = getSt();
    const gr = readGrid(board);
    let { moves: ms } = legalMoves(gr);
    if (res.steps === 0 && !ms.some(m => !m.gem)) res.initialNoMoves = true;

    if (policyName === 'caos') {
      if (res.lastPower && !ms.length) res.deadAfterPower = (res.deadAfterPower || 0) + 1;
      const hasGemNow = gr.g.some(v => v);
      if (res.lastPower && !ms.some(m => !m.gem) && !hasGemNow) res.deadNoGemAfterPower = (res.deadNoGemAfterPower || 0) + 1;
      res.lastPower = false;
      const x = rnd();
      if (x < 0.12) {          // poder
        const types = ['bomb', 'ray', 'color', 'shuffle'];
        const ty = types[(rnd() * 4) | 0];
        activatePowerup(ty);
        if (ev('activePu')) { await applyPowerupAt((rnd() * 7) | 0, (rnd() * 7) | 0); if (ty !== 'shuffle') { res.powerUses = (res.powerUses || 0) + 1; res.lastPower = true; } }
      } else if (x < 0.20) {   // intercambio ilegal (debe revertir sin coste)
        const r = (rnd() * 7) | 0, c = (rnd() * 6) | 0;
        await doSwap(r, c, r, c + 1);
      } else if (ms.length) {
        const m = ms[(rnd() * ms.length) | 0];
        await doSwap((m.a / COLS) | 0, m.a % COLS, (m.b / COLS) | 0, m.b % COLS);
      } else if (ev('puCounts').shuffle > 0) { useShuffle(); }
      else { res.deadlock = true; res.deadlockWhy = 'sin movimientos ni revolver'; break; }
      res.steps++;
      checkInvariants();
      continue;
    }

    if (!ms.length) {
      if (ev('puCounts').shuffle > 0) { useShuffle(); flush(); continue; }
      res.deadlock = true; res.deadlockWhy = 'sin movimientos ni revolver'; break;
    }
    const m = POLICIES[policyName](ms, gr, rnd);
    const before = s.wonderProg;
    await doSwap((m.a / COLS) | 0, m.a % COLS, (m.b / COLS) | 0, m.b % COLS);
    res.steps++;
    res.stageLog.push([getSt().wonderProg - before, m.gem ? 1 : 0]);
    if (check) checkInvariants(); else flush();
  }
  const Rr = R();
  const fin = getSt();
  res.win = !!Rr.win; res.stars = Rr.stars || 0; res.score = Rr.score || fin.score; res.movesLeft = Rr.ended ? Rr.movesLeft : fin.moves;
  res.shuffles = Rr.shuffles; res.shuffleLeftover = Rr.shuffleLeftover.slice();
  res.shuffleMovesLog = (Rr.shuffleMovesLog || []).slice();
  res.procs = Rr.procs.map(p => [p.sz, p.comps]);
  const eraNeed = ev(`WONDERS[level].eras[currentEra].objCount`);
  res.eraRatios = Rr.eraRatios.slice();
  if (res.win) res.eraRatios.push(Math.min(1, fin.objCollected / eraNeed));
  res.ended = !!Rr.ended;
  res.finalProg = fin.wonderProg; res.stages = fin.stages;
  return res;
}

function summarize(rs) {
  const n = rs.length, wins = rs.filter(r => r.win);
  const mean = (a, f) => a.length ? a.reduce((s, x) => s + f(x), 0) / a.length : 0;
  const procs = rs.flatMap(r => r.procs);
  const spurious = procs.filter(([sz, comps]) => sz >= 4 && comps > 1).length;
  const stageGainAll = rs.flatMap(r => r.stageLog);
  const stageGain = stageGainAll.map(x => x[0]);
  const gemMoves = stageGainAll.filter(x => x[1]);
  const normMoves = stageGainAll.filter(x => !x[1]);
  return {
    games: n, winPct: 100 * wins.length / n,
    starsAvg: mean(rs, r => r.stars), stars3Pct: 100 * rs.filter(r => r.stars === 3).length / n,
    movesLeftWin: mean(wins, r => r.movesLeft), scoreAvg: mean(rs, r => r.score), scoreWin: mean(wins, r => r.score),
    stepsAvg: mean(rs, r => r.steps),
    progAtEnd: mean(rs, r => r.finalProg / r.stages),
    stageGainAvg: stageGain.length ? stageGain.reduce((a, b) => a + b, 0) / stageGain.length : 0,
    deadlocks: rs.filter(r => r.deadlock).length,
    initialNoMoves: rs.filter(r => r.initialNoMoves).length,
    notEnded: rs.filter(r => !r.ended && !r.deadlock).length,
    shuffleGames: rs.filter(r => r.shuffles > 0).length,
    shuffleEvents: rs.reduce((s, r) => s + r.shuffles, 0),
    shuffleLeftoverMatches: rs.flatMap(r => r.shuffleLeftover).filter(x => x > 0).length,
    shuffleNoMoves: rs.flatMap(r => r.shuffleMovesLog).filter(x => !x).length,
    procsTotal: procs.length, spurious, gemProcs: procs.filter(([sz]) => sz >= 4).length,
    gemMovesN: gemMoves.length, gemMoveGain: gemMoves.length ? gemMoves.reduce((a, x) => a + x[0], 0) / gemMoves.length : 0,
    normMoveGain: normMoves.length ? normMoves.reduce((a, x) => a + x[0], 0) / normMoves.length : 0,
    orphanGames: rs.filter(r => r.orphan > 0).length, domBadGames: rs.filter(r => r.domBad > 0).length, unresolvedGames: rs.filter(r => r.unresolved > 0).length,
    powerUses: rs.reduce((a, r) => a + (r.powerUses || 0), 0), deadAfterPower: rs.reduce((a, r) => a + (r.deadAfterPower || 0), 0), deadNoGemAfterPower: rs.reduce((a, r) => a + (r.deadNoGemAfterPower || 0), 0),
    objUnmetWin: wins.length ? 100 * wins.filter(r => r.eraRatios.some(x => x < 1)).length / wins.length : 0,
    objMeanRatio: mean(wins.flatMap(r => r.eraRatios), x => x) || 0,
    unresolved: rs.reduce((s, r) => s + r.unresolved, 0),
    orphan: rs.reduce((s, r) => s + r.orphan, 0),
    domBad: rs.reduce((s, r) => s + r.domBad, 0),
    nullTiles: rs.reduce((s, r) => s + r.nullTiles, 0),
    hasMovesMismatch: rs.reduce((s, r) => s + r.engineHasMovesMismatch, 0),
  };
}

async function runTask(task) {
  const G = createGame(task.src, { fastSvg: task.fastSvg !== false });
  const out = [];
  for (let i = 0; i < task.games; i++) {
    const seed = 1000003 * (task.wonder + 1) + i + (task.seedOffset || 0);
    out.push(await playGame(G, task.wonder, task.policy, seed, task.check));
  }
  return { task: { wonder: task.wonder, policy: task.policy, games: task.games, check: !!task.check }, summary: summarize(out), raw: task.keepRaw ? out : undefined };
}

if (!isMainThread) {
  (async () => {
    const results = [];
    for (const t of workerData.tasks) results.push(await runTask(t));
    parentPort.postMessage(results);
  })();
} else if (require.main === module) {
  (async () => {
    const [src, gamesArg, outFile] = process.argv.slice(2);
    const games = +gamesArg || 500;
    const tasks = [];
    for (let w = 0; w < 8; w++) for (const p of ['aleatorio', 'progreso', 'puntos', 'peor']) tasks.push({ src, wonder: w, policy: p, games });
    for (let w = 0; w < 8; w++) tasks.push({ src, wonder: w, policy: 'caos', games: Math.max(40, Math.floor(games / 10)), check: true });
    for (let w = 0; w < 8; w++) tasks.push({ src, wonder: w, policy: 'progreso', games: Math.max(40, Math.floor(games / 10)), check: true, seedOffset: 500000 });
    const nW = 2, buckets = Array.from({ length: nW }, () => []);
    tasks.forEach((t, i) => buckets[i % nW].push(t));
    const all = (await Promise.all(buckets.map(b => new Promise((res, rej) => {
      const w = new Worker(__filename, { workerData: { tasks: b } });
      w.on('message', res); w.on('error', rej);
    })))).flat();
    require('fs').writeFileSync(outFile || 'resultados.json', JSON.stringify(all, null, 1));
    console.log('listo', all.length, 'tareas');
  })();
}

module.exports = { playGame, runTask, summarize };
