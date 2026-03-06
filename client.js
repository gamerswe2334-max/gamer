'use strict';

// ═══ AUDIO ═══
let AC=null;
function initAC(){if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();}
function noiseShot(t='ak'){if(!AC)return;const len=t==='awp'?.28:t==='deagle'?.16:.10;const buf=AC.createBuffer(1,AC.sampleRate*len,AC.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(AC.sampleRate*(t==='awp'?.09:.032)));const src=AC.createBufferSource();src.buffer=buf;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=t==='awp'?520:t==='deagle'?700:1200;f.Q.value=.35;const g=AC.createGain();g.gain.value=t==='awp'?2.2:t==='deagle'?1.4:1;src.connect(f);f.connect(g);g.connect(AC.destination);src.start();}
function playHit(){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);o.frequency.setValueAtTime(900,AC.currentTime);o.frequency.exponentialRampToValueAtTime(200,AC.currentTime+.06);g.gain.setValueAtTime(.4,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.06);o.start();o.stop(AC.currentTime+.06);}
function playStep(){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.connect(g);g.connect(AC.destination);o.frequency.setValueAtTime(55+Math.random()*20,AC.currentTime);o.frequency.exponentialRampToValueAtTime(28,AC.currentTime+.09);g.gain.setValueAtTime(.05,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.09);o.start();o.stop(AC.currentTime+.09);}
function playReload(){if(!AC)return;[[0,850],[.2,480],[.58,1100]].forEach(([t,fr])=>{const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.connect(g);g.connect(AC.destination);o.frequency.value=fr;g.gain.setValueAtTime(.12,AC.currentTime+t);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+t+.07);o.start(AC.currentTime+t);o.stop(AC.currentTime+t+.07);});}
function playExplosion(){if(!AC)return;const buf=AC.createBuffer(1,AC.sampleRate*.9,AC.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,1.3);const src=AC.createBufferSource();src.buffer=buf;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=350;const g=AC.createGain();g.gain.value=3.2;src.connect(f);f.connect(g);g.connect(AC.destination);src.start();}
function playBounce(){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=260+Math.random()*80;o.connect(g);g.connect(AC.destination);g.gain.setValueAtTime(.08,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.07);o.start();o.stop(AC.currentTime+.07);}
function playPinPull(){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(1200,AC.currentTime);o.frequency.exponentialRampToValueAtTime(600,AC.currentTime+.08);o.connect(g);g.connect(AC.destination);g.gain.setValueAtTime(.14,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.08);o.start();o.stop(AC.currentTime+.08);}
function playBeep(freq,dur){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=freq||880;o.connect(g);g.connect(AC.destination);g.gain.setValueAtTime(.16,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+(dur||.1));o.start();o.stop(AC.currentTime+(dur||.1));}

