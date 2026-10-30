'use strict';
// Arnés: ejecuta el código REAL de WONDER IV (engine.js, powerups.js, hud.js...) en un
// contexto de Node con un DOM falso, reloj virtual y semilla fija.
const vm = require('vm');
const fs = require('fs');
const path = require('path');

class El {
  constructor(tag, doc, id = '') {
    this.tagName = tag; this.doc = doc; this.id = id;
    this.children = []; this.parent = null;
    this.style = {}; this.dataset = {};
    this._cls = new Set(); this._html = ''; this.textContent = '';
    const self = this;
    this.classList = {
      add: (...c) => c.forEach(x => self._cls.add(x)),
      remove: (...c) => c.forEach(x => self._cls.delete(x)),
      toggle: (c, f) => { const on = f === undefined ? !self._cls.has(c) : !!f; on ? self._cls.add(c) : self._cls.delete(c); return on; },
      contains: c => self._cls.has(c),
    };
  }
  get className() { return [...this._cls].join(' '); }
  set className(v) { this._cls = new Set(String(v).split(/\s+/).filter(Boolean)); }
  get innerHTML() { return this._html; }
  set innerHTML(v) { this._html = v; if (v === '') { this.children.forEach(c => { c.parent = null; }); this.children = []; } }
  get firstChild() { return this.children[0] || null; }
  get offsetWidth() { return this.id === 'board' ? 420 : 300; }
  get offsetHeight() { return 200; }
  appendChild(c) {
    if (c.tagName === 'frag') { const kids = c.children.slice(); c.children = []; kids.forEach(k => { k.parent = this; this.children.push(k); }); return c; }
    if (c.parent) c.remove(); c.parent = this; this.children.push(c); return c;
  }
  removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); c.parent = null; return c; }
  remove() { if (this.parent) this.parent.removeChild(this); }
  getBoundingClientRect() { return { left: 0, top: 0, width: 50, height: 50 }; }
  addEventListener() {}
  querySelectorAll() { return []; }
  closest() { return null; }
  getContext() {
    const g = { addColorStop() {} };
    return new Proxy({}, { get: (t, k) => (k in t ? t[k] : () => g), set: (t, k, v) => { t[k] = v; return true; } });
  }
}

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createGame(srcDir, opts = {}) {
  const fastSvg = opts.fastSvg !== false;
  const els = new Map();
  const doc = {
    getElementById(id) { if (!els.has(id)) els.set(id, new El('div', doc, id)); return els.get(id); },
    createElement(tag) { return new El(tag, doc); },
    createDocumentFragment() { return new El('frag', doc); },
    querySelectorAll() { return []; },
    body: new El('body', null),
  };
  let timers = [], timerId = 1, now = 0;
  const store = new Map();
  const sandbox = {
    document: doc,
    localStorage: { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)) },
    setTimeout(fn, ms) { const id = timerId++; timers.push({ id, fn, t: now + (ms || 0) }); return id; },
    clearTimeout(id) { timers = timers.filter(x => x.id !== id); },
    requestAnimationFrame() { return 0; },
    console,
    __rng: mulberry32(1),
  };
  sandbox.window = { innerWidth: 1280, innerHeight: 800, addEventListener() {} };
  const ctx = vm.createContext(sandbox);
  const ev = code => vm.runInContext(code, ctx);

  for (const f of ['data', 'storage', 'state', 'screens', 'fx', 'engine', 'powerups', 'hud']) {
    vm.runInContext(fs.readFileSync(path.join(srcDir, 'js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
  }

  ev(`
    Math.random = __rng;
    globalThis.__R = { ended:false, win:null, stars:0, score:0, movesLeft:0, shuffles:0, procs:[], eraRatios:[], shuffleLeftover:[] };
    wait = function(){ return Promise.resolve(); };
    ${fastSvg ? "gemSVG = function(t){ return 'S'+t; }; gemLineSVG = function(){ return 'L'; }; gemAreaSVG = function(){ return 'A'; };" : ''}
    showWin = function(){ __R.ended = true; __R.win = true; __R.stars = calcStars(); __R.score = score; __R.movesLeft = moves; return Promise.resolve(); };
    showLose = function(){ __R.ended = true; __R.win = false; __R.score = score; __R.movesLeft = moves; };
    buildSelectScreen = function(){};
    const _log = log;
    log = function(m, c){ if (String(m).startsWith('Sin movimientos')) { __R.shuffles++; } return _log(m, c); };
    const _shuffle = shuffleBoard;
    shuffleBoard = function(){ _shuffle(); __R.shuffleLeftover.push(findMatches().length); __R.lastShuffleHasMoves = hasMoves(); __R.shuffleMovesLog = (__R.shuffleMovesLog||[]); __R.shuffleMovesLog.push(__R.lastShuffleHasMoves); };
    const _pm = processMatches;
    processMatches = function(m){
      // componentes conexas del mismo tipo para detectar gemas espurias
      const key = new Map(); m.forEach(x => key.set(x.r*COLS+x.c, board[x.r][x.c] && board[x.r][x.c].t));
      const seen = new Set(); let comps = 0;
      for (const [k, t] of key) {
        if (seen.has(k)) continue; comps++;
        const st = [k]; seen.add(k);
        while (st.length) {
          const q = st.pop(); const r = Math.floor(q/COLS), c = q%COLS;
          for (const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nr=r+dr, nc=c+dc; if (nr<0||nr>=ROWS||nc<0||nc>=COLS) continue;
            const nk = nr*COLS+nc; if (!seen.has(nk) && key.get(nk) === t) { seen.add(nk); st.push(nk); }
          }
        }
      }
      __R.procs.push({ sz: m.length, comps });
      return _pm(m);
    };
    const _era = checkEraAdvance;
    checkEraAdvance = function(){
      const before = currentEra, got = objCollected, need = WONDERS[level].eras[currentEra].objCount;
      _era();
      if (currentEra !== before) __R.eraRatios.push(Math.min(1, got/need));
    };
  `);

  const api = {
    ctx, ev, els,
    seed(n) { sandbox.__rng = mulberry32(n); ev('Math.random = __sandboxRng'); },
    flush() {
      let guard = 0;
      while (timers.length && guard++ < 100000) {
        timers.sort((a, b) => a.t - b.t);
        const t = timers.shift(); now = Math.max(now, t.t); t.fn();
      }
    },
  };
  // Math.random con semilla reasignable
  vm.runInContext('globalThis.__sandboxRng = function(){ return __rng(); };', ctx);
  api.seed = n => { sandbox.__rng = mulberry32(n); };
  vm.runInContext('Math.random = __sandboxRng;', ctx);
  return api;
}

module.exports = { createGame, mulberry32 };
