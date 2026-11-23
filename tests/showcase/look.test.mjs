import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import content from '../../lacasa.json' with {type:'json'};
import samples from '../../lacasa.sample.json' with {type:'json'};
import {api,visitorState} from '../../showcase/server.mjs';
import {renderPage} from '../../showcase/render.mjs';
import {LOOK,lookChoice,lookKeys,validLookValue} from '../../showcase/look-data.mjs';
import {lookPage} from '../../showcase/look.mjs';

function database(){const sqlite=new DatabaseSync(':memory:');for(const f of readdirSync(new URL('../../migrations/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sqlite.exec(readFileSync(new URL('../../migrations/'+f,import.meta.url),'utf8'));const prepare=(sql,args=[])=>({bind(...values){return prepare(sql,values);},async all(){return{results:sqlite.prepare(sql).all(...args)};},async run(){sqlite.prepare(sql).run(...args);return{};},async first(){return sqlite.prepare(sql).get(...args)??null;}});return {sqlite,prepare:sql=>prepare(sql)};}
const put=async(DB,key,value,view='')=>(await api(new Request('https://lacasa.test/api/look/'+encodeURIComponent(key)+view,{method:'PUT',headers:{'content-type':'application/json',origin:'https://lacasa.test'},body:JSON.stringify({value})}),{DB},content,samples)).status;

test('mood board data: every board has a valid pick, images exist, Warm Driftwood is the sofa pick', () => {
 for (const b of LOOK.boards) {
  assert.ok(b.rec >= 0 && b.rec < b.options.length, b.id);
  assert.ok(b.why, b.id);
  for (const o of b.options) if (o.img) assert.ok(existsSync(new URL('../../public' + o.img, import.meta.url)), o.img);
 }
 const sofa = LOOK.boards.find(b => b.id === 'sofa');
 assert.equal(sofa.options[sofa.rec].name, '04 Warm Driftwood');
 assert.equal(sofa.options.length, 8);
 assert.ok(existsSync(new URL('../../public' + LOOK.inspiration.img, import.meta.url)));
});

test('choices: empty means our pick, a saved index overrides it, bad values rejected', () => {
 const b = LOOK.boards.find(x => x.id === 'sofa');
 assert.equal(lookChoice(b, {}), b.rec);
 assert.equal(lookChoice(b, {'l:sofa': '1'}), 1);
 assert.equal(lookChoice(b, {'l:sofa': '99'}), b.rec);
 assert.ok(validLookValue(b, '') && validLookValue(b, '7'));
 assert.ok(LOOK.boards.some(x => x.id === 'doors'));
 assert.ok(!validLookValue(b, '8') && !validLookValue(b, 'x'));
 assert.equal(lookKeys().size, LOOK.boards.length);
});

test('page shows the palette, the walnut dining set, our pick and the family choice', () => {
 const html = lookPage({'l:sofa': '1'});
 assert.match(html, /data-look-palette/);
 assert.match(html, /LINO dining set/);
 assert.match(html, /268 × 135/);
 assert.match(html, /home-now-floor-doors/);
 assert.match(html, /Our pick/);
 assert.match(html, /02 Soft Clay<\/span> · <span data-look-who="l:sofa">family choice/);
 assert.match(html, /data-dock/);
 assert.doesNotMatch(html, /v-haus-2233a-sofa-showroom|order-sheet/i);
});

test('PUT /api/look saves, clears and validates; audit is read only', async () => {
 const DB = database();
 assert.equal(await put(DB, 'l:sofa', '1'), 200);
 assert.equal(DB.sqlite.prepare("SELECT value FROM visit_notes WHERE key='l:sofa'").get().value, '1');
 assert.equal(await put(DB, 'l:sofa', ''), 200);
 assert.equal(DB.sqlite.prepare("SELECT value FROM visit_notes WHERE key='l:sofa'").get(), undefined);
 assert.equal(await put(DB, 'l:sofa', '9'), 422);
 assert.equal(await put(DB, 'l:nope', '1'), 422);
 assert.equal(await put(DB, 'l:sofa', '1', '?view=audit'), 403);
});

test('/look route renders with nav link; home has the mood board tile', async () => {
 const s = visitorState(content, samples, {code: 'KY', name: 'KY'}, [], [], false);
 const {html, status} = renderPage(s, 'https://lacasa.test/look');
 assert.equal(status, 200);
 assert.match(html, /class="active" href="\/look"/);
 assert.match(renderPage(s, 'https://lacasa.test/').html, /hq-look/);
});
