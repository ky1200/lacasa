// /plan (interactive floor plan) and /research pages. Drawing and dragging happen in public/plan.js.
import {PLAN, planState, buyItemById, LAYOUTS, DESIGNER, PEOPLE, layoutOf, prefixOf, serialLayout} from './plan-data.mjs';
import {RESEARCH} from './research.mjs';
import {BUY, choiceOf, optionsOf, toSGD} from './buy-plan.mjs';
import {photoOf, ROOM_COLOURS} from './buy.mjs';
import {secAttrs, secClose, dock} from './sections.mjs';
const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const money = (n, cur) => n == null ? 'Price to get' : (cur === 'MYR' ? 'RM' : 'S$') + Number(n).toLocaleString('en-SG', {minimumFractionDigits: Number.isInteger(Number(n)) ? 0 : 2, maximumFractionDigits: 2});
const ext = href => /^https?:\/\//.test(href ?? '');

// Everything the browser needs, kept small: geometry, saved positions, linked to-buy options and research.
export function planData(v = {}, ro = false, layout = '') {
 layout = layoutOf(layout);
 const st = planState(v, layout), buyIds = [...new Set(PLAN.items.flatMap(i => i.buy ?? []))];
 const buy = {};
 for (const id of buyIds) {
  const f = buyItemById(id); if (!f) continue;
  const c = choiceOf(f.item, v);
  buy[id] = {name: f.item.name, room: f.room.name, tag: c.tag, qty: c.qty, pick: c.pick, opts: optionsOf(f.item).map((o, k) => ({n: o.name, m: o.model ?? '', p: money(o.price, o.cur), s: Math.round(toSGD(o, BUY.rate) * 100) / 100, shop: o.shop ?? '', href: o.href ?? '', est: !!(o.est ?? (k === 0 && f.item.est)), img: photoOf(id, k)?.src ?? '', note: k ? o.note ?? '' : ''}))};
 }
 const used = new Set(PLAN.items.map(i => i.research).filter(Boolean)); // only topics the plan links to, to keep the page light
 const research = Object.fromEntries(RESEARCH.filter(t => used.has(t.id)).map(t => [t.id, {title: t.title, status: t.status, answer: t.answer, updated: t.updated, list: t.shortlist.map(o => ({g: o.group, n: o.name, p: money(o.price, o.cur), shop: o.shop, href: o.href ?? '', pick: !!o.pick, why: o.why ?? '', specs: o.specs ?? []}))}]));
 // Layout copies: the designer view can be copied to the family plan; a person's layout can start from either.
 const copy = layout === 'designer' ? {designer: serialLayout(st)} : PEOPLE.includes(layout) ? {designer: serialLayout(planState({}, 'designer')), family: serialLayout(planState(v))} : null;
 return {ro: ro || layout === 'designer', viewOnly: ro, layout, prefix: prefixOf(layout), copy, rate: BUY.rate, img: PLAN.img, W: Math.round(PLAN.imgW * PLAN.mmPerPx), H: Math.round(PLAN.imgH * PLAN.mmPerPx), rooms: PLAN.rooms, walls: PLAN.walls, items: st.items, points: st.points, pointTypes: PLAN.pointTypes, wifi: PLAN.wifi, tvView: PLAN.tvView, ceilingMm: PLAN.ceilingMm, workMm: PLAN.workMm, colours: ROOM_COLOURS, buy, research};
}

const ROOM_CHIPS = [['all', 'Whole home'], ['ky', 'KY'], ['ks', 'KS'], ['kx', 'KX'], ['living', 'Living'], ['dining', 'Dining'], ['kitchen', 'Kitchen + yard'], ['common-bath', 'Common bath'], ['master-bath', 'Master bath']];
const LAYERS = [['furniture', 'Furniture', true], ['lights', 'Lights and fans', true], ['power', 'Sockets and switches', false], ['tv', 'TV viewing', true], ['air', 'Fan air', true], ['net', 'Network', true], ['wifi', 'Wi-Fi coverage', false]];