// ═══ TEXTURES ═══
function mktex(fn,w,h,rx,ry){const c=document.createElement('canvas');c.width=w||256;c.height=h||256;fn(c.getContext('2d'),c.width,c.height);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx||4,ry||4);return t;}
const TX={
  sand:mktex((ctx,w,h)=>{
    ctx.fillStyle='#C8A050';ctx.fillRect(0,0,w,h);
    for(let i=0;i<12000;i++){const v=130+~~(Math.random()*80),a=Math.random()*.4;
      ctx.fillStyle=`rgba(${v+20},${~~(v*.72)},${~~(v*.32)},${a})`;
      ctx.fillRect(Math.random()*w,Math.random()*h,Math.random()*4+.5,Math.random()*.8+.2);}
    // ripple lines
    ctx.strokeStyle='rgba(180,130,60,.12)';ctx.lineWidth=1;
    for(let y=0;y<h;y+=8){ctx.beginPath();ctx.moveTo(0,y+Math.random()*3);ctx.lineTo(w,y+Math.random()*3);ctx.stroke();}
  },256,256,7,7),
  brick:mktex((ctx,w,h)=>{const BW=48,BH=24,M=3;ctx.fillStyle='#6a4020';ctx.fillRect(0,0,w,h);for(let row=0;row*(BH+M)<h+BH;row++){const off=(row%2)*(BW>>1);for(let col=-1;col*(BW+M)<w+BW;col++){const x=col*(BW+M)+off,y=row*(BH+M),s=.7+Math.random()*.5;ctx.fillStyle=`rgb(${~~(150*s)},${~~(70*s)},${~~(38*s)})`;ctx.fillRect(x,y,BW,BH);}}},256,128,3,2),
  sandstone:mktex((ctx,w,h)=>{
    // Sandstone block pattern - warm tan layers
    ctx.fillStyle='#C8A055';ctx.fillRect(0,0,w,h);
    for(let y=0;y<h;y+=32){
      const s=.8+Math.random()*.4;
      ctx.fillStyle=`rgb(${~~(200*s)},${~~(155*s)},${~~(80*s)})`;
      ctx.fillRect(0,y,w,30);
      // Horizontal grain lines
      ctx.fillStyle='rgba(100,70,30,.3)';ctx.fillRect(0,y+28,w,2);
    }
    for(let i=0;i<3000;i++){const v=150+~~(Math.random()*60);
      ctx.fillStyle=`rgba(${v},${~~(v*.7)},${~~(v*.4)},.3)`;
      ctx.fillRect(Math.random()*w,Math.random()*h,~~(Math.random()*5)+1,1);}
  },256,256,4,4),
  concrete:mktex((ctx,w,h)=>{ctx.fillStyle='#787878';ctx.fillRect(0,0,w,h);for(let i=0;i<5000;i++){const v=~~(88+Math.random()*70);ctx.fillStyle=`rgba(${v},${v},${v},.25)`;ctx.fillRect(Math.random()*w,Math.random()*h,~~(Math.random()*3),~~(Math.random()*3));}ctx.strokeStyle='rgba(40,40,40,.4)';ctx.lineWidth=1.5;for(let x=0;x<w;x+=64){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<h;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}},256,256,4,4),
  floor_dust:mktex((ctx,w,h)=>{ctx.fillStyle='#A07840';ctx.fillRect(0,0,w,h);for(let i=0;i<10000;i++){const v=~~(100+Math.random()*90);ctx.fillStyle=`rgba(${v+20},${~~(v*.7)},${~~(v*.3)},.4)`;ctx.fillRect(Math.random()*w,Math.random()*h,Math.random()*2+.5,Math.random()*2+.5);}},256,256,8,8),
  floor_tile:mktex((ctx,w,h)=>{ctx.fillStyle='#525252';ctx.fillRect(0,0,w,h);for(let i=0;i<5000;i++){const v=~~(58+Math.random()*50);ctx.fillStyle=`rgba(${v},${v},${v},.3)`;ctx.fillRect(Math.random()*w,Math.random()*h,2,2);}ctx.strokeStyle='rgba(28,28,28,.6)';ctx.lineWidth=2;for(let x=0;x<w;x+=64){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<h;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}},256,256,9,9),
  metal:mktex((ctx,w,h)=>{for(let y=0;y<h;y++){const g=68+~~(50*Math.sin(y/h*Math.PI*6));ctx.fillStyle=`rgb(${g+10},${g+10},${g+14})`;ctx.fillRect(0,y,w,1);}ctx.fillStyle='rgba(50,50,50,.7)';for(let x=48;x<w;x+=64)for(let y=48;y<h;y+=64){ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();}},256,256,2,2),
  crate:mktex((ctx,w,h)=>{ctx.fillStyle='#7a5818';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#4a3008';ctx.lineWidth=4;ctx.strokeRect(4,4,w-8,h-8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(4,4);ctx.lineTo(w-4,h-4);ctx.stroke();ctx.beginPath();ctx.moveTo(w-4,4);ctx.lineTo(4,h-4);ctx.stroke();},128,128,1,1),
};

// ═══ WEAPONS CATALOG ───────────────────────────────
// team: 't'=T only, 'ct'=CT only, 'both'=both
const WCAT=[
  {id:0,name:'Glock-18',team:'t',  price:0,   snd:'deagle',dmg:24,rpm:400,spread:.06,recoil:.016,recoilH:.010,mag:20,rsv:120,auto:false,reload:2200,range:80, sniper:false,pistol:true},
  {id:1,name:'USP-S',   team:'ct', price:0,   snd:'deagle',dmg:30,rpm:352,spread:.04,recoil:.018,recoilH:.009,mag:12,rsv: 24,auto:false,reload:2000,range:90, sniper:false,pistol:true},
  {id:2,name:'Deagle',  team:'both',price:700, snd:'deagle',dmg:53,rpm:267,spread:.048,recoil:.034,recoilH:.020,mag:7,rsv:35,auto:false,reload:2100,range:140,sniper:false,pistol:true},
  {id:3,name:'AK-47',   team:'t',  price:2700, snd:'ak',   dmg:36,rpm:600,spread:.028,recoil:.022,recoilH:.012,mag:30,rsv: 90,auto:true, reload:2500,range:180,sniper:false,pistol:false},
  {id:4,name:'M4A4',    team:'ct', price:3100, snd:'ak',   dmg:29,rpm:800,spread:.022,recoil:.016,recoilH:.009,mag:30,rsv: 90,auto:true, reload:2200,range:180,sniper:false,pistol:false},
  {id:5,name:'AWP',     team:'both',price:4750,snd:'awp',  dmg:115,rpm:41,spread:.001,recoil:.065,recoilH:.008,mag:10,rsv:30,auto:false,reload:3700,range:500,sniper:true,pistol:false},
  {id:6,name:'Frag HE', isGrenade:true,grenType:'frag',price:300},
  {id:7,name:'Smoke',   isGrenade:true,grenType:'smoke',price:300},
  {id:8,name:'C4 Bomb', isBomb:true},
  {id:9, name:'Ніж',     team:'both',price:0,   snd:'knife',dmg:65, rpm:80, spread:0,   recoil:0,   recoilH:0,   mag:1, rsv:0,  auto:false,reload:0,   range:1.8,sniper:false,pistol:false,isKnife:true},
  {id:10,name:'Дефюз-кіт',team:'ct',price:400,isKit:true,mag:0,rsv:0},
  {id:11,name:'P250',    team:'both',price:300, snd:'deagle',dmg:38, rpm:400,spread:.052,recoil:.022,recoilH:.012,mag:13,rsv:52, auto:false,reload:2100,range:100,sniper:false,pistol:true},
  {id:12,name:'MP5-SD',  team:'ct',  price:1500,snd:'ak',   dmg:27, rpm:800,spread:.040,recoil:.012,recoilH:.007,mag:30,rsv:120,auto:true, reload:2000,range:110,sniper:false,pistol:false},
  {id:13,name:'SG 553',  team:'t',   price:2750,snd:'ak',   dmg:40, rpm:545,spread:.026,recoil:.024,recoilH:.013,mag:30,rsv:90, auto:true, reload:2600,range:200,sniper:false,pistol:false},
  {id:14,name:'M249',    team:'both',price:5200,snd:'ak',   dmg:32, rpm:750,spread:.060,recoil:.018,recoilH:.010,mag:100,rsv:200,auto:true,reload:4800,range:160,sniper:false,pistol:false},
];
// Armor cost
const ARMOR_PRICE=650;
function wepForTeam(team,pistolOnly){
  return WCAT.filter(w=>{
    if(w.isGrenade||w.isBomb||w.isKnife||w.isKit)return false;
    const ok=w.team==='both'||w.team===team;
    if(!ok)return false;
    if(pistolOnly)return w.pistol;
    return true;
  });
}

// ═══ MAPS ═══
const MAPS=[
 // ── DE_DUST2 (improved) ──
 {name:'de_dust2',theme:'#C49040',sky:0x9EC4DC,amb:0xFFEECC,sun:0xFFDD88,fog:0xC8A87A,fogD:.010,
  ctSpawn:{x:-4,z:-30},tSpawn:{x:4,z:30},
  bombSites:[{name:'A',x:-20,z:-20,r:5.5},{name:'B',x:22,z:18,r:5.5}],
  bSpawns:[{x:-10,z:-28,tm:'ct'},{x:-18,z:-26,tm:'ct'},{x:-4,z:-34,tm:'ct'},{x:12,z:28,tm:'t'},{x:20,z:24,tm:'t'},{x:4,z:32,tm:'t'}],
  walls:[
    [0,-.1,0,80,.2,80,'floor_dust'],
    [-40,2.5,0,.6,5,80,'brick'],[40,2.5,0,.6,5,80,'brick'],
    [0,2.5,-40,80,5,.6,'brick'],[0,2.5,40,80,5,.6,'brick'],
    // Mid wall with openings
    [-8,2.5,0,.6,5,22,'brick'],[8,2.5,0,.6,5,22,'brick'],
    // Catwalk / A side walls
    [-28,2.5,-12,.6,5,20,'brick'],[-22,2.5,-28,20,5,.6,'brick'],
    [-14,2.5,-20,.6,5,16,'brick'],
    // B site walls
    [28,2.5,10,.6,5,24,'brick'],[22,2.5,26,16,5,.6,'brick'],
    [30,2.5,22,.6,5,10,'brick'],
    // Cover boxes at A
    [-20,.65,-20,2.2,1.4,2.2,'crate'],[-16,.65,-18,2,1.0,2,'crate'],[-22,.65,-16,2,1.3,2,'crate'],
    // Cover boxes at B
    [22,.65,18,2.2,1.4,2.2,'crate'],[18,.65,20,2,1.0,2,'crate'],[26,.65,16,2,1.3,2,'crate'],
    // Mid cover
    [0,.65,4,2,1.3,2,'crate'],[0,.65,-4,2,0.8,2,'crate'],
    [-6,.65,10,2,1.3,2,'crate'],[6,.65,-10,2,1.3,2,'crate'],
    // Long A cover
    [-32,.65,-8,2,1.3,2,'crate'],[-30,.65,0,2,1.3,2,'crate'],
    [-36,2.5,8,.6,3,10,'brick'],
  ]},
 // ── CS_OFFICE (improved) ──
 {name:'cs_office',theme:'#445566',sky:0x6688AA,amb:0xCCDDEE,sun:0xFFFFCC,fog:0x334455,fogD:.013,
  ctSpawn:{x:-30,z:-28},tSpawn:{x:30,z:28},
  bombSites:[{name:'A',x:-16,z:2,r:5.5},{name:'B',x:16,z:-2,r:5.5}],
  bSpawns:[{x:-24,z:-24,tm:'ct'},{x:-20,z:-28,tm:'ct'},{x:-28,z:-20,tm:'ct'},{x:24,z:24,tm:'t'},{x:20,z:28,tm:'t'},{x:28,z:20,tm:'t'}],
  walls:[
    [0,-.1,0,80,.2,80,'floor_tile'],[0,5.1,0,80,.2,80,'concrete'],
    [-40,2.7,0,.6,5.4,80,'concrete'],[40,2.7,0,.6,5.4,80,'concrete'],
    [0,2.7,-40,80,5.4,.6,'concrete'],[0,2.7,40,80,5.4,.6,'concrete'],
    // Main hall divider
    [0,2.7,0,.6,5,20,'concrete'],
    // Side corridors
    [-18,2.7,14,24,5,.6,'concrete'],[-18,2.7,-14,24,5,.6,'concrete'],
    [18,2.7,14,24,5,.6,'concrete'],[18,2.7,-14,24,5,.6,'concrete'],
    // Room separators
    [-8,2.7,26,.6,5,14,'concrete'],[8,2.7,-26,.6,5,14,'concrete'],
    [-28,2.7,8,18,5,.6,'concrete'],[28,2.7,-8,18,5,.6,'concrete'],
    // Furniture/cover
    [-16,.55,2,3.5,.9,1.6,'crate'],[-12,.55,4,1.6,.9,3.5,'crate'],
    [16,.55,-2,3.5,.9,1.6,'crate'],[12,.55,-4,1.6,.9,3.5,'crate'],
    [-24,.55,0,2,1.3,2,'crate'],[24,.55,0,2,1.3,2,'crate'],
    [0,.55,20,3.5,.9,1.6,'crate'],[0,.55,-20,3.5,.9,1.6,'crate'],
    [-10,.55,-26,2,1.3,2,'crate'],[10,.55,26,2,1.3,2,'crate'],
  ]},
 // ── DE_NUKE (improved) ──
 {name:'de_nuke',theme:'#3a4a3a',sky:0x2a3a4a,amb:0xAABBCC,sun:0xCCDDFF,fog:0x1a2a2a,fogD:.015,
  ctSpawn:{x:-28,z:-24},tSpawn:{x:28,z:24},
  bombSites:[{name:'A',x:-16,z:0,r:5.5},{name:'B',x:16,z:0,r:5.5}],
  bSpawns:[{x:-22,z:-22,tm:'ct'},{x:-28,z:-16,tm:'ct'},{x:-16,z:-28,tm:'ct'},{x:22,z:22,tm:'t'},{x:28,z:16,tm:'t'},{x:16,z:28,tm:'t'}],
  walls:[
    [0,-.1,0,80,.2,80,'floor_tile'],[0,6.1,0,80,.2,80,'metal'],
    [-40,3,0,.6,6.4,80,'metal'],[40,3,0,.6,6.4,80,'metal'],
    [0,3,-40,80,6.4,.6,'metal'],[0,3,40,80,6.4,.6,'metal'],
    // Reactor core walls
    [0,3,8,14,6,.6,'metal'],[0,3,-8,14,6,.6,'metal'],
    [8,3,0,.6,6,18,'metal'],[-8,3,0,.6,6,18,'metal'],
    // Side corridors
    [26,3,0,.6,6,20,'metal'],[-26,3,0,.6,6,20,'metal'],
    // A site
    [-16,3,12,.6,6,16,'metal'],[-16,3,-12,.6,6,16,'metal'],
    // B site
    [16,3,12,.6,6,16,'metal'],[16,3,-12,.6,6,16,'metal'],
    // Metal barrels/covers
    [-16,1.6,0,2.2,3.2,2.2,'metal'],[-12,1.6,4,2.2,3.2,2.2,'metal'],[-12,1.6,-4,2.2,3.2,2.2,'metal'],
    [16,1.6,0,2.2,3.2,2.2,'metal'],[12,1.6,4,2.2,3.2,2.2,'metal'],[12,1.6,-4,2.2,3.2,2.2,'metal'],
    [0,1.6,20,2.2,3.2,2.2,'metal'],[0,1.6,-20,2.2,3.2,2.2,'metal'],
    [-26,1.6,-10,2,1.3,2,'crate'],[26,1.6,10,2,1.3,2,'crate'],
  ]},
 // ── DE_SANDSTONE (new map) ──
 {name:'de_sandstone',theme:'#D4A860',sky:0xE8C878,amb:0xFFDDAA,sun:0xFFCC66,fog:0xD4A060,fogD:.009,
  ctSpawn:{x:-8,z:-30},tSpawn:{x:8,z:30},
  bombSites:[{name:'A',x:-18,z:-16,r:5.5},{name:'B',x:20,z:16,r:5.5}],
  bSpawns:[{x:-14,z:-28,tm:'ct'},{x:-22,z:-24,tm:'ct'},{x:-6,z:-32,tm:'ct'},{x:14,z:28,tm:'t'},{x:22,z:24,tm:'t'},{x:6,z:32,tm:'t'}],
  walls:[
    [0,-.1,0,80,.2,80,'sand'],
    [-40,3,0,.6,6,80,'sandstone'],[40,3,0,.6,6,80,'sandstone'],
    [0,3,-40,80,6,.6,'sandstone'],[0,3,40,80,6,.6,'sandstone'],
    // Ancient ruins / pillars
    [-20,3,-16,14,6,.6,'sandstone'],[-20,3,4,14,6,.6,'sandstone'],[-27,3,-6,.6,6,20,'sandstone'],
    // B ruins
    [20,3,16,14,6,.6,'sandstone'],[20,3,-4,14,6,.6,'sandstone'],[27,3,6,.6,6,20,'sandstone'],
    // Mid oasis area
    [-6,3,0,.6,6,12,'sandstone'],[6,3,0,.6,6,12,'sandstone'],
    [0,3,8,10,6,.6,'sandstone'],[0,3,-8,10,6,.6,'sandstone'],
    // Arched passage hints (short walls)
    [-14,3,-6,.6,3,6,'sandstone'],[-14,3,6,.6,3,6,'sandstone'],
    [14,3,-6,.6,3,6,'sandstone'],[14,3,6,.6,3,6,'sandstone'],
    // Sandstone pillars (tall blocks)
    [-18,.65,-16,2.5,5.5,2.5,'sandstone'],[-22,.65,-12,2.5,5.5,2.5,'sandstone'],
    [18,.65,16,2.5,5.5,2.5,'sandstone'],[22,.65,12,2.5,5.5,2.5,'sandstone'],
    // Low sand cover
    [-10,.65,-22,3,1.0,1.5,'crate'],[-18,.65,-8,1.5,1.0,3,'crate'],
    [10,.65,22,3,1.0,1.5,'crate'],[18,.65,8,1.5,1.0,3,'crate'],
    [0,.65,16,2,1.3,2,'crate'],[0,.65,-16,2,1.3,2,'crate'],
    // Market stalls
    [-6,.65,-26,2,1.2,2,'crate'],[6,.65,26,2,1.2,2,'crate'],
    [-30,.65,-6,2,1.3,2,'crate'],[30,.65,6,2,1.3,2,'crate'],
  ]},
];

// ═══ THREE.JS SETUP ═══
const canvas=document.getElementById('c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(73,innerWidth/innerHeight,.04,220);
const wGrp=new THREE.Group();camera.add(wGrp);scene.add(camera);

// ═══ AWP SCOPE ═══
const SSIZE=Math.min(innerWidth,innerHeight)*.68;
document.getElementById('scope-glass').style.width=document.getElementById('scope-glass').style.height=SSIZE+'px';
const ssv=document.getElementById('scope-svg');
ssv.setAttribute('width',SSIZE);ssv.setAttribute('height',SSIZE);ssv.setAttribute('viewBox','-200 -200 400 400');ssv.style.width=ssv.style.height=SSIZE+'px';
(()=>{const ns='http://www.w3.org/2000/svg';
const L=(x1,y1,x2,y2,c,w)=>{const l=document.createElementNS(ns,'line');l.setAttribute('x1',x1);l.setAttribute('y1',y1);l.setAttribute('x2',x2);l.setAttribute('y2',y2);l.setAttribute('stroke',c||'rgba(0,210,85,.85)');l.setAttribute('stroke-width',w||1.2);ssv.appendChild(l);};
const D=(x,y,r,c)=>{const ci=document.createElementNS(ns,'circle');ci.setAttribute('cx',x);ci.setAttribute('cy',y);ci.setAttribute('r',r||2.2);ci.setAttribute('fill',c||'rgba(0,210,85,.9)');ssv.appendChild(ci);};
const cr=document.createElementNS(ns,'circle');cr.setAttribute('cx',0);cr.setAttribute('cy',0);cr.setAttribute('r',188);cr.setAttribute('fill','none');cr.setAttribute('stroke','rgba(0,160,60,.18)');cr.setAttribute('stroke-width',1);ssv.appendChild(cr);
for(let a=0;a<360;a+=3){const r=a*Math.PI/180,isL=a%30===0,isM=a%10===0,len=isL?10:isM?6:2.5,r1=188,r2=188-len;L(r1*Math.sin(r),-r1*Math.cos(r),r2*Math.sin(r),-r2*Math.cos(r),'rgba(0,170,65,.4)',isL?1.2:isM?.9:.5);}
L(-188,0,-16,0);L(16,0,188,0);L(0,-188,0,-16);L(0,16,0,188);
L(-13,0,-6,0,'rgba(0,240,100,.95)',2.8);L(6,0,13,0,'rgba(0,240,100,.95)',2.8);L(0,-13,0,-6,'rgba(0,240,100,.95)',2.8);L(0,6,0,13,'rgba(0,240,100,.95)',2.8);
D(0,0,1.6,'rgba(0,255,100,1)');[-150,-100,-50,50,100,150].forEach(x=>{D(x,0,2.4);D(0,x,2.4);});
const dc=document.getElementById('scope-dust');dc.width=dc.height=SSIZE;dc.style.width=dc.style.height=SSIZE+'px';
const dctx=dc.getContext('2d');for(let i=0;i<500;i++){dctx.fillStyle=`rgba(0,0,0,${Math.random()*.2})`;dctx.beginPath();dctx.arc(Math.random()*SSIZE,Math.random()*SSIZE,Math.random()*2+.2,0,Math.PI*2);dctx.fill();}
const gr=dctx.createRadialGradient(SSIZE/2,SSIZE/2,SSIZE*.1,SSIZE/2,SSIZE/2,SSIZE*.49);gr.addColorStop(0,'rgba(0,25,8,.05)');gr.addColorStop(1,'rgba(0,0,0,.38)');dctx.fillStyle=gr;dctx.fillRect(0,0,SSIZE,SSIZE);
})();
let scopeBreath=0;
function updScopeBreath(dt){scopeBreath+=dt*.85;const sw=2.5;document.getElementById('scope-inner').style.transform=`translate(calc(-50% + ${Math.sin(scopeBreath*.65)*sw}px),calc(-50% + ${Math.cos(scopeBreath)*.7*sw}px))`;}

// ═══ GUN MODELS ═══
// Camera looks down -Z. Barrel → -Z. Stock → +Z. Right → +X. Up → +Y.
// Group anchor ≈ trigger/grip area, placed via grp.position in camera space.
// wGrp has y-rotation -.12 applied in updatePlayer → gun angled naturally inward.
function buildGunModel(wepId){
  wGrp.clear();
  const Ph=(col,sh)=>new THREE.MeshPhongMaterial({color:col,shininess:sh||40});
  const Bx=(g,w,h,d,x,y,z,col,sh)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),Ph(col,sh));m.position.set(x,y,z);g.add(m);return m;};
  const Cy=(g,rt,rb,h,x,y,z,rx,col,sh)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,12),Ph(col,sh));m.position.set(x,y,z);if(rx)m.rotation.x=rx;g.add(m);return m;};
  const g=new THREE.Group();wGrp.add(g);

  // ── GLOCK-18 (T pistol) ──
  if(wepId===0){
    g.position.set(.18,-.22,-.36);
    Bx(g,.044,.068,.210,0,.010,-.055,0x1a1a20,80);   // slide
    Bx(g,.046,.054,.175,0,-.022,-.040,0x111,15);      // frame
    Cy(g,.011,.011,.215,0,.022,-.158,Math.PI/2,0x080808,80);// barrel
    Bx(g,.040,.110,.050,0,-.100,.022,0x111,10);       // grip
    Bx(g,.038,.012,.155,0,-.004,-.040,0x222,25);      // frame rail under slide
    for(let i=0;i<4;i++)Bx(g,.046,.068,.006,0,.010,.040+i*.014,0x282828,70);// serrations
    Bx(g,.012,.014,.009,0,.046,-.020,0x333,50);       // rear sight
    Bx(g,.005,.020,.006,0,.046,-.230,0x333,50);       // front sight
    Bx(g,.036,.080,.042,0,-.158,.016,0x1a1a1a,30);    // mag
    const tg=new THREE.Mesh(new THREE.TorusGeometry(.028,.005,5,12,Math.PI),Ph(0x111,25));tg.rotation.x=Math.PI;tg.position.set(0,-.055,.012);g.add(tg);
    return;
  }
  // ── USP-S (CT pistol) ──
  if(wepId===1){
    g.position.set(.18,-.22,-.36);
    Bx(g,.046,.070,.215,0,.012,-.058,0x888888,90);    // slide
    Bx(g,.048,.050,.175,0,-.020,-.042,0x666,50);      // frame
    Cy(g,.022,.019,.145,0,.012,-.252,Math.PI/2,0x4a4a4a,35);// suppressor
    Cy(g,.009,.009,.175,0,.012,-.160,Math.PI/2,0x111,80);   // barrel
    Bx(g,.040,.115,.046,0,-.090,.026,0x555,15);       // grip
    for(let i=0;i<4;i++)Bx(g,.038,.010,.040,0,-.065+i*.022,.026,0x444,10);// grip ridges
    Bx(g,.036,.075,.044,0,-.155,.020,0x555,55);       // mag
    const tg=new THREE.Mesh(new THREE.TorusGeometry(.026,.005,5,12,Math.PI),Ph(0x555,55));tg.rotation.x=Math.PI;tg.position.set(0,-.048,.012);g.add(tg);
    return;
  }
  // ── DESERT EAGLE ──
  if(wepId===2){
    g.position.set(.18,-.23,-.38);
    Bx(g,.054,.082,.238,0,.024,-.068,0x888888,90);    // slide
    Bx(g,.058,.060,.200,0,-.022,-.052,0x666,55);      // frame
    Cy(g,.015,.017,.295,0,.026,-.198,Math.PI/2,0x333,80);   // barrel
    Bx(g,.010,.012,.240,0,.068,-.185,0x666,75);       // barrel rib
    for(let i=0;i<5;i++)Bx(g,.056,.082,.007,0,.024,.014+i*.018,0x777,80);// serrations
    Bx(g,.010,.122,.175,0,-.026,.012,0x1a1a1a,8);     // left grip panel
    Bx(g,.038,.070,.046,0,-.145,.010,0x555,55);       // mag base
    const tg=new THREE.Mesh(new THREE.TorusGeometry(.030,.005,5,12,Math.PI),Ph(0x555,55));tg.rotation.x=Math.PI;tg.position.set(0,-.065,.012);g.add(tg);
    return;
  }
  // ── AK-47 ──
  if(wepId===3){
    g.position.set(.18,-.20,-.54);
    Bx(g,.054,.072,.280,0,.004,-.070,0x5a3a10,20);
    Cy(g,.009,.009,.260,0,.058,-.258,Math.PI/2,0x1a1a1a,35);
    Cy(g,.012,.014,.480,0,.014,-.390,Math.PI/2,0x181818,55);
    Bx(g,.050,.050,.195,0,.000,-.268,0x7a4810,15);
    Bx(g,.052,.014,.145,0,.044,.010,0x5a3a10,18);
    {const grip=new THREE.Mesh(new THREE.BoxGeometry(.040,.110,.052),Ph(0x3a1a04,15));grip.position.set(0,-.102,.052);grip.rotation.x=.28;g.add(grip);}
    {const tg=new THREE.Mesh(new THREE.TorusGeometry(.028,.005,5,12,Math.PI),Ph(0x1a1a1a,25));tg.rotation.x=Math.PI;tg.position.set(0,-.058,.044);g.add(tg);}
    {const mag=new THREE.Mesh(new THREE.BoxGeometry(.040,.165,.040),Ph(0x221508,22));mag.position.set(0,-.185,.042);mag.rotation.x=-.10;g.add(mag);}
    Bx(g,.042,.068,.200,0,-.012,.142,0x7a4810,15);
    Bx(g,.044,.084,.022,0,-.014,.244,0x3a1a04,18);
    Bx(g,.018,.015,.016,.038,.030,-.014,0x222,35);
    Bx(g,.005,.025,.005,0,.054,-.520,0x111,45);
    Cy(g,.018,.015,.038,0,.014,-.630,Math.PI/2,0x1a1a1a,50);
    return;
  }
  // ── M4A4 ──
  if(wepId===4){
    g.position.set(.18,-.20,-.54);
    Bx(g,.052,.070,.265,0,.004,-.062,0x2a3a2a,25);
    Bx(g,.056,.016,.320,0,.048,-.048,0x1a2a1a,28);
    for(let i=0;i<7;i++)Bx(g,.058,.007,.008,0,.057,-.185+i*.054,0x111,25);
    Bx(g,.052,.060,.215,0,-.001,-.240,0x1c2c1c,28);
    Cy(g,.011,.013,.420,0,.011,-.360,Math.PI/2,0x1a1a1a,55);
    Cy(g,.019,.019,.185,0,.011,.166,Math.PI/2,0x1a1a1a,38);
    Bx(g,.034,.058,.155,0,.009,.212,0x1c2c1c,22);
    Bx(g,.036,.072,.024,0,.009,.292,0x1a1a1a,28);
    {const grip=new THREE.Mesh(new THREE.BoxGeometry(.038,.105,.050),Ph(0x111,12));grip.position.set(0,-.098,.046);grip.rotation.x=.22;g.add(grip);}
    {const tg=new THREE.Mesh(new THREE.TorusGeometry(.026,.005,5,12,Math.PI),Ph(0x111,25));tg.rotation.x=Math.PI;tg.position.set(0,-.056,.044);g.add(tg);}
    Bx(g,.038,.170,.042,0,-.182,.032,0x1a1a1a,28);
    Bx(g,.014,.014,.020,0,.032,-.038,0x111,35);
    Cy(g,.018,.018,.060,0,.011,-.575,Math.PI/2,0x1a1a1a,48);
    return;
  }
  // ── AWP ──
  if(wepId===5){
    g.position.set(.18,-.20,-.58);
    Bx(g,.052,.076,.300,0,.004,-.072,0x2a2020,22);
    Cy(g,.014,.016,.620,0,.014,-.468,Math.PI/2,0x151515,65);
    Cy(g,.010,.010,.570,0,.014,-.443,Math.PI/2,0x0d0d0d,55);
    Bx(g,.054,.028,.225,0,.062,.042,0x111,38);
    Cy(g,.028,.028,.230,0,.070,.042,Math.PI/2,0x0a0a0a,80);
    Cy(g,.036,.028,.045,0,.070,-.074,Math.PI/2,0x0a0a0a,80);
    {const lens=new THREE.Mesh(new THREE.CircleGeometry(.026,14),new THREE.MeshPhongMaterial({color:0x0a2244,transparent:true,opacity:.75,shininess:140}));lens.rotation.y=Math.PI/2;lens.position.set(-.069,.070,-.074);g.add(lens);}
    Bx(g,.014,.014,.022,0,.083,.045,0x222,35);
    Bx(g,.022,.014,.014,.040,.097,.045,0x222,35);
    Bx(g,.052,.088,.240,0,-.016,.188,0x5a2a0a,14);
    Bx(g,.054,.100,.022,0,-.016,.312,0x3a1a04,16);
    {const grip=new THREE.Mesh(new THREE.BoxGeometry(.044,.120,.054),Ph(0x4a2008,14));grip.position.set(0,-.114,.040);grip.rotation.x=.18;g.add(grip);}
    {const tg=new THREE.Mesh(new THREE.TorusGeometry(.030,.005,5,12,Math.PI),Ph(0x111,25));tg.rotation.x=Math.PI;tg.position.set(0,-.068,.038);g.add(tg);}
    Bx(g,.040,.110,.044,0,-.180,.022,0x1a1010,22);
    {const bolt=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,.056,8),Ph(0x333,45));bolt.rotation.z=Math.PI/2;bolt.position.set(.054,.022,-.048);g.add(bolt);}
    {const bh=new THREE.Mesh(new THREE.SphereGeometry(.012,8,8),Ph(0x444,55));bh.position.set(.086,.022,-.048);g.add(bh);}
    return;
  }
  // ── FRAG GRENADE ──
  if(wepId===6){
    g.position.set(.14,-.20,-.40);
    Cy(g,.044,.050,.130,0,0,0,0,0x3a4822,18);
    for(let i=0;i<4;i++){const seg=new THREE.Mesh(new THREE.CylinderGeometry(.051,.051,.014,12),Ph(0x2a3818,12));seg.position.y=-.042+i*.028;g.add(seg);}
    Cy(g,.025,.044,.042,0,.086,0,0,0x3a4822,18);
    Bx(g,.008,.095,.028,0,.010,.050,0xAA9922,60);// lever
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.020,.005,6,14),Ph(0xCCCC33,80));ring.rotation.x=Math.PI/2;ring.position.set(.046,.090,0);g.add(ring);
    {const led=new THREE.Mesh(new THREE.SphereGeometry(.010,6,6),new THREE.MeshBasicMaterial({color:0xFF2200}));led.position.set(0,.105,0);g.add(led);let lt=0,alive=true;(function bl(){if(!alive)return;lt+=.016;led.material.color.setHex(Math.sin(lt*10)>.5?0xFF2200:0x330000);if(G.player.curWepId===6)requestAnimationFrame(bl);else alive=false;})();}
    return;
  }
  // ── SMOKE GRENADE ──
  if(wepId===7){
    g.position.set(.14,-.20,-.40);
    Cy(g,.046,.046,.175,0,0,0,0,0x4477AA,22);
    Cy(g,.048,.048,.026,0,.042,0,0,0xFFCC00,45);   // yellow stripe
    Cy(g,.026,.046,.038,0,.107,0,0,0x3366AA,22);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.020,.005,6,14),Ph(0xCCCC33,80));ring.rotation.x=Math.PI/2;ring.position.set(.044,.116,0);g.add(ring);
    return;
  }
  // ── C4 BOMB ──
  if(wepId===8){
    g.position.set(.16,-.16,-.40);
    // Main body - brick-like C4 block
    Bx(g,.200,.100,.280,0,0,0,0x8B9E6A,18);          // main block (olive green)
    Bx(g,.204,.104,.284,0,0,0,0x5A6B44,6);            // subtle border
    // Detonator panel on top
    Bx(g,.160,.008,.220,0,.054,0,0x2a2a2a,30);        // panel base
    const scr=new THREE.Mesh(new THREE.BoxGeometry(.100,.006,.130),new THREE.MeshBasicMaterial({color:0x00EE44}));scr.position.set(-.010,.060,-.020);g.add(scr); // LCD screen
    // Keypad buttons (3x2 grid)
    for(let r=0;r<2;r++)for(let c=0;c<3;c++){
      Bx(g,.022,.008,.020,(c-1)*.030,.060,.048+(r-.5)*.026,0x1a1a1a,30);
    }
    // Red LED indicator
    const led=new THREE.Mesh(new THREE.SphereGeometry(.011,8,8),new THREE.MeshBasicMaterial({color:0xFF2200}));
    led.position.set(.062,.060,-.065);g.add(led);
    let lt=0,alive=true;
    (function bl(){if(!alive)return;lt+=.016;led.material.color.setHex(Math.sin(lt*6)>.5?0xFF2200:0x330000);if(G.player.curWepId===8)requestAnimationFrame(bl);else alive=false;})();
    // Wires
    Bx(g,.006,.006,.100,-.080,.060,.030,0xFF2200,40); // red wire
    Bx(g,.006,.006,.080,.080,.060,.020,0x2200FF,40);  // blue wire
    // Straps
    Bx(g,.210,.016,.040,0,-.020,.060,0x4a3a20,15);    // strap
    Bx(g,.210,.016,.040,0,-.020,-.060,0x4a3a20,15);
    // Handle / grip tape
    Bx(g,.040,.100,.040,0,-.035,-.100,0x3a3020,12);
    return;
  }
  // ── KNIFE ──
  if(wepId===9){
    g.position.set(.16,-.20,-.36);
    // Blade (bright silver)
    Bx(g,.020,.160,.300,0,.010,-.100,0xCCCCCC,80);
    // Blade spine edge (slightly offset)
    Bx(g,.008,.008,.300,.012,.084,-.100,0xAAAAAA,60);
    // Guard (cross-piece)
    Bx(g,.012,.060,.050,0,-.030,.052,0x777777,60);
    // Handle
    Bx(g,.044,.050,.145,0,-.056,.120,0x2a1508,20);
    Bx(g,.046,.052,.008,0,-.056,.068,0x1a0e04,15);
    Bx(g,.046,.052,.008,0,-.056,.086,0x1a0e04,15);
    Bx(g,.046,.052,.008,0,-.056,.104,0x1a0e04,15);
    Bx(g,.046,.052,.008,0,-.056,.122,0x1a0e04,15);
    // Pommel
    Bx(g,.048,.054,.034,0,-.054,.196,0x666666,50);
    return;
  }
  // ── DEFUSE KIT (Pliers) ──
  if(wepId===10){
    g.position.set(.16,-.18,-.36);
    Bx(g,.022,.080,.055,-.024,.010,-.110,0x888888,70);
    Bx(g,.022,.080,.055, .024,.010,-.110,0x888888,70);
    Bx(g,.018,.010,.055,-.024,.054,-.110,0xDDAA22,60);
    Bx(g,.018,.010,.055, .024,.054,-.110,0xDDAA22,60);
    Bx(g,.060,.018,.018,0,-.002,-.062,0x555555,70);
    Bx(g,.022,.016,.165,-.026,.000,.060,0x444444,55);
    Bx(g,.022,.016,.165, .026,.000,.060,0x444444,55);
    Bx(g,.026,.026,.110,-.026,.000,.100,0xCC2222,20);
    Bx(g,.026,.026,.110, .026,.000,.100,0x2244CC,20);
    return;
  }
  // ── P250 ──
  if(wepId===11){
    g.position.set(.14,-.18,-.34);
    Bx(g,.038,.098,.180,0,.000,-.060,0x282828,30); // slide
    Bx(g,.040,.060,.140,0,-.060,.018,0x1a1a1a,22); // frame
    Bx(g,.030,.048,.050,0,-.100,.024,0x2a1a0a,18); // grip
    Bx(g,.022,.010,.180,.000,.052,-.060,0x111,40); // rail
    Cy(g,.014,.014,.160,0,.008,-.138,Math.PI/2,0x333,50); // barrel
    return;
  }
  // ── MP5-SD ──
  if(wepId===12){
    g.position.set(.16,-.18,-.42);
    Bx(g,.048,.074,.280,0,.004,-.100,0x1a1a1a,30); // receiver
    Bx(g,.046,.042,.260,0,-.040,.008,0x111,25);    // lower/grip area
    Bx(g,.036,.050,.040,0,-.086,.048,0x1a1a1a,20); // pistol grip
    Bx(g,.040,.016,.240,0,.048,-.090,0x222,35);    // top rail
    Cy(g,.018,.018,.200,0,.008,-.218,Math.PI/2,0x555,50); // suppressor
    Cy(g,.010,.010,.120,0,.008,-.178,Math.PI/2,0x1a1a1a,40); // barrel
    Bx(g,.030,.080,.025,0,-.042,-.178,0x111,20);   // mag
    return;
  }
  // ── SG 553 ──
  if(wepId===13){
    g.position.set(.18,-.20,-.48);
    Bx(g,.052,.078,.300,0,.006,-.100,0x2a2a20,28); // receiver
    Bx(g,.044,.044,.280,0,-.044,.006,0x1a1a14,22); // lower
    Bx(g,.038,.056,.040,0,-.092,.048,0x2a2010,18); // grip
    Bx(g,.044,.018,.300,0,.054,-.090,0x222,35);    // top rail
    Cy(g,.016,.016,.240,0,.010,-.226,Math.PI/2,0x333,50); // barrel
    Bx(g,.028,.092,.025,0,-.038,-.198,0x111,20);   // mag (angled like SG)
    Bx(g,.040,.016,.090,-.042,.010,-.050,0x1a1a14,22); // side rail
    return;
  }
  // ── M249 LMG ──
  if(wepId===14){
    g.position.set(.20,-.22,-.52);
    Bx(g,.058,.082,.380,0,.008,-.110,0x3a3a28,24); // receiver
    Bx(g,.050,.048,.360,0,-.048,.006,0x2a2a1a,20); // lower
    Bx(g,.044,.062,.044,0,-.100,.060,0x2a1a0a,16); // grip
    Bx(g,.050,.020,.380,0,.060,-.100,0x222,35);    // top rail
    Cy(g,.018,.018,.360,0,.012,-.276,Math.PI/2,0x444,50); // barrel (long)
    Bx(g,.050,.050,.030,0,-.018,-.296,0x333,30);   // bipod hint
    Bx(g,.030,.120,.028,0,-.028,-.160,0x111,20);   // box mag
    Bx(g,.060,.016,.040,.000,.018,-.306,0x555,40); // muzzle device
    return;
  }
}

