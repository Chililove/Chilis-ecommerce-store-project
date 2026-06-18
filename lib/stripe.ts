// =============================================================================
//  STRIPE CLIENT  —  one shared Stripe instance (Adapter + Singleton)
// =============================================================================
//  This wraps the Stripe SDK behind our own file. The rest of the app imports
//  `stripe` from here and never imports the raw SDK directly — so if Stripe's
//  setup ever changes, we adjust it in ONE place. That's the Adapter.
//
// =============================================================================

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
