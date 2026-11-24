// /look: colours and look mood board. Data in look-data.mjs; saving in public/showcase.js ([data-look-page]).
import {LOOK, FIXED, lookChoice} from './look-data.mjs';
import {secAttrs, secClose, dock} from './sections.mjs';

const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const glass = {fluted: 'repeating-linear-gradient(90deg,#e8eef0 0 5px,#c9d3d6 5px 8px)', clear: 'linear-gradient(135deg,#eef4f6,#dfe9ec)', frosted: '#e4e7e7'};
// Swatch widths: main colour wide, handles/frames narrow; palettes equal.
const flex = (id, j) => ['direction', 'cushions', 'curtains'].includes(id) ? 1 : id === 'doors' ? (j ? 2 : 3) : id === 'kitchen-door' ? (j ? 4 : 1) : (j ? 1 : 4);
const PAL = {walls: 'walls', sofa: 'sofa', curtains: 'curtains', cushions: 'accent', doors: 'doors'};
const chip = c => `<i class="look-chip" style="background:${glass[c] ?? h(c)}"></i>`;
const chips = sw => sw?.length ? `<span class="look-chips">${sw.map(chip).join('')}</span>` : '';

// The palette strip: proportions roughly like the room (walls and floor most, accents least).
export function palette(v = {}) {
 const b = id => LOOK.boards.find(x => x.id === id), pick = id => b(id).options[lookChoice(b(id), v)];
 const blocks = [
  ['Walls', pick('walls').sw[0], 26, pick('walls').name.replace(/^Nippon /, '').replace(/ \(.*\)$/, '')],
  ['Floor', '#e2d6c6', 22, 'Cream tiles'],
  ['Sofa', pick('sofa').sw[0], 18, pick('sofa').name.replace(/^\d+ /, '')],
  ['Curtains', pick('curtains').sw[0], 12, pick('curtains').name.split(' + ')[0].replace(/ day curtain$/, '')],
  ['Dining', '#5b3a29', 10, 'Walnut LINO'],
  ['Doors', pick('doors').sw[0], 6, pick('doors').short],
  ['Accent', pick('cushions').sw.at(-1), 10, pick('cushions').name.split(' + ').at(-1).replace(/^one /, '')],
 ];
 return `<div class="look-palette" data-look-palette>${blocks.map(([k, c, w]) => `<span data-pal="${k.toLowerCase()}" style="flex:${w};background:${h(c)}" title="${h(k)}"></span>`).join('')}</div><ul class="look-legend">${blocks.map(([k, c, , n]) => `<li><i data-pal-dot="${k.toLowerCase()}" style="background:${h(c)}"></i><b>${h(k)}</b> <span data-pal-name="${k.toLowerCase()}">${h(n)}</span></li>`).join('')}</ul>`;
}

function board(b, v, ro) {
 const cur = lookChoice(b, v), key = `l:${b.id}`, fam = v[key] != null && v[key] !== '';
 const name = b.title.replace(/ \(.*\)$/, '');
 const cards = b.options.map((o, i) => `<label class="look-opt${i === cur ? ' is-on' : ''}"${o.short ? ` data-short="${h(o.short)}"` : ''}${o.sw?.[0] ? ` data-sw="${h(o.sw[0])}"` : ''} data-sw-all="${h((o.sw || []).join(' '))}">
<input type="radio" name="${h(key)}" value="${i}" data-look="${h(key)}"${i === cur ? ' checked' : ''}${ro ? ' disabled' : ''}>
${o.img ? `<span class="look-img"><img src="${h(o.img)}" alt="${h(o.name)}" loading="lazy">${o.ex ? '<em>Example</em>' : ''}</span>` : `<span class="look-swatch">${(o.sw || []).map((c, j) => `<i style="flex:${flex(b.id, j)};background:${glass[c] ?? h(c)}"></i>`).join('')}</span>`}
<span class="look-txt"><b>${h(o.name)}</b>${i === b.rec ? '<span class="look-rec">Our pick</span>' : ''}<small>${h(o.note)}</small>${o.img ? chips(o.sw) : ''}</span></label>`).join('');
 return `<section class="buy-block buy-panel buy-fold look-board" id="look-${h(b.id)}" data-look-board="${h(key)}" data-rec="${b.rec}"${PAL[b.id] ? ` data-pal-to="${PAL[b.id]}"` : ''} ${secAttrs(name)}><details><summary><h2>${h(b.title)} <small class="buy-fold-meta"><span data-look-cur="${h(key)}">${h(b.options[cur].name)}</span> · <span data-look-who="${h(key)}">${fam ? 'family choice' : 'our pick'}</span></small></h2><span class="buy-fold-caret" aria-hidden="true"></span></summary>
<div class="buy-fold-body"><p class="look-why"><b>Why our pick:</b> ${h(b.why)}</p>${b.note ? `<p class="muted look-note">${h(b.note)}</p>` : ''}
<div class="look-grid">${cards}</div>${!ro ? `<button type="button" class="look-reset" data-look-reset="${h(key)}"${fam ? '' : ' hidden'}>Back to our pick</button>` : ''}${secClose(name)}</div></details></section>`;
}

export function lookPage(v = {}, ro = false) {
 const groups = [...new Set(LOOK.boards.map(b => b.room))].map(room => ({title: room, links: LOOK.boards.filter(b => b.room === room).map(b => ({href: `#look-${b.id}`, name: b.title.replace(/ \(.*\)$/, ''), meta: b.options[lookChoice(b, v)].name.replace(/^Nippon /, '').replace(/ \(.*\)$/, '').split(' + ')[0]}))}));
 return `<div class="look-page" data-look-page${ro ? ' data-ro' : ''}>
<header class="page-top look-top"><span class="eyebrow">Sofa, walls, curtains, floors · updated ${h(LOOK.updated)}</span><h1>Mood board</h1>
<p>Our pick is marked on each board. Tap another option to choose it for the family: choices are saved and shared. Screen colours are approximate, so always check the real sample in daylight.</p></header>
<section class="look-hero">
<figure class="look-insp"><img src="${h(LOOK.inspiration.img)}" alt="Inspiration living room" loading="eager"><figcaption>${h(LOOK.inspiration.note)}</figcaption></figure>
<div class="look-side"><h2>Living and dining palette</h2>${palette(v)}<p class="muted look-changes">Changes as you choose below.</p>
<ul class="look-fixed">${FIXED.map(f => `<li>${f.img ? `<img src="${h(f.img)}" alt="" loading="lazy">` : `<span class="look-dot" style="background:${h(f.sw[0])}"></span>`}<span><b>${h(f.name)}</b><small>${h(f.note)}</small></span></li>`).join('')}</ul></div>
</section>
<div class="look-boards">${LOOK.boards.map(b => board(b, v, ro)).join('')}</div>
<div class="vote-feedback" role="status" aria-live="polite" data-look-status></div>
${dock(groups)}
</div>`;
}
