# Tiny Chili Store 🌶️

A small e-commerce store for chili plants, built with Next.js, Prisma, and Stripe.

**Live demo:** https://chilis-ecommerce-store-project.vercel.app

> Payments run in Stripe test mode — use card `4242 4242 4242 4242`, any future expiry, any CVC.

## Features

- Browse chili plants with images, prices, and stock levels
- Cart that persists across page refreshes
- Checkout via Stripe
- Orders and stock updates handled automatically via Stripe webhooks

## Tech stack

- Next.js (App Router) + TypeScript
- PostgreSQL + Prisma
- Stripe
- Tailwind CSS

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file:

   ```bash
   DATABASE_URL="postgres://..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

3. Set up the database:

   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

5. (Optional) Forward Stripe webhooks locally:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:seed` | Reseed products |
| `npm run db:studio` | Open Prisma Studio |
