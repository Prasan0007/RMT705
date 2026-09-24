# FOILFALL

Every rip is real.

FOILFALL is a digital trading-card pack-ripping platform: buy tokens, rip packs, and every pull
is a real graded card you can vault, ship, or sell back for tokens. This repo is a fully
interactive front-end demo — mock data and a mock checkout throughout, structured so a real
backend can be dropped in later.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion + GSAP + three.js / react-three-fiber.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `app/` — routes: landing, `/store` (Token Store), `/packs` (Pack Shop), `/rip/[packId]` (Rip Room),
  `/vault`, `/leaderboard` (Live Feed), `/perfect-cut` (signature $1,000 pack).
- `components/` — grouped by feature (`cards`, `packs`, `rip`, `vault`, `perfect-cut`, `streamer`,
  `three`, `effects`, `common`, `layout`).
- `lib/` — the odds engine (`odds.ts`, `packs-config.json`), card catalog, mock data, the
  Perfect Cut precision-scoring math, and the zustand store holding token balance / vault /
  streamer mode.

## Notes

- All packs read their rarity weights from `lib/packs-config.json` — the odds table shown in the
  UI is generated from the same config the pull engine uses, so they can never drift apart.
- The "Provably Fair" seed hash and The Perfect Cut's line generation/scoring run client-side for
  this demo; both are marked with `TODO(server)` comments pointing at what a real backend needs
  to own instead.
- Card art is procedurally generated per card id as a placeholder — swap `PlaceholderArt` for real
  renders via each card's `image` field when licensed assets exist.
