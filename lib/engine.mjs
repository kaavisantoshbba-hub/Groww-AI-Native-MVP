import {rules,getSources} from './rules.mjs';
export function cleanContext(raw={}) {
 raw=raw && typeof raw==='object'?raw:{};
 return {task:['edit','skip','payment'].includes(raw.task)?raw.task:null,
 timing:['near','later'].includes(raw.timing)?raw.timing:null,
 skips:[0,1,2].includes(raw.skips)?raw.skips:0,
 debit:['yes','no','unknown'].includes(raw.debit)?raw.debit:null,
 status:['failed','processing','missing','unknown'].includes(raw.status)?raw.status:null,
 amount:Number.isInteger(raw.amount)&&raw.amount>=500&&raw.amount<=100000?raw.amount:1500,
 intent:raw.intent==='check'?'check':'question'};
}
export function editOutcome(amount,timing){
 if(!Number.isFinite(amount)||amount<500||amount>100000||amount%1!==0) return {valid:false,message:'For this fictional SIP, enter a whole-rupee amount from ₹500 to ₹1,00,000. These are sample limits, not universal Groww limits.'};
 return {valid:true,next:timing==='near'?2000:amount,following:amount,delayed:timing==='near'};
}
export function skipOutcome(timing,skips){
 return {next:timing==='near'?'₹2,000':'Skipped',following:timing==='near'?'Skipped':skips===2?'SIP cancelled':'₹2,000',cancelled:skips===2&&timing==='later'};
}
export function scopeCheck(q){
 if(/(?:ignore|override|forget).*(?:instructions|rules|previous)|system prompt|api.?key|reveal.*secret/i.test(q)) return 'unsupported';
 if(/(?:best|recommend|which|right|wrong|good|buy|sell).{0,35}(?:fund|stock)|(?:fund|stock).{0,35}(?:best|buy|sell|recommend)|how much.*invest|should i.*(?:invest|sell|buy|redeem|skip|reduce|increase)|guarantee.*return|maximi[sz]e|market.*(?:today|tomorrow|predict)|कौन.*(?:फंड|शेयर)|कितना.*निवेश|konsa.*fund/i.test(q))return 'advice';
 if(/\b(?:pan|account number|password|otp)\s*(?:is|:|=)\s*\S+|\b[A-Z]{5}[0-9]{4}[A-Z]\b|\b\d{12,18}\b/i.test(q))return 'private';
 return null;
}
export function retrieve(q,context={}){
 const stop=new Set(['the','a','an','is','it','in','on','of','my','to','for','what','how','are','and','or','with','this','that','can','do','i','me','you','does','will','be','your','we','from','after','before','have','has','was','as','at','so','by']);
 const words=(q.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[]).filter(w=>!stop.has(w));
 const short=/^(why|what happens|explain|help|i don.t understand|show me|what about this)[?.! ]*$/i.test(q.trim());
 const ranked=rules.map(r=>{
 const terms=new Set((r.tags+' '+r.title).toLowerCase().match(/[\p{L}\p{N}]+/gu));
 let score=words.reduce((s,w)=>s+(w.length>1&&terms.has(w)?1:0),0);
 if(short&&context.task){if(r.id===context.task||(context.task==='payment'&&r.id==='failed')) score+=3;}
 if(r.id==='missing'&&/not (?:show|reflect)|missing|gayab|गायब/i.test(q))score+=6;
 if(r.id==='third-skip'&&/three|third|\b3\b|teesr|तीन/i.test(q))score+=6;
 if(r.id==='timing'&&/tomorrow|holiday|weekend|deadline|\bkal\b|कल/i.test(q))score+=5;
 if(r.id==='cancel'&&/cancel|redeem|withdraw/i.test(q))score+=4;
 if(r.id==='deducted'&&/deduct|debit|allot|units|processing|kata|कट/i.test(q))score+=3;
 return {rule:r,score};}).filter(r=>r.score>0).sort((a,b)=>b.score-a.score);
 const chosen=ranked.slice(0,5).map(r=>r.rule);
 // Always pair potential skip timing explanations with the known source conflict.
 if(chosen.some(r=>r.id==='skip')&&!chosen.some(r=>r.id==='timing'))chosen.push(rules.find(r=>r.id==='timing'));
 return chosen;
}
export function guardReply(kind){
 return {mode:'fallback',title:kind==='advice'?'I can explain the process':kind==='private'?'Please leave account details out':'I cannot confirm that',
 message:kind==='advice'?'I cannot choose funds, investment amounts or whether you should continue, skip or sell. I can explain what the SIP controls do so you can make your own decision.':kind==='private'?'Please remove personal account details, PAN, passwords or OTPs. You can use a fictional situation here.':'That question is outside the verified rule set. Please check Groww Help for an account-specific answer.',blocks:[],sources:[],kind};
}
export function guideAnswer(question,rawContext={}){
 const context=cleanContext(rawContext);const guard=scopeCheck(question);if(guard)return guardReply(guard);
 if(context.intent==='check')return checkGuide(question,context);
 const found=retrieve(question,context);if(!found.length)return guardReply('unsupported');
 let selected=found.slice(0,2);
 if(selected[0]?.id==='edit'&&context.task==='edit') selected=[rules.find(r=>r.id==='edit')];
 return {mode:'guide',title:'From the official help pages',message:'These are saved source explanations, not a live AI answer.',blocks:selected.map(r=>({id:r.id,title:r.title,text:r.text})),sources:getSources(selected.flatMap(r=>r.sources)),kind:'supported'};
}
export function checkModelSelection(output,found){
 if(!output||!Array.isArray(output.ruleIds)||output.ruleIds.length>3||!['answer','clarify','unsupported'].includes(output.action))return false;
 if(output.action==='answer'&&output.ruleIds.length===0)return false;
 if(output.ruleIds.some(id=>!found.some(r=>r.id===id)))return false;
 return ['none','payment_state','timing','skip_history'].includes(output.clarification);
}

