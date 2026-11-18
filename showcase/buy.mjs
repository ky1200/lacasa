import {BUY,buyTotals,choiceOf,chosenSGD,optionsOf,toSGD} from './buy-plan.mjs';
import {IMG} from './buy-images.mjs';
const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sgd=n=>(n<0?'−':'')+'S$'+Math.abs(Math.round(n)).toLocaleString('en-SG');
const cash=(n,cur)=>cur==='MYR'?'RM'+Number(n).toLocaleString('en-SG',{maximumFractionDigits:2}):(n<0?'−':'')+'S$'+Math.abs(Number(n)).toLocaleString('en-SG',{maximumFractionDigits:2});
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const dayLabel=iso=>{const [y,m,d]=iso.split('-').map(Number),t=new Date(Date.UTC(y,m-1,d));return `${DAYS[t.getUTCDay()]} ${d} ${MONTHS[m-1]}`;};
const ext=href=>/^https?:\/\//.test(href??'');
const out=(href,text)=>href?`<a href="${h(href)}"${ext(href)?' target="_blank" rel="noopener noreferrer"':''}>${h(text)}${ext(href)?' ↗':''}</a>`:'';
// Product photos come through the site's own image proxy (/img), which only serves photos listed in buy-images.mjs.
export const buyImage=o=>{const src=o.img??IMG[o.href];return src?'/img?src='+encodeURIComponent(src):'';};
const thumb=(src,cls='buy-thumb')=>src?`<img class="${cls}" src="${h(src)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">`:`<span class="${cls} is-empty" aria-hidden="true"></span>`;
const math=(o,qty,rate)=>`${qty>1?`${qty} × `:''}${cash(o.price,o.cur)}${o.cur==='MYR'?` ≈ ${sgd(toSGD(o,rate)*qty)}`:''}`;
const shopLine=o=>`<span>${h(o.shop)}</span><span class="buy-type">${h(o.type)}</span>${out(o.href,'See price')}${o.src?out(o.src,'Source'):''}`;

function item(i,rate,v,ro){
 const c=choiceOf(i,v),o=c.opt,opts=optionsOf(i),dis=ro?' disabled':'';
 const data=opts.map((x,k)=>({u:Math.round(toSGD(x,rate)*100)/100,p:cash(x.price,x.cur),myr:x.cur==='MYR',est:!!(x.est??(k===0&&i.est))}));
 const list=opts.length>1?`<details class="buy-alts"><summary>Pick: <span data-f="pickname">${c.pick?`Option ${c.pick}`:'Recommended'}</span> <span class="muted">· ${opts.length} choices</span></summary><fieldset><legend class="sr-only">Choose one for ${h(i.name)}</legend>${opts.map((x,k)=>`<label class="buy-opt" data-name="${h(x.name)}" data-model="${h(x.model??'')}"><input type="radio" name="pick-${h(i.id)}" value="${k}" data-b="pick"${k===c.pick?' checked':''}${dis}>${thumb(buyImage(x),'buy-opt-img')}<span class="buy-opt-text"><b>${k?'':'<span class="buy-rec">Recommended</span> '}${h(x.name)}</b>${x.model?`<small>${h(x.model)}</small>`:''}<small class="buy-opt-shop">${shopLine(x)}</small>${k&&x.note?`<small>${h(x.note)}</small>`:''}</span><strong>${cash(x.price,x.cur)}</strong></label>`).join('')}</fieldset></details>`:'';
 return `<article class="buy-item${c.off?' is-off':''}${data[c.pick].est?' is-est':''}" data-buy="${h(i.id)}" data-qty0="${i.qty??1}" data-o="${h(JSON.stringify(data))}">
<div class="buy-item-top">${thumb(buyImage(o))}<div class="buy-item-head"><h3 data-f="name">${h(o.name)}</h3><p class="buy-model" data-f="model"${o.model?'':' hidden'}>${h(o.model??'')}</p></div><strong class="buy-line" data-f="line">${sgd(chosenSGD(i,v,rate))}</strong></div>
<p class="buy-math"><span data-f="math">${math(o,c.qty,rate)}</span> <span class="buy-badge" data-f="est"${data[c.pick].est?'':' hidden'}>Rough budget</span></p>
<div class="buy-ctrl"><label class="buy-switch"><input type="checkbox" data-b="in"${c.off?'':' checked'}${dis}><span data-f="inlabel">${c.off?'Not counted':'Counted'}</span></label>
<div class="buy-qty" role="group" aria-label="Quantity"><button type="button" data-b="minus" aria-label="One less"${dis}>−</button><output data-f="qty" aria-live="polite">${c.qty}</output><button type="button" data-b="plus" aria-label="One more"${dis}>+</button></div></div>
<p class="buy-shop" data-f="shop">${shopLine(o)}</p>
${i.date?`<p class="buy-date"><span class="buy-chip">${h(dayLabel(i.date))}</span>${h(i.when??'')}</p>`:''}
${i.note?`<p class="buy-note" data-f="note"${c.pick?' hidden':''}>${h(i.note)}</p>`:''}${list}</article>`;
}

