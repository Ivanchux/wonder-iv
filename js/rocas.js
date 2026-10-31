const ROCK_EXIT_ROW=ROWS-2;   // fila a partir de la cual un bloque sale del tablero
// WONDER IV — Bloques de material dentro del tablero y operarios que los recogen.
// Un bloque no se mueve ni se combina: cae a medida que se despeja lo que tiene debajo. Al llegar abajo sale del tablero,
// cae al suelo y un operario aparece, anda hasta él y se lo lleva a la maravilla.

function isRock(t){ return !!t && t.kind==='rock'; }

// ── Aspecto del bloque (SVG por material) ──
function rockSVG(mat,blocks){
  const badge=blocks>1?`<text x="50" y="62" text-anchor="middle" font-family="Cinzel,Georgia,serif" font-weight="900" font-size="34" fill="#fff6d8" stroke="#2a1606" stroke-width="5" paint-order="stroke">×${blocks}</text>`:'';
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><image href="img/bloques/bloque_${mat}.png" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid meet"/>${badge}</svg>`;
}

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
// Cuatro personajes (a, b, c, d) con hojas de animación en img/obreros (js/sprites.js tiene las medidas).
// Caminar sin carga: <p>_walk. Con bloque en brazos: <p>_carry_<material>. Solo el personaje «a» tiene todos los materiales.
const WORKER_KINDS=['a','b','c','d'];
function carryKey(v,mat){ const k=WORKER_KINDS[v%WORKER_KINDS.length]; return SPRITES[`${k}_carry_${mat}`]?`${k}_carry_${mat}`:`${k}_carry_piedra`; }
function pickWorker(mat,n){ return (mat==='piedra')?(n%WORKER_KINDS.length):0; }
function sprSize(key,H){ const s=SPRITES[key]; return {w:Math.round(s.w*H/s.h),h:H}; }
function sprHTML(key,H,dur){ const s=SPRITES[key], z=sprSize(key,H);
  return `<div class="spr" style="width:${z.w}px;height:${H}px;background-image:url(img/obreros/${key}.png);background-size:${z.w*s.n}px ${H}px;--end:${-z.w*s.n}px;--dur:${dur||0.8}s"></div>`; }
function preloadSprites(){ Object.keys(SPRITES).forEach(k=>{ const i=new Image(); i.src=`img/obreros/${k}.png`; }); }
function fxLayer(){ let l=document.getElementById('fx-layer'); if(!l){ l=document.createElement('div'); l.id='fx-layer'; document.body.appendChild(l); } return l; }
function laneRect(){ const l=document.querySelector('.g-lane'); return l?l.getBoundingClientRect():{left:0,right:innerWidth,top:innerHeight-62,bottom:innerHeight,width:innerWidth,height:62}; }
function groundFeetY(){ const r=laneRect(); return r.top+r.height*0.80; }

// Operarios en el camino: uno parado y otros tres que pasean despacio de un lado a otro
function fillLane(){
  const l=document.querySelector('.g-lane'); if(!l) return;
  l.querySelectorAll('.idle').forEach(e=>e.remove());
  const H=66, set=[['a_idle',16,0,1.9],['b_walk',34,1,1.0],['c_walk',58,2,1.1],['d_walk',82,3,0.95]];
  set.forEach(([key,pos,i,dur])=>{ const d=document.createElement('div'); d.className='idle'+(key==='a_idle'?' still':' pacer'); d.style.left=pos+'%'; d.style.animationDelay=(-i*3.3)+'s'; d.innerHTML=sprHTML(key,H,dur); l.appendChild(d); });
}

