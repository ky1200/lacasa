import {BUY,TAGS,TAG_NAMES,buyTotals,choiceOf,fullSGD,optionsOf,toSGD} from './buy-plan.mjs';
import {IMG} from './buy-images.mjs';
const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sgd=n=>(n<0?'−':'')+'S$'+Math.abs(Math.round(n)).toLocaleString('en-SG');
const dp=n=>({minimumFractionDigits:Number.isInteger(Number(n))?0:2,maximumFractionDigits:2});
const cash=(n,cur)=>cur==='MYR'?'RM'+Number(n).toLocaleString('en-SG',dp(n)):(n<0?'−':'')+'S$'+Math.abs(Number(n)).toLocaleString('en-SG',dp(n));
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],MONTHS_FULL=['January','February','March','April','May','June','July','August','September','October','November','December'];
export const dayLabel=iso=>{const [y,m,d]=iso.split('-').map(Number),t=new Date(Date.UTC(y,m-1,d));return `${DAYS[t.getUTCDay()]} ${d} ${MONTHS[m-1]}`;};
export const sgToday=(now=Date.now())=>new Date(now+8*3600e3).toISOString().slice(0,10);
const ext=href=>/^https?:\/\//.test(href??'');
const out=(href,text)=>href?`<a href="${h(href)}"${ext(href)?' target="_blank" rel="noopener noreferrer"':''}>${h(text)}${ext(href)?' ↗':''}</a>`:'';
// One colour per room so it is clear which section is on screen.
export const ROOM_COLOURS={contractor:'#56607a',aircon:'#2c6fb7',living:'#b4532a',dining:'#6f7d1e',kitchen:'#13817a','common-bath':'#1b8fb0','master-bath':'#6a4fb3',ky:'#b37509',kx:'#9b3c7d',ks:'#c2405a',entrance:'#3f6a4e'};
const roomColour=id=>ROOM_COLOURS[id]??'#56607a';

// Photos are saved on this site (public/images/buy). ex = a general example photo, not the exact model.
export const photoOf=(id,k)=>IMG[`${id}#${k}`]??null;
const photoInner=(p,name)=>p?`<img class="buy-img" src="${h(p.src)}" alt="" loading="lazy" decoding="async">${p.ex?'<span class="buy-ex">Example</span>':''}<span class="photo-caption">${h(name)}${p.ex?' (example photo, not the exact model)':''}</span>`:'<span class="buy-img is-empty"></span>';
const photo=(p,name,cls)=>p?`<button type="button" class="buy-photo ${cls}" data-enlarge aria-label="See a bigger photo of ${h(name)}">${photoInner(p,name)}</button>`:`<span class="buy-photo ${cls}" aria-hidden="true">${photoInner(null,name)}</span>`;
const math=(o,qty,rate)=>`${qty>1?`${qty} × `:''}${cash(o.price,o.cur)}${o.cur==='MYR'?` ≈ ${sgd(toSGD(o,rate)*qty)}`:''}`;
const shopLine=o=>`<span>${h(o.shop)}</span><span class="buy-type">${h(o.type)}</span>${out(o.href,'See price')}${o.src?out(o.src,'Source'):''}`;

