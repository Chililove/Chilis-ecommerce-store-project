// Shared Stripe instance. Import `stripe` from here, never the raw SDK, so
// setup changes live in one place. Secret key comes from the environment.

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
