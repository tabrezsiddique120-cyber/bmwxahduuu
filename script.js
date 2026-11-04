document.body.classList.add('loading');
const loader=document.getElementById('loader');
window.addEventListener('load',()=>{setTimeout(()=>{loader.classList.add('done');document.body.classList.add('ready');document.body.classList.remove('loading')},1500)});

const progress=document.getElementById('scrollProgress');
const dot=document.getElementById('cursorDot');
const ring=document.getElementById('cursorRing');
window.addEventListener('scroll',()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
},{passive:true});

if(window.matchMedia('(pointer:fine)').matches){
  let mx=0,my=0,rx=0,ry=0;
  window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.opacity=1;ring.style.opacity=1;dot.style.left=mx+'px';dot.style.top=my+'px'});
  function animateCursor(){rx+=(mx-rx)*.15;ry+=(my-ry)*.15;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animateCursor)}
  animateCursor();
  document.querySelectorAll('a,button,.model-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('hover'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('hover'));
  });
}

const menuToggle=document.getElementById('menuToggle');
const mainNav=document.getElementById('mainNav');
menuToggle.addEventListener('click',()=>{
  menuToggle.classList.toggle('active');
  mainNav.classList.toggle('open');
});
mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  menuToggle.classList.remove('active');mainNav.classList.remove('open');
}));

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const filters=document.querySelectorAll('.filter-btn');
const cards=document.querySelectorAll('.model-card');
filters.forEach(btn=>btn.addEventListener('click',()=>{
  filters.forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const category=btn.dataset.filter;
  cards.forEach(card=>{
    const show=category==='all'||card.dataset.category===category;
    card.classList.toggle('hidden',!show);
    if(show){card.animate([{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'ease-out'})}
  });
}));

// Small detail interaction keeps the showcase self-contained.
const toast=document.getElementById('toast');
let toastTimer;
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)}
document.querySelectorAll('.model-detail').forEach(btn=>btn.addEventListener('click',()=>{
  showToast(btn.dataset.model+' — explore official specifications at BMW.com');
}));

const modal=document.getElementById('imageModal');
const modalImage=document.getElementById('modalImage');
document.querySelectorAll('.gallery-item').forEach(item=>item.addEventListener('click',()=>{
  modalImage.src=item.dataset.image;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}));
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.getElementById('modalClose').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

const countObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const el=entry.target,target=Number(el.dataset.count);let start=0;
    const duration=1100,begin=performance.now();
    function tick(now){const p=Math.min((now-begin)/duration,1);el.textContent=Math.round(target*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)}
    requestAnimationFrame(tick);countObserver.unobserve(el);
  });
},{threshold:.7});
document.querySelectorAll('[data-count]').forEach(el=>countObserver.observe(el));

// Gentle magnetic movement on desktop only.
if(window.matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
      el.style.transform=`translate(${x*.08}px,${y*.12}px)`;
    });
    el.addEventListener('mouseleave',()=>el.style.transform='');
  });
}

