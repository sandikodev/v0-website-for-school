import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { getQueryLoggingExtension } from "./prisma-logger";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

const getBasePrismaClient = () => {
  const url = process.env.DATABASE_URL || "";
  let adapter;

  if (url.startsWith("libsql:") || url.startsWith("https:")) {
    adapter = new PrismaLibSql({
      url: process.env.DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  } else {
    // Default to better-sqlite3 for local development
    const dbPath = url.replace("file:", "") || "./prisma/dev.db";
    adapter = new PrismaBetterSqlite3({ url: dbPath });
  }

  return new PrismaClient({
    adapter: adapter as any,
    log: process.env.NODE_ENV === "development"
      ? ["error", "warn"]
      : ["error"],
  });
};

const basePrisma = globalForPrisma.prisma ?? getBasePrismaClient();

// Apply query logging extension in development
export const prisma = process.env.NODE_ENV === "development"
  ? basePrisma.$extends(getQueryLoggingExtension())
  : basePrisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = basePrisma;

export default prisma;
