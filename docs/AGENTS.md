# LaCasa Showcase — rules for every task

## Current access — K changed this on 23 October 2026

K explicitly requested anyone-with-the-link access with a name selector, plus a read-only Claude audit view. Keep the existing Site public. Family visitors choose KY, KX or KS; this is an honor system. No LACASA_PEOPLE setting is needed. Admin writes/exports still require the trusted Site owner identity from the platform, matched against OWNER_SITE_USER_ID. Claude uses /audit without joining the three-person voting group; audit samples are read only and never affect D1 or totals. These instructions override the former private/email-mapped access rules below and in the backbone. Do not contact Claude or send invitations unless K explicitly asks.


Read before changing anything: this file, `STATE.md`, `LaCasa_Showcase_Backbone_v3.md` (the spec), `lacasa.json`, and `LaCasa_Research_Standards.md` when research is involved.

K talks to you in plain words. **Never ask K for codes or IDs, and never show them in replies.** Refer to things by plain names ("the fridge", "option Beta", "living room lights").

## Item workflow — K's instructions, 29 October 2026

K starts a fresh chat per item from a phone through Sites → LaCasa → Edit and talks normally. Read this file and LaCasa_Research_Standards.md. Name the current step in each chat update: **1 Explain**, **2 Narrow**, **3 Build**, **4 Visualise**. No fixed command, card, code or ID is required from K. This workflow takes precedence over the old Find/Deep dive command interface; research evidence standards still apply.

1. **Explain.** Explain the useful types/approaches, new technology worth having, and features not worth paying for. Ask at most three questions together, only when answers affect the choice. Use known home context and existing budgets. Research real stock, established brands, reliability, local support and owner reviews; stay within budget; prioritise Singapore and include JB only where worthwhile. Do not build a model comparison yet.
2. **Narrow.** After the answers, shortlist two or three real in-stock models. Show price, seller, stock/date and a one-line reason each. Set the existing item to Researching (`status: "draft"`), retaining its identity, previous options/votes and history. Candidate names may be shown while research continues. Publish this status update. Never silently discard a requested feature.
3. **Build — only after K says "go" or explicitly asks to add/build the supplied content.** Find sharp official product images at least 1000 px on the long side, with small source links. Never upscale a low-resolution picture. Add exact shop links, price/stock/date checked, every content field, a short compare table and one useful review video per model. Videos use a local thumbnail first, then a youtube-nocookie iframe only after a tap. A related model or brand demonstration must be labelled; report an unavailable exact review. Set Ready to vote (`status: "voting"`) only after the publishing gate below passes for every option, run tests and publish. Reply with the page link and a three-line summary. This site's explicit rework request authorises its implementation without another "go".
4. **Visualise — only where appearance matters.** Lighting, TV wall, sofa, dining and bathroom: give one ready-to-paste image prompt and specify which room photo K should upload in a separate chat. When K returns an image such as "picture for option B", attach it to that named option and publish. These returned room visualisations are labelled Concept, separate from official Product photos. Do not present concepts as actual product photos.

**Approach before model.** When choices have materially different approaches (for example washer only / washer + dryer now / washer now, dryer later), create an approach decision first using the same voting rules. Add a separate linked model decision after that approach is decided. Keep all IDs and existing votes; never reuse a product ID for another model.

## Publishing gate — audit round 2, 29 October 2026

An item only becomes **Ready to vote** when EVERY option has:
- Verified ready or low stock on an eligible exact-model seller page, with source and checked SGT date; a generic cart button is insufficient.
- At least one first-hand owner report for that exact model, or an explicit stated reason why none exists. Keep longer-term evidence limits clear.
- A video for the exact model, or a visibly labelled near-model video; do not imply regional equivalence. Use a real video thumbnail, a tap-loaded privacy-enhanced youtube-nocookie player, and no outbound YouTube links. The same-site video document must provide a valid origin/referrer for mobile playback.

Every brand K mentions for an item must be compared or explicitly excluded with a sourced one-line reason. Record `requiredBrands`, `brandReview` and each option's `publication` evidence. If any check is missing, set Researching and state missing checks in chat only; the page shows only Researching. Card import alone cannot publish a ready item; `readinessMissing` must pass. Existing product IDs, historical data and votes must be preserved. For door locks, uncertain fire-door compliance, door alterations or hub costs must never be represented as a verified all-in price; keep Researching until the required verification is available.

