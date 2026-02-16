import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { getQueryLoggingExtension } from "./prisma-logger";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

const getBasePrismaClient = () => {
  const envUrl = process.env.DATABASE_URL;
  const isDev = process.env.NODE_ENV === "development";

  // In development, if URL is missing or looks like a placeholder, use local SQLite
  let url = envUrl || "file:./prisma/dev.db";

  // FIX: Some environments inject a mock Postgres URL. 
  // If we are in dev and see postgres but have a local dev.db, use the db.
  if (isDev && url.startsWith("postgresql:") && !url.includes("localhost") && !url.includes("127.0.0.1")) {
    console.log("[Prisma] Overriding unexpected Postgres URL in dev mode");
    url = "file:./prisma/dev.db";
  }

  let adapter;

  if (url.startsWith("libsql:") || url.startsWith("https:")) {
    adapter = new PrismaLibSql({
      url: url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  } else if (url.startsWith("file:") || url.includes(".db") || !url.includes("://")) {
    const dbPath = url.startsWith("file:") ? url.replace("file:", "") : url;
    const path = require('path');
    const absolutePath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);

    adapter = new PrismaBetterSqlite3({ url: absolutePath });
  } else {
    return new PrismaClient({
      log: isDev ? ["error", "warn"] : ["error"],
    });
  }

  return new PrismaClient({
    adapter: adapter as any,
    log: isDev ? ["error", "warn"] : ["error"],
  });
};

const basePrisma = globalForPrisma.prisma ?? getBasePrismaClient();

// Apply query logging extension in development
export const prisma = process.env.NODE_ENV === "development"
  ? basePrisma.$extends(getQueryLoggingExtension())
  : basePrisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = basePrisma;

export default prisma;
