# LaCasa Showcase — build backbone v3

> **Access update — K’s explicit instruction, 23 October 2026:** The existing Site is public to anyone with its link. Visitors select KY, KX or KS before entering; these names use an honor system, not verified accounts. LACASA_PEOPLE is no longer required. Admin exports, finals and locks remain restricted to the authenticated Site owner via the trusted platform user header and OWNER_SITE_USER_ID. A separate /audit view is open to Claude without sign-in, shows real drafts plus read-only sample comparisons and an audit brief, and never stores audit votes or adds a fourth voter. This overrides the older private/email identity and sample-access wording in sections 1, 5.6, 6.2 and 10. All voting math, ownership, blind result filtering, content and total rules remain.


> **Audit fixes — K’s instruction, 23 October 2026:** Display estimated prices in curly brackets (`{S$1,500–3,500}`), replacing the old "rough" label. Unknown item prices are "Price TBC"; group subtotals keep priced ranges plus TBC counts, with no false S$0 for an unpriced group. Home keeps its deadline card and adds a compact calendar highlighting the remaining days and visit date. Use short room/item addresses with permanent redirects from the previous addresses. Vote flow has Back, Skip for now and Next, a finite end screen, and a clear return to skipped choices; skipping never saves a vote. The lightbox image exists only while opened.

Version 3.0 · 22 October 2026 · Asia/Singapore
**Replaces** v2.1 and every earlier version (retired).
**Site pack:** this backbone · `AGENTS.md` (standing rules and the editor playbook) · `lacasa.json` (real content) · `lacasa.sample.json` (test content) · `STATE.md` (progress log) · `LaCasa_Research_Standards.md` (research rules and the WEBSITE CARD format) · `sample-website-card.txt` (a sample card, used by test W01).
**Host:** ChatGPT Sites (Plus). **Builder and editor:** one pinned ChatGPT Work chat with @Sites.

**Changed in 3.0**
- K never types codes, IDs or fixed prompts. Internal IDs exist but are never shown or asked for (5.0).
- K adds content by talking normally: photos, plus model names or a WEBSITE CARD. The editor playbook in `AGENTS.md` does the rest.
- New **quick take** on every item and option: 10-second answer, headline, "Why you'll love it", "Watch out", "Best for" and reliability confidence (4.3, 4.5, 5.2–5.3).
- Research follows `LaCasa_Research_Standards.md` in two stages, Find then Deep dive, both ending in a WEBSITE CARD the site accepts as-is.

## 0. What we're building

A private, fast "product page" website for our LaCasa home. KY, KX and KS open it on their phones, pick an area, see what each option would look like (photo concepts), read a ten-second quick take, compare models side by side like Apple's compare page, and vote. Every vote feeds a shopping list with prices, category subtotals and totals, so the numbers tell us what to buy now and what can wait.

**K's whole job:** choose what to compare, make the pictures, glance at the result. The AI does research formatting, specs, comparison rows, deadlines, prices, totals and publishing.

**Goal:** each person finishes their votes in under 20 minutes.
**Not in this version:** content editing in the browser, suggestions from KX/KS, comments (WhatsApp does that), notifications, payments, live price scraping by the site, AI features inside the site.

## 1. People, sign-in and dates

| Person | Role | Bedroom |
|---|---|---|
| KY | Votes; **admin** — adds content (via the chat), breaks ties, locks decisions | KY's room |
| KX | Votes | KX's room |
| KS | Votes | KS's room |

- Display names: `lacasa.json → people[].name`.
- **Who is who:** after ChatGPT sign-in, Sites forwards the visitor's email in the `oai-authenticated-user-email` request header. The site maps that email to KY, KX or KS using the Site setting **`LACASA_PEOPLE`** (format `KY=a@x.com;KX=b@y.com;KS=c@z.com`, case-insensitive). The emails live only in that setting, never in the code or `lacasa.json`.
- A signed-in email that isn't in the setting sees "This account isn't set up yet — ask KY" and nothing else.

| Date | What happens |
|---|---|
| 11 Nov 2026 | Contractor site visit (also the 11.11 sale) |
| 27 Nov 2026 | Black Friday |
| 3 Dec 2026 | Key collection; works start after this |
| 12 Dec 2026 | 12.12 sale |
| Jan–Feb 2027 | Move-in (expected) |
| Later in 2027 | After move-in purchases |

## 2. The rules

