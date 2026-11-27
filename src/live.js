// Normalize TikFinity's event/data envelopes without trusting viewer input.
const integer=(v,fallback=1)=>{const n=Number(v);return Number.isFinite(n)?Math.max(1,Math.min(1000,Math.floor(n))):fallback};
export function normalizeEvent(message){
 if(!message||typeof message!=='object')return null;
 const d=message.data??{}, type=String(message.event??message.type??'').toLowerCase();
 const user=String(d.uniqueId??d.user?.uniqueId??d.nickname??d.user?.nickname??'Khách').slice(0,28);
 const avatar=String(d.profilePictureUrl??d.user?.profilePictureUrl??'').slice(0,512);
 if(type==='chat'||type==='comment')return {type:'chat',user,data:String(d.comment??d.text??'').slice(0,100),avatar};
 if(type==='like')return {type:'like',user,data:integer(d.likeCount??d.count)};
 if(type==='follow')return {type:'follow',user,data:null,avatar};
 if(type!=='gift')return null;
 if(Number(d.giftType)===1&&!d.repeatEnd)return null;
 const name=String(d.giftName??d.gift?.name??'').toLowerCase();
 const diamonds=Number(d.diamondCount??d.gift?.diamondCount??0);
 const count=integer(d.repeatCount);
 return {type:name.includes('rose')||name.includes('hồng')?'gift_rose':diamonds>=100?'gift_super':'gift_food',user,data:count,coins:Number.isFinite(diamonds)&&diamonds>0?diamonds:null,avatar};
}
export function connectLive({url,onEvent,onStatus,Socket=globalThis.WebSocket}){
 let socket,timer,stopped=false,delay=1000;
 function start(){
  if(stopped)return;
  onStatus('connecting');
  try{socket=new Socket(url)}catch{onStatus('error');retry();return}
  socket.onopen=()=>{if(stopped)return;delay=1000;onStatus('connected')};
  socket.onmessage=e=>{if(stopped)return;try{const event=normalizeEvent(JSON.parse(e.data));if(event)onEvent(event)}catch{}};
  socket.onerror=()=>{if(!stopped)onStatus('error')};
  socket.onclose=()=>{if(!stopped){onStatus('disconnected');retry()}};
 }
 function retry(){clearTimeout(timer);if(!stopped){timer=setTimeout(start,delay);delay=Math.min(30000,delay*2)}}
 start();
 return ()=>{stopped=true;clearTimeout(timer);if(socket){socket.onclose=null;socket.close()}onStatus('stopped')};
}
