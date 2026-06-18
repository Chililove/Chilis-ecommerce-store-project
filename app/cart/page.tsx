// =============================================================================
//  CART PAGE  —  lives at "/cart"
// =============================================================================
//  A client component, because it reads and changes live cart state with
//  useCart(). It lists every item, shows a line total and a grand total, and
//  lets you remove items or clear the cart. Checkout comes in Phase 4.
// =============================================================================

"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { formatDkk } from "@/lib/format";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clear, totalPrice } = useCart();

  // Empty-cart state.
  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold">Your cart</h1>
        <p className="mt-4 text-gray-500">Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block hover:underline">
          ← Browse chili plants
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Your cart</h1>

      <ul className="mt-8 divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                {formatDkk(item.price)} each
              </p>

              {/* Quantity stepper. Each button sets a new quantity via
                  updateQuantity; going below 1 removes the item. */}
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-7 w-7 rounded-full border border-gray-300 text-lg leading-none hover:bg-gray-100"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  −
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-7 w-7 rounded-full border border-gray-300 text-lg leading-none hover:bg-gray-100"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* line total = unit price × quantity */}
              <span className="font-medium">
                {formatDkk(item.price * item.quantity)}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-lg font-semibold">{formatDkk(totalPrice)}</span>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          className="rounded-full bg-black px-8 py-3 font-medium text-white transition hover:bg-gray-800"
          onClick={() => alert("Checkout comes in Phase 4!")}
        >
          Checkout
        </button>
        <button onClick={clear} className="text-sm text-gray-500 hover:underline">
          Clear cart
        </button>
      </div>
    </main>
  );
}
