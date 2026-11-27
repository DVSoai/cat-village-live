
import * as THREE from 'three';
import './style.css';
import { connectLive } from './live.js';
import { mountV11 } from './v11-ui.js';
let v11Render=()=>{},v11RaceMove=()=>false;
const app=document.getElementById('app');
app.innerHTML='<div class="layout"><div class="screen" id="screen"><div class="hud"><div class="top"><div class="logo"><strong>🐾 LÀNG MÈO</strong><small>COZY LIVE VILLAGE</small></div><div class="counter" id="clock"></div></div><div class="bottom"><div class="event" id="event">🌻 Chào mừng đến Làng Mèo Online!</div><div class="tagline">💬 Bình luận • ❤️ Thả tim • 🌹 Tặng hoa để giúp làng</div></div></div></div><aside class="panel"><h2>🐱 Trạm điều khiển</h2><p>Bản demo mô phỏng sự kiện TikTok LIVE. Panel này không nằm trong khung phát sóng.</p><input id="username" placeholder="Tên người xem" value="KhachGheTham"/><button id="chat">💬 Bình luận chào làng</button><button id="like">❤️ Thả 100 tim</button><button class="rose" id="rose">🌹 Tặng hoa hồng</button><button class="gold" id="food">🐟 Tặng giỏ cá</button><button class="special" id="super">🎉 Tặng quà lớn: Lễ hội</button><button id="day">🌙 Chuyển ngày / đêm</button><div class="stats"><div class="stat"><b id="flowers">0</b><small>Hoa cộng đồng</small></div><div class="stat"><b id="hearts">0</b><small>Lượt tim</small></div><div class="stat"><b id="fish">0</b><small>Cá dự trữ</small></div><div class="stat"><b id="visits">0</b><small>Khách ghé thăm</small></div></div><div class="hint"><strong>TikFinity WebSocket</strong><input id="liveUrl" value="ws://localhost:21213/" aria-label="WebSocket URL"/><button id="liveConnect">Kết nối LIVE</button><p id="liveStatus" role="status">Chưa kết nối</p>Tích hợp qua <code>window.handleTikTokEvent(type,username,data)</code>. Tiến độ lưu trong trình duyệt.</div></aside></div>';
const screen=document.getElementById('screen');
let saved={};try{saved=JSON.parse(localStorage.getItem('catVillageV1')||'{}')}catch{}
const state={flowers:saved.flowers||0,hearts:saved.hearts||0,fish:saved.fish||0,visits:saved.visits||0,visitors:saved.visitors||{},clock:saved.clock??.28,night:!!saved.night};
const persist=()=>localStorage.setItem('catVillageV1',JSON.stringify(state));
const hud=()=>{for(const k of ['flowers','hearts','fish','visits'])document.getElementById(k).textContent=state[k]};hud();
const scene=new THREE.Scene();scene.background=new THREE.Color('#c9e7eb');scene.fog=new THREE.Fog('#c9e7eb',27,55);
const camera=new THREE.OrthographicCamera(-9.2,9.2,16.36,-16.36,.1,120);camera.position.set(21,29,29);camera.lookAt(0,0,0);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;screen.insertBefore(renderer.domElement,screen.firstChild);
const hemi=new THREE.HemisphereLight(0xeaffec,0x789278,2.35);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffecb0,3);sun.position.set(-9,19,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-23;sun.shadow.camera.right=23;sun.shadow.camera.top=23;sun.shadow.camera.bottom=-23;sun.shadow.normalBias=.03;scene.add(sun);
const world=new THREE.Group();scene.add(world);
const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:1});
const M={grass:mat('#96bf79'),soil:mat('#936a4b'),path:mat('#ead9a7'),wood:mat('#a87650'),water:new THREE.MeshStandardMaterial({color:'#70c5d3',transparent:true,opacity:.82,roughness:.17,metalness:.1})};
function mesh(g,m,x,y,z,parent=world){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function box(x,y,z,w,h,d,m,parent){return mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent)}
function ball(x,y,z,r,m,parent){return mesh(new THREE.SphereGeometry(r,12,9),m,x,y,z,parent)}
function cone(x,y,z,r,h,m,parent){return mesh(new THREE.ConeGeometry(r,h,4),m,x,y,z,parent)}
function cyl(x,y,z,r,h,m,parent){return mesh(new THREE.CylinderGeometry(r,r,h,10),m,x,y,z,parent)}
box(0,-.32,0,24,.65,26,M.grass);box(0,-.59,0,25,.22,27,mat('#6b9360'));
box(0,.025,0,1.12,.055,23,M.path);box(0,.025,0,22,.055,1.2,M.path);box(-6,.03,-5,1,.07,13,M.path);
const pond=mesh(new THREE.CylinderGeometry(3.15,3.2,.11,44),M.water,6.7,.07,6);pond.scale.z=.76;
for(let i=0;i<14;i++){const a=i/14*Math.PI*2;ball(6.7+Math.cos(a)*3.28,.16,6+Math.sin(a)*2.52,.19,mat(i%2?'#86b979':'#9cb67f'))}
for(let i=0;i<5;i++)box(3.2+i*.47,.2,5,.39,.15,2.3,M.wood);
for(let x=0;x<4;x++)for(let z=0;z<4;z++){const xx=-9.2+x*1.65,zz=4+z*1.55;box(xx,.06,zz,1.35,.1,1.27,M.soil);cyl(xx,.24,zz,.075,.36,mat('#4d994a'));ball(xx,.49,zz,.23,mat(['#e9a46b','#d47067','#ebcb6a','#a7cd7e'][(x+z)%4]))}
function house(x,z,w,d,color,roof){box(x,.95,z,w,1.9,d,mat(color));const r=cone(x,2.35,z,w*.82,1.45,mat(roof));r.rotation.y=Math.PI/4;box(x,.53,z+d/2+.02,.64,1,.08,M.wood);for(const s of [-1,1])box(x+s*.66,1.38,z+d/2+.035,.45,.42,.08,mat('#f5e4b7'))}
house(-6.8,-7,2.5,2.35,'#f4d0a4','#c88076');house(-3.2,-8.5,2.7,2.5,'#dfc6a7','#8eafac');house(5,-8,3.2,2.6,'#eac3b0','#c6746e');house(8,-3,2.4,2.1,'#eccdb2','#b4a1b1');
cyl(3.2,.45,-1.2,.72,.9,mat('#bbb9a7'));cyl(3.2,.8,-1.2,.54,.08,M.water);box(3.2,1.55,-1.2,1.8,.15,1.5,mat('#d58c6b'));for(const s of [-1,1])box(3.2+s*.72,1,-1.2,.1,1.5,.1,M.wood);
for(let i=0;i<3;i++){const x=4+i*1.15,z=-4.3;box(x,.43,z,.86,.82,.8,M.wood);box(x,.92,z,.98,.2,.95,mat(['#e0a5a0','#f0d59b','#95b6a9'][i]))}
const trees=[[-10,-10],[-8,-3],[-10,0],[-2,-3],[1,-9],[9,0],[10,9],[-10,10],[1,10],[10,-9],[-8,-11],[2,-11]];
for(let i=0;i<trees.length;i++){const [x,z]=trees[i];cyl(x,.65,z,.2,1.3,M.wood);ball(x,1.75,z,.95,mat(i%4===0?'#82b18a':'#6b9f68'));ball(x+.44,1.5,z+.28,.7,mat('#75ad74'))}
const flowerColors=['#ffe2ed','#f7bd7e','#fff4ad','#f8a6c2','#eee4ff'];
function flower(x,z,i=0){const g=new THREE.Group();g.position.set(x,.06,z);world.add(g);cyl(0,.16,0,.025,.34,mat('#4b9148'),g);for(let j=0;j<5;j++){const a=j*Math.PI*2/5;ball(Math.cos(a)*.13,.36,Math.sin(a)*.13,.115,mat(flowerColors[i%5]),g)}ball(0,.36,0,.085,mat('#ffd46b'),g)}
for(let i=0;i<35;i++){const x=(Math.sin(i*17.1)*.5+.5)*20-10,z=(Math.sin(i*8.1+1)*.5+.5)*23-11.5;if(Math.abs(x)>1.3&&!(x>3&&z>3)&&!(x<-3&&z>3))flower(x,z,i)}
for(let i=0;i<Math.min(state.flowers,100);i++)flower(-1.9+(i%10)*.33,7.2+Math.floor(i/10)*.36,i);
const cats=[],palette=['#efb270','#e0ddcf','#7e7c7e','#d78b82','#aa977f','#eec5a5','#9f9aa4'];
const jobs=['farm','farm','farm','farm','fish','fish','fish','kitchen','kitchen','kitchen','play','play','play','play','rest','rest','build','build','wander','wander'];
const zones={farm:[-6.8,6.3,2.7,2.8],fish:[6.6,6.8,2.3,1.7],kitchen:[-3.1,-6.1,2.5,2],play:[3.1,1.1,3.3,2.7],rest:[-6.4,-7,2,1.5],build:[4.5,-6,2,2],wander:[0,0,8,9]};
for(let i=0;i<20;i++){const group=new THREE.Group();world.add(group);const tint=mat(palette[i%7]),inner=mat('#efb2ae'),eyes=mat('#263f34');
ball(0,.34,0,.35,tint,group).scale.set(1,.83,1.2);ball(0,.76,.2,.34,tint,group);
for(const s of [-1,1]){const ear=cone(s*.23,1.09,.19,.16,.3,tint,group);ear.rotation.z=-s*.2;ball(s*.14,.79,.49,.045,eyes,group)}
ball(0,.67,.53,.072,inner,group);
for(const s of [-1,1])for(const front of [-1,1])ball(s*.24,.12,front*.18,.12,tint,group);
const tail=cyl(0,.48,-.44,.085,.56,tint,group);tail.rotation.x=.72;
const job=jobs[i],zone=zones[job];group.position.set(zone[0]+(Math.random()-.5)*zone[2],0,zone[1]+(Math.random()-.5)*zone[3]);
cats.push({group,job,zone,target:new THREE.Vector3(zone[0],0,zone[1]),speed:.55+Math.random()*.35,phase:Math.random()*Math.PI*2,waiting:Math.random()*5})}
const particles=[],vector=new THREE.Vector3();
function burst(x,z,symbol,count=8){for(let i=0;i<count;i++){const div=document.createElement('div');div.textContent=symbol;div.style.cssText='position:absolute;left:50%;top:50%;z-index:8;pointer-events:none;font-size:24px;text-shadow:0 2px 4px #0007;';screen.appendChild(div);particles.push({div,x:x+(Math.random()-.5)*3,z:z+(Math.random()-.5)*3,y:1,life:2+Math.random(),drift:(Math.random()-.5)*.7})}}
let eventTimer,festivalUntil=0;function announce(msg){const el=document.getElementById('event');el.textContent=msg;el.style.opacity=1;clearTimeout(eventTimer);eventTimer=setTimeout(()=>el.style.opacity=.48,5500)}
window.handleTikTokEvent=function(type,username='Khách',data=''){username=String(username||'Khách').replace(/[<>]/g,'').slice(0,28);switch(type){
case 'chat':if(!Object.hasOwn(state.visitors,username)){state.visitors[username]=1;state.visits++;announce('🐱 Chào mừng '+username+' ghé thăm làng!');burst(0,0,'👋',5)}else announce('💬 '+username+': '+String(data||'Meo meo!').slice(0,100));break;
case 'like':{const count=typeof data==='number'?Math.max(1,Math.min(data,1000)):1;state.hearts+=count;announce('❤️ '+username+' giúp vườn cây tươi tốt!');burst(-6,6,'💧',Math.min(18,Math.ceil(count/8)));break}
case 'gift_rose':state.flowers++;if(state.flowers<=100)flower(-1.9+((state.flowers-1)%10)*.33,7.2+Math.floor((state.flowers-1)/10)*.36,state.flowers);announce('🌹 '+username+' trồng một bông hoa cho làng!');burst(0,5,'🌸',10);break;
case 'gift_food':case 'gift_tractor':state.fish+=10;announce('🐟 '+username+' mang 10 con cá đến cho đàn mèo!');burst(0,0,'🐟',12);for(const c of cats)if(c.job==='kitchen'||c.job==='rest')c.waiting=0;break;
case 'gift_super':announce('🎉 Lễ hội toàn làng! Cảm ơn '+username+'!');burst(0,0,'🎊',30);festivalUntil=performance.now()+9500;break;
default:announce('✨ '+username+' tương tác: '+type)}
hud();persist()};
let stopLive=null;
const liveStatus=document.getElementById('liveStatus'),liveButton=document.getElementById('liveConnect');
const statusLabels={connecting:'Đang kết nối…',connected:'Đã kết nối',error:'Lỗi kết nối',disconnected:'Mất kết nối — đang thử lại',stopped:'Đã ngắt'};
liveButton.onclick=()=>{
 if(stopLive){stopLive();stopLive=null;liveButton.textContent='Kết nối LIVE';return}
 const url=document.getElementById('liveUrl').value.trim();
 try{const parsed=new URL(url);if(!['ws:','wss:'].includes(parsed.protocol))throw Error()}catch{liveStatus.textContent='URL WebSocket không hợp lệ';return}
 stopLive=connectLive({url,onStatus:s=>liveStatus.textContent=statusLabels[s]||s,onEvent:e=>{
 const count=e.type.startsWith('gift_')?Math.min(100,e.data||1):1;
 for(let i=0;i<count;i++)window.handleTikTokEvent(e.type,e.user,e.data);
 }});
 liveButton.textContent='Ngắt kết nối';
};
const who=()=>document.getElementById('username').value||'Khách';
for(const [id,type,data] of [['chat','chat','Xin chào Làng Mèo!'],['like','like',100],['rose','gift_rose',null],['food','gift_food',null],['super','gift_super',null]])document.getElementById(id).onclick=()=>window.handleTikTokEvent(type,who(),data);
document.getElementById('day').onclick=()=>{state.night=!state.night;persist()};
function resize(){const w=screen.clientWidth,h=screen.clientHeight;renderer.setSize(w,h,false);const aspect=w/h;camera.left=-16.36*aspect;camera.right=16.36*aspect;camera.updateProjectionMatrix()}window.addEventListener('resize',resize);resize();
let last=performance.now(),elapsed=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;elapsed+=dt;state.clock=(state.clock+dt/(30*60))%1;const hour=Math.floor(state.clock*24),minute=Math.floor(state.clock*1440)%60,night=state.night||hour>=19||hour<6;
sun.intensity=THREE.MathUtils.lerp(sun.intensity,night?.55:3,dt*2);hemi.intensity=THREE.MathUtils.lerp(hemi.intensity,night?.9:2.35,dt*2);scene.background.set(night?'#3b5667':'#c9e7eb');scene.fog.color.set(night?'#3b5667':'#c9e7eb');
document.getElementById('clock').innerHTML=(night?'🌙':'☀️')+' '+String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0')+'<br>🐱 20 cư dân';
for(const c of cats){if(v11RaceMove(c,now))continue;c.waiting-=dt;if(c.waiting<=0){const v=c.target.clone().sub(c.group.position);v.y=0;if(v.length()<.22){c.target.set(c.zone[0]+(Math.random()-.5)*c.zone[2]*2,0,c.zone[1]+(Math.random()-.5)*c.zone[3]*2);c.waiting=.8+Math.random()*3}else{v.normalize();c.group.position.addScaledVector(v,dt*c.speed*(night?.45:1));c.group.rotation.y=Math.atan2(v.x,v.z);c.group.position.y=Math.sin(elapsed*12+c.phase)*.035}}else c.group.position.y=Math.sin(elapsed*2+c.phase)*.015;if(now<festivalUntil)c.group.position.y+=Math.max(0,Math.sin(elapsed*8+c.phase))*.13}
for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.y+=dt*.8;p.x+=p.drift*dt;vector.set(p.x,p.y,p.z).project(camera);p.div.style.left=((vector.x+1)/2*screen.clientWidth)+'px';p.div.style.top=((-vector.y+1)/2*screen.clientHeight)+'px';p.div.style.opacity=Math.min(1,p.life);if(p.life<=0){p.div.remove();particles.splice(i,1)}}
v11Render(now,dt);renderer.render(scene,camera)}requestAnimationFrame(frame);setInterval(persist,12000);
const village11=mountV11({scene,world,camera,screen,cats,announce,burst,username:who,baselineState:state});
v11Render=village11.render;v11RaceMove=village11.raceMove;
const originalHandler=window.handleTikTokEvent;
window.handleTikTokEvent=(type,name='Khách',data='')=>{originalHandler(type,name,data);village11.handle(type,name,data)};
window.__catVillage11=village11.village;

