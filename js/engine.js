// WONDER IV — Motor: tipos de ficha, inicio de nivel, eras, tablero, input, intercambios,
// detección de combinaciones, gemas especiales, gravedad y pistas.

// ════════════════════════════════════════
//  TILE TYPES
// ════════════════════════════════════════
function mkTile(){ return {t:Math.floor(Math.random()*TILES.length), kind:'normal'}; }
function isGem(tile){ return tile?.kind==='gem-line'||tile?.kind==='gem-area'; }

// ════════════════════════════════════════
//  START LEVEL
// ════════════════════════════════════════
function startLevel(idx){
  level=idx; score=0; moves=WONDERS[level].movs;
  combo=1; wonderProg=0; prevProgSegs=0;
  selected=null; busy=false; hintPair=[];
  activePu=null;
  puCounts={...PU_DEFAULTS};

  // Eras init
  currentEra=0;
  const w=WONDERS[level];
  eraThresholds=[Math.floor(w.stages/3), Math.floor(w.stages*2/3)];
  objCollected=0;
  scoreBonus=w.eras[0].scoreBonus;

  document.getElementById('overlay').classList.remove('show');
  document.getElementById('era-card').classList.remove('show');
  showScreen('screen-game');
  inputBound=false;
  buildBoard();
  requestAnimationFrame(()=>{ drawSceneBg(); relayoutBoard(); });
  initAscii(); updateUI(); updateWonder(); updatePowerups(); updateObjectives();
  log('Expedición iniciada.','dim');
  log(`Objetivo: ${w.name}`, 'info');
  log(`${w.eras[0].name} — activa`, 'gold');
}

function restartLevel(){ startLevel(level); }
function nextLevel(){ if(level+1<WONDERS.length) startLevel(level+1); else goToSelect(); }

// ════════════════════════════════════════
//  ERA SYSTEM
// ════════════════════════════════════════
function checkEraAdvance(){
  const w=WONDERS[level];
  const newEra = wonderProg >= eraThresholds[1] ? 2 : wonderProg >= eraThresholds[0] ? 1 : 0;
  if(newEra > currentEra){
    currentEra=newEra;
    objCollected=0;
    scoreBonus=w.eras[currentEra].scoreBonus;
    showEraCard(currentEra);
  }
}

let _eraDismissTimer=null;
function showEraCard(eraIdx){
  const w=WONDERS[level];
  const era=w.eras[eraIdx];
  document.getElementById('era-title').textContent=era.name;
  document.getElementById('era-desc').textContent=era.desc;
  document.getElementById('era-bonus-val').textContent=era.bonus;
  // No bloquea el juego — toast pasivo
  const card=document.getElementById('era-card');
  card.classList.remove('dismiss');
  card.classList.add('show');
  if(_eraDismissTimer) clearTimeout(_eraDismissTimer);
  _eraDismissTimer=setTimeout(()=>dismissEraCard(), 4200);
}

function dismissEraCard(){
  if(_eraDismissTimer){ clearTimeout(_eraDismissTimer); _eraDismissTimer=null; }
  const card=document.getElementById('era-card');
  card.classList.add('dismiss');
  setTimeout(()=>{ card.classList.remove('show','dismiss'); },320);
  updateObjectives();
  log(`${WONDERS[level].eras[currentEra].name} — activa`,'gold');
}


// ════════════════════════════════════════
//  BOARD
// ════════════════════════════════════════
let cellDom=[];
let _metrics=null;

function boardMetrics(){
  if(_metrics) return _metrics;
  const el=document.getElementById('board');
  const W=el.offsetWidth;
  const GAP=Math.max(2,Math.round(W*0.006));
  const SIZE=(W-GAP*(COLS-1))/COLS;
  _metrics={size:SIZE, gap:GAP, left:c=>c*(SIZE+GAP), top:r=>r*(SIZE+GAP)};
  return _metrics;
}
function invalidateMetrics(){ _metrics=null; }

