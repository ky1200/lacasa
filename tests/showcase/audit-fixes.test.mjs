import {mediaDOM} from '../helpers/media-dom.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import content from '../../lacasa.json' with {type:'json'};
import samples from '../../lacasa.sample.json' with {type:'json'};
import {stateFor,deadlineCalendar,listTotals} from '../../showcase/domain.mjs';
import {canonicalItemURL} from '../../showcase/routes.mjs';
import {renderPage,listText,choosePage,itemPath} from '../../showcase/render.mjs';
import {visitorState} from '../../showcase/server.mjs';
const seed=samples.decisions[0];
const real=(id,extra={})=>({...structuredClone(seed),id,slug:id,title:id,sample:false,category:'Test category',...extra});
const state=(decisions,votes=[],finals=[])=>stateFor({...content,decisions},{decisions:[]},'KY',votes,finals,false,'2026-10-23');
const visible=html=>html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');

test('unknown line prices and an all-unpriced subtotal never become S$0',()=>{
 const s=state([real('unknown',{status:'draft',options:[],roughBudget:undefined})]);
 const html=renderPage(s,'/list').html;
 assert.match(html,/<strong>Price TBC<\/strong>/);
 assert.match(html,/<span class="subtotal">Price TBC<\/span>/);
 assert.match(listText(s),/unknown: Price TBC/);
 assert.doesNotMatch(html,/<span class="subtotal">S\$0/);
});
test('mixed group subtotals retain the priced range and TBC count',()=>{
 const s=state([real('known',{options:[{id:'a',price:900},{id:'b',price:1200}]}),real('unknown',{options:[],roughBudget:undefined})]);
 assert.match(renderPage(s,'/list').html,/<span class="subtotal">S\$900–1,200 \+ 1 price TBC<\/span>/);
 const totals=listTotals(s.content,s.results);assert.deepEqual([totals.min,totals.max,totals.tbc],[900,1200,1]);
});
test('a genuine zero-price none option stays zero',()=>{
 const d=real('none',{options:[{id:'none',label:'None',kind:'none',price:0}]});
 const s=state([d],[{code:'KY',decision_id:d.id,pick:'none'},{code:'KX',decision_id:d.id,pick:'none'},{code:'KS',decision_id:d.id,pick:'none'}]);
 assert.match(renderPage(s,'/list').html,/<span class="subtotal">S\$0<\/span>/);
 assert.match(listText(s),/none: S\$0 · None/);
});
test('estimates read "about"  without braces in lines, subtotals, totals and copied text',()=>{
 const s=state([real('estimate',{options:[],roughBudget:{min:1500,max:3500,source:'Rough guess, to research'}})]),html=renderPage(s,'/list').html;
 assert.match(html,/<span class="subtotal">about S\$1,500–3,500<\/span>/);
 assert.match(html,/<strong>about S\$1,500–3,500<\/strong>/);
 assert.match(listText(s),/estimate: about S\$1,500–3,500/);
 assert.doesNotMatch(visible(html),/[{}]/);
});
test('the requested budget allowances are present with their provenance',()=>{
 const expected={'Sofa':[1500,3500],'TV console':[300,800],'Dining table and chairs':[800,2000],'Robot vacuum':[600,1500],'Handheld vacuum':[150,400],'Air purifier':[200,500],'Water dispenser':[800,1800],'Light switches':[300,1000]};
 for(const [title,[min,max]] of Object.entries(expected)){const b=content.decisions.find(d=>d.title===title).roughBudget;assert.deepEqual([b.min,b.max],[min,max],title);assert.ok(b.source,title);}
});
test('every legacy item and comparison address redirects with its query preserved',()=>{
 for(const d of [...content.decisions,...samples.decisions])for(const old of d.legacySlugs??[])for(const prefix of ['','/audit'])for(const suffix of ['','/compare']){
  const query='?models=alpha,beta&differences=only&samples=on';
  const url=`${prefix}/${d.area}/${old}${suffix}${query}`;
  assert.equal(canonicalItemURL(url,content,samples),`${prefix}/${d.area}/${d.slug}${suffix}${query}`);
 }
 assert.equal(canonicalItemURL('/kitchen/fridge',content,samples),null);
 assert.equal(canonicalItemURL('/kitchen/unrelated',content,samples),null);
 assert.equal(new Set(content.decisions.map(d=>itemPath(content,d))).size,content.decisions.length);
 for(const d of content.decisions)assert.ok(!d.slug.startsWith(d.area+'-'));
});
test('vote navigation has Back, Skip for now and Next and stops at the end',()=>{
 const s=state([real('first'),real('second')]);
 const first=renderPage(s,'/vote').html,second=renderPage(s,'/vote?item=second').html;
 const nav=first.match(/<nav class="queue-nav"[\s\S]*?<\/nav>/)[0];
 assert.match(nav,/← Back[\s\S]*Skip for now[\s\S]*Next →/);
 assert.equal((nav.match(/href="\/vote\?item=second&amp;trail=first"/g)??[]).length,2);
 assert.match(second,/href="\/vote\?end=1&amp;trail=second"[^>]*>Skip for now/);
 const end=renderPage(s,'/vote?end=1').html;
 assert.match(end,/<h1>All done for now\.<\/h1>/);assert.match(end,/2 choices remain/);assert.match(end,/Return to 2 choices/);
 assert.deepEqual(s.ownVotes,{});
});
test('all answered and all locked queues end with All done and a list link',()=>{
 const d=real('done'),votes=[{code:'KY',decision_id:d.id,pick:d.options[0].id,lean:d.options[1].id}];
 for(const finals of [[],[{decision_id:d.id,option_id:d.options[0].id,reason:'lock'}]]){
  const html=renderPage(state([d],votes,finals),'/vote').html;
  assert.match(html,/<h1>All done\.<\/h1>/);assert.match(html,/Results appear when everyone has voted/);assert.match(html,/href="\/list"/);
 }
});
test('audit vote preview has the same three controls and a finite All done screen',()=>{
 const s=visitorState(content,samples,{audit:true},[],[]);
 const first=renderPage(s,'/audit/vote').html;
 assert.match(first,/← Back[\s\S]*Skip for now[\s\S]*Next →/);
 const last=renderPage(s,'/audit/vote?item=handheld-vacuum').html;
 assert.match(last,/href="\/audit\/vote\?end=1&amp;trail=handheld-vacuum"[^>]*>Next/);
 const end=renderPage(s,'/audit/vote?end=1').html;
 assert.match(end,/<h1>All done\.<\/h1>/);assert.match(end,/No votes were saved/);assert.doesNotMatch(end,/ data-vote=/);
});
test('calendar shows exactly four weeks and 19 available days across October–November',()=>{
 const cal=deadlineCalendar('2026-10-23','2026-11-11');
 assert.equal(cal.daysLeft,19);assert.equal(cal.weeks,4);assert.equal(cal.dates.length,28);
 const available=cal.dates.filter(d=>d.available);assert.equal(available.length,19);
 assert.equal(available[0].date,'2026-10-23');assert.equal(available.at(-1).date,'2026-11-10');
 assert.equal(cal.dates.find(d=>d.deadline).date,'2026-11-11');assert.equal(cal.dates.filter(d=>d.today).length,1);
 const html=renderPage(state([]),'/').html;assert.match(html,/class="deadline-count"><strong>19<\/strong><span>days left/);
 assert.match(html,/datetime="2026-11-11" class="calendar-day deadline"/);
});
test('calendar handles today, a Sunday, month/year rollover and the next milestone',()=>{
 assert.equal(deadlineCalendar('2026-11-11','2026-11-11').daysLeft,0);
 const cal=deadlineCalendar('2026-12-27','2027-01-03');assert.equal(cal.weeks,2);assert.equal(cal.dates.filter(d=>d.available).length,7);
 const s={...state([]),today:'2026-11-12'},html=renderPage(s,'/').html;
 assert.match(html,/Key collection/);assert.match(html,/datetime="2026-12-03" class="calendar-day deadline"/);assert.doesNotMatch(html,/19<\/strong><span>days left/);
});
test('chooser has a direct name-selection heading',()=>{
 assert.match(choosePage(content),/<h1>Choose your name<\/h1>/);
});
test('sample quick takes use the requested Beta running-cost and width wording',()=>{
 assert.equal(seed.options[1].love,'Silent at night and S$25 a year cheaper to run than Alpha.');
 assert.match(seed.answer10s,/wider than 70 cm/);assert.doesNotMatch(seed.answer10s,/72 cm/);
});
test('server HTML has no empty image tags or pre-created lightbox image',()=>{
 const d=real('photo',{options:structuredClone(seed.options)});d.options[0].images=[{src:'/images/test.webp',caption:'A real photo'}];
 const html=renderPage(state([d]),'/kitchen/photo').html;
 assert.ok((html.match(/<img /g)??[]).length>=1);
 assert.doesNotMatch(html,/<dialog|Close ×/);
 for(const img of html.matchAll(/<img[^>]*>/g))assert.match(img[0],/src="[^"]+"/);
});
test('photo dialog exists only while opened and has one labelled close control',()=>{
 const {document,body,opener,source}=mediaDOM();runInNewContext(readFileSync(new URL('../../public/showcase.js',import.meta.url),'utf8'),{document,location:{search:''},URLSearchParams});
 assert.equal(body.children.length,0);opener.events.click();const dialog=document.querySelector('#lightbox');assert.equal(dialog.open,true);assert.equal(dialog.querySelector('img').src,source.src);assert.equal(dialog.querySelector('img').alt,source.alt);assert.equal(dialog.children.filter(x=>x.tag==='button').length,1);dialog.querySelector('button').events.click();assert.equal(document.querySelector('#lightbox'),null);assert.equal(body.children.length,0);opener.events.click();assert.equal(body.children.length,1);
});
