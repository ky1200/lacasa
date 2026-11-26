// 3D view of the floor plan, built from the same walls, rooms and furniture as the 2D plan (mm → metres).
// Loaded only when someone taps "3D view". Shapes are drawn from real sizes; finishes follow the mood board.
// Realism: image-based light (RoomEnvironment), Khronos PBR Neutral tone mapping (true product colours),
// soft shadows, procedural vinyl/tile textures from real XingFloors swatch colours, and an ambient-occlusion
// pass (GTAO + SMAA) drawn whenever the view stops moving.
import * as T from '/vendor/three-0.187.0-c.js';

const m = v => v / 1000;
const DOOR_H = 2100;

// ---- House details traced from the I-Niche plan (mm, same coordinates as the 2D plan) ----
// Windows: [wall index, from, to (along the wall), sill height, head height]
// KY (bedroom 3) and KS (bedroom 2) have bay windows: the glass sits about 56 cm out from the inner wall,
// over a solid ledge at sill height. Those are drawn by bay() below, not cut into the wall.
const WINDOWS = [[1, 800, 1950, 1000, 2100], [9, 9200, 12300, 400, 2400], [14, 5900, 7800, 500, 2300], [20, 9100, 10300, 1000, 2100]];
// Bay windows: [wall index, from x, to x, glass line y, inner wall line y, ledge top, window head, room]
const BAYS = [[3, 3062, 5520, 950, 1460, 500, 2300, 'ky'], [5, 5640, 8560, 950, 1500, 500, 2300, 'ks']];
// Door openings cut into a wall: [wall index, from, to]
const GAPS = [[30, 11120, 12200]];
// Walls that are really door leaves on the plan
const NOT_WALLS = new Set([8]);
// Short wall pieces the plan shows but the wall list leaves out: [x1, y1, x2, y2]
const EXTRA_WALLS = [[2990, 870, 2990, 1400], [8620, 870, 8620, 1980]];
// Door leaves shown open: [hinge x, hinge y, end x, end y, kind]
// KY door (updated plan, 26 Nov): at the bottom of the 745 mm passage, hinged by KS's wall, opening into the passage.
const DOORS = [[5450, 5090, 5450, 4420, 'room'], [5850, 4170, 5850, 4960, 'room'], [4704, 5342, 4704, 6150, 'room'], [6800, 6235, 6800, 7020, 'room'], [2117, 4060, 2117, 3260, 'room'], [7594, 9000, 7594, 9780, 'steel'], [12200, 11285, 12200, 10205, 'main']];
// Built-in kitchen and yard counters: [x1, y1, x2, y2, height]
// Kitchen (galley): sink run against the dining wall, hob run along the bottom wall (ends where the fridge space starts),
// tall store cabinet (ST) by the entrance, yard counter by the washer.
const COUNTERS = [[7650, 10160, 9660, 10780, 900], [8890, 8310, 10960, 9047, 900], [6300, 10230, 6950, 10780, 850], [10600, 10050, 10960, 10780, 2100]];
// Where to stand when walking into each room: [x, y, look at x, look at y]
const SPAWN = {all: [11700, 10300, 10500, 4000], living: [10500, 5900, 10600, 2000], dining: [11900, 8700, 10300, 7200], kitchen: [10700, 9500, 8300, 10300], ky: [5100, 4250, 3400, 2300], ks: [7000, 4700, 7000, 1200], kx: [4300, 4400, 1200, 6800]};
const FLOOR = {ky: 'vinyl', ks: 'vinyl', kx: 'vinyl', 'master-bath': 'bath', 'common-bath': 'bath', yard: 'bath', hs: 'plain'};
const ROOMS = [['all', 'Whole home'], ['living', 'Living'], ['dining', 'Dining'], ['kitchen', 'Kitchen'], ['ky', 'KY'], ['ks', 'KS'], ['kx', 'KX']];
const C = {door: '#6a2a20', main: '#4a2a1c', steel: '#9aa0a3', fabric: '#cdbca5', bed: '#bdb4a8', linen: '#f4f1ea', oak: '#d6b98f', walnut: '#5b3a29', black: '#1e1e1e', white: '#f6f6f3', stone: '#d8d2c6', steelApp: '#c9ccce', vanity: '#4b3426', glass: '#cfe3ea', curtain: '#d9ccb6', sheer: '#f7f5f0', counter: '#3b3b3b', cabinet: '#ece7dd', skirting: '#3a2620', ledge: '#e4ddd2'};

// ---- XingFloors vinyl (colours sampled from XingFloors' own swatch photos, Nov 2026: [mid, dark, light]) ----
// FLOORLUX vinyl click: 5 mm, 0.3 mm wear layer, planks 1220 × 180 mm (the range in the I-Niche quote, F2).
export const VINYL = [
 {id: 'camel-brown', n: 'Camel Brown (XFV1085)', r: 'Floorlux', c: ['#c6a67c', '#ae8c65', '#d4b489'], note: 'Light natural oak with real grain. Our pick: bright, hides dust, not orange next to the red-brown doors.'},
 {id: 'satin-wood', n: 'Satin Wood', r: 'Floorlux', c: ['#c9a47a', '#be986e', '#d4af85'], note: 'Warm honey oak, smooth grain. Cosy; a little warmer than Camel Brown.'},
 {id: 'wheat-oak', n: 'Wheat Oak', r: 'Floorlux', c: ['#b9ab9d', '#b0a293', '#c1b3a6'], note: 'Greige oak. Modern and calm; hides dust and scratches best.'},
 {id: 'natural-oak', n: 'Natural Oak', r: 'Floorlux', c: ['#ecdabf', '#e7d5ba', '#f1e0c5'], note: 'Very pale blonde oak. Brightest; shows dark hair and dirt more.'},
 {id: 'almond-cream', n: 'Almond Cream (XFV8022)', r: 'Floorlux', c: ['#d5c8bc', '#c3b6aa', '#e1d7cb'], note: 'Whitewashed oak. Light Scandinavian look.'},
 {id: 'cappuccino', n: 'Cappuccino (XFV1049)', r: 'Floorlux', c: ['#a4937c', '#96856d', '#b0a088'], note: 'Mid greige-brown. Hides everything; a bit darker.'},
 {id: 'golden-oak', n: 'Golden Oak (best seller)', r: 'Floorlux', c: ['#c48757', '#b67848', '#d09465'], note: 'Orange oak. Popular, but clashes with our red-brown doors.'},
 {id: 'french-oak', n: 'French Oak', r: 'Floorlux', c: ['#878075', '#696256', '#a8a296'], note: 'Grey weathered oak with strong grain.'},
 {id: 'grey-beech', n: 'Grey Beech', r: 'Floorlux', c: ['#6d6358', '#5e5449', '#7a7066'], note: 'Dark grey-brown. Moody; makes small rooms feel smaller.'},
 {id: 'slate-oak', n: 'Slate Oak (XFV2211)', r: 'Ultraclick', c: ['#decead', '#d6c6a5', '#e5d5b5'], note: 'Clean pale oak. Ultraclick range: ask John if the S$4.50 price covers it.'},
 {id: 'light-oak', n: 'Light Oak (XFV2210)', r: 'Ultraclick', c: ['#cfcac7', '#c5c0bd', '#d8d3d0'], note: 'Pale grey-white oak. Ultraclick range.'},
 {id: 'autumn-oak', n: 'Autumn Oak (XFV2213)', r: 'Ultraclick', c: ['#ac9d7a', '#a29370', '#b4a683'], note: 'Olive-beige oak. Ultraclick range.'},
 {id: 'honeycomb', n: 'Honeycomb (XFV2212)', r: 'Ultraclick', c: ['#a48259', '#97734b', '#b29168'], note: 'Rich mid oak. Ultraclick range.'},
 {id: 'rosette-pine', n: 'Rosette Pine (XFV2214)', r: 'Ultraclick', c: ['#806c4d', '#6d5c40', '#8d7859'], note: 'Darker smoked pine. Ultraclick range.'},
 {id: 'havana-oak', n: 'Havana Oak (XFV2216)', r: 'Ultraclick', c: ['#787878', '#686868', '#848484'], note: 'Mid grey. Ultraclick range.'},
 {id: 'forest-grey', n: 'Forest Grey (XFV2217)', r: 'Ultraclick', c: ['#4a4542', '#403b38', '#524d4a'], note: 'Charcoal. Ultraclick range.'},
 {id: 'ivory-cream', n: 'Ivory Cream', r: 'Waterproof', c: ['#cdbfad', '#c8b9a7', '#d1c5b3'], note: 'Soft beige, faint grain. Waterproof range (5 mm, 0.3 mm).'},
 {id: 'pastel-grey', n: 'Pastel Grey', r: 'Waterproof', c: ['#c2c2c2', '#bfbfbf', '#c6c6c6'], note: 'Plain light grey. Waterproof range.'},
 {id: 'dove-grey', n: 'Dove Grey', r: 'Waterproof', c: ['#7f8085', '#77787d', '#88898e'], note: 'Mid blue-grey. Waterproof range.'},
];
// Nippon Paint whites from the mood board (screen colours are approximate).
const PAINT = [
 {n: 'Nippon Apple White (1140)', c: '#f1ead9', note: 'Warm off-white. Mood board pick: best with walnut and oak.'},
 {n: 'Nippon Sail White', c: '#f2efe6', note: 'Soft, popular white; turns slightly warm at night.'},
 {n: 'Nippon Foamy Cream', c: '#f1e6cf', note: 'Creamier and cosier; close to the inspiration picture.'},
 {n: 'Plain bright white', c: '#f7f7f5', note: 'For comparison: the usual rental white. Cooler and flatter.'},
];
// Light scenes. Colour of each white is a softened blackbody colour.
const SCENES = [
 {id: 'day', n: 'Daytime', sun: 2.6, sky: 0.3, env: 0.35, down: 0, cove: 0, lamp: 0, exp: 1.0, k: 0,
  tip: 'Daylight through the windows. The bay windows face the same side as the living room window, so mornings and afternoons differ: check on site.'},
 {id: 'warm', n: 'Evening 3000K ★', sun: 0, sky: 0.04, env: 0.1, down: 1, cove: 1, lamp: 1, exp: 0.95, k: 3000,
  tip: 'Recommended: warm white 3000K in the living room and bedrooms. Soft, makes wood and the almond sofa look rich, helps you wind down.'},
 {id: 'neutral', n: 'Evening 4000K', sun: 0, sky: 0.04, env: 0.1, down: 1, cove: 1, lamp: 1, exp: 1.0, k: 4000,
  tip: 'Neutral white 4000K. Good for the kitchen and yard (cooking, cleaning). In bedrooms it feels like an office.'},
 {id: 'cool', n: 'Cool 6500K (compare)', sun: 0, sky: 0.04, env: 0.1, down: 1, cove: 1, lamp: 0, exp: 0.95, k: 6500,
  tip: 'Cool daylight 6500K, the old fluorescent tube look. Shown so you can compare: flat and clinical at home. Avoid in living and bedrooms.'},
 {id: 'cosy', n: 'Night: coves + lamps', sun: 0, sky: 0.02, env: 0.04, down: 0, cove: 1.3, lamp: 1.4, exp: 1.15, k: 2700,
  tip: 'Downlights off; only the hidden LED strips (cove, wardrobe, nook) and lamps at 2700K. Movie nights and before bed.'},
];
const KELVIN = {2700: '#ffdab4', 3000: '#ffe5cb', 4000: '#fff2e4', 6500: '#edf2ff'};
export const LIGHT_TIPS = [
 'One colour per room: 2700–3000K warm white in living, dining and bedrooms; 4000K only if you want it in the kitchen and yard.',
 'Buy CRI 90+ LEDs: wood, skin and the sofa fabric look natural (cheap LEDs make them grey).',
 'Layer the light: downlights for cleaning, a cove or LED strip for soft glow, a lamp where you read. Put each layer on its own switch or a dimmer.',
 'Bedrooms of about 14 m² need 3 to 4 downlights of about 800 lumens, not a full grid. Keep them off the bed head so they don’t glare in your eyes.',
 'Reading nook (KY and KS window seat): a small warm wall lamp or a slim LED strip under the window head, aimed at the book. Plan a socket near the ledge for a phone charger.',
 'Kitchen: an LED strip under the wall cabinets lights the counter without your own shadow on it.',
];

