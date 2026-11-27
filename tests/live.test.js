import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeEvent,connectLive} from '../src/live.js';
test('chat maps viewer and text',()=>assert.deepEqual(normalizeEvent({event:'chat',data:{uniqueId:'alice',comment:'meow'}}),{type:'chat',user:'alice',data:'meow'}));
test('likes are bounded',()=>assert.equal(normalizeEvent({event:'like',data:{likeCount:999999}}).data,1000));
test('unfinished streak ignored',()=>assert.equal(normalizeEvent({event:'gift',data:{giftType:1,repeatEnd:false}}),null));
test('completed rose streak',()=>assert.deepEqual(normalizeEvent({event:'gift',data:{giftType:1,repeatEnd:true,giftName:'Rose',repeatCount:3,uniqueId:'bob'}}),{type:'gift_rose',user:'bob',data:3}));
test('large gift and unknown events',()=>{assert.equal(normalizeEvent({event:'gift',data:{diamondCount:100}}).type,'gift_super');assert.equal(normalizeEvent({event:'unknown'}),null);assert.equal(normalizeEvent(null),null)});
test('socket dispatch and stop',()=>{let socket;const events=[],statuses=[];class Fake{constructor(){socket=this}close(){this.closed=true}}const stop=connectLive({url:'ws://localhost:21213/',Socket:Fake,onEvent:e=>events.push(e),onStatus:s=>statuses.push(s)});socket.onopen();socket.onmessage({data:'bad'});socket.onmessage({data:JSON.stringify({event:'like',data:{likeCount:2}})});stop();assert.equal(events.length,1);assert.equal(events[0].data,2);assert.deepEqual(statuses,['connecting','connected','stopped']);assert.equal(socket.closed,true)});
