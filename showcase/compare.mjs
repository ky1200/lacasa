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
 {id: 'toilet', n: 'Toilet: RIGEL Gallant one-piece rimless (R-WO9030FA-HKM)', qty: 2, img: '/images/buy/rigel-gallant-one-piece-rimless-toilet-with-whirlwash-cd2f69.webp', look: 'S-trap setting-out 3 to 10 inch (75–250 mm) or P-trap 180 mm: measure wall to pipe centre on 3 Dec. 65 × 37 cm, 75 cm high. The W3 version (3 ticks, 4 L / 3 L flush) is the same price.', p: [
  ['RIGEL eStore', 525, 'Usual S$770', E + 'one-piece-rimless-water-closet-with-whirlwash-r-wo9030fa-hkm/'],
  ['Lazada RIGEL official', 569, 'S$569–603 seen', 'https://www.lazada.sg/trending/Toilet-Bowls-Top-Repurchased/1157654737'],
  ['Gain City', 580, '', 'https://www.gaincity.com/rigel-water-closet-one-piece-wo9030fa-hkm-t0167035'],
  ['RIGEL Centre tag (list price)', 770, 'W2 and W3 versions both S$770 on the tag']]},
 {id: 'toilet-slim', n: 'Toilet option: RIGEL 9030F back-to-wall (R-WO9030FA) or slim tank (R-WO8056F)', qty: 2, img: '/images/buy/rigel-one-piece-rimless-slim-tank-3b3179.webp', look: '9030F back-to-wall: 65 × 37 cm, 80 cm high, closes the gap behind the toilet (no dust trap). Same S$525.', p: [
  ['RIGEL eStore: 9030F back-to-wall', 525, 'Usual S$770', E + 'one-piece-rimless-back-to-wall-water-closet-r-wo9030fa/'],
  ['RIGEL eStore: slim tank R-WO8056F', 525, 'Usual S$770', E + 'one-piece-rimless-slim-tank-water-closet-r-wo8056f/']]},
 {id: 'vanity70', n: 'Common vanity 70 cm: RIGEL R-BC7437 dark wood', qty: 1, img: '/images/buy/rigel-bc7437-dbr-showroom.webp', look: 'Seen at RIGEL: 70 × 50 cm, cabinet 45 cm high, 2 drawers, sintered stone top (RomanMark). Check the drawers are soft close.', p: [
  ['RIGEL eStore', 760, 'Usual S$950', E + 'wall-hung-vanity-cabinet-set-with-integrated-basin-top-r-bc7437/'],
  ['RIGEL Centre tag: BC7437-DBR + LV7035', 950, 'List price'],
  ['RIGEL Centre tag: BC0201 grey + LV3819, 70 cm', 830, '70 × 45 cm, 2 drawers'],
  ['RIGEL Centre tag: BC1407 grey + LV3819, 80 cm', 810, '80 × 55 cm: only if the wall is 80 cm+']]},
 {id: 'vanity60', n: 'Master vanity 60 cm: RIGEL R-BC1260 dark brown', qty: 1, img: '/images/buy/rigel-bc1260.webp', look: 'Seen at RIGEL: 60 × 47 cm, 47 cm high, 1 drawer. Also comes black with a white top (same price). Dark top: check for water marks.', p: [
  ['RIGEL eStore', 500, 'Usual S$580', E + 'wall-hung-vanity-cabinet-set-with-integrated-basin-top-r-bc1260/'],
  ['RIGEL eStore: R-BC1407 (other 60 cm)', 560, '', E + 'wall-hung-vanity-cabinet-set-with-integrated-basin-top-r-bc1407/'],
  ['RIGEL Centre tag: BC1260 + LV2613', 580, 'Dark brown or black, same price'],
  ['RIGEL eStore: R-BC0201 (grey, 2 drawers)', 620, '', E + 'wall-hung-vanity-cabinet-set-with-integrated-basin-top-r-bc0201/', '/images/buy/rigel-bc0201.webp'],
  ['RIGEL Centre tag: BC0201 light grey 60 cm', 800, '59.6 × 45 cm, 59 cm high']]},
 {id: 'shower3', n: 'Common shower: RIGEL 3-in-1 thermostatic rain set, gunmetal (TSME14418T)', qty: 1, img: '/images/buy/rigel-3-in-1-thermostatic-rain-shower-set-chrome-48c082.webp', look: 'Rail height 87–117 cm adjustable (KS 190). Brass. Check the gunmetal is the same shade as the tap.', p: [
  ['RIGEL eStore, gunmetal', 660, 'Usual S$1,099', E + 'thermostatic-3-in-1-exposed-shower-set-w2-r-tsme14418t/'],
  ['RIGEL eStore: TSME14459T gunmetal', 640, 'Usual S$1,099', E + 'thermostatic-3-in-1-exposed-shower-set-w2-r-tsme14459t/', '/images/buy/rigel-tsme14459t.webp'],
  ['RIGEL Centre tag: TSME14459T gunmetal', 999, 'List price'],
  ['RIGEL eStore: Quatré 4-in-1 TSME2031 gunmetal', 799, 'Shelf on top, 4 buttons. Usual S$1,100', E + 'quatre-4-in-1-exposed-shower-set-w2-r-tsme2031/', '/images/buy/rigel-tsme2031-gun-showroom.webp'],
  ['RIGEL Centre tag: TSME2031 gunmetal', 1100, 'Chrome S$800 on the tag'],
  ['RIGEL eStore, chrome (if not gunmetal)', 450, '', E + 'thermostatic-3-in-1-exposed-shower-set-w2-r-tsme14418t/']]},
 {id: 'shower2', n: 'Master shower: RIGEL 2-in-1 thermostatic set with slide rail, gunmetal', qty: 1, img: '/images/buy/rigel-hand-shower-rail.webp', look: 'Slide rail low enough for KX 150; hand shower weight.', p: [
  ['RIGEL eStore: TSME3200055 set, gunmetal', 485, 'Usual S$829', E + 'exposed-thermostatic-2-in-1-shower-set-with-slide-rail-and-hand-shower-w2-r-tsme3200055-set/'],
  ['RIGEL eStore: TSME14258 set, gunmetal', 505, 'Usual S$809', E + 'exposed-thermostatic-2-in-1-shower-set-with-slide-rail-and-hand-shower-w2-r-tsme14258-set/'],
  ['RIGEL eStore: TSME3200055 set, chrome', 400, '', E + 'exposed-thermostatic-2-in-1-shower-set-with-slide-rail-and-hand-shower-w2-r-tsme3200055-set/']]},
 {id: 'tap', n: 'Basin tap, gunmetal (×2)', qty: 2, img: '/images/buy/rigel-mxb721101-gun-showroom.webp', look: 'Square MXB721101 or curved MXB8614: same gunmetal shade as the shower? Tap reach over the basin.', p: [
  ['RIGEL eStore: MXB721101 gunmetal', 225, 'Usual S$440', E + 'deck-mounted-basin-mixer-tap-w2-r-mxb721101/'],
  ['RIGEL eStore: MXB8614 gunmetal', 215, 'Usual S$420', E + 'deck-mounted-basin-mixer-tap-w2-r-mxb8614/', '/images/buy/rigel-mxb8614-gun-showroom.webp'],
  ['RIGEL eStore: MXB8110 gunmetal', 195, 'Usual S$350', E + 'deck-mounted-basin-mixer-tap-w2-r-mxb8110/'],
  ['RIGEL eStore: MXB2003 gunmetal', 245, 'Usual S$430', E + 'deck-mounted-basin-mixer-tap-w2-r-mxb2003/', '/images/buy/rigel-mxb2003.webp'],
  ['RIGEL Centre tag: MXB721101 gunmetal', 440, 'MXB8614 S$420, MXB8110 S$350, MXB2003 S$430 on the tags'],
  ['RIGEL eStore: MXB721101 chrome', 165, '', E + 'deck-mounted-basin-mixer-tap-w2-r-mxb721101/']]},
 {id: 'bidet', n: 'Bidet spray set, gunmetal (×2)', qty: 2, img: '/images/buy/rigel-sa8200-gun.webp', look: 'Steel hose, spray strength, holder screws to the wall.', p: [
  ['RIGEL eStore, gunmetal', 195, 'Usual S$270', E + 'hand-bidet-sprayer-set-stainless-steel-gun-metal-r-sa8200-gun-a-w2-r-jt070111b-gun/'],
  ['RIGEL eStore, chrome', 125, '', E + 'hand-bidet-sprayer-set-stainless-steel-chrome-r-sa8200-a-w2-r-jt070111b/', '/images/buy/rigel-sa8200-chrome.webp']]},
 {id: 'acc', n: 'Accessories, gunmetal: towel bar + roll holder + hook (×2 bathrooms)', qty: 2, img: '/images/buy/rigel-tb6908.webp', look: 'Same gunmetal as the taps. Towel shelf R-TS6910 gunmetal S$275 if more towel space is needed.', p: [
  ['RIGEL eStore: TB6908 S$169 + PH9401T S$159 + RH6901 S$55, gunmetal', 383, 'Usual S$698', E + 'single-towel-bar-r-tb6908/'],
  ['RIGEL eStore: same set, chrome', 265, '', E + 'single-towel-bar-r-tb6908/'],
  ['Bathroom Shop SG: Grohe Essentials 3-in-1, chrome only', 159, 'Will not match gunmetal', 'https://bathroom.com.sg/products/grohe-40775001-essentials-3-in-1-guest-bathroom-accessories-set', '/images/buy/grohe-essentials-3in1.webp']]},
 {id: 'mirror', extra: true, n: 'Extra: mirror cabinet with LED light, gunmetal (×2, needs a power point)', qty: 2, img: '/images/buy/rigel-bc5628-mirror-cabinet.webp', look: 'Decide by 3 Dec: a lit cabinet needs a power point above each basin.', p: [
  ['RIGEL eStore: R-BC5628-GUN 60 × 80 cm', 399, 'Usual S$599', 'https://rigel-estore.com.sg/?s=R-BC5628&post_type=product'],
  ['RIGEL eStore: R-BC6030-GUN arched 50 cm', 399, 'Usual S$599', 'https://rigel-estore.com.sg/?s=R-BC6030&post_type=product', '/images/buy/rigel-bc6030-arched-mirror-cabinet.webp'],
  ['RIGEL Centre tag: BC5628-GUN', 599, 'List price'],
  ['RIGEL Centre tag: LED mirror only (no cabinet)', 300, 'FM4500118 50 × 80 or FM4500082 round 70']]},
 {id: 'bidetseat', extra: true, n: 'Extra: manual bidet seat for the 9030 toilet (no power)', qty: 1, img: '/images/buy/rigel-gallant-one-piece-rimless-toilet-with-whirlwash-cd2f69.webp', look: 'Listed on the toilet as the 9030 upgrade (FT-SCBD0104PS). Electric version FT-SCEBD1204DPS needs a socket.', p: [
  ['RIGEL eStore: FT-SCBD0104PS', 170, 'Usual S$220', E + 'manual-bidet-seat-with-soft-close-round-ft-scbd0104ps/']]},
];
// The main pick per item = first price row; package total at the best known price.
export const cmpTarget = () => CMP_ITEMS.filter(i => i.id !== 'toilet-slim' && !i.extra).reduce((a, i) => a + i.qty * i.p[0][1], 0);

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
// Same markup as public/compare.js draw(): keep both in step.
const cmpRowList = (it, log) => [...it.p.map(([s, pr, note, href, img]) => ({s, pr, note, href, img, k: /^RIGEL Centre tag/.test(s) ? 'tag' : 'online', alt: /chrome/i.test(s)})), ...log.filter(q => q.item === it.id && q.price !== null).map(q => ({s: q.shop, pr: q.price, note: q.note, k: 'quote', w: q.w}))].sort((a, b) => (a.alt - b.alt) || (a.pr - b.pr));
export function cmpRows(it, log) {
 const rows = cmpRowList(it, log), low = rows.find(r => !r.alt)?.pr, max = Math.max(...rows.map(r => r.pr), 1);
 return rows.map(r => `<li class="cmp-row is-${r.k}${!r.alt && r.pr === low ? ' is-low' : ''}${r.alt ? ' is-alt' : ''}">${r.img ? `<img class="cmp-thumb" src="${h(r.img)}" alt="" loading="lazy" width="44" height="44">` : `<span class="cmp-thumb cmp-tag">${r.k === 'quote' ? 'Shop' : r.k === 'tag' ? 'Tag' : 'Web'}</span>`}<span class="cmp-price">${h(sgd(r.pr))}</span><span class="cmp-shop">${r.href ? `<a href="${h(r.href)}" target="_blank" rel="noopener">${h(r.s)}</a>` : h(r.s)}${r.k === 'quote' ? ` <em>shop quote · ${h(r.w)}</em>` : ''}${r.note ? `<small>${h(r.note)}</small>` : ''}</span>${!r.alt && r.pr === low ? '<span class="cmp-low">Lowest</span>' : ''}<span class="cmp-bar" aria-hidden="true"><i style="width:${rows.length < 2 || max === low ? 100 : Math.round(35 + 65 * (r.pr - low) / (max - low))}%"></i></span></li>`).join('');
}
export function cmpSum(it, log) {
 const online = it.p[0][1], quotes = log.filter(q => q.item === it.id && q.price !== null).map(q => q.price);
 if (!quotes.length) return `Online S$${online.toLocaleString('en-SG')} each · no shop quote yet`;
 const best = Math.min(...quotes), d = online - best;
 return d > 0 ? `<b class="cmp-good">Shop S$${best.toLocaleString('en-SG')}: S$${d.toLocaleString('en-SG')} cheaper than online</b>` : d < 0 ? `<b class="cmp-bad">Shop S$${best.toLocaleString('en-SG')}: S$${(-d).toLocaleString('en-SG')} dearer than online</b>` : `Shop matches online: S$${best.toLocaleString('en-SG')}`;
}
export function comparePage(v = {}, ro = false) {
 const log = cmpLog(v);
 const card = it => `<article class="cmp-item" data-cmp-item="${h(it.id)}"><div class="cmp-head">${it.img ? `<img class="cmp-pic" src="${h(it.img)}" alt="" loading="lazy" width="96" height="96">` : ''}<div><h3>${h(it.n)}${it.qty > 1 ? ` <small>×${it.qty}</small>` : ''}</h3>${it.look ? `<p class="cmp-look"><b>Look for:</b> ${h(it.look)}</p>` : ''}<p class="cmp-sum" data-cmp-sum>${cmpSum(it, log)}</p></div></div>
<ol class="cmp-rows" data-cmp-rows>${cmpRows(it, log)}</ol>
${ro ? '' : `<button type="button" class="cmp-add" data-cmp-add="${h(it.id)}">+ Add a shop price</button>`}</article>`;
 const notes = log;
 return `<section class="cmp" id="price-check" data-cmp${ro ? ' data-ro' : ''}><h2>Price check at the shops</h2>
<p class="muted">Online prices checked 25 Nov. Add each shop's price as they quote it; the lowest goes to the top for everyone. Or send photos and notes in the chat with Claude.</p>
<p class="cmp-target">Family choice 25 Nov: <b>gunmetal</b>. RIGEL eStore total for the main picks (first line of each item): <b>${h(sgd(cmpTarget()))}</b> for 2 toilets, 2 vanities, 2 showers, 2 taps, 2 sprays, 2 accessory sets (chrome would be about S$1,000 less). The RIGEL Centre tags are list prices, 30–50% above the eStore: ask the centre to match the eStore or give a package price.</p>
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
