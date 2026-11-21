// /plan (interactive floor plan) and /research pages. Drawing and dragging happen in public/plan.js.
import {PLAN, planState, buyItemById} from './plan-data.mjs';
import {RESEARCH} from './research.mjs';
import {BUY, choiceOf, optionsOf, toSGD} from './buy-plan.mjs';
import {photoOf, ROOM_COLOURS} from './buy.mjs';
const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const money = (n, cur) => n == null ? 'Price to get' : (cur === 'MYR' ? 'RM' : 'S$') + Number(n).toLocaleString('en-SG', {minimumFractionDigits: Number.isInteger(Number(n)) ? 0 : 2, maximumFractionDigits: 2});
const ext = href => /^https?:\/\//.test(href ?? '');

// Everything the browser needs, kept small: geometry, saved positions, linked to-buy options and research.
export function planData(v = {}, ro = false) {
 const st = planState(v), buyIds = [...new Set(PLAN.items.flatMap(i => i.buy ?? []))];
 const buy = {};
 for (const id of buyIds) {
  const f = buyItemById(id); if (!f) continue;
  const c = choiceOf(f.item, v);
  buy[id] = {name: f.item.name, room: f.room.name, tag: c.tag, qty: c.qty, pick: c.pick, opts: optionsOf(f.item).map((o, k) => ({n: o.name, m: o.model ?? '', p: money(o.price, o.cur), s: Math.round(toSGD(o, BUY.rate) * 100) / 100, shop: o.shop ?? '', href: o.href ?? '', est: !!(o.est ?? (k === 0 && f.item.est)), img: photoOf(id, k)?.src ?? '', note: k ? o.note ?? '' : ''}))};
 }
 const research = Object.fromEntries(RESEARCH.map(t => [t.id, {title: t.title, status: t.status, answer: t.answer, updated: t.updated, list: t.shortlist.map(o => ({g: o.group, n: o.name, p: money(o.price, o.cur), shop: o.shop, href: o.href ?? '', pick: !!o.pick, why: o.why ?? '', specs: o.specs ?? []}))}]));
 return {ro, rate: BUY.rate, img: PLAN.img, W: Math.round(PLAN.imgW * PLAN.mmPerPx), H: Math.round(PLAN.imgH * PLAN.mmPerPx), rooms: PLAN.rooms, walls: PLAN.walls, items: st.items, points: st.points, pointTypes: PLAN.pointTypes, wifi: PLAN.wifi, colours: ROOM_COLOURS, buy, research};
}

const ROOM_CHIPS = [['all', 'Whole home'], ['ky', 'KY'], ['ks', 'KS'], ['kx', 'KX'], ['living', 'Living'], ['dining', 'Dining'], ['kitchen', 'Kitchen + yard'], ['common-bath', 'Common bath'], ['master-bath', 'Master bath']];
const LAYERS = [['furniture', 'Furniture', true], ['lights', 'Lights and fans', true], ['power', 'Sockets and switches', false], ['net', 'Network', true], ['wifi', 'Wi-Fi coverage', false]];

