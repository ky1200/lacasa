import {VISIT,visitKeys} from './visit-plan.mjs';
const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'S$'+Math.round(n).toLocaleString('en-SG');

// ---------- drawings: every letter in a drawing matches a box to fill in ----------
const tag=(x,y,t)=>`<g class="vd-tag"><circle cx="${x}" cy="${y}" r="9"/><text x="${x}" y="${y+3.6}" text-anchor="middle">${t}</text></g>`;
const arrow=(x1,y1,x2,y2,id)=>`<line class="vd-dim" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-start="url(#${id})" marker-end="url(#${id})"/>`;
function drawing(shape,mid,letters){
 const id='va-'+mid,has=k=>k in letters;
 const defs=`<defs><marker id="${id}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" class="vd-head"/></marker></defs>`;
 let body='',cap='';
 if(shape==='floor'){cap='Seen from above';body=`<rect class="vd-shape" x="40" y="22" width="120" height="78" rx="3"/>${arrow(40,116,160,116,id)}${tag(100,116,'L')}${has('W')?arrow(176,22,176,100,id)+tag(176,61,'W'):''}`;}
 else if(shape==='wall'){cap='Seen from the front';body=`<rect class="vd-shape" x="40" y="18" width="120" height="86" rx="2"/><line class="vd-floor" x1="22" y1="104" x2="178" y2="104"/>${arrow(40,120,160,120,id)}${tag(100,120,'L')}${has('H')?arrow(24,18,24,104,id)+tag(24,61,'H'):''}`;}
 else if(shape==='box'){cap='Front, side and height';body=`<path class="vd-shape" d="M44 52 L132 52 L132 112 L44 112 Z"/><path class="vd-top" d="M44 52 L72 30 L160 30 L132 52 Z"/><path class="vd-side" d="M132 52 L160 30 L160 90 L132 112 Z"/>${arrow(44,126,132,126,id)}${tag(88,126,'L')}${arrow(142,120,170,98,id)}${tag(162,112,'W')}${has('H')?arrow(28,52,28,112,id)+tag(28,82,'H'):''}`;}
 else if(shape==='door'){cap='Door opening, and the wall edge from above';body=`<rect class="vd-wall" x="20" y="14" width="124" height="96"/><rect class="vd-opening" x="52" y="26" width="58" height="84"/><line class="vd-floor" x1="14" y1="110" x2="150" y2="110"/>${arrow(52,124,110,124,id)}${tag(81,124,'L')}${arrow(38,26,38,110,id)}${tag(38,68,'H')}${has('T')?`<rect class="vd-wall" x="162" y="50" width="16" height="44"/>${arrow(162,104,178,104,id)}${tag(170,120,'T')}`:''}`;}
 else if(shape==='height'){cap='Side view';body=`<rect class="vd-ceiling" x="20" y="10" width="160" height="10"/><line class="vd-floor" x1="20" y1="112" x2="180" y2="112"/><circle class="vd-shape" cx="140" cy="62" r="7"/><path class="vd-shape" d="M140 69 V92 M140 76 L128 86 M140 76 L152 86 M140 92 L132 112 M140 92 L148 112"/>${arrow(80,20,80,112,id)}${tag(80,66,'H')}`;}
 else if(shape==='gap'){cap='Seen from above';body=`<rect class="vd-wall" x="164" y="12" width="12" height="104"/><circle class="vd-point" cx="52" cy="64" r="8"/><text class="vd-small" x="52" y="92" text-anchor="middle">light point</text>${arrow(60,64,164,64,id)}${tag(112,64,'D')}`;}
 else if(shape==='ceiling'){cap='Rack area on the ceiling, and height';body=`<rect class="vd-ceiling" x="16" y="8" width="168" height="10"/><path class="vd-top" d="M56 30 L150 30 L170 58 L76 58 Z"/>${arrow(56,24,150,24,id)}${tag(103,24,'L')}${arrow(160,36,180,64,id)}${tag(178,48,'W')}<line class="vd-floor" x1="16" y1="118" x2="184" y2="118"/>${has('H')?arrow(30,18,30,118,id)+tag(30,90,'H'):''}<rect class="vd-shape" x="92" y="86" width="44" height="32" rx="3"/><text class="vd-small" x="114" y="106" text-anchor="middle">washer</text>`;}
 else if(shape==='toilet'){cap='Side view';body=`<rect class="vd-wall" x="16" y="10" width="12" height="102"/><line class="vd-floor" x1="16" y1="112" x2="184" y2="112"/><path class="vd-shape" d="M30 34 H56 V66 H118 Q136 66 132 84 Q126 100 100 100 V112 H70 V96 H56 V34"/><circle class="vd-point" cx="88" cy="118" r="5"/>${arrow(28,128,88,128,id)}${tag(58,128,'R')}<text class="vd-small" x="120" y="132" text-anchor="start">drain centre</text>`;}
 return `<figure class="vd"><svg viewBox="0 0 200 140" role="img" aria-label="${h(cap)}: ${Object.keys(letters).join(', ')}">${defs}${body}</svg><figcaption>${h(cap)}</figcaption></figure>`;
}

