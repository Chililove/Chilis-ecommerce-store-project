import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/services/checkoutService";

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // Use the request origin to build success/cancel URLs that work in any env.
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
