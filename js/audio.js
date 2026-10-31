// WONDER IV — Sonido. Efectos y música generados en el navegador con Web Audio: no hay archivos de audio.
// Snd.play('match', combo) · Snd.music('menu' | 'l0'…'l6') · Snd.toggleMusic() · Snd.toggleSfx()

const Snd=(function(){
  const KEY='wonder_audio';
  let cfg={music:true,sfx:true,mvol:0.6,vol:0.85};
  try{ Object.assign(cfg, JSON.parse(localStorage.getItem(KEY)||'{}')); }catch(e){}
  const save=()=>{ try{ localStorage.setItem(KEY,JSON.stringify(cfg)); }catch(e){} };

  let ctx=null, master, musicBus, sfxBus, revIn, noiseBuf, wanted=null, started=false;
  const mtof=m=>440*Math.pow(2,(m-69)/12);
  const ready=()=>ctx&&ctx.state==='running';

  // ── Cadena de audio: música y efectos → master → compresor → salida; la música lleva una reverberación generada ──
  function build(c){
    ctx=c;
    master=ctx.createGain(); master.gain.value=cfg.vol;
    const comp=ctx.createDynamicsCompressor(); comp.threshold.value=-14; comp.ratio.value=4; comp.attack.value=0.004; comp.release.value=0.2;
    master.connect(comp); comp.connect(ctx.destination);
    musicBus=ctx.createGain(); musicBus.gain.value=cfg.music?cfg.mvol:0; musicBus.connect(master);
    sfxBus=ctx.createGain(); sfxBus.gain.value=cfg.sfx?1:0; sfxBus.connect(master);
    // reverberación: ruido con caída exponencial
    const len=Math.floor(ctx.sampleRate*2.4), ir=ctx.createBuffer(2,len,ctx.sampleRate);
    for(let ch=0;ch<2;ch++){ const d=ir.getChannelData(ch); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2); }
    const conv=ctx.createConvolver(); conv.buffer=ir;
    revIn=ctx.createGain(); revIn.gain.value=0.32; revIn.connect(conv);
    const revOut=ctx.createGain(); revOut.gain.value=0.9; conv.connect(revOut); revOut.connect(master);
    musicBus.connect(revIn);
    // ruido blanco compartido
    noiseBuf=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);
    const nd=noiseBuf.getChannelData(0); for(let i=0;i<nd.length;i++) nd[i]=Math.random()*2-1;
  }

  // ── Piezas sonoras básicas ──
  function tone(type,f,t,dur,vol,dest,o={}){
    const os=ctx.createOscillator(), g=ctx.createGain();
    os.type=type; os.frequency.setValueAtTime(f,t);
    if(o.to) os.frequency.exponentialRampToValueAtTime(Math.max(1,o.to),t+dur);
    if(o.detune) os.detune.value=o.detune;
    const a=o.attack||0.004;
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(vol,t+a);
    if(o.hold) g.gain.setValueAtTime(vol,t+o.hold);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    let n=os; if(o.lp){ const fl=ctx.createBiquadFilter(); fl.type='lowpass'; fl.frequency.value=o.lp; os.connect(fl); n=fl; }
    n.connect(g); g.connect(dest||sfxBus); os.start(t); os.stop(t+dur+0.05); return g;
  }
  function noise(t,dur,vol,o={}){
    const s=ctx.createBufferSource(); s.buffer=noiseBuf; s.loop=true;
    const fl=ctx.createBiquadFilter(); fl.type=o.type||'lowpass'; fl.frequency.setValueAtTime(o.f||1200,t); fl.Q.value=o.q||0.7;
    if(o.to) fl.frequency.exponentialRampToValueAtTime(o.to,t+dur);
    const g=ctx.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(vol,t+(o.attack||0.005)); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    s.connect(fl); fl.connect(g); g.connect(o.dest||sfxBus); s.start(t,Math.random()*0.5); s.stop(t+dur+0.05);
  }
  const bell=(m,t,vol,dur=0.5)=>{ const f=mtof(m); tone('sine',f,t,dur,vol); tone('sine',f*2.76,t,dur*0.5,vol*0.22); tone('triangle',f*2,t,dur*0.7,vol*0.3); };
  const SC=[0,2,4,7,9,12,14,16,19,21,24];

  // ── Efectos ──
  const S={
    click:t=>{ tone('triangle',900,t,0.05,0.12); },
    select:t=>{ tone('sine',620,t,0.12,0.16); tone('sine',930,t+0.02,0.1,0.07); },
    swap:t=>{ tone('sine',380,t,0.09,0.15,null,{to:560}); tone('sine',560,t+0.07,0.09,0.12,null,{to:380}); },
    invalid:t=>{ tone('square',150,t,0.16,0.09,null,{to:95,lp:700}); },
    thud:t=>{ tone('sine',110,t,0.14,0.22,null,{to:55}); noise(t,0.06,0.07,{f:500}); },
    match:(t,a)=>{ const combo=Math.min(10,(a&&a.combo)||1), n=Math.min(4,(a&&a.n)||3);
      for(let i=0;i<n-1;i++) bell(62+SC[(combo-1+i*2)%SC.length],t+i*0.065,0.15+Math.min(0.05,combo*0.006),0.5); },
    special:t=>{ [0,4,7,12].forEach((s,i)=>bell(72+s,t+i*0.05,0.16,0.8)); noise(t,0.3,0.04,{type:'highpass',f:5000}); },
    fall:t=>{ tone('sine',210,t,0.07,0.07,null,{to:150}); },
    exit:t=>{ tone('sine',95,t,0.28,0.3,null,{to:42}); noise(t,0.22,0.12,{f:380,to:120}); },
    pickup:t=>{ tone('triangle',520,t,0.07,0.1,null,{to:780}); noise(t,0.05,0.05,{type:'bandpass',f:1800}); },
    place:t=>{ tone('sine',120,t,0.2,0.28,null,{to:60}); noise(t,0.12,0.1,{f:700,to:200}); bell(79,t+0.08,0.1,0.5); },
    bomb:t=>{ noise(t,0.7,0.34,{f:2200,to:90,q:0.8}); tone('sine',160,t,0.5,0.4,null,{to:36}); tone('sawtooth',90,t,0.3,0.1,null,{to:30,lp:400}); },
    ray:t=>{ tone('sawtooth',1800,t,0.35,0.12,null,{to:140,lp:3500}); tone('square',900,t,0.25,0.06,null,{to:90}); noise(t,0.3,0.07,{type:'highpass',f:3000}); },
    shuffle:t=>{ noise(t,0.55,0.15,{type:'bandpass',f:400,to:3200,q:1.4}); for(let i=0;i<5;i++) tone('sine',500+i*170,t+i*0.07,0.1,0.07); },
    aurora:t=>{ for(let i=0;i<9;i++) bell(84+SC[Math.floor(Math.random()*7)],t+i*0.055,0.09,0.9); tone('sine',330,t,0.9,0.07,null,{to:660}); },
    tick:t=>{ tone('square',1200,t,0.04,0.05); },
    star:(t,i)=>{ bell(76+((i|0)*4),t,0.2,1.0); },
    win:t=>{ [[0,0],[4,0.14],[7,0.28],[12,0.42],[16,0.6],[19,0.78],[24,0.96]].forEach(([s,d])=>bell(64+s,t+d,0.2,1.2)); [0,4,7].forEach(s=>tone('triangle',mtof(52+s),t+0.9,1.6,0.08,null,{attack:0.05})); },
    lose:t=>{ [[0,0],[-2,0.22],[-5,0.44],[-9,0.7]].forEach(([s,d])=>tone('triangle',mtof(60+s),t+d,0.7,0.14,null,{attack:0.02,lp:1400})); noise(t+0.7,0.5,0.05,{f:300}); },
    upgrade:t=>{ for(let i=0;i<3;i++){ tone('square',210,t+i*0.16,0.07,0.1,null,{to:150,lp:1500}); noise(t+i*0.16,0.05,0.08,{type:'bandpass',f:2500}); } [0,4,7,12].forEach((s,i)=>bell(67+s,t+0.55+i*0.08,0.15,0.9)); },
    cheer:t=>{ [0,2,4].forEach((s,i)=>tone('triangle',mtof(72+s),t+i*0.05,0.12,0.06,null,{lp:2500})); },
    combo:(t,n)=>{ const b=60+(Math.min(6,n|0))*2; [0,4,7,12].forEach((s,i)=>bell(b+s,t+i*0.04,0.12,0.7)); },
  };
  const last={};
  function play(name,arg){
    if(!cfg.sfx||!ready()||!S[name]) return;
    const now=ctx.currentTime; if(last[name]&&now-last[name]<0.03) return; last[name]=now;
    try{ S[name](now+0.005,arg); }catch(e){}
  }

  // ── Música generativa ──
  // Cada pista tiene su escala, tempo, instrumentos y progresión de acordes (grados de la escala). La melodía se inventa
  // compás a compás con una semilla propia, así que suena distinta cada vez pero con el mismo carácter.
  const MODES={
    lydian:[0,2,4,6,7,9,11], dorian:[0,2,3,5,7,9,10], mixo:[0,2,4,5,7,9,10], aeolian:[0,2,3,5,7,8,10],
    ionian:[0,2,4,5,7,9,11], phrygDom:[0,1,4,5,7,8,10], hijaz:[0,1,4,5,7,8,11],
  };
  const TRACKS={
    menu:{bpm:68, root:62, mode:'lydian',   prog:[0,4,5,3],     lead:'flute', arp:'harp',  drums:0, dens:0.55, pad:0.05},
    l0:  {bpm:86, root:62, mode:'phrygDom', prog:[0,0,3,0,4,3,0,0], lead:'flute', arp:'harp', drums:1, dens:0.6,  pad:0.045},   // Pirámide
    l1:  {bpm:78, root:57, mode:'hijaz',    prog:[0,3,0,4],     lead:'harp',  arp:'harp',  drums:1, dens:0.7,  pad:0.05},    // Jardines
    l2:  {bpm:92, root:62, mode:'dorian',   prog:[0,3,4,0,5,3,4,0], lead:'flute', arp:'harp', drums:2, dens:0.5, pad:0.06, timp:1}, // Zeus
    l3:  {bpm:84, root:55, mode:'mixo',     prog:[0,6,3,4],     lead:'flute', arp:'harp',  drums:1, dens:0.65, pad:0.05},    // Artemisa
    l4:  {bpm:72, root:52, mode:'aeolian',  prog:[0,5,3,6],     lead:'flute', arp:'harp',  drums:1, dens:0.45, pad:0.07, timp:1}, // Mausoleo
    l5:  {bpm:100,root:60, mode:'ionian',   prog:[0,4,5,3,0,4,3,4], lead:'flute', arp:'harp', drums:2, dens:0.6, pad:0.05, timp:1}, // Coloso
    l6:  {bpm:82, root:53, mode:'lydian',   prog:[0,4,1,5],     lead:'harp',  arp:'harp',  drums:1, dens:0.7,  pad:0.05, waves:1}, // Faro
  };
  const rng=seed=>()=>{ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return((t^t>>>14)>>>0)/4294967296; };

  let cur=null; // {id, tr, gain, bar, next, rnd, phrase, timer}
  const deg=(tr,d)=>{ const m=MODES[tr.mode]; const o=Math.floor(d/7); return tr.root+m[((d%7)+7)%7]+12*o; };

  const I={
    harp:(m,t,d,v,dest)=>{ const f=mtof(m); tone('triangle',f,t,d,v,dest,{lp:3800}); tone('sine',f*2,t,d*0.6,v*0.35,dest); },
    flute:(m,t,d,v,dest)=>{ const f=mtof(m), os=ctx.createOscillator(), lfo=ctx.createOscillator(), lg=ctx.createGain(), g=ctx.createGain();
      os.type='sine'; os.frequency.value=f; lfo.frequency.value=5.2; lg.gain.value=f*0.005; lfo.connect(lg); lg.connect(os.frequency);
      g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.07); g.gain.setValueAtTime(v*0.9,t+Math.max(0.08,d-0.12)); g.gain.exponentialRampToValueAtTime(0.0001,t+d);
      os.connect(g); g.connect(dest); os.start(t); lfo.start(t); os.stop(t+d+0.05); lfo.stop(t+d+0.05);
      noise(t,d*0.7,v*0.12,{type:'bandpass',f:f*2,q:3,dest}); },
    pad:(m,t,d,v,dest)=>{ [-6,6].forEach(c=>{ const os=ctx.createOscillator(), fl=ctx.createBiquadFilter(), g=ctx.createGain();
      os.type='triangle'; os.frequency.value=mtof(m); os.detune.value=c; fl.type='lowpass'; fl.frequency.value=900;
      g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+Math.min(1.1,d*0.4)); g.gain.setValueAtTime(v,t+d-0.9); g.gain.linearRampToValueAtTime(0.0001,t+d+0.6);
      os.connect(fl); fl.connect(g); g.connect(dest); os.start(t); os.stop(t+d+0.7); }); },
    bass:(m,t,d,v,dest)=>{ tone('sine',mtof(m),t,d,v,dest,{attack:0.012}); tone('triangle',mtof(m)*2,t,d*0.5,v*0.18,dest); },
  };
  const drum=(kind,t,v,dest)=>{
    if(kind==='frame'){ tone('sine',135,t,0.16,v,dest,{to:62}); noise(t,0.09,v*0.5,{f:420,dest}); }
    else if(kind==='timp'){ tone('sine',92,t,0.55,v*1.2,dest,{to:52}); noise(t,0.12,v*0.4,{f:300,dest}); }
    else noise(t,0.05,v*0.35,{type:'highpass',f:6500,dest});
  };

  function scheduleBar(m){
    const tr=m.tr, beat=60/tr.bpm, t0=m.next, d=m.gain, rnd=m.rnd;
    const ch=tr.prog[m.bar%tr.prog.length], tones=[deg(tr,ch),deg(tr,ch+2),deg(tr,ch+4)];
    I.pad(tones[0]-12,t0,4*beat,tr.pad,d); I.pad(tones[1]-12,t0,4*beat,tr.pad*0.8,d); I.pad(tones[2]-12,t0,4*beat,tr.pad*0.7,d);
    I.bass(tones[0]-24,t0,1.6*beat,0.2,d); I.bass(tones[2]-24,t0+2*beat,1.2*beat,0.12,d);
    // arpegio en corcheas
    const pat=[0,1,2,3,2,1,2,1], eighth=beat/2;
    for(let i=0;i<8;i++){ if(rnd()<tr.dens+0.15){ const k=pat[i], note=tones[k%3]+12*(1+Math.floor(k/3)); I.harp(note,t0+i*eighth,beat*1.2,0.07+(i%4===0?0.025:0),d); } }
    // melodía: frase nueva cada 4 compases, repetida con variaciones en los dos siguientes
    if(m.bar%4===0||!m.phrase){ let g=ch+4+Math.floor(rnd()*3); const ph=[]; for(let i=0;i<8;i++){ if(rnd()<0.3){ ph.push(null); continue; } g+=Math.floor(rnd()*5)-2; g=Math.max(ch+1,Math.min(ch+9,g)); ph.push({g,len:rnd()<0.35?2:1}); } m.phrase=ph; }
    const ph=m.phrase.map(x=>x&&{g:x.g+(m.bar%4===2&&rnd()<0.4?1:0),len:x.len});
    if(m.bar%4!==3||rnd()<0.5) for(let i=0;i<8;i++){ const n=ph[i]; if(!n) continue; if(rnd()>tr.dens+0.3) continue;
      I[tr.lead](deg(tr,n.g)+12,t0+i*eighth,eighth*(n.len*1.8),0.1,d); }
    // percusión
    if(tr.drums){ drum('frame',t0,0.16,d); drum('frame',t0+2*beat,0.11,d); if(tr.drums>1){ drum('frame',t0+3.5*beat,0.08,d); for(let i=1;i<8;i+=2) drum('shaker',t0+i*eighth,0.09,d); } else if(rnd()<0.5) drum('shaker',t0+3*beat,0.08,d); }
    if(tr.timp&&m.bar%2===0) drum('timp',t0,0.2,d);
    if(tr.waves&&m.bar%2===1) noise(t0,3.4*beat,0.05,{f:500,to:1400,attack:1.6,dest:d});
    m.next+=4*beat; m.bar++;
  }
  function scheduleUntil(T){ if(!cur) return; while(cur.next<T) scheduleBar(cur); }
  function tick(){ if(cur&&ready()) scheduleUntil(ctx.currentTime+1.2); }

  function startTrack(id,when){
    const tr=TRACKS[id]; if(!tr||!ctx) return;
    const g=ctx.createGain(); g.gain.setValueAtTime(0.0001,when); g.gain.linearRampToValueAtTime(1,when+1.4); g.connect(musicBus);
    cur={id,tr,gain:g,bar:0,next:when+0.15,rnd:rng(id.split('').reduce((a,c)=>a*31+c.charCodeAt(0),7)+Date.now()%1000),phrase:null};
  }
  function stopCurrent(fade){
    if(!cur) return; const old=cur; cur=null; const now=ctx.currentTime;
    old.gain.gain.cancelScheduledValues(now); old.gain.gain.setValueAtTime(old.gain.gain.value,now); old.gain.gain.linearRampToValueAtTime(0.0001,now+fade);
    setTimeout(()=>{ try{ old.gain.disconnect(); }catch(e){} },(fade+2)*1000);
  }
  let timer=null;
  function music(id){
    wanted=id; if(!ctx||!started) return;
    if(cur&&cur.id===id) return;
    if(!cfg.music){ stopCurrent(0.3); return; }
    if(cur) stopCurrent(1.1);
    startTrack(id,ctx.currentTime+(cur?0.2:0)); tick();
  }

  // ── Control ──
  function unlock(){
    if(!ctx){ const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return; try{ build(new AC()); }catch(e){ return; } }
    const go=()=>{ started=true; if(wanted&&!cur&&cfg.music) music(wanted); if(!timer) timer=setInterval(tick,250); };
    if(ctx.state==='suspended') ctx.resume().then(go).catch(()=>{}); else go();
  }
  function apply(){ if(!ctx) return; const now=ctx.currentTime;
    musicBus.gain.cancelScheduledValues(now); musicBus.gain.setTargetAtTime(cfg.music?cfg.mvol:0,now,0.15);
    sfxBus.gain.setTargetAtTime(cfg.sfx?1:0,now,0.05); master.gain.setTargetAtTime(cfg.vol,now,0.05); }
  function toggleMusic(){ cfg.music=!cfg.music; save(); apply(); if(cfg.music){ if(wanted){ const w=wanted; cur=null; started=true; music(w); } } else stopCurrent(0.4); return cfg.music; }
  function toggleSfx(){ cfg.sfx=!cfg.sfx; save(); apply(); if(cfg.sfx) play('click'); return cfg.sfx; }
  function set(k,v){ cfg[k]=Math.max(0,Math.min(1,v)); save(); apply(); }
  function duck(sec){ if(!ctx) return; const now=ctx.currentTime, v=cfg.music?cfg.mvol:0; musicBus.gain.cancelScheduledValues(now); musicBus.gain.setTargetAtTime(v*0.2,now,0.1); musicBus.gain.setTargetAtTime(v,now+sec,0.6); }
  document.addEventListener('visibilitychange',()=>{ if(!ctx||!started) return; if(document.hidden) ctx.suspend(); else ctx.resume(); });
  ['pointerdown','keydown','touchstart'].forEach(ev=>window.addEventListener(ev,unlock,{passive:true}));

  // Para las pruebas: renderiza una pista o un efecto sin salida de audio real.
  async function render(what,secs){
    const saved={ctx,cur,started,wanted,master,musicBus,sfxBus,revIn,noiseBuf}, oc=new OfflineAudioContext(2,Math.floor(44100*secs),44100);
    build(oc); started=true; cur=null;
    if(TRACKS[what]){ startTrack(what,0); scheduleUntil(secs); } else { const f=S[what]; f(0.01); }
    const buf=await oc.startRendering();
    ({ctx,cur,started,wanted,master,musicBus,sfxBus,revIn,noiseBuf}=saved);
    return buf;
  }
  return { play, music, unlock, toggleMusic, toggleSfx, set, duck, cfg, TRACKS, S, render, get ready(){ return ready(); } };
})();
