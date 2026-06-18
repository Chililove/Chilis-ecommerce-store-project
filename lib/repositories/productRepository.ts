// =============================================================================
//  PRODUCT REPOSITORY  —  the ONLY place that reads/writes products
// =============================================================================
//  "repository pattern". Instead of writing database queries all
//  over the pages, we collect them here behind clear, named functions.
//
//  Rule: pages and components should call these functions — they should never
//  import `prisma` directly. This keeps a clean boundary between "how we get
//  data" and "how we show data".
// =============================================================================

import prisma from "@/lib/prisma";

export const productRepository = {
  // Get every product, newest first.
  findAll() {
    return prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  // Get a single product by its id. Returns null if it doesn't exist.
  findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
    });
  },

  // Get many products at once by their ids. Used at checkout to look up the
  // REAL prices from the database (never trust prices sent by the browser).
  findManyByIds(ids: string[]) {
    return prisma.product.findMany({
      where: { id: { in: ids } },
    });
  },

  // Reduce a product's stock after a sale. `decrement` is a Prisma helper that
  // subtracts atomically in the database.
  decrementStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  },
};
