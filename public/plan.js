// LaCasa floor plan (/plan): to-scale plan, draggable furniture, light/socket points,
// Wi-Fi coverage estimate and a panel with the to-buy choices and research for each item.
// All sizes are millimetres. Data comes from <script id="plan-data"> (showcase/plan.mjs).
(() => {
'use strict';
const root = document.querySelector('[data-plan-page]');
if (!root || root.dataset.ready) return;
root.dataset.ready = '1';
const D = JSON.parse(root.querySelector('#plan-data').textContent);
const NS = 'http://www.w3.org/2000/svg';
const svg = root.querySelector('[data-plan-svg]'), stage = root.querySelector('[data-plan-stage]');
const phone = () => matchMedia('(max-width: 640px)').matches;
const sheet = root.querySelector('[data-sheet]'), statusEl = root.querySelector('[data-plan-status]'), readout = root.querySelector('[data-readout]');
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const mk = (tag, attrs = {}, parent) => {const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) if (v != null) e.setAttribute(k, v); if (parent) parent.append(e); return e;};
const cm = mm => (Math.round(mm / 10 * 10) / 10).toLocaleString('en-SG');
const sgd = n => 'S$' + Math.round(n).toLocaleString('en-SG');
const say = t => {if (statusEl) statusEl.textContent = t;};

// ---------- state ----------
const items = D.items.map(i => ({...i}));
const points = Object.fromEntries(Object.entries(D.points).map(([k, v]) => [k, v.map(p => [...p])]));
const layers = new Set([...root.querySelectorAll('[data-layer]')].filter(c => c.checked).map(c => c.dataset.layer));
let tapeOn = false, tape = [], band = '5', moveOn = false, addType = '', selected = null, view = {x: 0, y: 0, w: D.W, h: D.H};
const typeName = Object.fromEntries(D.pointTypes.map(t => [t.id, t.name]));
const typeLayer = Object.fromEntries(D.pointTypes.map(t => [t.id, t.layer]));
const roomById = Object.fromEntries(D.rooms.map(r => [r.id, r]));

// ---------- saving (same table as /buy, via /api/plan and /api/buy) ----------
const LS = 'lacasa-plan-pending';
const pending = () => {try {return JSON.parse(localStorage.getItem(LS) || '{}');} catch {return {};}};
const keep = p => {try {localStorage.setItem(LS, JSON.stringify(p));} catch {}};
let flushing = false, timer = null;
const put = async (path, value) => {
 const r = await fetch(path, {method: 'PUT', credentials: 'same-origin', cache: 'no-store', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({value})});
 if (!r.ok) {let m = 'Not saved yet'; try {m = (await r.json()).error || m;} catch {} const e = new Error(m); e.status = r.status; throw e;}
};
const flush = async () => {
 if (flushing || D.ro) return; const p = pending(), keys = Object.keys(p); if (!keys.length) return;
 flushing = true; say('Saving…'); let failed = 0, msg = '';
 for (const k of keys) {
  try {await put((k.startsWith('b:') ? '/api/buy/' : '/api/plan/') + encodeURIComponent(k), p[k]); const now = pending(); if (now[k] === p[k]) {delete now[k]; keep(now);}}
  catch (e) {failed++; msg = e.message; if (e.status === 422) {const now = pending(); delete now[k]; keep(now);}}
 }
 flushing = false; globalThis.__lacasaNav?.clear?.();
 say(failed ? (navigator.onLine === false ? 'Offline: kept on this phone' : msg) : 'Saved');
};
const save = (key, value) => {if (D.ro) return; const p = pending(); p[key] = value; keep(p); say('Saving…'); clearTimeout(timer); timer = setTimeout(flush, 400);};
const P = D.prefix || 'p:';
const saveItem = it => save(`${P}i:${it.id}`, `${Math.round(it.x)},${Math.round(it.y)},${it.r},${it.c ? `c${it.c.w}x${it.c.d}` : it.s}${it.add ? `,${it.on ? 1 : 0}` : ''}`);
const savePoints = t => save(`${P}pts:${t}`, points[t].length ? points[t].map(p => p.map(Math.round).join(',')).join(';') : 'none');
// Apply anything not yet uploaded from this phone.
for (const [k0, v] of Object.entries(pending())) {
 // Only this layout's keys change what is drawn; other layouts' keys still upload.
 const own = k0.startsWith(P) && !(P === 'p:' && /^p:(ky|kx|ks):/.test(k0)), k = own ? 'p:' + k0.slice(P.length) : k0;
 if (/^p:/.test(k0) && !own) continue;
 if (k.startsWith('p:i:')) {const it = items.find(i => i.id === k.slice(4)), m = /^(-?\d+),(-?\d+),(\d+),(\d|c(\d+)x(\d+))(,([01]))?$/.exec(v); if (it && m) Object.assign(it, {x: +m[1], y: +m[2], r: +m[3]}, m[5] ? {c: {w: +m[5], d: +m[6]}} : {s: +m[4], c: null}, m[8] && it.add ? {on: m[8] === '1'} : {});}
 else if (k.startsWith('p:pts:') && points[k.slice(6)]) points[k.slice(6)] = v === 'none' ? [] : v.split(';').map(p => p.split(',').map(Number));
 else if (k.startsWith('b:') && k.endsWith(':pick')) {const b = D.buy[k.slice(2, -5)]; if (b) b.pick = Number(v) || 0;}
}
setInterval(() => {if (Object.keys(pending()).length) flush();}, 15000);
addEventListener('online', flush);
if (Object.keys(pending()).length) flush();

// ---------- geometry ----------
const sizeOf = it => {const s = it.c ? {...(it.sizes[0]), n: 'Custom', w: it.c.w, d: it.c.d, custom: true} : it.sizes[it.s] ?? it.sizes[0], rot = it.r % 180 !== 0; return {w: rot ? s.d : s.w, d: rot ? s.w : s.d, s};};
const boxOf = it => {const {w, d} = sizeOf(it); return {x1: it.x - w / 2, y1: it.y - d / 2, x2: it.x + w / 2, y2: it.y + d / 2};};
const inBox = (x, y, b) => x >= b[0] && x <= b[0] + b[2] && y >= b[1] && y <= b[1] + b[3];
// Footprint box of an item (the V Haus sofa is straight, so every item is one box).
const boxesOf = it => [boxOf(it)];
const roomAt = (x, y) => D.rooms.find(r => r.boxes.some(b => inBox(x, y, b)));
const toPlan = e => {const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const m = svg.getScreenCTM(); return m ? pt.matrixTransform(m.inverse()) : {x: 0, y: 0};};
const segCross = (ax, ay, bx, by, cx, cy, dx, dy) => {
 const d = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx); if (!d) return false;
 const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / d, u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / d;
 return t > 0 && t < 1 && u > 0 && u < 1;
};

// ---------- Wi-Fi estimate ----------
// signal (dBm) = power − free-space loss(distance, frequency) − sum of wall losses on the straight path.
const nodes = () => items.filter(i => i.wifi && !i.s);
const signal = (x, y, n, b) => {
 const d = Math.max(1, Math.hypot(x - n.x, y - n.y) / 1000); // metres, at least 1 m
 let loss = 20 * Math.log10(d) + 20 * Math.log10(b.mhz) - 27.55, walls = 0;
 for (const w of D.walls) if (segCross(n.x, n.y, x, y, w[0], w[1], w[2], w[3])) {loss += b.loss[w[4]] ?? 10; walls++;}
 return {dbm: b.dbm - loss, walls};
};
const best = (x, y) => {const b = D.wifi.bands[band]; let top = null; for (const n of nodes()) {const s = signal(x, y, n, b); if (!top || s.dbm > top.dbm) top = {...s, n};} return top;};
const level = dbm => D.wifi.levels.find(l => dbm >= l.min) ?? D.wifi.levels.at(-1);
const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
let heatImg = null, heatQueued = false;
const drawHeat = (cell = 100) => {
 if (!layers.has('wifi')) {if (heatImg) heatImg.setAttribute('href', ''); return;}
 const cols = Math.ceil(D.W / cell), rows = Math.ceil(D.H / cell), cv = document.createElement('canvas');
 cv.width = cols; cv.height = rows; const ctx = cv.getContext('2d'), img = ctx.createImageData(cols, rows);
 for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
  const x = (i + .5) * cell, y = (j + .5) * cell, r = roomAt(x, y); if (!r) continue;
  const s = best(x, y); if (!s) continue; const [R, G, B] = hex(level(s.dbm).colour), o = (j * cols + i) * 4;
  img.data[o] = R; img.data[o + 1] = G; img.data[o + 2] = B; img.data[o + 3] = 120;
 }
 ctx.putImageData(img, 0, 0);
 heatImg.setAttribute('href', cv.toDataURL());
};
const queueHeat = () => {if (heatQueued) return; heatQueued = true; requestAnimationFrame(() => {heatQueued = false; drawHeat(dragging ? 250 : 100);});};

