// Trusted server-to-server source of truth for payment success (not the browser
// redirect). runtime = "nodejs" because signature verification needs the raw
// request body and Node's crypto, unavailable on the edge runtime.

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { recordPaidOrder } from "@/lib/services/orderService";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // Raw body text (not parsed JSON) is required to verify the signature.
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    // Verify the request really came from Stripe; throws on a bad signature.
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const cartJson = session.metadata?.cart;
    const cart = cartJson ? JSON.parse(cartJson) : [];
    const email = session.customer_details?.email ?? "unknown@example.com";

    try {
      await recordPaidOrder({ cart, email, stripeSessionId: session.id });
    } catch (err) {
      console.error("Failed to record order:", err);
      // 500 tells Stripe to retry the webhook later.
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
