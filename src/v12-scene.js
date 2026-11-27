import * as THREE from 'three';
import {Village12,ZONES,COMMANDS} from './v12-core.js';
const mat=color=>new THREE.MeshStandardMaterial({color,roughness:.86});
const G={
 cube:new THREE.BoxGeometry(1,1,1),sphere:new THREE.SphereGeometry(1,10,8),
 cone:new THREE.ConeGeometry(1,1,5),cylinder:new THREE.CylinderGeometry(1,1,1,9)
};
const COLORS={wood:mat('#9b6d48'),cream:mat('#ffe5b5'),coral:mat('#db8e86'),blue:mat('#6fb9d0'),leaf:mat('#529b76'),gold:mat('#f4d16c'),dark:mat('#3f6172'),white:mat('#f3ead5'),stone:mat('#969fa2'),pink:mat('#efaabf')};
function shape(parent,geometry,material,pos,scale=[1,1,1]){const o=new THREE.Mesh(geometry,material);o.position.set(...pos);o.scale.set(...scale);o.castShadow=true;parent.add(o);return o}
function cube(parent,material,pos,scale){return shape(parent,G.cube,material,pos,scale)}
function orb(parent,material,pos,scale){return shape(parent,G.sphere,material,pos,scale)}
function beam(parent,material,pos,scale){return shape(parent,G.cylinder,material,pos,scale)}
function sign(group,text,x=0,y=2.2,z=0){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const ctx=canvas.getContext('2d');ctx.fillStyle='#294d40';ctx.fillRect(8,8,496,80);ctx.strokeStyle='#ffe6a8';ctx.lineWidth=5;ctx.strokeRect(9,9,494,78);ctx.font='bold 31px sans-serif';ctx.fillStyle='#fff8e4';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,48);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));sprite.position.set(x,y,z);sprite.scale.set(3.25,.62,1);group.add(sprite);return sprite}
function makeMarket(root){const g=new THREE.Group();root.add(g);g.position.set(8.5,0,-9.5);
 cube(g,COLORS.wood,[0,.15,0],[4.5,.25,3.4]);
 const goods=[];for(let i=-1;i<=1;i++){const x=i*1.25;cube(g,COLORS.wood,[x,.72,0],[.97,.82,.9]);cube(g,i===0?COLORS.coral:i<0?COLORS.leaf:COLORS.blue,[x,1.38,0],[1.2,.16,1.05]);for(let j=0;j<3;j++)goods.push(orb(g,[COLORS.gold,COLORS.pink,COLORS.leaf][(i+j+3)%3],[x-.22+j*.22,1.52,.18],[.14,.13,.15]));beam(g,COLORS.wood,[x-.48,2.04,-.5],[.09,1.4,.09]);beam(g,COLORS.wood,[x+.48,2.04,-.5],[.09,1.4,.09]);cube(g,COLORS.cream,[x,2.69,-.5],[1.25,.14,1.25])}
 sign(g,'🧺 CHỢ LÀNG MÈO',0,3.55,0);return {group:g,update:t=>{for(let i=0;i<goods.length;i++)goods[i].position.y=1.52+Math.sin(t*.002+i)*.025}}}
