// Home page (21 Nov): the three working pages first (To-buy, Floor plan, Research),
// then what is next on the to-do list. The older room-by-room voting pages live at /earlier.
import {BUY, buyTotals} from './buy-plan.mjs';
import {dayLabel, sgToday} from './buy.mjs';
import {RESEARCH} from './research.mjs';
import {PLAN} from './plan-data.mjs';
const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const sgd = n => 'S$' + Math.round(n).toLocaleString('en-SG');
const KEYS = '2026-12-03', MOVE_IN = 'January 2027';
const daysBetween = (a, b) => Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 864e5);

export function homePage(v = {}, today = sgToday(), {isOwner = false, audit = false} = {}) {
 const t = buyTotals(BUY, v), items = BUY.rooms.reduce((n, r) => n + r.items.length, 0);
 const todo = BUY.todo ?? [], open = todo.filter(x => v[`t:${x.id}`] !== '1'), done = todo.length - open.length;
 // Order: anything dated in the next 2 days, then the "now" items, then the rest by date.
 const soon = new Date(Date.parse(today + 'T00:00:00Z') + 2 * 864e5).toISOString().slice(0, 10);
 const rank = x => x.date && x.date <= soon ? '0' + x.date : !x.date ? '1' : '2' + x.date;
 const next = open.slice().sort((a, b) => rank(a).localeCompare(rank(b))).slice(0, 5);
 const days = daysBetween(today, KEYS);
 const nextBuy = BUY.rooms.flatMap(r => r.items).map(i => i.date).filter(d => d && d >= today).sort()[0];
 const W = Math.round(PLAN.imgW * PLAN.mmPerPx), H = Math.round(PLAN.imgH * PLAN.mmPerPx);
 // Small to-scale preview: room boxes tinted by whose room it is, over the contractor's plan.
 const tint = {ky: '#b37509', ks: '#c2405a', kx: '#9b3c7d', living: '#b4532a', dining: '#6f7d1e', kitchen: '#13817a', yard: '#13817a', 'common-bath': '#1b8fb0', 'master-bath': '#6a4fb3'};
 const preview = `<svg class="hq-plan-svg" viewBox="300 700 ${W - 600} ${H - 1100}" aria-hidden="true" focusable="false"><image href="${h(PLAN.img)}" width="${W}" height="${H}" class="hq-plan-img"/>${PLAN.rooms.flatMap(r => tint[r.id] ? r.boxes.map(b => `<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" fill="${tint[r.id]}" fill-opacity=".16"/>`) : []).join('')}${PLAN.items.filter(i => i.kind === 'bed').map(i => {const s = i.sizes[0], w = i.r % 180 ? s.d : s.w, d = i.r % 180 ? s.w : s.d; return `<rect x="${i.x - w / 2}" y="${i.y - d / 2}" width="${w}" height="${d}" rx="60" fill="#fff" stroke="${tint[i.room]}" stroke-width="60"/>`;}).join('')}</svg>`;
 return `<article class="hq">
<header class="hq-hero">
 <p class="hq-kicker">Move-in by ${MOVE_IN}</p>
 <h1>LaCasa</h1>
 <p class="hq-keys">${days > 0 ? `<b>${days}</b> ${days === 1 ? 'day' : 'days'} to the keys` : days === 0 ? '<b>Keys today</b>' : '<b>Keys collected</b>'}<span>${h(dayLabel(KEYS))}</span></p>
</header>
<nav class="hq-main" aria-label="Main pages">
 <a class="hq-tile hq-buy" href="/buy"><span class="hq-tile-name">To-buy list</span><strong class="hq-big">${sgd(t.before)}</strong><span class="hq-sub">before move-in · ${items} items${nextBuy ? ` · next buy ${h(dayLabel(nextBuy))}` : ''}</span><span class="hq-split"><span>After move-in <b>${sgd(t.after)}</b></span>${t.removed ? `<span>Maybe, not counted <b>${sgd(t.offTotal)}</b></span>` : ''}<span>Estimates inside <b>${sgd(t.est)}</b></span></span><span class="hq-go">Open the list</span></a>
 <a class="hq-tile hq-plan" href="/plan"><span class="hq-tile-name">Floor plan</span>${preview}<span class="hq-sub">Beds, sofa, lights, sockets and Wi-Fi, drawn to scale. Tap anything for its choices.</span><span class="hq-go">Open the plan</span></a>
 <a class="hq-tile hq-research" href="/research"><span class="hq-tile-name">Research</span><ul class="hq-topics">${RESEARCH.map(r => `<li><span>${h(r.title)}</span><i class="research-status s-${h(r.status.toLowerCase())}">${h(r.status)}</i></li>`).join('')}</ul><span class="hq-go">See the shortlists</span></a>
</nav>
<section class="hq-orders" aria-labelledby="hq-orders-title"><div class="hq-next-head"><h2 id="hq-orders-title">Ordered</h2><span>deposits paid</span></div>
 <ul>${(BUY.orders ?? []).map(o => { const rm = n => 'RM' + Number(n).toLocaleString('en-SG', {maximumFractionDigits: 2}); return `<li><a href="${h(o.href)}"><b>${h(o.name)}</b><small>${h(o.what)}</small><span class="hq-order-money"><span>Total <b>${rm(o.total)}</b></span><span>Paid <b>${rm(o.paid)}</b></span><span class="hq-order-due">Left <b>${rm(o.total - o.paid)}</b></span></span><small>${h(o.due)}</small></a></li>`; }).join('')}</ul></section>
<section class="hq-next" aria-labelledby="hq-next-title"><div class="hq-next-head"><h2 id="hq-next-title">Next up</h2><span>${done} of ${todo.length} done</span></div>
 <ol class="hq-todo">${next.map(x => `<li><span class="buy-chip${x.date ? '' : ' is-now'}">${x.date ? h(dayLabel(x.date)) : 'Now'}</span><span class="hq-todo-text"><b>${h(x.t)}</b>${x.n ? `<small>${h(x.n)}</small>` : ''}</span></li>`).join('')}</ol>
 <a class="text-link" href="/buy#buy-todo">All to-dos and ticks</a></section>
<nav class="hq-quick" aria-label="Checklists and files"><a href="/buy#buy-measure">3 Dec checklist</a><a href="/buy#buy-decisions">Reno decisions</a><a href="/buy#buy-qa">Check the 2nd quotation</a><a href="/buy#buy-files">Contractor files</a><a href="/buy#buy-dates">Sale dates</a></nav>
<a class="hq-earlier" href="/earlier"><span><b>Earlier pages</b><small>Room-by-room choices, voting, the old shopping list and the 11 Nov site visit.</small></span><span aria-hidden="true">›</span></a>
${isOwner || audit ? '' : '<p class="owner-link"><a class="text-link" href="/owner">Owner sign-in</a></p>'}
</article>`;
}