// ---------- drawing ----------
// Defs: warm light pool. A 1 m grid sits under the drawing like drafting paper.
const defs = mk('defs', {}, svg);
const rg = mk('radialGradient', {id: 'plan-glow'}, defs);
mk('stop', {offset: '0', 'stop-color': '#ffd27a', 'stop-opacity': '.95'}, rg); mk('stop', {offset: '.45', 'stop-color': '#ffc04d', 'stop-opacity': '.35'}, rg); mk('stop', {offset: '1', 'stop-color': '#ffb02e', 'stop-opacity': '0'}, rg);
const ag = mk('radialGradient', {id: 'plan-air'}, defs);
mk('stop', {offset: '0', 'stop-color': '#5fb4d9', 'stop-opacity': '.34'}, ag); mk('stop', {offset: '.35', 'stop-color': '#5fb4d9', 'stop-opacity': '.2'}, ag); mk('stop', {offset: '1', 'stop-color': '#5fb4d9', 'stop-opacity': '0'}, ag);
const mkr = mk('marker', {id: 'plan-arrow', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 5, markerHeight: 5, orient: 'auto-start-reverse'}, defs);
mk('path', {d: 'M0,0L10,5L0,10z', fill: '#2f86ad'}, mkr);
const gGrid = mk('g', {class: 'plan-grid'});
svg.insertBefore(gGrid, svg.querySelector('.plan-bg'));
for (let x = 0; x <= D.W; x += 1000) mk('line', {x1: x, y1: 0, x2: x, y2: D.H, 'vector-effect': 'non-scaling-stroke'}, gGrid);
for (let y = 0; y <= D.H; y += 1000) mk('line', {x1: 0, y1: y, x2: D.W, y2: y, 'vector-effect': 'non-scaling-stroke'}, gGrid);
const gHeat = mk('g', {class: 'plan-heat'}, svg);
heatImg = mk('image', {x: 0, y: 0, width: D.W, height: D.H, preserveAspectRatio: 'none', class: 'plan-heat-img'}, gHeat);
const gRooms = mk('g', {class: 'plan-roomlabels'}, svg);
const gLinks = mk('g', {class: 'plan-links'}, svg);
const gAir = mk('g', {class: 'plan-air'}, svg);
const gItems = mk('g', {class: 'plan-items'}, svg);
const gPts = mk('g', {class: 'plan-points'}, svg);
const gTv = mk('g', {class: 'plan-tv'}, svg);
const gMeasure = mk('g', {class: 'plan-measure'}, svg);
const gLabels = mk('g', {class: 'plan-labels'}, svg);
const gTape = mk('g', {class: 'plan-tape'}, svg);


