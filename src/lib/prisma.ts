import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDirectDatabaseUrl(): string {
  const url = process.env.DATABASE_URL!;
  if (url.includes("prisma+postgres://")) {
    const apiKey = url.split("api_key=")[1];
    let padded = apiKey;
    const rem = padded.length % 4;
    if (rem > 0) padded += "=".repeat(4 - rem);
    const decoded = JSON.parse(
      Buffer.from(padded, "base64url").toString("utf-8"),
    );
    return decoded.databaseUrl;
  }
  return url;
}

function createPrismaClient() {
  const pool = new pg.Pool({ connectionString: getDirectDatabaseUrl() });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
