// WONDER IV — Escenas de las siete maravillas, dibujadas en SVG por bloques (viewBox 0 0 400 300).
// Cada maravilla es una lista de etapas en el orden de construcción. Las etapas sin construir se ven como un plano punteado.
// El número de etapas de cada escena tiene que coincidir con WONDERS[i].stages (js/data.js).

const SK='#5a4220';                       // contorno
const sh=(c,a)=>c;                        // (reservado)
const R=(x,y,w,h,f,s=SK,rx=1)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" stroke="${s}" stroke-width="1.6"/>`;
const P=(pts,f,s=SK)=>`<polygon points="${pts}" fill="${f}" stroke="${s}" stroke-width="1.6" stroke-linejoin="round"/>`;
const C=(x,y,r,f,s=SK)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" stroke="${s}" stroke-width="1.6"/>`;
const L=(x1,y1,x2,y2,s=SK,w=1.6)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${s}" stroke-width="${w}" stroke-linecap="round"/>`;
// fila de sillares: n bloques con tonos alternos
function bricks(x,y,w,h,n,c1,c2){ let o=''; const bw=w/n; for(let i=0;i<n;i++) o+=R(+(x+i*bw).toFixed(1),y,+bw.toFixed(1),h,i%2?c1:c2); return o; }
// columna acanalada con base y capitel
function COL(x,y,h,w=13,f='#f4ecd2'){ const cx=x+w/2; return R(x-2,y+h-5,w+4,5,'#d8cba2')+R(x,y+4,w,h-9,f)+L(cx-w/4,y+6,cx-w/4,y+h-7,'#bfb08a',1)+L(cx+w/4,y+6,cx+w/4,y+h-7,'#bfb08a',1)+R(x-3,y,w+6,5,'#e6d9b0'); }
const STONE=['#e2d0a4','#cdb88a'], DSTONE='#b0955a', MARBLE='#f4efe2', BRONZE='#cf8a3a', GOLD='#f2c64a', GREEN='#5a9a48', WATER='#58b4e0';
const GROUND=`<rect x="0" y="262" width="400" height="38" fill="#c8a66a"/><rect x="0" y="262" width="400" height="3" fill="#8a6a3a" opacity=".6"/><ellipse cx="200" cy="264" rx="170" ry="7" fill="#6a4a20" opacity=".25"/>`;

