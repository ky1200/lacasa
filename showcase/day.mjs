// /day: the Wed 25 Nov Singapore day (deposit, bank + lawyer, KX pickup, bathroom shops).
// Times shift for everyone: the family taps "Arrived" / "Left" and the rest of the day re-plans.
// Saved as one JSON value under the visit_notes key "day:1125" (PUT /api/day/log, GET /api/day/log).
import {DAY_ROUTES} from './day-routes.mjs';

const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
export const DAY_KEY = 'day:1125';
export const DAY_DATE = '2026-11-25';

// drive = minutes from the previous stop with weekday traffic (road time from OSRM free-flow, padded).
// stay = minutes planned at the stop. notBefore = earliest start. by = must be done by.
export const DAY_STOPS = [
 {id: 'cp', n: 'Woodlands Checkpoint', sub: 'Car clearance into Singapore', at: [1.4464, 103.7699], plan: '09:00', stay: 20, drive: 0, q: 'Woodlands Checkpoint',
  todo: ['Passports, car documents, VEP + Autopass card topped up.', 'Once through: call La Casa management (office hours, is the reno form in?).']},
 {id: 'atm', n: 'UOB ATM: withdraw S$1,000', sub: 'Woodlands Civic Centre, 900 South Woodlands Drive (next to Causeway Point)', at: [1.43506, 103.78700], stay: 15, drive: 10, route: 'cp-uob', q: 'UOB Woodlands Branch, 900 South Woodlands Drive',
  todo: ['UOB and OCBC ATMs share one network, so any OCBC ATM also works.', 'Check the daily ATM limit in the UOB app first; S$1,000 can be over a low limit.', 'Ask for S$50 notes; count before leaving.']},
 {id: 'mcst', n: 'La Casa management office', sub: 'Pay the S$1,000 renovation deposit in cash', at: [1.43219, 103.79745], stay: 20, drive: 7, route: 'uob-lacasa', q: 'La Casa condominium, Woodlands Drive 16',
  todo: ['Bring NRIC/passport, a copy of the renovation form, the cash.', 'Ask: has the owner\'s email reached them? If not, can the deposit be taken now anyway?', 'Get an official receipt (amount, date, "refundable renovation deposit").', 'Ask: refund conditions, lift padding booking for deliveries, contractor pass rules, works hours.', 'Log it on /pay as paid.']},
 {id: 'uob', n: 'UOB Anson branch', sub: 'International Plaza #01-01, 10 Anson Road. Cashier\'s orders', at: [1.27589, 103.84592], stay: 45, drive: 35, route: 'lacasa-anson', q: 'UOB Anson Branch, International Plaza, 10 Anson Road', close: '16:00',
  todo: ['Before driving down, call the lawyer: exact amounts, payee names, how many cashier\'s orders.', 'Bring NRIC/passport, the lawyer\'s letter, the bank card for the account.', 'Take a queue number in the UOB app ("Q Anson") while driving.', 'Check each cashier\'s order: payee spelled exactly, amount, date. Photo of each.']},
 {id: 'law', n: 'Pertinent Law LLP', sub: 'Same building, #31-15', nonav: true, at: [1.27589, 103.84592], stay: 45, drive: 0, q: 'Pertinent Law LLP, International Plaza',
  todo: ['Confirm completion and keys date (Thu 3 Dec): who hands over keys, where, what time.', 'Ask for the completion statement: what is paid, what is left, refunds (property tax, MCST fees split).', 'Fire insurance for the bank loan: done, or still needed before completion?', 'Ask what else is needed before 3 Dec. Copies of everything signed.']},
 {id: 'lunch', n: 'Lunch', sub: 'Near the bank (Tanjong Pagar) or at NUS with KX. Decide on the day', at: [1.27589, 103.84592], stay: 45, drive: 0, q: 'Tanjong Pagar food',
  todo: ['If the bank ran long, eat at NUS while waiting for KX instead.']},
 {id: 'nus', n: 'Pick up KX', sub: 'NUS Medicine+Science Library, 11 Lower Kent Ridge Road', at: [1.29693, 103.78179], stay: 10, drive: 18, route: 'anson-nus', notBefore: '14:00', q: 'Medicine+Science Library NUS',
  todo: ['KX is free from 2pm. Text KX the live ETA from this page.']},
 {id: 'rigel', n: 'RIGEL Experience Centre', sub: '20 Changi Business Park Central 2. Main shop of the day', at: [1.33754, 103.96778], stay: 75, drive: 38, route: 'nus-rigel', close: '17:30', q: 'Rigel Innovation Centre, 20 Changi Business Park Central 2', shop: 'rigel'},
 {id: 'lixil', n: 'LIXIL Experience Centre', sub: '381 Joo Chiat Road. GROHE, American Standard, INAX', at: [1.30804, 103.90369], stay: 40, drive: 20, route: 'rigel-lixil', close: '19:00', q: 'LIXIL Experience Centre, 381 Joo Chiat Road', shop: 'lixil', hoursNote: 'Hours not published: call first'},
 {id: 'heritage', n: 'Heritage Bathroom Gallery', sub: '718 Geylang Road. Price check + where to buy', at: [1.31476, 103.89150], stay: 45, drive: 8, route: 'lixil-heritage', close: '20:30', q: 'Heritage Bathroom Gallery, 718 Geylang Road', shop: 'heritage'},
 {id: 'kx', n: 'KX leaves', sub: 'Aljunied or Paya Lebar MRT (about 10 min walk) or Grab', at: [1.31640, 103.88290], stay: 0, drive: 0, by: '18:30', btn: 'KX left', q: 'Aljunied MRT',
  todo: ['KX must leave by 6:30pm. The page warns if the plan runs past it.']},
 {id: 'extra', n: 'Optional: Bacera + Bathzone', sub: '714 and 666 Geylang Road, same street. Open till about 8pm', at: [1.31476, 103.89150], stay: 30, drive: 0, opt: true, close: '20:00', q: 'Bathzone, 666 Geylang Road', shop: 'extra'},
 {id: 'home', n: 'Drive back to Woodlands Checkpoint', sub: 'Evening jam builds from about 5:30pm', at: [1.4464, 103.7699], stay: 0, drive: 45, route: 'heritage-cp', q: 'Woodlands Checkpoint'},
];

