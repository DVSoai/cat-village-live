import {Retention,CAT_NAMES,CAT_PERSONALITIES} from './retention.js';
const fmt=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const safe=s=>String(s||'').replace(/[<>]/g,'').slice(0,28);
export function mountRetention({screen,cats,announce,burst,village11,onSceneEvent=()=>{}}){
 const hud=screen.querySelector('.hud'),element=document.createElement('div');element.className='retention-hud';
 element.innerHTML='<div class="ret-goal"><span id="ret-goal">🌾 Thu hoạch 0/20 rau → mở hội</span><div class="ret-gbar"><div id="ret-gfill"></div></div></div><div class="ret-timers"><span id="ret-micro">🐟 01:30</span><span id="ret-major">🎪 05:00</span><span id="ret-milestone">🏡 30:00</span></div><div class="ret-stats"><div class="ret-stat">🍚 <span>Đói</span><div class="ret-track"><i id="ret-hunger"></i></div><b id="ret-hn">78%</b></div><div class="ret-stat">😺 <span>Vui</span><div class="ret-track"><i id="ret-joy"></i></div><b id="ret-jn">82%</b></div><div class="ret-stat">🛡️ <span>An toàn</span><div class="ret-track"><i id="ret-safety"></i></div><b id="ret-sn">80%</b></div></div><div class="ret-top"><strong>🏆 TOP 3</strong><span id="ret-top3">Chưa có người góp sức</span></div><div class="ret-call">💬 Chat để mèo chào · ❤️ Tim giúp làng · !choan / !baove / !cam / !xanh</div>';
 hud.appendChild(element);
 const panel=document.querySelector('.panel'),extra=document.createElement('div');extra.className='ret-panel';
 extra.innerHTML='<h3>🌾 Nhiệm vụ hôm nay</h3><div id="ret-missions">💬 0/20 tương tác · ❤️ 0/100 tim · 🛡️ 0/3 cứu làng</div><div id="ret-profile">Hãy bình luận để tạo hồ sơ!</div><h3>🤝 Hai đội</h3><div id="ret-teams">🟠 Cam 0 · 🔵 Xanh 0</div><div class="ret-buttons"><button id="ret-feed">🍚 Cho mèo ăn miễn phí (!choan)</button><button id="ret-protect">🛡️ Giữ an toàn (!baove)</button><button id="ret-cam">🟠 Đội Cam</button><button id="ret-xanh">🔵 Đội Xanh</button></div>';
 panel.appendChild(extra);
 const album=document.createElement('details');album.className='ret-album';
 const summary=document.createElement('summary');summary.textContent='📖 Album cư dân (0/20)';
 const grid=document.createElement('div');grid.className='ret-album-grid';
 const cards=CAT_NAMES.map((name,i)=>{const card=document.createElement('div');card.className='ret-album-cat';const title=document.createElement('strong'),story=document.createElement('small');card.append(title,story);grid.appendChild(card);return {card,title,story}});
 album.append(summary,grid);extra.appendChild(album);
 let albumKey='';
 function updateAlbum(profile){const ids=new Set(profile?.cats||[]),key=[...ids].sort((a,b)=>a-b).join(',');if(key===albumKey&&summary.dataset.ready)return;albumKey=key;summary.dataset.ready='1';summary.textContent='📖 Album cư dân ('+ids.size+'/20)';cards.forEach(({card,title,story},i)=>{const seen=ids.has(i);card.classList.toggle('seen',seen);title.textContent=seen?'🐱 '+CAT_NAMES[i]:'🔒 Mèo '+(i+1);story.textContent=seen?CAT_PERSONALITIES[i]:'Chưa gặp'})}
 updateAlbum(null);
 const actor=()=>document.getElementById('username').value||'Khách';
 for(const [id,command] of [['ret-feed','!choan'],['ret-protect','!baove'],['ret-cam','!cam'],['ret-xanh','!xanh']])extra.querySelector('#'+id).onclick=()=>window.handleTikTokEvent('chat',actor(),command);
 const waving=new Map();
 const model=new Retention({storage:window.localStorage,onEffect:e=>{
  onSceneEvent(e);
  if(e.type==='wave'){const index=CAT_NAMES.indexOf(e.cat);if(index>=0&&cats[index]?.group){waving.set(index,performance.now()+1500);burst(cats[index].group.position.x,cats[index].group.position.z,'💛',3)}}
  const info={fish_catch:['🐟 Mèo câu được cá!','🐟',6],flower_bloom:['🌸 Vườn hoa vừa nở!','🌸',8],kitten_visit:['🐾 Mèo con ghé thăm làng!','🐱',7]};
  if(e.type==='micro'){const [msg,symbol,n]=info[e.kind]||['✨ Chuyện nhỏ ở làng!','✨',5];announce(msg);burst(0,0,symbol,n)}
  if(e.type==='major'){const cases={fox:'🦊 Cáo đang lén lấy cá! Gõ !duoi (3 người giúp)',rain:'🌧️ Mưa lớn! Gõ !che để cứu ruộng (3 lượt)',lost_kitten:'🐈 Mèo con đi lạc! Gõ !tim để tìm (3 lượt)',festival:'🎉 Hội làng 5 phút! Mèo nào cũng vui'};announce(cases[e.kind]||'🎪 Sự kiện của làng!');burst(0,0,'✨',13)}
  if(e.type==='milestone'){announce('🏡 MỐC 30 PHÚT! Làng cùng phát triển! Người góp sức: '+(e.top.join(', ')||'cả làng'));burst(0,0,'🎊',30)}
  if(e.type==='crisis_resolved'){announce('🌟 Cả làng cùng vượt qua thử thách!');burst(0,0,'⭐',16)}
  if(e.type==='harvest_complete'){announce('🌾 Đã thu hoạch 20 rau! MỞ HỘI LÀNG!');burst(-6,5,'🎉',25)}
  if(e.type==='daily_complete')announce('🎁 Hoàn thành nhiệm vụ ngày '+(e.index+1)+'!')}
 });
 let prevUpdate=0;
 function action(type,name,payload){return model.action(type,name,payload)}
 function render(now,dt){
  model.tick();
  for(const [index,end] of waving){if(now>=end){waving.delete(index);continue}const cat=cats[index];if(!cat)continue;cat.group.rotation.y=Math.atan2(21-cat.group.position.x,29-cat.group.position.z);cat.group.position.y+=Math.abs(Math.sin(now*.017))*0.06}
  if(now-prevUpdate<350)return;
  prevUpdate=now;
  const state=model.snapshot(),d=state.daily;
  document.getElementById('ret-goal').textContent='🌾 Thu hoạch '+(d.harvest||0)+'/20 rau → '+(d.harvestDone?'đã mở hội':'mở hội');
  document.getElementById('ret-gfill').style.width=Math.min(100,(d.harvest||0)*5)+'%';
  for(const [id,value] of [['ret-micro',state.microIn],['ret-major',state.majorIn],['ret-milestone',state.milestoneIn]]){const icon=id==='ret-micro'?'🐟':id==='ret-major'?'🎪':'🏡';document.getElementById(id).textContent=icon+' '+fmt(value)}
  for(const [key,id,number] of [['hunger','ret-hunger','ret-hn'],['joy','ret-joy','ret-jn'],['safety','ret-safety','ret-sn']]){document.getElementById(id).style.width=Math.floor(state.stats[key])+'%';document.getElementById(id).style.background=state.stats[key]<25?'#e98176':state.stats[key]<50?'#f1ca7a':'#a6e5a3';document.getElementById(number).textContent=Math.floor(state.stats[key])+'%'}
  const top=Object.values(state.visitors).sort((a,b)=>b.points-a.points).slice(0,3);
  document.getElementById('ret-top3').textContent=top.length?top.map((u,i)=>(i+1)+'. '+safe(u.name)+' '+u.points).join(' · '):'Hãy bình luận để đứng đầu!';
  document.getElementById('ret-missions').textContent='💬 '+d.chats+'/20 chat · ❤️ '+d.likes+'/100 tim · 🛡️ '+d.help+'/3 cứu làng';
  const profile=state.visitors[actor().trim().toLowerCase().slice(0,28)];document.getElementById('ret-profile').textContent=profile?'🐱 '+safe(profile.name)+' · '+profile.level+' Lv'+(Math.floor(profile.points/100)+1)+' · 🔥 '+profile.streak+' ngày · 📖 '+profile.cats.length+'/20 mèo':'💬 Bình luận để tạo hồ sơ và gặp mèo!';
  updateAlbum(profile);
  document.getElementById('ret-teams').textContent='🟠 Cam '+state.teams.cam+' · 🔵 Xanh '+state.teams.xanh;
  if(state.crisis)document.querySelector('.ret-call').textContent='⚠️ '+({fox:'Cáo trộm cá',rain:'Mưa lớn',lost_kitten:'Mèo con đi lạc'}[state.crisis.kind]||'Sự cố')+' — Gõ '+state.crisis.command+' ('+state.crisis.progress+'/'+state.crisis.required+')';
  else document.querySelector('.ret-call').textContent='💬 Chat để mèo chào · ❤️ Tim giúp làng · !choan / !baove / !cam / !xanh';
 }
 return {model,action,render}
}
