// WONDER IV — Datos: fichas, gemas SVG y las 7 maravillas con sus 21 eras.
// Para añadir o equilibrar niveles, edita el array WONDERS.

// ════════════════════════════════════════
//  DATA
// ════════════════════════════════════════
const TILES      = [{glyph:'☉'},{glyph:'☥'},{glyph:'◍'},{glyph:'❀'},{glyph:'❦'},{glyph:'◉'},{glyph:'⚱'}];
const TILE_NAMES = ['SOL','ANJ','ESCARABAJO','LOTO','LAUREL','OJO','ÁNFORA'];
const TILE_COLORS= ['#e8502a','#e8b030','#22b8a8','#e05a98','#4aa84a','#3a64d8','#8a5ad0'];
const RUNES      = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ'.split('');

// ── PIEZAS (SVG propio) ──────────────────────────────
// Siete piedras talladas. Cada una tiene color, silueta y símbolo distintos, para que se distingan sin depender solo del color.
// Cada función devuelve un <svg> completo (viewBox 0 0 52 52).
const GEM_SHAPES=[
  'M26 3.5A22.5 22.5 0 1 1 25.99 3.5Z',                                              // 0 disco
  'M14 4H38Q48 4 48 14V38Q48 48 38 48H14Q4 48 4 38V14Q4 4 14 4Z',                    // 1 cuadrado redondeado
  'M26 2.5C41 2.5 47 14 47 26S41 49.5 26 49.5 5 38 5 26 11 2.5 26 2.5Z',             // 2 óvalo vertical
  'M15 5H37L49 26 37 47H15L3 26Z',                                                   // 3 hexágono
  'M26 2L48 26 26 50 4 26Z',                                                         // 4 rombo
  'M17 3H35L49 17V35L35 49H17L3 35V17Z',                                             // 5 octógono
  'M8 49V24Q8 3 26 3T44 24V49Z',                                                     // 6 arco
];
const GEM_COLORS=[ // [claro, medio, oscuro]
  ['#ff9a6a','#e8502a','#8a1e0a'],  // sol
  ['#fff0a0','#e8b030','#8a5a0a'],  // anj
  ['#8af0e0','#22b8a8','#0a5a56'],  // escarabajo
  ['#ffb0d0','#e05a98','#7a1a4a'],  // loto
  ['#b8f0a0','#4aa84a','#1a5a1a'],  // laurel
  ['#9ab8ff','#3a64d8','#142a78'],  // ojo
  ['#d0b0ff','#8a5ad0','#3e1a80'],  // ánfora
];
const GEM_SYMBOLS=[
  // 0 sol
  `<circle cx="26" cy="26" r="6.5"/><path d="M26 11.5V15.5M26 36.5V40.5M11.5 26H15.5M36.5 26H40.5M15.8 15.8L18.6 18.6M33.4 33.4L36.2 36.2M15.8 36.2L18.6 33.4M33.4 18.6L36.2 15.8" fill="none"/>`,
  // 1 anj
  `<ellipse cx="26" cy="17.5" rx="6" ry="7.5" fill="none"/><path d="M26 25V41M17 28.5H35" fill="none"/>`,
  // 2 escarabajo
  `<ellipse cx="26" cy="29" rx="8" ry="10" fill="none"/><path d="M26 19V39" fill="none"/><circle cx="26" cy="15.5" r="3.4"/><path d="M18 24L11 20M18 30L10 30M18.5 36L11.5 40M34 24L41 20M34 30L42 30M33.5 36L40.5 40" fill="none"/>`,
  // 3 loto
  `<path d="M26 12Q32.5 25 26 38Q19.5 25 26 12Z M15 21Q25 25 26 38Q12 35 15 21Z M37 21Q27 25 26 38Q40 35 37 21Z" fill="none"/><path d="M17 41.5H35" fill="none"/>`,
  // 4 laurel
  `<path d="M26 11Q39 26 26 41Q13 26 26 11Z" fill="none"/><path d="M26 14V41M26 22L33 17M26 29L34 23M26 22L19 17M26 29L18 23" fill="none"/>`,
  // 5 ojo
  `<path d="M10 26Q26 13 42 26Q26 39 10 26Z" fill="none"/><circle cx="26" cy="26" r="5.2"/><path d="M26 35V41Q22 44.5 17.5 41.5M33 31.5L39 37.5" fill="none"/>`,
  // 6 ánfora
  `<path d="M20 11H32L30.5 16Q40 21 38 31Q36 41 26 43Q16 41 14 31Q12 21 21.5 16Z" fill="none"/><path d="M15.5 28H36.5M16.5 34H35.5" fill="none"/>`,
];
function gemSVG(t){
  t=((t%7)+7)%7;
  const [c1,c2,c3]=GEM_COLORS[t], d=GEM_SHAPES[t], id='gm'+t;
  return `<svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="0.45" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient>
    <radialGradient id="${id}h" cx="0.3" cy="0.22" r="0.55"><stop offset="0" stop-color="#fff" stop-opacity="0.75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <path d="${d}" fill="${c3}" transform="translate(0 2.2)" opacity="0.55"/>
  <path d="${d}" fill="url(#${id}b)" stroke="#2a1606" stroke-width="2"/>
  <path d="${d}" fill="none" stroke="#fff6d8" stroke-width="1.1" opacity="0.55" transform="translate(26 26) scale(0.88) translate(-26 -26)"/>
  <path d="${d}" fill="url(#${id}h)"/>
  <g stroke="#3a1c04" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="#3a1c04" opacity="0.5" transform="translate(0.9 1.1)">${GEM_SYMBOLS[t]}</g>
  <g stroke="#fff2c0" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" fill="#fff2c0">${GEM_SYMBOLS[t]}</g>
  </svg>`;
}

