import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import content from '../../lacasa.json' with {type:'json'};
import samples from '../../lacasa.sample.json' with {type:'json'};
import {parseCard,applyCard} from '../../showcase/card.mjs';
import {stateFor,validateVote} from '../../showcase/domain.mjs';
import {renderPage,listText} from '../../showcase/render.mjs';
const card=readFileSync(new URL('../fixtures/smart-door-lock-card.txt',import.meta.url),'utf8');
const d=content.decisions.find(d=>d.id==='EN01');
test('qualified card retains prices, installation conditions, sale uncertainty and real table rows',()=>{
 const {item}=parseCard(card);assert.equal(item.budget,null);assert.deepEqual(item.sales,['11.11','black_friday']);assert.equal(item.salesNote,'11.11 and Black Friday expected; lock-specific offers unconfirmed');
 assert.equal(item.options[0].price,649);assert.equal(item.options[0].priceNote,'installed, plus Apple hub if needed and any door alterations');assert.equal(item.options[1].price,499);assert.equal(item.options[1].priceNote,'installed, subject to stock and fit');
 assert.equal(item.options[0].offers[1].price,null);assert.equal(item.options[0].offers[1].priceText,'S$469–849 across variants, exact installed variant price to confirm');
 assert.equal(item.specGroups.flatMap(g=>g.rows).length,15);assert.ok(!item.specGroups.some(g=>g.group==='Group'));
 assert.equal(item.tiers[0].estimated,true);assert.equal(item.tiers[0].note,'installed');
});
test('smart/digital door lock matches the existing item and re-import preserves all pictures and choices',()=>{
 const imported=applyCard(content,card),next=imported.decisions.find(x=>x.id===d.id);assert.equal(imported.decisions.length,34);assert.equal(next.slug,d.slug);assert.equal(next.title,'Smart door lock');assert.deepEqual(next.options.map(o=>o.id),d.options.map(o=>o.id));assert.deepEqual(next.options.map(o=>o.images),d.options.map(o=>o.images));
 const prior=structuredClone(content);prior.decisions.find(x=>x.id===d.id).title='Digital door lock';assert.equal(applyCard(prior,card).decisions.length,34);
});
test('current lock prices expose included hubs and incomplete final costs',()=>{
 const s=stateFor(content,samples,'KX');
 for(const path of ['/entrance/digital-door-lock','/entrance/digital-door-lock/compare','/list']){
  const {html,status}=renderPage(s,path);assert.equal(status,200);assert.match(html,/Standard fitting included; extra door work costs more/);assert.match(html,/Standard fitting included; extra door work costs more/);
  if(path!=='/list'){assert.match(html,/Extra door work/);assert.match(html,/Price TBC/);assert.match(html,/Yale/);assert.match(html,/Fits our door/);}
 }
 assert.match(listText(s),/Smart door lock: S\$499–649 \+ prices TBC/);
 assert.match(listText(s),/extra door work costs more/);
});
test('supplied images and option identities remain while door verification blocks voting',()=>{
 assert.equal(d.options.length,2);assert.equal(d.status,'draft');assert.equal(d.stage,'contractor');assert.equal(d.qty,1);
 for(const [i,model]of ['u400','u100'].entries())for(const [j,p]of d.options[i].legacyImages.entries()){
  assert.equal(p.src,`/images/entrance/digital-door-lock-aqara-${model}-${j+1}.webp`);assert.equal(p.kind,'product');const path=new URL('../../public'+p.src,import.meta.url);assert.ok(statSync(path).size<300000);assert.equal(readFileSync(path).toString('ascii',0,4),'RIFF');
 }
 for(const code of ['KY','KX','KS']){const s=stateFor(content,samples,code);assert.match(validateVote(content,d,code,{pick:d.options[0].id},s.results[d.id]),/still being researched/);assert.equal(s.progress[code].total,1);}
});
