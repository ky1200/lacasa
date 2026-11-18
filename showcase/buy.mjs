import {BUY,buyTotals,lineSGD} from './buy-plan.mjs';
const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sgd=n=>(n<0?'−':'')+'S$'+Math.abs(Math.round(n)).toLocaleString('en-SG');
const cash=(n,cur)=>cur==='MYR'?'RM'+Number(n).toLocaleString('en-SG',{maximumFractionDigits:2}):(n<0?'−':'')+'S$'+Math.abs(Number(n)).toLocaleString('en-SG',{maximumFractionDigits:2});
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const dayLabel=iso=>{const [y,m,d]=iso.split('-').map(Number),t=new Date(Date.UTC(y,m-1,d));return `${DAYS[t.getUTCDay()]} ${d} ${MONTHS[m-1]}`;};
const ext=href=>/^https?:\/\//.test(href??'');
const out=(href,text)=>href?`<a href="${h(href)}"${ext(href)?' target="_blank" rel="noopener noreferrer"':''}>${h(text)}${ext(href)?' ↗':''}</a>`:'';

function item(i,rate){
 const qty=i.qty??1,line=lineSGD(i,rate);
 const alts=i.alts?.length?`<details class="buy-alts"><summary>${i.alts.length} other option${i.alts.length>1?'s':''} (not counted)</summary><ul>${i.alts.map(a=>`<li><span>${h(a.name)}</span><strong>${cash(a.price,a.cur)}</strong><small>${h(a.shop)} · ${h(a.type)} ${out(a.href,'See')}</small></li>`).join('')}</ul></details>`:'';
 return `<article class="buy-item${i.est?' is-est':''}">
<div class="buy-item-top"><h3>${h(i.name)}</h3><strong class="buy-line">${sgd(line)}</strong></div>
${i.model?`<p class="buy-model">${h(i.model)}</p>`:''}
<p class="buy-math">${qty>1?`${qty} × `:''}${cash(i.price,i.cur)}${i.cur==='MYR'?` <span class="muted">≈ ${sgd(line)}</span>`:''}${i.est?' <span class="buy-badge">Rough budget</span>':''}</p>
<p class="buy-shop"><span>${h(i.shop)}</span><span class="buy-type">${h(i.type)}</span>${out(i.href,'See price')}${i.src?out(i.src,'Source'):''}</p>
${i.date?`<p class="buy-date"><span class="buy-chip">${h(dayLabel(i.date))}</span>${h(i.when??'')}</p>`:''}
${i.note?`<p class="buy-note">${h(i.note)}</p>`:''}${alts}</article>`;
}

export function buyPage(plan=BUY){
 const t=buyTotals(plan),max=Math.max(...t.rooms.map(r=>Math.abs(r.total)));
 const summary=t.rooms.map(r=>`<a class="buy-sum-row" href="#buy-${h(r.id)}"><span>${h(r.name)}</span><strong>${sgd(r.total)}</strong><i style="--w:${Math.max(2,Math.round(Math.abs(r.total)/max*100))}%"></i></a>`).join('');
 const rooms=plan.rooms.map(r=>{const rt=t.rooms.find(x=>x.id===r.id);return `<section class="buy-room" id="buy-${h(r.id)}"><details open><summary><h2>${h(r.name)}</h2><strong>${sgd(rt.total)}</strong></summary>${r.items.map(i=>item(i,plan.rate)).join('')}</details></section>`;}).join('');
 return `<article class="buy-page">
<header class="buy-head"><span class="eyebrow">Prices checked ${h(dayLabel(plan.checked))} 2026</span><h1>To-buy list</h1>
<p class="buy-total">${sgd(t.total)}</p><p class="muted">Everything below, in Singapore dollars. Includes ${sgd(t.est)} of rough budgets (marked). RM converted at RM${plan.rate} = S$1 (${out(plan.rateSource,'rate')}).</p>
<div class="buy-actions"><a class="button primary" href="/buy.csv" download>Download spreadsheet (CSV)</a></div></header>
<section class="buy-block"><h2>By room</h2><div class="buy-sum">${summary}</div></section>
<section class="buy-block"><h2>Contractor files</h2><ul class="buy-files">${plan.files.map(f=>`<li>${out(f.href,f.name)}<small>${h(f.note)}</small></li>`).join('')}</ul></section>
<section class="buy-block"><h2>Sale dates</h2><ul class="buy-sales">${plan.sales.map(s=>`<li><span class="buy-chip">${h(dayLabel(s.date))}</span>${h(s.name)}</li>`).join('')}</ul></section>
${rooms}
<section class="buy-block"><h2>Ask the contractor</h2>${plan.contractor.map(c=>`<div class="buy-qa"><h3>${h(c.q)}</h3><p>${h(c.a)}</p></div>`).join('')}</section>
<section class="buy-block"><h2>Lights and switches</h2><ul class="buy-notes">${plan.notes.map(n=>`<li>${h(n)}</li>`).join('')}</ul></section>
</article>`;
}
