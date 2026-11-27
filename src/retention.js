// Retention core is deterministic and testable without DOM, Three.js or TikTok.
export const MICRO_MS=90_000,MAJOR_MS=300_000,MILESTONE_MS=1_800_000;
export const CAT_NAMES=['Mít','Mơ','Muối','Ông Râu','Bông','Nếp','Đốm','Gạo','Vừng','Bơ','Na','Kem','Sữa','Tiêu','Mận','Sấu','Cốm','Tôm','Gừng','Lạc'];
export const CAT_PERSONALITIES=['ham ăn','lười ngủ','rụt rè','trưởng làng hay kể chuyện','thích hoa','thích làm bánh','thích chơi','siêng năng','tinh nghịch','hay hát','thích cá','sợ mưa','thích nắng','gan dạ','dịu dàng','tò mò','làm vườn','câu cá','khéo tay','thích khám phá'];
const clip=(x,a=0,b=100)=>Math.min(b,Math.max(a,Number(x)||0));
const dayVN=(now)=>new Date(now+7*3600000).toISOString().slice(0,10);
const previousDay=(d)=>{const t=Date.parse(d+'T00:00:00Z');return new Date(t-86400000).toISOString().slice(0,10)};
const startState=()=>({stats:{hunger:78,joy:82,safety:80},daily:{day:'',chats:0,likes:0,help:0,harvest:0,completed:[false,false,false]},visitors:{},teams:{cam:0,xanh:0},missionsFinished:0,milestone:0,history:[],lastUpdate:null});
export class Retention {
 constructor({now=()=>Date.now(),storage=null,onEffect=()=>{}}={}){
  this.now=now;this.storage=storage;this.onEffect=onEffect;
  let saved=null;try{saved=JSON.parse(storage?.getItem('catVillageRetention11')||'null')}catch{}
  this.data={...startState(),...(saved&&typeof saved==='object'?saved:{})};
  this.data.stats={...startState().stats,...this.data.stats};this.data.visitors=this.data.visitors||{};
  this.events={microAt:now()+MICRO_MS,majorAt:now()+MAJOR_MS,milestoneAt:now()+MILESTONE_MS};
  this.activeCrisis=null;this.lastTime=now();this.lastFlush=now();this.resetDaily();this.persist();
 }
 emit(type,payload={}){const data={type,...payload};this.data.history.push({type,at:this.now()});if(this.data.history.length>40)this.data.history.shift();this.onEffect(data)}
 persist(){try{this.storage?.setItem('catVillageRetention11',JSON.stringify(this.data))}catch{}}
 resetDaily(){const d=dayVN(this.now());if(this.data.daily?.day===d)return;this.data.daily={day:d,chats:0,likes:0,help:0,harvest:0,completed:[false,false,false]};this.emit('new_day',{day:d});this.persist()}
 visit(name){const key=String(name||'Khách').trim().toLowerCase().slice(0,28),today=dayVN(this.now());if(!this.data.visitors[key])this.data.visitors[key]={name:String(name||'Khách').slice(0,28),points:0,level:'Khách',streak:0,lastDay:'',cats:[],team:null,lastTeamChange:0,events:0};
  const u=this.data.visitors[key];if(u.lastDay!==today){u.streak=u.lastDay===previousDay(today)?u.streak+1:1;u.lastDay=today}return u}
 encounter(u,id){if(!u||!Number.isInteger(id)||id<0||id>=20)return;if(!u.cats.includes(id)){u.cats.push(id);u.points+=5;this.emit('met_cat',{name:u.name,cat:CAT_NAMES[id],count:u.cats.length})}}
 changeTeam(name,team){if(!['cam','xanh'].includes(team))return false;const u=this.visit(name);if(u.team&&u.team!==team&&this.now()-u.lastTeamChange<300000)return false;u.team=team;u.lastTeamChange=this.now();this.emit('team_join',{name:u.name,team});this.persist();return true}
 reward(u,points){u.points+=points;u.level=u.points>=500?'Ân Nhân':u.points>=100?'Dân Làng':'Khách';if(u.team)this.data.teams[u.team]+=points;this.encounter(u,Math.floor(this.now()/1000)%20)}
 action(type,name,payload){this.resetDaily();const u=this.visit(name),message=String(typeof payload==='string'?payload:payload?.text||'').trim().toLowerCase();
  u.events++;if(type==='chat'){this.data.daily.chats++;this.data.daily.harvest=Math.min(20,(this.data.daily.harvest||0)+1);this.reward(u,2);if(message==='!cam'||message==='!xanh')this.changeTeam(name,message.slice(1));if(message==='!choan')this.heal('hunger',6,'chat');if(message==='!baove')this.heal('safety',5,'chat');if(message==='!vui')this.heal('joy',5,'chat');if(this.activeCrisis&&message===this.activeCrisis.command){this.activeCrisis.progress++;this.data.daily.help++;this.reward(u,8);this.emit('crisis_progress',{...this.activeCrisis});if(this.activeCrisis.progress>=this.activeCrisis.required)this.resolveCrisis(true)}this.emit('wave',{name:u.name,cat:CAT_NAMES[u.events%20]});}
  else if(type==='like'){const n=clip(typeof payload==='number'?payload:payload?.count||1,1,1000);this.data.daily.likes+=n;this.data.daily.harvest=Math.min(20,(this.data.daily.harvest||0)+Math.max(1,Math.floor(n/20)));this.heal('joy',Math.max(1,Math.floor(n/20)),'like');this.reward(u,Math.max(1,Math.floor(n/20)));this.emit('wave',{name:u.name,cat:CAT_NAMES[u.events%20]});}
  else if(type.startsWith('gift_')){this.heal(type==='gift_food'?'hunger':'safety',type==='gift_super'?15:8,'gift');this.reward(u,type==='gift_super'?20:5)}
  else if(type==='follow'){this.reward(u,10);this.heal('joy',5,'follow')}
  this.checkDaily();this.persist();return u}
 heal(key,value,source){this.data.stats[key]=clip(this.data.stats[key]+value);this.emit('stat_change',{key,value,source})}
 checkDaily(){const d=this.data.daily;const targets=[d.chats>=20,d.likes>=100,d.help>=3];targets.forEach((pass,i)=>{if(pass&&!d.completed[i]){d.completed[i]=true;this.data.missionsFinished++;this.emit('daily_complete',{index:i})}});if(d.harvest>=20&&!d.harvestDone){d.harvestDone=true;this.emit('harvest_complete',{day:d.day})}}
 micro(){const types=['fish_catch','flower_bloom','kitten_visit'];const type=types[Math.floor(this.now()/MICRO_MS)%types.length];this.emit('micro',{kind:type})}
 major(){const kind=['fox','rain','lost_kitten','festival'][Math.floor(this.now()/MAJOR_MS)%4];if(kind==='festival'){this.heal('joy',9,'festival');this.emit('major',{kind});return}
 const commands={fox:'!duoi',rain:'!che',lost_kitten:'!tim'};this.activeCrisis={kind,command:commands[kind],progress:0,required:3,until:this.now()+90000};this.emit('major',{kind,command:commands[kind],required:3})}
 resolveCrisis(win){if(!this.activeCrisis)return;const crisis=this.activeCrisis;this.activeCrisis=null;if(win){this.heal('safety',12,'resolved');this.emit('crisis_resolved',{kind:crisis.kind})}else{this.heal('safety',-5,'expired');this.emit('crisis_expired',{kind:crisis.kind})}}
 milestone(){this.data.milestone++;const top=Object.values(this.data.visitors).sort((a,b)=>b.points-a.points).slice(0,3).map(x=>x.name);this.heal('hunger',10,'milestone');this.heal('joy',10,'milestone');this.heal('safety',10,'milestone');this.emit('milestone',{count:this.data.milestone,top,stats:{...this.data.stats},missions:this.data.missionsFinished})}
 tick(){const n=this.now(),dt=clip((n-this.lastTime)/1000,0,3);this.lastTime=n;this.resetDaily();for(const [key,loss] of [['hunger',.018],['joy',.024],['safety',.012]]){const v=this.data.stats[key];this.data.stats[key]=clip(v-loss*dt+(v<18?.015*dt:0))}
  if(this.activeCrisis&&n>=this.activeCrisis.until)this.resolveCrisis(false);
  if(n>=this.events.microAt){this.events.microAt=n+MICRO_MS;this.micro()}
  if(n>=this.events.majorAt){this.events.majorAt=n+MAJOR_MS;this.major()}
  if(n>=this.events.milestoneAt){this.events.milestoneAt=n+MILESTONE_MS;this.milestone()}
  if(n-this.lastFlush>10000){this.lastFlush=n;this.persist()}}
 snapshot(){const n=this.now();return {stats:{...this.data.stats},daily:this.data.daily,microIn:Math.max(0,this.events.microAt-n),majorIn:Math.max(0,this.events.majorAt-n),milestoneIn:Math.max(0,this.events.milestoneAt-n),crisis:this.activeCrisis,teams:this.data.teams,visitors:this.data.visitors}}
}
