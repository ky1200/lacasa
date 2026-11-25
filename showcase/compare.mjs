// Live price check for the 25 Nov bathroom shops (shown on /day#price-check).
// Known prices were checked online on 25 Nov (RIGEL eStore via its store API; others from earlier checks).
// Family quotes from the shops are a shared log in visit_notes key "cmp:log" (POST /api/compare/add, /api/compare/remove, GET /api/compare/state).
const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
export const CMP_KEY = 'cmp:log';
export const CMP_WHO = ['KY', 'KX', 'KS', 'Mum'];
export const CMP_SHOPS = ['RIGEL Experience Centre', 'LIXIL Experience Centre', 'Heritage Bathroom Gallery', 'Bacera', 'Bathzone', 'Other'];
const E = 'https://rigel-estore.com.sg/product/';

// qty = how many we need. p = known prices: [shop, S$, note, link]
export const CMP_ITEMS = [
 {id: 'toilet', n: 'Toilet: RIGEL Gallant one-piece rimless (R-WO9030FA-HKM)', qty: 2, p: [
  ['RIGEL eStore', 525, 'Usual S$770', E + 'one-piece-rimless-water-closet-with-whirlwash-r-wo9030fa-hkm/'],
  ['Lazada RIGEL official', 569, 'S$569–603 seen', 'https://www.lazada.sg/trending/Toilet-Bowls-Top-Repurchased/1157654737'],
  ['Gain City', 580, '', 'https://www.gaincity.com/rigel-water-closet-one-piece-wo9030fa-hkm-t0167035']]},
 {id: 'toilet-slim', n: 'Toilet option: RIGEL one-piece slim tank (R-WO8056F)', qty: 2, p: [
  ['RIGEL eStore', 525, 'Usual S$770', E + 'one-piece-rimless-slim-tank-water-closet-r-wo8056f/']]},
 {id: 'vanity70', n: 'Common vanity 70 cm: RIGEL R-BC7437', qty: 1, p: [
  ['RIGEL eStore', 760, 'Usual S$950', E + 'wall-hung-vanity-cabinet-set-with-integrated-basin-top-r-bc7437/']]},
 {id: 'vanity60', n: 'Master vanity 60 cm: RIGEL R-BC1260', qty: 1, p: [
  ['RIGEL eStore', 500, 'Usual S$580', E + 'wall-hung-vanity-cabinet-set-with-integrated-basin-top-r-bc1260/'],
  ['RIGEL eStore: R-BC1407 (other 60 cm)', 560, '', E + 'wall-hung-vanity-cabinet-set-with-integrated-basin-top-r-bc1407/'],
  ['RIGEL eStore: R-BC0201 (grey, 2 drawers)', 620, '', E + 'wall-hung-vanity-cabinet-set-with-integrated-basin-top-r-bc0201/']]},
 {id: 'shower3', n: 'Common shower: RIGEL 3-in-1 thermostatic rain set (TSME14418T)', qty: 1, p: [
  ['RIGEL eStore, chrome', 450, 'Usual S$699', E + 'thermostatic-3-in-1-exposed-shower-set-w2-r-tsme14418t/'],
  ['RIGEL eStore: TSME14459T (other 3-in-1)', 435, '', 'https://rigel-estore.com.sg/?s=TSME14459T&post_type=product'],
  ['RIGEL eStore, brushed nickel', 660, '', E + 'thermostatic-3-in-1-exposed-shower-set-w2-r-tsme14418t/'],
  ['Gain City, brushed nickel', 814, '', 'https://www.gaincity.com/rigel-rainshower-set-3-in-1-w2-r-tsme14418t-brnk-tb0003899']]},
 {id: 'shower2', n: 'Master shower: RIGEL 2-in-1 thermostatic set with slide rail', qty: 1, p: [
  ['RIGEL eStore: TSME3200055 set, chrome', 400, 'Usual S$679', E + 'exposed-thermostatic-2-in-1-shower-set-with-slide-rail-and-hand-shower-w2-r-tsme3200055-set/'],
  ['RIGEL eStore: TSME14258 set, chrome', 415, '', E + 'exposed-thermostatic-2-in-1-shower-set-with-slide-rail-and-hand-shower-w2-r-tsme14258-set/'],
  ['PH Bathroom: TSME14258 mixer, gunmetal', 355, 'Mixer only', 'https://www.google.com/search?q=RIGEL+TSME14258+GM']]},
 {id: 'tap', n: 'Basin tap (×2)', qty: 2, p: [
  ['RIGEL eStore: MXB721101, chrome', 165, 'Usual S$330', E + 'deck-mounted-basin-mixer-tap-w2-r-mxb721101/'],
  ['RIGEL eStore: MXB2003, chrome', 199, 'Usual S$360', E + 'deck-mounted-basin-mixer-tap-w2-r-mxb2003/'],
  ['PH Bathroom: MXB721101, gunmetal', 210, '', 'https://www.google.com/search?q=RIGEL+MXB721101+GM'],
  ['Gain City: MXB8614, gunmetal', 215, '', 'https://www.google.com/search?q=RIGEL+MXB8614+GUN'],
  ['Bathroom Shop SG: Grohe Eurosmart, chrome', 229, '', 'https://bathroom.com.sg/products/grohe-eurosmart-basin-mixer-s-size-23922003']]},
 {id: 'bidet', n: 'Bidet spray set (×2)', qty: 2, p: [
  ['RIGEL eStore, chrome', 125, '', E + 'hand-bidet-sprayer-set-stainless-steel-chrome-r-sa8200-a-w2-r-jt070111b/'],
  ['RIGEL eStore, brushed nickel', 135, '', E + 'hand-bidet-sprayer-set-brushed-nickel-r-sa8200-a-w2-r-jt070111b-brnk/'],
  ['RIGEL eStore, gunmetal', 195, '', E + 'hand-bidet-sprayer-set-stainless-steel-gun-metal-r-sa8200-gun-a-w2-r-jt070111b-gun/'],
  ['Bathroom Shop SG: Grohe Tempesta-F', 128, '', 'https://bathroom.com.sg/products/grohe-tempesta-f-trigger-spray-30-set-bidet-hygiene-spray-27513001']]},
 {id: 'acc', n: 'Accessories set (towel rail, roll holder, hook) ×2', qty: 2, p: [
  ['Bathroom Shop SG: Grohe Essentials 3-in-1', 159, '', 'https://bathroom.com.sg/products/grohe-40775001-essentials-3-in-1-guest-bathroom-accessories-set'],
  ['Lucky Khoon: Hansgrohe AddStoris S', 229, '', 'https://luckykhoon.com.sg/products/hansgrohe-addstoris-s-accessories-bundle'],
  ['RIGEL eStore: bar + holder + hook', 265, '', E + 'single-towel-bar-r-tb6908/']]},
];
// The main pick per item = first price row; package total at the best known price.
export const cmpTarget = () => CMP_ITEMS.filter(i => i.id !== 'toilet-slim').reduce((a, i) => a + i.qty * i.p[0][1], 0);