function makeHarbor(root){const g=new THREE.Group();root.add(g);g.position.set(8.1,0,9.7);
 cube(g,COLORS.wood,[0,.17,0],[4,.25,2.7]);for(const x of [-1.7,1.7])for(const z of [-1,1])beam(g,COLORS.wood,[x,-.32,z],[.17,.9,.17]);
 const boat=new THREE.Group();g.add(boat);boat.position.set(.6,.23,1.65);
 const hull=cube(boat,COLORS.wood,[0,.18,0],[2,.42,1.07]);hull.rotation.z=.06;
 beam(boat,COLORS.cream,[0,.95,0],[.075,1.4,.075]);const sail=shape(boat,new THREE.ConeGeometry(.75,1.1,3),COLORS.white,[.1,1.16,.08],[1,.95,.5]);sail.rotation.z=-.12;
 for(let i=-1;i<=1;i++)cube(g,COLORS.cream,[i*1.15,.33,-1.1],[.8,.12,.3]);
 sign(g,'⛵ BẾN THUYỀN',0,3.5,-.5);
 return {group:g,update:t=>{boat.rotation.z=Math.sin(t*.0015)*.038;boat.position.y=.22+Math.sin(t*.003)*.045}}
}
function makeGrove(root){const g=new THREE.Group();root.add(g);g.position.set(-8.8,0,10.3);
 cube(g,COLORS.leaf,[0,-.05,0],[4.2,.22,3.1]);const flowers=[];
 for(let i=0;i<9;i++){const x=(i%3-1)*1.18,z=(Math.floor(i/3)-1)*.95;beam(g,COLORS.wood,[x,.86,z],[.095,1.7,.095]);for(let j=0;j<3;j++){const leaf=shape(g,G.cone,COLORS.leaf,[x,.75+j*.45,z],[.24,.42,.23]);leaf.rotation.y=j*1.2;flowers.push(leaf)}}
 for(let i=0;i<12;i++){const angle=i*2.4,x=Math.sin(angle)*1.8,z=Math.cos(angle)*1.16;beam(g,COLORS.leaf,[x,.28,z],[.035,.46,.035]);flowers.push(orb(g,i%2?COLORS.coral:COLORS.pink,[x,.53,z],[.15,.15,.15]))}
 sign(g,'🎋 ĐỒI HOA & RỪNG TRE',0,3.5,0);return {group:g,update:t=>{for(let i=0;i<flowers.length;i++)flowers[i].rotation.z=Math.sin(t*.0017+i)*.07}}}