## Product-page presentation

- Neutral information for a first-time viewer. No "you", "we wanted", "as requested", personalised selling language, hype or filler in product content. The requested name chooser retains its functional heading.
- Product page order: clean photos → 10-second answer → option cards (name, headline, price, numerical highlights, Pick) → one expandable section per product labelled Full specs, shops & video. Researching items stay visible with a large label. Status sequence: Researching → Ready to vote → Decided → Locked. Ties and overdue actions remain governed by section 2 of the backbone.
- Compare: photo, name, price, Pick and model selectors in a sticky header; two columns on phones, three on wider screens. Group facts into Size & fit, Performance, Features, Price & stock, Running costs, Warranty & support, in that order. Purchase prices/stock belong in Price & stock; consumables and energy remain in Running costs. No invented measurements or ratings. Missing values are Not stated; No is distinct from unknown. Show differences only must work for the currently visible models.
- Headlines at most eight words; comparison cells at most six words. Keep research workings in internal data and chat; show shopper facts only. Use consistent cm, kg, dB, kWh and S$ units across a row.
- Icon/number highlights come only from supplied or verified facts. Distinguish claimed runtime from measured results. Tell K about conflicting documents in chat; do not display research disagreements on the site.
- To-scale sketches use explicit `space` and model `footprint` dimensions in cm, label gaps, and state Rough measurement, final measure 11 Nov until measured values arrive. Current appliance footprints are references, not measured cavity sizes. Change `space.measured` and redraw when K sends measurements. No fit claim without product dimensions, clearances and a measured opening.
- Retain original imported facts, IDs, prices, sources, options, historical images and votes. A neutral `display`, `table` or `tableSpecs` presentation layer may shorten wording without changing the recorded evidence. Old images may remain in source history but only eligible sharp official images are displayed as Product photos.

## Editor playbook — what K sends and what you do

Finish every request with a 3-line reply: what changed, the item's page link, and anything still missing. In Explain, ask at most three useful questions together; later ask only for information that blocks safe progress.

**1. Photos + a WEBSITE CARD** (the normal case)
- Match ITEM and ROOM to an existing item by name, allowing small wording differences ("fridge" = "Fridge"). If nothing matches, create a new item in that room.
- Fill the item from the card exactly as backbone 5.7 says. Preserve the card's facts; use concise neutral presentation copy without changing claims. Do not silently refresh prices or add claims.
- Pictures: attach them to options in the order sent (first picture(s) → option A, then B, then C), unless K says otherwise ("the last two are Beta"). If K sends 1 picture per option, that's one each. If the count doesn't split evenly and K didn't say, ask which pictures go with which option.
- Keep Researching until the publishing gate passes for every option; 2+ options alone do not permit voting. Publish.

**2. Photos + model names, "research and add"** (small items)
- Do a **Quick** research per `LaCasa_Research_Standards.md`, using K's budget (ask once if none was given and the item has no rough budget).
- Fill the item from your WEBSITE CARD. Show K the 10-second answer in your reply. Publish.

**3. Current photos for an area** ("photos of the living room now")
- Add them as that area's current photos, in order. Publish.

**4. Price or stock change** ("Beta fridge is now S$1,099 at Courts")
- Update that option's price and offer with today's date. Publish.

**5. Contractor quote** ("Contractor: lighting S$1,350, laundry rack S$1,050 …")
- For each line, add or update an option priced at that amount with `paidVia: "contractor"`, labelled "Contractor quote". Match items by name; list any lines you couldn't match. Publish.

**6. New, renamed, moved or removed items**
- Do it. Removing an item or option that already has votes needs K's "yes" first; tell K how many votes it has.

**7. "What's left?"**
- Reply with the items still in draft, grouped by deadline (🔴 first), and who still hasn't voted on what. No codes.

