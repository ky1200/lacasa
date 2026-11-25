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
  {id: 'dining', name: 'Dining', short: 'Dining', boxes: [[8860,6070,3580,2180]]},
  {id: 'kitchen', name: 'Kitchen', short: 'Kitchen', boxes: [[7480,9020,3520,1800],[8860,8270,2140,750]]},
  {id: 'yard', name: 'Yard', short: 'Yard', boxes: [[5930,9020,1550,1800]]},
  {id: 'common-bath', name: 'Common bathroom', short: 'Common bath', boxes: [[4790,6250,2020,1750]]},
  {id: 'master-bath', name: 'Master bathroom', short: 'Master bath', boxes: [[380,1360,1840,2650]]},
  {id: 'hall', name: 'Hallway', short: 'Hall', boxes: [[4790,5090,3850,1140]]},
  {id: 'hs', name: 'Household shelter', short: 'Shelter', boxes: [[6960,6250,1850,2730]]},
  {id: 'entrance', name: 'Entrance', short: 'Entrance', boxes: [[11040,8270,1400,3040]]},
 ],
 // Walls for the Wi-Fi estimate and the gap-to-wall lines: [x1, y1, x2, y2, type].
 // c = concrete or brick wall, p = new partition (board + rockwool), h = household shelter (thick concrete), g = glass (the new kitchen sliding door).
 // Kitchen (checked 26 Nov against the plan): galley kitchen, sink counter backs onto the dining wall; the only way in is the ~0.9 m gap
 // beside the entrance, where the new glass sliding door (E2) goes. The main door sits at y 11285 (the recess below it is outside the flat).
 walls: [
  [380,1360,380,5750,'c'],[380,1360,2220,1360,'c'],[2280,1360,2280,4120,'c'],[2280,1460,5580,1460,'c'],
  [5580,870,5580,5310,'c'],[5580,1500,8620,1500,'c'],[8620,1980,8620,5070,'c'],[6610,5070,8620,5070,'c'],[5850,4170,5850,5090,'c'],
  [8620,1980,12470,1980,'c'],[12470,1980,12470,11285,'c'],
  [2280,4100,4820,4100,'p'],[4770,4100,4770,5310,'p'],
  [380,5750,2490,5750,'c'],[2490,5040,2490,8080,'c'],[2490,8080,4770,8080,'c'],[4770,6180,4770,8080,'c'],
  [4770,6230,5960,6230,'c'],[6830,6230,6830,8020,'c'],[4770,8020,6830,8020,'c'],[5910,8020,5910,10840,'c'],
  [6940,6230,8830,6230,'h'],[8830,6230,8830,9000,'h'],[6940,9000,8830,9000,'h'],[6940,6230,6940,9000,'h'],
  [8830,8250,11020,8250,'c'],[5910,10840,11020,10840,'c'],[11020,8250,11020,9047,'c'],[5910,9000,6940,9000,'c'],
  [11020,9940,11020,11285,'c'],[11020,11285,12470,11285,'c'],[380,4060,1190,4060,'c'],
  [11020,9047,11020,9940,'g'],
 ],
 // Furniture and devices. w = width (x), d = depth (y) before rotation. r = rotation in degrees (0, 90, 180, 270).
 // sizes: choices the family can switch between on /plan. buy: to-buy items (prices and picks come from /buy).
 // research: topic id in showcase/research.mjs. est: true = size not confirmed (shown as "about").
 // Size choices can carry: note, price (text), href (product page), img (photo on the panel).
 // Prices seen 21 Nov 2026. A family member can also type a custom size on /plan.
 items: [
  // ---------- KY room (bedroom 3) ----------
  {id: 'ky-bed', name: 'KY bed', room: 'ky', mattress: 300, kind: 'bed', x: 4800, y: 2420, r: 0, sizes: [{n: 'Queen mattress 152 × 190.5', w: 1520, d: 1905}, {n: 'Queen storage frame, about 160 × 200 (estimate)', w: 1600, d: 2000}], buy: ['ky-bed', 'ky-mattress'], research: 'beds', note: 'Dunlopillo Carlton 30 cm on a Dunlopillo storage frame with KHJ60 headboard (delivery 22 Dec). Frame outside size not confirmed yet: pick the frame size to check space. Tip: with the head against the top wall, the desk chair gets about 95 cm of space.'},
  {id: 'ky-desk', name: 'KY desk (Secretlab MAGNUS Pro)', room: 'ky', kind: 'desk', x: 2690, y: 3110, r: 270, sizes: [
   {n: 'XL 177 × 80 (current desk size)', w: 1770, d: 800, price: 'From S$999 (was S$1,118)', href: 'https://secretlab.sg/products/magnus-pro', img: '/images/research/secretlab-magnus-pro.webp'},
   {n: 'XXL 196.8 × 80', w: 1968, d: 800, price: 'From S$1,249', href: 'https://secretlab.sg/products/magnus-pro', img: '/images/research/secretlab-magnus-pro.webp'},
   {n: 'Regular 150 × 70', w: 1500, d: 700, price: 'From S$899 (was S$998)', href: 'https://secretlab.sg/products/magnus-pro', img: '/images/research/secretlab-magnus-pro.webp'},
   {n: 'Compact 120 × 70', w: 1200, d: 700, price: 'From S$899', href: 'https://secretlab.sg/products/magnus-pro', img: '/images/research/secretlab-magnus-pro.webp'},
  ], research: 'rooms', note: 'Secretlab MAGNUS Pro sizes from the Secretlab SG page (21 Nov). Along the left wall, from the wardrobe to the bedroom 2 wall there is about 214 cm, so even XXL (196.8 cm) fits with about 18 cm spare. Check the aircon, socket and window positions on 3 Dec.'},
  {id: 'ky-chair', name: 'KY chair (SIHOO M57)', room: 'ky', kind: 'chair', x: 3520, y: 3110, r: 90, sizes: [{n: 'SIHOO M57 (owned)', w: 600, d: 600, note: 'Base 60 cm across; seat 53 × 50 cm; 124 cm tall (HipVan listing)', img: '/images/research/sihoo-m57.webp', href: 'https://www.hipvan.com/products/sihoo-m57-ergonomic-chair-black'}], note: 'Owned, moving to La Casa. Drawn as its 60 cm wheel base. Leave about 75 to 90 cm between the desk edge and the bed to pull it out.'},
  {id: 'ky-wardrobe', name: 'KY wardrobe', room: 'ky', kind: 'wardrobe', x: 2555, y: 1710, r: 270, sizes: [
   {n: 'IKEA GURSKEN 49 × 55', w: 494, d: 550, price: 'S$89.90', href: 'https://www.ikea.com/sg/en/p/gursken-wardrobe-light-beige-50503292/', img: '/images/research/ikea-gursken-wardrobe.webp', note: '185.7 cm tall. Used before; fits all KY clothes.'},
   {n: 'IKEA SMÅSTAD/PLATSA 60 × 42', w: 600, d: 420, price: 'S$230', href: 'https://www.ikea.com/sg/en/p/smastad-platsa-wardrobe-white-light-green-with-2-clothes-rails-s09555415/', img: '/images/research/ikea-smastad-platsa-wardrobe.webp', note: '181 cm tall, only 42 cm deep, 2 clothes rails.'},
   {n: 'IKEA BRIMNES 2-door 78 × 50', w: 780, d: 500, price: 'S$199', href: 'https://www.ikea.com/sg/en/p/brimnes-wardrobe-with-2-doors-white-20400479', img: '/images/research/ikea-brimnes-wardrobe-2-door.webp', note: '190 cm tall.'},
   {n: 'IKEA KLEPPSTAD 2-door 79 × 55', w: 790, d: 550, price: 'S$149', href: 'https://www.ikea.com/sg/en/p/kleppstad-wardrobe-with-2-doors-white-10437237/', img: '/images/research/ikea-kleppstad-2-door.webp', note: '176 cm tall. Some owners say it feels cheap; fix it to the wall.'},
  ], research: 'rooms', note: 'Small wardrobe because the room is tight. Doors need about 50 cm in front to open.', buy: ['ky-wardrobe']},
  // ---------- KS room (bedroom 2) ----------
  {id: 'ks-bed', name: 'KS bed', room: 'ks', mattress: 380, kind: 'bed', x: 7620, y: 2500, r: 90, sizes: [{n: 'Queen mattress 152 × 190.5', w: 1520, d: 1905}, {n: 'Queen storage frame, about 160 × 200 (estimate)', w: 1600, d: 2000}], buy: ['ks-bed', 'ks-mattress'], research: 'beds', note: 'Dunlopillo Richmond 38 cm on a Dunlopillo storage frame with KHJ44 headboard (delivery 22 Dec). Frame outside size not confirmed yet. The I-Niche platform bed (D3, on hold, likely dropped) would be 110 × 282.5 cm along the window wall.'},
  {id: 'ks-desk', name: 'KS study desk', room: 'ks', kind: 'desk', x: 8320, y: 3800, r: 90, s: 1, sizes: [
   {n: 'IKEA ALEX 100 × 48', w: 1000, d: 480, price: 'S$179', href: 'https://www.ikea.com/sg/en/p/alex-desk-white-30473559/', img: '/images/research/ikea-alex-desk-100.webp'},
   {n: 'IKEA LAGKAPTEN/ALEX 120 × 60', w: 1200, d: 600, price: 'S$178.90', href: 'https://www.ikea.com/sg/en/p/lagkapten-alex-desk-white-stained-oak-effect-white-s89416963/', img: '/images/research/ikea-lagkapten-alex-120.webp'},
   {n: 'IKEA ALEX 132 × 58', w: 1320, d: 580, price: 'S$239', href: 'https://www.ikea.com/sg/en/p/alex-desk-white-60483439/'},
   {n: 'IKEA LAGKAPTEN/ALEX 140 × 60', w: 1400, d: 600, price: 'S$278.80', href: 'https://www.ikea.com/sg/en/p/lagkapten-alex-desk-white-s79521605/', img: '/images/research/ikea-lagkapten-alex-140.webp'},
  ], research: 'rooms', note: 'Typical study desks are 100 to 140 cm wide and 48 to 60 cm deep. Pick a size or type a custom one.', buy: ['ks-desk']},
  {id: 'ks-chair', name: 'KS chair', room: 'ks', kind: 'chair', x: 7620, y: 3800, r: 270, sizes: [
   {n: 'IKEA MARKUS 62 × 60', w: 620, d: 600, price: 'S$199', href: 'https://www.ikea.com/sg/en/p/markus-office-chair-vissle-dark-grey-50261151/', img: '/images/research/ikea-markus-chair.webp', note: 'Popular office chair; seat 53 × 47 cm.'},
   {n: 'SIHOO M57 60 × 60', w: 600, d: 600, price: 'From S$339 (HipVan)', href: 'https://www.hipvan.com/products/sihoo-m57-ergonomic-chair-black', img: '/images/research/sihoo-m57.webp', note: 'Same as KY’s chair.'},
   {n: 'IKEA FLINTAN 71 × 71', w: 710, d: 710, price: 'S$69.90', href: 'https://www.ikea.com/sg/en/p/flintan-office-chair-beige-50492203/', img: '/images/research/ikea-flintan-chair.webp', note: 'Budget chair with a wide base.'},
  ], research: 'rooms', buy: ['ks-chair']},
  {id: 'ks-wardrobe', name: 'KS wardrobe', room: 'ks', kind: 'wardrobe', add: true, x: 8200, y: 4770, r: 180, sizes: [
   {n: 'IKEA PAX / FORSAND 150 × 60 × 201 cm', w: 1500, d: 600, price: 'S$610', href: 'https://www.ikea.com/sg/en/p/pax-forsand-wardrobe-white-white-s19500696/', img: '/images/buy/ikea-pax-forsand-150-white.webp', note: '10-year guarantee; also 236 cm tall.'},
   {n: 'IKEA BRIMNES 3-door 117 × 50', w: 1170, d: 500, price: 'S$299', href: 'https://www.ikea.com/sg/en/p/brimnes-wardrobe-with-3-doors-white-10407928/', img: '/images/buy/ikea-brimnes-3-door.webp', note: '190 cm tall, one mirror door.'},
   {n: 'IKEA KLEPPSTAD 3-door 117 × 55', w: 1170, d: 550, price: 'S$199', href: 'https://www.ikea.com/sg/en/p/kleppstad-wardrobe-with-3-doors-white-80441759/', img: '/images/research/ikea-kleppstad-3-door.webp', note: '176 cm tall.'},
   {n: 'IKEA KLEPPSTAD 2-door 79 × 55', w: 790, d: 550, price: 'S$149', href: 'https://www.ikea.com/sg/en/p/kleppstad-wardrobe-with-2-doors-white-10437237/', img: '/images/research/ikea-kleppstad-2-door.webp', note: '176 cm tall.'},
  ], research: 'rooms', note: 'KS is removing the old built-in wardrobe and wants IKEA (24 Nov). Measure the wall on 3 Dec after hacking.', buy: ['ks-wardrobe']},
  // ---------- KX room (main bedroom) ----------
  {id: 'kx-bed', name: 'KX bed', room: 'kx', mattress: 380, headboard: false, kind: 'bed', x: 3760, y: 7150, r: 90, sizes: [{n: 'Queen mattress 152 × 190.5', w: 1520, d: 1905}, {n: 'Queen storage frame, about 160 × 200 (estimate)', w: 1600, d: 2000}], buy: ['kx-bed', 'kx-mattress'], research: 'beds', note: 'Dunlopillo Richmond 38 cm on a Dunlopillo storage frame, no headboard (delivery 22 Dec). Frame outside size not confirmed yet: pick the frame size to check space.'},
  {id: 'common-toilet', name: 'Common bathroom toilet', room: 'common-bath', kind: 'toilet', x: 5560, y: 6800, r: 270, est: true, sizes: [
   {n: 'RIGEL Gallant one-piece R-WO9030FA-HKM (pick, S$525): about 70 × 38 cm', w: 380, d: 700},
   {n: 'RIGEL slim-tank one-piece R-WO8056F (S$525): about 66 × 37 cm', w: 370, d: 660},
   {n: 'RIGEL two-piece rimless R-WC9030F (S$380): about 70 × 38 cm', w: 380, d: 700},
   {n: 'Short one-piece (compact models): about 62 × 36 cm', w: 360, d: 620},
   {n: 'Wall-hung bowl + concealed cistern R-WH9030BP (S$885): bowl about 52 × 36 cm, frame needs a boxed-out wall', w: 360, d: 520},
  ], buy: ['common-bath-rigel-gallant-one-piece'], research: 'bathroom', note: 'Same spot as now (floor outlet stays). Keep at least 60 cm clear in front (dashed) and about 20 cm from the bowl to each side wall. The setting-out (wall to outlet centre) is measured on 3 Dec; the model must fit that number. Size is an estimate (RIGEL does not publish drawings online): check the spec sheet at the showroom on Wed 25 Nov.'},
  {id: 'common-vanity', name: 'Common bathroom vanity', room: 'common-bath', rim: 890, kind: 'basin', x: 6450, y: 7745, r: 180, sizes: [
   {n: 'RIGEL R-BC7437, 70 cm, 2 drawers (pick, S$760): 70 × 50 cm', w: 700, d: 500},
   {n: 'RIGEL R-BC0201, 70 cm, 2 drawers (S$620): 70 × 45 cm', w: 700, d: 450},
   {n: 'RIGEL R-BC1260, 60 cm, 1 drawer (S$500): 60 × 45 cm', w: 600, d: 450},
   {n: 'RIGEL R-BC1407, 60 cm (S$560): 60 × 45 cm', w: 600, d: 450},
   {n: 'Heritage 60 cm PVC cabinet + mirror bundle (S$599): about 60 × 46 cm', w: 600, d: 460},
  ], buy: ['common-bath-basin-cabinet-304-stainless'], research: 'bathroom', note: 'Against the bottom wall in the old basin spot, between the half-height shower wall and the side wall. Sizes from RIGEL’s product data (width × depth). 70 cm fits if that wall is 70 cm or more: measure on 3 Dec. Wall-hung: leave the floor clear for mopping.'},
  {id: 'master-toilet', name: 'Master bathroom toilet', room: 'master-bath', kind: 'toilet', x: 940, y: 2780, r: 270, est: true, sizes: [
   {n: 'RIGEL Gallant one-piece R-WO9030FA-HKM (pick, S$525): about 70 × 38 cm', w: 380, d: 700},
   {n: 'RIGEL slim-tank one-piece R-WO8056F (S$525): about 66 × 37 cm', w: 370, d: 660},
   {n: 'RIGEL two-piece rimless R-WC9030F (S$380): about 70 × 38 cm', w: 380, d: 700},
   {n: 'Short one-piece (compact models): about 62 × 36 cm', w: 360, d: 620},
   {n: 'Wall-hung bowl + concealed cistern R-WH9030BP (S$885): bowl about 52 × 36 cm, frame needs a boxed-out wall', w: 360, d: 520},
  ], buy: ['master-bath-rigel-gallant-one-piece'], research: 'bathroom', note: 'Same spot as now. The door swings in near the basin, so a shorter toilet leaves more room. Keep 60 cm clear in front (dashed). Setting-out measured on 3 Dec. Size is an estimate (RIGEL does not publish drawings online): check the spec sheet at the showroom on Wed 25 Nov.'},
  {id: 'master-basin', name: 'Master bathroom vanity', room: 'master-bath', rim: 800, kind: 'basin', x: 806, y: 3574, r: 270, sizes: [
   {n: 'RIGEL R-BC1260, 60 cm, dark brown (pick, S$500): 60 × 45 cm', w: 600, d: 450},
   {n: 'RIGEL R-BC1407, 60 cm (S$560): 59 × 44.5 cm', w: 590, d: 445},
   {n: 'RIGEL R-BC0201, 60 cm, 2 drawers (S$620): 59 × 44.5 cm', w: 590, d: 445},
   {n: 'RIGEL R-BC7437, 70 cm (S$760): 70 × 50 cm, check the door swing', w: 700, d: 500},
  ], buy: ['master-bath-vanity'], research: 'bathroom', note: 'New vanity (K, 24 Nov), against the left wall below the toilet. The door swings close by: 45 to 50 cm deep is the most this spot takes. Sizes from RIGEL product data.'},

  {id: 'kx-vhaus-wardrobe', name: 'KX V Haus L-shape wardrobe (ordered)', room: 'kx', kind: 'lwardrobe', x: 1500, y: 5180, r: 270, sizes: [
   {n: 'Earlier plan: 188 cm along the bottom wall + 112.5 cm on the left wall, 60 cm deep', w: 1125, d: 1880, t: 600},
   {n: 'Order sheet: 6 ft + 6 ft (183 + 183 cm), 60 cm deep', w: 1830, d: 1830, t: 600},
  ], buy: ['kx-v-haus-l-wardrobe'], research: 'vhaus', note: 'V Haus ALTO L-shape, 9 ft tall, ordered 22 Nov. Goes in the old wardrobe corner. V Haus measures on Tue 8 Dec; the left wall here is only about 163 cm, so the 6 ft + 6 ft on the order sheet needs checking. Needs a power point inside for the LED strips.'},
  {id: 'kx-vanity', name: 'KX study / vanity desk', room: 'kx', kind: 'desk', x: 3700, y: 4330, r: 0, sizes: [
   {n: 'IKEA MALM 120 × 41', w: 1200, d: 410, price: 'S$99', href: 'https://www.ikea.com/sg/en/p/malm-dressing-table-white-40355409/', img: '/images/research/ikea-malm-dressing-table.webp', note: 'Dressing table that also works as a desk; long drawer.'},
   {n: 'IKEA SYVDE 100 × 48', w: 1000, d: 480, price: 'S$249', href: 'https://www.ikea.com/sg/en/p/syvde-dressing-table-white-00439562/', img: '/images/research/ikea-syvde-dressing-table.webp'},
   {n: 'IKEA HEMNES 100 × 50', w: 1000, d: 500, price: 'S$539', href: 'https://www.ikea.com/sg/en/p/hemnes-dressing-table-white-10355670/', img: '/images/research/ikea-hemnes-dressing-table.webp', note: 'Solid wood.'},
   {n: 'IKEA BRIMNES 70 × 42', w: 700, d: 420, price: 'S$99.90', href: 'https://www.ikea.com/sg/en/p/brimnes-dressing-table-white-90355421/', img: '/images/research/ikea-brimnes-dressing-table.webp', note: 'Smallest.'},
  ], research: 'rooms', buy: ['kx-vanity']},
  {id: 'kx-stool', name: 'KX stool', room: 'kx', kind: 'stool', x: 3700, y: 4800, r: 0, sizes: [
   {n: 'IKEA KYRRE 42 × 48', w: 420, d: 480, price: 'S$25', href: 'https://www.ikea.com/sg/en/p/kyrre-stool-birch-80420040/', img: '/images/research/ikea-kyrre-stool.webp', note: 'Birch, 45 cm high.'},
   {n: 'IKEA MARIUS 40 × 40', w: 400, d: 400, price: 'S$5.90', href: 'https://www.ikea.com/sg/en/p/marius-stool-black-00162380/', img: '/images/research/ikea-marius-stool.webp', note: '45 cm high; slides under the table.'},
  ], research: 'rooms', buy: ['kx-stool']},
  // ---------- Living, dining ----------
  // New id (21 Nov evening) so the new default applies: back on the bedroom 2 wall, facing the TV, open end by the window.
  {id: 'living-sofa-l', name: 'V Haus sofa (one armrest, open end)', room: 'living', h: 1070, kind: 'sofa', x: 9420, y: 3320, r: 270, sizes: [{n: 'Open end by the window (268 × 135)', w: 2680, d: 1350, flip: true}, {n: 'Open end to the dining side (268 × 135)', w: 2680, d: 1350}], buy: ['living-l-shape-4-seat'], research: 'vhaus', note: 'V Haus 2233A, ordered 22 Nov: a straight sofa with the armrest on one end only; the other end has no armrest and an extra seat cushion instead, so it is open to sit or lie on from the side. Real size from V Haus (23 Nov): 268 × 135 cm.'},
  {id: 'living-coffee-table', name: 'Coffee table (undecided)', room: 'living', kind: 'ctable', add: true, x: 10340, y: 3700, r: 90, s: 3, sizes: [
   {n: 'IKEA LACK 90 × 55', w: 900, d: 550, price: 'S$39.90', href: 'https://www.ikea.com/sg/en/p/lack-coffee-table-black-brown-20352987/', img: '/images/research/ikea-lack-coffee-90.webp'},
   {n: 'IKEA HOLMERUD 90 × 55', w: 900, d: 550, price: 'S$79.90', href: 'https://www.ikea.com/sg/en/p/holmerud-coffee-table-dark-brown-80541419/', img: '/images/research/ikea-holmerud-coffee.webp', note: 'Shelf underneath.'},
   {n: 'IKEA ÄMMARYD 98 × 59', w: 980, d: 590, price: 'S$99.90', href: 'https://www.ikea.com/sg/en/p/aemmaryd-coffee-table-white-10609120/', img: '/images/research/ikea-ammaryd-coffee.webp'},
   {n: 'IKEA ÖRTRÄSK 110 × 68', w: 1100, d: 680, price: 'S$219', href: 'https://www.ikea.com/sg/en/p/oertraesk-coffee-table-brown-ash-veneer-90635846/', img: '/images/research/ikea-ortrask-coffee.webp', note: 'Ash veneer; a common middle size.'},
   {n: 'IKEA LACK 118 × 78', w: 1180, d: 780, price: 'S$69.90', href: 'https://www.ikea.com/sg/en/p/lack-coffee-table-black-brown-80352951/', img: '/images/research/ikea-lack-coffee-118.webp'},
   {n: 'IKEA UGGLERUM 130 × 65', w: 1300, d: 650, price: 'S$199', href: 'https://www.ikea.com/sg/en/p/ugglerum-coffee-table-walnut-veneer-80627979/', img: '/images/research/ikea-ugglerum-coffee.webp', note: 'Walnut veneer.'},
   {n: 'IKEA VITTSJÖ round Ø75', w: 750, d: 750, round: true, price: 'S$69.90', href: 'https://www.ikea.com/sg/en/p/vittsjoe-coffee-table-light-beige-glass-50604347/', img: '/images/research/ikea-vittsjo-coffee.webp', note: 'Round glass top.'},
  ], note: 'Not decided yet. Keep about 40 to 45 cm between the sofa and the table, and a clear walkway past it. A common guide is a table about two thirds as long as the sofa.', buy: ['living-coffee-table']},
  // Extra pieces the family can add or remove on /plan (add: true, on: false = hidden until added).
  {id: 'living-recliner', name: 'Single recliner (La-Z-Boy type)', room: 'living', kind: 'recliner', free: true, add: true, on: false, x: 10700, y: 5450, r: 270, sizes: [
   {n: 'La-Z-Boy Cody 10T, fabric 100 × 101', w: 1000, d: 1010, price: 'S$899 (was S$1,799), Harvey Norman', href: 'https://www.harveynorman.com.sg/furniture-en/living-room/recliner-chairs/la-z-boy-cody-10t-iclean-pet-friendly-fabric-rocker-recliner-charcoal.html', img: '/images/research/la-z-boy-cody-10t.webp', note: 'iClean pet-friendly fabric (wipes clean). Leather version S$1,399.'},
   {n: 'La-Z-Boy Wayland 10T, fabric 102 × 101', w: 1020, d: 1010, price: 'S$1,259 (was S$1,799), Harvey Norman', href: 'https://www.harveynorman.com.sg/furniture-en/living-room/recliner-chairs/la-z-boy-wayland-10t-iclean-pet-friendly-fabric-rocker-recliner-platinum.html', img: '/images/research/la-z-boy-wayland-10t.webp', note: 'Plush pillow-top back and one-piece chaise seat.'},
   {n: 'La-Z-Boy Rowan 10T, 86 × 97', w: 860, d: 970, price: 'S$2,169 (was S$3,099), Harvey Norman', href: 'https://www.harveynorman.com.sg/furniture-en/living-room/recliner-chairs/la-z-boy-rowan-10t-rocker-recliner-black.html', img: '/images/research/la-z-boy-rowan-10t.webp', note: 'Slimmest of the three.'},
  ], note: 'Prices and sizes from Harvey Norman on 23 Nov (Black Friday Comes Early, to 26 Nov). Sizes are with the chair upright. The dashed part shows the footrest out (about 60 cm, estimate); rocker recliners also need about 15 cm behind to rock and recline. Turn it to face the TV.'},
  {id: 'living-mahjong', name: 'Mahjong table + 4 chairs', room: 'living', kind: 'mjtable', add: true, on: false, x: 11300, y: 3700, r: 0, sizes: [
   {n: 'Folding table 80 × 80, with 4 chairs (about 180 × 180)', w: 1800, d: 1800, t: 800},
   {n: 'Automatic table 90 × 90, with 4 chairs (about 200 × 200)', w: 2000, d: 2000, t: 900},
   {n: 'Table only 80 × 80 (folded chairs stored)', w: 800, d: 800, t: 800},
  ], note: 'Sizes include the chairs pulled in a little; players need about 50 cm behind each chair to sit down. Square 80 to 90 cm is the usual mahjong size; automatic tables are heavier and need a power point. Use it in the living room or move it to the dining area.'},
  {id: 'living-tv', name: 'TV', room: 'living', kind: 'tv', x: 12360, y: 3400, r: 90, sizes: [
   {n: 'LG OLED C6 65"', w: 1441, d: 45, price: 'S$3,254 (Electromart)', img: '/images/buy/lg-oled-evo-c6-65-2026-a32203.webp', note: '144.1 × 82.6 cm, 4.5 cm deep (without stand).'},
   {n: 'LG QNED86B 75" (Mini LED)', w: 1677, d: 31, price: 'S$2,783 (Electromart)', href: 'https://electromart.sg/products/lg-75qned86bsa-qned-evo-ai-qned86-mini-led-4k-smart-tv-75inch', img: '/images/research/lg-75qned86b.webp', note: 'LG has no 75" OLED; this is the closest LG at 75". 167.7 × 96.5 cm.'},
   {n: 'LG OLED C6 77"', w: 1711, d: 47, price: 'S$5,985 (Electromart)', img: '/images/buy/lg-oled-c6-77-2026-41166b.webp', note: '171.1 × 98.2 cm.'},
   {n: 'Samsung QN70H 85"', w: 1894, d: 60, price: 'S$4,299 (Harvey Norman)', img: '/images/buy/samsung-qn70h-85-neo-qled-mini-led-2026-e37448.webp', note: 'About 189 cm wide.'},
   {n: 'LG OLED B5 77" (recommended)', w: 1729, d: 46, price: 'S$3,254 (Electromart)', href: 'https://electromart.sg/products/lg-oled77b5psa-oled-ai-tv-b5-120hz-dolby-vision-hdr10-4k-uhd', img: '/images/buy/lg-oled-b5-77.webp', note: '172.9 × 99.5 × 4.6 cm without stand.'},
   {n: 'LG OLED B6 77"', w: 1723, d: 46, price: 'S$4,515 (Electromart)', href: 'https://electromart.sg/products/lg-oled77b6psa-oled-ai-b6-4k-smart-tv-77inch', img: '/images/buy/lg-oled-b6-77.webp', note: '172.3 × 99.2 × 4.6 cm without stand.'},
  ], buy: ['living-lg-oled-evo-c6'], research: 'tv-kitchen', note: 'Screen width without stand. The D1 feature wall is 210 cm long.'},
  {id: 'dining-table', name: 'LINO dining table + 6 chairs', room: 'dining', kind: 'table', x: 10500, y: 7400, r: 90, sizes: [{n: 'Table 160 × 90 cm', w: 1600, d: 900}], buy: ['dining-v-haus-lino-dining'], research: 'vhaus', note: 'LINO table 160 × 90 cm, 6 C9060 walnut chairs (ordered 22 Nov; chair size to check). With chairs pulled out it needs about 240 × 230 cm.'},
  // ---------- Kitchen and yard ----------
  {id: 'kitchen-fridge', name: 'Fridge', room: 'kitchen', kind: 'fridge', x: 10020, y: 10400, r: 180, sizes: [
   {n: 'Hitachi R-VX480PMS9 68 × 72', w: 680, d: 720, price: 'S$989 (COURTS)', img: '/images/buy/hitachi-407-l-2-door-fridge-inverter-6308ca.webp', h: 1770, note: '407 L, 177 cm tall. Current pick.'},
   {n: 'Panasonic NR-BX471CPSS 68.6 × 69.5', w: 686, d: 695, price: 'S$989 (COURTS)', img: '/images/buy/panasonic-405-l-freezer-at-bottom-a21c97.webp', h: 1790, note: '179 cm tall, freezer at the bottom.'},
   {n: 'Toshiba GR-RT559WE 70 × 69.1', w: 700, d: 691, h: 1723, price: 'S$929 (COURTS, in store 25 Nov)', img: '/images/buy/toshiba-411-l-white-glass-70-cm-wide-no-gap-in-our-space-850c60.webp', note: '172.3 cm tall. 70 cm wide: no side gap.'},
   {n: 'Mitsubishi HGS 69.9 × 72', w: 699, d: 720, price: 'S$1,799 (COURTS)', img: '/images/buy/mitsubishi-423-l-freezer-at-bottom-69-9-cm-wide-no-gap-231015.webp', note: 'Size of the same HGS body (421 L); check the SG 423 L model.'},
  ], buy: ['fridge'], research: 'tv-kitchen', note: 'The fridge space measured 75 W × 75 D × 183 H cm. Placed at the marked fridge spot; move it if the spot is different.'},
  {id: 'kitchen-water', name: 'LG PuriCare WD518AN water dispenser (bought)', room: 'kitchen', kind: 'dispenser', x: 9300, y: 10470, r: 180, sizes: [{n: 'WD518AN 16.8 × 48.5', w: 168, d: 485, img: '/images/research/lg-wd518an.webp', note: 'On the countertop. 16.8 cm wide, 41.8 cm tall, 48.5 cm deep with the drip tray (COURTS); LG lists 40 cm deep without it. Needs a water inlet and a power point nearby.'}], research: 'tv-kitchen'},
  {id: 'kitchen-fan', name: 'Fanco Dono corner fan', room: 'kitchen', kind: 'cfan', free: true, x: 7650, y: 9200, r: 315, est: true, sweep: 90, reach: 4000, sizes: [{n: '16" corner fan (about 45 cm)', w: 450, d: 450, img: '/images/buy/fanco-dc-dono-16-corner-fan-wall-or-ceiling-mount-remote-837335.webp', note: 'Mounted high in a corner (wall or ceiling). Size not listed by the shop; drawn as the 16" blade.'}], buy: ['kitchen-fan'], research: 'tv-kitchen', note: 'Swings 90° side to side (Electromart listing). The shop does not give how far the air reaches; the fan-shaped area is drawn to about 4 m as an estimate. Use Aim to point it.'},
  {id: 'robot-dock', name: 'Robot vacuum dock', room: 'yard', kind: 'dock', x: 6300, y: 9500, r: 0, sizes: [{n: 'Dock', w: 420, d: 460}], buy: ['kitchen-robot-vacuum-mop'], note: 'Docks on the list are up to 42 × 46 × 59 cm. Near the yard water points and floor drain.'},
  // ---------- Wi-Fi (see research: fibre comes in at the DB box by the entrance) ----------
  {id: 'wifi-main', name: 'Main router: TP-Link HB615 (StarHub), entrance', room: 'entrance', kind: 'wifi', x: 11300, y: 9700, r: 0, sizes: [{n: 'In use', w: 200, d: 200}, {n: 'Not used', w: 200, d: 200}], wifi: true, note: 'Next to the fibre box (ONT) at the DB box by the entrance.'},
  {id: 'wifi-atlas-2', name: 'Second HB615 (Mesh plan), KY room', room: 'ky', kind: 'wifi', x: 3350, y: 1700, r: 0, sizes: [{n: 'In use', w: 200, d: 200}, {n: 'Not used', w: 200, d: 200}], wifi: true, note: 'Links to the main router by Wi-Fi 7; the PC plugs into it by cable. Even better: one Cat6 cable from the DB box (ask I-Niche, G3).'},
  {id: 'wifi-atlas-1', name: 'Linksys MX4200 (owned, optional)', room: 'living', kind: 'wifi', x: 12100, y: 4800, r: 0, s: 1, sizes: [{n: 'In use', w: 180, d: 180}, {n: 'Not used', w: 180, d: 180}], wifi: true, note: 'Owned. Only needed if a room is weak; wire it to the HB615 in bridge mode. Turn it on here to see the difference.'},
 ],
 // Points: draft positions to show the idea. Set the real ones on 3 Dec.
 pointTypes: [
  {id: 'light', name: 'Downlight', layer: 'lights', spec: {model: 'Philips Meson 5" 13W (on the to-buy list)', lm: '900 lm (3000K) or 960 lm (4000K)', beam: 110, src: 'Philips / Signify spec sheets'}},
  {id: 'fan', name: 'Ceiling fan', layer: 'lights', spec: {model: 'KDK F40GP 100 cm DC fan with LED light (on the to-buy list)', sweep: 1000, air: '155 m³/min, air speed 220 m/min, 10 speeds', light: 'LED light; KDK does not publish its brightness. 31 W fan only, 50 W with the light.', beam: 120, src: 'KDK Singapore product page'}},
  {id: 'socket', name: 'Socket', layer: 'power'},
  {id: 'switch', name: 'Switch', layer: 'power'},
  {id: 'lan', name: 'LAN port', layer: 'net'},
  {id: 'tp', name: 'Fibre point (TP)', layer: 'net'},
 ],
 points: {
  light: [[9500,2700],[11500,2700],[9500,3800],[11500,3800],[9500,4900],[11500,4900],[9500,5900],[11500,5900],[3000,2000],[4900,2000],[3950,3700],[1500,4800],[3600,4700],[3630,7750],[5800,7100]],
  fan: [[3930,2780],[3630,6700],[10650,7400]],
  socket: [], switch: [], lan: [], tp: [[11150, 9400]],
 },
  // Ceiling height used for light pools (estimate until measured on 3 Dec; the living room has a false ceiling).
 ceilingMm: 2600, workMm: 750,
 // TV viewing: SMPTE recommends the screen fills about 30° of view, THX about 40° (36° to 40°).
 tvView: {smpte: 30, thx: 40, headMm: 500, sofa: 'living-sofa-l'},
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

