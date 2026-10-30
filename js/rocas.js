const ROCK_EXIT_ROW=ROWS-2;   // fila a partir de la cual un bloque sale del tablero
// WONDER IV — Bloques de material dentro del tablero y operarios que los recogen.
// Un bloque no se mueve ni se combina: cae a medida que se despeja lo que tiene debajo. Al llegar abajo sale del tablero,
// cae al suelo y un operario aparece, anda hasta él y se lo lleva a la maravilla.

function isRock(t){ return !!t && t.kind==='rock'; }

// ── Aspecto del bloque (SVG por material) ──
function rockSVG(mat,blocks){
  const m=MATERIALS[mat]||MATERIALS.piedra, id='rk'+mat+blocks;
  return `<svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${m.c1}"/><stop offset="0.5" stop-color="${m.c2}"/><stop offset="1" stop-color="${m.c3}"/></linearGradient></defs>
  <path d="M5 11L13 4H41L48 11V42L41 49H13L5 42Z" fill="${m.c3}" transform="translate(0 2)" opacity="0.5"/>
  <path d="M5 11L13 4H41L48 11V42L41 49H13L5 42Z" fill="url(#${id})" stroke="#2a1606" stroke-width="2" stroke-linejoin="round"/>
  <path d="M10 14L15 9H37" fill="none" stroke="#fff" stroke-width="2" opacity="0.5" stroke-linecap="round"/>
  <path d="M8 26H44M26 8V26M16 26V46M36 26V46" fill="none" stroke="#2a1606" stroke-width="1.4" opacity="0.4"/>
  ${blocks>1?`<path d="M5 11L13 4H41L48 11V42L41 49H13L5 42Z" fill="none" stroke="#f2d27a" stroke-width="2" transform="translate(26 26) scale(0.84) translate(-26 -26)"/><g fill="#2a1606" opacity="0.75"><circle cx="11" cy="15" r="2"/><circle cx="41" cy="15" r="2"/><circle cx="11" cy="39" r="2"/><circle cx="41" cy="39" r="2"/></g><text x="26" y="33" text-anchor="middle" font-family="Cinzel,Georgia,serif" font-weight="900" font-size="17" fill="#fff6d8" stroke="#2a1606" stroke-width="2.4" paint-order="stroke">×${blocks}</text>`:''}
  </svg>`;
}

// ── Colocación inicial: distribución distinta (y simétrica) por maravilla, en las filas centrales ──
function placeRocks(w){
  let seed=(level+1)*7919+13; const rnd=()=>{ seed=(seed*16807)%2147483647; return seed/2147483647; };
  const free=[]; for(let r=1;r<=4;r++) for(let c=0;c<=3;c++) free.push([r,c]);
  for(let i=free.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [free[i],free[j]]=[free[j],free[i]]; }
  const spots=[];
  for(const [r,c] of free){ if(spots.length>=w.rocks.length) break; const mc=COLS-1-c; if(c===mc){ spots.push([r,c]); } else if(spots.length+2<=w.rocks.length){ spots.push([r,c]); spots.push([r,mc]); } }
  while(spots.length<w.rocks.length){ spots.push([2+spots.length%3,3]); }
  const order=[...w.rocks].sort(()=>rnd()-.5);
  spots.slice(0,w.rocks.length).forEach(([r,c],i)=>{ board[r][c]={t:-1,kind:'rock',mat:w.mat,blocks:order[i]}; });
}

// ── Salida del tablero ──
// Dado el conjunto de celdas que se van a quitar, añade los bloques que, tras caer, llegan a la fila de abajo.
// Devuelve la lista de bloques que salen (con su posición actual) y ajusta el conjunto.
function markExits(removeSet){
  const exits=[]; const key=(r,c)=>r*COLS+c;
  for(let guard=0;guard<ROWS;guard++){
    let found=false;
    for(let c=0;c<COLS;c++){
      let empties=0;
      for(let r=ROWS-1;r>=0;r--){
        if(removeSet.has(key(r,c))){ empties++; continue; }
        const t=board[r][c];
        if(isRock(t)&&r+empties>=ROCK_EXIT_ROW){ removeSet.add(key(r,c)); exits.push({r,c,tile:t}); found=true; break; }
      }
    }
    if(!found) break;
  }
  return exits;
}

