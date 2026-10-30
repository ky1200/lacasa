import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import content from '../../lacasa.json' with {type:'json'};
import samples from '../../lacasa.sample.json' with {type:'json'};
import {stateFor,listTotals,lineCost,canAnswer,compareRows,voteQueue} from '../../showcase/domain.mjs';
import {readinessMissing} from '../../showcase/readiness.mjs';
import {visitorState} from '../../showcase/server.mjs';
import {renderPage,listText} from '../../showcase/render.mjs';
import {shopperState} from '../../showcase/shopper.mjs';
const lock=content.decisions.find(d=>d.id==='EN01'),vac=content.decisions.find(d=>d.id==='HH-VAC');
const visible=html=>html.replace(/<script[\s\S]*?<\/script>/g,'');
const real=(id)=>({...structuredClone(samples.decisions[0]),id,slug:id,sample:false,title:id});
test('Home, default list and API state share exact live before-move-in totals',()=>{
 const c=structuredClone(content);c.decisions.push({...real('later'),stage:'later',roughBudget:{min:1,max:2},options:[]});
 const votes=['KY','KX','KS'].map(code=>({code,decision_id:vac.id,pick:vac.options[1].id}));
 for(const votesNow of [[],votes])for(const who of [{code:'KY'},{code:'KX'},{audit:true}]){
  const s=visitorState(c,samples,who,votesNow,[]),expected=listTotals(c,s.results),prefix=who.audit?'/audit':'';
  assert.deepEqual([s.budget.min,s.budget.max],[expected.min,expected.max]);
  for(const path of [prefix+'/',prefix+'/list']){
   const html=visible(renderPage(s,path).html);assert.match(html,new RegExp(`data-budget-min="${expected.min}" data-budget-max="${expected.max}" data-budget-scope="before"`));assert.doesNotMatch(html,/\{S\$/);
  }
  assert.equal(s.budget.rows.some(x=>x.d.id==='later'),false);
 }
});
test('actual option ranges override allowances and incomplete installed costs remain TBC',()=>{
 assert.deepEqual([lineCost(lock,{}).min,lineCost(lock,{}).max,lineCost(lock,{}).incomplete],[499,739,true]);
 {const prices=vac.options.map(o=>o.price);assert.deepEqual([lineCost(vac,{}).min,lineCost(vac,{}).max],[Math.min(...prices),Math.max(...prices)]);}
 const text=listText(stateFor(content,samples,'KY'),'all');assert.match(text,/Handheld vacuum: S\$55–199[^\n]*Budget about S\$150–400/);assert.match(text,/Smart door lock: S\$499–739 \+ prices TBC/);
 for(const title of ['Sofa','TV console','Dining table and chairs','Robot vacuum','Air purifier','Light switches'])assert.ok(text.split('\n').some(line=>line.includes(title+':')&&line.includes('about S$')),title);
});
test('every published ready option passes stock, owner, video and requested-brand gates',()=>{
 assert.equal(vac.status,'voting');assert.deepEqual(readinessMissing(vac),[]);assert.equal(lock.status,'voting');assert.deepEqual(readinessMissing(lock),[]);
 for(const d of content.decisions.filter(d=>d.status==='voting')){assert.equal(d.publicationPolicy,'stock-owner-video-v1');assert.deepEqual(readinessMissing(d),[]);}
 for(const brand of ['Yale'])assert.ok(lock.brandReview.some(b=>b.brand===brand&&b.source&&b.reason));
 for(const brand of ['Airbot','Xiaomi'])assert.ok(vac.brandReview.some(b=>b.brand===brand&&b.source&&b.reason));
 assert.match(vac.shopper.answer10s,/Shark/);assert.doesNotMatch(vac.shopper.answer10s,/evidence|unverified|dependable/i);
});
test('missing publication evidence blocks votes and falls back to Researching automatically',()=>{
 for(const mutate of [d=>d.options[0].publication.stock.verified=false,d=>d.options[0].publication.owner={},d=>d.brandReview=d.brandReview.filter(b=>b.brand!=='Xiaomi')]){
  const d=structuredClone(vac);mutate(d);assert.ok(readinessMissing(d).length);assert.equal(canAnswer(content,d,'KY'),false);
  const c={...content,decisions:[d]},s=stateFor(c,samples,'KY');assert.equal(s.content.decisions[0].status,'draft');assert.equal(voteQueue(s).length,0);
  assert.match(renderPage(s,'/whole-home/handheld-vacuum').html,/researching-label/);
 }
 const d=structuredClone(vac);d.options[0].publication.owner={reason:'No accessible exact-model owner reports after documented search.'};assert.deepEqual(readinessMissing(d),[]);
});
test('vacuum price and stock rows are separate from filter running costs',()=>{
 const v=shopperState(stateFor(content,samples,'KY')).content.decisions.find(d=>d.id==='HH-VAC'),rows=compareRows(v,v.options);assert.ok(rows.find(g=>g.group==='Price & stock').rows.some(r=>r.label==='Price'));
 const running=rows.find(g=>g.group==='Running costs');assert.ok(running.rows.some(r=>r.label==='Replacement filter'));assert.equal(running.rows.some(r=>/stock|collected|delivered/i.test(r.label)),false);
});
test('queue Back returns to the previous visited item even if now answered',()=>{
 const a=real('first'),b=real('second'),c=real('third'),data={...content,decisions:[a,b,c]},votes=[{code:'KY',decision_id:a.id,pick:a.options[0].id,lean:a.options[1].id}];
 const s=stateFor(data,samples,'KY',votes),html=renderPage(s,'/vote?item=third&trail=first').html;
 const nav=html.match(/<nav class="queue-nav"[\s\S]*?<\/nav>/)[0];assert.match(nav,/href="\/vote\?item=first"[^>]*>← Back/);
 const first=renderPage(s,'/vote?item=first').html;assert.match(first,/<button class="button secondary" disabled>← Back/);
 const end=renderPage(s,'/vote?end=1&trail=first,third').html;assert.match(end,/All done for now/);assert.match(end,/item=third/);
});
test('audit vote queue uses actual ready items and never fictional samples',()=>{
 const s=visitorState(content,samples,{audit:true},[],[]),html=visible(renderPage(s,'/audit/vote').html);
 assert.ok(content.decisions.filter(d=>d.status==='voting').some(d=>html.includes(d.title)));assert.doesNotMatch(html,/SAMPLE|Sample fridge|data-item="EN01"/);assert.match(html,/Skip for now/);
 assert.doesNotMatch(visible(renderPage(s,'/audit/').html),/\byou\b/i);
});
test('all four video thumbnails are genuine separate local media assets',()=>{
 assert.equal([lock,vac].flatMap(d=>d.options).filter(o=>o.video).length,4);for(const d of [lock,vac])for(const o of d.options.filter(o=>o.video)){assert.match(o.video.thumbnail,/^\/images\/videos\//);assert.notEqual(o.video.thumbnail,o.images[0].src);assert.equal(readFileSync(new URL('../../public'+o.video.thumbnail,import.meta.url)).toString('ascii',0,4),'RIFF');}
});