// ---------- Layouts ----------
// '' = the family plan (shared). 'designer' = Claude's recommended layout (view only, can be copied).
// 'ky' / 'kx' / 'ks' = each person's own saved version (keys p:ky:i:<id>, p:ky:pts:<type>); anything a
// person has not changed falls back to the family plan.
export const PEOPLE = ['ky', 'kx', 'ks'];
export const LAYOUTS = [
 {id: '', name: 'Family plan', short: 'Family'},
 {id: 'designer', name: 'Designer’s pick', short: 'Designer’s pick'},
 {id: 'ky', name: 'KY’s layout', short: 'KY'},
 {id: 'kx', name: 'KX’s layout', short: 'KX'},
 {id: 'ks', name: 'KS’s layout', short: 'KS'},
];
export const layoutOf = raw => LAYOUTS.some(l => l.id && l.id === raw) ? raw : '';
export const prefixOf = layout => PEOPLE.includes(layout) ? `p:${layout}:` : 'p:';

// Designer's pick (Claude, 24 Nov 2026). Values use the saved formats: item "x,y,rotation,size[,on]", points "x,y;x,y".
// Items not listed keep their defaults. Draft until the real walls, windows and points are seen on 3 Dec.
export const DESIGNER = {
 items: {
  'ky-bed': '4540,2400,90,1', 'ky-desk': '2720,3175,270,0', 'ky-chair': '3420,3560,90,0', 'ky-wardrobe': '2580,1760,270,0', 'wifi-atlas-2': '2520,2460,0,0',
  'ks-bed': '7580,2410,90,1', 'ks-desk': '5860,3400,270,0', 'ks-chair': '6420,3560,90,0', 'ks-wardrobe': '7830,4755,180,0,1',
  'kx-bed': '3750,6970,90,1', 'kx-vhaus-wardrobe': '1500,5180,270,0', 'kx-vanity': '3700,4340,0,0', 'kx-stool': '3700,4800,0,0',
  'living-sofa-l': '9335,3450,270,0', 'living-coffee-table': '10810,3450,0,6,1', 'living-tv': '12360,3400,90,4',
  'living-recliner': '10700,5450,270,0,0', 'living-mahjong': '11300,3700,0,0,0', 'dining-table': '10500,7250,90,0', 'kitchen-fridge': '10020,10400,180,0',
 },
 points: {
  light: '10100,2800;11650,2800;10100,4150;11650,4150;10100,5450;11650,5450;9500,7250;11500,7250;5900,5650;7700,5650;11700,9600;8300,10000;9300,10000;10300,10000;6700,9700;5800,7100;1300,2200;1300,3300;2850,3150;4300,3700;3200,2000;5950,3400;7300,3750;1800,4700;3700,4850;3700,5950',
  fan: '4150,2400;7200,2410;3300,6970;10650,3450;10500,7250',
  socket: '2340,2600;2340,3700;5520,3270;5620,3150;8580,3270;4730,7830;4730,6100;3700,4160;12420,3000;12420,3850;8680,4900;8680,2150;12420,7400;8400,10790;9750,10790;10020,10810;6450,10800;6000,9300;11500,9250',
  switch: '4790,3980;5540,3340;6320,5000;8580,3340;4720,5200;4730,7900;8700,5700;11050,11300;8600,9100',
  lan: '2340,3200;12420,3450',
  tp: '11150,9400',
 },
 // Why each choice. Shown on /plan under "Designer's pick: the reasons".
 rooms: [
  {room: 'ky', title: 'KY room', why: [
   'Bed head on the solid wall shared with KS, not under the window: quieter, no draught or morning sun on the face, and the door opens fully without hitting the bed.',
   'Desk (177 cm) on the left wall, pushed down towards the door. The chair rolls into the open floor below the bed, so there is about 70 cm to sit and get up.',
   'Monitor faces the wall with the window at the side: no sun glare on the screen and no bright window behind the head on video calls.',
   'Desk light sits over the front edge of the desk, not behind the chair, so it does not reflect in the monitor.',
   'Fan between the bed foot and the desk: cools both, and no wind straight on the face when sleeping.',
   'Wi-Fi node on the desk with a short cable to the PC. Best of all: one Cat6 cable from the DB box to the desk (see the reno list).',
  ]},
  {room: 'ks', title: 'KS room', why: [
   'Bed head on the solid wall shared with the living room, long side along the window.',
   'The old built-in wardrobe is hacked away (KS, 24 Nov). A new IKEA wardrobe (KS chooses the model; shown: PAX 150 cm) goes on the same wall in the far corner, away from the door, with about 60 cm in front to open the doors.',
   'Study desk (IKEA ALEX 100 × 48) on the left wall, ending before the door swing. The chair rolls into the space below the bed.',
   'Fan over the middle of the bed towards the foot. KS has no fan point now, so it must be added during the reno.',
  ]},
  {room: 'kx', title: 'KX room (main bedroom)', why: [
   'Bed head on the right wall: the only way a queen storage frame fits with walking space on both long sides and a clear door swing.',
   'That wall backs onto the common toilet. Ask for a quiet dual-flush cistern, and keep the bed about 5 cm off the wall.',
   'V Haus L wardrobe in the old wardrobe corner: about 188 cm along the bottom wall and 112.5 cm on the left. V Haus measures on 8 Dec.',
   'Vanity on the KY partition wall, facing into the room. Its light is in front of the face, so no shadows for make-up.',
   'Fan over the middle of the bed towards the foot; sockets and a 2-way switch at the bedside.',
  ]},
  {room: 'living', title: 'Living room', why: [
   'Sofa back on the KS wall, centred on the TV, open end by the window. Eye to screen is about 3.2 m.',
   'At 3.2 m a 65" TV fills about 25° of view; the 30° guide (SMPTE) needs 75" to 77". Shown: LG OLED B5 77" (S$3,254 at Electromart, the same price as the 65" C6), 172.9 cm wide with about 18 cm spare each side on the 210 cm wall.',
   'Round coffee table 75 to 90 cm, about 43 cm from the sofa: easy to reach, no corners in the walkway.',
   'Six downlights in two rows, not straight above heads on the sofa and not in front of the screen, plus one ceiling fan over the coffee table.',
   'Sockets each side of the TV with a LAN port behind it, and a socket at each sofa end (lamp, phones, a recliner later).',
  ]},
  {room: 'dining', title: 'Dining', why: [
   'Fan with light over the table centre; two downlights at the sides light the walkway.',
   'One socket on the right wall near the table for steamboat or an automatic mahjong table.',
  ]},
  {room: 'kitchen', title: 'Kitchen, yard, hall and entrance', why: [
   'Three downlights in a row over the front of the counter, so the body does not shade the worktop. Add an LED strip under the wall cabinets.',
   'Sockets for the counter, the WD518AN water dispenser and the fridge. Robot dock socket low in the yard near the floor drain.',
   'Two hall lights and one at the entrance, a switch by the main door, and a socket by the DB box for the router.',
  ]},
 ],
 // To check on site on 3 Dec with I-Niche and the electrician (G3), before walls are painted and ceilings closed.
 reno: [
  'Ceiling fan points with a strong support: KS (new) and living room (new; the false ceiling needs a wood support above the board). Check the KY, KX and dining points.',
  'One Cat6 cable from the DB box to the KY desk, and one to the TV wall.',
  'At each bed: a double socket and a 2-way switch for the room light, so the light can be turned off from bed.',
  'KY desk: 2 double sockets about 15 cm above the desk top (PC, 2 screens, speakers, chargers). KS desk: 1 double socket.',
  'TV wall: 2 double sockets and the LAN port behind the screen, at TV height, so no cables show.',
  'TV wall (D1): plywood backing for a 77" TV bracket, with the screen middle at about seated eye level.',
  'Kitchen: power point inside a wall cabinet for an under-cabinet LED strip; water point and socket for the WD518AN.',
  'Light colour: 3000K warm white in the bedrooms, living and dining; 4000K in the kitchen, bathrooms and yard. Matches the warm modern look.',
  'Curtain tracks: only if the living curtains hang from the false ceiling, ask for a wood strip above the board first (screws do not hold in board alone). Concrete ceilings need nothing.',
  'Yard: socket about 30 cm off the floor for the robot vacuum dock.',
  'Common bathroom (behind the KX bed): quiet dual-flush cistern; ask if the pipes on that wall can be wrapped.',
  'Light switches on the handle side of each door, at the same height as the existing switches.',
 ],
};

