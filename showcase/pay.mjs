// /pay: every payment, deposit and balance in one list the family edits themselves.
// Saved as one JSON list under the visit_notes key "pay:log" (PUT /api/pay/log). Editing happens in public/pay.js.
import {BUY} from './buy-plan.mjs';
import {sgToday, dayLabel} from './buy.mjs';

const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
export const PAY_KEY = 'pay:log';
export const PAY_WHO = ['KY', 'KX', 'KS', 'Family'];
export const PAY_HOW = ['Cash', 'Card', 'Bank transfer', 'PayNow', 'Other'];

// Starting list (24 Nov), used until the family saves their own list.
export const PAY_SEED = [
 {id: 's1', date: '2026-11-22', status: 'paid', to: 'Dunlopillo (ANZ Home Furniture, JB)', what: 'Deposit: 3 beds + 3 mattresses (total RM19,999)', amt: 7999, cur: 'MYR', by: '', how: 'Bank transfer', back: false, note: 'Sales order 155571.'},
 {id: 's2', date: '2026-12-19', status: 'due', to: 'Dunlopillo (ANZ Home Furniture, JB)', what: 'Balance, at least 3 days before the 22 Dec delivery', amt: 12000, cur: 'MYR', by: '', how: '', back: false, note: ''},
 {id: 's3', date: '2026-11-22', status: 'paid', to: 'V Haus Living (JB), order 03460', what: '30% deposit: dining set, KX wardrobe, sofa (total RM14,516.62)', amt: 4355, cur: 'MYR', by: '', how: '', back: false, note: ''},
 {id: 's4', date: '', status: 'due', to: 'V Haus Living (JB), order 03460', what: 'Balance before delivery (ask if per delivery)', amt: 10161.62, cur: 'MYR', by: '', how: '', back: false, note: ''},
 {id: 's5', date: '2026-11-25', status: 'paid', to: 'La Casa management (MCST)', what: 'Renovation deposit, cash at the office', amt: 1000, cur: 'SGD', by: '', how: 'Cash', back: true, note: 'Official receipt S/N 9071. Covers works 3 to 31 Dec 2026. Refunded after the works pass inspection.'},
 {id: 's6', date: '2026-11-28', status: 'due', to: 'I-Niche Design', what: '10% on signing (estimate on the S$19,035 quote)', amt: 1903.5, cur: 'SGD', by: '', how: '', back: false, note: 'Update the amount once the corrected quote is signed.'},
];

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const str = (x, n) => typeof x === 'string' && x.length <= n;
export function validPayLog(value) {
 if (value === '') return true;
 if (typeof value !== 'string' || value.length > 60000) return false;
 let list;
 try {list = JSON.parse(value);} catch {return false;}
 if (!Array.isArray(list) || list.length > 300) return false;
 const ids = new Set();
 for (const e of list) {
  if (!e || typeof e !== 'object' || Array.isArray(e)) return false;
  if (!str(e.id, 24) || !/^[\w-]+$/.test(e.id) || ids.has(e.id)) return false;
  ids.add(e.id);
  if (!(e.date === '' || (str(e.date, 10) && DATE.test(e.date)))) return false;
  if (!['paid', 'due'].includes(e.status)) return false;
  if (!str(e.to, 120) || !e.to.trim() || !str(e.what, 200) || !str(e.note ?? '', 400)) return false;
  if (typeof e.amt !== 'number' || !Number.isFinite(e.amt) || e.amt < 0 || e.amt > 10000000) return false;
  if (!['SGD', 'MYR'].includes(e.cur) || !['', ...PAY_WHO].includes(e.by ?? '') || !['', ...PAY_HOW].includes(e.how ?? '')) return false;
  if (typeof (e.back ?? false) !== 'boolean') return false;
 }
 return true;
}
export function payList(v = {}) {
 const raw = v[PAY_KEY];
 if (raw && validPayLog(raw)) return JSON.parse(raw);
 return PAY_SEED;
}
export const toSGDp = (e, rate = BUY.rate) => e.cur === 'MYR' ? e.amt / rate : e.amt;
const money = (n, cur) => `${cur === 'MYR' ? 'RM' : 'S$'}${n.toLocaleString('en-SG', {minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2})}`;
export function payTotals(list, rate = BUY.rate) {
 const sum = f => list.filter(f).reduce((a, e) => a + toSGDp(e, rate), 0);
 return {paid: sum(e => e.status === 'paid'), due: sum(e => e.status === 'due'), back: sum(e => e.back && e.status === 'paid')};
}

