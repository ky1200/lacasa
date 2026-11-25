// /bathrooms: everything for the two bathrooms in one place (26 Nov 2026).
// Where to buy (Singapore vs Malaysia), the shop price check (compare.mjs), and the guide (moved from /day).
import {comparePage, cmpTarget} from './compare.mjs';
import {svgHeights, svgToilets, svgFinish} from './day.mjs';

const sgd = n => 'S$' + Math.round(n).toLocaleString('en-SG');

// Singapore = everything that connects to water (PUB WELS / SS 636 rules), best gunmetal prices seen 25 Nov.
export const BATH_SG = [
 ['Toilets ×2', 'RIGEL Gallant one-piece (eStore S$525 each)', 1050],
 ['Common shower', 'RIGEL TSME14418T 3-in-1 gunmetal', 660],
 ['Master shower', 'RIGEL TSME3200055 2-in-1 set gunmetal', 485],
 ['Basin taps ×2', 'RIGEL MXB721101 gunmetal (Heritage S$188 each)', 376],
 ['Bidet sprays ×2', 'RIGEL SA8200 gunmetal, valve included (S$195 each)', 390],
];
// Malaysia is fine for items that do not connect to the water supply (bring in, declare, pay 9% GST).
export const BATH_MY = [
 ['Vanities ×2 (basin + cabinet)', 'Must fit the wall widths measured on 3 Dec', 1249],
 ['Mirror cabinets ×2', 'No light, no power point needed', 798],
 ['Towel bar, roll holder, hook ×2', 'Compare the gunmetal shade with a RIGEL sample', 766],
];
export const bathSum = rows => rows.reduce((a, r) => a + r[2], 0);
// Malaysia prices checked 26 Nov 2026 (RIGEL Malaysia eStore rigel-estore.com, IKEA Malaysia), at RM3.17 = S$1.
// [item, RM, S$ equivalent, Singapore price, note]
export const BATH_JB = [
 ['Sorento towel bar SRT2408-GM gunmetal (Builders Hardware MY)', 115, 36, 169, 'RIGEL TB6908, SG'],
 ['Sorento paper holder SRT2403-GM gunmetal', 109, 34, 159, 'RIGEL PH9401T, SG'],
 ['Sorento robe hook SRT3364-5-GM gunmetal', 57, 18, 55, 'RIGEL RH6901, SG'],
 ['IKEA ENHET mirror cabinet with doors 60 × 75 cm', 375, 118, 170, 'IKEA SG, same cabinet'],
 ['RIGEL towel bar TB6908 gunmetal', 468, 148, 169, 'RIGEL eStore SG'],
 ['RIGEL roll holder PH9401T gunmetal', 492, 155, 159, 'RIGEL eStore SG'],
 ['RIGEL robe hook RH6901 gunmetal', 159, 50, 55, 'RIGEL eStore SG'],
 ['RIGEL mirror cabinet BC5628 gunmetal 60 cm', 1281, 404, 399, 'RIGEL eStore SG'],
 ['RIGEL vanity BC1260 dark brown, cabinet only (no basin top)', 1023, 323, 489, 'Heritage, with basin top'],
 ['IKEA ENHET mirror cabinet, 2 doors, 60 cm', 475, 150, 155, 'IKEA SG'],
 ['RIGEL basin tap MXB721101', 1080, 341, 188, 'Heritage, gunmetal'],
 ['RIGEL Quatré shower TSME2031 gunmetal', 2613, 824, 758, 'Heritage'],
];

