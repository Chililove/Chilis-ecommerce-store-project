// =============================================================================
//  SEED SCRIPT  —  fills database with data
// =============================================================================
//  Run it with:  npx tsx prisma/seed.ts
// =============================================================================

import "dotenv/config";
import prisma from "../lib/prisma";

async function main() {
  console.log(" Seeding products...");

  // Prices are strings to stay exact for the Decimal column. They're in DKK.
  const products = [
    {
      name: "Minimalist Desk Lamp",
      description: "A warm LED lamp with a brushed-steel finish.",
      price: "299.00",
      stock: 25,
      imageUrl: null,
    },
    {
      name: "Ceramic Coffee Mug",
      description: "Hand-glazed 350ml mug, dishwasher safe.",
      price: "89.50",
      stock: 60,
      imageUrl: null,
    },
    {
      name: "Wool Throw Blanket",
      description: "Soft Scandinavian wool blanket, 130x170cm.",
      price: "549.00",
      stock: 12,
      imageUrl: null,
    },
    {
      name: "Notebook (A5, dotted)",
      description: "120gsm dotted pages, hardcover, 192 pages.",
      price: "129.95",
      stock: 100,
      imageUrl: null,
    },
  ];

  // createMany inserts them all in one go. skipDuplicates avoids errors if you
  // run the seed twice (it won't re-add a product with the same unique value).
  const result = await prisma.product.createMany({ data: products });

  console.log(` Done. Inserted ${result.count} products.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