function applyPos(el,r,c,animated,duration=160){
  const m=boardMetrics();
  el.style.width=m.size+'px'; el.style.height=m.size+'px';
  el.style.transition=animated?`left ${duration}ms cubic-bezier(0.22,1,0.36,1), top ${duration}ms cubic-bezier(0.22,1,0.36,1)`:'none';
  el.style.left=m.left(c)+'px'; el.style.top=m.top(r)+'px';
}

function tileClass(tile){
  let cls=`cell t${tile.t}`;
  if(tile.kind==='gem-line') cls+=' gem-line';
  else if(tile.kind==='gem-area') cls+=' gem-area';
  else if(tile.kind==='rune') cls+=' rune';
  return cls;
}
function tileHTML(tile){
  if(tile.kind==='gem-line') return gemLineSVG();
  if(tile.kind==='gem-area') return gemAreaSVG();
  if(tile.kind==='rune'){
    // Rune: overlay the rune char on the base gem
    return gemSVG(tile.t) + `<span style="position:absolute;font-size:clamp(8px,2vw,13px);color:#cc44ff;text-shadow:0 0 8px #cc44ff;pointer-events:none;">${tile.rune}</span>`;
  }
  return gemSVG(tile.t);
}

function makeCellEl(r,c){
  const tile=board[r][c];
  const div=document.createElement('div');
  div.className=tileClass(tile); div.dataset.r=r; div.dataset.c=c;
  div.innerHTML=tileHTML(tile);
  applyPos(div,r,c,false);
  return div;
}

function renderBoard(){
  const el=document.getElementById('board');
  el.innerHTML=''; cellDom=[]; invalidateMetrics();
  const frag=document.createDocumentFragment();
  for(let r=0;r<ROWS;r++){
    cellDom[r]=[];
    for(let c=0;c<COLS;c++){
      const div=makeCellEl(r,c);
      frag.appendChild(div); cellDom[r][c]=div;
    }
  }
  el.appendChild(frag);
  bindInputHandlers();
}

function syncCell(r,c){
  const tile=board[r][c], div=cellDom[r][c];
  if(!div||!tile) return;
  div.className=tileClass(tile); div.dataset.r=r; div.dataset.c=c;
  div.innerHTML=tileHTML(tile);
}
function getCell(r,c){ return cellDom[r]?.[c]??null; }
function relayoutBoard(){
  invalidateMetrics();
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(cellDom[r]?.[c]) applyPos(cellDom[r][c],r,c,false);
}

function buildBoard(){
  board=[];
  for(let r=0;r<ROWS;r++){ board[r]=[]; for(let c=0;c<COLS;c++) board[r][c]=mkTile(); }
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) while(hasMatchAt(r,c)) board[r][c]=mkTile();
  renderBoard();
}

// ════════════════════════════════════════
//  INPUT
// ════════════════════════════════════════
let touchStart=null;
function bindInputHandlers(){
  if(inputBound) return;
  inputBound=true;
  const boardEl=document.getElementById('board');

  boardEl.addEventListener('pointerdown', e=>{
    if(busy||moves<=0) return;
    const cell=e.target.closest('.cell');
    if(!cell) return;
    e.preventDefault();
    touchStart={r:+cell.dataset.r, c:+cell.dataset.c, x:e.clientX, y:e.clientY};
  },{passive:false});

  boardEl.addEventListener('pointerup', e=>{
    if(!touchStart) return;
    const dx=e.clientX-touchStart.x, dy=e.clientY-touchStart.y;
    if(Math.sqrt(dx*dx+dy*dy)<10){
      // Powerup tap?
      if(activePu){ applyPowerupAt(touchStart.r, touchStart.c); }
      else { handleTap(touchStart.r, touchStart.c); }
    } else {
      clearSel();
      const {r,c}=touchStart;
      let tr=r, tc=c;
      if(Math.abs(dx)>Math.abs(dy)) tc=dx>0?c+1:c-1;
      else tr=dy>0?r+1:r-1;
      if(tr>=0&&tr<ROWS&&tc>=0&&tc<COLS) doSwap(r,c,tr,tc);
    }
    touchStart=null;
  },{passive:true});

  boardEl.addEventListener('pointerleave',()=>{touchStart=null;},{passive:true});
}