// ═══ SHAKE ═══
const SHAKE={x:0,y:0,i:0};
function addShake(v){SHAKE.i=Math.min(SHAKE.i+v,.065);}
function updShake(){SHAKE.i*=.86;if(SHAKE.i>.0002){SHAKE.x=(Math.random()-.5)*SHAKE.i;SHAKE.y=(Math.random()-.5)*SHAKE.i;}else{SHAKE.x=0;SHAKE.y=0;SHAKE.i=0;}}

// ═══ STATE ═══
const G={
  phase:'menu',selMap:0,difficulty:0,
  playerTeam:'ct',
  score:{ctWins:0,tWins:0},
  round:{num:1,timer:120,phase:'playing'},
  economy:{money:800,lossSeries:0},
  buyPhase:{active:false,timer:0},
  player:{
    pos:new THREE.Vector3(),vel:new THREE.Vector3(),yaw:0,pitch:0,
    onGround:false,crouching:false,health:100,armor:0,alive:true,
    curWepId:0,        // weapon catalog ID
    wepSlots:[],       // array of {wep,ammo,reserve} currently owned
    curSlot:0,         // index into wepSlots
    reloading:false,reloadEnd:0,lastShot:0,scoped:false,hasKit:false,
    stepTimer:0,grenFrag:0,grenSmoke:0,prevSlot:0,
  },
  bots:[],colBoxes:[],sceneObjs:[],
  grenades:[],smokeFields:[],shells:[],siteMeshes:[],fxMeshes:[],
  drops:[],  // dropped weapons/items on ground
  bomb:{exists:false,carried:true,planted:false,plantX:0,plantZ:0,siteName:'',bombTimer:0,plantProgress:0,defuseProgress:0,beepTimer:0,mesh:null},
  gt:{active:false,type:'frag',charge:0,throwing:false,throwT:0},
  keys:{},mouseL:false,locked:false,
  recoil:{x:0,y:0},
};

function defaultWeps(team){
  const defId=team==='t'?0:1;
  const w=WCAT[defId];
  const knife=WCAT[9];
  return [{wep:{...w},ammo:w.mag,reserve:w.rsv},{wep:{...knife},ammo:999,reserve:0}];
}
function curWep(){
  const p=G.player;
  if(!p.wepSlots||p.curSlot>=p.wepSlots.length)return null;
  return p.wepSlots[p.curSlot];
}
function curWepDef(){const sw=curWep();return sw?sw.wep:null;}

// ═══ ECONOMY ═══
const KILL_REWARD=300;
const WIN_BONUS={ct:3250,t:3500};
const LOSS_BONUS=[1400,1900,2400,2900,3400]; // increases with loss streak, max index 4
function giveMoney(amt){G.economy.money=Math.min(16000,G.economy.money+amt);updateHUD();}
function roundEconomyBonus(winner){
  const isWin=winner===G.playerTeam;
  if(isWin){
    const bonus=WIN_BONUS[winner]||3250;
    giveMoney(bonus);
    G.economy.lossSeries=0;
    return '+$'+bonus+' (перемога)';
  }else{
    const idx=Math.min(G.economy.lossSeries,4);
    const bonus=LOSS_BONUS[idx];
    giveMoney(bonus);
    G.economy.lossSeries++;
    return '+$'+bonus+' (поразка)';
  }
}

// ═══ BUY MENU ═══
const BUY_TIME=20;
let buyTimerIv=null;
function startBuyPhase(){
  G.buyPhase.active=true;G.buyPhase.timer=BUY_TIME;
  // Show hint
  const h=document.getElementById('buy-hint');h.style.opacity='1';
  setTimeout(()=>h.style.opacity='0',4000);
  // Auto-open buy menu
  setTimeout(openBuyMenu,200);
  // Start countdown
  buyTimerIv=setInterval(()=>{
    G.buyPhase.timer--;
    document.getElementById('bm-timer').textContent='Час: '+G.buyPhase.timer+'с';
    if(G.buyPhase.timer<=0){clearInterval(buyTimerIv);G.buyPhase.active=false;closeBuyMenu();}
  },1000);
}
function openBuyMenu(){
  if(!G.buyPhase.active)return;
  document.getElementById('buy-menu').style.display='flex';
  G.phase='buying';document.exitPointerLock();
  renderBuyMenu();
}
function closeBuyMenu(){
  document.getElementById('buy-menu').style.display='none';
  if(G.phase==='buying'){G.phase='playing';canvas.requestPointerLock();}
}
function renderBuyMenu(){
  const pistolOnly=G.round.num===1;
  const money=G.economy.money;
  document.getElementById('bm-money').textContent='$'+money;
  const cols=document.getElementById('buy-cols');cols.innerHTML='';
  // Column definitions
  const sections=[
    {title:'Пістолети',items:WCAT.filter(w=>!w.isGrenade&&!w.isBomb&&!w.isKnife&&!w.isKit&&w.pistol&&(w.team==='both'||w.team===G.playerTeam))},
    {title:pistolOnly?'Рифлі (недоступно р.1)':'Рифлі',items:pistolOnly?[]:WCAT.filter(w=>!w.isGrenade&&!w.isBomb&&!w.isKnife&&!w.isKit&&!w.pistol&&(w.team==='both'||w.team===G.playerTeam))},
    {title:'Екіпіровка',items:[
      {id:'armor',name:'Кевлар',price:ARMOR_PRICE,desc:'Броня'},
      {id:'frag',name:'Frag граната',price:300},
      {id:'smoke',name:'Smoke граната',price:300},
      ...(G.playerTeam==='ct'?[WCAT[10]]:[]),
    ]},
  ];
  sections.forEach(sec=>{
    const col=document.createElement('div');col.className='buy-col';
    const title=document.createElement('div');title.className='buy-col-title';title.textContent=sec.title;col.appendChild(title);
    sec.items.forEach(item=>{
      const el=document.createElement('div');el.className='buy-item';
      // Check owned
      const owned=isOwned(item);
      const cantAfford=item.price>money;
      if(owned)el.classList.add('owned');
      else if(cantAfford)el.classList.add('cant');
      const key=document.createElement('span');key.className='bi-key';
      const name=document.createElement('span');name.className='bi-name';name.textContent=item.name;
      const price=document.createElement('span');price.className='bi-price';price.textContent=owned?'✓ Є':(item.price===0?'Безкоштовно':'$'+item.price);
      el.appendChild(key);el.appendChild(name);el.appendChild(price);
      const isEquip=typeof item.id==='string'; // armor/frag/smoke/kit have string ids
      const blocked=pistolOnly&&!item.pistol&&!isEquip; // only rifles blocked in round 1
      if(!owned&&!cantAfford&&!blocked){
        el.onclick=()=>{buyItem(item);renderBuyMenu();}
      }
      col.appendChild(el);
    });
    cols.appendChild(col);
  });
}
function isOwned(item){
  const p=G.player;
  if(item.id==='armor')return p.armor>=100;
  if(item.isKit||item.id==='kit')return p.hasKit;
  if(item.id==='frag')return p.grenFrag>0;
  if(item.id==='smoke')return p.grenSmoke>0;
  return p.wepSlots.some(s=>s.wep.id===item.id);
}
function buyItem(item){
  const p=G.player;
  if(G.economy.money<item.price)return;
  G.economy.money-=item.price;
  if(item.id==='armor'){p.armor=100;}
  else if(item.isKit||item.id==='kit'){
    p.hasKit=true;
    const kiSlot={wep:{...item},ammo:0,reserve:0};
    const ki=p.wepSlots.findIndex(s=>s.wep.isKit);
    if(ki<0){
      const pi=p.wepSlots.findIndex(s=>s.wep.pistol);
      p.wepSlots.splice(pi>=0?pi+1:p.wepSlots.length,0,kiSlot);
    }
    // Switch to kit immediately
    const kiIdx=p.wepSlots.findIndex(s=>s.wep.isKit);
    if(kiIdx>=0){p.curSlot=kiIdx;p.curWepId=10;buildGunModel(10);}
  }
  else if(item.id==='frag'){p.grenFrag=Math.min(2,p.grenFrag+1);}
  else if(item.id==='smoke'){p.grenSmoke=Math.min(1,p.grenSmoke+1);}
  else{
    // Weapon — add or replace slot
    // Max 2 weapon slots
    const existing=p.wepSlots.findIndex(s=>s.wep.id===item.id);
    if(existing>=0)return; // already have it
    // Replace last slot if full (keep default pistol)
    const slot={wep:{...item},ammo:item.mag,reserve:item.rsv};
    if(item.pistol){
      // Replace pistol slot (slot 0 or add)
      const pi=p.wepSlots.findIndex(s=>s.wep.pistol);
      if(pi>=0)p.wepSlots[pi]=slot;else p.wepSlots.unshift(slot);
    }else{
      // Rifle slot — never overwrite bomb or knife
      const ri=p.wepSlots.findIndex(s=>!s.wep.pistol&&!s.wep.isBomb&&!s.wep.isKnife&&!s.wep.isKit);
      if(ri>=0)p.wepSlots[ri]=slot;else{
        // Insert before bomb/knife
        const bi=p.wepSlots.findIndex(s=>s.wep.isBomb||s.wep.isKnife||s.wep.isKit);
        if(bi>=0)p.wepSlots.splice(bi,0,slot);else p.wepSlots.push(slot);
      }
    }
    // Switch to new weapon immediately
    const ni=p.wepSlots.findIndex(s=>s.wep.id===item.id);
    if(ni>=0){p.curSlot=ni;p.curWepId=item.id;buildGunModel(item.id);}
    else if(item.isKit){
      const ki=p.wepSlots.findIndex(s=>s.wep.isKit);
      if(ki>=0){p.curSlot=ki;p.curWepId=10;buildGunModel(10);}
    }
  }
  updateHUD();
  document.getElementById('bm-money').textContent='$'+G.economy.money;
}

// ═══ FX ═══
function screenFlash(col,dur){const f=document.getElementById('flash-ov');f.style.background=col;f.style.opacity='.88';f.style.transition='none';setTimeout(()=>{f.style.transition=`opacity ${dur||80}ms`;f.style.opacity='0';},16);}
function trackFX(mesh){scene.add(mesh);G.fxMeshes.push(mesh);}
function spawnBlood(pos){for(let i=0;i<10;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.018+Math.random()*.025,4,4),new THREE.MeshBasicMaterial({color:0xAA0000,transparent:true,opacity:.9}));m.position.copy(pos);scene.add(m);const v=new THREE.Vector3((Math.random()-.5)*5,Math.random()*4+1,(Math.random()-.5)*5);let t=0;(function a(){t+=.016;v.y-=16*.016;m.position.addScaledVector(v,.016);m.material.opacity=Math.max(0,.9-t*2.5);if(t<.5&&m.material.opacity>0)requestAnimationFrame(a);else scene.remove(m);})();}}
function spawnImpact(pos){for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.022+Math.random()*.025,4,4),new THREE.MeshBasicMaterial({color:0xFFEECC,transparent:true,opacity:1}));m.position.copy(pos);scene.add(m);const v=new THREE.Vector3((Math.random()-.5)*4,Math.random()*3,(Math.random()-.5)*4);let t=0;(function a(){t+=.016;v.y-=12*.016;m.position.addScaledVector(v,.016);m.material.opacity=1-t*4;if(t<.3)requestAnimationFrame(a);else scene.remove(m);})();}}
function spawnFootDust(){const m=new THREE.Mesh(new THREE.SphereGeometry(.1,5,5),new THREE.MeshBasicMaterial({color:0xAA9966,transparent:true,opacity:.38,depthWrite:false}));m.position.set(G.player.pos.x,.05,G.player.pos.z);scene.add(m);let t=0;(function a(){t+=.016;m.scale.setScalar(1+t*3);m.material.opacity=Math.max(0,.38-t*1.5);if(t<.28)requestAnimationFrame(a);else scene.remove(m);})();}
function spawnShell(){const m=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.022,6),new THREE.MeshLambertMaterial({color:0xCCAA22}));m.position.copy(camera.position);const vel=new THREE.Vector3(Math.cos(G.player.yaw),.3,-Math.sin(G.player.yaw)).multiplyScalar(3+Math.random()*2).add(new THREE.Vector3(0,2+Math.random()*2,0));scene.add(m);G.shells.push({mesh:m,vel,t:0});}
function updShells(dt){for(let i=G.shells.length-1;i>=0;i--){const s=G.shells[i];s.t+=dt;s.vel.y-=14*dt;s.mesh.position.addScaledVector(s.vel,dt);s.mesh.rotation.x+=dt*15;s.mesh.rotation.z+=dt*10;if(s.mesh.position.y<0){s.mesh.position.y=0;s.vel.y*=-.3;s.vel.x*=.6;s.vel.z*=.6;}if(s.t>4){scene.remove(s.mesh);G.shells.splice(i,1);}}}

