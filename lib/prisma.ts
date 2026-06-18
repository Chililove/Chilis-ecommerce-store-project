// =============================================================================
//  PRISMA CLIENT  —  one shared database connection for the whole app
// =============================================================================
//  This is the Singleton pattern: we create ONE Prisma client and reuse it
//  everywhere, instead of opening a new database connection on every request.
//  The `globalForPrisma` trick stops Next.js's hot-reload (in development)
//  from creating a brand-new client every time you save a file.
//
//  Note on imports (Prisma v7):
//   - PrismaClient is imported from the generated folder WITH "/client" at the
//     end. This folder doesn't exist until you run a migration or
//     `npx prisma generate`, so your editor may show a red squiggle until then.
//   - PrismaPg is the adapter that connects Prisma to a PostgreSQL database.
// =============================================================================

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// The adapter reads database URL from the environment (.env).
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
