import { PrismaClient } from "@prisma/client";

declare global {
  var __rugunaPrisma: PrismaClient | undefined;
}

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!global.__rugunaPrisma) {
    global.__rugunaPrisma = new PrismaClient();
  }

  return global.__rugunaPrisma;
}
