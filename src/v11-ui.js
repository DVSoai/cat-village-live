import * as THREE from 'three';
import {Village11,RACE_DURATION_MS} from './village11.js';
const html=(tag,className,text,parent)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!=null)el.textContent=text;parent.appendChild(el);return el};
const safe=(s)=>String(s||'').replace(/[<>]/g,'').slice(0,35);
const fmt=(ms)=>{const s=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
export function mountV11({scene,world,camera,screen,cats,announce,burst,username,baselineState}){
 const jar=document.createElement('div');jar.className='v11-jar';jar.innerHTML='<div class="v11-jarhead"><span id="v11-objective">🌉 Xây cầu gỗ</span><span id="v11-count">0/1000</span></div><div class="v11-progress"><div id="v11-fill"></div></div><small id="v11-next-like">❤️ Còn 1.000 tim đến mưa cá</small>';screen.querySelector('.hud').appendChild(jar);
 const toast=html('div','v11-toast','',screen);toast.setAttribute('aria-live','polite');
 const guestLayer=html('div','v11-guest-layer','',screen);
 const panel=document.querySelector('.panel');
 const heading=html('h3','v11-title','🏆 TOP 10 NGƯỜI GÓP SỨC',panel);
 const leaderboard=html('ol','v11-leaderboard','',panel);
 const raceBar=html('div','v11-race','',screen);raceBar.textContent='🏁 Đua mèo sau 15:00';
 const buttons=html('div','v11-buttons','',panel);
 const chooseRow=html('div','v11-choose','',buttons);html('p','','Chọn mèo đua (bình luận !chon 1–6)',chooseRow);
 for(let i=1;i<=6;i++){const button=html('button','v11-choice',String(i),chooseRow);button.title='Chọn mèo số '+i;button.onclick=()=>window.handleTikTokEvent('chat',username(),'!chon '+i)}
 const follow=html('button','','➕ Giả lập follow',buttons);follow.onclick=()=>window.handleTikTokEvent('follow',username());
 const extra=html('button','','✨ Thử Mèo Vàng hiếm',buttons);extra.onclick=()=>village.golden('test');
 const raceButton=html('button','','🏁 Bắt đầu đua ngay (test)',buttons);raceButton.onclick=()=>village.startRace();
 const liveInfo=html('p','v11-small','Chế độ giả lập: cuộc đua mỗi 15 phút, Mèo Vàng khoảng 20–30 phút, khách ở lại 60 giây.',buttons);
 const material=new THREE.MeshStandardMaterial({color:'#ffd44d',roughness:.7});
 const golden=new THREE.Group();golden.visible=false;world.add(golden);
 const body=new THREE.Mesh(new THREE.SphereGeometry(.35,12,9),material);body.position.y=.42;body.scale.z=1.35;golden.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.35,12,9),material);head.position.set(0,.84,.2);golden.add(head);
 for(const s of [-1,1]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.16,.28,4),material);ear.position.set(s*.22,1.16,.22);golden.add(ear)}
 golden.position.set(0,0,0);
 const guestMeshes=new Map();
 function guestMesh(){const g=new THREE.Group();const m=new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(.55+Math.random()*.16,.35,.65)});
 const b=new THREE.Mesh(new THREE.SphereGeometry(.24,9,7),m);b.position.y=.28;g.add(b);const h=new THREE.Mesh(new THREE.SphereGeometry(.25,9,7),m);h.position.set(0,.59,.12);g.add(h);for(const s of [-1,1]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.1,.21,4),m);ear.position.set(s*.17,.84,.12);g.add(ear)}world.add(g);return g}
 let focusUntil=0,focusX=0,focusZ=0,notificationUntil=0,lastUi=0,oldGuestCount=0;
 function focus(x,z){focusUntil=performance.now()+4200;focusX=x;focusZ=z}
 function notify(s){toast.textContent=s;toast.classList.add('v11-visible');notificationUntil=performance.now()+4200;announce(s)}
 const village=new Village11({storage:window.localStorage,onEffect:e=>{
  if(e.type==='golden'){notify('🌟 MÈO VÀNG XUẤT HIỆN! CẢ LÀNG ƠI!');burst(0,0,'✨',22);focus(0,0)}
  if(e.type==='jar_complete'){notify('🎉 HOÀN THÀNH '+e.objective+'! Cảm ơn: '+(e.contributors.join(', ')||'cả làng'));burst(0,0,'🎊',25);focus(0,0)}
  if(e.type==='like_milestone'){notify('🐟 MƯA CÁ! Đạt '+e.likes+' lượt tim!');burst(-6,5,'🐟',30);focus(-6,5)}
  if(e.type==='tribute'){notify('🎁 Cảm ơn '+safe(e.name)+'!');focus(e.type==='rose'?-6:0,e.type==='rose'?5:0);if('speechSynthesis' in window&&window.speechSynthesis&&window.speechSynthesis.speaking===false){const utter=new SpeechSynthesisUtterance('Cảm ơn '+safe(e.name)+' đã ủng hộ làng mèo!');utter.lang='vi-VN';utter.rate=1.05;try{window.speechSynthesis.speak(utter)}catch{}}}
  if(e.type==='race_start'){notify('🏁 6 chú mèo bắt đầu cuộc đua!');focus(0,0)}
  if(e.type==='race_end'){notify('🏆 Mèo số '+e.winner+' chiến thắng! '+(e.winners.join(', ')||'Cả làng')+' cổ vũ!');focus(0,0)}
  if(e.type==='guest_join')notify('🐱 '+safe(e.guest.name)+' đến quảng trường!') }});
 const projection=new THREE.Vector3();
 const overlayLabels=new Map();
 function renderGuest(g,guest,now){const age=(now-guest.created)/1000;g.position.set(Math.sin(age*.6+guest.created)*1.6,0,Math.cos(age*.47+guest.created)*1.4);g.rotation.y=Math.sin(age*.6);let label=overlayLabels.get(guest.key);if(!label){label=html('div','v11-guest-name','',guestLayer);overlayLabels.set(guest.key,label);if(guest.avatar){const image=html('img','',null,label);image.src=guest.avatar;image.referrerPolicy='no-referrer';image.onerror=()=>image.remove()}html('span','',safe(guest.name),label)}projection.set(g.position.x,1.05,g.position.z).project(camera);label.style.left=((projection.x+1)*50)+'%';label.style.top=((1-projection.y)*50)+'%';label.style.display=projection.z>1?'none':'flex'}
 function updateUi(now){const snap=village.snapshot();document.getElementById('v11-objective').textContent=snap.objective.icon+' '+snap.objective.label;document.getElementById('v11-count').textContent=Math.floor(snap.jar)+'/'+snap.jarTarget;document.getElementById('v11-fill').style.width=Math.min(100,snap.jar/snap.jarTarget*100)+'%';document.getElementById('v11-next-like').textContent='❤️ Còn '+snap.nextLike.toLocaleString('vi-VN')+' tim đến mưa cá';raceBar.textContent=snap.race?.phase==='running'?'🏁 ĐANG ĐUA! '+fmt(snap.race.finishAt-Date.now()):snap.race?.phase==='finished'?'🏆 Mèo #'+snap.race.winner+' vừa chiến thắng!':'🏁 Đua mèo sau '+fmt(snap.nextRaceIn);
 leaderboard.replaceChildren();for(const [i,user] of snap.top.entries()){const li=html('li','',null,leaderboard);const title=user.titles?.[0]?' · '+user.titles[0]:'';li.textContent=(i+1)+'. '+safe(user.name)+' — '+user.points+'đ'+title;}if(!snap.top.length)html('li','','Chưa có đóng góp',leaderboard);if(now>notificationUntil)toast.classList.remove('v11-visible')}
 function render(now,dt){village.tick();const snap=village.snapshot();golden.visible=snap.goldenActive;if(golden.visible){golden.position.set(Math.sin(now*.001)*1.2,Math.abs(Math.sin(now*.006))*.16,Math.cos(now*.001)*1.2);golden.rotation.y+=dt*1.5;for(const c of cats)if(c.job==='wander'||c.job==='play'){c.target.set(golden.position.x,0,golden.position.z)}}
 const keys=new Set(snap.guests.map(g=>g.key));for(const [key,group] of guestMeshes)if(!keys.has(key)){world.remove(group);guestMeshes.delete(key);overlayLabels.get(key)?.remove();overlayLabels.delete(key)}
 for(const guest of snap.guests){if(!guestMeshes.has(guest.key))guestMeshes.set(guest.key,guestMesh());renderGuest(guestMeshes.get(guest.key),guest,now)}
 const foc=now<focusUntil;const tx=foc?focusX:0,tz=foc?focusZ:0;const desired=foc?1.28:1;camera.position.x=THREE.MathUtils.lerp(camera.position.x,21+tx,Math.min(1,dt*2.3));camera.position.z=THREE.MathUtils.lerp(camera.position.z,29+tz,Math.min(1,dt*2.3));camera.lookAt(camera.position.x-21,0,camera.position.z-29);camera.zoom=THREE.MathUtils.lerp(camera.zoom,desired,Math.min(1,dt*2.3));camera.updateProjectionMatrix();
 if(now-lastUi>550){updateUi(now);lastUi=now}}
 function raceMove(cat,now){const index=cats.indexOf(cat),r=village.data.race;if(index<0||index>=6||r?.phase!=='running')return false;const t=Math.min(1,(Date.now()-r.startedAt)/RACE_DURATION_MS),boost=(r.boost[index]||0)/250;const ang=2*Math.PI*(t*(1+boost)+index/6);cat.group.position.set(2.3*Math.sin(ang),.05+Math.abs(Math.sin(now*.013+index))*.1,2.3*Math.cos(ang));cat.group.rotation.y=ang+Math.PI/2;return true}
 function handle(type,user,data){let payload=data;if(type==='gift_rose'&&data==null)payload=1;if(type==='chat'&&typeof data==='string')payload={text:data};if(type==='like'&&typeof data!=='number')payload=1;village.event(type,user,payload)}
 return {render,raceMove,handle,village};
}
