import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import content from '../../lacasa.json' with {type:'json'};
import samples from '../../lacasa.sample.json' with {type:'json'};
import {visitorState,api} from '../../showcase/server.mjs';
import {renderPage} from '../../showcase/render.mjs';
import {BUY} from '../../showcase/buy-plan.mjs';
import {PLAN,planKey,validPlanValue,planState,buyItemById} from '../../showcase/plan-data.mjs';
import {RESEARCH} from '../../showcase/research.mjs';
import {planData} from '../../showcase/plan.mjs';
function database(){const sqlite=new DatabaseSync(':memory:');for(const f of readdirSync(new URL('../../migrations/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sqlite.exec(readFileSync(new URL('../../migrations/'+f,import.meta.url),'utf8'));const prepare=(sql,args=[])=>({bind(...values){return prepare(sql,values);},async all(){return{results:sqlite.prepare(sql).all(...args)};},async run(){sqlite.prepare(sql).run(...args);return{};},async first(){return sqlite.prepare(sql).get(...args)??null;}});return {sqlite,prepare:sql=>prepare(sql),batch:async ss=>Promise.all(ss.map(s=>s.run()))};}

const put=async(DB,key,value,view='')=>(await api(new Request('https://lacasa.test/api/plan/'+encodeURIComponent(key)+view,{method:'PUT',headers:{'content-type':'application/json',origin:'https://lacasa.test'},body:JSON.stringify({value})}),{DB},content,samples)).status;
const state=(visit={})=>({...visitorState(content,samples,{code:'FAMILY',name:'Family'},[],[],false),visit});
const W=PLAN.imgW*PLAN.mmPerPx,H=PLAN.imgH*PLAN.mmPerPx;
const inRoom=(x,y,r)=>r.boxes.some(([bx,by,bw,bh])=>x>=bx&&x<=bx+bw&&y>=by&&y<=by+bh);

test('floor plan: image, scale, rooms and walls are consistent',()=>{
 assert.ok(existsSync(new URL('../../public'+PLAN.img,import.meta.url)),'plan image is on the site');
 // Scale from the plan's own dimension lines (see plan-data.mjs): 5.42 mm per px, within 1%.
 for(const [mm,px] of [[1650,303],[3150,581],[2825,522],[3680,678],[9150,1691],[2800,515]])assert.ok(Math.abs(mm/px-PLAN.mmPerPx)/PLAN.mmPerPx<.01,mm+' mm');
 for(const r of PLAN.rooms)for(const [x,y,w,h] of r.boxes)assert.ok(x>=0&&y>=0&&x+w<=W&&y+h<=H&&w>500&&h>500,r.id);
 for(const w of PLAN.walls){assert.ok(w.slice(0,4).every((v,i)=>v>=0&&v<=(i%2?H:W)));assert.ok(['c','p','h','g'].includes(w[4]));assert.ok(w[0]===w[2]||w[1]===w[3],'walls are straight');}
});
test('floor plan: every item starts inside its room, links to real to-buy items and research',()=>{
 const rooms=Object.fromEntries(PLAN.rooms.map(r=>[r.id,r])),topics=new Set(RESEARCH.map(t=>t.id));
 for(const i of PLAN.items){
  assert.ok(rooms[i.room],i.id+' room');assert.ok(inRoom(i.x,i.y,rooms[i.room]),i.id+' starts in its room');
  assert.ok([0,90,180,270].includes(i.r));assert.ok(i.sizes.length&&i.sizes.every(s=>s.w>0&&s.d>0&&s.n));
  for(const b of i.buy??[])assert.ok(buyItemById(b),i.id+' -> '+b);
  if(i.research)assert.ok(topics.has(i.research),i.id+' research');
 }
 const q=PLAN.items.find(i=>i.id==='ky-bed').sizes;assert.deepEqual(q.map(s=>[s.w,s.d]),[[1520,1905],[1070,1905]],'Singapore queen 152 × 190.5 and super single 107 × 190.5');
 for(const [t,list] of Object.entries(PLAN.points))for(const [x,y] of list)assert.ok(PLAN.rooms.some(r=>inRoom(x,y,r)),t+' point inside a room');
 for(const t of RESEARCH){assert.ok(t.answer&&t.shortlist.length,t.id);for(const id of t.plan??[])assert.ok(PLAN.items.some(i=>i.id===id),id);}
});
test('floor plan API saves positions and points, rejects bad keys and values, audit is read only',async()=>{
 const DB=database();
 assert.equal(await put(DB,'p:i:ky-bed','4000,2500,90,1'),200);
 assert.equal(await put(DB,'p:pts:light','1000,2000;3000,4000'),200);
 assert.equal(await put(DB,'p:pts:socket','none'),200);
 assert.equal(await put(DB,'p:i:ky-bed','4000,2500,45,0'),422,'rotation is 0/90/180/270');
 assert.equal(await put(DB,'p:i:ky-bed','4000,2500,0,5'),422,'size index must exist');
 assert.equal(await put(DB,'p:i:nope','1,1,0,0'),422);assert.equal(await put(DB,'p:pts:bomb','1,1'),422);
 assert.equal(await put(DB,'p:pts:light','1,1;x'),422);assert.equal(await put(DB,'p:i:ky-bed','99999,1,0,0'),422);
 assert.equal(await put(DB,'p:i:ky-bed','1,1,0,0','?view=audit'),403);
 const v=Object.fromEntries(DB.sqlite.prepare('SELECT key,value FROM visit_notes').all().map(r=>[r.key,r.value]));
 const st=planState(v);assert.deepEqual(st.items.find(i=>i.id==='ky-bed'),{...PLAN.items.find(i=>i.id==='ky-bed'),x:4000,y:2500,r:90,s:1});
 assert.deepEqual(st.points.light,[[1000,2000],[3000,4000]]);assert.deepEqual(st.points.socket,[]);assert.deepEqual(st.points.fan,PLAN.points.fan);
 assert.equal(await put(DB,'p:i:ky-bed',''),200,'empty value resets to the default');
 assert.ok(planKey('p:i:wifi-main')&&!planKey('b:ky-bed:pick'));assert.ok(validPlanValue({kind:'points'},'none'));
});
test('floor plan and research pages render; picks are shared with /buy; plain wording',()=>{
 const html=renderPage(state({'b:ky-mattress:pick':'2'}),'https://lacasa.test/plan').html;
 assert.match(html,/<h1>Floor plan<\/h1>/);assert.match(html,/src="\/plan\.js\?v=/);assert.match(html,/data-plan-svg/);assert.match(html,/data-layer="wifi"/);assert.match(html,/data-night/);assert.match(html,/data-tape/);
 const data=JSON.parse(html.match(/<script id="plan-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(data.buy['ky-mattress'].pick,2,'pick from the to-buy list');assert.ok(data.buy['ky-bed'].opts.length>1);assert.ok(data.research.beds.list.length);
 const r=renderPage(state(),'https://lacasa.test/research').html;
 for(const t of RESEARCH)assert.match(r,new RegExp(`id="r-${t.id}"`));
 for(const page of [html,r]){const text=page.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ');assert.doesNotMatch(text,/\byou\b|\byour\b|perfect|amazing/i);}
 assert.match(renderPage(state(),'https://lacasa.test/').html,/href="\/plan"/,'home links to the plan');
 const audit=renderPage({...visitorState(content,samples,{code:'AUDIT',audit:true,readOnly:true}),visit:{}},'https://lacasa.test/audit/plan').html;assert.match(audit,/data-move disabled/);
 assert.ok(JSON.stringify(planData()).length<60000,'plan data stays small');
});