const SCENES={
  // 1 · GRAN PIRÁMIDE — 8 etapas: siete hileras y el revestimiento con el piramidión
  piramide:{ stages:[
    ...[0,1,2,3,4,5,6].map(k=>{ const w=300-k*38, n=Math.max(2,Math.round(w/34)); return bricks(200-w/2,262-(k+1)*30,w,30,n,STONE[0],STONE[1]); }),
    P('50,262 350,262 200,34','#f1e6c6','#8a7040')+L(200,34,200,262,'#d8c898',1)+L(125,148,275,148,'#d8c898',1)+P('200,34 188,56 212,56',GOLD,'#8a5a0a')
  ]},
  // 2 · JARDINES COLGANTES — 9 etapas: cuatro terrazas con su jardín, y la cascada
  jardines:{ stages:(()=>{
    const wall=(x,y,w,h)=>bricks(x,y,w,h,Math.round(w/26),'#e6a276','#c9764a');
    const tree=(x,y,s=1)=>R(x-1.5*s,y-8*s,3*s,8*s,'#7a4a20','#4a2c10',0)+C(x,y-12*s,8*s,GREEN,'#2e6224')+C(x-5*s,y-9*s,6*s,'#74b45c','#2e6224');
    const garden=(x,y,w,trees)=>R(x,y,w,9,'#78b05a','#2e6224',2)+trees.map(t=>tree(x+t*w,y+1)).join('')+[0.15,0.5,0.85].map(t=>L(x+t*w,y+9,x+t*w,y+17,'#4a9a4a',2)).join('');
    return [
      wall(60,222,280,40), garden(60,213,280,[.1,.3,.5,.7,.9]),
      wall(90,184,220,30), garden(90,175,220,[.15,.4,.6,.85]),
      wall(120,150,160,26), garden(120,141,160,[.2,.5,.8]),
      wall(150,120,100,22), tree(176,112,1.6)+tree(200,112,1.9)+tree(224,112,1.6)+R(150,111,100,9,'#78b05a','#2e6224',2),
      R(196,120,8,142,WATER,'#2a7aa8',1)+R(110,176,5,46,WATER,'#2a7aa8',1)+R(285,176,5,46,WATER,'#2a7aa8',1)+R(138,142,5,34,WATER,'#2a7aa8',1)+R(257,142,5,34,WATER,'#2a7aa8',1)
    ];})() },
  // 3 · ESTATUA DE ZEUS — 10 etapas: pedestal, trono y la figura sentada con el cetro
  zeus:{ stages:[
    R(90,244,220,18,STONE[0]), R(110,226,180,18,STONE[1]), R(130,208,140,18,STONE[0]),
    R(150,170,100,38,'#a8763a','#4a2c10')+L(150,189,250,189,'#7a5224',1.4),
    R(150,150,16,24,'#a8763a','#4a2c10')+R(234,150,16,24,'#a8763a','#4a2c10'),
    R(160,62,80,110,'#8a5a28','#4a2c10')+R(166,70,68,8,GOLD,'#8a5a0a')+R(166,86,68,5,GOLD,'#8a5a0a'),
    R(172,148,56,44,MARBLE,'#8a8678')+R(172,176,56,16,'#e6dfcc','#8a8678'),
    R(176,100,48,50,MARBLE,'#8a8678')+R(176,100,48,8,GOLD,'#8a5a0a'),
    C(200,88,15,MARBLE,'#8a8678')+P('188,92 212,92 200,116','#e6dfcc','#8a8678')+C(194,86,1.6,'#4a3a20','#4a3a20')+C(206,86,1.6,'#4a3a20','#4a3a20')+P('184,78 200,64 216,78 200,74',GOLD,'#8a5a0a'),
    L(250,60,250,196,'#8a5a0a',3)+C(250,56,6,GOLD,'#8a5a0a')+P('262,150 270,128 278,150 270,146','#f4efe2','#8a8678')
  ]},
  // 4 · TEMPLO DE ARTEMISA — 11 etapas: gradas, columnas de fuera hacia dentro, arquitrabe, friso, frontón, estatua y acroteras
  artemisa:{ stages:(()=>{
    const cols=i=>COL(84+i*33,116,112,14,'#f4e8cc');
    return [
      R(50,244,300,18,STONE[0]), R(66,228,268,16,STONE[1]),
      cols(0)+cols(7), cols(1)+cols(6), cols(2)+cols(5), cols(3)+cols(4),
      R(70,100,260,16,'#e6d9b0'),
      R(70,88,260,12,'#d8c898')+[0,1,2,3,4,5,6,7,8,9].map(i=>R(76+i*25,91,16,6,'#b89a52','#8a7040',0)).join(''),
      P('66,88 334,88 200,38','#efe3c0','#8a7040')+P('96,86 304,86 200,50','#d8c898','#8a7040'),
      R(185,192,30,36,'#c98a3a','#5a3a10')+C(200,184,9,'#e6b872','#5a3a10')+P('190,176 200,160 210,176',GOLD,'#8a5a0a'),
      P('200,34 190,46 210,46',GOLD,'#8a5a0a')+P('62,90 74,76 86,90',GOLD,'#8a5a0a')+P('314,90 326,76 338,90',GOLD,'#8a5a0a')
    ];})() },
  // 5 · MAUSOLEO DE HALICARNASO — 12 etapas: podio, columnata, tejado escalonado, cuadriga y estatuas
  mausoleo:{ stages:(()=>{
    const cols=i=>COL(90+i*30,142,74,12,'#f4efe2');
    return [
      R(60,240,280,22,STONE[0]), R(76,216,248,24,STONE[1]),
      cols(0)+cols(7), cols(1)+cols(6), cols(2)+cols(5), cols(3)+cols(4),
      R(80,126,240,16,'#e6dfcc','#8a8678')+[0,1,2,3,4,5,6,7].map(i=>R(88+i*29,129,19,10,'#b8b0a0','#8a8678',0)).join(''),
      R(104,106,192,20,'#d8d0bc','#8a8678'), R(128,88,144,18,'#cfc7b2','#8a8678'), R(152,72,96,16,'#c4bca6','#8a8678'),
      R(176,56,48,16,'#b8b09a','#8a8678')+R(186,40,28,16,BRONZE,'#5a3a10')+C(176,36,7,'#e6b872','#5a3a10')+C(224,36,7,'#e6b872','#5a3a10')+P('192,40 200,22 208,40',GOLD,'#8a5a0a'),
      [0,1,2,3,4,5,6].map(i=>R(112+i*30,176,8,28,'#e6dfcc','#8a8678',3)+C(116+i*30,172,5,'#e6dfcc','#8a8678')).join('')
    ];})() },
  // 6 · COLOSO DE RODAS — 13 etapas: pedestal, pies, piernas, cadera, torso, brazos, cabeza, corona de rayos y antorcha
  coloso:{ stages:[
    R(100,244,200,18,STONE[0]), R(116,226,168,18,STONE[1]), R(132,208,136,18,STONE[0]),
    R(146,194,42,14,BRONZE,'#5a3a10')+R(212,194,42,14,BRONZE,'#5a3a10'),
    P('160,196 182,196 180,132 162,132','#d99a46','#5a3a10')+L(166,150,176,150,'#a8762c',1)+L(166,172,176,172,'#a8762c',1),
    P('218,196 240,196 238,132 220,132','#d99a46','#5a3a10')+L(224,150,234,150,'#a8762c',1)+L(224,172,234,172,'#a8762c',1),
    P('150,136 250,136 244,100 156,100','#cf8a3a','#5a3a10'),
    P('156,102 244,102 238,60 162,60','#d99a46','#5a3a10')+R(176,70,48,5,'#a8762c','#5a3a10',0),
    P('160,62 138,102 150,108 170,76','#cf8a3a','#5a3a10'),
    P('240,62 282,34 290,46 246,80','#d99a46','#5a3a10'),
    C(200,46,16,'#e6a84a','#5a3a10')+C(194,44,1.8,'#4a2c10','#4a2c10')+C(206,44,1.8,'#4a2c10','#4a2c10')+L(194,54,206,54,'#4a2c10',1.4),
    [-60,-35,-10,15,40].map(a=>{const r=a*Math.PI/180; return L(200+Math.sin(r)*18,46-Math.cos(r)*18,200+Math.sin(r)*30,46-Math.cos(r)*30,GOLD,3);}).join(''),
    P('282,36 276,18 286,24 290,8 296,24 304,18 298,36',GOLD,'#8a5a0a')+R(279,34,18,6,BRONZE,'#5a3a10',2)
  ]},
  // 7 · FARO DE ALEJANDRÍA — 14 etapas: cuatro cuerpos cuadrados, cuatro octogonales, tres cilíndricos, linterna, fuego y estatua
  faro:{ stages:(()=>{
    const sq=(i)=>{ const y=262-(i+1)*22, w=150-i*8, x=200-w/2; return R(x,y,w,22,i%2?STONE[1]:STONE[0])+R(197,y+6,6,11,'#7a6238','#5a4220',3)+R(x+10,y+6,6,11,'#7a6238','#5a4220',3)+R(x+w-16,y+6,6,11,'#7a6238','#5a4220',3); };
    const oc=(i)=>{ const y=174-(i+1)*18, w=96-i*8, x=200-w/2; return R(x,y,w,18,i%2?'#d8c898':'#e6d8ae')+L(x+w/3,y,x+w/3,y+18,'#b89a52',1)+L(x+2*w/3,y,x+2*w/3,y+18,'#b89a52',1); };
    const cy=(i)=>{ const y=102-(i+1)*14, w=52-i*6, x=200-w/2; return R(x,y,w,14,i%2?'#ece0be':'#f4ebcf','#7a6238',5); };
    return [sq(0),sq(1),sq(2),sq(3),oc(0),oc(1),oc(2),oc(3),cy(0),cy(1),cy(2),
      R(182,38,36,20,'#c8b078','#5a4220')+R(188,42,8,12,'#f6e08a','#8a5a0a',2)+R(204,42,8,12,'#f6e08a','#8a5a0a',2),
      P('200,8 188,34 194,30 200,36 206,30 212,34',GOLD,'#8a5a0a')+P('200,14 194,32 206,32','#ffe9a0','#8a5a0a'),
      R(197,0,6,10,BRONZE,'#5a3a10',2)+C(200,-2,5,BRONZE,'#5a3a10')
    ];})() },
};

// ── Renderizado ─────────────────────────────
function wonderSceneSVG(id, built, opts={}){
  const sc=SCENES[id]; if(!sc) return '';
  const st=sc.stages.map((g,i)=>`<g class="st ${i<built?'on':'ghost'}" data-s="${i}">${g}</g>`).join('');
  return `<svg viewBox="0 -12 400 312" xmlns="http://www.w3.org/2000/svg" class="wonder-svg" role="img" aria-label="Maravilla en construcción" preserveAspectRatio="xMidYMax meet">${opts.ground===false?'':GROUND}${st}</svg>`;
}
// Estado de la construcción visible: cuántos bloques han llegado ya al solar
let siteBuilt=0;
function renderSite(){
  const w=WONDERS[level], box=document.getElementById('site-scene');
  if(!box) return;
  box.innerHTML=wonderSceneSVG(w.id, siteBuilt, {ground:false});
}
function placeStage(k){
  siteBuilt=Math.max(siteBuilt,k+1);
  const g=document.querySelector(`#site-scene .st[data-s="${k}"]`);
  if(!g) return;
  g.classList.remove('ghost'); g.classList.add('on','drop');
  setTimeout(()=>g.classList.remove('drop'),700);
}