const itemIds = new Set(PLAN.items.map(i => i.id)), typeIds = new Set(PLAN.pointTypes.map(t => t.id));
// Keys the /api/plan endpoint accepts: p:i:<id>, p:pts:<type>, and the same with a person prefix (p:ky:i:<id>).
export function planKey(key) {
 const m = /^p:(?:(ky|kx|ks):)?(i|pts):(.+)$/.exec(key);
 if (!m) return null;
 const layout = m[1] ?? '';
 if (m[2] === 'i' && itemIds.has(m[3])) return {kind: 'item', id: m[3], layout};
 if (m[2] === 'pts' && typeIds.has(m[3])) return {kind: 'points', type: m[3], layout};
 return null;
}
const MAX = 20000;
export function validPlanValue(spec, value) {
 if (value === '') return true;
 if (spec.kind === 'item') {
  // "x,y,rotation,size[,on]" where on is 1 or 0 (added or removed, only for add: true items) and size is a choice number or a custom size "c<width>x<depth>" in mm (100 to 4000).
  const m = /^(-?\d{1,5}),(-?\d{1,5}),(\d{1,3}),(\d|c(\d{3,4})x(\d{3,4}))(,([01]))?$/.exec(value);
  if (!m) return false;
  const x = Number(m[1]), y = Number(m[2]), r = Number(m[3]), it = PLAN.items.find(i => i.id === spec.id);
  // Corner fans aim in 45° steps; everything else turns in 90° steps.
  // Free items (recliner, corner fan) turn to any whole degree; everything else turns in 90° steps.
  if (it.free ? r > 359 : r % 90 || r > 270) return false;
  if (!(x >= 0 && x <= MAX && y >= 0 && y <= MAX)) return false;
  if (m[7] && !it.add) return false; // on/off only for items the family can add or remove
  if (m[5]) {const w = Number(m[5]), d = Number(m[6]); return !it.wifi && w >= 100 && w <= 4000 && d >= 100 && d <= 4000;}
  return Number(m[4]) < it.sizes.length;
 }
 if (value === 'none') return true; // all points of this type removed
 if (value.length > 3000) return false;
 return value.split(';').every(p => {const m = /^(\d{1,5}),(\d{1,5})$/.exec(p); return !!m && Number(m[1]) <= MAX && Number(m[2]) <= MAX;});
}
// The saved values a layout uses, as family-style keys (p:i:<id>, p:pts:<type>).
export function layoutValues(v = {}, layout = '') {
 if (layout === 'designer') return {...Object.fromEntries(Object.entries(DESIGNER.items).map(([k, x]) => [`p:i:${k}`, x])), ...Object.fromEntries(Object.entries(DESIGNER.points).map(([k, x]) => [`p:pts:${k}`, x]))};
 const fam = Object.fromEntries(Object.entries(v).filter(([k]) => /^p:(i|pts):/.test(k)));
 if (!PEOPLE.includes(layout)) return fam;
 const own = `p:${layout}:`;
 for (const [k, x] of Object.entries(v)) if (k.startsWith(own)) fam[`p:${k.slice(own.length)}`] = x;
 return fam;
}
// Saved state merged over the defaults.
export function planState(v = {}, layout = '') {
 if (layout) v = layoutValues(v, layout);
 const items = PLAN.items.map(i => {
  const m = /^(-?\d+),(-?\d+),(\d+),(\d|c(\d{3,4})x(\d{3,4}))(,([01]))?$/.exec(v[`p:i:${i.id}`] ?? '');
  const base = {...i, s: i.s ?? 0, c: null, on: i.on ?? true};
  if (!m) return base;
  const pos = {x: Number(m[1]), y: Number(m[2]), r: Number(m[3]), ...(m[8] && i.add ? {on: m[8] === '1'} : {})};
  if (m[5]) return {...base, ...pos, c: {w: Number(m[5]), d: Number(m[6])}};
  const s = Number(m[4]);
  return {...base, ...pos, s: s < i.sizes.length ? s : base.s};
 });
 const points = {};
 for (const t of PLAN.pointTypes) {
  const raw = v[`p:pts:${t.id}`];
  points[t.id] = raw === 'none' ? [] : raw ? raw.split(';').map(p => p.split(',').map(Number)) : PLAN.points[t.id] ?? [];
 }
 return {items, points};
}
// A whole layout as save values (suffix after the prefix: "i:<id>", "pts:<type>"), for "copy this layout".
export function serialLayout(st) {
 const out = {};
 for (const i of st.items) out[`i:${i.id}`] = `${Math.round(i.x)},${Math.round(i.y)},${i.r},${i.c ? `c${i.c.w}x${i.c.d}` : i.s}${i.add ? `,${i.on ? 1 : 0}` : ''}`;
 for (const [t, list] of Object.entries(st.points)) out[`pts:${t}`] = list.length ? list.map(p => p.map(Math.round).join(',')).join(';') : 'none';
 return out;
}
export const buyItemById = id => {for (const r of BUY.rooms) for (const i of r.items) if (i.id === id) return {item: i, room: r}; return null;};
