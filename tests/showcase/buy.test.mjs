import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import content from '../../lacasa.json' with {type:'json'};
import samples from '../../lacasa.sample.json' with {type:'json'};
import {DatabaseSync} from 'node:sqlite';
import {readdirSync} from 'node:fs';
import {visitorState,api} from '../../showcase/server.mjs';
import {renderPage} from '../../showcase/render.mjs';
import {BUY,buyTotals,buyCSV,lineSGD,choiceOf,buyKeys,validBuyValue} from '../../showcase/buy-plan.mjs';
import {IMG} from '../../showcase/buy-images.mjs';
import {dayLabel} from '../../showcase/buy.mjs';

test('to-buy plan: every item has price, currency, shop and a valid buy date; links are https or local files',()=>{
 for(const r of BUY.rooms)for(const i of r.items){
  assert.ok(Number.isFinite(i.price),i.name);assert.ok(['SGD','MYR'].includes(i.cur),i.name);assert.ok(i.shop,i.name);
  assert.match(i.date,/^2026-1[12]-\d\d$/,i.name);
  for(const a of i.alts??[]){assert.ok(Number.isFinite(a.price)&&['SGD','MYR'].includes(a.cur)&&a.shop&&a.name,a.name);}
  for(const href of [i.href,i.src,...(i.alts??[]).map(a=>a.href)].filter(Boolean))assert.match(href,/^(https:\/\/|\/files\/)/,href);
 }
 for(const f of BUY.files)assert.ok(existsSync(new URL('../../public'+f.href,import.meta.url)),f.href);
});
test('to-buy totals add up and RM converts at the stated rate',()=>{
 const t=buyTotals();
 const sum=BUY.rooms.flatMap(r=>r.items).filter(i=>i.tag!=='maybe').reduce((s,i)=>s+(i.cur==='MYR'?i.price/BUY.rate:i.price)*(i.qty??1),0);
 assert.ok(Math.abs(t.total-sum)<0.01);assert.ok(Math.abs(t.before+t.after-t.total)<0.01);assert.equal(t.after,0);
 assert.ok(t.removed>=1&&t.offTotal>0,'on-hold reno items start as Maybe');
 assert.equal(Math.round(lineSGD({price:317,cur:'MYR',qty:1},3.17)),100);
 assert.equal(dayLabel('2026-11-27'),'Fri 27 Nov');assert.equal(dayLabel('2026-12-12'),'Sat 12 Dec');
});
test('to-buy CSV has one row per item plus header and before, after, total and maybe rows',()=>{
 const csv=buyCSV(),n=BUY.rooms.reduce((s,r)=>s+r.items.length,0);
 const lines=csv.trim().split('\n');assert.equal(lines.length,n+6);assert.match(lines.at(-4),/^Before move-in,/);assert.match(lines.at(-3),/^After move-in,/);assert.match(lines.at(-2),/^Total \(before \+ after\),/);assert.match(lines.at(-1),/^Maybe \(not in total\),/);
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

const items=BUY.rooms.flatMap(r=>r.items);
test('to-buy items have unique ids; TV console and own desk are gone; 3 queen mattresses; mirrors need no power',()=>{
 const ids=items.map(i=>i.id);assert.ok(ids.every(Boolean));assert.equal(new Set(ids).size,ids.length);
 assert.ok(!items.some(i=>/TV console|Secretlab/i.test(i.name)));
 for(const r of ['ky','kx','ks']){const m=items.find(i=>i.id===r+'-mattress');assert.match(m.name,/queen/i);assert.ok(m.ordered,'mattress ordered');assert.match(items.find(i=>i.id===r+'-bed').name,/queen/i);}
 for(const id of ['common-mirror','master-mirror'])assert.match(items.find(i=>i.id===id).name,/no light, no power point/);
 assert.match(items.find(i=>i.id==='washer').name,/12\.5 kg/);assert.match(items.find(i=>i.id==='kitchen-fan').name,/Dono/);
 assert.ok(items.find(i=>i.id==='fridge').alts.some(a=>/Panasonic/.test(a.name)));
 const pictured=BUY.rooms.filter(r=>r.id!=='contractor').flatMap(r=>r.items);
 for(const i of pictured)[i,...(i.alts??[])].forEach((o,k)=>{const p=IMG[`${i.id}#${k}`];assert.ok(p,`photo for ${i.id}#${k}`);assert.match(p.src,/^\/images\/buy\/[a-z0-9-]+\.webp$/);assert.ok(existsSync(new URL('../../public'+p.src,import.meta.url)),p.src);});
 assert.ok(!Object.keys(IMG).some(k=>k.startsWith('contractor-')),'contractor lines have no photos');
 assert.equal(Object.keys(IMG).length,pictured.reduce((n,i)=>n+1+(i.alts?.length??0),0));
});
test('choices change the total: remove, pick another option, change quantity',()=>{
 const base=buyTotals().total,tv=items.find(i=>i.id==='living-lg-oled-evo-c6'),dl=items.find(i=>i.id==='living-philips-meson-5-13w');
 assert.ok(Math.abs(buyTotals(BUY,{'b:living-lg-oled-evo-c6:off':'1'}).total-(base-tv.price))<0.01);
 assert.ok(Math.abs(buyTotals(BUY,{'b:living-lg-oled-evo-c6:pick':'1'}).total-(base-tv.price+tv.alts[0].price))<0.01);
 assert.ok(Math.abs(buyTotals(BUY,{'b:living-philips-meson-5-13w:qty':'10'}).total-(base+2*dl.price/BUY.rate))<0.01);
 assert.equal(choiceOf(tv,{'b:living-lg-oled-evo-c6:pick':'99'}).pick,0);assert.equal(choiceOf(dl,{'b:living-philips-meson-5-13w:qty':'abc'}).qty,8);
 assert.equal(buyTotals(BUY,{'b:fridge:off':'1','b:washer:off':'1'}).removed,buyTotals().removed+2);
 const csv=buyCSV(BUY,{'b:living-lg-oled-evo-c6:off':'1','b:fridge:pick':'1','b:washer:tag':'after'});assert.match(csv,/LG OLED evo C6[^\n]*,3254\.00,Maybe,/);assert.match(csv,/Panasonic 405 L[^\n]*,Before move-in,Option 1,/);assert.match(csv,/Panasonic 12\.5 kg[^\n]*,After move-in,/);
 const wash=items.find(i=>i.id==='washer'),after=buyTotals(BUY,{'b:washer:tag':'after'});
 assert.ok(Math.abs(after.after-wash.price)<0.01);assert.ok(Math.abs(after.total-base)<0.01);assert.ok(Math.abs(after.before-(buyTotals().before-wash.price))<0.01);
 assert.ok(Math.abs(buyTotals(BUY,{'b:living-homepod-mini-2-back:tag':'maybe'}).total-(base-2*199))<0.01);
 assert.equal(choiceOf(tv,{'b:living-lg-oled-evo-c6:off':'1','b:living-lg-oled-evo-c6:tag':'after'}).tag,'after','a chosen tag wins over the old switch');
 const bed=items.find(i=>i.id==='contractor-platform-bed-d3');assert.equal(choiceOf(bed).tag,'maybe');assert.equal(choiceOf(bed,{'b:contractor-platform-bed-d3:tag':'before'}).tag,'before');
 assert.equal(choiceOf(tv,{'b:living-lg-oled-evo-c6:tag':'later'}).tag,'before');
});
test('to-buy page shows saved choices, quantity buttons, option picker and photos',()=>{
 const s={...visitorState(content,samples,{code:'KS',name:'KS'},[],[],false),visit:{'b:fridge:pick':'1','b:washer:off':'1','b:living-philips-meson-5-13w:qty':'12'}};
 const html=renderPage(s,'https://lacasa.test/buy').html;
 assert.match(html,/data-buy="fridge"[\s\S]*?<h3 data-f="name">Panasonic 405 L/);
 assert.match(html,/class="buy-item is-off[^"]*" id="it-washer" data-buy="washer"/);
 assert.match(html,/data-buy="living-philips-meson-5-13w"[\s\S]*?<output data-f="qty"[^>]*>12</);
 assert.match(html,/name="pick-fridge" value="1" data-b="pick" checked/);
 assert.match(html,/<button type="button" class="buy-photo main" data-enlarge[^>]*><img class="buy-img" src="\/images\/buy\//);assert.match(html,/<fieldset data-lightbox-group>/);assert.match(html,/data-b="plus"/);
 assert.match(html,/Maybe, not in total: <b data-buy-off>S\$[\d,]+<\/b>/);assert.match(html,/name="tag-washer" value="maybe" data-b="tag" checked/);assert.match(html,/data-buy-before>S\$[\d,]+</);assert.match(html,/data-buy-after>S\$0</);
 assert.match(html,/id="buy-decisions"[^>]*><details><summary><h2>Final reno decisions sent to I-Niche, 21 Nov<\/h2>[\s\S]*?<p class="buy-dec-note">Waiting for the I-Niche revised quote/);
 const firstRoom=html.indexOf('id="buy-contractor"');for(const id of ['buy-decisions','buy-measure','buy-dates','buy-qa'])assert.ok(html.indexOf(`id="${id}"`)>firstRoom,id+' sits below the rooms, folded');assert.ok(html.indexOf('id="buy-files"')<firstRoom,'contractor files near the top');assert.match(html,/class="dock-pop dock-files"[\s\S]*?href="\/files\//,'files reachable from the dock');assert.match(html,/<span class="buy-dec is-off">Removed<\/span><div><b>D4: L-shaped wardrobe/);assert.match(html,/E2 \+ E2a: glass sliding door at the kitchen entrance/);assert.doesNotMatch(html.slice(html.indexOf('id="buy-contractor"'),html.indexOf('id="buy-aircon"')),/buy-photo/,'no photos in the contractor room');assert.match(html,/id="buy-measure"[\s\S]*?LAN ports/);assert.match(html,/id="buy-lights"[\s\S]*?Eyeball light/);assert.doesNotMatch(html,/id="buy-mattress-brands"/,"beds bought, brand list gone");assert.match(html,/name="buy-show" value="maybe" data-show/);assert.match(html,/<nav class="dock" data-dock aria-label="Sections on this page">/);assert.match(html,/data-dock-link="buy-kx"[^>]*data-sum="kx"/);assert.match(html,/class="sec-close" data-sec-close>Close KX bedroom/);for(const r of BUY.rooms)assert.match(html,new RegExp(`href="#buy-${r.id}" data-dock-link="buy-${r.id}"`));assert.match(html,/class="buy-day sale[^"]*" href="#day-2026-11-27"/);assert.match(html,/id="day-2026-12-12"/);assert.doesNotMatch(html,/[Rr]ough/);
 assert.match(html,new RegExp('data-buy-total>S\\$'+Math.round(buyTotals(BUY,s.visit).total).toLocaleString('en-SG')));
 const text=html.replace(/<[^>]+>/g,' ');assert.doesNotMatch(text,/\byou\b|\byour\b|perfect|amazing/i);
 const audit=renderPage({...visitorState(content,samples,{code:'AUDIT',audit:true,readOnly:true}),visit:{}},'https://lacasa.test/audit/buy');assert.match(audit.html,/value="before" data-b="tag" checked disabled/);
});
function database(){const sqlite=new DatabaseSync(':memory:');for(const f of readdirSync(new URL('../../migrations/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sqlite.exec(readFileSync(new URL('../../migrations/'+f,import.meta.url),'utf8'));const prepare=(sql,args=[])=>({bind(...values){return prepare(sql,values);},async all(){return{results:sqlite.prepare(sql).all(...args)};},async run(){sqlite.prepare(sql).run(...args);return{};},async first(){return sqlite.prepare(sql).get(...args)??null;}});return {sqlite,prepare:sql=>prepare(sql),batch:async ss=>Promise.all(ss.map(s=>s.run()))};}
const put=async(DB,code,key,value,view='')=>{const headers={'content-type':'application/json',origin:'https://lacasa.test'};if(code)headers.cookie='lacasa_person='+code;const res=await api(new Request('https://lacasa.test/api/buy/'+encodeURIComponent(key)+view,{method:'PUT',headers,body:JSON.stringify({value})}),{DB},content,samples);return res.status;};
test('to-buy API saves shared choices and rejects bad keys and values',async()=>{
 const DB=database();
 assert.equal(await put(DB,'KX','b:fridge:pick','2'),200);assert.equal(await put(DB,'KS','b:washer:off','1'),200);assert.equal(await put(DB,'KY','b:living-philips-meson-5-13w:qty','10'),200);
 assert.equal(await put(DB,'KX','b:fridge:pick','9'),422);assert.equal(await put(DB,'KX','b:fridge:pick','0'),422);assert.equal(await put(DB,'KX','b:washer:off','yes'),422);
 assert.equal(await put(DB,'KX','b:washer:qty','100'),422);assert.equal(await put(DB,'KX','b:nope:off','1'),422);assert.equal(await put(DB,'KX','b:contractor-mcst-renovation-deposit-refundable:pick','1'),422);
 assert.equal(await put(DB,null,'b:fridge:off','yes'),422,'no name needed; the value is still checked');assert.equal(await put(DB,'KX','b:fridge:off','1','?view=audit'),403);
 assert.equal(DB.sqlite.prepare("SELECT COUNT(*) n FROM visit_notes WHERE key LIKE 'b:%'").get().n,3);
 assert.equal(await put(DB,'KX','b:fridge:pick',''),200);assert.equal(DB.sqlite.prepare("SELECT COUNT(*) n FROM visit_notes").get().n,2);
 assert.ok(buyKeys().has('b:fridge:pick'));
 assert.equal(await put(DB,'KY','b:washer:tag','after'),200);assert.equal(await put(DB,'KY','b:washer:tag','later'),422);assert.equal(await put(DB,'KY','b:washer:tag','maybe'),200);assert.equal(await put(DB,'KY','b:washer:tag',''),200);
});

test('to-buy: to-do list near the top with shared ticks; clear file cards; vinyl decided; contractor fan and false ceiling gone',async()=>{
 const s={...visitorState(content,samples,{code:'FAMILY',name:'Family'},[],[],false),visit:{'t:aircon':'1'}},html=renderPage(s,'https://lacasa.test/buy').html;
 assert.ok(html.indexOf('id="buy-todo"')<html.indexOf('id="buy-contractor"'),'to-do sits above the rooms');assert.doesNotMatch(html,/Tell BM|Mattress fair/);
 for(const t of ['SP Services','Renovation form','Order the aircon','Fibre broadband: sign up','Ask ANZ'])assert.match(html,new RegExp('id="buy-todo"[\\s\\S]*?'+t));
 assert.match(html,/<li class="is-done"><label><input type="checkbox" data-todo="t:aircon" checked>/);assert.match(html,/<span data-todo-done>1<\/span> of \d+ done/);
 assert.ok(buyKeys().has('t:sp'));assert.ok(validBuyValue(buyKeys().get('t:sp'),'1'));assert.ok(!validBuyValue(buyKeys().get('t:sp'),'yes'));
 assert.match(html,/<a class="buy-file" href="\/files\/iniche-quotation-2026-11-13\.pdf" target="_blank"[^>]*><span class="buy-file-icon"[^>]*>PDF<\/span>[\s\S]*?Open ↗/);
 assert.match(html,/id="it-contractor-f2-vinyl-3-bedrooms"[\s\S]*?<span class="buy-decided">Decided<\/span>/);
 assert.ok(!items.some(i=>/exhaust|false ceiling/i.test(i.name)),'no window exhaust fan or false ceiling items');
 for(const t of BUY.todo){if(t.date)assert.match(t.date,/^2026-1[12]-\d\d$/);if(t.href?.startsWith("#"))assert.ok(html.includes(`id="${t.href.slice(1)}"`),t.href);else if(t.href)assert.match(t.href,/^\/research#r-/);}
});

test('payments: exact paid and left per order, due dates, delivery steps on /buy and home',async()=>{
 const {orderSums}=await import('../../showcase/buy.mjs');
 const d=BUY.orders.find(o=>o.id==='dunlopillo'),v=BUY.orders.find(o=>o.id==='vhaus');
 assert.deepEqual(orderSums(d),{paid:8000,left:11999});assert.deepEqual(orderSums(v),{paid:4355,left:10161.62});
 assert.equal(d.due[0].date,'2026-12-19');assert.ok(v.steps.some(x=>x.date==='2026-12-08'));
 const s={...visitorState(content,samples,{code:'FAMILY',name:'Family'},[],[],false),visit:{}},html=renderPage(s,'https://lacasa.test/buy').html;
 assert.match(html,/id="buy-pay"[\s\S]*?Still to pay<b>RM22,160\.62/);assert.match(html,/Next payment: <b>RM11,999<\/b>/);
 assert.ok(html.indexOf('id="buy-pay"')<html.indexOf('id="buy-contractor"'));assert.match(html,/id="day-2026-12-08"[\s\S]*?V Haus measures/);
 assert.match(renderPage(s,'https://lacasa.test/').html,/Pay RM11,999 by Sat 19 Dec/);
});
