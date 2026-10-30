// WONDER IV — Datos: fichas, gemas SVG y las 7 maravillas con sus 21 eras.
// Para añadir o equilibrar niveles, edita el array WONDERS.

// ════════════════════════════════════════
//  DATA
// ════════════════════════════════════════
const TILES      = [{glyph:'⌬'},{glyph:'⟁'},{glyph:'◎'},{glyph:'⬡'},{glyph:'⌖'},{glyph:'⟐'},{glyph:'◈'}];
const TILE_NAMES = ['DELTA','LAMBDA','ORBIT','HEX','TARGET','NODE','CORE'];
const TILE_COLORS= ['#ff4444','#ffaa00','#00e5ff','#cc44ff','#39ff14','#aaff00','#ff6600'];
const RUNES      = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ'.split('');

// ── SVG GEMS ──────────────────────────────
// Cada función devuelve el innerHTML SVG para la gema (sin <svg> externo)
function gemSVG(t){
  const svgs=[
    // T0 DELTA — Rojo: triángulo facetado
    `<svg viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg"><defs>
      <linearGradient id="g0a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff8888"/><stop offset="40%" stop-color="#ff4444"/><stop offset="100%" stop-color="#880000"/></linearGradient>
      <linearGradient id="g0b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffaaaa" stop-opacity="0.6"/><stop offset="100%" stop-color="#ff4444" stop-opacity="0"/></linearGradient>
    </defs>
    <polygon points="21,4 38,36 4,36" fill="url(#g0a)" stroke="#ff2222" stroke-width="0.8"/>
    <polygon points="21,4 12,36 4,36" fill="#aa1111" opacity="0.5"/>
    <polygon points="21,4 30,20 38,36 21,36" fill="#ff7777" opacity="0.25"/>
    <polygon points="21,6 28,18 21,14" fill="url(#g0b)" opacity="0.9"/>
    <line x1="21" y1="4" x2="21" y2="36" stroke="#ff6666" stroke-width="0.5" opacity="0.4"/>
    <line x1="5" y1="36" x2="37" y2="36" stroke="#ff8888" stroke-width="1" opacity="0.5"/></svg>`,
    // T1 LAMBDA — Amber: rombo/diamante
    `<svg viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg"><defs>
      <linearGradient id="g1a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffd060"/><stop offset="45%" stop-color="#ffaa00"/><stop offset="100%" stop-color="#885500"/></linearGradient>
      <linearGradient id="g1b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffe88a" stop-opacity="0.7"/><stop offset="100%" stop-color="#ffaa00" stop-opacity="0"/></linearGradient>
    </defs>
    <polygon points="21,3 38,21 21,39 4,21" fill="url(#g1a)" stroke="#cc8800" stroke-width="0.8"/>
    <polygon points="21,3 4,21 21,21" fill="#663300" opacity="0.35"/>
    <polygon points="21,3 38,21 21,21" fill="#ffd060" opacity="0.2"/>
    <polygon points="21,5 30,17 21,14" fill="url(#g1b)" opacity="0.85"/>
    <line x1="21" y1="3" x2="21" y2="39" stroke="#ffcc44" stroke-width="0.5" opacity="0.35"/>
    <line x1="4" y1="21" x2="38" y2="21" stroke="#ffcc44" stroke-width="0.5" opacity="0.35"/></svg>`,
    // T2 ORBIT — Cyan: círculo con anillos
    `<svg viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg"><defs>
      <radialGradient id="g2a" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#aaffff"/><stop offset="45%" stop-color="#00e5ff"/><stop offset="100%" stop-color="#005566"/></radialGradient>
      <linearGradient id="g2b" x1="30%" y1="0%" x2="70%" y2="100%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="100%" stop-color="#00e5ff" stop-opacity="0"/></linearGradient>
    </defs>
    <circle cx="21" cy="21" r="16" fill="url(#g2a)" stroke="#00bbcc" stroke-width="0.8"/>
    <ellipse cx="21" cy="21" rx="19" ry="8" fill="none" stroke="#00e5ff" stroke-width="0.8" opacity="0.5" transform="rotate(-25,21,21)"/>
    <ellipse cx="16" cy="14" rx="5" ry="3" fill="url(#g2b)" opacity="0.7"/>
    <circle cx="21" cy="21" r="3" fill="#aaffff" opacity="0.6"/></svg>`,
    // T3 HEX — Purple: hexágono
    `<svg viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg"><defs>
      <linearGradient id="g3a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ee88ff"/><stop offset="45%" stop-color="#cc44ff"/><stop offset="100%" stop-color="#551188"/></linearGradient>
      <linearGradient id="g3b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffccff" stop-opacity="0.6"/><stop offset="100%" stop-color="#cc44ff" stop-opacity="0"/></linearGradient>
    </defs>
    <polygon points="21,4 36,12.5 36,29.5 21,38 6,29.5 6,12.5" fill="url(#g3a)" stroke="#9922cc" stroke-width="0.8"/>
    <polygon points="6,12.5 21,4 21,21" fill="#ee88ff" opacity="0.18"/>
    <polygon points="36,12.5 21,4 21,21" fill="#220055" opacity="0.3"/>
    <polygon points="6,29.5 21,38 21,21" fill="#220055" opacity="0.35"/>
    <polygon points="10,13 21,5 21,18 14,17" fill="url(#g3b)" opacity="0.8"/>
    <line x1="21" y1="4" x2="21" y2="38" stroke="#dd88ff" stroke-width="0.5" opacity="0.3"/></svg>`,
    // T4 TARGET — Green: estrella de 4 puntas
    `<svg viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg"><defs>
      <radialGradient id="g4a" cx="45%" cy="35%" r="65%"><stop offset="0%" stop-color="#aaffaa"/><stop offset="40%" stop-color="#39ff14"/><stop offset="100%" stop-color="#116600"/></radialGradient>
      <linearGradient id="g4b" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ccffcc" stop-opacity="0.65"/><stop offset="100%" stop-color="#39ff14" stop-opacity="0"/></linearGradient>
    </defs>
    <path d="M21,3 L24,18 L39,21 L24,24 L21,39 L18,24 L3,21 L18,18 Z" fill="url(#g4a)" stroke="#22cc00" stroke-width="0.8"/>
    <path d="M21,4 L23,16 L21,14 L19,16 Z" fill="url(#g4b)" opacity="0.85"/>
    <path d="M3,21 L16,19 L14,21 L16,23 Z" fill="url(#g4b)" opacity="0.45"/>
    <circle cx="21" cy="21" r="4" fill="#99ff66" opacity="0.55"/></svg>`,
    // T5 NODE — Lima: octágono
    `<svg viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg"><defs>
      <linearGradient id="g5a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ddff88"/><stop offset="45%" stop-color="#aaff00"/><stop offset="100%" stop-color="#336600"/></linearGradient>
      <linearGradient id="g5b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#eeffbb" stop-opacity="0.65"/><stop offset="100%" stop-color="#aaff00" stop-opacity="0"/></linearGradient>
    </defs>
    <polygon points="14,4 28,4 38,14 38,28 28,38 14,38 4,28 4,14" fill="url(#g5a)" stroke="#77cc00" stroke-width="0.8"/>
    <polygon points="14,4 28,4 21,21" fill="#ccff88" opacity="0.18"/>
    <polygon points="4,14 4,28 21,21" fill="#224400" opacity="0.3"/>
    <polygon points="28,38 14,38 21,21" fill="#224400" opacity="0.35"/>
    <polygon points="14,5 27,5 21,16 16,15" fill="url(#g5b)" opacity="0.8"/>
    <line x1="21" y1="4" x2="21" y2="38" stroke="#bbff44" stroke-width="0.5" opacity="0.25"/>
    <line x1="4" y1="21" x2="38" y2="21" stroke="#bbff44" stroke-width="0.5" opacity="0.25"/></svg>`,
    // T6 CORE — Naranja: cristal irregular
    `<svg viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg"><defs>
      <linearGradient id="g6a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffcc88"/><stop offset="40%" stop-color="#ff6600"/><stop offset="100%" stop-color="#882200"/></linearGradient>
      <linearGradient id="g6b" x1="0%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stop-color="#ffddaa" stop-opacity="0.7"/><stop offset="100%" stop-color="#ff6600" stop-opacity="0"/></linearGradient>
    </defs>
    <polygon points="21,3 34,10 38,24 28,38 14,38 4,24 8,10" fill="url(#g6a)" stroke="#cc4400" stroke-width="0.8"/>
    <polygon points="21,3 8,10 14,21" fill="#ffddaa" opacity="0.2"/>
    <polygon points="21,3 34,10 28,21" fill="#441100" opacity="0.3"/>
    <polygon points="14,38 4,24 14,21" fill="#441100" opacity="0.35"/>
    <polygon points="28,38 38,24 28,21" fill="#ffcc88" opacity="0.12"/>
    <polyline points="21,3 21,21 14,38" fill="none" stroke="#ff8833" stroke-width="0.5" opacity="0.4"/>
    <polygon points="13,10 21,4 21,15 16,14" fill="url(#g6b)" opacity="0.9"/></svg>`,
  ];
  return svgs[t] || svgs[0];
}

