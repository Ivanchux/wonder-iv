// WONDER IV — Estado global de la partida.

// ════════════════════════════════════════
//  STATE
// ════════════════════════════════════════
const COLS=7, ROWS=7;
let board=[], selected=null;
let score=0, moves=0, combo=1;
let wonderProg=0, level=0;
let busy=false, hintPair=[];
let asciiLines=[], asciiRevealed=0;
let prevProgSegs=0;
let inputBound=false;

// Eras
let currentEra=0;
let eraThresholds=[]; // [t1, t2] etapas en que cambia era
let objCollected=0; // fichas del tipo objetivo recogidas esta era
let scoreBonus=1;

// Power-ups
const PU_DEFAULTS = { bomb:2, ray:2, shuffle:1, color:1 };
let puCounts = {...PU_DEFAULTS};
let activePu = null; // null | 'bomb' | 'ray' | 'color'
