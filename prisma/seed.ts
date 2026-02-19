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

type SourceCategory = "INDUSTRY_NEWS" | "AI_LAB" | "RESEARCH_ANALYSIS";

const SOURCES: { name: string; url: string; category: SourceCategory }[] = [
  // ── Industry News ──
  {
    name: "The Verge - AI",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    category: "INDUSTRY_NEWS",
  },
  {
    name: "TechCrunch - AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "INDUSTRY_NEWS",
  },
  {
    name: "Ars Technica - AI",
    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
    category: "INDUSTRY_NEWS",
  },
  {
    name: "VentureBeat - AI",
    url: "https://venturebeat.com/category/ai/feed/",
    category: "INDUSTRY_NEWS",
  },
  {
    name: "IEEE Spectrum - AI",
    url: "https://spectrum.ieee.org/feeds/topic/artificial-intelligence.rss",
    category: "INDUSTRY_NEWS",
  },
  // ── AI Lab ──
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss.xml",
    category: "AI_LAB",
  },
  // Anthropic has no official RSS feed; their news is covered by industry sources
  {
    name: "Google AI Blog",
    url: "https://blog.google/technology/ai/rss/",
    category: "AI_LAB",
  },
  {
    name: "Google DeepMind",
    url: "https://deepmind.google/blog/rss.xml",
    category: "AI_LAB",
  },
  {
    name: "Microsoft Research",
    url: "https://www.microsoft.com/en-us/research/feed/",
    category: "AI_LAB",
  },
  {
    name: "NVIDIA Technical Blog",
    url: "https://developer.nvidia.com/blog/feed/",
    category: "AI_LAB",
  },
  {
    name: "Hugging Face Blog",
    url: "https://huggingface.co/blog/feed.xml",
    category: "AI_LAB",
  },
  // ── Research & Analysis ──
  {
    name: "MIT Technology Review - AI",
    url: "https://www.technologyreview.com/topic/artificial-intelligence/feed",
    category: "RESEARCH_ANALYSIS",
  },
  {
    name: "Import AI",
    url: "https://importai.substack.com/feed",
    category: "RESEARCH_ANALYSIS",
  },
  {
    name: "AI Alignment Forum",
    url: "https://www.alignmentforum.org/feed.xml",
    category: "RESEARCH_ANALYSIS",
  },
  {
    name: "The Gradient",
    url: "https://thegradient.pub/rss/",
    category: "RESEARCH_ANALYSIS",
  },
  {
    name: "Interconnects AI",
    url: "https://www.interconnects.ai/feed",
    category: "RESEARCH_ANALYSIS",
  },
  {
    name: "MIT News - AI",
    url: "https://news.mit.edu/rss/topic/artificial-intelligence2",
    category: "RESEARCH_ANALYSIS",
  },
  // ── Industry-Vertical AI Coverage ──
  // SaaS & Software
  {
    name: "The New Stack",
    url: "https://thenewstack.io/feed/",
    category: "INDUSTRY_NEWS",
  },
  {
    name: "SaaStr",
    url: "https://www.saastr.com/feed/",
    category: "INDUSTRY_NEWS",
  },
  // Fintech / Financial Services
  {
    name: "PYMNTS - AI",
    url: "https://www.pymnts.com/category/artificial-intelligence-2/feed/",
    category: "INDUSTRY_NEWS",
  },
  {
    name: "TechCrunch - Fintech",
    url: "https://techcrunch.com/category/fintech/feed/",
    category: "INDUSTRY_NEWS",
  },
  // Healthcare / Life Sciences
  {
    name: "Fierce Healthcare",
    url: "https://www.fiercehealthcare.com/rss/xml",
    category: "INDUSTRY_NEWS",
  },
  {
    name: "Fierce Biotech",
    url: "https://www.fiercebiotech.com/rss/xml",
    category: "INDUSTRY_NEWS",
  },
  // Cybersecurity
  {
    name: "Dark Reading",
    url: "https://www.darkreading.com/rss.xml",
    category: "INDUSTRY_NEWS",
  },
  {
    name: "SecurityWeek",
    url: "https://www.securityweek.com/feed/",
    category: "INDUSTRY_NEWS",
  },
  // E-commerce & Retail
  {
    name: "Retail Dive - Technology",
    url: "https://www.retaildive.com/feeds/topic/technology/",
    category: "INDUSTRY_NEWS",
  },
  // Legal & LegalTech
  {
    name: "Artificial Lawyer",
    url: "https://www.artificiallawyer.com/feed/",
    category: "INDUSTRY_NEWS",
  },
  // Media & Entertainment
  {
    name: "The Hollywood Reporter - AI",
    url: "https://www.hollywoodreporter.com/t/ai-3/feed/",
    category: "INDUSTRY_NEWS",
  },
  {
    name: "Variety",
    url: "https://variety.com/feed/",
    category: "INDUSTRY_NEWS",
  },
  // Education & EdTech
  {
    name: "EdSurge",
    url: "https://www.edsurge.com/articles_rss",
    category: "INDUSTRY_NEWS",
  },
  {
    name: "eSchool News",
    url: "https://www.eschoolnews.com/feed/",
    category: "INDUSTRY_NEWS",
  },
];

async function main() {
  console.log("Seeding sources...");

  const activeUrls = new Set(SOURCES.map((s) => s.url));

  for (const source of SOURCES) {
    await prisma.source.upsert({
      where: { url: source.url },
      create: { name: source.name, url: source.url, type: "RSS", category: source.category, active: true },
      update: { name: source.name, category: source.category },
    });
    console.log(`  Upserted: ${source.name}`);
  }

  // Deactivate any sources no longer in the seed list
  const deactivated = await prisma.source.updateMany({
    where: { url: { notIn: [...activeUrls] } },
    data: { active: false },
  });
  if (deactivated.count > 0) {
    console.log(`  Deactivated ${deactivated.count} removed source(s).`);
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
