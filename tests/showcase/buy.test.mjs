import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import content from '../../lacasa.json' with {type:'json'};
import samples from '../../lacasa.sample.json' with {type:'json'};
import {visitorState} from '../../showcase/server.mjs';
import {renderPage} from '../../showcase/render.mjs';
import {BUY,buyTotals,buyCSV,lineSGD} from '../../showcase/buy-plan.mjs';
import {dayLabel} from '../../showcase/buy.mjs';

test('to-buy plan: every item has price, currency, shop and a valid buy date; links are https or local files',()=>{
 for(const r of BUY.rooms)for(const i of r.items){
  assert.ok(Number.isFinite(i.price),i.name);assert.ok(['SGD','MYR'].includes(i.cur),i.name);assert.ok(i.shop,i.name);
  assert.match(i.date,/^2026-1[12]-\d\d$/,i.name);
  for(const href of [i.href,i.src,...(i.alts??[]).map(a=>a.href)].filter(Boolean))assert.match(href,/^(https:\/\/|\/files\/)/,href);
 }
 for(const f of BUY.files)assert.ok(existsSync(new URL('../../public'+f.href,import.meta.url)),f.href);
});
test('to-buy totals add up and RM converts at the stated rate',()=>{
 const t=buyTotals();
 const sum=BUY.rooms.flatMap(r=>r.items).reduce((s,i)=>s+(i.cur==='MYR'?i.price/BUY.rate:i.price)*(i.qty??1),0);
 assert.ok(Math.abs(t.total-sum)<0.01);
 assert.equal(Math.round(lineSGD({price:317,cur:'MYR',qty:1},3.17)),100);
 assert.equal(dayLabel('2026-11-27'),'Fri 27 Nov');assert.equal(dayLabel('2026-12-12'),'Sat 12 Dec');
});
test('to-buy CSV has one row per item plus header and total',()=>{
 const csv=buyCSV(),n=BUY.rooms.reduce((s,r)=>s+r.items.length,0);
 const lines=csv.trim().split('\n');assert.equal(lines.length,n+3);assert.match(lines.at(-1),/^Total,/);
});
test('to-buy page renders for a family member, with no personal address and plain wording',()=>{
 const s=visitorState(content,samples,{code:'KY',name:'KY'},[],[],false);
 const {html,status}=renderPage(s,'https://lacasa.test/buy');assert.equal(status,200);
 assert.match(html,/To-buy list/);assert.match(html,/href="\/buy.csv"/);assert.match(html,/iniche-quotation-2026-11-13\.pdf/);
 assert.doesNotMatch(html,/Woodlands Drive|#07-31|737894/);
 const text=html.replace(/<[^>]+>/g,' ');assert.doesNotMatch(text,/\byou\b|\byour\b|perfect|amazing/i);
 assert.match(renderPage(s,'https://lacasa.test/').html,/href="\/buy"/);
});
test('redacted PDFs carry no text layer',()=>{
 for(const f of BUY.files){const b=readFileSync(new URL('../../public'+f.href,import.meta.url)).toString('latin1');assert.doesNotMatch(b,/Woodlands|737894|G3531035K/);}
});