export function planPage(v = {}, ro = false) {
 const data = planData(v, ro);
 return `<article class="plan-page" data-plan-page>
<header class="plan-head"><span class="eyebrow">I-Niche proposed plan, 13 Nov · drawn to scale</span><h1>Floor plan</h1>
<p class="plan-lede">Tap a room to zoom in, tap a bed, sofa, TV or router for its size and choices. <b>Move</b> drags things, <b>Measure</b> takes any distance, <b>Night</b> shows where the light falls. Changes are shared with the family.</p></header>
<nav class="plan-rooms" aria-label="Zoom to a room">${ROOM_CHIPS.map(([id, n], k) => `<button type="button" data-zoom="${id}"${k ? '' : ' aria-pressed="true"'}>${h(n)}</button>`).join('')}</nav>
<fieldset class="plan-layers"><legend class="sr-only">Show on the plan</legend>${LAYERS.map(([id, n, on]) => `<label class="plan-layer plan-layer-${id}"><input type="checkbox" data-layer="${id}"${on ? ' checked' : ''}><span>${h(n)}</span></label>`).join('')}</fieldset>
<div class="plan-modes" aria-label="Tools" role="group"><label class="plan-move${ro ? ' is-ro' : ''}"><input type="checkbox" data-move${ro ? ' disabled' : ''}><span>Move</span></label><label class="plan-measure-tool"><input type="checkbox" data-tape><span>Measure</span></label><label class="plan-night-tool"><input type="checkbox" data-night><span>Night</span></label></div>
<div class="plan-stage" data-plan-stage>
 <svg class="plan-svg" data-plan-svg role="group" aria-label="Floor plan of LaCasa with furniture" viewBox="0 0 ${data.W} ${data.H}" preserveAspectRatio="xMidYMid meet"><image href="${h(PLAN.img)}" x="0" y="0" width="${data.W}" height="${data.H}" class="plan-bg"/></svg>
 <div class="plan-tools"><button type="button" data-z="in" aria-label="Zoom in">+</button><button type="button" data-z="out" aria-label="Zoom out">−</button><button type="button" data-z="fit" aria-label="Show the whole plan">Fit</button></div>
 <div class="plan-scalebar" aria-hidden="true"><svg viewBox="0 0 100 14" data-scalebar><rect x="0" y="4" width="50" height="5"/><rect x="50" y="4" width="50" height="5" class="w"/></svg><span data-scale-label>1 m</span></div>
 <span class="plan-status" data-plan-status>${ro ? 'View only' : 'Saved'}</span>
 <p class="plan-readout" data-readout hidden></p>
</div>
<div class="plan-wifi-bar" data-wifi-bar hidden><fieldset class="plan-band"><legend>Band</legend>${Object.entries(PLAN.wifi.bands).map(([k, b], i) => `<label><input type="radio" name="plan-band" value="${k}"${i ? '' : ' checked'}><span>${h(b.name)}</span></label>`).join('')}</fieldset>
<ul class="plan-legend">${PLAN.wifi.levels.map((l, i) => `<li><i style="background:${l.colour}"></i>${h(l.name)} <small>${i < PLAN.wifi.levels.length - 1 ? `${l.min} dBm or better` : `below ${PLAN.wifi.levels[i - 1].min} dBm`}</small></li>`).join('')}</ul>
<p class="plan-fine">Estimate only: router power and wall losses are typical values, not measured. Tap the plan to read the signal at a spot. Check with a phone Wi-Fi app after moving in.</p></div>
<div class="plan-add" data-add-bar hidden><span>Tap the plan to add:</span>${PLAN.pointTypes.map(t => `<label><input type="radio" name="plan-add" value="${t.id}"><span><i class="pt pt-${t.id}"></i>${h(t.name)}</span></label>`).join('')}<label><input type="radio" name="plan-add" value="" checked><span>Nothing</span></label></div>
<p class="plan-scale muted">${h(PLAN.source)} Faint beds and chairs underneath are the contractor’s drawing.</p>
<aside class="plan-sheet" data-sheet hidden aria-live="polite"></aside>
<section class="buy-block buy-panel tone-indigo plan-cart" data-cart><h2>On the plan: chosen items</h2><div data-cart-list></div><p class="muted">Picks here and on the <a href="/buy">to-buy list</a> are the same; changing one changes the other.</p></section>
<section class="buy-block buy-panel tone-sand"><h2>Research</h2><p class="muted">Shortlists and notes behind each choice.</p><ul class="plan-research-links">${RESEARCH.map(t => `<li><a href="/research#r-${h(t.id)}"><b>${h(t.title)}</b><span class="research-status s-${h(t.status.toLowerCase())}">${h(t.status)}</span></a></li>`).join('')}</ul></section>
<p class="plan-fine">Works like room planners (Floorplanner, Planner 5D: a plan image with a set scale and true-size furniture) and Wi-Fi planners (NetSpot, Hamina: routers on a floor plan with wall losses), kept simple for phones.</p>
<script id="plan-data" type="application/json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
</article>`;
}

