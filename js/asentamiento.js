// WONDER IV — Menú: el asentamiento. Las maravillas se levantan en el mapa según las vas completando
// y los edificios básicos se mejoran con los materiales que entregan los operarios.

const WONDER_SPOTS=[[170,335],[370,445],[570,335],[770,445],[970,335],[1170,445],[1370,335]];   // centro y pie de cada maravilla (viewBox 1600×900, sobre img/mapa_asentamiento.jpg)
const BUILD_SPOTS=[[70,640],[370,640],[670,640],[970,640],[1270,640]];
const WS=210, BS_W=210, BS_H=158;

// ── Edificios (viewBox local 200×150) ──
const ADOBE='#d9b98a', ADOBE_D='#a98a5a', ROOF='#8a5a30', STN='#b9ab8a', STN_D='#7a6a58', DK='#3a2610';
const bR=(x,y,w,h,f,rx=2,s=DK)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" stroke="${s}" stroke-width="2"/>`;
const bP=(pts,f)=>`<polygon points="${pts}" fill="${f}" stroke="${DK}" stroke-width="2" stroke-linejoin="round"/>`;
const bE=(cx,cy,rx,ry,f,s=DK)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" stroke="${s}" stroke-width="2"/>`;
const SHADOW='<ellipse cx="100" cy="134" rx="86" ry="9" fill="#000" opacity=".25"/>';
const smoke=(x,y)=>`<g class="smk" fill="#e8e4dc">${[0,1,2].map(i=>`<circle style="--i:${i}" cx="${x+i*2}" cy="${y-i*3}" r="${6+i*2}"/>`).join('')}</g>`;
function buildingArt(id,lv){
  if(lv===0) return `<g opacity=".9">${SHADOW}<path d="M34 128H166L156 84H44Z" fill="rgba(255,246,214,.25)" stroke="#6a5030" stroke-width="2" stroke-dasharray="7 5"/>${bR(50,114,22,14,STN)}${bR(84,118,26,12,STN_D)}${bR(124,112,20,16,STN)}${bR(70,100,16,10,STN)}</g>`;
  const two=lv>=2;
  switch(id){
    case 'casa': return SHADOW+bR(40,72,120,60,ADOBE)+bR(34,64,132,12,ROOF)+bR(92,94,24,38,DK,3)+bR(54,86,20,16,'#6a8aa8')+bR(126,86,20,16,'#6a8aa8')
      +(two?bR(58,34,84,34,ADOBE)+bR(52,26,96,10,ROOF)+bR(88,42,24,18,'#6a8aa8')+`<path d="M86 94H118L122 104H82Z" fill="#c8402a" stroke="${DK}" stroke-width="2"/>`+bR(134,14,12,22,STN,1):'');
    case 'pozo': return SHADOW+bR(60,100,80,28,STN)+bE(100,100,40,12,'#6a8aa8')+bR(58,46,6,58,ROOF,1)+bR(136,46,6,58,ROOF,1)+bR(54,42,92,8,ROOF,2)
      +`<path d="M100 50V90" stroke="${DK}" stroke-width="2"/>`+bR(92,88,16,14,'#8a5a30',2)+(two?bP('44,44 100,10 156,44','#c0603a')+bR(60,60,12,10,'#8a5a30',2):'');
    case 'horno': return SHADOW+`<path d="M44 130Q44 62 100 62Q156 62 156 130Z" fill="#b8643a" stroke="${DK}" stroke-width="2"/><path d="M60 100H140M52 116H148M76 80H124M100 62V80M80 80V100M120 80V100" stroke="#7a3a18" stroke-width="1.5" fill="none"/>`
      +`<path d="M84 130Q84 98 100 98Q116 98 116 130Z" fill="#2a1004" stroke="${DK}" stroke-width="2"/><path d="M90 130Q90 110 100 110Q110 110 110 130Z" fill="#ffa030"/>`+bR(128,34,16,48,'#8a4a28',1)+smoke(136,28)
      +(two?`<path d="M10 130Q10 96 30 96Q50 96 50 130Z" fill="#a8542c" stroke="${DK}" stroke-width="2"/>`+bR(160,112,26,18,'#d07a4a',1)+bR(164,98,18,14,'#d07a4a',1):'');
    case 'taller': return SHADOW+bR(34,52,6,80,ROOF,1)+bR(160,52,6,80,ROOF,1)+bP('26,58 100,28 174,58','#b08850')+bR(60,102,50,30,'#f4f0e6',2)+`<path d="M72 112L90 108M70 120L100 116" stroke="#a8a49a" stroke-width="1.5"/>`
      +bE(140,126,14,6,'#e8e4da')+bE(140,114,14,6,'#f4f0e6')+bE(140,102,14,6,'#e8e4da')
      +(two?bR(112,70,10,32,'#f4f0e6',1)+bR(108,64,18,8,'#e8e4da',1)+bE(50,90,8,10,'#e8e4da')+bR(46,98,8,26,'#e8e4da',1):'');
    case 'fundicion': return SHADOW+bR(48,70,104,62,STN_D)+bR(104,22,28,52,STN_D,1)+smoke(118,16)+`<path d="M62 132V108Q62 94 76 94Q90 94 90 108V132Z" fill="#2a1004" stroke="${DK}" stroke-width="2"/><path d="M68 132V110Q68 100 76 100Q84 100 84 110V132Z" fill="#ff7a20"/><path d="M72 132V116Q72 108 76 108Q80 108 80 116V132Z" fill="#ffd060"/>`
      +bR(112,112,32,12,'#cf8a3a',2)+bR(118,100,20,12,'#e8a850',2)+(two?bR(8,86,38,46,STN_D)+bR(18,50,14,38,STN_D,1)+smoke(25,44)+bR(150,122,32,10,'#4a4a52',2)+bR(158,112,16,10,'#4a4a52',2):'');
  }
  return '';
}