// ---- Small seeded random, so textures look the same every time ----
function rng(seed) {let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;}
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// ---- Textures drawn on a canvas (no downloads) ----
function canvasTex(draw, w, h) {
 const c = document.createElement('canvas');
 c.width = w; c.height = h;
 draw(c.getContext('2d'), w, h);
 const t = new T.CanvasTexture(c);
 t.wrapS = t.wrapT = T.RepeatWrapping;
 t.colorSpace = T.SRGBColorSpace;
 t.anisotropy = 8;
 return t;
}
// Vinyl planks: 1220 × 180 mm, staggered; one tile of texture = 2 plank lengths × 8 rows (2440 × 1440 mm).
const TILE_X = 2440, TILE_Y = 1440;
function vinylTex(v) {
 const [mid, dk, lt] = v.c.map(hexRgb);
 return canvasTex((g, W, H) => {
  const rnd = rng(v.id.length * 977 + v.c[0].charCodeAt(2)), rows = 8, rh = H / rows, pl = W / 2;
  for (let r = 0; r < rows; r++) {
   const off = (r * 0.37 + rnd() * 0.3) % 1 * pl, y = r * rh;
   for (let k = -1; k < 3; k++) {
    const x = k * pl + off, base = mix(dk, lt, 0.2 + rnd() * 0.6);
    g.fillStyle = rgb(base); g.fillRect(x, y, pl, rh);
    // grain: long wavy lines, a few darker streaks, and an occasional cathedral arch
    for (let l = 0; l < 26; l++) {
     const yy = y + rnd() * rh, amp = 0.6 + rnd() * 2.2, ph = rnd() * 6, dark = rnd() < 0.5;
     g.strokeStyle = rgb(dark ? mix(dk, [40, 25, 10], 0.25) : lt, 0.05 + rnd() * 0.12);
     g.lineWidth = 0.4 + rnd() * 1.4;
     g.beginPath();
     for (let s = 0; s <= 24; s++) {const px = x + pl * s / 24; g[s ? 'lineTo' : 'moveTo'](px, yy + Math.sin(ph + s * 0.55) * amp);}
     g.stroke();
    }
    if (rnd() < 0.55) {
     const cx = x + pl * (0.25 + rnd() * 0.5), cy = y + rh * (0.3 + rnd() * 0.4);
     g.strokeStyle = rgb(mix(dk, [50, 30, 15], 0.2), 0.1);
     for (let a = 0; a < 5; a++) {g.lineWidth = 0.8; g.beginPath(); g.ellipse(cx, cy, pl * (0.12 + a * 0.035), rh * (0.12 + a * 0.06), 0, 0, Math.PI * 2); g.stroke();}
    }
    if (rnd() < 0.08) {g.fillStyle = rgb(dk, 0.45); g.beginPath(); g.ellipse(x + pl * rnd(), y + rh * (0.3 + rnd() * 0.4), 4, 2.5, 0, 0, 7); g.fill();}
    // micro bevel at the plank end
    g.fillStyle = rgb(mix(dk, [30, 20, 10], 0.3), 0.55); g.fillRect(x, y, 1.2, rh);
    g.fillStyle = rgb(lt, 0.25); g.fillRect(x + 1.2, y, 1, rh);
   }
   g.fillStyle = rgb(mix(dk, [30, 20, 10], 0.35), 0.6); g.fillRect(0, y, W, 1.4);
   g.fillStyle = rgb(lt, 0.3); g.fillRect(0, y + 1.4, W, 1);
  }
  // soft low-frequency mottling so a big floor doesn't look printed
  for (let i = 0; i < 40; i++) {const gr = g.createRadialGradient(rnd() * W, rnd() * H, 0, rnd() * W, rnd() * H, 60 + rnd() * 160); gr.addColorStop(0, rgb(rnd() < 0.5 ? dk : lt, 0.06)); gr.addColorStop(1, rgb(mid, 0)); g.fillStyle = gr; g.fillRect(0, 0, W, H);}
 }, 2048, 1024);
}
// Glossy cream-beige 60 × 60 cm floor tiles (living, dining, kitchen, hall): texture = 2 × 2 tiles.
function tileTex() {
 return canvasTex((g, W) => {
  const rnd = rng(61), t = W / 2;
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
   const b = mix([226, 214, 198], [233, 223, 208], rnd());
   g.fillStyle = rgb(b); g.fillRect(i * t, j * t, t, t);
   for (let k = 0; k < 18; k++) {const x = i * t + rnd() * t, y = j * t + rnd() * t, gr = g.createRadialGradient(x, y, 0, x, y, 20 + rnd() * 70); gr.addColorStop(0, rgb(rnd() < 0.5 ? [210, 196, 178] : [242, 234, 222], 0.25)); gr.addColorStop(1, rgb(b, 0)); g.fillStyle = gr; g.fillRect(i * t, j * t, t, t);}
  }
  g.fillStyle = '#cfc3b1';
  for (let i = 0; i <= 2; i++) {g.fillRect(i * t - 1.5, 0, 3, W); g.fillRect(0, i * t - 1.5, W, 3);}
 }, 1024, 1024);
}
function bathTex() {
 return canvasTex((g, W) => {
  const rnd = rng(7), t = W / 2;
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {g.fillStyle = rgb(mix([196, 194, 189], [206, 204, 199], rnd())); g.fillRect(i * t, j * t, t, t);}
  g.fillStyle = '#a9a6a0';
  for (let i = 0; i <= 2; i++) {g.fillRect(i * t - 2, 0, 4, W); g.fillRect(0, i * t - 2, W, 4);}
 }, 256, 256);
}

