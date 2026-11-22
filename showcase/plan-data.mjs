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
 // Size choices can carry: note, price (text), href (product page), img (photo on the panel).
 // Prices seen 21 Nov 2026. A family member can also type a custom size on /plan.
 items: [
  // ---------- KY room (bedroom 3) ----------
  {id: 'ky-bed', name: 'KY bed', room: 'ky', kind: 'bed', x: 4800, y: 2420, r: 0, sizes: [{n: 'Queen', w: 1520, d: 1905}, {n: 'Super single', w: 1070, d: 1905}], buy: ['ky-bed', 'ky-mattress'], research: 'beds', note: 'Mattress size (frame size not known yet; a storage frame adds about 5 to 10 cm each way). Tip: with the head against the top wall, the desk chair gets about 95 cm of space.'},
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
  {id: 'ks-bed', name: 'KS bed', room: 'ks', kind: 'bed', x: 7620, y: 2500, r: 90, sizes: [{n: 'Queen', w: 1520, d: 1905}, {n: 'Super single', w: 1070, d: 1905}], buy: ['ks-bed', 'ks-mattress'], research: 'beds', note: 'Mattress size. The I-Niche platform bed (D3, on hold) would be 110 × 282.5 cm along the window wall.'},
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
  {id: 'ks-wardrobe', name: 'KS wardrobe', room: 'ks', kind: 'wardrobe', x: 8200, y: 4770, r: 180, sizes: [
   {n: 'IKEA KLEPPSTAD 2-door 79 × 55', w: 790, d: 550, price: 'S$149', href: 'https://www.ikea.com/sg/en/p/kleppstad-wardrobe-with-2-doors-white-10437237/', img: '/images/research/ikea-kleppstad-2-door.webp', note: '176 cm tall.'},
   {n: 'IKEA BRIMNES 2-door 78 × 50', w: 780, d: 500, price: 'S$199', href: 'https://www.ikea.com/sg/en/p/brimnes-wardrobe-with-2-doors-white-20400479', img: '/images/research/ikea-brimnes-wardrobe-2-door.webp', note: '190 cm tall.'},
   {n: 'IKEA KLEPPSTAD 3-door 117 × 55', w: 1170, d: 550, price: 'S$199', href: 'https://www.ikea.com/sg/en/p/kleppstad-wardrobe-with-3-doors-white-80441759/', img: '/images/research/ikea-kleppstad-3-door.webp', note: '176 cm tall.'},
   {n: 'IKEA GURSKEN 49 × 55', w: 494, d: 550, price: 'S$89.90', href: 'https://www.ikea.com/sg/en/p/gursken-wardrobe-light-beige-50503292/', img: '/images/research/ikea-gursken-wardrobe.webp'},
  ], research: 'rooms', note: 'Check if the old built-in wardrobe in this room stays; if it does, this may not be needed.', buy: ['ks-wardrobe']},
  // ---------- KX room (main bedroom) ----------
  {id: 'kx-bed', name: 'KX bed', room: 'kx', kind: 'bed', x: 3760, y: 7150, r: 90, sizes: [{n: 'Queen', w: 1520, d: 1905}, {n: 'Super single', w: 1070, d: 1905}], buy: ['kx-bed', 'kx-mattress'], research: 'beds', note: 'Mattress size. A storage frame adds about 5 to 10 cm each way.'},
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
  // New id (21 Nov evening) so the new default applies: back on the bedroom 2 wall, facing the TV, chaise by the window.
  {id: 'living-sofa-l', name: 'V Haus sofa with lounge end', room: 'living', kind: 'sofa', x: 9420, y: 3320, r: 270, sizes: [{n: 'Lounge end by the window (270 × 130)', w: 2700, d: 1300, flip: true}, {n: 'Lounge end to the dining side (270 × 130)', w: 2700, d: 1300}], buy: ['living-l-shape-4-seat'], research: 'vhaus', note: 'V Haus 2233A, ordered 22 Nov. Size from the order sheet (270 × 130 cm); measured in the shop as about 256 × 138 cm, to confirm. The viewing lines to the TV start from the middle seat, about 50 cm in from the sofa back (head position).'},
  {id: 'living-coffee-table', name: 'Coffee table (undecided)', room: 'living', kind: 'ctable', x: 10340, y: 3700, r: 90, s: 3, sizes: [
   {n: 'IKEA LACK 90 × 55', w: 900, d: 550, price: 'S$39.90', href: 'https://www.ikea.com/sg/en/p/lack-coffee-table-black-brown-20352987/', img: '/images/research/ikea-lack-coffee-90.webp'},
   {n: 'IKEA HOLMERUD 90 × 55', w: 900, d: 550, price: 'S$79.90', href: 'https://www.ikea.com/sg/en/p/holmerud-coffee-table-dark-brown-80541419/', img: '/images/research/ikea-holmerud-coffee.webp', note: 'Shelf underneath.'},
   {n: 'IKEA ÄMMARYD 98 × 59', w: 980, d: 590, price: 'S$99.90', href: 'https://www.ikea.com/sg/en/p/aemmaryd-coffee-table-white-10609120/', img: '/images/research/ikea-ammaryd-coffee.webp'},
   {n: 'IKEA ÖRTRÄSK 110 × 68', w: 1100, d: 680, price: 'S$219', href: 'https://www.ikea.com/sg/en/p/oertraesk-coffee-table-brown-ash-veneer-90635846/', img: '/images/research/ikea-ortrask-coffee.webp', note: 'Ash veneer; a common middle size.'},
   {n: 'IKEA LACK 118 × 78', w: 1180, d: 780, price: 'S$69.90', href: 'https://www.ikea.com/sg/en/p/lack-coffee-table-black-brown-80352951/', img: '/images/research/ikea-lack-coffee-118.webp'},
   {n: 'IKEA UGGLERUM 130 × 65', w: 1300, d: 650, price: 'S$199', href: 'https://www.ikea.com/sg/en/p/ugglerum-coffee-table-walnut-veneer-80627979/', img: '/images/research/ikea-ugglerum-coffee.webp', note: 'Walnut veneer.'},
   {n: 'IKEA VITTSJÖ round Ø75', w: 750, d: 750, round: true, price: 'S$69.90', href: 'https://www.ikea.com/sg/en/p/vittsjoe-coffee-table-light-beige-glass-50604347/', img: '/images/research/ikea-vittsjo-coffee.webp', note: 'Round glass top.'},
  ], note: 'Not decided yet. Keep about 40 to 45 cm between the sofa and the table, and a clear walkway past it. A common guide is a table about two thirds as long as the sofa.', buy: ['living-coffee-table']},
  {id: 'living-tv', name: 'TV', room: 'living', kind: 'tv', x: 12360, y: 3400, r: 90, sizes: [
   {n: 'LG OLED C6 65"', w: 1441, d: 45, price: 'S$3,254 (Electromart)', img: '/images/buy/lg-oled-evo-c6-65-2026-a32203.webp', note: '144.1 × 82.6 cm, 4.5 cm deep (without stand).'},
   {n: 'LG QNED86B 75" (Mini LED)', w: 1677, d: 31, price: 'S$3,499 (Harvey Norman)', href: 'https://www.harveynorman.com.sg/tv-and-audio/tvs-en-2/tvs-en-3/lg-75-inch-d86-qned-evo-mini-led-ai-4k-2026-smart-tv-black-75qned86bsa.atc.html', img: '/images/research/lg-75qned86b.webp', note: 'LG has no 75" OLED; this is the closest LG at 75". 167.7 × 96.5 cm.'},
   {n: 'LG OLED C6 77"', w: 1711, d: 47, price: 'S$6,499 (Harvey Norman)', img: '/images/buy/lg-oled-c6-77-2026-41166b.webp', note: '171.1 × 98.2 cm.'},
   {n: 'Samsung QN70H 85"', w: 1894, d: 60, price: 'S$4,299 (Harvey Norman)', img: '/images/buy/samsung-qn70h-85-neo-qled-mini-led-2026-e37448.webp', note: 'About 189 cm wide.'},
  ], buy: ['living-lg-oled-evo-c6'], research: 'tv-kitchen', note: 'Screen width without stand. The D1 feature wall is 210 cm long.'},
  {id: 'dining-table', name: 'LINO dining table + 6 chairs', room: 'dining', kind: 'table', x: 10500, y: 7400, r: 90, sizes: [{n: 'Table 160 × 90 cm', w: 1600, d: 900}], buy: ['dining-v-haus-lino-dining'], research: 'vhaus', note: 'LINO table 160 × 90 cm, 6 C9060 walnut chairs (ordered 22 Nov; chair size to check). With chairs pulled out it needs about 240 × 230 cm.'},
  // ---------- Kitchen and yard ----------
  {id: 'kitchen-fridge', name: 'Fridge', room: 'kitchen', kind: 'fridge', x: 10640, y: 10480, r: 180, sizes: [
   {n: 'Hitachi R-VX480PMS9 68 × 72', w: 680, d: 720, price: 'S$989 (COURTS)', img: '/images/buy/hitachi-407-l-2-door-fridge-inverter-6308ca.webp', note: '407 L, 177 cm tall. Current pick.'},
   {n: 'Panasonic NR-BX471CPSS 68.6 × 69.5', w: 686, d: 695, price: 'S$989 (COURTS)', img: '/images/buy/panasonic-405-l-freezer-at-bottom-a21c97.webp', note: '179 cm tall, freezer at the bottom.'},
   {n: 'Toshiba GR-RT559WE 70 × 69.1', w: 700, d: 691, price: 'S$999 (Electromart)', img: '/images/buy/toshiba-411-l-white-glass-70-cm-wide-no-gap-in-our-space-850c60.webp', note: '172.3 cm tall. 70 cm wide: no side gap.'},
   {n: 'Mitsubishi HGS 69.9 × 72', w: 699, d: 720, price: 'S$1,799 (COURTS)', img: '/images/buy/mitsubishi-423-l-freezer-at-bottom-69-9-cm-wide-no-gap-231015.webp', note: 'Size of the same HGS body (421 L); check the SG 423 L model.'},
  ], buy: ['fridge'], research: 'tv-kitchen', note: 'The fridge space measured 70 × 75 × 180 cm. Placed at the marked fridge spot; move it if the spot is different.'},
  {id: 'kitchen-water', name: 'LG PuriCare WD518AN water dispenser (bought)', room: 'kitchen', kind: 'dispenser', x: 9700, y: 10560, r: 180, sizes: [{n: 'WD518AN 16.8 × 48.5', w: 168, d: 485, img: '/images/research/lg-wd518an.webp', note: 'On the countertop. 16.8 cm wide, 41.8 cm tall, 48.5 cm deep with the drip tray (COURTS); LG lists 40 cm deep without it. Needs a water inlet and a power point nearby.'}], research: 'tv-kitchen'},
  {id: 'kitchen-fan', name: 'Fanco Dono corner fan', room: 'kitchen', kind: 'cfan', x: 7650, y: 9200, r: 315, est: true, sweep: 90, reach: 4000, sizes: [{n: '16" corner fan (about 45 cm)', w: 450, d: 450, img: '/images/buy/fanco-dc-dono-16-corner-fan-wall-or-ceiling-mount-remote-837335.webp', note: 'Mounted high in a corner (wall or ceiling). Size not listed by the shop; drawn as the 16" blade.'}], buy: ['kitchen-fan'], research: 'tv-kitchen', note: 'Swings 90° side to side (Electromart listing). The shop does not give how far the air reaches; the fan-shaped area is drawn to about 4 m as an estimate. Use Aim to point it.'},
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
  // "x,y,rotation,size" where size is a choice number or a custom size "c<width>x<depth>" in mm (100 to 4000).
  const m = /^(-?\d{1,5}),(-?\d{1,5}),(\d{1,3}),(\d|c(\d{3,4})x(\d{3,4}))$/.exec(value);
  if (!m) return false;
  const x = Number(m[1]), y = Number(m[2]), r = Number(m[3]), it = PLAN.items.find(i => i.id === spec.id);
  // Corner fans aim in 45° steps; everything else turns in 90° steps.
  if (it.kind === 'cfan' ? r % 45 || r > 315 : r % 90 || r > 270) return false;
  if (!(x >= 0 && x <= MAX && y >= 0 && y <= MAX)) return false;
  if (m[5]) {const w = Number(m[5]), d = Number(m[6]); return !it.wifi && w >= 100 && w <= 4000 && d >= 100 && d <= 4000;}
  return Number(m[4]) < it.sizes.length;
 }
 if (value === 'none') return true; // all points of this type removed
 if (value.length > 3000) return false;
 return value.split(';').every(p => {const m = /^(\d{1,5}),(\d{1,5})$/.exec(p); return !!m && Number(m[1]) <= MAX && Number(m[2]) <= MAX;});
}
// Saved state merged over the defaults.
export function planState(v = {}) {
 const items = PLAN.items.map(i => {
  const m = /^(-?\d+),(-?\d+),(\d+),(\d|c(\d{3,4})x(\d{3,4}))$/.exec(v[`p:i:${i.id}`] ?? '');
  const base = {...i, s: i.s ?? 0, c: null};
  if (!m) return base;
  const pos = {x: Number(m[1]), y: Number(m[2]), r: Number(m[3])};
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
export const buyItemById = id => {for (const r of BUY.rooms) for (const i of r.items) if (i.id === id) return {item: i, room: r}; return null;};