// ---------- helpers ----------
const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null;};
export function fitOf(m,values){
 if(!m.need)return null;const parts=Object.entries(m.need);const got=parts.map(([k])=>num(values[`m:${m.id}:${k}`]));
 if(got.some(v=>v===null))return {state:'open',text:'Not measured yet'};
 const bad=parts.map(([k,n],i)=>{const v=got[i];if(n.min!=null&&v<n.min)return `${k} needs at least ${n.min} cm`;if(n.max!=null&&v>n.max)return `${k} must be ${n.max} cm or less`;return null;}).filter(Boolean);
 return bad.length?{state:'bad',text:'Does not fit: '+bad.join('; ')}:{state:'ok',text:'Fits'};
}
const needLine=m=>m.need?Object.entries(m.need).map(([k,n])=>`${k} ${n.min!=null&&n.max!=null?`${n.min}–${n.max}`:n.min!=null?`≥ ${n.min}`:`≤ ${n.max}`} cm`).join(' · '):'';
function roomStats(r,v){const keys=[...r.measure.map(m=>`ok:${m.id}`),...r.check.map((_,i)=>`c:${r.id}:${i}`),...r.ask.map((_,i)=>`a:${r.id}:${i}`),...(r.steigen?[`a:${r.id}:steigen`]:[])];return {done:keys.filter(k=>v[k]==='1').length,total:keys.length};}

