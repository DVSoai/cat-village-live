// V1.1 communal gameplay — pure model: no THREE, DOM, TikTok credentials.
export const JAR_TARGET=1000;
export const LIKE_MILESTONE=1000;
export const GOLDEN_INTERVAL_MS=25*60*1000;
export const RACE_INTERVAL_MS=15*60*1000;
export const RACE_DURATION_MS=60*1000;
export const GUEST_DURATION_MS=60*1000;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number.isFinite(+n)?+n:min));
const normUser=(s)=>String(s||'Khách').trim().slice(0,28)||'Khách';
const today=(ms)=>new Date(ms).toISOString().slice(0,10);
const before=(date)=>{const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-1);return d.toISOString().slice(0,10)};
const seed=()=>({version:11,jar:0,jarLevel:0,likes:0,goldenAt:0,sessionId:0,users:{},guests:[],race:null,lastRaceAt:0,lastGoldenAt:0});
export class Village11 {
 constructor({now=()=>Date.now(),random=Math.random,storage=null,onEffect=()=>{}}={}){
  this.now=now;this.random=random;this.storage=storage;this.onEffect=onEffect;
  let prev;try{prev=JSON.parse(storage?.getItem('catVillageV11')||'null')}catch{}
  this.data={...seed(),...(prev&&typeof prev==='object'?prev:{})};
  this.data.users=this.data.users||{};this.data.guests=[];this.data.race=null;
  this.session={id:this.now(),users:{},joined:new Set()};
  this.nextGoldenAt=this.now()+GOLDEN_INTERVAL_MS*(.8+this.random()*.4);
  this.nextRaceAt=this.now()+RACE_INTERVAL_MS;
  this.nextJar=this.data.jarLevel%2?{label:'Mở hội làng',icon:'🎪'}:{label:'Xây cầu gỗ',icon:'🌉'};
  this.persist();
 }
 persist(){try{this.storage?.setItem('catVillageV11',JSON.stringify({...this.data,guests:[],race:null}))}catch{}}
 emit(type,payload={}){this.onEffect({type,...payload})}
 user(name){const key=normUser(name).toLowerCase();if(!this.data.users[key])this.data.users[key]={name:normUser(name),likes:0,coins:0,flowers:0,fishes:0,points:0,races:0,sessions:0,streak:0,lastDay:'',titles:[],events:0};return this.data.users[key]}
 visit(name){const u=this.user(name),k=normUser(name).toLowerCase();const day=today(this.now());if(u.lastDay!==day){u.streak=u.lastDay===before(day)?u.streak+1:1;u.lastDay=day}if(!this.session.joined.has(k)){this.session.joined.add(k);u.sessions++;this.session.users[k]=0;this.emit('new_visit',{name:u.name})}this.assignTitles(u);return u}
 assignTitles(u){const titles=[];if(u.streak>=3)titles.push('Khách Quen');if(u.coins>=100)titles.push('Ân Nhân Làng');if(u.fishes>=20)titles.push('Vua Câu Cá');if(u.flowers>=10)titles.push('Người Trồng Hoa');u.titles=titles}
 addJar(amount,by){const n=clamp(amount,0,5000);this.data.jar+=n;if(by)this.session.users[by.toLowerCase()]=(this.session.users[by.toLowerCase()]||0)+n;let loops=0;while(this.data.jar>=JAR_TARGET&&loops++<8){this.data.jar-=JAR_TARGET;this.data.jarLevel++;const contributors=Object.entries(this.session.users).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>this.data.users[k]?.name||k);this.emit('jar_complete',{level:this.data.jarLevel,contributors,objective:this.nextJar.label});this.nextJar=this.data.jarLevel%2?{label:'Mở hội làng',icon:'🎪'}:{label:'Xây cầu gỗ',icon:'🌉'};this.session.users={}}}
 guest(name,avatar=''){const now=this.now(),key=normUser(name).toLowerCase();let guest=this.data.guests.find(x=>x.key===key);if(guest){guest.expires=now+GUEST_DURATION_MS;return guest}if(this.data.guests.length>=10)this.data.guests.shift();guest={name:normUser(name),key,avatar:typeof avatar==='string'&&/^https:\/\//.test(avatar)?avatar.slice(0,512):'',expires:now+GUEST_DURATION_MS,created:now};this.data.guests.push(guest);this.emit('guest_join',{guest});return guest}
 select(name,number){const u=this.visit(name);const choice=Number(number);if(!Number.isInteger(choice)||choice<1||choice>6)return false;if(this.data.race?.phase==='running')return false;if(!this.data.race)this.data.race={phase:'signup',startedAt:0,finishAt:0,boost:[0,0,0,0,0,0],choices:{},winner:0};this.data.race.choices[normUser(name).toLowerCase()]=choice;this.emit('race_choose',{name:u.name,choice});return true}
 event(type,name='Khách',payload=1){const u=this.visit(name);let amount=0,username=u.name;u.events++;if(type==='chat'){const message=String(typeof payload==='string'?payload:payload?.text??'').trim();this.guest(name,typeof payload==='object'?payload.avatar:'');const m=message.match(/^!chon\s+([1-6])$/i);if(m)this.select(name,+m[1]);this.emit('chat',{name:username,message:message.slice(0,100)})}
 else if(type==='like'){const n=clamp(typeof payload==='number'?payload:payload?.count??1,1,1000);const old=Math.floor(this.data.likes/LIKE_MILESTONE);this.data.likes+=n;u.likes+=n;u.points+=n;amount=Math.max(1,Math.floor(n/10));if(Math.floor(this.data.likes/LIKE_MILESTONE)>old)this.emit('like_milestone',{likes:this.data.likes});}
 else if(type==='gift_rose'){const n=clamp(typeof payload==='number'?payload:payload?.count??1,1,100);u.flowers+=n;u.coins+=n;u.points+=n*10;amount=n*10;if(this.data.race?.phase==='running'){const index=this.data.race.choices[normUser(name).toLowerCase()];if(index)this.data.race.boost[index-1]+=n*3}this.emit('rose',{name:username,count:n});this.emit('tribute',{name:username,type:'rose'});}
 else if(type==='gift_food'||type==='gift_tractor'||type==='gift_super'){const coin=clamp(typeof payload==='object'?payload.coins:(type==='gift_super'?100:type==='gift_food'?10:20),1,10000);const n=clamp(typeof payload==='object'?payload.count:1,1,100);u.coins+=coin*n;u.points+=coin*n*10;u.fishes+=type==='gift_food'?10*n:0;amount=coin*n*2;this.emit('tribute',{name:username,type,coins:coin*n});if(type==='gift_super'||coin>=100){this.golden('gift');this.emit('festival',{name:username})}}
 else if(type==='follow'){u.points+=20;this.emit('tribute',{name:username,type:'follow'});this.guest(name)}
 else return false;
 this.addJar(amount,username);this.assignTitles(u);this.persist();return true}
 golden(reason='timer'){this.data.lastGoldenAt=this.now();this.nextGoldenAt=this.now()+GOLDEN_INTERVAL_MS*(.8+this.random()*.4);this.data.goldenAt=this.now()+15000;this.emit('golden',{reason,expires:this.data.goldenAt});this.persist()}
 startRace(){if(this.data.race?.phase==='running')return;if(!this.data.race||this.data.race.phase==='finished')this.data.race={phase:'signup',choices:{},boost:[0,0,0,0,0,0]};this.data.race.phase='running';this.data.race.startedAt=this.now();this.data.race.finishAt=this.now()+RACE_DURATION_MS;this.data.race.winner=0;this.data.lastRaceAt=this.now();this.nextRaceAt=this.now()+RACE_INTERVAL_MS;this.emit('race_start')}
 finishRace(){const r=this.data.race;if(!r||r.phase!=='running')return;const base=[0,1,2,3,4,5].map(i=>this.random()*100+(r.boost[i]||0));r.winner=base.indexOf(Math.max(...base))+1;r.phase='finished';const winners=[];for(const [key,choice] of Object.entries(r.choices)){if(choice===r.winner){const u=this.data.users[key];if(u){u.races++;u.points+=50;winners.push(u.name)}}}this.emit('race_end',{winner:r.winner,winners});this.persist()}
 tick(){const now=this.now();this.data.guests=this.data.guests.filter(x=>x.expires>now);if(this.data.race?.phase==='running'&&now>=this.data.race.finishAt)this.finishRace();if(this.data.race?.phase==='finished'&&now>=this.data.race.finishAt+30000)this.data.race=null;if(now>=this.nextRaceAt&&(!this.data.race||this.data.race.phase==='signup'))this.startRace();if(now>=this.nextGoldenAt)this.golden();if(this.data.goldenAt&&now>this.data.goldenAt)this.data.goldenAt=0}
 top(limit=10,session=false){return Object.values(this.data.users).filter(x=>!session||this.session.joined.has(x.name.toLowerCase())).sort((a,b)=>b.points-a.points).slice(0,limit)}
 snapshot(){return {jar:this.data.jar,jarLevel:this.data.jarLevel,jarTarget:JAR_TARGET,objective:this.nextJar,likes:this.data.likes,nextLike:LIKE_MILESTONE-this.data.likes%LIKE_MILESTONE,guests:this.data.guests,race:this.data.race,top:this.top(),goldenActive:this.data.goldenAt>this.now(),nextRaceIn:Math.max(0,this.nextRaceAt-this.now()),nextGoldenIn:Math.max(0,this.nextGoldenAt-this.now())}}
}
