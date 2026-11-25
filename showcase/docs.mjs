// /docs: one list of every La Casa document. The originals (receipts, sales orders, emails) live in K's private
// Google Drive folder "LACASA DOCUMENTS (family)"; links only open for people the folder is shared with.
// Summaries here never carry IC numbers, the unit address, phone numbers or bank account numbers.
import {dayLabel} from './buy.mjs';

const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
export const DOCS_FOLDER = 'https://drive.google.com/drive/folders/1Z1XUukT2HPH9mqsTGoTI08HW0BpaPQOG';
const D = id => `https://drive.google.com/file/d/${id}/view`;

export const DOCS = [
 {g: 'Management (MCST)', items: [
  {date: '2026-11-25', t: 'Renovation deposit receipt', s: 'S$1,000 cash, official receipt S/N 9071, in Ka Xuann\'s name. Covers works 3 to 31 Dec 2026. Keep it to get the deposit back.', href: D('1C6hg2UMVV-I16hJqJ1yFfUSXWzgU5C_c'), kind: 'Photo'},
  {date: '2026-11-25', t: 'Owner\'s email to management', s: 'The seller confirms the buyer and sends the renovation form on our behalf; we take over the application after completion on 3 Dec.', href: D('1RyeM4PO13AZGalR6CNyU5BOw1Xc7Xqhb'), kind: 'Screenshot'},
  {date: '2026-11-25', t: 'Management office hours and contacts', s: 'Mon–Fri 9am–6pm, Sat 9am–1pm, closed Sun and public holidays, lunch 1–2pm. Tel 6469 7405, info@la-casa.com.sg.', href: D('1BqRr_IzMIJk7R8emMz93qTcOtJLeLula'), kind: 'Photo'},
 ]},
 {g: 'Contractor (I-Niche)', items: [
  {date: '2026-11-23', t: 'Revised quotation (not signed)', s: 'S$19,035. Address and IC hidden.', href: '/files/iniche-quotation-2026-11-23.pdf', kind: 'PDF'},
  {date: '2026-11-13', t: 'Floor plan (proposed layout)', s: 'The plan used on the Floor plan page.', href: '/files/iniche-floor-plan-2026-11-13.pdf', kind: 'PDF'},
  {date: '2026-11-13', t: 'First quotation (old)', s: 'S$24,100. Replaced by the 23 Nov quote.', href: '/files/iniche-quotation-2026-11-13.pdf', kind: 'PDF'},
 ]},
 {g: 'Furniture orders', items: [
  {date: '2026-11-22', t: 'Dunlopillo (ANZ Home Furniture) sales order 155571', s: '3 queen mattresses + 3 storage frames, RM19,999. Deposit RM7,999 by bank transfer 22 Nov; balance RM12,000 before delivery (22 Dec). Free: 3 Sleepwell pillows, 3 iCool pillows, 3 protectors. Not cancellable.', href: D('1iNeUFjTV0CBeTosfoG6v0LAizBTBGGa8'), kind: 'Photo'},
  {date: '2026-11-21', t: 'V Haus sales order 03460, page 1', s: 'LINO table + 6 chairs, ALTO L-shape wardrobe (KX), sofa 2233A in RU002, 2 small pillows. RM14,516.62 incl. GST. Delivery date TBC.', href: D('1TwTh-verNuY1WcE2dIhsoCmk7rCvp_KI'), kind: 'Photo'},
  {date: '2026-11-21', t: 'V Haus sales order 03460, page 2 (terms)', s: 'Deposit non-refundable; full payment before delivery; defects within 3 days of delivery; storage charges after 14 days.', href: D('1PTjicya4RgQih0LloDY0TGhRSNB8XVt3'), kind: 'Photo'},
 ]},
 {g: 'The flat', items: [
  {date: '2026-11-25', t: 'Main door (same design as ours)', s: 'Timber door, long pull bar, euro key cylinder: a mortise lock. Used to choose the smart lock.', href: D('14EMdu74yY0HqPhph5pkL0-E49tjeMIir'), kind: 'Photo'},
  {date: '2026-11-25', t: 'Main door lock close-up', s: 'Euro-profile cylinder in a round plate.', href: D('1twaQde1BNY_66dQNXB4bOWEdZbL2OonW'), kind: 'Photo'},
 ]},
];

// La Casa renovation rules (from the management form + receipt + office notice). Unknowns are marked "ask".
export const RULES = [
 ['Permit', 'Renovation approved 3 Dec to 31 Dec 2026 (deposit receipt). Works past 31 Dec need an extension from management before then.'],
 ['Work hours', 'Mon–Fri 9am–6pm. Sat 9am–1pm. No work on Sundays or public holidays.'],
 ['Hacking (noisy work)', 'Confirmed 3, 4 and 7 Dec only.'],
 ['Works list', 'All works listed on the form with drawings. New works not on the form: tell management first.'],
 ['Deposit', 'S$1,000 cash, paid 25 Nov (receipt S/N 9071). Refunded after the works pass the management check: keep the receipt.'],
 ['After the works', 'Submit the moving-in form to management after completion.'],
 ['Main door', 'Ask before drilling or changing the main door (it may be fire-rated).'],
 ['Office', 'Mon–Fri 9am–6pm, Sat 9am–1pm, lunch 1–2pm, closed Sun and public holidays. Tel 6469 7405, info@la-casa.com.sg.'],
 ['Ask management', 'Lift padding and booking for deliveries, debris disposal, contractor passes and parking, corridor protection.'],
];

export function docsPage() {
 const n = DOCS.reduce((a, g) => a + g.items.length, 0);
 const row = d => `<li><a class="doc-row" href="${h(d.href)}" target="_blank" rel="noopener"><span class="doc-kind">${h(d.kind)}</span><span class="doc-text"><b>${h(d.t)}</b><small>${h(dayLabel(d.date))} · ${h(d.s)}</small></span><span class="doc-open" aria-hidden="true">↗</span></a></li>`;
 return `<section class="doc-page">
<header class="doc-head"><p class="eyebrow">${n} documents</p><h1>Documents and rules</h1>
<p class="muted">Receipts, orders, quotes and photos in one place. Photos and receipts open from the family Google Drive folder (only for people it is shared with); quotes and plans open here.</p>
<a class="button primary doc-folder" href="${DOCS_FOLDER}" target="_blank" rel="noopener">Open the Drive folder ↗</a>
<p class="doc-add muted">To add one: put the photo or PDF in the Drive folder (name it "date + what"), then post it on Progress so everyone knows.</p></header>
<section class="doc-rules" id="rules" aria-labelledby="rules-h"><h2 id="rules-h">Renovation rules</h2><dl>${RULES.map(([k, v]) => `<div><dt>${h(k)}</dt><dd>${h(v)}</dd></div>`).join('')}</dl></section>
${DOCS.map(g => `<section class="doc-group"><h2>${h(g.g)}</h2><ol class="doc-list">${g.items.map(row).join('')}</ol></section>`).join('')}
</section>`;
}