// Gema de línea: sello alado turquesa y oro. Limpia su fila y su columna.
function gemLineSVG(){
  return `<svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
    <radialGradient id="gl1" cx="0.4" cy="0.32" r="0.7"><stop offset="0" stop-color="#e8fffa"/><stop offset="0.4" stop-color="#4fe0cf"/><stop offset="1" stop-color="#0a6a64"/></radialGradient></defs>
  <path d="M3 26Q10 14 20 18L20 34Q10 38 3 26Z M49 26Q42 14 32 18L32 34Q42 38 49 26Z" fill="#f2d27a" stroke="#6a4408" stroke-width="1.6"/>
  <path d="M7 26Q12 20 18 22M7 27Q12 30 18 30M45 26Q40 20 34 22M45 27Q40 30 34 30" fill="none" stroke="#fff4c8" stroke-width="1" opacity="0.8"/>
  <circle cx="26" cy="26" r="16" fill="url(#gl1)" stroke="#2a1606" stroke-width="2"/>
  <circle cx="26" cy="26" r="11" fill="none" stroke="#fff2c0" stroke-width="1.2" opacity="0.7"/>
  <path d="M26 6V46M6 26H46" stroke="#fff2c0" stroke-width="2.4" stroke-linecap="round" opacity="0.9"/>
  <circle cx="26" cy="26" r="4.2" fill="#fff6d0" stroke="#8a5a0a" stroke-width="1.2"/></svg>`;
}

// Gema de área: sol radiante dorado. Limpia un cuadrado de 3 × 3.
function gemAreaSVG(){
  return `<svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
    <radialGradient id="ga1" cx="0.4" cy="0.32" r="0.7"><stop offset="0" stop-color="#fffbe0"/><stop offset="0.4" stop-color="#ffc83a"/><stop offset="1" stop-color="#b06a08"/></radialGradient></defs>
  <polygon points="26,2 30.5,15.5 41,7 36.5,20 50,20.5 38.5,28.5 46,40 33,36 31.5,49.5 26,38.5 20.5,49.5 19,36 6,40 13.5,28.5 2,20.5 15.5,20 11,7 21.5,15.5" fill="url(#ga1)" stroke="#5a3606" stroke-width="1.8" stroke-linejoin="round"/>
  <circle cx="26" cy="26" r="9" fill="#fff4c0" stroke="#8a5a0a" stroke-width="1.4"/>
  <circle cx="26" cy="26" r="4" fill="#e8502a" stroke="#6a2208" stroke-width="1"/></svg>`;
}

// ── MATERIALES ──────────────────────────────
// Cada maravilla se construye con un material. Al romper una roca se recoge y los operarios lo llevan al solar.
const MATERIALS = {
  piedra:   { name:'PIEDRA',   c1:'#e2d2ac', c2:'#b09a6a', c3:'#6a5a38' },
  ladrillo: { name:'LADRILLO', c1:'#e6a276', c2:'#b8643a', c3:'#6a2e14' },
  marmol:   { name:'MÁRMOL',   c1:'#fffaf0', c2:'#d8d4c8', c3:'#8a8678' },
  madera:   { name:'MADERA',   c1:'#d8a468', c2:'#9a6a34', c3:'#503010' },
  bronce:   { name:'BRONCE',   c1:'#ffd28a', c2:'#cf8a3a', c3:'#7a4410' },
};

// ── LAS SIETE MARAVILLAS ──────────────────────────────
// stages = bloques que hay que colocar (la suma de la resistencia de todas las rocas).
// rocks = resistencia de cada roca (1 = se rompe con una combinación al lado, 2 = aguanta una más y da dos bloques).
// Para añadir o equilibrar niveles, edita este array y las escenas de js/maravillas.js.
const WONDERS = [
  { id:'piramide', name:'GRAN PIRÁMIDE', place:'Guiza, Egipto', year:'c. 2560 A.C.', diff:'easy',   mat:'piedra',   movs:34, rocks:[1,1,1,1,1,1,1,1] },
  { id:'jardines', name:'JARDINES COLGANTES', place:'Babilonia', year:'c. 600 A.C.',   diff:'easy',   mat:'ladrillo', movs:34, rocks:[1,1,1,1,1,1,1,1,1] },
  { id:'zeus',     name:'ESTATUA DE ZEUS', place:'Olimpia, Grecia', year:'c. 435 A.C.', diff:'medium', mat:'marmol',   movs:32, rocks:[2,2,1,1,1,1,1,1] },
  { id:'artemisa', name:'TEMPLO DE ARTEMISA', place:'Éfeso', year:'c. 550 A.C.',      diff:'medium', mat:'madera',   movs:32, rocks:[2,2,2,1,1,1,1,1] },
  { id:'mausoleo', name:'MAUSOLEO DE HALICARNASO', place:'Halicarnaso', year:'c. 350 A.C.', diff:'hard', mat:'marmol', movs:30, rocks:[2,2,2,2,1,1,1,1] },
  { id:'coloso',   name:'COLOSO DE RODAS', place:'Rodas', year:'c. 280 A.C.',          diff:'hard',   mat:'bronce',   movs:30, rocks:[2,2,2,2,2,1,1,1] },
  { id:'faro',     name:'FARO DE ALEJANDRÍA', place:'Alejandría, Egipto', year:'c. 280 A.C.', diff:'expert', mat:'piedra', movs:30, rocks:[2,2,2,2,2,2,1,1] },
];
WONDERS.forEach(w=>{ w.stages=w.rocks.reduce((a,b)=>a+b,0); w.desc=w.place+' — '+w.year; });
