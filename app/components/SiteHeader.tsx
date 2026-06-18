// =============================================================================
//  SITE HEADER  — top of every page
// =============================================================================
//  This is a client component ("use client") because it reads live cart data
//  with useCart() — specifically the total item count, which it shows next to
//  the Cart link and updates instantly as you add items.
// =============================================================================

"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";

export default function SiteHeader() {
  const { totalItems } = useCart();

  return (
    <header className="border-b border-gray-200">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold">
          Tiny Chili Store 🌶️
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          <Link href="/cart" className="hover:underline">
            Cart ({totalItems})
          </Link>
        </div>
      </nav>
    </header>
  );
}