const shape = (it, g) => {
 const {s} = sizeOf(it), w = s.w, d = s.d, x = -w / 2, y = -d / 2, ns = {'vector-effect': 'non-scaling-stroke'};
 if (it.kind === 'bed') {
  mk('rect', {x: x - 50, y: y - 50, width: w + 100, height: d + 100, rx: 40, class: 'frame', ...ns}, g);
  mk('rect', {x, y, width: w, height: d, rx: 60, class: 'body', ...ns}, g);
  const pw = w > 1300 ? (w - 180) / 2 : w - 120;
  mk('rect', {x: x + 60, y: y + 70, width: pw, height: 380, rx: 80, class: 'pillow', ...ns}, g);
  if (w > 1300) mk('rect', {x: x + 120 + pw, y: y + 70, width: pw, height: 380, rx: 80, class: 'pillow', ...ns}, g);
  mk('line', {x1: x, y1: y + 620, x2: x + w, y2: y + 620, class: 'fold', ...ns}, g);
 } else if (it.kind === 'sofa') {
  // Straight sofa (V Haus 2233A): backrest along the top, one armrest on the right end, open cushioned end on the left.
  const back = 220, arm = 230, seats = 5, sw = (w - arm) / seats;
  const f = s.flip ? mk('g', {transform: 'scale(-1 1)'}, g) : g; // open end on the other side
  mk('rect', {x, y, width: w, height: d, rx: 60, class: 'body', ...ns}, f);
  mk('rect', {x: x + sw, y, width: w - arm - sw, height: back, rx: 40, class: 'back', ...ns}, f);
  mk('rect', {x: x + w - arm, y, width: arm, height: d, rx: 60, class: 'back', ...ns}, f);
  for (let k = 1; k < seats; k++) mk('line', {x1: x + k * sw, y1: y + back, x2: x + k * sw, y2: y + d - 40, class: 'fold', ...ns}, f);
 } else if (it.kind === 'ctable') {
  if (s.round) mk('circle', {cx: 0, cy: 0, r: w / 2, class: 'body', ...ns}, g);
  else {mk('rect', {x, y, width: w, height: d, rx: 30, class: 'body', ...ns}, g); mk('rect', {x: x + 60, y: y + 60, width: w - 120, height: d - 120, rx: 20, class: 'fold', fill: 'none', ...ns}, g);}
 } else if (it.kind === 'tv') {
  mk('rect', {x, y, width: w, height: Math.max(d, 60), rx: 10, class: 'tv', ...ns}, g);
 } else if (it.kind === 'table') {
  const c = 430; // TOMAMO chair 43 × 43 cm
  for (const cx of [x + w * .25 - c / 2, x + w * .75 - c / 2]) for (const cy of [y - c - 80, y + d + 80]) mk('rect', {x: cx, y: cy, width: c, height: c, rx: 60, class: 'chair', ...ns}, g);
  mk('rect', {x, y, width: w, height: d, rx: 30, class: 'body', ...ns}, g);
 } else if (it.kind === 'desk') {
  mk('rect', {x, y, width: w, height: d, rx: 20, class: 'body', ...ns}, g);
  mk('line', {x1: x + 40, y1: y + d - 60, x2: x + w - 40, y2: y + d - 60, class: 'fold', ...ns}, g);
 } else if (it.kind === 'chair') {
  // Office chair from above: wheel base, seat, backrest (back is at the top).
  const r = Math.min(w, d) / 2;
  mk('circle', {cx: 0, cy: 0, r, class: 'base', ...ns}, g);
  for (let a = 0; a < 5; a++) {const t = a * 2 * Math.PI / 5 - Math.PI / 2; mk('line', {x1: 0, y1: 0, x2: Math.cos(t) * r * .92, y2: Math.sin(t) * r * .92, class: 'spoke', ...ns}, g);}
  mk('rect', {x: -r * .78, y: -r * .62, width: r * 1.56, height: r * 1.4, rx: r * .3, class: 'body', ...ns}, g);
  mk('rect', {x: -r * .72, y: -r * .9, width: r * 1.44, height: r * .32, rx: r * .14, class: 'back', ...ns}, g);
 } else if (it.kind === 'recliner') {
  // Armchair from above, back at the top; dashed footrest shows the reclined reach (about 60 cm).
  mk('rect', {x: x + w * .2, y: y + d, width: w * .6, height: 600, rx: 60, class: 'swing', ...ns}, g);
  mk('rect', {x, y, width: w, height: d, rx: 140, class: 'body', ...ns}, g);
  mk('rect', {x: x + 60, y: y + 50, width: w - 120, height: d * .28, rx: 90, class: 'back', ...ns}, g);
  mk('rect', {x: x + 50, y: y + d * .3, width: w * .16, height: d * .64, rx: 60, class: 'back', ...ns}, g);
  mk('rect', {x: x + w * .84 - 50, y: y + d * .3, width: w * .16, height: d * .64, rx: 60, class: 'back', ...ns}, g);
 } else if (it.kind === 'mjtable') {
  // Square table with a chair on each side, all inside the w × d footprint.
  const t = Math.min(s.t ?? 800, w, d), c = Math.min(450, (w - t) / 2 - 20);
  if (c > 120) {for (const [cx, cy] of [[-c / 2, y + 10], [-c / 2, -y - 10 - c], [x + 10, -c / 2], [-x - 10 - c, -c / 2]]) mk('rect', {x: cx, y: cy, width: c, height: c, rx: 60, class: 'chair', ...ns}, g);}
  mk('rect', {x: -t / 2, y: -t / 2, width: t, height: t, rx: 20, class: 'body', ...ns}, g);
  mk('rect', {x: -t / 2 + 70, y: -t / 2 + 70, width: t - 140, height: t - 140, rx: 10, class: 'fold', fill: 'none', ...ns}, g);
 } else if (it.kind === 'stool') {
  mk('rect', {x, y, width: w, height: d, rx: Math.min(w, d) * .3, class: 'body', ...ns}, g);
 } else if (it.kind === 'wardrobe') {
  // Front (doors) is the bottom edge before turning; the arc shows the door swing.
  mk('rect', {x, y, width: w, height: d, rx: 10, class: 'body', ...ns}, g);
  mk('line', {x1: x, y1: y + 70, x2: x + w, y2: y + 70, class: 'fold', ...ns}, g);
  const doors = w > 900 ? 3 : w > 600 ? 2 : 1, dw = w / doors;
  for (let k = 0; k < doors; k++) mk('path', {d: `M${x + k * dw},${y + d}L${x + k * dw},${y + d + dw}A${dw},${dw} 0 0 0 ${x + (k + 1) * dw},${y + d}`, class: 'swing', ...ns}, g);
 } else if (it.kind === 'lwardrobe') {
  // L shape: leg along the top (w long) and down the left side (d long), t deep.
  const t = s.t ?? 600;
  mk('path', {d: `M${x},${y}H${x + w}V${y + t}H${x + t}V${y + d}H${x}Z`, class: 'body', ...ns}, g);
  mk('path', {d: `M${x + 70},${y + d}V${y + 70}H${x + w}`, class: 'fold', fill: 'none', ...ns}, g);
 } else if (it.kind === 'fridge') {
  mk('rect', {x, y, width: w, height: d, rx: 20, class: 'appliance', ...ns}, g);
  mk('line', {x1: x, y1: y + d - 60, x2: x + w, y2: y + d - 60, class: 'fold', ...ns}, g);
  mk('path', {d: `M${x},${y + d}A${w},${w} 0 0 0 ${x + w},${y + d + w}`, class: 'swing', ...ns}, g);
 } else if (it.kind === 'dispenser') {
  mk('rect', {x, y, width: w, height: d, rx: 20, class: 'appliance', ...ns}, g);
  mk('circle', {cx: 0, cy: y + d - 90, r: 28, class: 'dot'}, g);
 } else if (it.kind === 'cfan') {
  mk('circle', {cx: 0, cy: 0, r: w / 2, class: 'fanring', ...ns}, g);
  for (let a = 0; a < 3; a++) {const t = a * 2 * Math.PI / 3; mk('ellipse', {cx: Math.cos(t) * w * .22, cy: Math.sin(t) * w * .22, rx: w * .2, ry: w * .08, transform: `rotate(${t * 180 / Math.PI} ${Math.cos(t) * w * .22} ${Math.sin(t) * w * .22})`, class: 'blade'}, g);}
 } else if (it.kind === 'dock') {
  mk('rect', {x, y, width: w, height: d, rx: 40, class: 'dock', ...ns}, g);
 } else if (it.kind === 'wifi') {
  mk('circle', {cx: 0, cy: 0, r: 230, class: 'wifi', ...ns}, g);
  for (const rr of [90, 150]) mk('path', {d: `M${-rr * .7},${-rr * .25}A${rr},${rr} 0 0 1 ${rr * .7},${-rr * .25}`, class: 'wave', ...ns}, g);
  mk('circle', {cx: 0, cy: 40, r: 30, class: 'dot'}, g);
 }
};
const layerOfItem = it => it.on === false ? 'none' : it.wifi ? 'net' : 'furniture';
// Does an item run into another one or through a wall? (chairs and stools may tuck under desks; fans hang high)
const SOFT = new Set(['chair', 'stool', 'cfan', 'wifi']);
const clashes = it => {
 if (SOFT.has(it.kind)) return [];
 const pad = 15, out = [], hit = (a, b) => a.x1 + pad < b.x2 && a.x2 - pad > b.x1 && a.y1 + pad < b.y2 && a.y2 - pad > b.y1;
 const mine = boxesOf(it);
 for (const o of items) {
  if (o === it || SOFT.has(o.kind) || !layers.has(layerOfItem(o))) continue;
  if (it.kind === 'dispenser' || o.kind === 'dispenser') continue;
  if (mine.some(a => boxesOf(o).some(b => hit(a, b)))) out.push(o.name.replace(/ \(.*\)$/, ''));
 }
 wall: for (const a of mine) for (const [x1, y1, x2, y2] of D.walls) {
  if (x1 === x2 && x1 > a.x1 + pad && x1 < a.x2 - pad && Math.max(y1, y2) > a.y1 + pad && Math.min(y1, y2) < a.y2 - pad) {out.push('a wall'); break wall;}
  if (y1 === y2 && y1 > a.y1 + pad && y1 < a.y2 - pad && Math.max(x1, x2) > a.x1 + pad && Math.min(x1, x2) < a.x2 - pad) {out.push('a wall'); break wall;}
 }
 return out;
};
const drawItems = () => {
 gItems.textContent = ''; gLabels.textContent = '';
 for (const it of items) {
  if (!layers.has(layerOfItem(it))) continue;
  const g = mk('g', {class: `plan-item k-${it.kind}${selected?.id === it.id ? ' is-sel' : ''}${clashes(it).length ? ' is-clash' : ''}${it.wifi && it.s ? ' is-off' : ''}`, style: `--c:${D.colours[it.room] ?? '#56607a'}`, transform: `translate(${it.x} ${it.y}) rotate(${it.r})`, 'data-item': it.id, tabindex: 0, role: 'button', 'aria-label': `${it.name}, ${sizeOf(it).s.n}`}, gItems);
  shape(it, g);
 }
 drawLabels(); drawLinks();
};
// Labels only where they fit on screen: name when the item is wide enough, size when wider still.
let lastK = 0;
const drawLabels = () => {
 gLabels.textContent = ''; gRooms.textContent = ''; const k = view.w / (svg.clientWidth || 360); lastK = k;
 for (const r of D.rooms) {const b = r.boxes[0]; if (b[2] / k < 64 || b[3] / k < 40) continue; mk('text', {x: b[0] + 10 * k, y: b[1] + 18 * k, class: 'plan-roomname'}, gRooms).textContent = r.short;}
 for (const it of items) {
  if (!layers.has(layerOfItem(it))) continue;
  const {w, d, s} = sizeOf(it), px = Math.max(w, d) / k, sel = selected?.id === it.id;
  if (px < 70 && !sel) continue;
  const short = it.name.replace(/ \(.*\)$/, '').replace(/^Linksys /, '').replace(/ \+ 4 chairs$/, '');
  const t = mk('text', {x: it.x, y: it.wifi ? it.y + 380 : it.y, class: 'plan-itemlabel'}, gLabels);
  mk('tspan', {x: it.x, dy: it.wifi ? '0.4em' : (px >= 120 || sel) ? '-0.2em' : '0.35em'}, t).textContent = short;
  if (!it.wifi && (px >= 120 || sel)) mk('tspan', {x: it.x, dy: '1.2em', class: 'sub'}, t).textContent = `${it.est ? 'about ' : ''}${cm(s.w)} × ${cm(s.d)} cm`;
 }
};
const drawLinks = () => {
 gLinks.textContent = '';
 if (!layers.has('wifi') || !layers.has('net')) return;
 const main = items.find(i => i.id === 'wifi-main'), b = D.wifi.bands[band]; if (!main) return;
 for (const n of nodes()) {
  if (n === main) continue; const s = signal(n.x, n.y, main, b), l = level(s.dbm);
  mk('line', {x1: main.x, y1: main.y, x2: n.x, y2: n.y, class: 'plan-link', stroke: l.colour, 'vector-effect': 'non-scaling-stroke'}, gLinks);
  mk('text', {x: (main.x + n.x) / 2, y: (main.y + n.y) / 2, class: 'plan-linklabel'}, gLinks).textContent = `${Math.round(s.dbm)} dBm`;
 }
};
// Light pool radius at table height: (ceiling − table) × tan(beam ÷ 2).
const specOf = t => D.pointTypes.find(x => x.id === t)?.spec;
const poolR = t => {const b = specOf(t)?.beam ?? 110; return Math.round((D.ceilingMm - D.workMm) * Math.tan(b / 2 * Math.PI / 180));};
const drawPoints = () => {
 gPts.textContent = '';
 for (const [t, list] of Object.entries(points)) {
  if (!layers.has(typeLayer[t])) continue;
  list.forEach((p, k) => {
   const g = mk('g', {class: `plan-pt pt-${t}${selected?.pt === t && selected.k === k ? ' is-sel' : ''}`, transform: `translate(${p[0]} ${p[1]})`, 'data-pt': t, 'data-k': k, role: 'button', 'aria-label': typeName[t]}, gPts);
   if (t === 'fan') {mk('circle', {r: poolR(t), class: 'pool fanpool', fill: 'url(#plan-glow)'}, g); mk('circle', {r: 500, class: 'fanring', 'vector-effect': 'non-scaling-stroke'}, g); mk('circle', {r: 90, class: 'core'}, g);}
   else if (t === 'light') {mk('circle', {r: poolR(t), class: 'pool', fill: 'url(#plan-glow)'}, g); mk('circle', {r: 260, class: 'glow', fill: 'url(#plan-glow)'}, g); mk('circle', {r: 75, class: 'core'}, g);}
   else mk('rect', {x: -90, y: -90, width: 180, height: 180, rx: t === 'socket' ? 30 : 90, class: 'core'}, g);
  });
 }
};
// Fan air: ceiling fans blow down under the blades and spread out; the corner fan sweeps 90°.
const drawAir = () => {
 gAir.textContent = '';
 if (!layers.has('air')) return;
 const ns = {'vector-effect': 'non-scaling-stroke'};
 for (const [x, y] of points.fan ?? []) {
  const sw = specOf('fan')?.sweep ?? 1000;
  mk('circle', {cx: x, cy: y, r: sw * 1.6, fill: 'url(#plan-air)', class: 'airzone'}, gAir);
  for (let a = 0; a < 8; a++) {const t = a * Math.PI / 4, r1 = sw * .62, r2 = sw * 1.2; mk('line', {x1: x + Math.cos(t) * r1, y1: y + Math.sin(t) * r1, x2: x + Math.cos(t) * r2, y2: y + Math.sin(t) * r2, class: 'airarrow', 'marker-end': 'url(#plan-arrow)', ...ns}, gAir);}
 }
 for (const it of items.filter(i => i.kind === 'cfan' && layers.has('furniture'))) {
  const sweep = (it.sweep ?? 90) * Math.PI / 180, reach = it.reach ?? 4000, aim = Math.atan2(Math.cos(it.r * Math.PI / 180), -Math.sin(it.r * Math.PI / 180));
  const a1 = aim - sweep / 2, a2 = aim + sweep / 2;
  mk('path', {d: `M${it.x},${it.y}L${it.x + Math.cos(a1) * reach},${it.y + Math.sin(a1) * reach}A${reach},${reach} 0 0 1 ${it.x + Math.cos(a2) * reach},${it.y + Math.sin(a2) * reach}Z`, class: 'airwedge', ...ns}, gAir);
  for (const f of [.45, .75]) mk('path', {d: `M${it.x + Math.cos(a1) * reach * f},${it.y + Math.sin(a1) * reach * f}A${reach * f},${reach * f} 0 0 1 ${it.x + Math.cos(a2) * reach * f},${it.y + Math.sin(a2) * reach * f}`, class: 'airarc', fill: 'none', ...ns}, gAir);
  mk('line', {x1: it.x, y1: it.y, x2: it.x + Math.cos(aim) * reach * .9, y2: it.y + Math.sin(aim) * reach * .9, class: 'airarrow', 'marker-end': 'url(#plan-arrow)', ...ns}, gAir);
 }
 // The selected light point: its beam circle at table height.
 if (selected?.pt === 'light' || selected?.pt === 'fan') {
  const [x, y] = points[selected.pt][selected.k] ?? [], r = poolR(selected.pt);
  if (x != null) {mk('circle', {cx: x, cy: y, r, class: 'beamring', fill: 'none', ...ns}, gAir); mk('text', {x, y: y - r - 80, class: 'gaplabel'}, gAir).textContent = `lit area about ${(r * 2 / 1000).toFixed(1)} m across`;}
 }
};
// TV viewing: lines from the screen edges to the sofa seat, and the band where the screen fills 30° to 40° of view.
const tvMath = (w, dist) => 2 * Math.atan(w / 2 / dist) * 180 / Math.PI;
const distFor = (w, deg) => w / 2 / Math.tan(deg / 2 * Math.PI / 180);
const viewer = () => {
 const tv = items.find(i => i.kind === 'tv'), so = items.find(i => i.id === D.tvView.sofa);
 if (!tv || !so) return null;
 const th = tv.r * Math.PI / 180, nx = -Math.sin(th), ny = Math.cos(th); // the screen faces this way
 const face = {x: tv.x + nx * sizeOf(tv).s.d / 2, y: tv.y + ny * sizeOf(tv).s.d / 2};
 const b = boxOf(so);
 // Head position: on the TV's centre line (kept inside the sofa), 50 cm in from the sofa's back edge.
 let vx, vy;
 if (Math.abs(nx) > Math.abs(ny)) {const back = nx < 0 ? b.x1 : b.x2; vx = back + (nx < 0 ? D.tvView.headMm : -D.tvView.headMm); vy = Math.min(Math.max(face.y, b.y1 + 400), b.y2 - 400);}
 else {const back = ny < 0 ? b.y1 : b.y2; vy = back + (ny < 0 ? D.tvView.headMm : -D.tvView.headMm); vx = Math.min(Math.max(face.x, b.x1 + 400), b.x2 - 400);}
 const dist = Math.abs(nx) > Math.abs(ny) ? Math.abs(face.x - vx) : Math.abs(face.y - vy);
 return {tv, so, face, nx, ny, vx, vy, dist};
};
const drawTv = () => {
 gTv.textContent = '';
 if (!layers.has('tv') || !layers.has('furniture')) return;
 const v = viewer(); if (!v) return;
 const {tv, face, nx, ny, vx, vy, dist} = v, W = sizeOf(tv).s.w, px = -ny, py = nx; // along the screen
 const e1 = {x: face.x + px * W / 2, y: face.y + py * W / 2}, e2 = {x: face.x - px * W / 2, y: face.y - py * W / 2};
 const d40 = distFor(W, D.tvView.thx), d30 = distFor(W, D.tvView.smpte), half = W / 2 + 600, ns = {'vector-effect': 'non-scaling-stroke'};
 const q = (d, s) => `${face.x + nx * d + px * half * s},${face.y + ny * d + py * half * s}`;
 mk('path', {d: `M${q(d40, 1)}L${q(d30, 1)}L${q(d30, -1)}L${q(d40, -1)}Z`, class: 'tvband'}, gTv);
 mk('text', {x: face.x + nx * (d40 + d30) / 2 + px * (half - 250), y: face.y + ny * (d40 + d30) / 2 + py * (half - 250), class: 'tvbandlabel'}, gTv).textContent = 'best seats';
 mk('path', {d: `M${e1.x},${e1.y}L${vx},${vy}L${e2.x},${e2.y}`, class: 'tvlines', fill: 'none', ...ns}, gTv);
 mk('circle', {cx: vx, cy: vy, r: 110, class: 'tvhead'}, gTv);
 const ang = tvMath(W, dist);
 mk('text', {x: vx, y: vy + 420, class: 'tvlabel'}, gTv).textContent = `${(dist / 1000).toFixed(1)} m · screen fills ${Math.round(ang)}°`;
};
// Gaps from the selected item to the nearest wall on each side (axis-aligned walls only).
const drawMeasure = () => {
 gMeasure.textContent = '';
 const it = selected?.id && items.find(i => i.id === selected.id); if (!it || it.wifi || !layers.has('furniture')) return;
 const b = boxOf(it), cx = it.x, cy = it.y, rays = [];
 let best = {l: null, r: null, t: null, b: null};
 for (const w of D.walls) {
  const [x1, y1, x2, y2] = w;
  if (x1 === x2 && cy >= Math.min(y1, y2) && cy <= Math.max(y1, y2)) {
   if (x1 <= b.x1 + 1 && (best.l == null || x1 > best.l)) best.l = x1;
   if (x1 >= b.x2 - 1 && (best.r == null || x1 < best.r)) best.r = x1;
  }
  if (y1 === y2 && cx >= Math.min(x1, x2) && cx <= Math.max(x1, x2)) {
   if (y1 <= b.y1 + 1 && (best.t == null || y1 > best.t)) best.t = y1;
   if (y1 >= b.y2 - 1 && (best.b == null || y1 < best.b)) best.b = y1;
  }
 }
 // Other furniture also counts: show the gap to whatever is nearest on each side.
 for (const o of items) {
  if (o === it || SOFT.has(o.kind) || !layers.has(layerOfItem(o))) continue;
  const q = boxOf(o);
  if (cy >= q.y1 && cy <= q.y2) {
   if (q.x2 <= b.x1 + 1 && (best.l == null || q.x2 > best.l)) best.l = q.x2;
   if (q.x1 >= b.x2 - 1 && (best.r == null || q.x1 < best.r)) best.r = q.x1;
  }
  if (cx >= q.x1 && cx <= q.x2) {
   if (q.y2 <= b.y1 + 1 && (best.t == null || q.y2 > best.t)) best.t = q.y2;
   if (q.y1 >= b.y2 - 1 && (best.b == null || q.y1 < best.b)) best.b = q.y1;
  }
 }
 if (best.l != null) rays.push([best.l, cy, b.x1, cy]);
 if (best.r != null) rays.push([b.x2, cy, best.r, cy]);
 if (best.t != null) rays.push([cx, best.t, cx, b.y1]);
 if (best.b != null) rays.push([cx, b.y2, cx, best.b]);
 for (const [x1, y1, x2, y2] of rays) {
  const len = Math.hypot(x2 - x1, y2 - y1); if (len > 4500) continue;
  mk('line', {x1, y1, x2, y2, class: 'gap' + (len < 600 && len > 5 ? ' tight' : ''), 'vector-effect': 'non-scaling-stroke'}, gMeasure);
  mk('text', {x: (x1 + x2) / 2, y: (y1 + y2) / 2, class: 'gaplabel' + (len < 600 && len > 5 ? ' tight' : '')}, gMeasure).textContent = len < 5 ? 'touching' : `${cm(len)} cm`;
 }
};
const drawAll = () => {drawItems(); drawPoints(); drawMeasure(); drawAir(); drawTv(); queueHeat();};

