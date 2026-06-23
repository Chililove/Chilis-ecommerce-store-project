// The only place that reads/writes products: callers use these functions and
// never import `prisma` directly.

import prisma from "@/lib/prisma";

export const productRepository = {
  findAll() {
    return prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
    });
  },

  // Used at checkout to look up real prices server-side; never trust the browser.
  findManyByIds(ids: string[]) {
    return prisma.product.findMany({
      where: { id: { in: ids } },
    });
  },

  // Atomically reduce a product's stock after a sale.
  decrementStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  },
};
