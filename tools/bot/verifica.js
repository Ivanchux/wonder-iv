'use strict';
// Pruebas dirigidas de los fallos del motor. Uso: node tools/bot/verifica.js <carpeta-del-juego>
const {createGame}=require('./harness');
const path=require('path');
const src=path.resolve(process.argv[2]||'.');
function base(G){ // tablero sin ninguna combinación: (r+2c)%7
  G.ev(`for(let r=0;r<7;r++)for(let c=0;c<7;c++) board[r][c]={t:(r+2*c)%7,kind:'normal'};`);
}
(async()=>{
  // 1) dos tríos sueltos del mismo tipo -> ¿gema?
  let G=createGame(src); const {ev,flush}=G;
  let res=[];
  for(let seed=1;seed<=60 && res.length<5;seed++){
    G.seed(seed);
    ev(`__R={ended:false,procs:[],eraRatios:[],shuffleLeftover:[]};startLevel(2)`); flush();
    base(G);
    ev(`for(let c=0;c<3;c++) board[0][c]={t:5,kind:'normal'}; for(let c=4;c<7;c++) board[6][c]={t:5,kind:'normal'}; renderBoard();`);
    const m=ev('findMatches()').length;
    await ev('processMatches(findMatches())'); flush();
    const R=ev('__R.procs'); const gems=ev(`board.flat().filter(t=>t.kind!=='normal').map(t=>t.kind)`);
    if(R.length===1) res.push({matchesIniciales:m, procs:JSON.stringify(R), gemas:gems.join(',')||'ninguna'});
  }
  console.log('1) Dos tríos sueltos (3+3) en una misma resolución:'); console.log(res);

  // 2) tablero con combo preexistente: un intercambio que NO forma nada se acepta igualmente
  G.seed(7);
  ev(`__R={ended:false,procs:[],eraRatios:[],shuffleLeftover:[]};startLevel(2)`); flush();
  base(G);
  ev(`for(let c=0;c<3;c++) board[0][c]={t:5,kind:'normal'}; renderBoard();`);
  const mv0=ev('moves'), sc0=ev('score');
  // intercambio lejano e inofensivo
  ev(`swap(6,0,6,1)`); const makes=ev('findMatches().length'); ev(`swap(6,0,6,1)`);
  await ev('doSwap(6,0,6,1)'); flush();
  console.log('2) Intercambio (6,0)<->(6,1) sobre tablero con un trío ya hecho: movs',mv0,'->',ev('moves'),'| puntos',sc0,'->',ev('score'));

  // 3) barajado: cuántas veces deja combos hechos
  let left=0,tot=0,noMov=0;
  for(let i=0;i<3000;i++){ G.seed(100+i); ev(`startLevel(0)`); flush(); ev(`shuffleBoard()`); tot++; if(ev('findMatches().length')>0) left++; if(!ev('hasMoves()')) noMov++; }
  console.log(`3) revolver (shuffleBoard) en ${tot} tableros nuevos: deja combos hechos en ${left} (${(100*left/tot).toFixed(1)} %), sin movimientos en ${noMov} (${(100*noMov/tot).toFixed(2)} %)`);

  // 4) ¿se revuelve aunque haya una gema jugable?
  G.seed(5); ev(`startLevel(0)`); flush();
  base(G); ev(`board[3][3]={t:0,kind:'gem-line'}; renderBoard();`);
  // el patrón base no tiene jugadas con ficha normal
  const hm=ev('hasMoves()');
  console.log('4) Tablero sin jugadas normales pero con una gema de línea: hasMoves() =',hm,'(el motor lo daría por muerto y revolvería)');
  // 5) la gema no suma avance de maravilla por sí sola
  G.seed(9); ev(`startLevel(0)`); flush(); base(G); ev(`board[3][3]={t:0,kind:'gem-line'}; renderBoard();`);
  const p0=ev('wonderProg'); await ev('activateGemSwap(3,3,3,4,board[3][3],board[3][4])'); flush();
  console.log('5) Explosión de gema: wonderProg',p0,'->',ev('wonderProg'),'| puntos',ev('score'),'| procs en cascada',ev('__R.procs.length'));
})();
