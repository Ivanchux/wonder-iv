// WONDER IV — Rocas: bloques de material que hay que romper con combinaciones al lado, y operarios que llevan el material al solar.

function isRock(t){ return !!t && t.kind==='rock'; }

// ── Aspecto de la roca (SVG por material) ──
function rockSVG(mat,hp,max){
  const m=MATERIALS[mat]||MATERIALS.piedra, id='rk'+mat;
  const cracked=hp<max;
  return `<svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${m.c1}"/><stop offset="0.5" stop-color="${m.c2}"/><stop offset="1" stop-color="${m.c3}"/></linearGradient></defs>
  <path d="M5 11L13 4H41L48 11V42L41 49H13L5 42Z" fill="${m.c3}" transform="translate(0 2)" opacity="0.5"/>
  <path d="M5 11L13 4H41L48 11V42L41 49H13L5 42Z" fill="url(#${id})" stroke="#2a1606" stroke-width="2" stroke-linejoin="round"/>
  <path d="M10 14L15 9H37" fill="none" stroke="#fff" stroke-width="2" opacity="0.5" stroke-linecap="round"/>
  <path d="M8 26H44M26 8V26M16 26V46M36 26V46" fill="none" stroke="#2a1606" stroke-width="1.4" opacity="0.4"/>
  ${max>1?`<g fill="#2a1606" opacity="0.7"><circle cx="11" cy="15" r="2"/><circle cx="41" cy="15" r="2"/><circle cx="11" cy="39" r="2"/><circle cx="41" cy="39" r="2"/></g><path d="M5 11L13 4H41L48 11V42L41 49H13L5 42Z" fill="none" stroke="#f2d27a" stroke-width="1.6" opacity="0.9" transform="translate(26 26) scale(0.86) translate(-26 -26)"/>`:''}
  ${cracked?`<path d="M30 6L25 18L33 24L22 34L28 46M25 18L14 22" fill="none" stroke="#1a0c02" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 6L25 18L33 24L22 34L28 46" fill="none" stroke="#fff" stroke-width="0.8" opacity="0.4"/>`:''}
  </svg>`;
}

// ── Colocación inicial ──
// Las rocas se reparten en las filas centrales, con una distribución distinta (y simétrica) por maravilla.
function placeRocks(w){
  let seed=(level+1)*7919+13; const rnd=()=>{ seed=(seed*16807)%2147483647; return seed/2147483647; };
  const free=[]; for(let r=1;r<=4;r++) for(let c=0;c<=3;c++) free.push([r,c]);
  for(let i=free.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [free[i],free[j]]=[free[j],free[i]]; }
  const spots=[]; 
  for(const [r,c] of free){ if(spots.length>=w.rocks.length) break; const mc=COLS-1-c; if(c===mc){ spots.push([r,c]); } else if(spots.length+2<=w.rocks.length){ spots.push([r,c]); spots.push([r,mc]); } }
  while(spots.length<w.rocks.length){ spots.push([2+spots.length%3,3]); }
  const order=[...w.rocks].sort(()=>rnd()-.5);
  spots.slice(0,w.rocks.length).forEach(([r,c],i)=>{ board[r][c]={t:-1,kind:'rock',mat:w.mat,hp:order[i],max:order[i]}; });
}

// ── Daño: las combinaciones (y las explosiones) golpean las rocas de al lado ──
// Recibe el conjunto de celdas que se van a quitar; devuelve las rocas que se rompen y ajusta el conjunto.
function applyRockDamage(removeSet){
  const hit=new Set();
  const key=(r,c)=>r*COLS+c;
  for(const k of [...removeSet]){
    const r=Math.floor(k/COLS), c=k%COLS, t=board[r]?.[c];
    if(isRock(t)){ hit.add(k); continue; }            // golpe directo (explosión)
    for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){ // golpe de al lado
      const nr=r+dr,nc=c+dc; if(nr<0||nr>=ROWS||nc<0||nc>=COLS) continue;
      const nk=key(nr,nc); if(removeSet.has(nk)) continue;
      if(isRock(board[nr][nc])) hit.add(nk);
    }
  }
  const broken=[];
  for(const k of hit){
    const r=Math.floor(k/COLS), c=k%COLS, t=board[r][c];
    t.hp--;
    if(t.hp<=0){ removeSet.add(k); broken.push({r,c,mat:t.mat,blocks:t.max}); }
    else { removeSet.delete(k); syncCell(r,c); const el=getCell(r,c); if(el){ el.classList.remove('rock-hit'); void el.offsetWidth; el.classList.add('rock-hit'); } }
  }
  return broken;
}

// ── Operarios ──
function workerSVG(mat){
  const m=MATERIALS[mat]||MATERIALS.piedra;
  return `<svg viewBox="-18 -52 36 62" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="-9" y="-50" width="18" height="13" rx="2" fill="${m.c2}" stroke="#2a1606" stroke-width="1.6"/><path d="M-7 -47H4" stroke="#fff" stroke-width="1.6" opacity="0.55" stroke-linecap="round"/>
    <path d="M-5 -37L-8 -26M5 -37L8 -26" stroke="#2a1606" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="0" cy="-26" rx="7" ry="7.5" fill="#e8b890" stroke="#2a1606" stroke-width="1.6"/>
    <path d="M-7 -30Q0 -40 7 -30Z" fill="#f2d27a" stroke="#2a1606" stroke-width="1.4"/>
    <path d="M-7 -19H7L9 0H-9Z" fill="#f4ecd8" stroke="#2a1606" stroke-width="1.6"/>
    <g class="legs"><path class="lg1" d="M-4 0V9" stroke="#2a1606" stroke-width="3.4" stroke-linecap="round"/><path class="lg2" d="M4 0V9" stroke="#2a1606" stroke-width="3.4" stroke-linecap="round"/></g></svg>`;
}
// Operarios quietos en el camino, para dar vida a la parte baja
function fillLane(){ const l=document.querySelector('.g-lane'); if(!l) return; const m=WONDERS[level].mat; l.querySelectorAll('.idle').forEach(e=>e.remove()); [12,38,64,88].forEach((p,i)=>{ const d=document.createElement('div'); d.className='idle'; d.style.left=p+'%'; d.style.animationDelay=(i*0.35)+'s'; d.innerHTML=workerSVG(m); l.appendChild(d); }); }
function fxLayer(){ let l=document.getElementById('fx-layer'); if(!l){ l=document.createElement('div'); l.id='fx-layer'; document.body.appendChild(l); } return l; }

// Lleva un bloque desde la roca rota hasta el solar y, al llegar, coloca la siguiente etapa de la maravilla.
function deliverBlock(fromEl, mat, delayMs){
  pendingDeliveries++;
  const layer=fxLayer(), site=document.getElementById('site-scene'), board=document.getElementById('board');
  const fr=fromEl?fromEl.getBoundingClientRect():board.getBoundingClientRect();
  const sr=site.getBoundingClientRect(), br=board.getBoundingClientRect();
  const el=document.createElement('div'); el.className='carrier'; el.innerHTML=workerSVG(mat);
  const W=34,H=58, x0=fr.left+fr.width/2-W/2, y0=fr.top+fr.height/2-H/2;
  // La etapa que le toca a este bloque se fija al salir, para que lleguen en orden
  const stageIdx=Math.min(WONDERS[level].stages-1, deliveredIdx++);
  const wide=window.matchMedia('(min-width: 900px)').matches;
  const groundY=wide? Math.max(br.bottom, sr.bottom)-H+4 : br.bottom+6;       // suelo por el que andan
  const dockX=sr.left+sr.width*0.5-W/2, dockY=wide? groundY : sr.bottom-H-6;
  el.style.cssText=`left:${x0}px;top:${y0}px;width:${W}px;height:${H}px`;
  layer.appendChild(el);
  const dist=Math.abs(dockX-x0)+Math.abs(dockY-groundY);
  const walk=Math.min(2600,Math.max(800,dist/0.34));
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return new Promise(res=>{
    const done=()=>{ el.remove(); placeStage(stageIdx); spawnDust(dockX+W/2,dockY+H-8); pendingDeliveries--; res(); };
    if(reduce){ setTimeout(done,150+delayMs); return; }
    const seq=[
      {t:`translate(0px,0px)`, d:0},
      {t:`translate(${(dockX-x0)*0.08}px,${(groundY-y0)-16}px)`, d:260},
      {t:`translate(${(dockX-x0)*0.12}px,${groundY-y0}px)`, d:160},
      {t:`translate(${dockX-x0}px,${dockY-y0}px)`, d:walk},
    ];
    let t=0; const total=seq.reduce((s,k)=>s+k.d,0);
    const frames=seq.map(k=>{ t+=k.d; return {transform:k.t, offset:Math.min(1,t/total)}; });
    el.classList.add('walking');
    const anim=el.animate(frames,{duration:total,delay:delayMs,easing:'linear',fill:'both'});
    anim.onfinish=done;
  });
}
function spawnDust(x,y){
  const layer=fxLayer();
  for(let i=0;i<7;i++){ const d=document.createElement('i'); d.className='dust'; d.style.left=(x+(Math.random()-.5)*26)+'px'; d.style.top=(y+(Math.random()-.5)*8)+'px'; d.style.setProperty('--dx',((Math.random()-.5)*40)+'px'); layer.appendChild(d); setTimeout(()=>d.remove(),700); }
}
function waitDeliveries(){ return new Promise(res=>{ const t=setInterval(()=>{ if(pendingDeliveries<=0){ clearInterval(t); res(); } },80); }); }

// Se llama cuando se rompen rocas: el material se recoge y los operarios lo llevan
function collectBroken(broken){
  let d=0;
  broken.forEach(b=>{
    const el=cellDom[b.r]?.[b.c];
    matsGot[b.mat]=(matsGot[b.mat]||0)+b.blocks;
    rocksLeft--;
    wonderProg+=b.blocks;
    for(let i=0;i<b.blocks;i++){ deliverBlock(el,b.mat,d); d+=280; }
    log(`${MATERIALS[b.mat].name} +${b.blocks}`,'gold');
  });
}