// ---------- tape measure: tap two spots; snaps to a wall within 15 cm ----------
const snapWall = p => {
 let bestD = 150, out = {x: p.x, y: p.y};
 for (const [x1, y1, x2, y2] of D.walls) {
  const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((p.x - x1) * dx + (p.y - y1) * dy) / L));
  const qx = x1 + t * dx, qy = y1 + t * dy, d = Math.hypot(p.x - qx, p.y - qy); if (d < bestD) {bestD = d; out = {x: qx, y: qy};}
 }
 return out;
};
const drawTape = () => {
 gTape.textContent = '';
 tape.forEach(p => mk('circle', {cx: p.x, cy: p.y, r: 70, class: 'tape-end'}, gTape));
 if (tape.length === 2) {
  const [a, b] = tape, len = Math.hypot(b.x - a.x, b.y - a.y);
  mk('line', {x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'tape-line', 'vector-effect': 'non-scaling-stroke'}, gTape);
  mk('text', {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, class: 'tape-label'}, gTape).textContent = `${cm(len)} cm`;
  readout.innerHTML = `<b>${cm(len)} cm</b> · tap two more spots to measure again`; readout.hidden = false;
 } else if (tapeOn) {readout.innerHTML = tape.length ? 'Now tap the second spot' : 'Tap the first spot (snaps to walls)'; readout.hidden = false;}
};