// ── Mapa ──
function nestedSVG(svg,x,y,w,h){ return svg.replace('<svg ',`<svg x="${x}" y="${y}" width="${w}" height="${h}" `); }
function settlementSVG(){
  const nextIdx=WONDERS.findIndex((w,i)=>getBestStars(i)===0 && (i===0||getBestStars(i-1)>0));
  let s=`<svg id="set-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Tu asentamiento">`;
  s+=`<image href="img/mapa_asentamiento.jpg" x="0" y="0" width="1600" height="900" preserveAspectRatio="xMidYMid slice"/>`;
  [[120,'0s',46],[260,'-18s',58]].forEach(([y,dl,du])=>{ s+=`<g class="bird" style="--y:${y}px;animation-duration:${du}s;animation-delay:${dl}"><path class="flap" d="M0 0Q7-9 14 0Q21-9 28 0" fill="none" stroke="#24385a" stroke-width="2.4" stroke-linecap="round"/></g>`; });
  s+=`<path class="shim" d="M60 560Q300 548 560 562M700 562Q900 552 1100 562M1180 560Q1400 552 1580 560" stroke="#e8f6ff" stroke-width="3" fill="none" stroke-dasharray="46 30" opacity=".55" pointer-events="none"/>`;
  // aldeanos que pasean por el camino
  [['b_walk',60,1500,497,70,0,52],['c_walk',1480,120,507,84,-30,52],['d_walk',300,1200,502,60,-12,50]].forEach(([k,x0,x1,y,du,dl,H])=>{ if(typeof SPRITES==='undefined'||!SPRITES[k]) return; const sp=SPRITES[k], w=Math.round(sp.w*H/sp.h);
    s+=`<g class="walker" style="--x0:${x0}px;--x1:${x1}px;--y:${y}px;animation-duration:${du}s;animation-delay:${dl}s"><svg x="${-w/2}" y="${-H}" width="${w}" height="${H}" viewBox="0 0 ${w} ${H}" overflow="hidden"><image class="sprs" href="img/obreros/${k}.png" width="${w*sp.n}" height="${H}" style="--end:${-w*sp.n}px"/></svg></g>`; });
  // maravillas (ilustraciones en img/maravillas)
  WONDERS.forEach((w,i)=>{
    const [cx,feet]=WONDER_SPOTS[i], x=cx-WS/2, y=feet-WS, stars=getBestStars(i), locked=i>0&&getBestStars(i-1)===0, done=stars>0, next=i===nextIdx;
    const cls='plot wonder-plot'+(locked?' locked':'')+(done?' done':(locked?'':' todo'))+(next?' next':'');
    s+=`<g class="${cls}" data-kind="wonder" data-i="${i}" tabindex="${locked?-1:0}" role="button" aria-label="${w.name}${locked?' (bloqueada)':''}"><title>${w.name}${locked?' (bloqueada)':done?' — completada':''}</title>`;
    s+=`<ellipse cx="${cx}" cy="${feet-4}" rx="${WS*.4}" ry="10" fill="#1c2a08" opacity=".35"/>`;
    s+=`<g class="w-art"><image href="img/maravillas/maravilla_${w.id}.png" x="${x}" y="${y}" width="${WS}" height="${WS}" preserveAspectRatio="xMidYMax meet"/></g>`;
    s+=`<g transform="translate(${cx} ${feet+10})"><rect x="-96" y="-2" width="192" height="26" rx="8" fill="#f2e4b8" stroke="#6a4a1c" stroke-width="2"/><text y="16" text-anchor="middle" font-family="Cinzel,Georgia,serif" font-weight="700" font-size="13" fill="#2a1604" letter-spacing="1"${w.name.length>20?' textLength="176" lengthAdjust="spacingAndGlyphs"':''}>${w.name}</text>`;
    s+=`<text y="42" text-anchor="middle" font-size="18" fill="${done?'#e0a020':'#6a5a3a'}" stroke="#2a1604" stroke-width=".6">${[0,1,2].map(k=>k<stars?'★':'☆').join(' ')}</text></g>`;
    if(done) s+=`<g transform="translate(${cx+WS*.38} ${feet-6})"><path d="M0 0V40" transform="translate(0 -40)" stroke="#5a3a18" stroke-width="3"/><path class="flag" d="M1.5 -38H26L19 -31L26 -24H1.5Z" fill="#c8402a" stroke="#6a1a10" stroke-width="1.5"/></g><g class="glint" transform="translate(${cx} ${y+WS*.4})"><path d="M0 -12L3 -3L12 0L3 3L0 12L-3 3L-12 0L-3 -3Z" fill="#fff6c0"/></g>`;
    if(locked) s+=`<g transform="translate(${cx} ${y+WS*.58})"><circle r="22" fill="#2a1604" opacity=".75"/><rect x="-10" y="-4" width="20" height="16" rx="2" fill="#e0c070"/><path d="M-6 -4V-10Q-6 -18 0 -18Q6 -18 6 -10V-4" fill="none" stroke="#e0c070" stroke-width="3"/></g>`;
    if(next) s+=`<g transform="translate(${cx} ${y-2})"><g class="pulse"><path d="M-14 -22H14L0 0Z" fill="#f2d27a" stroke="#6a4a1c" stroke-width="2"/></g></g>`;
    s+=`</g>`;
  });
  // edificios
  BUILDINGS.forEach((b,i)=>{
    const [x,y]=BUILD_SPOTS[i], lv=buildingLevel(b.id), can=lv<BUILD_MAX && (getStock()[b.mat]||0)>=b.cost[lv];
    s+=`<g class="plot build-plot${can?' can':''}" data-kind="build" data-id="${b.id}" tabindex="0" role="button" aria-label="${b.name}, nivel ${lv}"><title>${b.name} · nivel ${lv}/${BUILD_MAX}</title>`;
    // nivel 1 y 2: ilustraciones de img/edificios; nivel 0: el solar dibujado en SVG
    const art=lv>=1
      ? nestedSVG(`<svg viewBox="-10 -40 220 190" xmlns="http://www.w3.org/2000/svg">${SHADOW}<image href="img/edificios/edif_${b.id}_${lv}.png" x="-10" y="-40" width="220" height="190" preserveAspectRatio="xMidYMax meet"/></svg>`,x-5,y-34,BS_W+10,BS_H+36)
      : nestedSVG(`<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">${buildingArt(b.id,0)}</svg>`,x,y,BS_W,BS_H);
    s+=`<g class="w-art">${art}</g>`;
    s+=`<g transform="translate(${x+BS_W/2} ${y+BS_H+8})"><rect x="-98" y="-2" width="196" height="26" rx="8" fill="#f2e4b8" stroke="#6a4a1c" stroke-width="2"/><text y="16" text-anchor="middle" font-family="Cinzel,Georgia,serif" font-weight="700" font-size="12" fill="#2a1604" letter-spacing=".5">${b.name}</text>`;
    s+=`<text y="42" text-anchor="middle" font-family="Cinzel,Georgia,serif" font-size="13" font-weight="700" fill="#fff6d8" stroke="#2a1604" stroke-width="3" paint-order="stroke">NIVEL ${lv} / ${BUILD_MAX}</text></g>`;
    if(can) s+=`<g transform="translate(${x+BS_W-14} ${y+6})"><g class="pulse"><circle r="15" fill="#f2d27a" stroke="#6a4a1c" stroke-width="2"/><path d="M0 8V-8M-7 -1L0 -8L7 -1" stroke="#2a1604" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>`;
    s+=`</g>`;
  });
  const hr=new Date().getHours();
  if(hr>=19&&hr<21) s+=`<rect width="1600" height="900" fill="#ff8a30" opacity=".16" pointer-events="none"/>`;
  else if(hr>=21||hr<6){ s+=`<rect width="1600" height="900" fill="#0a1440" opacity=".42" pointer-events="none"/>`; for(let i=0;i<40;i++) s+=`<circle class="star" style="animation-delay:${(i*.37)%3}s" cx="${(i*397)%1600}" cy="${30+(i*151)%260}" r="${1+(i%3)*.6}" fill="#fff6d8"/>`; }
  return s+`</svg>`;
}

