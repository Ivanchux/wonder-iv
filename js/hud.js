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
  if(mv<=5&&mv>0){ movEl.classList.add('low'); movBox.classList.add('warn-box'); }
  else { movEl.classList.remove('low'); movBox.classList.remove('warn-box'); }
  document.getElementById('combo').textContent=`×${combo}`;
  document.getElementById('badge-lvl').textContent=`LVL ${String(level+1).padStart(2,'0')}`;
  if(combo>1) bumpStat('combo');
}
function updateWonder(){
  const w=WONDERS[level];
  document.getElementById('wonder-name').textContent=w.name;
  document.getElementById('wonder-desc').textContent=w.desc;
  const eraName=w.eras[currentEra]?.name||`ERA ${currentEra+1}`;
  document.getElementById('era-label-text').textContent=eraName;
  document.getElementById('prog-text').textContent=`${wonderProg} / ${w.stages}`;
  const track=document.getElementById('prog-track');
  track.innerHTML='';
  for(let i=0;i<w.stages;i++){
    const s=document.createElement('div');
    const isLit=i<wonderProg, isNew=i>=prevProgSegs&&i<wonderProg;
    // Color segment by era
    const eraColor= i<eraThresholds[0] ? '#ffaa00' : i<eraThresholds[1] ? '#cc44ff' : '#00e5ff';
    s.className='prog-seg'+(isLit?' lit':'')+(isNew?' lit-new':'');
    if(isLit) s.style.background=eraColor, s.style.boxShadow=`0 0 6px ${eraColor}`, s.style.borderColor=eraColor;
    track.appendChild(s);
  }
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
  document.getElementById('ov-sub').textContent=`${w.name} — RECONSTRUIDA`;
  document.getElementById('ov-ascii').textContent=w.ascii.join('\n');
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
  document.getElementById('ov-title').textContent='EXPEDICIÓN FALLIDA';
  document.getElementById('ov-sub').textContent='MOVIMIENTOS AGOTADOS — REINICIO REQUERIDO';
  document.getElementById('ov-ascii').textContent='';
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