// ===== EXTRA ANIMATIONS & FEATURES =====
const $=s=>document.querySelector(s);
const fx=$('#fx'),c=fx.getContext('2d');let P=[];
function sz(){fx.width=innerWidth;fx.height=innerHeight;P=Array.from({length:60},()=>({x:Math.random()*fx.width,y:Math.random()*fx.height,r:Math.random()*1.8+.4,v:Math.random()*.5+.15}))}sz();addEventListener('resize',sz);
(function loop(){c.clearRect(0,0,fx.width,fx.height);c.fillStyle='rgba(101,186,255,.7)';P.forEach(p=>{c.beginPath();c.arc(p.x,p.y,p.r,0,7);c.fill();p.y-=p.v;if(p.y<0){p.y=fx.height;p.x=Math.random()*fx.width}});requestAnimationFrame(loop)})();
const hv=document.querySelector('.hero-visual');
if(hv&&matchMedia('(pointer:fine)').matches)addEventListener('mousemove',e=>{hv.style.transform=`translate(${(e.clientX/innerWidth-.5)*24}px,${(e.clientY/innerHeight-.5)*14}px)`});
addEventListener('scroll',()=>{document.querySelectorAll('.manifesto-image img,.legacy-feature img').forEach(i=>{const r=i.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)i.style.transform=`translateY(${(r.top-innerHeight/2)*.06}px) scale(1.12)`})},{passive:true});
document.querySelectorAll('.model-card').forEach(k=>{k.addEventListener('mousemove',e=>{const r=k.getBoundingClientRect();k.style.transform=`perspective(800px) rotateY(${((e.clientX-r.left)/r.width-.5)*10}deg) rotateX(${-((e.clientY-r.top)/r.height-.5)*10}deg) translateY(-7px)`});k.addEventListener('mouseleave',()=>k.style.transform='')});
document.querySelectorAll('.button').forEach(b=>b.addEventListener('click',e=>{const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='ripple';s.style.cssText=`width:60px;height:60px;left:${e.clientX-r.left-30}px;top:${e.clientY-r.top-30}px`;b.appendChild(s);setTimeout(()=>s.remove(),600)}));
new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('.bar').forEach((b,i)=>setTimeout(()=>b.querySelector('u').style.width=b.dataset.v+'%',i*150));o.unobserve(e.target)}}),{threshold:.3}).observe($('.bars'));
let busy=0;$('#launchBtn').onclick=()=>{if(busy)return;busy=1;const T=2100,st=performance.now();
(function f(n){const t=n-st,p=Math.min(t/T,1),e=1-Math.pow(1-p,2.2);
$('#gRpm').textContent=(e*8).toFixed(1);$('#gKmh').textContent=Math.round(e*100);$('#gTime').textContent=(t/1000).toFixed(2);
$('#gArc').style.strokeDashoffset=267-267*e;$('#gNeedle').style.transform=`rotate(${e*180}deg)`;
if(p<1)requestAnimationFrame(f);else{$('#gTime').textContent='2.10';showToast('0–100 in 2.1s — AH Vision Concept');setTimeout(()=>{$('#gRpm').textContent=0;$('#gKmh').textContent=0;$('#gArc').style.strokeDashoffset=267;$('#gNeedle').style.transform='rotate(0)';busy=0},1500)}})(st)};
document.querySelectorAll('.sw').forEach(s=>s.onclick=()=>{document.querySelectorAll('.sw').forEach(x=>x.classList.remove('on'));s.classList.add('on');$('#cfgImg').style.filter=`hue-rotate(${s.dataset.h}deg) saturate(${s.dataset.n=='Frozen Grey'?.2:1.2})`;$('#cfgName').textContent=s.dataset.n});
$('#filmPlay').onclick=()=>{const v=$('#bmwVid');v.setAttribute('controls','');v.play().then(()=>$('.film').classList.add('playing')).catch(()=>showToast('videos/bmw.mp4 file folder me daalo'))};
$('#driveForm').onsubmit=e=>{e.preventDefault();showToast('Test drive booked! Ahad Hussain ki team contact karegi.');e.target.reset()};
addEventListener('keydown',e=>{if(e.key.toLowerCase()=='b'&&!/INPUT|SELECT/.test(e.target.tagName)){document.body.animate([{filter:'brightness(2)'},{filter:'none'}],500);showToast('Sheer Driving Pleasure — Ahad Hussain')}});

