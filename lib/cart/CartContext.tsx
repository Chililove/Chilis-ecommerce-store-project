// =============================================================================
//  CART CONTEXT  —  shared shopping-cart state for the whole app
// =============================================================================
//  PROVIDER PATTERN. The problem it solves: lots of separate
//  components (the header count, the "Add to cart" button, the cart page) all
//  need the same cart data.
//
//  The solution: creating a single "cart context" that holds the cart data
//
//  "use client" is required because this uses React state and runs in the
//  browser (the cart changes as the user clicks).
// =============================================================================

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// The shape of a single line in the cart.
export type CartItem = {
  id: string; // the product's id
  name: string;
  price: number; // unit price in DKK
  quantity: number;
};

// Everything the cart exposes to the rest of the app.
type CartContextValue = {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  totalItems: number; // total quantity across all lines (for the header badge)
  totalPrice: number; // grand total in DKK
};

// 1. The Context. It's null until a Provider supplies a real value.
const CartContext = createContext<CartContextValue | null>(null);

// 2. The Provider. Wraps app in this (we do it in app/layout.tsx) and every
//    component inside gains access to the cart.
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(product: Omit<CartItem, "quantity">) {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        // Already in the cart → bump its quantity by one.
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // New item → add it with quantity 1.
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function clear() {
    setItems([]);
  }

  // Derived values — recalculated from `items` on every render. We don't store
  // these separately, because that risks them getting out of sync.
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    clear,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 3. The custom hook. Components call useCart() to read/update the cart.
//    The guard makes the mistake of using it outside the Provider obvious,
//    instead of a confusing "cannot read property of null" later.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }
  return context;
}