// Rooms with no photos: contractor work and admin lines are not products.
export const NO_PHOTO_ROOMS=new Set(['contractor']);
function item(i,rate,v,ro,pics=true){
 const c=choiceOf(i,v),o=c.opt,opts=optionsOf(i),dis=ro?' disabled':'';
 const data=opts.map((x,k)=>({u:Math.round(toSGD(x,rate)*100)/100,p:cash(x.price,x.cur),myr:x.cur==='MYR',est:!!(x.est??(k===0&&i.est))}));
 const list=opts.length>1?`<details class="buy-alts"><summary>Pick: <span data-f="pickname">${c.pick?`Option ${c.pick}`:'Recommended'}</span> <span class="buy-count">${opts.length} choices</span></summary><fieldset data-lightbox-group><legend class="sr-only">Choose one for ${h(i.name)}</legend>${opts.map((x,k)=>`<label class="buy-opt" data-name="${h(x.name)}" data-model="${h(x.model??'')}"><input type="radio" name="pick-${h(i.id)}" value="${k}" data-b="pick"${k===c.pick?' checked':''}${dis}>${pics?photo(photoOf(i.id,k),x.name,'opt'):''}<span class="buy-opt-text"><b>${k?'':'<span class="buy-rec">Recommended</span> '}${h(x.name)}</b>${x.model?`<small>${h(x.model)}</small>`:''}<small class="buy-opt-shop">${shopLine(x)}</small>${k&&x.note?`<small>${h(x.note)}</small>`:''}</span><strong>${cash(x.price,x.cur)}</strong></label>`).join('')}</fieldset></details>`:'';
 const legacyOff=v[`b:${i.id}:off`]==='1'&&!v[`b:${i.id}:tag`];
 return `<article class="buy-item${c.off?' is-off':''}${c.tag==='after'?' is-after':''}${data[c.pick].est?' is-est':''}" id="it-${h(i.id)}" data-buy="${h(i.id)}" data-tag="${c.tag}" data-tag0="${i.tag??'before'}"${legacyOff?' data-off="1"':''} data-qty0="${i.qty??1}" data-o="${h(JSON.stringify(data))}">
<div class="buy-item-top${pics?'':' no-photo'}">${pics?photo(photoOf(i.id,c.pick),o.name,'main'):''}<div class="buy-item-head">${i.decided?'<span class="buy-decided">Decided</span>':''}<h3 data-f="name">${h(o.name)}</h3><p class="buy-model" data-f="model"${o.model?'':' hidden'}>${h(o.model??'')}</p></div><strong class="buy-line" data-f="line">${sgd(fullSGD(i,v,rate))}</strong></div>
<p class="buy-math"${c.qty>1||o.cur==='MYR'||data[c.pick].est?'':' hidden'}><span data-f="math">${math(o,c.qty,rate)}</span> <span class="buy-badge" data-f="est"${data[c.pick].est?'':' hidden'}>Estimate</span></p>
<div class="buy-ctrl"><fieldset class="buy-tag"><legend class="sr-only">When to pay for ${h(i.name)}</legend>${TAGS.map(t=>`<label class="buy-tag-${t}"><input type="radio" name="tag-${h(i.id)}" value="${t}" data-b="tag"${c.tag===t?' checked':''}${dis}><span>${t==='before'?'Before':t==='after'?'After':'Maybe'}</span></label>`).join('')}</fieldset>
<div class="buy-qty" role="group" aria-label="Quantity"><button type="button" data-b="minus" aria-label="One less"${dis}>−</button><output data-f="qty" aria-live="polite">${c.qty}</output><button type="button" data-b="plus" aria-label="One more"${dis}>+</button></div></div>
<p class="buy-shop" data-f="shop">${shopLine(o)}</p>
${i.date?`<p class="buy-date"><a class="buy-chip" href="#day-${h(i.date)}">${h(dayLabel(i.date))}</a>${h(i.when??'')}</p>`:''}
${i.note?`<p class="buy-note" data-f="note"${c.pick?' hidden':''}>${h(i.note)}</p>`:''}${list}</article>`;
}

