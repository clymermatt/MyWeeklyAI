import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

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

const pool = new pg.Pool({ connectionString: getDirectDatabaseUrl() });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
  });

  if (users.length === 0) {
    console.log("No users found.");
    return;
  }

  console.log("Users:");
  users.forEach((u, i) => console.log(`  ${i + 1}. ${u.email} (${u.name ?? "no name"})`));

  // Fully delete the first user and all related data
  const user = users[0];
  console.log(`\nDeleting user entirely: ${user.email}`);

  // Delete child records first (order matters for foreign keys)
  const deleted = await Promise.all([
    prisma.subscription.deleteMany({ where: { userId: user.id } }),
    prisma.contextProfile.deleteMany({ where: { userId: user.id } }),
    prisma.weeklyDigest.deleteMany({ where: { userId: user.id } }),
    prisma.bookmark.deleteMany({ where: { userId: user.id } }),
    prisma.account.deleteMany({ where: { userId: user.id } }),
    prisma.session.deleteMany({ where: { userId: user.id } }),
  ]);

  console.log(`  Subscriptions deleted: ${deleted[0].count}`);
  console.log(`  Context profiles deleted: ${deleted[1].count}`);
  console.log(`  Weekly digests deleted: ${deleted[2].count}`);
  console.log(`  Bookmarks deleted: ${deleted[3].count}`);
  console.log(`  Accounts deleted: ${deleted[4].count}`);
  console.log(`  Sessions deleted: ${deleted[5].count}`);

  // Now delete the user record
  await prisma.user.delete({ where: { id: user.id } });
  console.log(`  User record deleted`);

  console.log("\nDone! User completely removed — next sign-in will create a fresh account.");
}

main()
  .catch(console.error)
  .finally(() => pool.end());