function handleTap(r,c){
  clearHints();
  if(selected===null){ selected={r,c}; getCell(r,c)?.classList.add('selected'); return; }
  if(selected.r===r&&selected.c===c){ clearSel(); return; }
  const dr=Math.abs(selected.r-r), dc=Math.abs(selected.c-c);
  const pr=selected.r, pc2=selected.c;
  clearSel();
  if((dr===1&&dc===0)||(dr===0&&dc===1)) doSwap(pr,pc2,r,c);
  else { selected={r,c}; getCell(r,c)?.classList.add('selected'); }
}
function clearSel(){ if(selected){ getCell(selected.r,selected.c)?.classList.remove('selected'); selected=null; } }

// ════════════════════════════════════════
//  SWAP
// ════════════════════════════════════════
async function doSwap(r1,c1,r2,c2){
  busy=true;
  const el1=getCell(r1,c1), el2=getCell(r2,c2);
  const SWAP_MS=140;
  if(el1) applyPos(el1,r2,c2,true,SWAP_MS);
  if(el2) applyPos(el2,r1,c1,true,SWAP_MS);
  await wait(SWAP_MS+20);
  swap(r1,c1,r2,c2);
  const tmp=cellDom[r1][c1]; cellDom[r1][c1]=cellDom[r2][c2]; cellDom[r2][c2]=tmp;
  syncCell(r1,c1); syncCell(r2,c2);

  const tA=board[r1][c1], tB=board[r2][c2];
  const aIsGem=isGem(tA), bIsGem=isGem(tB);

  if(aIsGem||bIsGem){
    moves--; combo=1;
    await activateGemSwap(r1,c1,r2,c2,tA,tB);
    return;
  }

  const matches=findMatches();
  if(!matches.length){
    if(el1) applyPos(el1,r1,c1,true,SWAP_MS);
    if(el2) applyPos(el2,r2,c2,true,SWAP_MS);
    await wait(SWAP_MS+20);
    swap(r1,c1,r2,c2);
    const tmp2=cellDom[r1][c1]; cellDom[r1][c1]=cellDom[r2][c2]; cellDom[r2][c2]=tmp2;
    syncCell(r1,c1); syncCell(r2,c2);
    log('Sin combinacion.','err'); busy=false; return;
  }
  moves--; combo=1;
  const mid=getCell(r1,c1);
  if(mid){
    const br=mid.getBoundingClientRect(), bw=document.getElementById('board-wrap').getBoundingClientRect();
    spawnPulse(br.left-bw.left+br.width/2, br.top-bw.top+br.height/2);
  }
  await processMatches(matches);
}