// ── Operarios ──
// Figura articulada vista de lado, mirando a la derecha. Las articulaciones giran por CSS (css/nivel.css).
const WORKER_LOOKS=[
  {skin:'#d9a27a',skinD:'#b87f58',tunic:'#efe6cf',tunicD:'#c9bb98',band:'#b8442a',hair:'#2a1a10',belt:'#8a5a28'},
  {skin:'#c58a62',skinD:'#a06a46',tunic:'#d9a85a',tunicD:'#a8782a',band:'#2a56a8',hair:'#1a100a',belt:'#5a3a18'},
  {skin:'#e6b48c',skinD:'#c28e68',tunic:'#b8c8a0',tunicD:'#889870',band:'#8a2a2a',hair:'#5a3a22',belt:'#6a4620'},
  {skin:'#b57a52',skinD:'#905a38',tunic:'#e8d4b4',tunicD:'#b89c78',band:'#e0b030',hair:'#140c08',belt:'#7a4a22'},
];
function workerRig(mat,v){
  const k=WORKER_LOOKS[v%WORKER_LOOKS.length], m=MATERIALS[mat]||MATERIALS.piedra, id='wr'+v+mat;
  return `<svg class="wrig" viewBox="0 0 70 104" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
    <linearGradient id="${id}t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${k.tunicD}"/><stop offset="0.45" stop-color="${k.tunic}"/><stop offset="1" stop-color="${k.tunicD}"/></linearGradient>
    <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${k.skinD}"/><stop offset="0.5" stop-color="${k.skin}"/><stop offset="1" stop-color="${k.skinD}"/></linearGradient>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="${m.c1}"/><stop offset="0.5" stop-color="${m.c2}"/><stop offset="1" stop-color="${m.c3}"/></linearGradient>
  </defs>
  <ellipse class="wsh" cx="35" cy="100" rx="17" ry="3.4" fill="#000" opacity="0.28"/>
  <!-- pierna y brazo de atrás -->
  <g class="w-thigh-b"><path d="M31 54L28 74L34 74L37 54Z" fill="url(#${id}s)" stroke="#3a2210" stroke-width="1" opacity="0.82"/>
    <g class="w-shin-b"><path d="M28.4 73L28 92L33.4 92L34.2 73Z" fill="url(#${id}s)" stroke="#3a2210" stroke-width="1" opacity="0.82"/><path d="M26 91L35.5 91L38 96.5L24.5 96.5Z" fill="#6a4a28" stroke="#2a1608" stroke-width="1"/></g></g>
  <g class="w-arm-b"><path d="M33 28L28 42L33 43L37 29Z" fill="url(#${id}s)" stroke="#3a2210" stroke-width="1" opacity="0.82"/>
    <g class="w-fore-b"><path d="M28.4 41L27 55L32 56L33.4 42Z" fill="url(#${id}s)" stroke="#3a2210" stroke-width="1" opacity="0.82"/><ellipse cx="29.6" cy="57" rx="3" ry="3.2" fill="${k.skin}" stroke="#3a2210" stroke-width="1"/></g></g>
  <!-- torso: túnica con cinturón -->
  <path d="M25 27Q35 22 45 27L47 52L50 64L20 64L23 52Z" fill="url(#${id}t)" stroke="#4a3418" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M23 52Q35 56 47 52L47.5 57Q35 61 22.5 57Z" fill="${k.belt}" stroke="#2a1608" stroke-width="1"/>
  <path d="M28 33Q32 40 31 50M38 31Q41 40 40 50M26 58L25 64M33 59L33 64M41 58L42 64" fill="none" stroke="${k.tunicD}" stroke-width="1" opacity="0.8"/>
  <path d="M25 27Q35 22 45 27" fill="none" stroke="#fff" stroke-width="1.4" opacity="0.35"/>
  <!-- cuello y cabeza -->
  <path d="M32 22L32 28L40 28L40 21Z" fill="url(#${id}s)" stroke="#3a2210" stroke-width="1"/>
  <g class="w-head"><ellipse cx="37" cy="14" rx="9.5" ry="10.8" fill="url(#${id}s)" stroke="#3a2210" stroke-width="1.2"/>
    <path d="M46 13Q50 15 46.4 18.4" fill="url(#${id}s)" stroke="#3a2210" stroke-width="1.1"/>
    <path d="M27.8 11Q28 1.6 38 2.4Q47.2 3.4 46.6 11Q41 7.6 33.4 9Z" fill="${k.hair}" stroke="#1a0c04" stroke-width="1"/>
    <path d="M27.6 10.4Q37 8 46.6 10.6L46.8 14Q37 11.6 27.8 14Z" fill="${k.band}" stroke="#2a1008" stroke-width="1"/>
    <path d="M30 14Q33 21 38 21" fill="none" stroke="${k.skinD}" stroke-width="0.9" opacity="0.7"/>
    <ellipse cx="42.6" cy="15" rx="1.3" ry="1.6" fill="#1a0c04"/><path d="M40.4 12.4Q43 11.4 45 12.6" fill="none" stroke="#2a1608" stroke-width="1"/>
    <path d="M41 21Q43.5 21.6 45.4 20.6" fill="none" stroke="#6a2a1a" stroke-width="1" stroke-linecap="round"/>
    <ellipse cx="31.4" cy="15.4" rx="1.9" ry="2.6" fill="${k.skinD}" stroke="#3a2210" stroke-width="0.8"/></g>
  <!-- pierna y brazo de delante -->
  <g class="w-thigh-f"><path d="M34 54L31 74L37.5 74L40 54Z" fill="url(#${id}s)" stroke="#3a2210" stroke-width="1"/>
    <g class="w-shin-f"><path d="M31.4 73L31 92L36.6 92L37.4 73Z" fill="url(#${id}s)" stroke="#3a2210" stroke-width="1"/><path d="M29 91L38.5 91L41 96.5L27.5 96.5Z" fill="#7a5630" stroke="#2a1608" stroke-width="1"/><path d="M31 85H37M31 88H37" stroke="#4a3018" stroke-width="0.9"/></g></g>
  <g class="w-arm-f"><path d="M38 28L36 42L41.5 43L44 29Z" fill="url(#${id}s)" stroke="#3a2210" stroke-width="1"/>
    <g class="w-fore-f"><path d="M36.4 41L36.5 55L41.8 55.6L42 42Z" fill="url(#${id}s)" stroke="#3a2210" stroke-width="1"/><ellipse cx="39.4" cy="57.2" rx="3.2" ry="3.4" fill="${k.skin}" stroke="#3a2210" stroke-width="1"/></g></g>
  <!-- bloque que lleva a la espalda -->
  <g class="w-load"><rect x="14" y="22" width="26" height="22" rx="3" fill="url(#${id}b)" stroke="#2a1606" stroke-width="1.6"/><path d="M18 27H34" stroke="#fff" stroke-width="1.6" opacity="0.5" stroke-linecap="round"/><path d="M14 33H40M27 22V33" stroke="#2a1606" stroke-width="1" opacity="0.4"/></g>
  </svg>`;
}
function fxLayer(){ let l=document.getElementById('fx-layer'); if(!l){ l=document.createElement('div'); l.id='fx-layer'; document.body.appendChild(l); } return l; }
function laneRect(){ const l=document.querySelector('.g-lane'); return l?l.getBoundingClientRect():{left:0,right:innerWidth,top:innerHeight-62,bottom:innerHeight,width:innerWidth,height:62}; }
function groundFeetY(){ const r=laneRect(); return r.top+r.height*0.80; }

