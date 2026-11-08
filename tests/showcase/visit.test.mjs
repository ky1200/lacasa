import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import content from '../../lacasa.json' with {type:'json'};
import samples from '../../lacasa.sample.json' with {type:'json'};
import {api,visitorState} from '../../showcase/server.mjs';
import {renderPage} from '../../showcase/render.mjs';
import {VISIT,visitKeys,fitOf,applyVisitSpaces} from '../../showcase/visit.mjs';
function database(){const sqlite=new DatabaseSync(':memory:');for(const f of readdirSync(new URL('../../migrations/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sqlite.exec(readFileSync(new URL('../../migrations/'+f,import.meta.url),'utf8'));const prepare=(sql,args=[])=>({bind(...values){return prepare(sql,values);},async all(){return{results:sqlite.prepare(sql).all(...args)};},async run(){const x=sqlite.prepare(sql).run(...args);return{meta:{changes:Number(x.changes)},results:[]};}});return{sqlite,prepare,async batch(statements){const results=[];for(const s of statements)results.push(await s.all());return results;}};}
const call=async(DB,code,path,body,method='PUT')=>{const headers={'content-type':'application/json',origin:'https://lacasa.test'};if(code)headers.cookie='lacasa_person='+code;const res=await api(new Request('https://lacasa.test'+path,{method,headers,body:JSON.stringify(body)}),{DB},content,samples);return {status:res.status,body:await res.json()};};

test('visit plan: unique ids, every item link exists, every drawing letter has a field',()=>{
 const ids=VISIT.rooms.flatMap(r=>r.measure.map(m=>m.id));assert.equal(new Set(ids).size,ids.length);
 const paths=new Set(content.decisions.map(d=>`${d.area}/${d.slug}`));
 for(const r of VISIT.rooms)for(const m of r.measure){if(m.item)assert.ok(paths.has(m.item),m.item);for(const k of Object.keys(m.need??{}))assert.ok(k in m.fields,`${m.id} needs ${k}`);for(const id of m.space?.decisions??[])assert.ok(content.decisions.some(d=>d.id===id),id);}
 assert.ok(visitKeys().has('m:rack:L')&&visitKeys().has('q:YA06'));
});
test('fit check: Steigen Mini ceiling 120 × 70 at 260 high fits; 100 long does not',()=>{
 const rack=VISIT.rooms.find(r=>r.id==='yard').measure.find(m=>m.id==='rack');
 assert.equal(fitOf(rack,{'m:rack:L':'120','m:rack:W':'70','m:rack:H':'260'}).state,'ok');
 assert.match(fitOf(rack,{'m:rack:L':'100','m:rack:W':'70','m:rack:H':'260'}).text,/L needs at least 110/);
 assert.equal(fitOf(rack,{'m:rack:L':'120'}).state,'open');
});
test('visit page renders every room with drawings, inputs and saved values; plain wording',()=>{
 const s={...visitorState(content,samples,{code:'KX',isAdmin:false}),visit:{'m:rack:L':'120','c:yard:0':'1','q:YA06':'900'}};
 const html=renderPage(s,'/visit').html;
 for(const r of VISIT.rooms)assert.match(html,new RegExp(`id="v-${r.id}"`));
 assert.match(html,/data-k="m:rack:L" value="120"/);assert.match(html,/data-k="c:yard:0" checked/);assert.match(html,/S\$900/);
 assert.ok((html.match(/<svg viewBox/g)??[]).length>=30);
 assert.doesNotMatch(html.replace(/<[^>]+>/g,' '),/\byou\b|\byour\b/i);
 assert.match(renderPage(s,'/').html,/href="\/visit"/);
});
test('visit API saves shared values, validates keys and numbers, audit is read only',async()=>{
 const DB=database();
 assert.equal((await call(DB,'KX','/api/visit/m%3Arack%3AL',{value:'120'})).status,200);
 assert.equal((await call(DB,'KS','/api/visit/c%3Ayard%3A0',{value:'1'})).status,200);
 assert.equal((await call(DB,'KX','/api/visit/m%3Arack%3AL',{value:'abc'})).status,422);
 assert.equal((await call(DB,'KX','/api/visit/x%3Anope',{value:'1'})).status,422);
 assert.equal((await call(DB,'KX','/api/visit/c%3Ayard%3A0',{value:'yes'})).status,422);
 assert.equal((await call(DB,null,'/api/visit/m%3Arack%3AL',{value:'1'})).status,401);
 assert.equal((await call(DB,'KX','/audit/x?view=audit'.replace('/audit/x','/api/visit/m%3Arack%3AL'),{value:'5'})).status,403);
 assert.deepEqual(DB.sqlite.prepare('SELECT key,value,code FROM visit_notes ORDER BY key').all().map(r=>({...r})),[{key:'c:yard:0',value:'1',code:'KS'},{key:'m:rack:L',value:'120',code:'KX'}]);
 assert.equal((await call(DB,'KX','/api/visit/m%3Arack%3AL',{value:''})).status,200);
 assert.equal(DB.sqlite.prepare('SELECT COUNT(*) n FROM visit_notes').get().n,1);
});
test('measured sizes are copied onto the matching item pages',()=>{
 const c=applyVisitSpaces(content,{'m:rack:L':'118','m:dining-floor:L':'200','m:dining-floor:W':'180'});
 const rack=c.decisions.find(d=>d.id==='YA04'),dn=c.decisions.find(d=>d.id==='DN01');
 assert.equal(rack.space.width,118);assert.equal(rack.space.measured,true);assert.equal(dn.space.width,200);assert.equal(dn.space.depth,180);
});
