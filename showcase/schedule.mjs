// /schedule: one week-by-week calendar of the renovation for everyone we work with (I-Niche, aircon, V Haus, ANZ…).
// Starts from John's "LaCasa Schedule" (I-Niche, 26 Nov 2026). Saved as one JSON list under the visit_notes key
// "sch:log" (PUT /api/schedule/log); the family adds and changes entries in public/schedule.js.
import {sgToday} from './buy.mjs';

const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
export const SCH_KEY = 'sch:log';

// Everyone we work with. `c` is the tag colour.
export const PARTIES = [
 {id: 'iniche', n: 'I-Niche', full: 'I-Niche Design (main contractor)', who: 'John Yong · WhatsApp group "Renovation Lacasa"', c: '#c56a1f', does: 'Hacking, walls, ceiling, tiling, electrical, painting, doors, glass, vinyl, fitting the sanitary ware. Sundays off.'},
 {id: 'aircon', n: 'Aircon', full: 'Aircon: Mega · Mitsubishi Starmex System 3', who: 'Mega installer (date to book)', c: '#2f7d8c', does: 'Buy by 30 Nov (7NV0 code). Piping and trunking should go in before the false ceiling (7–8 Dec) and painting (from 9 Dec).'},
 {id: 'vhaus', n: 'V Haus', full: 'V Haus Living (JB), order 03460', who: 'Jason Yee', c: '#6b4f9e', does: 'KX L-shape wardrobe (measure Tue 8 Dec), sofa (Dec), LINO dining set (mid–end Jan).'},
 {id: 'anz', n: 'ANZ', full: 'ANZ Home Furniture (JB) · Dunlopillo', who: 'Sales order 155571', c: '#3d6fb6', does: '3 beds + mattresses: delivery Tue 22 Dec. Balance RM12,000 by 19 Dec.'},
 {id: 'bath', n: 'Bathroom shop', full: 'Bathroom fittings (Heritage / RIGEL)', who: 'Heritage Bathroom Gallery', c: '#3f8f5a', does: 'Toilets, showers, taps, bidets. Delivered to site by 11 Dec so I-Niche can fit them on 15 Dec.'},
 {id: 'mcst', n: 'Management', full: 'La Casa management (Exceltec)', who: 'info@la-casa.com.sg · 6469 7405', c: '#7a6a55', does: 'Renovation permit 3–31 Dec, hacking dates, S$1,000 deposit (paid). Works: weekdays 9–6, Sat 9–1.'},
 {id: 'lawyer', n: 'Lawyer', full: 'Pertinent Law LLP', who: 'Keys handover', c: '#8a5a6a', does: 'Keys released Thu 3 Dec, 4–6pm.'},
 {id: 'sp', n: 'SP', full: 'SP Group (utilities)', who: 'SP Services account', c: '#9a8a2a', does: 'Electricity and water on from Sat 5 Dec.'},
 {id: 'starhub', n: 'StarHub', full: 'StarHub fibre (sign up at COURTS)', who: 'COURTS store staff', c: '#b2457a', does: 'Fibre installed about a week before move-in.'},
 {id: 'shops', n: 'Deliveries', full: 'Appliance deliveries', who: 'COURTS · Electromart · Dreame', c: '#5a6b7a', does: 'Washer, fridge, TV (keep boxed until the TV wall is done), robot vacuum (after the final clean).'},
 {id: 'ikea', n: 'IKEA', full: 'IKEA (KS wardrobe)', who: 'IKEA Singapore', c: '#b08a00', does: 'KS picks his PAX after the wall is measured.'},
 {id: 'family', n: 'Family', full: 'Family (our own jobs)', who: 'KY · KX · KS', c: '#24211d', does: 'Things we must buy, bring or decide by a date.'},
];
export const KINDS = [['work', 'Work'], ['measure', 'Measure'], ['delivery', 'Delivery'], ['meet', 'Meeting'], ['due', 'Deadline'], ['other', 'Other']];
const PID = new Set(PARTIES.map(p => p.id)), KID = new Set(KINDS.map(k => k[0]));

