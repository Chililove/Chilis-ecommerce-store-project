// =============================================================================
//  ADD TO CART BUTTON  —  client component used on the product detail page
// =============================================================================
//  The detail page is a Server Component (it can't use hooks), so the
//  interactive button lives here as its own client component. The page passes
//  in the product's id, name, and price as plain props, and this button calls
//  useCart().addItem when clicked.
// =============================================================================

"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/CartContext";

type Props = {
  id: string;
  name: string;
  price: number; // already converted from Decimal to a plain number by the page
};

export default function AddToCartButton({ id, name, price }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({ id, name, price });
    // brief "Added!" confirmation, then reset
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      className="mt-6 rounded-full bg-black px-8 py-3 font-medium text-white transition hover:bg-gray-800"
    >
      {added ? "Added! ✓" : "Add to cart"}
    </button>
  );
}
