// The only place that reads/writes orders.

import prisma from "@/lib/prisma";

export const orderRepository = {
  // Idempotency check: has this checkout session already been processed?
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
            price: item.price, // price snapshot at purchase time
          })),
        },
      },
    });
  },
};