### 2.1 Voting (shared areas)

- All three vote on every shared decision.
- **Pick = 1 vote.** When a decision has 3+ options you also give a **Lean = ½ vote** to your second choice (required, must differ from your pick). With 2 options there is no lean; three voters always produce a winner.
- **Votes stay hidden until all three have voted on that decision.** Before that, everyone only sees who has voted: "KY ✓ · KX ✓ · KS waiting". The server never sends anyone else's picks or scores early.
- Highest score wins. **Tie → KY decides** among the tied options.
- **Stuck:** if a decision is past its decide-by date and someone still hasn't voted, KY may decide.
- You can change your vote until KY **locks** the decision (locking = we're buying it). After the reveal, a changed vote recalculates the result and the decision shows "Updated".
- An option can be **"None / not now"** at S$0. That's how small add-ons are added or removed (e.g., soundbar vs none).
- If an option you picked is removed, your vote is cleared and the decision returns to your to-do list. A removed lean is ignored.

Status words, always shown as text: **Waiting (2 of 3)** · **Decided** · **Tie – KY decides** · **Locked**.

Honest note: blind voting is enforced by the website. As Site owner, KY can technically see the raw database, so it's fair play, not secrecy.

### 2.2 Bedrooms

- Bedroom decisions belong to the room's owner: **one pick, no vote, decided immediately.**
- They never appear in anyone else's voting flow. Others can still browse them ("KX decides").
- Bedroom costs appear in the shopping list, each room as its own section; **your own room is shown first as "My room".**

### 2.3 Deadline chips (colour + text, never colour alone)

| Chip | Text on the chip | Means | Decide by |
|---|---|---|---|
| 🔴 | 11 Nov · tell contractor | Needs wiring, plumbing, backing or holes, so the type must be known at the visit | 10 Nov |
| 🟠 | 3 Dec · on site | We buy it, contractor installs it during works | 2 Dec |
| 🟢 | Jan–Feb · before move-in | Needed to live there | 31 Dec |
| ⚪ | 2027 · after move-in | Can wait | — |

- A decision may set its own `decideBy` (e.g., to catch 11.11).
- **Sale chips** (🏷 11.11 · Black Friday · 12.12) appear on items worth timing.
- Red-chip decisions also show a **"Contractor needs to know"** box.
- Home shows a countdown: "23 days to contractor visit".
- Past the decide-by date with votes missing, the chip adds **"Overdue"**.
- The WEBSITE CARD's `DEADLINE` maps to chips: "Tell contractor by 11 Nov" → 🔴, "On site 3 Dec" → 🟠, "Before move-in" → 🟢, "After move-in" → ⚪.

## 3. The list (let the numbers talk)

- Each decided item: **quantity × planned price** of the winning option.
- Each open item: a **range** from its cheapest to dearest option (S$0 "none" options included). With no options yet, its budget estimate is used and shown in curly brackets.
- Header: **Decided S$X · Still open S$a–b · Total S$(X+a)–(X+b)**.
- A chosen option with no price shows **"Price TBC"** and is counted in a separate "TBC: n items" line, never as S$0.
- Options with `paidVia: "contractor"` (priced inside the contractor quote) are listed under **"In contractor quote"** and excluded from our total, so nothing is paid twice.
- Decided items with a cheaper option show a hint: **"Beta is S$420 cheaper"**.
- Filters: **Before move-in** (🔴🟠🟢) · **After move-in** (⚪) · **All**; and **Everything** · **Fittings** · **Things we buy**.
- Grouped by category, each with a subtotal. Bedrooms are sections with their own subtotal; "My room" first.
- **Copy as text** button (for WhatsApp) and a print-friendly layout.
- `budget` in lacasa.json is null for now; if set later, show "S$… left" or "S$… over" against the Before-move-in total.
- Sample items (5.6) never appear in the list or its totals.

## 4. Screens

**Design:** Apple product-page simplicity. Warm white background, big photos, system font, one dark accent, generous spacing, no animation beyond quick fades, no gimmicks. Works one-handed at 320 px wide. Buttons at least 44 px. **No internal IDs or codes appear anywhere on any page or in any URL a person sees as text** (URLs may use readable slugs like `/kitchen/fridge`).

### 4.1 Home
LaCasa title, "Hi KY", countdown, your progress ("You've done 4 of 14"), big **Start voting (about 10 min)** button, area tiles with photos, and a strip with the list's headline total. KY also sees each person's remaining count.

### 4.2 Area
Current photos at the top (swipe, tap to enlarge), measurements, then that area's items as rows: title, chips, status, and the 10-second answer in one line when there is one.

### 4.3 Item page (the core page)
Top to bottom, the first screen alone should be enough to decide:
1. **Image viewer:** each option's concept images; letter tabs **A · B · C** under the image switch between them.
2. **Question**, chips, and the **10-second answer** in a highlighted box.
3. **Option cards** (one per option): letter + name, tier tag, planned price (and "× 4" if qty), **Headline** (large), "✓ Why you'll love it", "! Watch out", "Best for", **Pick** button, **½ Lean** button (3+ options only).
4. **Read more** on each card expands: pros, cons, what owners say (with source links), where to buy (shop, price, stock, date checked), reliability confidence, buy timing.
5. Boxes: **Must know**, **🔴 Contractor needs to know**, price tiers line, and the 2-sentence summary.
6. Status line ("Hidden until everyone votes · KY ✓ KX ✓ KS …"), **Compare** button, **Full report ↗** (if a link exists).
7. KY only: **Decide** (tie or overdue) and **Lock / Unlock**.

### 4.4 Vote flow (`/vote`)
The item page in a queue with a progress bar ("5 / 14 · about 6 min left"), Back · Skip for now · Next. The queue holds every item you still need to answer: shared ones plus your own bedroom, sorted by decide-by date. It ends on "All done — results appear when everyone has voted" with a link to the list.

### 4.5 Compare — Apple-style
Modelled on the "compare models" pages of Apple and Dreame: columns of models, rows of details, values lined up so differences jump out.

- **Columns:** 2 on phones (no sideways scrolling), 3 on tablets and laptops. Each column header has a **dropdown** listing every option in the item, so any model can be swapped in. It opens with the first options preselected, or the ones in the link.
- **Sticky header** (stays visible while scrolling): photo, name, tier tag, planned price, **Headline**, **Pick** (and **½ Lean** when there are 3+ options). The lowest-priced shown option gets a text tag "Lowest price".
- **Rows in this order:**
  - Quick take: Why you'll love it · Watch out · Best for · Reliability confidence.
  - The item's own groups from its compare table, in order (e.g., Size & fit · Performance · Features · Running costs · Warranty & support).
  - Fixed groups: **Pros**, **Cons**, **Owners say**, **Where to buy**, **Buy timing**.
- **Values:** "Yes"/"No" show as ✓ / — with real text for screen readers; a value an option doesn't have shows "Not stated", never a blank cell.
- **"Show differences only"** toggle hides rows where every shown column has the same value.
- Same-item only: you compare fridges with fridges, never fridges with sofas.
- Comparing never votes; only the Pick and ½ Lean buttons do.
- The URL updates as models are swapped, so KY can paste a comparison into WhatsApp.

### 4.6 The list
Section 3.

### 4.7 Admin (KY only, `/admin`)
Each person's remaining count, **Export votes** (JSON download, for backup) and the **Show sample items** switch (5.6).

Drafts (`status: "draft"`) show greyed as "Research in progress" with their candidate names, and are not votable.

**Speed targets:** first content under 2 s on 4G; under 150 KB of JavaScript; images WebP, max 1600 px long edge, about 300 KB each, lazy-loaded below the fold; no web fonts.

## 5. Content: `lacasa.json`

All content lives in this one file plus images in `public/images/`. Only KY changes it, through the chat. The site reads it at build time; content changes = republish.

### 5.0 IDs are internal
Every area, item and option has an `id` so votes stay attached to the right thing. The editor AI creates and manages them. **K never types, sees or is asked for an ID**, and pages never show one. People refer to things by plain names ("the fridge", "living room lights", "option Beta"). Each item also gets a readable `slug` for URLs.

### 5.1 Top level

`version`, `updated`, `admin`, `budget` (null), `people[]` (code, name, room — no emails), `stages[]` (chip, label, decideBy), `sales[]`, `milestones[]`, `areas[]`, `decisions[]`.

**Area:** `id`, `name`, `kind` ("shared" | "bedroom"), `owner` (bedrooms), `photos[]` ({src, caption}), `measurements[]`.

### 5.2 Item (decision)

| Field | Meaning |
|---|---|
| `id`, `slug` | Internal ID (never shown) and readable URL name |
| `area`, `category`, `title`, `question` | Where it lives and what we're deciding |
| `group` | "fittings" (contractor installs) or "loose" (we buy) |
| `priority` | "essential" or "nice" |
| `stage`, `decideBy?`, `sales?` | Chips and deadlines |
| `status` | "draft" or "voting" (switch to voting once it has 2+ options) |
| `qty?` | Default 1 |
| `budget?` | The budget K gave for this item (S$) |
| `candidates[]` | Names shown while still a draft |
| `roughBudget?` | {min, max, source}, used until options have prices |
| `answer10s?` | The 10-second answer |
| `summary?` | 2 sentences: what was compared and why |
| `tiers?` | [{name: "Budget", min, max}, …] in SGD |
| `mustKnow[]`, `contractorNote?` | The two boxes |
| `specGroups?` | [{group: "Size & fit", rows: ["Size W × D × H (cm)", …]}, …] — drives Compare |
| `fullReport?` | Link to the full research report |
| `options[]` | The choices |

### 5.3 Option

| Field | Meaning |
|---|---|
| `id` | Internal; never reused for a different product |
| `label` | Short name on tabs and cards, e.g., "Beta" or "Cove + fan" |
| `name?` | Brand + exact model (products) or the scenario (looks) |
| `kind` | "product", "look" (a scenario like a lighting scheme) or "none" |
| `tier?` | "Budget", "Mid" or "Splurge" |
| `price` | Planned price in whole SGD per unit, or null if unknown |
| `paidVia?` | "us" (default) or "contractor" |
| `images[]` | {src, caption, kind: "concept" \| "product" \| "photo"} |
| `headline` | ≤ 8 words: the one thing that wins hearts |
| `love` | "Why you'll love it" — one line |
| `watchOut` | "Watch out" — one line |
| `bestFor` | One line |
| `pros[]`, `cons[]` | 3 each, most important first |
| `ownersSay[]` | {text, source, when} up to 3 |
| `offers[]` | {shop, price, stock, checked, url} up to 3 |
| `confidence?` | {level: "Strong" \| "Moderate" \| "Limited", why} |
| `specs?` | {"<row label>": "value"} using the item's `specGroups` rows; "Yes"/"No" for features; "Not stated" if unknown |
| `buyTiming?` | e.g., "Wait for 12.12; target S$1,099" |

`lacasa.sample.json` shows a complete example of every field.

### 5.4 Images

- Area photos: `public/images/<area>/now-1.webp`, `now-2.webp` …
- Option images: `public/images/<area>/<item-slug>-<option-label>-1.webp` …
- The editor converts to WebP, max 1600 px, and **strips all metadata (phone GPS location included).**

### 5.5 Current seed

`lacasa.json` starts with 11 areas and 34 items from the group-chat list and the 8 Oct brief, all **drafts with no options**. Rough budgets carry their source ("Group chat" or "Brief allowance, 6 Oct"). Nothing is researched or decided yet.

### 5.6 Sample items (testing only)

`lacasa.sample.json` holds two made-up items (a fridge with three models and a lighting look with three scenarios) so the vote flow and Compare can be built and tested before real research exists.

- Automated tests use it.
- On the live site, sample items appear **only for KY**, only when Admin → **Show sample items** is on, marked "SAMPLE" on every card.
- They never appear for KX or KS and never in the list or its totals.
- Votes on samples are stored apart (internal IDs start with `SAMPLE-`) and can be cleared from Admin.

### 5.7 From WEBSITE CARD to content

The WEBSITE CARD format is defined in `LaCasa_Research_Standards.md` section 11. Map it as follows:

| Card line | Field |
|---|---|
| ITEM, ROOM | Match an existing item by name and room; else create a new item |
| QUANTITY, BUDGET | `qty`, `budget` |
| DEADLINE, SALES WORTH WAITING FOR | `stage`, `sales` |
| 10-SECOND ANSWER, SUMMARY, PRICE TIERS | `answer10s`, `summary`, `tiers` |
| MUST KNOW, CONTRACTOR NEEDS TO KNOW | `mustKnow[]`, `contractorNote` |
| FULL REPORT | `fullReport` |
| OPTION A/B/C lines | One option each: `name`, `tier`, `price`, `headline`, `love`, `watchOut`, `bestFor`, `pros`, `cons`, `ownersSay`, `offers`, `buyTiming`, `confidence`; `label` = a short form of the name |
| COMPARE TABLE | `specGroups` (groups and rows in order) + each option's `specs` |

Use the card's facts exactly. Don't re-research, reword claims or add facts. Fix only formatting.

## 6. Data and server logic

### 6.1 Storage (D1, two tables)

```sql
CREATE TABLE votes (
  code TEXT NOT NULL CHECK (code IN ('KY','KX','KS')),
  decision_id TEXT NOT NULL,
  pick TEXT NOT NULL,
  lean TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (code, decision_id),
  CHECK (lean IS NULL OR lean <> pick)
);
CREATE TABLE finals (
  decision_id TEXT PRIMARY KEY,
  option_id TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('tie','overdue','lock')),
  at TEXT NOT NULL
);
```

No R2 is needed: images ship with the site.

### 6.2 API

| Call | Who | Does |
|---|---|---|
| `GET /api/me` | Signed-in | Your code (or null), name, isAdmin |
| `GET /api/state` | Known person | Your votes + every result (blind rules applied) + progress counts |
| `PUT /api/votes/:decisionId {pick, lean}` | Known person | Save or change your vote |
| `POST /api/admin/final {decisionId, optionId, reason}` | KY | Tie/overdue decision, or lock |
| `DELETE /api/admin/final/:decisionId` | KY | Unlock |
| `DELETE /api/admin/sample-votes` | KY | Clear votes on sample items |
| `GET /api/admin/export` | KY | Both tables as JSON |

(IDs in API paths are internal plumbing, never displayed.)

**Vote validation (server):** item exists and is "voting"; not locked; you may vote here (shared, or your own bedroom; samples only for KY); pick is one of its options; lean present only and always when it has 3+ options, and differs from pick. Anything else → 422 with a plain message.

**Security:**
- Identity comes only from the `oai-authenticated-user-email` header that Sites adds after sign-in, mapped through `LACASA_PEOPLE`. Nothing the browser sends in the body or query decides who you are.
- Admin = the person mapped to KY.
- API responses `Cache-Control: no-store`; writes same-origin only.
- Blind results are computed on the server; picks never leave it early.
- Launch test: send a request with a forged `oai-authenticated-user-email` header to the deployed site. It must not be accepted as that person (the platform must overwrite or reject it). If it is accepted, stop and fix before inviting anyone.

### 6.3 Result logic

```
result(decision, votes, final, today):
  if final exists and its option still exists:
      return LOCKED if reason = lock else DECIDED(final.option, by KY)
  drop votes whose pick no longer exists; drop leans that no longer exist
  overdue = decideBy(decision) exists and today > decideBy
  if bedroom:
      owner voted -> DECIDED(owner's pick)
      else -> WAITING(for owner), adminCanDecide = overdue
  if any of KY, KX, KS has no valid vote:
      return WAITING(who voted, who hasn't), adminCanDecide = overdue
      # never include picks or scores here
  score: pick +1, lean +0.5
  one top score -> DECIDED(winner, scores)
  several -> TIE(tied options, scores), KY decides
```

List maths: decided → qty × price; price null → TBC; `paidVia: contractor` → "In contractor quote"; open → min–max of option prices, else rough budget.

Compare rows: for each `specGroups` row, the shown options' values (missing → "Not stated"); with "differences only" on, drop rows whose shown values are all equal.

## 7. Tests (must pass)

The T, L, C, P and W cases were checked against a reference implementation of these rules, with sanity checks on both content files. Re-create them as automated tests.

| # | Case | Expected |
|---|---|---|
| T01 | 2 options, votes A, A, B | A decided |
| T02 | 3 options, picks A, B, C, leans B, C, A | Tie (1.5 each), KY decides |
| T03 | Picks A, B, C, leans B, A, B | B decided (2.0 vs 1.5 vs 1.0) |
| T04 | Picks A, A, B, leans B, C, A | A decided (2.5) |
| T05 | Only 2 of 3 voted | Waiting; response has no picks or scores |
| T06 | Bedroom, owner picks B | B decided immediately |
| T07 | Bedroom, only others voted | Waiting for owner |
| T08 | Past decide-by, votes missing | Waiting; KY may decide |
| T09 | On the decide-by day | Not overdue yet |
| T10 | Vote for a removed option | Counts as missing; back in that person's queue |
| T11 | Lean for a removed option | Lean ignored |
| T12 | KY's tie decision | Overrides the count |
| T13 | Locked | Shows Locked; the API rejects vote changes |
| L01 | Open with options S$1,200 / S$900 / S$0 | Range S$0–1,200 |
| L02 | Qty 4 × S$120 | S$480 |
| L03 | Chosen option, price null | "Price TBC", not S$0 |
| L04 | No options yet | Budget estimate range in curly brackets |
| L05 | `paidVia: contractor` | "In contractor quote", excluded from total |
| L06 | Decided S$480 + open S$0–1,200 + 1 TBC | Total S$480–1,680; "TBC: 1 item" |
| C01 | Compare A vs B, a row both lack | Both cells "Not stated" |
| C02 | "Differences only" with one identical row | That row hidden, others kept |
| C03 | Lowest price among shown columns | Only that column tagged "Lowest price" |
| P01 | `LACASA_PEOPLE` lookup with different letter case | Maps to the right person |
| P02 | Signed-in email not in the setting | No person; "not set up yet" screen |
| W01 | Parse the sample WEBSITE CARD in 5.7 format | Every field lands; compare table → `specGroups` + `specs` |
| W02 | Card ITEM/ROOM matching an existing draft | That item is filled; no duplicate item |
| N01 | Render every page with the sample content | No internal ID appears in visible text |

Also: `/api/state` for KX contains no other person's pick before the reveal; sample items never reach KX/KS or the totals; the forged-header test in 6.2.

## 8. Building and editing

### 8.1 Build (once)

In ChatGPT: **Work → new chat**, attach every file in the site pack, and send:

```
@Sites Build the LaCasa Showcase website from the attached files.
Read AGENTS.md first, then LaCasa_Showcase_Backbone_v3.md in full, then
the other files. Build everything in the backbone: screens (section 4,
including the Apple-style Compare page and quick takes), rules (2), the
list (3), sample mode (5.6), card mapping (5.7) and tests (7). Use Sign in
with ChatGPT and D1. Tell me exactly where to add the LACASA_PEOPLE
setting. Keep it private (owner only); don't invite anyone. Update
STATE.md, then give me the preview link and a short list of anything you
couldn't build or verify.
```

### 8.2 Editing (every day after)

K just talks in the same chat. The editor playbook in `AGENTS.md` covers:
- photos plus a WEBSITE CARD
- photos plus model names ("research and add")
- current photos for an area
- price changes
- the contractor quote
- new, renamed or removed items
- "what's left to do?"

No fixed prompts or codes are needed.

### 8.3 Resume in a new chat (only if the old chat is lost)

```
@Sites Continue the existing LaCasa Showcase Site (URL: [URL]). Open its
current source; don't create a new Site. Read AGENTS.md and STATE.md
first, then wait for my next message.
```

## 9. Research

`LaCasa_Research_Standards.md` holds K's research standards: availability-first shop inventory, reliability and support, word of mouth from communities, videos and comments, budget fit, SG vs JB and sales. It has four commands: Find, Deep dive, Quick and Recheck.

- K normally runs Find and Deep dive in a separate research project, in ChatGPT or Claude, with the same file.
- The site chat uses the same file when K says "research and add" for small items.

## 10. Launch checklist

1. Build (8.1) → preview.
2. In the Site's settings, add `LACASA_PEOPLE` with the three emails.
3. Publish privately (owner only). Open the link: home says **"Hi KY"**.
4. Add a few current photos, then the **photo privacy** check: open an image URL in a private/incognito window. It must ask for sign-in. If it loads, move images behind an authenticated route before inviting anyone.
5. **Forged-header test** (6.2) passes.
6. Turn on Admin → Show sample items; try the vote flow and Compare on your phone; turn it off.
7. Add the 🔴 items.
8. Share → Who has access → add KX and KS by email, **view only**. Publish.
9. **Blind check:** KY votes on one item; on KX's phone it shows only "KY ✓".
10. Each person runs the vote flow on their own phone. Note the time against the 20-minute goal.
11. Check three list lines by hand (qty × price, a range, a TBC).
12. After each voting round, KY exports votes (Admin → Export) to Drive. Votes live only in the Site's database.

## 11. Out of scope

Suggestions or uploads by KX/KS, in-browser content editing, comments, notifications, budget approvals, live price scraping by the site, purchase tracking beyond Lock, 3D or floor-plan tools.
