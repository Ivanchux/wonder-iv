// WONDER IV — Interfaz: puntuación flotante, marcadores, pantallas finales y registro.

// ════════════════════════════════════════
//  SCORE POPUP
// ════════════════════════════════════════
function spawnScorePopup(r, c, pts, color){
  const boardEl=document.getElementById('board');
  const m=boardMetrics();
  const div=document.createElement('div');
  div.className='score-popup';
  div.textContent='+'+pts;
  div.style.cssText=`left:${m.left(c)}px;top:${m.top(r)-10}px;font-size:${pts>500?'16px':'12px'};color:${color};text-shadow:0 0 8px ${color};`;
  boardEl.appendChild(div);
  setTimeout(()=>div.remove(), 950);
}


// ════════════════════════════════════════
//  UI
// ════════════════════════════════════════
function bumpStat(id){
  const el=document.getElementById(id);
  if(!el) return;
  el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  setTimeout(()=>el.classList.remove('bump'),320);
}
function updateUI(){
  document.getElementById('score').textContent=score;
  const movEl=document.getElementById('moves');
  const movBox=document.getElementById('stat-moves-box');
  const mv=Math.max(0,moves);
  movEl.textContent=mv;
  const max=WONDERS[level].movs, f=document.getElementById('meter-fill');
  if(f){ f.style.height=Math.round(100*mv/max)+'%'; f.style.setProperty('--mw',Math.round(100*mv/max)+'%'); }
  if(mv<=5&&mv>0){ movEl.classList.add('low'); movBox.classList.add('warn-box'); }
  else { movEl.classList.remove('low'); movBox.classList.remove('warn-box'); }
  document.getElementById('combo').textContent=`×${combo}`;
  document.getElementById('badge-lvl').textContent=`NIVEL ${String(level+1).padStart(2,'0')}`;
  if(combo>1) bumpStat('combo');
}
function updateWonder(){
  const w=WONDERS[level];
  document.getElementById('wonder-name').textContent=w.name;
  document.getElementById('wonder-desc').textContent=w.desc;
  document.getElementById('prog-text').textContent=`${wonderProg} / ${w.stages}`;
}

// ════════════════════════════════════════
//  OVERLAYS
// ════════════════════════════════════════
function calcStars(){
  const w=WONDERS[level];
  const maxMovs=w.movs;
  const movsLeft=Math.max(0,moves);
  if(wonderProg>=w.stages){
    if(movsLeft>=Math.floor(maxMovs*0.4)) return 3;
    if(movsLeft>=Math.floor(maxMovs*0.15)) return 2;
    return 1;
  }
  return 0;
}

async function showWin(){
  const w=WONDERS[level];
  const stars=calcStars();
  const best=getBestScore(level);
  if(score>best) setBestScore(level, score);
  const prevStars=getBestStars(level);
  if(stars>prevStars) setBestStars(level, stars);

  document.getElementById('ov-title').textContent='COMPLETO';
  document.getElementById('ov-sub').textContent=`${w.name} — CONSTRUIDA`;
  document.getElementById('ov-scene').innerHTML=wonderSceneSVG(w.id,w.stages);
  const got=Object.entries(matsGot); got.forEach(([m,n])=>addStock(m,n));
  document.getElementById('ov-mats').textContent=got.map(([m,n])=>`${MATERIALS[m].name} +${n}`).join('  ·  ');
  document.getElementById('ov-score').textContent=`${score} PTS`;
  document.getElementById('btn-next').style.display=(level+1<WONDERS.length)?'':'none';

  // Reset stars
  ['ov-s1','ov-s2','ov-s3'].forEach(id=>document.getElementById(id).classList.remove('lit'));
  document.getElementById('overlay').classList.add('show');

  // Animate stars with delay
  await wait(600);
  for(let i=0;i<stars;i++){
    await wait(320);
    document.getElementById(['ov-s1','ov-s2','ov-s3'][i]).classList.add('lit');
  }
  buildSelectScreen(); // refresh best scores
}

function showLose(){
  document.getElementById('ov-title').textContent='OBRA PARADA';
  document.getElementById('ov-sub').textContent='SE ACABARON LOS MOVIMIENTOS';
  document.getElementById('ov-scene').innerHTML='';
  document.getElementById('ov-mats').textContent='';
  document.getElementById('ov-score').textContent=`${score} PTS`;
  document.getElementById('btn-next').style.display='none';
  ['ov-s1','ov-s2','ov-s3'].forEach(id=>document.getElementById(id).classList.remove('lit'));
  document.getElementById('overlay').classList.add('show');
}

// ════════════════════════════════════════
//  LOG
// ════════════════════════════════════════
function log(msg,cls='dim'){
  const el=document.getElementById('log');
  const line=document.createElement('div');
  line.className=`log-line lc-${cls}`; line.textContent=msg;
  el.appendChild(line);
  while(el.children.length>4) el.removeChild(el.firstChild);
}

function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }
