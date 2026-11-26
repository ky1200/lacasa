// 3D view of the floor plan, built from the same walls, rooms and furniture as the 2D plan (mm → metres).
// Loaded only when someone taps "3D view". Shapes are drawn from real sizes; finishes follow the mood board.
// Realism: image-based light (RoomEnvironment), Khronos PBR Neutral tone mapping (true product colours),
// soft shadows, procedural vinyl/tile textures from real XingFloors swatch colours, and an ambient-occlusion
// pass (GTAO + SMAA) drawn whenever the view stops moving.
import * as T from '/vendor/three-0.187.0-e.js';

const m = v => v / 1000;
const DOOR_H = 2100;

// ---- House details traced from the I-Niche plan (mm, same coordinates as the 2D plan) ----
// Windows: [wall index, from, to (along the wall), sill height, head height]
// KY (bedroom 3) and KS (bedroom 2) have bay windows: the glass sits about 56 cm out from the inner wall,
// over a solid ledge at sill height. Those are drawn by bay() below, not cut into the wall.
// A 6th value 'frost' = frosted glass (bathrooms). Common bathroom (wall 19): high window over the shower; its left pane
// becomes a frosted acrylic panel with a KDK window-mount ventilation fan (K, 27 Nov).
const WINDOWS = [[1, 800, 1950, 1000, 2100, 'frost'], [9, 9200, 12300, 400, 2400], [20, 9100, 10300, 1000, 2100], [19, 4900, 5860, 1500, 2100, 'frost']];
// Bay windows: [wall index, from, to (along the wall), glass line, inner wall line, ledge top, window head, room, vertical wall?]
// KX (main bedroom) has the same ledge on its side wall (K, 27 Nov): glass about 54 cm out from the inner wall.
const BAYS = [[3, 3062, 5520, 950, 1460, 500, 2300, 'ky'], [5, 5640, 8560, 950, 1500, 500, 2300, 'ks'], [14, 5900, 7700, 1950, 2490, 500, 2300, 'kx', true]];
// Door openings cut into a wall: [wall index, from, to]
const GAPS = [[30, 11120, 12200]];
// Walls that are really door leaves on the plan
const NOT_WALLS = new Set([8]);
// Short wall pieces the plan shows but the wall list leaves out: [x1, y1, x2, y2]
const EXTRA_WALLS = [[2990, 870, 2990, 1400], [8620, 870, 8620, 1980], [1890, 5840, 2490, 5840], [1890, 7760, 2490, 7760]];
// Kitchen–dining wall (K's photo, 27 Nov): a low white wall with clear glass above, so the kitchen looks into the dining.
// [wall index, low wall height mm, glass top mm]
const GLASS_ABOVE = [[25, 1050, 2400]];
// Door leaves shown open: [hinge x, hinge y, end x, end y, kind]
// KY door (updated plan, 26 Nov): at the bottom of the 745 mm passage, hinged by KS's wall, opening into the passage.
const DOORS = [[5450, 5090, 5450, 4420, 'room'], [5850, 4170, 5850, 4960, 'room'], [4704, 5342, 3804, 5342, 'room'], [6800, 6235, 6800, 7020, 'room'], [2117, 4060, 2117, 3260, 'room'], [7594, 9000, 7594, 9780, 'steel'], [12200, 11285, 12200, 10205, 'main']];
// Built-in kitchen and yard counters: [x1, y1, x2, y2, height]
// Kitchen (galley): sink run against the dining wall, hob run along the bottom wall (ends where the fridge space starts),
// tall store cabinet (ST) by the entrance. The yard has a small wall-hung sink (K's photo), robot dock under it.
const COUNTERS = [[7650, 10160, 9660, 10780, 900], [8890, 8310, 10960, 9047, 900], [10600, 10050, 10960, 10780, 2100]];
// Where to stand when walking into each room: [x, y, look at x, look at y]
const SPAWN = {all: [11700, 10300, 10500, 4000], living: [10500, 5900, 10600, 2000], dining: [11300, 6350, 9800, 9300], kitchen: [10700, 9500, 8300, 10300], ky: [5100, 4250, 3400, 2300], ks: [7000, 4700, 7000, 1200], kx: [3600, 4500, 2300, 6900], 'common-bath': [6550, 6500, 5100, 7900], yard: [7250, 9350, 6250, 10700]};
const FLOOR = {ky: 'vinyl', ks: 'vinyl', kx: 'vinyl', 'master-bath': 'bath', 'common-bath': 'bath', yard: 'bath', hs: 'plain'};
const ROOMS = [['all', 'Whole home'], ['living', 'Living'], ['dining', 'Dining'], ['kitchen', 'Kitchen'], ['ky', 'KY'], ['ks', 'KS'], ['kx', 'KX']];
const C = {door: '#6a2a20', main: '#4a2a1c', steel: '#9aa0a3', fabric: '#cdbca5', bed: '#bdb4a8', linen: '#f4f1ea', oak: '#d6b98f', walnut: '#5b3a29', black: '#1e1e1e', white: '#f6f6f3', stone: '#d8d2c6', steelApp: '#c9ccce', vanity: '#4b3426', glass: '#cfe3ea', curtain: '#d9ccb6', sheer: '#f7f5f0', counter: '#e4e0d8', cabinet: '#ece7dd', skirting: '#3a2620', ledge: '#e4ddd2'};

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
// KDK F40GP (picked on /buy): 100 cm, three wide swept blades, small matte dark-brown body, round LED light in the middle.
function kdkFan(g, top) {
 const brown = mat('#4a403b', {rough: 0.6, metal: 0.1}), y0 = top - 0.03;
 cyl(g, 0.07, 0.03, 0, y0, 0, brown, 32);
 cyl(g, 0.018, 0.08, 0, y0 - 0.08, 0, brown, 12);
 const pts = [[0, 0], [0.12, 0], [0.135, 0.03], [0.14, 0.07], [0.125, 0.1], [0.09, 0.115], [0, 0.118]].map(([r, y]) => new T.Vector2(r, y));
 const hub = new T.Mesh(new T.LatheGeometry(pts, 40), brown);
 hub.position.y = y0 - 0.2; hub.castShadow = true; g.add(hub);
 const led = cyl(g, 0.095, 0.012, 0, y0 - 0.212, 0, mat('#fffaf0', {glow: '#fff3df', glowI: 0.9, rough: 0.4}), 40);
 led.castShadow = false;
 const sh = new T.Shape();
 sh.moveTo(0.1, -0.035); sh.bezierCurveTo(0.22, -0.11, 0.38, -0.12, 0.49, -0.05); sh.bezierCurveTo(0.52, -0.02, 0.5, 0.02, 0.46, 0.03); sh.bezierCurveTo(0.34, 0.05, 0.2, 0.06, 0.1, 0.035); sh.lineTo(0.1, -0.035);
 const bg = new T.ExtrudeGeometry(sh, {depth: 0.008, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.004, bevelSegments: 2, curveSegments: 24});
 bg.rotateX(Math.PI / 2);
 for (let a = 0; a < 3; a++) {
  const b = new T.Mesh(bg, brown); b.position.y = y0 - 0.13; b.rotation.set(0, a * 2.0944, 0); b.rotateX(0.12); b.castShadow = true; g.add(b);
 }
 return g;
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

// V Haus C9060 dining chair (from the order photo): walnut frame with splayed tapered legs, light upholstered seat,
// oval upholstered back pad on a curved walnut rail. Size estimated (to check at V Haus): 46 × 50 cm, seat 46 cm, back 80 cm.
function chairC9060(g, x, z, rot) {
 const c = new T.Group(), wood = mat(C.walnut, {rough: 0.45}), fab = mat('#d9d1c4', {rough: 1});
 for (const sx of [-1, 1]) for (const sz of [-1, 1]) {const l = cyl(c, 0.017, 0.44, sx * 0.19, 0, sz * 0.2, wood, 10, 0.012); l.rotation.set(sz * 0.06, 0, -sx * 0.06);}
 for (const sz of [-1, 1]) box(c, 0.4, 0.04, 0.025, 0, 0.36, sz * 0.2, wood);
 for (const sx of [-1, 1]) box(c, 0.025, 0.04, 0.4, sx * 0.19, 0.36, 0, wood);
 soft(c, 0.46, 0.06, 0.48, 0, 0.4, 0.01, fab, 0.025);
 for (const sx of [-1, 1]) {const p = box(c, 0.03, 0.4, 0.03, sx * 0.19, 0.44, -0.215, wood); p.rotation.x = -0.12;}
 const rail = box(c, 0.44, 0.04, 0.03, 0, 0.66, -0.25, wood); rail.rotation.x = -0.12;
 const back = soft(c, 0.44, 0.22, 0.07, 0, 0.62, -0.235, fab, 0.035); back.rotation.x = -0.14; back.scale.x = 1.04;
 c.position.set(x, 0, z);
 c.rotation.y = rot;
 g.add(c);
}

// ---- One builder per kind of furniture ----
function build(it, s, colour) {
 const g = new T.Group(), w = m(s.w), d = m(s.d), k = it.kind;
 if (k === 'bed') {
  // Dunlopillo storage frame (photo: mauve-grey fabric, 41 cm, hydraulic lift) + Carlton / Richmond Signature mattress
  // (photo: dark charcoal top panel, grey quilted sides). Headboard only where ordered (KX has none).
  const fh = 0.41, mh = m(it.mattress ?? 300), top = fh + mh, fab = mat('#7a6e74', {rough: 1});
  soft(g, w + 0.08, fh - 0.03, d + 0.06, 0, 0.03, 0.02, fab, 0.03);
  box(g, w, 0.03, d, 0, 0, 0.02, mat('#3a3436', {rough: 0.8}), false);
  soft(g, w + 0.1, 0.05, d + 0.08, 0, fh - 0.05, 0.02, mat('#6e6268', {rough: 1}), 0.02);
  soft(g, w, mh - 0.05, d, 0, fh, 0.02, mat('#8b8789', {rough: 0.95}), 0.05);
  soft(g, w - 0.01, 0.06, d - 0.01, 0, top - 0.06, 0.02, mat('#38363a', {rough: 0.9}), 0.05);
  box(g, 0.2, 0.05, 0.004, w * 0.25, fh + mh * 0.4, d / 2 + 0.022, mat('#c06a2a', {rough: 0.6}), false);
  if (it.headboard !== false) {
   soft(g, w + 0.16, 1.15, 0.1, 0, 0, -d / 2 - 0.05, fab, 0.04);
   soft(g, w + 0.02, 0.6, 0.04, 0, top + 0.05, -d / 2 + 0.005, mat('#857880', {rough: 1}), 0.03);
  }
  const pw = w > 1.3 ? (w - 0.2) / 2 : w - 0.12;
  for (const px of (w > 1.3 ? [-(pw / 2 + 0.04), pw / 2 + 0.04] : [0])) soft(g, pw, 0.13, 0.42, px, top - 0.01, -d / 2 + 0.29, mat('#f4f2ee', {rough: 1}), 0.06);
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
  } else { // IKEA ÖRTRÄSK (photo): soft oval brown-ash top on four thick round legs
   const ash = mat('#6f4b33', {rough: 0.65}), sh = new T.Shape(), rx = w / 2, rz = d / 2, rr = rz * 0.95;
   sh.moveTo(-rx + rr, -rz); sh.lineTo(rx - rr, -rz); sh.absarc(rx - rr, 0, rz, -Math.PI / 2, Math.PI / 2, false); sh.lineTo(-rx + rr, rz); sh.absarc(-rx + rr, 0, rz, Math.PI / 2, Math.PI * 1.5, false);
   const tg = new T.ExtrudeGeometry(sh, {depth: 0.03, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 3, curveSegments: 40}); tg.rotateX(Math.PI / 2);
   const top = new T.Mesh(tg, ash); top.position.y = 0.45; top.castShadow = top.receiveShadow = true; g.add(top);
   for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(g, 0.038, 0.42, sx * (w / 2 - 0.2), 0, sz * (d / 2 - 0.14), ash, 20);
  }
 } else if (k === 'tv') {
  // LG OLED B5 (photo): very thin dark panel, slim bezel, deeper box low on the back.
  const hgt = w * 0.5625;
  soft(g, w, hgt, 0.012, 0, 0.75, 0.01, mat('#1a1a1c', {rough: 0.3, metal: 0.4}), 0.003);
  box(g, w * 0.55, hgt * 0.4, 0.035, 0, 0.78, -0.012, mat('#202022', {rough: 0.5}), false);
  box(g, w - 0.01, hgt - 0.012, 0.002, 0, 0.756, 0.017, mat('#06070a', {rough: 0.05, metal: 0.2}), false);
  // TV console as drawn on the I-Niche plan: about 210 × 42 cm, against the TV wall; 35 cm high, floating 20 cm up (assumed)
  soft(g, 2.1, 0.35, 0.42, 0, 0.2, -m(s.d) / 2 - 0.025 + 0.21, mat('#c9a77d', {rough: 0.55}), 0.01);
  for (let i = 1; i < 4; i++) box(g, 0.004, 0.33, 0.004, -1.05 + 2.1 * i / 4, 0.21, -m(s.d) / 2 - 0.025 + 0.422, mat('#a88760'), false);
 } else if (k === 'table') {
  // LINO T160: 160 × 90 cm sintered stone top, 75 cm high, on two walnut-colour slab legs (order photo). 6 chairs ordered, 4 at the table.
  soft(g, w, 0.04, d, 0, 0.71, 0, mat('#d9d3c9', {rough: 0.3}), 0.012);
  for (const sx of [-1, 1]) {soft(g, 0.16, 0.69, d * 0.62, sx * w * 0.27, 0.02, 0, mat(C.walnut, {rough: 0.45}), 0.01); box(g, 0.24, 0.02, d * 0.66, sx * w * 0.27, 0, 0, mat('#3d271c', {rough: 0.5}));}
  for (const cx of [-w * 0.25, w * 0.25]) {chairC9060(g, cx, -d / 2 - 0.295, 0); chairC9060(g, cx, d / 2 + 0.295, Math.PI);}
  // No dining pendant (K, 27 Nov): the KDK fan with its LED light is the dining light.
 } else if (k === 'desk') {
  if (it.id === 'ks-desk') { // IKEA LAGKAPTEN / ALEX (photo): white-stained oak top, ALEX drawer unit left, white legs right
   const wht = mat('#f4f4f1', {rough: 0.5});
   soft(g, w, 0.025, d, 0, 0.71, 0, mat('#d8c3a0', {rough: 0.6}), 0.004);
   soft(g, 0.36, 0.7, d - 0.02, -w / 2 + 0.19, 0, 0, wht, 0.004);
   for (let i = 1; i < 5; i++) box(g, 0.34, 0.004, 0.003, -w / 2 + 0.19, 0.7 * i / 5, d / 2 - 0.008, mat('#d6d6d2'), false);
   for (const sz of [-1, 1]) cyl(g, 0.018, 0.71, w / 2 - 0.05, 0, sz * (d / 2 - 0.05), wht, 12);
  } else if (it.id === 'kx-vanity') { // IKEA MALM dressing table (photo): white, panel legs, slim drawer
   const wht = mat('#f6f6f4', {rough: 0.4});
   soft(g, w, 0.04, d, 0, 0.74, 0, wht, 0.004);
   for (const sx of [-1, 1]) box(g, 0.04, 0.74, d, sx * (w / 2 - 0.02), 0, 0, wht);
   box(g, w - 0.08, 0.1, d - 0.02, 0, 0.64, 0, wht);
  } else { // KY's own Secretlab MAGNUS Pro: black metal desk, monitor
   soft(g, w, 0.03, d, 0, 0.72, 0, mat(C.black, {rough: 0.5}), 0.005);
   for (const sx of [-1, 1]) box(g, 0.06, 0.72, d - 0.1, sx * (w / 2 - 0.1), 0, 0, mat('#2a2a2a', {metal: 0.4, rough: 0.5}));
   soft(g, 0.6, 0.35, 0.03, 0, 0.88, -d / 2 + 0.15, mat('#111111', {rough: 0.3}), 0.005);
  }
 } else if (k === 'chair') {
  // Office chair (IKEA MARKUS for KS, KY's own SIHOO M57): 5-star base on castors, mesh back with headrest, armrests.
  const blk = mat('#232323', {rough: 0.7}), mesh = mat('#1b1b1b', {rough: 0.9, opacity: 0.92});
  for (let a = 0; a < 5; a++) {const l = box(g, 0.3, 0.025, 0.04, Math.cos(a * 1.2566) * 0.15, 0.06, Math.sin(a * 1.2566) * 0.15, blk); l.rotation.y = -a * 1.2566; cyl(g, 0.025, 0.05, Math.cos(a * 1.2566) * 0.3, 0.01, Math.sin(a * 1.2566) * 0.3, blk, 12);}
  cyl(g, 0.025, 0.36, 0, 0.08, 0, mat('#555555', {metal: 0.7, rough: 0.3}), 12);
  soft(g, 0.5, 0.08, 0.48, 0, 0.44, 0.02, blk, 0.03);
  const back = soft(g, 0.46, 0.62, 0.04, 0, 0.56, -0.23, mesh, 0.02); back.rotation.x = -0.12;
  soft(g, 0.3, 0.14, 0.05, 0, 1.2, -0.29, blk, 0.02).rotation.x = -0.12;
  for (const sx of [-1, 1]) {box(g, 0.03, 0.2, 0.03, sx * 0.25, 0.48, 0, blk); soft(g, 0.06, 0.03, 0.24, sx * 0.25, 0.68, 0.02, blk, 0.01);}
 } else if (k === 'toilet') {
  // RIGEL Gallant one-piece rimless (photo): smooth rounded cistern joined to the bowl, soft-close lid, glossy white.
  const wh = mat('#fbfbf9', {rough: 0.12}), cw = Math.min(w, 0.36);
  const foot = cyl(g, w / 2 - 0.05, 0.33, 0, 0, d * 0.02, wh, 40, w / 2 - 0.08); foot.scale.z = (d * 0.62) / (w - 0.1);
  const bowl = cyl(g, w / 2 - 0.08, 0.08, 0, 0.33, d * 0.06, wh, 40, w / 2 - 0.02); bowl.scale.z = (d * 0.72) / (w - 0.04);
  const lid = cyl(g, w / 2 - 0.015, 0.03, 0, 0.41, d * 0.07, wh, 40); lid.scale.z = (d * 0.7) / (w - 0.03);
  soft(g, cw, 0.36, d * 0.3, 0, 0.36, -d / 2 + d * 0.15, wh, 0.06);
  soft(g, cw - 0.03, 0.05, d * 0.28, 0, 0.72, -d / 2 + d * 0.15, wh, 0.03);
  cyl(g, 0.022, 0.006, 0, 0.77, -d / 2 + d * 0.15, mat('#c7cacc', {metal: 0.9, rough: 0.2}), 20);
 } else if (k === 'basin') {
  // RIGEL vanity (photo BC7437 / BC1260): dark brown wall-hung cabinet with drawers, thick cream integrated basin top,
  // gunmetal single-lever mixer; IKEA ENHET mirror cabinet (white, 2 mirror doors, 75 cm high) above it.
  const rim = m(it.rim ?? 850), brown = mat('#4a3328', {rough: 0.5}), drawers = w > 0.65 ? 2 : 1, ch = 0.45;
  soft(g, w, ch, d - 0.02, 0, rim - 0.07 - ch, -0.01, brown, 0.008);
  for (let i = 1; i < drawers; i++) box(g, w - 0.01, 0.006, 0.004, 0, rim - 0.07 - ch * i / drawers, d / 2 - 0.008, mat('#2c1f18'), false);
  box(g, w * 0.5, 0.012, 0.01, 0, rim - 0.1, d / 2 - 0.012, mat('#2c1f18', {rough: 0.6}), false);
  soft(g, w + 0.01, 0.07, d + 0.01, 0, rim - 0.07, 0, mat('#efe7da', {rough: 0.2}), 0.012);
  const bowl = box(g, w * 0.62, 0.005, d * 0.55, 0, rim - 0.002, 0.03, mat('#e3d9ca', {rough: 0.15}), false); bowl.receiveShadow = true;
  box(g, 0.035, 0.18, 0.035, 0, rim, -d / 2 + 0.07, mat('#4d4a47', {metal: 0.85, rough: 0.3}));
  box(g, 0.025, 0.025, 0.12, 0, rim + 0.155, -d / 2 + 0.12, mat('#4d4a47', {metal: 0.85, rough: 0.3}));
  const cw = Math.min(0.6, w), cab = mat('#f4f4f2', {rough: 0.5});
  box(g, cw, 0.75, 0.17, 0, rim + 0.3, -d / 2 + 0.085, cab);
  for (const sx of [-1, 1]) box(g, cw / 2 - 0.006, 0.73, 0.004, sx * cw / 4, rim + 0.31, -d / 2 + 0.172, mat('#dfe8ec', {rough: 0.03, metal: 0.9}), false);
 } else if (k === 'mjtable') {
  const t = m(Math.min(s.t ?? 800, s.w, s.d));
  box(g, t, 0.03, t, 0, 0.73, 0, mat('#2f6b4a', {rough: 1}));
  legs(g, t, t, 0.73, 0.04, 0.015, mat('#555555', {metal: 0.5}));
  for (let a = 0; a < 4; a++) chairSimple(g, Math.sin(a * Math.PI / 2) * (t / 2 + 0.25), Math.cos(a * Math.PI / 2) * (t / 2 + 0.25), a * Math.PI / 2 + Math.PI, '#9c9890', '#555555');
 } else if (k === 'stool') {
  // IKEA KYRRE (photo): birch, rounded-triangle seat, three bent legs.
  const birch = mat('#e1c9a3', {rough: 0.5}), r = Math.min(w, d) / 2;
  const seat = cyl(g, r, 0.025, 0, 0.43, 0, birch, 3); seat.geometry = new T.CylinderGeometry(r, r, 0.025, 48); seat.scale.set(1, 1, 0.92);
  for (let a = 0; a < 3; a++) {const l = box(g, 0.04, 0.44, 0.03, Math.cos(a * 2.094 + 0.5) * r * 0.62, 0, Math.sin(a * 2.094 + 0.5) * r * 0.62, birch); l.rotation.y = -(a * 2.094 + 0.5); l.rotation.z = 0.08;}
 } else if (k === 'wardrobe') {
  if (it.id === 'ky-wardrobe') { // IKEA GURSKEN (photo): one beige door, small round knob, low legs
   const beige = mat('#e6e0d0', {rough: 0.55});
   soft(g, w, 1.84, d, 0, 0.05, 0, beige, 0.006);
   legs(g, w, d, 0.05, 0.04, 0.012, mat('#d8d2c2'));
   cyl(g, 0.012, 0.02, w / 2 - 0.06, 1.05, d / 2 + 0.008, mat('#cfc9b9'), 16).rotation.x = Math.PI / 2;
  } else { // IKEA PAX / FORSAND (photo): white, 201 cm, flat doors without handles (push-open)
   soft(g, w, 2.01, d, 0, 0, 0, mat('#f5f5f2', {rough: 0.5}), 0.004);
   const doors = Math.max(1, Math.round(w / 0.375 / 2) * 2) || 2;
   for (let i = 1; i < doors; i++) box(g, 0.003, 1.99, 0.003, -w / 2 + w * i / doors, 0.01, d / 2 + 0.002, mat('#d6d6d2'), false);
  }
 } else if (k === 'lwardrobe') {
  const t = m(s.t ?? 600), body = mat('#cfc8bc', {rough: 0.5}), hgt = 2.7, n = Math.max(2, Math.round((w - t) / 0.5));
  box(g, w, hgt, t, 0, 0, -d / 2 + t / 2, body);
  box(g, t, hgt, d - t, -w / 2 + t / 2, 0, t / 2, body);
  // V Haus ALTO (photo): full-height greige doors, long slim black bar handles
  for (let i = 1; i < n; i++) box(g, 0.003, hgt - 0.02, 0.003, -w / 2 + t + (w - t) * i / n, 0.01, -d / 2 + t + 0.002, mat('#9a948a'), false);
  for (let i = 1; i < n; i += 2) for (const dx of [-0.03, 0.03]) box(g, 0.012, 1.2, 0.02, -w / 2 + t + (w - t) * i / n + dx, 0.55, -d / 2 + t + 0.012, mat('#151515', {metal: 0.5, rough: 0.4}), false);
  for (let i = 1; i < 4; i++) box(g, 0.003, hgt - 0.02, 0.003, t / 2 + 0.002, 0.01, -d / 2 + t + (d - t) * i / 4, mat('#9a948a'), false);
  const strip = box(g, w - t, 0.02, 0.01, t / 2, 2.62, -d / 2 + t + 0.006, mat('#fff6dc', {glow: '#ffd9a8', glowI: 1}), false);
  strip.userData.cove = true;
 } else if (k === 'fridge') {
  // Hitachi 2-door (photo): glossy white, freezer door on top, recessed side grips.
  const fh = m(s.h ?? 1770), wht = mat('#f3f3f1', {rough: 0.15, metal: 0.05});
  soft(g, w, fh, d - 0.04, 0, 0, -0.02, mat('#e2e2df', {rough: 0.3}), 0.01);
  soft(g, w - 0.004, fh * 0.29 - 0.006, 0.05, 0, fh * 0.71, d / 2 - 0.03, wht, 0.012);
  soft(g, w - 0.004, fh * 0.71 - 0.016, 0.05, 0, 0.01, d / 2 - 0.03, wht, 0.012);
  for (const [y0, hh] of [[fh * 0.73, 0.2], [fh * 0.45, 0.3]]) box(g, 0.012, hh, 0.012, w / 2 - 0.012, y0, d / 2 - 0.004, mat('#c9c9c6'), false);
 } else if (k === 'washer') {
  // LG FX1412S2KA (picked on /buy): 60 × 56.5 × 85 cm, dark body, big round door with a chrome ring, panel along the top.
  const h = m(s.h ?? 850), body = mat('#2c2e31', {rough: 0.35, metal: 0.25}), fz = d / 2;
  soft(g, w, h - 0.02, d, 0, 0.02, 0, body, 0.012);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(g, 0.02, 0.02, sx * (w / 2 - 0.05), 0, sz * (d / 2 - 0.05), mat('#111111'), 10);
  box(g, w - 0.02, 0.1, 0.006, 0, h - 0.13, fz + 0.002, mat('#1b1c1e', {rough: 0.2}), false);
  box(g, 0.2, 0.06, 0.006, -w / 2 + 0.13, h - 0.11, fz + 0.005, mat('#3a3c40', {rough: 0.3}), false);
  box(g, 0.09, 0.03, 0.004, 0.06, h - 0.1, fz + 0.006, mat('#0a0a0a', {glow: '#ff6a3d', glowI: 0.6}), false);
  cyl(g, 0.025, 0.012, w / 2 - 0.12, h - 0.11, fz + 0.004, mat('#bfc3c7', {metal: 0.9, rough: 0.25}), 20).rotation.x = Math.PI / 2;
  const ring = new T.Mesh(new T.TorusGeometry(0.215, 0.022, 14, 48), mat('#b9bdc2', {metal: 0.9, rough: 0.22}));
  ring.position.set(0, h * 0.47, fz + 0.012); ring.castShadow = true; g.add(ring);
  const door = new T.Mesh(new T.CircleGeometry(0.2, 48), mat('#1d2a33', {opacity: 0.85, rough: 0.05, metal: 0.3}));
  door.position.set(0, h * 0.47, fz + 0.014); g.add(door);
  box(g, 0.12, 0.08, 0.004, w / 2 - 0.11, 0.05, fz + 0.002, mat('#25272a', {rough: 0.4}), false);
 } else if (k === 'dock') {
  // Dreame X50 Ultra (picked on /buy): tall black base station with a dark bronze band, ramp in front, robot parked on it.
  const black = mat('#141516', {rough: 0.35, metal: 0.2}), tw = Math.min(w, 0.34), td = 0.32, th = 0.59;
  box(g, tw + 0.02, 0.012, d, 0, 0, 0, mat('#1c1d1f', {rough: 0.5}));
  soft(g, tw, th, td, 0, 0.012, -d / 2 + td / 2, black, 0.02);
  box(g, tw + 0.002, 0.12, td + 0.002, 0, 0.27, -d / 2 + td / 2, mat('#6d6458', {metal: 0.7, rough: 0.35}), false);
  box(g, tw - 0.04, 0.02, 0.004, 0, 0.32, -d / 2 + td + 0.002, mat('#a89a85', {metal: 0.8, rough: 0.3}), false);
  const bot = cyl(g, 0.175, 0.1, 0, 0.014, d / 2 - 0.19, mat('#1e1f21', {rough: 0.3, metal: 0.2}), 40);
  cyl(g, 0.165, 0.004, 0, 0.114, d / 2 - 0.19, mat('#2a2b2d', {rough: 0.15, metal: 0.3}), 40);
  cyl(g, 0.012, 0.004, 0.06, 0.118, d / 2 - 0.19, mat('#c9b68f', {metal: 0.8, rough: 0.3}), 16);
  void bot;
 } else if (k === 'dispenser') {
  // LG PuriCare WD518AN (photo): slim silver-white tower on the counter, dark touch panel, swivel nozzle.
  const sil = mat('#dcdcda', {rough: 0.3, metal: 0.4}), top = 0.9;
  soft(g, w, 0.38, d, 0, top, 0, sil, 0.03);
  box(g, w - 0.02, 0.1, 0.004, 0, top + 0.26, d / 2 + 0.002, mat('#1c1d20', {rough: 0.1}), false);
  box(g, 0.04, 0.04, 0.12, 0, top + 0.2, d / 2 + 0.06, sil);
  box(g, w * 0.8, 0.01, 0.16, 0, top, d / 2 - 0.08, mat('#9a9a98', {metal: 0.6}), false);
 } else if (k === 'cfan') {
  // Fanco DC Dono 16" (photo): black mount + motor, three wood-grain blades, tilted down from high on the wall.
  const blk = mat('#151515', {rough: 0.4}), wood = mat('#6e4a32', {rough: 0.6}), y = 2.25;
  box(g, 0.1, 0.06, 0.1, 0, y + 0.12, -d / 2 + 0.05, blk);
  const arm = new T.Mesh(new T.TorusGeometry(0.1, 0.012, 8, 24, Math.PI), blk); arm.position.set(0, y, -d / 2 + 0.12); arm.rotation.y = Math.PI / 2; g.add(arm);
  const head = new T.Group(); head.position.set(0, y, -d / 2 + 0.16); head.rotation.x = 0.45; g.add(head);
  cyl(head, 0.07, 0.12, 0, -0.06, 0, blk, 24).rotation.x = Math.PI / 2;
  for (let a = 0; a < 3; a++) {const b = soft(head, 0.11, 0.18, 0.012, 0, 0.12, 0.07, wood, 0.05); b.geometry.translate(0, 0, 0); const pv = new T.Group(); pv.add(b); b.position.set(0, 0.13, 0.07); pv.rotation.z = a * 2.094; head.add(pv);}
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

// Real 3D models made from the product photos (Microsoft TRELLIS.2, 26 Nov 2026; meshopt + webp, ~0.5 MB each).
// The drawn shape shows first; the model replaces it once loaded, scaled to the item's real width, depth and height.
const MODELS = {sofa: {url: '/models/vhaus-2233a-sofa.glb', h: it => m(it.h ?? 850), tint: '#fff1df', lift: 1.25, mirror: true}};
let gltf = null;
const loader = () => gltf ??= (() => {const l = new T.GLTFLoader(); l.setMeshoptDecoder(T.MeshoptDecoder); return l;})();
function swapModel(g, it, s) {
 const spec = MODELS[it.kind];
 loader().loadAsync(spec.url).then(res => {
  const obj = res.scene, b = new T.Box3().setFromObject(obj), size = b.getSize(new T.Vector3()), mid = b.getCenter(new T.Vector3());
  // V Haus photo: armrest on the viewer's left. The drawn sofa puts the arm at +x unless flipped, so mirror to match.
  const sx = m(s.w) / size.x * (spec.mirror && !s.flip ? -1 : 1);
  obj.position.set(-mid.x * sx, -b.min.y * spec.h(it) / size.y, -mid.z * m(s.d) / size.z);
  obj.scale.set(sx, spec.h(it) / size.y, m(s.d) / size.z);
  obj.traverse(o => {if (o.isMesh) {o.castShadow = o.receiveShadow = true; o.userData.item = it; o.material = o.material.clone(); o.material.metalness = 0; o.material.metalnessMap = null; o.material.roughness = 0.95; if (spec.tint) o.material.color.set(spec.tint).multiplyScalar(spec.lift ?? 1);}});
  for (const c of [...g.children]) {g.remove(c); c.geometry?.dispose();}
  g.add(obj);
  g.userData.redraw?.();
 }).catch(() => {});
}

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
<div class="p3d-row"><button type="button" data-finish aria-pressed="false">Floor, paint, lights</button><button type="button" data-walk aria-pressed="false">Walk inside</button><button type="button" data-sofa>Sit on the sofa</button><button type="button" data-nook>Window seat</button><button type="button" data-top>Top view</button><button type="button" data-low aria-pressed="false">Low walls</button></div>
<p class="p3d-help" data-help>Drag to turn, pinch or scroll to zoom. Tap furniture for its photo and size.</p></div>`;
 document.body.append(box3);
 const prevFocus = document.activeElement;
 document.documentElement.classList.add('p3d-open');
 const $ = s => box3.querySelector(s), $$ = s => box3.querySelectorAll(s);
 const canvas = $('canvas'), stage = $('.p3d-stage'), card = $('[data-card]'), help = $('[data-help]'), tag = $('[data-tag]');

 const renderer = new T.WebGLRenderer({canvas, antialias: true, preserveDrawingBuffer: true});
 renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1));
 renderer.shadowMap.enabled = true;
 renderer.shadowMap.autoUpdate = false;
 renderer.shadowMap.needsUpdate = true;
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
 const ceiling = new T.Group(), fans = new T.Group();
 scene.add(fans);
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
 }
 // Real light sources: one or two per room (every light costs time on each pixel, so 20 separate
 // downlights made the view slow). Each stands for that room's downlights together.
 const byRoom = new Map();
 for (const [x, y] of lightPts) {const r = roomAt(x, y) ?? 'other'; if (!byRoom.has(r)) byRoom.set(r, []); byRoom.get(r).push([x, y]);}
 for (const [room, pts] of byRoom) {
  const small = ['master-bath', 'common-bath', 'yard', 'hall', 'entrance'].includes(room);
  const sorted = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), groups = pts.length > 3 ? [sorted.slice(0, sorted.length >> 1), sorted.slice(sorted.length >> 1)] : [sorted];
  for (const g of groups) {
   const x = g.reduce((a, p) => a + p[0], 0) / g.length, y = g.reduce((a, p) => a + p[1], 0) / g.length;
   const sp = new T.SpotLight(0xffdcb6, 0, 0, 1.2, 0.9, 2);
   sp.position.set(m(x), ceil - 0.02, m(y));
   sp.target.position.set(m(x), 0, m(y));
   sp.userData.base = (small ? 0.7 : 1) * Math.sqrt(g.length) * 1.1;
   sp.visible = false;
   scene.add(sp, sp.target);
   downs.push(sp);
  }
 }
 for (const [x, y] of D.points?.fan ?? []) {
  const f = kdkFan(new T.Group(), 0);
  f.position.set(m(x), ceil, m(y));
  fans.add(f); // fans stay visible in every view (the ceiling itself only shows when walking)
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
  const cuts = [...WINDOWS.filter(w => w[0] === idx).map(w => ({from: w[1], to: w[2], sill: w[3], head: w[4], frost: w[5] === 'frost'})), ...BAYS.filter(b => b[0] === idx).map(b => ({from: b[1], to: b[2], bay: true})), ...GAPS.filter(g => g[0] === idx).map(g => ({from: g[1], to: g[2], sill: 0, head: DOOR_H}))].sort((p, q) => p.from - q.from);
  const seg = (from, to, yb, yt, material, th = thick, shadow = true) => segBox(horiz, fixed, from, to, yb, yt, material, th, shadow);
  if (t === 'g') { // the new kitchen glass sliding door: black slim frame, fluted glass
   seg(a0, a1, 0, ceil - 0.04, fluted, 0.02, false);
   const n = Math.max(1, Math.round((a1 - a0) / 450)); for (let i = 0; i <= n; i++) {const p = a0 + (a1 - a0) * i / n; seg(p - 15, p + 15, 0, ceil, frameMat, 0.05);}
   seg(a0, a1, ceil - 0.04, ceil, frameMat, 0.05);
   return;
  }
  const ga = GLASS_ABOVE.find(x => x[0] === idx);
  if (ga) { // low wall + clear glass panels in slim frames up to the bulkhead
   const lo = m(ga[1]), hi = m(ga[2]);
   seg(a0 - 60, a1 + 60, 0, lo, wallMat); seg(a0 - 60, a1 + 60, 0, 0.08, skirt, thick + 0.016, false);
   seg(a0 - 60, a1 + 60, lo, lo + 0.03, sillMat, thick + 0.02);
   seg(a0, a1, lo + 0.03, hi, glassMat, 0.012, false);
   const n = Math.max(2, Math.round((a1 - a0) / 800)); for (let i = 0; i <= n; i++) {const p = a0 + (a1 - a0) * i / n; seg(p - 12, p + 12, lo + 0.03, hi, mat('#d9d9d6', {metal: 0.6, rough: 0.35}), 0.03, false);}
   seg(a0 - 60, a1 + 60, hi, ceil, wallMat);
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
    seg(c.from, c.to, m(c.sill) + 0.03, m(c.head), c.frost ? fluted : glassMat, 0.012, false);
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
// Bay boxes in "along / across" terms so the same code draws horizontal (KY, KS) and vertical (KX) walls.
 for (const [, x0, x1, gy, wy, top, head, room, vert] of BAYS) {
  const B = (g, al, h, ac, ca, y, cc, mt, sh) => vert ? box(g, ac, h, al, m(cc * 1000), y, m(ca * 1000), mt, sh) : box(g, al, h, ac, m(ca * 1000), y, m(cc * 1000), mt, sh);
  const face = wy + 60, w = m(x1 - x0), ca = (x0 + x1) / 2000, depth = m(face - gy), cc = (gy + face) / 2000;
  B(walls, w, m(top) - 0.03, depth, ca, 0, cc, wallMat);
  B(walls, w, 0.08, depth + 0.01, ca, 0, cc + 0.005, skirt, false);
  B(walls, w + 0.01, 0.03, depth + 0.03, ca, m(top) - 0.03, cc + 0.015, ledgeMat);
  B(walls, w, ceil - m(head), depth + 0.07, ca, m(head), (gy - 70 + face) / 2000, wallMat);
  // glass and slim frames
  B(walls, w, m(head) - m(top), 0.012, ca, m(top), gy / 1000, glassMat, false);
  const panes = Math.max(2, Math.round((x1 - x0) / 900));
  for (let i = 0; i <= panes; i++) B(walls, 0.04, m(head) - m(top), 0.05, (x0 + (x1 - x0) * i / panes) / 1000, m(top), gy / 1000, frameMat);
  B(walls, w, 0.04, 0.05, ca, m(head) - 0.04, gy / 1000, frameMat);
  B(walls, w, 0.03, 0.05, ca, m(top), gy / 1000, frameMat);
  // custom seat cushion + back pillows
  const fab = mat(room === 'ky' ? '#cfc6b8' : room === 'kx' ? '#d6cbbd' : '#c9cdc4', {rough: 1}), seatD = depth - 0.06, turn = vert ? -Math.PI / 2 : 0;
  const S = (al, h, ac, ca2, y, cc2, mt, r, rot) => {const o = vert ? soft(cushions, al, h, ac, cc2, y, ca2, mt, r) : soft(cushions, al, h, ac, ca2, y, cc2, mt, r); o.rotation.y = (rot ?? 0) + turn; return o;};
  S(w - 0.04, 0.08, seatD, ca, m(top), gy / 1000 + 0.03 + seatD / 2, fab, 0.035);
  S(0.45, 0.42, 0.14, x0 / 1000 + 0.1, m(top) + 0.09, gy / 1000 + seatD / 2 + 0.03, mat('#eee8dd', {rough: 1}), 0.07, Math.PI / 2 - 0.25);
  S(0.45, 0.42, 0.14, x1 / 1000 - 0.1, m(top) + 0.09, gy / 1000 + seatD / 2 + 0.03, mat('#eee8dd', {rough: 1}), 0.07, -Math.PI / 2 + 0.25);
  // warm LED strip hidden under the window head (reading light)
  const strip = B(walls, w - 0.1, 0.012, 0.02, ca, m(head) - 0.02, gy / 1000 + 0.12, mat('#fff6dc', {glow: '#ffd9a8', glowI: 0}), false);
  strip.userData.cove = true;
  const ra = new T.RectAreaLight(0xffd9a8, 0, w - 0.1, 0.04), P = (a, c) => vert ? [c, a] : [a, c];
  {const [px, pz] = P(ca, gy / 1000 + 0.14); ra.position.set(px, m(head) - 0.03, pz); const [lx, lz] = P(ca, gy / 1000 + 0.3); ra.lookAt(lx, 0, lz);}
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
 // Coveless cove: an LED profile recessed in the ceiling right at the wall line, round every wall of the room.
 // Drawn as a thin glowing line plus a soft wash fading down the walls (glow, not real lights, so it stays fast).
 const coves = [], COVE_ROOMS = [['living', 'dining'], ['ky'], ['ks'], ['kx']], WASH_H = 0.8;
 const washTex = canvasTex((g, w, h) => {const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.05, 'rgba(255,255,255,0.8)'); gr.addColorStop(0.22, 'rgba(255,255,255,0.38)'); gr.addColorStop(0.55, 'rgba(255,255,255,0.1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);}, 4, 256);
 const washMat = new T.MeshBasicMaterial({map: washTex, color: '#ffd9a8', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false});
 const coveGroup = new T.Group(), washes = new T.Group();
 scene.add(coveGroup, washes);
 const coveLineMat = mat('#f1ece3', {glow: '#ffd9a8', glowI: 0});
 for (const ids of COVE_ROOMS) {
  const boxes = ids.flatMap(id => D.rooms.find(r => r.id === id)?.boxes ?? []);
  for (const b of boxes) {
   const [bx, by, bw, bh] = b;
   for (const [x1, y1, x2, y2, nx, ny] of [[bx, by, bx + bw, by, 0, 1], [bx, by + bh, bx + bw, by + bh, 0, -1], [bx, by, bx, by + bh, 1, 0], [bx + bw, by, bx + bw, by + bh, -1, 0]]) {
    const horiz = y1 === y2;
    let segs = [[horiz ? x1 : y1, horiz ? x2 : y2]];
    // leave out stretches that open into another part of the same room
    for (const o of boxes) if (o !== b) {
     const [ox, oy, ow, oh] = o, onLine = horiz ? y1 >= oy - 30 && y1 <= oy + oh + 30 : x1 >= ox - 30 && x1 <= ox + ow + 30, [c0, c1] = horiz ? [ox, ox + ow] : [oy, oy + oh];
     if (onLine) segs = segs.flatMap(([a, z]) => [[a, Math.min(z, c0)], [Math.max(a, c1), z]].filter(([p, q]) => q - p > 150));
    }
    // no wash over window glass
    for (const [wi, from, to] of [...WINDOWS, ...BAYS]) {
     const [wx1, wy1, wx2, wy2] = W[wi], wh = Math.abs(wy2 - wy1) < Math.abs(wx2 - wx1), fixed = wh ? (wy1 + wy2) / 2 : (wx1 + wx2) / 2;
     if (wh === horiz && Math.abs(fixed - (horiz ? y1 : x1)) < 250) segs = segs.flatMap(([a, z]) => [[a, Math.min(z, from - 60)], [Math.max(a, to + 60), z]].filter(([p, q]) => q - p > 150));
    }
    for (const [a, z] of segs) {
     const len = m(z - a), mid = m((a + z) / 2), inset = 0.05;
     const px = horiz ? mid : m(x1) + nx * inset, pz = horiz ? m(y1) + ny * inset : mid;
     const wash = new T.Mesh(new T.PlaneGeometry(len, WASH_H), washMat);
     wash.position.set(px, ceil - WASH_H / 2 - 0.004, pz);
     wash.rotation.y = horiz ? (ny > 0 ? 0 : Math.PI) : (nx > 0 ? Math.PI / 2 : -Math.PI / 2);
     wash.renderOrder = 2;
     washes.add(wash);
     const line = box(coveGroup, horiz ? len : 0.025, 0.012, horiz ? 0.025 : len, px, ceil - 0.012, pz, coveLineMat, false);
     line.userData.cove = true;
    }
   }
  }
 }
 washes.visible = false;

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
 // ---- Common bathroom (K's reference, 27 Nov): half-height tiled wall with a niche and clear glass on top between the
 // toilet and the shower, RIGEL gunmetal thermostatic shower set on the side wall, bidet spray, paper holder, towel bar,
 // service duct beside the toilet, and the high window with a KDK ventilation fan in a frosted acrylic panel.
 {
  const tile = mat('#d8c8b0', {rough: 0.45}), gun = mat('#4d4a47', {metal: 0.85, rough: 0.3}), Y = v => m(v);
  // service duct (the X box on the plan)
  box(scene, Y(5097 - 4835), ceil, Y(7058 - 6344), Y((4835 + 5097) / 2), 0, Y((6344 + 7058) / 2), wallMat);
  // half wall 1.1 m with a 30 × 30 cm niche on the shower side
  const x0 = 5180, x1 = 5910, yc = 7140, th = 0.1, hw = 1.1, nx0 = 5400, nx1 = 5700, nb = 0.6, nt = 0.9, nd = 0.07;
  const wallPart = (a, b, y0, y1, depth, zc) => box(scene, Y(b - a), y1 - y0, depth, Y((a + b) / 2), y0, zc, tile);
  wallPart(x0, x1, 0, nb, th, Y(yc)); wallPart(x0, x1, nt, hw, th, Y(yc));
  wallPart(x0, nx0, nb, nt, th, Y(yc)); wallPart(nx1, x1, nb, nt, th, Y(yc));
  wallPart(nx0, nx1, nb, nt, th - nd, Y(yc) - nd / 2);
  box(scene, Y(x1 - x0) + 0.02, 0.02, th + 0.02, Y((x0 + x1) / 2), hw, Y(yc), mat('#efe9df', {rough: 0.3}));
  // clear glass panel on top, slim U-channel
  box(scene, Y(x1 - x0), 0.92, 0.01, Y((x0 + x1) / 2), hw + 0.02, Y(yc), glassMat, false);
  box(scene, Y(x1 - x0), 0.03, 0.03, Y((x0 + x1) / 2), hw + 0.02, Y(yc), mat('#c9ccce', {metal: 0.85, rough: 0.25}), false);
  // shower set on the left wall (inner face x ≈ 4835) at y 7636: thermostatic bar, riser, rain head, hand shower
  const wx = Y(4835), sy = Y(7636);
  box(scene, 0.07, 0.07, 0.34, wx + 0.05, 1.02, sy, gun);
  for (const dz of [-0.17, 0.17]) cyl(scene, 0.028, 0.06, wx + 0.05, 1.025, sy + dz, gun, 16).rotation.x = Math.PI / 2;
  cyl(scene, 0.012, 1.0, wx + 0.06, 1.09, sy - 0.05, gun, 12);
  box(scene, 0.3, 0.018, 0.018, wx + 0.06 + 0.15, 2.09, sy - 0.05, gun);
  box(scene, 0.25, 0.012, 0.25, wx + 0.33, 2.06, sy - 0.05, gun);
  box(scene, 0.04, 0.05, 0.05, wx + 0.06, 1.55, sy - 0.05, gun);
  const hs = cyl(scene, 0.016, 0.24, wx + 0.1, 1.42, sy - 0.05, gun, 12); hs.rotation.z = 0.15;
  cyl(scene, 0.045, 0.015, wx + 0.12, 1.66, sy - 0.05, gun, 20).rotation.z = 1.4;
  // bidet spray + holder and paper holder on the half wall's toilet side; towel bar by the door
  box(scene, 0.04, 0.06, 0.03, Y(5320), 0.62, Y(yc) - th / 2 - 0.015, gun);
  cyl(scene, 0.014, 0.16, Y(5320), 0.5, Y(yc) - th / 2 - 0.04, gun, 10);
  box(scene, 0.16, 0.01, 0.1, Y(5720), 0.7, Y(yc) - th / 2 - 0.05, gun);
  cyl(scene, 0.055, 0.11, Y(5720), 0.64, Y(yc) - th / 2 - 0.06, mat('#ffffff', {rough: 0.9}), 20).rotation.z = Math.PI / 2;
  box(scene, 0.02, 0.02, 0.6, Y(6770) - 0.06, 1.15, Y(7400), gun);
  for (const dz of [-0.28, 0.28]) box(scene, 0.06, 0.03, 0.02, Y(6770) - 0.03, 1.145, Y(7400) + dz, gun);
  // KDK window ventilation fan in a frosted acrylic panel (left pane of the high window, wall 19 at y 8020)
  const wy = Y(8020) - 0.03, fx = Y(5100);
  box(scene, 0.4, 0.58, 0.012, fx, 1.52, wy, mat('#f1f2f0', {opacity: 0.88, rough: 0.5}), false);
  box(scene, 0.03, 0.6, 0.05, Y(5300), 1.51, wy, frameMat);
  const ring = new T.Mesh(new T.TorusGeometry(0.13, 0.025, 14, 40), mat('#f4f3ef', {rough: 0.35}));
  ring.position.set(fx, 1.81, wy - 0.02); scene.add(ring);
  const back = new T.Mesh(new T.CircleGeometry(0.115, 40), mat('#8d9093', {rough: 0.8})); back.position.set(fx, 1.81, wy - 0.012); back.rotation.y = Math.PI; scene.add(back);
  for (let a = 0; a < 5; a++) {const b = box(scene, 0.065, 0.1, 0.008, fx, 1.81, wy - 0.03, mat('#fbfaf6', {rough: 0.4}), false); b.position.set(fx + Math.cos(a * 1.2566) * 0.06, 1.76 + Math.sin(a * 1.2566) * 0.06, wy - 0.03); b.rotation.z = a * 1.2566 + 0.5;}
  cyl(scene, 0.035, 0.02, fx, 1.8, wy - 0.035, mat('#f7f6f2', {rough: 0.4}), 20).rotation.x = Math.PI / 2;
  box(scene, 0.002, 0.42, 0.002, fx, 1.27, wy - 0.03, mat('#e8e8e8'), false);
 }
 // ---- Yard (K's photo): small wall-hung ceramic sink on the yard wall, the robot dock sits under it.
 {
  const sx = m(6290), sz = m(10780) - 0.2, white = mat('#f6f6f3', {rough: 0.12}), chrome = mat('#c7cacc', {metal: 0.9, rough: 0.2});
  const bowl = cyl(scene, 0.24, 0.15, sx, 0.7, sz, white, 40, 0.2); bowl.scale.z = 0.85;
  const inner = cyl(scene, 0.2, 0.01, sx, 0.846, sz + 0.01, mat('#e9eae8', {rough: 0.1}), 40); inner.scale.z = 0.78;
  box(scene, 0.44, 0.05, 0.06, sx, 0.8, m(10780) - 0.03, white);
  cyl(scene, 0.015, 0.14, sx - 0.08, 0.85, m(10780) - 0.06, chrome, 12);
  box(scene, 0.012, 0.012, 0.1, sx - 0.08, 0.98, m(10780) - 0.1, chrome);
  cyl(scene, 0.018, 0.2, sx, 0.5, m(10780) - 0.08, chrome, 12);
 }
 // Kitchen as in the listing photo: light worktop, wood-look wall cabinets over the hob run, sink facing the dining glass.
 const wood = mat('#a8825c', {rough: 0.55});
 soft(scene, m(9660 - 7650), 0.72, 0.35, m((7650 + 9660) / 2), 1.5, m(10780) - 0.175, wood, 0.006);
 for (let x = 7650 + 500; x < 9660; x += 500) box(scene, 0.004, 0.7, 0.004, m(x), 1.51, m(10780) - 0.35, mat('#7d5f42'), false);
 soft(scene, 0.6, 0.12, 0.45, m(8600), 1.38, m(10780) - 0.225, mat('#c9ccce', {metal: 0.7, rough: 0.3}), 0.01);
 box(scene, 0.6, 0.012, 0.5, m(8600), 0.9, m(10470), mat('#151515', {rough: 0.1}), false);
 box(scene, 0.48, 0.012, 0.4, m(9800), 0.895, m(8650), mat('#9a9ea1', {metal: 0.85, rough: 0.3}), false);
 cyl(scene, 0.015, 0.3, m(9800), 0.9, m(8420), mat('#c7cacc', {metal: 0.9, rough: 0.2}), 12);

 // Furniture
 const pick = [], pendants = [], coveMeshes = [];
 for (const it of items) {
  if (it.on === false || it.kind === 'wifi') continue;
  const s = sizeOf(it);
  if (!s) continue;
  const g = build(it, s, it.kind === 'sofa' ? C.fabric : (D.colours[it.room] ?? '#8a8f9a'));
  g.position.set(m(it.x), 0, m(it.y));
  g.rotation.y = -(it.r || 0) * Math.PI / 180;
  if (it.kind === 'dock') { // a dock always stands with its back to the nearest wall (saved plans may face it the wrong way)
   const dist = (dx, dy) => {let best = 1e9; for (const [x1, y1, x2, y2] of W) {if (dx && Math.abs(x1 - x2) < 1 && Math.min(y1, y2) <= it.y && it.y <= Math.max(y1, y2)) {const d0 = (x1 - it.x) * dx; if (d0 > 0) best = Math.min(best, d0);} if (dy && Math.abs(y1 - y2) < 1 && Math.min(x1, x2) <= it.x && it.x <= Math.max(x1, x2)) {const d0 = (y1 - it.y) * dy; if (d0 > 0) best = Math.min(best, d0);}} return best;};
   // back direction for r = 0, 90, 180, 270 is -y, +x, +y, -x (front = local +z)
   const opts = [[0, dist(0, -1)], [90, dist(1, 0)], [180, dist(0, 1)], [270, dist(-1, 0)]].sort((p, q) => p[1] - q[1]);
   g.rotation.y = -opts[0][0] * Math.PI / 180;
  }
  g.traverse(o => {if (o.isMesh) {o.userData.item = it; if (o.userData.pendant) pendants.push(o);} if (o.userData?.cove) coveMeshes.push(o);});
  scene.add(g);
  pick.push(g);
  g.userData.redraw = () => changed();
  if (MODELS[it.kind] && !it.c) swapModel(g, it, s);
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
  scene.environmentIntensity = S.env;
  scene.background = S.sun ? skyDay : skyNight;
  renderer.toneMappingExposure = S.exp;
  for (const s of downs) {s.color.copy(col); s.intensity = S.down * 20 * s.userData.base; s.visible = S.down > 0;}
  bulbMat.emissive.copy(S.down ? col : new T.Color('#fff1dc')); bulbMat.emissiveIntensity = S.down ? 6 : 0.2;
  const coveCol = S.k >= 4000 ? col : warm;
  washMat.color.copy(coveCol); washMat.opacity = Math.min(1, 0.8 * S.cove); washes.visible = S.cove > 0;
  // light bounced off the washed walls fills the room a little
  hemi.color.set(S.sun ? '#fff8ee' : coveCol); hemi.intensity = S.sky * (walk.on ? 2 : 1) + (S.sun ? 0 : 0.35 * S.cove);
  for (const r of nookLamps) {r.color.copy(warm); r.intensity = S.lamp * r.userData.base; r.visible = S.lamp > 0;}
  for (const o of coveMeshes) {o.material.emissive.copy(coveCol); o.material.emissiveIntensity = (S.cove || S.lamp) ? 4 : 0;}
  if (pend) {pend.color.copy(warm); pend.intensity = S.lamp * 1.2; pend.visible = S.lamp > 0; pendants[0].material.emissiveIntensity = S.lamp ? 0.8 : 0;}
  $$('[data-scene]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.scene === i)));
  $('[data-scene-tip]').textContent = S.tip;
  store.set('scene', i);
  tagLine();
  changed();
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
   orbit.pitch = Math.max(0.12, Math.min(1.56, orbit.pitch));
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
  {const S = SCENES[sceneIdx]; hemi.intensity = S.sky * (on ? 2 : 1) + (S.sun ? 0 : 0.35 * S.cove);}
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
 // Phones have 2-3× pixel density: draw moving frames at 1×, then the sharp ambient-occlusion frame once the view rests.
 const hiDpr = Math.min(devicePixelRatio || 1, 2), loDpr = Math.min(devicePixelRatio || 1, 1);
 let queued = false;
 function draw() {
  if (!alive || queued) return;
  queued = true;
  requestAnimationFrame(() => {
   queued = false;
   if (!alive) return;
   if (renderer.getPixelRatio() !== loDpr) renderer.setPixelRatio(loDpr);
   renderer.render(scene, camera);
   clearTimeout(aoTimer);
   aoTimer = setTimeout(rest, 400);
  });
 }
 function rest() {
  if (!alive || ptrs.size || holdDir) return;
  if (renderer.getPixelRatio() !== hiDpr) renderer.setPixelRatio(hiDpr);
  if (!composer) makeComposer();
  if (composer) {sizeComposer(); composer.render();} else renderer.render(scene, camera);
 }
 const sizeComposer = () => {if (composer) {const sz = renderer.getSize(new T.Vector2()); composer.setPixelRatio(Math.min(hiDpr, 1.5)); composer.setSize(sz.x, sz.y);}};
 // Sun shadows only change when something in the scene changes, not when the camera moves.
 const changed = () => {renderer.shadowMap.needsUpdate = true; draw();};

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
 // Straight down on the whole flat, like a drawn floor plan (ceiling off)
 $('[data-top]').onclick = () => {
  if (walk.on) setWalk(false);
  room = 'all'; pressRoom('all');
  orbit.target.set(m(D.W / 2), 0, m(D.H / 2));
  orbit.yaw = 0; orbit.pitch = 1.56;
  orbit.dist = m(Math.max(D.W, D.H)) * (camera.aspect < 1 ? 1.5 : 1.12);
  place();
 };

 $('[data-low]').onclick = e => {
  const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
  e.currentTarget.setAttribute('aria-pressed', String(on));
  walls.children.forEach(w => {w.visible = !on || w.position.y < 0.7;});
  changed();
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
  changed();
 };
 $('[data-photo]').onclick = () => {
  clearTimeout(aoTimer);
  if (renderer.getPixelRatio() !== hiDpr) renderer.setPixelRatio(hiDpr);
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
 else if (q.get('3d') === 'top') $('[data-top]').click();
 else if (q.get('3d') && SPAWN[q.get('3d')]) {if (q.get('walk')) setWalk(true); pressRoom(q.get('3d')); goRoom(q.get('3d'));}
}