const T = /^([01]\d|2[0-3]):[0-5]\d$/;
export const toMin = s => {const [a, b] = s.split(':').map(Number); return a * 60 + b;};
export const toHM = m => {m = Math.round(m); const x = ((m % 1440) + 1440) % 1440; return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0');};
export const label12 = s => {const m = toMin(s), hh = Math.floor(m / 60), mm = m % 60; return `${hh % 12 || 12}${mm ? ':' + String(mm).padStart(2, '0') : ''}${hh < 12 ? 'am' : 'pm'}`;};

export function validDayLog(value) {
 if (value === '') return true;
 if (typeof value !== 'string' || value.length > 4000) return false;
 let o;
 try {o = JSON.parse(value);} catch {return false;}
 if (!o || typeof o !== 'object' || Array.isArray(o)) return false;
 const ids = new Set(DAY_STOPS.map(s => s.id));
 for (const k of Object.keys(o)) if (!['a', 'l', 'x', 'd'].includes(k)) return false;
 for (const k of ['a', 'l']) {
  const m = o[k] ?? {};
  if (typeof m !== 'object' || Array.isArray(m)) return false;
  for (const [id, t] of Object.entries(m)) if (!ids.has(id) || typeof t !== 'string' || !T.test(t)) return false;
 }
 const x = o.x ?? [];
 if (!Array.isArray(x) || x.some(id => !ids.has(id) || !DAY_STOPS.find(s => s.id === id).opt)) return false;
 const d = o.d ?? {};
 if (typeof d !== 'object' || Array.isArray(d)) return false;
 for (const [id, n] of Object.entries(d)) if (!ids.has(id) || !Number.isInteger(n) || n < 0 || n > 240) return false;
 return true;
}
export function dayLog(v = {}) {
 const raw = v[DAY_KEY];
 const o = raw && validDayLog(raw) ? JSON.parse(raw) : {};
 return {a: o.a ?? {}, l: o.l ?? {}, x: o.x ?? [], d: o.d ?? {}};
}

// Re-plan the day. Actual arrive/leave times win; everything after them moves.
export function dayTimes(log = {a: {}, l: {}, x: [], d: {}}, stops = DAY_STOPS) {
 const out = [];
 let t = toMin(stops[0].plan), pt = t;
 stops.forEach((s, i) => {
  if ((log.x ?? []).includes(s.id)) {out.push({id: s.id, start: toHM(t), end: toHM(t), plan: toHM(pt), late: 0, wait: 0, skip: true, done: false, here: false, warn: []}); return;}
  const stay = log.d?.[s.id] ?? s.stay, A = log.a?.[s.id], L = log.l?.[s.id];
  if (i) {t += s.drive; pt += s.drive;}
  let start = t, ps = pt;
  if (s.notBefore) {start = Math.max(start, toMin(s.notBefore)); ps = Math.max(ps, toMin(s.notBefore));}
  const wait = A ? 0 : start - t;
  if (A) start = toMin(A);
  const end = L ? toMin(L) : start + stay, pe = ps + s.stay;
  const warn = [];
  if (s.close && !L && end > toMin(s.close)) warn.push(start >= toMin(s.close) ? `Arrives after closing (${label12(s.close)})` : `Closes at ${label12(s.close)}: cut the visit short`);
  if (s.by && start > toMin(s.by)) warn.push(`Past ${label12(s.by)}`);
  out.push({id: s.id, start: toHM(start), end: toHM(end), plan: toHM(ps), late: start - ps, wait, skip: false, done: !!L || (!!A && !stay), here: !!A && !L && !!stay, warn});
  t = end; pt = pe;
 });
 return out;
}

// Shop guides (what to look at, how long, questions). Written 24 Nov from the research below.
const SHOPS = {
 rigel: {time: '75 min', focus: 'The main buy. Choose the toilets, both vanities and both shower sets here, and get one package price for everything.', look: [
  'Sit on the Gallant one-piece toilet (R-WO9030FA): KS and KY both. Feet flat, knees not higher than hips. Compare with the slim-tank R-WO8056F.',
  'Ask for the size drawing: setting-out (wall to pipe centre), bowl height, depth. The 3 Dec measurement must match it.',
  'Lift the seat off: a quick-release, soft-close seat is far easier to clean.',
  'Vanities R-BC7437 (70 cm) and R-BC1260 (60 cm): open the drawers (soft-close? metal runners?), press the cabinet sides (PVC is waterproof; MDF swells), look at the basin top for water marks.',
  'Hold a gunmetal tap next to a chrome one under the shop light; wipe a wet finger on each to see marks.',
  'Shower sets: choose a thermostatic mixer (steady temperature) and a hand shower on a slide rail (each person sets the height).'],
  ask: ['Package price for the full list (≈ S$3,410 at eStore prices), valid until mid-December, in writing.', 'Is the gunmetal finish PVD or painted/plated? Warranty on the finish?', 'Warranty years: ceramic, tap cartridge, vanity cabinet, finish.', 'Can a deposit hold the price with model/size changes allowed after 3 Dec? Refundable?', 'Delivery lead time, and delivery on a fixed date for the plumber.', 'Same price as RIGEL Shopee/Lazada official store? Will they match the 12.12 price?', 'Spare parts: hand shower, hose, seat: available in gunmetal later?']},
 lixil: {time: '40 min', focus: 'Feel and compare only. GROHE quality and its PVD colour (Hard Graphite) against RIGEL gunmetal. Do not buy here unless the price beats RIGEL.', look: [
  'GROHE Eurosmart basin tap (the current master bathroom pick, S$229): handle feel, splash.',
  'GROHE colour finishes ("Hard Graphite", "Brushed Hard Graphite"): PVD, the durable kind of dark grey. Compare the shade with RIGEL gunmetal.',
  'American Standard / INAX one-piece toilets: sit test, seat shape, flush noise.',
  'Try the shower heads in the wet zone: spray feel at low pressure.'],
  ask: ['Price of Eurosmart in Hard Graphite (if it exists) vs chrome.', 'Best GROHE thermostatic shower set under S$600?', 'Any year-end promotion or bundle?']},
 heritage: {time: '45 min', focus: 'Price check: the same RIGEL items, plus their PVC basin cabinets (dark brown, drawers, integrated top). Decide where to buy.', look: [
  'Bring the RIGEL list and package price on the phone; ask them to beat it.',
  'PVC basin cabinet: drawer runners (brand), hinges, how the top meets the wall, water marks on the top.',
  'Check the R-BC7437 price (asked before).'],
  ask: ['Price for the full RIGEL list, delivery included.', 'Hinge/runner brand and warranty on the cabinet.', 'Can the order wait until after 3 Dec measuring? Deposit refundable?', 'Exchange if the toilet setting-out does not fit?']},
 extra: {time: '30 min', focus: 'Only if time is left after KX goes. Quick price check of the same items; nothing new to decide.', look: ['Same toilet and vanity sizes at other brands, for a price benchmark.'], ask: ['Price for an equivalent one-piece rimless toilet and a 60/70 cm wall-hung vanity.']},
};

// SVG helpers (simple drawings, no photos)
export const svgHeights = `<svg class="day-svg" viewBox="0 0 360 250" role="img" aria-label="Basin and shower heights for 150, 165 and 190 cm">
<g font-size="11" fill="#45423b">
<line x1="20" y1="230" x2="350" y2="230" stroke="#77736a"/>
${[[60, 150, 'KX 150'], [160, 165, 'KY 165'], [260, 190, 'KS 190']].map(([x, cm, n]) => {const top = 230 - cm; return `<circle cx="${x}" cy="${top + 10}" r="10" fill="#cdbca5"/><rect x="${x - 9}" y="${top + 21}" width="18" height="${cm - 21}" rx="8" fill="#cdbca5"/><text x="${x}" y="246" text-anchor="middle">${n}</text>`;}).join('')}
<rect x="80" y="${230 - 80}" width="44" height="6" fill="#273c66"/><text x="80" y="${230 - 86}">basin 80</text>
<rect x="182" y="${230 - 89}" width="100" height="6" fill="#273c66"/><text x="186" y="${230 - 95}">common basin 88–90</text>
<line x1="20" y1="${230 - 210}" x2="350" y2="${230 - 210}" stroke="#3f6a4e" stroke-dasharray="4 3"/><text x="150" y="${230 - 214}" fill="#3f6a4e">common rain head 210+</text>
<line x1="20" y1="${230 - 198}" x2="140" y2="${230 - 198}" stroke="#8e6a40" stroke-dasharray="4 3"/><text x="22" y="${230 - 202}" fill="#8e6a40">master 195–200</text>
</g></svg>`;
export const svgToilets = `<svg class="day-svg" viewBox="0 0 360 152" role="img" aria-label="One-piece, two-piece and wall-hung toilets from the side">
<g font-size="11" fill="#45423b"><line x1="5" y1="128" x2="355" y2="128" stroke="#77736a"/><line x1="10" y1="10" x2="10" y2="128" stroke="#77736a"/><line x1="130" y1="10" x2="130" y2="128" stroke="#77736a"/><line x1="250" y1="10" x2="250" y2="128" stroke="#77736a"/>
<path d="M12 40 h22 q8 0 10 20 l4 20 h50 q8 0 8 10 q0 20 -28 22 l-6 16 h-30 l-4 -16 q-18 -2 -26 -18z" fill="#fff" stroke="#24221e"/><text x="68" y="143" text-anchor="middle" font-weight="700">One-piece</text>
<path d="M132 38 h30 v36 h-30z" fill="#fff" stroke="#24221e"/><path d="M134 76 h82 q8 0 8 10 q0 20 -28 22 l-6 20 h-30 l-4 -20 q-22 -4 -22 -32z" fill="#fff" stroke="#24221e"/><circle cx="148" cy="75" r="5" fill="none" stroke="#b3261e" stroke-width="2"/><text x="190" y="143" text-anchor="middle" font-weight="700">Two-piece (seam)</text>
<rect x="250" y="30" width="16" height="70" fill="#ecebe6" stroke="#77736a" stroke-dasharray="3 2"/><path d="M266 70 h66 q8 0 8 10 q0 18 -26 20 l-6 8 h-30 q-12 -6 -12 -38z" fill="#fff" stroke="#24221e"/><text x="303" y="143" text-anchor="middle" font-weight="700">Wall-hung</text></g></svg>`;
const sw = (x, id, a, b, name, note) => `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${a}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></linearGradient></defs><rect x="${x}" y="8" width="78" height="70" rx="10" fill="url(#${id})" stroke="#dcd9d1"/><text x="${x + 39}" y="94" text-anchor="middle" font-weight="700">${name}</text><text x="${x + 39}" y="110" text-anchor="middle">${note}</text>`;
export const svgFinish = `<svg class="day-svg" viewBox="0 0 360 120" role="img" aria-label="Tap finish colours"><g font-size="12" fill="#45423b">
${sw(4, 'fc', '#c9ccd0', '#f6f7f8', 'Chrome', 'toughest')}${sw(94, 'fn', '#a9a59c', '#d4d0c7', 'Nickel', 'hides spots')}${sw(184, 'fg', '#4b4d50', '#7a7c7f', 'Gunmetal', 'PVD only')}${sw(274, 'fb', '#1d1d1d', '#2e2e2e', 'Matt black', 'marks show')}</g></svg>`;

export const list = a => `<ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>`;

export function dayPage(v = {}, ro = false) {
 const log = dayLog(v), times = dayTimes(log), saved = !!v[DAY_KEY];
 const nav = s => `<a class="day-nav" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(s.q)}&travelmode=driving" target="_blank" rel="noopener">Google Maps</a><a class="day-nav" href="https://waze.com/ul?q=${encodeURIComponent(s.q)}&navigate=yes" target="_blank" rel="noopener">Waze</a>`;
 const stopHTML = (s, i) => {
  const t = times[i], g = s.shop ? SHOPS[s.shop] : null;
  return `<li class="day-stop${t.skip ? ' is-skip' : ''}${t.here ? ' is-here' : ''}${t.done ? ' is-done' : ''}" data-stop="${s.id}">
<div class="day-body"><div class="day-time"><span class="day-num" aria-hidden="true">${i + 1}</span><b data-start>${h(label12(t.start))}</b><small data-plan>${t.late ? `plan ${h(label12(t.plan))}` : 'on plan'}</small></div><h3>${h(s.n)}</h3><p class="day-sub">${h(s.sub)}</p>
<p class="day-meta">${h([i && s.drive ? `Drive ≈${s.drive} min${s.route && DAY_ROUTES[s.route] ? ` · ${DAY_ROUTES[s.route].km} km` : ''}` : '', s.stay ? `Stay ${g ? g.time : s.stay + ' min'}` : '', s.notBefore ? `not before ${label12(s.notBefore)}` : '', s.by ? `by ${label12(s.by)}` : '', s.hoursNote ? s.hoursNote : s.close ? `closes ${label12(s.close)}` : ''].filter(Boolean).join(' · '))}</p>
<p class="day-warn" data-warn${t.warn.length ? '' : ' hidden'}>${h(t.warn.join(' · '))}</p>
<p class="day-wait" data-wait${t.wait > 0 ? '' : ' hidden'}>${t.wait > 0 ? `${t.wait} min spare before this` : ''}</p>
${ro ? '' : `<div class="day-acts"><button type="button" data-act="a">${log.a[s.id] ? (s.btn ?? 'Arrived') + ' ' + h(label12(log.a[s.id])) : (s.btn ?? 'Arrived') + ' now'}</button>${s.stay ? `<button type="button" data-act="l">${log.l[s.id] ? 'Left ' + h(label12(log.l[s.id])) : 'Left now'}</button>` : ''}${s.opt ? `<button type="button" data-act="skip">${t.skip ? 'Add back' : 'Skip'}</button>` : ''}</div>`}
<div class="day-links">${ro ? '' : `<button type="button" class="day-edit" data-act="edit" aria-label="Type the times for ${h(s.n)}">Edit times</button>`}${s.nonav ? '' : nav(s)}</div>
${s.todo || g ? `<details class="day-more"><summary>${g ? 'What to look at and ask' : 'Checklist'}</summary>${s.todo ? list(s.todo.map(h)) : ''}${g ? `<p><a class="text-link" href="/bathrooms#price-check">Prices from the shops →</a></p><p><b>Focus:</b> ${h(g.focus)}</p><h4>Look at</h4>${list(g.look.map(h))}<h4>Ask</h4>${list(g.ask.map(h))}` : ''}</details>` : ''}
</div></li>`;
 };
 const pts = DAY_STOPS.map((s, i) => ({id: s.id, n: s.n, at: s.at, i: i + 1, route: s.route ?? null}));
 return `<section class="day-page" data-day-page${ro ? ' data-ro' : ''}>
<header class="day-head"><p class="eyebrow">Wed 25 Nov · Singapore · done</p><h1>25 Nov day plan (done)</h1>
<p class="day-done">This day is over: MCST deposit paid (receipt 9071), bank and lawyer visited, RIGEL, COURTS and Heritage prices collected (now on <a class="text-link" href="/bathrooms">Bathrooms</a>). Kept here as a record.</p>
<p class="muted">Times move for everyone. Tap <b>Arrived now</b> and <b>Left now</b> at each stop (or Edit times to type one); every later stop re-plans. Drive times are estimates with weekday traffic; check Waze for the live one.</p></header>
<p class="day-km muted">Driving in Singapore today: about <b>${Object.values(DAY_ROUTES).reduce((a, r) => a + r.km, 0).toFixed(0)} km</b> (checkpoint to checkpoint), about ${Math.round(Object.values(DAY_ROUTES).reduce((a, r) => a + r.min, 0) / 60 * 10) / 10} hours without traffic.</p>
<div class="day-sum" data-sum><div><small>Now</small><b data-now>–</b></div><div><small>Next</small><b data-next>–</b></div><div><small>Against plan</small><b data-late>–</b></div></div>
<div class="day-map" id="day-map" role="img" aria-label="Map of the day's stops and drives"></div>
<p class="day-mapnote muted">Map: OneMap © Singapore Land Authority. Lines follow the roads (OSRM).</p>
${ro ? '' : `<div class="day-tools"><span class="day-status" data-day-status>${saved ? 'Saved times shown' : 'No times saved yet'}</span><button type="button" class="day-reset" data-reset>Clear all times</button></div>`}
<form class="day-form" data-day-form hidden><h2 data-form-title>Times</h2><div class="day-2"><label>Arrived <input type="time" name="a"></label><label>Left <input type="time" name="l"></label></div><label>Planned stay (min) <input name="d" inputmode="numeric" pattern="\\d{1,3}"></label><p class="day-err" data-day-err hidden></p><div class="day-form-acts"><button type="submit" class="button primary">Save</button><button type="button" class="button secondary" data-cancel>Cancel</button></div></form>
<ol class="day-list">${DAY_STOPS.map(stopHTML).join('')}</ol>

<p class="day-moved"><b>Bathroom prices, shop quotes and the bathroom guide</b> now live on their own page: <a class="text-link" href="/bathrooms">Bathrooms</a>.</p>
<link rel="stylesheet" href="/vendor/leaflet-1.9.4/leaflet.css">
<script id="day-data" type="application/json">${JSON.stringify({stops: DAY_STOPS.map(({id, n, at, plan, stay, drive, notBefore, by, close, opt, route, btn}) => ({id, n, at, plan, stay, drive, notBefore, by, close, opt, route, btn})), routes: Object.fromEntries(Object.entries(DAY_ROUTES).map(([k, r]) => [k, r.line])), log, pts: pts.length}).replace(/</g, '\\u003c')}</script>
</section>`;
}
