import {readinessMissing,publicationState} from './readiness.mjs';
export const CODES = ['KY', 'KX', 'KS'];
export const isSample = d => !!d.sample || d.id.startsWith('SAMPLE-');
export const todaySG = (now = new Date()) => new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Singapore',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
export const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const amount = v => { const cents = Math.round(v*100)%100 !== 0; return (cents ? Math.round(v*100)/100 : Math.round(v)).toLocaleString('en-SG',{minimumFractionDigits:cents?2:0,maximumFractionDigits:2}); };
export const money = value => value == null ? 'Price TBC' : `S$${amount(value)}`;
export const range = (min,max) => min === max ? money(min) : `S$${Math.round(min).toLocaleString('en-SG')}–${Math.round(max).toLocaleString('en-SG')}`;
export const estimated = (value,estimate=false) => estimate ? `about ${value}` : value;
export const tbcCount = n => `${n} ${n===1?'price':'prices'} TBC`;
export function costSummary({min,max,priced,tbc=0,rough=0}) {
 if(priced===0&&tbc>0)return tbc===1?'Price TBC':tbcCount(tbc);
 return estimated(range(min,max),rough>0)+(tbc?` + ${tbcCount(tbc)}`:'');
}
export function deadlineCalendar(today,deadline) {
 const day=86400000,start=Date.parse(today+'T00:00:00Z'),end=Date.parse(deadline+'T00:00:00Z');
 const daysLeft=Math.max(0,Math.round((end-start)/day)),offset=(new Date(start).getUTCDay()+6)%7;
 const weeks=Math.ceil((offset+daysLeft+1)/7),first=start-offset*day;
 return {daysLeft,weeks,dates:Array.from({length:weeks*7},(_,i)=>{
  const time=first+i*day,date=new Date(time).toISOString().slice(0,10);
  return {date,day:new Date(time).getUTCDate(),today:date===today,deadline:date===deadline,available:time>=start&&time<end};
 })};
}
export const areaOf = (content,d) => content.areas.find(a=>a.id === d.area);
export const dueDate = (content,d) => d.decideBy ?? content.stages.find(s=>s.id === d.stage)?.decideBy ?? null;
export const isOverdue = (content,d,today=todaySG()) => !!dueDate(content,d) && today > dueDate(content,d);
export const canAnswer = (content,d,code) => d.status === 'voting' && !readinessMissing(d).length && d.options.length >= 2 && (!isSample(d) || code==='KY') && (areaOf(content,d)?.kind !== 'bedroom' || areaOf(content,d)?.owner === code);
export function personForEmail(value,setting) {
 if (!value || !setting) return null;
 const entries=String(setting).split(';').map(part=>part.trim().split('=').map(s=>s.trim().toLowerCase()));
 const found=entries.filter(([code,email])=>CODES.map(c=>c.toLowerCase()).includes(code)&&email === value.trim().toLowerCase());
 return found.length === 1 ? found[0][0].toUpperCase() : null;
}
export function validVotes(d,votes) {
 return votes.filter(v=>v.decision_id===d.id && CODES.includes(v.code) && d.options.some(o=>o.id===v.pick)).map(v=>({...v,lean:d.options.some(o=>o.id===v.lean)&&v.lean!==v.pick ? v.lean : null}));
}
export function result(content,d,votes=[],final=null,today=todaySG()) {
 const valid=validVotes(d,votes),area=areaOf(content,d),people=area?.kind==='bedroom' ? [area.owner] : CODES;
 const participated=people.filter(code=>valid.some(v=>v.code===code));
 const common={participated,required:people,overdue:isOverdue(content,d,today),updated:valid.some(v=>v.updated_after_reveal===1)};
 if (final && d.options.some(o=>o.id===final.option_id)) return {...common,status:final.reason==='lock'?'locked':'decided',winner:final.option_id,byAdmin:true,reason:final.reason,adminCanDecide:false};
 if (participated.length < people.length) return {...common,status:'waiting',adminCanDecide:common.overdue};
 if (area?.kind==='bedroom') return {...common,status:'decided',winner:valid.find(v=>v.code===area.owner).pick,adminCanDecide:false};
 const scores=Object.fromEntries(d.options.map(o=>[o.id,0]));
 for (const code of CODES) {const v=valid.find(v=>v.code===code);scores[v.pick]+=1;if(d.options.length>=3 && v.lean)scores[v.lean]+=0.5;}
 const top=Math.max(...Object.values(scores)),tied=Object.keys(scores).filter(k=>scores[k]===top);
 return {...common,status:tied.length===1?'decided':'tie',...(tied.length===1?{winner:tied[0]}:{tied}),scores,adminCanDecide:tied.length>1};
}
export function validateVote(content,d,code,body,r) {
 if (!d || d.status!=='voting'||d.options.length<2||readinessMissing(d).length) return 'This item is still being researched.';
 if (r.status==='locked') return 'This decision is locked. Ask KY to unlock it.';
 if (!canAnswer(content,d,code)) return 'This decision belongs to someone else.';
 if (!body || !d.options.some(o=>o.id===body.pick)) return 'Choose one of the available options.';
 const bedroom=areaOf(content,d)?.kind==='bedroom';
 if (!bedroom && d.options.length>=3) {if (!body.lean || !d.options.some(o=>o.id===body.lean)||body.lean===body.pick) return 'Choose a different second choice for your half vote.';}
 else if (body.lean != null) return bedroom ? 'Your room needs one pick, with no lean.' : 'With two options, choose only a pick.';
 return null;
}
export function stateFor(content,samples,code,votes=[],finals=[],showSamples=false,today=todaySG()) {
 const decisions=[...content.decisions.map(publicationState),...(code==='KY'&&showSamples?samples.decisions:[])];
 const visibleContent={...content,decisions};
 const results=Object.fromEntries(decisions.map(d=>[d.id,result(visibleContent,d,votes,finals.find(f=>f.decision_id===d.id),today)]));
 const ownVotes=Object.fromEntries(decisions.map(d=>[d.id,validVotes(d,votes).find(v=>v.code===code)]).filter(([,v])=>v).map(([id,v])=>[id,{pick:v.pick,lean:areaOf(content,decisions.find(d=>d.id===id))?.kind==='bedroom'?null:v.lean,updated_at:v.updated_at}]));
 const progress=Object.fromEntries(CODES.map(c=>{const eligible=content.decisions.filter(d=>canAnswer(content,d,c));return[c,{total:eligible.length,done:eligible.filter(d=>results[d.id].status==='locked'||validVotes(d,votes).some(v=>v.code===c)).length}];}));
 return {budget:listTotals(visibleContent,results),content:visibleContent,code,name:content.people.find(p=>p.code===code)?.name??code,isAdmin:code==='KY',results,ownVotes,progress:code==='KY'?progress:{[code]:progress[code]},today};
}
export function voteQueue(state) {
 return state.content.decisions.filter(d=>canAnswer(state.content,d,state.code)&&state.results[d.id]?.status!=='locked'&&!state.ownVotes[d.id]).sort((a,b)=>(dueDate(state.content,a)??'9999').localeCompare(dueDate(state.content,b)??'9999'));
}
export function lineCost(d,r) {
 const qty=d.qty??1;
 // Whole-job items (installed lighting, a house of switch plates): model prices are per unit or hardware only,
 // so the budget for the whole job stays the line cost until the contractor quotes.
 if(d.costBasis==='budget'&&d.roughBudget){const option=(r?.status==='decided'||r?.status==='locked')&&r.winner?d.options.find(o=>o.id===r.winner):undefined;return {kind:'open',min:qty*d.roughBudget.min,max:qty*d.roughBudget.max,rough:true,source:d.roughBudget.source,...(option?{option}:{})};}
 if ((r?.status==='decided'||r?.status==='locked') && r.winner) {
  const option=d.options.find(o=>o.id===r.winner);
  if(option?.paidVia==='contractor')return {kind:'contractor',min:0,max:0,amount:option.price==null?null:qty*option.price,option};
  if(option?.price==null)return {kind:'tbc',min:0,max:0,option};
  const cheaper=d.options.filter(o=>o.price!=null&&o.price<option.price&&o.paidVia!=='contractor').sort((a,b)=>a.price-b.price)[0];
  return {kind:'decided',min:qty*option.price,max:qty*option.price,option,incomplete:!!option.costIncomplete,...(cheaper?{saving:{label:cheaper.label,amount:qty*(option.price-cheaper.price)}}:{})};
 }
 if(d.options.length) {
  const self=d.options.filter(o=>o.paidVia!=='contractor'),prices=self.filter(o=>o.price!=null).map(o=>qty*o.price);
  if(!self.length)return {kind:'contractor',min:0,max:0,open:true,amount:null};
  if(!prices.length)return {kind:'tbc',min:0,max:0,open:true};
  return {kind:'open',min:Math.min(...prices),max:Math.max(...prices),incomplete:prices.length!==self.length||self.some(o=>o.costIncomplete)};
 }
 if(d.roughBudget)return {kind:'open',min:qty*d.roughBudget.min,max:qty*d.roughBudget.max,rough:true,source:d.roughBudget.source};
 return {kind:'tbc',min:0,max:0,open:true};
}
export function listTotals(content,results={},phase='before',group='all') {
 const rows=content.decisions.filter(d=>!isSample(d)&&(phase==='all'||(phase==='later'?d.stage==='later':d.stage!=='later'))&&(group==='all'||d.group===group)).map(d=>({d,cost:lineCost(d,results[d.id])}));
 const totals={decided:0,openMin:0,openMax:0,priced:0,openPriced:0,tbc:0,contractor:0,rough:0,incomplete:0};
 for(const {cost:c} of rows){if(c.kind==='decided'){totals.decided+=c.min;totals.priced++;if(c.incomplete)totals.incomplete++;}else if(c.kind==='open'){totals.openMin+=c.min;totals.openMax+=c.max;totals.priced++;totals.openPriced++;if(c.rough)totals.rough++;if(c.incomplete)totals.incomplete++;}else if(c.kind==='tbc')totals.tbc++;else totals.contractor++;}
 return {...totals,min:totals.decided+totals.openMin,max:totals.decided+totals.openMax,rows};
}
export function compareRows(d,options,differences=false) {
 if(options.every(o=>o.shopperReady)){
  const overview={group:'Overview',rows:[['Good at','love'],['Downsides','watchOut'],['Best for','bestFor'],['Owner reviews','ownerReviews']].map(([label,key])=>({label,values:options.map(o=>o.compare?.[key]||o[key]||'Not stated')}))};
  let definitions=d.shopperGroups;
  if(!definitions){const map=new Map();for(const label of new Set(options.flatMap(o=>Object.keys(o.specs??{})))){const group=/size|storage|door/i.test(label)?'Size & fit':/energy/i.test(label)?'Running costs':/warranty/i.test(label)?'Warranty & support':'Features';if(!map.has(group))map.set(group,[]);map.get(group).push(label);}definitions=['Size & fit','Performance','Features','Price & stock','Running costs','Warranty & support'].filter(g=>map.has(g)).map(group=>({group,rows:map.get(group)}));}
  return [overview,...definitions.map(g=>({group:g.group,rows:g.rows.map(label=>({label,values:options.map(o=>o.specs?.[label]||'Not stated')}))}))].map(g=>({...g,rows:g.rows.filter(r=>!differences||!r.values.every(v=>v===r.values[0]))})).filter(g=>g.rows.length);
 }

 const quick=[['Overview',[["Benefits",'love'],['Limitations','watchOut'],['Best for','bestFor']].map(([label,key])=>({label,values:options.map(o=>o.table?.[key]||o[key]||'Not stated')})).concat([{label:'Reliability evidence',values:options.map(o=>o.confidence?`${o.confidence.level} evidence`:'Not stated')}])]];
 const grouped=new Map();
 for(const g of d.specGroups??[])for(const label of g.rows){const group=!['Size & fit','Performance','Noise','Power','Purchase','Buying','Price & stock','Running costs','Support','Warranty & support','Repairability','Entry','Locking','Connectivity','Charging','Tools','Filters','Cleaning','Features',"What's included",'Feel'].includes(g.group)?g.group:g.group==='Size & fit'?'Size & fit':g.group==='Performance'||g.group==='Noise'||g.group==='Feel'||label==='Claimed endurance'?'Performance':['Purchase','Buying','Price & stock'].includes(g.group)?'Price & stock':['Power','Running costs'].includes(g.group)?'Running costs':['Support','Warranty & support','Repairability'].includes(g.group)?'Warranty & support':'Features';if(!grouped.has(group))grouped.set(group,[]);grouped.get(group).push({label,values:options.map(o=>o.tableSpecs?.[label]||o.specs?.[label]||'Not stated')});}
 const groups=[...['Size & fit','Performance','Features','Price & stock','Running costs','Warranty & support'].filter(g=>grouped.has(g)),...[...grouped.keys()].filter(g=>!['Size & fit','Performance','Features','Price & stock','Running costs','Warranty & support'].includes(g))].map(g=>[g,grouped.get(g)]);
 const fixed=[['Pros','pros'],['Cons','cons'],['Owners say','ownersSay'],['Where to buy','offers'],['Buy timing','buyTiming']].map(([name,key])=>[name,[{label:name,key,values:options.map(o=>key==='ownersSay'?(o.ownersSay?.map(s=>`${s.text} (${s.source}, ${s.when})`).join(' | ')||'Not stated'):key==='offers'?(o.offers?.map(s=>`${s.shop} · ${s.priceText??money(s.price)}${s.priceNote?' '+s.priceNote:''} · ${s.stock} · checked ${s.checked} · ${s.url}`).join(' | ')||'Not stated'):Array.isArray(o[key])?o[key].join(' | ')||'Not stated':o[key]||'Not stated')}]]);
 return [...quick,...groups,...fixed].map(([group,rows])=>({group,rows:rows.filter(r=>!differences||!r.values.every(v=>v===r.values[0]))})).filter(g=>g.rows.length);
}
export function lowestPrice(options){const priced=options.filter(o=>o.price!=null);if(!priced.length)return null;return priced.reduce((a,b)=>a.price<=b.price?a:b).id;}