// Month grids from the first to the last date that matters, Monday first.
function calendar(plan,today){
 const events={};const add=(d,k,x)=>{(events[d]??={sales:[],items:[]})[k].push(x);};
 plan.sales.forEach(s=>add(s.date,'sales',s));plan.rooms.forEach(r=>r.items.forEach(i=>i.date&&add(i.date,'items',{i,r})));
 const dates=Object.keys(events).sort(),first=dates[0].slice(0,7),last=dates.at(-1).slice(0,7),months=[];
 for(let [y,m]=first.split('-').map(Number);`${y}-${String(m).padStart(2,'0')}`<=last;m===12?(y++,m=1):m++)months.push([y,m]);
 const grid=([y,m])=>{const lead=(new Date(Date.UTC(y,m-1,1)).getUTCDay()+6)%7,n=new Date(Date.UTC(y,m,0)).getUTCDate(),cells=[...Array(lead).fill(null),...Array.from({length:n},(_,k)=>k+1)];while(cells.length%7)cells.push(null);
  const rows=[];for(let k=0;k<cells.length;k+=7)rows.push(cells.slice(k,k+7));
  return `<div class="buy-month"><h3>${MONTHS_FULL[m-1]} ${y}</h3><table class="buy-cal"><thead><tr>${['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d=>`<th scope="col"><abbr title="${d}">${d[0]}</abbr></th>`).join('')}</tr></thead><tbody>${rows.map(w=>`<tr>${w.map(d=>{if(!d)return '<td></td>';const iso=`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`,e=events[iso],cls=['buy-day',e?.sales.length?'sale':'',e?.items.length?'buy':'',iso===today?'today':'',iso<today?'past':''].filter(Boolean).join(' ');
   const label=`${dayLabel(iso)}${iso===today?', today':''}${e?.sales.length?', sale':''}${e?.items.length?`, ${e.items.length} to buy`:''}`;
   return `<td>${e?`<a class="${cls}" href="#day-${iso}" aria-label="${h(label)}">${d}</a>`:`<span class="${cls}" aria-label="${h(label)}">${d}</span>`}</td>`;}).join('')}</tr>`).join('')}</tbody></table></div>`;};
 const list=dates.map(d=>{const e=events[d];return `<li id="day-${d}" class="buy-dayrow${e.sales.length?' has-sale':''}"><span class="buy-chip">${h(dayLabel(d))}</span><div>${e.sales.map(s=>`<p class="buy-sale-name">${h(s.name)}</p>`).join('')}${e.items.length?`<p class="buy-day-items">${e.items.map(({i,r})=>{const short=i.name.split(/,| \(/)[0],dup=e.items.filter(x=>x.i.name.split(/,| \(/)[0]===short).length>1;return `<a href="#it-${h(i.id)}" style="--rc:${roomColour(r.id)}">${dup?`${h(r.name.replace(/ bedroom| bathroom/,''))}: `:''}${h(short)}</a>`;}).join('')}</p>`:''}</div></li>`;}).join('');
 return `<div class="buy-cals">${months.map(grid).join('')}</div><p class="buy-cal-key"><span class="k sale"></span>Sale day <span class="k buy"></span>Buy day <span class="k today"></span>Today</p><ol class="buy-days">${list}</ol>`;
}

// To-do list: shared ticks saved as t:<id> = '1'.
function todoList(plan,v,ro){const list=plan.todo??[];if(!list.length)return '';const done=list.filter(t=>v[`t:${t.id}`]==='1').length,next=list.find(t=>v[`t:${t.id}`]!=='1');
 return fold('buy-todo','tone-coral',`To do <small class="buy-fold-meta"><span data-todo-done>${done}</span> of ${list.length} done${next?` · next: ${h(next.t.split(/[:(,]/)[0])}`:''}</small>`,`<p class="muted">Ticks are shared with the family.</p><ul class="buy-todo">${list.map(t=>{const on=v[`t:${t.id}`]==='1';return `<li class="${on?'is-done':''}"><label><input type="checkbox" data-todo="t:${h(t.id)}"${on?' checked':''}${ro?' disabled':''}><span class="buy-todo-text"><b>${h(t.t)}</b>${t.n?`<small>${h(t.n)}</small>`:''}</span></label><span class="buy-todo-side"><span class="buy-chip${t.date?'':' is-now'}">${t.date?h(dayLabel(t.date)):'Now'}</span>${t.href?`<a href="${h(t.href)}">See</a>`:''}</span></li>`;}).join('')}</ul>`,false,true);}
// A folded panel: closed by default so the room list is near the top. Links to #id open it (showcase.js).
function fold(id,tone,title,body,open=false,rawTitle=false){return `<section class="buy-block buy-panel buy-fold ${tone}" id="${h(id)}"><details${open?' open':''}><summary><h2>${rawTitle?title:h(title)}</h2><span class="buy-fold-caret" aria-hidden="true"></span></summary><div class="buy-fold-body">${body}</div></details></section>`;}
const decClass=s=>['Go ahead','Changed','New','Decided'].includes(s)?'is-done':s==='Removed'?'is-off':'is-open';
export function buyPage(v={},ro=false,plan=BUY,today=sgToday()){
 const t=buyTotals(plan,v),max=Math.max(...t.rooms.map(r=>Math.abs(r.total)),1);
 const summary=t.rooms.map(r=>`<a class="buy-sum-row" href="#buy-${h(r.id)}" data-sum="${h(r.id)}" style="--rc:${roomColour(r.id)}"><span><i class="dot"></i>${h(r.name)}</span><strong>${sgd(r.total)}</strong><i class="bar" style="--w:${Math.max(2,Math.round(Math.abs(r.total)/max*100))}%"></i></a>`).join('');
 const rooms=plan.rooms.map(r=>{const rt=t.rooms.find(x=>x.id===r.id);return `<section class="buy-room" id="buy-${h(r.id)}" data-room="${h(r.id)}" style="--rc:${roomColour(r.id)}"><details open><summary><span class="buy-room-name"><h2>${h(r.name)}</h2><small>${r.items.length} ${r.items.length===1?'item':'items'}</small></span><strong data-room-total>${sgd(rt.total)}</strong></summary>${r.items.map(i=>item(i,plan.rate,v,ro,!NO_PHOTO_ROOMS.has(r.id))).join('')}</details></section>`;}).join('');
 return `<article class="buy-page" data-buy-page data-rate="${plan.rate}">
<header class="buy-head"><span class="eyebrow">Prices checked ${h(dayLabel(plan.checked))} 2026</span><h1>To-buy list</h1>
<p class="muted">Tag each item Before, After (move-in) or Maybe (not in the total). Open "Pick" to choose another model. Choices are shared with the family.</p></header>
<div class="buy-bar"><div class="buy-bar-top"><span class="buy-bar-label">Before move-in</span><strong class="buy-total" data-buy-before>${sgd(t.before)}</strong></div>
<div class="buy-bar-meta"><span class="buy-after">After move-in: <b data-buy-after>${sgd(t.after)}</b></span><span>Both: <b data-buy-total>${sgd(t.total)}</b></span><span class="buy-off" data-buy-offwrap${t.removed?'':' hidden'}>Maybe, not in total: <b data-buy-off>${sgd(t.offTotal)}</b> (<span data-buy-removed>${t.removed===1?'1 item':t.removed+' items'}</span>)</span><span>Estimates in total: <b data-buy-est>${sgd(t.est)}</b></span><span class="buy-status" data-buy-status>${ro?'View only':'Saved'}</span></div></div>
<fieldset class="buy-show"><legend>Show</legend>${['all',...TAGS].map(x=>`<label><input type="radio" name="buy-show" value="${x}" data-show${x==='all'?' checked':''}><span>${x==='all'?'All':x==='before'?'Before':x==='after'?'After':'Maybe'}</span></label>`).join('')}</fieldset>
<p class="muted buy-rate">Singapore dollars. RM converted at RM${plan.rate} = S$1 (${out(plan.rateSource,'rate')}). "Estimate" means no exact shop price yet (for example the sofa, or contractor changes not priced yet), so that number can still change.</p>
<div class="buy-actions"><a class="button primary" href="/buy.csv" download>Download spreadsheet (CSV)</a></div>
<nav class="buy-jump" aria-label="On this page"><a href="#buy-todo">To do</a><a href="#buy-dates">Dates</a><a href="#buy-measure">3 Dec checklist</a><a href="#buy-decisions">Reno decisions</a><a href="#buy-qa">2nd quotation</a><a href="#buy-files">Files</a><a href="/plan">Floor plan</a><a href="/research">Research</a></nav>
${todoList(plan,v,ro)}
${fold('buy-rooms-sum','tone-indigo',`By room <small class="buy-fold-meta">${t.rooms.length} rooms, tap to jump</small>`,`<div class="buy-sum">${summary}</div>`,false,true)}
${rooms}
<nav class="buy-rail" data-rail aria-label="Rooms" hidden><details class="buy-rail-menu"><summary><i class="dot" data-rail-dot></i><span data-rail-name>Rooms</span><span class="buy-rail-caret" aria-hidden="true">▴</span></summary><ul>${plan.rooms.map(r=>`<li><a href="#buy-${h(r.id)}" data-rail-link="${h(r.id)}" style="--rc:${roomColour(r.id)}"><i class="dot"></i>${h(r.name)}</a></li>`).join('')}</ul></details></nav>
<h2 class="buy-more-title">Plans, checklists and notes</h2>
${fold('buy-dates','tone-coral','Sale and buy dates',calendar(plan,today))}
${fold('buy-measure','tone-moss','On 3 Dec (keys): measure and check, then buy',`<ol class="buy-measure">${(plan.measure??[]).map(m=>`<li><b>${h(m.t)}</b><span>${h(m.n)}</span></li>`).join('')}</ol>`)}
${fold('buy-decisions','tone-sand',plan.decisionsTitle??'Contractor decisions',`${plan.decisionsNote?`<p class="buy-dec-note">${h(plan.decisionsNote)}</p>`:''}<ul class="buy-decisions">${(plan.decisions??[]).map(d=>`<li><span class="buy-dec ${decClass(d.s)}">${h(d.s)}</span><div><b>${h(d.t)}</b>${d.n?`<small>${h(d.n)}</small>`:''}</div></li>`).join('')}</ul>`)}
${fold('buy-qa','tone-indigo','Check in the 2nd quotation',plan.contractor.map(c=>`<div class="buy-qa"><h3>${h(c.q)}</h3><p>${h(c.a)}</p></div>`).join(''))}
${fold('buy-files','tone-sand','Contractor files',`<p class="muted">Tap a file to open it.</p><div class="buy-files">${plan.files.map(f=>`<a class="buy-file" href="${h(f.href)}" target="_blank" rel="noopener"><span class="buy-file-icon" aria-hidden="true">PDF</span><span class="buy-file-text"><b>${h(f.name)}</b><small>${h(f.note)}</small></span><span class="buy-file-open">Open ↗</span></a>`).join('')}</div>`)}
${fold('buy-lights','tone-sand','Light types',`<div class="buy-lights" data-lightbox-group>${(plan.lights??[]).map(l=>`<div class="buy-light">${photo({src:l.img,ex:l.ex},l.name,'light')}<div><b>${h(l.name)}</b><span>${h(l.t)}</span></div></div>`).join('')}</div>`)}
${fold('buy-mattress-brands','tone-indigo','Mattress brands to try in JB',`<p class="muted">Lie on each in the showroom first. All have queen and super single.</p><ul class="buy-brands">${(plan.mattressBrands??[]).map(b=>`<li>${out(b.href,b.name)}<small>${h(b.n)}</small></li>`).join('')}</ul>`)}
${fold('buy-notes','tone-moss','Switches, Wi-Fi and aircon',`<ul class="buy-notes">${plan.notes.map(n=>`<li>${h(n)}</li>`).join('')}</ul>`)}
</article>`;
}