// ---- Shape helpers (metres; y up; local -z = back of the piece) ----
const matCache = new Map();
function mat(colour, opt = {}) {
 const key = colour + JSON.stringify(opt);
 if (!matCache.has(key)) matCache.set(key, new T.MeshStandardMaterial({color: colour, roughness: opt.rough ?? 0.8, metalness: opt.metal ?? 0, transparent: opt.opacity != null, opacity: opt.opacity ?? 1, emissive: opt.glow ?? '#000000', emissiveIntensity: opt.glowI ?? 1, side: opt.double ? T.DoubleSide : T.FrontSide, depthWrite: opt.opacity == null || opt.opacity > 0.6}));
 return matCache.get(key);
}
function box(g, w, h, d, x, y, z, material, shadow = true, round = 0) {
 const W = Math.max(w, 0.001), H = Math.max(h, 0.001), Dp = Math.max(d, 0.001);
 const geo = round ? new T.RoundedBoxGeometry(W, H, Dp, 3, Math.min(round, W / 2, H / 2, Dp / 2)) : new T.BoxGeometry(W, H, Dp);
 const mesh = new T.Mesh(geo, material);
 mesh.position.set(x, y + h / 2, z);
 mesh.castShadow = shadow;
 mesh.receiveShadow = true;
 g.add(mesh);
 return mesh;
}
const soft = (g, w, h, d, x, y, z, material, r = 0.04) => box(g, w, h, d, x, y, z, material, true, r);
function cyl(g, r, h, x, y, z, material, seg = 24, r2 = r) {
 const mesh = new T.Mesh(new T.CylinderGeometry(r, r2, h, seg), material);
 mesh.position.set(x, y + h / 2, z);
 mesh.castShadow = true;
 mesh.receiveShadow = true;
 g.add(mesh);
 return mesh;
}
function legs(g, w, d, h, inset, r, material) {
 for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(g, r, h, sx * (w / 2 - inset), 0, sz * (d / 2 - inset), material, 10);
}
function chairSimple(g, x, z, rot, seatCol, legCol) {
 const c = new T.Group();
 legs(c, 0.43, 0.43, 0.45, 0.04, 0.015, mat(legCol, {rough: 0.5}));
 soft(c, 0.45, 0.06, 0.45, 0, 0.45, 0, mat(seatCol, {rough: 1}), 0.02);
 soft(c, 0.45, 0.38, 0.05, 0, 0.5, -0.2, mat(seatCol, {rough: 1}), 0.02);
 c.position.set(x, 0, z);
 c.rotation.y = rot;
 g.add(c);
}

// ---- One builder per kind of furniture ----
function build(it, s, colour) {
 const g = new T.Group(), w = m(s.w), d = m(s.d), k = it.kind;
 if (k === 'bed') {
  // Dunlopillo storage frame 41 cm high + the ordered mattress (30 or 38 cm); headboard only where ordered.
  const fh = 0.41, mh = m(it.mattress ?? 300), top = fh + mh;
  soft(g, w + 0.08, fh, d + 0.06, 0, 0, 0.02, mat(C.bed, {rough: 1}), 0.03);
  soft(g, w, mh, d, 0, fh, 0.02, mat(C.linen, {rough: 0.95}), 0.06);
  soft(g, w + 0.04, 0.06, d * 0.6, 0, top - 0.03, d * 0.2, mat('#d9d3c8', {rough: 1}), 0.03);
  if (it.headboard !== false) soft(g, w + 0.16, 1.15, 0.1, 0, 0, -d / 2 - 0.05, mat(C.bed, {rough: 1}), 0.04);
  const pw = w > 1.3 ? (w - 0.2) / 2 : w - 0.12;
  for (const px of (w > 1.3 ? [-(pw / 2 + 0.04), pw / 2 + 0.04] : [0])) soft(g, pw, 0.14, 0.42, px, top - 0.01, -d / 2 + 0.29, mat('#ffffff', {rough: 1}), 0.06);
 } else if (k === 'sofa') {
  const f = s.flip ? -1 : 1, arm = 0.23, back = 0.24, fab = mat(colour, {rough: 1}), bh = m(it.h ?? 850) - 0.42;
  soft(g, w, 0.3, d, 0, 0.1, 0, fab, 0.04);
  box(g, w - 0.1, 0.1, d - 0.1, 0, 0, 0, mat('#3a3029', {rough: 0.6}), false);
  soft(g, w - arm, bh, back, -f * arm / 2, 0.38, -d / 2 + back / 2, fab, 0.07);
  soft(g, arm, 0.26, d, f * (w / 2 - arm / 2), 0.38, 0, fab, 0.08);
  const seats = 5, sw = (w - arm) / seats;
  for (let i = 0; i < seats; i++) soft(g, sw - 0.015, 0.14, d - back - 0.03, -f * (w / 2 - sw * i - sw / 2), 0.36, back / 2, fab, 0.06);
  soft(g, 0.45, 0.42, 0.14, -f * (w / 2 - arm - 0.4), 0.5, -d / 2 + back + 0.09, mat('#e9e2d6', {rough: 1}), 0.07).rotation.x = -0.18;
  soft(g, 0.45, 0.42, 0.14, -f * (w / 2 - arm - 0.95), 0.5, -d / 2 + back + 0.09, mat('#cdbfae', {rough: 1}), 0.07).rotation.x = -0.18;
 } else if (k === 'recliner') {
  const fab = mat('#4d4a47', {rough: 1});
  soft(g, w, 0.45, d, 0, 0, 0, fab, 0.06);
  soft(g, w - 0.1, 0.55, 0.25, 0, 0.45, -d / 2 + 0.13, fab, 0.08);
  for (const sx of [-1, 1]) soft(g, 0.18, 0.2, d * 0.75, sx * (w / 2 - 0.09), 0.45, 0.06, fab, 0.06);
 } else if (k === 'ctable') {
  if (s.round) {
   cyl(g, w / 2, 0.012, 0, 0.43, 0, mat(C.glass, {opacity: 0.5, rough: 0.1}), 48);
   cyl(g, w / 2 - 0.03, 0.02, 0, 0.41, 0, mat(C.oak, {rough: 0.5}), 48);
   cyl(g, w / 2 - 0.08, 0.01, 0, 0.12, 0, mat(C.oak, {rough: 0.5}), 48);
   for (let a = 0; a < 3; a++) cyl(g, 0.018, 0.42, Math.cos(a * 2.094) * (w / 2 - 0.08), 0, Math.sin(a * 2.094) * (w / 2 - 0.08), mat(C.oak), 8);
  } else {soft(g, w, 0.05, d, 0, 0.37, 0, mat(C.walnut, {rough: 0.45}), 0.01); box(g, w - 0.1, 0.02, d - 0.1, 0, 0.12, 0, mat(C.walnut, {rough: 0.5})); legs(g, w, d, 0.37, 0.025, 0.025, mat(C.walnut, {rough: 0.5}));}
 } else if (k === 'tv') {
  const hgt = w * 0.5625;
  soft(g, w, hgt, 0.03, 0, 0.75, 0, mat('#0b0b0d', {rough: 0.25, metal: 0.2}), 0.006);
  box(g, w - 0.012, hgt - 0.012, 0.002, 0, 0.756, 0.016, mat('#10141c', {rough: 0.06, metal: 0.1}), false);
  // light wood TV console under the screen (mood board), floating
  soft(g, Math.max(1.8, w + 0.3), 0.32, 0.4, 0, 0.2, -0.2, mat('#c9a77d', {rough: 0.55}), 0.01);
 } else if (k === 'table') {
  soft(g, w, 0.04, d, 0, 0.71, 0, mat(C.walnut, {rough: 0.45}), 0.015);
  legs(g, w, d, 0.71, 0.08, 0.025, mat(C.walnut, {rough: 0.5}));
  const per = w >= 1.5 ? 3 : 2;
  for (let i = 0; i < per; i++) {
   const cx = -w / 2 + w * (i + 0.5) / per;
   chairSimple(g, cx, -d / 2 - 0.25, 0, '#d8cdbb', C.walnut);
   chairSimple(g, cx, d / 2 + 0.25, Math.PI, '#d8cdbb', C.walnut);
  }
  // pendant over the table
  cyl(g, 0.004, 0.9, 0, 1.7, 0, mat('#222222'), 6);
  const sh = cyl(g, 0.22, 0.16, 0, 1.55, 0, mat('#e8dcc6', {rough: 0.9, glow: '#ffd9a8', glowI: 0, double: true}), 32, 0.08);
  sh.userData.pendant = true;
 } else if (k === 'desk') {
  soft(g, w, 0.03, d, 0, 0.72, 0, mat(C.black, {rough: 0.5}), 0.005);
  for (const sx of [-1, 1]) box(g, 0.06, 0.72, d - 0.1, sx * (w / 2 - 0.1), 0, 0, mat('#2a2a2a', {metal: 0.4, rough: 0.5}));
  soft(g, 0.6, 0.35, 0.03, 0, 0.88, -d / 2 + 0.15, mat('#111111', {rough: 0.3}), 0.005);
 } else if (k === 'chair') {
  const r = Math.min(w, d) / 2;
  cyl(g, r * 0.9, 0.04, 0, 0.06, 0, mat('#222222'), 20);
  cyl(g, 0.03, 0.4, 0, 0.06, 0, mat('#444444', {metal: 0.5}), 8);
  soft(g, r * 1.5, 0.08, r * 1.3, 0, 0.46, 0.03, mat('#2b2b2b', {rough: 0.9}), 0.03);
  soft(g, r * 1.4, 0.65, 0.06, 0, 0.55, -r * 0.7, mat('#2b2b2b', {rough: 0.9}), 0.03);
 } else if (k === 'toilet') {
  soft(g, w, 0.4, d * 0.28, 0, 0.38, -d / 2 + d * 0.14, mat(C.white, {rough: 0.15}), 0.04);
  const bowl = cyl(g, w / 2 - 0.02, 0.4, 0, 0, d * 0.1, mat(C.white, {rough: 0.15}), 32, w / 2 - 0.06);
  bowl.scale.z = (d * 0.75) / (w - 0.04);
 } else if (k === 'basin') {
  // Wall-hung vanity; basin rim height from the plan data (common 89 cm, master 80 cm). Gunmetal tap.
  const rim = m(it.rim ?? 850);
  soft(g, w, 0.45, d, 0, rim - 0.45, 0, mat(C.vanity, {rough: 0.55}), 0.01);
  soft(g, w + 0.01, 0.04, d + 0.01, 0, rim, 0, mat(C.white, {rough: 0.12}), 0.01);
  box(g, 0.03, 0.2, 0.03, 0, rim + 0.04, -d / 2 + 0.06, mat('#4a4846', {metal: 0.9, rough: 0.25}));
  box(g, w * 0.9, 0.7, 0.12, 0, rim + 0.4, -d / 2 + 0.06, mat('#dfe7ea', {rough: 0.03, metal: 0.85}));
 } else if (k === 'mjtable') {
  const t = m(Math.min(s.t ?? 800, s.w, s.d));
  box(g, t, 0.03, t, 0, 0.73, 0, mat('#2f6b4a', {rough: 1}));
  legs(g, t, t, 0.73, 0.04, 0.015, mat('#555555', {metal: 0.5}));
  for (let a = 0; a < 4; a++) chairSimple(g, Math.sin(a * Math.PI / 2) * (t / 2 + 0.25), Math.cos(a * Math.PI / 2) * (t / 2 + 0.25), a * Math.PI / 2 + Math.PI, '#9c9890', '#555555');
 } else if (k === 'stool') {
  cyl(g, Math.min(w, d) / 2, 0.45, 0, 0, 0, mat(colour, {rough: 1}), 24);
 } else if (k === 'wardrobe') {
  soft(g, w, 2.0, d, 0, 0, 0, mat(C.white, {rough: 0.5}), 0.008);
  const doors = w > 0.9 ? 3 : w > 0.6 ? 2 : 1;
  for (let i = 1; i < doors; i++) box(g, 0.004, 1.96, 0.004, -w / 2 + w * i / doors, 0.02, d / 2 + 0.002, mat('#b8b3ab'), false);
  for (let i = 0; i < doors; i++) box(g, 0.015, 0.25, 0.02, -w / 2 + w * (i + 0.5) / doors + 0.05, 0.95, d / 2 + 0.01, mat('#9d9d9d', {metal: 0.8, rough: 0.3}), false);
 } else if (k === 'lwardrobe') {
  const t = m(s.t ?? 600), body = mat(C.stone, {rough: 0.55}), hgt = 2.7, n = Math.max(2, Math.round((w - t) / 0.5));
  box(g, w, hgt, t, 0, 0, -d / 2 + t / 2, body);
  box(g, t, hgt, d - t, -w / 2 + t / 2, 0, t / 2, body);
  for (let i = 1; i < n; i++) box(g, 0.012, 0.45, 0.02, -w / 2 + t + (w - t) * i / n, 1.0, -d / 2 + t + 0.01, mat(C.black, {metal: 0.6}), false);
  const strip = box(g, w - t, 0.02, 0.01, t / 2, 2.62, -d / 2 + t + 0.006, mat('#fff6dc', {glow: '#ffd9a8', glowI: 1}), false);
  strip.userData.cove = true;
 } else if (k === 'fridge') {
  soft(g, w, m(s.h ?? 1770), d, 0, 0, 0, mat(C.steelApp, {metal: 0.6, rough: 0.3}), 0.02);
  box(g, w - 0.02, 0.006, 0.004, 0, 1.1, d / 2 + 0.002, mat('#7b7f82'), false);
  for (const y of [0.75, 1.25]) box(g, 0.02, 0.35, 0.03, w / 2 - 0.06, y, d / 2 + 0.02, mat('#8a8e91', {metal: 0.8}), false);
 } else if (k === 'dispenser') {
  soft(g, w, 0.45, d, 0, 0.9, 0, mat('#e8e6e1', {rough: 0.3}), 0.01);
 } else if (k === 'cfan') {
  const r = w / 2;
  cyl(g, 0.05, 0.08, 0, 2.3, 0, mat(C.white), 16);
  for (let a = 0; a < 3; a++) {const b = box(g, r * 0.9, 0.01, 0.08, Math.cos(a * 2.094) * r * 0.45, 2.3, Math.sin(a * 2.094) * r * 0.45, mat(C.white), false); b.rotation.y = -a * 2.094;}
 } else {
  box(g, w, 0.8, d, 0, 0, 0, mat(colour));
 }
 return g;
}

