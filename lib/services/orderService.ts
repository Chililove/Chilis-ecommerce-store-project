// Records a paid order and reduces stock. Called by the Stripe webhook on
// payment success; re-looks-up real prices server-side and snapshots them.

import { orderRepository } from "@/lib/repositories/orderRepository";
import { productRepository } from "@/lib/repositories/productRepository";

export type CartLine = { id: string; quantity: number };

export async function recordPaidOrder(params: {
  cart: CartLine[];
  email: string;
  stripeSessionId: string;
}) {
  const { cart, email, stripeSessionId } = params;

  // Idempotency: Stripe may deliver the same event twice, so skip if we already
  // saved this session to avoid a duplicate order and double stock decrement.
  const existing = await orderRepository.findByStripeSessionId(stripeSessionId);
  if (existing) {
    return;
  }

  // Look up real products so names and prices come from the database, not the client.
  const products = await productRepository.findManyByIds(cart.map((l) => l.id));

  const items = cart.map((line) => {
    const product = products.find((p) => p.id === line.id);
    if (!product) {
      throw new Error(`Unknown product in cart: ${line.id}`);
    }
    return {
      productId: product.id,
      quantity: line.quantity,
      price: Number(product.price), // price snapshot at purchase time
    };
  });

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await orderRepository.createPaidOrder({
    email,
    totalPrice,
    stripeSessionId,
    items,
  });

  for (const item of items) {
    await productRepository.decrementStock(item.productId, item.quantity);
  }
}
