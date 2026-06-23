// =============================================================================
//  STRIPE WEBHOOK  —  lives at "/api/webhooks/stripe"
// =============================================================================
//  Stripe calls this endpoint, server-to-server, when something happens (here:
//  a checkout finished). This is the Observer pattern — Stripe publishes an
//  event, and this route reacts to it. It's the TRUSTED source of truth for
//  "did the payment actually succeed?", unlike the browser redirect.
//
//   - runtime = "nodejs": webhooks need the raw request body and Node's crypto,
//     which the default edge runtime can't provide.
//   - signature verification: we confirm the request really came from Stripe by
//     checking its signature against our webhook secret. Without this, anyone
//     could POST a fake "you got paid!" message.
// =============================================================================

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { recordPaidOrder } from "@/lib/services/orderService";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // The RAW body text (not parsed JSON) is required to verify the signature.
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    // Throws if the signature doesn't match — i.e. it isn't really from Stripe.
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // React only to the event we care about.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // We stored the cart in metadata back when we created the session.
    const cartJson = session.metadata?.cart;
    const cart = cartJson ? JSON.parse(cartJson) : [];
    const email = session.customer_details?.email ?? "unknown@example.com";

    try {
      await recordPaidOrder({ cart, email });
    } catch (err) {
      console.error("Failed to record order:", err);
      // A 500 tells Stripe to retry the webhook later.
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  }

  // Acknowledge receipt so Stripe knows we handled it.
  return NextResponse.json({ received: true });
}