function sizeOf(it) {
 const s = it.c ? {...it.sizes?.[0], w: it.c.w, d: it.c.d, custom: true} : it.sizes?.[it.s] ?? it.sizes?.[0];
 return s ? {...s, n: it.c ? 'Custom' : s.n} : null;
}

function productOf(D, it) {
 for (const id of it.buy ?? []) {
  const b = D.buy?.[id];
  if (!b) continue;
  const o = b.opts?.[b.pick ?? 0] ?? b.opts?.[0];
  if (o) return {name: o.n || b.name, img: o.img, price: o.p, shop: o.shop};
 }
 const s = sizeOf(it);
 return s?.img ? {name: s.n, img: s.img, price: s.price} : null;
}

// Remember the viewer's picks on this device only (never saved to the site).
const store = {
 get(k, d) {try {return localStorage.getItem('p3d:' + k) ?? d;} catch {return d;}},
 set(k, v) {try {localStorage.setItem('p3d:' + k, v);} catch {}},
};

let ui = null;

export function open(D, items) {
 if (ui) ui.close();
 const box3 = document.createElement('div');
 box3.className = 'p3d';
 box3.setAttribute('role', 'dialog');
 box3.setAttribute('aria-modal', 'true');
 box3.setAttribute('aria-label', '3D view of the home');
 const sw = (v, i, on) => `<button type="button" class="p3d-sw" data-vinyl="${i}" aria-pressed="${on}" title="${v.n}"><i style="background:linear-gradient(90deg,${v.c[1]},${v.c[0]} 45%,${v.c[2]})"></i><span>${v.n}</span></button>`;
 const groups = ['Floorlux', 'Ultraclick', 'Waterproof'];
 box3.innerHTML = `<div class="p3d-bar"><b>3D view</b><span class="p3d-bar-r"><button type="button" class="p3d-close" data-photo aria-label="Save a photo of this view">Photo</button><button type="button" class="p3d-close" data-x aria-label="Close the 3D view">Close</button></span></div>
<div class="p3d-stage"><canvas class="p3d-canvas"></canvas><div class="p3d-card" data-card hidden></div><p class="p3d-tag" data-tag></p>
<div class="p3d-move" data-move hidden><button type="button" data-step="1" aria-label="Walk forward">▲</button><button type="button" data-step="-1" aria-label="Walk back">▼</button></div>
<div class="p3d-sheet" data-sheet hidden>
<section><h3>Lights</h3><div class="p3d-row p3d-wrap">${SCENES.map((s, i) => `<button type="button" data-scene="${i}">${s.n}</button>`).join('')}</div><p class="p3d-note" data-scene-tip></p>
<details><summary>How to light this home (6 tips)</summary><ol class="p3d-tips">${LIGHT_TIPS.map(t => `<li>${t}</li>`).join('')}</ol></details></section>
<section><h3>Bedroom floor: XingFloors vinyl</h3><p class="p3d-note">The quote (F2) is XingFloors 5 mm. Floorlux vinyl click: 5 mm, 0.3 mm wear layer, 122 × 18 cm planks. Colours are from XingFloors' photos: check the real sample in daylight.</p>
${groups.map(gname => `<h4>${gname}</h4><div class="p3d-sws">${VINYL.map((v, i) => v.r === gname ? sw(v, i, false) : '').join('')}</div>`).join('')}<p class="p3d-note" data-vinyl-note></p></section>
<section><h3>Wall paint (all walls)</h3><div class="p3d-sws">${PAINT.map((p, i) => `<button type="button" class="p3d-sw" data-paint="${i}" aria-pressed="false"><i style="background:${p.c}"></i><span>${p.n}</span></button>`).join('')}</div><p class="p3d-note" data-paint-note></p></section>
<section><h3>Window seats (KY and KS)</h3><div class="p3d-row"><button type="button" data-cushion aria-pressed="true">Custom cushions on the ledge</button></div><p class="p3d-note">The bay ledge is about 56 cm deep and 50 cm high: a seat. A 6 to 8 cm cushion made to measure, with a removable, washable cover, plus 2 or 3 back pillows against the side walls.</p></section>
</div></div>
<div class="p3d-ctrl"><div class="p3d-row">${ROOMS.map(([id, n], k) => `<button type="button" data-room="${id}"${k ? '' : ' aria-pressed="true"'}>${n}</button>`).join('')}</div>
<div class="p3d-row"><button type="button" data-finish aria-pressed="false">Floor, paint, lights</button><button type="button" data-walk aria-pressed="false">Walk inside</button><button type="button" data-sofa>Sit on the sofa</button><button type="button" data-nook>Window seat</button><button type="button" data-low aria-pressed="false">Low walls</button></div>
<p class="p3d-help" data-help>Drag to turn, pinch or scroll to zoom. Tap furniture for its photo and size.</p></div>`;
 document.body.append(box3);
 const prevFocus = document.activeElement;
 document.documentElement.classList.add('p3d-open');
 const $ = s => box3.querySelector(s), $$ = s => box3.querySelectorAll(s);
 const canvas = $('canvas'), stage = $('.p3d-stage'), card = $('[data-card]'), help = $('[data-help]'), tag = $('[data-tag]');

 const renderer = new T.WebGLRenderer({canvas, antialias: true, preserveDrawingBuffer: true});
 renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
 renderer.shadowMap.enabled = true;
 renderer.shadowMap.type = T.PCFSoftShadowMap;
 renderer.toneMapping = T.NeutralToneMapping;
 renderer.toneMappingExposure = 1;
 T.RectAreaLightUniformsLib.init();
 const scene = new T.Scene();
 const pmrem = new T.PMREMGenerator(renderer);
 const envTex = pmrem.fromScene(new T.RoomEnvironment(), 0.04).texture;
 scene.environment = envTex;
 const skyDay = canvasTex((g, w, h) => {const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#8fb9dc'); gr.addColorStop(0.55, '#d9e7f0'); gr.addColorStop(1, '#efe9df'); g.fillStyle = gr; g.fillRect(0, 0, w, h);}, 4, 128);
 const skyNight = canvasTex((g, w, h) => {const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0d1424'); gr.addColorStop(0.6, '#1d2638'); gr.addColorStop(1, '#2e3341'); g.fillStyle = gr; g.fillRect(0, 0, w, h);}, 4, 128);
 const camera = new T.PerspectiveCamera(50, 1, 0.05, 120);
 const hemi = new T.HemisphereLight(0xfff8ee, 0xcbbfae, 0.5);
 scene.add(hemi);
 const sun = new T.DirectionalLight(0xfff1dc, 3.4);
 sun.position.set(m(D.W) * 0.3 + 2, 9, -5);
 sun.target.position.set(m(D.W / 2), 0, m(D.H / 2));
 sun.castShadow = true;
 sun.shadow.mapSize.set(2048, 2048);
 Object.assign(sun.shadow.camera, {left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 40});
 sun.shadow.bias = -0.0003;
 sun.shadow.normalBias = 0.02;
 sun.shadow.radius = 4;
 scene.add(sun, sun.target);

 const ceil = m(D.ceilingMm || 2600), W = D.walls;
 const inBox = (x, y, [bx, by, bw, bh]) => x >= bx && x <= bx + bw && y >= by && y <= by + bh;
 const roomAt = (x, y) => D.rooms.find(r => r.boxes.some(b => inBox(x, y, b)))?.id;

 // Concrete floor slab under the flat (grounds the dollhouse view)
 {
  const slab = new T.Mesh(new T.BoxGeometry(m(D.W) + 0.6, 0.25, m(D.H) + 0.6), mat('#d9d4cb', {rough: 1}));
  slab.position.set(m(D.W / 2), -0.126, m(D.H / 2));
  slab.receiveShadow = true;
  scene.add(slab);
 }
 // Floors
 const tileMap = tileTex(), bathMap = bathTex();
 let vinylPick = Math.max(0, VINYL.findIndex(v => v.id === store.get('vinyl', 'camel-brown')));
 let vinylMap = vinylTex(VINYL[vinylPick]);
 const vinylMat = new T.MeshStandardMaterial({map: vinylMap, roughness: 0.55});
 const tileMat = new T.MeshStandardMaterial({map: tileMap, roughness: 0.13});
 const bathMat = new T.MeshStandardMaterial({map: bathMap, roughness: 0.5});
 const floors = [];
 for (const r of D.rooms) for (const [x, y, w, h] of r.boxes) {
  const kind = FLOOR[r.id] ?? 'tile', geo = new T.PlaneGeometry(m(w) + 0.06, m(h) + 0.06);
  // UVs in millimetres of the texture tile, so planks and tiles keep their real size in every room
  const uv = geo.attributes.uv, tx = kind === 'vinyl' ? TILE_X : kind === 'bath' ? 600 : 1200, ty = kind === 'vinyl' ? TILE_Y : tx;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (x + uv.getX(i) * w) / tx, (y + (1 - uv.getY(i)) * h) / ty);
  const material = kind === 'vinyl' ? vinylMat : kind === 'bath' ? bathMat : kind === 'plain' ? mat('#bdb8ae', {rough: 0.9}) : tileMat;
  const f = new T.Mesh(geo, material);
  f.rotation.x = -Math.PI / 2;
  f.position.set(m(x + w / 2), 0.001, m(y + h / 2));
  f.receiveShadow = true;
  scene.add(f);
  floors.push(f);
 }
 // Ceiling, downlights and ceiling fans (ceiling shown when walking inside)
 const ceiling = new T.Group();
 for (const r of D.rooms) for (const [x, y, w, h] of r.boxes) {
  const c = new T.Mesh(new T.PlaneGeometry(m(w) + 0.06, m(h) + 0.06), mat('#fbfaf7', {rough: 1}));
  c.rotation.x = Math.PI / 2;
  c.position.set(m(x + w / 2), ceil, m(y + h / 2));
  c.receiveShadow = true;
  ceiling.add(c);
 }
 // Downlight positions: the plan's light points, plus one in the middle of any room without one.
 const lightPts = [...(D.points?.light ?? [])];
 for (const r of D.rooms) if (!['hs'].includes(r.id) && !lightPts.some(([x, y]) => r.boxes.some(b => inBox(x, y, b)))) {const [x, y, w, h] = r.boxes[0]; lightPts.push([x + w / 2, y + h / 2]);}
 const downs = [], bulbMat = new T.MeshStandardMaterial({color: '#ffffff', emissive: '#fff1dc', emissiveIntensity: 0.2, roughness: 0.4});
 for (const [x, y] of lightPts) {
  const l = new T.Mesh(new T.CylinderGeometry(0.045, 0.045, 0.01, 20), bulbMat);
  l.position.set(m(x), ceil - 0.006, m(y));
  ceiling.add(l);
  const room = roomAt(x, y), small = ['master-bath', 'common-bath', 'yard', 'hall', 'entrance'].includes(room);
  const s = new T.SpotLight(0xffdcb6, 0, 0, 1.05, 0.85, 2);
  s.position.set(m(x), ceil - 0.02, m(y));
  s.target.position.set(m(x), 0, m(y));
  s.userData.base = small ? 0.7 : 1;
  scene.add(s, s.target);
  downs.push(s);
 }
 for (const [x, y] of D.points?.fan ?? []) {
  const f = new T.Group();
  cyl(f, 0.09, 0.12, 0, -0.12, 0, mat(C.black), 16);
  cyl(f, 0.012, 0.25, 0, -0.25, 0, mat(C.black), 6);
  for (let a = 0; a < 3; a++) {const b = box(f, 0.55, 0.012, 0.11, Math.cos(a * 2.094) * 0.32, -0.08, Math.sin(a * 2.094) * 0.32, mat(C.black, {rough: 0.5}), false); b.rotation.y = -a * 2.094;}
  f.position.set(m(x), ceil, m(y));
  ceiling.add(f);
 }
 ceiling.visible = false;
 scene.add(ceiling);

 // Walls with window and door openings, dark skirting along the bottom
 const walls = new T.Group();
 scene.add(walls);
 let paintPick = Math.min(PAINT.length - 1, +store.get('paint', 0) || 0);
 const wallMat = new T.MeshStandardMaterial({color: PAINT[paintPick].c, roughness: 0.92});
 const glassMat = mat(C.glass, {opacity: 0.16, rough: 0.02}), fluted = mat('#e3eaea', {opacity: 0.55, rough: 0.35}), frameMat = mat('#2b2b2b', {metal: 0.3, rough: 0.45}), sillMat = mat('#e9e4da', {rough: 0.4}), skirt = mat(C.skirting, {rough: 0.5});
 const segBox = (horiz, fixed, from, to, yb, yt, material, th, shadow = true) => {
  const len = m(to - from), mid = m((from + to) / 2);
  return box(walls, horiz ? len : th, yt - yb, horiz ? th : len, horiz ? mid : m(fixed), yb, horiz ? m(fixed) : mid, material, shadow);
 };
 W.forEach(([x1, y1, x2, y2, t], idx) => {
  if (NOT_WALLS.has(idx)) return;
  const horiz = Math.abs(y2 - y1) < Math.abs(x2 - x1), a0 = Math.min(horiz ? x1 : y1, horiz ? x2 : y2), a1 = Math.max(horiz ? x1 : y1, horiz ? x2 : y2);
  const fixed = horiz ? (y1 + y2) / 2 : (x1 + x2) / 2, thick = m(t === 'p' ? 75 : t === 'g' ? 50 : 120);
  const cuts = [...WINDOWS.filter(w => w[0] === idx).map(w => ({from: w[1], to: w[2], sill: w[3], head: w[4]})), ...BAYS.filter(b => b[0] === idx).map(b => ({from: b[1], to: b[2], bay: true})), ...GAPS.filter(g => g[0] === idx).map(g => ({from: g[1], to: g[2], sill: 0, head: DOOR_H}))].sort((p, q) => p.from - q.from);
  const seg = (from, to, yb, yt, material, th = thick, shadow = true) => segBox(horiz, fixed, from, to, yb, yt, material, th, shadow);
  if (t === 'g') { // the new kitchen glass sliding door: black slim frame, fluted glass
   seg(a0, a1, 0, ceil - 0.04, fluted, 0.02, false);
   const n = Math.max(1, Math.round((a1 - a0) / 450)); for (let i = 0; i <= n; i++) {const p = a0 + (a1 - a0) * i / n; seg(p - 15, p + 15, 0, ceil, frameMat, 0.05);}
   seg(a0, a1, ceil - 0.04, ceil, frameMat, 0.05);
   return;
  }
  let at = a0 - (t === 'p' ? 37 : 60);
  const end = a1 + (t === 'p' ? 37 : 60);
  const solid = (from, to) => {if (to <= from) return; seg(from, to, 0, ceil, wallMat); seg(from, to, 0, 0.08, skirt, thick + 0.016, false);};
  for (const c of cuts) {
   solid(at, c.from);
   if (c.bay) {at = c.to; continue;}
   if (c.sill > 0) {seg(c.from, c.to, 0, m(c.sill), wallMat); seg(c.from - 20, c.to + 20, m(c.sill), m(c.sill) + 0.03, sillMat, thick + 0.12);}
   seg(c.from, c.to, m(c.head), ceil, wallMat);
   if (c.sill > 0) {
    seg(c.from, c.to, m(c.sill) + 0.03, m(c.head), glassMat, 0.012, false);
    const panes = Math.max(2, Math.round((c.to - c.from) / 900));
    for (let i = 0; i <= panes; i++) {const p = c.from + (c.to - c.from) * i / panes; seg(p - 20, p + 20, m(c.sill) + 0.03, m(c.head), frameMat, 0.05);}
    seg(c.from, c.to, m(c.head) - 0.04, m(c.head), frameMat, 0.05);
   }
   at = c.to;
  }
  solid(at, end);
 });
 for (const [x1, y1, x2, y2] of EXTRA_WALLS) {
  const horiz = Math.abs(y2 - y1) < Math.abs(x2 - x1);
  segBox(horiz, horiz ? y1 : x1, Math.min(horiz ? x1 : y1, horiz ? x2 : y2), Math.max(horiz ? x1 : y1, horiz ? x2 : y2), 0, ceil, wallMat, 0.12);
 }

 // Bay windows with a sitting ledge (KY and KS): solid ledge, glass out at the bay line, bulkhead above.
 const ledgeMat = mat(C.ledge, {rough: 0.35}), cushions = new T.Group(), nookLamps = [];
 scene.add(cushions);
 const cushionOn = store.get('cushion', '1') === '1';
 cushions.visible = cushionOn;
 for (const [, x0, x1, gy, wy, top, head, room] of BAYS) {
  const face = wy + 60, w = m(x1 - x0), cx = m((x0 + x1) / 2), depth = m(face - gy);
  box(walls, w, m(top) - 0.03, depth, cx, 0, m((gy + face) / 2), wallMat);
  box(walls, w, 0.08, depth + 0.01, cx, 0, m((gy + face) / 2) + 0.005, skirt, false);
  box(walls, w + 0.01, 0.03, depth + 0.03, cx, m(top) - 0.03, m((gy + face) / 2) + 0.015, ledgeMat);
  box(walls, w, ceil - m(head), depth + 0.07, cx, m(head), m((gy - 70 + face) / 2), wallMat);
  // glass and slim frames
  box(walls, w, m(head) - m(top), 0.012, cx, m(top), m(gy), glassMat, false);
  const panes = Math.max(2, Math.round((x1 - x0) / 900));
  for (let i = 0; i <= panes; i++) box(walls, 0.04, m(head) - m(top), 0.05, m(x0 + (x1 - x0) * i / panes), m(top), m(gy), frameMat);
  box(walls, w, 0.04, 0.05, cx, m(head) - 0.04, m(gy), frameMat);
  box(walls, w, 0.03, 0.05, cx, m(top), m(gy), frameMat);
  // custom seat cushion + back pillows
  const fab = mat(room === 'ky' ? '#cfc6b8' : '#c9cdc4', {rough: 1}), seatD = depth - 0.06;
  soft(cushions, w - 0.04, 0.08, seatD, cx, m(top), m(gy) + 0.03 + seatD / 2, fab, 0.035);
  soft(cushions, 0.45, 0.42, 0.14, m(x0) + 0.1, m(top) + 0.09, m(gy) + seatD / 2 + 0.03, mat('#eee8dd', {rough: 1}), 0.07).rotation.y = Math.PI / 2 - 0.25;
  soft(cushions, 0.45, 0.42, 0.14, m(x1) - 0.1, m(top) + 0.09, m(gy) + seatD / 2 + 0.03, mat('#eee8dd', {rough: 1}), 0.07).rotation.y = -Math.PI / 2 + 0.25;
  soft(cushions, 0.38, 0.36, 0.12, m(x1) - 0.32, m(top) + 0.08, m(gy) + seatD / 2 + 0.05, mat(room === 'ky' ? '#a98e6c' : '#8b9a8c', {rough: 1}), 0.06).rotation.y = -Math.PI / 2 + 0.6;
  // warm LED strip hidden under the window head (reading light)
  const strip = box(walls, w - 0.1, 0.012, 0.02, cx, m(head) - 0.02, m(gy) + 0.12, mat('#fff6dc', {glow: '#ffd9a8', glowI: 0}), false);
  strip.userData.cove = true;
  const ra = new T.RectAreaLight(0xffd9a8, 0, w - 0.1, 0.04);
  ra.position.set(cx, m(head) - 0.03, m(gy) + 0.14);
  ra.lookAt(cx, 0, m(gy) + 0.3);
  ra.userData.base = 60;
  scene.add(ra);
  nookLamps.push(ra);
 }

 // Living room curtains: white sheers and oatmeal day curtains gathered at each side of the window
 const lw = WINDOWS.find(w => w[0] === 9);
 if (lw) {
  const y = m(W[9][1]) + 0.16, pleats = (g, x0, x1, z, colour, op) => {
   const n = Math.max(3, Math.round((x1 - x0) / 90));
   for (let i = 0; i < n; i++) cyl(g, m((x1 - x0) / n) * 0.62, ceil - 0.07, m(x0 + (x1 - x0) * (i + 0.5) / n), 0.02, z, mat(colour, {rough: 1, opacity: op}), 10).castShadow = op == null;
  };
  for (const [x0, x1] of [[lw[1] - 250, lw[1] + 250], [lw[2] - 250, lw[2] + 250]]) {
   pleats(scene, x0, x1, y + 0.08, C.curtain);
   pleats(scene, x0 - 100, x1 + 100, y - 0.02, C.sheer, 0.7);
  }
  box(scene, m(lw[2] - lw[1]) + 0.8, 0.03, 0.18, m((lw[1] + lw[2]) / 2), ceil - 0.06, y + 0.03, mat('#e9e4da'));
 }
 // Living room cove: hidden LED strip along the ceiling over the TV wall and the window
 const coves = [];
 const coveStrip = (x, z, len, alongX, face) => {
  const s = box(scene, alongX ? len : 0.02, 0.012, alongX ? 0.02 : len, x, ceil - 0.12, z, mat('#fff6dc', {glow: '#ffd9a8', glowI: 0}), false);
  s.userData.cove = true;
  const ra = new T.RectAreaLight(0xffd9a8, 0, alongX ? len : 0.05, alongX ? 0.05 : len);
  ra.position.set(x, ceil - 0.1, z);
  ra.lookAt(x + face[0] * 0.5, 0, z + face[1] * 0.5);
  ra.userData.base = 20;
  scene.add(ra);
  coves.push(ra);
  box(scene, alongX ? len : 0.3, 0.1, alongX ? 0.3 : len, x - face[0] * 0.12, ceil - 0.1, z - face[1] * 0.12, mat('#fbfaf7', {rough: 1}));
 };
 coveStrip(m(12470 - 60) - 0.16, m(4050), m(3900), false, [-1, 0]);
 coveStrip(m(10600), m(1980 + 60) + 0.16, m(3600), true, [0, 1]);
 // KX wardrobe strip light
 const kxw = items.find(i => i.kind === 'lwardrobe' && i.on !== false);
 if (kxw) {
  const ra = new T.RectAreaLight(0xffd9a8, 0, 1.6, 0.05);
  ra.position.set(m(kxw.x), 2.58, m(kxw.y));
  ra.lookAt(m(kxw.x), 0, m(kxw.y));
  ra.userData.base = 3;
  scene.add(ra);
  coves.push(ra);
 }

 // Doors (shown open), with a frame strip at the hinge
 for (const [hx, hy, ex, ey, kind] of DOORS) {
  const len = Math.hypot(ex - hx, ey - hy), d = box(scene, m(len), m(DOOR_H), 0.04, m((hx + ex) / 2), 0, m((hy + ey) / 2), mat(kind === 'main' ? C.main : kind === 'steel' ? C.steel : C.door, {rough: 0.45}), true, 0.004);
  d.rotation.y = -Math.atan2(ey - hy, ex - hx);
  const handle = new T.Mesh(new T.BoxGeometry(0.12, 0.02, 0.02), mat('#c8c2b6', {metal: 0.9, rough: 0.25}));
  handle.position.set(m(len) / 2 - 0.08, -m(DOOR_H) / 2 + 1.0, 0.045);
  d.add(handle);
  const h2 = handle.clone(); h2.position.z = -0.045; d.add(h2);
 }
 // Built-in counters
 for (const [x1, y1, x2, y2, h] of COUNTERS) {
  soft(scene, m(x2 - x1), m(h) - 0.04, m(y2 - y1), m((x1 + x2) / 2), 0, m((y1 + y2) / 2), mat(C.cabinet, {rough: 0.5}), 0.005);
  if (h < 1500) box(scene, m(x2 - x1) + 0.01, 0.04, m(y2 - y1) + 0.01, m((x1 + x2) / 2), m(h) - 0.04, m((y1 + y2) / 2), mat(C.counter, {rough: 0.25}));
 }

 // Furniture
 const pick = [], pendants = [], coveMeshes = [];
 for (const it of items) {
  if (it.on === false || it.kind === 'wifi' || it.kind === 'dock') continue;
  const s = sizeOf(it);
  if (!s) continue;
  const g = build(it, s, it.kind === 'sofa' ? C.fabric : (D.colours[it.room] ?? '#8a8f9a'));
  g.position.set(m(it.x), 0, m(it.y));
  g.rotation.y = -(it.r || 0) * Math.PI / 180;
  g.traverse(o => {if (o.isMesh) {o.userData.item = it; if (o.userData.pendant) pendants.push(o);} if (o.userData?.cove) coveMeshes.push(o);});
  scene.add(g);
  pick.push(g);
 }
 scene.traverse(o => {if (o.userData?.cove && !coveMeshes.includes(o)) coveMeshes.push(o);});
 // Dining pendant light
 const pend = pendants[0] ? new T.PointLight(0xffd9a8, 0, 0, 2) : null;
 if (pend) {pendants[0].getWorldPosition(pend.position); pend.position.y -= 0.12; scene.add(pend);}

 // ---- Light scenes ----
 let sceneIdx = Math.min(SCENES.length - 1, +store.get('scene', 0) || 0);
 const applyScene = i => {
  sceneIdx = i;
  const S = SCENES[i], col = new T.Color(KELVIN[S.k] ?? '#ffffff'), warm = new T.Color(KELVIN[2700]);
  sun.intensity = S.sun; sun.visible = S.sun > 0;
  hemi.intensity = S.sky * (walk.on ? 2 : 1);
  scene.environmentIntensity = S.env;
  scene.background = S.sun ? skyDay : skyNight;
  renderer.toneMappingExposure = S.exp;
  for (const s of downs) {s.color.copy(col); s.intensity = S.down * 20 * s.userData.base;}
  bulbMat.emissive.copy(S.down ? col : new T.Color('#fff1dc')); bulbMat.emissiveIntensity = S.down ? 6 : 0.2;
  const coveCol = S.k >= 4000 ? col : warm;
  for (const r of coves) {r.color.copy(coveCol); r.intensity = S.cove * r.userData.base;}
  for (const r of nookLamps) {r.color.copy(warm); r.intensity = S.lamp * r.userData.base;}
  for (const o of coveMeshes) {o.material.emissive.copy(coveCol); o.material.emissiveIntensity = (S.cove || S.lamp) ? 3 : 0;}
  if (pend) {pend.color.copy(warm); pend.intensity = S.lamp * 1.2; pendants[0].material.emissiveIntensity = S.lamp ? 0.8 : 0;}
  $$('[data-scene]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.scene === i)));
  $('[data-scene-tip]').textContent = S.tip;
  store.set('scene', i);
  tagLine();
  draw();
 };
 const applyVinyl = i => {
  vinylPick = i;
  vinylMap.dispose();
  vinylMap = vinylTex(VINYL[i]);
  vinylMat.map = vinylMap; vinylMat.needsUpdate = true;
  $$('[data-vinyl]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.vinyl === i)));
  $('[data-vinyl-note]').textContent = `${VINYL[i].n} · XingFloors ${VINYL[i].r}: ${VINYL[i].note}`;
  store.set('vinyl', VINYL[i].id);
  tagLine();
  draw();
 };
 const applyPaint = i => {
  paintPick = i;
  wallMat.color.set(PAINT[i].c);
  $$('[data-paint]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.paint === i)));
  $('[data-paint-note]').textContent = PAINT[i].note;
  store.set('paint', i);
  tagLine();
  draw();
 };
 const tagLine = () => {tag.textContent = `Floor: ${VINYL[vinylPick].n} · Walls: ${PAINT[paintPick].n.replace('Nippon ', '')} · ${SCENES[sceneIdx].n.replace(' ★', '')}`;};

 // ---- Camera: orbit from above, or walk inside at eye height ----
 const orbit = {target: new T.Vector3(m(D.W / 2), 0, m(D.H / 2)), dist: 15, yaw: 0.5, pitch: 0.95};
 const walk = {on: false, pos: new T.Vector3(), yaw: 0, pitch: 0, eye: 1.6};
 const bounds = {x0: 0.3, x1: m(D.W) - 0.3, z0: 0.3, z1: m(D.H) - 0.3};
 const place = () => {
  if (walk.on) {
   walk.pitch = Math.max(-1.2, Math.min(1.2, walk.pitch));
   walk.pos.x = Math.max(bounds.x0, Math.min(bounds.x1, walk.pos.x));
   walk.pos.z = Math.max(bounds.z0, Math.min(bounds.z1, walk.pos.z));
   camera.position.set(walk.pos.x, walk.eye, walk.pos.z);
   camera.lookAt(walk.pos.x - Math.sin(walk.yaw) * Math.cos(walk.pitch), walk.eye + Math.sin(walk.pitch), walk.pos.z - Math.cos(walk.yaw) * Math.cos(walk.pitch));
  } else {
   orbit.pitch = Math.max(0.12, Math.min(1.45, orbit.pitch));
   orbit.dist = Math.max(1, Math.min(30, orbit.dist));
   camera.position.set(orbit.target.x + orbit.dist * Math.cos(orbit.pitch) * Math.sin(orbit.yaw), orbit.target.y + orbit.dist * Math.sin(orbit.pitch), orbit.target.z + orbit.dist * Math.cos(orbit.pitch) * Math.cos(orbit.yaw));
   camera.lookAt(orbit.target);
  }
  draw();
 };
 const roomBox = id => {
  if (id === 'all') return [0, 0, D.W, D.H];
  const r = D.rooms.find(x => x.id === id);
  if (!r) return null;
  const xs = r.boxes.flatMap(([x, , w]) => [x, x + w]), ys = r.boxes.flatMap(([, y, , h]) => [y, y + h]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
 };
 let room = 'all';
 const setWalk = on => {
  walk.on = on;
  ceiling.visible = on;
  hemi.intensity = SCENES[sceneIdx].sky * (on ? 2 : 1);
  $('[data-walk]').setAttribute('aria-pressed', String(on));
  $('[data-move]').hidden = !on;
  help.textContent = on ? 'Drag to look around. Hold ▲ ▼ to walk. Tap furniture for its photo and size.' : 'Drag to turn, pinch or scroll to zoom. Tap furniture for its photo and size.';
 };
 const goRoom = id => {
  room = id;
  const b = roomBox(id);
  if (!b) return;
  if (walk.on) {
   const [x, y, lx, ly] = SPAWN[id] ?? [b[0] + b[2] / 2, b[1] + b[3] / 2, b[0] + b[2] / 2, b[1]];
   walk.pos.set(m(x), 0, m(y));
   walk.yaw = Math.atan2(-(lx - x), -(ly - y)); walk.pitch = -0.1; walk.eye = 1.6;
  } else {
   orbit.target.set(m(b[0] + b[2] / 2), 0.4, m(b[1] + b[3] / 2));
   orbit.dist = Math.max(5.5, m(Math.max(b[2], b[3])) * (id === 'all' ? (camera.aspect < 1 ? 0.88 : 1.05) : 2.1));
   // Whole home starts square to the 2D plan (top of the plan = far side), so the two views line up.
   // Room views look down steeply so the near walls don't hide the room.
   orbit.pitch = id === 'all' ? 1.2 : 1.12;
   orbit.yaw = id === 'all' ? 0 : 0.35;
  }
  place();
 };
 const pressRoom = id => $$('[data-room]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.room === id)));
 const sofaView = () => {
  const sofa = items.find(i => i.id === 'living-sofa-l'), tv = items.find(i => i.id === 'living-tv');
  if (!sofa || !tv) return;
  setWalk(true);
  const back = m((sizeOf(sofa)?.d ?? 900) / 2 - 300), dx = m(tv.x - sofa.x), dz = m(tv.y - sofa.y), dist = Math.hypot(dx, dz);
  walk.pos.set(m(sofa.x) - dx / dist * back, 0, m(sofa.y) - dz / dist * back);
  walk.yaw = Math.atan2(-dx, -dz);
  walk.eye = 1.1; walk.pitch = -0.02;
  place();
 };
 // Stand in KY and look at the window seat
 const nookView = () => {
  setWalk(true);
  const [, x0, x1, gy] = BAYS[0];
  // from the left side of KY (the bed takes the right half), looking across the seat to the window
  walk.pos.set(m(x0) + 0.25, 0, m(3000));
  walk.yaw = Math.atan2(-0.75, m(3000 - gy)); walk.eye = 1.5; walk.pitch = -0.3;
  room = 'ky'; pressRoom('ky');
  place();
 };

 // ---- Drawing: fast frame while moving; ambient-occlusion "photo" frame when the view rests ----
 let composer = null, aoTimer = 0, alive = true;
 const makeComposer = () => {
  try {
   composer = new T.EffectComposer(renderer);
   composer.addPass(new T.RenderPass(scene, camera));
   const ao = new T.GTAOPass(scene, camera, 512, 512);
   ao.updateGtaoMaterial({radius: 0.45, distanceExponent: 1.5, thickness: 1.2, scale: 1, samples: 16});
   ao.blendIntensity = 0.85;
   composer.addPass(ao);
   composer.addPass(new T.OutputPass());
   composer.addPass(new T.SMAAPass());
  } catch {composer = null;}
 };
 function draw() {
  if (!alive) return;
  renderer.render(scene, camera);
  clearTimeout(aoTimer);
  aoTimer = setTimeout(() => {if (!alive) return; if (!composer) makeComposer(); if (composer) {sizeComposer(); composer.render();}}, 350);
 }
 const sizeComposer = () => {if (composer) {const s = renderer.getSize(new T.Vector2()); composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(s.x, s.y);}};

 // Pointer input
 const ptrs = new Map();
 let pinch = 0, moved = 0;
 canvas.addEventListener('pointerdown', e => {canvas.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved = 0;});
 canvas.addEventListener('pointermove', e => {
  if (!ptrs.has(e.pointerId)) return;
  const [px, py] = ptrs.get(e.pointerId);
  ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  if (ptrs.size === 1) {
   const dx = e.clientX - px, dy = e.clientY - py;
   if (walk.on) {walk.yaw += dx * 0.005; walk.pitch += dy * 0.004;}
   else {orbit.yaw -= dx * 0.008; orbit.pitch += dy * 0.006;}
   moved += Math.abs(dx) + Math.abs(dy);
   place();
  } else if (ptrs.size === 2) {
   const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
   if (pinch) {if (walk.on) step((d - pinch) * 0.01); else {orbit.dist *= pinch / d; place();}}
   pinch = d;
   moved = 99;
  }
 });
 const up = e => {
  ptrs.delete(e.pointerId);
  if (ptrs.size < 2) pinch = 0;
  if (e.type === 'pointerup' && moved < 6) tap(e);
 };
 canvas.addEventListener('pointerup', up);
 canvas.addEventListener('pointercancel', up);
 canvas.addEventListener('wheel', e => {e.preventDefault(); if (walk.on) step(-e.deltaY * 0.002); else {orbit.dist *= Math.exp(e.deltaY * 0.001); place();}}, {passive: false});
 function step(dist) {walk.pos.x -= Math.sin(walk.yaw) * dist; walk.pos.z -= Math.cos(walk.yaw) * dist; place();}
 let hold = 0, holdDir = 0;
 const loop = () => {if (!holdDir) return; step(holdDir * 0.04); hold = requestAnimationFrame(loop);};
 $$('[data-step]').forEach(b => {
  b.addEventListener('pointerdown', e => {e.preventDefault(); holdDir = +b.dataset.step; cancelAnimationFrame(hold); loop();});
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, () => {holdDir = 0;});
  b.addEventListener('keydown', e => {if (e.key === 'Enter' || e.key === ' ') {e.preventDefault(); step(+b.dataset.step * 0.4);}});
 });

 const ray = new T.Raycaster(), esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
 function tap(e) {
  const r = canvas.getBoundingClientRect();
  ray.setFromCamera(new T.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
  const hit = ray.intersectObjects(pick, true)[0];
  const it = hit?.object.userData.item;
  if (!it) {card.hidden = true; return;}
  const s = sizeOf(it), p = productOf(D, it);
  card.innerHTML = `${p?.img ? `<img src="${esc(p.img)}" alt="">` : ''}<div><b>${esc(it.name)}</b><span>${esc(p?.name ?? s?.n ?? '')}</span><small>${Math.round(s.w / 10)} × ${Math.round(s.d / 10)} cm${p?.price ? ` · ${esc(p.price)}` : ''}</small></div><button type="button" aria-label="Hide">×</button>`;
  card.querySelector('button').onclick = () => {card.hidden = true;};
  card.hidden = false;
 }

 function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(1, h);
  // About 70° side to side, like a person's view, even on a narrow phone screen.
  camera.fov = Math.max(45, Math.min(100, 2 * Math.atan(Math.tan(35 * Math.PI / 180) / camera.aspect) * 180 / Math.PI));
  camera.updateProjectionMatrix();
  sizeComposer();
  draw();
 }
 const ro = new ResizeObserver(resize);
 ro.observe(stage);

 $$('[data-room]').forEach(b => b.onclick = () => {pressRoom(b.dataset.room); goRoom(b.dataset.room);});
 $('[data-walk]').onclick = () => {setWalk(!walk.on); goRoom(room);};
 $('[data-sofa]').onclick = () => {pressRoom('living'); room = 'living'; sofaView();};
 $('[data-nook]').onclick = nookView;
 $('[data-low]').onclick = e => {
  const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
  e.currentTarget.setAttribute('aria-pressed', String(on));
  walls.children.forEach(w => {w.visible = !on || w.position.y < 0.7;});
  draw();
 };
 $('[data-finish]').onclick = e => {
  const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
  e.currentTarget.setAttribute('aria-pressed', String(on));
  $('[data-sheet]').hidden = !on;
 };
 $$('[data-scene]').forEach(b => b.onclick = () => applyScene(+b.dataset.scene));
 $$('[data-vinyl]').forEach(b => b.onclick = () => applyVinyl(+b.dataset.vinyl));
 $$('[data-paint]').forEach(b => b.onclick = () => applyPaint(+b.dataset.paint));
 $('[data-cushion]').onclick = e => {
  cushions.visible = !cushions.visible;
  e.currentTarget.setAttribute('aria-pressed', String(cushions.visible));
  store.set('cushion', cushions.visible ? '1' : '0');
  draw();
 };
 $('[data-photo]').onclick = () => {
  clearTimeout(aoTimer);
  if (!composer) makeComposer();
  if (composer) {sizeComposer(); composer.render();} else renderer.render(scene, camera);
  const a = document.createElement('a');
  a.download = `lacasa-3d-${room}-${VINYL[vinylPick].id}-${SCENES[sceneIdx].id}.png`;
  a.href = canvas.toDataURL('image/png');
  a.click();
 };
 const close = () => {
  alive = false;
  clearTimeout(aoTimer);
  holdDir = 0;
  ro.disconnect();
  vinylMap.dispose(); tileMap.dispose(); bathMap.dispose(); envTex.dispose(); pmrem.dispose();
  composer?.dispose?.();
  renderer.dispose();
  box3.remove();
  ui = null;
  document.documentElement.classList.remove('p3d-open');
  document.removeEventListener('keydown', key);
  prevFocus?.focus?.();
 };
 const key = e => {
  if (e.key === 'Escape') close();
  else if (walk.on && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {e.preventDefault(); step(e.key === 'ArrowUp' ? 0.3 : -0.3);}
 };
 document.addEventListener('keydown', key);
 $('[data-x]').onclick = close;
 $('[data-x]').focus();
 ui = {close};
 applyVinyl(vinylPick);
 applyPaint(paintPick);
 applyScene(sceneIdx);
 resize();
 goRoom('all');
 // For the site's own checks and screenshots: open straight into a view, e.g. #3d=nook&scene=1
 const q = new URLSearchParams(location.hash.slice(1));
 if (q.get('scene')) applyScene(+q.get('scene'));
 if (q.get('vinyl')) applyVinyl(Math.max(0, VINYL.findIndex(v => v.id === q.get('vinyl'))));
 if (q.get('3d') === 'nook') nookView();
 else if (q.get('3d') === 'sofa') $('[data-sofa]').click();
 else if (q.get('3d') && SPAWN[q.get('3d')]) {if (q.get('walk')) setWalk(true); pressRoom(q.get('3d')); goRoom(q.get('3d'));}
}
