// Colours and look (/look): a mood board the family chooses from. Saved in D1 visit_notes as
// `l:<board id>` = option index (no value = the recommended pick). Started 23 Nov 2026.
// sw = colour chips (screen colours are approximate; always check the real sample in daylight).
// img = real photo; ex: true = example, not the exact product.

export const FIXED = [
 {name: 'Floor tiles (living, dining, kitchen): staying', note: 'Glossy light cream-beige tiles, seen in the house video (23 Nov). Not changing.', sw: ['#e2d6c6'], img: '/images/look/home-now-floor-doors.webp'},
 {name: 'Doors and frames: staying', note: 'Deep red-brown (mahogany look) with dark skirting. The strongest colour in the home.', sw: ['#6a2a20']},
 {name: 'LINO dining set (ordered)', note: 'V Haus LINO T160 table + 6 C9060 chairs, walnut', sw: ['#5b3a29'], img: '/images/buy/v-haus-lino-dining-table-4-chairs-no-side-chairs-12fa73.webp'},
 {name: 'Sofa (ordered)', note: 'V Haus 2233A, 268 × 135 cm, one armrest and an open end. Colour can still change.', sw: [], img: '/images/buy/v-haus-2233a-sofa-ordered.webp'},
];

export const LOOK = {
 updated: '2026-11-23',
 inspiration: {img: '/images/look/living-inspiration.webp', note: 'The look the family likes: warm white walls, cream floor, soft cove lighting, beige curtains over white sheers, a light wood TV console. Our real floor is the same light cream tile, so this picture is close.'},
 boards: [
  {id: 'sofa', title: 'Sofa fabric', room: 'Living room', rec: 8, why: 'Chosen 24 Nov and confirmed with V Haus: RU002 Almond, the easy-clean fabric. A warm beige that wipes clean, goes with the oatmeal curtains and the walnut dining set, and is the colour already on the order. The textured range below was the other option (harder to clean).',
   note: 'From the V Haus fabric book (photo 23 Nov; colours in the photo look greyer than in person, and 05 was not in the photo). The order sheet says RU002 (pillows RU003). Final: RU002 Almond, easy-clean range, confirmed with V Haus on 24 Nov. Pillows RU003.',
   options: [
    {name: '01 Alaska', note: 'Creamy white. Brightest, shows marks most.', img: '/images/look/sofa-fabric-01-alaska.webp', sw: ['#e9e5da']},
    {name: '02 Soft Clay', note: 'Light warm greige, close to the showroom sofa. Light and calm with the cream floor.', img: '/images/look/sofa-fabric-02-soft-clay.webp', sw: ['#d9d0c1']},
    {name: '03 Wheat', note: 'Warm beige with a little grey. Between Soft Clay and Driftwood.', img: '/images/look/sofa-fabric-03-wheat.webp', sw: ['#cfc4b2']},
    {name: '04 Warm Driftwood', note: 'Warm taupe-grey. Best contrast with the cream floor; hides wear; pairs with walnut.', img: '/images/look/sofa-fabric-04-warm-driftwood.webp', sw: ['#b3aa9c']},
    {name: '06 Juniper', note: 'Olive gold. Bold; better as a cushion colour than a whole sofa.', img: '/images/look/sofa-fabric-06-juniper.webp', sw: ['#8e7d2e']},
    {name: '07 Silk Grey', note: 'Light cool grey. A cooler look against the warm walnut.', img: '/images/look/sofa-fabric-07-silk-grey.webp', sw: ['#d3d4d0']},
    {name: '08 Pablo', note: 'Mid grey. Practical, but cooler than the rest of the room.', img: '/images/look/sofa-fabric-08-pablo.webp', sw: ['#a9aaa6']},
    {name: '09 Inkwell', note: 'Charcoal. Hides everything; heavy in a light room.', img: '/images/look/sofa-fabric-09-inkwell.webp', sw: ['#77787a']},
    {name: 'RU002 Almond (easy clean): chosen', note: 'Easy-clean fabric, warm beige. Chosen and confirmed with V Haus on 24 Nov.', img: '/images/look/sofa-fabric-ru002-almond.webp', sw: ['#cdbca5']},
   ]},
  {id: 'direction', title: 'Overall look', room: 'Whole home', rec: 0, why: 'It follows the inspiration picture and the walnut dining set, and every other choice on this page works with it.',
   options: [
    {name: 'Warm modern', note: 'Warm white, cream, walnut and soft taupe. Cosy, easy to keep looking tidy.', sw: ['#f1ead9', '#e2d6c6', '#b3aa9c', '#5b3a29', '#b5603b']},
    {name: 'Light Japandi', note: 'White, light oak, linen and black details. Brighter and more minimal.', sw: ['#f4f2ec', '#d8bf98', '#d9d0c1', '#1d1d1d']},
    {name: 'Soft contrast', note: 'Warm white, walnut and charcoal grey. More dramatic; darker sofa.', sw: ['#f2efe6', '#5b3a29', '#77787a', '#c9a96e']},
   ]},
  {id: 'doors', title: 'Doors and door frames', room: 'Whole home', rec: 0, why: 'The red-brown doors are solid and in good condition. Keeping them costs nothing; warm white walls, a cream floor and a taupe sofa all sit fine with them, and the walnut dining set is in the same wood family. Change them later only if they really bother the family.',
   note: 'Not in the I-Niche quote. A door wrap (laminate over the existing door and frame) is the usual cheaper fix: ask I-Niche for a price per door and frame if the family wants it. Painting over varnished wood tends to chip.',
   options: [
    {name: 'Keep as they are', short: 'Red-brown', note: 'No cost, no work. Choose other colours to sit well with them.', sw: ['#6a2a20', '#e2d6c6']},
    {name: 'Wrap in warm white', short: 'White wrap', note: 'Brightest and most modern; extra cost per door and frame.', sw: ['#efe9de', '#e2d6c6']},
    {name: 'Wrap in light oak', short: 'Oak wrap', note: 'Softer wood look; matches light oak vinyl; extra cost.', sw: ['#d4b48a', '#e2d6c6']},
   ]},
  {id: 'walls', title: 'Wall paint (living and dining)', room: 'Living room', rec: 0, why: 'Apple White is a warm off-white that Nippon itself suggests for rooms with wood furniture: it picks up the walnut without looking yellow.',
   note: 'Nippon Paint names. I-Niche paints (F1). Ask for a sample pot or look at the fan deck on the wall in daylight and at night: the cove lights make whites look warmer.',
   options: [
    {name: 'Nippon Apple White (1140)', note: 'Warm off-white. Best with wood furniture.', sw: ['#f1ead9']},
    {name: 'Nippon Sail White', note: 'Soft, popular white; slightly warm under warm lights.', sw: ['#f2efe6']},
    {name: 'Nippon Foamy Cream (NP OW 2226 P)', note: 'Creamier and cosier; close to the inspiration picture.', sw: ['#f1e6cf']},
   ]},
  {id: 'curtains', title: 'Living room curtains', room: 'Living room', rec: 0, why: 'Same as the inspiration picture: white sheers for daytime light and privacy, a warm oatmeal day curtain that ties the cream floor to the sofa.',
   options: [
    {name: 'Oatmeal day curtain + white sheer', note: 'Warm and soft; matches the inspiration picture.', sw: ['#d8ccb8', '#f5f3ee']},
    {name: 'Warm grey day curtain + white sheer', note: 'Picks up a grey sofa; a little cooler.', sw: ['#a8a29a', '#f5f3ee']},
    {name: 'White sheer + blackout roller blind', note: 'Cleanest look; less cosy.', sw: ['#f7f6f2', '#8a8580']},
   ]},
  {id: 'cushions', title: 'Cushions and accents', room: 'Living room', rec: 0, why: 'The two free V Haus pillows already give a tonal look; one terracotta cushion or throw adds warmth that echoes the walnut. Easy to change later.',
   options: [
    {name: 'Tonal + one terracotta', note: 'Soft Clay and Wheat pillows, one terracotta accent.', sw: ['#d9d0c1', '#cfc4b2', '#b5603b']},
    {name: 'Olive accents', note: 'Uses the Juniper olive as the accent colour.', sw: ['#d9d0c1', '#8e7d2e', '#5b3a29']},
    {name: 'Navy and cream', note: 'Cooler, crisper contrast.', sw: ['#e9e5da', '#2f3b55', '#a9aaa6']},
   ]},
  {id: 'coffee', title: 'Coffee table (still undecided)', room: 'Living room', rec: 0, why: 'A round walnut table about 80 to 90 cm matches the LINO set, is easy to walk around, and can be moved aside for mahjong.',
   note: 'The coffee table is a Maybe on the to-buy list. Try sizes on the floor plan.',
   options: [
    {name: 'Round walnut, about 80 to 90 cm', note: 'Matches the dining set.', sw: ['#5b3a29']},
    {name: 'Round light stone (travertine look)', note: 'Lighter; contrasts with the sofa.', sw: ['#d9cbb5']},
    {name: 'No coffee table, one side table', note: 'Most floor space; easiest for the robot vacuum and mahjong nights.', sw: ['#e2d6c6']},
   ]},
  {id: 'vinyl', title: 'Bedroom floor (SPC vinyl)', room: 'Bedrooms', rec: 0, why: 'Light natural oak makes the small bedrooms feel bigger and goes with every bed headboard colour.',
   note: 'I-Niche F2, all 3 bedrooms. Ask I-Niche for the vinyl brand and its sample board; choose the plank in daylight next to the wall paint and a door frame. The doors and frames are red-brown: a clean light oak gives contrast; an orange-toned oak would clash.',
   options: [
    {name: 'Light natural oak', note: 'Brightest; makes rooms feel bigger.', sw: ['#d8bf98']},
    {name: 'Warm mid oak', note: 'Cosier; closer to the walnut tone.', sw: ['#b08458']},
    {name: 'Greige oak', note: 'Modern grey-beige; hides dust well.', sw: ['#b5aa98']},
   ]},
  {id: 'wardrobe', title: 'KX L-shaped wardrobe finish', room: 'KX bedroom', rec: 0, why: 'The light stone finish in the V Haus example is calm, hides fingerprints, and suits a full-height wardrobe in a bedroom.',
   note: 'V Haus measures on Tue 8 Dec: choose body and door colours by then.',
   options: [
    {name: 'Light stone with black long handles (like the V Haus example)', note: 'Example from the V Haus salesperson.', img: '/images/buy/v-haus-alto-l-wardrobe-example.webp', ex: true, sw: ['#cfc8bd', '#1e1e1e']},
    {name: 'Warm white with slim handles', note: 'Lightest; shows marks around handles.', sw: ['#efe9de', '#c9a96e']},
    {name: 'Light oak with black handles', note: 'Warmer, matches light oak vinyl.', sw: ['#d4b48a', '#1e1e1e']},
   ]},
  {id: 'kitchen-door', title: 'Kitchen glass sliding door', room: 'Kitchen', rec: 0, why: 'A slim black frame looks clean against warm white walls; fluted (reeded) glass lets light through but blurs kitchen clutter.',
   note: 'I-Niche E2 + E2a. Send the choice to I-Niche (to-do on the to-buy page).',
   options: [
    {name: 'Black slim frame + fluted glass', note: 'Hides clutter, still bright.', sw: ['#1d1d1d', 'fluted']},
    {name: 'Black slim frame + clear glass', note: 'Most open; kitchen fully visible.', sw: ['#1d1d1d', 'clear']},
    {name: 'Champagne frame + frosted glass', note: 'Softer, warmer; full privacy.', sw: ['#c9a96e', 'frosted']},
   ]},
 ],
};

export const lookChoice = (b, v = {}) => {const n = Number(v[`l:${b.id}`]); return Number.isInteger(n) && n >= 0 && n < b.options.length && v[`l:${b.id}`] !== '' ? n : b.rec;};
export function lookKeys(look = LOOK) {const k = new Map(); for (const b of look.boards) k.set(`l:${b.id}`, b); return k;}
// '' clears the family choice (back to the recommended pick).
export const validLookValue = (b, value) => value === '' || (/^\d{1,2}$/.test(value) && Number(value) < b.options.length);
