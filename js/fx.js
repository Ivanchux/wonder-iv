// WONDER IV — Efectos: partículas de fondo, canvas de escena y arte ASCII.

// ════════════════════════════════════════
//  PARTICLES
// ════════════════════════════════════════
const pc   = document.getElementById('particle-canvas');
const pctx = pc.getContext('2d');
let pnodes=[], pPulses=[];
function resizeParticles(){ pc.width=window.innerWidth; pc.height=window.innerHeight; }
function initParticles(){
  resizeParticles(); pnodes=[];
  const count=Math.floor((pc.width*pc.height)/13000);
  for(let i=0;i<count;i++) pnodes.push({
    x:Math.random()*pc.width, y:Math.random()*pc.height,
    vx:(Math.random()-0.5)*0.15, vy:(Math.random()-0.5)*0.15,
    r:Math.random()*1.6+0.3, bright:Math.random(), col:Math.floor(Math.random()*3)
  });
}
function tickParticles(){
  pctx.clearRect(0,0,pc.width,pc.height);
  const W=pc.width, H=pc.height, LINK=80;
  const cols=['rgba(255,170,0,','rgba(255,200,80,','rgba(200,130,0,'];
  pnodes.forEach(n=>{
    n.x+=n.vx; n.y+=n.vy;
    if(n.x<0)n.x=W; if(n.x>W)n.x=0; if(n.y<0)n.y=H; if(n.y>H)n.y=0;
    n.bright=0.3+0.25*Math.sin(Date.now()*0.0008+n.x*0.01);
    pctx.beginPath(); pctx.arc(n.x,n.y,n.r,0,Math.PI*2);
    pctx.fillStyle=cols[n.col]+n.bright*0.65+')'; pctx.fill();
  });
  for(let i=0;i<pnodes.length;i++){
    for(let j=i+1;j<pnodes.length;j++){
      const dx=pnodes[i].x-pnodes[j].x, dy=pnodes[i].y-pnodes[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<LINK){
        const a=(1-d/LINK)*0.18;
        pctx.beginPath(); pctx.moveTo(pnodes[i].x,pnodes[i].y); pctx.lineTo(pnodes[j].x,pnodes[j].y);
        pctx.strokeStyle=`rgba(255,170,0,${a})`; pctx.lineWidth=0.4; pctx.stroke();
      }
    }
  }
  pPulses=pPulses.filter(p=>p.life>0);
  pPulses.forEach(p=>{
    pctx.beginPath(); pctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    pctx.strokeStyle=`rgba(${p.cr},${p.cg},${p.cb},${p.life*0.55})`; pctx.lineWidth=1; pctx.stroke();
    p.r+=3; p.life-=0.04;
  });
  requestAnimationFrame(tickParticles);
}
function spawnPulse(x,y,cr=0,cg=229,cb=255){
  const r=document.getElementById('board-wrap').getBoundingClientRect();
  pPulses.push({x:r.left+x, y:r.top+y, r:4, life:1, cr,cg,cb});
}

// ════════════════════════════════════════
//  SCENE CANVAS (fondo del panel maravilla)
// ════════════════════════════════════════
const sc=document.getElementById('scene-canvas');
const sctx=sc.getContext('2d');
function drawSceneBg(){
  sc.width=sc.offsetWidth||300; sc.height=sc.offsetHeight||200;
  sctx.clearRect(0,0,sc.width,sc.height);
  // Grid base
  sctx.strokeStyle='rgba(255,170,0,0.04)'; sctx.lineWidth=0.5;
  const step=16;
  for(let x=0;x<sc.width;x+=step){ sctx.beginPath();sctx.moveTo(x,0);sctx.lineTo(x,sc.height);sctx.stroke(); }
  for(let y=0;y<sc.height;y+=step){ sctx.beginPath();sctx.moveTo(0,y);sctx.lineTo(sc.width,y);sctx.stroke(); }
  // Radial glow
  const grd=sctx.createRadialGradient(sc.width/2,sc.height/2,0,sc.width/2,sc.height/2,sc.width*0.7);
  grd.addColorStop(0,'rgba(255,170,0,0.06)');
  grd.addColorStop(1,'rgba(0,0,0,0)');
  sctx.fillStyle=grd; sctx.fillRect(0,0,sc.width,sc.height);
}

// ════════════════════════════════════════
//  ASCII
// ════════════════════════════════════════
function initAscii(){ asciiLines=WONDERS[level].ascii.slice(); asciiRevealed=0; renderAscii(); }
function revealAsciiLine(){
  if(asciiRevealed<asciiLines.length) asciiRevealed++;
  renderAscii();
  const el=document.getElementById('ascii-art');
  el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse');
}
function renderAscii(){
  const el=document.getElementById('ascii-art');
  const revealed=asciiLines.slice(0,asciiRevealed);
  const hidden=asciiLines.length-asciiRevealed;
  const dim=Array(hidden).fill('· · · · · · · · · · · · ·');
  el.textContent=[...revealed,...dim].join('\n');
}