export function buyPage(v={},ro=false,plan=BUY){
 const t=buyTotals(plan,v),max=Math.max(...t.rooms.map(r=>Math.abs(r.total)),1);
 const summary=t.rooms.map(r=>`<a class="buy-sum-row" href="#buy-${h(r.id)}" data-sum="${h(r.id)}"><span>${h(r.name)}</span><strong>${sgd(r.total)}</strong><i style="--w:${Math.max(2,Math.round(Math.abs(r.total)/max*100))}%"></i></a>`).join('');
 const rooms=plan.rooms.map(r=>{const rt=t.rooms.find(x=>x.id===r.id);return `<section class="buy-room" id="buy-${h(r.id)}" data-room="${h(r.id)}"><details open><summary><h2>${h(r.name)}</h2><strong data-room-total>${sgd(rt.total)}</strong></summary>${r.items.map(i=>item(i,plan.rate,v,ro)).join('')}</details></section>`;}).join('');
 return `<article class="buy-page" data-buy-page data-rate="${plan.rate}">
<header class="buy-head"><span class="eyebrow">Prices checked ${h(dayLabel(plan.checked))} 2026</span><h1>To-buy list</h1>
<p class="muted">Untick an item to take it out of the total. Use + and − for how many. Open "Pick" on an item to choose a different model; the total uses the one picked. Choices are shared with the whole family.</p></header>
<div class="buy-bar"><div><span class="buy-bar-label">Total</span><strong class="buy-total" data-buy-total>${sgd(t.total)}</strong></div><small><span data-buy-removed>${t.removed?`${t.removed} not counted`:'All items counted'}</span> · <span data-buy-est>${sgd(t.est)}</span> rough · <span data-buy-status>${ro?'View only':'Saved'}</span></small></div>
<p class="muted buy-rate">Singapore dollars. RM converted at RM${plan.rate} = S$1 (${out(plan.rateSource,'rate')}). Rough budgets have a dashed border.</p>
<div class="buy-actions"><a class="button primary" href="/buy.csv" download>Download spreadsheet (CSV)</a></div>
<section class="buy-block"><h2>By room</h2><div class="buy-sum">${summary}</div></section>
<section class="buy-block"><h2>Contractor files</h2><ul class="buy-files">${plan.files.map(f=>`<li>${out(f.href,f.name)}<small>${h(f.note)}</small></li>`).join('')}</ul></section>
<section class="buy-block"><h2>Sale dates</h2><ul class="buy-sales">${plan.sales.map(s=>`<li><span class="buy-chip">${h(dayLabel(s.date))}</span>${h(s.name)}</li>`).join('')}</ul></section>
${rooms}
<section class="buy-block"><h2>Ask the contractor</h2>${plan.contractor.map(c=>`<div class="buy-qa"><h3>${h(c.q)}</h3><p>${h(c.a)}</p></div>`).join('')}</section>
<section class="buy-block"><h2>Lights and switches</h2><ul class="buy-notes">${plan.notes.map(n=>`<li>${h(n)}</li>`).join('')}</ul></section>
</article>`;
}
