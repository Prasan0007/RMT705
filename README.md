# FOILFALL

Every rip is real.

FOILFALL is a digital trading-card pack-ripping platform: buy tokens, rip packs, and every pull
is a real graded card you can vault, ship, or sell back for tokens. This is a real full-stack
build — real accounts, a real database, real Stripe payments (test mode until you flip it live),
and an admin panel for order fulfillment — not a front-end-only demo.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion + GSAP + three.js / react-three-fiber,
Prisma + PostgreSQL, Auth.js (credentials login), Stripe Checkout.

## Before you start reading further: legal, not just technical

Randomized rewards for real money (pack odds) are regulated like loot boxes / gambling in a
number of places — several US states, the Netherlands, Belgium, China, and others either
restrict, require licensing/age-gating for, or ban this model outright. This is not a formality.
Before you take a single real payment:

- Form a real business entity (LLC at minimum) and get a lawyer to review your target
  jurisdictions' rules on randomized real-money rewards.
- Decide on age verification / KYC if your counsel says it's required where you operate.
- Write real Terms of Service and a Privacy Policy (not included here).
- Only then set `STRIPE_SECRET_KEY` to a **live** key. Everything in this repo runs against
  Stripe **test mode** until you do that — real payments literally cannot happen by accident.

## Setting up your own environment

### 1. Database — Neon (or any Postgres)

1. Sign up at [neon.tech](https://neon.tech), create a project, and copy the connection string.
2. Put it in `.env` as `DATABASE_URL="postgresql://...?sslmode=require"`.
3. Run the migrations: `npx prisma migrate deploy` (or `npx prisma migrate dev` locally).

### 2. Auth

Generate a secret and put it in `.env`:

```bash
openssl rand -base64 32
```

```
AUTH_SECRET="the generated value"
NEXTAUTH_URL="http://localhost:3000"   # your real domain in production
```

### 3. Stripe (test mode to start)

1. Sign up at [stripe.com](https://stripe.com).
2. Grab your **test** secret key from the [API keys page](https://dashboard.stripe.com/test/apikeys)
   → `STRIPE_SECRET_KEY`.
3. For webhooks locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook` (via the
   [Stripe CLI](https://stripe.com/docs/stripe-cli)) — it prints a webhook signing secret, put
   that in `STRIPE_WEBHOOK_SECRET`. In production, add a webhook endpoint in the Stripe dashboard
   pointed at `https://yourdomain.com/api/stripe/webhook` listening for `checkout.session.completed`.
4. Use Stripe's [test card numbers](https://stripe.com/docs/testing) (e.g. `4242 4242 4242 4242`,
   any future expiry, any CVC) to buy tokens without moving real money.

### 4. Run it

```bash
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up (new accounts start with 100 free
tokens), and rip a pack.

### 5. Make yourself an admin

Sign up normally, then either:

- `npx prisma studio` → open the `User` table → set your row's `role` to `ADMIN`, or
- `psql "$DATABASE_URL" -c "UPDATE \"User\" SET role='ADMIN' WHERE email='you@example.com';"`

The `/admin` panel (order fulfillment queue, manual token grants) is gated to that role.

## Deploying

Vercel is the path of least resistance for the app itself (it's a standard Next.js App Router
project, no special config). Point `DATABASE_URL` at your production Postgres, set `AUTH_SECRET`,
`NEXTAUTH_URL` to your real domain, and your **live** Stripe keys once you're legally ready — see
the section above first.

## Structure

- `app/` — routes: landing, `/store` (Token Store), `/packs` (Pack Shop), `/rip/[packId]` (Rip Room),
  `/vault`, `/leaderboard` (Live Feed), `/perfect-cut` (signature $1,000 pack), `/admin` (ops panel,
  ADMIN role only), `/login` + `/signup`.
- `app/actions/` — server actions: `rip.ts` (server-resolved pack pulls), `perfect-cut.ts`
  (server-resolved precision scoring), `vault.ts` (sell-back / showcase / ship), `checkout.ts`
  (Stripe Checkout session), `admin.ts` (fulfillment + manual token grants).
- `app/api/stripe/webhook/` — the one thing that has to be a real HTTP route instead of a server
  action, since Stripe calls it directly.
- `components/` — grouped by feature (`cards`, `packs`, `rip`, `vault`, `perfect-cut`, `streamer`,
  `three`, `effects`, `common`, `layout`, `admin`, `auth`).
- `lib/` — the odds engine (`odds.ts`, `packs-config.json`), card catalog, the Perfect Cut
  precision-scoring math, Prisma client (`db.ts`), leaderboard aggregation queries
  (`leaderboard.ts`), and the zustand store — now holding only client-only UI preferences
  (streamer mode, chroma key), since account data lives in Postgres.
- `prisma/schema.prisma` — `User`, `TokenTransaction` (the full ledger — every balance change is
  logged), `VaultItem`, `PullEvent`, `PerfectCutRound`, `Order`, `WebhookEvent` (Stripe webhook
  idempotency).

## What's real vs. what still needs you

**Real:** accounts + sessions, the database, every token balance change logged to a ledger,
server-side pack-pull resolution (the client can't influence what it pulls), server-side Perfect
Cut scoring (the client only supplies swipe coordinates — the true line, the score, and the card
are all resolved server-side), Stripe Checkout + webhook crediting tokens, sell-back, ship
requests creating real `Order` rows, an admin fulfillment queue, a real leaderboard computed from
real pulls (no fabricated entries).

**Still needs you, because it's not code:**

- Actual physical cards behind pulls, and a relationship with a grading service.
- A warehouse/fulfillment process — the admin panel tracks orders and lets you attach a tracking
  number, but doesn't generate shipping labels yet. Wiring a carrier API (Shippo, EasyPost) into
  `app/actions/admin.ts` is the natural next step once you have a real fulfillment process to
  drive it.
- The legal groundwork covered above.
- Transactional email (order confirmations, shipping updates) — none is sent yet.

## Notes on fairness

- `lib/odds.ts` / `lib/packs-config.json`: every pack's odds table shown in the UI is generated
  from the same config the pull engine reads, so they can't drift apart.
- The Perfect Cut's true cut line still has to reach the client to render the 2-second flash, so
  it's not fully tamper-proof against someone reading network traffic — see the `TODO` comment in
  `app/actions/perfect-cut.ts`. What *is* fully server-side, and can't be spoofed by editing
  client state, is the scoring and the card/grade that comes out of it.
- Card art is procedurally generated per card id as a placeholder — swap `PlaceholderArt` for real
  renders via each card's `image` field when licensed assets exist.