export function validQuote(o) {
 if (!o || typeof o !== 'object') return false;
 if (!CMP_WHO.includes(o.w)) return false;
 if (!(o.item === 'general' || CMP_ITEMS.some(i => i.id === o.item))) return false;
 if (typeof o.shop !== 'string' || !o.shop.trim() || o.shop.length > 40) return false;
 if (o.price !== null && o.price !== undefined && !(typeof o.price === 'number' && o.price >= 0 && o.price <= 99999)) return false;
 if (typeof o.note !== 'string' || o.note.length > 280) return false;
 return (o.price ?? null) !== null || o.note.trim().length >= 2;
}
export function cmpLog(v = {}) {
 try {const a = JSON.parse(v[CMP_KEY] || '[]'); return Array.isArray(a) ? a.filter(x => x && typeof x.id === 'string' && typeof x.at === 'string' && validQuote(x)) : [];}
 catch {return [];}
}
export function addQuote(list, o, now = new Date()) {
 const at = new Date(now.getTime() + 8 * 3600e3).toISOString().slice(0, 16).replace('T', ' ');
 const id = now.getTime().toString(36) + Math.random().toString(36).slice(2, 6);
 return [{id, at, w: o.w, item: o.item, shop: o.shop.trim(), price: o.price ?? null, note: o.note.trim().replace(/\s+/g, ' ')}, ...list].slice(0, 300);
}

