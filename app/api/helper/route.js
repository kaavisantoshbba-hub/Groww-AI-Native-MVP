import {answer,readiness,normaliseHistory,REQUEST_BUDGET_MS} from '../../../lib/provider.mjs';
export const runtime='nodejs';
export const maxDuration=60;
export async function GET(){return Response.json(readiness(),{headers:{'Cache-Control':'no-store'}})}
export async function POST(request){
 const deadline=Date.now()+REQUEST_BUDGET_MS;
 const origin=request.headers.get('origin');
 const hosts=[new URL(request.url).host,request.headers.get('host'),request.headers.get('x-forwarded-host')].filter(Boolean);
 let validOrigin=true;try{validOrigin=!origin||hosts.includes(new URL(origin).host)}catch{validOrigin=false}
 if(!validOrigin)return Response.json({error:'Please use the helper on this website.'},{status:403});
 if(Number(request.headers.get('content-length'))>12000)return Response.json({error:'Please send a shorter question.'},{status:413});
 let body;try{const text=await request.text();if(text.length>12000)throw new Error();body=JSON.parse(text)}catch{return Response.json({error:'Please send a valid question.'},{status:400})}
 if(!body||typeof body.question!=='string'||!body.question.trim()||body.question.length>600)return Response.json({error:'Please use a question between 1 and 600 characters.'},{status:400});
 const history=normaliseHistory(body.history);
 return Response.json(await answer(body.question.trim(),body.context,history,{deadline}),{headers:{'Cache-Control':'no-store'}});
}
