// 3D view of the floor plan, built from the same walls, rooms and furniture as the 2D plan (mm → metres).
// Loaded only when someone taps "3D view". Shapes are drawn from real sizes; finishes follow the mood board.
import * as T from '/vendor/three-0.187.0-b.js';

const m = v => v / 1000;
const DOOR_H = 2100;

// ---- House details traced from the I-Niche plan (mm, same coordinates as the 2D plan) ----
// Windows: [wall index, from, to (along the wall), sill height, head height]
const WINDOWS = [[1, 800, 1950, 1000, 2100], [3, 2950, 5450, 500, 2300], [5, 5700, 8550, 500, 2300], [9, 9200, 12300, 400, 2400], [14, 5900, 7800, 500, 2300], [20, 9100, 10300, 1000, 2100]];
// Door openings cut into a wall: [wall index, from, to]
const GAPS = [[30, 11050, 12160]];
// Walls that are really door leaves on the plan
const NOT_WALLS = new Set([8]);
// Door leaves shown open: [hinge x, hinge y, end x, end y, kind]
const DOORS = [[5477, 4100, 5477, 3330, 'room'], [5850, 4170, 5850, 4960, 'room'], [4704, 5342, 4704, 6150, 'room'], [6800, 6235, 6800, 7020, 'room'], [2117, 4060, 2117, 3260, 'room'], [7594, 9000, 7594, 9780, 'steel'], [12163, 11650, 12163, 10620, 'main']];
// Built-in kitchen and yard counters: [x1, y1, x2, y2, height]
const COUNTERS = [[7620, 10230, 10350, 10840, 900], [8870, 8400, 10950, 9000, 900], [6300, 10230, 6950, 10840, 850]];
// Where to stand when walking into each room: [x, y, look at x, look at y]
const SPAWN = {all: [11700, 10300, 10500, 4000], living: [10500, 5900, 10600, 2000], dining: [11900, 8700, 10300, 7200], kitchen: [10700, 9500, 8300, 10300], ky: [5000, 3950, 3000, 1600], ks: [7000, 4700, 7000, 1500], kx: [4300, 4400, 1200, 6800]};
const FLOOR = {ky: 'oak', ks: 'oak', kx: 'oak', 'master-bath': 'bath', 'common-bath': 'bath', yard: 'bath', hs: 'plain'};
const ROOMS = [['all', 'Whole home'], ['living', 'Living'], ['dining', 'Dining'], ['kitchen', 'Kitchen'], ['ky', 'KY'], ['ks', 'KS'], ['kx', 'KX']];
const C = {wall: '#f3eee4', door: '#7b3f24', main: '#4a2a1c', steel: '#9aa0a3', fabric: '#b3aa9c', bed: '#bdb4a8', linen: '#f4f1ea', oak: '#d6b98f', walnut: '#5f3f2a', black: '#1e1e1e', white: '#f6f6f3', stone: '#d8d2c6', steelApp: '#c9ccce', vanity: '#4b3426', glass: '#bcd6df', curtain: '#d9ccb6', sheer: '#f7f5f0', counter: '#3b3b3b', cabinet: '#ece7dd'};

