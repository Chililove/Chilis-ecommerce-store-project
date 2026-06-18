// =============================================================================
//  CHECKOUT SUCCESS PAGE  —  lives at "/checkout/success"
// =============================================================================
//  Stripe sends the customer here after a successful payment. We clear the cart
//  and show a thank-you.
// =============================================================================

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";

export default function CheckoutSuccessPage() {
  const { clear } = useCart();

  // Empty the cart once, when this page loads.
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">Thank you! 🌶️</h1>
      <p className="mt-4 text-gray-600">
        Your order is on its way. We hope your tiny chilis bring big heat.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-block rounded-full bg-black px-8 py-3 font-medium text-white transition hover:bg-gray-800"
      >
        Keep shopping
      </Link>
    </main>
  );
}
