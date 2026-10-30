import {eligibleVideo} from './media.mjs';
import {listTotals} from './domain.mjs';
const research=/unverified|unconfirmed|conflict|limited evidence|evidence|unproven|uncertain|not established|not verified|require confirmation|unavailable exact/i;
const simple=v=>typeof v==='string'?v.split(/(?<=[.!;])\s+/).filter(s=>!research.test(s)).join(' ').replace(/\bUSB-C\b/g,'USB-C (common charging cable)').replace(/\bupholstery\b/gi,'sofa').replace(/\bcrevice\b/gi,'narrow-gap').replace(/\bfootprint\b/gi,'size').replace(/\bcove lighting\b/gi,'Hidden ceiling lights').replace(/\bdownlights\b/gi,'Recessed ceiling lights').replace(/\btrack\/spotlights\b/gi,'Adjustable spotlights'):v;
const fields=(o,keys)=>Object.fromEntries(keys.filter(k=>o[k]!==undefined).map(k=>[k,o[k]]));
export function shopperState(state){
 if(state.shopperVersion===1)return state;
 const decisions=state.content.decisions.map(d=>{
  const q=d.shopper??{};
  const options=d.options.map(o=>{const v=o.shopper??{},base={...o,...o.display,...v};const safe=fields(base,['id','label','name','kind','tier','price','paidVia','costIncomplete','images','footprint','priceNote','priceText','headline','love','watchOut','bestFor','specs','tableSpecs','table','highlights']);
   for(const k of ['headline','love','watchOut','bestFor','priceNote','priceText'])if(safe[k])safe[k]=v[k]??simple(safe[k]);
   safe.compare=v.compare;safe.ownerReviews=v.ownerReviews??o.ownerReviews??'Few yet';safe.ownerSummary=v.ownerSummary??o.ownerReviewSummary??'';safe.chips=v.chips??[];
   safe.offers=v.offers??(o.offers??[]).filter(x=>!/unverified|unconfirmed/i.test(x.stock)).map(x=>({...x,priceNote:simple(x.priceNote),stock:/ready|low|in stock/i.test(x.stock)?'In stock':simple(x.stock)}));
   safe.video=eligibleVideo(o.video)?{...fields(o.video,['youtubeId','title','channel','thumbnail','kind']),note:v.videoNote??simple(o.video.note)}:null;
   if(!q.groups){safe.specs=Object.fromEntries(Object.entries(o.tableSpecs?{...o.specs,...o.tableSpecs}:o.specs??{}).filter(([k,val])=>!/evidence|main connection|claimed endurance|model status|stock verified|yearly energy|inverter|service centre|backset/i.test(k)&&!research.test(val)).map(([k,val])=>[simple(k.replace('Size W × D × H (cm)','Size (width × depth × height)').replace('Capacity (L)','Storage (L)').replace('Energy ticks','Energy saving rating (ticks)')),simple(val)]));delete safe.tableSpecs;}
   delete safe.table;delete safe.tableSpecs;delete safe.highlights;safe.shopperReady=true;return safe;
  });
  const result={...fields(d,['id','slug','legacySlugs','area','category','group','priority','title','question','stage','status','qty','budget','roughBudget','costBasis','sales','space','sample']),options,shopperGroups:q.groups,answer10s:q.answer10s??simple(d.display?.answer10s??d.answer10s),mustKnow:q.mustKnow??[],contractorNote:q.contractorNote??'',compatibility:q.compatibility??[],alsoConsidered:q.alsoConsidered??[],candidates:[]};result.title=({'Ambient / cove LED':'Soft ceiling lighting','Warm LED / downlights':'Warm ceiling lights','Automated laundry rack':'Motorised clothes rack'})[result.title]??result.title;if(result.roughBudget)result.roughBudget={min:result.roughBudget.min,max:result.roughBudget.max};return result;
 });
 const content={...state.content,decisions};return {...state,shopperVersion:1,content,budget:listTotals(content,state.results)};
}
