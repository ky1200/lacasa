// LaCasa to-buy list (19 Nov 2026). Prices were checked on the date in `checked`.
// cur: 'SGD' or 'MYR'. est: true = estimate (no exact listing).
// tag: when it is paid. 'before' (default) = before move-in, 'after' = after move-in, 'maybe' = not decided, not in the totals. The family can change it on /buy.
// The item itself is the recommended pick. alts are other options: the family can pick one on /buy and it is counted instead.
// id: stable key for saved choices (do not change once live).
// type: where the price was seen: 'Shop + online', 'Online', 'Shop'.
export const BUY = {
 checked: '2026-11-20',
 rate: 3.17, // RM per S$ (mid-market, 19 Nov 2026)
 rateSource: 'https://pluang.com/en/tools/currency-converter/sgd-myr',
 files: [
  {name: 'I-Niche quotation, 13 Nov 2026 (4 pages)', href: '/files/iniche-quotation-2026-11-13.pdf', note: 'Address and ID number hidden'},
  {name: 'I-Niche floor plan, original and proposed, 13 Nov 2026', href: '/files/iniche-floor-plan-2026-11-13.pdf', note: 'Address hidden'},
 ],
 sales: [
  {date: '2026-11-22', name: 'Johor Furniture & Electrical Fair, MVEC Mid Valley Southkey (20–22 Nov, 11am–9pm): mattress quotes'},
  {date: '2026-11-23', name: 'COURTS Black Friday online starts (to 29 Nov): 18% off (cap S$120) or 22% off from S$399 (cap S$199); code 50LDA S$50 off every S$500 on large appliances'},
  {date: '2026-11-26', name: 'COURTS flash sale 10pm. Last day of Harvey Norman Black Friday Comes Early. Gain City Final Group Buy 26–30 Nov (12 months free warehousing)'},
  {date: '2026-11-27', name: 'Black Friday (Fri). COURTS in-store gifts 27–29 Nov; Gain City Black Fri-Yay to 30 Nov; Audio House usually 27–30 Nov'},
  {date: '2026-11-30', name: 'Cyber Monday. Last day for Mega Discount Store aircon code 7NV0'},
  {date: '2026-12-12', name: '12.12 sale (Shopee, Lazada, brand stores, Malaysia shops)'},
  {date: '2026-12-26', name: 'Year-end sales in Singapore stores'},
 ],
 rooms: [
  {id: 'contractor', name: 'Contractor (I-Niche) and admin', items: [
   {id: 'contractor-i-niche-renovation-quote', name: 'I-Niche quote, 13 Nov, as given', qty: 1, price: 24100, cur: 'SGD', shop: 'The I-Niche Design', type: 'Contractor', href: '/files/iniche-quotation-2026-11-13.pdf', date: '2026-11-21', when: 'Final changes sent 21 Nov. Waiting for the I-Niche revised quote, then 10% deposit on signing', note: 'The lines below change this quote to match the 21 Nov decisions. Redo them when the 2nd quotation comes. Payments 10/40/40/10, 1-year workmanship warranty. Not refundable if cancelled.'},
   {id: 'contractor-taken-out-21-nov', name: 'Taken out on 21 Nov: A3, D2, D3 + D3a, D4, one G2 fan', qty: 1, price: -6385, cur: 'SGD', shop: 'Prices from the 13 Nov quote', type: 'Contractor', date: '2026-11-21', when: 'Sent to I-Niche 21 Nov', note: 'A3 KS bedroom wardrobe removal S$180. D2 new living mirror door S$600. D3 + D3a platform bed and bedhead S$1,810 (on hold, listed below as Maybe). D4 L-shaped wardrobe S$3,200. G2 + G2a: 1 fan instead of 2, common bathroom only, S$595 off.'},
   {id: 'contractor-platform-bed-d3', tag: 'maybe', name: 'D3 + D3a platform bed and bedhead, KS bedroom (on hold)', qty: 1, price: 1810, cur: 'SGD', shop: 'I-Niche', type: 'Contractor', date: '2026-12-03', when: 'Decide on 3 Dec. Optional line in the 2nd quotation', note: 'Platform S$1,260 + bedhead S$550. If kept, the KS bed frame on this list may not be needed.'},
   {id: 'contractor-f2-vinyl-3-bedrooms', decided: true, name: 'Vinyl (SPC) flooring, 3 bedrooms, with skirting, door trims and thresholds (replaces F2 polish)', qty: 1, price: 1050, cur: 'SGD', est: true, shop: 'I-Niche', type: 'Contractor', date: '2026-12-05', when: 'Laid before the beds go in', note: 'Extra over the quote. Estimate (21 Nov): about S$2,000 for vinyl laid in 3 bedrooms, minus F2 parquet polish S$950 already in the quote. Asked I-Niche for the total, price per sq ft, brand and thickness. Doors may need trimming at the bottom.', alts: [
    {name: 'Keep F2: polish the parquet (other price only, not chosen)', price: 0, cur: 'SGD', shop: 'I-Niche', type: 'Contractor', note: 'Already in the quote (S$950). Fine if the parquet is flat and not loose.'},
   ]},
   {id: 'contractor-bathroom-regrouting', name: 'Full regrouting, both bathrooms (new)', qty: 1, price: 600, cur: 'SGD', est: true, shop: 'I-Niche', type: 'Contractor', date: '2026-12-05', when: 'Price in the 2nd quotation', note: 'About S$300 per bathroom (K, 23 Nov), 2 bathrooms. Use the I-Niche price when it comes.'},
   {id: 'contractor-living-mirror-cabinet-patch', name: 'Living mirror cabinet: take off the door and patch (new, replaces D2)', qty: 1, price: 150, cur: 'SGD', est: true, shop: 'I-Niche', type: 'Contractor', date: '2026-12-05', when: 'Price in the 2nd quotation', note: 'Estimate. D2 (new mirror door, S$600) is taken out above.'},
   {id: 'contractor-anti-mould-ceiling', name: 'Anti-Mould Ceiling White in both bathrooms and the kitchen (asked)', qty: 1, price: 150, cur: 'SGD', est: true, shop: 'I-Niche', type: 'Contractor', date: '2026-12-05', when: 'Price in the 2nd quotation', note: 'Estimate. Top-up to F1 painting: the quote uses Matex, a budget ceiling paint, everywhere.'},
   {id: 'contractor-kitchen-sliding-door', name: 'E2 + E2a changed to a glass sliding door at the kitchen entrance', qty: 1, price: 0, cur: 'SGD', est: true, shop: 'I-Niche', type: 'Contractor', date: '2026-12-05', when: 'Family chooses the design. Price in the 2nd quotation', note: 'Quote had a glass bi-fold door (S$1,480) plus a cabinet change (S$220). Price difference not known yet, so S$0 for now.'},
   {id: 'contractor-door-swap', name: 'Door swap: common bathroom door to bedroom 3, new water-resistant bathroom door (asked)', qty: 1, price: 0, cur: 'SGD', est: true, shop: 'I-Niche', type: 'Contractor', date: '2026-12-05', when: 'Price in the 2nd quotation', note: 'Instead of E1 (new veneer door, S$580). The B1b door frame is sized to fit the moved door. Price difference not known yet, so S$0 for now.'},
   {id: 'contractor-g3-electrical', name: 'G3 sockets, switches and light points (labour)', qty: 1, price: 1200, cur: 'SGD', est: true, shop: 'I-Niche electrician', type: 'Contractor', date: '2026-12-05', when: 'Count on 3 Dec, then get the price', note: 'Estimate only: about 10 new or moved points at S$80 to S$150 each, plus fixing any dead LAN ports. The switch plates themselves are the next item.'},
   {id: 'contractor-mcst-renovation-deposit-refundable', name: 'MCST renovation deposit (refundable)', qty: 1, price: 1000, cur: 'SGD', shop: 'La Casa management', type: 'Shop', date: '2026-11-28', when: 'With renovation form, 7+ days before work', note: 'Cash or cheque. Refunded after checks.'},
   {id: 'contractor-switches-sockets', name: 'New switches and sockets, whole house (Schneider AvatarOn, white)', model: 'e.g. E8315 13A switched socket', qty: 30, price: 21.15, cur: 'SGD', est: true, shop: 'Schneider Electric SG eShop / SG electrical shops', type: 'Online', href: 'https://eshop.se.com/sg/e8315-wg-g2-avataron-switched-socket-3p-13a-250v-wine-gold.html', date: '2026-12-05', when: 'Count points on 3 Dec, then buy before the electrician starts', note: 'Estimate: about 30 points at S$19.40 + GST each (twin sockets about S$33). Has the Singapore SAFETY Mark, which wall switches and sockets must carry to be sold here. Ask I-Niche if their electrical price already includes switches.', alts: [
    {name: 'Schneider Vivace, white (simple, cheaper, from JB)', model: 'Vivace KB15 / KB31 series', price: 19, cur: 'MYR', est: true, shop: 'Tampoi Lighting / JB electrical shops', type: 'Shop', href: 'https://mall.lapasar.com/products/155110', note: 'About RM13 to RM25 a piece in Malaysia. The Malaysian stock has SIRIM, not the Singapore SAFETY Mark, so ask the electrician before buying: some will not fit it.'},
    {name: 'Legrand Mallia or Panasonic, white (other good brands)', price: 22, cur: 'SGD', est: true, shop: 'SG electrical shops', type: 'Shop', note: 'Same price range. Pick one brand for the whole house so plates match.'},
   ]},
  ]},
  {id: 'aircon', name: 'Aircon (3 old units)', items: [
   {id: 'aircon-mitsubishi-starmex-system-3', name: 'Mitsubishi Starmex System 3 (3 × 9,000 BTU), 5 ticks, installed with new piping', model: 'MXY-3H28VG + 3 × MSXY-FP10VG', qty: 1, price: 3510, cur: 'SGD', shop: 'Mega Discount Store', type: 'Online', href: 'https://megadiscountstore.com.sg/products/starmex-system3-aircon-9kx3', src: 'https://www.misslobang.com/article/best-system-3-aircon-singapore-2026', date: '2026-11-28', when: 'Order by 30 Nov with code 7NV0. Install about 10 Dec, before painting', note: 'Listed S$3,580 with free installation (new copper piping, 1-year workmanship). Code 7NV0 takes S$70 off until 30 Nov. Ask about any condo surcharge.', alts: [
    {name: 'Same Mitsubishi set at Gain City, installed (50 ft piping included)', price: 4019, cur: 'SGD', shop: 'Gain City', type: 'Shop + online', href: 'https://www.gaincity.com/product/108519/sku', note: 'Big store with 12 outlets.'},
    {name: 'Same Mitsubishi set, no installation shown', price: 3674, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/mitselec-mitsubishi-starmex-28k-condenser-system-39000btu-x-3-mxy-3h28vg%2B-msxy-fp10vg-sg3-x-3-IP219176.html'},
    {name: 'Daikin iSmile Eco+ System 3 (3 × 9,000 BTU), 5 ticks', price: 4020, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/daikin-daikin-7.5kwh-condenser-ismile-eco+-series-system-3-9000btu-x-3-mkm75zvmg+-ctkm25zvmg-x3-IP210313.html'},
   ]},
  ]},
  {id: 'living', name: 'Living room', items: [
   {id: 'living-lg-oled-evo-c6', name: 'LG OLED evo C6 65" (2026)', model: 'OLED65C6PSA', qty: 1, price: 3254, cur: 'SGD', shop: 'Electromart', type: 'Online', href: 'https://electromart.sg/products/lg-oled65c6psa-oled-evo-ai-c6-4k-smart-tv-65inch', date: '2026-11-27', when: 'Black Friday. Deliver after final clean (early Jan)', note: 'Electromart price checked 19 Nov. Same TV is S$3,699 at Harvey Norman.', alts: [
    {name: 'LG OLED C6 65" at a physical store', price: 3699, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/tv-and-audio/tvs-en-2/tvs-en-3/65-inches-tvs/lg-65-inch-c6-oled-evo-ai-4k-2026-smart-tv-black-oled65c6psa.atc.html'},
    {name: 'Samsung QN70H 85" Neo QLED mini-LED (2026)', price: 4299, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/tv-and-audio/tvs-en-2/tvs-en-3/samsung-85-inch-qn70h-4k-neo-qled-samsung-vision-ai-2026-smart-tv-black-qa85qn70hakxxs.html'},
    {name: 'LG OLED C6 77" (2026)', price: 6499, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/tv-and-audio/tvs-en-2/tvs-en-3/lg-77-inch-c6-oled-evo-ai-4k-2026-smart-tv-black-oled77c6psa.atc.html'},
    {name: 'LG QNED86B 75" Mini LED (LG has no 75" OLED)', model: '75QNED86B', price: 3499, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/tv-and-audio/tvs-en-2/tvs-en-3/lg-75-inch-d86-qned-evo-mini-led-ai-4k-2026-smart-tv-black-75qned86bsa.atc.html'},
   ]},
   {id: 'living-apple-tv-4k-4th', name: 'Apple TV 4K (4th gen, 2026)', qty: 1, price: 399, cur: 'SGD', shop: 'Apple Store', type: 'Shop + online', href: 'https://www.apple.com/sg/shop/buy-tv/apple-tv-4k', date: '2026-11-27', when: 'Any time. Set up after the TV arrives', note: 'Needed for 4-speaker surround. Also the HomeKit hub.'},
   {id: 'living-homepod-2nd-gen-front', name: 'HomePod (2nd gen), front left and right', qty: 2, price: 499, cur: 'SGD', shop: 'Apple Store', type: 'Shop + online', href: 'https://www.apple.com/sg/shop/buy-homepod/homepod', date: '2026-11-27', when: 'Same time as Apple TV', note: 'Apple Store Singapore price is S$499 each (checked 19 Nov).'},
   {id: 'living-homepod-mini-2-back', name: 'HomePod mini 2, back left and right', qty: 2, price: 199, cur: 'SGD', shop: 'Apple Store', type: 'Shop + online', href: 'https://www.apple.com/sg/shop/buy-homepod/homepod-mini', date: '2026-11-27', when: 'Same time as Apple TV', note: 'Must be mini 2. The 2020 mini does not work for surround.'},
   {id: 'living-l-shape-4-seat', ordered: true, name: 'V Haus sofa 2233A: armrest on one side, open cushioned end on the other, 270 × 130 cm, fabric RU002', qty: 1, price: 4257.25, cur: 'MYR', shop: 'V Haus Living, Mutiara Rini (JB)', type: 'Shop', date: '2026-11-22', when: 'Ordered 22 Nov (30% deposit paid); delivery date to confirm, maybe December', note: 'Sofa RM4,199 before GST and discount. Ordered with the armrest on the left (as seen from the front) and no armrest on the right: that end has an extra seat cushion instead (photo). Order sheet says L270 × D130 × H107 cm; measured in the shop as about 256 × 138 cm, so check the real size with V Haus. Comes with 2 free small pillows (colour RU003). Model name to confirm. Part of V Haus order 03460: RM14,516.62 incl. GST for dining set, wardrobe and sofa. Deposit RM4,355 paid; balance RM10,161.62 before delivery. Custom items cannot be cancelled.'},
   {id: 'living-coffee-table', name: 'IKEA ÖRTRÄSK coffee table, 110 × 68 cm, brown ash veneer', qty: 1, price: 219, cur: 'SGD', tag: 'maybe', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/oertraesk-coffee-table-brown-ash-veneer-90635846/', date: '2026-12-20', when: 'After the sofa is chosen', note: 'Not decided yet if a coffee table is wanted. Sizes are drawn on the floor plan; pick one there.', alts: [
    {name: 'IKEA LACK coffee table, 90 × 55 cm', price: 39.9, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/lack-coffee-table-black-brown-20352987/'},
    {name: 'IKEA HOLMERUD coffee table, 90 × 55 cm', price: 79.9, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/holmerud-coffee-table-dark-brown-80541419/'},
    {name: 'IKEA ÄMMARYD coffee table, 98 × 59 cm', price: 99.9, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/aemmaryd-coffee-table-white-10609120/'},
    {name: 'IKEA LACK coffee table, 118 × 78 cm', price: 69.9, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/lack-coffee-table-black-brown-80352951/'},
    {name: 'IKEA UGGLERUM coffee table, 130 × 65 cm', price: 199, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/ugglerum-coffee-table-walnut-veneer-80627979/'},
    {name: 'IKEA VITTSJÖ round coffee table, Ø75 cm', price: 69.9, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/vittsjoe-coffee-table-light-beige-glass-50604347/'},
   ]},
   {id: 'living-philips-meson-5-13w', name: 'Philips Meson 5" 13W recessed downlight (3000K or 4000K)', qty: 8, price: 39.45, cur: 'MYR', shop: 'Lapasar (MY); JB lighting shops stock Philips', type: 'Online', href: 'https://mall.lapasar.com/products/155107', date: '2026-12-05', when: 'Buy in JB before the electrician starts', note: 'One fixed colour per light: choose warm 3000K or neutral 4000K when buying. Contractor patches old holes (B2). Agree the new layout first.', alts: [
    {name: 'Philips Eridani SceneSwitch 4" 9W downlight, 3 colours (warm, neutral, daylight) from the normal wall switch', model: 'Eridani SSW D100', price: 45, cur: 'MYR', est: true, shop: 'Tampoi Lighting / JB lighting shops', type: 'Shop', href: 'https://www.lighting.philips.co.id/consumer/p/recessed-lights-4-inch-eridani-recessed-light-9w/8721103108777', note: 'Flick the switch off and on to change colour: warm for evenings, white for cleaning. No dimmer or smart switch needed. 3-year Philips warranty. Price is an estimate: check in store (6" 15W also made).'},
   ]},
   {id: 'living-led-cove-strip-driver', name: 'LED cove strip + driver', qty: 1, price: 350, cur: 'MYR', est: true, shop: 'JB lighting shop', type: 'Shop', date: '2026-12-05', when: 'With downlights'},
   {id: 'living-track-or-spot-lights', name: 'Track or spot lights for TV wall / art', qty: 2, price: 200, cur: 'MYR', est: true, shop: 'JB lighting shop', type: 'Shop', date: '2026-12-05', when: 'With downlights', note: 'A track is a ceiling rail with spotlights that clip on and slide, so spots can move later. See "Light types" below.', alts: [
    {name: 'Recessed eyeball spotlight, anti-glare, 10W (set into the ceiling, tilts to aim)', model: 'MasterCo OG-239 10W 24°', price: 53, cur: 'MYR', shop: 'Lapasar (MY)', type: 'Online', href: 'https://mall.lapasar.com/products/161055', note: 'Price is for 1 light. Usually 3 to 4 for a TV or art wall: set the number with + and −. Warm 3000K or neutral 4000K.'},
   ]},
  ]},
  {id: 'dining', name: 'Dining', items: [
   {id: 'dining-v-haus-lino-dining', ordered: true, name: 'V Haus LINO dining table 160 × 90 cm, walnut + 6 C9060 walnut chairs', qty: 1, price: 2330.89, cur: 'MYR', shop: 'V Haus Living, Mutiara Rini (JB)', type: 'Shop', date: '2026-11-22', when: 'Ordered 22 Nov (30% deposit paid); January stock, delivery mid to end January', note: 'Table RM2,299 before GST and discount, 6 chairs included. Sold out now; delivery mid to end January. Check chair pull-out space. Part of V Haus order 03460: RM14,516.62 incl. GST for dining set, wardrobe and sofa. Deposit RM4,355 paid; balance RM10,161.62 before delivery. Custom items cannot be cancelled.'},
   {id: 'dining-kdk-f40gp-100-cm', name: 'KDK F40GP 100 cm Wi-Fi DC ceiling fan with LED light', qty: 1, price: 418, cur: 'SGD', shop: 'KDK Singapore', type: 'Online', href: 'https://www.kdk.sg/products/ceiling-fan-f40gp', date: '2026-12-05', when: 'Buy before electrician. JB KDK dealers may be cheaper', note: 'KDK Bundle D (2 × F40GP) is S$788. Check clearance to walls.'},
  ]},
  {id: 'kitchen', name: 'Kitchen and yard', items: [
   {id: 'fridge', name: 'Hitachi 407 L 2-door fridge, inverter', model: 'R-VX480PMS9', qty: 1, price: 989, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/hitachi-r-vx480pms9-pwh-2-dr-fridge-407l-ip169155', date: '2026-11-27', when: 'Black Friday. Deliver after clean', note: '68 W × 72 D × 177 H cm, fits our 70 × 75 × 180 cm space with 1 cm each side. 10-year compressor warranty. Freezer on top. Gain City listed it at S$979.', alts: [
    {name: 'Panasonic 405 L, freezer at bottom', model: 'NR-BX471CPSS', price: 989, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/panasonic-nr-bx471cpss-2-dr-fridge-405l-ip168440', note: 'Same price now. Good, reliable brand, and the freezer drawer is at the bottom. 68.6 cm wide: only 7 mm each side, so measure first.'},
    {name: 'Toshiba 411 L, white glass (70 cm wide: no gap in our space)', model: 'GR-RT559WE-PMX(21S)', price: 999, cur: 'SGD', shop: 'Electromart', type: 'Online', href: 'https://electromart.sg/products/toshiba-gr-rt559we-pmx21s-top-mounted-refrigerator-411l'},
    {name: 'Mitsubishi 423 L, freezer at bottom (69.9 cm wide: no gap)', model: 'MR-HGS52EXG', price: 1799, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/mitsubishi-2-door-bottom-freezer-423l-mr-hgs52exgwhp-IP204243.html'},
   ]},
   {id: 'washer', name: 'Panasonic 12.5 kg front-load washer', model: 'NA-25CEW1BSG', qty: 1, price: 1339, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/panasonic-front-load-washer-12.5kg-na-25cew1bsg-IP211791.html', date: '2026-11-27', when: 'Black Friday. Deliver after clean', note: '59.6 W × 60.5 D cm, fits the 67 cm depth. Panasonic is as reliable as LG. A full 12 kg wet load is heavy for the Steigen Mini: hang in 2 lots.', alts: [
    {name: 'Panasonic 12 kg with AutoDose and auto clean', model: 'NA-24VDW1BSG', price: 1519, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/panasonic-smart-front-load-washer-with-auto-clean---black-12kg-na-24vdw1bsg-IP222529.html'},
    {name: 'LG 12 kg AI DD (56.5 cm deep)', model: 'FX1412S2KA', price: 1839, cur: 'SGD', shop: 'Harvey Norman', type: 'Shop + online', href: 'https://www.harveynorman.com.sg/home-appliances/washing-machines-and-dryers-en/washing-machines-en/lg-12kg-front-load-washer-matte-black-fx1412s2ka.html'},
    {name: 'LG 9 kg AI DD', model: 'FX1409S5G', price: 1299, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/lg-front-load-washer---essense-graphite-9kg-fx1409s5g-IP223515.html'},
    {name: 'Bosch Series 6 9 kg (i-DOS)', model: 'WGG24400SG', price: 1377, cur: 'SGD', shop: 'Electromart', type: 'Online', href: 'https://electromart.sg/products/bosch-wgg24400sg-front-load-washer-9kg'},
   ]},
   {id: 'kitchen-steigen-solar-mini-drying', name: 'Steigen Solar Mini drying rack, installed', qty: 1, price: 899, cur: 'SGD', shop: 'Steigen', type: 'Online', href: 'https://www.steigen.com.sg/products/steigen-dryer', date: '2026-12-12', when: '12.12. Install after painting', note: 'Mini fits ceiling 110–144 cm (ours 120 cm). Steigen lists it for washers up to 7 kg and queen bedding. Mega needs 145 cm+.', alts: [
    {name: 'Steigen Halo Mini (AI drying)', price: 1099, cur: 'SGD', shop: 'Steigen', type: 'Online', href: 'https://www.steigen.com.sg/products/steigen-dryer'},
   ]},
   {id: 'kitchen-fan', name: 'Fanco DC Dono 16" corner fan (wall or ceiling mount, remote)', model: 'DONO-DC-16', qty: 1, price: 199, cur: 'SGD', shop: 'Electromart', type: 'Online', href: 'https://electromart.sg/products/fanco-dc-dono-16-wall-or-ceiling-mount-corner-dc-fan', date: '2026-12-05', when: 'Before electrician. Needs a power point or fan point high on the wall', note: 'DC motor, quiet. 4-year onsite warranty, lifetime motor warranty. Was S$130 on sale, now S$199 (checked 19 Nov).', alts: [
    {name: 'KDK 16" wall fan', model: 'KU408', price: 230, cur: 'MYR', shop: 'Lapasar (MY)', type: 'Online', href: 'https://mall.lapasar.com/products/kdk-kdk-ku-408-16-wall-fan/195843'},
    {name: "D'FAN 16\" DC wall fan, black", model: '516', price: 259, cur: 'SGD', shop: 'COURTS', type: 'Shop + online', href: 'https://www.courts.com.sg/dfan-16-in-dc-wall-fan-black-516-IP171419.html'},
   ]},
   {id: 'kitchen-robot-vacuum-mop', name: 'Dreame X50 Ultra robot vacuum + mop, with water kit and installation (dock in the yard)', model: 'X50 Ultra, "+Kit (With Installation)"', qty: 1, price: 1299, cur: 'SGD', shop: 'Dreame Singapore (official)', type: 'Online', href: 'https://dreame.sg/products/dreame-x50-ultra-master', date: '2026-11-27', when: 'Black Friday or 12.12. Install after the final clean, at the yard water points and floor drain', note: 'Same S$1,299 with or without the water kit: pick "+Kit (With Installation)" and check the cart shows it. The dock fills clean water and drains used water by pipe, empties the dust bin (3.2 L bag), washes the mops in 80°C water and dries them. Robot is 8.9 cm high with its laser sensor lowered (11.1 cm raised), so 12 cm under beds and sofa is enough. A 2025 model: early bugs were fixed by updates, and owners after a year rate it well. Dreame SG has a service centre.', alts: [
    {name: 'Roborock Saros 20 Refill & Drainage (water pipes built into the dock)', model: 'Saros 20 R&D', price: 1899.9, cur: 'SGD', shop: 'Roborock Singapore (official)', type: 'Online', href: 'https://www.roborock.sg/products/roborock-saros-20-refill-drainage', note: 'Best owner track record of the brands. 7.95 cm high, 100°C mop wash, 2-year warranty, SG service centre. Was S$1,699.90 at 11.11, so wait for a sale. Harvey Norman also sells it. Ask if installation is included.'},
    {name: 'Dreame X60 Ultra (2026), with water kit and installation', model: 'X60 Ultra, "+ Kit (With Installation)"', price: 1764, cur: 'SGD', shop: 'Dreame Singapore (official)', type: 'Online', href: 'https://dreame.sg/products/dreame-x60-ultra-master', note: 'Newer: 7.95 cm high, 100°C mop wash, re-mops dirty spots. Less owner history so far.'},
    {name: 'Dreame Aqua10 Ultra Roller (roller mop), with water kit and installation', model: 'Aqua10 Ultra Roller, "+ Kit (With Installation)"', price: 1599, cur: 'SGD', shop: 'Dreame Singapore (official)', type: 'Online', href: 'https://dreame.sg/products/dreame-aqua-10-ultra-roller', note: 'Best mopping in tests (roller always rinsed with clean water). Some owners reported the dock leaking. Slow, small dust bin. 2-year warranty.'},
    {name: 'Narwal Freo X10 Pro with Autowater kit', model: 'X10Pro Autowater Kit', price: 1098, cur: 'SGD', shop: 'Narwal Singapore (official)', type: 'Online', href: 'https://sg.narwal.com/products/narwal-freo-x10pro-robot-vacuum-cleaner-25000pa-suction-power-dual-tangle-free-system-edgereach-mop-extension-auto-mop-cleaning-drying', note: 'Cheapest with water pipes. Simpler, weaker vacuum. Installation not stated: ask Narwal. 2-year local warranty.'},
   ]},
  ]},
  {id: 'common-bath', name: 'Common bathroom', items: [
   {id: 'common-bath-rigel-gallant-one-piece', name: 'RIGEL Gallant one-piece rimless toilet with Whirlwash', model: 'R-WO9030FA-HKM', qty: 1, price: 525, cur: 'SGD', shop: 'RIGEL e-store (official)', type: 'Online', href: 'https://rigel-estore.com.sg/product/one-piece-rimless-water-closet-with-whirlwash-r-wo9030fa-hkm/', date: '2026-12-01', when: 'Order early. Contractor installs (C)', note: 'Official RIGEL price, U.P. S$770. See it first at the showroom in Changi Business Park.', alts: [
    {name: 'RIGEL one-piece rimless, slim tank', model: 'R-WO8056F', price: 525, cur: 'SGD', shop: 'RIGEL e-store (official)', type: 'Online', href: 'https://rigel-estore.com.sg/product/one-piece-rimless-slim-tank-water-closet-r-wo8056f/'},
    {name: 'RIGEL two-piece rimless, double Whirlwash', model: 'R-WC8056F', price: 400, cur: 'SGD', shop: 'RIGEL e-store (official)', type: 'Online', href: 'https://rigel-estore.com.sg/product/two-piece-rimless-water-closet-with-double-whirlwash-r-wc8056f/'},
    {name: 'Same RIGEL Gallant at Gain City', model: 'WO9030FA-HKM', price: 580, cur: 'SGD', shop: 'Gain City', type: 'Shop + online', href: 'https://www.gaincity.com/rigel-water-closet-one-piece-wo9030fa-hkm-t0167035'},
   ]},
   {id: 'common-bath-basin-cabinet-304-stainless', name: 'RIGEL R-BC7437 vanity, 70 cm: dark brown PVC cabinet with 2 drawers and a sintered stone basin top', model: 'R-BC7437-DBR (700 mm)', qty: 1, price: 760, cur: 'SGD', shop: 'Heritage Bathroom Gallery (ask price) or RIGEL e-store', type: 'Shop + online', href: 'https://rigel-estore.com.sg/product/wall-hung-vanity-cabinet-set-with-integrated-basin-top-r-bc7437/', date: '2026-12-05', when: 'After measuring the wall on 3 Dec. Contractor fits (C1)', note: 'The one picked from the Heritage photo. RIGEL e-store S$760 for 70 cm (was S$950); Heritage gives prices on WhatsApp only. Basin is built into the top, so no separate basin is needed. Also made in 100 cm.', alts: [
    {name: 'RIGEL R-BC1260 vanity, 60 cm, 1 drawer, dark brown (if the wall is under 70 cm)', model: 'R-BC1260-1-DBR-600mm', price: 500, cur: 'SGD', shop: 'RIGEL e-store', type: 'Online', href: 'https://rigel-estore.com.sg/product/wall-hung-vanity-cabinet-set-with-integrated-basin-top-r-bc1260/'},
    {name: 'RIGEL R-BC0201 vanity, 2 drawers, grey, 60 or 70 cm', model: 'R-BC0201', price: 620, cur: 'SGD', shop: 'RIGEL e-store', type: 'Online', href: 'https://rigel-estore.com.sg/product/wall-hung-vanity-cabinet-set-with-integrated-basin-top-r-bc0201/'},
   ]},
   {id: 'common-bath-basin-mixer-tap', name: 'Grohe Eurosmart basin mixer S-size, chrome', model: '23922003', qty: 1, price: 229, cur: 'SGD', shop: 'Bathroom Shop SG', type: 'Online', href: 'https://bathroom.com.sg/products/grohe-eurosmart-basin-mixer-s-size-23922003', date: '2026-12-05', when: 'With the vanity', note: 'WELS 3 ticks, Grohe SilkMove cartridge. Hoe Kee lists it at S$209 (pre-order). See Research for more taps.', alts: [
    {name: 'RIGEL W2-R-MXB2003 basin mixer (matches the RIGEL vanity)', model: 'W2-R-MXB2003', price: 199, cur: 'SGD', shop: 'RIGEL e-store', type: 'Online', href: 'https://rigel-estore.com.sg/product/deck-mounted-basin-mixer-tap-w2-r-mxb2003/'},
    {name: 'Grohe BauEdge basin mixer S-size', model: '32858000', price: 189, cur: 'SGD', shop: 'Bathroom Shop SG', type: 'Online', href: 'https://bathroom.com.sg/products/grohe-bauedge-single-lever-basin-mixer-s-size-32858000'},
    {name: 'Hansgrohe Rebris S basin mixer 110', model: '72522009', price: 330.49, cur: 'SGD', shop: 'Lucky Khoon', type: 'Online', href: 'https://luckykhoon.com.sg/products/hansgrohe-rebris-s-single-lever-basin-mixer-110-with-push-open-waste-set'},
   ]},
   {id: 'common-bath-rigel-3-in-1', name: 'RIGEL 3-in-1 thermostatic rain shower set, chrome', model: 'W2-R-TSME14418T', qty: 1, price: 450, cur: 'SGD', shop: 'RIGEL e-store (official)', type: 'Online', href: 'https://rigel-estore.com.sg/product/thermostatic-3-in-1-exposed-shower-set-w2-r-tsme14418t/', date: '2026-12-01', when: 'Check with water heater first', note: 'Chrome S$450 (U.P. S$699). Chrome is the hardest-wearing finish.', alts: [
    {name: 'Same set, brushed nickel', model: 'W2-R-TSME14418T', price: 660, cur: 'SGD', shop: 'RIGEL e-store (official)', type: 'Online', href: 'https://rigel-estore.com.sg/product/thermostatic-3-in-1-exposed-shower-set-w2-r-tsme14418t/'},
    {name: 'Same set, brushed nickel, at Gain City', model: 'W2-R-TSME14418T (BRNK)', price: 814, cur: 'SGD', shop: 'Gain City', type: 'Shop + online', href: 'https://www.gaincity.com/rigel-rainshower-set-3-in-1-w2-r-tsme14418t-brnk-tb0003899'},
    {name: 'RIGEL Quatré 4-in-1 thermostatic shower set', model: 'W2-R-TSME2031', price: 575, cur: 'SGD', shop: 'RIGEL e-store', type: 'Online', href: 'https://rigel-estore.com.sg/product/quatre-4-in-1-exposed-shower-set-w2-r-tsme2031/'},
    {name: 'Grohe Tempesta System 250 with thermostat', model: '26670001', price: 899, cur: 'SGD', shop: 'Bathroom Shop SG', type: 'Online', href: 'https://bathroom.com.sg/products/grohe-tempesta-250-shower-system-with-thermostatic-shower-mixer-26670001-rainshow'},
   ]},
   {id: 'common-mirror', name: 'IKEA ENHET mirror cabinet, 2 doors, 60 × 17 × 75 cm (no light, no power point)', qty: 1, price: 170, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/enhet-mirror-cabinet-with-doors-white-20623045/', date: '2026-12-01', when: 'Buy with basins. Contractor hangs it', note: '10-year IKEA guarantee. S$170 checked 19 Nov. Measure above the basin first.', alts: [
    {name: 'IKEA ENHET mirror cabinet, anthracite, 60 × 17 × 75 cm', price: 110, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/enhet-mirror-cabinet-anthracite-s89396578/'},
    {name: 'IKEA ENHET mirror cabinet, 1 door, 40 × 17 × 75 cm', price: 125, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/enhet-mirror-cabinet-with-door-white-10623041/'},
    {name: 'IKEA LETTAN mirror cabinet, all-mirror, 60 × 15 × 95 cm', price: 315, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/lettan-mirror-cabinet-with-doors-mirror-effect-mirror-glass-00535498/'},
    {name: 'RIGEL R-BC5628 mirror cabinet with LED light and anti-fog, 60 × 80 cm (needs a power point)', model: 'R-BC5628-GUN-600mm', price: 399, cur: 'SGD', shop: 'RIGEL e-store', type: 'Online', href: 'https://rigel-estore.com.sg/product/mirror-cabinet-with-light-r-bc5628-gun-600mm/'},
   ]},
   {id: 'common-bath-bidet-spray', name: 'RIGEL R-SA8200 stainless steel bidet spray set, chrome (with angle valve)', model: 'R-SA8200 (A) + W2-R-JT070111B', qty: 1, price: 125, cur: 'SGD', shop: 'RIGEL e-store', type: 'Online', href: 'https://rigel-estore.com.sg/product/hand-bidet-sprayer-set-stainless-steel-chrome-r-sa8200-a-w2-r-jt070111b/', date: '2026-12-05', when: 'With the toilet', note: 'No American Standard. Stainless spray head, holder, hose and shut-off valve in one set (was S$170).', alts: [
    {name: 'Grohe Tempesta-F Trigger Spray 30 set + Grohe angle valve', model: '27513001 + 22041001', price: 128, cur: 'SGD', shop: 'Bathroom Shop SG', type: 'Online', href: 'https://bathroom.com.sg/products/grohe-tempesta-f-trigger-spray-30-set-bidet-hygiene-spray-27513001'},
    {name: 'RIGEL R-SA8200 stainless bidet spray set, gun metal', model: 'R-SA8200-GUN (A)', price: 195, cur: 'SGD', shop: 'RIGEL e-store', type: 'Online', href: 'https://rigel-estore.com.sg/product/hand-bidet-sprayer-set-stainless-steel-gun-metal-r-sa8200-gun-a-w2-r-jt070111b-gun/'},
   ]},
   {id: 'common-bath-ceiling-light-wet-area', name: 'Ceiling light (wet-area)', qty: 1, price: 100, cur: 'SGD', est: true, shop: 'JB lighting shop', type: 'Shop', date: '2026-12-05', when: 'JB trip'},
  ]},
  {id: 'master-bath', name: 'Master bathroom', items: [
   {id: 'master-bath-rigel-gallant-one-piece', name: 'RIGEL Gallant one-piece rimless toilet with Whirlwash', model: 'R-WO9030FA-HKM', qty: 1, price: 525, cur: 'SGD', shop: 'RIGEL e-store (official)', type: 'Online', href: 'https://rigel-estore.com.sg/product/one-piece-rimless-water-closet-with-whirlwash-r-wo9030fa-hkm/', date: '2026-12-01', when: 'Order with common bath'},
   {id: 'master-bath-rigel-thermostatic-exposed-shower', name: 'RIGEL thermostatic 2-in-1 shower set with slide rail, chrome', model: 'W2-R-TSME3200055', qty: 1, price: 400, cur: 'SGD', shop: 'RIGEL e-store (official)', type: 'Online', href: 'https://rigel-estore.com.sg/product/exposed-thermostatic-2-in-1-shower-set-with-slide-rail-and-hand-shower-w2-r-tsme3200055-set/', date: '2026-12-01', when: 'With common bath', note: 'Mixer, slide rail and hand shower. U.P. S$679.', alts: [
    {name: 'Mixer only (reuse old rail and hand shower)', model: 'W2-R-TSME3200055', price: 280, cur: 'SGD', shop: 'RIGEL e-store (official)', type: 'Online', href: 'https://rigel-estore.com.sg/product/exposed-thermostatic-2-in-1-shower-mixer-w2-r-tsme3200055/'},
    {name: '3-in-1 rain shower set, chrome (same as common bath)', model: 'W2-R-TSME14418T', price: 450, cur: 'SGD', shop: 'RIGEL e-store (official)', type: 'Online', href: 'https://rigel-estore.com.sg/product/thermostatic-3-in-1-exposed-shower-set-w2-r-tsme14418t/'},
   ]},
   {id: 'master-mirror', name: 'IKEA ENHET mirror cabinet, 2 doors, 60 × 17 × 75 cm (no light, no power point)', qty: 1, price: 170, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/enhet-mirror-cabinet-with-doors-white-20623045/', date: '2026-12-01', when: 'Buy with basins. Contractor hangs it', note: '10-year IKEA guarantee. S$170 checked 19 Nov. Measure above the basin first.', alts: [
    {name: 'IKEA ENHET mirror cabinet, anthracite, 60 × 17 × 75 cm', price: 110, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/enhet-mirror-cabinet-anthracite-s89396578/'},
    {name: 'IKEA ENHET mirror cabinet, 1 door, 40 × 17 × 75 cm', price: 125, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/enhet-mirror-cabinet-with-door-white-10623041/'},
    {name: 'IKEA LETTAN mirror cabinet, all-mirror, 60 × 15 × 95 cm', price: 315, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/lettan-mirror-cabinet-with-doors-mirror-effect-mirror-glass-00535498/'},
    {name: 'RIGEL R-BC5628 mirror cabinet with LED light and anti-fog, 60 × 80 cm (needs a power point)', model: 'R-BC5628-GUN-600mm', price: 399, cur: 'SGD', shop: 'RIGEL e-store', type: 'Online', href: 'https://rigel-estore.com.sg/product/mirror-cabinet-with-light-r-bc5628-gun-600mm/'},
   ]},
   {id: 'master-bath-bidet-spray', name: 'RIGEL R-SA8200 stainless steel bidet spray set, chrome (with angle valve)', model: 'R-SA8200 (A) + W2-R-JT070111B', qty: 1, price: 125, cur: 'SGD', shop: 'RIGEL e-store', type: 'Online', href: 'https://rigel-estore.com.sg/product/hand-bidet-sprayer-set-stainless-steel-chrome-r-sa8200-a-w2-r-jt070111b/', date: '2026-12-05', when: 'With the toilet', note: 'No American Standard. Stainless spray head, holder, hose and shut-off valve in one set (was S$170).', alts: [
    {name: 'Grohe Tempesta-F Trigger Spray 30 set + Grohe angle valve', model: '27513001 + 22041001', price: 128, cur: 'SGD', shop: 'Bathroom Shop SG', type: 'Online', href: 'https://bathroom.com.sg/products/grohe-tempesta-f-trigger-spray-30-set-bidet-hygiene-spray-27513001'},
    {name: 'RIGEL R-SA8200 stainless bidet spray set, gun metal', model: 'R-SA8200-GUN (A)', price: 195, cur: 'SGD', shop: 'RIGEL e-store', type: 'Online', href: 'https://rigel-estore.com.sg/product/hand-bidet-sprayer-set-stainless-steel-gun-metal-r-sa8200-gun-a-w2-r-jt070111b-gun/'},
   ]},
   {id: 'master-bath-accessories-for-both-bathrooms', name: 'Grohe Essentials 3-in-1 set: towel rail, toilet roll holder, robe hook (one per bathroom)', model: '40775001', qty: 2, price: 159, cur: 'SGD', shop: 'Bathroom Shop SG', type: 'Online', href: 'https://bathroom.com.sg/products/grohe-40775001-essentials-3-in-1-guest-bathroom-accessories-set-grohe-towel-rail-paper-holder', date: '2026-12-05', when: 'With the toilets. Contractor fixes them', note: 'One set for each bathroom. 60 cm towel rail holds up to 10 kg. See Research for double rails and towel shelves.', alts: [
    {name: 'Grohe Essentials 4-in-1 set (adds a towel ring), out of stock on 22 Nov', model: '40776001', price: 189, cur: 'SGD', shop: 'Bathroom Shop SG', type: 'Online', href: 'https://bathroom.com.sg/products/grohe-40776001-essentials-4-in-1-master-bathroom-accessories-set-grohe-towel-rail-paper-holder'},
    {name: 'Hansgrohe AddStoris S set: towel rail, roll holder, 2 hooks', price: 229, cur: 'SGD', shop: 'Lucky Khoon', type: 'Online', href: 'https://luckykhoon.com.sg/products/hansgrohe-addstoris-s-accessories-bundle'},
    {name: 'RIGEL towel bar R-TB6908 + roll holder R-PH9401T + robe hook R-RH6901', price: 265, cur: 'SGD', shop: 'RIGEL e-store', type: 'Online', href: 'https://rigel-estore.com.sg/product/single-towel-bar-r-tb6908/'},
   ]},
  ]},
  {id: 'ky', name: 'KY bedroom', items: [
   {id: 'ky-bed', ordered: true, name: 'Dunlopillo storage bed frame, queen, 41 cm high, with KHJ60 headboard, colour PLE 007', qty: 1, price: 1086.17, cur: 'MYR', shop: 'ANZ Home Furniture (Dunlopillo), JB', type: 'Shop', date: '2026-11-22', when: 'Ordered 22 Nov; pay balance by Sat 19 Dec; delivery Tue 22 Dec', note: 'Room 1 (KY). Frame RM999 before GST. Frame is 41 cm high outside; storage space inside is 14 inch (about 35 cm) deep. Hydraulic lift-up. '+'Part of the Dunlopillo order: RM19,999 for all 3 beds incl. 9% GST, free delivery to SG. Deposit RM8,000 paid; balance RM11,999 on delivery.'},
   {id: 'ky-mattress', ordered: true, name: 'Dunlopillo Carlton Signature CoolSilk Nano-G mattress, queen, 30 cm, firmness 6/10', qty: 1, price: 4347.93, cur: 'MYR', shop: 'ANZ Home Furniture (Dunlopillo), JB', type: 'Shop', date: '2026-11-22', when: 'Ordered 22 Nov; pay balance by Sat 19 Dec; delivery Tue 22 Dec', note: 'KY bed: 30 cm mattress on a 41 cm frame, top of mattress about 71 cm from the floor. RM3,999 before GST (list price RM6,699). Natural Dunlop latex + high-resilience foam + individual pocket springs. '+'Part of the Dunlopillo order: RM19,999 for all 3 beds incl. 9% GST, free delivery to SG. Deposit RM8,000 paid; balance RM11,999 on delivery.'},
   {id: 'ky-kdk-f40gp-100-cm', name: 'KDK F40GP 100 cm Wi-Fi DC ceiling fan with LED light', qty: 1, price: 418, cur: 'SGD', shop: 'KDK Singapore', type: 'Online', href: 'https://www.kdk.sg/products/ceiling-fan-f40gp', date: '2026-12-05', when: 'Before electrician', note: '100 cm in a 250 cm room leaves 75 cm to walls. Check.'},
   {id: 'ky-philips-meson-5-downlight', name: 'Philips Meson 5" downlight', qty: 3, price: 39.45, cur: 'MYR', shop: 'Lapasar (MY)', type: 'Online', href: 'https://mall.lapasar.com/products/155107', date: '2026-12-05', when: 'JB trip'},
   {id: 'ky-led-ambient-strip-driver', name: 'LED ambient strip + driver', qty: 1, price: 200, cur: 'MYR', est: true, shop: 'JB lighting shop', type: 'Shop', date: '2026-12-05', when: 'JB trip'},
   {id: 'ky-wardrobe', name: 'IKEA GURSKEN wardrobe, 49 × 55 cm (same size as the old one)', qty: 1, price: 89.9, cur: 'SGD', tag: 'maybe', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/gursken-wardrobe-light-beige-50503292/', date: '2026-12-20', when: 'Only if the old one is not reused', note: 'KY may reuse the old GURSKEN. Bigger choices are on the floor plan.', alts: [
    {name: 'IKEA KLEPPSTAD wardrobe, 2 doors, 79 × 55 cm', price: 149, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/kleppstad-wardrobe-with-2-doors-white-10437237/'},
    {name: 'IKEA BRIMNES wardrobe, 2 doors, 78 × 50 cm', price: 199, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/brimnes-wardrobe-with-2-doors-white-20400479/'},
   ]},
  ]},
  {id: 'kx', name: 'KX bedroom', items: [
   {id: 'kx-bed', ordered: true, name: 'Dunlopillo storage bed frame, queen, 41 cm high, no headboard, colour Picco PC 151-14', qty: 1, price: 1086.17, cur: 'MYR', shop: 'ANZ Home Furniture (Dunlopillo), JB', type: 'Shop', date: '2026-11-22', when: 'Ordered 22 Nov; pay balance by Sat 19 Dec; delivery Tue 22 Dec', note: 'Room 2 (KX). Frame RM999 before GST. Frame is 41 cm high outside; storage space inside is 14 inch (about 35 cm) deep. Hydraulic lift-up. '+'Part of the Dunlopillo order: RM19,999 for all 3 beds incl. 9% GST, free delivery to SG. Deposit RM8,000 paid; balance RM11,999 on delivery.'},
   {id: 'kx-mattress', ordered: true, name: 'Dunlopillo Richmond Signature CoolSilk Nano-G mattress, queen, 38 cm, firmness 6/10', qty: 1, price: 6196.28, cur: 'MYR', shop: 'ANZ Home Furniture (Dunlopillo), JB', type: 'Shop', date: '2026-11-22', when: 'Ordered 22 Nov; pay balance by Sat 19 Dec; delivery Tue 22 Dec', note: 'KX bed: 38 cm mattress on a 41 cm frame, top about 79 cm from the floor. RM5,699 before GST (list RM9,499). Plush top over Euro top, natural Dunlop latex + memory foam, 5-zone individual pocket springs. '+'Part of the Dunlopillo order: RM19,999 for all 3 beds incl. 9% GST, free delivery to SG. Deposit RM8,000 paid; balance RM11,999 on delivery.'},
   {id: 'kx-kdk-f40gp-100-cm', name: 'KDK F40GP 100 cm Wi-Fi DC ceiling fan with LED light', qty: 1, price: 418, cur: 'SGD', shop: 'KDK Singapore', type: 'Online', href: 'https://www.kdk.sg/products/ceiling-fan-f40gp', date: '2026-12-05', when: 'Before electrician'},
   {id: 'kx-philips-meson-5-downlight', name: 'Philips Meson 5" downlight', qty: 3, price: 39.45, cur: 'MYR', shop: 'Lapasar (MY)', type: 'Online', href: 'https://mall.lapasar.com/products/155107', date: '2026-12-05', when: 'JB trip'},
   {id: 'kx-blackout-curtains-track', name: 'Blackout curtains + track', qty: 1, price: 450, cur: 'SGD', est: true, shop: 'Curtain shop', type: 'Shop', date: '2026-12-15', when: 'Measure after windows are clear'},
   {id: 'kx-v-haus-l-wardrobe', ordered: true, name: 'V Haus ALTO L-shape full-height wardrobe, custom (6 ft + 6 ft, 9 ft high)', qty: 1, price: 7928.48, cur: 'MYR', shop: 'V Haus Living, Mutiara Rini (JB)', type: 'Shop', date: '2026-11-22', when: 'Ordered 22 Nov (30% deposit paid); V Haus measures Tue 8 Dec; delivery aimed at end of December', note: 'Wardrobe RM7,820 before GST and discount (was estimated at RM5,800). Order: L-shape, 6 ft + 6 ft, 9 ft high; vertical LED in the L-shape compartment, horizontal LED in another (3 ft + 3 ft); L-shape lower shelves changed to a hanging rod. Body colour, door colour and compartments still to choose. Earlier plan was 1880 + 1125 mm, so confirm the final size when they measure. Replaces I-Niche D4 (S$3,200, taken out). Part of V Haus order 03460: RM14,516.62 incl. GST for dining set, wardrobe and sofa. Deposit RM4,355 paid; balance RM10,161.62 before delivery. Custom items cannot be cancelled.'},
   {id: 'kx-vanity', name: 'IKEA MALM dressing table, 120 × 41 cm', qty: 1, price: 99, cur: 'SGD', tag: 'maybe', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/malm-dressing-table-white-40355409/', date: '2026-12-20', when: 'After the wardrobe is in', note: 'Study and vanity desk. Sizes are on the floor plan.', alts: [
    {name: 'IKEA SYVDE dressing table, 100 × 48 cm', price: 249, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/syvde-dressing-table-white-00439562/'},
    {name: 'IKEA BRIMNES dressing table, 70 × 42 cm', price: 99.9, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/brimnes-dressing-table-white-90355421/'},
    {name: 'IKEA HEMNES dressing table, 100 × 50 cm', price: 539, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/hemnes-dressing-table-white-10355670/'},
   ]},
   {id: 'kx-stool', name: 'IKEA KYRRE stool', qty: 1, price: 25, cur: 'SGD', tag: 'maybe', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/kyrre-stool-birch-80420040/', date: '2026-12-20', when: 'With the dressing table', alts: [
    {name: 'IKEA MARIUS stool', price: 5.9, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/marius-stool-black-00162380/'},
   ]},
  ]},
  {id: 'ks', name: 'KS bedroom', items: [
   {id: 'ks-bed', ordered: true, name: 'Dunlopillo storage bed frame, queen, 41 cm high, with KHJ44 headboard, colour 311-15', qty: 1, price: 1086.17, cur: 'MYR', shop: 'ANZ Home Furniture (Dunlopillo), JB', type: 'Shop', date: '2026-11-22', when: 'Ordered 22 Nov; pay balance by Sat 19 Dec; delivery Tue 22 Dec', note: 'Room 3 (KS). Frame RM999 before GST. Frame is 41 cm high outside; storage space inside is 14 inch (about 35 cm) deep. Hydraulic lift-up. '+'Part of the Dunlopillo order: RM19,999 for all 3 beds incl. 9% GST, free delivery to SG. Deposit RM8,000 paid; balance RM11,999 on delivery.'},
   {id: 'ks-mattress', ordered: true, name: 'Dunlopillo Richmond Signature CoolSilk Nano-G mattress, queen, 38 cm, firmness 6/10', qty: 1, price: 6196.28, cur: 'MYR', shop: 'ANZ Home Furniture (Dunlopillo), JB', type: 'Shop', date: '2026-11-22', when: 'Ordered 22 Nov; pay balance by Sat 19 Dec; delivery Tue 22 Dec', note: 'KS bed: 38 cm mattress on a 41 cm frame, top about 79 cm from the floor. RM5,699 before GST (list RM9,499). Plush top over Euro top, natural Dunlop latex + memory foam, 5-zone individual pocket springs. '+'Part of the Dunlopillo order: RM19,999 for all 3 beds incl. 9% GST, free delivery to SG. Deposit RM8,000 paid; balance RM11,999 on delivery.'},
   {id: 'ks-desk', name: 'IKEA LAGKAPTEN / ALEX desk, 120 × 60 cm', qty: 1, price: 178.9, cur: 'SGD', tag: 'maybe', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/lagkapten-alex-desk-white-stained-oak-effect-white-s89416963/', date: '2026-12-20', when: 'After move-in is fine', note: 'Typical study desk sizes; pick one on the floor plan.', alts: [
    {name: 'IKEA ALEX desk, 100 × 48 cm', price: 179, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/alex-desk-white-30473559/'},
    {name: 'IKEA LAGKAPTEN / ALEX desk, 140 × 60 cm', price: 278.8, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/lagkapten-alex-desk-white-s79521605/'},
   ]},
   {id: 'ks-chair', name: 'IKEA MARKUS office chair', qty: 1, price: 199, cur: 'SGD', tag: 'maybe', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/markus-office-chair-vissle-dark-grey-50261151/', date: '2026-12-20', when: 'With the desk', alts: [
    {name: 'SIHOO M57 mesh chair (same as KY)', price: 339, cur: 'SGD', shop: 'HipVan', type: 'Online', href: 'https://www.hipvan.com/products/sihoo-m57-ergonomic-chair-black'},
    {name: 'IKEA FLINTAN office chair', price: 69.9, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/flintan-office-chair-beige-50492203/'},
   ]},
   {id: 'ks-wardrobe', name: 'IKEA KLEPPSTAD wardrobe, 2 doors, 79 × 55 cm', qty: 1, price: 149, cur: 'SGD', tag: 'maybe', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/kleppstad-wardrobe-with-2-doors-white-10437237/', date: '2026-12-20', when: 'Only if the built-in wardrobe does not stay', alts: [
    {name: 'IKEA KLEPPSTAD wardrobe, 3 doors, 117 × 55 cm', price: 199, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/kleppstad-wardrobe-with-3-doors-white-80441759/'},
    {name: 'IKEA BRIMNES wardrobe, 2 doors, 78 × 50 cm', price: 199, cur: 'SGD', shop: 'IKEA Singapore', type: 'Shop + online', href: 'https://www.ikea.com/sg/en/p/brimnes-wardrobe-with-2-doors-white-20400479/'},
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
 // Final reno decisions sent to I-Niche (John) on 21 Nov. Codes are from the 13 Nov quote.
 // s: 'Go ahead', 'Changed', 'New', 'Removed', 'On hold', 'Asked', '3 Dec' or 'Not asked'.
 decisionsTitle: 'Final reno decisions sent to I-Niche, 21 Nov',
 decisionsNote: 'Waiting for the I-Niche revised quote (2nd quotation). Codes match the 13 Nov quote.',
 decisions: [
  {t: 'A: hacking A1, A2, A4 to A9', s: 'Go ahead', n: 'A3 (KS bedroom wardrobe removal) taken out.'},
  {t: 'Living mirror cabinet: take off the door and patch', s: 'New', n: 'Replaces D2 (new mirror door).'},
  {t: 'B: partition wall B1, B1a, B1b', s: 'Go ahead', n: 'B1a soundproofing stays at 40 kg rockwool (an upgrade was not asked).'},
  {t: 'B2: keep the living false ceiling', s: 'Go ahead', n: 'Only the old downlight holes are patched.'},
  {t: 'C1 (i) to (v): fit basins, toilets, bidet sprays, showers, accessories', s: 'Go ahead', n: 'The family buys the sanitary fittings.'},
  {t: 'D1: TV feature wall', s: 'Go ahead'},
  {t: 'D2: new living mirror door', s: 'Removed'},
  {t: 'D4: L-shaped wardrobe', s: 'Removed'},
  {t: 'D3 + D3a: platform bed and bedhead (KS bedroom)', s: 'On hold', n: 'Decide on 3 Dec. Optional line in the quote.'},
  {t: 'E2 + E2a: glass sliding door at the kitchen entrance', s: 'Changed', n: 'Instead of the bi-fold door. The family chooses the design.'},
  {t: 'E3: shower screens', s: 'Go ahead', n: 'Master bathroom as quoted. Common bathroom: half-height wall on one side with glass on top, size set on site.'},
  {t: 'E4: frosted film, master bathroom', s: 'Go ahead'},
  {t: 'Doors: move the common bathroom door to bedroom 3', s: 'Asked', n: 'Instead of the E1 new veneer door. Supply and fit a new water-resistant common bathroom door. Size the B1b frame to fit.'},
  {t: 'F1: painting', s: 'Go ahead', n: 'Asked the price for Anti-Mould Ceiling White in both bathrooms and the kitchen.'},
  {t: 'F2: vinyl (SPC) in the 3 bedrooms', s: 'Changed', n: 'With skirting, door trims and thresholds. Asked the total, price per sq ft, brand and thickness. F2 parquet polish kept as the other price.'},
  {t: 'F2a, F4, F6: skirting varnish, master bathroom floor polish, final cleaning', s: 'Go ahead'},
  {t: 'F5: half-height wall on one side, common bathroom', s: 'Go ahead', n: 'Asked about waterproofing.'},
  {t: 'Full regrouting of both bathrooms', s: 'New'},
  {t: 'G1: living room ceiling lights', s: 'Go ahead'},
  {t: 'G2 + G2a: 1 ventilation fan, common bathroom only', s: 'Changed', n: 'Was 2 fans.'},
  {t: 'G3: sockets and switches', s: '3 Dec', n: 'Mark positions and count on site.'},
 ],
 // Orders with a deposit paid (shown on the home page). Amounts in the shop's currency, incl. GST.
 // Orders: exact payments made, what is left, when it is due, and delivery steps (K, 23 Nov).
 // Amounts in the shop's currency incl. GST. est: true = date is a guess, not fixed by the shop.
 orders: [
  {id: 'dunlopillo', name: 'Dunlopillo beds and mattresses (ANZ Home Furniture, JB)', what: '3 queen storage frames + 3 mattresses (KY Carlton 30 cm, KX and KS Richmond 38 cm)', total: 19999, cur: 'MYR', href: '/research#r-beds',
   paid: [{date: '2026-11-22', amount: 8000, t: 'Deposit at the JB fair'}],
   due: [{date: '2026-12-19', amount: 11999, t: 'Full balance, at least 3 days before delivery (by Sat 19 Dec)'}],
   steps: [{date: '2026-12-22', s: 'Beds delivered', t: 'Delivery to Singapore, Tue 22 Dec: 3 frames + 3 mattresses. Check hydraulics and mattress labels before signing'}]},
  {id: 'vhaus', name: 'V Haus Living (JB), order 03460', what: 'LINO dining set + 6 chairs, KX L-shape wardrobe (custom), 2233A sofa', total: 14516.62, cur: 'MYR', href: '/research#r-vhaus',
   paid: [{date: '2026-11-22', amount: 4355, t: '30% deposit'}],
   due: [{date: null, amount: 10161.62, t: 'Balance before delivery. Ask V Haus if it is paid per delivery (wardrobe, sofa, dining set) or all before the first one'}],
   steps: [
    {date: '2026-12-08', s: 'Wardrobe measured', t: 'V Haus measures the KX L-shape wardrobe (Tue 8 Dec, after the 3 to 5 Dec hacking)'},
    {date: '2026-12-31', est: true, label: 'End of Dec', s: 'Wardrobe delivered', t: 'Wardrobe: about 1 month rush to make, delivery and install aimed at end of December'},
    {date: null, est: true, label: 'Dec?', s: 'Sofa delivered', t: 'Sofa: delivery date to confirm, maybe within December'},
    {date: '2027-01-20', est: true, label: 'Mid–end Jan', s: 'Dining set delivered', t: 'LINO dining set + 6 chairs: January stock, delivery mid to end January'},
   ]},
 ],
 // To-do list at the top of /buy, in date order. Ticks are shared (saved as t:<id>). No date = do now.
 todo: [
  {id: 'fibre', t: 'Fibre broadband: sign up 3 to 5 Dec, install a week before move-in', n: 'Pick: StarHub UltraSpeed 5Gbps Mesh S$35.55 a month (2 TP-Link HB615, one in KY room). Plain 5Gbps is S$29.55. Check the fibre point and LAN ports on 3 Dec first. See Research.', href: '/research#r-fibre'},
  {id: 'quote2', t: 'Get the I-Niche revised quote and check it', n: 'Needed before signing (28 Nov) and the management form. Use the "Check in the 2nd quotation" list on the to-buy page.', href: '#buy-qa'},
  {id: 'kitchen-door', t: 'Choose the kitchen glass sliding door design', n: 'Send it to I-Niche (E2 + E2a).'},
  {id: 'vhaus-visit', t: 'Ask V Haus on WhatsApp: sofa real size, model name and delivery date; SG delivery cost; how the balance is paid', n: 'Order 03460, deposit RM4,355 paid 22 Nov. Is the RM10,161.62 balance paid per delivery or all before the first? Also ask Jason to confirm in writing if the dining set can still be changed before the factory order.', href: '/research#r-vhaus'},
  {id: 'anz-warranty', t: 'Ask ANZ for the frame and hydraulics warranty in writing', n: 'Also check the mattress warranty is registered with Dunlopillo and valid in Singapore.', href: '/research#r-beds'},
  {id: 'bath-shops', date: '2026-11-25', t: 'Bathroom shop day (Wed): RIGEL Changi 10am, then Joo Chiat, then Geylang Road', n: 'Pick models; pay deposits only if the toilet and vanity size can still change after measuring on 3 Dec. Ask each toilet’s S-trap setting-out range.', href: '/research#r-bath-shops'},
  {id: 'black-friday', date: '2026-11-27', t: 'Black Friday: buy fridge + washer at COURTS online in one order', n: 'By 29 Nov, code 50LDA (S$50 off every S$500) or the 22% code. Re-check the TV at Electromart vs Mega (code FVJA). Aircon at Mega with 7NV0 by 30 Nov.', href: '/research#r-deals'},
  {id: 'sign', date: '2026-11-28', t: 'Sign with I-Niche and pay the 10% deposit', n: 'After the 2nd quotation is checked. Payments 10/40/40/10.'},
  {id: 'reno-form', date: '2026-11-28', t: 'Renovation form + S$1,000 deposit to La Casa management', n: 'At least 7 days before work starts. I-Niche gives the contractor details. Cash or cheque, refunded after checks.', href: '#it-contractor-mcst-renovation-deposit-refundable'},
  {id: 'aircon', date: '2026-11-30', t: 'Order the aircon with code 7NV0', n: 'Code price S$3,510 ends 30 Nov. Check the Gain City price in store first.', href: '#it-aircon-mitsubishi-starmex-system-3'},
  {id: 'keys', date: '2026-12-03', t: 'Collect the keys and do the 3 Dec checklist', href: '#buy-measure'},
  {id: 'tell-iniche', date: '2026-12-04', t: 'Tell I-Niche the 3 Dec results', n: 'Switch and socket count (G3, add a point above each basin if the mirror cabinet has a light), toilet bowl size, common bathroom wall and glass size, keep or drop the platform bed (D3 + D3a). Water inlet and power point at the kitchen counter for the LG WD518AN dispenser (already bought). Power point for the KX wardrobe LEDs (V Haus). One Cat6 cable from the DB box to KY room. A power point for a heated towel rail if the family wants one.'},
  {id: 'sp', date: '2026-12-05', t: 'SP Services: electricity and water on (from 5 Dec)', n: 'Account already applied; 5 Dec was the earliest turn-on slot. Submit the management form request beforehand.'},
  {id: 'sanitary', date: '2026-12-05', t: 'Buy the sanitary fittings', n: 'Common bathroom: RIGEL R-BC7437 vanity (ask Heritage to beat RIGEL e-store S$760), Grohe Eurosmart tap. Both: toilets, RIGEL stainless bidet sprays (no American Standard), showers, Grohe Essentials towel sets, mirror cabinets. The family supplies them; I-Niche fits them (C1). Toilet and vanity size after 3 Dec.', href: '/research#r-bathroom'},
  {id: 'switches', date: '2026-12-05', t: 'Buy switches and sockets', n: 'After the count on 3 Dec, before the electrician starts.', href: '#it-contractor-switches-sockets'},
  {id: 'vhaus-wardrobe', date: '2026-12-08', t: 'V Haus measures the KX L-shaped wardrobe (Tue 8 Dec)', n: 'After the 3 to 5 Dec hacking. Choose body and door colours and the inside layout. About 1 month rush to make, aiming for end-December delivery.', href: '#buy-pay'},
  {id: 'dunlopillo-pay', date: '2026-12-19', t: 'Pay Dunlopillo (ANZ) the full balance RM11,999', n: 'At least 3 days before the Tue 22 Dec delivery. Deposit RM8,000 paid 22 Nov. Keep the receipt.', href: '#buy-pay'},
  {id: 'beds', date: '2026-12-22', t: 'Dunlopillo beds delivered (Tue 22 Dec)', n: 'KY: Carlton 30 cm + KHJ60 headboard (PLE 007). KX: Richmond 38 cm, no headboard (Picco PC 151-14). KS: Richmond 38 cm + KHJ44 headboard (311-15). Check the hydraulics and every mattress label before signing.', href: '#buy-pay'},
 ],
 // To check on 3 Dec (keys) or after, then buy.
 measure: [
  {t: 'Beds (3 queens ordered)', n: 'Check each room fits a queen storage frame (mattress 152 × 190 cm, frame a few cm bigger) with about 60 cm to walk on one side. Tell ANZ before 22 Dec if a frame must change.'},
  {t: 'Platform bed (D3 + D3a)', n: 'KS has a Dunlopillo storage bed coming, so this is likely not needed. Confirm on site and tell I-Niche (optional line in the quote).'},
  {t: 'Switches, sockets and lights', n: 'Walk each room and mark where sockets, switches and lights go. Count them for the shopping list.'},
  {t: 'Fibre point and LAN ports', n: 'Find the fibre point (TP) and ask management if the old owner’s line is still active. Plug a laptop into each LAN port with a cable: if it gets internet from the router, the port works. A cheap LAN cable tester (about RM20) also works. Dead ports are fixed by the electrician, not the internet company.'},
  {t: 'Toilet bowls', n: 'I-Niche measures and tells us the size (the distance from wall to the floor pipe decides which toilet fits).'},
  {t: 'Common toilet', n: 'Confirm the basin size and the final half-wall size with the glass panel on top.'},
  {t: 'Main door edge', n: 'Photo it to choose the smart lock (mortise or not).'},
  {t: 'Fridge niche and basin walls', n: 'Fridge space (70 cm wide) and the walls for the mirror cabinets.'},
 ],
 // Light types, with a photo of each (photo key = image path).
 lights: [
  {name: 'Downlight', img: '/images/buy/philips-meson-5-13w-recessed-downlight-3000k-or-4000k-e758b1.webp', t: 'Flat round light set into the ceiling. Main light for each room. "3 colour" versions (Philips SceneSwitch) change warm/neutral/daylight with the normal switch.'},
  {name: 'Eyeball light', img: '/images/buy/eyeball-spotlight-recessed.webp', t: 'Small light set into the ceiling that tilts to aim. For art, the TV wall or a feature wall.'},
  {name: 'Track light', img: '/images/buy/track-or-spot-lights-for-tv-wall-art-15a956.webp', ex: true, t: 'A rail on the ceiling with spotlights that clip on and slide. Easy to move or add spots later. Good when there is no false ceiling.'},
  {name: 'Cove light', img: '/images/buy/led-cove-strip-driver-8717ec.webp', ex: true, t: 'LED strip hidden in a ceiling slot for a soft warm glow. Needs a false ceiling with a slot.'},
 ],
 // Things to check in the 2nd quotation.
 contractor: [
  {q: 'Vinyl (SPC) in the 3 bedrooms: what to check', a: 'Total price, price per sq ft, brand and thickness. Skirting, door trimming and thresholds must be included. Vinyl adds a few mm, so doors are cut at the bottom. The F2 parquet polish should still be there as the other price.'},
  {q: 'Common bathroom half-height wall (F5): waterproofing', a: 'Ask which waterproofing goes on the new wall and the floor around it, how high it goes, and if they do a water test before tiling.'},
  {q: 'Doors: moving the common bathroom door to bedroom 3', a: 'Check the price change against E1 (S$580), the brand or material of the new water-resistant bathroom door, and that the B1b frame is made to fit the moved door.'},
  {q: 'New lines to look for', a: 'Living mirror cabinet door removal and patch, full regrouting of both bathrooms, Anti-Mould Ceiling White price, the glass sliding door price, 1 fan instead of 2, and D3 + D3a as an optional line.'},
 ],
 notes: [
  'Switches and sockets: Singapore needs the SAFETY Mark on wall switches and sockets. Buying in Singapore (Schneider AvatarOn, Legrand, Panasonic) avoids problems. JB stock is cheaper but has SIRIM, so ask the electrician first.',
  'Normal switches are fine. Smart bulbs still work if the wall switch stays on. If someone switches it off, the bulb goes offline until switched on again.',
  'Built-in downlights cannot be made smart. "3 colour" downlights change colour with the normal switch instead.',
  'Wi-Fi: pick is StarHub UltraSpeed 5Gbps Mesh (2 TP-Link HB615): one at the entrance by the fibre box, one in KY room. The Linksys units are spare. Sign up 3 to 5 Dec.',
  'LAN ports: test them on 3 Dec (see the checklist). The Wi-Fi company only installs the fibre box and router. The electrician fixes the wall ports and cables.',
  'Aircon: 3 new units are budgeted above (Aircon). Order by 30 Nov for the code price.',
 ],
};

export const toSGD=(i,rate=BUY.rate)=>i.cur==='MYR'?i.price/rate:i.price;
export const lineSGD=(i,rate=BUY.rate)=>toSGD(i,rate)*(i.qty??1);
// The family's saved choices live in the shared visit_notes table, keyed b:<item id>:tag|pick|qty.
// b:<id>:off is the old "not counted" switch: it still reads as Maybe until a tag is chosen.
export const TAGS=['before','after','maybe'];
export const TAG_NAMES={before:'Before move-in',after:'After move-in',maybe:'Maybe'};
export const optionsOf=i=>[i,...(i.alts??[])];
export function buyKeys(plan=BUY){const k=new Map();for(const t of plan.todo??[])k.set(`t:${t.id}`,{kind:'off'});for(const r of plan.rooms)for(const i of r.items){k.set(`b:${i.id}:off`,{kind:'off'});k.set(`b:${i.id}:tag`,{kind:'tag'});k.set(`b:${i.id}:qty`,{kind:'qty'});if(i.alts?.length)k.set(`b:${i.id}:pick`,{kind:'pick',max:i.alts.length});}return k;}
export function validBuyValue(spec,value){if(value==='')return true;if(spec.kind==='off')return value==='1';if(spec.kind==='tag')return TAGS.includes(value);if(!/^\d{1,2}$/.test(value))return false;const n=Number(value);return spec.kind==='qty'?n>=1&&n<=99:n>=1&&n<=spec.max;}
export function choiceOf(i,v={}){const opts=optionsOf(i),p=Number(v[`b:${i.id}:pick`]),pick=Number.isInteger(p)&&p>0&&p<opts.length?p:0,q=Number(v[`b:${i.id}:qty`]),qty=Number.isInteger(q)&&q>=1&&q<=99?q:(i.qty??1);
 const saved=v[`b:${i.id}:tag`],tag=TAGS.includes(saved)?saved:v[`b:${i.id}:off`]==='1'?'maybe':(i.tag??'before');
 return {tag,off:tag==='maybe',pick,qty,opt:opts[pick]};}
export const chosenSGD=(i,v={},rate=BUY.rate)=>{const c=choiceOf(i,v);return c.off?0:toSGD(c.opt,rate)*c.qty;};
export const fullSGD=(i,v={},rate=BUY.rate)=>{const c=choiceOf(i,v);return toSGD(c.opt,rate)*c.qty;};
// before + after = total. maybe is listed apart and not in total.
export function buyTotals(plan=BUY,v={}){
 const isEst=i=>{const c=choiceOf(i,v);return !!(c.opt.est??(c.pick===0&&i.est));};
 const rooms=plan.rooms.map(r=>{const by=t=>r.items.filter(i=>choiceOf(i,v).tag===t),sum=list=>list.reduce((s,i)=>s+fullSGD(i,v,plan.rate),0),on=r.items.filter(i=>!choiceOf(i,v).off),maybe=by('maybe');
  return {id:r.id,name:r.name,total:sum(on),before:sum(by('before')),after:sum(by('after')),est:sum(on.filter(isEst)),removed:maybe.length,offTotal:sum(maybe)};});
 const sum=k=>rooms.reduce((s,r)=>s+r[k],0);
 return {rooms,total:sum('total'),before:sum('before'),after:sum('after'),est:sum('est'),removed:sum('removed'),offTotal:sum('offTotal')};
}
export function buyCSV(plan=BUY,v={}){
 const q=x=>{let s=String(x??'');if(/^[=+\-@]/.test(s)&&!/^-?\d/.test(s))s="'"+s;return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
 const rows=[['Room','Item','Model','Qty','Unit price','Currency','Line total (S$)','Pay','Choice','Estimate?','Shop','Where','Buy date','When','Link','Note']];
 for(const r of plan.rooms)for(const i of r.items){const c=choiceOf(i,v),o=c.opt;rows.push([r.name,o.name,o.model??'',c.qty,o.price,o.cur,fullSGD(i,v,plan.rate).toFixed(2),TAG_NAMES[c.tag],c.pick?`Option ${c.pick}`:'Recommended',(o.est??(c.pick===0&&i.est))?'Yes':'',o.shop??'',o.type??'',i.date??'',i.when??'',o.href??'',o.note??(c.pick?'':i.note??'')]);}
 const t=buyTotals(plan,v);rows.push([]);rows.push(['Before move-in','','','','','',t.before.toFixed(2)]);rows.push(['After move-in','','','','','',t.after.toFixed(2)]);rows.push(['Total (before + after)','','','','','',t.total.toFixed(2)]);rows.push(['Maybe (not in total)','','','','','',t.offTotal.toFixed(2)]);
 return rows.map(r=>r.map(q).join(',')).join('\n')+'\n';
}