function fxExplosion(pos){
  const fl=new THREE.PointLight(0xFF9922,80,24);fl.position.copy(pos);scene.add(fl);
  G.fxMeshes.push(fl);
  let ft=0;(function a(){ft+=.016;fl.intensity=80*Math.max(0,1-ft*5);if(ft<.25)requestAnimationFrame(a);else scene.remove(fl);})();
  for(let i=0;i<35;i++){const cols=[0xFF6600,0xFF3300,0xFFAA00];const m=new THREE.Mesh(new THREE.SphereGeometry(.06+Math.random()*.16,5,5),new THREE.MeshBasicMaterial({color:cols[~~(Math.random()*3)],transparent:true,opacity:1}));m.position.copy(pos);trackFX(m);const spd=8+Math.random()*12;const theta=Math.random()*Math.PI*2,phi=Math.random()*Math.PI;const v=new THREE.Vector3(Math.sin(phi)*Math.cos(theta)*spd,Math.sin(phi)*Math.sin(theta)*spd+5,Math.cos(phi)*spd);let t=0,life=.3+Math.random()*.4;(function a(){t+=.016;v.y-=24*.016;m.position.addScaledVector(v,.016);m.material.opacity=Math.max(0,1-t/life);if(t<life&&m.material.opacity>0)requestAnimationFrame(a);else{scene.remove(m);const ix=G.fxMeshes.indexOf(m);if(ix>-1)G.fxMeshes.splice(ix,1);}})();}
  // Smoke cloud (tracked for round-clear)
  for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.6+Math.random()*.8,7,7),new THREE.MeshLambertMaterial({color:new THREE.Color(.42,.38,.35),transparent:true,opacity:0,depthWrite:false}));m.position.copy(pos).add(new THREE.Vector3((Math.random()-.5)*3,.5+Math.random()*2,(Math.random()-.5)*3));trackFX(m);let t=0;(function a(){t+=.016;m.scale.setScalar(1+t*5);m.material.opacity=Math.min(.5,t/1.5*.5)*Math.max(0,1-(t-4)/3);if(t<7)requestAnimationFrame(a);else{scene.remove(m);const ix=G.fxMeshes.indexOf(m);if(ix>-1)G.fxMeshes.splice(ix,1);}})();}
}
function fxSmoke(pos){
  G.smokeFields.push({pos:pos.clone(),radius:7.5,life:14,elapsed:0});
  for(let i=0;i<18;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(1.0+Math.random()*1.2,8,8),new THREE.MeshLambertMaterial({color:new THREE.Color(.78+Math.random()*.10,.78+Math.random()*.08,.74),transparent:true,opacity:0,depthWrite:false}));m.position.copy(pos).add(new THREE.Vector3((Math.random()-.5)*5.5,.6+Math.random()*3.0,(Math.random()-.5)*5.5));trackFX(m);let t=0;(function a(){t+=.016;const g=Math.min(t/2.2,1),fd=Math.max(0,1-(t-9)/5);m.material.opacity=Math.min(.75,g*.75)*fd;m.scale.setScalar(1+t*.22);if(t<14)requestAnimationFrame(a);else{scene.remove(m);const ix=G.fxMeshes.indexOf(m);if(ix>-1)G.fxMeshes.splice(ix,1);}})();}
}

// ═══ GRENADES ═══
class Grenade{
  constructor(pos,vel,type,ownerTeam){
    this.pos=pos.clone();this.vel=vel.clone();this.type=type;this.ownerTeam=ownerTeam;
    this.alive=true;this.bounces=0;this.fuse=type==='frag'?3.0:2.5;this.blinkT=0;
    const col=type==='frag'?0x44AA22:0x7799AA;
    this.mesh=new THREE.Group();
    const body=new THREE.Mesh(new THREE.CylinderGeometry(.044,.048,.120,10),new THREE.MeshLambertMaterial({color:col}));
    const top=new THREE.Mesh(new THREE.SphereGeometry(.044,8,6,[0,Math.PI*2,0,Math.PI*.5]),new THREE.MeshLambertMaterial({color:col}));top.position.y=.060;
    this.mesh.add(body);this.mesh.add(top);
    if(type==='frag'){this.blinkM=new THREE.Mesh(new THREE.SphereGeometry(.016,6,6),new THREE.MeshBasicMaterial({color:0xFF2200,transparent:true,opacity:1}));this.blinkM.position.y=.092;this.mesh.add(this.blinkM);}
    this.mesh.position.copy(this.pos);scene.add(this.mesh);G.sceneObjs.push(this.mesh);
  }
  update(dt){
    if(!this.alive)return;
    this.fuse-=dt;
    if(this.type==='frag'&&this.blinkM){const br=Math.max(.06,this.fuse*.18);this.blinkT+=dt;if(this.blinkT>br){this.blinkT=0;this.blinkM.material.opacity=this.blinkM.material.opacity>.5?0:1;}}
    if(this.fuse<=0){this.explode();return;}
    this.vel.y-=20*dt;
    let nx=this.pos.x+this.vel.x*dt,ny=this.pos.y+this.vel.y*dt,nz=this.pos.z+this.vel.z*dt;
    const R=.06;
    if(ny<R){ny=R;this.vel.y=Math.abs(this.vel.y)*.45;this.vel.x*=.72;this.vel.z*=.72;if(this.bounces<5)playBounce();this.bounces++;}
    if(nx<-38){nx=-38;this.vel.x=Math.abs(this.vel.x)*.55;}if(nx>38){nx=38;this.vel.x=-Math.abs(this.vel.x)*.55;}
    if(nz<-38){nz=-38;this.vel.z=Math.abs(this.vel.z)*.55;}if(nz>38){nz=38;this.vel.z=-Math.abs(this.vel.z)*.55;}
    for(const box of G.colBoxes){
      if(box.isFloor)continue;
      const ox=nx-Math.max(box.min.x,Math.min(nx,box.max.x)),oy=ny-Math.max(box.min.y,Math.min(ny,box.max.y)),oz=nz-Math.max(box.min.z,Math.min(nz,box.max.z));
      if(Math.sqrt(ox*ox+oy*oy+oz*oz)<R){
        const px=box.max.x-nx+R,px2=nx-box.min.x+R,py=box.max.y-ny+R,py2=ny-box.min.y+R,pz=box.max.z-nz+R,pz2=nz-box.min.z+R;
        const mX=Math.min(px,px2),mY=Math.min(py,py2),mZ=Math.min(pz,pz2);
        if(mX<mY&&mX<mZ){nx+=px<px2?-(px-R):px2-R;this.vel.x*=-.5;}
        else if(mZ<mY){nz+=pz<pz2?-(pz-R):pz2-R;this.vel.z*=-.5;}
        else{if(this.vel.y<0){ny=box.max.y+R;this.vel.y=Math.abs(this.vel.y)*.4;}else{ny=box.min.y-R;this.vel.y*=-.4;}}
        playBounce();this.bounces++;
      }
    }
    this.pos.set(nx,ny,nz);this.mesh.position.copy(this.pos);this.mesh.rotation.x+=dt*8;this.mesh.rotation.z+=dt*5;
  }
  explode(){
    if(!this.alive)return;this.alive=false;
    scene.remove(this.mesh);const si=G.sceneObjs.indexOf(this.mesh);if(si>-1)G.sceneObjs.splice(si,1);
    if(this.type==='frag'){
      playExplosion();screenFlash('rgba(255,200,100,.9)',280);addShake(.055);fxExplosion(this.pos);
      const ERAD=9,MAXD=110;
      if(G.player.alive){const d=G.player.pos.distanceTo(this.pos);if(d<ERAD){const dmg=~~(MAXD*Math.pow(1-d/ERAD,1.5));if(dmg>0){if(G.player.armor>0){const ab=dmg*.38;G.player.armor=Math.max(0,G.player.armor-ab);}G.player.health-=~~(dmg*.75);addShake(.04);showDmg();if(G.player.health<=0)killPlayer();}}}
      for(let i=0;i<G.bots.length;i++){const b=G.bots[i];if(!b.alive||!b.isEnemy)continue;const d=b.pos.distanceTo(this.pos);if(d<ERAD){const dmg=~~(MAXD*Math.pow(1-d/ERAD,1.5));if(dmg>0){const k=b.takeDmg(dmg,false);if(k){giveMoney(KILL_REWARD);addKF('💥 Граната — бот вбитий','grn');checkRoundEnd();}}}}
    }else{fxSmoke(this.pos);}
  }
}

// ── Grenade throw ──
function beginGrenCharge(type){
  const p=G.player;if(!p.alive)return;
  if(type==='frag'&&p.grenFrag<=0){showAmmoWarn('НЕМАЄ FRAG ГРАНАТ');return;}
  if(type==='smoke'&&p.grenSmoke<=0){showAmmoWarn('НЕМАЄ SMOKE');return;}
  if(G.gt.active)return;
  G.gt.active=true;G.gt.type=type;G.gt.charge=0;G.gt.throwing=false;
  playPinPull();
  document.getElementById('nade-charge').style.display='block';
  document.getElementById('nade-charge-fill').style.width='0';
}
function releaseGren(){
  const gt=G.gt;if(!gt.active||gt.throwing)return;
  gt.throwing=true;gt.throwT=0;
  const cf=Math.min(gt.charge/1.2,1);const p=G.player;
  setTimeout(()=>{
    if(gt.type==='frag')p.grenFrag--;else p.grenSmoke--;
    const dir=new THREE.Vector3(0,0,-1).applyEuler(new THREE.Euler(p.pitch,p.yaw,0,'YXZ'));
    const tp=camera.position.clone().add(dir.clone().multiplyScalar(.5));
    const vel=dir.clone().multiplyScalar(12+cf*14).add(new THREE.Vector3(0,4+cf*4,0));
    G.grenades.push(new Grenade(tp,vel,gt.type,G.playerTeam));
    updateHUD();
  },180);
  setTimeout(()=>{gt.active=false;gt.throwing=false;gt.charge=0;document.getElementById('nade-charge').style.display='none';switchSlot(G.player.prevSlot||0);},350);
}
function updGrenThrow(dt){
  const gt=G.gt;if(!gt.active)return;
  const p=G.player;
  if(!gt.throwing){
    gt.charge=Math.min(gt.charge+dt,1.2);
    document.getElementById('nade-charge-fill').style.width=(gt.charge/1.2*100)+'%';
    wGrp.position.set(.02*Math.sin(gt.charge*3),-.04*gt.charge/1.2,.08*gt.charge/1.2);
    wGrp.rotation.x=-0.4*gt.charge/1.2;
    if(gt.charge>=1.2)releaseGren();
  }else{
    gt.throwT+=dt;const pr=Math.min(gt.throwT/.18,1);
    wGrp.position.set(0,-pr*.04,-pr*.15);wGrp.rotation.x=pr*0.6-0.4;
  }
}

// ═══ BOMB ═══
function initBomb(){
  const bm=G.bomb;
  bm.planted=false;bm.carried=true;bm.plantProgress=0;bm.defuseProgress=0;
  bm.bombTimer=0;bm.beepTimer=0;bm.siteName='';
  if(bm.mesh){scene.remove(bm.mesh);bm.mesh=null;}
  bm.exists=G.playerTeam==='t';
  document.getElementById('gi-b').style.display=bm.exists?'flex':'none';
  document.getElementById('bomb-hud').style.display='none';
}
function spawnBombMesh(x,z){
  const bm=G.bomb;if(bm.mesh)scene.remove(bm.mesh);
  const g=new THREE.Group();
  g.add(new THREE.Mesh(new THREE.BoxGeometry(.22,.1,.14),new THREE.MeshLambertMaterial({color:0x334422})));
  const led=new THREE.Mesh(new THREE.SphereGeometry(.018,6,6),new THREE.MeshBasicMaterial({color:0xFF2200}));
  led.position.set(0,.07,0);g.add(led);
  let ledT=0;(function bl(){ledT+=.016;if(!bm.planted)return;const rate=Math.max(.05,bm.bombTimer*.04);led.material.color.setHex(Math.sin(ledT*(2/rate)*Math.PI)>.5?0xFF2200:0x220000);requestAnimationFrame(bl);})();
  g.position.set(x,.06,z);scene.add(g);bm.mesh=g;
}
function showAction(label,col,progress){
  const ab=document.getElementById('action-bar');ab.style.display='flex';
  document.getElementById('action-label').textContent=label;document.getElementById('action-label').style.color=col;
  document.getElementById('action-fill').style.width=(progress*100)+'%';document.getElementById('action-fill').style.background=col;
}
function hideAction(){document.getElementById('action-bar').style.display='none';}

function updateBomb(dt){
  const map=MAPS[G.selMap];
  const bm=G.bomb;const p=G.player;
  if(bm.planted){
    bm.bombTimer-=dt;bm.beepTimer-=dt;
    const bRate=Math.max(.05,bm.bombTimer*.04);
    if(bm.beepTimer<=0){bm.beepTimer=bRate;playBeep(bm.bombTimer>12?660:880,bm.bombTimer>12?.08:.05);}
    document.getElementById('bomb-hud').style.display='flex';
    const pct=Math.max(0,bm.bombTimer/40);
    document.getElementById('bomb-timer-fill').style.width=(pct*100)+'%';
    document.getElementById('bomb-timer-fill').style.background=pct>.4?'linear-gradient(90deg,#FF4400,#FFAA00)':'#FF2200';
    document.getElementById('bomb-status').textContent='💣 БОМБА '+bm.siteName+' — '+Math.max(0,~~bm.bombTimer)+'с';
    if(bm.bombTimer<=0){
      const bp=new THREE.Vector3(bm.plantX,0,bm.plantZ);
      playExplosion();screenFlash('rgba(255,180,50,.95)',500);addShake(.09);fxExplosion(bp);
      if(p.alive&&p.pos.distanceTo(bp)<14){p.health=0;killPlayer();}
      for(const b of G.bots)if(b.alive&&b.pos.distanceTo(bp)<14)b.takeDmg(999,false);
      bm.planted=false;if(bm.mesh){scene.remove(bm.mesh);bm.mesh=null;}
      document.getElementById('bomb-hud').style.display='none';
      addKF('💣 БОМБА ВИБУХНУЛА! T ПЕРЕМАГАЮТЬ','bomb');
      endRound('t','Бомба вибухнула!');return;
    }
    // CT defuse
    if(G.playerTeam==='ct'&&p.alive&&G.keys['KeyE']){
      const bp=new THREE.Vector3(bm.plantX,0,bm.plantZ);
      if(p.pos.distanceTo(bp)<3.5){
        const defT=G.player.hasKit?5:10;
        bm.defuseProgress+=dt;showAction('✂ ЗНЕШКОДЖУЮ'+(G.player.hasKit?' [КІТ]':'')+'...','#44AAFF',bm.defuseProgress/defT);
        if(MP.mode==='online')mpBombDefuse(bm.defuseProgress/defT);
        if(bm.defuseProgress>=defT){
          bm.planted=false;if(bm.mesh){scene.remove(bm.mesh);bm.mesh=null;}
          document.getElementById('bomb-hud').style.display='none';hideAction();
          addKF('✂ БОМБА ЗНЕШКОДЖЕНА! CT ПЕРЕМАГАЮТЬ','ctk');
          if(MP.mode==='online')mpBombDefuse(1);else endRound('ct','Бомба знешкоджена!');
        }
      }else{bm.defuseProgress=0;hideAction();}
    }else{bm.defuseProgress=0;if(G.playerTeam!=='ct'||!G.keys['KeyE'])hideAction();}
    return;
  }
  // T planting — only if holding bomb slot
  if(G.playerTeam==='t'&&bm.exists&&bm.carried&&p.alive&&p.wepSlots.some(s=>s.wep.isBomb)){
    let nearSite=null;
    for(const s of map.bombSites){const dx=p.pos.x-s.x,dz=p.pos.z-s.z;if(Math.sqrt(dx*dx+dz*dz)<s.r){nearSite=s;break;}}
    if(nearSite)showAction('📍 Зона ['+nearSite.name+'] — E щоб плентувати','#FF8800');
    if(nearSite&&G.keys['KeyE']){
      bm.plantProgress+=dt;showAction('💣 ПЛЕНТУЮ '+nearSite.name+'...','#FF8800',bm.plantProgress/3.2);
      if(bm.plantProgress>=3.2){
        bm.planted=true;bm.carried=false;bm.plantX=p.pos.x;bm.plantZ=p.pos.z;
        bm.siteName=nearSite.name;bm.bombTimer=40;bm.beepTimer=0;
        spawnBombMesh(p.pos.x,p.pos.z);hideAction();
        addKF('💣 БОМБА ПЛЕНТОВАНА НА '+nearSite.name+'!','bomb');
        playBeep(440,.3);setTimeout(()=>playBeep(660,.2),150);
        document.getElementById('gi-b').style.display='none';
        // Remove bomb slot
        const bi=p.wepSlots.findIndex(s=>s.wep.isBomb);
        if(bi>=0)p.wepSlots.splice(bi,1);
        switchSlot(0);
        for(const b of G.bots)if(!b.isEnemy){b.rushTarget={x:bm.plantX,z:bm.plantZ};}
        if(MP.mode==='online')mpBombPlant(p.pos.x,p.pos.z,nearSite.name);
      }
    }else{bm.plantProgress=0;}
  if(!bm.exists&&!bm.planted){const lbl=document.getElementById('action-label');if(lbl&&lbl.textContent.startsWith('📍'))hideAction();}
  }
}