// Starting list: John's schedule (I-Niche, received 26 Nov) + what we know of the others.
export const SCH_SEED = [
 {id: 'a1', who: 'lawyer', kind: 'meet', date: '2026-12-03', end: '', t: 'Keys from the lawyers, 4–6pm', note: 'Earliest through the legal process; the owners may hand over keys earlier (asking).'},
 {id: 'a2', who: 'iniche', kind: 'meet', date: '2026-12-03', end: '', t: 'Site meeting with the contractors', note: 'Asked John for the evening, after the keys. Bring the 3 Dec checklist (To-buy page).'},
 {id: 'a3', who: 'iniche', kind: 'work', date: '2026-12-04', end: '', t: 'Clear debris, protect the flat', note: ''},
 {id: 'a4', who: 'iniche', kind: 'work', date: '2026-12-04', end: '', t: 'Hacking (day 1 of 3)', note: 'Hacking is on 4, 7 and 8 Dec (confirmed). John’s schedule still says 4 + 5 Dec: ask him for a revised schedule. Ask him to hack the KX room by 7 Dec so the wall is bare for V Haus on 8 Dec.'},
 {id: 'a4b', who: 'iniche', kind: 'work', date: '2026-12-07', end: '2026-12-08', t: 'Hacking (days 2 and 3)', note: 'The half wall and false ceiling on John’s schedule (7–9 Dec) may move a little later.'},
 {id: 'a5', who: 'iniche', kind: 'measure', date: '2026-12-04', end: '', t: 'Measure carpentry (TV feature wall)', note: ''},
 {id: 'a6', who: 'iniche', kind: 'measure', date: '2026-12-04', end: '', t: 'Measure ventilation fan', note: ''},
 {id: 'a7', who: 'iniche', kind: 'work', date: '2026-12-07', end: '2026-12-09', t: 'Build half-height wall + regrout', note: 'Common bathroom. Ask for waterproofing + a 24 h ponding test.'},
 {id: 'a8', who: 'iniche', kind: 'work', date: '2026-12-07', end: '2026-12-08', t: 'False ceiling / partition wall', note: ''},
 {id: 'a9', who: 'iniche', kind: 'measure', date: '2026-12-07', end: '', t: 'Measure veneer door', note: 'Our amendment list asks to remove E1: check with John.'},
 {id: 'a10', who: 'iniche', kind: 'work', date: '2026-12-08', end: '2026-12-09', t: 'Replace window film', note: ''},
 {id: 'a11', who: 'iniche', kind: 'work', date: '2026-12-09', end: '2026-12-12', t: 'Painting', note: ''},
 {id: 'a12', who: 'iniche', kind: 'work', date: '2026-12-10', end: '', t: 'Polish master bathroom floor', note: ''},
 {id: 'a13', who: 'iniche', kind: 'work', date: '2026-12-10', end: '', t: 'Install ceiling fans', note: 'We supply the fans: on site by 9 Dec.'},
 {id: 'a14', who: 'iniche', kind: 'measure', date: '2026-12-10', end: '2026-12-11', t: 'Measure glass door + shower screen', note: ''},
 {id: 'a15', who: 'iniche', kind: 'work', date: '2026-12-11', end: '', t: 'Install TV feature wall', note: ''},
 {id: 'a16', who: 'iniche', kind: 'delivery', date: '2026-12-11', end: '2026-12-12', t: 'Lights + sanitary ware delivered to site', note: 'We supply these: they must arrive by 11–12 Dec.'},
 {id: 'a17', who: 'iniche', kind: 'work', date: '2026-12-14', end: '', t: 'Install lights', note: ''},
 {id: 'a18', who: 'iniche', kind: 'work', date: '2026-12-15', end: '', t: 'Install sanitary ware', note: ''},
 {id: 'a19', who: 'iniche', kind: 'work', date: '2026-12-15', end: '', t: 'Install doors', note: ''},
 {id: 'a20', who: 'iniche', kind: 'work', date: '2026-12-16', end: '2026-12-17', t: 'Install vinyl flooring (bedrooms)', note: ''},
 {id: 'a21', who: 'iniche', kind: 'work', date: '2026-12-17', end: '2026-12-18', t: 'Touch-up painting', note: ''},
 {id: 'a22', who: 'iniche', kind: 'work', date: '2026-12-18', end: '', t: 'Cleaning', note: 'Last day on John’s schedule.'},
 {id: 'b1', who: 'sp', kind: 'other', date: '2026-12-05', end: '', t: 'Electricity + water on', note: ''},
 {id: 'b2', who: 'vhaus', kind: 'measure', date: '2026-12-08', end: '', t: 'Measure the KX wardrobe', note: 'Decide body colour, doors and inside layout by then.'},
 {id: 'b3', who: 'family', kind: 'due', date: '2026-12-10', end: '', t: 'Lights + bathroom fittings bought and delivered', note: 'John needs them on site 11–12 Dec (lights fitted 14 Dec, sanitary 15 Dec).'},
 {id: 'b3f', who: 'family', kind: 'due', date: '2026-12-09', end: '', t: 'Ceiling fans on site', note: 'John installs the fans on 10 Dec.'},
 {id: 'b4', who: 'bath', kind: 'delivery', date: '2026-12-11', end: '', t: 'Bathroom fittings delivered', note: 'Toilets, showers, taps, bidets.'},
 {id: 'b5', who: 'anz', kind: 'delivery', date: '2026-12-22', end: '', t: '3 beds + mattresses delivered', note: 'Balance RM12,000 paid by 19 Dec.'},
 {id: 'b6', who: 'family', kind: 'due', date: '2026-12-04', end: '', t: 'All choices to John', note: 'Tiles, grout, doors, glass, paint, vinyl, TV wall, lights.'},
 {id: 'b7', who: 'mcst', kind: 'due', date: '2026-12-31', end: '', t: 'Renovation permit ends', note: 'Works must finish by 31 Dec.'},
 {id: 'c1', who: 'aircon', kind: 'work', date: '2026-12-07', end: '', t: 'Aircon piping + install (date to confirm)', note: 'Ask Mega for about 7 Dec when buying on 30 Nov: piping must go in before the false ceiling (7–8 Dec) and painting (9 Dec).'},
 {id: 'c2', who: 'vhaus', kind: 'delivery', date: '', end: '', t: 'Sofa delivery (Dec, date to confirm)', note: ''},
 {id: 'c3', who: 'vhaus', kind: 'delivery', date: '', end: '', t: 'Dining set delivery (mid–end Jan)', note: ''},
 {id: 'c4', who: 'starhub', kind: 'work', date: '', end: '', t: 'Fibre install (about a week before move-in)', note: ''},
 {id: 'c5', who: 'shops', kind: 'delivery', date: '', end: '', t: 'Washer, fridge, TV, robot vacuum', note: 'After the cleaning on 18 Dec.'},
];

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const str = (x, n) => typeof x === 'string' && x.length <= n;
export function validSchLog(value) {
 if (value === '') return true;
 if (typeof value !== 'string' || value.length > 80000) return false;
 let list;
 try {list = JSON.parse(value);} catch {return false;}
 if (!Array.isArray(list) || list.length > 400) return false;
 const ids = new Set();
 for (const e of list) {
  if (!e || typeof e !== 'object' || Array.isArray(e)) return false;
  if (!str(e.id, 24) || !/^[\w-]+$/.test(e.id) || ids.has(e.id)) return false;
  ids.add(e.id);
  if (!PID.has(e.who) || !KID.has(e.kind)) return false;
  if (!(e.date === '' || (str(e.date, 10) && DATE.test(e.date)))) return false;
  if (!((e.end ?? '') === '' || (str(e.end, 10) && DATE.test(e.end) && e.date && e.end >= e.date))) return false;
  if (!str(e.t, 120) || !e.t.trim() || !str(e.note ?? '', 400)) return false;
 }
 return true;
}
export function schList(v = {}) {
 const raw = v[SCH_KEY];
 if (raw && validSchLog(raw)) return JSON.parse(raw);
 return SCH_SEED;
}

