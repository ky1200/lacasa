import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import content from '../../lacasa.json' with {type:'json'};
import samples from '../../lacasa.sample.json' with {type:'json'};
import {DatabaseSync} from 'node:sqlite';
import {readdirSync} from 'node:fs';
import {visitorState,api} from '../../showcase/server.mjs';
import {renderPage} from '../../showcase/render.mjs';
import {BUY,buyTotals,buyCSV,lineSGD,choiceOf,buyKeys} from '../../showcase/buy-plan.mjs';
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

const items=BUY.rooms.flatMap(r=>r.items);
test('to-buy items have unique ids; TV console and own desk are gone; 3 queen mattresses; mirrors need no power',()=>{
 const ids=items.map(i=>i.id);assert.ok(ids.every(Boolean));assert.equal(new Set(ids).size,ids.length);
 assert.ok(!items.some(i=>/TV console|Secretlab/i.test(i.name)));
 for(const r of ['ky','kx','ks']){const m=items.find(i=>i.id===r+'-mattress');assert.match(m.name,/queen/i);assert.ok(m.alts.length>=3);assert.match(items.find(i=>i.id===r+'-bed').name,/queen/i);}
 for(const id of ['common-mirror','master-mirror'])assert.match(items.find(i=>i.id===id).name,/no light, no power point/);
 assert.match(items.find(i=>i.id==='washer').name,/12\.5 kg/);assert.match(items.find(i=>i.id==='kitchen-fan').name,/Dono/);
 assert.ok(items.find(i=>i.id==='fridge').alts.some(a=>/Panasonic/.test(a.name)));
 for(const i of items)[i,...(i.alts??[])].forEach((o,k)=>{const p=IMG[`${i.id}#${k}`];assert.ok(p,`photo for ${i.id}#${k}`);assert.match(p.src,/^\/images\/buy\/[a-z0-9-]+\.webp$/);assert.ok(existsSync(new URL('../../public'+p.src,import.meta.url)),p.src);});
 assert.equal(Object.keys(IMG).length,items.reduce((n,i)=>n+1+(i.alts?.length??0),0));
});
test('choices change the total: remove, pick another option, change quantity',()=>{
 const base=buyTotals().total,tv=items.find(i=>i.id==='living-lg-oled-evo-c6'),dl=items.find(i=>i.id==='living-philips-meson-5-13w');
 assert.ok(Math.abs(buyTotals(BUY,{'b:living-lg-oled-evo-c6:off':'1'}).total-(base-tv.price))<0.01);
 assert.ok(Math.abs(buyTotals(BUY,{'b:living-lg-oled-evo-c6:pick':'1'}).total-(base-tv.price+tv.alts[0].price))<0.01);
 assert.ok(Math.abs(buyTotals(BUY,{'b:living-philips-meson-5-13w:qty':'10'}).total-(base+2*dl.price/BUY.rate))<0.01);
 assert.equal(choiceOf(tv,{'b:living-lg-oled-evo-c6:pick':'99'}).pick,0);assert.equal(choiceOf(dl,{'b:living-philips-meson-5-13w:qty':'abc'}).qty,8);
 assert.equal(buyTotals(BUY,{'b:fridge:off':'1','b:washer:off':'1'}).removed,2);
 const csv=buyCSV(BUY,{'b:living-lg-oled-evo-c6:off':'1','b:fridge:pick':'1'});assert.match(csv,/LG OLED evo C6[^\n]*,0\.00,Removed,/);assert.match(csv,/Panasonic 405 L[^\n]*,Yes,Option 1,/);
});
test('to-buy page shows saved choices, quantity buttons, option picker and photos',()=>{
 const s={...visitorState(content,samples,{code:'KS',name:'KS'},[],[],false),visit:{'b:fridge:pick':'1','b:washer:off':'1','b:living-philips-meson-5-13w:qty':'12'}};
 const html=renderPage(s,'https://lacasa.test/buy').html;
 assert.match(html,/data-buy="fridge"[\s\S]*?<h3 data-f="name">Panasonic 405 L/);
 assert.match(html,/class="buy-item is-off[^"]*" id="it-washer" data-buy="washer"/);
 assert.match(html,/data-buy="living-philips-meson-5-13w"[\s\S]*?<output data-f="qty"[^>]*>12</);
 assert.match(html,/name="pick-fridge" value="1" data-b="pick" checked/);
 assert.match(html,/<button type="button" class="buy-photo main" data-enlarge[^>]*><img class="buy-img" src="\/images\/buy\//);assert.match(html,/<fieldset data-lightbox-group>/);assert.match(html,/data-b="plus"/);
 assert.match(html,/Not counted: <b data-buy-off>S\$1,339<\/b>/);assert.match(html,/class="buy-day sale[^"]*" href="#day-2026-11-27"/);assert.match(html,/id="day-2026-12-12"/);assert.doesNotMatch(html,/[Rr]ough/);
 assert.match(html,new RegExp('data-buy-total>S\\$'+Math.round(buyTotals(BUY,s.visit).total).toLocaleString('en-SG')));
 const text=html.replace(/<[^>]+>/g,' ');assert.doesNotMatch(text,/\byou\b|\byour\b|perfect|amazing/i);
 const audit=renderPage({...visitorState(content,samples,{code:'AUDIT',audit:true,readOnly:true}),visit:{}},'https://lacasa.test/audit/buy');assert.match(audit.html,/data-b="in" checked disabled/);
});
function database(){const sqlite=new DatabaseSync(':memory:');for(const f of readdirSync(new URL('../../migrations/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sqlite.exec(readFileSync(new URL('../../migrations/'+f,import.meta.url),'utf8'));const prepare=(sql,args=[])=>({bind(...values){return prepare(sql,values);},async all(){return{results:sqlite.prepare(sql).all(...args)};},async run(){sqlite.prepare(sql).run(...args);return{};},async first(){return sqlite.prepare(sql).get(...args)??null;}});return {sqlite,prepare:sql=>prepare(sql),batch:async ss=>Promise.all(ss.map(s=>s.run()))};}
const put=async(DB,code,key,value,view='')=>{const headers={'content-type':'application/json',origin:'https://lacasa.test'};if(code)headers.cookie='lacasa_person='+code;const res=await api(new Request('https://lacasa.test/api/buy/'+encodeURIComponent(key)+view,{method:'PUT',headers,body:JSON.stringify({value})}),{DB},content,samples);return res.status;};
test('to-buy API saves shared choices and rejects bad keys and values',async()=>{
 const DB=database();
 assert.equal(await put(DB,'KX','b:fridge:pick','2'),200);assert.equal(await put(DB,'KS','b:washer:off','1'),200);assert.equal(await put(DB,'KY','b:living-philips-meson-5-13w:qty','10'),200);
 assert.equal(await put(DB,'KX','b:fridge:pick','9'),422);assert.equal(await put(DB,'KX','b:fridge:pick','0'),422);assert.equal(await put(DB,'KX','b:washer:off','yes'),422);
 assert.equal(await put(DB,'KX','b:washer:qty','100'),422);assert.equal(await put(DB,'KX','b:nope:off','1'),422);assert.equal(await put(DB,'KX','b:contractor-mcst-renovation-deposit-refundable:pick','1'),422);
 assert.equal(await put(DB,null,'b:fridge:off','1'),401);assert.equal(await put(DB,'KX','b:fridge:off','1','?view=audit'),403);
 assert.equal(DB.sqlite.prepare("SELECT COUNT(*) n FROM visit_notes WHERE key LIKE 'b:%'").get().n,3);
 assert.equal(await put(DB,'KX','b:fridge:pick',''),200);assert.equal(DB.sqlite.prepare("SELECT COUNT(*) n FROM visit_notes").get().n,2);
 assert.ok(buyKeys().has('b:ky-mattress:pick'));
});