// ═══ ROUNDS ═══
function checkRoundEnd(){
  if(G.round.phase!=='playing')return;
  const aliveEnemies=G.bots.filter(b=>b.alive&&b.isEnemy).length;
  if(aliveEnemies===0)endRound(G.playerTeam,'Всі вороги знищені!');
}
function endRound(winner,reason){
  if(G.round.phase!=='playing')return;
  G.round.phase='end';
  if(winner==='ct')G.score.ctWins++;else G.score.tWins++;
  document.getElementById('rct').textContent=G.score.ctWins;
  document.getElementById('rt').textContent=G.score.tWins;
  if(G.bomb.planted){G.bomb.planted=false;if(G.bomb.mesh){scene.remove(G.bomb.mesh);G.bomb.mesh=null;}document.getElementById('bomb-hud').style.display='none';}
  const moneyStr=roundEconomyBonus(winner);
  const re=document.getElementById('round-end');
  re.className=winner+'-win';re.style.display='flex';
  document.getElementById('re-title').textContent=winner.toUpperCase()+' ПЕРЕМОГА';
  document.getElementById('re-title').style.color=winner==='ct'?'#4488FF':'#FF8844';
  document.getElementById('re-sub').textContent=reason;
  document.getElementById('re-stat').textContent='CT '+G.score.ctWins+' — '+G.score.tWins+' T | Раунд '+G.round.num+'/6';
  document.getElementById('re-money').textContent=moneyStr;
  let sec=4;const ni=document.getElementById('re-next');ni.textContent='Через '+sec+'...';
  document.exitPointerLock();
  const iv=setInterval(()=>{sec--;ni.textContent='Через '+sec+'...';if(sec<=0){clearInterval(iv);re.style.display='none';afterRound();}},1000);
}
function afterRound(){
  if(G.round.num>=6){showMatchEnd();return;}
  if(G.round.num===3){showHalftime();}else{G.round.num++;startNextRound();}
}
function showHalftime(){
  clearInterval(buyTimerIv);
  const old=G.playerTeam;G.playerTeam=G.playerTeam==='ct'?'t':'ct';
  // Swap scores so player's wins stay with player (not with team label)
  const tmp=G.score.ctWins;G.score.ctWins=G.score.tWins;G.score.tWins=tmp;
  document.getElementById('rct').textContent=G.score.ctWins;
  document.getElementById('rt').textContent=G.score.tWins;
  const ht=document.getElementById('halftime');ht.style.display='flex';
  document.getElementById('ht-title').textContent='ПЕРЕРВА';
  document.getElementById('ht-info').innerHTML='Ви були <b style="color:'+(old==='ct'?'#4488FF':'#FF8844')+'">'+old.toUpperCase()+'</b> → тепер <b style="color:'+(G.playerTeam==='ct'?'#4488FF':'#FF8844')+'">'+G.playerTeam.toUpperCase()+'</b><br><span style="color:#555;font-size:11px">CT '+G.score.ctWins+' : '+G.score.tWins+' T</span>';
  let sec=7;const ni=document.getElementById('ht-next');ni.textContent='Через '+sec+'...';
  const iv=setInterval(()=>{sec--;ni.textContent='Через '+sec+'...';if(sec<=0){clearInterval(iv);ht.style.display='none';G.round.num++;startNextRound();}},1000);
}
function showMatchEnd(){
  clearInterval(buyTimerIv);
  const ht=document.getElementById('halftime');ht.style.display='flex';
  const w=G.score.ctWins>G.score.tWins?'CT':(G.score.tWins>G.score.ctWins?'T':'НІЧИЯ');
  document.getElementById('ht-title').textContent='МАТЧ ЗАВЕРШЕНО';
  document.getElementById('ht-title').style.color=w==='CT'?'#4488FF':w==='T'?'#FF8844':'#FFAA00';
  document.getElementById('ht-sub').textContent=w==='НІЧИЯ'?'НІЧИЯ!':w+' ВИГРАЛИ МАТЧ';
  document.getElementById('ht-info').innerHTML='CT <b style="color:#4488FF">'+G.score.ctWins+'</b> : <b style="color:#FF8844">'+G.score.tWins+'</b> T';
  document.getElementById('ht-next').innerHTML='';
  const btn=document.createElement('button');btn.className='pb';btn.textContent='⌂ НАЗАД ДО МЕНЮ';btn.style.marginTop='10px';
  btn.onclick=()=>{ht.style.display='none';goMenu();};ht.appendChild(btn);
}
function goMenu(){
  clearInterval(buyTimerIv);G.phase='menu';
  // Clear ALL fx meshes
  for(const m of G.fxMeshes)scene.remove(m);G.fxMeshes=[];
  clearMap();
  document.getElementById('hud').style.display='none';document.getElementById('menu').style.display='flex';
  document.exitPointerLock();camera.fov=73;camera.updateProjectionMatrix();
}
function startNextRound(){
  clearInterval(buyTimerIv);
  // Clear ALL previous FX objects from scene
  for(const m of G.fxMeshes)scene.remove(m);G.fxMeshes=[];
  // Clear shell casings
  for(const s of G.shells)scene.remove(s.mesh);G.shells=[];
  // Clear old bots
  for(const b of G.bots){scene.remove(b.grp);const si=G.sceneObjs.indexOf(b.grp);if(si>-1)G.sceneObjs.splice(si,1);}
  // Clear grenades
  for(const g of G.grenades){if(g.mesh)scene.remove(g.mesh);}
  G.bots=[];G.grenades=[];G.smokeFields=[];
  G.round.timer=120;G.round.phase='playing';
  document.getElementById('round-num').textContent='РАУНД '+G.round.num+'/6';
  document.getElementById('smoke-ov').style.opacity='0';
  document.getElementById('flash-ov').style.opacity='0';
  const map=MAPS[G.selMap];const sp=G.playerTeam==='ct'?map.ctSpawn:map.tSpawn;const p=G.player;
  p.health=100;p.armor=0;p.alive=true;p.vel.set(0,0,0);
  p.pos.set(sp.x+(Math.random()-.5)*2,0,sp.z+(Math.random()-.5)*2);
  p.reloading=false;p.scoped=false;p.hasKit=false;p.grenFrag=0;p.grenSmoke=0;
  // Give default pistol + keep rifle if had one (carry over between rounds)
  // But for now give default loadout
  p.wepSlots=defaultWeps(G.playerTeam);
  p.curSlot=0;p.curWepId=p.wepSlots[0].wep.id;p.prevSlot=0;
  // Add bomb slot for T
  if(G.playerTeam==='t'){
    p.wepSlots.push({wep:WCAT[8],ammo:0,reserve:0});
  }
  const tb=document.getElementById('tbadge');tb.className=G.playerTeam;tb.textContent=G.playerTeam.toUpperCase();
  for(const sp2 of map.bSpawns)G.bots.push(new Bot(sp2.x+(Math.random()-.5)*3,sp2.z+(Math.random()-.5)*3,G.selMap,sp2.tm));
  for(const b of G.bots)b.isEnemy=b.team!==G.playerTeam;
  initBomb();
  document.getElementById('dead-ov').style.display='none';
  document.getElementById('rld-bar').style.display='none';
  hideAction();G.gt.active=false;document.getElementById('nade-charge').style.display='none';
  buildGunModel(p.curWepId);updateHUD();
  canvas.requestPointerLock();
  // Start buy phase
  startBuyPhase();
}
function formatTime(s){const m=~~(s/60),ss=~~(s%60);return m+':'+(ss<10?'0':'')+ss;}
function updateRoundTimer(dt){
  if(G.round.phase!=='playing')return;
  G.round.timer-=dt;const t=Math.max(0,G.round.timer);
  const el=document.getElementById('round-timer');el.textContent=formatTime(t);el.className=t<10?'danger pulse':t<30?'danger':'';
  if(t<=0)endRound('t','Час вийшов!');
}

// ═══ BOTS ═══
const BSPD=[2.5,3.5,4.8],BACC=[.22,.40,.65],BRCT=[1.6,.90,.45];
class Bot{
  constructor(x,z,mapIdx,team){
    this.pos=new THREE.Vector3(x,0,z);this.vel=new THREE.Vector3();
    this.yaw=Math.random()*Math.PI*2;this.health=100;this.armor=20;this.alive=true;
    this.team=team||'t';this.isEnemy=this.team!==G.playerTeam;
    // Team-correct weapon: CT gets M4/USP, T gets AK/Glock
    const ri=Math.random();
    let wid;
    if(this.team==='ct')wid=ri<.45?4:ri<.65?12:ri<.80?5:ri<.92?2:1;  // M4A4,MP5,AWP,Deagle,USP
    else wid=ri<.45?3:ri<.65?13:ri<.80?5:ri<.92?2:0;                   // AK,SG553,AWP,Deagle,Glock
    this.wep={...WCAT[wid],ammo:WCAT[wid].mag,reserve:WCAT[wid].rsv||0};
    this.state='patrol';this.patrolTgt=new THREE.Vector3(x+(Math.random()-.5)*24,0,z+(Math.random()-.5)*24);
    this.seePlayer=false;this.lastSaw=0;this.shootTimer=0;
    this.reloading=false;this.reloadEnd=0;this.losTimer=0;
    this.strafeDir=Math.random()>.5?1:-1;this.strafeTimer=1.5+Math.random()*2;this.firstSeeTime=0;
    this.rushTarget=null;this.walkT=Math.random()*10;
    this.grp=new THREE.Group();
    const Bm=c=>new THREE.MeshLambertMaterial({color:c});
    const Bx=(w,h,d,x,y,z,c)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),Bm(c));m.position.set(x,y,z);this.grp.add(m);return m;};
    const bc=this.team==='ct'?(mapIdx>=2?0x1a2a3a:0x2a3a5a):(mapIdx===0||mapIdx===3?0x5a3a10:mapIdx===1?0x3a3a2a:0x2a3a1a);
    const sk=this.team==='ct'?0xBBAA99:0xCC9977;
    this.headMesh=Bx(.38,.38,.38,0,1.55,0,sk);
    if(this.team==='ct')Bx(.42,.22,.42,0,1.74,0,0x1a2535);
    Bx(.62,1.1,.32,0,.6,0,bc);Bx(.22,.8,.22,-.2,-.15,0,0x181818);Bx(.22,.8,.22,.2,-.15,0,0x181818);
    Bx(.22,.7,.22,-.28,.75,0,bc);Bx(.22,.7,.22,.28,.75,0,bc);Bx(.07,.07,.38,.42,.9,-.18,0x222);
    // Armor vest — thin overlay fitted exactly over torso
    this.armorMesh=new THREE.Group();
    const ac=this.team==='ct'?0x1a5599:0x4a7a22; // blue CT / green T
    const ac2=this.team==='ct'?0x0e3a6e:0x2d5012;
    // Front panel (just slightly larger than torso .62×1.1×.32)
    const fp=new THREE.Mesh(new THREE.BoxGeometry(.64,.70,.04),new THREE.MeshLambertMaterial({color:ac}));
    fp.position.set(0,.60,.17);this.armorMesh.add(fp);
    // Back panel
    const bp=new THREE.Mesh(new THREE.BoxGeometry(.64,.70,.04),new THREE.MeshLambertMaterial({color:ac2}));
    bp.position.set(0,.60,-.17);this.armorMesh.add(bp);
    // 3 horizontal MOLLE webbing lines on front
    for(let r=0;r<3;r++){
      const line=new THREE.Mesh(new THREE.BoxGeometry(.58,.016,.05),new THREE.MeshLambertMaterial({color:0x000000}));
      line.position.set(0,.78-r*.18,.19);this.armorMesh.add(line);
    }
    this.grp.add(this.armorMesh);
    this.armorMesh.visible=this.armor>0;
    this.grp.position.copy(this.pos);scene.add(this.grp);G.sceneObjs.push(this.grp);
  }
  smokeCheck(){
    const bE=new THREE.Vector3(this.pos.x,1.5,this.pos.z);const pE=G.player.pos.clone().add(new THREE.Vector3(0,1.5,0));
    const toP=new THREE.Vector3().subVectors(pE,bE);const dist=toP.length();const dir=toP.clone().normalize();
    for(const sf of G.smokeFields){
      if(this.pos.distanceTo(sf.pos)<sf.radius)return true;
      if(G.player.pos.distanceTo(sf.pos)<sf.radius)return true;
      const t=new THREE.Vector3().subVectors(sf.pos,bE);const pj=Math.max(0,Math.min(dist,t.dot(dir)));
      const cl=bE.clone().addScaledVector(dir,pj);if(cl.distanceTo(sf.pos)<sf.radius)return true;
    }
    return false;
  }
  update(dt){
    if(!this.alive)return;
    if(this.reloading&&Date.now()>this.reloadEnd){this.wep.ammo=this.wep.mag;this.reloading=false;}
    if(!this.isEnemy){this.grp.position.copy(this.pos);return;}
    const bE=new THREE.Vector3(this.pos.x,1.5,this.pos.z);
    const pE=G.player.pos.clone().add(new THREE.Vector3(0,1.5,0));
    const toP=new THREE.Vector3().subVectors(pE,bE);const dist=toP.length();
    const smoke=this.smokeCheck();
    this.losTimer-=dt;
    if(this.losTimer<=0){
      this.losTimer=.1+Math.random()*.05;
      if(smoke){this.seePlayer=false;}
      else{
        const dir=toP.clone().normalize();
        // Only check actual wall/floor meshes (exclude bot groups and lights)
        const wallMeshes=G.sceneObjs.filter(o=>o.isMesh&&o.parent===scene&&!o.isLight);
        const ray=new THREE.Raycaster(bE,dir,0.1,dist-0.6);
        const hits=ray.intersectObjects(wallMeshes,false);
        const prev=this.seePlayer;
        this.seePlayer=hits.length===0&&G.player.alive;
        if(this.seePlayer&&!prev)this.firstSeeTime=Date.now();
      }
    }else if(smoke)this.seePlayer=false;
    if(this.seePlayer)this.lastSaw=Date.now();
    const reacted=(Date.now()-this.firstSeeTime)/1000>=BRCT[G.difficulty];
    if(this.rushTarget&&this.team==='ct'){const dx=this.rushTarget.x-this.pos.x,dz=this.rushTarget.z-this.pos.z;if(Math.sqrt(dx*dx+dz*dz)<1.5)this.rushTarget=null;else this.state='rush';}
    if(this.state!=='rush'){
      if(this.seePlayer&&reacted)this.state=dist<2.5?'retreat':'attack';
      else if(Date.now()-this.lastSaw<3500)this.state='chase';
      else this.state='patrol';
    }
    this.strafeTimer-=dt;if(this.strafeTimer<=0){this.strafeDir*=-1;this.strafeTimer=1+Math.random()*2;}
    const spd=BSPD[G.difficulty]*(this.state==='patrol'?.6:1);
    let tx=this.pos.x,tz=this.pos.z;
    if(this.state==='rush'&&this.rushTarget){const dx=this.rushTarget.x-this.pos.x,dz=this.rushTarget.z-this.pos.z,dl=Math.sqrt(dx*dx+dz*dz);tx+=dx/dl*spd*dt;tz+=dz/dl*spd*dt;this.yaw=Math.atan2(dx,dz);}
    else if(this.state==='patrol'){const d2=new THREE.Vector2(this.patrolTgt.x-tx,this.patrolTgt.z-tz);if(d2.length()<1.5)this.patrolTgt.set(this.pos.x+(Math.random()-.5)*28,0,this.pos.z+(Math.random()-.5)*28);const n=d2.normalize();tx+=n.x*spd*dt;tz+=n.y*spd*dt;}
    else if(this.state==='chase'||this.state==='attack'){const fwd=new THREE.Vector3(Math.sin(this.yaw),0,Math.cos(this.yaw));const perp=new THREE.Vector3(fwd.z,0,-fwd.x).multiplyScalar(this.strafeDir);const bl=this.state==='attack'?.4:.9;tx+=(fwd.x*bl+perp.x*(1-bl))*spd*dt;tz+=(fwd.z*bl+perp.z*(1-bl))*spd*dt;}
    else{tx-=Math.sin(this.yaw)*spd*dt;tz-=Math.cos(this.yaw)*spd*dt;}
    if(this.seePlayer&&reacted)this.yaw=Math.atan2(toP.x,toP.z);
    this.pos.x=Math.max(-38,Math.min(38,tx));this.pos.z=Math.max(-38,Math.min(38,tz));
    for(const box of G.colBoxes){if(box.isFloor)continue;const r=.4;if(this.pos.x+r>box.min.x&&this.pos.x-r<box.max.x&&this.pos.z+r>box.min.z&&this.pos.z-r<box.max.z&&box.max.y>.1){const ox1=(this.pos.x+r)-box.min.x,ox2=box.max.x-(this.pos.x-r),oz1=(this.pos.z+r)-box.min.z,oz2=box.max.z-(this.pos.z-r);const mn=Math.min(ox1,ox2,oz1,oz2);if(mn===ox1)this.pos.x=box.min.x-r;else if(mn===ox2)this.pos.x=box.max.x+r;else if(mn===oz1)this.pos.z=box.min.z-r;else this.pos.z=box.max.z+r;}}
    this.walkT+=dt;this.grp.position.copy(this.pos);this.grp.rotation.y=this.yaw;
    if(this.seePlayer&&reacted&&!this.reloading&&G.player.alive){const fi=60000/this.wep.rpm;this.shootTimer+=dt*1000;if(this.shootTimer>=fi){this.shootTimer=0;this.botShoot(dist);}}
  }
  botShoot(dist){
    if(this.wep.ammo<=0){if(this.wep.reserve>0){this.reloading=true;this.reloadEnd=Date.now()+this.wep.reload;}return;}
    this.wep.ammo--;if(!G.player.alive)return;
    if(this.smokeCheck())return;
    const acc=BACC[G.difficulty],hc=acc*Math.max(.08,1-dist/this.wep.range);
    if(Math.random()<hc){const head=Math.random()<.1;let dmg=this.wep.dmg*(head?3:1);if(G.player.armor>0){const ab=dmg*.35;G.player.armor=Math.max(0,G.player.armor-ab);dmg*=.65;}G.player.health-=~~dmg;addShake(.012);showDmg();if(G.player.health<=0)killPlayer();}
  }
  takeDmg(dmg,head){
    if(!this.alive)return false;
    let d=dmg*(head?3.5:1);if(this.armor>0){const a=d*.5;this.armor=Math.max(0,this.armor-a);d*=.65;}
    if(this.armorMesh)this.armorMesh.visible=this.armor>0;
    this.health-=~~d;spawnBlood(new THREE.Vector3(this.pos.x,this.pos.y+(head?1.6:1.0),this.pos.z));
    if(this.health<=0){this.die();return true;}return false;
  }
  die(){
    this.alive=false;const self=this;let ft=0;
    (function fall(){ft+=.016;self.grp.rotation.z=Math.min(Math.PI/2,ft*4);self.grp.position.y=-Math.min(.4,ft*.4);if(ft<.25)requestAnimationFrame(fall);})();
    // Drop weapon on the ground
    if(!this.wep.isKnife&&!this.wep.isBomb){
      const col=this.wep.pistol?0x555:0x1a1a2a;
      const m=new THREE.Mesh(new THREE.BoxGeometry(.14,.05,.38),new THREE.MeshLambertMaterial({color:col}));
      m.position.set(this.pos.x,.04,this.pos.z);m.rotation.y=this.yaw;
      scene.add(m);G.fxMeshes.push(m);
      const w={...this.wep};
      G.drops.push({mesh:m,wep:w,ammo:this.wep.ammo||0,reserve:this.wep.reserve||0,pos:new THREE.Vector3(this.pos.x,0,this.pos.z)});
    }
    setTimeout(()=>{scene.remove(this.grp);const i=G.sceneObjs.indexOf(this.grp);if(i>-1)G.sceneObjs.splice(i,1);},6000);
  }
}

// ═══ MAP ═══
function clearMap(){
  for(const o of G.sceneObjs)scene.remove(o);G.sceneObjs=[];G.colBoxes=[];
  for(const b of G.bots)scene.remove(b.grp);G.bots=[];
  for(const g of G.grenades){if(g.mesh)scene.remove(g.mesh);}G.grenades=[];
  for(const m of G.fxMeshes)scene.remove(m);G.fxMeshes=[];
  G.smokeFields=[];G.shells=[];
  for(const d of(G.drops||[])){scene.remove(d.mesh);}G.drops=[];
  for(const m of(G.siteMeshes||[]))scene.remove(m);G.siteMeshes=[];
  if(G.bomb.mesh){scene.remove(G.bomb.mesh);G.bomb.mesh=null;}
}
function buildMap(idx){
  clearMap();const map=MAPS[idx];
  scene.background=new THREE.Color(map.sky);scene.fog=new THREE.FogExp2(map.fog,map.fogD);
  const amb=new THREE.AmbientLight(map.amb,.55);scene.add(amb);G.sceneObjs.push(amb);
  const sun=new THREE.DirectionalLight(map.sun,.9);sun.position.set(15,25,10);sun.castShadow=true;
  sun.shadow.mapSize.width=sun.shadow.mapSize.height=1024;sun.shadow.camera.left=sun.shadow.camera.bottom=-55;sun.shadow.camera.right=sun.shadow.camera.top=55;sun.shadow.camera.far=100;
  scene.add(sun);G.sceneObjs.push(sun);
  const fill=new THREE.DirectionalLight(0x8899aa,.3);fill.position.set(-10,5,-10);scene.add(fill);G.sceneObjs.push(fill);
  for(const w of map.walls){
    const[cx,cy,cz,ww,wh,wd,tk]=w;
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(ww,wh,wd),new THREE.MeshLambertMaterial({map:TX[tk]||TX.concrete}));
    mesh.position.set(cx,cy,cz);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);G.sceneObjs.push(mesh);
    if(wh<0.4)continue;
    G.colBoxes.push({min:new THREE.Vector3(cx-ww/2,cy-wh/2,cz-wd/2),max:new THREE.Vector3(cx+ww/2,cy+wh/2,cz+wd/2),isFloor:wh<.5});
  }
  G.siteMeshes=[];
  const mkZ=(x,z,col)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(3,3,.05,16),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.18}));m.position.set(x,.01,z);scene.add(m);G.siteMeshes.push(m);};
  mkZ(map.ctSpawn.x,map.ctSpawn.z,0x2255FF);mkZ(map.tSpawn.x,map.tSpawn.z,0xFF5522);
  for(const s of map.bombSites){
    const disc=new THREE.Mesh(new THREE.CylinderGeometry(s.r,s.r,.04,24),new THREE.MeshBasicMaterial({color:0xFF8800,transparent:true,opacity:.22}));
    disc.position.set(s.x,.02,s.z);scene.add(disc);G.siteMeshes.push(disc);
    const ring=new THREE.Mesh(new THREE.RingGeometry(s.r-.2,s.r,.3,1),new THREE.MeshBasicMaterial({color:0xFF6600,transparent:true,opacity:.45,side:THREE.DoubleSide}));
    ring.rotation.x=-Math.PI/2;ring.position.set(s.x,.03,s.z);scene.add(ring);G.siteMeshes.push(ring);
  }
}

