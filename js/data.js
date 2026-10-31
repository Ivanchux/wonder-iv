// WONDER IV — Datos: fichas, gemas SVG y las 7 maravillas con sus 21 eras.
// Para añadir o equilibrar niveles, edita el array WONDERS.

// ════════════════════════════════════════
//  DATA
// ════════════════════════════════════════
const TILES      = [{glyph:'☉'},{glyph:'☥'},{glyph:'◍'},{glyph:'❀'},{glyph:'❦'},{glyph:'◉'},{glyph:'⚱'}];
const TILE_NAMES = ['SOL','ANJ','ESCARABAJO','LOTO','LAUREL','OJO','ÁNFORA'];
const TILE_COLORS= ['#e8502a','#e8b030','#22b8a8','#e05a98','#4aa84a','#3a64d8','#8a5ad0'];
const RUNES      = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ'.split('');

// ── PIEZAS (ilustraciones en img/piezas) ──────────────────────────────
// Siete piedras talladas, cada una con color y símbolo distintos, más dos especiales (línea y área).
// Cada función devuelve un <svg> con la imagen dentro, para que los estilos de las celdas sigan valiendo.
const GEM_FILES=['sol','anj','escarabajo','loto','laurel','ojo','anfora'];
function artSVG(url){ return `<svg viewBox="0 0 100 100" aria-hidden="true"><image href="${url}" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid meet"/></svg>`; }
function gemSVG(t){ return artSVG(`img/piezas/gema_${GEM_FILES[t]}.png`); }
function gemLineSVG(){ return artSVG('img/piezas/gema_linea.png'); }
function gemAreaSVG(){ return artSVG('img/piezas/gema_area.png'); }

// ── MATERIALES ──────────────────────────────
// Cada maravilla se construye con un material. Al romper una roca se recoge y los operarios lo llevan al solar.
const MATERIALS = {
  piedra:   { name:'PIEDRA',   c1:'#e2d2ac', c2:'#b09a6a', c3:'#6a5a38' },
  ladrillo: { name:'LADRILLO', c1:'#e6a276', c2:'#b8643a', c3:'#6a2e14' },
  marmol:   { name:'MÁRMOL',   c1:'#fffaf0', c2:'#d8d4c8', c3:'#8a8678' },
  madera:   { name:'MADERA',   c1:'#d8a468', c2:'#9a6a34', c3:'#503010' },
  bronce:   { name:'BRONCE',   c1:'#ffd28a', c2:'#cf8a3a', c3:'#7a4410' },
};

// ── EDIFICIOS DEL ASENTAMIENTO ──────────────────────────────
// Cada uno se mejora con el material que más se parece a su oficio y da una ventaja al empezar cada obra.
// cost = materiales para pasar al nivel 1 y al nivel 2. pu = poder que regala por nivel (null = movimientos).
const BUILDINGS = [
  { id:'casa',      name:'CASA DE OBREROS',    mat:'madera',   pu:null,      cost:[5,12], desc:'Más descanso, más movimientos',            per:'+2 movimientos al empezar cada obra' },
  { id:'pozo',      name:'POZO',               mat:'piedra',   pu:'shuffle', cost:[5,12], desc:'Agua para reorganizar el tajo',          per:'+1 Revolver al empezar cada obra' },
  { id:'horno',     name:'HORNO DE LADRILLOS', mat:'ladrillo', pu:'bomb',    cost:[5,12], desc:'Ladrillos y pólvora de cantero',         per:'+1 Bomba al empezar cada obra' },
  { id:'taller',    name:'TALLER DE MÁRMOL',   mat:'marmol',   pu:'ray',     cost:[5,12], desc:'Cinceles que abren una fila entera',     per:'+1 Rayo al empezar cada obra' },
  { id:'fundicion', name:'FUNDICIÓN',          mat:'bronce',   pu:'color',   cost:[5,12], desc:'Bronce fundido para limpiar una piedra', per:'+1 Aurora al empezar cada obra' },
];
const BUILD_MAX = 2;

// ── LAS SIETE MARAVILLAS ──────────────────────────────
// stages = bloques que hay que colocar (la suma de la resistencia de todas las rocas).
// rocks = resistencia de cada roca (1 = se rompe con una combinación al lado, 2 = aguanta una más y da dos bloques).
// Para añadir o equilibrar niveles, edita este array y las escenas de js/maravillas.js.
const WONDERS = [
  { id:'piramide', name:'GRAN PIRÁMIDE', place:'Guiza, Egipto', year:'c. 2560 A.C.', diff:'easy',   mat:'piedra',   movs:40, rocks:[1,1,1,1,1,1,1,1] },
  { id:'jardines', name:'JARDINES COLGANTES', place:'Babilonia', year:'c. 600 A.C.',   diff:'easy',   mat:'ladrillo', movs:40, rocks:[1,1,1,1,1,1,1,1,1] },
  { id:'zeus',     name:'ESTATUA DE ZEUS', place:'Olimpia, Grecia', year:'c. 435 A.C.', diff:'medium', mat:'marmol',   movs:44, rocks:[2,2,1,1,1,1,1,1] },
  { id:'artemisa', name:'TEMPLO DE ARTEMISA', place:'Éfeso', year:'c. 550 A.C.',      diff:'medium', mat:'madera',   movs:52, rocks:[2,2,2,1,1,1,1,1] },
  { id:'mausoleo', name:'MAUSOLEO DE HALICARNASO', place:'Halicarnaso', year:'c. 350 A.C.', diff:'hard', mat:'marmol', movs:44, rocks:[2,2,2,2,1,1,1,1] },
  { id:'coloso',   name:'COLOSO DE RODAS', place:'Rodas', year:'c. 280 A.C.',          diff:'hard',   mat:'bronce',   movs:50, rocks:[2,2,2,2,2,1,1,1] },
  { id:'faro',     name:'FARO DE ALEJANDRÍA', place:'Alejandría, Egipto', year:'c. 280 A.C.', diff:'expert', mat:'piedra', movs:60, rocks:[2,2,2,2,2,2,1,1] },
];
WONDERS.forEach(w=>{ w.stages=w.rocks.reduce((a,b)=>a+b,0); w.desc=w.place+' — '+w.year; });