// ===== BMW × AHAD HUSSAIN UPGRADE =====
(function(){
// Showroom: code-drawn silhouettes + live spec counters
const M=[
{n:'BMW iX3',s:'NEUE KLASSE · ELECTRIC',t:'suv',c:'#1675e8',a:469,b:4.9,d:800,u:'KM RANGE'},
{n:'BMW M5',s:'THE SUPER SEDAN',t:'sedan',c:'#d6202f',a:727,b:3.5,d:250,u:'KM/H TOP SPEED'},
{n:'BMW XM',s:'M HIGH-PERFORMANCE SAV',t:'suv',c:'#e8c216',a:644,b:4.1,d:250,u:'KM/H TOP SPEED'},
{n:'BMW i7',s:'ELECTRIC LUXURY',t:'sedan',c:'#65baff',a:650,b:3.7,d:560,u:'KM RANGE'},
{n:'BMW i4 M50',s:'ELECTRIC GRAN COUPE',t:'sedan',c:'#1675e8',a:536,b:3.9,d:520,u:'KM RANGE'},
{n:'BMW M2',s:'COMPACT M COUPE',t:'sedan',c:'#1f8a4c',a:473,b:4.1,d:250,u:'KM/H TOP SPEED'},
{n:'BMW Z4 M40i',s:'OPEN-AIR ROADSTER',t:'rdst',c:'#e8c216',a:382,b:4.5,d:250,u:'KM/H TOP SPEED'},
{n:'BMW X5 M',s:'M COMPETITION SAV',t:'suv',c:'#d6202f',a:625,b:3.8,d:250,u:'KM/H TOP SPEED'}];
const P={sedan:['M30 146L46 122Q62 110 124 102L204 72Q254 52 334 54Q404 56 444 92L522 106Q566 112 572 138L574 150H30Z','M218 80Q262 62 330 64Q386 66 418 92L250 92Z'],
suv:['M30 148L40 108Q55 92 120 86L190 52Q240 38 360 40Q432 42 472 80L536 92Q576 98 578 132L580 150H30Z','M205 60Q250 48 350 50Q410 52 442 84L215 84Z'],
rdst:['M30 144L48 122Q70 112 130 106L214 90Q250 80 290 86L330 94L440 100L522 108Q566 114 572 138L574 150H30Z','M240 92Q262 86 288 90L318 98L236 98Z']};
const wheel=x=>`<g><circle class="tyre" cx="${x}" cy="150" r="30"/><g class="spokes"><line x1="${x-22}" y1="150" x2="${x+22}" y2="150"/><line x1="${x}" y1="128" x2="${x}" y2="172"/></g></g>`;
const svg=(t,c)=>`<svg viewBox="0 0 600 200" aria-hidden="true" style="--car:${c}"><path class="body" d="${P[t][0]}"/><path class="glass" d="${P[t][1]}"/>${wheel(140)}${wheel(462)}<rect class="lamp" x="548" y="118" width="26" height="6" rx="3"/></svg>`;
function cnt(el,to,dec){const st=performance.now();(function f(n){const p=Math.min((n-st)/800,1),e=1-Math.pow(1-p,3);el.textContent=(to*e).toFixed(dec);if(p<1)requestAnimationFrame(f)})(st)}
const tabs=$('#luTabs'),car=$('#luCar');let cur=0,timer;
M.forEach((m,i)=>{const b=document.createElement('button');b.className='lu-tab';b.textContent=m.n.replace('BMW ','');b.onclick=()=>{clearInterval(timer);pick(i)};tabs.appendChild(b)});
function pick(i){cur=i;const m=M[i];
tabs.querySelectorAll('.lu-tab').forEach((b,j)=>b.classList.toggle('on',j==i));
car.classList.remove('in');car.innerHTML=svg(m.t,m.c);void car.offsetWidth;requestAnimationFrame(()=>car.classList.add('in'));
$('#luName').textContent=m.n;$('#luTag').textContent=m.s;$('#luXl').textContent=m.u;
cnt($('#luHp'),m.a,0);cnt($('#luAcc'),m.b,1);cnt($('#luX'),m.d,0)}
pick(0);timer=setInterval(()=>{if(!document.hidden)pick((cur+1)%M.length)},5500);

// Night drive: generative cinematic film on canvas
const cv=$('#nightDrive'),g=cv.getContext('2d'),spd=$('#ndSpeed'),btn=$('#boostBtn');
let W,H,t=0,v=.25,boost=false,on=false,S=[];
function rs(){W=cv.width=cv.clientWidth;H=cv.height=cv.clientHeight;S=Array.from({length:80},()=>({x:Math.random()*W,y:Math.random()*H*.5,r:Math.random()*1.3+.3}))}rs();addEventListener('resize',rs);
function draw(){requestAnimationFrame(draw);if(!on)return;
v+=((boost?1:.25)-v)*.04;t+=v*.012;const h=H*.5,cx=W/2;
const sk=g.createLinearGradient(0,0,0,h);sk.addColorStop(0,'#04060b');sk.addColorStop(1,'#0e2742');g.fillStyle=sk;g.fillRect(0,0,W,h);
g.fillStyle='#fff';S.forEach(p=>{g.globalAlpha=.4+.4*Math.sin(t*6+p.x);g.fillRect(p.x,p.y,p.r,p.r)});g.globalAlpha=1;
g.fillStyle='#0a1523';g.beginPath();g.moveTo(0,h);for(let x=0;x<=W;x+=20)g.lineTo(x,h-30-28*Math.sin(x*.012+t*.4)-14*Math.sin(x*.031));g.lineTo(W,h);g.fill();
g.fillStyle='#070a10';g.fillRect(0,h,W,H-h);
g.fillStyle='#10161f';g.beginPath();g.moveTo(cx-6,h);g.lineTo(cx+6,h);g.lineTo(cx+W*.42,H);g.lineTo(cx-W*.42,H);g.fill();
g.fillStyle='#cfe3f7';for(let i=0;i<10;i++){const p=(i/10+t)%1,q=p*p;g.fillRect(cx-(1+q*5),h+(H-h)*q,2+q*10,(H-h)*.06*(.3+q*1.6))}
g.strokeStyle='rgba(22,117,232,.8)';g.lineWidth=2;[-1,1].forEach(d=>{g.beginPath();g.moveTo(cx+d*6,h);g.lineTo(cx+d*W*.42,H);g.stroke()});
if(v>.45){g.strokeStyle=`rgba(101,186,255,${(v-.45)*.6})`;g.lineWidth=1;for(let i=0;i<32;i++){const a=i*2.39963,r0=(i*.173+t*3)%1,r1=r0+.1*v;g.beginPath();g.moveTo(cx+Math.cos(a)*r0*W*.7,h+Math.sin(a)*r0*H*.7);g.lineTo(cx+Math.cos(a)*r1*W*.7,h+Math.sin(a)*r1*H*.7);g.stroke()}}
const gl=g.createRadialGradient(cx,H*.92,10,cx,H*.92,W*.35);gl.addColorStop(0,'rgba(200,230,255,.35)');gl.addColorStop(1,'rgba(200,230,255,0)');g.fillStyle=gl;g.fillRect(0,0,W,H);
spd.textContent=Math.round(60+v*240);window.Engine&&Engine.rpm((v-.25)/.75)}
draw();
new IntersectionObserver(es=>on=es[0].isIntersecting,{threshold:.1}).observe(cv);
const go=()=>boost=true,stop=()=>boost=false;
btn.addEventListener('pointerdown',go);['pointerup','pointerleave','pointercancel'].forEach(e=>btn.addEventListener(e,stop));
btn.addEventListener('keydown',e=>{if(e.key==' '||e.key=='Enter'){e.preventDefault();go()}});btn.addEventListener('keyup',stop);

// Scroll-driven outlined type band
const bt=$('.bt-track');
addEventListener('scroll',()=>{const r=bt.parentElement.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)bt.style.transform=`translateX(${(r.top-innerHeight)*.4}px)`},{passive:true});
})();


