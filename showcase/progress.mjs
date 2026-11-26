// /progress: where the move stands, for the whole family.
// Steps tick from the shared to-do list (t:<id> keys, same as /buy) or are fixed as done.
// Family updates are a short feed in visit_notes key "prog:log" (POST /api/progress/update, /api/progress/remove).
import {BUY} from './buy-plan.mjs';
import {sgToday, dayLabel} from './buy.mjs';

const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
export const PROG_KEY = 'prog:log';
export const PROG_WHO = ['KY', 'KX', 'KS', 'Mum'];
export const MOVE_IN_LABEL = 'January 2027';

// done: true = already finished. todo = ticks with that /buy to-do. date without todo = finished once the date passes.
export const STAGES = [
 {id: 'flat', n: 'Buying the flat', steps: [
  {t: 'Offer, loan and option to purchase', done: true},
  {t: 'Bank and lawyer visit (25 Nov)', done: true},
  {t: 'Collect the keys', date: '2026-12-03', todo: 'keys'}]},
 {id: 'reno', n: 'Renovation (I-Niche)', steps: [
  {t: 'Amendment list sent to John (before signing)', date: '2026-11-27', todo: 'quote2'},
  {t: 'Reno form + S$1,000 deposit at management (paid 25 Nov, receipt 9071)', date: '2026-11-26', todo: 'reno-form'},
  {t: 'Sign the quote, pay 10%', date: '2026-11-28', todo: 'sign'},
  {t: 'Site check on 3 Dec, results to I-Niche', date: '2026-12-04', todo: 'tell-iniche'},
  {t: 'Hacking (3, 4, 7 Dec; asked to move to 4, 7, 8 Dec)', date: '2026-12-07', auto: true},
  {t: 'Works finished by 31 Dec (end of the management permit), defects checked', date: '2026-12-31'}]},
 {id: 'choose', n: 'Choices for John (by 4 Dec)', steps: [
  {t: 'Kitchen glass sliding door', date: '2026-12-04', todo: 'kitchen-door'},
  {t: 'Common bathroom half-wall tiles + grout colour', date: '2026-12-04', todo: 'pick-tiles'},
  {t: 'Common bathroom door design', date: '2026-12-04', todo: 'pick-bath-door'},
  {t: 'Shower glass + frosted film', date: '2026-12-04', todo: 'pick-glass'},
  {t: 'Paint colours', date: '2026-12-04', todo: 'pick-paint'},
  {t: 'Bedroom vinyl colour, skirting, thresholds', date: '2026-12-04', todo: 'pick-vinyl'},
  {t: 'TV feature wall design', date: '2026-12-04', todo: 'pick-tvwall'},
  {t: 'Living room lights + bathroom fan model', date: '2026-12-04', todo: 'pick-lights'}]},
 {id: 'bath', n: 'Bathrooms', steps: [
  {t: 'See and price fittings at RIGEL, COURTS and Heritage (25 Nov; gunmetal chosen)', done: true},
  {t: 'Heritage written quote + split plan (Singapore vs Malaysia)', date: '2026-11-30', todo: 'bath-quote'},
  {t: 'Buy the sanitary fittings', date: '2026-12-05', todo: 'sanitary'},
  {t: 'Buy switches and sockets', date: '2026-12-05', todo: 'switches'}]},
 {id: 'furniture', n: 'Furniture', steps: [
  {t: 'Dunlopillo beds ordered (deposit paid)', done: true},
  {t: 'V Haus sofa, dining set, KX wardrobe ordered', done: true},
  {t: 'Sofa model and delivery date from V Haus', todo: 'vhaus-visit'},
  {t: 'KS chooses the IKEA wardrobe', date: '2026-12-04', todo: 'ks-wardrobe-pick'},
  {t: 'V Haus measures the KX wardrobe', date: '2026-12-08', todo: 'vhaus-wardrobe'},
  {t: 'Pay the Dunlopillo balance', date: '2026-12-19', todo: 'dunlopillo-pay'},
  {t: 'Beds delivered', date: '2026-12-22', todo: 'beds'}]},
 {id: 'appliances', n: 'Appliances', steps: [
  {t: 'Black Friday orders (washer, vacuums, robot)', date: '2026-11-27', todo: 'black-friday'},
  {t: 'Confirm the TV', date: '2026-11-30', todo: 'tv-decide'},
  {t: 'Order the aircon', date: '2026-11-30', todo: 'aircon'},
  {t: 'Fridge: Hitachi R-VX480 or Toshiba S$929 (space 75 × 75 × 183 cm)', date: '2026-11-27', todo: 'black-friday'}]},
 {id: 'movein', n: 'Moving in', steps: [
  {t: 'Electricity and water on', date: '2026-12-05', todo: 'sp'},
  {t: 'Fibre broadband: sign up at COURTS (free eGift card), install before move-in', date: '2026-11-30', todo: 'fibre'},
  {t: 'Move in', tbc: MOVE_IN_LABEL}]},
];

