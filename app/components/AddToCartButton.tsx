"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/CartContext";

type Props = {
  id: string;
  name: string;
  price: number;
};

export default function AddToCartButton({ id, name, price }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({ id, name, price });
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
