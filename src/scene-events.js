import * as THREE from 'three';
// Lightweight V1.1 scene animation layer. Reuses materials/geometries, caps particles,
// and never adds permanent resident cats. Events are driven by retention UI callbacks.
export function mountSceneEvents({world,cats,retention}){
 const standard=c=>new THREE.MeshStandardMaterial({color:c,roughness:.88});
 const shared={
  sphere:new THREE.SphereGeometry(.19,8,6),
  leaf:new THREE.ConeGeometry(.14,.36,5),
  drop:new THREE.SphereGeometry(.095,6,5),
  fish:new THREE.SphereGeometry(.24,8,6),
  crate:new THREE.BoxGeometry(.46,.34,.38),
  stem:new THREE.CylinderGeometry(.035,.035,.45,6)
 };
 const water=standard('#6abbd4'),wood=standard('#b7864f'),gold=standard('#f8d778'),pink=standard('#ec9ba8'),green=standard('#75b872'),foxMat=standard('#dd8853');
 const make=(geo,mat,parent=world)=>{const m=new THREE.Mesh(geo,mat);parent.add(m);return m};
 const props=[],jobs=[],events=[];
 const addTimed=(obj,until,update)=>events.push({obj,until,update});
 function farmJob(){
  const group=new THREE.Group();world.add(group);group.position.set(-6.8,.22,6.3);
  const seed=make(shared.sphere,green,group);seed.scale.set(.5,.8,.5);
  const leaves=[];for(let i=0;i<3;i++){const leaf=make(shared.leaf,green,group);leaf.position.set(Math.sin(i*2.1)*.19,.23,Math.cos(i*2.1)*.19);leaves.push(leaf)}
  jobs.push(t=>{const c=cats[0];if(!c)return;group.position.set(c.group.position.x,.13,c.group.position.z+.38);group.visible=c.waiting>0;const scale=.75+.2*Math.sin(t*.004);seed.scale.y=scale;for(const l of leaves)l.rotation.z=Math.sin(t*.003)*.15});
 }
 function fishJob(){
  const rod=new THREE.Group();world.add(rod);const stick=make(new THREE.CylinderGeometry(.035,.055,1.25,6),wood,rod);stick.rotation.z=.43;stick.position.set(.1,.62,.22);
  const line=make(new THREE.CylinderGeometry(.008,.008,.85,4),water,rod);line.position.set(.45,.83,.24);
  const bobber=make(shared.drop,pink,rod);bobber.position.set(.45,.4,.24);
  jobs.push(t=>{const c=cats[4];if(!c)return;rod.position.set(c.group.position.x,.1,c.group.position.z);rod.rotation.y=c.group.rotation.y;rod.rotation.z=Math.sin(t*.002)*.08;bobber.position.y=.4+Math.sin(t*.006)*.045});
 }
 function kitchenJob(){
  const cook=new THREE.Group();world.add(cook);const pan=make(new THREE.CylinderGeometry(.4,.38,.12,10),standard('#4c5655'),cook);pan.position.y=.23;
  const fish=make(shared.fish,gold,cook);fish.position.set(0,.36,0);fish.scale.set(1.3,.32,.6);
  jobs.push(t=>{const c=cats[7];if(!c)return;cook.position.set(c.group.position.x,.08,c.group.position.z+.37);fish.rotation.y=t*.002;fish.position.y=.36+Math.abs(Math.sin(t*.005))*.16});
 }
 function buildJob(){
  const g=new THREE.Group();world.add(g);
  const timber=make(shared.crate,wood,g);timber.position.y=.17;
  const hammer=make(new THREE.BoxGeometry(.12,.5,.1),standard('#666c70'),g);hammer.position.set(.35,.48,0);
  jobs.push(t=>{const c=cats[16];if(!c)return;g.position.set(c.group.position.x,.07,c.group.position.z+.3);hammer.rotation.z=-.5+Math.abs(Math.sin(t*.007))*1.2});
 }
 farmJob();fishJob();kitchenJob();buildJob();
 const body=make(new THREE.SphereGeometry(.38,9,7),foxMat);body.visible=false;body.scale.set(1.25,.72,.8);
 const foxHead=make(new THREE.SphereGeometry(.25,8,6),foxMat);foxHead.visible=false;
 const rain=[];for(let i=0;i<48;i++){const d=make(shared.drop,water);d.visible=false;d.scale.set(.4,1.6,.4);rain.push(d)}
 const lost=new THREE.Group();world.add(lost);const little=make(shared.sphere,standard('#e1d7b0'),lost);little.position.y=.29;little.scale.set(1.35,1.15,1);const littleHead=make(shared.sphere,standard('#e1d7b0'),lost);littleHead.position.set(0,.62,.13);lost.visible=false;
 const festival=[];for(let i=0;i<12;i++){const bulb=make(shared.sphere,i%2?gold:pink);bulb.scale.set(.65,.65,.65);festival.push(bulb);bulb.visible=false}
 let foxUntil=0,rainUntil=0,kittenUntil=0,festivalUntil=0,fishUntil=0,flowerUntil=0,crisisKind='';
 const durations={fox:90000,rain:90000,lost_kitten:90000,festival:24000};
 function event(e){
  const now=performance.now();
  if(e.type==='micro'){
   if(e.kind==='fish_catch'){fishUntil=now+8000;const fish=make(shared.fish,gold);fish.scale.set(1.5,.45,.75);addTimed(fish,fishUntil,(t,o)=>{const age=(fishUntil-t)/8000;o.position.set(6.5,Math.max(.18,Math.sin((1-age)*Math.PI*3)*.9+.3),6);o.rotation.z=t*.008})}
   if(e.kind==='flower_bloom'){flowerUntil=now+10000;const flower=make(shared.sphere,pink);addTimed(flower,flowerUntil,(t,o)=>{o.position.set(-5.6,.37,5.4);const grow=Math.min(2,(t-(flowerUntil-10000))/1800);o.scale.setScalar(Math.max(.04,grow))})}
   if(e.kind==='kitten_visit')kittenUntil=now+16000;
  }
  if(e.type==='major'){crisisKind=e.kind;const until=now+(durations[e.kind]||24000);if(e.kind==='fox')foxUntil=until;if(e.kind==='rain')rainUntil=until;if(e.kind==='lost_kitten')kittenUntil=until;if(e.kind==='festival')festivalUntil=until}
  if(e.type==='crisis_resolved'){foxUntil=rainUntil=kittenUntil=0;festivalUntil=now+6500}
  if(e.type==='harvest_complete'||e.type==='milestone'||e.type==='festival')festivalUntil=now+11000;
 }
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 function render(time,dt){
  const hungry=retention?.data?.stats?.hunger??75,joy=retention?.data?.stats?.joy??75,safety=retention?.data?.stats?.safety??75;
  for(let i=0;i<cats.length;i++){const c=cats[i],g=c.group,low=hungry<25||joy<25||safety<25;
   // Idle characters visibly breathe, rest or perk up; the 20 core cats are never replaced.
   const breathing=1+Math.sin(time*.002+i)*.018;
   g.scale.set(breathing,low?.89:1,breathing);
   if(c.waiting>0&&i%5===0)g.rotation.z=Math.sin(time*.002+i)*.08;
   if(low&&i%4===0)g.position.y=Math.max(0,g.position.y-.012);
   if(time<festivalUntil)g.position.y+=Math.max(0,Math.sin(time*.008+i))*.03;
  }
  for(const fn of jobs)fn(time);
  body.visible=foxHead.visible=time<foxUntil;
  if(body.visible){const x=7.4+Math.sin(time*.00085)*.9,z=6.2+Math.cos(time*.0008)*.9;body.position.set(x,.45,z);foxHead.position.set(x-.35,.67,z+.25)}
  const raining=time<rainUntil;
  for(let i=0;i<rain.length;i++){const p=rain[i];p.visible=raining;if(!raining)continue;const phase=(i*23.47+time*.018)%35;p.position.set(-9+(i*17.13)%18,3.5-phase*.095,-9+(i*11.73)%18)}
  lost.visible=time<kittenUntil;if(lost.visible){lost.position.set(-1.2+Math.sin(time*.001)*.6,.08,2+Math.cos(time*.0011)*.5);lost.rotation.y=time*.002}
  for(let i=0;i<festival.length;i++){const o=festival[i];o.visible=time<festivalUntil;if(o.visible){const a=i/12*Math.PI*2;o.position.set(Math.cos(a)*3,2+Math.sin(time*.004+i)*.24,Math.sin(a)*3);o.scale.setScalar(.72+.2*Math.sin(time*.006+i))}}
  for(let i=events.length-1;i>=0;i--){const e=events[i];if(time>=e.until){world.remove(e.obj);e.obj.geometry!==shared.fish&&e.obj.geometry!==shared.sphere&&e.obj.geometry.dispose();events.splice(i,1);continue}e.update(time,e.obj)}
 }
 return {event,render};
}
