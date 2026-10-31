// Prueba de humo de WONDER IV con Playwright: sirve la carpeta, juega los siete niveles con un bot
// y comprueba los edificios, las ventajas y el guardado. No es una dependencia del juego.
//   npm i playwright && node tools/prueba/jugar.mjs [partidas por nivel]
import http from 'http'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.ico': 'image/x-icon' };
const srv = http.createServer((q, r) => { const p = path.join(root, decodeURIComponent(q.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(d); }); });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${srv.address().port}/`, runs = +process.argv[2] || 1;
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1200, height: 800 }, reducedMotion: 'reduce' })).newPage();
const problems = []; page.on('pageerror', e => problems.push('error: ' + e)); page.on('requestfailed', r => problems.push('petición fallida: ' + r.url()));
await page.goto(url);
const ok = (c, msg) => { console.log((c ? '  ✔ ' : '  ✘ ') + msg); if (!c) problems.push(msg); };

console.log('Asentamiento');
await page.evaluate(() => { localStorage.clear(); localStorage.setItem('wonder_stock', JSON.stringify({ madera: 5, piedra: 5, ladrillo: 5, marmol: 5, bronce: 5 })); buildSelectScreen(); });
ok(await page.evaluate(() => document.querySelectorAll('.plot').length) === 12, '7 maravillas y 5 edificios en el mapa');
ok(await page.evaluate(() => document.querySelectorAll('.wonder-plot.locked').length) === 6, 'solo la primera maravilla está abierta');
await page.evaluate(() => BUILDINGS.forEach(b => upgradeBuilding(b.id)));
ok(await page.evaluate(() => BUILDINGS.every(b => buildingLevel(b.id) === 1)), 'los cinco edificios suben a nivel 1 con 5 materiales');
ok(await page.evaluate(() => !upgradeBuilding('casa')), 'no se puede mejorar sin materiales');
await page.evaluate(() => startLevel(0));
ok(await page.evaluate(() => moves === WONDERS[0].movs + 2 && puCounts.bomb === PU_DEFAULTS.bomb + 1 && puCounts.ray === PU_DEFAULTS.ray + 1 && puCounts.shuffle === PU_DEFAULTS.shuffle + 1 && puCounts.color === PU_DEFAULTS.color + 1), 'las ventajas de los edificios se aplican al empezar la obra');

console.log('Interfaz y sonido');
ok(await page.evaluate(() => !document.body.innerHTML.toLowerCase().includes('retroterm')), 'no queda ninguna referencia a Retroterm en la página');
const audio = await page.evaluate(async () => { const o = []; for (const id of Object.keys(Snd.TRACKS)) { const b = await Snd.render(id, 12); let sq = 0, n = 0, pk = 0, bad = 0; for (let c = 0; c < 2; c++) for (const v of b.getChannelData(c)) { if (!isFinite(v)) bad++; sq += v * v; n++; pk = Math.max(pk, Math.abs(v)); } o.push({ id, rms: Math.sqrt(sq / n), pk, bad }); } return o; });
audio.forEach(t => ok(t.bad === 0 && t.rms > 0.01 && t.pk < 0.99, `pista ${t.id}: suena y no satura (rms ${t.rms.toFixed(3)}, pico ${t.pk.toFixed(2)})`));
const sfx = await page.evaluate(async () => { const bad = []; for (const id of Object.keys(Snd.S)) { const b = await Snd.render(id, 2); let pk = 0; for (const v of b.getChannelData(0)) pk = Math.max(pk, Math.abs(v)); if (!(pk > 0.005 && pk < 0.99)) bad.push(id); } return bad; });
ok(sfx.length === 0, 'todos los efectos de sonido suenan' + (sfx.length ? ' (fallan: ' + sfx.join(', ') + ')' : ''));
await page.click('#btn-music');
ok(await page.evaluate(() => Snd.cfg.music === false && JSON.parse(localStorage.getItem('wonder_audio')).music === false), 'el botón de música silencia y se guarda');
await page.click('#btn-music'); await page.click('#btn-sfx'); await page.click('#btn-sfx');
await page.keyboard.press('Escape');
ok(await page.evaluate(() => document.getElementById('settings').classList.contains('show')), 'Esc abre los ajustes');
await page.click('#set-reduce'); ok(await page.evaluate(() => document.body.classList.contains('reduce-motion')), 'reducir movimiento se activa'); await page.click('#set-reduce');
await page.keyboard.press('Escape');
ok(await page.evaluate(() => !document.getElementById('settings').classList.contains('show')), 'Esc cierra los ajustes');

console.log('Poderes y efectos (con animaciones)');
const page2 = await (await browser.newContext({ viewport: { width: 1200, height: 800 } })).newPage(); page2.on('pageerror', e => problems.push('error: ' + e)); page2.on('requestfailed', r => problems.push('petición fallida: ' + r.url()));
await page2.goto(url);
const pu = await page2.evaluate(async () => {
  window.wait = ms => new Promise(r => setTimeout(r, Math.min(ms, 60))); startLevel(2); await new Promise(r => setTimeout(r, 400)); const out = {};
  const idle = async () => { for (let i = 0; i < 200 && busy; i++) await new Promise(r => setTimeout(r, 40)); };
  puCounts = { bomb: 3, ray: 3, shuffle: 3, color: 3 };
  activatePowerup('shuffle'); await idle(); out.shuffle = !busy;
  activatePowerup('bomb'); await applyPowerupAt(4, 3); await idle(); out.bomb = !busy;
  activatePowerup('ray'); await applyPowerupAt(5, 3); await idle(); out.ray = !busy;
  activatePowerup('color'); await applyPowerupAt(5, 5); await idle(); out.color = !busy;
  for (let k = 0; k < 6; k++) { let best = null; for (let r = 0; r < ROWS && !best; r++) for (let c = 0; c < COLS && !best; c++) for (const [dr, dc] of [[0, 1], [1, 0]]) { const r2 = r + dr, c2 = c + dc; if (r2 >= ROWS || c2 >= COLS || !canSwapPair(r, c, r2, c2)) continue; swap(r, c, r2, c2); const m = findMatches(); swap(r, c, r2, c2); if (m.length) { best = { r, c, r2, c2 }; break; } } if (best) { await doSwap(best.r, best.c, best.r2, best.c2); await idle(); } }
  out.intro = !!document.querySelector('.intro'); out.canvas = !!document.getElementById('fx-canvas'); return out; });
Object.entries(pu).forEach(([k, v]) => ok(v, 'poder/efecto ' + k + ' sin atascos'));
await page2.close();

console.log('Partidas con bot (movimientos ilimitados)');
const BOT = async runs => page.evaluate(async ([runs]) => {
  window.wait = ms => new Promise(r => setTimeout(r, Math.min(ms, 20))); const out = [];
  for (let lv = 0; lv < WONDERS.length; lv++) for (let k = 0; k < runs; k++) {
    startLevel(lv); moves = 400; updateUI(); document.getElementById('ov-title').textContent = ''; let used = 0, guard = 0;
    while (guard++ < 4000 && !document.getElementById('overlay').classList.contains('show')) {
      if (busy) { await new Promise(r => setTimeout(r, 20)); continue; }
      let best = null;
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) for (const [dr, dc] of [[0, 1], [1, 0]]) {
        const r2 = r + dr, c2 = c + dc; if (r2 >= ROWS || c2 >= COLS || !canSwapPair(r, c, r2, c2)) continue;
        swap(r, c, r2, c2); const m = findMatches(); swap(r, c, r2, c2); if (!m.length) continue;
        let s = m.length * .1; for (const { r: mr, c: mc } of m) { let a = false; for (let rr = 0; rr < mr; rr++) if (isRock(board[rr][mc])) a = true; if (a) s += 3 + mr * .3; }
        if (!best || s > best.s) best = { r, c, r2, c2, s };
      }
      if (!best) {   // sin combinaciones: una gema especial suelta también es una jugada
        for (let r = 0; r < ROWS && !best; r++) for (let c = 0; c < COLS && !best; c++) if (isGem(board[r][c])) for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) { const r2 = r + dr, c2 = c + dc; if (board[r2]?.[c2] && canSwapPair(r, c, r2, c2)) { best = { r, c, r2, c2 }; break; } }
        if (!best) { await new Promise(r => setTimeout(r, 60)); continue; }
      }
      used++; await doSwap(best.r, best.c, best.r2, best.c2);
    }
    out.push({ lv: lv + 1, win: document.getElementById('ov-title').textContent === 'COMPLETO' && rocksLeft <= 0 && matsGot && Object.keys(matsGot).length > 0, used });
  } return out;
}, [runs]);
const res = await BOT(runs);
res.forEach(r => ok(r.win, `nivel ${r.lv}: ${r.win ? 'completado en ' + r.used + ' jugadas' : 'el bot no lo completó'}`));
await page.waitForTimeout(1500);
ok(await page.evaluate(() => Object.values(getStock()).reduce((a, b) => a + b, 0) > 0), 'los materiales entregados llegan al almacén');
console.log(problems.length ? `\n${problems.length} problema(s)` : '\nTodo correcto');
await browser.close(); srv.close(); process.exit(problems.length ? 1 : 0);
