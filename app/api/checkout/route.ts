// =============================================================================
//  CHECKOUT API ROUTE  —  lives at "/api/checkout"
// =============================================================================
//  reads the request, calls the service, and
//  returns the result. All the real logic lives in checkoutService. This
//  separation (route = traffic cop, service = brains) keeps things tidy.
// =============================================================================

import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/services/checkoutService";

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // The "origin" (e.g. http://localhost:3000) is sent by the browser; we use
    // it to build the success/cancel URLs so this works locally AND in prod.
    const origin = request.headers.get("origin") ?? "";

    const url = await createCheckoutSession(items, origin);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
