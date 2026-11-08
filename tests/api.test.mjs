import test,{beforeEach,afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {POST,GET} from '../app/api/helper/route.js';
const keys=['GROQ_API_KEY','GEMINI_API_KEY'];let saved;
beforeEach(()=>{saved=Object.fromEntries(keys.map(k=>[k,process.env[k]]));for(const k of keys)delete process.env[k];});
afterEach(()=>{for(const k of keys)if(saved[k]===undefined)delete process.env[k];else process.env[k]=saved[k];});
const request=(body,headers={})=>new Request('http://localhost:3000/api/helper',{method:'POST',headers:{'content-type':'application/json',host:'localhost:3000',...headers},body:JSON.stringify(body)});
test('API returns explicit unavailable without a credential',async()=>{const old=process.env.GEMINI_API_KEY;delete process.env.GEMINI_API_KEY;const r=await POST(request({question:'What does SIP mean?'}));if(old!==undefined)process.env.GEMINI_API_KEY=old;assert.equal(r.status,200);const a=await r.json();assert.equal(a.mode,'fallback');assert.equal(a.diagnostic,'configuration:missing_key');assert.equal(a.blocks.length,0)});
test('Same-origin reverse-proxy preview request works',async()=>assert.equal((await POST(request({question:'What is SIP?'},{origin:'http://127.0.0.1:4173','x-forwarded-host':'127.0.0.1:4173'}))).status,200));
test('Cross-site browser request is rejected',async()=>assert.equal((await POST(request({question:'What is SIP?'},{origin:'https://another.example'}))).status,403));
test('Missing question is rejected',async()=>assert.equal((await POST(request({}))).status,400));
test('Long question is rejected',async()=>assert.equal((await POST(request({question:'a'.repeat(601)}))).status,400));
test('Null context does not crash endpoint',async()=>assert.equal((await POST(request({question:'What is SIP?',context:null}))).status,200));
test('Readiness does not expose credentials',async()=>{const data=await(await GET()).json();assert.deepEqual(Object.keys(data).sort(),['formalEvaluation','ready','reason'])});

test('readiness accepts Groq-only and Gemini-only without exposing either key',async()=>{
 for(const key of keys){
  process.env[key]='TEST_ONLY_SECRET';
  const r=await(await GET()).json();assert.equal(r.ready,true);assert.equal(r.reason,'ready');assert.equal(r.formalEvaluation,'in progress');
  assert(!JSON.stringify(r).includes('TEST_ONLY_SECRET'));delete process.env[key];
 }
 assert.equal((await(await GET()).json()).ready,false);
});
test('Groq-only API retains the payment clarification memory without an external call',async()=>{
 process.env.GROQ_API_KEY='TEST_ONLY_SECRET';
 const first=await(await POST(request({question:'I missed my SIP payment'}))).json();
 assert.equal(first.message,'Did the SIP amount leave your bank account?');
 const follow=await(await POST(request({question:'yes',history:[{role:'assistant',text:first.message}]}))).json();
 assert.match(follow.message,/What status does Groww show/);assert(!follow.message.includes('leave your bank'));
});