// ---------- view: zoom and pan ----------
const fitTo = (x, y, w, h, pad = 300) => {
 const cw = svg.clientWidth || 360, ch = svg.clientHeight || 400, a = ch / cw;
 let vw = w + pad * 2, vh = h + pad * 2; if (vh / vw > a) vw = vh / a; else vh = vw * a;
 setView({x: x + w / 2 - vw / 2, y: y + h / 2 - vh / 2, w: vw, h: vh});
};
const setView = v => {
 const cw = svg.clientWidth || 360, ch = svg.clientHeight || 400, a = ch / cw;
 v.w = Math.min(Math.max(v.w, 1200), D.W * 1.6); v.h = v.w * a;
 view = v; svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
 const k = v.w / cw; svg.style.setProperty('--k', k);
 svg.setAttribute('font-size', (13 * k).toFixed(1));
 if (Math.abs(k - lastK) / (lastK || 1) > .15 && typeof drawLabels === 'function') requestAnimationFrame(drawLabels);
 const nice = [500, 1000, 2000, 3000, 5000].find(m => m / k >= 70) ?? 5000, sb = root.querySelector('[data-scalebar]'), sl = root.querySelector('[data-scale-label]');
 if (sb) sb.style.width = `${Math.round(nice / k)}px`; if (sl) sl.textContent = nice >= 1000 ? `${nice / 1000} m` : `${nice / 10} cm`;
};
const zoomAt = (f, px, py) => {const v = {...view}; const nw = Math.min(Math.max(v.w * f, 1200), D.W * 1.6), r = nw / v.w; setView({x: px - (px - v.x) * r, y: py - (py - v.y) * r, w: nw});};
const zoomRoom = id => {
 root.querySelectorAll('[data-zoom]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.zoom === id)));
 if (id === 'all') return fitTo(300, 700, D.W - 600, D.H - 1100, 100);
 const ids = id === 'kitchen' ? ['kitchen', 'yard'] : [id], boxes = ids.flatMap(i => roomById[i]?.boxes ?? []);
 if (!boxes.length) return;
 const x1 = Math.min(...boxes.map(b => b[0])), y1 = Math.min(...boxes.map(b => b[1])), x2 = Math.max(...boxes.map(b => b[0] + b[2])), y2 = Math.max(...boxes.map(b => b[1] + b[3]));
 fitTo(x1, y1, x2 - x1, y2 - y1, 350);
};
root.querySelectorAll('[data-zoom]').forEach(b => b.addEventListener('click', () => zoomRoom(b.dataset.zoom)));
root.querySelector('[data-z="in"]').addEventListener('click', () => zoomAt(.7, view.x + view.w / 2, view.y + view.h / 2));
root.querySelector('[data-z="out"]').addEventListener('click', () => zoomAt(1 / .7, view.x + view.w / 2, view.y + view.h / 2));
root.querySelector('[data-z="fit"]').addEventListener('click', () => zoomRoom('all'));
svg.addEventListener('wheel', e => {e.preventDefault(); const p = toPlan(e); zoomAt(e.deltaY > 0 ? 1.15 : 1 / 1.15, p.x, p.y);}, {passive: false});

// ---------- pointer: drag items and points, pan, pinch, tap ----------
const ptrs = new Map(); let drag = null, dragging = false, pinch = null;
svg.addEventListener('pointerdown', e => {
 ptrs.set(e.pointerId, {x: e.clientX, y: e.clientY});
 svg.setPointerCapture?.(e.pointerId);
 if (ptrs.size === 2) {const [a, b] = [...ptrs.values()]; pinch = {d: Math.hypot(a.x - b.x, a.y - b.y), view: {...view}}; drag = null; return;}
 const p = toPlan(e), itemEl = e.target.closest('[data-item]'), ptEl = e.target.closest('[data-pt]');
 const can = moveOn && !D.ro;
 if (tapeOn) drag = {type: 'pan', sx: e.clientX, sy: e.clientY, view: {...view}, moved: false};
 else if (itemEl) {const it = items.find(i => i.id === itemEl.dataset.item); drag = {type: 'item', it, dx: p.x - it.x, dy: p.y - it.y, sx: e.clientX, sy: e.clientY, moved: false, can};}
 else if (ptEl) {const t = ptEl.dataset.pt, k = +ptEl.dataset.k; drag = {type: 'pt', t, k, dx: p.x - points[t][k][0], dy: p.y - points[t][k][1], sx: e.clientX, sy: e.clientY, moved: false, can};}
 else drag = {type: 'pan', sx: e.clientX, sy: e.clientY, view: {...view}, moved: false};
});
svg.addEventListener('pointermove', e => {
 if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, {x: e.clientX, y: e.clientY});
 if (pinch && ptrs.size === 2) {
  const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y); if (!d) return;
  const r = svg.getBoundingClientRect(), mx = (a.x + b.x) / 2 - r.left, my = (a.y + b.y) / 2 - r.top, v = pinch.view;
  const px = v.x + mx / r.width * v.w, py = v.y + my / r.height * v.h, nw = v.w * pinch.d / d;
  setView({x: px - mx / r.width * nw, y: py - my / r.height * nw * (v.h / v.w), w: nw}); return;
 }
 if (!drag) return;
 const far = Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6; if (far) drag.moved = true;
 if (drag.type === 'pan') {if (!drag.moved) return; const r = svg.getBoundingClientRect(), k = drag.view.w / r.width; setView({x: drag.view.x - (e.clientX - drag.sx) * k, y: drag.view.y - (e.clientY - drag.sy) * k, w: drag.view.w}); return;}
 if (!drag.can) {if (drag.moved) {const r = svg.getBoundingClientRect(), k = view.w / r.width; drag = {type: 'pan', sx: e.clientX, sy: e.clientY, view: {...view}, moved: true}; void k;} return;}
 if (!drag.moved) return;
 dragging = true; const p = toPlan(e), snap = v => Math.round(v / 10) * 10;
 const x = Math.min(Math.max(snap(p.x - drag.dx), 0), D.W), y = Math.min(Math.max(snap(p.y - drag.dy), 0), D.H);
 if (drag.type === 'item') {drag.it.x = x; drag.it.y = y; selected = {id: drag.it.id}; drawItems(); drawMeasure(); drawTv(); drawAir(); if (drag.it.wifi) queueHeat();}
 else {points[drag.t][drag.k] = [x, y]; drawPoints(); drawAir();}
});
const end = e => {
 ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null;
 const d = drag; drag = null; if (!d) return;
 if (dragging) {dragging = false; if (d.type === 'item') {saveItem(d.it); openItem(d.it, true); queueHeat();} else if (d.type === 'pt') savePoints(d.t); return;}
 if (d.moved) return;
 // A tap.
 if (tapeOn) {const p = snapWall(toPlan(e)); tape = tape.length >= 2 ? [p] : [...tape, p]; drawTape(); return;}
 if (d.type === 'item') return openItem(d.it);
 if (d.type === 'pt') return openPoint(d.t, d.k);
 const p = toPlan(e);
 if (moveOn && addType && !D.ro) {points[addType].push([Math.round(p.x / 10) * 10, Math.round(p.y / 10) * 10]); savePoints(addType); drawPoints(); return;}
 if (layers.has('wifi')) {showReadout(p); return;}
 closeSheet();
 const r = roomAt(p.x, p.y); if (r && view.w > D.W * .7) zoomRoom(r.id === 'yard' ? 'kitchen' : r.id);
};
svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', e => {ptrs.delete(e.pointerId); drag = null; dragging = false; pinch = null;});
svg.addEventListener('keydown', e => {const g = e.target.closest?.('[data-item]'); if (g && (e.key === 'Enter' || e.key === ' ')) {e.preventDefault(); openItem(items.find(i => i.id === g.dataset.item));}});

