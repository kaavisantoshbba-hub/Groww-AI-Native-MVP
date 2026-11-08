import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {answer,generateAnswer,readiness,modelName,REQUEST_BUDGET_MS,skipTimingQuestion} from '../lib/provider.mjs';
import {maxDuration,POST} from '../app/api/helper/route.js';
const ok={relevant:true,grounded:true,noAdvice:true,noUnverifiedAccountClaims:true,missingInfoHandled:true};
const sel={action:'answer',question:'',ruleIds:['mandate'],verdict:'not_checked'};
const draft={text:'AutoPay permits automatic SIP debits from your linked bank account.',ruleIds:['mandate']};
const response=o=>({ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify(o)}}]})});
const mock=(...values)=>{const calls=[];const f=async(url,opts)=>{calls.push({url,opts});const value=values.shift();if(value instanceof Error)throw value;return value?.ok===false?value:response(value);};return {fetchImpl:f,calls};};
async function keyed(fn){
 const keys=['GROQ_API_KEY','GROQ_MODEL','GEMINI_API_KEY','GEMINI_MODEL'];
 const old=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
 for(const k of keys)delete process.env[k];process.env.GROQ_API_KEY='TEST_ONLY_SECRET';
 try{return await fn()}finally{for(const k of keys)if(old[k]===undefined)delete process.env[k];else process.env[k]=old[k];}
}
test('key alone enables AI; release flag and report are not used',()=>keyed(()=>{const old=process.env.AI_RELEASE_APPROVED;process.env.AI_RELEASE_APPROVED='false';assert.equal(readiness().ready,true);assert.equal(readiness().formalEvaluation,'in progress');if(old===undefined)delete process.env.AI_RELEASE_APPROVED;else process.env.AI_RELEASE_APPROVED=old;}));
test('Groq schema model defaults correctly and allows slash-containing overrides',()=>keyed(()=>{assert.equal(modelName(),'openai/gpt-oss-20b');process.env.GROQ_MODEL='openai/gpt-oss-120b';assert.equal(modelName(),'openai/gpt-oss-120b');}));
test('successful answer performs selection, draft, independent check and retains citations',()=>keyed(async()=>{const m=mock(sel,draft,ok);const r=await answer('What is AutoPay?',{},[],m);assert.equal(m.calls.length,3);assert.equal(r.mode,'ai');assert.equal(r.sources[0].id,'S10');assert.equal(r.message,draft.text);assert.equal(r.formalEvaluation,'in progress');assert(m.calls.every(c=>c.opts.signal===m.calls[0].opts.signal));}));
test('diagnostics allow HTTP status names but never provider message/question/key',()=>keyed(async()=>{const bad={ok:false,status:429,json:async()=>({error:{message:'TEST_ONLY_SECRET private-user-question'}})};const m=mock(bad,bad);const r=await answer('private-user-question',{},[],m);assert.equal(r.diagnostic,'selection:groq_http_429_RESOURCE_EXHAUSTED');assert(!JSON.stringify(r).includes('TEST_ONLY_SECRET'));assert(!JSON.stringify(r).includes('private-user-question'));}));
test('unknown API status is not echoed',()=>keyed(async()=>{const m=mock({ok:false,status:400,json:async()=>({error:{status:'TEST_ONLY_SECRET'}})});const r=await answer('Explain',{},[],m);assert.equal(r.diagnostic,'selection:groq_http_400_INVALID_ARGUMENT');}));
test('draft and check failures identify the stage',()=>keyed(async()=>{const bad={ok:false,status:503,json:async()=>({error:{status:'UNAVAILABLE'}})};assert.equal((await answer('Explain',{},[],mock(sel,bad,bad))).diagnostic,'draft:groq_http_503_UNAVAILABLE');assert.equal((await answer('Explain',{},[],mock(sel,draft,bad,bad))).diagnostic,'check:groq_http_503_UNAVAILABLE');}));
test('malformed JSON and truncated response are safe',()=>keyed(async()=>{let r=await answer('Explain',{},[],{fetchImpl:async()=>({ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:'NOT JSON'}}]})})});assert.equal(r.diagnostic,'selection:invalid_json');r=await answer('Explain',{},[],{fetchImpl:async()=>({ok:true,json:async()=>({choices:[{finish_reason:'length'}]})})});assert.equal(r.diagnostic,'selection:incomplete_response');}));
test('invalid rule ID cannot pass',()=>keyed(async()=>assert.equal((await answer('Explain',{},[],mock({...sel,ruleIds:['invented']}))).diagnostic,'selection:invalid_evidence')));
test('rejected draft is withheld, no keyword answer substitution',()=>keyed(async()=>{const r=await answer('Explain',{},[],mock(sel,draft,{...ok,relevant:false}));assert.equal(r.diagnostic,'check:answer_rejected');assert.equal(r.blocks.length,0);assert(!r.message.includes('AutoPay'));}));
test('network errors do not leak raw messages',()=>keyed(async()=>{const r=await answer('Explain',{},[],mock(new Error('TEST_ONLY_SECRET')));assert.equal(r.diagnostic,'selection:network_error');assert(!JSON.stringify(r).includes('TEST_ONLY_SECRET'));}));
test('one shared deadline bounds cumulative calls, including response bodies',()=>keyed(async()=>{let calls=0;const start=Date.now();const r=await answer('Explain',{},[],{deadline:start+65,fetchImpl:async()=>{calls++;await new Promise(r=>setTimeout(r,25));return calls===1?response(sel):{ok:true,json:()=>new Promise(()=>{})}}});assert.equal(r.diagnostic,'draft:deadline_exceeded');assert.equal(calls,2);assert(Date.now()-start<400);assert(REQUEST_BUDGET_MS<maxDuration*1000);}));
test('expired request never sends a provider call',()=>keyed(async()=>{let calls=0;const r=await answer('Explain',{},[],{deadline:Date.now()-1,fetchImpl:()=>{calls++;}});assert.equal(r.diagnostic,'selection:deadline_exceeded');assert.equal(calls,0);}));
test('missed SIP asks ONE question and yes/no use assistant history',()=>keyed(async()=>{const first=await answer('I missed my SIP payment',{task:'edit'},[]);assert.equal(first.message,'Did the SIP amount leave your bank account?');assert.equal(first.message.match(/\?/g).length,1);const history=[{role:'user',text:'I missed my SIP payment'},{role:'assistant',text:first.message}];for(const q of ['yes','no']){const r=await answer(q,{},history);assert.match(r.message,/What status does Groww show/);assert(!r.message.includes('leave your bank'));}}));
test('later status reply retains whole history for all three calls',()=>keyed(async()=>{const history=[{role:'user',text:'I missed my SIP payment'},{role:'assistant',text:'Did the SIP amount leave your bank account?'},{role:'user',text:'yes'},{role:'assistant',text:'What status does Groww show for that payment—processing, failed, or no order visible?'}];const m=mock({...sel,ruleIds:['missing']},{text:'For a missing order, contact support if it persists beyond two working days after deduction.',ruleIds:['missing']},ok);const r=await answer('No order visible',{},history,m);assert.equal(r.mode,'ai');for(const c of m.calls){const data=JSON.parse(JSON.parse(c.opts.body).messages[1].content);assert.equal(data.conversation[2].text,'yes');}}));
test('HTTP handler keeps role-tagged memory',()=>keyed(async()=>{const req=new Request('https://example.test/api/helper',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question:'yes',history:[{role:'assistant',text:'Did the SIP amount leave your bank account?'}]})});const r=await(await POST(req)).json();assert.match(r.message,/What status/);}));
test('expectations retain code-owned outcome and require correct evidence',()=>keyed(async()=>{const context={intent:'check',task:'edit',timing:'near',amount:1500};const m=mock({...sel,ruleIds:['edit'],verdict:'needs_correction'},{text:'The next payment stays ₹2000; the following payment is ₹1500 in this sample.',ruleIds:['edit']},ok);const r=await answer('Next payment becomes 1500',context,[],m);assert.equal(r.kind,'checked');assert.equal(r.verdict,'needs_correction');assert.match(r.blocks[0].text,/₹2000/);const bad=await answer('Next is 1500',context,[],mock({...sel,ruleIds:['skip'],verdict:'matches'}));assert.equal(bad.diagnostic,'selection:invalid_expectation');}));
test('games stay code-only and every-screen copy exists',()=>{for(const f of ['app/learning-games.jsx','lib/games.mjs'])assert(!/fetch\(|gemini|groq|\/api\/helper/i.test(readFileSync(f,'utf8')));const ui=readFileSync('app/page.jsx','utf8');assert(ui.includes('Educational prototype. Not investment advice. Sample data only.'));assert(ui.includes('formal evaluation: in progress'));assert(!ui.includes('passed the recorded release checks'));});

test('Groq request uses bearer auth and strict standard JSON Schema for all stages',()=>keyed(async()=>{
 process.env.GEMINI_API_KEY='LEGACY_SECRET';
 process.env.GROQ_MODEL='openai/gpt-oss-120b';
 const m=mock(sel,draft,ok);await answer('What is AutoPay?',{},[],m);
 for(const [i,c] of m.calls.entries()){
  assert.equal(c.url,'https://api.groq.com/openai/v1/chat/completions');
  assert.equal(c.opts.headers.Authorization,'Bearer TEST_ONLY_SECRET');
  assert.equal(c.opts.headers['x-goog-api-key'],undefined);
  const body=JSON.parse(c.opts.body);assert.equal(body.model,'openai/gpt-oss-120b');
  assert.equal(body.messages[0].role,'system');assert.equal(body.messages[1].role,'user');
  assert.equal(body.response_format.type,'json_schema');
  const schema=body.response_format.json_schema;
  assert.equal(schema.name,`sip_${['selection','draft','check'][i]}`);assert.equal(schema.strict,true);
  assert.equal(schema.schema.type,'object');assert.equal(schema.schema.additionalProperties,false);
  assert.deepEqual(schema.schema.required,Object.keys(schema.schema.properties));
  assert(!JSON.stringify(body).includes('LEGACY_SECRET'));
  for(const v of Object.values(schema.schema.properties)){assert.equal(v.type,v.type.toLowerCase());if(v.items)assert.equal(v.items.type,'string');}
 }
}));
test('one delayed retry recovers Groq 429 and 503 while retaining the same signal',()=>keyed(async()=>{
 for(const status of [429,503]){
  const start=Date.now(),m=mock({ok:false,status},sel,draft,ok);
  const r=await answer('What is AutoPay?',{},[],m);
  assert.equal(r.mode,'ai');assert.equal(m.calls.length,4);assert(Date.now()-start>=950);
  assert(m.calls.every(c=>c.opts.signal===m.calls[0].opts.signal));
 }
}));
test('retry allowance is shared across stages and never switches providers on error',()=>keyed(async()=>{
 process.env.GEMINI_API_KEY='LEGACY_SECRET';
 const m=mock({ok:false,status:429},sel,{ok:false,status:503});
 const r=await answer('Explain',{},[],m);
 assert.equal(r.diagnostic,'draft:groq_http_503_UNAVAILABLE');assert.equal(m.calls.length,3);
 assert(m.calls.every(c=>c.url.startsWith('https://api.groq.com/')));
}));
test('no retry when the budget cannot fit the delay and a minimum attempt window',()=>keyed(async()=>{
 const m=mock({ok:false,status:429});
 const r=await answer('Explain',{},[],{...m,deadline:Date.now()+1500});
 assert.equal(r.diagnostic,'selection:groq_http_429_RESOURCE_EXHAUSTED');assert.equal(m.calls.length,1);
}));
test('retry body cannot outlive the original shared deadline',()=>keyed(async()=>{
 let calls=0;const start=Date.now();
 const r=await answer('Explain',{},[],{deadline:start+2100,fetchImpl:async()=>{
  calls++;return calls===1?{ok:false,status:503}:{ok:true,json:()=>new Promise(()=>{})};
 }});
 assert.equal(calls,2);assert.equal(r.diagnostic,'selection:deadline_exceeded');assert(Date.now()-start<3000);
}));
test('non-retryable status and refusal never expose model content',()=>keyed(async()=>{
 const m=mock({ok:false,status:401});assert.equal((await answer('Explain',{},[],m)).diagnostic,'selection:groq_http_401_UNAUTHENTICATED');assert.equal(m.calls.length,1);
 const r=await answer('Explain',{},[],{fetchImpl:async()=>({ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{refusal:'PRIVATE_TEXT',content:'PRIVATE_TEXT'}}]})})});
 assert.equal(r.diagnostic,'selection:answer_rejected');assert(!JSON.stringify(r).includes('PRIVATE_TEXT'));
}));
test('Gemini-only configuration preserves the legacy request and response format',()=>keyed(async()=>{
 delete process.env.GROQ_API_KEY;process.env.GEMINI_API_KEY='LEGACY_SECRET';
 assert.equal(readiness().ready,true);assert.equal(modelName(),'gemini-3.5-flash');
 process.env.GEMINI_MODEL='custom-flash';assert.equal(modelName(),'custom-flash');
 const values=[sel,draft,ok],calls=[];
 const r=await answer('What is AutoPay?',{},[],{fetchImpl:async(url,opts)=>{
  calls.push({url,opts});return {ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(values.shift())}]}}]})};
 }});
 assert.equal(r.mode,'ai');assert.equal(calls.length,3);
 assert(calls.every(c=>c.url.endsWith('/custom-flash:generateContent')));
 assert.equal(calls[0].opts.headers['x-goog-api-key'],'LEGACY_SECRET');
 assert.equal(JSON.parse(calls[0].opts.body).generationConfig.responseSchema.type,'OBJECT');
 const m=mock({ok:false,status:429,json:async()=>({error:{status:'RESOURCE_EXHAUSTED'}})});
 assert.equal((await answer('Explain',{},[],m)).diagnostic,'selection:gemini_http_429_RESOURCE_EXHAUSTED');assert.equal(m.calls.length,1);
}));

