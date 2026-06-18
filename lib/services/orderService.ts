// =============================================================================
//  ORDER SERVICE  —  records a paid order and reduces stock
// =============================================================================
//  Called by the Stripe webhook once a payment succeeds. Like the checkout
//  service, it re-looks-up the real products from the database rather than
//  trusting numbers from outside, and it snapshots each price at purchase time.
// =============================================================================

import { orderRepository } from "@/lib/repositories/orderRepository";
import { productRepository } from "@/lib/repositories/productRepository";

export type CartLine = { id: string; quantity: number };

export async function recordPaidOrder(params: {
  cart: CartLine[];
  email: string;
}) {
  const { cart, email } = params;

  // Look up the real products so we use trusted names and prices.
  const products = await productRepository.findManyByIds(cart.map((l) => l.id));

  const items = cart.map((line) => {
    const product = products.find((p) => p.id === line.id);
    if (!product) {
      throw new Error(`Unknown product in cart: ${line.id}`);
    }
    return {
      productId: product.id,
      quantity: line.quantity,
      price: Number(product.price), // snapshot of the price at purchase time
    };
  });

  // Grand total in kroner.
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Save the order (with its line items).
  await orderRepository.createPaidOrder({ email, totalPrice, items });

  // Reduce stock for each item sold.
  for (const item of items) {
    await productRepository.decrementStock(item.productId, item.quantity);
  }
}
