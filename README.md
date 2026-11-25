# LaCasa

Private family site for the La Casa move-in: what to buy, the floor plan (2D + 3D), payments, bathrooms, documents and progress. One shared view for the whole family (no name picker).

Live: https://lacasa.kayikkwong.workers.dev · Cloudflare Workers + D1 · auto-deploys from `main` in about a minute.

## Pages and where their code lives
| Page | What it is | Data | Page code |
|---|---|---|---|
| `/` | Home: days to keys, progress, page cards, next to-dos | — | `showcase/home.mjs` |
| `/progress` | Steps by stage, what's next, family update feed | `showcase/progress.mjs` (STAGES) | same + `public/progress.js` |
| `/buy` | To-buy list by room, to-dos, 3 Dec checklist, contractor quote | `showcase/buy-plan.mjs` | `showcase/buy.mjs`, photos `showcase/buy-images.mjs` |
| `/plan` | Floor plan, layouts (Family, Designer's pick, KY/KX/KS), 3D view | `showcase/plan-data.mjs` | `showcase/plan.mjs`, `public/plan.js`, `public/plan3d.js` |
| `/bathrooms` | Split plan (SG vs MY), shop price check, bathroom guide | `showcase/bathrooms.mjs`, `showcase/compare.mjs` | same + `public/compare.js` |
| `/pay` | Every deposit, payment and balance (family-editable) | `showcase/pay.mjs` | `public/pay.js` |
| `/docs` | Every document with a summary; originals in the private Drive folder | `showcase/docs.mjs` | same |
| `/research` | Research topics with picks and sources | `showcase/research.mjs` | `researchPage()` in `showcase/plan.mjs` |
| `/look` | Mood board | `showcase/look-data.mjs` | `showcase/look.mjs` |
| `/earlier` | Archive: old voting pages, 11 Nov visit, 25 Nov day plan (`/day`) | `lacasa.json`, `showcase/day.mjs` | `showcase/render.mjs` |

Styles: `public/lacasa-theme.css` (loaded last). Shared family data is stored in D1 table `visit_notes` (keys `b:`, `p:`, `t:`, `l:`, `pay:log`, `prog:log`, `cmp:log`, `day:1125`).

## Working on it
- `npm test` before every push; `npm run assets` after any CSS/JS change (updates the cache version).
- Never save test choices on the live site. Live writes only with K's OK.
- No address, unit number, IC or bank numbers anywhere on the site.
- The project notes (handover) live in the claude.ai project "LACASA HOME PROJECT", doc `claude/lacasa-handover.md`. `docs/STATE.md` has the short change log.

## Deploying
Cloudflare Workers Builds, connected to this repository. Build `npm install`; deploy `npx wrangler d1 migrations apply DB --remote && npx wrangler deploy`. Secret `OWNER_PASSWORD` for owner sign-in.
