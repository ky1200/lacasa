// LaCasa floor plan (/plan). All positions and sizes are in millimetres (mm).
// Origin (0,0) = top-left corner of the plan image. x goes right, y goes down.
// The image is the I-Niche PROPOSED layout plan (13 Nov 2026, 1:100), page 2 of
// public/files/iniche-floor-plan-2026-11-13.pdf, cropped to the drawing only (no title block, no address).
// Scale: measured from the plan's own dimension lines at 300 dpi:
//   1650 mm = 303 px, 3150 = 581, 2825 = 522, 3680 = 678, 9150 = 1691, 1450 = 269, 2800 = 515, 1275 = 234
//   => 5.42 mm per pixel (all within ±0.5%). The contractor notes "actual dimension to be verified on site".
//
// To move or add things: change `items` or `points` below (defaults), or drag them on /plan
// (saved in D1 visit_notes as p:i:<item id> = "x,y,rotation,size" and p:pts:<type> = "x,y;x,y").
// Do not rename item ids once live (saved positions use them).
import {BUY} from './buy-plan.mjs';

export const PLAN = {
 img: '/images/plan/iniche-proposed-2026-11-13.webp',
 imgW: 2480, imgH: 2280, mmPerPx: 5.42, // => 13,442 × 12,358 mm
 source: 'I-Niche proposed layout plan, 13 Nov 2026 (scale 1:100). The scale is set from the plan’s own dimension lines, so sizes are good to about ±5 cm. The contractor’s note: actual sizes to be checked on site (3 Dec).',
 // Room boxes (x, y, width, height). A room can have more than one box (L-shaped rooms).
 // Room owners confirmed by K on 21 Nov: KY = bedroom 3, KS = bedroom 2, KX = main bedroom.
 rooms: [
  {id: 'ky', name: 'KY room (bedroom 3)', short: 'KY', boxes: [[2300,1490,3260,2590]]},
  {id: 'ks', name: 'KS room (bedroom 2)', short: 'KS', boxes: [[5600,1520,3000,3530]]},
  {id: 'kx', name: 'KX room (main bedroom)', short: 'KX', boxes: [[540,4120,4210,1630],[2510,5750,2240,2300]]},
  {id: 'living', name: 'Living room', short: 'Living', boxes: [[8640,2010,3800,4060]]},
  {id: 'dining', name: 'Dining', short: 'Dining', boxes: [[8860,6070,3580,2930]]},
  {id: 'kitchen', name: 'Kitchen', short: 'Kitchen', boxes: [[7480,9020,3500,1800]]},
  {id: 'yard', name: 'Yard', short: 'Yard', boxes: [[5930,9020,1550,1800]]},
  {id: 'common-bath', name: 'Common bathroom', short: 'Common bath', boxes: [[4790,6250,2020,1750]]},
  {id: 'master-bath', name: 'Master bathroom', short: 'Master bath', boxes: [[380,1360,1840,2650]]},
  {id: 'hall', name: 'Hallway', short: 'Hall', boxes: [[4790,5090,3850,1140]]},
  {id: 'hs', name: 'Household shelter', short: 'Shelter', boxes: [[6960,6250,1850,2730]]},
  {id: 'entrance', name: 'Entrance', short: 'Entrance', boxes: [[11000,9020,1440,2610]]},
 ],
 // Walls for the Wi-Fi estimate and the gap-to-wall lines: [x1, y1, x2, y2, type].
 // c = concrete or brick wall, p = new partition (board + rockwool), h = household shelter (thick concrete), g = glass / half wall.
 walls: [
  [380,1360,380,5750,'c'],[380,1360,2220,1360,'c'],[2280,1360,2280,4120,'c'],[2280,1460,5580,1460,'c'],
  [5580,870,5580,5310,'c'],[5580,1500,8620,1500,'c'],[8620,1980,8620,5070,'c'],[6610,5070,8620,5070,'c'],[5850,4170,5850,5090,'c'],
  [8620,1980,12470,1980,'c'],[12470,1980,12470,11650,'c'],
  [2280,4100,4820,4100,'p'],[4770,4100,4770,5310,'p'],
  [380,5750,2490,5750,'c'],[2490,5040,2490,8080,'c'],[2490,8080,4770,8080,'c'],[4770,6180,4770,8080,'c'],
  [4770,6230,5960,6230,'c'],[6830,6230,6830,8020,'c'],[4770,8020,6830,8020,'c'],[5910,8020,5910,10840,'c'],
  [6940,6230,8830,6230,'h'],[8830,6230,8830,9000,'h'],[6940,9000,8830,9000,'h'],[6940,6230,6940,9000,'h'],
  [8830,9000,11000,9000,'g'],[5910,10840,11000,10840,'c'],[11000,9000,11000,10840,'c'],[5910,9000,6940,9000,'c'],
  [10790,10840,10790,11650,'c'],[10790,11650,12470,11650,'c'],[380,4060,1190,4060,'c'],
 ],
 // Furniture and devices. w = width (x), d = depth (y) before rotation. r = rotation in degrees (0, 90, 180, 270).
 // sizes: choices the family can switch between on /plan. buy: to-buy items (prices and picks come from /buy).
 // research: topic id in showcase/research.mjs. est: true = size not confirmed (shown as "about").
 items: [
  {id: 'ky-bed', name: 'KY bed', room: 'ky', kind: 'bed', x: 4600, y: 2260, r: 90, sizes: [{n: 'Queen', w: 1520, d: 1905}, {n: 'Super single', w: 1070, d: 1905}], buy: ['ky-bed', 'ky-mattress'], research: 'beds', note: 'Mattress size. A storage frame adds about 5 to 10 cm each way; check the exact frame size in Research.'},
  {id: 'ky-desk', name: 'KY desk', room: 'ky', kind: 'desk', x: 3300, y: 3680, r: 0, sizes: [{n: 'Desk 177 × 80 cm', w: 1770, d: 800}], note: 'From the 11 Nov visit plan: desk 177 × 80 cm, three screens about 190 cm wide. Personal buy, not in the family budget.'},
  {id: 'ks-bed', name: 'KS bed', room: 'ks', kind: 'bed', x: 7620, y: 2500, r: 90, sizes: [{n: 'Queen', w: 1520, d: 1905}, {n: 'Super single', w: 1070, d: 1905}], buy: ['ks-bed', 'ks-mattress'], research: 'beds', note: 'Mattress size. The I-Niche platform bed (D3, on hold) would be 110 × 282.5 cm along the window wall.'},
  {id: 'kx-bed', name: 'KX bed', room: 'kx', kind: 'bed', x: 3760, y: 7150, r: 90, sizes: [{n: 'Queen', w: 1520, d: 1905}, {n: 'Super single', w: 1070, d: 1905}], buy: ['kx-bed', 'kx-mattress'], research: 'beds', note: 'Mattress size. A storage frame adds about 5 to 10 cm each way.'},
  {id: 'living-sofa', name: 'L-shape sofa', room: 'living', kind: 'sofa', x: 9420, y: 3400, r: 90, est: true, sizes: [{n: '4-seat L (about)', w: 2600, d: 1600}], buy: ['living-l-shape-4-seat'], note: 'Size is an estimate until the V Haus model is chosen.'},
  {id: 'living-tv', name: 'TV', room: 'living', kind: 'tv', x: 12360, y: 3400, r: 90, sizes: [{n: '65 inch', w: 1449, d: 60}, {n: '77 inch', w: 1722, d: 60}, {n: '85 inch', w: 1894, d: 60}], buy: ['living-lg-oled-evo-c6'], note: 'Screen width, about. The D1 feature wall is 210 cm long.'},
  {id: 'dining-table', name: 'LINO dining table + 4 chairs', room: 'dining', kind: 'table', x: 10500, y: 7400, r: 90, sizes: [{n: 'Table 160 × 90 cm', w: 1600, d: 900}], buy: ['dining-v-haus-lino-dining'], note: 'LINO table 160 × 90 cm, TOMAMO chairs 43 × 43 cm (from the V Haus visit, 5 Nov). With chairs pulled out it needs about 240 × 230 cm.'},
  {id: 'robot-dock', name: 'Robot vacuum dock', room: 'yard', kind: 'dock', x: 6300, y: 9500, r: 0, sizes: [{n: 'Dock', w: 420, d: 460}], buy: ['kitchen-robot-vacuum-mop'], note: 'Docks on the list are up to 42 × 46 × 59 cm. Near the yard water points and floor drain.'},
  {id: 'wifi-main', name: 'Linksys MX4200 (main router)', room: 'ky', kind: 'wifi', x: 2550, y: 3100, r: 0, sizes: [{n: 'Router', w: 180, d: 180}], wifi: true, note: 'Owned. Best in KY room, wired to the fibre box (ONT) by a wall LAN cable.'},
  {id: 'wifi-atlas-1', name: 'Atlas 6 node (living)', room: 'living', kind: 'wifi', x: 12100, y: 4800, r: 0, sizes: [{n: 'Node', w: 130, d: 130}], wifi: true, note: 'Owned. Wire it to the main router through the living wall LAN port if that port works.'},
  {id: 'wifi-atlas-2', name: 'Atlas 6 node (hall)', room: 'hall', kind: 'wifi', x: 5300, y: 5600, r: 0, sizes: [{n: 'Node', w: 130, d: 130}], wifi: true, note: 'Owned. Try the hallway or KX room; move it and watch the coverage.'},
 ],
 // Points: draft positions to show the idea. Set the real ones on 3 Dec.
 pointTypes: [
  {id: 'light', name: 'Downlight', layer: 'lights'},
  {id: 'fan', name: 'Ceiling fan', layer: 'lights'},
  {id: 'socket', name: 'Socket', layer: 'power'},
  {id: 'switch', name: 'Switch', layer: 'power'},
  {id: 'lan', name: 'LAN port', layer: 'net'},
  {id: 'tp', name: 'Fibre point (TP)', layer: 'net'},
 ],
 points: {
  light: [[9500,2700],[11500,2700],[9500,3800],[11500,3800],[9500,4900],[11500,4900],[9500,5900],[11500,5900],[3000,2000],[4900,2000],[3950,3700],[1500,4800],[3600,4700],[3630,7750],[5800,7100]],
  fan: [[3930,2780],[3630,6700],[10650,7400]],
  socket: [], switch: [], lan: [], tp: [],
 },
 // Wi-Fi estimate (like the predictive heatmaps in NetSpot or Hamina, much simpler):
 // signal = power − free-space loss − wall losses. dbm = about 20 dBm router power minus about 6 dB for a phone's
 // weaker antenna, body and furniture. Power and wall losses are typical values, not measured.
 wifi: {
  bands: {
   '5': {name: '5 GHz (fast)', mhz: 5500, dbm: 14, loss: {c: 12, p: 6, h: 30, g: 3}},
   '2.4': {name: '2.4 GHz (reach)', mhz: 2437, dbm: 12, loss: {c: 8, p: 4, h: 22, g: 2}},
  },
  levels: [
   {min: -50, name: 'Excellent', colour: '#1d4ed8'},
   {min: -60, name: 'Very good', colour: '#3b82f6'},
   {min: -67, name: 'Good (video calls, 4K)', colour: '#7cc0f5'},
   {min: -75, name: 'Fair (browsing)', colour: '#f2c94c'},
   {min: -200, name: 'Weak', colour: '#e5533d'},
  ],
 },
};