// ---- Textures drawn on a canvas (no downloads) ----
function tex(draw, size, repeatX, repeatY) {
 const c = document.createElement('canvas');
 c.width = c.height = size;
 draw(c.getContext('2d'), size);
 const t = new T.CanvasTexture(c);
 t.wrapS = t.wrapT = T.RepeatWrapping;
 t.repeat.set(repeatX, repeatY);
 t.colorSpace = T.SRGBColorSpace;
 t.anisotropy = 4;
 return t;
}
function floorTex(kind, wMm, hMm) {
 if (kind === 'oak') return tex((g, s) => {
  for (let r = 0; r < 4; r++) for (let k = -1; k < 2; k++) {
   const y = r * s / 4, x = k * s + (r % 2) * s / 2, tone = 200 + ((r * 7 + k * 13 + 20) % 5) * 6;
   g.fillStyle = `rgb(${tone + 14},${tone - 12},${tone - 58})`;
   g.fillRect(x, y, s, s / 4);
   g.strokeStyle = 'rgba(90,60,30,.10)';
   for (let l = 0; l < 6; l++) {g.beginPath(); g.moveTo(x, y + 4 + l * s / 26 + Math.sin(l + r) * 2); g.lineTo(x + s, y + 6 + l * s / 26); g.stroke();}
   g.strokeStyle = 'rgba(70,45,25,.35)';
   g.strokeRect(x, y, s, s / 4);
  }
 }, 512, wMm / 1200, hMm / 720);
 if (kind === 'bath') return tex((g, s) => {
  g.fillStyle = '#c9c7c2'; g.fillRect(0, 0, s, s);
  g.strokeStyle = '#a9a6a0'; g.lineWidth = 3; g.strokeRect(0, 0, s, s);
 }, 128, wMm / 300, hMm / 300);
 if (kind === 'plain') return null;
 return tex((g, s) => {
  const gr = g.createLinearGradient(0, 0, s, s);
  gr.addColorStop(0, '#ebe0d0'); gr.addColorStop(1, '#e0d3c1');
  g.fillStyle = gr; g.fillRect(0, 0, s, s);
  g.strokeStyle = '#cbbda9'; g.lineWidth = 2; g.strokeRect(0, 0, s, s);
 }, 256, wMm / 600, hMm / 600);
}

// ---- Shape helpers (metres; y up; local -z = back of the piece) ----
const matCache = new Map();
function mat(colour, opt = {}) {
 const key = colour + JSON.stringify(opt);
 if (!matCache.has(key)) matCache.set(key, new T.MeshStandardMaterial({color: colour, roughness: opt.rough ?? 0.8, metalness: opt.metal ?? 0, transparent: opt.opacity != null, opacity: opt.opacity ?? 1, emissive: opt.glow ?? '#000000', side: opt.double ? T.DoubleSide : T.FrontSide}));
 return matCache.get(key);
}
function box(g, w, h, d, x, y, z, material, shadow = true) {
 const mesh = new T.Mesh(new T.BoxGeometry(Math.max(w, 0.001), Math.max(h, 0.001), Math.max(d, 0.001)), material);
 mesh.position.set(x, y + h / 2, z);
 mesh.castShadow = shadow;
 mesh.receiveShadow = true;
 g.add(mesh);
 return mesh;
}
function cyl(g, r, h, x, y, z, material, seg = 24) {
 const mesh = new T.Mesh(new T.CylinderGeometry(r, r, h, seg), material);
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
 legs(c, 0.43, 0.43, 0.45, 0.04, 0.015, mat(legCol));
 box(c, 0.45, 0.06, 0.45, 0, 0.45, 0, mat(seatCol, {rough: 1}));
 box(c, 0.45, 0.38, 0.05, 0, 0.5, -0.2, mat(seatCol, {rough: 1}));
 c.position.set(x, 0, z);
 c.rotation.y = rot;
 g.add(c);
}