function gemLineSVG(){
  return `<svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg"><defs>
    <radialGradient id="gl1" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#ffffff"/><stop offset="30%" stop-color="#aaffff"/><stop offset="70%" stop-color="#00e5ff"/><stop offset="100%" stop-color="#003344"/></radialGradient>
    <radialGradient id="gl2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="100%" stop-color="#00e5ff" stop-opacity="0"/></radialGradient>
  </defs>
  <circle cx="26" cy="26" r="22" fill="url(#gl1)" stroke="#00ddee" stroke-width="1.2"/>
  <circle cx="26" cy="26" r="14" fill="none" stroke="#aaffff" stroke-width="0.8" opacity="0.5"/>
  <line x1="4" y1="26" x2="48" y2="26" stroke="#ffffff" stroke-width="1.5" opacity="0.35"/>
  <line x1="26" y1="4" x2="26" y2="48" stroke="#ffffff" stroke-width="1.5" opacity="0.35"/>
  <circle cx="26" cy="26" r="7" fill="url(#gl2)"/>
  <circle cx="26" cy="26" r="3" fill="#ffffff" opacity="0.85"/>
  <line x1="26" y1="4" x2="26" y2="10" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
  <line x1="26" y1="42" x2="26" y2="48" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
  <line x1="4" y1="26" x2="10" y2="26" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
  <line x1="42" y1="26" x2="48" y2="26" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/></svg>`;
}

