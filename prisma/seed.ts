import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

function getDirectDatabaseUrl(): string {
  const url = process.env.DATABASE_URL!;
  // If it's a prisma+postgres proxy URL, extract the direct URL from the api_key
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

const SOURCES = [
  {
    name: "The Verge - AI",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
  },
  {
    name: "TechCrunch - AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
  },
  {
    name: "MIT Technology Review - AI",
    url: "https://www.technologyreview.com/topic/artificial-intelligence/feed",
  },
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss.xml",
  },
  {
    name: "Anthropic News",
    url: "https://www.anthropic.com/news/rss.xml",
  },
  {
    name: "Google AI Blog",
    url: "https://blog.google/technology/ai/rss/",
  },
  {
    name: "Ars Technica - AI",
    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
  },
  {
    name: "VentureBeat - AI",
    url: "https://venturebeat.com/category/ai/feed/",
  },
];

async function main() {
  console.log("Seeding sources...");

  for (const source of SOURCES) {
    await prisma.source.upsert({
      where: { url: source.url },
      create: { name: source.name, url: source.url, type: "RSS", active: true },
      update: { name: source.name },
    });
    console.log(`  Upserted: ${source.name}`);
  }

  console.log("Done seeding.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
