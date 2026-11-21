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
  id: 'beds', title: 'Beds and mattresses', rooms: ['ky', 'ks', 'kx'], status: 'Shortlist', updated: '2026-11-21',
  chat: 'La Casa shop helper chat', plan: ['ky-bed', 'ks-bed', 'kx-bed'],
  answer: 'Leaning to BM Mattress Premium Outlet (Sutera, JB): solid hydraulic storage frames that feel well made, branded mattresses (King Koil, Sealy), delivery to Singapore. Compare with the fair on Sun 22 Nov, confirm sizes and frames on 3 Dec, and BM aims to deliver by 21 Dec or the last week of December. Each person picks a feel: soft, medium-firm or firm.',
  decide: [
   'Feel for each person: soft, medium-firm or firm (see the Feel line on each mattress).',
   'Bed size for each room: queen (152 × 190 cm) or super single (107 × 190 cm). Set on 3 Dec.',
   'Final bundle price at BM (they may give a bundle discount at the end). Target: about RM5,000 per queen mattress and RM1,300 per queen frame, delivered, GST included.',
   'Get the warranty in writing: King Koil 15 years, other brands 10 years, claims covered in Singapore (BM said so on WhatsApp, 21 Nov).',
   'Keep or drop the I-Niche platform bed in KS room (D3 + D3a, S$1,810, on hold).',
  ],
  shortlist: [
   {group: 'Mattress', name: 'King Koil Luxury Gentle, queen', price: 6200, cur: 'MYR', shop: 'BM Mattress, Sutera (JB)', size: [1520, 1905], specs: [['Feel', 'Soft'], ['Price', 'Asking price, mattress only, 21 Nov. Plus 9% GST for SG delivery'], ['Free', '2 pillows + 1 mattress protector'], ['Same model elsewhere', 'Fair (IBENZ) RM6,134 each for 3; Couch Designs RM4,829 (KL)']], why: 'The model tried and liked. Same price as the fair, but BM also has the storage frames.'},
   {group: 'Mattress', name: 'King Koil Luxury Qi Cool Firm (Luxury Hotel Collection), queen', price: 6900, cur: 'MYR', shop: 'BM Mattress, Sutera (JB)', size: [1520, 1905], specs: [['Feel', 'Medium-firm to firm'], ['Price', 'Asking price, mattress only, 21 Nov. Plus 9% GST']], why: 'Hotel collection; the most expensive seen at BM.'},
   {group: 'Mattress', name: 'Eclipse, queen', price: 6100, cur: 'MYR', shop: 'BM Mattress, Sutera (JB)', size: [1520, 1905], specs: [['Feel', 'Medium-firm'], ['Brand', 'To confirm'], ['Price', 'Asking price, 21 Nov. Plus 9% GST']], why: 'Medium-firm option.'},
   {group: 'Mattress', name: 'King Koil Indulgence (Extended Life), queen', price: 4500, cur: 'MYR', shop: 'BM Mattress, Sutera (JB)', size: [1520, 1905], specs: [['Feel', 'To check'], ['Price', 'Asking price, 21 Nov. Plus 9% GST']], why: 'Cheaper King Koil range; lie on it to compare.'},
   {group: 'Mattress', name: 'Backpedic Cool Comfort, queen', price: 4300, cur: 'MYR', shop: 'BM Mattress, Sutera (JB)', size: [1520, 1905], specs: [['Feel', 'To check'], ['Brand', 'To confirm. If Van Vorst: little owner feedback']], why: 'Cheapest seen at BM.'},
   {group: 'Mattress', name: 'King Koil Luxury Gentle, queen × 3 (fair bundle)', price: 6134, cur: 'MYR', shop: 'Fair: King Koil by IBENZ (Stanley)', size: [1520, 1905], specs: [['Feel', 'Soft'], ['Offer', 'RM18,403 for 3 (list RM23,004, RM7,668 each)'], ['Free', '6 microfibre pillows, 3 Cooltech mattress protectors, 3 Tencel 4-in-1 1200 sheet sets, 3 extra-soft bolsters']], why: 'Same model as BM at about the same price, with bedding thrown in. No storage frame.'},
   {group: 'Mattress', name: 'King Koil Support Pedic Comfort, queen × 3 (fair bundle)', price: 5300, cur: 'MYR', shop: 'Fair: King Koil by IBENZ (Stanley)', size: [1520, 1905], specs: [['Feel', 'To check'], ['Offer', 'RM15,899 for 3 (list RM20,967, RM6,989 each)'], ['Free', '6 microfibre pillows, 3 Cooltech mattress protectors, 3 extra-soft bolsters']], why: 'Lowest King Koil price per piece seen so far.'},
   {group: 'Mattress', name: 'King Koil Luxury Gentle, queen (online)', price: 4829, cur: 'MYR', shop: 'Couch Designs (KL)', size: [1520, 1905], specs: [['Delivery', 'Free only in KL, Selangor, Putrajaya']], why: 'Cheapest price seen for this model (20 Nov). Use it to bargain.'},
   {group: 'Mattress', name: 'Sealy PosturePremier Treasure, queen', price: 2099, cur: 'SGD', shop: 'Harvey Norman (SG)', href: 'https://www.harveynorman.com.sg', size: [1520, 1905], specs: [['Feel', 'Pillow top, medium soft'], ['Note', 'SG price includes GST, SG warranty and delivery']], why: 'Singapore benchmark.'},
   {group: 'Mattress', name: 'Natura black hotel-grade mattress', price: null, cur: 'MYR', shop: 'Natura dealer, JB', size: [1520, 1905], specs: [['Status', 'Not listed online. Get the model name and price at the fair']], why: 'Hotel-grade feel to compare.'},
   {group: 'Storage frame', name: 'BM hydraulic lift-up storage bed frame, queen', price: 1600, cur: 'MYR', shop: 'BM Mattress, Sutera (JB)', specs: [['Headboard', 'RM700 extra (optional)'], ['Height', '14 inch (about 36 cm)'], ['Price', 'Asking price, 21 Nov. Plus 9% GST'], ['Seen in store', 'Good materials, solid build (better than the fair frames)']], why: 'Solves the storage-bed problem: the fairs had cheap-feeling frames or none.', pick: true},
   {group: 'Storage frame', name: 'BM storage bed frame, super single', price: 1400, cur: 'MYR', shop: 'BM Mattress, Sutera (JB)', specs: [['Headboard', 'RM550 extra (optional)'], ['Price', 'Asking price, 21 Nov. Plus 9% GST']], why: 'Same build as the queen frame.'},
   {group: 'Storage frame', name: 'Megafurniture Ashleah storage bed (water-repellent fabric)', price: 549, cur: 'SGD', shop: 'Megafurniture (SG)', href: 'https://megafurniture.sg/products/ashleah-fabric-storage-bed', specs: [['Super single', 'S$499'], ['Includes', 'Cushioned headboard, free delivery and install'], ['Showroom', 'Oxley BizHub, 61 Ubi Road 1 #01-34, daily 11am–7pm']], why: 'Singapore benchmark, GST included.'},
  ],
  notes: [
   'BM Mattress Premium Outlet (Sutera): free delivery for orders RM5,000 and above; 9% Singapore GST charged for SG delivery; 2 pillows + 1 protector per mattress. Appointment Sun 22 Nov, 11am.',
   'If sizes and frames are confirmed on 3 Dec, BM aims to deliver by 21 Dec or the last week of December (before the January move-in).',
   'Per queen set at BM asking prices: Luxury Gentle RM6,200 + frame RM1,600 = RM7,800, plus 9% GST = RM8,502 (about S$2,682). Singapore set: Sealy Treasure S$2,099 + Megafurniture Ashleah S$549 = S$2,648. At the target (RM5,000 + RM1,300 + GST = RM6,867, about S$2,166) BM saves about S$480 per set.',
   'Fair (IBENZ) prices are for 3 queens and include bedding and bolsters, but no storage frame. Ask the SG delivery cost and GST.',
   'Ask every shop for ONE written quote with both sizes (3 super single and 3 queen), with and without the frame. Deposit only if the size can be set by 5 Dec at the quoted price.',
   'Queen frames: 2 gas struts and a plywood or solid base. Super single: end lift (opens from the foot end) if there is no side space.',
   'Storage beds sit on the floor, so the robot vacuum does not go under them. Any bed on legs needs 12 cm clear.',
  ],
 },
 {
  id: 'vhaus', title: 'V Haus: dining set, wardrobe, sofa', rooms: ['dining', 'kx', 'living'], status: 'Shortlist', updated: '2026-11-21',
  chat: 'La Casa shop helper chat', plan: ['dining-table', 'living-sofa'],
  answer: 'Three things from V Haus Living (JB, contact Jason Yee): the LINO dining set (sold out, next stock mid to end January), a custom L-shaped wardrobe for KX room (about RM5,800, measured after the 3 to 5 Dec hacking, made in about a month) and the sofa (not chosen yet).',
  decide: [
   'Sofa model and fabric (visit V Haus, maybe Sun 22 Nov).',
   'Wardrobe details: board brand and thickness, hinge and drawer runner brand, swing or sliding doors, inside layout, delivery and install in Singapore, GST, warranty.',
   'When to pay the 30% dining deposit to hold January stock.',
  ],
  shortlist: [
   {group: 'Dining', name: 'V Haus LINO dining table + 4 chairs', price: 2299, cur: 'MYR', shop: 'V Haus Living (JB)', size: [1600, 900], specs: [['Stock', 'Sold out now; ordering now gets January stock (mid or end of January, date not fixed)'], ['Payment', '30% deposit; balance 3 to 5 days before delivery'], ['Change or cancel', 'Free until V Haus orders from the factory (about 1 month before the delivery date; they confirm first). After that, no change or cancel']], why: 'Chosen. January delivery fits the move-in.', pick: true},
   {group: 'Wardrobe', name: 'Custom L-shaped wardrobe, KX room, full height', price: 5800, cur: 'MYR', shop: 'V Haus Living (JB)', specs: [['Size', '1880 + 1125 mm long × 600 mm deep × 2700 mm high (9 ft)'], ['Board', 'Mixbox melamine board'], ['Price', 'Estimate from WhatsApp, 21 Nov'], ['Time', 'About 1 month after measuring'], ['Measure', 'After the old wardrobe is hacked (3 to 5 Dec)']], why: 'Replaces the I-Niche D4 wardrobe (S$3,200, removed). About S$1,830, or about S$1,994 with 9% GST.', pick: true},
   {group: 'Sofa', name: 'L-shape 4-seat sofa', price: 6000, cur: 'MYR', shop: 'V Haus Living (JB)', size: [2600, 1600], specs: [['Status', 'Not chosen; RM6,000 is the budget estimate'], ['Fabric', 'Owners praise the Pesto Easy Clean fabric']], why: 'Pending the shop visit.'},
  ],
  notes: [
   'Wardrobe timeline: hacking 3 to 5 Dec, V Haus measures after that, about 1 month to make, so install by mid January if measured early December.',
   'Melamine board is fine for a bedroom wardrobe if every edge is sealed (edge banding). Ask for 18 mm board and the board brand.',
   'Ask V Haus to quote delivery and install in Singapore with GST, so all three items can come in one delivery in January.',
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