// The bar under the layout buttons: what this layout is, and the copy buttons.
function layoutNote(layout, lay, ro) {
 const btn = (src, label) => ro ? '' : `<button type="button" class="plan-copy" data-copy="${src}">${h(label)}</button>`;
 if (layout === 'designer') return `<div class="plan-layout-note is-designer"><p><b>Designer’s pick</b> (view only): where each piece of furniture, light, fan, socket and switch would go, with the reasons below. Sockets and switches are switched on. Draft until the real points are seen on 3 Dec.</p>${btn('designer', 'Use this for the family plan')}</div>`;
 if (PEOPLE.includes(layout)) return `<div class="plan-layout-note"><p><b>${h(lay.name)}</b>: changes here only change ${h(lay.short)}’s own version. Anything not moved yet shows the family plan. Picks on the to-buy list are still shared.</p>${btn('designer', 'Start from the Designer’s pick')}${btn('family', 'Start from the family plan')}</div>`;
 return '';
}
// "Designer's pick: the reasons" panel (folded unless the designer layout is open).
function designerNotes(layout) {
 const open = layout === 'designer' ? ' open' : '';
 return `<section class="buy-block buy-panel buy-fold tone-moss plan-designer" id="designer" ${secAttrs('Designer’s pick')}><details${open}><summary><h2>Designer’s pick: the reasons</h2><span class="buy-fold-caret" aria-hidden="true"></span></summary><div class="buy-fold-body">
<p class="muted">How a room planner would lay out the home, room by room. ${layout === 'designer' ? '' : '<a href="/plan?layout=designer">See it on the plan</a>.'}</p>
<div class="plan-designer-rooms">${DESIGNER.rooms.map(r => `<details class="plan-designer-room"><summary>${h(r.title)} <small>${r.why.length}</small></summary><ul>${r.why.map(w => `<li>${h(w)}</li>`).join('')}</ul></details>`).join('')}</div>
<h3>Check on 3 Dec with I-Niche and the electrician</h3><p class="muted">Cheap while walls and ceilings are open, costly later. Socket and switch places get confirmed on site (G3).</p>
<ol class="plan-designer-reno">${DESIGNER.reno.map(w => `<li>${h(w)}</li>`).join('')}</ol>
${secClose('Designer’s pick')}</div></details></section>`;
}