export function sampleExpectation(raw){
 const c=cleanContext(raw);
 if(c.task==='edit'&&c.timing){const o=editOutcome(c.amount,c.timing);return {text:`In this fictional sample, the next instalment is ₹${o.next} and the following instalment is ₹${o.following}. Existing investments are unchanged.`,ids:['edit']};}
 if(c.task==='skip'&&c.timing){const o=skipOutcome(c.timing,c.skips);return {text:`In this fictional sample, the next instalment is ${o.next}; the following instalment is ${o.following}. ${c.timing==='near'?'This assumes the upcoming payment succeeds and breaks any prior consecutive skips. ':''}This is sample timing, not a confirmed real deadline.`,ids:o.cancelled?['third-skip','timing']:['skip','timing']};}
 if(c.task==='payment'&&c.debit&&c.status){
 if(c.debit==='yes'&&c.status==='missing')return {text:'Money has been deducted but no order is visible. Do not pay again merely because the order is missing. Groww says to contact support if this persists more than 2 working days after deduction.',ids:['missing','deducted']};
 if(c.debit==='yes'&&c.status==='processing')return {text:'The visible order is processing. Deduction is not unit allotment. Groww describes up to 5–6 business days depending on payment method and fund. Do not pay again merely because allotment is pending.',ids:['deducted']};
 if(c.debit==='no'&&c.status==='failed')return {text:'The displayed debit failed. Check whether the dashboard offers Pay. The cause and retry eligibility are not established by this sample; do not assume insufficient balance.',ids:['failed','retry']};
 return {text:'The information is incomplete or conflicting. Verify the full status with Groww support; do not assume failure, completion, a refund, or a need to pay again.',ids:['deducted']};
 }
 return null;
}
export function checkGuide(question,context){
 const guard=scopeCheck(question);if(guard)return guardReply(guard);
 const expected=sampleExpectation(context);
 if(!expected)return {...guardReply('unsupported'),message:'Choose a complete sample situation before checking an expectation.'};
 return {mode:'guide',kind:'reference',title:'Compare your expectation with the sample',message:'Live AI checking is not enabled. This reference explains the sample; it has not judged your answer.',blocks:[{id:'sample',title:'Expected sample outcome',text:expected.text}],sources:getSources(rules.filter(r=>expected.ids.includes(r.id)).flatMap(r=>r.sources))};
}