export function researchPage() {
 const sgd = o => o.cur === 'MYR' && o.price ? `≈ S$${Math.round(o.price / BUY.rate).toLocaleString('en-SG')}` : '';
 const price = o => o.price === 0 ? 'Free with plan' : money(o.price, o.cur);
 const feelOf = o => (o.specs ?? []).find(([k]) => k === 'Feel')?.[1] ?? '';
 const feelClass = f => /firm/i.test(f) && !/medium/i.test(f) ? 'f-firm' : /firm/i.test(f) ? (/to firm/i.test(f) ? 'f-firm' : 'f-medium') : /soft/i.test(f) ? 'f-soft' : 'f-check';
 const card = o => {
  const feel = feelOf(o), specs = (o.specs ?? []).filter(([k]) => k !== 'Feel');
  const name = ext(o.href) ? `<a href="${h(o.href)}" target="_blank" rel="noopener noreferrer">${h(o.name)} <span aria-hidden="true">↗</span></a>` : h(o.name);
  return `<li class="rz-card${o.pick ? ' is-pick' : ''}">
<div class="rz-photo">${o.img ? `<img src="${h(o.img)}" alt="${h(o.name)}" loading="lazy" decoding="async">${o.ex ? '<span class="rz-ex">Similar model</span>' : ''}` : `<span class="rz-nophoto">${h(o.group)}<small>No photo yet</small></span>`}${o.pick ? '<span class="rz-pick">Current pick</span>' : ''}</div>
<div class="rz-body"><b class="rz-name">${name}</b>
<p class="rz-price"><span>${h(price(o))}</span>${sgd(o) ? `<small>${h(sgd(o))}</small>` : ''}</p>
<p class="rz-shop">${h(o.shop)}</p>
${feel ? `<span class="rz-feel ${feelClass(feel)}">Feel: ${h(feel)}</span>` : ''}
${o.why ? `<p class="rz-why">${h(o.why)}</p>` : ''}
${specs.length ? `<dl class="rz-specs">${specs.map(([k, val]) => `<dt>${h(k)}</dt><dd>${h(val)}</dd>`).join('')}</dl>` : ''}</div></li>`;
 };
 const groups = t => [...new Set(t.shortlist.map(o => o.group))].map(g => ({g, list: t.shortlist.filter(o => o.group === g)}));
 return `<article class="research-page rz-page"><header class="plan-head"><span class="eyebrow">Catalogue behind each choice</span><h1>Research</h1><p class="muted">Tap a topic. Each one starts with the short answer, then what is still open, then the options as cards. A green border marks the current pick. RM is converted at RM${BUY.rate} = S$1; prices are as seen on the date shown.</p></header>
<nav class="rz-tiles" aria-label="Topics">${RESEARCH.map(t => `<a class="rz-tile tone-${h(t.tone ?? 'sand')}" href="#r-${h(t.id)}"><span class="rz-tile-name">${h(t.short ?? t.title)}</span><span class="rz-tile-meta">${t.shortlist.length} options · ${h(t.status)}</span></a>`).join('')}<a class="rz-tile rz-tile-plan" href="/plan"><span class="rz-tile-name">Floor plan</span><span class="rz-tile-meta">See sizes in the rooms</span></a></nav>
${RESEARCH.map(t => `<section class="rz-topic tone-${h(t.tone ?? 'sand')}" id="r-${h(t.id)}">
<header class="rz-band"><div><span class="rz-eyebrow">${h(t.short ?? '')}</span><h2>${h(t.title)}</h2></div><span class="research-status rz-status s-${h(t.status.toLowerCase())}">${h(t.status)}</span></header>
<div class="rz-inner"><p class="research-meta">Updated ${h(t.updated)} · ${h(t.chat)}${t.plan?.length ? ` · <a href="/plan#${h(t.plan[0])}">See on the floor plan</a>` : ''}</p>
<div class="rz-answer"><span class="rz-label">In short</span><p class="research-answer">${h(t.answer)}</p></div>
${t.decide?.length ? `<div class="rz-decide"><span class="rz-label">Still to decide</span><ol class="research-decide">${t.decide.map(d => `<li>${h(d)}</li>`).join('')}</ol></div>` : ''}
${groups(t).map(({g, list}) => `<div class="rz-group"><h3><span>${h(g)}</span><small>${list.length} ${list.length === 1 ? 'option' : 'options'}</small></h3>${list.length >= 4 ? `<div class="rz-table-wrap"><table class="rz-table"><caption>Quick compare</caption><thead><tr><th>Option</th><th>Price</th>${list.some(feelOf) ? '<th>Feel</th>' : ''}<th>Where</th></tr></thead><tbody>${list.map(o => `<tr${o.pick ? ' class="is-pick"' : ''}><td>${h(o.name)}</td><td class="rz-num">${h(price(o))}${sgd(o) ? `<br><small>${h(sgd(o))}</small>` : ''}</td>${list.some(feelOf) ? `<td>${feelOf(o) ? `<span class="rz-feel ${feelClass(feelOf(o))}">${h(feelOf(o))}</span>` : ''}</td>` : ''}<td>${h(o.shop)}</td></tr>`).join('')}</tbody></table></div>` : ''}<ul class="research-list rz-grid">${list.map(card).join('')}</ul></div>`).join('')}
${t.notes?.length ? `<details class="research-notes rz-notes"><summary>More notes (${t.notes.length})</summary><ul>${t.notes.map(n => `<li>${h(n)}</li>`).join('')}</ul></details>` : ''}
<p class="rz-top"><a href="#main">Back to top ↑</a></p></div></section>`).join('')}
</article>`;
}