async function activateGemSwap(r1,c1,r2,c2,tA,tB){
  const aIsGem=isGem(tA), bIsGem=isGem(tB);
  const toDestroy=new Set();

  if(aIsGem&&bIsGem){
    if(tA.kind==='gem-area'&&tB.kind==='gem-area'){
      for(let dr=-2;dr<=2;dr++) for(let dc=-2;dc<=2;dc++){
        const nr=r1+dr,nc=c1+dc;
        if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS) toDestroy.add(nr*COLS+nc);
      }
      log('DOBLE AREA explosion 5x5!','rune');
    } else if(tA.kind==='gem-line'&&tB.kind==='gem-line'){
      for(let c=0;c<COLS;c++) toDestroy.add(r1*COLS+c);
      for(let r=0;r<ROWS;r++) toDestroy.add(r*COLS+c1);
      for(let c=0;c<COLS;c++) toDestroy.add(r2*COLS+c);
      for(let r=0;r<ROWS;r++) toDestroy.add(r*COLS+c2);
      log('DOBLE LINEA filas y columnas!','rune');
    } else {
      const gr=tA.kind==='gem-line'?r1:r2, gc=tA.kind==='gem-line'?c1:c2;
      for(let c=0;c<COLS;c++) toDestroy.add(gr*COLS+c);
      for(let r=0;r<ROWS;r++) toDestroy.add(r*COLS+gc);
      for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
        const nr=gr+dr,nc=gc+dc;
        if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS) toDestroy.add(nr*COLS+nc);
      }
      log('LINEA + AREA combo devastador!','rune');
    }
  } else {
    const gr=aIsGem?r1:r2, gc=aIsGem?c1:c2;
    const gem=aIsGem?tA:tB;
    if(gem.kind==='gem-line'){
      for(let c=0;c<COLS;c++) toDestroy.add(gr*COLS+c);
      for(let r=0;r<ROWS;r++) toDestroy.add(r*COLS+gc);
      log('LINEA fila y columna barridas!','info');
    } else if(gem.kind==='gem-area'){
      for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
        const nr=gr+dr,nc=gc+dc;
        if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS) toDestroy.add(nr*COLS+nc);
      }
      log('AREA explosion 3x3!','warn');
    }
  }

  const cells=[...toDestroy].map(k=>({r:Math.floor(k/COLS),c:k%COLS}));
  const color=(tA?.kind==='gem-area'||tB?.kind==='gem-area')?'#ffaa0066':'#00e5ff55';
  spawnGemBurst(cells,color);
  cells.forEach(({r,c})=>getCell(r,c)?.classList.add('popping'));
  await wait(340);

  const pts=Math.round(cells.length*120*combo*scoreBonus);
  score+=pts; bumpStat('score');
  spawnScorePopup(r1,c1,pts,'#ffd060');
  updateUI();

  cells.forEach(({r,c})=>{ cellDom[r][c]?.remove(); cellDom[r][c]=null; board[r][c]=null; });
  dropTiles(); fillBoard(); renderBoard();
  await wait(260);
  combo++; updateUI(); updateWonder(); checkEraAdvance();
  const chain=findMatches();
  if(chain.length){ await wait(80); await processMatches(chain); }
  else {
    combo=1; updateUI();
    if(wonderProg>=WONDERS[level].stages){ await wait(400); showWin(); return; }
    if(moves<=0){ await wait(400); showLose(); return; }
    if(!hasMoves()){ log('Sin movimientos. Revolviendo.','warn'); shuffleBoard(); }
    busy=false;
  }
}

// ════════════════════════════════════════
//  MATCH DETECTION
// ════════════════════════════════════════
function findMatches(){
  const hits=new Set();
  for(let r=0;r<ROWS;r++){
    let c=0;
    while(c<COLS){
      const tile=board[r][c];
      if(!tile||isGem(tile)){c++;continue;}
      const t=tile.t;
      let end=c+1;
      while(end<COLS&&board[r][end]?.t===t&&!isGem(board[r][end])) end++;
      if(end-c>=3) for(let i=c;i<end;i++) hits.add(r*COLS+i);
      c=end;
    }
  }
  for(let c=0;c<COLS;c++){
    let r=0;
    while(r<ROWS){
      const tile=board[r][c];
      if(!tile||isGem(tile)){r++;continue;}
      const t=tile.t;
      let end=r+1;
      while(end<ROWS&&board[end][c]?.t===t&&!isGem(board[end][c])) end++;
      if(end-r>=3) for(let i=r;i<end;i++) hits.add(i*COLS+c);
      r=end;
    }
  }
  return [...hits].map(k=>({r:Math.floor(k/COLS),c:k%COLS}));
}

// ════════════════════════════════════════
//  GEM HELPERS
// ════════════════════════════════════════
function gemBlast(gr,gc){
  const kind=board[gr]?.[gc]?.kind;
  const keys=new Set();
  if(kind==='gem-line'){ for(let c=0;c<COLS;c++) keys.add(gr*COLS+c); for(let r=0;r<ROWS;r++) keys.add(r*COLS+gc); }
  else if(kind==='gem-area'){ for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ const nr=gr+dr,nc=gc+dc; if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS) keys.add(nr*COLS+nc); } }
  return keys;
}
function spawnGemBurst(cells,color){
  const boardEl=document.getElementById('board'); const m=boardMetrics();
  cells.forEach(({r,c})=>{
    const div=document.createElement('div'); div.className='gem-burst';
    div.style.cssText=`width:${m.size}px;height:${m.size}px;left:${m.left(c)}px;top:${m.top(r)}px;background:${color};`;
    boardEl.appendChild(div); setTimeout(()=>div.remove(),420);
  });
}