const sgd = n => 'S$' + n.toLocaleString('en-SG', {minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2});
export function comparePage(v = {}, ro = false) {
 const log = cmpLog(v);
 const card = it => {
  const rows = [...it.p.map(([s, pr, note, href]) => ({s, pr, note, href, k: 'online'})), ...log.filter(q => q.item === it.id && q.price !== null).map(q => ({s: q.shop, pr: q.price, note: q.note, k: 'quote', w: q.w, at: q.at, id: q.id}))].sort((a, b) => a.pr - b.pr);
  const low = rows[0]?.pr;
  return `<article class="cmp-item" data-cmp-item="${h(it.id)}"><h3>${h(it.n)}${it.qty > 1 ? ` <small>×${it.qty}</small>` : ''}</h3>
<ol class="cmp-rows" data-cmp-rows>${rows.map(r => `<li class="cmp-row is-${r.k}${r.pr === low ? ' is-low' : ''}"><span class="cmp-price">${h(sgd(r.pr))}</span><span class="cmp-shop">${r.href ? `<a href="${h(r.href)}" target="_blank" rel="noopener">${h(r.s)}</a>` : h(r.s)}${r.k === 'quote' ? ` <em>shop quote · ${h(r.w)}</em>` : ''}${r.note ? `<small>${h(r.note)}</small>` : ''}</span>${r.pr === low ? '<span class="cmp-low">Lowest</span>' : ''}</li>`).join('')}</ol>
${ro ? '' : `<button type="button" class="cmp-add" data-cmp-add="${h(it.id)}">+ Add a shop price</button>`}</article>`;
 };
 const notes = log;
 return `<section class="cmp" id="price-check" data-cmp${ro ? ' data-ro' : ''}><h2>Price check at the shops</h2>
<p class="muted">Online prices checked 25 Nov. Add each shop's price as they quote it; the lowest goes to the top for everyone. Or send photos and notes in the chat with Claude.</p>
<p class="cmp-target">Online total for the main picks (first line of each item, chrome): <b>${h(sgd(cmpTarget()))}</b> for 2 toilets, 2 vanities, 2 showers, 2 taps, 2 sprays, 2 accessory sets. A shop package below this is a good deal; gunmetal adds about S$200–300.</p>
${ro ? '' : `<form class="cmp-form" data-cmp-form hidden><h3 data-cmp-form-title>Add a price</h3>
<label>Item <select name="item">${CMP_ITEMS.map(i => `<option value="${h(i.id)}">${h(i.n)}</option>`).join('')}<option value="general">General note (no item)</option></select></label>
<label>Shop <select name="shop">${CMP_SHOPS.map(s => `<option>${h(s)}</option>`).join('')}</select></label>
<label>Price for one, S$ (leave empty for a note only) <input name="price" inputmode="decimal" pattern="[0-9]+([.][0-9]{1,2})?"></label>
<label>Note <textarea name="note" rows="2" maxlength="280" placeholder="e.g. package price, warranty 10 yrs, PVD? delivery date"></textarea></label>
<fieldset class="pg-who"><legend>From</legend>${CMP_WHO.map((w, i) => `<label><input type="radio" name="w" value="${w}"${i ? '' : ' checked'}><span>${w}</span></label>`).join('')}</fieldset>
<p class="pg-err" data-cmp-err hidden></p><div class="day-form-acts"><button type="submit" class="button primary">Save</button><button type="button" class="button secondary" data-cmp-cancel>Cancel</button></div></form>`}
${CMP_ITEMS.map(card).join('')}
<article class="cmp-item cmp-notes"><h3>All prices and notes</h3><ol class="pg-updates" data-cmp-notes>${notes.length ? notes.map(q => `<li data-id="${h(q.id)}"><span class="pg-who-chip">${h(q.w)}</span><div><p><b>${h(q.shop)}</b>${q.item !== 'general' ? ` · ${h((CMP_ITEMS.find(i => i.id === q.item) ?? {n: ''}).n.split(':')[0])}` : ''}${q.price !== null ? ` · ${h(sgd(q.price))}` : ''}${q.note ? `: ${h(q.note)}` : ''}</p><small>${h(q.at.slice(11))}</small></div>${ro ? '' : '<button type="button" class="pg-del" data-del>Delete</button>'}</li>`).join('') : '<li class="pg-empty">No notes yet.</li>'}</ol>
${ro ? '' : '<button type="button" class="cmp-add" data-cmp-add="general">+ Add a note</button>'}</article>
<script id="cmp-data" type="application/json">${JSON.stringify({items: CMP_ITEMS.map(i => ({id: i.id, n: i.n, p: i.p})), log}).replace(/</g, '\\u003c')}</script>
</section>`;
}
