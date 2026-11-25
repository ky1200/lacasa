// Home page (24 Nov): days to keys, today's plan, four page cards, next to-dos, shortcuts. The older room-by-room voting pages live at /earlier.
import {cmpTarget} from './compare.mjs';
import {DOCS} from './docs.mjs';
import {BUY, buyTotals} from './buy-plan.mjs';
import {dayLabel, sgToday} from './buy.mjs';
import {PLAN} from './plan-data.mjs';
import {palette} from './look.mjs';
import {payList, payTotals} from './pay.mjs';
import {DAY_DATE} from './day.mjs';
import {progressCard} from './progress.mjs';
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
 const pt = payTotals(payList(v)), dayOn = today <= DAY_DATE;
 return `<article class="hq">
<header class="hq-hero">
 <p class="hq-kicker">Move-in by ${MOVE_IN}</p>
 <h1 class="hq-keys">${days > 0 ? `<b>${days}</b> ${days === 1 ? 'day' : 'days'} to the keys` : days === 0 ? '<b>Keys today</b>' : '<b>Keys collected</b>'}</h1><p class="hq-keydate">${h(dayLabel(KEYS))}</p>
</header>
${progressCard(v, today)}
${dayOn ? `<a class="hq-today" href="/day"><span><small>${today === DAY_DATE ? 'Today' : h(dayLabel(DAY_DATE))}</small><b>Singapore day: deposit, bank, bathroom shops</b></span><span aria-hidden="true">›</span></a>` : ''}
<nav class="hq-grid" aria-label="Main pages">
 <a class="hq-card hq-buy" href="/buy"><small>To-buy list</small><strong class="hq-big">${sgd(t.before)}</strong><span>before move-in · ${items} items</span></a>
 <a class="hq-card hq-pay" href="/pay"><small>Payments</small><strong>${sgd(pt.paid)}</strong><span>paid · <b>${sgd(pt.due)}</b> to pay</span></a>
 <a class="hq-card hq-plan" href="/plan"><small>Floor plan</small>${preview}</a>
 <a class="hq-card hq-look" href="/look"><small>Mood board</small>${palette(v)}</a>
 <a class="hq-card hq-bath" href="/bathrooms"><small>Bathrooms</small><strong>${sgd(cmpTarget())}</strong><span>gunmetal, all in SG · shop quotes</span></a>
 <a class="hq-card hq-docs" href="/docs"><small>Documents</small><strong>${DOCS.length}</strong><span>receipts, orders, forms</span></a>
</nav>
<section class="hq-next" aria-labelledby="hq-next-title"><div class="hq-next-head"><h2 id="hq-next-title">Next up</h2><span>${done} of ${todo.length} done</span></div>
 <ol class="hq-todo">${next.slice(0, 4).map(x => `<li><span class="buy-chip${x.date ? (x.date < today ? ' is-late' : '') : ' is-now'}">${x.date ? h(dayLabel(x.date)) : 'Now'}</span><span class="hq-todo-text"><b>${h(x.t)}</b></span></li>`).join('')}</ol>
 <a class="text-link" href="/buy#buy-todo">All to-dos and ticks</a></section>
<nav class="hq-quick" aria-label="Checklists and files"><a href="/docs#rules">Reno rules</a><a href="/buy#buy-measure">3 Dec checklist</a><a href="/buy#buy-qa">Quote checks</a><a href="/buy#buy-decisions">Reno decisions</a><a href="/buy#buy-files">Contractor files</a><a href="/plan?layout=designer#designer">Designer’s pick</a><a href="/research">Research</a></nav>
<p class="hq-foot"><a class="text-link" href="/earlier">Archive</a>${isOwner || audit ? '' : ' · <a class="text-link" href="/owner">Owner sign-in</a>'}</p>
</article>`;
}
