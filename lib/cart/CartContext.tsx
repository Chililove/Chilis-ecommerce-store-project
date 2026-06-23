// Shared shopping-cart state, persisted to localStorage and exposed via Context.

"use client";

import { createContext, useContext, useSyncExternalStore, ReactNode } from "react";

const STORAGE_KEY = "tiny-chili-cart";

export type CartItem = {
  id: string;
  name: string;
  price: number; // unit price in DKK
  quantity: number;
};

// Stable empty-array reference. useSyncExternalStore requires getServerSnapshot
// to return the same value every call, or React warns about an infinite loop.
const EMPTY_CART: CartItem[] = [];

let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY_CART;

// Cache the parsed cart so the snapshot keeps a stable reference until the
// stored value actually changes.
function getSnapshot(): CartItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedItems = raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      cachedItems = []; // ignore corrupt stored data
    }
  }
  return cachedItems;
}

// Server has no localStorage; returning the same empty value the first client
// render starts from keeps hydration consistent.
function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

// Also listen for the browser "storage" event so changes in other tabs sync here.
const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function save(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((listener) => listener());
}

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  totalItems: number; // total quantity across all lines
  totalPrice: number; // grand total in DKK
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function addItem(product: Omit<CartItem, "quantity">) {
    const existing = items.find((item) => item.id === product.id);
    const next = existing
      ? items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...items, { ...product, quantity: 1 }];
    save(next);
  }

  function removeItem(id: string) {
    save(items.filter((item) => item.id !== id));
  }

  // Dropping to zero or below removes the item entirely.
  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      save(items.filter((item) => item.id !== id));
      return;
    }
    save(
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }

  function clear() {
    save([]);
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }
  return context;
}