// ═══ COLLISION ═══
const PR=.38,PH=1.85,PHC=1.05;
function resolveCol(){
  const p=G.player,h=p.crouching?PHC:PH;
  for(const box of G.colBoxes){
    const nx=Math.max(box.min.x,Math.min(p.pos.x,box.max.x));const nz=Math.max(box.min.z,Math.min(p.pos.z,box.max.z));
    const dx=p.pos.x-nx,dz=p.pos.z-nz,hd=Math.sqrt(dx*dx+dz*dz);
    const feet=p.pos.y,head=p.pos.y+h;
    if(feet>=box.max.y||head<=box.min.y)continue;
    if(hd<PR+.05){const up=feet-box.max.y;if(up>-.35&&up<.05&&p.vel.y<=0){p.pos.y=box.max.y;p.vel.y=0;p.onGround=true;continue;}}
    if(hd>=PR)continue;
    if(head-box.min.y<.35&&p.vel.y>0){p.pos.y=box.min.y-h;p.vel.y=0;continue;}
    if(hd>.001){const push=(PR-hd)/hd;p.pos.x+=dx*push;p.pos.z+=dz*push;}else p.pos.x+=PR;
  }
  if(p.pos.y<0){p.pos.y=0;p.vel.y=0;p.onGround=true;}
  p.pos.x=Math.max(-38,Math.min(38,p.pos.x));p.pos.z=Math.max(-38,Math.min(38,p.pos.z));
}

// ═══ PLAYER MOVEMENT ═══
const GRAV=-20,JVEL=7.2,MSPD=5.8,CSPD=2.6;
function updatePlayer(dt){
  const p=G.player;if(!p.alive)return;
  p.crouching=!!(G.keys['ShiftLeft']||G.keys['ShiftRight']);
  const spd=p.crouching?CSPD:MSPD;let mx=0,mz=0;
  if(G.keys['KeyW']||G.keys['ArrowUp']){mx-=Math.sin(p.yaw);mz-=Math.cos(p.yaw);}
  if(G.keys['KeyS']||G.keys['ArrowDown']){mx+=Math.sin(p.yaw);mz+=Math.cos(p.yaw);}
  if(G.keys['KeyA']||G.keys['ArrowLeft']){mx-=Math.cos(p.yaw);mz+=Math.sin(p.yaw);}
  if(G.keys['KeyD']||G.keys['ArrowRight']){mx+=Math.cos(p.yaw);mz-=Math.sin(p.yaw);}
  const mm=Math.sqrt(mx*mx+mz*mz);if(mm>0){mx/=mm;mz/=mm;}
  if(p.onGround){p.vel.x=mx*spd;p.vel.z=mz*spd;if(mm>0){p.stepTimer-=dt;if(p.stepTimer<=0){p.stepTimer=.36;playStep();spawnFootDust();}}}
  else{p.vel.x+=mx*spd*.18;p.vel.z+=mz*spd*.18;p.vel.x=Math.max(-spd,Math.min(spd,p.vel.x));p.vel.z=Math.max(-spd,Math.min(spd,p.vel.z));}
  if(G.keys['Space']&&p.onGround){p.vel.y=JVEL;p.onGround=false;}
  if(!p.onGround)p.vel.y+=GRAV*dt;
  p.onGround=false;p.pos.x+=p.vel.x*dt;p.pos.y+=p.vel.y*dt;p.pos.z+=p.vel.z*dt;
  resolveCol();
  G.recoil.x*=.80;G.recoil.y+=(0-G.recoil.y)*.12;updShake();
  const w=curWepDef();const isScoped=w&&w.sniper&&p.scoped;
  camera.fov+=(isScoped?12:73-camera.fov)*.18;camera.updateProjectionMatrix();
  const ey=p.crouching?PHC-.08:PH-.1;
  camera.position.copy(p.pos);camera.position.y+=ey;
  camera.rotation.order='YXZ';
  camera.rotation.y=p.yaw+G.recoil.x+SHAKE.x;
  camera.rotation.x=Math.max(-1.48,Math.min(1.48,p.pitch+G.recoil.y))+SHAKE.y;
  if(!G.gt.active){
    const spd2=new THREE.Vector2(p.vel.x,p.vel.z).length(),bt=performance.now()*.004;
    if(!isScoped){wGrp.position.x=0;wGrp.position.y=-.022*Math.abs(Math.sin(bt*2))*spd2/MSPD;wGrp.position.z=0;wGrp.rotation.y=-.12;wGrp.rotation.z=.010*Math.sin(bt)*spd2/MSPD;wGrp.rotation.x=0;}
    else{wGrp.position.set(0,0,0);wGrp.rotation.set(0,-.12,0);}
  }
  if(isScoped)updScopeBreath(dt);
  let inSmoke=false;for(const sf of G.smokeFields)if(p.pos.distanceTo(sf.pos)<sf.radius+1){inSmoke=true;break;}
  document.getElementById('smoke-ov').style.opacity=inSmoke?'1':'0';
  for(let i=G.smokeFields.length-1;i>=0;i--){G.smokeFields[i].elapsed+=dt;if(G.smokeFields[i].elapsed>G.smokeFields[i].life)G.smokeFields.splice(i,1);}
  const hpF=p.health/100;
  document.getElementById('vign').style.opacity=hpF<.5?((1-hpF*2)*.88):'0';
  document.getElementById('hud').className=p.health<25?'lowhp':'';
}

// ═══ SHOOTING ═══
const RAY=new THREE.Raycaster();let autoFire;
function shoot(){
  const p=G.player;if(!p.alive||p.reloading||G.gt.active)return;
  const sw=curWep();const w=curWepDef();
  if(!sw||!w||w.isGrenade||w.isBomb||w.isKit)return;
  if(G.phase==='buying')return;
  // KNIFE melee
  if(w.isKnife){
    const now=Date.now(),fi=60000/w.rpm;if(now-p.lastShot<fi)return;
    p.lastShot=now;
    // No animation, no sound - just pure melee hit check
    for(const bot of G.bots){
      if(!bot.alive||!bot.isEnemy)continue;
      const d=new THREE.Vector3(bot.pos.x,1.0,bot.pos.z).distanceTo(camera.position);
      if(d<w.range){
        const killed=bot.takeDmg(w.dmg,false);doHitMarker();playHit();
        if(killed){giveMoney(KILL_REWARD);addKF('🔪 Ніж — '+bot.wep.name,'hs');checkRoundEnd();}
      }
    }
    return;
  }
  const now=Date.now(),fi=60000/w.rpm;if(now-p.lastShot<fi)return;
  if(sw.ammo<=0){if(sw.reserve>0)startReload();else showAmmoWarn('НЕМАЄ НАБОЇВ');return;}
  p.lastShot=now;sw.ammo--;spawnShell();if(sw.ammo<=4&&sw.ammo>0)showAmmoWarn(sw.ammo+' НАБОЇВ!');if(sw.ammo===0)showAmmoWarn('МАГАЗИН ПОРОЖНІЙ!');
  const isScoped=w.sniper&&p.scoped;
  const sp=w.spread*(p.crouching?.5:1)*(p.onGround?1:1.9)*(isScoped?.015:1);
  // Get exact camera look direction (matches crosshair perfectly)
  const dir=new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion);
  // Add spread
  const right=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);
  const up=new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion);
  dir.addScaledVector(right,(Math.random()-.5)*sp*2).addScaledVector(up,(Math.random()-.5)*sp*2).normalize();
  RAY.set(camera.position,dir);RAY.far=w.range;
  let smokeBlk=false;
  for(const sf of G.smokeFields){const t2=new THREE.Vector3().subVectors(sf.pos,camera.position);const pj=t2.dot(dir);if(pj>0&&pj<w.range){const cl=camera.position.clone().addScaledVector(dir,pj);if(cl.distanceTo(sf.pos)<sf.radius){smokeBlk=Math.random()<.75;break;}}}
  if(!smokeBlk){
    let bestBot=null,bestD=Infinity,bestHead=false;
    for(const bot of G.bots){
      if(!bot.alive||!bot.isEnemy)continue;
      const bH=new THREE.Vector3();bot.headMesh.getWorldPosition(bH);
      const bT=new THREE.Vector3(bot.pos.x,bot.pos.y+1.1,bot.pos.z); // torso center
      const bL=new THREE.Vector3(bot.pos.x,bot.pos.y+0.5,bot.pos.z); // legs
      for(const[pt,isH,rad]of[[bH,true,.24],[bT,false,.40],[bL,false,.36]]){
        const t2=new THREE.Vector3().subVectors(pt,camera.position);
        const pj=t2.dot(dir);
        if(pj>0.1&&pj<w.range){
          const cl=camera.position.clone().addScaledVector(dir,pj);
          if(cl.distanceTo(pt)<rad&&pj<bestD){bestD=pj;bestBot=bot;bestHead=isH;}
        }
      }
    }
    // Wall check - only real geometry, not bot models
    const wallMeshes=G.sceneObjs.filter(o=>o.isMesh&&o.parent===scene);
    const wHits=RAY.intersectObjects(wallMeshes,false);const wDist=wHits.length?wHits[0].distance:Infinity;
    if(bestBot&&bestD<wDist){
      const killed=bestBot.takeDmg(w.dmg,bestHead);doHitMarker();playHit();
      if(killed){
        giveMoney(KILL_REWARD);
        addKF((bestHead?'☠ HEADSHOT ':'✓ Вбито ')+bestBot.wep.name,bestHead?'hs':'ctk');
        checkRoundEnd();
      }
    }else if(wHits.length)spawnImpact(wHits[0].point);
  }
  if(isScoped){G.recoil.y-=w.recoil*.38;G.recoil.x+=(Math.random()-.5)*w.recoilH*.2;}
  else{G.recoil.y-=w.recoil;G.recoil.x+=(Math.random()-.5)*w.recoilH;}
  G.recoil.y=Math.max(-0.35,G.recoil.y);
  const fl=new THREE.PointLight(0xFFAA22,9,4);fl.position.copy(camera.position).addScaledVector(dir,.7);scene.add(fl);setTimeout(()=>scene.remove(fl),55);
  if(!isScoped){wGrp.position.z=.09;setTimeout(()=>wGrp.position.z=0,80);}
  noiseShot(w.snd);updateHUD();
}
function dropWeapon(){
  const p=G.player;
  const sw=p.wepSlots[p.curSlot];
  if(!sw||sw.wep.isKnife||sw.wep.isBomb)return; // can't drop knife or C4 (plant instead)
  // Create ground mesh
  const col=sw.wep.pistol?0x444:sw.wep.isKit?0xAA8833:0x1a1a22;
  const m=new THREE.Mesh(new THREE.BoxGeometry(.16,.06,.42),new THREE.MeshLambertMaterial({color:col}));
  const dp={x:p.pos.x,z:p.pos.z};
  m.position.set(dp.x,0.04,dp.z);m.rotation.y=p.yaw;
  scene.add(m);G.fxMeshes.push(m);
  // Label
  const drop={mesh:m,wep:{...sw.wep},ammo:sw.ammo,reserve:sw.reserve,pos:new THREE.Vector3(dp.x,0,dp.z)};
  G.drops.push(drop);
  // Remove from slots
  p.wepSlots.splice(p.curSlot,1);
  p.curSlot=Math.min(p.curSlot,p.wepSlots.length-1);
  p.curWepId=p.wepSlots[p.curSlot].wep.id;
  buildGunModel(p.curWepId);updateHUD();
}
function updateDrops(dt){
  if(G.phase!=='playing')return;
  const p=G.player;
  let nearDrop=null,nearDist=Infinity;
  for(const d of G.drops){
    const dx=p.pos.x-d.pos.x,dz=p.pos.z-d.pos.z;
    const dist=Math.sqrt(dx*dx+dz*dz);
    if(dist<2.0&&dist<nearDist){nearDist=dist;nearDrop=d;}
  }
  if(nearDrop){
    showAction('E — підняти '+nearDrop.wep.name,'#FFDD44');
    if(G.keys['KeyE']&&!G._pickupCool){
      G._pickupCool=true;setTimeout(()=>G._pickupCool=false,300);
      const w=nearDrop.wep;
      if(w.isKit){
        p.hasKit=true;
        const kiSlot={wep:{...w},ammo:0,reserve:0};
        const pi=p.wepSlots.findIndex(s=>s.wep.pistol);
        p.wepSlots.splice(pi>=0?pi+1:p.wepSlots.length,0,kiSlot);
      } else if(w.isGrenade){
        if(w.grenType==='frag')p.grenFrag=Math.min(2,p.grenFrag+1);
        else p.grenSmoke=Math.min(1,p.grenSmoke+1);
      } else {
        const slot={wep:{...w},ammo:nearDrop.ammo,reserve:nearDrop.reserve};
        if(w.pistol){const pi=p.wepSlots.findIndex(s=>s.wep.pistol);if(pi>=0)p.wepSlots[pi]=slot;else p.wepSlots.unshift(slot);}
        else{const ri=p.wepSlots.findIndex(s=>!s.wep.pistol&&!s.wep.isBomb&&!s.wep.isKnife&&!s.wep.isKit);if(ri>=0)p.wepSlots[ri]=slot;else{const bi=p.wepSlots.findIndex(s=>s.wep.isBomb||s.wep.isKnife);if(bi>=0)p.wepSlots.splice(bi,0,slot);else p.wepSlots.push(slot);}}
      }
      scene.remove(nearDrop.mesh);
      const fi=G.fxMeshes.indexOf(nearDrop.mesh);if(fi>-1)G.fxMeshes.splice(fi,1);
      G.drops.splice(G.drops.indexOf(nearDrop),1);
      hideAction();
      // Switch to picked-up weapon immediately
      if(!w.isKit&&!w.isGrenade){
        const ni=p.wepSlots.findIndex(s=>s.wep.id===w.id);
        if(ni>=0){p.curSlot=ni;p.curWepId=w.id;}
      }
      buildGunModel(p.curWepId);updateHUD();
    }
  } else {
    // No nearby drop - hide action if it was showing pickup text (not bomb/defuse)
    const lbl=document.getElementById('action-label');
    if(lbl&&lbl.textContent.startsWith('E — підняти'))hideAction();
  }
}
function startReload(){
  const p=G.player;const sw=curWep();const w=curWepDef();
  if(!sw||!w||p.reloading||sw.ammo===w.mag||sw.reserve<=0||w.isGrenade||w.isBomb||w.isKnife||w.isKit)return;
  p.reloading=true;p.reloadEnd=Date.now()+w.reload;playReload();
  const bar=document.getElementById('rld-bar'),fill=document.getElementById('rld-fill');
  bar.style.display='block';fill.style.width='0';fill.style.transition='none';
  setTimeout(()=>{fill.style.transition=`width ${w.reload}ms linear`;fill.style.width='100%';},20);
  setTimeout(()=>{if(p.reloading){const need=w.mag-sw.ammo,got=Math.min(need,sw.reserve);sw.ammo+=got;sw.reserve-=got;p.reloading=false;bar.style.display='none';updateHUD();}},w.reload);
}

// ═══ HUD ═══
function updateHUD(){
  const p=G.player;
  document.getElementById('hp').textContent=Math.max(0,p.health);
  document.getElementById('arm').textContent=Math.max(0,~~p.armor);
  document.getElementById('hp').style.color=p.health>60?'#44FF44':p.health>30?'#FFAA00':'#FF4444';
  document.getElementById('money-hud').textContent='$'+G.economy.money;
  document.getElementById('gc-f').textContent=p.grenFrag;
  document.getElementById('gc-s').textContent=p.grenSmoke;
  document.getElementById('gi-f').className='gi'+(p.grenFrag>0?' has':'');
  document.getElementById('gi-s').className='gi'+(p.grenSmoke>0?' has':'');
  // Kit indicator for CT
  const kitEl=document.getElementById('gi-kit');
  if(kitEl){kitEl.style.display=(G.playerTeam==='ct')?'flex':'none';kitEl.className='gi'+(p.hasKit?' has':'');}
  const sw=curWep();const w=curWepDef();
  if(sw&&w&&!w.isGrenade&&!w.isBomb&&!w.isKnife&&!w.isKit){
    document.getElementById('ac').textContent=sw.ammo;document.getElementById('ar').textContent=' / '+sw.reserve;document.getElementById('wn').textContent=w.name;
  }else if(w&&w.isKnife){
    document.getElementById('ac').textContent='∞';document.getElementById('ar').textContent='';document.getElementById('wn').textContent='🔪 Ніж';
  }else if(w&&w.isKit){
    document.getElementById('ac').textContent='✂';document.getElementById('ar').textContent='';document.getElementById('wn').textContent='ДЕФЮЗ-КІТ';
  }else if(p.curWepId===6||p.curWepId===7){
    const isFrag=p.curWepId===6;document.getElementById('ac').textContent=isFrag?p.grenFrag:p.grenSmoke;document.getElementById('ar').textContent='';document.getElementById('wn').textContent=isFrag?'FRAG HE':'SMOKE';
  }else if(p.curWepId===8){
    document.getElementById('ac').textContent='C4';document.getElementById('ar').textContent='';document.getElementById('wn').textContent='C4 BOMB';
  }
  const isScoped=w&&w.sniper&&p.scoped;
  document.getElementById('scope').style.display=isScoped?'block':'none';
  document.getElementById('xhair').style.display=isScoped?'none':'block';
  // Weapon slots list
  const ws=document.getElementById('wpns');ws.innerHTML='';
  p.wepSlots.forEach((sl,i)=>{
    const d=document.createElement('div');
    const isCur=i===p.curSlot;
    let cls='ws';
    if(sl.wep.isBomb)cls='ws bslot';
    else if(sl.wep.isKnife||sl.wep.isKit)cls='ws gslot';
    if(isCur)cls+=' act';
    d.className=cls;
    const icon=sl.wep.isKnife?'🔪 ':sl.wep.isKit?'✂ ':sl.wep.isBomb?'💣 ':'';
    d.textContent=(i+1)+' '+icon+sl.wep.name;ws.appendChild(d);
  });
  // Nade hotkeys (virtual slots)
  const nBase=p.wepSlots.length;
  if(p.grenFrag>0||p.grenSmoke>0){
    if(p.grenFrag>0){const d=document.createElement('div');d.className='ws gslot'+(p.curWepId===6?' act':'');d.textContent=(nBase+1)+' 💥Frag';ws.appendChild(d);}
    if(p.grenSmoke>0){const d=document.createElement('div');d.className='ws gslot'+(p.curWepId===7?' act':'');d.textContent=(nBase+2)+' 💨Smoke';ws.appendChild(d);}
  }
}
function showDmg(){const d=document.getElementById('dmg');d.classList.remove('hit');void d.offsetWidth;d.classList.add('hit');const ch=document.getElementById('chroma');ch.classList.add('on');setTimeout(()=>ch.classList.remove('on'),200);updateHUD();}
function doHitMarker(){const h=document.getElementById('hitmark');h.classList.add('on');setTimeout(()=>h.classList.remove('on'),200);}
function addKF(txt,type){const kf=document.getElementById('kfeed');const d=document.createElement('div');d.className='ke'+(type?' '+type:'');d.textContent=txt;kf.appendChild(d);setTimeout(()=>d.remove(),5000);}
let awnTO;function showAmmoWarn(msg){const aw=document.getElementById('ammo-warn');aw.textContent=msg;aw.style.opacity='1';clearTimeout(awnTO);awnTO=setTimeout(()=>aw.style.opacity='0',1800);}

