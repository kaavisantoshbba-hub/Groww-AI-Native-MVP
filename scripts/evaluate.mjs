import {writeFileSync} from 'node:fs';
import {guideAnswer} from '../lib/engine.mjs';
import {answer,corpusHash,implementationHash,modelName} from '../lib/provider.mjs';
import golden from '../tests/golden.mjs';
import expectations from '../tests/expectations.mjs';
const live=process.argv.includes('--live');
if(live&&!process.env.GEMINI_API_KEY){console.error('Live evaluation not run: configure GEMINI_API_KEY privately in your server environment.');process.exit(1)}
const results=[];
for(const c of [...golden,...expectations]){
 try{
 const a=live?await answer(c.q,c.context,c.history||[]):guideAnswer(c.q,c.context);
 const sourceCheck=(a.mode==='ai'&&a.kind!=='clarify')?a.sources.length>0:a.blocks.length===0||a.sources.length>0;
 const paymentSafe=!(c.context?.debit==='yes'&&(a.ruleIds||a.blocks.map(b=>b.id)).some(id=>['failed','retry'].includes(id)));
 let pass;
 if(c.verdict)pass=live?a.kind==='checked'&&a.verdict===c.verdict:a.kind==='reference'&&!a.verdict;
 else pass=c.guard?a.kind===c.guard:(c.allowClarify&&a.kind==='clarify')||(a.ruleIds||a.blocks.map(b=>b.id)).some(id=>c.ids.includes(id));
 pass=Boolean(pass&&sourceCheck&&paymentSafe);
 results.push({id:c.id,question:c.q,context:c.context||{},expected:c.verdict||c.guard||c.ids,actual:a.verdict||(a.kind==='supported'?(a.ruleIds||a.blocks.map(b=>b.id)):a.kind),checks:{sourceCheck,paymentSafe},pass,answer:a});
 }catch{results.push({id:c.id,question:c.q,pass:false,error:'Provider request failed; no credential details recorded'})}
}
const report={status:live?'live_answer_checks':'software_check_only',evaluatedAt:new Date().toISOString(),total:results.length,passed:results.filter(r=>r.pass).length,failed:results.filter(r=>!r.pass).length,model:live?(modelName()):null,corpusHash:corpusHash(),implementationHash:implementationHash(),humanReview:'pending',formalEvaluation:'in progress',note:'Automated routing, source-presence, per-answer validation and expectation checks. Human-labelled answer accuracy is not established by these checks. Human review of every answer remains required. Not a retention result.',results};
writeFileSync(live?'lib/live-evaluation.json':'public/evaluation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({mode:report.status,total:report.total,passed:report.passed,failed:report.failed,humanReview:report.humanReview}));
if(report.failed)process.exitCode=1;
