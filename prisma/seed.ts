// =============================================================================
//  SEED SCRIPT  —  fills database with data
// =============================================================================
//  Run it with:  npm run db:seed   (or: npx tsx prisma/seed.ts)
// =============================================================================

import "dotenv/config";
import prisma from "../lib/prisma";

async function main() {
  console.log("Seeding chili plants...");

  // Clear existing rows first so re-running gives a clean slate.
  // ORDER MATTERS because of foreign keys: delete the "child" rows that point
  // at others BEFORE the rows they depend on. Otherwise you get "Foreign key constraint failed" errors.
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  // Prices are strings to stay exact for the Decimal column. They're in DKK.
  const products = [
    {
      name: "Bird's Eye Chili",
      description: "A pocket-sized Thai bird's eye plant — tiny pot, mighty heat.",
      price: "49.00",
      stock: 40,
      imageUrl: "/products/birds-eye.png",
    },
    {
      name: "Jalapeño Sprout",
      description: "Mild, friendly, and happy on a sunny windowsill.",
      price: "59.00",
      stock: 35,
      imageUrl: "/products/jalepenos-plant.png",
    },
    {
      name: "Tabasco Tiny",
      description: "An upright little plant covered in fiery red pods.",
      price: "69.00",
      stock: 25,
      imageUrl: "/products/fire-chili.png",
    },
    {
      name: "Habanero Mini",
      description: "A small plant with fierce, fruity heat. Handle with care.",
      price: "79.00",
      stock: 20,
      imageUrl: "/products/habanero.png",
    },
    {
      name: "Scotch Bonnet Baby",
      description: "A Caribbean classic in a tiny terracotta pot.",
      price: "89.00",
      stock: 15,
      imageUrl: "/products/red-chilis.png",
    },
    {
      name: "Carolina Reaper Seedling",
      description: "The world-famous scorcher, as a tiny starter plant.",
      price: "129.00",
      stock: 8,
      imageUrl: "/products/carolinareap.png",
    },
  ];

  const result = await prisma.product.createMany({ data: products });

  console.log(`Done. Inserted ${result.count} chili plants.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
