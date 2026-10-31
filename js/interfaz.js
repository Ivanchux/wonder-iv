// WONDER IV — Interfaz: barra superior, ajustes y ayuda, atajos de teclado, avisos de inicio de obra y primeras pistas.

const $=id=>document.getElementById(id);
const store={ get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }, del(k){ try{ localStorage.removeItem(k); }catch(e){} } };

// ── Reducir movimiento ──
function applyReduce(on){ document.body.classList.toggle('reduce-motion',!!on); }
applyReduce(store.get('wonder_reduce')==='1');

// ── Avisos ──
function toast(text,ms=4200){
  document.querySelectorAll('.toast').forEach(e=>e.remove());
  const e=document.createElement('div'); e.className='toast'; e.textContent=text; document.body.appendChild(e);
  setTimeout(()=>e.classList.add('out'),ms-400); setTimeout(()=>e.remove(),ms);
}
function showIntro(w){
  document.querySelectorAll('.intro').forEach(e=>e.remove());
  const n=WONDERS.indexOf(w)+1, blocks=w.rocks.length;
  const e=document.createElement('div'); e.className='intro';
  e.innerHTML=`<small>OBRA ${String(n).padStart(2,'0')} · ${w.place.toUpperCase()}</small><b>${w.name}</b><span>Libera ${blocks} bloques de ${MATERIALS[w.mat].name.toLowerCase()} y llévalos a la obra</span>`;
  document.body.appendChild(e); setTimeout(()=>e.classList.add('out'),2500); setTimeout(()=>e.remove(),3100);
  // primeras pistas, solo la primera vez
  if(!store.get('wonder_tuto')){
    setTimeout(()=>toast('Intercambia dos piezas contiguas para hacer tríos.'),3300);
    setTimeout(()=>toast('Los bloques no se mueven: despeja el suelo bajo ellos y caerán.'),8200);
    setTimeout(()=>{ toast('Cuando un bloque sale, un obrero lo lleva a la obra.'); store.set('wonder_tuto','1'); },13200);
  }
}

// ── Barra superior ──
function syncBar(){
  const m=$('btn-music'), s=$('btn-sfx');
  if(m){ m.classList.toggle('off',!Snd.cfg.music); m.setAttribute('aria-pressed',Snd.cfg.music); }
  if(s){ s.classList.toggle('off',!Snd.cfg.sfx); s.setAttribute('aria-pressed',Snd.cfg.sfx); }
}
function toggleFullscreen(){
  try{
    const d=document, el=d.documentElement;
    if(d.fullscreenElement||d.webkitFullscreenElement){ (d.exitFullscreen||d.webkitExitFullscreen).call(d); }
    else (el.requestFullscreen||el.webkitRequestFullscreen).call(el);
  }catch(e){}
}