## Always
- Use direct, generic headings and short instructions. Avoid slogans or sentimental copy. Family progress uses compact bars, completed/remaining counts and an explicit not-ready state for items still awaiting options.
- Display prices without literal curly brackets. Label budget estimates "rough" (K’s audit round 2 override). Actual model options determine open ranges; retain requested rough allowances as budget notes. Unknown item prices remain Price TBC; all-unpriced groups never become S$0. Home and the default Shopping list use the same live before-move-in totals.
- Follow the backbone: voting rules (section 2), list maths (3), screens (4), content format (5), data and security (6).
- Keep the existing Site. Never create a second Site or a new project for LaCasa.
- Content changes = edit `lacasa.json` (and `public/images/`) only. Keep every existing internal ID; create new ones yourself for new items and options.
- Images: convert to WebP, max 1600 px long edge, about 300 KB, and strip all metadata (including GPS) before saving.
- Run the tests in section 7 after every change; fix failures before publishing.
- Update `STATE.md` at the end of every task: date, what changed, tests run, version/URL, anything not verified.
- Publish to the same audience it already has.
- Say plainly what you could not build, find or verify.

## Never
- Change the current public audience or invite anyone without K’s explicit instruction.
- Put emails, name-to-email mappings or secrets in the code, `lacasa.json` or `STATE.md` (they live in the `LACASA_PEOPLE` Site setting).
- Grant admin access from a selected name, cookie, body or query. Admin access requires the trusted platform user header and the configured Site owner. Family names are deliberately self-selected under K’s current instructions.
- Send anyone's picks or scores before all three have voted on that item.
- Invent products, model numbers, prices, stock, reviews, ratings or images. Unknown = null or "Not stated".
- Show samples in KX/KS normal flows or count them in totals. They are allowed for KY in sample mode and in the explicitly requested read-only Claude audit view.
- Reuse an option's ID for a different product, or delete votes except through the rules in the backbone.
- Show internal IDs on any page.
- Add features from the "Out of scope" list without being asked.

## Family-first wording — 30 October 2026 (overrides earlier presentation rules)

Two layers: research methods, gaps, confidence, conflicting documents, unverified claims and source disagreements belong in chat to K and internal records only, never in rendered pages or public client/API data. WEBSITE CARD values are shopper wording, not research notes. Preserve internal research and original data; never turn missing information into a positive claim.

Every word must make sense to a first-time shopper in five seconds. Delete rows that do not help choose. Explain essential technical terms in two or three plain words. Use Good at, Downsides, Best for, Owner reviews (Mostly good / Mixed / Few yet), Price, Price with delivery, In stock, Last stock: model being replaced, Battery life, Charge time, Noise, Works with, Fits our space / Fits our door (Yes / Tight / Check on 11 Nov), Warranty. Do not display Benefits, Limitations, Reliability evidence, Claimed endurance, Observed/Collected/Published price, Main connection, Model status, Ready stock verified or research-confidence language.

One expandable section per product: Full specs, shops & video. No generic More buttons. Also considered is a visible line with each brand's factual reason in at most five words; research-based exclusion concerns go in chat. Use labelled text chips rather than symbol-only product icons. Separate products with spacing and a thin divider; section titles bold. Votes show count and participation only: Votes: 1 of 3 in · KY ✓ KX – KS –, then Results show when all 3 have voted. Bedroom votes use the actual required count. Owner controls are visible only to the authenticated owner; footer contains only Choose another name.

Ready to vote still requires every option to have verified ready/low stock. If stock is not established, keep Researching and explain in chat. Other safety/evidence publishing holds remain internal and may also keep an item Researching; do not remove them merely to simplify the copy.

## Audit round 4 — 30 October 2026

No Pick or Lean/second-choice buttons on Researching items, including disabled controls in audit. Render voting controls only for Ready to vote items; authoritative stock/owner/safety gates still apply.

No video is better than a wrong-language or wrong-model video. Display a video only after the exact model and English speech or English subtitles are verified. No near-model demos. Video absence does not block an otherwise eligible item from Ready to vote; retain source history internally and explain missing media in chat. Photo/video dialogs are created only on tap and removed on close, with one labelled close button. No dormant Close × controls. Remove tier-price lines from item/Compare pages; retain each option's planned price and relevant extra costs. Merge purchase/installation notes into one Before buying list. Order displayed dimensions Length × Width × Height, longest side first, and keep original manufacturer dimensions internally.
