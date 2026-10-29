import {slug} from './domain.mjs';
const split=v=>!v||/^(None|Not stated)$/i.test(v)?[]:v.split(/\s*\|\s*/).map(s=>s.trim()).filter(Boolean);
const nullable=v=>!v||/^(None|Not stated|Not specified)$/i.test(v)?null:v;
const price=v=>{if(nullable(v)===null)return null;const n=Number(v.replace(/S\$|,/g,'').trim());if(!Number.isFinite(n)||n<0)throw Error('The planned price must be stated in SGD.');return Math.round(n);};
const priceDetails=v=>{if(nullable(v)===null)return {price:null};const m=v.match(/^(?:S\$)?([\d,]+)(?:\s+(.+))?$/);return m?{price:price(m[1]),...(m[2]?{priceNote:m[2]}:{})}:{price:null,priceText:v};};
const normal=v=>String(v).toLowerCase().replace(/^sample\s*[·:]\s*/,'').replace(/refrigerator/g,'fridge').replace(/[^a-z0-9]+/g,' ').trim().replace(/\b(?:smart|digital) door lock\b/g,'door lock');
export function parseCard(text){
 const lines=text.replace(/```[^\n]*\n?|```/g,'').split(/\r?\n/),root={},options=[],table=[];let option=null,inTable=false;
 for(const raw of lines){const line=raw.trim();if(!line||line.startsWith('WEBSITE CARD'))continue;
  if(/^OPTION [A-Z]$/.test(line)){option={};options.push(option);inTable=false;continue;}
  if(line==='COMPARE TABLE'){inTable=true;continue;}
  if(inTable){const cells=line.split(/\s*\|\s*/);if(cells.length>=4&&!(cells[0]==='Group'&&cells[1]==='Row'))table.push(cells);continue;}
  const match=line.match(/^([^:]+):\s*(.*)$/);if(match)(option??root)[match[1]]=match[2];
 }
 if(!root.ITEM||!root.ROOM||options.length<2)throw Error('The card needs an item, room and at least two options.');
 const stage={'Tell contractor by 11 Nov':'contractor','On site 3 Dec':'on_site','Before move-in':'move_in','After move-in':'later'}[root.DEADLINE];if(!stage)throw Error('Choose one of the four stated deadlines.');
 const tiers=(root['PRICE TIERS']??'').split(/\s*·\s*/).map(part=>{const m=part.match(/^(Budget|Mid|Splurge)\s+(about\s+)?S\$([\d,]+)(?:[–-](?:S\$)?([\d,]+)|(\+))(?:\s+(.+))?$/);return m?{name:m[1],min:price(m[3]),max:m[4]?price(m[4]):null,...(m[2]?{estimated:true}:{}),...(m[6]?{note:m[6]}:{})}:null;}).filter(Boolean);
 const saleText=root['SALES WORTH WAITING FOR']??'',sales=[['11.11',/11\.11/],['black_friday',/Black Friday/i],['12.12',/12\.12/]].filter(([,pattern])=>pattern.test(saleText)).map(([id])=>id);
 const specGroups=[];for(const [group,row]of table){let g=specGroups.find(g=>g.group===group);if(!g){g={group,rows:[]};specGroups.push(g);}g.rows.push(row);}
 const qty=Number(root.QUANTITY??1);if(!Number.isInteger(qty)||qty<1)throw Error('Quantity must be a positive whole number.');
 return {room:root.ROOM,item:{title:root.ITEM,qty,budget:price(root.BUDGET),stage,sales,...(/expected|unconfirmed/i.test(saleText)?{salesNote:saleText}:{}),answer10s:root['10-SECOND ANSWER'],summary:root.SUMMARY,tiers,mustKnow:split(root['MUST KNOW']),contractorNote:nullable(root['CONTRACTOR NEEDS TO KNOW']),fullReport:nullable(root['FULL REPORT']),specGroups,status:'voting',candidates:[],options:options.map((o,i)=>{
   const conf=(o['Reliability confidence']??'').match(/^(Strong|Moderate|Limited)\s*[—–-]\s*(.*)$/);
   return {label:o.Name.replace(/^Samplebrand (\w+) \d+$/, '$1'),name:o.Name,kind:/^(none|no |keep |not now)/i.test(o.Name)?'none':specGroups.some(g=>g.group==="What's included"||g.group==='Feel')?'look':'product',tier:o.Tier,...priceDetails(o.Price??o['Planned price']),images:[],headline:o.Headline,love:o['Good at']??o["Why you'll love it"],watchOut:o.Downsides??o['Watch out'],bestFor:o['Best for'],pros:split(o.Pros),cons:split(o.Cons),ownersSay:split(o['Owners say']).map(s=>{const m=s.match(/^(.*?)\s*\((https?:\/\/.*),\s*([^,]+)\)$/);if(!m)throw Error('An owner source needs its link and date.');return{text:m[1],source:m[2],when:m[3]};}),ownerReviews:o['Owner reviews']?.split(/\s*[—–]\s*/)[0],ownerReviewSummary:o['Owner reviews']?.split(/\s*[—–]\s*/).slice(1).join(' — '),offers:split(o.Shops??o['Where to buy']).map(s=>{const parts=s.split(/\s*·\s*/);if(parts.length!==5)throw Error('An offer needs shop, price, stock, checked date and link.');return{shop:parts[0],...priceDetails(parts[1]),stock:parts[2],checked:parts[3].replace(/^checked\s+/,''),url:parts[4]};}),buyTiming:nullable(o['Buy timing']),confidence:conf?{level:conf[1],why:conf[2]}:null,specs:Object.fromEntries(table.map(([,row,...values])=>[row,values[i]||'Not stated']))};
 })}};
}
export function applyCard(content,text,{allowRemoval=false}={}){
 const out=structuredClone(content),{room,item}=parseCard(text),area=out.areas.find(a=>normal(a.name)===normal(room)||normal(a.id)===normal(room));
 if(!area)throw Error('Add this room to LaCasa before importing the card.');
 let existing=out.decisions.find(d=>d.area===area.id&&normal(d.title)===normal(item.title));
 if(!existing){existing={id:crypto.randomUUID(),slug:slug(item.title),area:area.id,category:'Other',group:'loose',priority:'nice',question:`Which ${item.title.toLowerCase()}?`};out.decisions.push(existing);}
 const prior=existing.options??[],removed=prior.filter(o=>!item.options.some(n=>normal(n.name)===normal(o.name)));
 if(removed.length&&!allowRemoval)throw Error('This card removes options. Check existing votes and obtain K’s yes before replacing them.');
 item.options=item.options.map(o=>({...o,id:prior.find(p=>normal(p.name)===normal(o.name))?.id??crypto.randomUUID(),images:prior.find(p=>normal(p.name)===normal(o.name))?.images??[]}));
 item.status='draft';item.publicationPolicy='stock-owner-video-v1';item.researchMissing=['Verify stock, exact-model owner evidence and video before voting'];Object.assign(existing,item);out.updated=today();return out;
}
function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Singapore',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