function stockBarHTML(){
  const st=getStock();
  return Object.keys(MATERIALS).map(m=>`<span class="stk" title="${MATERIALS[m].name}"><img src="img/bloques/bloque_${m}.png" alt="" draggable="false"><b>${st[m]||0}</b><i>${MATERIALS[m].name}</i></span>`).join('');
}

function renderSettlement(){
  const map=document.getElementById('set-map'); if(!map) return;
  map.innerHTML=settlementSVG();
  document.getElementById('set-stock').innerHTML=stockBarHTML();
  { const done=WONDERS.filter((w,i)=>getBestStars(i)>0).length, stars=WONDERS.reduce((a,w,i)=>a+getBestStars(i),0); const e=document.getElementById('set-prog'); if(e) e.textContent=`OBRAS ${done}/${WONDERS.length} · ★ ${stars}/${WONDERS.length*3}`; }
}
function closePanel(){ const p=document.getElementById('set-panel'); if(p){ p.classList.remove('show'); p.innerHTML=''; } }
function openPanel(html,bottom){ const p=document.getElementById('set-panel'); p.innerHTML=`<button class="sp-x" onclick="closePanel()" aria-label="Cerrar">✕</button>${html}`; p.classList.toggle('at-bottom',!!bottom); p.classList.add('show'); }