// ════════════════════════════════════════
//  PROCESS MATCHES + GRAVITY
// ════════════════════════════════════════
async function processMatches(matches){
  const sz=matches.length;
  const toRemove=new Set(matches.map(({r,c})=>r*COLS+c));
  const gemCells=matches.filter(({r,c})=>isGem(board[r]?.[c]));
  gemCells.forEach(({r,c})=>{ gemBlast(r,c).forEach(k=>toRemove.add(k)); });
  const removeList=[...toRemove].map(k=>({r:Math.floor(k/COLS),c:k%COLS}));

  const freq={};
  matches.forEach(({r,c})=>{ const t=board[r][c]?.t??0; freq[t]=(freq[t]||0)+1; });
  const ttype=+Object.keys(freq).reduce((a,b)=>freq[a]>freq[b]?a:b);
  const tname=TILE_NAMES[ttype]||'TILE';

  let gemCreated=null;
  if(sz>=5&&gemCells.length===0){
    const pivot=matches[Math.floor(matches.length/2)];
    gemCreated={r:pivot.r,c:pivot.c,kind:'gem-area',t:ttype};
    toRemove.delete(pivot.r*COLS+pivot.c);
  } else if(sz===4&&gemCells.length===0){
    const pivot=matches[Math.floor(matches.length/2)];
    const allSameRow=matches.every(m=>m.r===matches[0].r);
    gemCreated={r:pivot.r,c:pivot.c,kind:'gem-line',t:ttype,axis:allSameRow?'col':'row'};
    toRemove.delete(pivot.r*COLS+pivot.c);
  }

  const finalRemove=[...toRemove].map(k=>({r:Math.floor(k/COLS),c:k%COLS}));
  finalRemove.forEach(({r,c})=>getCell(r,c)?.classList.add('popping'));
  if(gemCreated){
    const piv=getCell(gemCreated.r,gemCreated.c);
    if(piv){ piv.style.filter='brightness(3)'; setTimeout(()=>{piv.style.filter='';},350); }
  }
  if(gemCells.length>0){
    gemCells.forEach(({r,c})=>{
      const kind=board[r][c]?.kind;
      const color=kind==='gem-area'?'#ffaa0055':'#00e5ff44';
      const blastCells=[...gemBlast(r,c)].map(k=>({r:Math.floor(k/COLS),c:k%COLS}));
      spawnGemBurst(blastCells,color);
    });
  }
  await wait(340);

  // ── SCORE con bonus de era ──
  const basePts=finalRemove.length*100*combo;
  const pts=Math.round(basePts*scoreBonus);
  score+=pts;
  bumpStat('score');

  // ── Objetivos: contar fichas del tipo requerido ──
  const era=WONDERS[level].eras[currentEra];
  const matchedObj=finalRemove.filter(({r,c})=>board[r][c]?.t===era.objType).length;
  if(matchedObj>0){
    objCollected+=matchedObj;
    updateObjectives();
  }

  // ── Score popup ──
  const pivR=matches[0]?.r??0, pivC=matches[0]?.c??0;
  spawnScorePopup(pivR, pivC, pts, TILE_COLORS[ttype]);

  // ── Log ──
  const bonusTxt=scoreBonus>1?` (×${scoreBonus})`:'';
  if(gemCells.length>0){
    const gemType=gemCells[0]&&board[gemCells[0].r]?.[gemCells[0].c]?.kind;
    log(`⚡ ${gemType==='gem-area'?'ÁREA':'LÍNEA'} — ${finalRemove.length}× +${pts}${bonusTxt}`,'rune');
  } else if(gemCreated){
    const label=gemCreated.kind==='gem-area'?'✦ GEMA ÁREA':'◉ GEMA LÍNEA';
    log(`${label} — ${tname} +${pts}${bonusTxt}`,'warn');
  } else if(sz>=6){
    log(`✦ COMBO MASIVO — ${sz}× ${tname} +${pts}${bonusTxt}`,'rune');
  } else {
    log(`${tname} ×${sz} — +${pts}${bonusTxt}`,'ok');
  }

  // ── Wonder progress ──
  const gained=Math.max(1,Math.floor(finalRemove.length/3));
  const maxStages=WONDERS[level].stages;
  prevProgSegs=wonderProg;
  wonderProg=Math.min(maxStages, wonderProg+gained);
  const linesPerStage=WONDERS[level].ascii.length/maxStages;
  const targetLines=Math.ceil(wonderProg*linesPerStage);
  while(asciiRevealed<targetLines&&asciiRevealed<WONDERS[level].ascii.length) revealAsciiLine();

  // ── Place new gem — after DOM removal so it gets a fresh element ──
  if(gemCreated){
    board[gemCreated.r][gemCreated.c]={t:gemCreated.t,kind:gemCreated.kind};
  }

  const removingSet=toRemove;
  const fallDist=Array.from({length:ROWS},()=>new Array(COLS).fill(0));
  for(let c=0;c<COLS;c++){
    let empties=0;
    for(let r=ROWS-1;r>=0;r--){
      if(removingSet.has(r*COLS+c)) empties++;
      else fallDist[r][c]=empties;
    }
  }

  finalRemove.forEach(({r,c})=>{ cellDom[r][c]?.remove(); cellDom[r][c]=null; board[r][c]=null; });

  // Restore gem board entry (finalRemove may have nulled it if timing was off)
  if(gemCreated){
    board[gemCreated.r][gemCreated.c]={t:gemCreated.t,kind:gemCreated.kind};
    // Build a fresh DOM element for the gem
    const m2=boardMetrics();
    const tile=board[gemCreated.r][gemCreated.c];
    const gemDiv=document.createElement('div');
    gemDiv.className=tileClass(tile);
    gemDiv.dataset.r=gemCreated.r; gemDiv.dataset.c=gemCreated.c;
    gemDiv.innerHTML=tileHTML(tile);
    gemDiv.style.cssText=`width:${m2.size}px;height:${m2.size}px;left:${m2.left(gemCreated.c)}px;top:${m2.top(gemCreated.r)}px;transition:none`;
    gemDiv.style.filter='brightness(3) saturate(2)';
    setTimeout(()=>{ gemDiv.style.filter=''; gemDiv.style.transition='filter 0.4s'; }, 60);
    setTimeout(()=>{ gemDiv.style.transition=''; }, 500);
    document.getElementById('board').appendChild(gemDiv);
    cellDom[gemCreated.r][gemCreated.c]=gemDiv;
  }

  const m=boardMetrics();
  const DROP_MS=200;
  const boardEl=document.getElementById('board');
  const newDom=Array.from({length:ROWS},()=>new Array(COLS).fill(null));

  for(let c=0;c<COLS;c++){
    for(let r=0;r<ROWS;r++){
      if(removingSet.has(r*COLS+c)) continue;
      const el=cellDom[r][c];
      const destR=r+fallDist[r][c];
      if(!el) continue;
      newDom[destR][c]=el; el.dataset.r=destR;
      if(fallDist[r][c]>0){
        const delay=c*8;
        el.style.transition=`top ${DROP_MS}ms cubic-bezier(0.4,0,0.2,1) ${delay}ms`;
        el.style.top=m.top(destR)+'px';
        setTimeout(()=>{el.style.transition='';},DROP_MS+delay+30);
      }
    }
  }

  dropTiles(); fillBoard();

  for(let c=0;c<COLS;c++){
    let spawnSlot=0;
    for(let r=0;r<ROWS;r++){
      if(newDom[r][c]!==null) continue;
      // Skip if this is the freshly placed gem cell
      if(gemCreated&&gemCreated.r===r&&gemCreated.c===c){ newDom[r][c]=cellDom[r][c]; continue; }
      const tile=board[r][c];
      if(!tile) continue;
      const div=document.createElement('div');
      div.className=tileClass(tile); div.dataset.r=r; div.dataset.c=c;
      div.innerHTML=tileHTML(tile);
      div.style.cssText=`width:${m.size}px;height:${m.size}px;left:${m.left(c)}px;top:${m.top(-(spawnSlot+1))}px;transition:none`;
      boardEl.appendChild(div); void div.offsetWidth;
      const delay=c*8+spawnSlot*12;
      div.style.transition=`top ${DROP_MS}ms cubic-bezier(0.4,0,0.2,1) ${delay}ms`;
      div.style.top=m.top(r)+'px';
      setTimeout(()=>{div.style.transition='';},DROP_MS+delay+30);
      newDom[r][c]=div; spawnSlot++;
    }
  }
  cellDom=newDom;

  await wait(DROP_MS+60);
  combo++; updateUI(); updateWonder();
  checkEraAdvance();

  const chain=findMatches();
  if(chain.length){ await wait(80); await processMatches(chain); }
  else {
    combo=1; updateUI();
    if(wonderProg>=maxStages){ await wait(400); showWin(); return; }
    if(moves<=0){ await wait(400); showLose(); return; }
    if(!hasMoves()){ log('Sin movimientos. Revolviendo.','warn'); shuffleBoard(); }
    busy=false;
  }
}