// ── Ajustes y ayuda ──
function buildSettings(){
  if($('settings')) return;
  const d=document.createElement('div'); d.id='settings'; d.className='modal'; d.setAttribute('role','dialog'); d.setAttribute('aria-label','Ajustes');
  d.innerHTML=`<div class="modal-card">
    <button class="sp-x" id="set-close" aria-label="Cerrar">✕</button>
    <div class="sp-eyebrow">WONDER IV</div><div class="sp-title">AJUSTES</div>
    <div class="set-row"><label for="set-music">Música</label><input type="range" id="set-music" min="0" max="100"><button class="mini" id="set-music-t"></button></div>
    <div class="set-row"><label for="set-sfx">Efectos</label><input type="range" id="set-sfx" min="0" max="100"><button class="mini" id="set-sfx-t"></button></div>
    <div class="set-row"><label for="set-reduce">Reducir movimiento</label><span></span><button class="mini" id="set-reduce"></button></div>
    <div class="set-help">
      <b>Cómo se juega</b>
      <ul><li>Intercambia dos piezas contiguas para alinear tres o más.</li>
      <li>Los bloques de material no se mueven: despeja el suelo bajo ellos y caerán.</li>
      <li>Los obreros llevan cada bloque que sale a la obra. Completa todos para levantar la maravilla.</li>
      <li>Con los materiales mejoras los edificios del asentamiento, que te ayudan en cada obra.</li></ul>
      <b>Atajos</b><p><kbd>M</kbd> música · <kbd>F</kbd> pantalla completa · <kbd>H</kbd> pista · <kbd>Esc</kbd> ajustes</p>
    </div>
    <button class="btn btn-rst" id="set-reset">BORRAR PROGRESO</button>
  </div>`;
  document.body.appendChild(d);
  const sync=()=>{ $('set-music').value=Math.round(Snd.cfg.mvol*100); $('set-sfx').value=Math.round(Snd.cfg.vol*100);
    $('set-music-t').textContent=Snd.cfg.music?'SÍ':'NO'; $('set-sfx-t').textContent=Snd.cfg.sfx?'SÍ':'NO';
    $('set-reduce').textContent=document.body.classList.contains('reduce-motion')?'SÍ':'NO'; syncBar(); };
  $('set-music').oninput=e=>{ Snd.set('mvol',e.target.value/100); };
  $('set-sfx').oninput=e=>{ Snd.set('vol',e.target.value/100); };
  $('set-music').onchange=()=>Snd.play('select'); $('set-sfx').onchange=()=>Snd.play('match',{combo:3,n:3});
  $('set-music-t').onclick=()=>{ Snd.toggleMusic(); sync(); };
  $('set-sfx-t').onclick=()=>{ Snd.toggleSfx(); sync(); };
  $('set-reduce').onclick=()=>{ const on=!document.body.classList.contains('reduce-motion'); applyReduce(on); store.set('wonder_reduce',on?'1':'0'); sync(); };
  $('set-close').onclick=closeSettings;
  d.addEventListener('click',e=>{ if(e.target===d) closeSettings(); });
  let armed=false;
  $('set-reset').onclick=()=>{
    if(!armed){ armed=true; $('set-reset').textContent='¿SEGURO? PULSA OTRA VEZ'; setTimeout(()=>{ armed=false; $('set-reset').textContent='BORRAR PROGRESO'; },3500); return; }
    try{ Object.keys(localStorage).filter(k=>/^wonder_(best|stars|stock|build|tuto)/.test(k)).forEach(k=>localStorage.removeItem(k)); }catch(e){}
    armed=false; $('set-reset').textContent='BORRAR PROGRESO'; buildSelectScreen(); closeSettings(); toast('Progreso borrado.',2500);
  };
  d._sync=sync;
}
function openSettings(){ buildSettings(); const d=$('settings'); d._sync(); d.classList.add('show'); $('set-close').focus(); }
function closeSettings(){ const d=$('settings'); if(d) d.classList.remove('show'); }
const settingsOpen=()=>{ const d=$('settings'); return !!(d&&d.classList.contains('show')); };

// ── Enlaces y atajos ──
(function bind(){
  const on=(id,fn)=>{ const e=$(id); if(e) e.addEventListener('click',fn); };
  on('btn-music',()=>{ Snd.unlock(); Snd.toggleMusic(); syncBar(); });
  on('btn-sfx',()=>{ Snd.unlock(); Snd.toggleSfx(); syncBar(); });
  on('btn-fs',toggleFullscreen);
  on('btn-set',()=>{ settingsOpen()?closeSettings():openSettings(); });
  document.addEventListener('click',e=>{ const t=e.target.closest&&e.target.closest('button,.plot'); if(t&&!/^pu-|^btn-music|^btn-sfx/.test(t.id||'')&&!t.closest('#settings .set-row input')) Snd.play('click'); });
  document.addEventListener('keydown',e=>{
    if(e.ctrlKey||e.metaKey||e.altKey) return;
    if(e.target.matches&&e.target.matches('input')&&e.key!=='Escape') return;
    const k=e.key.toLowerCase();
    if(k==='escape'){ if(settingsOpen()) closeSettings(); else if(document.querySelector('.set-panel.show')) closePanel(); else openSettings(); }
    else if(k==='m'){ Snd.unlock(); Snd.toggleMusic(); syncBar(); if(settingsOpen()) $('settings')._sync(); }
    else if(k==='f') toggleFullscreen();
    else if(k==='h'&&document.body.classList.contains('in-level')&&typeof doHint==='function') doHint();
  });
  syncBar(); Snd.music('menu');
})();
