// =============================================================================
//  ORDER REPOSITORY  —  the ONLY place that reads/writes orders
// =============================================================================
//  Same repository pattern as products: all order database access lives here.
// =============================================================================

import prisma from "@/lib/prisma";

export const orderRepository = {
  // Create a paid order together with its line items in one go. Prisma's
  // "nested create" inserts the Order AND its OrderItems in a single call —
  // and because they're created together, the foreign keys line up correctly
  // Find an order by its Stripe session id. Used to check whether we've already
  // processed a given checkout (idempotency).
  findByStripeSessionId(stripeSessionId: string) {
    return prisma.order.findUnique({ where: { stripeSessionId } });
  },

  createPaidOrder(data: {
    email: string;
    totalPrice: number;
    stripeSessionId: string;
    items: { productId: string; quantity: number; price: number }[];
  }) {
    return prisma.order.create({
      data: {
        email: data.email,
        totalPrice: data.totalPrice,
        status: "PAID",
        stripeSessionId: data.stripeSessionId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price, // snapshot of the price at purchase time
          })),
        },
      },
    });
  },
};
