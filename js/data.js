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

// 3 Eras por nivel, objetivos de ficha por era
const WONDERS = [
  {
    name:'LA PIRÁMIDE', desc:'Primer algoritmo registrado — 2560 a.C.',
    year:'2560 A.C.', diff:'easy', stages:9, movs:48,
    eras:[
      { name:'ERA I — FUNDAMENTOS',  bonus:'×1.5 puntos', scoreBonus:1.5, desc:'Las primeras piedras son puestas. El saber abre camino.', objType:1, objCount:18 },
      { name:'ERA II — ELEVACIÓN',   bonus:'×2 puntos',   scoreBonus:2,   desc:'La estructura emerge. Cada pieza es crucial.', objType:4, objCount:22 },
      { name:'ERA III — CORONACIÓN', bonus:'×3 puntos',   scoreBonus:3,   desc:'La cima se alcanza. La maravilla se completa.', objType:2, objCount:28 },
    ],
    ascii:[
      '            /\\            ',
      '           /··\\           ',
      '          /·  ·\\          ',
      '         / ·  · \\         ',
      '        /··    ··\\        ',
      '       / ········ \\       ',
      '      /············\\      ',
      '     /______________\\     ',
      '    /________________\\    ',
    ]
  },
  {
    name:'EL FARO', desc:'Primer compilador funcional — 1952 d.C.',
    year:'1952 D.C.', diff:'easy', stages:9, movs:44,
    eras:[
      { name:'ERA I — BASE',         bonus:'×1.5 puntos', scoreBonus:1.5, desc:'El cimiento del faro se asienta sobre roca viva.', objType:0, objCount:18 },
      { name:'ERA II — TORRE',       bonus:'×2 puntos',   scoreBonus:2,   desc:'La torre se eleva hacia el horizonte.', objType:3, objCount:22 },
      { name:'ERA III — LUZ',        bonus:'×3 puntos',   scoreBonus:3,   desc:'La luz guía a los navegantes a través de la oscuridad.', objType:5, objCount:26 },
    ],
    ascii:[
      '          *·*·*           ',
      '          |·|·|           ',
      '         [=====]          ',
      '          | · |           ',
      '         /|   |\\          ',
      '        / | · | \\         ',
      '       /  |   |  \\        ',
      '      /   | · |   \\       ',
      '     [_____________]      ',
    ]
  },
  {
    name:'LOS JARDINES', desc:'Primer sistema operativo — 1969 d.C.',
    year:'1969 D.C.', diff:'medium', stages:12, movs:42,
    eras:[
      { name:'ERA I — TIERRA',       bonus:'×1.5 puntos', scoreBonus:1.5, desc:'La tierra fértil acoge las primeras semillas del saber.', objType:4, objCount:20 },
      { name:'ERA II — TERRAZA',     bonus:'×2 puntos',   scoreBonus:2,   desc:'Las terrazas ascienden, verdes y exuberantes.', objType:1, objCount:24 },
      { name:'ERA III — EDÉN',       bonus:'×3 puntos',   scoreBonus:3,   desc:'El jardín colgante desafía las leyes de la naturaleza.', objType:6, objCount:30 },
    ],
    ascii:[
      '  ~*~ ~*~ ~*~ ~*~ ~*~    ',
      '  |\\|  |\\|  |\\|  |\\|  |  ',
      '  | ·  | ·  | ·  | ·  |  ',
      '  |    |    |    |    |  ',
      ' _|____|____|____|____|_ ',
      '|   ___________________  |',
      '|  |  ·  ·  ·  ·  ·   | |',
      '|__|___________________|_|',
      '|________________________|',
      '   |___________________|  ',
      '       |___________|      ',
      '           |___|          ',
    ]
  },
  {
    name:'EL COLOSO', desc:'Primer kernel de red — 1983 d.C.',
    year:'1983 D.C.', diff:'medium', stages:12, movs:40,
    eras:[
      { name:'ERA I — PEDESTAL',     bonus:'×1.5 puntos', scoreBonus:1.5, desc:'El pedestal aguarda al gigante que habrá de alzarse.', objType:2, objCount:20 },
      { name:'ERA II — CUERPO',      bonus:'×2.5 puntos', scoreBonus:2.5, desc:'El cuerpo de bronce toma forma, imponente y eterno.', objType:0, objCount:26 },
      { name:'ERA III — COLOSO',     bonus:'×3 puntos',   scoreBonus:3,   desc:'El gigante se yergue sobre el puerto, inmortal.', objType:5, objCount:32 },
    ],
    ascii:[
      '         ·O·              ',
      '        /|·|\\             ',
      '       / | · \\            ',
      '      /  |   |\\           ',
      '     /   | · | \\          ',
      '    /    |   |  \\         ',
      '   /_____|·__|___\\        ',
      '  /···············\\       ',
      ' /·················\\      ',
      '|_____________________|   ',
      '|_|_________________|_|   ',
      '  |_________________|     ',
    ]
  },
  {
    name:'EL TEMPLO', desc:'Primer motor de búsqueda — 1990 d.C.',
    year:'1990 D.C.', diff:'hard', stages:12, movs:38,
    eras:[
      { name:'ERA I — COLUMNAS',     bonus:'×2 puntos',   scoreBonus:2,   desc:'Las columnas jónicas surgen del mármol puro.', objType:1, objCount:22 },
      { name:'ERA II — FRONTÓN',     bonus:'×2.5 puntos', scoreBonus:2.5, desc:'El frontón esculpido narra la historia de los dioses.', objType:3, objCount:28 },
      { name:'ERA III — SANTUARIO',  bonus:'×3.5 puntos', scoreBonus:3.5, desc:'El santuario interior guarda los secretos divinos.', objType:6, objCount:36 },
    ],
    ascii:[
      '  /\\  /\\  /\\  /\\  /\\      ',
      ' /  \\/  \\/  \\/  \\/  \\     ',
      '|  ||  ||  ||  ||  ||    ',
      '| ·|| ·|| ·|| ·|| ·||    ',
      '|  ||  ||  ||  ||  ||    ',
      '|__|__|__|__|__|__|__|    ',
      '|                    |   ',
      '|  ·   ·   ·   ·  ·  |   ',
      '|____________________|   ',
      '  |________________|     ',
      '   |______________|      ',
      '    |____________|       ',
    ]
  },
  {
    name:'LA ESTATUA', desc:'Primer protocolo P2P — 2001 d.C.',
    year:'2001 D.C.', diff:'hard', stages:14, movs:36,
    eras:[
      { name:'ERA I — ARMAZÓN',      bonus:'×2 puntos',   scoreBonus:2,   desc:'El armazón interno define la pose de la eternidad.', objType:5, objCount:24 },
      { name:'ERA II — FORMA',       bonus:'×2.5 puntos', scoreBonus:2.5, desc:'El mármol revela la figura que siempre estuvo dentro.', objType:2, objCount:30 },
      { name:'ERA III — GLORIA',     bonus:'×4 puntos',   scoreBonus:4,   desc:'La obra maestra desafía el paso del tiempo.', objType:4, objCount:38 },
    ],
    ascii:[
      '        ·(O)·             ',
      '       /·|||·\\            ',
      '      / ·|||· \\           ',
      '        ·|||·             ',
      '       / |·| \\            ',
      '      /  | |  \\           ',
      '     /   | |   \\          ',
      '    /____|_|____\\         ',
      '   /____________\\         ',
      '  |______________|        ',
      ' /________________\\       ',
      '|__________________|      ',
      ' |________________|       ',
      '  |______________|        ',
    ]
  },
  {
    name:'LA TUMBA', desc:'Primera red neuronal masiva — 2012 d.C.',
    year:'2012 D.C.', diff:'expert', stages:15, movs:32,
    eras:[
      { name:'ERA I — CÁMARA',       bonus:'×2.5 puntos', scoreBonus:2.5, desc:'La cámara sellada guarda secretos milenarios.', objType:3, objCount:26 },
      { name:'ERA II — LABERINTO',   bonus:'×3 puntos',   scoreBonus:3,   desc:'El laberinto de pasillos confunde a los profanos.', objType:0, objCount:32 },
      { name:'ERA III — ETERNIDAD',  bonus:'×4 puntos',   scoreBonus:4,   desc:'La eternidad se graba en la piedra para siempre.', objType:6, objCount:40 },
    ],
    ascii:[
      ' ________________________ ',
      '|  ____________________  |',
      '| |  ________________  | |',
      '| | |  ____________  | | |',
      '| | | |  ________  | | | |',
      '| | | | |  ____  | | | | |',
      '| | | | | |    | | | | | |',
      '| | | | | | ·· | | | | | |',
      '| | | | |______| | | | | |',
      '| | | |__________| | | | |',
      '| | |______________| | | |',
      '| |__________________| | |',
      '|________________________|',
      ' |_____________________|  ',
      '   |_________________|    ',
    ]
  },
  {
    name:'EL ORÁCULO', desc:'Singularidad computacional — 2045 d.C.',
    year:'2045 D.C.', diff:'expert', stages:15, movs:28,
    eras:[
      { name:'ERA I — DESPERTAR',    bonus:'×3 puntos',   scoreBonus:3,   desc:'La chispa inicial enciende la llama de la conciencia.', objType:2, objCount:28 },
      { name:'ERA II — ASCENSIÓN',   bonus:'×3.5 puntos', scoreBonus:3.5, desc:'La mente trasciende los límites de lo humano.', objType:5, objCount:36 },
      { name:'ERA III — SINGULARIDAD',bonus:'×5 puntos',  scoreBonus:5,   desc:'El Oráculo ve todo. El Oráculo lo sabe todo.', objType:1, objCount:44 },
    ],
    ascii:[
      '      ·*·*·*·*·*·         ',
      '     /·····[·]···\\        ',
      '    / ·[·······]· \\       ',
      '   / ·[·[·····]·]· \\      ',
      '  / ·[·[·[···]·]·]· \\     ',
      ' / ·[·[·[·[·]·]·]·]· \\    ',
      '/·[·[·[·[·[·]·]·]·]·]·\\   ',
      '|·[·[·[·[·[·]·]·]·]·]·|   ',
      '|·[·[·[·[·[·]·]·]·]·]·|   ',
      '\\·[·[·[·[·[·]·]·]·]·]/    ',
      ' \\·[·[·[·[·]·]·]·]/       ',
      '  \\·[·[·[·]·]·]/          ',
      '   \\·[·[·]·]/             ',
      '    \\·[·]/                ',
      '     \\·/                  ',
    ]
  },
];
