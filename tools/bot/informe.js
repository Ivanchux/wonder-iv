'use strict';
// Convierte resultados.json en tablas. Uso: node tools/bot/informe.js resultados.json
const path=require("path");
const R=require(path.resolve(process.argv[2]||"resultados.json"));
const N=["La Pirámide","El Faro","Los Jardines","El Coloso","El Templo","La Estatua","La Tumba","El Oráculo"];
const WM=[[9,48],[9,44],[12,42],[12,40],[12,38],[14,36],[15,32],[15,28]].map((x,i)=>x);
const STG=[9,9,12,12,12,14,15,15], MOV=[48,44,42,40,38,36,32,28];
const f=(x,d=1)=>x.toFixed(d);
const get=(pol,w,chk)=>R.find(r=>r.task.policy===pol&&r.task.wonder===w&&!!r.task.check===!!chk).summary;
let out="";
out+="### Tabla por maravilla (2000 partidas por celda)\n\n| # | Maravilla | Etapas / movs | Aleatorio: victorias, ★ medias, movs sobrantes, puntos | Voraz (avance): victorias, ★, sobrantes, puntos | Peor jugador: victorias, ★, sobrantes |\n|---|---|---|---|---|---|\n";
for(let w=0;w<8;w++){const a=get('aleatorio',w),p=get('progreso',w),q=get('peor',w);
 out+=`| ${w+1} | ${N[w]} | ${STG[w]} / ${MOV[w]} | ${f(a.winPct)} %, ${f(a.starsAvg,2)}, ${f(a.movesLeftWin)}, ${Math.round(a.scoreAvg)} | ${f(p.winPct)} %, ${f(p.starsAvg,2)}, ${f(p.movesLeftWin)}, ${Math.round(p.scoreAvg)} | ${f(q.winPct)} %, ${f(q.starsAvg,2)}, ${f(q.movesLeftWin)} |\n`;}
out+="\n### Puntos (voraz de puntos) y movimientos usados\n\n";
for(let w=0;w<8;w++){const s=get('puntos',w),p=get('progreso',w);out+=`${w+1} ${N[w]}: puntos ${Math.round(s.scoreAvg)} · 3★ ${f(s.stars3Pct)} % · movs usados (avance) ${f(p.stepsAvg)} de ${MOV[w]}\n`;}
out+="\n### Defectos (política avance, 2000 partidas)\n";
for(let w=0;w<8;w++){const s=get('progreso',w);
 out+=`${w+1}: bloqueos ${s.deadlocks}; sin mov. al inicio ${s.initialNoMoves}; revueltos ${s.shuffleEvents} (dejan combos ${s.shuffleLeftoverMatches} = ${f(100*s.shuffleLeftoverMatches/Math.max(1,s.shuffleEvents),0)} %; sin mov. ${s.shuffleNoMoves}); gemas creadas ${s.gemProcs} de ${s.procsTotal} resoluciones, espurias ${s.spurious} (${f(100*s.spurious/Math.max(1,s.gemProcs),0)} % de las gemas); obj. incumplido en victoria ${f(s.objUnmetWin,0)} % (ratio medio ${f(s.objMeanRatio,2)}); avance/mov normal ${f(s.normMoveGain,2)}\n`;}
out+="\n### Gemas: avance por movimiento (política puntos)\n";
for(let w=0;w<8;w++){const s=get('puntos',w);out+=`${w+1}: movs con gema ${s.gemMovesN}, avance medio ${f(s.gemMoveGain,2)} vs normal ${f(s.normMoveGain,2)}\n`;}
out+="\n### Invariantes (partidas con >=1 fallo / 200)\n";
for(const pol of ['progreso','caos']) for(let w=0;w<8;w++){const s=get(pol,w,true);
 out+=`${pol} ${w+1}: huérfanos ${s.orphanGames}/${s.games}; DOM≠lógica ${s.domBadGames}/${s.games}; combos sin resolver ${s.unresolvedGames}/${s.games}; tras poder sin mov. ${s.deadAfterPower}/${s.powerUses} usos (sin gema ${s.deadNoGemAfterPower}); nulos ${s.nullTiles}\n`;}
console.log(out);