// ===== ENGINE SOUND + START SCREEN + RACING GAME + M MODE =====
(function(){
const E=window.Engine={ctx:null,on:false,last:0,crankUntil:0,
start(){
 if(this.ctx){this.setOn(true);return}
 const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
 const a=this.ctx=new AC(),t=a.currentTime;
 this.o1=a.createOscillator();this.o1.type='sawtooth';
 this.o2=a.createOscillator();this.o2.type='square';
 this.f=a.createBiquadFilter();this.f.type='lowpass';this.f.Q.value=3;
 this.g=a.createGain();this.g.gain.value=0;
 this.lfo=a.createOscillator();this.lfo.frequency.value=11;
 const lg=a.createGain();lg.gain.value=.012;this.lfo.connect(lg);lg.connect(this.g.gain);
 const m=a.createGain();m.gain.value=.5;
 this.o1.connect(this.f);this.o2.connect(m);m.connect(this.f);this.f.connect(this.g);this.g.connect(a.destination);
 this.o1.frequency.setValueAtTime(14,t);this.o1.frequency.linearRampToValueAtTime(30,t+.9);
 this.o1.frequency.exponentialRampToValueAtTime(95,t+1.15);this.o1.frequency.exponentialRampToValueAtTime(52,t+1.9);
 this.o2.frequency.setValueAtTime(7,t);this.o2.frequency.linearRampToValueAtTime(15,t+.9);
 this.o2.frequency.exponentialRampToValueAtTime(47,t+1.15);this.o2.frequency.exponentialRampToValueAtTime(26,t+1.9);
 this.f.frequency.setValueAtTime(220,t);this.f.frequency.exponentialRampToValueAtTime(900,t+1.15);this.f.frequency.exponentialRampToValueAtTime(420,t+1.9);
 this.g.gain.linearRampToValueAtTime(.09,t+.3);this.g.gain.linearRampToValueAtTime(.16,t+1.15);this.g.gain.linearRampToValueAtTime(.06,t+1.9);
 this.o1.start();this.o2.start();this.lfo.start();
 this.crankUntil=performance.now()+2000;this.on=true;this.ui();
 setInterval(()=>{if(this.on&&performance.now()>this.crankUntil&&Date.now()-this.last>300)this.rpm(0,1)},120);
},
rpm(v,idle){
 if(!this.on||!this.ctx||performance.now()<this.crankUntil)return;
 if(!idle)this.last=Date.now();
 v=Math.max(0,Math.min(1,v));const t=this.ctx.currentTime;
 this.o1.frequency.setTargetAtTime(52+v*150,t,.08);
 this.o2.frequency.setTargetAtTime(26+v*75,t,.08);
 this.f.frequency.setTargetAtTime(420+v*2200,t,.1);
 this.g.gain.setTargetAtTime(.06+v*.1,t,.1);
 this.lfo.frequency.setTargetAtTime(11+v*40,t,.1);
},
hit(){
 if(!this.on||!this.ctx)return;const a=this.ctx,t=a.currentTime,o=a.createOscillator(),g=a.createGain();
 o.type='sawtooth';o.frequency.setValueAtTime(180,t);o.frequency.exponentialRampToValueAtTime(30,t+.5);
 g.gain.setValueAtTime(.3,t);g.gain.exponentialRampToValueAtTime(.001,t+.5);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+.55)},
setOn(b){this.on=b;if(this.ctx){this.ctx[b?'resume':'suspend']()}this.ui()},
ui(){const s=$('#sndBtn');s.textContent=this.on?'🔊 ENGINE ON':'🔇 ENGINE OFF';s.setAttribute('aria-pressed',this.on)}};
$('#sndBtn').onclick=()=>E.on?E.setOn(false):E.start();

const ss=$('#startScreen');
setTimeout(()=>ss.classList.add('show'),1800);
function closeStart(){ss.classList.remove('show');ss.classList.add('gone')}
$('#startBtn').onclick=()=>{E.start();ss.classList.add('firing');setTimeout(()=>{closeStart();showToast('Engine started — Night Drive me BOOST dabake RPM suno')},1300)};
$('#skipStart').onclick=closeStart;

const mb=$('#mBtn'),mf=$('#mFlash');
function mMode(on){
 const b=document.body;on=on===undefined?!b.classList.contains('m-mode'):on;
 mf.classList.remove('go');void mf.offsetWidth;mf.classList.add('go');
 document.documentElement.animate([{filter:'hue-rotate(60deg) contrast(1.5) saturate(2)'},{filter:'hue-rotate(-40deg) contrast(1.2)'},{filter:'none'}],{duration:450,easing:'steps(5)'});
 setTimeout(()=>b.classList.toggle('m-mode',on),120);
 mb.setAttribute('aria-pressed',on);
 showToast(on?'M MODE ON — Power of M':'M MODE OFF');
}
mb.onclick=()=>mMode();
addEventListener('keydown',e=>{if(e.key.toLowerCase()=='m'&&!e.ctrlKey&&!e.metaKey&&!/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))mMode()});

