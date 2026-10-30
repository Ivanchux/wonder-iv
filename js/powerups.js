// WONDER IV — Poderes especiales: bomba, rayo, revolver y aurora.

// ════════════════════════════════════════
//  POWER-UPS
// ════════════════════════════════════════
function activatePowerup(type){
  if(busy) return;
  if(puCounts[type]<=0) return;
  if(type==='shuffle'){
    useShuffle(); return;
  }
  // Toggle
  if(activePu===type){ activePu=null; updatePowerups(); return; }
  activePu=type;
  updatePowerups();
  log(`Poder activado: ${type.toUpperCase()}. Selecciona una ficha.`, 'warn');
}

function useShuffle(){
  if(puCounts.shuffle<=0||busy) return;
  busy=true;
  puCounts.shuffle--;
  const all=[];
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) all.push(board[r][c]);
  for(let i=all.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [all[i],all[j]]=[all[j],all[i]]; }
  let k=0;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){ board[r][c]=all[k++]; syncCell(r,c); }
  updatePowerups();
  log('⟳ Tablero revuelto.','warn');
  busy=false;
}

async function applyPowerupAt(r, c){
  if(!activePu||busy) return;
  const type=activePu; activePu=null;
  if(puCounts[type]<=0){ updatePowerups(); return; }
  puCounts[type]--;
  updatePowerups();
  busy=true;

  if(type==='bomb'){
    // 3×3 area bomb
    const cells=[];
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
      const nr=r+dr, nc=c+dc;
      if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS) cells.push({r:nr,c:nc});
    }
    spawnGemBurst(cells,'#ffaa0044');
    log(`💥 BOMBA — ${cells.length} fichas destruidas.`,'warn');
    await wait(300);
    const pts=cells.length*80;
    score+=pts;
    cells.forEach(({r,c})=>{ board[r][c]=null; cellDom[r][c]?.remove(); cellDom[r][c]=null; });
    spawnScorePopup(r,c,pts,'#ffaa00');
    bumpStat('score'); updateUI();
    await wait(100);
    dropTiles(); fillBoard(); renderBoard();
    await wait(200);
    const m2=findMatches();
    if(m2.length){ await processMatches(m2); } else { busy=false; }

  } else if(type==='ray'){
    // Destroy entire row
    const cells=[];
    for(let cc=0;cc<COLS;cc++) cells.push({r,c:cc});
    spawnGemBurst(cells,'#00e5ff44');
    log(`⚡ RAYO — fila ${r+1} destruida.`,'info');
    await wait(300);
    const pts2=cells.length*80;
    score+=pts2;
    cells.forEach(({r,c})=>{ board[r][c]=null; cellDom[r][c]?.remove(); cellDom[r][c]=null; });
    spawnScorePopup(r,Math.floor(COLS/2),pts2,'#00e5ff');
    bumpStat('score'); updateUI();
    await wait(100);
    dropTiles(); fillBoard(); renderBoard();
    await wait(200);
    const m3=findMatches();
    if(m3.length){ await processMatches(m3); } else { busy=false; }

  } else if(type==='color'){
    // Destroy all tiles of the tapped color
    const ttype=board[r][c]?.t;
    if(ttype==null){ busy=false; return; }
    const cells2=[];
    for(let rr=0;rr<ROWS;rr++) for(let cc=0;cc<COLS;cc++){
      if(board[rr][cc]?.t===ttype) cells2.push({r:rr,c:cc});
    }
    spawnGemBurst(cells2, TILE_COLORS[ttype]+'44');
    log(`✨ AURORA — ${cells2.length}× ${TILE_NAMES[ttype]} eliminados.`,'rune');
    await wait(300);
    const pts3=cells2.length*100;
    score+=pts3;
    cells2.forEach(({r,c})=>{ board[r][c]=null; cellDom[r][c]?.remove(); cellDom[r][c]=null; });
    spawnScorePopup(r,c,pts3,TILE_COLORS[ttype]);
    bumpStat('score'); updateUI();
    await wait(100);
    dropTiles(); fillBoard(); renderBoard();
    await wait(200);
    const m4=findMatches();
    if(m4.length){ await processMatches(m4); } else { busy=false; }
  }
}

function updatePowerups(){
  ['bomb','ray','shuffle','color'].forEach(t=>{
    const btn=document.getElementById('pu-'+t);
    const cnt=document.getElementById('pu-'+t+'-count');
    if(!btn||!cnt) return;
    cnt.textContent=puCounts[t];
    btn.classList.toggle('pu-active', activePu===t);
    btn.classList.toggle('pu-disabled', puCounts[t]<=0 && t!=='shuffle');
  });
}

function updateObjectives(){
  const w=WONDERS[level];
  const era=w.eras[currentEra];
  const list=document.getElementById('obj-list');
  if(!list) return;
  list.innerHTML='';

  // Main objective: collect N tiles of type
  const needed=era.objCount;
  const done=objCollected>=needed;
  const item=document.createElement('div');
  item.className='obj-item'+(done?' done':'');
  item.innerHTML=
    `<span class="obj-glyph" style="color:${TILE_COLORS[era.objType]};display:inline-flex;align-items:center;width:20px;height:20px;">${gemSVG(era.objType)}</span>`+
    `<span class="obj-val">${TILE_NAMES[era.objType]}</span>`+
    `<span class="obj-needed">${Math.min(objCollected,needed)} / ${needed}</span>`;
  list.appendChild(item);

  // Bonus objective: current era multiplier
  const bonusItem=document.createElement('div');
  bonusItem.className='obj-item';
  bonusItem.innerHTML=
    `<span class="obj-glyph">⚡</span>`+
    `<span class="obj-val">${era.bonus}</span>`+
    `<span class="obj-needed">ACTIVO</span>`;
  list.appendChild(bonusItem);
}
