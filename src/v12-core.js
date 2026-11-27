// Cat Village V1.2-A: shared unlocks, free participation and visible commands.
// No TikTok token is handled or persisted. Keeps the 20 permanent cats untouched.
export const ZONES=[
 {id:'market',name:'Chợ Làng Mèo',icon:'🧺',threshold:250},
 {id:'harbor',name:'Bến Thuyền',icon:'⛵',threshold:600},
 {id:'grove',name:'Đồi Hoa & Rừng Tre',icon:'🎋',threshold:1000}
];
export const COMMANDS=['!an','!vuot','!hat','!nhay','!chup','!tham'];
const clean=v=>String(v||'Khách').trim().slice(0,28)||'Khách';
const finite=(x,d=1)=>Number.isFinite(+x)?Math.max(0,+x):d;
export const commandOf=text=>{const cmd=String(text||'').trim().toLowerCase().split(/\s+/)[0];return COMMANDS.includes(cmd)?cmd:null};
const empty=()=>({version:12,progress:0,unlocks:[],contributors:{},commands:0});
export class Village12 {
 constructor({storage=null,onEffect=()=>{},now=()=>Date.now()}={}){
  this.storage=storage;this.onEffect=onEffect;this.now=now;
  let prev;try{prev=JSON.parse(storage?.getItem('catVillageV12')||'null')}catch{}
  this.data={...empty(),...(prev&&typeof prev==='object'?prev:{})};
  this.data.unlocks=Array.isArray(this.data.unlocks)?this.data.unlocks:[];
  this.data.contributors=this.data.contributors&&typeof this.data.contributors==='object'?this.data.contributors:{};
  this.persist();
 }
 persist(){try{this.storage?.setItem('catVillageV12',JSON.stringify(this.data))}catch{}}
 leaders(){return Object.values(this.data.contributors).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'vi')).slice(0,3)}
 contribute(user,points){const n=Math.min(2000,Math.floor(finite(points,0)));if(n<1)return;
  const key=clean(user).toLocaleLowerCase('vi');const record=Object.hasOwn(this.data.contributors,key)?this.data.contributors[key]:{name:clean(user),score:0};record.score+=n;Object.defineProperty(this.data.contributors,key,{value:record,writable:true,enumerable:true,configurable:true});this.data.progress+=n;
  for(const zone of ZONES){if(this.data.progress>=zone.threshold&&!this.data.unlocks.includes(zone.id)){this.data.unlocks.push(zone.id);this.onEffect({type:'unlock',zone,leaders:this.leaders().map(x=>x.name)});}}
  this.persist();
 }
 event(type,name,data){
  let points=0,cmd=null;
  if(type==='chat'){const text=typeof data==='string'?data:data?.text??'';cmd=commandOf(text);points=2;if(cmd){this.data.commands++;this.onEffect({type:'command',command:cmd,user:clean(name),at:this.now()})}}
  else if(type==='like')points=Math.max(1,Math.floor(Math.min(1000,finite(typeof data==='number'?data:data?.count,1))/10));
  else if(type==='follow')points=5;
  else if(type==='gift_rose')points=10*Math.min(100,finite(typeof data==='number'?data:data?.count,1));
  else if(type==='gift_food'||type==='gift_super'||type==='gift_tractor')points=15*Math.min(100,finite(data?.count,1));
  this.contribute(name,points);return cmd;
 }
 snapshot(){const next=ZONES.find(z=>!this.data.unlocks.includes(z.id));return {progress:this.data.progress,next,unlocks:[...this.data.unlocks],leaders:this.leaders()}}
}
