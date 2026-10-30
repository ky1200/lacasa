// Prints the asset version for showcase/render.mjs (ASSET_V). Run: npm run assets
import {readFileSync,readdirSync} from 'node:fs';import {createHash} from 'node:crypto';
const files=[...readdirSync('public').filter(f=>/\.(css|js)$/.test(f)).map(f=>'public/'+f),...readdirSync('public/fonts').map(f=>'public/fonts/'+f)].sort();
const h=createHash('sha256');for(const f of files)h.update(readFileSync(f));const v=h.digest('hex').slice(0,10);
const p='showcase/render.mjs',s=readFileSync(p,'utf8');
if(process.argv.includes('--write')){(await import('node:fs')).writeFileSync(p,s.replace(/export const ASSET_V='[0-9a-f]+'/,`export const ASSET_V='${v}'`));}
console.log(v);