// ═══ DEATH ═══
function killPlayer(){
  const p=G.player;if(!p.alive)return;p.alive=false;
  wGrp.visible=false;
  // Drop all weapons on death (except knife and bomb)
  for(const sl of p.wepSlots){
    const w=sl.wep;
    if(w.isKnife||w.isBomb||w.isKit)continue;
    const col=w.pistol?0x444444:0x1a1a2a;
    const m=new THREE.Mesh(new THREE.BoxGeometry(.14,.05,.38),new THREE.MeshLambertMaterial({color:col}));
    m.position.set(p.pos.x+(Math.random()-.5)*.6,.04,p.pos.z+(Math.random()-.5)*.6);
    m.rotation.y=p.yaw+Math.random()-.5;
    scene.add(m);G.fxMeshes.push(m);
    G.drops.push({mesh:m,wep:{...w},ammo:sl.ammo,reserve:sl.reserve,pos:new THREE.Vector3(m.position.x,0,m.position.z)});
  }
  screenFlash('rgba(180,0,0,.5)',500);addKF('☠ Вас вбито!','tk');
  document.getElementById('dead-ov').style.display='flex';
  let sec=4;const ti=document.getElementById('dtimer');ti.textContent='Відродження через '+sec+'...';
  const iv=setInterval(()=>{sec--;ti.textContent=sec>0?'Відродження через '+sec+'...':'Відроджуємось...';if(sec<=0){clearInterval(iv);respawnPlayer();}},1000);
}
function respawnPlayer(){
  const p=G.player;const map=MAPS[G.selMap];const sp=G.playerTeam==='ct'?map.ctSpawn:map.tSpawn;
  p.health=100;p.armor=0;p.alive=true;p.vel.set(0,0,0);
  p.pos.set(sp.x+(Math.random()-.5)*2,0,sp.z+(Math.random()-.5)*2);
  p.reloading=false;p.scoped=false;p.grenFrag=0;p.grenSmoke=0;
  // Reset inventory to just pistol + knife
  p.wepSlots=defaultWeps(G.playerTeam);
  p.curSlot=0;p.curWepId=p.wepSlots[0].wep.id;
  document.getElementById('dead-ov').style.display='none';
  document.getElementById('rld-bar').style.display='none';
  G.gt.active=false;document.getElementById('nade-charge').style.display='none';
  buildGunModel(p.curWepId);wGrp.visible=true;updateHUD();
}

// ═══ MINIMAP ═══
const MMC=document.getElementById('mmc'),MMX=MMC.getContext('2d'),MMS=148,MMSC=MMS/80;
function updateMinimap(){
  MMX.fillStyle='rgba(0,0,0,.92)';MMX.fillRect(0,0,MMS,MMS);
  const map=MAPS[G.selMap];const tm=(wx,wz)=>({x:(wx+40)*MMSC,y:(wz+40)*MMSC});
  MMX.fillStyle='#1e1e1e';for(const w of map.walls){if(w[4]<1)continue;const{x,y}=tm(w[0]-w[3]/2,w[2]-w[5]/2);MMX.fillRect(x,y,w[3]*MMSC,w[5]*MMSC);}
  for(const s of map.bombSites){const{x,y}=tm(s.x,s.z);MMX.fillStyle='rgba(255,130,0,.18)';MMX.beginPath();MMX.arc(x,y,s.r*MMSC,0,Math.PI*2);MMX.fill();MMX.fillStyle='rgba(255,130,0,.5)';MMX.font='bold '+(7*MMSC)+'px monospace';MMX.textAlign='center';MMX.fillText(s.name,x,y+3);}
  let{x:cx,y:cz}=tm(map.ctSpawn.x,map.ctSpawn.z);MMX.fillStyle='rgba(50,100,220,.2)';MMX.beginPath();MMX.arc(cx,cz,3*MMSC,0,Math.PI*2);MMX.fill();
  let{x:tx,y:tz}=tm(map.tSpawn.x,map.tSpawn.z);MMX.fillStyle='rgba(220,80,30,.2)';MMX.beginPath();MMX.arc(tx,tz,3*MMSC,0,Math.PI*2);MMX.fill();
  for(const sf of G.smokeFields){const{x,y}=tm(sf.pos.x,sf.pos.z),lr=1-sf.elapsed/sf.life;MMX.fillStyle=`rgba(180,180,180,${lr*.35})`;MMX.beginPath();MMX.arc(x,y,sf.radius*MMSC,0,Math.PI*2);MMX.fill();}
  for(const g of G.grenades){if(!g.alive)continue;const{x,y}=tm(g.pos.x,g.pos.z);MMX.fillStyle=g.type==='frag'?'#FFEE44':'#88CCFF';MMX.beginPath();MMX.arc(x,y,3,0,Math.PI*2);MMX.fill();}
  if(G.bomb.planted){const{x,y}=tm(G.bomb.plantX,G.bomb.plantZ);MMX.fillStyle='#FF8800';MMX.beginPath();MMX.arc(x,y,5,0,Math.PI*2);MMX.fill();MMX.strokeStyle='#FF4400';MMX.lineWidth=1.5;MMX.beginPath();MMX.arc(x,y,7,0,Math.PI*2);MMX.stroke();}
  for(const b of G.bots){if(!b.alive)continue;const{x,y}=tm(b.pos.x,b.pos.z);const col=b.team==='ct'?(b.seePlayer?'#1155FF':'#4488FF'):(b.seePlayer?'#FF2211':'#FF6644');MMX.fillStyle=col;MMX.beginPath();MMX.arc(x,y,3,0,Math.PI*2);MMX.fill();if(b.isEnemy&&b.seePlayer){MMX.strokeStyle='rgba(255,50,20,.7)';MMX.lineWidth=1.2;MMX.beginPath();MMX.arc(x,y,5.5,0,Math.PI*2);MMX.stroke();}}
  const{x,y}=tm(G.player.pos.x,G.player.pos.z);
  MMX.fillStyle=G.playerTeam==='ct'?'#44FFAA':'#FFAA44';MMX.beginPath();MMX.arc(x,y,4.5,0,Math.PI*2);MMX.fill();
  MMX.strokeStyle=G.playerTeam==='ct'?'#22DDAA':'#FFCC44';MMX.lineWidth=1.5;MMX.beginPath();MMX.moveTo(x,y);MMX.lineTo(x-Math.sin(G.player.yaw)*10,y-Math.cos(G.player.yaw)*10);MMX.stroke();
}

// ═══ INPUT ═══
document.addEventListener('keydown',e=>{
  G.keys[e.code]=true;
  if(e.code==='KeyB'){if(G.phase==='playing'&&G.buyPhase.active)openBuyMenu();else if(G.phase==='buying')closeBuyMenu();return;}
  if(e.code==='Escape'){
    if(G.phase==='buying'){closeBuyMenu();return;}
    if(G.phase==='playing')pauseGame();else if(G.phase==='paused')resumeGame();return;
  }
  if(G.phase!=='playing')return;
  if(e.code==='KeyR')startReload();
  if(e.code==='KeyG')dropWeapon(); // G to drop
  // Weapon slots 1-5 mapped to wepSlots
  if(e.code==='Digit1')switchSlot(0);
  if(e.code==='Digit2')switchSlot(1);
  if(e.code==='Digit3')switchSlot(2);
  if(e.code==='Digit4')switchSlot(3);
  if(e.code==='Digit5')switchSlot(4);
  if(e.code==='Digit6')switchToGren('frag');
  if(e.code==='Digit7')switchToGren('smoke');
  if(['Space','KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight'].includes(e.code))e.preventDefault();
});
document.addEventListener('keyup',e=>{G.keys[e.code]=false;});
document.addEventListener('mousemove',e=>{
  if(!G.locked||(G.phase!=='playing'))return;
  const isSc=curWepDef()&&curWepDef().sniper&&G.player.scoped;
  const sens=isSc?.00042:.002;
  G.player.yaw-=e.movementX*sens;G.player.pitch-=e.movementY*sens;
  G.player.pitch=Math.max(-1.48,Math.min(1.48,G.player.pitch));
});
document.addEventListener('mousedown',e=>{
  if(G.phase!=='playing')return;initAC();
  if(e.button===0){
    G.mouseL=true;const p=G.player;
    const wid=p.curWepId;
    if(wid===6){beginGrenCharge('frag');return;}
    if(wid===7){beginGrenCharge('smoke');return;}
    if(wid===8)return;
    shoot();
    const w=curWepDef();
    if(w&&w.auto){clearInterval(autoFire);autoFire=setInterval(()=>{if(G.mouseL&&G.phase==='playing')shoot();},60000/w.rpm);}
  }
  if(e.button===2){
    const w=curWepDef();
    if(w&&w.sniper){
      G.player.scoped=true;updateHUD();
    }
    e.preventDefault();
  }
});
document.addEventListener('mouseup',e=>{
  if(e.button===0){G.mouseL=false;clearInterval(autoFire);if(G.gt.active&&!G.gt.throwing)releaseGren();}
  if(e.button===2){const w=curWepDef();if(w&&w.sniper){G.player.scoped=false;updateHUD();}}
});
document.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('click',()=>{if(G.phase==='playing'){canvas.requestPointerLock();initAC();}else if(G.phase==='paused')resumeGame();});
document.addEventListener('pointerlockchange',()=>{G.locked=document.pointerLockElement===canvas;});

function switchSlot(i){
  const p=G.player;if(G.gt.active)return;
  if(i>=p.wepSlots.length)return;
  if(p.reloading){p.reloading=false;document.getElementById('rld-bar').style.display='none';}
  if(p.curWepId!==6&&p.curWepId!==7)p.prevSlot=p.curSlot;
  p.curSlot=i;p.curWepId=p.wepSlots[i].wep.id;p.scoped=false;buildGunModel(p.curWepId);updateHUD();
}
function switchToGren(type){
  const p=G.player;if(G.gt.active)return;
  if(type==='frag'&&p.grenFrag<=0){showAmmoWarn('НЕМАЄ FRAG');return;}
  if(type==='smoke'&&p.grenSmoke<=0){showAmmoWarn('НЕМАЄ SMOKE');return;}
  if(p.curWepId!==6&&p.curWepId!==7)p.prevSlot=p.curSlot;
  const wid=type==='frag'?6:7;p.curWepId=wid;p.scoped=false;buildGunModel(wid);updateHUD();
}
function togglePause(){if(G.phase==='playing')pauseGame();else if(G.phase==='paused')resumeGame();}
function pauseGame(){G.phase='paused';document.exitPointerLock();document.getElementById('pause').style.display='flex';}
function resumeGame(){G.phase='playing';document.getElementById('pause').style.display='none';canvas.requestPointerLock();}
document.getElementById('resume-btn').onclick=resumeGame;
document.getElementById('menu-btn').onclick=()=>{clearInterval(buyTimerIv);G.phase='menu';clearMap();document.getElementById('pause').style.display='none';document.getElementById('hud').style.display='none';document.getElementById('menu').style.display='flex';document.exitPointerLock();camera.fov=73;camera.updateProjectionMatrix();};