const cv=$('#raceCv'),x=cv.getContext('2d'),over=$('#gOver');
const LX=[80,180,280],ENEMY=['#d6202f','#e8c216','#1f8a4c','#8b5cf6','#f4f6f8'];
let st='idle',lane=1,px=180,en=[],sc=0,sp=4,off=0,spawn=0,last=0,vis=false,best=0;
try{best=+localStorage.getItem('bmwRushBest')||0}catch(_){}
$('#rBest').textContent=best;
const acc=()=>document.body.classList.contains('m-mode')?'#e7222e':'#65baff';
function car(cx,cy,c,me){
 x.save();x.shadowColor=c;x.shadowBlur=me?22:8;x.fillStyle=c;x.beginPath();x.roundRect(cx-20,cy-35,40,70,9);x.fill();x.shadowBlur=0;
 x.fillStyle='rgba(5,8,14,.85)';x.beginPath();x.roundRect(cx-14,cy-14,28,20,4);x.fill();
 x.fillStyle=me?'#fff':'#ffd9a0';x.fillRect(cx-16,cy-35,8,4);x.fillRect(cx+8,cy-35,8,4);
 x.fillStyle='#ff2d3d';x.fillRect(cx-16,cy+31,8,4);x.fillRect(cx+8,cy+31,8,4);
 x.restore()}
