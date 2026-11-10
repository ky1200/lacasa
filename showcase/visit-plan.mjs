// 11 Nov site visit: what to measure, check, ask and get quoted, room by room in walking order.
// Every measurement uses the same letters as its drawing: L = side to side, W = front to back,
// H = height, T = thickness, D = a single distance, R = wall to toilet drain centre. All in cm.
// "need" values come from the shortlisted products on the site, so a measurement can be ticked off on the spot.
// "space" copies a measured value onto an item page (decision id + space field).

// Example photos to show the contractor ("this is what we want here"). One photo per example.
// Item entries show one photo per shortlisted model from that item page.
const Q='https://qanvast.com/sg/articles/all-about-ceiling-lighting-7-types-you-can-install-in-your-home-2971';
export const REFS={
 lock:{title:'Aqara U400 smart lock',note:'Main door lock. Passion Home sells it with installation and the M100 hub, S$649.',img:'/images/entrance/digital-door-lock-u400-official.webp',credit:'Aqara',source:'https://us.aqara.com/products/smart-lock-u400',link:{label:'Passion Home listing',url:'https://passionhome.sg/product/aqara-smart-door-lock-u400/'}},
 mesh:{title:'Retractable insect mesh',note:'Pulls across the doorway and rolls back to the side when not needed.',img:'/images/visit/mesh-retractable-door.webp',credit:'Appeal Shading',source:'https://www.appealshading.com/retractable-insect-screens/insect-screens-doors/'},
 downlights:{title:'Downlights',note:'Small round lights set into the ceiling, spread evenly over the room.',img:'/images/visit/downlights-living.webp',credit:'Qanvast · Punggol Drive by Metier Planner',source:Q},
 cove:{title:'LED cove lighting',note:'Hidden LED strip inside a raised ceiling edge; the light washes the ceiling, no strip visible.',img:'/images/visit/cove-living.webp',credit:'Qanvast · West Plains @ Bukit Batok by Flo Design',source:Q},
 tv:{title:'TV on the wall, no cables showing',note:'Cables run inside the wall down to a low floating console.',img:'/images/visit/tv-wall-hidden-cables.webp',credit:'Qanvast · The Jade Pavilion by Desir Design',source:'https://qanvast.com/my/articles/make-your-living-room-pop-with-these-tv-wall-designs-3590'},
 slideSwing:{title:'Slide-and-swing glass door',note:'Panels slide to the side and can also swing fully open for moving big items.',img:'/images/visit/slide-swing-door.webp',credit:'Chiew Yeong Aluminium',source:'https://www.chiewyeongaluminium.com/showproducts/productid/6315992/slide-swing-door/'},
 coveBed:{title:'Soft hidden ceiling light',note:'Warm LED strip hidden in a ceiling edge, with the fan in the middle.',img:'/images/visit/cove-bedroom.webp',credit:'Qanvast · Yishun Avenue 6 by Design of SCHATZ',source:Q},
 door:{title:'Solid-core laminate door',note:'Plain flush door with seals around the frame to cut noise.',img:'/images/visit/laminate-bedroom-door.webp',credit:'Door Lab',source:'https://www.atome.sg/blog/door-lab-bedroom-doors-atome'},
 vinyl:{title:'Vinyl plank floor over parquet',note:'Wood-look planks laid over the existing floor; low step at the doorway.',img:'/images/visit/vinyl-plank-floor.webp',credit:'Qanvast · Compassvale Drive by Starry Homestead',source:'https://qanvast.com/sg/articles/where-to-buy-vinyl-flooring-plus-10-key-questions-answered-2481'},
 curtains:{title:'Floor-length blackout curtains',note:'Full blackout, on a ceiling track running past both sides of the window.',img:'/images/visit/blackout-curtains.webp',credit:'IKEA MAJGULL',source:'https://www.ikea.com/sg/en/p/majgull-block-out-curtains-1-pair-grey-with-heading-tape-10417814/'},
};
const R=(...k)=>k.map(x=>REFS[x]);

