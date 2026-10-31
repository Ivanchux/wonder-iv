// WONDER IV — Montón de bloques entregados al pie de la obra. Las maravillas son ilustraciones (img/maravillas).

// Bloques entregados: se apilan en el solar, al pie de la obra del fondo, como una pirámide de 5-4-3-2-1
let siteBuilt=0;
const PILE_ROWS=[5,4,3,2,1], PILE_B=40;
function pileSlot(k){
  let r=0, left=k; while(r<PILE_ROWS.length-1 && left>=PILE_ROWS[r]){ left-=PILE_ROWS[r]; r++; }
  const cap=PILE_ROWS[r], used=Math.min(cap, WONDERS[level].stages-PILE_ROWS.slice(0,r).reduce((a,b)=>a+b,0));
  return { x:((5-used)*PILE_B)/2+left*PILE_B, y:r*(PILE_B-6) };
}
function renderSite(){
  const box=document.getElementById('site-scene'); if(!box) return;
  box.innerHTML='';
  for(let k=0;k<Math.min(siteBuilt,WONDERS[level].stages);k++) addPileBlock(k,false);
}
function addPileBlock(k,drop){
  const box=document.getElementById('site-scene'); if(!box) return;
  const m=WONDERS[level].mat, {x,y}=pileSlot(k), im=document.createElement('img');
  im.className='pblock'+(drop?' drop':''); im.src=`img/bloques/bloque_${m}.png`; im.alt=''; im.draggable=false;
  im.style.cssText=`left:${x}px;bottom:${y}px;width:${PILE_B}px;height:${PILE_B}px;z-index:${k}`;
  box.appendChild(im);
  if(drop) setTimeout(()=>im.classList.remove('drop'),600);
}
function placeStage(k){
  if(k<siteBuilt) return;
  siteBuilt=k+1; addPileBlock(k,true);
}