function begin(){en=[];sc=0;sp=4.5;lane=1;px=180;spawn=60;st='play';over.classList.add('hide')}
function end(){
 st='over';E.hit();
 if(sc>best){best=Math.floor(sc);try{localStorage.setItem('bmwRushBest',best)}catch(_){}}
 $('#rBest').textContent=best;$('#gTitle').textContent='CRASH!';
 $('#gMsg').textContent='SCORE '+Math.floor(sc)+' · BEST '+best;$('#gStart').textContent='RACE AGAIN';over.classList.remove('hide')}
function mv(d){if(st=='play')lane=Math.max(0,Math.min(2,lane+d))}
$('#gStart').addEventListener('click',begin);
addEventListener('keydown',e=>{
 const k=e.key.toLowerCase();
 if(st=='play'&&vis&&(k=='arrowleft'||k=='arrowright'))e.preventDefault();
 if(k=='arrowleft'||k=='a')mv(-1);else if(k=='arrowright'||k=='d')mv(1);
 else if((k=='enter'||k==' ')&&vis&&st!='play'&&!/BUTTON|^A$/.test(e.target.tagName)){e.preventDefault();begin()}
});
cv.addEventListener('pointerdown',e=>{const r=cv.getBoundingClientRect();mv(e.clientX<r.left+r.width/2?-1:1)});
new IntersectionObserver(es=>vis=es[0].isIntersecting,{threshold:.2}).observe(cv);
function frame(t){
 requestAnimationFrame(frame);if(!vis){last=t;return}
 const dt=Math.min((t-last)/16.7||1,3);last=t;
 if(st=='play'){
  sp=Math.min(4.5+sc/180,15);off+=sp*dt;sc+=sp*dt*.06;spawn-=sp*dt;
  if(spawn<=0){const a=Math.floor(Math.random()*3);en.push({l:a,y:-80,c:ENEMY[Math.floor(Math.random()*5)]});
   if(Math.random()<Math.min(.4,sp/35)){const b=(a+1+Math.floor(Math.random()*2))%3;en.push({l:b,y:-80,c:ENEMY[Math.floor(Math.random()*5)]})}
   spawn=Math.max(110,300-sp*12)+Math.random()*90}
  px+=(LX[lane]-px)*Math.min(.22*dt,1);
  for(const c of en){c.y+=sp*dt*.7;if(c.y<535&&c.y+70>465&&Math.abs(LX[c.l]-px)<36){end();break}}
  en=en.filter(c=>{if(c.y>680){sc+=8;return false}return true});
  E.rpm((sp-4.5)/10.5);
 }else off+=1.2*dt;
 const A=acc();
 x.fillStyle='#070a10';x.fillRect(0,0,360,600);
 x.fillStyle='#10161f';x.fillRect(30,0,300,600);
 x.shadowColor=A;x.shadowBlur=14;x.strokeStyle=A;x.lineWidth=3;x.beginPath();x.moveTo(30,0);x.lineTo(30,600);x.moveTo(330,0);x.lineTo(330,600);x.stroke();x.shadowBlur=0;
 x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=3;x.setLineDash([26,22]);x.lineDashOffset=-off;
 x.beginPath();x.moveTo(130,0);x.lineTo(130,600);x.moveTo(230,0);x.lineTo(230,600);x.stroke();x.setLineDash([]);
 for(const c of en)car(LX[c.l],c.y+35,c.c,false);
 car(px,500,A=='#e7222e'?'#fff':'#1675e8',true);
 $('#rScore').textContent=Math.floor(sc);$('#rSpd').textContent=st=='play'?Math.round(60+sp*16):0}
requestAnimationFrame(frame);
})();
