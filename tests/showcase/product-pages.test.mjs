import {mediaDOM} from '../helpers/media-dom.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import content from '../../lacasa.json' with {type:'json'};
import samples from '../../lacasa.sample.json' with {type:'json'};
import {visitorState} from '../../showcase/server.mjs';
import {renderPage} from '../../showcase/render.mjs';
import {videoPage} from '../../showcase/video.mjs';
const audit=visitorState(content,samples,{audit:true},[],[]);
const plain=html=>html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
test('product pages show photos, quick answer, cards and collapsed details in order',()=>{
 for(const d of content.decisions.filter(d=>d.options.length)){
  const html=renderPage(audit,`/audit/${d.area}/${d.slug}`).html;
  assert.ok(html.indexOf('class="item-photos"')<html.indexOf('class="quick-answer"'));
  assert.ok(html.indexOf('class="quick-answer"')<html.indexOf('class="option-grid"'));
  assert.match(html,/<details><summary>Full specs, shops &amp; video<\/summary>/);assert.doesNotMatch(html,/<details[^>]* open/);
  assert.doesNotMatch(plain(html),/\byou\b|\byour\b|we wanted|as requested|amazing|perfect|game-changer/i);
 }
 assert.match(renderPage(audit,'/audit/kitchen/fridge').html,/<span class="researching-label">Researching<\/span>/);
});
test('comparison rows are short, grouped consistently and distinguish yes/no from unknown',()=>{
 const order=['Overview','Size &amp; fit','Performance','Features','Price &amp; stock','Running costs','Warranty &amp; support'];
 for(const d of audit.content.decisions.filter(d=>d.options.length)){
  const html=renderPage(audit,`/audit/${d.area}/${d.slug}/compare`).html;
  const groups=[...html.matchAll(/class="compare-group"><th[^>]*>(.*?)<\/th>/g)].map(m=>m[1]);
  assert.deepEqual(groups,order.filter(g=>groups.includes(g)));
  for(const row of html.matchAll(/<tr class="compare-values[^>]*>([\s\S]*?)<\/tr>/g))for(const cell of row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)){
   const text=plain(cell[1]);assert.ok(text.length);assert.ok(text.split(' ').length<=(text.startsWith('78 dB')?8:9),text);
  }
  assert.match(html,/Show differences only/);assert.match(html,/data-model="0"/);assert.match(html,/data-model="1"/);
 }
 const html=audit.content.decisions.filter(d=>d.options.length).map(d=>renderPage(audit,`/audit/${d.area}/${d.slug}/compare`).html).join('');
 assert.match(html,/feature-yes/);assert.match(html,/feature-no/);assert.match(html,/not-stated/);
});
test('product photos, when present, are sharp official images with source links',()=>{
 for(const d of content.decisions.filter(d=>d.options.length))for(const o of d.options){
  if(o.legacyImages)assert.ok(o.legacyImages.length);assert.ok(Array.isArray(o.images));assert.ok(o.headline.split(' ').length<=8);
  for(const i of o.images){assert.ok(Math.max(i.width,i.height)>=800);assert.match(i.source,/^https:\/\//);if(i.src.startsWith('/images/'))assert.ok(statSync(new URL('../../public'+i.src,import.meta.url)).size<300000);else assert.match(i.src,/^https:\/\//);}
 }
});
test('only exact English video fixtures create an origin-bearing player on tap',()=>{
 const fixture=structuredClone(content);fixture.decisions.find(d=>d.id==='EN01').options[0].video.language='en';
 const html=renderPage(visitorState(fixture,samples,{audit:true}),'/audit/entrance/digital-door-lock').html;assert.doesNotMatch(html,/<iframe|<dialog/);assert.equal((html.match(/data-video=/g)||[]).length,1);
 const {document,body,opener}=mediaDOM('video');runInNewContext(readFileSync(new URL('../../public/showcase.js',import.meta.url),'utf8'),{document,location:{search:''},URLSearchParams});assert.equal(body.children.length,0);opener.events.click();const dialog=document.querySelector('#video-dialog');assert.equal(dialog.querySelector('iframe').src,'/video/sw8mI_Lgzqc');dialog.querySelector('button').events.click();assert.equal(body.children.length,0);
 const player=videoPage(fixture,'sw8mI_Lgzqc','https://lacasa.example');assert.match(player,/youtube-nocookie/);assert.match(player,/origin=https%3A%2F%2Flacasa.example/);assert.equal(videoPage(content,'rzN-Ye4L3ts','https://lacasa.example'),null);assert.equal(videoPage(fixture,'abcdefghijk','https://lacasa.example'),null);
});
test('to-scale reference sketches label rough provenance and computed model gaps',()=>{
 assert.match(renderPage(audit,'/audit/yard/washing-machine').html,/Washer reference 75 × 67 cm/);
 const c=structuredClone(content),d=c.decisions.find(d=>d.id==='HH-VAC');d.space={label:'Test space',width:75,depth:67,source:'Test dimensions',measured:false,opening:true};d.options[0].footprint={width:60,depth:50};d.options[1].footprint={width:80,depth:70};
 const html=renderPage(visitorState(c,samples,{audit:true},[],[]),'/audit/whole-home/handheld-vacuum').html;
 assert.match(html,/Rough measurement, final measure 11 Nov/);assert.match(html,/7.5 cm each side/);assert.match(html,/8.5 cm front\/rear/);assert.match(html,/5 cm width excess/);assert.match(html,/3 cm depth excess/);
 d.space.measured=true;d.space.measuredAt='2026-11-11';const measured=renderPage(visitorState(c,samples,{audit:true},[],[]),'/audit/whole-home/handheld-vacuum').html;assert.match(measured,/Measured 2026-11-11/);assert.doesNotMatch(measured,/Rough measurement, final measure/);
});
