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
  shuffleBoard();
  updatePowerups();
  log('Tablero revuelto.','warn');
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
    const setB=new Set();
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
      const nr=r+dr, nc=c+dc;
      if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS) setB.add(nr*COLS+nc);
    }
    for(const k of [...setB]){ if(isRock(board[Math.floor(k/COLS)][k%COLS])) setB.delete(k); }
    const cells=[...setB].map(k=>({r:Math.floor(k/COLS),c:k%COLS}));
    spawnGemBurst(cells,'#ffaa0044');
    log(`BOMBA — ${cells.length} piezas.`,'warn');
    await wait(300);
    const pts=cells.filter(({r,c})=>!isRock(board[r][c])).length*80;
    score+=pts;
    cells.forEach(({r,c})=>{ board[r][c]=null; cellDom[r][c]?.remove(); cellDom[r][c]=null; });
    spawnScorePopup(r,c,pts,'#ffaa00');
    bumpStat('score'); updateUI();
    await wait(100);
    const exP=dropTiles(); fillBoard(); renderBoard(); if(exP.length) collectExits(exP,[]);
    await wait(200);
    const m2=findMatches();
    if(m2.length){ await processMatches(m2); } else { await afterPower(); }

  } else if(type==='ray'){
    // Destroy entire row
    const setR=new Set();
    for(let cc=0;cc<COLS;cc++) setR.add(r*COLS+cc);
    for(const k of [...setR]){ if(isRock(board[Math.floor(k/COLS)][k%COLS])) setR.delete(k); }
    const cells=[...setR].map(k=>({r:Math.floor(k/COLS),c:k%COLS}));
    spawnGemBurst(cells,'#00e5ff44');
    log(`RAYO — fila ${r+1}.`,'info');
    await wait(300);
    const pts2=cells.filter(({r,c})=>!isRock(board[r][c])).length*80;
    score+=pts2;
    cells.forEach(({r,c})=>{ board[r][c]=null; cellDom[r][c]?.remove(); cellDom[r][c]=null; });
    spawnScorePopup(r,Math.floor(COLS/2),pts2,'#00e5ff');
    bumpStat('score'); updateUI();
    await wait(100);
    const exP=dropTiles(); fillBoard(); renderBoard(); if(exP.length) collectExits(exP,[]);
    await wait(200);
    const m3=findMatches();
    if(m3.length){ await processMatches(m3); } else { await afterPower(); }

  } else if(type==='color'){
    // Destroy all tiles of the tapped color
    const ttype=board[r][c]?.t;
    if(ttype==null||ttype<0||isRock(board[r][c])){ busy=false; puCounts.color++; updatePowerups(); return; }
    const cells2=[];
    for(let rr=0;rr<ROWS;rr++) for(let cc=0;cc<COLS;cc++){
      if(board[rr][cc]?.t===ttype) cells2.push({r:rr,c:cc});
    }
    spawnGemBurst(cells2, TILE_COLORS[ttype]+'44');
    log(`AURORA — ${cells2.length}× ${TILE_NAMES[ttype]}.`,'rune');
    await wait(300);
    const pts3=cells2.length*100;
    score+=pts3;
    cells2.forEach(({r,c})=>{ board[r][c]=null; cellDom[r][c]?.remove(); cellDom[r][c]=null; });
    spawnScorePopup(r,c,pts3,TILE_COLORS[ttype]);
    bumpStat('score'); updateUI();
    await wait(100);
    const exP=dropTiles(); fillBoard(); renderBoard(); if(exP.length) collectExits(exP,[]);
    await wait(200);
    const m4=findMatches();
    if(m4.length){ await processMatches(m4); } else { await afterPower(); }
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

// Tras un poder: ¿se terminó la obra? ¿faltan movimientos? ¿hay jugadas?
async function afterPower(){
  if(rocksLeft<=0){ await waitDeliveries(); await wait(300); showWin(); return; }
  if(!hasMoves()){ log('Sin movimientos. Revolviendo.','warn'); shuffleBoard(); }
  busy=false;
}