export function planPage(v = {}, ro = false, rawLayout = '') {
 const layout = layoutOf(rawLayout), data = planData(v, ro, layout), lay = LAYOUTS.find(l => l.id === layout);
 return `<article class="plan-page" data-plan-page>
<header class="plan-head"><span class="eyebrow">I-Niche proposed plan, 13 Nov · drawn to scale</span><h1>Floor plan</h1>
<p class="plan-lede">Tap a room to zoom in, tap a bed, sofa, TV or router for its size and choices. <b>Move</b> drags things, <b>Measure</b> takes any distance, <b>Night</b> shows where the light falls. Changes are shared with the family.</p></header>
<nav class="plan-layouts" aria-label="Layouts"><span class="plan-rowlabel">Layout:</span>${LAYOUTS.map(l => `<a href="/plan${l.id ? `?layout=${l.id}` : ''}"${l.id === layout ? ' aria-current="page"' : ''}${l.id === 'designer' ? ' class="is-designer"' : ''}>${l.id === 'designer' ? '<i aria-hidden="true">★</i>' : ''}${h(l.short)}</a>`).join('')}</nav>
${layoutNote(layout, lay, ro)}
<p class="plan-rowlabel plan-zoomlabel">Zoom to:</p><nav class="plan-rooms" aria-label="Zoom to a room">${ROOM_CHIPS.map(([id, n], k) => `<button type="button" data-zoom="${id}"${k ? '' : ' aria-pressed="true"'}>${h(n)}</button>`).join('')}</nav>
<details class="plan-layerbox" data-layerbox open><summary><span>Layers</span> <small data-layer-count>${LAYERS.filter(l => l[2] || (layout === 'designer' && l[0] === 'power')).length} on</small></summary><fieldset class="plan-layers"><legend class="sr-only">Show on the plan</legend>${LAYERS.map(([id, n, dflt]) => {const on = dflt || (layout === 'designer' && id === 'power'); return `<label class="plan-layer plan-layer-${id}"><input type="checkbox" data-layer="${id}"${on ? ' checked' : ''}><span>${h(n)}</span></label>`;}).join('')}</fieldset></details>
<div class="plan-modes" aria-label="Tools" role="group"><label class="plan-move${data.ro ? ' is-ro' : ''}"><input type="checkbox" data-move${data.ro ? ' disabled' : ''}><span>Move</span></label><label class="plan-measure-tool"><input type="checkbox" data-tape><span>Measure</span></label><label class="plan-night-tool"><input type="checkbox" data-night><span>Night</span></label></div>
${data.items.some(i => i.add) ? `<div class="plan-addables" data-addables role="group" aria-label="Add or remove furniture"><span>Add or remove:</span>${data.items.filter(i => i.add).map(i => `<button type="button" data-toggle="${h(i.id)}" aria-pressed="${i.on ? 'true' : 'false'}"${data.ro ? ' disabled' : ''}><i aria-hidden="true">${i.on ? '✓' : '+'}</i>${h(i.name.replace(/ \(.*\)$/, ''))}</button>`).join('')}</div>` : ''}
<div class="plan-stage" data-plan-stage>
 <svg class="plan-svg" data-plan-svg role="group" aria-label="Floor plan of LaCasa with furniture" viewBox="0 0 ${data.W} ${data.H}" preserveAspectRatio="xMidYMid meet"><image href="${h(PLAN.img)}" x="0" y="0" width="${data.W}" height="${data.H}" class="plan-bg"/></svg>
 <div class="plan-tools"><button type="button" data-z="in" aria-label="Zoom in">+</button><button type="button" data-z="out" aria-label="Zoom out">−</button><button type="button" data-z="fit" aria-label="Show the whole plan">Fit</button></div>
 <div class="plan-scalebar" aria-hidden="true"><svg viewBox="0 0 100 14" data-scalebar><rect x="0" y="4" width="50" height="5"/><rect x="50" y="4" width="50" height="5" class="w"/></svg><span data-scale-label>1 m</span></div>
 <span class="plan-status" data-plan-status>${data.ro ? 'View only' : 'Saved'}</span>
 <p class="plan-readout" data-readout hidden></p>
</div>
<div class="plan-wifi-bar" data-wifi-bar hidden><fieldset class="plan-band"><legend>Band</legend>${Object.entries(PLAN.wifi.bands).map(([k, b], i) => `<label><input type="radio" name="plan-band" value="${k}"${i ? '' : ' checked'}><span>${h(b.name)}</span></label>`).join('')}</fieldset>
<ul class="plan-legend">${PLAN.wifi.levels.map((l, i) => `<li><i style="background:${l.colour}"></i>${h(l.name)} <small>${i < PLAN.wifi.levels.length - 1 ? `${l.min} dBm or better` : `below ${PLAN.wifi.levels[i - 1].min} dBm`}</small></li>`).join('')}</ul>
<p class="plan-fine">Estimate only: router power and wall losses are typical values, not measured. Tap the plan to read the signal at a spot. Check with a phone Wi-Fi app after moving in.</p></div>
<div class="plan-add" data-add-bar hidden><span>Tap the plan to add:</span>${PLAN.pointTypes.map(t => `<label><input type="radio" name="plan-add" value="${t.id}"><span><i class="pt pt-${t.id}"></i>${h(t.name)}</span></label>`).join('')}<label><input type="radio" name="plan-add" value="" checked><span>Nothing</span></label></div>
<p class="plan-scale muted">${h(PLAN.source)} Faint beds and chairs underneath are the contractor’s drawing.</p>
<aside class="plan-sheet" data-sheet hidden aria-live="polite"></aside>
${designerNotes(layout)}
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
 const nameOf = o => ext(o.href) ? `<a href="${h(o.href)}" target="_blank" rel="noopener noreferrer">${h(o.name)} <span aria-hidden="true">↗</span></a>` : h(o.name);
 const img = o => o.img ? `<img src="${h(o.img)}" alt="${h(o.name)}" loading="lazy" decoding="async">${o.ex ? '<span class="rz-ex">Similar model</span>' : ''}` : `<span class="rz-nophoto">${h(o.group)}<small>No photo yet</small></span>`;
 const specList = o => { const specs = (o.specs ?? []).filter(([k]) => k !== 'Feel'); return specs.length ? `<dl class="rz-specs">${specs.map(([k, val]) => `<dt>${h(k)}</dt><dd>${h(val)}</dd>`).join('')}</dl>` : ''; };
 // Full card: the current pick, or an option still in the running.
 const card = o => { const feel = feelOf(o);
  const place = o.price === undefined && !o.img;
  return `<li class="rz-card${o.pick ? ' is-pick' : ''}${place ? ' is-place' : ''}">
${place ? (o.pick ? '<span class="rz-pick rz-pick-inline">Must visit</span>' : '') : `<div class="rz-photo">${img(o)}${o.pick ? '<span class="rz-pick">Current pick</span>' : ''}</div>`}
<div class="rz-body"><b class="rz-name">${nameOf(o)}</b>
${o.price === undefined ? '' : `<p class="rz-price"><span>${h(price(o))}</span>${sgd(o) ? `<small>${h(sgd(o))}</small>` : ''}</p>`}
<p class="rz-shop">${h(o.shop)}</p>
${feel ? `<span class="rz-feel ${feelClass(feel)}">Feel: ${h(feel)}</span>` : ''}
${o.why ? `<p class="rz-why">${h(o.why)}</p>` : ''}${specList(o)}</div></li>`; };
 // Compact row: small photo, name, price. Details fold open on tap.
 const row = o => { const feel = feelOf(o), more = specList(o) + (o.why ? `<p class="rz-why">${h(o.why)}</p>` : '');
  return `<li class="rz-row"><div class="rz-row-photo">${img(o)}</div><div class="rz-row-body"><b class="rz-name">${nameOf(o)}</b><p class="rz-row-line"><span class="rz-row-price">${h(price(o))}</span>${sgd(o) ? ` <small>${h(sgd(o))}</small>` : ''} · ${h(o.shop)}${feel ? ` · <span class="rz-feel ${feelClass(feel)}">${h(feel)}</span>` : ''}</p>${more ? `<details class="rz-row-more"><summary>Details</summary>${more}</details>` : ''}</div></li>`; };
 const groups = t => [...new Set(t.shortlist.map(o => o.group))].map(g => ({g, list: t.shortlist.filter(o => o.group === g)}));
 const others = (list, label) => list.length ? `<details class="rz-others"><summary>${h(label)} <small>${list.length}</small></summary><ul class="rz-rows">${list.map(row).join('')}</ul></details>` : '';
 const body = t => {
  if (t.status === 'Decided') {
   const picks = t.shortlist.filter(o => o.pick), rest = t.shortlist.filter(o => !o.pick);
   return `<ul class="rz-grid">${picks.map(card).join('')}</ul>${others(rest, 'Looked at, not chosen')}`;
  }
  if (t.all) return groups(t).map(({g, list}) => `<div class="rz-group"><h3><span>${h(g)}</span><small>${list.length} ${list.length === 1 ? 'stop' : 'stops'}</small></h3><ul class="rz-grid">${list.map(card).join('')}</ul></div>`).join('');
  return groups(t).map(({g, list}) => { const picks = list.filter(o => o.pick), rest = list.filter(o => !o.pick), lead = picks.length ? picks : rest.slice(0, 1), more = picks.length ? rest : rest.slice(1);
   return `<div class="rz-group"><h3><span>${h(g)}</span><small>${list.length} ${list.length === 1 ? 'option' : 'options'}</small></h3><ul class="rz-grid">${lead.map(card).join('')}</ul>${others(more, picks.length ? 'Other options' : 'More options')}</div>`; }).join('');
 };
 const tone = t => `tone-${h(t.tone ?? 'sand')}`;
 const nav = dock([{title: 'Topics', links: RESEARCH.map(t => ({href: `#r-${t.id}`, name: t.short ?? t.title, meta: t.status, colour: {coral: '#b4532a', sand: '#7a5a33', indigo: '#273c66', moss: '#3f6a4e'}[t.tone ?? 'sand']}))}], '<a class="dock-btn" href="/plan">Plan</a>');
 return `<article class="research-page rz-page"><header class="plan-head"><span class="eyebrow">Catalogue behind each choice</span><h1>Research</h1><p class="muted">Tap a topic to open it. Picks come first; other options are folded below them. Tap the header again, or press and hold inside, to close it. RM at RM${BUY.rate} = S$1.</p></header>
${RESEARCH.map(t => `<section class="rz-topic ${tone(t)}" id="r-${h(t.id)}" ${secAttrs(t.short ?? t.title)}><details>
<summary class="rz-band"><div><span class="rz-eyebrow">${h(t.short ?? '')} · ${t.shortlist.length} options</span><h2>${h(t.title)}</h2></div><span class="research-status rz-status s-${h(t.status.toLowerCase())}">${h(t.status)}</span><span class="sec-caret" aria-hidden="true"></span></summary>
<div class="rz-inner"><p class="research-meta">Updated ${h(t.updated)}${t.plan?.length ? ` · <a href="/plan#${h(t.plan[0])}">See on the floor plan</a>` : ''}</p>
<div class="rz-answer"><span class="rz-label">In short</span><p class="research-answer">${h(t.answer)}</p></div>
${t.decide?.length ? `<div class="rz-decide"><span class="rz-label">Still to decide</span><ol class="research-decide">${t.decide.map(d => `<li>${h(d)}</li>`).join('')}</ol></div>` : ''}
${body(t)}
${t.notes?.length ? `<details class="research-notes rz-notes"><summary>Notes (${t.notes.length})</summary><ul>${t.notes.map(n => `<li>${h(n)}</li>`).join('')}</ul></details>` : ''}
${secClose(t.short ?? t.title)}</div></details></section>`).join('')}
<p class="rz-plan-link"><a class="button secondary" href="/plan">Open the floor plan</a></p>
${nav}
</article>`;
}