export function stepState(s, v = {}, today = sgToday()) {
 if (s.done) return 'done';
 if (s.todo) {if (v[`t:${s.todo}`] === '1') return 'done';}
 else if (s.auto && s.date && s.date < today) return 'done';
 if (!s.date) return 'tbc';
 if (s.date < today) return 'late';
 if (s.date === today) return 'now';
 return 'next';
}
export function progressSummary(v = {}, today = sgToday()) {
 const all = STAGES.flatMap(g => g.steps.map(s => ({...s, stage: g.n, st: stepState(s, v, today)})));
 const done = all.filter(s => s.st === 'done').length;
 const open = all.filter(s => s.st !== 'done' && s.date).sort((a, b) => a.date < b.date ? -1 : 1);
 const seen = new Set(), upcoming = open.filter(s => {const k = s.todo ?? s.t; if (seen.has(k)) return false; seen.add(k); return true;});
 return {all, done, total: all.length, pct: Math.round(done / all.length * 100), upcoming};
}

export function validUpdate(o) {
 return !!o && typeof o === 'object' && PROG_WHO.includes(o.w) && typeof o.t === 'string' && o.t.trim().length >= 2 && o.t.length <= 280;
}
export function progLog(v = {}) {
 try {const a = JSON.parse(v[PROG_KEY] || '[]'); return Array.isArray(a) ? a.filter(x => x && typeof x.id === 'string' && validUpdate(x) && typeof x.at === 'string') : [];}
 catch {return [];}
}
export function addUpdate(list, o, now = new Date()) {
 const at = new Date(now.getTime() + 8 * 3600e3).toISOString().slice(0, 16).replace('T', ' ');
 const id = now.getTime().toString(36) + Math.random().toString(36).slice(2, 6);
 return [{id, at, w: o.w, t: o.t.trim().replace(/\s+/g, ' ')}, ...list].slice(0, 200);
}
const when = at => {const [d, t] = at.split(' '); const [hh, mm] = t.split(':').map(Number); return `${dayLabel(d)}, ${hh % 12 || 12}:${String(mm).padStart(2, '0')}${hh < 12 ? 'am' : 'pm'}`;};

const MARK = {done: '✓', late: '!', now: '●', next: '', tbc: ''};
const LABEL = {done: 'Done', late: 'Overdue', now: 'Today', next: '', tbc: ''};