const showReadout = p => {
 const s = best(p.x, p.y); if (!s || !roomAt(p.x, p.y)) {readout.hidden = true; return;}
 const l = level(s.dbm);
 readout.innerHTML = `<b>About ${Math.round(s.dbm)} dBm</b> · ${esc(l.name)}<br><small>${esc(roomAt(p.x, p.y).name)}: from ${esc(s.n.name)}, through ${s.walls} wall${s.walls === 1 ? '' : 's'}</small>`;
 readout.hidden = false;
};

// ---------- the item panel (sizes, choices from /buy, research) ----------
// With nothing chosen, the panel lists the things on the plan (shown beside the plan on wide screens).
const emptySheet = () => {
 sheet.classList.add('is-empty'); sheet.hidden = false;
 sheet.innerHTML = `<h3 class="sheet-empty-title">Things on the plan</h3><p class="sheet-note">Tap one to see its size, the choices and the research.</p><ul class="sheet-index">${items.filter(it => it.on !== false).map(it => `<li><button type="button" data-open="${esc(it.id)}"><i style="background:${D.colours[it.room] ?? '#56607a'}"></i><span>${esc(it.name)}</span><small>${esc(roomById[it.room]?.short ?? '')}</small></button></li>`).join('')}</ul>`;
 sheet.querySelectorAll('[data-open]').forEach(b => b.onclick = () => {const it = items.find(i => i.id === b.dataset.open); zoomRoom(it.room === 'yard' ? 'kitchen' : it.room); openItem(it, true);});
};
const closeSheet = () => {selected = null; undock(); emptySheet(); drawItems(); drawPoints(); drawMeasure(); drawAir(); drawTv();};
const buyBlock = id => {
 const b = D.buy[id]; if (!b) return '';
 return `<div class="sheet-buy"><h4>${esc(b.name.split(/,| \(/)[0])} <small>${esc(b.opts.length)} choice${b.opts.length === 1 ? '' : 's'} on the to-buy list${b.tag === 'maybe' ? ' · tagged Maybe' : ''}</small></h4><ul class="sheet-opts">${b.opts.map((o, k) => `<li><label class="sheet-opt${k === b.pick ? ' is-on' : ''}">${b.opts.length > 1 ? `<input type="radio" name="pick-${esc(id)}" value="${k}" data-pick="${esc(id)}"${k === b.pick ? ' checked' : ''}${D.ro ? ' disabled' : ''}>` : ''}${o.img ? `<img src="${esc(o.img)}" alt="" loading="lazy">` : '<span class="sheet-noimg"></span>'}<span class="sheet-opt-text"><b>${k ? '' : '<span class="buy-rec">Recommended</span> '}${esc(o.n)}</b>${o.m ? `<small>${esc(o.m)}</small>` : ''}<small>${esc(o.shop)}${o.href ? ` · <a href="${esc(o.href)}" target="_blank" rel="noopener noreferrer">See price ↗</a>` : ''}</small>${o.note ? `<small>${esc(o.note)}</small>` : ''}</span><strong>${esc(o.p)}${o.est ? '<small>Estimate</small>' : ''}</strong></label></li>`).join('')}</ul></div>`;
};
const researchBlock = id => {
 const t = D.research[id]; if (!t) return '';
 const groups = [...new Set(t.list.map(o => o.g))];
 return `<div class="sheet-research"><h4>Research: ${esc(t.title)} <span class="research-status s-${esc(t.status.toLowerCase())}">${esc(t.status)}</span></h4><p>${esc(t.answer)}</p>${groups.map(g => `<p class="sheet-group">${esc(g)}</p><ul class="sheet-short">${t.list.filter(o => o.g === g).map(o => `<li${o.pick ? ' class="is-pick"' : ''}><span>${o.href ? `<a href="${esc(o.href)}" target="_blank" rel="noopener noreferrer">${esc(o.n)} ↗</a>` : esc(o.n)}${o.pick ? ' <em>pick</em>' : ''}</span><b>${esc(o.p)}</b>${o.specs.length ? `<small>${o.specs.map(([k, v]) => `${esc(k)}: ${esc(v)}`).join(' · ')}</small>` : ''}</li>`).join('')}</ul>`).join('')}<a class="text-link" href="/research#r-${esc(id)}">All notes for ${esc(t.title.toLowerCase())} →</a></div>`;
};
// Size choices: a button for each, with the price and a link when known.
function sizeList(it) {
 if (it.sizes.length < 2 && !it.sizes[0].price && !it.sizes[0].img) return '';
 const label = it.wifi ? 'Use in the coverage' : 'Size or model';
 return `<div class="sheet-sizes${it.sizes.some(z => z.img || z.price) ? ' has-rich' : ''}" role="group" aria-label="${label}">${it.sizes.map((z, k) => {
  const on = !it.c && k === it.s;
  return `<div class="sheet-size${on ? ' is-on' : ''}">${it.sizes.length > 1 ? `<button type="button" data-size="${k}" aria-pressed="${on}"${D.ro ? ' disabled' : ''}>` : '<div class="sheet-size-one">'}${z.img ? `<img src="${esc(z.img)}" alt="" loading="lazy">` : ''}<span><b>${esc(z.n)}</b>${z.price ? `<small>${esc(z.price)}</small>` : ''}${z.note ? `<small>${esc(z.note)}</small>` : ''}</span>${it.sizes.length > 1 ? '</button>' : '</div>'}${z.href ? `<a class="sheet-size-link" href="${esc(z.href)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(z.n)} product page">Product page ↗</a>` : ''}</div>`;
 }).join('')}</div>`;
}
// For the TV: each size, the best seating distance (40° to 30°) and how much of the view it fills from the sofa.
function tvTable(it) {
 const v = viewer();
 return `<div class="sheet-tv"><h4>Viewing from the sofa${v ? ` <small>head about ${(v.dist / 1000).toFixed(1)} m from the screen</small>` : ''}</h4><table><thead><tr><th>Size</th><th>Best distance</th><th>From the sofa</th></tr></thead><tbody>${it.sizes.map((z, k) => {
  const a = v ? tvMath(z.w, v.dist) : null, ok = a != null && a >= D.tvView.smpte - 1 && a <= D.tvView.thx + 1;
  return `<tr${k === it.s && !it.c ? ' class="is-on"' : ''}><td>${esc(z.n)}</td><td>${(distFor(z.w, D.tvView.thx) / 1000).toFixed(1)} to ${(distFor(z.w, D.tvView.smpte) / 1000).toFixed(1)} m</td><td>${a == null ? '' : `<b class="${ok ? 'tv-ok' : 'tv-low'}">${Math.round(a)}°</b> ${ok ? 'in range' : a < D.tvView.smpte ? 'smaller than ideal' : 'very big'}`}</td></tr>`;
 }).join('')}</tbody></table><p class="sheet-note">Best distance = where the screen fills 40° (THX) to 30° (SMPTE) of the view. Closer feels more like a cinema; further feels smaller. The green band on the plan shows this for the chosen size.</p></div>`;
}
// On a phone the panel is a sheet over the bottom of the screen: keep the plan in view above it, with the thing centred there.
function dock(x, y, recenter = true) {
 if (!phone()) return false;
 document.body.classList.add('plan-sheet-open');
 if (!sheet.querySelector('.sheet-grab')) sheet.insertAdjacentHTML('afterbegin', '<button type="button" class="sheet-grab" data-grab aria-label="Show more of the panel"></button>');
 const g = sheet.querySelector('[data-grab]'); g.onclick = () => {const full = sheet.classList.toggle('is-full'); g.setAttribute('aria-label', full ? 'Show less of the panel' : 'Show more of the panel');};
 if (!recenter) return true;
 const head = document.querySelector('.site-header')?.offsetHeight ?? 64;
 const top = stage.getBoundingClientRect().top + scrollY - head - 6;
 if (Math.abs(scrollY - top) > 4) window.scrollTo({top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
 requestAnimationFrame(() => {
  const visH = Math.max(160, innerHeight - head - sheet.offsetHeight - 12), ch = svg.clientHeight || 400, k = view.h / ch;
  setView({x: x - view.w / 2, y: y - Math.min(visH, ch) / 2 * k, w: view.w});
 });
 return true;
}
const undock = () => {document.body.classList.remove('plan-sheet-open'); sheet.classList.remove('is-full');};
function openItem(it, quiet = false) {
 selected = {id: it.id}; sheet.classList.remove('is-empty'); const {s} = sizeOf(it), room = roomById[it.room];
 sheet.innerHTML = `<div class="sheet-head"><div><span class="eyebrow">${esc(room?.name ?? '')}</span><h3>${esc(it.name)}</h3></div><button type="button" class="sheet-close" data-close aria-label="Close">×</button></div>
${sizeList(it)}
<p class="sheet-dims"><b>${it.est && !it.c ? 'About ' : ''}${cm(s.w)} × ${cm(s.d)} cm</b>${s.custom ? ' (custom)' : ''}${it.wifi ? '' : ' · gaps to the nearest wall or furniture are drawn on the plan (red when under 60 cm)'}</p>
${clashes(it).length ? `<p class="sheet-clash" role="status">Runs into ${esc([...new Set(clashes(it))].join(', '))}. Move, turn or pick a smaller size.</p>` : ''}
${it.wifi || D.ro ? '' : `<form class="sheet-custom" data-custom><span>Custom size</span><label>Width <input type="number" inputmode="numeric" min="10" max="400" step="0.5" name="w" value="${cm(s.w)}" required> cm</label><label>Depth <input type="number" inputmode="numeric" min="10" max="400" step="0.5" name="d" value="${cm(s.d)}" required> cm</label><button type="submit">Use this size</button></form>`}
${it.note ? `<p class="sheet-note">${esc(it.note)}</p>` : ''}
${D.ro ? '' : `<div class="sheet-actions"><button type="button" data-rotate>${it.kind === 'cfan' ? 'Aim 45°' : 'Turn 90°'}</button>${moveOn ? '' : '<button type="button" data-movehint>Move it</button>'}${it.add ? '<button type="button" class="sheet-remove" data-unplace>Remove from plan</button>' : ''}</div>`}
${it.kind === 'tv' ? tvTable(it) : ''}${(it.buy ?? []).map(buyBlock).join('')}${it.research ? researchBlock(it.research) : ''}${it.wifi && D.research.fibre ? researchBlock('fibre') : ''}`;
 sheet.hidden = false; drawItems(); drawMeasure(); drawTv(); drawAir();
 if (!dock(it.x, it.y, !quiet) && !quiet) sheet.scrollIntoView?.({block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
 sheet.querySelector('[data-close]').onclick = closeSheet;
 sheet.querySelectorAll('[data-size]').forEach(b => b.onclick = () => {it.s = +b.dataset.size; it.c = null; saveItem(it); openItem(it, true); queueHeat(); drawCart();});
 const cf = sheet.querySelector('[data-custom]');
 if (cf) cf.onsubmit = ev => {ev.preventDefault(); const w = Math.round(parseFloat(cf.w.value) * 10), d = Math.round(parseFloat(cf.d.value) * 10); if (!(w >= 100 && w <= 4000 && d >= 100 && d <= 4000)) {say('Size must be 10 to 400 cm'); return;} it.c = {w, d}; saveItem(it); openItem(it, true);};
 const rot = sheet.querySelector('[data-rotate]'); if (rot) rot.onclick = () => {it.r = (it.r + (it.kind === 'cfan' ? 45 : 90)) % 360; saveItem(it); openItem(it, true); drawAir(); drawTv();};
 const up = sheet.querySelector('[data-unplace]'); if (up) up.onclick = () => setOn(it, false);
 const mh = sheet.querySelector('[data-movehint]'); if (mh) mh.onclick = () => {setMove(true); openItem(it, true);};
 sheet.querySelectorAll('[data-pick]').forEach(r => r.onchange = () => {const id = r.dataset.pick, k = +r.value; D.buy[id].pick = k; save(`b:${id}:pick`, k ? String(k) : ''); openItem(it, true); drawCart();});
}
function pointSpec(t) {
 const sp = specOf(t); if (!sp) return '';
 const r = poolR(t), rows = [['Model', sp.model]];
 if (sp.lm) rows.push(['Brightness', sp.lm]);
 if (sp.beam && t === 'light') rows.push(['Beam', `${sp.beam}°: lights a circle about ${(r * 2 / 1000).toFixed(1)} m across at table height (ceiling taken as ${(D.ceilingMm / 1000).toFixed(1)} m; check on 3 Dec)`]);
 if (sp.sweep) rows.push(['Blades', `${sp.sweep / 10} cm across`]);
 if (sp.air) rows.push(['Air', sp.air]);
 if (sp.light) rows.push(['Light', sp.light]);
 return `<dl class="sheet-spec">${rows.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl><p class="sheet-fine">From the ${esc(sp.src)}.${t === 'fan' ? ' The blue area on the plan (Fan air) is an estimate: strongest under the blades, then spreading out across the floor.' : ''}</p>`;
}
function openPoint(t, k) {
 selected = {pt: t, k}; sheet.classList.remove('is-empty'); const p = points[t][k], r = roomAt(p[0], p[1]);
 sheet.innerHTML = `<div class="sheet-head"><div><span class="eyebrow">${esc(r?.name ?? 'Plan')}</span><h3>${esc(typeName[t])}</h3></div><button type="button" class="sheet-close" data-close aria-label="Close">×</button></div>${pointSpec(t)}<p class="sheet-note">Draft position. ${t === 'light' || t === 'fan' ? 'Mark the real spots on 3 Dec with the electrician.' : t === 'tp' || t === 'lan' ? 'Find and test on 3 Dec (see the 3 Dec checklist).' : 'Count sockets and switches on 3 Dec for the G3 line.'}</p>${D.ro ? '' : `<div class="sheet-actions"><button type="button" data-remove>Remove this ${esc(typeName[t].toLowerCase())}</button></div>`}`;
 sheet.hidden = false; drawPoints(); drawAir(); dock(p[0], p[1]);
 sheet.querySelector('[data-close]').onclick = closeSheet;
 const rm = sheet.querySelector('[data-remove]'); if (rm) rm.onclick = () => {points[t].splice(k, 1); savePoints(t); closeSheet(); drawCounts();};
}

// ---------- cart: chosen options for the items on the plan ----------
const cartEl = root.querySelector('[data-cart-list]');
function drawCart() {
 const rows = []; let total = 0;
 for (const it of items) for (const id of it.on === false ? [] : it.buy ?? []) {
  const b = D.buy[id]; if (!b) continue; const o = b.opts[b.pick] ?? b.opts[0], line = o.s * b.qty, off = b.tag === 'maybe';
  if (!off) total += line;
  rows.push(`<li${off ? ' class="is-off"' : ''}><a href="#" data-goto="${esc(it.id)}">${esc(it.name.replace(/ \(.*\)$/, ''))}</a><span>${esc(o.n)}${b.qty > 1 ? ` × ${b.qty}` : ''}${off ? ' · Maybe, not counted' : ''}</span><b>${sgd(line)}${o.est ? '<small>Estimate</small>' : ''}</b></li>`);
 }
 cartEl.innerHTML = `<ul class="plan-cart-list">${rows.join('')}</ul><p class="plan-cart-total">Total for these: <b>${sgd(total)}</b></p>`;
 cartEl.querySelectorAll('[data-goto]').forEach(a => a.onclick = ev => {ev.preventDefault(); const it = items.find(i => i.id === a.dataset.goto); zoomRoom(it.room === 'yard' ? 'kitchen' : it.room); openItem(it); stage.scrollIntoView?.({block: 'start'});});
}
const drawCounts = () => {
 const n = t => points[t]?.length ?? 0, el = root.querySelector('.plan-layer-lights span'), pw = root.querySelector('.plan-layer-power span');
 if (el) el.textContent = `Lights and fans (${n('light') + n('fan')})`;
 if (pw) pw.textContent = `Sockets and switches (${n('socket') + n('switch')})`;
};

// ---------- controls ----------
const addBar = root.querySelector('[data-add-bar]'), moveBox = root.querySelector('[data-move]');
const setMove = on => {moveOn = on && !D.ro; if (moveBox) moveBox.checked = moveOn; addBar.hidden = !moveOn; stage.classList.toggle('is-move', moveOn); if (!moveOn) {addType = ''; const r = addBar.querySelector('input[value=""]'); if (r) r.checked = true;}};
moveBox?.addEventListener('change', () => {setMove(moveBox.checked); if (moveBox.checked && tapeBox?.checked) {tapeBox.checked = false; tapeOn = false; tape = []; drawTape(); readout.hidden = true;}});
const tapeBox = root.querySelector('[data-tape]');
tapeBox?.addEventListener('change', () => {tapeOn = tapeBox.checked; tape = []; if (tapeOn) {setMove(false); closeSheet();} else readout.hidden = true; drawTape();});
const nightBox = root.querySelector('[data-night]');
nightBox?.addEventListener('change', () => {stage.classList.toggle('is-night', nightBox.checked); if (nightBox.checked && !layers.has('lights')) {layers.add('lights'); root.querySelector('[data-layer="lights"]').checked = true; drawAll();}});
addBar.querySelectorAll('input[name="plan-add"]').forEach(r => r.addEventListener('change', () => {addType = r.value; if (addType && !layers.has(typeLayer[addType])) {layers.add(typeLayer[addType]); const c = root.querySelector(`[data-layer="${typeLayer[addType]}"]`); if (c) c.checked = true; drawAll();}}));
const wifiBar = root.querySelector('[data-wifi-bar]');
{const lb = root.querySelector('[data-layerbox]'); if (lb && phone()) lb.open = false;}
const layerCount = () => {const c = root.querySelector('[data-layer-count]'); if (c) c.textContent = `${root.querySelectorAll('[data-layer]:checked').length} on`;};
root.querySelectorAll('[data-layer]').forEach(c => c.addEventListener('change', layerCount));
root.querySelectorAll('[data-layer]').forEach(c => c.addEventListener('change', () => {
 if (c.checked) layers.add(c.dataset.layer); else layers.delete(c.dataset.layer);
 wifiBar.hidden = !layers.has('wifi'); if (!layers.has('wifi')) readout.hidden = true;
 if (c.dataset.layer === 'wifi' && c.checked && !layers.has('net')) {layers.add('net'); root.querySelector('[data-layer="net"]').checked = true;}
 drawAll();
}));
root.querySelectorAll('input[name="plan-band"]').forEach(r => r.addEventListener('change', () => {band = r.value; drawLinks(); queueHeat(); readout.hidden = true;}));
addEventListener('resize', () => setView({...view}));

// ---------- add or remove furniture (mahjong table, recliner, coffee table) ----------
const chips = root.querySelector('[data-addables]');
const paintChips = () => chips?.querySelectorAll('[data-toggle]').forEach(b => {const it = items.find(i => i.id === b.dataset.toggle); if (!it) return; b.setAttribute('aria-pressed', String(it.on !== false)); b.querySelector('i').textContent = it.on !== false ? '✓' : '+';});
function setOn(it, on) {
 if (D.ro) return; it.on = on; saveItem(it); paintChips(); drawCart();
 if (on) {if (!layers.has('furniture')) {layers.add('furniture'); const c = root.querySelector('[data-layer="furniture"]'); if (c) c.checked = true;} zoomRoom(it.room === 'yard' ? 'kitchen' : it.room); openItem(it, true); say('Added: drag it into place with Move');}
 else {closeSheet(); say('Removed from the plan');}
 drawAll();
}
chips?.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {const it = items.find(i => i.id === b.dataset.toggle); if (it) setOn(it, it.on === false);}));
paintChips();

// ---------- layouts: copy the Designer's pick or the family plan ----------
// Two taps: the first asks, the second copies (no browser pop-ups).
root.querySelectorAll('[data-copy]').forEach(b => {
 const label = b.textContent; let armed = 0;
 b.addEventListener('click', async () => {
  const src = D.copy?.[b.dataset.copy]; if (!src) return;
  const to = D.layout === 'designer' ? 'p:' : P, where = D.layout === 'designer' ? '/plan' : `/plan?layout=${D.layout}`;
  if (Date.now() - armed > 5000) {armed = Date.now(); b.textContent = to === 'p:' ? 'Tap again: this replaces the family plan' : 'Tap again: this replaces this layout'; b.classList.add('is-armed'); setTimeout(() => {if (armed && Date.now() - armed >= 5000) {armed = 0; b.textContent = label; b.classList.remove('is-armed');}}, 5100); return;}
  armed = 0; b.disabled = true; b.textContent = 'Copying…'; say('Copying…');
  let failed = 0;
  for (const [k, v] of Object.entries(src)) {try {await put('/api/plan/' + encodeURIComponent(to + k), v);} catch {failed++;}}
  if (failed) {b.disabled = false; b.textContent = label; say(`${failed} not copied. Try again.`); return;}
  location.href = where;
 });
});

// ---------- start ----------
wifiBar.hidden = !layers.has('wifi');
drawAll(); drawCart(); drawCounts(); emptySheet();
const start = decodeURIComponent(location.hash.slice(1)), first = items.find(i => i.id === start);
requestAnimationFrame(() => {
 if (first) {zoomRoom(first.room === 'yard' ? 'kitchen' : first.room); openItem(first, true);}
 else zoomRoom('all');
});
})();