const POS={market:[8.5,-9.5],harbor:[8.1,9.7],grove:[-8.8,10.3]};
const pretty={'!an':'🍚 Cho mèo ăn','!vuot':'💗 Vuốt ve mèo','!hat':'🎼 Mèo hát','!nhay':'💃 Mèo nhảy','!chup':'📸 Chụp khoảnh khắc','!tham':'🏡 Thăm nhà mèo'};
export function mountVillage12({world,cats,screen,camera,renderer,announce,burst,username,onPhoto}){
 const panel=document.querySelector('.panel');
 const info=document.createElement('section');info.className='v12-panel';info.innerHTML='<h3>🏗️ V1.2 — Mở rộng làng</h3><p id="v12-next"></p><div class="v12-zone-list" id="v12-zones"></div><h3>💬 Lệnh chat miễn phí</h3><div class="v12-command-grid" id="v12-cmd"></div><button id="v12-test-next">🧪 Mở khu kế tiếp (chỉ thử nghiệm)</button><button id="v12-photo-save">📸 Lưu ảnh kỷ niệm</button><p class="v12-hint">Mục tiêu tính cộng dồn trong trình duyệt đang phát LIVE. Mèo con là NPC, không thay thế 20 mèo chính.</p>';
 panel.appendChild(info);
 const hud=screen.querySelector('.hud'),hudLine=document.createElement('div');hudLine.className='v12-hud';hudLine.textContent='🏗️ Đang mở khu mới…';hud.appendChild(hudLine);
 const sticker=document.createElement('div');sticker.className='v12-notice';screen.appendChild(sticker);
 const photoFrame=document.createElement('div');photoFrame.className='v12-photo-frame';photoFrame.textContent='📸 Kỷ NIỆM LÀNG MÈO';screen.appendChild(photoFrame);
 let photoBy='',photoUntil=0,focusUntil=0,focusPoint=null,animation=null,noticeUntil=0,lastUi=0,latestPhoto=null;
 const zones={market:makeMarket(world),harbor:makeHarbor(world),grove:makeGrove(world)};
 const workers=[{id:4,job:'🎣 Thợ câu'},{id:7,job:'🥐 Thợ làm bánh'},{id:9,job:'🧵 Thợ may'},{id:12,job:'🎼 Nhạc công'}];
 // Existing resident cats change outfits/tools, no changes to cats[] length.
 const jobProps=[];
 for(const {id,job} of workers){const cat=cats[id];if(!cat)continue;const g=new THREE.Group();world.add(g);
 if(id===4){beam(g,COLORS.wood,[.3,.65,.15],[.04,1.3,.04]);orb(g,COLORS.blue,[.3,.03,.2],[.10,.11,.10])}
 if(id===7){const tray=cube(g,COLORS.wood,[0,.32,.35],[.64,.1,.44]);for(let j=0;j<3;j++)orb(g,COLORS.gold,[(j-1)*.2,.44,.36],[.13,.11,.12])}
 if(id===9){cube(g,COLORS.cream,[.25,.42,.35],[.48,.4,.08]);beam(g,COLORS.wood,[-.2,.34,.3],[.035,.5,.035])}
 if(id===12){const lute=orb(g,COLORS.wood,[.06,.52,.45],[.27,.33,.1]);beam(g,COLORS.gold,[.08,.9,.45],[.04,.58,.04])}
 jobProps.push({id,g,job});}
 const kitten=new THREE.Group();world.add(kitten);orb(kitten,COLORS.cream,[0,.29,0],[.25,.22,.29]);orb(kitten,COLORS.cream,[0,.59,.13],[.23,.25,.24]);for(const x of [-.16,.16])shape(kitten,G.cone,COLORS.coral,[x,.83,.16],[.12,.24,.12]);kitten.position.set(-.9,.06,.9);
 function notice(message){sticker.textContent=message;sticker.classList.add('show');noticeUntil=performance.now()+4400;announce(message)}
 const model=new Village12({storage:window.localStorage,onEffect:e=>{
  if(e.type==='unlock'){zones[e.zone.id].group.visible=true;const lead=e.leaders.length?e.leaders.join(', '):'cả làng';notice('🎉 MỞ '+e.zone.name.toUpperCase()+'! Cảm ơn: '+lead);burst(...POS[e.zone.id],'🎊',28);focusPoint=POS[e.zone.id];focusUntil=performance.now()+4000}
  if(e.type==='command'){const cmd=e.command,cat=cats[cmd==='!hat'?12:cmd==='!an'?7:cmd==='!tham'?14:cmd==='!nhay'?11:4];animation={cmd,cat,at:performance.now(),name:e.user};
    notice(pretty[cmd]+' — '+e.user);
    const x=cat?.group?.position.x||0,z=cat?.group?.position.z||0;
    burst(x,z,cmd==='!hat'?'🎵':cmd==='!an'?'🍞':cmd==='!vuot'?'💗':cmd==='!nhay'?'✨':cmd==='!chup'?'📷':'🏠',8);
    if(cmd==='!chup'){photoBy=e.user;photoUntil=performance.now()+4500;photoFrame.textContent='📸 Kỷ NIỆM LÀNG MÈO · '+e.user}
    focusPoint=cmd==='!tham'?[-6.8,-7]:[x,z];focusUntil=performance.now()+3000;
  }}});
 for(const id of Object.keys(zones))zones[id].group.visible=model.data.unlocks.includes(id);
 // Every area starts as a visible invitation even while locked, keeping unlock meaningful.
 const billboards=[];
 for(const zone of ZONES){const [x,z]=POS[zone.id];const group=new THREE.Group();group.position.set(x,.1,z);world.add(group);const pole=beam(group,COLORS.wood,[0,.5,0],[.08,1,.08]);const board=cube(group,COLORS.dark,[0,1,0],[1.8,.64,.15]);billboards.push({id:zone.id,group});}
 const buttonArea=info.querySelector('#v12-cmd');
 for(const cmd of COMMANDS){const btn=document.createElement('button');btn.textContent=pretty[cmd];btn.onclick=()=>window.handleTikTokEvent('chat',username(),cmd);buttonArea.appendChild(btn)}
 info.querySelector('#v12-test-next').onclick=()=>{const next=model.snapshot().next;if(next)model.contribute('Kiểm thử V1.2',Math.max(1,next.threshold-model.snapshot().progress));else notice('✅ Đã mở tất cả khu mới');syncUi()};
 info.querySelector('#v12-photo-save').onclick=()=>{
   // User-triggered local export only. WebGL screenshot is taken immediately after an explicit render.
   try{renderer.render(world.parent,camera);const source=renderer.domElement;
    const cv=document.createElement('canvas');cv.width=source.width;cv.height=source.height;const ctx=cv.getContext('2d');ctx.drawImage(source,0,0);
    ctx.fillStyle='#203f3aba';ctx.fillRect(0,cv.height-90,cv.width,90);ctx.fillStyle='#fff7d9';ctx.font='bold '+Math.max(20,cv.width/22)+'px sans-serif';ctx.fillText('🐾 Làng Mèo · '+(photoBy||username()),25,cv.height-32);
    const a=document.createElement('a');a.download='lang-meo-ky-niem.png';a.href=cv.toDataURL('image/png');a.click();latestPhoto=a.href;
   }catch{notice('📸 Trình duyệt chưa cho phép lưu ảnh.')}
 };
 function syncUi(){const snap=model.snapshot();info.querySelector('#v12-next').textContent=snap.next?'🎯 '+snap.next.name+': '+Math.floor(snap.progress)+'/'+snap.next.threshold+' điểm':'🎉 Đã mở cả 3 khu mới!';
  const list=info.querySelector('#v12-zones');list.replaceChildren();for(const zone of ZONES){const p=document.createElement('div');p.textContent=(snap.unlocks.includes(zone.id)?'✅ ':'🔒 ')+zone.icon+' '+zone.name+' ('+zone.threshold+'đ)';list.appendChild(p)}
  hudLine.textContent=snap.next?'🏗️ Tiếp theo: '+snap.next.icon+' '+snap.next.name+' '+Math.floor(snap.progress)+'/'+snap.next.threshold:'🏗️ Đã mở 3 khu! 🧺 ⛵ 🎋';
 }
 syncUi();
 function handle(type,user,payload){model.event(type,user,payload);syncUi()}
 function render(time,dt){for(const [key,obj] of Object.entries(zones))if(obj.group.visible)obj.update(time);
  for(const {id,g} of jobProps){const cat=cats[id];g.position.set(cat.group.position.x,.08,cat.group.position.z);g.rotation.y=cat.group.rotation.y;g.rotation.z=Math.sin(time*.005+id)*.035}
  kitten.position.set(-1.0+Math.sin(time*.0009)*.65,.04+Math.max(0,Math.sin(time*.009))*.055,1+Math.cos(time*.001)*.7);kitten.rotation.y=time*.0008;
  for(const b of billboards)b.group.visible=!model.data.unlocks.includes(b.id);
  if(animation){const passed=time-animation.at;if(passed>2000)animation=null;else if(animation.cat){const g=animation.cat.group;const pulse=Math.sin(passed*.025);
    if(animation.cmd==='!nhay')g.position.y=Math.max(0,pulse)*.27;
    if(animation.cmd==='!hat')g.rotation.z=pulse*.15;
    if(animation.cmd==='!vuot')g.rotation.z=pulse*.09;
    if(animation.cmd==='!an')g.scale.y=.9+.08*pulse;
  }}
  // v11's camera currently has its own follow/restore; keep this zoom subtle to avoid control conflict.
  if(focusPoint&&time<focusUntil){camera.zoom=Math.min(1.24,Math.max(camera.zoom,1.1));camera.position.x+=(21+focusPoint[0]*.38-camera.position.x)*Math.min(1,dt*3);camera.position.z+=(29+focusPoint[1]*.38-camera.position.z)*Math.min(1,dt*3);camera.lookAt(camera.position.x-21,0,camera.position.z-29);camera.updateProjectionMatrix()}
  photoFrame.classList.toggle('show',time<photoUntil);
  if(time>noticeUntil)sticker.classList.remove('show');
  if(time-lastUi>1000){syncUi();lastUi=time}
 }
 return {model,handle,render,catsCount:cats.length};
}