function pickOf(m,content){if(!m.pick)return '';const d=content?.decisions?.find(d=>d.id===m.pick[0]),o=d?.options?.find(o=>o.label===m.pick[1]),img=o?.images?.[0];if(!o)return '';const src=img?(/^https:\/\//.test(img.src)?'/img?src='+encodeURIComponent(img.src):img.src):'';return `<p class="vm-pick">${src?`<img src="${h(src)}" alt="" loading="lazy">`:''}<span><small>Going here</small>${h(o.name)}</span></p>`;}
function measureCard(m,v,ro,content){
 const fit=fitOf(m,v),need=needLine(m);
 return `<article class="vm" data-measure="${h(m.id)}"${m.need?` data-need='${h(JSON.stringify(m.need))}'`:''}>
 <div class="vm-head"><h4>${h(m.title)}</h4>${m.item?`<a class="vm-item" href="/${h(m.item)}">See item</a>`:''}</div>
 ${pickOf(m,content)}<div class="vm-body">${drawing(m.shape,m.id,m.fields)}
 <div class="vm-fields">${Object.entries(m.fields).map(([k,label])=>`<label class="vm-field"><span class="vm-letter">${k}</span><span class="vm-label">${h(label)}</span><span class="vm-input"><input inputmode="decimal" autocomplete="off" data-k="m:${h(m.id)}:${k}" value="${h(v[`m:${m.id}:${k}`])}" ${ro?'disabled':''} aria-label="${h(m.title)}: ${k}, ${h(label)}"><span>cm</span></span></label>`).join('')}
 ${need?`<p class="vm-need"><strong>Needs</strong> ${h(need)}</p>`:''}${m.needText?`<p class="vm-note">${h(m.needText)}</p>`:''}
 ${fit?`<p class="vm-fit" data-fit="${fit.state}">${h(fit.text)}</p>`:''}
 <label class="vt vt-done"><input type="checkbox" data-k="ok:${h(m.id)}" ${v[`ok:${m.id}`]==='1'?'checked':''} ${ro?'disabled':''}><span>Measured and photographed</span></label></div></div></article>`;
}
const tick=(key,text,v,ro)=>`<li><label class="vt"><input type="checkbox" data-k="${h(key)}" ${v[key]==='1'?'checked':''} ${ro?'disabled':''}><span>${h(text)}</span></label></li>`;

function room(r,v,ro,content){
 const st=roomStats(r,v);
 return `<section class="vr" id="v-${h(r.id)}" data-room="${h(r.id)}"><div class="vr-head"><h2>${h(r.name)}</h2><span class="vr-meta"><span data-room-count>${st.done} / ${st.total}</span> done · about ${r.minutes} min</span></div>
 ${r.measure.length?`<h3>Measure</h3><div class="vm-list">${r.measure.map(m=>measureCard(m,v,ro,content)).join('')}</div>`:''}
 ${r.check.length?`<h3>Check</h3><ul class="vt-list">${r.check.map((t,i)=>tick(`c:${r.id}:${i}`,t,v,ro)).join('')}</ul>`:''}
 <h3>Ask the contractor</h3><ul class="vt-list">${r.ask.map((t,i)=>tick(`a:${r.id}:${i}`,t,v,ro)).join('')}${r.steigen?tick(`a:${r.id}:steigen`,r.steigen,v,ro):''}</ul>
 ${r.quote.length?`<h3>Quote</h3><div class="vq-list">${r.quote.map(([id,name,allow])=>`<label class="vq"><span class="vq-name">${h(name)}<small>${h(id)}${allow?` · planned ${money(allow)}`:''}</small></span><span class="vq-input"><span>S$</span><input inputmode="decimal" autocomplete="off" data-k="q:${h(id)}" data-allow="${allow}" value="${h(v[`q:${id}`])}" ${ro?'disabled':''} aria-label="Quoted price for ${h(name)}"></span></label>`).join('')}</div>`:''}
 <label class="vn"><span>Notes</span><textarea rows="3" data-k="n:${h(r.id)}" ${ro?'disabled':''} placeholder="Anything else said or seen here">${h(v[`n:${r.id}`])}</textarea></label>
 </section>`;
}

function quoteSummary(plan,v){
 const lines=plan.rooms.flatMap(r=>r.quote),planned=lines.reduce((s,[, ,a])=>s+a,0),quoted=lines.reduce((s,[id])=>s+(num(v[`q:${id}`])??0),0),count=lines.filter(([id])=>num(v[`q:${id}`])!=null).length;
 return `<section class="vr vs" id="v-quote"><div class="vr-head"><h2>Quote total</h2><span class="vr-meta">Target under ${money(plan.target)} including ${money(plan.reserve)} spare</span></div>
 <div class="vs-grid"><div><span>Quoted so far</span><strong data-quote-total>${money(quoted)}</strong><small data-quote-count>${count} of ${lines.length} lines priced</small></div><div><span>Planned for these lines</span><strong>${money(planned)}</strong><small>From the 8 Oct brief</small></div><div><span>Room left before target</span><strong data-quote-left data-budget="${plan.target-plan.reserve}">${money(plan.target-plan.reserve-quoted)}</strong><small>After keeping ${money(plan.reserve)} spare</small></div></div>
 <p class="vm-note">Loose furniture and appliances are separate from this total.</p></section>`;
}

export function visitPage(s,plan=VISIT){
 const v=s.visit??{},ro=!!s.readOnly,all=plan.rooms.map(r=>roomStats(r,v)),done=all.reduce((a,b)=>a+b.done,0),total=all.reduce((a,b)=>a+b.total,0);
 const mins=plan.rooms.reduce((a,r)=>a+r.minutes,0);
 return `<div class="visit" data-visit>
 <div class="page-top"><a class="back" href="/">← Home</a><h1>${h(plan.title)}</h1><p>Wed 11 Nov · contractor walk-through · about ${Math.round(mins/15)/4} hours. Walk the rooms in this order; tick as each part is done.</p></div>
 <div class="vp"><div class="vp-bar"><progress max="${total}" value="${done}" data-visit-progress aria-label="Visit progress"></progress><span data-visit-count>${done} / ${total} done</span></div>
 <nav class="vp-rooms" aria-label="Rooms">${plan.rooms.map((r,i)=>`<a href="#v-${h(r.id)}" data-room-link="${h(r.id)}"${all[i].done===all[i].total?' class="done"':''}>${h(r.name.replace(' (with the contractor)',''))}</a>`).join('')}<a href="#v-quote">Quote total</a></nav>
 <span class="vp-save" data-save-state role="status" aria-live="polite">${ro?'Read-only preview':''}</span></div>
 <section class="vb"><div><h2>Bring</h2><ul>${plan.bring.map(t=>`<li>${h(t)}</li>`).join('')}</ul></div><div><h2>How to measure</h2><ul>${plan.howTo.map(t=>`<li>${h(t)}</li>`).join('')}</ul></div>
 <div class="vb-key"><h2>The letters</h2><p><b>L</b> side to side · <b>W</b> front to back · <b>H</b> height · <b>T</b> thickness · <b>D</b> distance · <b>R</b> wall to toilet drain. All in cm.</p></div></section>
 ${plan.rooms.map(r=>room(r,v,ro,s.content)).join('')}
 ${quoteSummary(plan,v)}
 </div>`;
}

export {visitKeys,VISIT};

// Copy measured sizes onto the matching item pages.
export function applyVisitSpaces(content,values,plan=VISIT){
 const map=new Map();
 for(const r of plan.rooms)for(const m of r.measure)if(m.space)for(const id of m.space.decisions){const sp={};for(const [field,letter] of Object.entries(m.space.map)){const n=num(values[`m:${m.id}:${letter}`]);if(n!=null)sp[field]=n;}if(Object.keys(sp).length)map.set(id,sp);}
 if(!map.size)return content;
 return {...content,decisions:content.decisions.map(d=>map.has(d.id)?{...d,space:{...(d.space??{label:'Measured space'}),...map.get(d.id),source:'Measured on 11 Nov',measured:true}}:d)};
}