// ════════════════════════════════════════
//  BOARD HELPERS
// ════════════════════════════════════════
function dropTiles(){
  for(let c=0;c<COLS;c++){
    let empty=ROWS-1;
    for(let r=ROWS-1;r>=0;r--){ if(board[r][c]){board[empty][c]=board[r][c]; if(empty!==r)board[r][c]=null; empty--;} }
    for(let r=empty;r>=0;r--) board[r][c]=null;
  }
}
function fillBoard(){
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(!board[r][c]) board[r][c]=mkTile();
}
function hasMatchAt(r,c){
  const tile=board[r][c];
  if(!tile||tile.t===undefined||tile.t===null) return false;
  if(isGem(tile)) return false;
  const t=tile.t;
  if(c>=2&&board[r][c-1]?.t===t&&!isGem(board[r][c-1])&&board[r][c-2]?.t===t&&!isGem(board[r][c-2])) return true;
  if(r>=2&&board[r-1]?.[c]?.t===t&&!isGem(board[r-1]?.[c])&&board[r-2]?.[c]?.t===t&&!isGem(board[r-2]?.[c])) return true;
  return false;
}
function hasMoves(){
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    if(c<COLS-1){swap(r,c,r,c+1); if(findMatches().length){swap(r,c,r,c+1);return true;} swap(r,c,r,c+1);}
    if(r<ROWS-1){swap(r,c,r+1,c); if(findMatches().length){swap(r,c,r+1,c);return true;} swap(r,c,r+1,c);}
  }
  return false;
}
function swap(r1,c1,r2,c2){ const t=board[r1][c1]; board[r1][c1]=board[r2][c2]; board[r2][c2]=t; }

