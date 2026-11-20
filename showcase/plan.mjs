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
 const opt = o => `<li class="research-opt${o.pick ? ' is-pick' : ''}"><div class="research-opt-top"><span class="research-group">${h(o.group)}</span>${o.pick ? '<span class="research-pick">Current pick</span>' : ''}</div><b>${ext(o.href) ? `<a href="${h(o.href)}" target="_blank" rel="noopener noreferrer">${h(o.name)} ↗</a>` : h(o.name)}</b><span class="research-price">${h(money(o.price, o.cur))}${o.cur === 'MYR' && o.price ? ` ≈ S$${Math.round(o.price / BUY.rate).toLocaleString('en-SG')}` : ''} · ${h(o.shop)}</span>${o.why ? `<span>${h(o.why)}</span>` : ''}${o.specs?.length ? `<dl>${o.specs.map(([k, val]) => `<dt>${h(k)}</dt><dd>${h(val)}</dd>`).join('')}</dl>` : ''}</li>`;
 return `<article class="research-page"><header class="plan-head"><span class="eyebrow">Shortlists behind each choice</span><h1>Research</h1><p class="muted">One section per decision. The current pick is marked. Prices are as seen on the date shown; RM converted at RM${BUY.rate} = S$1.</p></header>
<nav class="buy-jump" aria-label="Topics">${RESEARCH.map(t => `<a href="#r-${h(t.id)}">${h(t.title)}</a>`).join('')}<a href="/plan">Floor plan</a></nav>
${RESEARCH.map(t => `<section class="research-topic" id="r-${h(t.id)}"><div class="research-head"><h2>${h(t.title)}</h2><span class="research-status s-${h(t.status.toLowerCase())}">${h(t.status)}</span></div><p class="research-meta">Updated ${h(t.updated)} · ${h(t.chat)}${t.plan?.length ? ` · <a href="/plan#${h(t.plan[0])}">See on the floor plan</a>` : ''}</p>
<p class="research-answer">${h(t.answer)}</p>
${t.decide?.length ? `<h3>Still to decide</h3><ul class="research-decide">${t.decide.map(d => `<li>${h(d)}</li>`).join('')}</ul>` : ''}
<h3>Shortlist</h3><ul class="research-list">${t.shortlist.map(opt).join('')}</ul>
${t.notes?.length ? `<details class="research-notes"><summary>Notes (${t.notes.length})</summary><ul>${t.notes.map(n => `<li>${h(n)}</li>`).join('')}</ul></details>` : ''}</section>`).join('')}
</article>`;
}
