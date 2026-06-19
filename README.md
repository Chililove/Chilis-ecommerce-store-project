# Tiny Chili Store 🌶️

A small but complete e-commerce store for tiny chili plants — from gentle jalapeños to the fearsome Carolina Reaper. Browse the plants, fill a cart, and pay for real (well, with test cards). Built as a full-stack learning project, deployed and working end to end.

**Live demo:** https://chilis-ecommerce-store-project.vercel.app

> Payments run in Stripe **test mode**, so nothing is charged. Use card `4242 4242 4242 4242`, any future expiry, any CVC.

## What it does

- Browse a catalogue of chili plants with images, prices (in DKK), and stock
- Add items to a cart that **remembers itself** across page refreshes
- Adjust quantities, remove items, see a running total
- Check out securely through **Stripe Checkout**
- On payment, the order is recorded and product stock is reduced — automatically and reliably

## Tech stack

- **Next.js (App Router) + TypeScript** — server and client components
- **PostgreSQL + Prisma** — database and type-safe data access
- **Stripe** — hosted checkout and webhooks
- **Tailwind CSS** — styling
- **Vercel** — hosting and CI (auto-deploys on every push)

## How it's built

A few patterns keep the code tidy:

- **Repository layer** (`lib/repositories`) — the only place that talks to the database.
- **Service layer** (`lib/services`) — business logic like building a checkout or recording an order. Prices are always re-checked against the database, never trusted from the browser.
- **Cart via React Context + `useSyncExternalStore`** — shared cart state, persisted to `localStorage`.
- **Stripe webhook** — the trusted source of truth for "payment succeeded." It verifies Stripe's signature and is **idempotent**, so a duplicated event can't create a duplicate order.

## Run it locally

You'll need Node.js 20+, a PostgreSQL database, and a Stripe account (test mode).

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with:

   ```bash
   DATABASE_URL="postgres://..."        # your Postgres connection string
   STRIPE_SECRET_KEY="sk_test_..."      # Stripe secret key (test mode)
   STRIPE_WEBHOOK_SECRET="whsec_..."    # from `stripe listen` (see below)
   ```

3. Set up the database and add sample plants:

   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

5. To test checkout locally, forward Stripe webhooks in a second terminal:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   Copy the `whsec_...` it prints into your `.env` as `STRIPE_WEBHOOK_SECRET`, then restart the dev server.

## Handy scripts

| Command             | What it does                            |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Start the local dev server              |
| `npm run build`     | Production build                        |
| `npm run db:seed`   | Reset and reseed the products           |
| `npm run db:studio` | Open Prisma Studio to view the database |

---

Built by Louise Chili Lauenborg as a portfolio project. 🌶️