const addDays = (d, n) => new Date(Date.parse(d + 'T00:00:00Z') + n * 864e5).toISOString().slice(0, 10);
const dow = d => (new Date(d + 'T00:00:00Z').getUTCDay() + 6) % 7; // Mon = 0
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], DAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const short = d => `${+d.slice(8)} ${MON[+d.slice(5, 7) - 1]}`;
// Every day an entry covers (start to end, inclusive).
export function daysOf(e) {
 if (!e.date) return [];
 const out = [];
 for (let d = e.date; d <= (e.end || e.date) && out.length < 60; d = addDays(d, 1)) out.push(d);
 return out;
}
// Weeks (Mon–Sun) from the week of the first dated entry (or this week, if later is past) to the last.
export function weeksFor(list, today = sgToday()) {
 const dated = list.flatMap(daysOf).sort();
 if (!dated.length) return [];
 let start = dated[0] < today ? today : dated[0];
 if (dated.at(-1) < today) start = dated[0];
 start = addDays(start, -dow(start));
 const last = dated.at(-1), weeks = [];
 for (let w = start; w <= last && weeks.length < 20; w = addDays(w, 7)) weeks.push(w);
 return weeks;
}

export function schedulePage(v = {}, ro = false, today = sgToday()) {
 const list = schList(v), saved = !!v[SCH_KEY], party = Object.fromEntries(PARTIES.map(p => [p.id, p]));
 const byDay = new Map();
 for (const e of list) daysOf(e).forEach((d, i, all) => {if (!byDay.has(d)) byDay.set(d, []); byDay.get(d).push({e, i, n: all.length});});
 const chip = ({e, i, n}) => `<li class="sch-chip k-${h(e.kind)}" data-id="${h(e.id)}" data-who="${h(e.who)}"><span class="sch-who" style="--pc:${party[e.who].c}">${h(party[e.who].n)}</span><span class="sch-t">${h(e.t)}${n > 1 ? ` <small>(day ${i + 1} of ${n})</small>` : ''}</span>${e.note && i === 0 ? `<small class="sch-note">${h(e.note)}</small>` : ''}${ro ? '' : `<button type="button" class="sch-edit" data-act="edit" aria-label="Change: ${h(e.t)}">Edit</button>`}</li>`;
 const weeks = weeksFor(list, today);
 const week = w => {
  const days = Array.from({length: 7}, (_, k) => addDays(w, k));
  const busy = days.some(d => byDay.has(d));
  return `<section class="sch-week${days.at(-1) < today ? ' is-past' : ''}"><h2>${h(short(days[0]))} – ${h(short(days[6]))}</h2><ol class="sch-days">${days.map((d, k) => {
   const items = (byDay.get(d) ?? []).sort((a, b) => a.e.who.localeCompare(b.e.who));
   return `<li class="sch-day${k === 6 ? ' is-sun' : ''}${d === today ? ' is-today' : ''}${items.length ? '' : ' is-empty'}"><div class="sch-dh"><b>${DAY[k]}</b> ${+d.slice(8)}${d === today ? ' <em>today</em>' : ''}</div>${items.length ? `<ul>${items.map(chip).join('')}</ul>` : `<p class="sch-none">${k === 6 ? 'Off day' : busy ? '–' : ''}</p>`}</li>`;
  }).join('')}</ol></section>`;
 };
 const undated = list.filter(e => !e.date);
 const nextFor = id => list.filter(e => e.who === id && e.date && (e.end || e.date) >= today).sort((a, b) => a.date < b.date ? -1 : 1)[0];
 return `<section class="sch-page" data-sch-page${ro ? ' data-ro' : ''}>
<header class="sch-head"><h1>Schedule</h1><p class="muted">Week by week: who comes to the flat and when. Starts from John’s schedule (I-Niche, 26 Nov). Anyone in the family can add or change an entry; it saves for everyone.</p></header>
<div class="sch-legend" aria-label="Colour key">${KINDS.map(([k, n]) => `<span class="sch-key k-${k}">${n}</span>`).join('')}</div>
<div class="sch-filter" role="group" aria-label="Show">${['all', ...PARTIES.map(p => p.id)].filter(id => id === 'all' || list.some(e => e.who === id)).map(id => `<button type="button" data-show="${id}" aria-pressed="${id === 'all'}"${id === 'all' ? '' : ` style="--pc:${party[id].c}"`}>${id === 'all' ? 'Everyone' : h(party[id].n)}</button>`).join('')}</div>
${ro ? '' : `<div class="sch-tools"><button type="button" class="pay-add" data-add>+ Add to the schedule</button><span class="pay-status" data-sch-status>${saved ? 'Saved' : 'Starting list: edits save for everyone'}</span></div>`}
${ro ? '' : `<form class="pay-form sch-form" data-sch-form hidden>
 <h2 data-form-title>Add to the schedule</h2>
 <label>Who <select name="who">${PARTIES.map(p => `<option value="${p.id}">${h(p.full)}</option>`).join('')}</select></label>
 <label>What <input name="t" required maxlength="120" autocomplete="off"></label>
 <label>Type <select name="kind">${KINDS.map(([k, n]) => `<option value="${k}">${n}</option>`).join('')}</select></label>
 <div class="pay-2"><label>From <input type="date" name="date"></label><label>To (if more than 1 day) <input type="date" name="end"></label></div>
 <label>Note <textarea name="note" maxlength="400" rows="2"></textarea></label>
 <p class="pay-err" data-sch-err hidden></p>
 <div class="pay-form-acts"><button type="submit" class="button primary">Save</button><button type="button" class="button secondary" data-cancel>Cancel</button><button type="button" class="pay-del" data-del hidden>Delete</button></div>
</form>`}
${weeks.map(week).join('')}
${undated.length ? `<section class="sch-week"><h2>Date to confirm</h2><ul class="sch-undated">${undated.map(e => chip({e, i: 0, n: 1})).join('')}</ul></section>` : ''}
<section class="sch-people"><h2>Who we work with</h2><ul>${PARTIES.map(p => {const nx = nextFor(p.id); return `<li style="--pc:${p.c}"><b>${h(p.full)}</b><small>${h(p.who)}</small><span>${h(p.does)}</span>${nx ? `<small class="sch-next">Next: ${h(short(nx.date))} · ${h(nx.t)}</small>` : ''}</li>`;}).join('')}</ul></section>
<script id="sch-data" type="application/json">${JSON.stringify({list}).replace(/</g, '\\u003c')}</script>
</section>`;
}