function gemAreaSVG(){
  return `<svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg"><defs>
    <radialGradient id="ga1" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#ffffff"/><stop offset="20%" stop-color="#fff0aa"/><stop offset="60%" stop-color="#ffaa00"/><stop offset="100%" stop-color="#553300"/></radialGradient>
    <radialGradient id="ga2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="100%" stop-color="#ffaa00" stop-opacity="0"/></radialGradient>
  </defs>
  <polygon points="26,4 29.5,17 38,9.5 30.5,19.5 44,22 30.5,25.5 38,35.5 28.5,28.5 26,42 23.5,28.5 14,35.5 21.5,25.5 8,22 21.5,19.5 14,9.5 22.5,17" fill="url(#ga1)" stroke="#cc8800" stroke-width="0.8"/>
  <circle cx="26" cy="26" r="10" fill="none" stroke="#ffe088" stroke-width="0.8" opacity="0.6"/>
  <circle cx="26" cy="26" r="6" fill="url(#ga2)"/>
  <circle cx="26" cy="26" r="2.5" fill="#ffffff" opacity="0.9"/>
  <line x1="26" y1="4" x2="26" y2="9" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>
  <line x1="26" y1="43" x2="26" y2="48" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>
  <line x1="4" y1="26" x2="9" y2="26" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>
  <line x1="43" y1="26" x2="48" y2="26" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/></svg>`;
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
