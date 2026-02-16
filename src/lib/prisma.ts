import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { getQueryLoggingExtension } from "./prisma-logger";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof getBasePrismaClient> | undefined;
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
    const absolutePath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);

    adapter = new PrismaBetterSqlite3({ url: absolutePath });
  } else {
    return new PrismaClient({
      log: isDev ? ["error", "warn"] : ["error"],
    });
  }

  return new PrismaClient({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adapter: adapter as any, // Only place keeping 'any' because Prisma adapter types are complex and intentionally used this way in multi-adapter setup
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