const W_H=92, B_S=32;
function mkEl(cls,html,x,y,w,h){ const e=document.createElement('div'); e.className=cls; e.innerHTML=html; e.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${h}px`; fxLayer().appendChild(e); return e; }
function anim(el,frames,opts){ return new Promise(res=>{ const a=el.animate(frames,{fill:'forwards',...opts}); a.onfinish=()=>res(); }); }

// Un bloque sale por abajo del tablero: cae al suelo, aparece un operario, anda hasta él, lo coge y lo lleva a la maravilla.
async function deliverBlock(fromRect, mat, delayMs, variant){
  pendingDeliveries++;
  const stageIdx=Math.min(WONDERS[level].stages-1, deliveredIdx++);
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const feet=groundFeetY();
  const bx=fromRect.left+fromRect.width/2;            // centro del bloque
  const site=document.getElementById('site-scene');
  const sr=site?site.getBoundingClientRect():{left:60,width:300};
  const dockC=sr.left+sr.width*0.5;                    // centro del solar
  if(delayMs) await new Promise(r=>setTimeout(r,delayMs));
  // 1) el bloque cae al suelo
  const blk=mkEl('fall-block',rockSVG(mat,1),bx-B_S/2,fromRect.top+fromRect.height/2-B_S/2,B_S,B_S);
  const groundTop=feet-B_S+4, dy=groundTop-(fromRect.top+fromRect.height/2-B_S/2);
  if(reduce){ blk.style.top=groundTop+'px'; }
  else await anim(blk,[{transform:'translateY(0) rotate(0deg)'},{transform:`translateY(${dy}px) rotate(14deg)`,offset:.7},{transform:`translateY(${dy-8}px) rotate(8deg)`,offset:.85},{transform:`translateY(${dy}px) rotate(10deg)`}],{duration:520,easing:'cubic-bezier(.5,0,.9,.5)'});
  spawnDust(bx,feet);
  // 2) aparece un operario a un lado y anda hasta el bloque
  const fromLeft=bx<=innerWidth/2;
  const walk=sprSize(WORKER_KINDS[variant%4]+'_walk',W_H);
  const startC=fromLeft? bx-190 : bx+190;
  const w=mkEl('worker',sprHTML(WORKER_KINDS[variant%4]+'_walk',W_H,0.8),startC-walk.w/2,feet-W_H,walk.w,W_H);
  w.classList.toggle('face-left',!fromLeft);
  const setC=c=>{ w.style.left=(c-parseFloat(w.style.width)/2)+'px'; };
  if(reduce) setC(bx);
  else{
    w.style.opacity='0';
    await anim(w,[{opacity:0,transform:'translateX(0)'},{opacity:1,transform:'translateX(0)',offset:.12},{opacity:1,transform:`translateX(${bx-startC}px)`}],{duration:Math.max(500,Math.abs(bx-startC)/0.2),easing:'linear'});
    setC(bx); w.getAnimations().forEach(a=>a.cancel()); w.style.opacity='1';
  }
  // 3) se agacha, coge el bloque y se lo lleva en brazos hacia la maravilla
  const carry=carryKey(variant,mat), cz=sprSize(carry,W_H);
  if(!reduce){ w.classList.add('paused'); await anim(w,[{transform:'scaleY(1)'},{transform:'scaleY(.9)'},{transform:'scaleY(1)'}],{duration:420,easing:'ease-in-out'}); w.getAnimations().forEach(a=>a.cancel()); w.classList.remove('paused'); }
  blk.remove();
  const goLeft=dockC<bx;
  w.innerHTML=sprHTML(carry,W_H,0.85); w.style.width=cz.w+'px'; w.classList.toggle('face-left',goLeft); setC(bx);
  // 4) lo lleva a la maravilla
  if(!reduce) await anim(w,[{transform:'translateX(0)'},{transform:`translateX(${dockC-bx}px)`}],{duration:Math.max(700,Math.abs(dockC-bx)/0.15),easing:'linear'});
  w.style.left=(dockC-cz.w/2)+'px'; w.getAnimations().forEach(a=>a.cancel());
  placeStage(stageIdx); spawnDust(dockC,feet);
  // 5) deja el bloque y se va
  const back=WORKER_KINDS[variant%4]+'_walk', bz=sprSize(back,W_H);
  w.innerHTML=sprHTML(back,W_H,0.8); w.style.width=bz.w+'px'; setC(dockC); w.classList.toggle('face-left',!goLeft);
  if(!reduce) await anim(w,[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:`translateX(${goLeft?-60:60}px)`}],{duration:900,delay:150,easing:'linear'});
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
    for(let k=0;k<e.tile.blocks;k++){ deliverBlock(rect,e.tile.mat,d,pickWorker(e.tile.mat,e.c+k+deliveredIdx)); d+=520; }
    log(`${MATERIALS[e.tile.mat].name} +${e.tile.blocks}`,'gold');
  });
}
function boardBottomRect(c){ const b=document.getElementById('board').getBoundingClientRect(), m=boardMetrics(); return {left:b.left+m.left(c),top:b.bottom-m.size,width:m.size,height:m.size}; }
