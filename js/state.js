// WONDER IV — Estado global de la partida.

// ════════════════════════════════════════
//  STATE
// ════════════════════════════════════════
const COLS=7, ROWS=7;
let board=[], selected=null;
let score=0, moves=0, combo=1;
let wonderProg=0, level=0;
let busy=false, hintPair=[];
let prevProgSegs=0;
let inputBound=false;
let rocksLeft=0;          // rocas que quedan por romper
let pendingDeliveries=0;  // bloques en camino al solar
let deliveredIdx=0;       // siguiente etapa que se va a colocar en el solar
let matsGot={};           // materiales recogidos en este nivel
let runId=0;              // cambia en cada startLevel: las tareas pendientes de una obra anterior se abandonan
const scoreBonus=1;

// Poderes
const PU_DEFAULTS = { bomb:2, ray:2, shuffle:1, color:1 };
let puCounts = {...PU_DEFAULTS};
let activePu = null; // null | 'bomb' | 'ray' | 'color'