function shuffleBoard(){
  const all=[]; for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) all.push(board[r][c]);
  for(let i=all.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [all[i],all[j]]=[all[j],all[i]]; }
  let k=0; for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){ board[r][c]=all[k++]; syncCell(r,c); }
}

// ════════════════════════════════════════
//  HINT
// ════════════════════════════════════════
function doHint(){
  if(busy) return;
  clearHints();
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    if(c<COLS-1){swap(r,c,r,c+1);if(findMatches().length){swap(r,c,r,c+1);hintPair=[`${r},${c}`,`${r},${c+1}`];applyHints();log('Movimiento sugerido.','info');return;}swap(r,c,r,c+1);}
    if(r<ROWS-1){swap(r,c,r+1,c);if(findMatches().length){swap(r,c,r+1,c);hintPair=[`${r},${c}`,`${r+1},${c}`];applyHints();log('Movimiento sugerido.','info');return;}swap(r,c,r+1,c);}
  }
  log('No hay movimientos válidos.','err');
}
function applyHints(){ hintPair.forEach(k=>{const[r,c]=k.split(',');getCell(+r,+c)?.classList.add('hint-cell');}); }
function clearHints(){ hintPair.forEach(k=>{const[r,c]=k.split(',');getCell(+r,+c)?.classList.remove('hint-cell');}); hintPair=[]; }