test('skip-deadline questions get the fixed timing rule with sources and make NO AI call',()=>keyed(async()=>{for(const q of ['can i skip tomorrows payment','Can I skip tomorrow’s payment?','can I skip my SIP today','what is the last date to skip my sip','kal ka SIP skip kar sakta hoon?']){const m=mock(sel,draft,ok);const r=await answer(q,{},[],m);assert.equal(m.calls.length,0,q);assert.equal(r.mode,'rule',q);assert.deepEqual(r.ruleIds,['timing']);assert(r.sources.some(s=>s.id==='S1')&&r.sources.some(s=>s.id==='S3'));assert.match(r.message,/2 working days/);assert.match(r.message,/cannot confirm/);assert(!/\byes\b/i.test(r.message));}}));
test('non-deadline skip questions still use the AI path',()=>keyed(async()=>{for(const q of ['What happens if I skip three SIP instalments in a row?','What does skip mean?','How long can I skip my SIP?']){assert.equal(skipTimingQuestion(q),false,q);}const m=mock({...sel,ruleIds:['skip']},{text:'Groww allows one instalment to be skipped at a time.',ruleIds:['skip']},ok);const r=await answer('Can I skip my SIP for a month?',{},[],m);assert.equal(m.calls.length,3);assert.equal(r.mode,'ai');}));
