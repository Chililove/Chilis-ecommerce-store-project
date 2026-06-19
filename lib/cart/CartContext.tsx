// =============================================================================
//  CART CONTEXT  —  shared shopping-cart state, persisted to localStorage
// =============================================================================
//  PROVIDER PATTERN: many components (header count, add-to-cart button, cart
//  page) need the same cart data, so it is shared through a Context.

//  "use client" is required: this runs in the browser and reacts to clicks.
// =============================================================================

"use client";

import { createContext, useContext, useSyncExternalStore, ReactNode } from "react";

const STORAGE_KEY = "tiny-chili-cart";

// The shape of a single line in the cart.
export type CartItem = {
  id: string; // the product's id
  name: string;
  price: number; // unit price in DKK
  quantity: number;
};

// ---------------------------------------------------------------------------
//  The external store: a thin wrapper around localStorage.
// ---------------------------------------------------------------------------

// cache the parsed cart so getSnapshot returns the SAME array reference when
// nothing has changed. useSyncExternalStore requires a stable reference

// One stable empty-array reference. getServerSnapshot must return the SAME
// value every call, or React warns about a possible infinite loop.
const EMPTY_CART: CartItem[] = [];

let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY_CART;

// Read the current cart from localStorage (runs in the browser).
function getSnapshot(): CartItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedItems = raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      cachedItems = []; // ignore corrupt data
    }
  }
  return cachedItems;
}

// On the server there's no localStorage, so the cart starts empty. This is the
// piece that keeps hydration safe: the server and the first client render both
// begin from this same empty value.
function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

// React calls subscribe to be told when the store changes. We keep a list of
// listeners, and also listen for the browser's "storage" event so changes made
// in OTHER tabs update this one too.
const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

// Write a new cart to localStorage and notify React to re-read the snapshot.
function save(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((listener) => listener());
}

// ---------------------------------------------------------------------------
//  The Context + Provider + hook
// ---------------------------------------------------------------------------

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  totalItems: number; // total quantity across all lines (for the header badge)
  totalPrice: number; // grand total in DKK
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Read the cart from our external store. React re-renders whenever save()
  // notifies the listeners.
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function addItem(product: Omit<CartItem, "quantity">) {
    const existing = items.find((item) => item.id === product.id);
    const next = existing
      ? // already in the cart - bump its quantity by one
        items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : // new item - add it with quantity 1
        [...items, { ...product, quantity: 1 }];
    save(next);
  }

  function removeItem(id: string) {
    save(items.filter((item) => item.id !== id));
  }

  // Set a specific quantity for one item. If it drops to zero (or below),
  // we remove the item entirely — a cart line with quantity 0 makes no sense.
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

  // Derived values — recalculated from `items`, so they can't drift out of sync.
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

// The custom hook components use to read/update the cart.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }
  return context;
}