// ═══ MENU ═══
function initMenu(){
  document.querySelectorAll('.team-btn').forEach(b=>{b.onclick=()=>{G.playerTeam=b.dataset.t;document.querySelectorAll('.team-btn').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');};});
  const grid=document.getElementById('map-grid');grid.innerHTML='';
  MAPS.forEach((map,i)=>{
    const card=document.createElement('div');card.className='map-card'+(i===G.selMap?' sel':'');
    const prev=document.createElement('canvas');prev.width=135;prev.height=76;
    const pc=prev.getContext('2d');pc.fillStyle=map.theme;pc.fillRect(0,0,135,76);
    pc.fillStyle='rgba(0,0,0,.6)';const sx=135/80,sz=76/80;
    for(const w of map.walls){if(w[4]<1)continue;pc.fillRect((w[0]-w[3]/2+40)*sx,(w[2]-w[5]/2+40)*sz,w[3]*sx,w[5]*sz);}
    pc.fillStyle='#2255FF';pc.beginPath();pc.arc((map.ctSpawn.x+40)*sx,(map.ctSpawn.z+40)*sz,4,0,Math.PI*2);pc.fill();
    pc.fillStyle='#FF5522';pc.beginPath();pc.arc((map.tSpawn.x+40)*sx,(map.tSpawn.z+40)*sz,4,0,Math.PI*2);pc.fill();
    for(const s of map.bombSites){pc.fillStyle='rgba(255,140,0,.6)';pc.fillRect((s.x-s.r+40)*sx,(s.z-s.r+40)*sz,s.r*2*sx,s.r*2*sz);pc.fillStyle='#FF8800';pc.font='bold 10px monospace';pc.textAlign='center';pc.fillText(s.name,(s.x+40)*sx,(s.z+40)*sz+4);}
    const badge=document.createElement('div');badge.className='mbadge';badge.textContent='✓';
    const info=document.createElement('div');info.className='mci';
    const nm=document.createElement('div');nm.className='mcn';nm.textContent=map.name.toUpperCase();
    const ds=document.createElement('div');ds.className='mcd';ds.textContent=['Пустеля','Офіс','Ядерний','Піщаник'][i]||'';
    info.appendChild(nm);info.appendChild(ds);card.appendChild(prev);card.appendChild(badge);card.appendChild(info);
    card.onclick=()=>{G.selMap=i;document.querySelectorAll('.map-card').forEach(c=>c.classList.remove('sel'));card.classList.add('sel');};
    grid.appendChild(card);
  });
  document.querySelectorAll('.dbtn').forEach(b=>{b.onclick=()=>{G.difficulty=+b.dataset.d;document.querySelectorAll('.dbtn').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');};});
}
document.getElementById('play-btn').onclick=startGame;
function startGame(){
  document.getElementById('menu').style.display='none';document.getElementById('hud').style.display='block';G.phase='playing';
  buildMap(G.selMap);
  const map=MAPS[G.selMap];const sp=G.playerTeam==='ct'?map.ctSpawn:map.tSpawn;const p=G.player;
  p.pos.set(sp.x+(Math.random()-.5)*2,0,sp.z+(Math.random()-.5)*2);p.vel.set(0,0,0);
  p.yaw=0;p.pitch=0;p.health=100;p.armor=0;p.alive=true;p.reloading=false;p.scoped=false;p.hasKit=false;
  p.grenFrag=0;p.grenSmoke=0;
  p.wepSlots=defaultWeps(G.playerTeam);
  p.curSlot=0;p.curWepId=p.wepSlots[0].wep.id;p.prevSlot=0;
  if(G.playerTeam==='t')p.wepSlots.push({wep:WCAT[8],ammo:0,reserve:0});
  G.economy={money:800,lossSeries:0};
  G.score={ctWins:0,tWins:0};G.grenades=[];G.smokeFields=[];G.shells=[];G.fxMeshes=[];G.drops=[];G.gt.active=false;
  G.round={num:1,timer:120,phase:'playing'};
  document.getElementById('rct').textContent='0';document.getElementById('rt').textContent='0';
  document.getElementById('round-num').textContent='РАУНД 1/6';document.getElementById('round-timer').textContent='2:00';
  document.getElementById('dead-ov').style.display='none';document.getElementById('round-end').style.display='none';
  document.getElementById('halftime').style.display='none';document.getElementById('nade-charge').style.display='none';
  document.getElementById('smoke-ov').style.opacity='0';
  hideAction();
  const tb=document.getElementById('tbadge');tb.className=G.playerTeam;tb.textContent=G.playerTeam.toUpperCase();
  G.bots=[];
  for(const sp2 of map.bSpawns)G.bots.push(new Bot(sp2.x+(Math.random()-.5)*3,sp2.z+(Math.random()-.5)*3,G.selMap,sp2.tm));
  for(const b of G.bots)b.isEnemy=b.team!==G.playerTeam;
  initBomb();buildGunModel(p.curWepId);updateHUD();canvas.requestPointerLock();initAC();
  startBuyPhase();
}

// ═══ LOOP ═══
let prevT=0;
function loop(t){
  requestAnimationFrame(loop);const dt=Math.min((t-prevT)/1000,.05);prevT=t;
  try{
    if(G.phase==='playing'||G.phase==='buying'){
      if(G.round.phase==='playing'&&G.phase==='playing'){
        updatePlayer(dt);
        for(const b of G.bots)b.update(dt);
        for(let i=G.grenades.length-1;i>=0;i--){G.grenades[i].update(dt);if(!G.grenades[i].alive)G.grenades.splice(i,1);}
        updShells(dt);updGrenThrow(dt);updateBomb(dt);updateRoundTimer(dt);updateDrops(dt);
      }
      updateMinimap();
      if(Math.floor(t/260)%2===0)updateHUD();
    }
  }catch(e){console.error('Loop error:',e);}
  renderer.render(scene,camera);
}
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
initMenu();requestAnimationFrame(loop);
// ═══════════════════════════════════════════════════
// MULTIPLAYER — Socket.IO integration
// ═══════════════════════════════════════════════════
let socket = null;
const MP = {
  connected: false,
  myId: null,
  remotePlayers: {}, // id -> {mesh, nameTag, lastUpdate, ...}
  mode: 'bots', // 'bots' | 'online'
};

// Remote player 3D model (simple humanoid, same as bot)
function createRemoteModel(team) {
  const grp = new THREE.Group();
  const Bm = c => new THREE.MeshLambertMaterial({color:c});
  const Bx = (w,h,d,x,y,z,col) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),Bm(col));
    m.position.set(x,y,z); grp.add(m); return m;
  };
  const bc = team==='ct' ? 0x2a3a5a : 0x5a3a10;
  const sk = team==='ct' ? 0xBBAA99 : 0xCC9977;
  Bx(.38,.38,.38,0,1.55,0,sk);   // head
  if(team==='ct')Bx(.42,.22,.42,0,1.74,0,0x1a2535); // helmet
  Bx(.62,1.1,.32,0,.6,0,bc);     // torso
  Bx(.22,.8,.22,-.2,-.15,0,0x181818); // left leg
  Bx(.22,.8,.22,.2,-.15,0,0x181818);  // right leg
  Bx(.22,.7,.22,-.28,.75,0,bc);  // left arm
  Bx(.22,.7,.22,.28,.75,0,bc);   // right arm
  // Weapon indicator
  Bx(.06,.06,.36,.42,.9,-.18,0x222);
  // Health bar (flat mesh above head, updated dynamically)
  grp._hpBarBg = new THREE.Mesh(new THREE.BoxGeometry(.44,.05,.02),new THREE.MeshBasicMaterial({color:0x222222}));
  grp._hpBarBg.position.set(0,2.05,0);grp.add(grp._hpBarBg);
  grp._hpBar = new THREE.Mesh(new THREE.BoxGeometry(.44,.04,.025),new THREE.MeshBasicMaterial({color:0x22BB44}));
  grp._hpBar.position.set(0,2.05,.01);grp.add(grp._hpBar);
  return grp;
}

function updateRemotePlayers(serverPlayers) {
  const seen = new Set();
  for (const sp of serverPlayers) {
    if (sp.id === MP.myId) continue; // skip self
    seen.add(sp.id);
    let rp = MP.remotePlayers[sp.id];
    if (!rp) {
      // Create new remote player
      const mesh = createRemoteModel(sp.team);
      scene.add(mesh);
      G.sceneObjs.push(mesh);
      MP.remotePlayers[sp.id] = rp = {mesh, team: sp.team, alive: sp.alive, health: sp.health};
    }
    rp.mesh.visible = sp.alive;
    rp.alive = sp.alive;
    rp.health = sp.health;
    if (sp.alive) {
      rp.mesh.position.set(sp.pos.x, sp.pos.y, sp.pos.z);
      rp.mesh.rotation.y = sp.yaw;
      // Update HP bar
      const hpPct = Math.max(0, sp.health) / 100;
      if (rp.mesh._hpBar) {
        rp.mesh._hpBar.scale.x = hpPct;
        rp.mesh._hpBar.position.x = -(1-hpPct)*.22;
        rp.mesh._hpBar.material.color.setHex(hpPct>.5?0x22BB44:hpPct>.25?0xFFAA00:0xFF2222);
      }
    }
  }
  // Remove disconnected players
  for (const id of Object.keys(MP.remotePlayers)) {
    if (!seen.has(id)) {
      scene.remove(MP.remotePlayers[id].mesh);
      const i = G.sceneObjs.indexOf(MP.remotePlayers[id].mesh);
      if(i>-1) G.sceneObjs.splice(i,1);
      delete MP.remotePlayers[id];
    }
  }
}

// Connect to multiplayer server
window.joinMP = function(team) {
  const name = document.getElementById('mp-name').value.trim() || ('Player'+Math.floor(Math.random()*9999));
  const roomId = document.getElementById('mp-room').value.trim() || 'main';
  const serverUrl = document.getElementById('mp-server').value.trim() || 'http://localhost:3000';
  const status = document.getElementById('mp-status');
  status.textContent = 'Підключення до '+serverUrl+'...';
  status.style.color='#FF8800';

  try {
    socket = io(serverUrl, {transports:['websocket','polling'], timeout:5000});
  } catch(e) {
    status.textContent = 'Помилка: Socket.IO не завантажений';
    status.style.color='#FF4444'; return;
  }

  socket.on('connect', () => {
    MP.myId = socket.id;
    MP.connected = true;
    status.textContent = 'Підключено! ID: '+socket.id.slice(0,8);
    status.style.color='#44FF44';
    socket.emit('join', {roomId, team, name, selMap: G.selMap});
  });

  socket.on('joined', (data) => {
    G.playerTeam = data.team;
    G.economy.money = data.money;
    G.score.ctWins = data.score.ct;
    G.score.tWins = data.score.t;
    document.getElementById('rct').textContent = G.score.ctWins;
    document.getElementById('rt').textContent = G.score.tWins;
    document.getElementById('money-hud').textContent = '$'+data.money;

    // Switch to online mode
    MP.mode = 'online';
    G.bots = []; // no bots in multiplayer
    document.getElementById('mp-lobby').style.display = 'none';
    document.getElementById('menu').style.display = 'none';
    document.getElementById('hud').style.display = 'block';
    G.phase = data.phase === 'playing' ? 'playing' : 'buying';
    buildMap(data.selMap || 0);
    // Spawn player
    const map = MAPS[data.selMap || 0];
    const sp = data.team==='ct' ? map.ctSpawn : map.tSpawn;
    G.player.pos.set(sp.x+(Math.random()-.5)*2, 0, sp.z+(Math.random()-.5)*2);
    G.player.alive = true;
    G.player.health = 100;
    G.player.wepSlots = defaultWeps(data.team);
    G.player.curSlot = 0;
    G.player.curWepId = G.player.wepSlots[0].wep.id;
    buildGunModel(G.player.curWepId);
    updateHUD();
    canvas.requestPointerLock();
    addKF('✅ Підключено як '+data.team.toUpperCase()+' — '+name,'ctk');
  });

  socket.on('connect_error', (e) => {
    status.textContent = 'Не вдалось підключитись: '+e.message;
    status.style.color='#FF4444';
    MP.connected = false;
  });

  // Receive server state snapshot (20Hz)
  socket.on('state', (snap) => {
    if(!MP.connected||G.phase==='menu') return;
    updateRemotePlayers(snap.players);
    // Sync round timer and score
    if(snap.round) {
      G.round.timer = snap.round.timer;
      const el = document.getElementById('round-timer');
      if(el) el.textContent = formatTime(Math.max(0,snap.round.timer));
    }
    if(snap.score){
      G.score.ctWins = snap.score.ct;
      G.score.tWins = snap.score.t;
      document.getElementById('rct').textContent = snap.score.ct;
      document.getElementById('rt').textContent = snap.score.t;
    }
    // Sync bomb state
    if(snap.bomb && snap.bomb.planted && !G.bomb.planted) {
      G.bomb.planted = true;
      G.bomb.bombTimer = snap.bomb.bombTimer;
      G.bomb.siteName = snap.bomb.siteName;
      G.bomb.plantX = snap.bomb.plantX;
      G.bomb.plantZ = snap.bomb.plantZ;
      spawnBombMesh(snap.bomb.plantX, snap.bomb.plantZ);
      document.getElementById('bomb-hud').style.display='flex';
    }
    if(snap.bomb && !snap.bomb.planted && G.bomb.planted) {
      G.bomb.planted=false;
      if(G.bomb.mesh){scene.remove(G.bomb.mesh);G.bomb.mesh=null;}
      document.getElementById('bomb-hud').style.display='none';
    }
    if(snap.bomb && snap.bomb.planted) G.bomb.bombTimer = snap.bomb.bombTimer;
  });

  socket.on('roundStart', (data) => {
    G.score.ctWins = data.score.ct;
    G.score.tWins = data.score.t;
    document.getElementById('rct').textContent = data.score.ct;
    document.getElementById('rt').textContent = data.score.t;
    G.phase = 'buying';
    G.round.num = data.round;
    G.round.timer = ROUND_TIME;
    G.bomb = {exists:true,carried:false,planted:false,bombTimer:0,plantX:0,plantZ:0,siteName:'',mesh:null};
    clearDrops();
    document.getElementById('round-end').style.display='none';
    document.getElementById('dead-ov').style.display='none';
    startBuyPhase();
    addKF('🔔 Раунд '+data.round+' — Купуй!','ctk');
    updateHUD();
  });

  socket.on('buyEnd', () => {
    G.phase = 'playing';
    G.round.phase = 'playing';
    closeBuyMenu();
    addKF('🏃 СТАРТ!','ctk');
  });

  socket.on('roundEnd', (data) => {
    G.phase = 'end';
    document.getElementById('round-end').style.display='flex';
    document.getElementById('re-title').textContent = data.winner.toUpperCase()+' ПЕРЕМОГА';
    document.getElementById('re-title').style.color = data.winner==='ct'?'#4488FF':'#FF8844';
    document.getElementById('re-sub').textContent = data.reason;
    document.getElementById('re-stat').textContent = 'CT '+data.score.ct+' — '+data.score.t+' T | Раунд '+data.round;
    document.exitPointerLock();
    addKF('🏆 '+(data.winner.toUpperCase())+' виграли: '+data.reason, data.winner==='ct'?'ctk':'bomb');
  });

  socket.on('matchEnd', (data) => {
    const w = data.score.ct>data.score.t?'CT':data.score.t>data.score.ct?'T':'НІЧИЯ';
    addKF('🎮 МАТЧ ЗАВЕРШЕНО — '+w, 'ctk');
    goMenu();
  });

  socket.on('halftime', (data) => {
    G.playerTeam = G.playerTeam==='ct'?'t':'ct';
    const tmp=G.score.ctWins;G.score.ctWins=data.score.ct;G.score.tWins=data.score.t;
    addKF('⚡ ПЕРЕРВА — Зміна сторін!','ctk');
  });

  socket.on('youHaveBomb', () => {
    G.bomb.carried = true;
    G.bomb.exists = true;
    // Add bomb to wep slots
    const bslot={wep:{...WCAT[8]},ammo:0,reserve:0};
    const bi=G.player.wepSlots.findIndex(s=>s.wep.isBomb);
    if(bi<0) G.player.wepSlots.push(bslot);
    updateHUD();
    addKF('💣 У вас є бомба!','bomb');
  });

  socket.on('bombPlanted', (data) => {
    G.bomb.planted=true;G.bomb.carried=false;
    G.bomb.plantX=data.x;G.bomb.plantZ=data.z;
    G.bomb.siteName=data.siteName;G.bomb.bombTimer=40;
    spawnBombMesh(data.x,data.z);
    document.getElementById('bomb-hud').style.display='flex';
    addKF('💣 БОМБА ПЛЕНТОВАНА НА '+data.siteName,'bomb');
    playBeep(440,.3);setTimeout(()=>playBeep(660,.2),150);
  });

  socket.on('bombDefused', () => {
    G.bomb.planted=false;
    if(G.bomb.mesh){scene.remove(G.bomb.mesh);G.bomb.mesh=null;}
    document.getElementById('bomb-hud').style.display='none';
    addKF('✂ БОМБА ЗНЕШКОДЖЕНА!','ctk');
  });

  socket.on('playerDied', (data) => {
    const isMe = data.victimId===MP.myId;
    const isKiller = data.killerId===MP.myId;
    if(isMe) {
      G.player.alive=false; G.player.health=0;
      wGrp.visible=false;
      document.getElementById('dead-ov').style.display='flex';
      // Drop weapons
      dropPlayerWeapons();
    }
    if(isKiller) {
      giveMoney(300);
      addKF('🎯 Ти вбив!','hs');
    }
  });

  socket.on('youWereHit', (data) => {
    G.player.health = Math.max(0, G.player.health - data.damage);
    addShake(.012);showDmg();updateHUD();
  });

  socket.on('playerShot', (data) => {
    // Play shot sound for remote players
    if(AC) noiseShot(data.snd||'ak');
  });

  socket.on('playerLeft', (data) => {
    addKF('❌ Гравець відключився','tk');
    if(MP.remotePlayers[data.id]){
      scene.remove(MP.remotePlayers[data.id].mesh);
      const i=G.sceneObjs.indexOf(MP.remotePlayers[data.id].mesh);
      if(i>-1) G.sceneObjs.splice(i,1);
      delete MP.remotePlayers[data.id];
    }
  });

  socket.on('playerList', (list) => {
    updateScoreboard(list);
  });

  socket.on('chat', (data) => {
    addChatMsg(data.name, data.msg, data.team);
  });

  socket.on('defuseProgress', (data) => {
    // Could show visual indicator
  });
};

// Send player state to server (called from game loop)
let _lastSend = 0;
function sendPlayerState() {
  if(!MP.connected||!socket) return;
  const now=Date.now();
  if(now-_lastSend<33) return; // 30Hz
  _lastSend=now;
  const p=G.player;
  socket.emit('playerUpdate',{
    pos:{x:p.pos.x,y:p.pos.y,z:p.pos.z},
    yaw:p.yaw, pitch:p.pitch,
    curWepId:p.curWepId,
    health:p.health,
    armor:p.armor,
  });
}

// Override shoot() to also notify server of hits against remote players
const _origShoot = shoot;
// Wrap shoot to emit hit events to server
const _origTakeDmg = (bot, dmg, head) => bot.takeDmg(dmg, head);

// Multiplayer hit detection — called from shoot() for remote players
function mpHitCheck(dir) {
  if(!MP.connected) return false;
  for(const [id, rp] of Object.entries(MP.remotePlayers)) {
    if(!rp.alive) continue;
    const bPos = rp.mesh.position.clone().add(new THREE.Vector3(0,1.1,0));
    const t2 = new THREE.Vector3().subVectors(bPos, camera.position);
    const pj = t2.dot(dir);
    if(pj>0.2 && pj<600) {
      const cl = camera.position.clone().addScaledVector(dir, pj);
      if(cl.distanceTo(bPos)<0.5) {
        const head = pj < 0.8;
        const w = curWepDef();
        socket.emit('hit',{targetId:id, damage:w?w.dmg:30, head});
        doHitMarker(); playHit();
        socket.emit('shoot',{snd:w?w.snd:'ak'});
        return true;
      }
    }
  }
  return false;
}

// Helper: drop weapons on death (multiplayer)
function dropPlayerWeapons(){
  const p=G.player;
  for(const sl of p.wepSlots){
    const w=sl.wep;
    if(w.isKnife||w.isBomb||w.isKit)continue;
    const col=w.pistol?0x444444:0x1a1a2a;
    const m=new THREE.Mesh(new THREE.BoxGeometry(.14,.05,.38),new THREE.MeshLambertMaterial({color:col}));
    m.position.set(p.pos.x+(Math.random()-.5)*.6,.04,p.pos.z+(Math.random()-.5)*.6);
    scene.add(m);G.fxMeshes.push(m);
    G.drops.push({mesh:m,wep:{...w},ammo:sl.ammo,reserve:sl.reserve,pos:new THREE.Vector3(m.position.x,0,m.position.z)});
  }
  p.wepSlots=defaultWeps(G.playerTeam);
  p.curSlot=0;p.curWepId=p.wepSlots[0].wep.id;
}

function clearDrops(){
  for(const d of G.drops) scene.remove(d.mesh);
  G.drops=[];
  for(const m of G.fxMeshes) scene.remove(m);
  G.fxMeshes=[];
}

// Bomb planting — emit to server
function mpBombPlant(x,z,siteName){
  if(socket && MP.connected) socket.emit('bombPlant',{x,z,siteName});
}

// Bomb defuse — emit progress to server
function mpBombDefuse(progress){
  if(socket && MP.connected) socket.emit('bombDefuse', progress);
}

// Chat system
function addChatMsg(name, msg, team){
  const box = document.getElementById('chat-msgs');
  if(!box) return;
  const el = document.createElement('div');
  el.style.cssText='background:rgba(0,0,0,.6);padding:2px 6px;border-radius:2px;max-width:100%;word-break:break-word';
  const col = team==='ct'?'#4488FF':'#FF8844';
  el.innerHTML=`<span style="color:${col}">[${name}]</span> <span style="color:#ccc">${escHtml(msg)}</span>`;
  box.appendChild(el);
  if(box.children.length>12) box.removeChild(box.firstChild);
  // Auto-clear after 8s
  setTimeout(()=>{if(el.parentNode)el.parentNode.removeChild(el);},8000);
}
function escHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

// Scoreboard
function updateScoreboard(list){
  const sbCT=document.getElementById('sb-ct');
  const sbT=document.getElementById('sb-t');
  if(!sbCT||!sbT) return;
  const mkRow=(p)=>`<div style="display:flex;justify-content:space-between;padding:4px 8px;color:#ccc;font-size:11px"><span>${p.name}</span><span>${p.kills}/${p.deaths}</span></div>`;
  sbCT.innerHTML='<div style="color:#4488FF;font-size:12px;padding:4px 8px;border-bottom:1px solid #4488FF44">CT — '+list.filter(p=>p.team==='ct').length+'</div>'+list.filter(p=>p.team==='ct').map(mkRow).join('');
  sbT.innerHTML='<div style="color:#FF8844;font-size:12px;padding:4px 8px;border-bottom:1px solid #FF884444;margin-top:8px">T — '+list.filter(p=>p.team==='t').length+'</div>'+list.filter(p=>p.team==='t').map(mkRow).join('');
}

// Send player state every frame when in multiplayer
const _origLoop = loop;

// Hook into game loop to send state
(function patchLoop(){
  const origLoop = loop;
  window.loop = function(t){
    origLoop(t);
    if(MP.mode==='online'){
      sendPlayerState();
    }
  };
})();

// Key bindings for chat and scoreboard
document.addEventListener('keydown', e => {
  if(G.phase!=='playing'&&G.phase!=='buying') return;
  // Tab = scoreboard
  if(e.key==='Tab'){
    e.preventDefault();
    document.getElementById('scoreboard').style.display='flex';
    return;
  }
  // Y/T = chat
  if((e.key==='y'||e.key==='Y')&&!document.getElementById('chat-input-wrap').style.display.includes('flex')){
    if(!document.pointerLockElement) return;
    document.exitPointerLock();
    const wrap=document.getElementById('chat-input-wrap');
    wrap.style.display='flex';
    const inp=document.getElementById('chat-input');
    inp.value='';inp.focus();
    inp.onkeydown=ev=>{
      if(ev.key==='Enter'&&inp.value.trim()){
        if(socket&&MP.connected) socket.emit('chat', inp.value.trim());
        else addChatMsg('Ти',inp.value.trim(),G.playerTeam);
        wrap.style.display='none';
        canvas.requestPointerLock();
      }
      if(ev.key==='Escape'){wrap.style.display='none';canvas.requestPointerLock();}
    };
  }
  // Multiplayer lobby button in menu (add to menu)
});
document.addEventListener('keyup', e => {
  if(e.key==='Tab') document.getElementById('scoreboard').style.display='none';
});

// Add multiplayer button to main menu
(function addMPButton(){
  const checkMenu=setInterval(()=>{
    const playBtn=document.getElementById('play-btn');
    if(!playBtn)return;
    clearInterval(checkMenu);
    const mpBtn=document.createElement('button');
    mpBtn.className='play-btn';
    mpBtn.style.cssText='background:linear-gradient(135deg,#004488,#0066CC,#004488);margin-top:8px;font-size:13px;padding:9px 32px';
    mpBtn.textContent='🌐 МУЛЬТИПЛЕЄР';
    mpBtn.onclick=()=>document.getElementById('mp-lobby').style.display='flex';
    playBtn.parentNode.insertBefore(mpBtn,playBtn.nextSibling);
  },100);
})();
