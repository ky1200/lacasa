// Shared section navigation for long pages (/buy, /research).
// Each section: <section data-sec data-sec-name="..."> with a <details> inside whose <summary>
// sticks to the top while scrolling. Tap the header (or long-press anywhere in the section)
// to close it; the page then lands on the next section. The dock at the bottom lists every
// section to jump to, with Close all / Open all. Logic lives in public/showcase.js.
const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

// Attributes for a section element.
export const secAttrs = (name, colour) => `data-sec data-sec-name="${h(name)}"${colour ? ` style="--rc:${colour}"` : ''}`;

// Button at the end of an open section.
export const secClose = name => `<button type="button" class="sec-close" data-sec-close>Close ${h(name)} <span aria-hidden="true">▲</span></button>`;

// groups: [{title, links: [{href, name, meta, colour, sum}]}]. extra: buttons placed before the menu.
export function dock(groups, extra = '') {
 const link = l => `<li><a href="${h(l.href)}" data-dock-link="${h(l.href.slice(1))}"${l.colour ? ` style="--rc:${l.colour}"` : ''}${l.sum ? ` data-sum="${h(l.sum)}"` : ''}><i class="dot"></i><span class="dock-name">${h(l.name)}</span>${l.meta != null ? `<strong class="dock-meta">${h(l.meta)}</strong>` : ''}${l.sum ? '<i class="bar" hidden></i>' : ''}</a></li>`;
 return `<nav class="dock" data-dock aria-label="Sections on this page">
<details class="dock-menu"><summary><i class="dot" data-dock-dot></i><span class="dock-current" data-dock-name>Sections</span><span class="dock-caret" aria-hidden="true">▴</span></summary>
<div class="dock-sheet"><div class="dock-tools"><button type="button" data-sec-all="close">Close all</button><button type="button" data-sec-all="open">Open all</button></div>
${groups.map(g => `${g.title ? `<p class="dock-group">${h(g.title)}</p>` : ''}<ul>${g.links.map(link).join('')}</ul>`).join('')}</div></details>
${extra}<a class="dock-btn dock-top" href="#main" data-dock-top aria-label="Back to top">↑</a></nav>`;
}