// ---- One builder per kind of furniture ----
function build(it, s, colour) {
 const g = new T.Group(), w = m(s.w), d = m(s.d), k = it.kind;
 if (k === 'bed') {
  box(g, w + 0.08, 0.36, d + 0.06, 0, 0, 0.02, mat(C.bed, {rough: 1}));
  box(g, w, 0.32, d, 0, 0.36, 0.02, mat(C.linen, {rough: 0.95}));
  box(g, w + 0.02, 0.05, d * 0.62, 0, 0.66, d * 0.2, mat('#d9d3c8', {rough: 1}));
  box(g, w + 0.16, 1.15, 0.1, 0, 0, -d / 2 - 0.05, mat(C.bed, {rough: 1}));
  const pw = w > 1.3 ? (w - 0.2) / 2 : w - 0.12;
  for (const px of (w > 1.3 ? [-(pw / 2 + 0.04), pw / 2 + 0.04] : [0])) box(g, pw, 0.13, 0.4, px, 0.68, -d / 2 + 0.28, mat('#ffffff', {rough: 1}));
 } else if (k === 'sofa') {
  const f = s.flip ? -1 : 1, arm = 0.23, back = 0.24, fab = mat(colour, {rough: 1});
  box(g, w, 0.42, d, 0, 0, 0, fab);
  box(g, w - arm, 0.4, back, -f * arm / 2, 0.42, -d / 2 + back / 2, fab);
  box(g, arm, 0.24, d, f * (w / 2 - arm / 2), 0.42, 0, fab);
  const seats = 5, sw = (w - arm) / seats;
  for (let i = 0; i < seats; i++) box(g, sw - 0.02, 0.06, d - back - 0.04, -f * (w / 2 - sw * i - sw / 2), 0.42, back / 2, fab);
  box(g, 0.42, 0.36, 0.12, -f * (w / 2 - arm - 0.4), 0.5, -d / 2 + back + 0.08, mat('#e9e2d6', {rough: 1}));
 } else if (k === 'recliner') {
  const fab = mat('#4d4a47', {rough: 1});
  box(g, w, 0.45, d, 0, 0, 0, fab);
  box(g, w - 0.1, 0.55, 0.25, 0, 0.45, -d / 2 + 0.13, fab);
  for (const sx of [-1, 1]) box(g, 0.18, 0.2, d * 0.75, sx * (w / 2 - 0.09), 0.45, 0.06, fab);
 } else if (k === 'ctable') {
  if (s.round) {
   cyl(g, w / 2, 0.012, 0, 0.43, 0, mat(C.glass, {opacity: 0.5, rough: 0.1}), 40);
   cyl(g, w / 2 - 0.03, 0.02, 0, 0.41, 0, mat(C.oak), 40);
   cyl(g, w / 2 - 0.08, 0.01, 0, 0.12, 0, mat(C.oak), 40);
   for (let a = 0; a < 3; a++) cyl(g, 0.018, 0.42, Math.cos(a * 2.094) * (w / 2 - 0.08), 0, Math.sin(a * 2.094) * (w / 2 - 0.08), mat(C.oak), 8);
  } else {box(g, w, 0.04, d, 0, 0.38, 0, mat(C.walnut)); legs(g, w, d, 0.38, 0.05, 0.02, mat(C.walnut));}
 } else if (k === 'tv') {
  const hgt = w * 0.5625;
  box(g, w, hgt, 0.03, 0, 0.55, 0, mat('#0b0b0d', {rough: 0.25, metal: 0.2}));
  box(g, w - 0.02, hgt - 0.02, 0.002, 0, 0.56, 0.017, mat('#141821', {rough: 0.1, glow: '#05070a'}), false);
 } else if (k === 'table') {
  box(g, w, 0.04, d, 0, 0.71, 0, mat(C.walnut, {rough: 0.6}));
  legs(g, w, d, 0.71, 0.08, 0.025, mat(C.walnut));
  const per = w >= 1.5 ? 3 : 2;
  for (let i = 0; i < per; i++) {
   const cx = -w / 2 + w * (i + 0.5) / per;
   chairSimple(g, cx, -d / 2 - 0.25, 0, '#d8cdbb', C.walnut);
   chairSimple(g, cx, d / 2 + 0.25, Math.PI, '#d8cdbb', C.walnut);
  }
 } else if (k === 'desk') {
  box(g, w, 0.03, d, 0, 0.72, 0, mat(C.black, {rough: 0.5}));
  for (const sx of [-1, 1]) box(g, 0.06, 0.72, d - 0.1, sx * (w / 2 - 0.1), 0, 0, mat('#2a2a2a', {metal: 0.4}));
  box(g, 0.6, 0.35, 0.04, 0, 0.88, -d / 2 + 0.15, mat('#111111', {rough: 0.3}));
 } else if (k === 'chair') {
  const r = Math.min(w, d) / 2;
  cyl(g, r * 0.9, 0.04, 0, 0.06, 0, mat('#222222'), 20);
  cyl(g, 0.03, 0.4, 0, 0.06, 0, mat('#444444', {metal: 0.5}), 8);
  box(g, r * 1.5, 0.08, r * 1.3, 0, 0.46, 0.03, mat('#2b2b2b', {rough: 0.9}));
  box(g, r * 1.4, 0.65, 0.06, 0, 0.55, -r * 0.7, mat('#2b2b2b', {rough: 0.9}));
 } else if (k === 'toilet') {
  box(g, w, 0.4, d * 0.28, 0, 0.38, -d / 2 + d * 0.14, mat(C.white, {rough: 0.2}));
  const bowl = cyl(g, w / 2 - 0.02, 0.4, 0, 0, d * 0.1, mat(C.white, {rough: 0.2}), 28);
  bowl.scale.z = (d * 0.75) / (w - 0.04);
 } else if (k === 'basin') {
  box(g, w, 0.45, d, 0, 0.4, 0, mat(C.vanity, {rough: 0.6}));
  box(g, w + 0.01, 0.04, d + 0.01, 0, 0.85, 0, mat(C.white, {rough: 0.15}));
  box(g, 0.03, 0.2, 0.03, 0, 0.89, -d / 2 + 0.06, mat('#c9c9c9', {metal: 0.9, rough: 0.2}));
  box(g, w * 0.9, 0.7, 0.12, 0, 1.25, -d / 2 + 0.06, mat('#dfe7ea', {rough: 0.05, metal: 0.6}));
 } else if (k === 'mjtable') {
  const t = m(Math.min(s.t ?? 800, s.w, s.d));
  box(g, t, 0.03, t, 0, 0.73, 0, mat('#2f6b4a', {rough: 1}));
  legs(g, t, t, 0.73, 0.04, 0.015, mat('#555555', {metal: 0.5}));
  for (let a = 0; a < 4; a++) chairSimple(g, Math.sin(a * Math.PI / 2) * (t / 2 + 0.25), Math.cos(a * Math.PI / 2) * (t / 2 + 0.25), a * Math.PI / 2 + Math.PI, '#9c9890', '#555555');
 } else if (k === 'stool') {
  cyl(g, Math.min(w, d) / 2, 0.45, 0, 0, 0, mat(colour, {rough: 1}), 20);
 } else if (k === 'wardrobe') {
  box(g, w, 2.0, d, 0, 0, 0, mat(C.white, {rough: 0.6}));
  const doors = w > 0.9 ? 3 : w > 0.6 ? 2 : 1;
  for (let i = 1; i < doors; i++) box(g, 0.006, 1.96, 0.004, -w / 2 + w * i / doors, 0.02, d / 2 + 0.002, mat('#9b968e'), false);
  for (let i = 0; i < doors; i++) box(g, 0.015, 0.25, 0.02, -w / 2 + w * (i + 0.5) / doors + 0.05, 0.95, d / 2 + 0.01, mat('#9d9d9d', {metal: 0.8}), false);
 } else if (k === 'lwardrobe') {
  const t = m(s.t ?? 600), body = mat(C.stone, {rough: 0.55}), hgt = 2.7, n = Math.max(2, Math.round((w - t) / 0.5));
  box(g, w, hgt, t, 0, 0, -d / 2 + t / 2, body);
  box(g, t, hgt, d - t, -w / 2 + t / 2, 0, t / 2, body);
  for (let i = 1; i < n; i++) box(g, 0.012, 0.45, 0.02, -w / 2 + t + (w - t) * i / n, 1.0, -d / 2 + t + 0.01, mat(C.black, {metal: 0.6}), false);
  box(g, w - t, 0.02, 0.01, t / 2, 2.62, -d / 2 + t + 0.006, mat('#fff6dc', {glow: '#8a7a50'}), false);
 } else if (k === 'fridge') {
  box(g, w, 1.77, d, 0, 0, 0, mat(C.steelApp, {metal: 0.6, rough: 0.35}));
  box(g, w - 0.02, 0.006, 0.004, 0, 1.1, d / 2 + 0.002, mat('#7b7f82'), false);
  for (const y of [0.75, 1.25]) box(g, 0.02, 0.35, 0.03, w / 2 - 0.06, y, d / 2 + 0.02, mat('#8a8e91', {metal: 0.8}), false);
 } else if (k === 'dispenser') {
  box(g, w, 0.45, d, 0, 0.9, 0, mat('#e8e6e1', {rough: 0.3}));
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

let ui = null;

export function open(D, items) {
 if (ui) ui.remove();
 const box3 = document.createElement('div');
 box3.className = 'p3d';
 box3.setAttribute('role', 'dialog');
 box3.setAttribute('aria-modal', 'true');
 box3.setAttribute('aria-label', '3D view of the home');
 box3.innerHTML = `<div class="p3d-bar"><b>3D view</b><button type="button" class="p3d-close" data-x aria-label="Close the 3D view">Close</button></div>
<div class="p3d-stage"><canvas class="p3d-canvas"></canvas><div class="p3d-card" data-card hidden></div>
<div class="p3d-move" data-move hidden><button type="button" data-step="1" aria-label="Walk forward">▲</button><button type="button" data-step="-1" aria-label="Walk back">▼</button></div></div>
<div class="p3d-ctrl"><div class="p3d-row">${ROOMS.map(([id, n], k) => `<button type="button" data-room="${id}"${k ? '' : ' aria-pressed="true"'}>${n}</button>`).join('')}</div>
<div class="p3d-row"><button type="button" data-walk aria-pressed="false">Walk inside</button><button type="button" data-sofa>Sit on the sofa</button><button type="button" data-low aria-pressed="false">Low walls</button></div>
<p class="p3d-help" data-help>Drag to turn, pinch or scroll to zoom. Tap furniture for its photo and size.</p></div>`;
 document.body.append(box3);
 ui = box3;
 const prevFocus = document.activeElement;
 document.documentElement.classList.add('p3d-open');
 const $ = s => box3.querySelector(s);
 const canvas = $('canvas'), stage = $('.p3d-stage'), card = $('[data-card]'), help = $('[data-help]');

 const renderer = new T.WebGLRenderer({canvas, antialias: true});
 renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
 renderer.shadowMap.enabled = true;
 renderer.shadowMap.type = T.PCFSoftShadowMap;
 renderer.toneMapping = T.ACESFilmicToneMapping;
 renderer.toneMappingExposure = 1.05;
 const scene = new T.Scene();
 scene.background = tex((g, s) => {const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, '#9fc3e0'); gr.addColorStop(0.6, '#dfe9ee'); gr.addColorStop(1, '#f1ece2'); g.fillStyle = gr; g.fillRect(0, 0, s, s);}, 64, 1, 1);
 const camera = new T.PerspectiveCamera(50, 1, 0.05, 120);
 const hemi = new T.HemisphereLight(0xfff8ee, 0xcbbfae, 1.5);
 scene.add(hemi);
 const sun = new T.DirectionalLight(0xfff1dc, 2.2);
 sun.position.set(m(D.W) * 0.35, 12, -6);
 sun.target.position.set(m(D.W / 2), 0, m(D.H / 2));
 sun.castShadow = true;
 sun.shadow.mapSize.set(2048, 2048);
 Object.assign(sun.shadow.camera, {left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 40});
 sun.shadow.bias = -0.0004;
 scene.add(sun, sun.target);

 const ceil = m(D.ceilingMm || 2600), W = D.walls;

 // Floors
 for (const r of D.rooms) for (const [x, y, w, h] of r.boxes) {
  const kind = FLOOR[r.id] ?? 'tile', t = floorTex(kind, w, h);
  const f = new T.Mesh(new T.PlaneGeometry(m(w) + 0.06, m(h) + 0.06), new T.MeshStandardMaterial({color: t ? '#ffffff' : '#bdb8ae', map: t, roughness: kind === 'tile' ? 0.35 : 0.7}));
  f.rotation.x = -Math.PI / 2;
  f.position.set(m(x + w / 2), 0.001, m(y + h / 2));
  f.receiveShadow = true;
  scene.add(f);
 }
 // Ceiling, downlights and ceiling fans (shown when walking inside)
 const ceiling = new T.Group();
 for (const r of D.rooms) for (const [x, y, w, h] of r.boxes) {
  const c = new T.Mesh(new T.PlaneGeometry(m(w) + 0.06, m(h) + 0.06), mat('#fbfaf7', {rough: 1}));
  c.rotation.x = Math.PI / 2;
  c.position.set(m(x + w / 2), ceil, m(y + h / 2));
  ceiling.add(c);
 }
 for (const [x, y] of D.points?.light ?? []) {const l = new T.Mesh(new T.CircleGeometry(0.05, 16), mat('#ffffff', {glow: '#fff4d6'})); l.rotation.x = Math.PI / 2; l.position.set(m(x), ceil - 0.005, m(y)); ceiling.add(l);}
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

 // Walls with window and door openings
 const walls = new T.Group();
 scene.add(walls);
 const wallMat = mat(C.wall, {rough: 0.9}), glassMat = mat(C.glass, {opacity: 0.28, rough: 0.05}), fluted = mat('#dfe6e6', {opacity: 0.55, rough: 0.4}), frameMat = mat('#2b2b2b', {metal: 0.3, rough: 0.5}), sillMat = mat('#e9e4da', {rough: 0.5});
 W.forEach(([x1, y1, x2, y2, t], idx) => {
  if (NOT_WALLS.has(idx)) return;
  const horiz = Math.abs(y2 - y1) < Math.abs(x2 - x1), a0 = Math.min(horiz ? x1 : y1, horiz ? x2 : y2), a1 = Math.max(horiz ? x1 : y1, horiz ? x2 : y2);
  const fixed = horiz ? (y1 + y2) / 2 : (x1 + x2) / 2, thick = m(t === 'p' ? 75 : t === 'g' ? 50 : 120);
  const cuts = [...WINDOWS.filter(w => w[0] === idx).map(w => ({from: w[1], to: w[2], sill: w[3], head: w[4]})), ...GAPS.filter(g => g[0] === idx).map(g => ({from: g[1], to: g[2], sill: 0, head: DOOR_H}))].sort((p, q) => p.from - q.from);
  const seg = (from, to, yb, yt, material, th = thick, shadow = true) => {
   const len = m(to - from), mid = m((from + to) / 2);
   return box(walls, horiz ? len : th, yt - yb, horiz ? th : len, horiz ? mid : m(fixed), yb, horiz ? m(fixed) : mid, material, shadow);
  };
  if (t === 'g') { // the new kitchen glass sliding door: black slim frame, fluted glass
   seg(a0, a1, 0, ceil - 0.04, fluted, 0.02, false);
   for (let i = 0; i <= 3; i++) {const p = a0 + (a1 - a0) * i / 3; seg(p - 15, p + 15, 0, ceil, frameMat, 0.05);}
   seg(a0, a1, ceil - 0.04, ceil, frameMat, 0.05);
   return;
  }
  let at = a0 - (t === 'p' ? 37 : 60);
  const end = a1 + (t === 'p' ? 37 : 60);
  for (const c of cuts) {
   if (c.from > at) seg(at, c.from, 0, ceil, wallMat);
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
  if (end > at) seg(at, end, 0, ceil, wallMat);
 });
 // Living room curtains: white sheers and oatmeal day curtains gathered at each side of the window
 const lw = WINDOWS.find(w => w[0] === 9);
 if (lw) {
  const y = m(W[9][1]) + 0.16;
  for (const [x0, x1] of [[lw[1] - 250, lw[1] + 250], [lw[2] - 250, lw[2] + 250]]) {
   box(scene, m(x1 - x0), ceil - 0.05, 0.1, m((x0 + x1) / 2), 0.02, y + 0.06, mat(C.curtain, {rough: 1}));
   box(scene, m(x1 - x0) + 0.2, ceil - 0.05, 0.04, m((x0 + x1) / 2), 0.02, y - 0.02, mat(C.sheer, {rough: 1, opacity: 0.75}), false);
  }
 }
 // Doors (shown open)
 for (const [hx, hy, ex, ey, kind] of DOORS) {
  const len = Math.hypot(ex - hx, ey - hy), d = box(scene, m(len), m(DOOR_H), 0.04, m((hx + ex) / 2), 0, m((hy + ey) / 2), mat(kind === 'main' ? C.main : kind === 'steel' ? C.steel : C.door, {rough: 0.55}));
  d.rotation.y = -Math.atan2(ey - hy, ex - hx);
  const knob = new T.Mesh(new T.SphereGeometry(0.03, 12, 8), mat('#c8c2b6', {metal: 0.9, rough: 0.3}));
  knob.position.set(m(len) / 2 - 0.07, -m(DOOR_H) / 2 + 1.0, 0.04);
  d.add(knob);
 }
 // Built-in counters
 for (const [x1, y1, x2, y2, h] of COUNTERS) {
  box(scene, m(x2 - x1), m(h) - 0.04, m(y2 - y1), m((x1 + x2) / 2), 0, m((y1 + y2) / 2), mat(C.cabinet, {rough: 0.6}));
  box(scene, m(x2 - x1) + 0.01, 0.04, m(y2 - y1) + 0.01, m((x1 + x2) / 2), m(h) - 0.04, m((y1 + y2) / 2), mat(C.counter, {rough: 0.3}));
 }

 // Furniture
 const pick = [];
 for (const it of items) {
  if (it.on === false || it.kind === 'wifi' || it.kind === 'dock') continue;
  const s = sizeOf(it);
  if (!s) continue;
  const g = build(it, s, it.kind === 'sofa' ? C.fabric : (D.colours[it.room] ?? '#8a8f9a'));
  g.position.set(m(it.x), 0, m(it.y));
  g.rotation.y = -(it.r || 0) * Math.PI / 180;
  g.traverse(o => {if (o.isMesh) o.userData.item = it;});
  scene.add(g);
  pick.push(g);
 }

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
  hemi.intensity = on ? 2.6 : 1.5;
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
   orbit.dist = Math.max(5, m(Math.max(b[2], b[3])) * (id === 'all' ? 1.05 : 1.9));
   orbit.pitch = id === 'all' ? 0.95 : 0.85;
   orbit.yaw = 0.5;
  }
  place();
 };
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
 box3.querySelectorAll('[data-step]').forEach(b => {
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

 function draw() {renderer.render(scene, camera);}
 function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(1, h);
  // About 70° side to side, like a person's view, even on a narrow phone screen.
  camera.fov = Math.max(45, Math.min(100, 2 * Math.atan(Math.tan(35 * Math.PI / 180) / camera.aspect) * 180 / Math.PI));
  camera.updateProjectionMatrix();
  draw();
 }
 const ro = new ResizeObserver(resize);
 ro.observe(stage);

 box3.querySelectorAll('[data-room]').forEach(b => b.onclick = () => {
  box3.querySelectorAll('[data-room]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  goRoom(b.dataset.room);
 });
 $('[data-walk]').onclick = () => {setWalk(!walk.on); goRoom(room);};
 $('[data-sofa]').onclick = () => {
  box3.querySelectorAll('[data-room]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.room === 'living')));
  room = 'living';
  sofaView();
 };
 $('[data-low]').onclick = e => {
  const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
  e.currentTarget.setAttribute('aria-pressed', String(on));
  walls.children.forEach(w => {w.visible = !on || w.position.y < 0.7;});
  draw();
 };
 const close = () => {
  holdDir = 0;
  ro.disconnect();
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
 resize();
 goRoom('all');
}
