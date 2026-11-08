import test from 'node:test';
import assert from 'node:assert/strict';
import {sampleExpectation,guideAnswer,cleanContext} from '../lib/engine.mjs';

test('Free-text fallback never claims to have judged the answer',()=>{const a=guideAnswer('It changes tomorrow',{intent:'check',task:'edit',timing:'near',amount:1200});assert.equal(a.kind,'reference');assert.equal(a.verdict,undefined);assert.match(a.blocks[0].text,/₹2000/)});
test('Payment unknown does not assume order processing',()=>assert.match(sampleExpectation({task:'payment',debit:'yes',status:'unknown'}).text,/incomplete or conflicting/));
test('Missing order reference prevents duplicate payment',()=>assert.match(sampleExpectation({task:'payment',debit:'yes',status:'missing'}).text,/Do not pay again/));
test('Third skip reference explains cancellation',()=>assert.match(sampleExpectation({task:'skip',timing:'later',skips:2}).text,/cancelled/));
test('Incomplete payment sample cannot be checked',()=>assert.equal(sampleExpectation({task:'payment',debit:'yes'}),null));
test('Null request context is tolerated',()=>assert.equal(cleanContext(null).task,null));