const itemIds = new Set(PLAN.items.map(i => i.id)), typeIds = new Set(PLAN.pointTypes.map(t => t.id));
// Keys the /api/plan endpoint accepts.
export function planKey(key) {
 if (key.startsWith('p:i:') && itemIds.has(key.slice(4))) return {kind: 'item', id: key.slice(4)};
 if (key.startsWith('p:pts:') && typeIds.has(key.slice(6))) return {kind: 'points', type: key.slice(6)};
 return null;
}
const MAX = 20000;
export function validPlanValue(spec, value) {
 if (value === '') return true;
 if (spec.kind === 'item') {
  const m = /^(-?\d{1,5}),(-?\d{1,5}),(0|90|180|270),(\d)$/.exec(value);
  if (!m) return false;
  const [x, y, , s] = [Number(m[1]), Number(m[2]), m[3], Number(m[4])], it = PLAN.items.find(i => i.id === spec.id);
  return x >= 0 && x <= MAX && y >= 0 && y <= MAX && s < it.sizes.length;
 }
 if (value === 'none') return true; // all points of this type removed
 if (value.length > 3000) return false;
 return value.split(';').every(p => {const m = /^(\d{1,5}),(\d{1,5})$/.exec(p); return !!m && Number(m[1]) <= MAX && Number(m[2]) <= MAX;});
}
// Saved state merged over the defaults.
export function planState(v = {}) {
 const items = PLAN.items.map(i => {
  const m = /^(-?\d+),(-?\d+),(\d+),(\d)$/.exec(v[`p:i:${i.id}`] ?? '');
  const s = m ? Number(m[4]) : 0;
  return m ? {...i, x: Number(m[1]), y: Number(m[2]), r: Number(m[3]), s: s < i.sizes.length ? s : 0} : {...i, s: 0};
 });
 const points = {};
 for (const t of PLAN.pointTypes) {
  const raw = v[`p:pts:${t.id}`];
  points[t.id] = raw === 'none' ? [] : raw ? raw.split(';').map(p => p.split(',').map(Number)) : PLAN.points[t.id] ?? [];
 }
 return {items, points};
}
export const buyItemById = id => {for (const r of BUY.rooms) for (const i of r.items) if (i.id === id) return {item: i, room: r}; return null;};