export function progressPage(v = {}, ro = false, today = sgToday()) {
 const sum = progressSummary(v, today), log = progLog(v);
 const late = sum.upcoming.filter(s => s.st === 'late'), soon = sum.upcoming.filter(s => s.st !== 'late').slice(0, 4);
 const stepRow = s => {
  const st = stepState(s, v, today), can = !ro && s.todo;
  const meta = [s.date ? dayLabel(s.date) : s.tbc ? s.tbc : '', LABEL[st]].filter(Boolean).join(' · ');
  const body = `<span class="pg-dot" aria-hidden="true">${MARK[st]}</span><span class="pg-step-text"><b>${h(s.t)}</b>${meta ? `<small>${h(meta)}</small>` : ''}</span>`;
  return `<li class="pg-step is-${st}" data-step${s.todo ? ` data-todo-id="${h(s.todo)}"` : ''}>${can ? `<button type="button" class="pg-tick" aria-pressed="${st === 'done'}" aria-label="${st === 'done' ? 'Mark not done' : 'Mark done'}: ${h(s.t)}">${body}</button>` : `<div class="pg-tick is-static">${body}</div>`}</li>`;
 };
 const stage = g => {
  const d = g.steps.filter(s => stepState(s, v, today) === 'done').length, all = d === g.steps.length;
  return `<details class="pg-stage${all ? ' is-complete' : ''}"${all ? '' : ' open'}><summary><span><b>${h(g.n)}</b><small>${d} of ${g.steps.length} done</small></span><span class="pg-mini" aria-hidden="true"><i style="width:${Math.round(d / g.steps.length * 100)}%"></i></span></summary><ol class="pg-steps">${g.steps.map(stepRow).join('')}</ol></details>`;
 };
 const item = s => `<li><span class="buy-chip${s.st === 'late' ? ' is-late' : ''}">${h(dayLabel(s.date))}</span><span>${h(s.t)}</span></li>`;
 return `<section class="pg-page" data-progress-page${ro ? ' data-ro' : ''}>
<header class="pg-head"><p class="eyebrow">Keys Thu 3 Dec · move in ${h(MOVE_IN_LABEL)}</p><h1>Progress</h1>
<div class="pg-bar" role="img" aria-label="${sum.done} of ${sum.total} steps done"><i style="width:${sum.pct}%"></i></div>
<p class="pg-count"><b data-pg-done>${sum.done}</b> of ${sum.total} steps done · <span data-pg-pct>${sum.pct}</span>%</p></header>
<section class="pg-next" aria-labelledby="pg-next-h"><h2 id="pg-next-h">What's next</h2>
${late.length ? `<p class="pg-late-h">Not ticked yet</p><ol class="pg-list">${late.map(item).join('')}</ol>` : ''}
<ol class="pg-list">${soon.map(item).join('') || '<li>Nothing dated is left.</li>'}</ol></section>
<section class="pg-feed" aria-labelledby="pg-feed-h"><h2 id="pg-feed-h">Latest updates</h2>
${ro ? '' : `<form class="pg-form" data-pg-form><fieldset class="pg-who"><legend>From</legend>${PROG_WHO.map((w, i) => `<label><input type="radio" name="w" value="${w}"${i ? '' : ' checked'}><span>${w}</span></label>`).join('')}</fieldset>
<label class="pg-text">Update <textarea name="t" rows="2" maxlength="280" placeholder="e.g. Deposit paid at management, receipt in the photo album"></textarea></label>
<p class="pg-err" data-pg-err hidden></p><button type="submit" class="button primary">Post update</button></form>`}
<ol class="pg-updates" data-pg-updates>${log.length ? log.slice(0, 30).map(u => `<li data-id="${h(u.id)}"><span class="pg-who-chip">${h(u.w)}</span><div><p>${h(u.t)}</p><small>${h(when(u.at))}</small></div>${ro ? '' : `<button type="button" class="pg-del" data-del aria-label="Delete this update">Delete</button>`}</li>`).join('') : '<li class="pg-empty">No updates yet. Post the first one above.</li>'}</ol></section>
<section class="pg-stages" aria-labelledby="pg-stages-h"><h2 id="pg-stages-h">All steps</h2><p class="muted">Tap a step to tick it done; ticks are shared with the to-do list on To-buy.</p>${STAGES.map(stage).join('')}</section>
</section>`;
}

// Home card
export function progressCard(v = {}, today = sgToday()) {
 const sum = progressSummary(v, today), nx = sum.upcoming[0], last = progLog(v)[0];
 return `<a class="hq-progress" href="/progress"><span class="hq-progress-top"><b>Progress</b><span>${sum.done} of ${sum.total} done</span></span><span class="pg-bar" aria-hidden="true"><i style="width:${sum.pct}%"></i></span>${nx ? `<span class="hq-progress-next">Next: ${h(nx.t)} · ${h(dayLabel(nx.date))}</span>` : ''}${last ? `<span class="hq-progress-last">${h(last.w)}: ${h(last.t.length > 70 ? last.t.slice(0, 68) + '…' : last.t)}</span>` : ''}<span class="hq-progress-go">See progress and post an update ›</span></a>`;
}