function showWonderPanel(i){
  const w=WONDERS[i], stars=getBestStars(i), best=getBestScore(i);
  openPanel(`<div class="sp-eyebrow">MARAVILLA ${String(i+1).padStart(2,'0')} · ${w.place} · ${w.year}</div><div class="sp-title">${w.name}</div><p class="sp-desc">${w.desc}</p>
  <div class="sp-tags"><span class="wc-tag diff-${w.diff}">${diffLabel(w.diff)}</span><span class="wc-tag">${w.rocks.length} BLOQUES EN EL TABLERO</span><span class="wc-tag">${w.stages} PARA CONSTRUIRLA</span><span class="wc-tag">${MATERIALS[w.mat].name}</span>${best?`<span class="wc-tag">MEJOR: ${best}</span>`:''}</div>
  <div class="sp-stars">${[0,1,2].map(k=>`<span class="${k<stars?'on':''}">★</span>`).join('')}</div>
  <button class="btn btn-hint" onclick="closePanel();startLevel(${i})">${stars?'⟳ VOLVER A OBRA':'▶ EMPEZAR OBRA'}</button>`,true);
}
function showBuildPanel(id){
  const b=BUILDINGS.find(x=>x.id===id), lv=buildingLevel(id), st=getStock(), have=st[b.mat]||0, last=lv>=BUILD_MAX;
  const PUN={shuffle:'Revolver',bomb:'Bomba',ray:'Rayo',color:'Aurora'};
  const eff=lv?`Ahora: ${b.pu?`+${lv} ${PUN[b.pu]}`:`+${2*lv} movimientos`}`:'Aún sin construir';
  const cost=last?'':`<div class="sp-cost ${have>=b.cost[lv]?'ok':'no'}"><img src="img/bloques/bloque_${b.mat}.png" alt="">${have} / ${b.cost[lv]} ${MATERIALS[b.mat].name}</div>`;
  openPanel(`<div class="sp-eyebrow">EDIFICIO · NIVEL ${lv} / ${BUILD_MAX}</div><div class="sp-title">${b.name}</div><p class="sp-desc">${b.desc}.</p>
  <div class="sp-tags"><span class="wc-tag">${b.per}</span><span class="wc-tag">${eff}</span></div>${cost}
  ${last?'<div class="sp-max">★ NIVEL MÁXIMO ★</div>':`<button class="btn btn-hint" ${have>=b.cost[lv]?'':'disabled'} onclick="doUpgrade('${id}')">${lv?'▲ MEJORAR':'▲ CONSTRUIR'}</button>`}
  ${last||have>=b.cost[lv]?'':`<p class="sp-hint">Entrega bloques de ${MATERIALS[b.mat].name.toLowerCase()} en las obras para conseguirlo.</p>`}`);
}
function doUpgrade(id){ if(upgradeBuilding(id)){ Snd.play('upgrade'); renderSettlement(); showBuildPanel(id);
  const g=document.querySelector(`[data-kind="build"][data-id="${id}"]`); if(g){ g.classList.add('up'); setTimeout(()=>g.classList.remove('up'),900); const b=g.getBoundingClientRect(); FX.burst(b.left+b.width/2,b.top+b.height*.55,['#f2d27a','#fff6d8','#e8a850'],26,{max:260}); FX.ring(b.left+b.width/2,b.top+b.height*.6,'#f2d27a',110); } } }

(function bindSettlement(){
  const map=document.getElementById('set-map'); if(!map) return;
  const act=e=>{ const g=e.target.closest('[data-kind]'); if(!g) { if(e.target.closest('svg')) closePanel(); return; }
    if(g.dataset.kind==='wonder'){ const i=+g.dataset.i; if(g.classList.contains('locked')){ openPanel(`<div class="sp-title">${WONDERS[i].name}</div><p class="sp-desc">Completa antes «${WONDERS[i-1].name}» para empezar esta obra.</p>`,true); } else showWonderPanel(i); }
    else showBuildPanel(g.dataset.id); };
  map.addEventListener('click',act);
  map.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); act(e); } });
})();
