// LaCasa research area (/research, and the item panels on /plan).
// One topic per decision. Research chats add or update a topic here, then push.
// Rules: real brands only, exact links and prices with the date seen, SG first with JB options.
// Simple English, no "you", "perfect" or "amazing". RM converted at BUY.rate on the page.
//
// Topic fields:
//   id (stable), title, rooms (plan room ids), status: 'Researching' | 'Shortlist' | 'Decided',
//   updated (YYYY-MM-DD), chat (which chat owns it), answer (10-second answer),
//   decide: open questions, shortlist: [{name, group, price, cur, shop, href, size: [w, d] in mm,
//   specs: [[label, value]], why, pick: true for the current pick}], notes: [], plan: plan item ids it applies to.
export const RESEARCH = [
 {
  id: 'beds', title: 'Beds and mattresses', rooms: ['ky', 'ks', 'kx'], status: 'Researching', updated: '2026-11-21',
  chat: 'Bedroom and bed shopping chat (ongoing)', plan: ['ky-bed', 'ks-bed', 'kx-bed'],
  answer: 'Branded mattress, soft but not too soft, for all three rooms. Queen gets a hydraulic lift-up storage frame (2 gas struts); super single gets a normal or end lift-up. Sizes are set after measuring on 3 Dec, so get written quotes for both sizes first.',
  decide: [
   'Bed size for each room: queen (152 × 190 cm) or super single (107 × 190 cm). Check on 3 Dec with the plan here.',
   'Keep or drop the I-Niche platform bed in KS room (D3 + D3a, S$1,810, on hold).',
   'Mattress: King Koil Luxury Gentle (tried, liked) vs Natura black hotel model vs others at the fair.',
  ],
  shortlist: [
   {group: 'Mattress', name: 'King Koil Luxury Gentle, queen', price: 4829, cur: 'MYR', shop: 'Couch Designs (MY)', size: [1520, 1905], specs: [['Feel', 'Soft (tried in store, liked)'], ['Other prices', 'King Koil e-store and Livano RM6,898; Maju Home and fair RM7,668 (list)'], ['Delivery', 'Free only in KL, Selangor, Putrajaya']], why: 'Cheapest seen on 20 Nov. Fair target: RM5,200 or less.', pick: true},
   {group: 'Mattress', name: 'Natura black hotel-grade mattress', price: null, cur: 'MYR', shop: 'Natura dealer, JB', size: [1520, 1905], specs: [['Status', 'Not listed online. Get the model name and price at the fair or a JB dealer']], why: 'Hotel-grade feel the family wants to compare.'},
   {group: 'Mattress', name: 'Sealy PosturePremier Treasure, queen', price: 2099, cur: 'SGD', shop: 'Harvey Norman', href: 'https://www.harveynorman.com.sg', size: [1520, 1905], specs: [['Feel', 'Pillow top, medium soft']], why: 'Singapore option already on the to-buy list.'},
   {group: 'Storage frame', name: 'Megafurniture Ashleah storage bed (water-repellent fabric)', price: 549, cur: 'SGD', shop: 'Megafurniture', href: 'https://megafurniture.sg/products/ashleah-fabric-storage-bed', specs: [['Super single', 'S$499'], ['Lift', 'Gas lift'], ['Showroom', 'Oxley BizHub, 61 Ubi Road 1 #01-34, daily 11am–7pm']], why: 'Fair price for a real gas lift (SG mid range: SS S$450–650, queen S$550–900).', pick: true},
   {group: 'Storage frame', name: 'Megafurniture Ellie / Cilia storage bed', price: null, cur: 'SGD', shop: 'Megafurniture', href: 'https://megafurniture.sg', specs: [['Lift', 'Bansbach (German) gas struts'], ['Warranty', 'Ellie: 6 months, 3 years on the hydraulics']], why: 'Better struts and longer hydraulic warranty.'},
   {group: 'Storage frame', name: 'Getha 3-in-1 bed frame (JB)', price: 2799, cur: 'MYR', shop: 'Getha, JB', href: 'https://getha.com.my', specs: [['Note', 'Queen is 150 cm wide (Malaysia), not the Singapore 152 cm']], why: 'Only if bundled cheaply with a Getha mattress.'},
  ],
  notes: [
   'Fair weekend (Johor Furniture & Electrical Fair, MVEC Mid Valley Southkey, 20–22 Nov): get ONE written quote per booth with both sizes (3 super single and 3 queen), with and without the bundle frame. Close on Sunday only if the deposit terms are agreed.',
   'Deposit wording to ask for: "size to be confirmed by 5 Dec, at the quoted price for that size". Delivery to Singapore held until after 3 Dec. Ask the SG delivery cost, warranty sag depth and who inspects claims in Singapore.',
   'Queen frames: 2 gas struts and a plywood or solid base (avoid single-strut queens). Super single: end lift (opens from the foot end, no side space needed). Drawers only with about 50 cm free beside the bed.',
   'Buy frames in Singapore unless a JB queen frame is under about RM1,500 delivered, or the mattress bundle adds RM800–1,000 or less per bed.',
   'Budget idea: mattress (queen) RM5,000 or less each, super single about 30% less; frame queen S$700 or less, super single S$550 or less. About S$6,800 for 3 queen sets, S$5,000 for 3 super single sets.',
   'Storage beds sit on the floor, so the robot vacuum does not go under them. Any bed on legs needs 12 cm clear.',
  ],
 },
 {
  id: 'bathroom', title: 'Bathroom fittings (both bathrooms)', rooms: ['common-bath', 'master-bath'], status: 'Shortlist', updated: '2026-11-21',
  chat: 'La Casa main chat', plan: [],
  answer: 'Buy in Singapore: PUB only accepts WELS-registered fittings, and plumbers get demerit points for non-WELS ones. Visit the Rigel Experience Centre to see them, then buy at Heritage Bathroom Gallery (Rigel, Grohe, American Standard, Kohler).',
  decide: ['Vanity: wall-hung, 2 drawers, integrated basin top, 1 tap hole, about 60 × 45 cm (width set on 3 Dec).', 'Toilet bowl model after I-Niche measures the outlet on 3 Dec.'],
  shortlist: [
   {group: 'Toilet', name: 'RIGEL one-piece rimless, slim tank', price: 525, cur: 'SGD', shop: 'RIGEL e-store', href: 'https://rigel-estore.com.sg', specs: [['Was', 'S$770'], ['Type', 'One-piece, rimless, skirted, soft-close quick-release seat']], why: 'Easy to clean; check the outlet distance first.', pick: true},
   {group: 'Basin tap', name: 'Grohe Eurostyle basin mixer', price: 219, cur: 'SGD', shop: 'Hoe Kee', specs: [['Other', 'Grohe Eurosmart Cosmopolitan S$209 (FortyTwo); Rigel basin mixers S$130–330']], why: 'Grohe costs about the same as Rigel.'},
   {group: 'Shower', name: 'Rigel Quatre 4-in-1 exposed shower', price: 575, cur: 'SGD', shop: 'RIGEL e-store', href: 'https://rigel-estore.com.sg', specs: [['Range', 'S$575–799 by finish']], why: 'Rain shower, hand shower and tap in one set.'},
   {group: 'Hand shower', name: 'Hansgrohe Croma 100 hand shower set', price: 93.74, cur: 'SGD', shop: 'Online', specs: [['Note', 'Heritage does not sell Hansgrohe']], why: 'Cheap upgrade for the master bathroom.'},
  ],
  notes: [
   'Vanity top: vitreous china (ceramic) integrated top is best. Solid surface is OK but can scratch, stain and turn yellow. Ask Rigel which material each "integrated basin top" is.',
   'Vanity cabinet: PVC foam board or aluminium honeycomb is best. Water-resistant or marine plywood with HPL is OK if every edge is sealed. Avoid MDF and particleboard.',
   'Hardware: stainless 304 hinges, soft-close runners (Blum or Hettich), rounded inner corners.',
   'Rigel Experience Centre: 20 Changi Business Park Central 2 (near Expo MRT), tel 6812 6288; check hours before going.',
   'Heritage Bathroom Gallery: 718 Geylang Road; Mon–Sat 11:30am–8:30pm, Sun and PH 11am–7pm; WhatsApp +65 9723 1228. No online prices.',
   'Weekday trip: Rigel (Changi) → Megafurniture (Ubi, bed frames) → Heritage (Geylang).',
  ],
 },
 {
  id: 'fibre', title: 'Fibre broadband and Wi-Fi', rooms: ['ky', 'living', 'hall'], status: 'Shortlist', updated: '2026-11-21',
  chat: 'La Casa main chat', plan: ['wifi-main', 'wifi-atlas-1', 'wifi-atlas-2'],
  answer: 'StarHub UltraSpeed 5Gbps at S$29.55 a month (24 months): best reliability score and nearly the cheapest. The family already owns a Linksys MX4200 + two Atlas 6 mesh, so no new router is needed. Sign up 3 to 5 Dec, after checking the fibre point and LAN ports.',
  decide: ['Where the fibre point (TP) is, and if the wall LAN ports work (3 Dec).', 'Is the old owner’s line still active (can delay the new line).'],
  shortlist: [
   {group: 'Plan', name: 'StarHub UltraSpeed 5Gbps', price: 29.55, cur: 'SGD', shop: 'StarHub', href: 'https://www.starhub.com', specs: [['Per month', 'S$29.55 (usual S$68.53), 24 months'], ['Comes with', 'TP-Link HB615 Wi-Fi 7 router; free activation and install'], ['Reliability (Opensignal, Aug 2026)', '754, the highest']], why: 'Most reliable, near the cheapest.', pick: true},
   {group: 'Plan', name: 'M1 HomePac 10Gbps (ONT only)', price: 26.9, cur: 'SGD', shop: 'M1 shops', href: 'https://www.m1.com.sg', specs: [['Per month', 'S$26.90, 24 months'], ['Reliability', '679']], why: 'Cheapest; lower reliability score.'},
   {group: 'Plan', name: 'MyRepublic HyperSpeed 10Gbps + 2 mesh', price: 29.99, cur: 'SGD', shop: 'MyRepublic', href: 'https://myrepublic.net/sg', specs: [['Per month', 'S$29.99 (No Frills S$33.99)'], ['Reliability', '715']], why: 'Comes with mesh the family does not need.'},
  ],
  notes: [
   'All providers use the same NetLink fibre. Reliability (Opensignal, Aug 2026): StarHub 754, MyRepublic 715, Singtel 702, M1 679, ViewQwest 649, SIMBA 628.',
   'Best layout: fibre box (ONT) at the TP → wall LAN cable → MX4200 in KY room, PC plugged in by cable. Atlas nodes in the living room (wired through its wall port if it works) and the hall or KX room. If the wall port is dead, ask the I-Niche electrician (G3) to run new Cat6 from the TP to bedroom 3.',
   'Gaming: plug the desktop in by cable for a lower, steadier ping. 1 Gbps wired is plenty; the Linksys ports are gigabit.',
   'About 25 to 30 devices (phones, laptops, TV, Apple TV, 4 HomePods, robot vacuum, bulbs).',
   'NetLink needs about 2 to 4 weeks; a second-port capacity problem can add 4 to 8 weeks. Book the install about a week before move-in.',
   'Use the Wi-Fi layer on the floor plan to try node positions. It is an estimate; check with a phone Wi-Fi app after moving in.',
  ],
 },
];
export const researchById = id => RESEARCH.find(t => t.id === id) ?? null;