// Operarios descansando en el camino
function fillLane(){
  const l=document.querySelector('.g-lane'); if(!l) return;
  l.querySelectorAll('.idle').forEach(e=>e.remove());
  const m=WONDERS[level].mat;
  [18,52,84].forEach((p,i)=>{ const d=document.createElement('div'); d.className='idle'; d.style.left=p+'%'; d.style.animationDelay=(i*0.5)+'s'; d.innerHTML=workerRig(m,i+1); l.appendChild(d); });
}

const W_W=50, W_H=74, B_S=32;
function mkEl(cls,html,x,y,w,h){ const e=document.createElement('div'); e.className=cls; e.innerHTML=html; e.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${h}px`; fxLayer().appendChild(e); return e; }
function anim(el,frames,opts){ return new Promise(res=>{ const a=el.animate(frames,{fill:'forwards',...opts}); a.onfinish=()=>res(); }); }

// Un bloque sale por abajo del tablero: cae al suelo, aparece un operario, anda hasta él, lo coge y lo lleva a la maravilla.
async function deliverBlock(fromRect, mat, delayMs, variant){
  pendingDeliveries++;
  const stageIdx=Math.min(WONDERS[level].stages-1, deliveredIdx++);
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const feet=groundFeetY();
  const bx=fromRect.left+fromRect.width/2-B_S/2;
  const site=document.getElementById('site-scene');
  const sr=site?site.getBoundingClientRect():{left:60,width:300};
  const dockX=sr.left+sr.width*0.5-W_W/2;
  if(delayMs) await new Promise(r=>setTimeout(r,delayMs));
  // 1) el bloque cae al suelo
  const blk=mkEl('fall-block',rockSVG(mat,1),fromRect.left+fromRect.width/2-B_S/2,fromRect.top+fromRect.height/2-B_S/2,B_S,B_S);
  const groundTop=feet-B_S+4;
  if(reduce){ blk.style.top=groundTop+'px'; }
  else await anim(blk,[{transform:'translateY(0) rotate(0deg)'},{transform:`translateY(${groundTop-(fromRect.top+fromRect.height/2-B_S/2)}px) rotate(14deg)`,offset:.7},{transform:`translateY(${groundTop-(fromRect.top+fromRect.height/2-B_S/2)-8}px) rotate(8deg)`,offset:.85},{transform:`translateY(${groundTop-(fromRect.top+fromRect.height/2-B_S/2)}px) rotate(10deg)`}],{duration:520,easing:'cubic-bezier(.5,0,.9,.5)'});
  spawnDust(bx+B_S/2,feet);
  // 2) aparece un operario a un lado y anda hasta el bloque
  const fromLeft=bx>innerWidth/2?false:true;
  const startX=fromLeft? bx-170 : bx+170;
  const w=mkEl('worker walking',workerRig(mat,variant),startX,feet-W_H,W_W,W_H);
  w.classList.toggle('face-left',!fromLeft);
  if(reduce){ w.style.left=(bx-W_W/2+B_S/2)+'px'; }
  else{
    w.style.opacity='0';
    await anim(w,[{opacity:0,transform:'translateX(0)'},{opacity:1,transform:'translateX(0)',offset:.12},{opacity:1,transform:`translateX(${bx+B_S/2-W_W/2-startX}px)`}],{duration:Math.max(500,Math.abs(bx-startX)/0.2),easing:'linear'});
  }
  // 3) lo coge
  w.classList.remove('walking'); w.classList.add('lifting');
  if(!reduce) await new Promise(r=>setTimeout(r,520));
  blk.remove(); w.classList.remove('lifting'); w.classList.add('loaded','walking','face-left');
  const cx=parseFloat(getComputedStyle(w).left)+ (reduce?0:(bx+B_S/2-W_W/2-startX));
  // 4) lo lleva a la maravilla (a la izquierda)
  if(!reduce){
    const here=bx+B_S/2-W_W/2;
    await anim(w,[{transform:'translateX(0)'},{transform:`translateX(${dockX-here}px)`}],{duration:Math.max(700,Math.abs(dockX-here)/0.16),easing:'linear',composite:'replace'}).catch(()=>{});
  }
  w.classList.remove('walking');
  placeStage(stageIdx); spawnDust(dockX+W_W/2,feet);
  // 5) el operario se va
  w.classList.remove('loaded'); w.classList.add('walking');
  if(!reduce) await anim(w,[{opacity:1},{opacity:0}],{duration:600,delay:200});
  w.remove(); pendingDeliveries--;
}
function spawnDust(x,y){
  const layer=fxLayer();
  for(let i=0;i<7;i++){ const d=document.createElement('i'); d.className='dust'; d.style.left=(x+(Math.random()-.5)*26)+'px'; d.style.top=(y+(Math.random()-.5)*8)+'px'; d.style.setProperty('--dx',((Math.random()-.5)*40)+'px'); layer.appendChild(d); setTimeout(()=>d.remove(),700); }
}
function waitDeliveries(){ return new Promise(res=>{ const t=setInterval(()=>{ if(pendingDeliveries<=0){ clearInterval(t); res(); } },80); }); }

// Se llama cuando uno o varios bloques salen del tablero. rects: posición en pantalla desde la que caen.
function collectExits(exits,rects){
  let d=0;
  exits.forEach((e,i)=>{
    const rect=rects[i]||boardBottomRect(e.c);
    matsGot[e.tile.mat]=(matsGot[e.tile.mat]||0)+e.tile.blocks;
    rocksLeft--; wonderProg+=e.tile.blocks;
    for(let k=0;k<e.tile.blocks;k++){ deliverBlock(rect,e.tile.mat,d,(e.c+k+deliveredIdx)%4); d+=520; }
    log(`${MATERIALS[e.tile.mat].name} +${e.tile.blocks}`,'gold');
  });
}
function boardBottomRect(c){ const b=document.getElementById('board').getBoundingClientRect(), m=boardMetrics(); return {left:b.left+m.left(c),top:b.bottom-m.size,width:m.size,height:m.size}; }
