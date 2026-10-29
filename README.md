# LaCasa

Private family site for choosing furniture and appliances for the LaCasa flat: compare models, vote, and see the shopping list total.

Runs on a free Cloudflare Worker with a D1 database. Moved from ChatGPT Sites on 30 Oct 2026.

## What's where
- `lacasa.json`: all real content (rooms, items, options, prices, photos, videos). Editing this file is how items get added or changed.
- `public/images/`: photos used by the site.
- `showcase/`: page rendering, voting rules and shopping-list maths.
- `src/worker.mjs`: the Worker (routing, owner sign-in).
- `migrations/`: database tables (votes and final decisions only).
- `docs/`: rules for whoever edits the site (AGENTS.md), research standards, progress log.

## Owner sign-in
Locks, final decisions and exports need the owner password (secret `OWNER_PASSWORD`, set in Cloudflare) with KY selected. Family members just pick their name.

## Deploying (Cloudflare Workers Builds, connected to this repository)
- Build command: `npm install`
- Deploy command: `npx wrangler d1 migrations apply DB --remote && npx wrangler deploy`
- Set `database_id` in `wrangler.jsonc` to the D1 database's ID.
- Add the secret `OWNER_PASSWORD` under the Worker's Settings → Variables and Secrets.

## Checks
`npm test` runs the voting, list, compare and API tests (97).
