// LaCasa to-buy list (19 Nov 2026). Prices were checked on the date in `checked`.
// cur: 'SGD' or 'MYR'. est: true = rough budget (no exact listing). alts are shown, not counted.
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
   {name: 'I-Niche renovation quote, as given', qty: 1, price: 24100, cur: 'SGD', shop: 'The I-Niche Design', type: 'Contractor', href: '/files/iniche-quotation-2026-11-13.pdf', date: '2026-11-19', when: 'Confirm scope at meeting. 10% deposit on signing', note: 'Payments 10/40/40/10. Not refundable if cancelled.'},
   {name: 'Remove items not in our plan (A3, D1, D2, D3, D3a, D4, F4, F5)', qty: 1, price: -8680, cur: 'SGD', est: true, shop: 'If I-Niche agrees', type: 'Contractor', date: '2026-11-19', when: 'Decide at meeting', note: 'Keep D4 wardrobe or D1 TV wall only if we want them.'},
   {name: 'Add missing work: electrical, LAN, aircon move, 2nd solid door', qty: 1, price: 6600, cur: 'SGD', est: true, shop: 'Ask I-Niche to price', type: 'Contractor', date: '2026-11-19', when: 'Get written price', note: 'Based on our 8 Oct brief allowances.'},
   {name: 'MCST renovation deposit (refundable)', qty: 1, price: 1000, cur: 'SGD', shop: 'La Casa management', type: 'Shop', date: '2026-11-28', when: 'With renovation form, 7+ days before work', note: 'Cash or cheque. Refunded after checks.'},
  ]},
  {id: 'aircon', name: 'Aircon (3 old units)', items: [
   {name: 'Mitsubishi Starmex System 3 (3 × 9,000 BTU), 5 ticks, installed', model: 'MXY-3H28VG + 3 × MSXY-FP10VG', qty: 1, price: 4019, cur: 'SGD', shop: 'Gain City', type: 'Shop + online', href: 'https://www.gaincity.com/product/108519/sku', src: 'https://www.misslobang.com/article/best-system-3-aircon-singapore-2026', date: '2026-11-28', when: 'Order in Black Fri-Yay (ends 30 Nov). Install about 10 Dec, before painting', note: 'Installation included, 3-year installation warranty. No built-in Wi-Fi.', alts: [
    {name: 'Same Mitsubishi set, no installation shown', price: 3674, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/mitselec-mitsubishi-starmex-28k-condenser-system-39000btu-x-3-mxy-3h28vg%2B-msxy-fp10vg-sg3-x-3-IP219176.html'},
    {name: 'Same Mitsubishi set, installed, with code 7NV0 (to 30 Nov)', price: 3510, cur: 'SGD', shop: 'Mega Discount Store', type: 'Online', href: 'https://www.misslobang.com/article/best-system-3-aircon-singapore-2026'},
    {name: 'Daikin iSmile Eco+ System 3 (3 × 9,000 BTU), 5 ticks', price: 4020, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/daikin-daikin-7.5kwh-condenser-ismile-eco+-series-system-3-9000btu-x-3-mkm75zvmg+-ctkm25zvmg-x3-IP210313.html'},
    {name: 'Daikin iSmile Eco System 3 with Wi-Fi (9k + 18k + 24k), no installation', price: 3269, cur: 'SGD', shop: 'Megafurniture', type: 'Online', href: 'https://megafurniture.sg/products/daikin-ismile-eco-series-system-3-aircon-wifi-mkm85vvmg-1xctkm25vvmg-1xctkm50vvmg-1xctkm71vvmg-br-1-x-9000-1-x-18000-1-x-24000-btu'},
   ]},
  ]},
  {id: 'living', name: 'Living room', items: [
   {name: 'LG OLED evo C6 65" (2026)', model: 'OLED65C6PSA', qty: 1, price: 3633, cur: 'SGD', shop: 'Electromart', type: 'Online', href: 'https://electromart.sg/products/lg-oled65c6psa-oled-evo-ai-c6-4k-smart-tv-65inch', date: '2026-11-27', when: 'Black Friday. Deliver after final clean (early Jan)', note: 'Low stock shown. Same TV is S$4,099 at Harvey Norman and COURTS.', alts: [
    {name: 'LG OLED C6 65" at a physical store', price: 4099, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/tv-and-audio/tvs-en-2/tvs-en-3/65-inches-tvs/lg-65-inch-c6-oled-evo-ai-4k-2026-smart-tv-black-oled65c6psa.atc.html'},
    {name: 'LG OLED C5 77" (2025)', price: 4999, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/tv-and-audio/tvs-en-2/tvs-en-3/lg-77-inch-oled-evo-c5-series-4k-uhd-smart-tv-black-oled77c5psa.atc.html'},
    {name: 'Samsung QN70H 85" Neo QLED mini-LED (2026)', price: 4599, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/tv-and-audio/tvs-en-2/tvs-en-3/samsung-85-inch-qn70h-4k-neo-qled-samsung-vision-ai-2026-smart-tv-black-qa85qn70hakxxs.html'},
    {name: 'Samsung QN90F 85" Neo QLED mini-LED (2025)', price: 7706, cur: 'SGD', shop: 'Electromart', type: 'Online', href: 'https://electromart.sg/products/samsung-qa85qn90fak-4k-smart-tv-85'},
    {name: 'LG OLED C6 77" (2026)', price: 7499, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/tv-and-audio/tvs-en-2/tvs-en-3/lg-77-inch-c6-oled-evo-ai-4k-2026-smart-tv-black-oled77c6psa.atc.html'},
   ]},
   {name: 'Apple TV 4K (4th gen, 2026)', qty: 1, price: 399, cur: 'SGD', shop: 'Apple Store', type: 'Shop + online', href: 'https://www.apple.com/sg/shop/buy-tv/apple-tv-4k', src: 'https://everymac.com/devices/global-prices/all-msrp-apple-tv-prices-in-singapore.html', date: '2026-11-27', when: 'Any time. Set up after the TV arrives', note: 'Needed for 4-speaker surround. Also the HomeKit hub.'},
   {name: 'HomePod (2nd gen), front left and right', qty: 2, price: 429, cur: 'SGD', shop: 'Apple Store', type: 'Shop + online', href: 'https://www.apple.com/sg/shop/buy-homepod/homepod', src: 'https://everymac.com/devices/global-prices/all-msrp-apple-homepod-prices-in-singapore.html', date: '2026-11-27', when: 'Same time as Apple TV', note: 'S$429 is the launch price. Check the store price on the day.'},
   {name: 'HomePod mini 2, back left and right', qty: 2, price: 199, cur: 'SGD', shop: 'Apple Store', type: 'Shop + online', href: 'https://www.apple.com/sg/shop/buy-homepod/homepod-mini', src: 'https://everymac.com/devices/global-prices/all-msrp-apple-homepod-prices-in-singapore.html', date: '2026-11-27', when: 'Same time as Apple TV', note: 'Must be mini 2. The 2020 mini does not work for surround.'},
   {name: 'L-shape 4-seat sofa', qty: 1, price: 6000, cur: 'MYR', est: true, shop: 'V Haus Living, Johor Jaya', type: 'Shop', href: 'https://uchify.com/v-haus-living-johor-bahru/', date: '2026-12-13', when: 'Visit and order. Deliver mid-Jan after clean', note: 'V Haus does not list sofa prices online. RM6,000 is our quality budget. Owners praise the Pesto Easy Clean fabric.'},
   {name: 'TV console, 30 cm+ deep, space for 2 HomePods', qty: 1, price: 1500, cur: 'MYR', est: true, shop: 'V Haus Living', type: 'Shop', date: '2026-12-13', when: 'Order with sofa'},
   {name: 'Philips Meson 5" 13W recessed downlight (3000K or 4000K)', qty: 8, price: 39.45, cur: 'MYR', shop: 'Lapasar (MY); JB lighting shops stock Philips', type: 'Online', href: 'https://mall.lapasar.com/products/155107', date: '2026-12-05', when: 'Buy in JB before the electrician starts', note: 'Contractor patches old holes (B2). Agree the new layout first.'},
   {name: 'LED cove strip + driver', qty: 1, price: 350, cur: 'MYR', est: true, shop: 'JB lighting shop', type: 'Shop', date: '2026-12-05', when: 'With downlights'},
   {name: 'Track or spot lights for TV wall / art', qty: 2, price: 200, cur: 'MYR', est: true, shop: 'JB lighting shop', type: 'Shop', date: '2026-12-05', when: 'With downlights'},
  ]},
  {id: 'dining', name: 'Dining', items: [
   {name: 'Dining table + 4 chairs (LINO set price as budget)', qty: 1, price: 2299, cur: 'MYR', shop: 'V Haus Living', type: 'Shop', date: '2026-12-13', when: 'Order with sofa', note: 'LINO needs about 240 × 230 cm. Our area is about 195 × 175 cm. Pick a 120 × 75–80 cm table.'},
   {name: 'KDK F40GP 100 cm Wi-Fi DC ceiling fan with LED light', qty: 1, price: 558, cur: 'SGD', shop: 'KDK Singapore', type: 'Online', href: 'https://www.kdk.sg/pages/national-day-sales-2026', date: '2026-12-05', when: 'Buy before electrician. JB KDK dealers may be cheaper', note: 'Was S$418 in KDK sale. Check clearance to walls.'},
  ]},
  {id: 'kitchen', name: 'Kitchen and yard', items: [
   {name: 'Panasonic 2-door bottom-freezer fridge 405 L', model: 'NR-BX471CPSS', qty: 1, price: 1019, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/panasonic-nr-bx471cpss-2-dr-fridge-405l-ip168440', date: '2026-11-27', when: 'Black Friday. Deliver after clean', note: 'About 68.6 W × 69.7 D × 179 H cm. Our space is 70 × 75 × 180 cm: very tight, measure first.', alts: [
    {name: 'Panasonic NR-BX471WGKS glass door', price: 1299, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/promotions-en/11.11-sale-2026/electrical-en-9/kitchen-appliances-en-9/panasonic-fridge-nr-bx471wgks.html'},
   ]},
   {name: 'LG 9 kg front-load washer, AI DD', model: 'FX1409S5G', qty: 1, price: 1299, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/lg-front-load-washer---essense-graphite-9kg-fx1409s5g-IP223515.html', date: '2026-11-27', when: 'Black Friday. Deliver after clean', note: '9 kg suits the Steigen Mini better than 12–14 kg.', alts: [
    {name: 'Bosch Series 6 9 kg WGG24400SG (i-DOS)', price: 1521, cur: 'SGD', shop: 'Electromart', type: 'Online', href: 'https://electromart.sg/products/bosch-wgg24400sg-front-load-washer-9kg'},
    {name: 'LG 12 kg FX1412S2KA (56.5 cm deep)', price: 2049, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/home-appliances/washing-machines-and-dryers-en/washing-machines-en/lg-12kg-front-load-washer-matte-black-fx1412s2ka.html'},
    {name: 'Samsung 12 kg WW12BB944DGBSP (69.5 cm deep: too deep for 67 cm)', price: 1968, cur: 'SGD', shop: 'Electromart', type: 'Online', href: 'https://electromart.sg/products/samsung-ww12bb944dgbsp-bespoke-ai%e2%84%a2-front-load-washing-machine-with-ai-ecobubble%e2%84%a2-and-ai-wash-12kg'},
   ]},
   {name: 'Steigen Solar Mini drying rack, installed', qty: 1, price: 899, cur: 'SGD', shop: 'Steigen', type: 'Online', href: 'https://www.steigen.com.sg/collections/all', date: '2026-12-12', when: '12.12. Install after painting', note: 'Mini fits ceiling 110–144 cm (ours 120 cm). Steigen lists it for washers up to 7 kg and queen bedding. Mega needs 145 cm+.', alts: [
    {name: 'Steigen Halo Mini (AI drying)', price: 1099, cur: 'SGD', shop: 'Steigen', type: 'Online', href: 'https://www.steigen.com.sg/collections/all'},
   ]},
   {name: 'KDK 16" wall fan for kitchen corner', model: 'KU408', qty: 1, price: 230, cur: 'MYR', shop: 'Lapasar (MY)', type: 'Online', href: 'https://mall.lapasar.com/products/kdk-kdk-ku-408-16-wall-fan/195843', date: '2026-12-05', when: 'JB trip'},
  ]},
  {id: 'common-bath', name: 'Common bathroom', items: [
   {name: 'RIGEL Gallant one-piece rimless toilet', model: 'WO9030FA', qty: 1, price: 569, cur: 'SGD', shop: 'RIGEL on Lazada', type: 'Online', href: 'https://www.lazada.sg/trending/Toilet-Bowls-Best-Price/1898779406', date: '2026-12-01', when: 'Order early. Contractor installs (C)', note: 'Price seen on Lazada list. RIGEL showroom: Changi Business Park.', alts: [
    {name: 'RIGEL WC8056F rimless, two-piece', price: 482, cur: 'SGD', shop: 'Gain City', type: 'Shop + online', href: 'https://www.gaincity.com/rigel-water-closet-wc8056f-t0187767'},
    {name: 'TOTO C889DESI one-piece rimless', price: 1004.5, cur: 'SGD', shop: 'TOTO Watelier', type: 'Online', href: 'https://www.watelier.com/product/recommendation/default/2238/related'},
   ]},
   {name: 'RIGEL counter-top basin', model: 'LS64478', qty: 1, price: 345, cur: 'SGD', shop: 'RIGEL on Lazada', type: 'Online', href: 'https://lazada.sg/tag/bathroom-sinks', date: '2026-12-01', when: 'With toilet'},
   {name: 'Basin cabinet, 304 stainless (Baron A106 type)', qty: 1, price: 300, cur: 'SGD', est: true, shop: 'Heritage Bathroom Gallery (Lazada / Geylang)', type: 'Shop + online', href: 'https://www.lazada.sg/videodetail/?video_id=30276142197', date: '2026-12-01', when: 'Measure 70 cm space first'},
   {name: 'Basin mixer tap', qty: 1, price: 180, cur: 'SGD', est: true, shop: 'RIGEL / Heritage', type: 'Shop', date: '2026-12-01', when: 'With basin'},
   {name: 'RIGEL 3-in-1 thermostatic rain shower set', model: 'W2-R-TSME14418T (brushed nickel)', qty: 1, price: 814, cur: 'SGD', shop: 'Gain City', type: 'Shop + online', href: 'https://www.gaincity.com/rigel-rainshower-set-3-in-1-w2-r-tsme14418t-brnk-tb0003899', date: '2026-12-01', when: 'Check with water heater first'},
   {name: 'Kohler lighted mirror cabinet', qty: 1, price: 297.67, cur: 'SGD', shop: 'Lazada', type: 'Online', href: 'https://www.lazada.sg/trending/Bathroom-Mirrors-Best-Price/652083249', date: '2026-12-12', when: '12.12', note: 'Needs a power point near the mirror.'},
   {name: 'KDK 8" window exhaust fan', model: '20WUD', qty: 1, price: 185, cur: 'MYR', shop: 'Ban Huat (MY)', type: 'Shop + online', href: 'https://www.banhuat.com/20wud', date: '2026-12-05', when: 'JB trip. Tell I-Niche to install only (G2)'},
   {name: 'Bidet spray', qty: 1, price: 40, cur: 'SGD', est: true, shop: 'RIGEL / Heritage', type: 'Shop', date: '2026-12-01', when: 'With toilet'},
   {name: 'Ceiling light (wet-area)', qty: 1, price: 100, cur: 'SGD', est: true, shop: 'JB lighting shop', type: 'Shop', date: '2026-12-05', when: 'JB trip'},
  ]},
  {id: 'master-bath', name: 'Master bathroom', items: [
   {name: 'RIGEL Gallant one-piece rimless toilet', model: 'WO9030FA', qty: 1, price: 569, cur: 'SGD', shop: 'RIGEL on Lazada', type: 'Online', href: 'https://www.lazada.sg/trending/Toilet-Bowls-Best-Price/1898779406', date: '2026-12-01', when: 'Order with common bath'},
   {name: 'RIGEL thermostatic exposed shower mixer set, chrome', model: 'W2-R-TSME3200055', qty: 1, price: 319, cur: 'SGD', shop: 'Gain City', type: 'Shop + online', href: 'https://www.gaincity.com/catalog/category/view/id/2763/?p=85', date: '2026-12-01', when: 'With common bath'},
   {name: 'KDK 8" window exhaust fan', model: '20WUD', qty: 1, price: 185, cur: 'MYR', shop: 'Ban Huat (MY)', type: 'Shop + online', href: 'https://www.banhuat.com/20wud', date: '2026-12-05', when: 'JB trip (only if we keep G2 for master)'},
   {name: 'Bidet spray', qty: 1, price: 40, cur: 'SGD', est: true, shop: 'RIGEL / Heritage', type: 'Shop', date: '2026-12-01', when: 'With toilet'},
   {name: 'Accessories for both bathrooms (towel bars, holders, rack)', qty: 1, price: 150, cur: 'SGD', est: true, shop: 'Heritage Bathroom Gallery', type: 'Shop', date: '2026-12-01', when: 'With toilets'},
  ]},
  {id: 'ky', name: 'KY bedroom', items: [
   {name: 'TRAKEN storage bed frame, super single, 2 × 650N lifts', qty: 1, price: 429, cur: 'SGD', shop: 'Bed and Basics', type: 'Shop + online', href: 'https://bedandbasics.sg/traken-storage-bedframe-stain-resistant-fabric.html', date: '2026-12-12', when: '12.12. Deliver after clean', note: '5-year warranty. S$429 is the "from" price.'},
   {name: 'HipVan DREAM mattress, super single (pocket springs, 100 nights)', qty: 1, price: 999, cur: 'SGD', est: true, shop: 'HipVan', type: 'Online', href: 'https://www.hipvan.com/products/dream-mattress', date: '2026-12-12', when: '12.12. Deliver after clean', note: 'HipVan shows super single from S$299 to S$999. Counted at the top.'},
   {name: 'Secretlab MAGNUS Pro XL desk 177 × 80 cm', qty: 1, price: 999, cur: 'SGD', shop: 'Secretlab', type: 'Online', href: 'https://secretlab.sg/products/magnus-pro', src: 'https://yugatech.com/news/secretlab-magnus-pro-now-official', date: '2026-11-27', when: 'Black Friday. The 11.11 sale took up to S$169 off'},
   {name: 'KDK F40GP 100 cm Wi-Fi ceiling fan with light', qty: 1, price: 558, cur: 'SGD', shop: 'KDK Singapore', type: 'Online', href: 'https://www.kdk.sg/pages/national-day-sales-2026', date: '2026-12-05', when: 'Before electrician', note: '100 cm in a 250 cm room leaves 75 cm to walls. Check.'},
   {name: 'Philips Meson 5" downlight', qty: 3, price: 39.45, cur: 'MYR', shop: 'Lapasar (MY)', type: 'Online', href: 'https://mall.lapasar.com/products/155107', date: '2026-12-05', when: 'JB trip'},
   {name: 'LED ambient strip + driver', qty: 1, price: 200, cur: 'MYR', est: true, shop: 'JB lighting shop', type: 'Shop', date: '2026-12-05', when: 'JB trip'},
  ]},
  {id: 'kx', name: 'KX bedroom', items: [
   {name: 'TRAKEN storage bed frame, super single', qty: 1, price: 429, cur: 'SGD', shop: 'Bed and Basics', type: 'Shop + online', href: 'https://bedandbasics.sg/traken-storage-bedframe-stain-resistant-fabric.html', date: '2026-12-12', when: '12.12. Deliver after clean'},
   {name: 'HipVan DREAM mattress, super single', qty: 1, price: 999, cur: 'SGD', est: true, shop: 'HipVan', type: 'Online', href: 'https://www.hipvan.com/products/dream-mattress', date: '2026-12-12', when: '12.12'},
   {name: 'KDK F40GP 100 cm Wi-Fi ceiling fan with light', qty: 1, price: 558, cur: 'SGD', shop: 'KDK Singapore', type: 'Online', href: 'https://www.kdk.sg/pages/national-day-sales-2026', date: '2026-12-05', when: 'Before electrician'},
   {name: 'Philips Meson 5" downlight', qty: 3, price: 39.45, cur: 'MYR', shop: 'Lapasar (MY)', type: 'Online', href: 'https://mall.lapasar.com/products/155107', date: '2026-12-05', when: 'JB trip'},
   {name: 'Blackout curtains + track', qty: 1, price: 450, cur: 'SGD', est: true, shop: 'Curtain shop', type: 'Shop', date: '2026-12-15', when: 'Measure after windows are clear'},
  ]},
  {id: 'ks', name: 'KS bedroom', items: [
   {name: 'TRAKEN storage bed frame, queen, 2 × 950N lifts', qty: 1, price: 429, cur: 'SGD', shop: 'Bed and Basics', type: 'Shop + online', href: 'https://bedandbasics.sg/traken-storage-bedframe-stain-resistant-fabric.html', date: '2026-12-12', when: '12.12', note: 'S$429 is the "from" price. Queen costs more.'},
   {name: 'HipVan LEVITATE mattress, queen (latex + pocket springs, 12-yr warranty)', qty: 1, price: 1499, cur: 'SGD', shop: 'HipVan', type: 'Online', href: 'https://www.hipvan.com/products/levitate-mattress', date: '2026-12-12', when: '12.12. Deliver after clean'},
  ]},
  {id: 'entrance', name: 'Entrance', items: [
   {name: 'Aqara U400 smart lock, lock only (contractor fits)', qty: 1, price: 469, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/smart-tech-and-phones/smart-home/smart-security/aqara-u400-smart-door-lock-silver-dl-d16e.html', date: '2026-12-12', when: 'Install at the end of renovation', note: 'Fits doors 35–55 mm (ours 50 mm). It is a deadbolt lock: if our door has a mortise lock, it needs conversion.', alts: [
    {name: 'Aqara U400 with installation + 24-month onsite warranty', price: 649, cur: 'SGD', shop: 'Passion Home', type: 'Online', href: 'https://passionhome.sg/product/aqara-smart-door-lock-u400/'},
    {name: 'Aqara A100 mortise lock, BCA fire-rated, installed', price: 669, cur: 'SGD', shop: 'Passion Home', type: 'Online', href: 'https://passionhome.sg/product/aqara-smart-door-lock-a100/'},
   ]},
   {name: 'Retractable insect mesh door', qty: 1, price: 600, cur: 'SGD', est: true, shop: 'Mozziefy / Oleno', type: 'Online', href: 'https://www.mozziefy.com/products/door-screens/', date: '2026-12-20', when: 'After MCST approval'},
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
export function buyTotals(plan=BUY){
 const rooms=plan.rooms.map(r=>({id:r.id,name:r.name,total:r.items.reduce((s,i)=>s+lineSGD(i,plan.rate),0),est:r.items.filter(i=>i.est).reduce((s,i)=>s+lineSGD(i,plan.rate),0)}));
 return {rooms,total:rooms.reduce((s,r)=>s+r.total,0),est:rooms.reduce((s,r)=>s+r.est,0)};
}
export function buyCSV(plan=BUY){
 const q=v=>{const s=String(v??'');return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
 const rows=[['Room','Item','Model','Qty','Unit price','Currency','Line total (S$)','Rough?','Shop','Where','Buy date','When','Link','Note']];
 for(const r of plan.rooms)for(const i of r.items)rows.push([r.name,i.name,i.model??'',i.qty??1,i.price,i.cur,lineSGD(i,plan.rate).toFixed(2),i.est?'Yes':'',i.shop??'',i.type??'',i.date??'',i.when??'',i.href??'',i.note??'']);
 const t=buyTotals(plan);rows.push([]);rows.push(['Total','','','','','',t.total.toFixed(2)]);
 return rows.map(r=>r.map(q).join(',')).join('\n')+'\n';
}