export function payPage(v = {}, ro = false, today = sgToday()) {
 const list = payList(v), t = payTotals(list), saved = !!v[PAY_KEY];
 const due = list.filter(e => e.status === 'due').sort((a, b) => (a.date || '9') < (b.date || '9') ? -1 : 1);
 const paid = list.filter(e => e.status === 'paid').sort((a, b) => (a.date || '') > (b.date || '') ? -1 : 1);
 const row = e => {
  const late = e.status === 'due' && e.date && e.date < today;
  return `<li class="pay-row${late ? ' is-late' : ''}" data-id="${h(e.id)}"><div class="pay-main"><b>${h(e.to)}</b><span>${h(e.what)}</span><small>${e.date ? h(dayLabel(e.date)) : 'Date to confirm'}${late ? ' · overdue' : ''}${e.by ? ` · paid by ${h(e.by)}` : ''}${e.how ? ` · ${h(e.how)}` : ''}${e.back ? ' · refundable' : ''}</small>${e.note ? `<small class="pay-note">${h(e.note)}</small>` : ''}</div><div class="pay-amt"><b>${h(money(e.amt, e.cur))}</b>${e.cur === 'MYR' ? `<small>≈ ${h(money(Math.round(toSGDp(e)), 'SGD'))}</small>` : ''}${ro ? '' : `<span class="pay-acts">${e.status === 'due' ? `<button type="button" data-act="paid">Mark paid</button>` : ''}<button type="button" data-act="edit">Edit</button></span>`}</div></li>`;
 };
 const byTo = Object.entries(list.reduce((a, e) => {const k = e.to; a[k] ??= {paid: 0, due: 0}; a[k][e.status] += toSGDp(e); return a;}, {})).sort((a, b) => (b[1].paid + b[1].due) - (a[1].paid + a[1].due));
 return `<section class="pay-page" data-pay-page${ro ? ' data-ro' : ''}>
<header class="pay-head"><h1>Payments</h1><p class="muted">Every deposit, payment and balance. Anyone in the family can add or change an entry; it saves for everyone. RM is converted at ${BUY.rate} RM per S$.</p></header>
<div class="pay-sum"><div><small>Paid so far</small><b data-sum="paid">${h(money(Math.round(t.paid), 'SGD'))}</b></div><div><small>Still to pay</small><b data-sum="due">${h(money(Math.round(t.due), 'SGD'))}</b></div><div><small>Refundable deposits</small><b data-sum="back">${h(money(Math.round(t.back), 'SGD'))}</b></div></div>
${ro ? '' : `<div class="pay-tools"><button type="button" class="pay-add" data-add>+ Add a payment</button><span class="pay-status" data-pay-status>${saved ? 'Saved' : 'Starting list: edits save for everyone'}</span></div>`}
${ro ? '' : `<form class="pay-form" data-pay-form hidden>
 <h2 data-form-title>Add a payment</h2>
 <fieldset class="pay-status-pick"><legend>Status</legend><label><input type="radio" name="status" value="paid" checked><span>Paid</span></label><label><input type="radio" name="status" value="due"><span>To pay</span></label></fieldset>
 <label>Paid to <input name="to" required maxlength="120" autocomplete="off" list="pay-to"></label>
 <datalist id="pay-to">${[...new Set(list.map(e => e.to))].map(x => `<option value="${h(x)}">`).join('')}</datalist>
 <label>What for <input name="what" maxlength="200" autocomplete="off"></label>
 <div class="pay-2"><label>Amount <input name="amt" required inputmode="decimal" pattern="\\d{1,7}(\\.\\d{1,2})?"></label><label>Currency <select name="cur"><option>SGD</option><option>MYR</option></select></label></div>
 <div class="pay-2"><label>Date <input type="date" name="date"></label><label>Paid by <select name="by"><option value="">Not set</option>${PAY_WHO.map(w => `<option>${w}</option>`).join('')}</select></label></div>
 <label>How <select name="how"><option value="">Not set</option>${PAY_HOW.map(w => `<option>${w}</option>`).join('')}</select></label>
 <label class="pay-check"><input type="checkbox" name="back"><span>Refundable deposit</span></label>
 <label>Note <textarea name="note" maxlength="400" rows="2"></textarea></label>
 <p class="pay-err" data-pay-err hidden></p>
 <div class="pay-form-acts"><button type="submit" class="button primary">Save</button><button type="button" class="button secondary" data-cancel>Cancel</button><button type="button" class="pay-del" data-del hidden>Delete</button></div>
</form>`}
<section class="pay-block"><h2>To pay <small>${due.length}</small></h2>${due.length ? `<ul class="pay-list" data-list="due">${due.map(row).join('')}</ul>` : '<p class="muted">Nothing left to pay.</p>'}</section>
<section class="pay-block"><h2>Paid <small>${paid.length}</small></h2>${paid.length ? `<ul class="pay-list" data-list="paid">${paid.map(row).join('')}</ul>` : '<p class="muted">No payments yet.</p>'}</section>
<section class="pay-block"><h2>By shop or contractor</h2><table class="pay-table"><thead><tr><th>Who</th><th>Paid</th><th>To pay</th></tr></thead><tbody>${byTo.map(([k, x]) => `<tr><td>${h(k)}</td><td>${h(money(Math.round(x.paid), 'SGD'))}</td><td>${h(money(Math.round(x.due), 'SGD'))}</td></tr>`).join('')}</tbody></table></section>
<script id="pay-data" type="application/json">${JSON.stringify({list, rate: BUY.rate, seeded: !saved}).replace(/</g, '\\u003c')}</script>
</section>`;
}
