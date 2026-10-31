// WONDER IV — Efectos y reacciones: partículas en un canvas, ondas, rayos, confeti, mensajes de combo,
// sacudidas de pantalla y globitos de los obreros. Con «reducir movimiento» solo quedan los mensajes.

const FX=(function(){
  let cv=null, g=null, parts=[], raf=0, dpr=1;
  const reduced=()=>document.body.classList.contains('reduce-motion')||(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const rand=(a,b)=>a+Math.random()*(b-a);

  function canvas(){
    if(cv) return;
    cv=document.createElement('canvas'); cv.id='fx-canvas'; document.body.appendChild(cv); g=cv.getContext('2d');
    const fit=()=>{ dpr=Math.min(2,window.devicePixelRatio||1); cv.width=Math.floor(innerWidth*dpr); cv.height=Math.floor(innerHeight*dpr); };
    fit(); window.addEventListener('resize',fit);
  }
  function add(p){ canvas(); parts.push(p); if(!raf) raf=requestAnimationFrame(loop); }

  function loop(ts){
    const dt=Math.min(0.05,((ts-(loop.last||ts))/1000)||0.016); loop.last=ts;
    g.setTransform(dpr,0,0,dpr,0,0); g.clearRect(0,0,innerWidth,innerHeight);
    for(let i=parts.length-1;i>=0;i--){
      const p=parts[i]; p.age+=dt; const k=p.age/p.life;
      if(k>=1){ parts.splice(i,1); continue; }
      if(p.kind==='ring'){
        g.globalAlpha=(1-k)*0.8; g.strokeStyle=p.color; g.lineWidth=p.w*(1-k)+1; g.beginPath(); g.arc(p.x,p.y,p.r0+(p.r1-p.r0)*Math.pow(k,0.6),0,7); g.stroke(); continue;
      }
      if(p.kind==='beam'){
        g.globalAlpha=(1-k); g.strokeStyle=p.color; g.lineWidth=p.w*(1-k)+1; g.lineCap='round'; g.shadowColor=p.color; g.shadowBlur=14;
        g.beginPath(); g.moveTo(p.x,p.y); g.lineTo(p.x2,p.y2); g.stroke(); g.shadowBlur=0; continue;
      }
      p.vy+=p.grav*dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vx*=p.drag; p.rot+=p.vr*dt;
      g.globalAlpha=p.kind==='confetti'?Math.min(1,(1-k)*2):(1-k);
      g.save(); g.translate(p.x,p.y); g.rotate(p.rot); g.fillStyle=p.color;
      const s=p.size*(p.kind==='dust'?(1+k):(1-k*0.4));
      if(p.kind==='star'){ g.beginPath(); for(let j=0;j<8;j++){ const a=j*Math.PI/4, r=j%2?s*0.35:s; g.lineTo(Math.cos(a)*r,Math.sin(a)*r); } g.closePath(); g.fill(); }
      else if(p.kind==='confetti'){ g.scale(1,Math.abs(Math.sin(p.age*p.spin))); g.fillRect(-s,-s*0.6,s*2,s*1.2); }
      else if(p.kind==='dust'){ g.beginPath(); g.arc(0,0,s,0,7); g.fill(); }
      else g.fillRect(-s/2,-s/2,s,s);
      g.restore();
    }
    g.globalAlpha=1;
    if(parts.length) raf=requestAnimationFrame(loop); else { raf=0; loop.last=0; g.clearRect(0,0,innerWidth,innerHeight); }
  }

  // ── Efectos ──
  function burst(x,y,color,n=8,o={}){
    if(reduced()) return;
    for(let i=0;i<n;i++){ const a=rand(0,Math.PI*2), sp=rand(o.min||60,o.max||190);
      add({kind:o.kind||(Math.random()<0.4?'star':'spark'),x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-(o.up||40),grav:o.grav??380,drag:0.985,rot:rand(0,6),vr:rand(-8,8),size:rand(o.s0||3,o.s1||7),life:rand(0.45,o.life||0.9),age:0,color:Array.isArray(color)?color[i%color.length]:color}); }
  }
  function dust(x,y,n=7,color='rgba(226,206,160,.85)'){
    if(reduced()) return;
    for(let i=0;i<n;i++) add({kind:'dust',x:x+rand(-14,14),y:y+rand(-4,4),vx:rand(-50,50),vy:rand(-60,-10),grav:-20,drag:0.97,rot:0,vr:0,size:rand(4,9),life:rand(0.5,0.9),age:0,color});
  }
  function ring(x,y,color='#ffd060',r1=90,w=6){ if(reduced()) return; add({kind:'ring',x,y,r0:6,r1,w,life:0.55,age:0,color}); }
  function beam(x1,y1,x2,y2,color='#7fe8ff'){ if(reduced()) return; add({kind:'beam',x:x1,y:y1,x2,y2,w:10,life:0.45,age:0,color}); }
  function confetti(n=140){
    if(reduced()) return; const cols=['#f2d27a','#e8502a','#3a64d8','#22b8a8','#e05a98','#4aa84a','#fff6d8'];
    for(let i=0;i<n;i++) add({kind:'confetti',x:rand(0,innerWidth),y:rand(-80,-10),vx:rand(-60,60),vy:rand(60,200),grav:140,drag:0.995,rot:rand(0,6),vr:rand(-5,5),spin:rand(4,9),size:rand(4,8),life:rand(2.2,3.6),age:0,color:cols[i%cols.length]});
  }
  function rain(x,y,w,color){ if(reduced()) return; for(let i=0;i<26;i++) add({kind:'star',x:x+rand(-w/2,w/2),y:y-rand(0,40),vx:rand(-20,20),vy:rand(40,160),grav:120,drag:0.99,rot:rand(0,6),vr:rand(-3,3),size:rand(3,7),life:rand(0.7,1.3),age:0,color}); }

  function center(r,c){ const el=(typeof getCell==='function')?getCell(r,c):null; if(!el) return null; const b=el.getBoundingClientRect(); return {x:b.left+b.width/2,y:b.top+b.height/2,w:b.width}; }
  function boardCenter(){ const b=document.getElementById('board'); if(!b) return {x:innerWidth/2,y:innerHeight/2,w:300}; const r=b.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width}; }

  // ── Mensajes ──
  const CALLS=[null,null,'¡BIEN!','¡GENIAL!','¡INCREÍBLE!','¡LEGENDARIO!'];
  function callout(text,cls=''){
    const host=document.getElementById('screen-game'); if(!host) return;
    host.querySelectorAll('.callout').forEach(e=>e.remove());
    const e=document.createElement('div'); e.className='callout '+cls; e.textContent=text;
    const b=boardCenter(); e.style.left=b.x+'px'; e.style.top=(b.y-b.w*0.34)+'px';
    document.body.appendChild(e); setTimeout(()=>e.remove(),1200);
  }
  function comboCall(n){ const t=CALLS[Math.min(5,n)]; if(t) callout(t,'c'+Math.min(5,n)); }

  function shake(ms=320,amp=1){
    if(reduced()) return; const el=document.getElementById('screen-game'); if(!el) return;
    el.style.setProperty('--amp',amp); el.classList.remove('shaking'); void el.offsetWidth; el.classList.add('shaking'); setTimeout(()=>el.classList.remove('shaking'),ms);
  }

  // ── Obreros: reacciones ──
  const PHRASES={ cheer:['¡Bien hecho!','¡Aúpa!','¡Otro más!','¡Qué piedra!','¡Eso es!','¡Sigue así!','¡Esa es buena!'], win:['¡Lo logramos!','¡Qué obra!','¡Mirad eso!'], lose:['Mañana será otro día…','Se acabó el jornal…'], big:['¡Menudo golpe!','¡Cuidado con eso!','¡Madre mía!'] };
  function bubble(x,y,text,cls=''){
    const e=document.createElement('div'); e.className='bubble '+cls; e.textContent=text; e.style.left=Math.max(80,Math.min(innerWidth-80,x))+'px'; e.style.top=y+'px';
    document.body.appendChild(e); setTimeout(()=>e.remove(),1900);
  }
  function lane(){ return [...document.querySelectorAll('.g-lane .idle')]; }
  function cheer(kind='cheer',all=false,say=true){
    const ws=lane(); if(!ws.length) return;
    const pick=all?ws:[ws[Math.floor(Math.random()*ws.length)]];
    pick.forEach((w,i)=>{ if(!reduced()){ w.classList.remove('hop'); void w.offsetWidth; w.classList.add('hop'); setTimeout(()=>w.classList.remove('hop'),700); }
      if(say&&(i===0)){ const b=w.getBoundingClientRect(); const list=PHRASES[kind]; bubble(b.left+b.width/2,b.top-4,list[Math.floor(Math.random()*list.length)]); } });
    if(kind!=='lose') Snd.play('cheer');
  }
  return { burst, dust, ring, beam, confetti, rain, center, boardCenter, callout, comboCall, shake, bubble, cheer, reduced };
})();