export const VISIT = {
 date: '2026-11-11',
 title: '11 Nov site visit',
 bring: ['5 m measuring tape (a laser measure is a bonus)', 'Charged phone for photos', 'This page open on two phones', 'Pen and the printed floor plan, if there is one'],
 howTo: ['Measure in cm, wall to wall, at floor level unless the drawing says otherwise.', 'Measure twice; type the smaller number.', 'Take a photo of each spot and each thing to remove.', 'Ticks and numbers save straight away and show on everyone’s phone.'],
 rooms: [
 {id:'entrance', name:'Entrance & shelter', minutes:10,
  show:[...R('lock','mesh'),{item:'EN01'}],
  measure:[
   {id:'main-door', title:'Main door (for the digital lock)', shape:'door', fields:{L:'Door width',H:'Door height',T:'Door thickness'},
    need:{T:{min:3.5,max:5.5}}, needText:'Aqara U400 / U100 fit doors 3.5–5.5 cm thick (type 4.5 for 45 mm).', item:'entrance/digital-door-lock'},
   {id:'gate', title:'Gate opening (for the insect mesh)', shape:'wall', fields:{L:'Opening width',H:'Opening height'}, needText:'For the retractable sliding mesh quote.'},
   {id:'shoe-spot', title:'Shoe rack spot', shape:'floor', fields:{L:'Length along the wall',W:'Depth from the wall'}, needText:'Slim rack; the door must still open fully.'},
   {id:'shelter', title:'Household shelter (for metal racks)', shape:'box', fields:{L:'Inside width',W:'Inside depth',H:'Inside height'}, needText:'Freestanding racks only; keep the door and vents clear.'},
  ],
  check:['Main door: wooden, any fire-rating label on the side?','Photo of the metal gate and its fixings','Light at the entrance works'],
  ask:['Can the metal gate come off (management OK)? Price to remove and patch.','Price to fit the digital lock; any door cut-out work?','Retractable sliding mesh: price, track and lock clearance.'],
  quote:[['EN01','Digital lock fitting',800],['EN02','Retractable insect mesh',600],['R07','Remove metal gate (if allowed)',0]]},

 {id:'living', name:'Living room', minutes:12,
  show:[...R('downlights','cove','tv'),{item:'LVF01',title:'Living lights shortlist'}],
  measure:[
   {id:'living-floor', title:'Living area', shape:'floor', fields:{L:'Length',W:'Width'}, needText:'Recorded before as about 295 × 388 cm.', space:{decisions:['LVF01','LV01','LV01-SIZE','LV04','LV02','LV03','LV08'],map:{width:'L',depth:'W'}}},
   {id:'tv-wall', title:'TV wall', shape:'wall', fields:{L:'Wall width',H:'Floor to ceiling'}, need:{L:{min:189}}, needText:'An 85-inch TV is 188–189 cm wide.', item:'living/tv-size-and-mounting'},
   {id:'sofa-wall', title:'Sofa area (L-shaped, 4 seats)', shape:'floor', fields:{L:'Long side',W:'Short side'}, needText:'For the JB sofa shop visit.'},
   {id:'mirror-unit', title:'Mirrored storage unit to remove', shape:'box', fields:{L:'Width',W:'Depth',H:'Height'}, needText:'About 200 cm wide × 20 cm deep before.'},
  ],
  check:['TV wall: solid concrete or board? (knock test)','Count sockets near the TV and the sofa','Ceiling: keep as it is? Where can downlights / hidden lights go?','Photo of the mirrored unit'],
  ask:['Lighting: price for downlights and hidden ceiling strip, with dimming.','TV bracket on this wall: is it strong enough? Hidden cable route to the console?','Sockets: 8 at the TV, 4 by the sofa (count existing ones too).','Remove the mirrored unit and patch the wall: price.'],
  quote:[['LVF01','Living lighting',1200],['LVF02','TV bracket and mounting',250]]},

 {id:'dining', name:'Dining', minutes:8,
  show:[{item:'DNF01'}],
  measure:[
   {id:'dining-floor', title:'Dining area', shape:'floor', fields:{L:'Length',W:'Width'}, need:{L:{min:240},W:{min:230}}, pick:['DN01','V Haus LINO set'], needText:'LINO table 160 × 90 cm needs about 240 × 230 cm with chairs pulled out.', item:'dining/table-and-chairs', space:{decisions:['DN01','DNF01'],map:{width:'L',depth:'W'}}},
   {id:'dining-ceiling', title:'Ceiling height at the light point', shape:'height', fields:{H:'Floor to ceiling'}, need:{H:{min:240}}, needText:'Rule of thumb: fan blades at least 2.1 m off the floor, so about 2.4 m ceiling.', item:'dining/fan-with-light'},
   {id:'dining-fan-gap', title:'Light point to the nearest wall', shape:'gap', fields:{D:'Distance'}, need:{D:{min:80}}, needText:'Rule of thumb for a 100 cm fan: half the fan (50 cm) + 30 cm. Installer confirms.'},
  ],
  check:['Socket near the table for chargers?','Existing ceiling light point position (the fan goes here)'],
  ask:['Swap the dining light for a fan with light: price, and is the ceiling strong enough?','Add a double socket near the table for chargers: price.'],
  quote:[['DNF01','Dining fan fitting',350]]},

 {id:'kitchen', name:'Kitchen', minutes:10,
  show:[{item:'YA05'},{item:'KT-WATER'}],
  measure:[
   {id:'fridge-space', title:'Fridge space', shape:'box', fields:{L:'Width',W:'Depth',H:'Height'}, need:{L:{min:70},W:{min:72},H:{min:180}}, needText:'Widest fridge on the list is 70 cm; tallest 179 cm. Leave a little air gap.', item:'kitchen/fridge', space:{decisions:['KT01'],map:{width:'L',depth:'W'}}},
   {id:'counter', title:'Counter for small appliances', shape:'floor', fields:{L:'Free counter length',W:'Counter depth'}, needText:'Microwave, kettle, rice cooker, air fryer, portable cooker, water dispenser.'},
   {id:'dispenser-spot', title:'Water dispenser spot on the counter', shape:'box', fields:{L:'Width',W:'Depth',H:'Height up to the wall cabinet'}, need:{L:{min:26},W:{min:49},H:{min:44}}, needText:'Toshiba / Midea dispensers are 26 × 49 × 44 cm.', item:'kitchen/water-dispenser-tap'},
   {id:'kitchen-fan-spot', title:'Kitchen fan spot', shape:'height', fields:{H:'Floor to ceiling'}, needText:'Kitchen fans hang about 50–63 cm down; keep clear of cabinet doors and the hob.', item:'kitchen/fan'},
  ],
  check:['Gas hob lights on every burner','Hood and sink work, no leaks under the sink','Count counter sockets (want 3 doubles)'],
  ask:['Air fryer + portable cooker together: does the wiring need a new circuit?','Gas hob service: who and price?','Kitchen fan: ceiling or wall, and price to fit.'],
  quote:[['YA05','Kitchen fan fitting',350]]},

 {id:'yard', name:'Yard & laundry', minutes:12,
  show:[...R('slideSwing'),{item:'YA04'}],
  measure:[
   {id:'rack', title:'Steigen Mini rack ceiling area', shape:'ceiling', fields:{L:'Ceiling length (along the yard)',W:'Ceiling width (clear of pipes/cabinets)',H:'Floor to ceiling'},
    pick:['YA04','Steigen Solar Mini'], need:{L:{min:110,max:144},W:{min:60},H:{max:280}}, needText:'Steigen Mini: ceiling length 110–144 cm, 60 cm clear width; free install up to 2.8 m high.', item:'yard/automated-laundry-rack', space:{decisions:['YA04'],map:{width:'L'}}},
   {id:'washer-space', title:'Washing machine space', shape:'box', fields:{L:'Width',W:'Depth',H:'Height (to rack or cabinet)'}, need:{L:{min:60},W:{min:66},H:{min:85}}, needText:'Shortlisted washers are up to 60 × 66 × 85 cm; a dryer on top later needs about 170 cm.', item:'yard/washing-machine', space:{decisions:['YA01'],map:{width:'L',depth:'W'}}},
   {id:'yard-door', title:'Kitchen–yard door opening', shape:'wall', fields:{L:'Opening width',H:'Opening height'}, needText:'For the slide-and-swing glass door quote (about 100 cm before).'},
   {id:'dock', title:'Robot vacuum dock spot', shape:'box', fields:{L:'Width',W:'Depth',H:'Height above'}, need:{L:{min:42},W:{min:46},H:{min:59}}, needText:'Dreame docks are up to 42 × 46 × 59 cm. Keep it dry and level.', item:'whole-home/robot-vacuum'},
  ],
  check:['Ceiling above the rack spot is concrete (not board)','Washer taps and floor drain work','Socket near the ceiling for the rack (Solar dryer)','Socket for the robot dock','Photo of the yard cabinet to remove'],
  ask:['Remove only the needed yard cabinet part: price.','Slide-and-swing glass door: price and lead time.','Box up pipes only if 60 cm width stays free for the rack.','Sockets for washer, rack, fan and dock: count and price.'],
  steigen:'Ask Steigen: the Mini is listed for washers up to 7 kg, and the shortlisted washers are 9 kg and up. Is the Mini still fine, or is Mega needed (ceiling length 145 cm+)?',
  quote:[['YA06','Yard glass door',850],['R06','Remove yard cabinet part',0]]},

 {id:'common-bath', name:'Common bathroom', minutes:12,
  show:[{item:'CB-WC'},{item:'CB-VAN'},{item:'CB-TAP'},{item:'CB-MIR'},{item:'CB-SHW'},{item:'CB-SCR'},{item:'CB07'}],
  measure:[
   {id:'cb-toilet', title:'Toilet drain position', shape:'toilet', fields:{R:'Back wall to drain centre'}, needText:'The key number for choosing a toilet. Ask the contractor which models fit.', item:'common-bath/toilet'},
   {id:'cb-toilet-space', title:'Toilet space', shape:'floor', fields:{L:'Side to side',W:'Back wall to front'}, need:{L:{min:70},W:{min:72}}, needText:'Toilets on the list are up to 39 cm wide and 72 cm long; leave room for knees.'},
   {id:'cb-basin-wall', title:'Basin wall', shape:'wall', fields:{L:'Wall width for the cabinet',H:'Basin top height'}, need:{L:{min:60}}, needText:'Cabinets on the list are 44–69 cm wide.', item:'common-bath/basin-cabinet'},
   {id:'cb-mirror', title:'Mirror space above the basin', shape:'wall', fields:{L:'Width',H:'Height (basin to ceiling or tiles end)'}, need:{L:{min:50},H:{min:75}}, needText:'Mirror cabinets on the list: 50–80 cm wide, 75–95 cm tall.', item:'common-bath/mirror-cabinet'},
   {id:'cb-shower', title:'Shower area (for the glass screen)', shape:'box', fields:{L:'Opening width',W:'Shower depth',H:'Height for the screen'}, needText:'Swing door needs room to open outward; sliding needs a wide opening.', item:'common-bath/shower-screen'},
   {id:'cb-window', title:'Window (for the exhaust fan)', shape:'wall', fields:{L:'Window width',H:'Window height'}, need:{L:{min:30},H:{min:30}}, needText:'KDK window fans are 21–29 cm across.', item:'common-bath/ventilation-fan'},
  ],
  check:['Water heater type (tank or instant) and size — photo the label','Leaks under the basin or toilet','Floor drains flow, tiles not loose','Is there a bidet spray point?'],
  ask:['Which shortlisted toilets fit this drain position?','Will the heater handle a rain shower?','Window fan panel: needs management OK?','Price each item separately: toilet, basin cabinet, tap, mirror, shower, screen, fan, light, sealing.'],
  quote:[['CB01','Toilet',1100],['CB02','Basin cabinet',800],['CB03','Basin tap',180],['CB04','Mirror cabinet',450],['CB05','Shower set',850],['CB06','Shower screen',800],['CB07','Window exhaust fan',450],['CB08','Ceiling light',100],['CB09','Sealing and making good',200]]},

 {id:'master-bath', name:'Master bathroom', minutes:8,
  show:[{item:'MB-PKG'}],
  measure:[
   {id:'mb-toilet', title:'Toilet drain position', shape:'toilet', fields:{R:'Back wall to drain centre'}, needText:'Same check as the common bathroom.', item:'master-bath/fittings'},
   {id:'mb-toilet-space', title:'Toilet space', shape:'floor', fields:{L:'Side to side',W:'Back wall to front'}, need:{L:{min:70},W:{min:75}}, needText:'Master-set toilets are up to 40 cm wide and 75 cm long.'},
  ],
  check:['Water heater type and label photo','Leaks, drains and tiles','KX can reach this bathroom without passing through KY’s room'],
  ask:['Which shortlisted toilets fit this drain?','Shower set swap: price; will the heater handle a rain shower?'],
  quote:[['MB01','Toilet',1100],['MB02','Shower set',850]]},

 {id:'ky-room', name:'KY’s room', minutes:15,
  show:[...R('coveBed','door','vinyl'),{item:'KYF05'},{item:'KYF03'}],
  measure:[
   {id:'ky-floor', title:'Room size', shape:'floor', fields:{L:'Length',W:'Width'}, need:{W:{min:259}}, needText:'Bed 108 cm + desk 80 cm + chair 71 cm across = 259 cm.', space:{decisions:['KYF03'],map:{width:'W'}}},
   {id:'ky-bed', title:'Bed spot', shape:'floor', fields:{L:'Length',W:'Width'}, need:{L:{min:199},W:{min:108}}, needText:'Storage bed 108 × 199 cm; the lid lifts up, so keep the top clear.', item:'ky-room/bed-frame'},
   {id:'ky-desk-wall', title:'Desk wall (solid wall preferred)', shape:'wall', fields:{L:'Wall length',H:'Floor to ceiling'}, need:{L:{min:177}}, needText:'Desk is 177 × 80 cm; three screens are about 190 cm wide.'},
   {id:'ky-ceiling', title:'Ceiling height (fan)', shape:'height', fields:{H:'Floor to ceiling'}, need:{H:{min:240}}, needText:'Rule of thumb: about 2.4 m for a ceiling fan.', item:'ky-room/fan-with-light'},
   {id:'ky-window', title:'Window / bay', shape:'box', fields:{L:'Width',W:'Bay depth',H:'Height'}, needText:'For curtains and a bay cushion later.'},
   {id:'ky-door', title:'New door opening', shape:'door', fields:{L:'Width',H:'Height',T:'Wall thickness'}, needText:'About 92 cm before; must not block the 100 × 100 cm corner space.'},
   {id:'ky-wardrobe', title:'Built-in wardrobe to remove', shape:'box', fields:{L:'Width',W:'Depth',H:'Height'}, needText:'About 250 × 53 cm before.'},
  ],
  check:['Floor (parquet): loose boards, damp or uneven spots','Aircon: cools, drains, any noise','Ethernet point works (bring a laptop if possible)','Photo of the wardrobe and the window'],
  ask:['L-shaped soundproof wall between KY and KX: build-up, thickness and price.','Solid-core door with seals: price.','Move the aircon about 100 cm left: possible? price?','Reinforce the wall for a TV / pegboard behind the desk.','Desk sockets (6) and a bedside double socket.'],
  quote:[['GW03','L-shaped wall KY/KX',3200],['KYF01','Solid door',1200],['KYF02','Vinyl floor',650],['KYF03','Fan with light',500],['KYF04','Aircon service and move',900],['KYF05','Soft ceiling light',350]]},

 {id:'kx-room', name:'KX’s room', minutes:10,
  show:[...R('door','vinyl','curtains'),{item:'KXF04'},{item:'KXF03'}],
  measure:[
   {id:'kx-floor', title:'Room size', shape:'floor', fields:{L:'Length',W:'Width'}, needText:'Super single bed (about 110 × 200 cm with frame) + vanity desk.'},
   {id:'kx-window', title:'Window (blackout curtains)', shape:'wall', fields:{L:'Window width',H:'Window height'}, needText:'Curtain track runs about 15 cm past each side.', item:'kx-room/blackout-curtains'},
   {id:'kx-vanity-wall', title:'Vanity desk wall', shape:'wall', fields:{L:'Wall length',H:'Floor to ceiling'}, needText:'Desk + lighted mirror + 4 sockets.'},
   {id:'kx-ceiling', title:'Ceiling height (fan)', shape:'height', fields:{H:'Floor to ceiling'}, need:{H:{min:240}}, item:'kx-room/fan-with-light'},
   {id:'kx-door', title:'New door opening', shape:'door', fields:{L:'Width',H:'Height',T:'Wall thickness'}, needText:'Door must keep the route to the master bathroom open.'},
  ],
  check:['Photo of the red cabinet, desk and shelves to remove','Floor condition (parquet)','Route to the master bathroom stays clear'],
  ask:['Remove the cabinet, desk and shelves and patch: price.','Solid-core door with seals: price.','Vanity area: 4 sockets + mirror light supply.','Blackout curtains and track: price.'],
  quote:[['KXF01','Solid door',1200],['KXF02','Vinyl floor',750],['KXF03','Fan with light',400],['KXF04','Warm hidden light',350],['KXF05','Blackout curtains',450]]},

 {id:'ks-room', name:'KS’s room', minutes:8,
  show:[...R('vinyl')],
  measure:[
   {id:'ks-floor', item:'ks-room/bed-frame', title:'Room size', shape:'floor', fields:{L:'Length',W:'Width'}, need:{L:{min:265},W:{min:220}}, needText:'Queen bed about 160 × 205 cm with frame + 60 cm walking space on two sides.'},
   {id:'ks-window', title:'Window (curtains)', shape:'wall', fields:{L:'Window width',H:'Window height'}},
   {id:'ks-desk-wall', title:'PC desk wall', shape:'wall', fields:{L:'Wall length',H:'Floor to ceiling'}, needText:'Desk + one monitor; 6 sockets at the desk.'},
  ],
  check:['Existing door, fan and light work (they stay)','Floor condition (parquet)','Curtains good enough to keep?'],
  ask:['Desk sockets (6) and bedside sockets for a queen bed.','Replace the light only if it is not working: price.'],
  quote:[['KSF01','Vinyl floor',600],['KSF02','Light (only if needed)',150]]},

 {id:'whole-home', name:'Whole home (with the contractor)', minutes:15,
  show:[{item:'EL-SW'}],
  measure:[],
  check:['Electrical box (DB): photo of the labels','Smart switches: is there a neutral wire at the switch? (needed for Aqara H1)','Fibre point / ISP box location','Which rooms and ceilings need painting'],
  ask:['Vinyl (SPC) over parquet in the 3 bedrooms: written OK on the base, price per sq ft, threshold height.','Sockets and switches: count existing vs new; licensed electrician’s name.','Network: test the existing LAN points; new cable only where needed.','Painting: which rooms, colours, ceilings.','Start after keys on 3 Dec; how many weeks? Management form and S$1,000 deposit.','Quote format: by item ID, material vs labour, GST, what is not included, payment stages, warranty.'],
  quote:[['GW01','Management paperwork and protection',500],['GW02','Removals, disposal, patching',2000],['GW04','Electrical: sockets, switches, testing',3000],['GW05','Network cabling',1500],['GW06','Painting',1850],['GW07','Final cleaning',500]]},
 ],
 target: 30000, reserve: 3000,
};

export function visitKeys(plan=VISIT){
 const keys=new Set();
 for(const r of plan.rooms){
  for(const m of r.measure)for(const f of Object.keys(m.fields))keys.add(`m:${m.id}:${f}`);
  for(const m of r.measure)keys.add(`ok:${m.id}`);
  r.check.forEach((_,i)=>keys.add(`c:${r.id}:${i}`));
  r.ask.forEach((_,i)=>keys.add(`a:${r.id}:${i}`));
  if(r.steigen)keys.add(`a:${r.id}:steigen`);
  for(const [id] of r.quote)keys.add(`q:${id}`);
  keys.add(`n:${r.id}`);
 }
 return keys;
}