export function bathroomsPage(v = {}, ro = false) {
 const row = ([what, pick, p]) => `<tr><td><b>${what}</b><small>${pick}</small></td><td>${sgd(p)}</td></tr>`;
 return `<section class="bath-page">
<header class="page-head"><p class="eyebrow">Both bathrooms · finish chosen 25 Nov: gunmetal</p><h1>Bathrooms</h1>
<p class="lead">Where to buy each piece, the shop quotes so far, and the guide for heights, toilets and finishes.</p></header>

<div class="bath-status">
<div><small>All in Singapore (eStore)</small><b>${sgd(cmpTarget())}</b><span>+ mirror cabinets ≈ S$800</span></div>
<div><small>Malaysia part (K, 26 Nov)</small><b>Saves ≈ S$600</b><span>accessories + mirror cabinets</span></div>
<div><small>Next step</small><b>Measure 3 Dec</b><span>toilet setting-out, basin walls</span></div>
</div>

<section class="bath-card" id="split"><h2>Buy where: the split plan</h2>
<p class="muted"><b>K's plan (26 Nov):</b> buy the toilets, shower sets, bidet sprays and basin mixers in Singapore (all need PUB WELS), and the vanity/basin, mirror cabinets, towel bars, roll holders and hooks from a real brand in Johor Bahru. Checked 26 Nov: the same RIGEL items are <b>not</b> cheaper in Malaysia, but a Malaysian brand (Sorento) and IKEA Malaysia are.</p>
<div class="bath-cols">
<div><h3>Singapore: connects to water</h3><p class="muted">Taps, toilets, showers and bidet sprays need PUB WELS approval; a bidet spray next to a toilet also needs a check valve (SS 636).</p>
<table class="bath-table"><tbody>${BATH_SG.map(row).join('')}<tr class="bath-total"><td>Total</td><td>${sgd(bathSum(BATH_SG))}</td></tr></tbody></table></div>
<div><h3>Malaysia: no water connection</h3><p class="muted">Singapore value shown (RIGEL prices). A Sorento gunmetal set (towel bar + roll holder + hook) is about S$88 per bathroom against S$383 for RIGEL.</p>
<table class="bath-table"><tbody>${BATH_MY.map(row).join('')}<tr class="bath-total"><td>Singapore value</td><td>${sgd(bathSum(BATH_MY))}</td></tr></tbody></table></div>
</div>
<h3>Johor Bahru prices (checked 26 Nov)</h3>
<p class="muted">RIGEL Malaysia eStore and IKEA Malaysia, at RM3.17 = S$1, before the 9% GST owed at the checkpoint.</p>
<table class="bath-table bath-jb"><tbody>${BATH_JB.map(([n, rm, s1, sg, where]) => `<tr><td><b>${n}</b><small>RM${rm.toLocaleString('en-SG')} ≈ ${sgd(s1)} · Singapore ${sgd(sg)} (${where})</small></td><td class="${s1 < sg ? 'jb-lower' : 'jb-higher'}">${s1 < sg ? '−' + sgd(sg - s1) : '+' + sgd(s1 - sg)}</td></tr>`).join('')}</tbody></table>
<ul class="bath-notes"><li><b>Accessories:</b> Sorento (Malaysian brand since 2005, sold in hardware shops and Big Bath) gunmetal pieces are stainless steel 304 with a gunmetal coating, at about a quarter of the RIGEL price. Two bathrooms save about S$590. Ask in the shop whether the coating is PVD (hard, does not peel) or paint, and hold a piece next to the RIGEL tap: the shades will not be identical.</li>
<li><b>Mirror cabinets:</b> IKEA ENHET with doors is RM375 in Johor Bahru against S$170 in Singapore: about S$50 less each (10-year IKEA guarantee).</li>
<li><b>Vanities:</b> no clear saving found yet. RIGEL Malaysia sells the cabinet without the basin top; IKEA ENHET/TVÄLLEN 64 cm is about the same price on both sides (and too wide for the 60 cm master wall). Ask Sorento or Johnson Suisse dealers in JB for a 60 cm and a 70 cm wall-hung PVC cabinet with basin after measuring on 3 Dec; compare with Heritage's S$489 RIGEL set.</li>
<li><b>Unbranded sets</b> (aluminium or PVC cabinets around RM400 on Lazada) fail the real-brand rule.</li>
<li><b>Customs:</b> a day trip (under 48 hours) only gets S$100 GST relief. Declare the full value and pay 9% GST on the rest; not declaring can cost about 10× the GST.</li>
<li><b>Not from Malaysia:</b> the ceiling fan with light (wired in, needs the Singapore Safety Mark), and basin taps (WELS).</li>
<li><b>Still open:</b> Heritage written quote (toilets, showers, bidets, 2 basin mixers) valid to mid-Dec; vanity source after measuring.</li></ul>
</section>

${comparePage(v, ro)}

<section class="bath-card bath-guide" id="bathroom-guide"><h2>Bathroom guide</h2><p class="muted">Research 24 Nov, updated 26 Nov for gunmetal. One pick per question, reasons underneath.</p>
<details><summary>Buying: choose now, pay after measuring</summary>
<p>The toilet must match the floor pipe position (setting-out), measured on <b>3 Dec</b>. Get a written package quote valid to mid-December. Pay a deposit only if it is refundable or allows model and size changes, written on the receipt.</p>
<p>Ask John (I-Niche) <b>which day the plumber needs the fittings on site</b>. That date is the real buying deadline.</p></details>
<details><summary>Toilet: one-piece, rimless, floor-standing</summary>${svgToilets}
<ul><li><b>One-piece</b> (pick): no seam between tank and bowl where grime collects. RIGEL Gallant 9030FA: 65 × 37 × 75 cm, 4 L / 3 L flush, S-trap 75–250 mm or P-trap 180 mm (RIGEL Centre tag). eStore S$525, Shopee RIGEL official S$554.</li>
<li><b>Heritage's quote: GROHE Bau Ceramic 39997000</b> at S$639 each (other shops list it at S$799): rimless one-piece, 72 × 37.2 cm, 4.5 / 3 L flush, S-trap 125–250 mm only (no P-trap), soft-close seat, Heritage gives 5 years on-site warranty. Against the Gallant: S$114 more per toilet and 7 cm longer (less knee room in the bathroom). Pick: the <b>Gallant</b> (the family is leaning to it, 26 Nov) unless Heritage matches its price; the GROHE is a fine second choice.</li>
<li><b>Two-piece</b>: cheaper (Gallant R-WC9030F S$380) but the joint needs scrubbing and can leak.</li>
<li><b>Wall-hung</b>: needs a concealed tank in a new wall frame (S$885+, more hacking). Not worth it here.</li>
<li><b>Quick-release soft-close seat</b>: lifts off to clean. Bowl about 40–43 cm high: KS (190) on a taller bowl, KX (150) feet flat. Sit test in the shop.</li></ul></details>
<details><summary>Bidet: hand spray in both bathrooms</summary>
<ul><li><b>Hand spray</b> (pick): RIGEL SA8200 gunmetal S$195 with the valve. Heritage quoted a non-RIGEL spray (PBS-414P-GM, rubber hose) at S$56 + S$34 angle valve: cheaper, but a rubber hose wears faster than steel and the shade may not match.</li>
<li><b>Manual bidet seat</b> for the 9030 (FT-SCBD0104PS, S$170): optional, can be added later. No power needed.</li>
<li><b>Electric washlet</b>: family says maybe; a manual bidet seat is also still being considered. Ask John to price a waterproof socket behind each toilet now: cheap during the renovation, messy to add later.</li></ul></details>
<details><summary>Finish: gunmetal, all from RIGEL</summary>${svgFinish}
<ul><li>Chosen 25 Nov. Keep every visible metal piece in a bathroom from <b>one brand and series</b>: shades differ between brands.</li>
<li>Ask RIGEL: is the gunmetal <b>PVD</b> (hard, does not peel)? How many years on the finish? Painted dark taps chip in wet areas.</li>
<li>Clean with mild soap and a microfibre cloth. No abrasive pads, cream cleansers or acid descalers.</li></ul></details>
<details><summary>Heights for KX 150, KY 165, KS 190</summary>${svgHeights}
<ul><li><b>Common basin rim: 88–90 cm</b> (KY 165 and KS 190). <b>Master basin rim: 80 cm</b> (KX 150). Both vanities are wall-hung: tell I-Niche the heights before plumbing.</li>
<li><b>Shower:</b> mixer 105–110 cm common, about 100 cm master. Rain head at least 210 cm common, 195–200 cm master (check the ceiling on 3 Dec).</li>
<li>Mirror centre about 155 cm common, 145 cm master. Towel bar about 115 cm. Roll holder about 65 cm high.</li></ul></details>
<details><summary>Budget</summary>
<p>Gunmetal at RIGEL eStore prices: <b>${sgd(cmpTarget())}</b> for both bathrooms, plus mirror cabinets about S$800, so S$5,100–5,900 if all bought in Singapore (chrome would be about S$1,000 less). The split plan keeps about ${sgd(bathSum(BATH_SG))} in Singapore. Heritage's 25 Nov quote: S$3,651 for its lines (fan not included); install fees on the note: toilet S$130, shower S$80, cabinet S$120 each (check what the I-Niche plumbing line C1 already covers).</p></details>
<details><summary>What Singapore owners regret</summary>
<ul><li><b>Waterproofing skipped</b>: the I-Niche quote has none for the new half-height wall (F4). Ask for it and a 24-hour ponding test before tiling.</li>
<li><b>Glass screens</b> need wiping after every shower: squeegee in each bathroom; ask about a nano coating.</li>
<li><b>Dark basin tops</b> show white water marks: check the R-BC1260 top in person.</li>
<li><b>Too little storage</b>: count hooks for 3 adults; vanity drawers, a niche.</li>
<li><b>Power points</b> for a lit mirror or washlet decided too late.</li>
<li><b>Ventilation</b>: the fan is in the common bathroom only; check the master bathroom window is enough.</li>
<li><b>Cheap black taps peeling</b>; <b>slippery tiles</b> when wet.</li></ul></details>
<p class="muted bath-sources">Sources: RIGEL eStore and Experience Centre tags, Heritage Bathroom Gallery quote (25 Nov), Shopee RIGEL official, Gain City, Lazada; PUB WELS and SS 636; Singapore Customs GST relief rules; Geberit and Roca height guides; Singapore owner stories (Hometrust, Renodots, Qanvast). Prices change: confirm in the shop.</p>
</section>
</section>`;
}
