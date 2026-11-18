// LaCasa to-buy list (19 Nov 2026). Prices were checked on the date in `checked`.
// cur: 'SGD' or 'MYR'. est: true = rough budget (no exact listing).
// The item itself is the recommended pick. alts are other options: the family can pick one on /buy and it is counted instead.
// id: stable key for saved choices (do not change once live).
// type: where the price was seen: 'Shop + online', 'Online', 'Shop'.
export const BUY = {
 checked: '2026-11-19',
 rate: 3.17, // RM per S$ (mid-market, 19 Nov 2026)
 rateSource: 'https://pluang.com/en/tools/currency-converter/sgd-myr',
 files: [
  {name: 'I-Niche quotation, 13 Nov 2026 (4 pages)', href: '/files/iniche-quotation-2026-11-13.pdf', note: 'Address and ID number hidden'},
  {name: 'I-Niche floor plan, original and proposed, 13 Nov 2026', href: '/files/iniche-floor-plan-2026-11-13.pdf', note: 'Address hidden'},
 ],
 sales: [
  {date: '2026-11-27', name: 'Black Friday (Fri). Gain City Black Fri-Yay runs 16–30 Nov'},
  {date: '2026-11-30', name: 'Cyber Monday. Last day for Mega Discount Store aircon code 7NV0'},
  {date: '2026-12-12', name: '12.12 sale (Shopee, Lazada, brand stores, Malaysia shops)'},
  {date: '2026-12-26', name: 'Year-end sales in Singapore stores'},
 ],
 rooms: [
  {id: 'contractor', name: 'Contractor (I-Niche) and admin', items: [
   {id: 'contractor-i-niche-renovation-quote', name: 'I-Niche renovation quote, as given', qty: 1, price: 24100, cur: 'SGD', shop: 'The I-Niche Design', type: 'Contractor', href: '/files/iniche-quotation-2026-11-13.pdf', date: '2026-11-19', when: 'Confirm scope at meeting. 10% deposit on signing', note: 'Payments 10/40/40/10. Not refundable if cancelled.'},
   {id: 'contractor-remove-items-not-in', name: 'Remove items not in our plan (A3, D1, D2, D3, D3a, D4, F4, F5)', qty: 1, price: -8680, cur: 'SGD', est: true, shop: 'If I-Niche agrees', type: 'Contractor', date: '2026-11-19', when: 'Decide at meeting', note: 'Keep D4 wardrobe or D1 TV wall only if we want them.'},
   {id: 'contractor-add-missing-work-electrical', name: 'Add missing work: electrical, LAN, aircon move, 2nd solid door', qty: 1, price: 6600, cur: 'SGD', est: true, shop: 'Ask I-Niche to price', type: 'Contractor', date: '2026-11-19', when: 'Get written price', note: 'Based on our 8 Oct brief allowances.'},
   {id: 'contractor-mcst-renovation-deposit-refundable', name: 'MCST renovation deposit (refundable)', qty: 1, price: 1000, cur: 'SGD', shop: 'La Casa management', type: 'Shop', date: '2026-11-28', when: 'With renovation form, 7+ days before work', note: 'Cash or cheque. Refunded after checks.'},
  ]},
  {id: 'aircon', name: 'Aircon (3 old units)', items: [
   {id: 'aircon-mitsubishi-starmex-system-3', name: 'Mitsubishi Starmex System 3 (3 × 9,000 BTU), 5 ticks, installed', model: 'MXY-3H28VG + 3 × MSXY-FP10VG', qty: 1, price: 4019, cur: 'SGD', shop: 'Gain City', type: 'Shop + online', href: 'https://www.gaincity.com/product/108519/sku', src: 'https://www.misslobang.com/article/best-system-3-aircon-singapore-2026', date: '2026-11-28', when: 'Order in Black Fri-Yay (ends 30 Nov). Install about 10 Dec, before painting', note: 'Installation included, 3-year installation warranty. No built-in Wi-Fi.', alts: [
    {name: 'Same Mitsubishi set, no installation shown', price: 3674, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/mitselec-mitsubishi-starmex-28k-condenser-system-39000btu-x-3-mxy-3h28vg%2B-msxy-fp10vg-sg3-x-3-IP219176.html'},
    {name: 'Same Mitsubishi set, installed, with code 7NV0 (to 30 Nov)', price: 3510, cur: 'SGD', shop: 'Mega Discount Store', type: 'Online', href: 'https://www.misslobang.com/article/best-system-3-aircon-singapore-2026'},
    {name: 'Daikin iSmile Eco+ System 3 (3 × 9,000 BTU), 5 ticks', price: 4020, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/daikin-daikin-7.5kwh-condenser-ismile-eco+-series-system-3-9000btu-x-3-mkm75zvmg+-ctkm25zvmg-x3-IP210313.html'},
    {name: 'Daikin iSmile Eco System 3 with Wi-Fi (9k + 18k + 24k), no installation', price: 3269, cur: 'SGD', shop: 'Megafurniture', type: 'Online', href: 'https://megafurniture.sg/products/daikin-ismile-eco-series-system-3-aircon-wifi-mkm85vvmg-1xctkm25vvmg-1xctkm50vvmg-1xctkm71vvmg-br-1-x-9000-1-x-18000-1-x-24000-btu'},
   ]},
  ]},
  {id: 'living', name: 'Living room', items: [
   {id: 'living-lg-oled-evo-c6', name: 'LG OLED evo C6 65" (2026)', model: 'OLED65C6PSA', qty: 1, price: 3633, cur: 'SGD', shop: 'Electromart', type: 'Online', href: 'https://electromart.sg/products/lg-oled65c6psa-oled-evo-ai-c6-4k-smart-tv-65inch', date: '2026-11-27', when: 'Black Friday. Deliver after final clean (early Jan)', note: 'Low stock shown. Same TV is S$4,099 at Harvey Norman and COURTS.', alts: [
    {name: 'LG OLED C6 65" at a physical store', price: 4099, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/tv-and-audio/tvs-en-2/tvs-en-3/65-inches-tvs/lg-65-inch-c6-oled-evo-ai-4k-2026-smart-tv-black-oled65c6psa.atc.html'},
    {name: 'Samsung QN70H 85" Neo QLED mini-LED (2026)', price: 4599, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/tv-and-audio/tvs-en-2/tvs-en-3/samsung-85-inch-qn70h-4k-neo-qled-samsung-vision-ai-2026-smart-tv-black-qa85qn70hakxxs.html'},
    {name: 'LG OLED C6 77" (2026)', price: 7499, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/tv-and-audio/tvs-en-2/tvs-en-3/lg-77-inch-c6-oled-evo-ai-4k-2026-smart-tv-black-oled77c6psa.atc.html'},
   ]},
   {id: 'living-apple-tv-4k-4th', name: 'Apple TV 4K (4th gen, 2026)', qty: 1, price: 399, cur: 'SGD', shop: 'Apple Store', type: 'Shop + online', href: 'https://www.apple.com/sg/shop/buy-tv/apple-tv-4k', src: 'https://everymac.com/devices/global-prices/all-msrp-apple-tv-prices-in-singapore.html', date: '2026-11-27', when: 'Any time. Set up after the TV arrives', note: 'Needed for 4-speaker surround. Also the HomeKit hub.'},
   {id: 'living-homepod-2nd-gen-front', name: 'HomePod (2nd gen), front left and right', qty: 2, price: 429, cur: 'SGD', shop: 'Apple Store', type: 'Shop + online', href: 'https://www.apple.com/sg/shop/buy-homepod/homepod', src: 'https://everymac.com/devices/global-prices/all-msrp-apple-homepod-prices-in-singapore.html', date: '2026-11-27', when: 'Same time as Apple TV', note: 'S$429 is the launch price. Check the store price on the day.'},
   {id: 'living-homepod-mini-2-back', name: 'HomePod mini 2, back left and right', qty: 2, price: 199, cur: 'SGD', shop: 'Apple Store', type: 'Shop + online', href: 'https://www.apple.com/sg/shop/buy-homepod/homepod-mini', src: 'https://everymac.com/devices/global-prices/all-msrp-apple-homepod-prices-in-singapore.html', date: '2026-11-27', when: 'Same time as Apple TV', note: 'Must be mini 2. The 2020 mini does not work for surround.'},
   {id: 'living-l-shape-4-seat', name: 'L-shape 4-seat sofa', qty: 1, price: 6000, cur: 'MYR', est: true, shop: 'V Haus Living, Johor Jaya', type: 'Shop', href: 'https://uchify.com/v-haus-living-johor-bahru/', date: '2026-12-13', when: 'Visit and order. Deliver mid-Jan after clean', note: 'V Haus does not list sofa prices online. RM6,000 is our quality budget. Owners praise the Pesto Easy Clean fabric.'},
   {id: 'living-philips-meson-5-13w', name: 'Philips Meson 5" 13W recessed downlight (3000K or 4000K)', qty: 8, price: 39.45, cur: 'MYR', shop: 'Lapasar (MY); JB lighting shops stock Philips', type: 'Online', href: 'https://mall.lapasar.com/products/155107', date: '2026-12-05', when: 'Buy in JB before the electrician starts', note: 'Contractor patches old holes (B2). Agree the new layout first.'},
   {id: 'living-led-cove-strip-driver', name: 'LED cove strip + driver', qty: 1, price: 350, cur: 'MYR', est: true, shop: 'JB lighting shop', type: 'Shop', date: '2026-12-05', when: 'With downlights'},
   {id: 'living-track-or-spot-lights', name: 'Track or spot lights for TV wall / art', qty: 2, price: 200, cur: 'MYR', est: true, shop: 'JB lighting shop', type: 'Shop', date: '2026-12-05', when: 'With downlights'},
  ]},
  {id: 'dining', name: 'Dining', items: [
   {id: 'dining-v-haus-lino-dining', name: 'V Haus LINO dining table + 4 chairs (no side chairs)', qty: 1, price: 2299, cur: 'MYR', shop: 'V Haus Living', type: 'Shop', date: '2026-12-13', when: 'Order with sofa', note: 'Chosen. Order with 4 chairs only (drop the 2 end chairs) and ask for the lower price. Check chair pull-out space on the 175 cm side.'},
   {id: 'dining-kdk-f40gp-100-cm', name: 'KDK F40GP 100 cm Wi-Fi DC ceiling fan with LED light', qty: 1, price: 418, cur: 'SGD', shop: 'KDK Singapore', type: 'Online', href: 'https://www.kdk.sg/products/ceiling-fan-f40gp', date: '2026-12-05', when: 'Buy before electrician. JB KDK dealers may be cheaper', note: 'KDK Bundle D (2 × F40GP) is S$788. Check clearance to walls.'},
  ]},
  {id: 'kitchen', name: 'Kitchen and yard', items: [
   {id: 'fridge', name: 'Hitachi 407 L 2-door fridge, inverter', model: 'R-VX480PMS9', qty: 1, price: 979, cur: 'SGD', shop: 'Gain City', type: 'Shop + online', href: 'https://www.gaincity.com/brands/HITACHI?p=2', date: '2026-11-27', when: 'Black Friday. Deliver after clean', note: '68 W × 72 D × 177 H cm, fits our 70 × 75 × 180 cm space with 1 cm each side. 10-year compressor warranty. Freezer on top.', alts: [
    {name: 'Panasonic 405 L, freezer at bottom', model: 'NR-BX471CPSS', price: 1019, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/panasonic-nr-bx471cpss-2-dr-fridge-405l-ip168440', note: 'Good, reliable brand. 68.6 cm wide: only 7 mm each side. Measure first.'},
    {name: 'Hitachi 407 L, mirror glass door', model: 'R-VGX480PMS9', price: 1099, cur: 'SGD', shop: 'Gain City', type: 'Shop + online', href: 'https://www.gaincity.com/brands/HITACHI?p=2'},
    {name: 'Toshiba 411 L, white glass (70 cm wide: no gap in our space)', model: 'GR-RT559WE-PMX(21S)', price: 899, cur: 'SGD', shop: 'Electromart', type: 'Online', href: 'https://electromart.sg/products/toshiba-gr-rt559we-pmx21s-top-mounted-refrigerator-411l'},
    {name: 'Mitsubishi 423 L, freezer at bottom (69.9 cm wide: no gap)', model: 'MR-HGS52EXG', price: 1799, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/mitsubishi-2-door-bottom-freezer-423l-mr-hgs52exgwhp-IP204243.html'},
   ]},
   {id: 'washer', name: 'Panasonic 12.5 kg front-load washer', model: 'NA-25CEW1BSG', qty: 1, price: 1339, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/panasonic-front-load-washer-12.5kg-na-25cew1bsg-IP211791.html', date: '2026-11-27', when: 'Black Friday. Deliver after clean', note: '59.6 W × 60.5 D cm, fits the 67 cm depth. Panasonic is as reliable as LG. A full 12 kg wet load is heavy for the Steigen Mini: hang in 2 lots.', alts: [
    {name: 'Panasonic 12 kg with AutoDose and auto clean', model: 'NA-24VDW1BSG', price: 1519, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/panasonic-smart-front-load-washer-with-auto-clean---black-12kg-na-24vdw1bsg-IP222529.html'},
    {name: 'LG 12 kg AI DD (56.5 cm deep)', model: 'FX1412S2KA', price: 2049, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/home-appliances/washing-machines-and-dryers-en/washing-machines-en/lg-12kg-front-load-washer-matte-black-fx1412s2ka.html'},
    {name: 'LG 9 kg AI DD', model: 'FX1409S5G', price: 1299, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/lg-front-load-washer---essense-graphite-9kg-fx1409s5g-IP223515.html'},
    {name: 'Bosch Series 6 9 kg (i-DOS)', model: 'WGG24400SG', price: 1521, cur: 'SGD', shop: 'Electromart', type: 'Online', href: 'https://electromart.sg/products/bosch-wgg24400sg-front-load-washer-9kg'},
   ]},
   {id: 'kitchen-steigen-solar-mini-drying', name: 'Steigen Solar Mini drying rack, installed', qty: 1, price: 899, cur: 'SGD', shop: 'Steigen', type: 'Online', href: 'https://www.steigen.com.sg/collections/all', date: '2026-12-12', when: '12.12. Install after painting', note: 'Mini fits ceiling 110–144 cm (ours 120 cm). Steigen lists it for washers up to 7 kg and queen bedding. Mega needs 145 cm+.', alts: [
    {name: 'Steigen Halo Mini (AI drying)', price: 1099, cur: 'SGD', shop: 'Steigen', type: 'Online', href: 'https://www.steigen.com.sg/collections/all'},
   ]},
   {id: 'kitchen-fan', name: 'Fanco DC Dono 16" corner fan (wall or ceiling mount, remote)', model: 'DONO-DC-16', qty: 1, price: 130, cur: 'SGD', shop: 'Electromart', type: 'Online', href: 'https://electromart.sg/products/fanco-dc-dono-16-wall-or-ceiling-mount-corner-dc-fan', date: '2026-12-05', when: 'Before electrician. Needs a power point or fan point high on the wall', note: 'DC motor, quiet. 4-year onsite warranty, lifetime motor warranty.', alts: [
    {name: 'KDK 16" wall fan', model: 'KU408', price: 230, cur: 'MYR', shop: 'Lapasar (MY)', type: 'Online', href: 'https://mall.lapasar.com/products/kdk-kdk-ku-408-16-wall-fan/195843'},
    {name: "D'FAN 16\" DC wall fan, black", model: '516', price: 259, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/dfan-16-in-dc-wall-fan-black-516-IP171419.html'},
   ]},
  ]},
  {id: 'common-bath', name: 'Common bathroom', items: [
   {id: 'common-bath-rigel-gallant-one-piece', name: 'RIGEL Gallant one-piece rimless toilet', model: 'WO9030FA', qty: 1, price: 569, cur: 'SGD', shop: 'RIGEL on Lazada', type: 'Online', href: 'https://www.lazada.sg/trending/Toilet-Bowls-Best-Price/1898779406', date: '2026-12-01', when: 'Order early. Contractor installs (C)', note: 'Price seen on Lazada list. RIGEL showroom: Changi Business Park.', alts: [
    {name: 'RIGEL WC8056F rimless, two-piece', price: 482, cur: 'SGD', shop: 'Gain City', type: 'Shop + online', href: 'https://www.gaincity.com/rigel-water-closet-wc8056f-t0187767'},
    {name: 'TOTO C889DESI one-piece rimless', price: 1004.5, cur: 'SGD', shop: 'TOTO Watelier', type: 'Online', href: 'https://www.watelier.com/product/recommendation/default/2238/related'},
   ]},
   {id: 'common-bath-rigel-counter-top-basin', name: 'RIGEL counter-top basin', model: 'LS64478', qty: 1, price: 345, cur: 'SGD', shop: 'RIGEL on Lazada', type: 'Online', href: 'https://lazada.sg/tag/bathroom-sinks', date: '2026-12-01', when: 'With toilet'},
   {id: 'common-bath-basin-cabinet-304-stainless', name: 'Basin cabinet, 304 stainless (Baron A106 type)', qty: 1, price: 300, cur: 'SGD', est: true, shop: 'Heritage Bathroom Gallery (Lazada / Geylang)', type: 'Shop + online', href: 'https://www.lazada.sg/videodetail/?video_id=30276142197', date: '2026-12-01', when: 'Measure 70 cm space first'},
   {id: 'common-bath-basin-mixer-tap', name: 'Basin mixer tap', qty: 1, price: 180, cur: 'SGD', est: true, shop: 'RIGEL / Heritage', type: 'Shop', date: '2026-12-01', when: 'With basin'},
   {id: 'common-bath-rigel-3-in-1', name: 'RIGEL 3-in-1 thermostatic rain shower set', model: 'W2-R-TSME14418T (brushed nickel)', qty: 1, price: 814, cur: 'SGD', shop: 'Gain City', type: 'Shop + online', href: 'https://www.gaincity.com/rigel-rainshower-set-3-in-1-w2-r-tsme14418t-brnk-tb0003899', date: '2026-12-01', when: 'Check with water heater first'},
   {id: 'common-mirror', name: 'IKEA ENHET mirror cabinet, 2 doors, 60 × 17 × 75 cm (no light, no power point)', qty: 1, price: 160, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/enhet-mirror-cabinet-with-doors-white-20623045/', date: '2026-12-01', when: 'Buy with basins. Contractor hangs it', note: '10-year IKEA guarantee. Measure above the basin first.', alts: [
    {name: 'IKEA ENHET 2 doors, grey, 60 cm', price: 165, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/enhet-mirror-cabinet-with-2-doors-grey-s89396564'},
    {name: 'IKEA LETTAN mirror cabinet, all-mirror, 60 × 15 × 95 cm', price: 295, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/cat/mirror-cabinets-20500/f/wood-including-board-bathroom-mirror-cabinets-f-materials--47349'},
    {name: 'IKEA LETTAN, all-mirror, 80 × 15 × 95 cm', price: 355, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/cat/mirror-cabinets-20500/f/with-shelves-bathroom-mirror-cabinets-f-feature--53039/'},
   ]},
   {id: 'common-bath-kdk-8-window-exhaust', name: 'KDK 8" window exhaust fan', model: '20WUD', qty: 1, price: 185, cur: 'MYR', shop: 'Ban Huat (MY)', type: 'Shop + online', href: 'https://www.banhuat.com/20wud', date: '2026-12-05', when: 'JB trip. Tell I-Niche to install only (G2)'},
   {id: 'common-bath-bidet-spray', name: 'Bidet spray', qty: 1, price: 40, cur: 'SGD', est: true, shop: 'RIGEL / Heritage', type: 'Shop', date: '2026-12-01', when: 'With toilet'},
   {id: 'common-bath-ceiling-light-wet-area', name: 'Ceiling light (wet-area)', qty: 1, price: 100, cur: 'SGD', est: true, shop: 'JB lighting shop', type: 'Shop', date: '2026-12-05', when: 'JB trip'},
  ]},
  {id: 'master-bath', name: 'Master bathroom', items: [
   {id: 'master-bath-rigel-gallant-one-piece', name: 'RIGEL Gallant one-piece rimless toilet', model: 'WO9030FA', qty: 1, price: 569, cur: 'SGD', shop: 'RIGEL on Lazada', type: 'Online', href: 'https://www.lazada.sg/trending/Toilet-Bowls-Best-Price/1898779406', date: '2026-12-01', when: 'Order with common bath'},
   {id: 'master-bath-rigel-thermostatic-exposed-shower', name: 'RIGEL thermostatic exposed shower mixer set, chrome', model: 'W2-R-TSME3200055', qty: 1, price: 319, cur: 'SGD', shop: 'Gain City', type: 'Shop + online', href: 'https://www.gaincity.com/catalog/category/view/id/2763/?p=85', date: '2026-12-01', when: 'With common bath'},
   {id: 'master-bath-kdk-8-window-exhaust', name: 'KDK 8" window exhaust fan', model: '20WUD', qty: 1, price: 185, cur: 'MYR', shop: 'Ban Huat (MY)', type: 'Shop + online', href: 'https://www.banhuat.com/20wud', date: '2026-12-05', when: 'JB trip (only if we keep G2 for master)'},
   {id: 'master-mirror', name: 'IKEA ENHET mirror cabinet, 2 doors, 60 × 17 × 75 cm (no light, no power point)', qty: 1, price: 160, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/enhet-mirror-cabinet-with-doors-white-20623045/', date: '2026-12-01', when: 'Buy with basins. Contractor hangs it', note: '10-year IKEA guarantee. Measure above the basin first.', alts: [
    {name: 'IKEA ENHET 2 doors, grey, 60 cm', price: 165, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/enhet-mirror-cabinet-with-2-doors-grey-s89396564'},
    {name: 'IKEA LETTAN mirror cabinet, all-mirror, 60 × 15 × 95 cm', price: 295, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/cat/mirror-cabinets-20500/f/wood-including-board-bathroom-mirror-cabinets-f-materials--47349'},
    {name: 'IKEA LETTAN, all-mirror, 80 × 15 × 95 cm', price: 355, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/cat/mirror-cabinets-20500/f/with-shelves-bathroom-mirror-cabinets-f-feature--53039/'},
   ]},
   {id: 'master-bath-bidet-spray', name: 'Bidet spray', qty: 1, price: 40, cur: 'SGD', est: true, shop: 'RIGEL / Heritage', type: 'Shop', date: '2026-12-01', when: 'With toilet'},
   {id: 'master-bath-accessories-for-both-bathrooms', name: 'Accessories for both bathrooms (towel bars, holders, rack)', qty: 1, price: 150, cur: 'SGD', est: true, shop: 'Heritage Bathroom Gallery', type: 'Shop', date: '2026-12-01', when: 'With toilets'},
  ]},
  {id: 'ky', name: 'KY bedroom', items: [
   {id: 'ky-bed', name: 'TRAKEN storage bed frame, queen, gas lifts', qty: 1, price: 579, cur: 'SGD', shop: 'Bed and Basics', type: 'Shop + online', href: 'https://bedandbasics.sg/traken-storage-bedframe-stain-resistant-fabric.html', date: '2026-12-12', when: '12.12. Deliver after clean', note: 'Queen S$579 (was S$819). 5-year warranty. Queen for now: confirm bed sizes after keys.'},
   {id: 'ky-mattress', name: 'Sealy PosturePremier Treasure mattress, queen, pillow top (medium soft)', qty: 1, price: 2099, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/promotions-en/october-2026-bedding-campaign/sealy-posturepremier-treasure-mattress-queen-size.html', date: '2026-11-27', when: 'Lie on it in store first. Black Friday or 12.12', note: 'Soft pillow top on pocket springs, 30 cm, 10-year warranty. Was S$3,699.', alts: [
    {name: 'King Koil Posture Ellisville, queen (rated soft, latex, 15-yr warranty)', price: 3439, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/promotions-en/october-2026-bedding-campaign/king-koil-posture-ellisville-pocketed-spring-mattress-queen-size.html'},
    {name: 'Natura AVO Plush, queen, box top + cool-gel memory foam (MY)', price: 6199, cur: 'MYR', shop: 'Maju Home (MY)', type: 'Online', href: 'https://online.majuhome.com.my/products/natura-avo-plush-mattress', note: 'Sale price, was RM10,338. Free 2 pillows + protector. Delivers in Malaysia only: collect in JB. The black hotel-grade Natura is not listed online, so ask the JB Natura dealer for its name and price.'},
    {name: 'HipVan LEVITATE, queen (latex + pocket springs, 12-yr warranty)', price: 1499, cur: 'SGD', shop: 'HipVan', type: 'Online', href: 'https://www.hipvan.com/products/levitate-mattress'},
   ]},
   {id: 'ky-kdk-f40gp-100-cm', name: 'KDK F40GP 100 cm Wi-Fi DC ceiling fan with LED light', qty: 1, price: 418, cur: 'SGD', shop: 'KDK Singapore', type: 'Online', href: 'https://www.kdk.sg/products/ceiling-fan-f40gp', date: '2026-12-05', when: 'Before electrician', note: '100 cm in a 250 cm room leaves 75 cm to walls. Check.'},
   {id: 'ky-philips-meson-5-downlight', name: 'Philips Meson 5" downlight', qty: 3, price: 39.45, cur: 'MYR', shop: 'Lapasar (MY)', type: 'Online', href: 'https://mall.lapasar.com/products/155107', date: '2026-12-05', when: 'JB trip'},
   {id: 'ky-led-ambient-strip-driver', name: 'LED ambient strip + driver', qty: 1, price: 200, cur: 'MYR', est: true, shop: 'JB lighting shop', type: 'Shop', date: '2026-12-05', when: 'JB trip'},
  ]},
  {id: 'kx', name: 'KX bedroom', items: [
   {id: 'kx-bed', name: 'TRAKEN storage bed frame, queen, gas lifts', qty: 1, price: 579, cur: 'SGD', shop: 'Bed and Basics', type: 'Shop + online', href: 'https://bedandbasics.sg/traken-storage-bedframe-stain-resistant-fabric.html', date: '2026-12-12', when: '12.12. Deliver after clean', note: 'Queen S$579 (was S$819). 5-year warranty. Queen for now: confirm bed sizes after keys.'},
   {id: 'kx-mattress', name: 'Sealy PosturePremier Treasure mattress, queen, pillow top (medium soft)', qty: 1, price: 2099, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/promotions-en/october-2026-bedding-campaign/sealy-posturepremier-treasure-mattress-queen-size.html', date: '2026-11-27', when: 'Lie on it in store first. Black Friday or 12.12', note: 'Soft pillow top on pocket springs, 30 cm, 10-year warranty. Was S$3,699.', alts: [
    {name: 'King Koil Posture Ellisville, queen (rated soft, latex, 15-yr warranty)', price: 3439, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/promotions-en/october-2026-bedding-campaign/king-koil-posture-ellisville-pocketed-spring-mattress-queen-size.html'},
    {name: 'Natura AVO Plush, queen, box top + cool-gel memory foam (MY)', price: 6199, cur: 'MYR', shop: 'Maju Home (MY)', type: 'Online', href: 'https://online.majuhome.com.my/products/natura-avo-plush-mattress', note: 'Sale price, was RM10,338. Free 2 pillows + protector. Delivers in Malaysia only: collect in JB. The black hotel-grade Natura is not listed online, so ask the JB Natura dealer for its name and price.'},
    {name: 'HipVan LEVITATE, queen (latex + pocket springs, 12-yr warranty)', price: 1499, cur: 'SGD', shop: 'HipVan', type: 'Online', href: 'https://www.hipvan.com/products/levitate-mattress'},
   ]},
   {id: 'kx-kdk-f40gp-100-cm', name: 'KDK F40GP 100 cm Wi-Fi DC ceiling fan with LED light', qty: 1, price: 418, cur: 'SGD', shop: 'KDK Singapore', type: 'Online', href: 'https://www.kdk.sg/products/ceiling-fan-f40gp', date: '2026-12-05', when: 'Before electrician'},
   {id: 'kx-philips-meson-5-downlight', name: 'Philips Meson 5" downlight', qty: 3, price: 39.45, cur: 'MYR', shop: 'Lapasar (MY)', type: 'Online', href: 'https://mall.lapasar.com/products/155107', date: '2026-12-05', when: 'JB trip'},
   {id: 'kx-blackout-curtains-track', name: 'Blackout curtains + track', qty: 1, price: 450, cur: 'SGD', est: true, shop: 'Curtain shop', type: 'Shop', date: '2026-12-15', when: 'Measure after windows are clear'},
  ]},
  {id: 'ks', name: 'KS bedroom', items: [
   {id: 'ks-bed', name: 'TRAKEN storage bed frame, queen, gas lifts', qty: 1, price: 579, cur: 'SGD', shop: 'Bed and Basics', type: 'Shop + online', href: 'https://bedandbasics.sg/traken-storage-bedframe-stain-resistant-fabric.html', date: '2026-12-12', when: '12.12. Deliver after clean', note: 'Queen S$579 (was S$819). 5-year warranty. Queen for now: confirm bed sizes after keys.'},
   {id: 'ks-mattress', name: 'Sealy PosturePremier Treasure mattress, queen, pillow top (medium soft)', qty: 1, price: 2099, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/promotions-en/october-2026-bedding-campaign/sealy-posturepremier-treasure-mattress-queen-size.html', date: '2026-11-27', when: 'Lie on it in store first. Black Friday or 12.12', note: 'Soft pillow top on pocket springs, 30 cm, 10-year warranty. Was S$3,699.', alts: [
    {name: 'King Koil Posture Ellisville, queen (rated soft, latex, 15-yr warranty)', price: 3439, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/promotions-en/october-2026-bedding-campaign/king-koil-posture-ellisville-pocketed-spring-mattress-queen-size.html'},
    {name: 'Natura AVO Plush, queen, box top + cool-gel memory foam (MY)', price: 6199, cur: 'MYR', shop: 'Maju Home (MY)', type: 'Online', href: 'https://online.majuhome.com.my/products/natura-avo-plush-mattress', note: 'Sale price, was RM10,338. Free 2 pillows + protector. Delivers in Malaysia only: collect in JB. The black hotel-grade Natura is not listed online, so ask the JB Natura dealer for its name and price.'},
    {name: 'HipVan LEVITATE, queen (latex + pocket springs, 12-yr warranty)', price: 1499, cur: 'SGD', shop: 'HipVan', type: 'Online', href: 'https://www.hipvan.com/products/levitate-mattress'},
   ]},
  ]},
  {id: 'entrance', name: 'Entrance', items: [
   {id: 'entrance-aqara-u400-smart-lock', name: 'Aqara U400 smart lock, lock only (contractor fits)', qty: 1, price: 469, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/smart-tech-and-phones/smart-home/smart-security/aqara-u400-smart-door-lock-silver-dl-d16e.html', date: '2026-12-12', when: 'Install at the end of renovation', note: 'La Casa main doors (neighbour photo) look like a pull-handle door with a mortise-type lock, not a round-hole knob lock. The U400 is a round-hole deadbolt lock, so it needs door conversion. Check our door edge on 3 Dec before buying. If it is mortise, the D100 or A100 below fits directly.', alts: [
    {name: 'Aqara U400 with installation + 24-month onsite warranty', price: 649, cur: 'SGD', shop: 'Passion Home', type: 'Online', href: 'https://passionhome.sg/product/aqara-smart-door-lock-u400/'},
    {name: 'Aqara D100 push-pull mortise lock, fire-rated, installed (40–80 mm doors)', price: 869, cur: 'SGD', shop: 'Passion Home', type: 'Online', href: 'https://passionhome.sg/product/aqara-smart-door-lock-d100-official-with-installation/'},
    {name: 'Aqara A100 mortise lock, BCA fire-rated, installed', price: 669, cur: 'SGD', shop: 'Passion Home', type: 'Online', href: 'https://passionhome.sg/product/aqara-smart-door-lock-a100/'},
   ]},
   {id: 'entrance-retractable-insect-mesh-door', name: 'Retractable insect mesh door', qty: 1, price: 600, cur: 'SGD', est: true, shop: 'Mozziefy / Oleno', type: 'Online', href: 'https://www.mozziefy.com/products/door-screens/', date: '2026-12-20', when: 'After MCST approval'},
  ]},
 ],
 contractor: [
  {q: 'Common toilet: half-height wall with a shower niche, glass on the top half?', a: 'Quote item F5 (new tiled wall, $1,250) plus E3 (shower screen) looks like this. Ask: wall height, niche size, waterproofing, and is the glass fixed or a door.'},
  {q: 'Living false ceiling: remove and build new?', a: 'Quote only patches old downlight holes (B2, $280). Ask for 2 prices: (1) keep ceiling, patch and cut new holes; (2) take down and build new flat ceiling with cove light slots. Option 2 also lets the electrician rewire lights cleanly.'},
  {q: 'Vinyl over the bedroom parquet instead of polishing?', a: 'Polish (F2, $950) is cheaper and fine if the parquet is flat and not loose. Vinyl/SPC adds a few mm, so doors need trimming at the bottom and a small trim strip at each door. New KY and KX doors can be cut to the new floor height. Ask the flooring supplier to check the parquet first.'},
  {q: 'What does "polish existing master bathroom flooring" mean?', a: 'Grinding and polishing the old floor tiles or marble to remove stains and bring back shine. It is not new tiles. Ask what the floor is, if it includes re-grouting, and if anti-slip treatment can be added. Not in our plan (F4, $800).'},
 ],
 notes: [
  'Normal switches are fine. Smart bulbs still work if the wall switch stays on. If someone switches it off, the bulb goes offline until switched on again.',
  'Built-in downlights cannot be made smart. Use smart bulbs only in lamps or fittings with normal bulb sockets.',
  'Lighting to plan: living downlights + cove strip, track or spot lights on the TV wall and dining, bedroom downlights, bathroom ceiling lights, a small night light on the way to the bathroom.',
 ],
};

export const toSGD=(i,rate=BUY.rate)=>i.cur==='MYR'?i.price/rate:i.price;
export const lineSGD=(i,rate=BUY.rate)=>toSGD(i,rate)*(i.qty??1);
// The family's saved choices live in the shared visit_notes table, keyed b:<item id>:off|pick|qty.
export const optionsOf=i=>[i,...(i.alts??[])];
export function buyKeys(plan=BUY){const k=new Map();for(const r of plan.rooms)for(const i of r.items){k.set(`b:${i.id}:off`,{kind:'off'});k.set(`b:${i.id}:qty`,{kind:'qty'});if(i.alts?.length)k.set(`b:${i.id}:pick`,{kind:'pick',max:i.alts.length});}return k;}
export function validBuyValue(spec,value){if(value==='')return true;if(spec.kind==='off')return value==='1';if(!/^\d{1,2}$/.test(value))return false;const n=Number(value);return spec.kind==='qty'?n>=1&&n<=99:n>=1&&n<=spec.max;}
export function choiceOf(i,v={}){const opts=optionsOf(i),p=Number(v[`b:${i.id}:pick`]),pick=Number.isInteger(p)&&p>0&&p<opts.length?p:0,q=Number(v[`b:${i.id}:qty`]),qty=Number.isInteger(q)&&q>=1&&q<=99?q:(i.qty??1);return {off:v[`b:${i.id}:off`]==='1',pick,qty,opt:opts[pick]};}
export const chosenSGD=(i,v={},rate=BUY.rate)=>{const c=choiceOf(i,v);return c.off?0:toSGD(c.opt,rate)*c.qty;};
export function buyTotals(plan=BUY,v={}){
 const rooms=plan.rooms.map(r=>({id:r.id,name:r.name,total:r.items.reduce((s,i)=>s+chosenSGD(i,v,plan.rate),0),est:r.items.filter(i=>{const c=choiceOf(i,v);return !c.off&&(c.opt.est??(c.pick===0&&i.est));}).reduce((s,i)=>s+chosenSGD(i,v,plan.rate),0),removed:r.items.filter(i=>choiceOf(i,v).off).length}));
 return {rooms,total:rooms.reduce((s,r)=>s+r.total,0),est:rooms.reduce((s,r)=>s+r.est,0),removed:rooms.reduce((s,r)=>s+r.removed,0)};
}
export function buyCSV(plan=BUY,v={}){
 const q=x=>{let s=String(x??'');if(/^[=+\-@]/.test(s)&&!/^-?\d/.test(s))s="'"+s;return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
 const rows=[['Room','Item','Model','Qty','Unit price','Currency','Line total (S$)','Counted?','Choice','Rough?','Shop','Where','Buy date','When','Link','Note']];
 for(const r of plan.rooms)for(const i of r.items){const c=choiceOf(i,v),o=c.opt;rows.push([r.name,o.name,o.model??'',c.qty,o.price,o.cur,chosenSGD(i,v,plan.rate).toFixed(2),c.off?'Removed':'Yes',c.pick?`Option ${c.pick}`:'Recommended',(o.est??(c.pick===0&&i.est))?'Yes':'',o.shop??'',o.type??'',i.date??'',i.when??'',o.href??'',o.note??(c.pick?'':i.note??'')]);}
 const t=buyTotals(plan,v);rows.push([]);rows.push(['Total','','','','','',t.total.toFixed(2)]);
 return rows.map(r=>r.map(q).join(',')).join('\n')+'\n';
}
