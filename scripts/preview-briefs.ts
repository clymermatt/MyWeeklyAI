/**
 * Preview script — ingests fresh articles, then generates sample briefs
 * for a few role/industry profiles. No database writes, no emails sent.
 *
 * Usage: npx tsx scripts/preview-briefs.ts
 */
import "dotenv/config";
import { fetchRSSFeed } from "../src/lib/ingestion/rss-fetcher";
import { normalizeItems } from "../src/lib/ingestion/normalize";
import { scoreRelevance } from "../src/lib/llm/relevance-scorer";
import { generateBrief } from "../src/lib/llm/generate-brief";
import type { ContextProfile, NewsItem } from "../src/generated/prisma/client";

// ── Sample profiles to test ──

const PROFILES: Partial<ContextProfile>[] = [
  {
    roleTitle: "Software Engineer",
    industry: "SaaS / Software",
    experienceLevel: "Mid-level",
    goals: ["Stay current on AI coding tools", "Evaluate new frameworks"],
    tools: ["TypeScript", "React", "Cursor", "GitHub Copilot"],
    focusTopics: ["AI agents", "code generation"],
    avoidTopics: [],
  },
  {
    roleTitle: "CEO / Founder",
    industry: "Fintech / Financial Services",
    experienceLevel: "Executive",
    goals: ["AI strategy for fintech startup", "Competitive intelligence"],
    tools: ["Stripe", "Plaid"],
    focusTopics: ["AI regulation", "fraud detection"],
    avoidTopics: [],
  },
  {
    roleTitle: "Product Manager",
    industry: "Healthcare / Life Sciences",
    experienceLevel: "Senior",
    goals: ["Add AI features to health platform", "Understand FDA AI guidelines"],
    tools: ["Epic", "Figma"],
    focusTopics: ["clinical AI", "patient engagement"],
    avoidTopics: [],
  },
  {
    roleTitle: "Marketing Manager",
    industry: "Cybersecurity",
    experienceLevel: "Mid-level",
    goals: ["Use AI for content marketing", "Track competitor AI messaging"],
    tools: ["HubSpot", "Semrush"],
    focusTopics: ["AI security threats", "thought leadership"],
    avoidTopics: [],
  },
];

// ── Sources (same as seed.ts) ──

const SOURCES = [
  { name: "The Verge - AI", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml" },
  { name: "TechCrunch - AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
  { name: "VentureBeat - AI", url: "https://venturebeat.com/category/ai/feed/" },
  { name: "Ars Technica - AI", url: "https://feeds.arstechnica.com/arstechnica/technology-lab" },
  { name: "OpenAI Blog", url: "https://openai.com/blog/rss.xml" },
  { name: "Anthropic News", url: "https://www.anthropic.com/news/rss.xml" },
  { name: "Google AI Blog", url: "https://blog.google/technology/ai/rss/" },
  { name: "The New Stack", url: "https://thenewstack.io/feed/" },
  { name: "SaaStr", url: "https://www.saastr.com/feed/" },
  { name: "PYMNTS - AI", url: "https://www.pymnts.com/category/artificial-intelligence-2/feed/" },
  { name: "TechCrunch - Fintech", url: "https://techcrunch.com/category/fintech/feed/" },
  { name: "Fierce Healthcare", url: "https://www.fiercehealthcare.com/rss/xml" },
  { name: "Fierce Biotech", url: "https://www.fiercebiotech.com/rss/xml" },
  { name: "Dark Reading", url: "https://www.darkreading.com/rss.xml" },
  { name: "SecurityWeek", url: "https://www.securityweek.com/feed/" },
  { name: "Retail Dive - Technology", url: "https://www.retaildive.com/feeds/topic/technology/" },
  { name: "Artificial Lawyer", url: "https://www.artificiallawyer.com/feed/" },
  { name: "The Hollywood Reporter - AI", url: "https://www.hollywoodreporter.com/t/ai-3/feed/" },
  { name: "EdSurge", url: "https://www.edsurge.com/articles_rss" },
  { name: "MIT Technology Review - AI", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed" },
];

async function main() {
  console.log("=== BRIEF PREVIEW GENERATOR ===\n");

  // Step 1: Fetch and normalize articles from all sources
  console.log("Fetching articles from", SOURCES.length, "sources...\n");

  const allArticles: NewsItem[] = [];
  for (const source of SOURCES) {
    try {
      const { items, error } = await fetchRSSFeed(source.url);
      if (error) {
        console.log(`  ⚠ ${source.name}: ${error}`);
        continue;
      }
      const normalized = normalizeItems(items);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recent = normalized.filter((i) => i.publishedAt >= sevenDaysAgo);

      // Convert to NewsItem shape for the scorer
      for (const item of recent) {
        allArticles.push({
          id: `${source.name}-${item.url}`,
          sourceId: source.name,
          title: item.title,
          url: item.url,
          publishedAt: item.publishedAt,
          summary: item.summary,
          contentSnippet: item.contentSnippet,
          tags: item.tags,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as NewsItem);
      }
      console.log(`  ✓ ${source.name}: ${recent.length} AI-relevant articles (${items.length} total)`);
    } catch (err) {
      console.log(`  ✗ ${source.name}: failed`);
    }
  }

  console.log(`\nTotal AI-relevant articles from past 7 days: ${allArticles.length}\n`);

  // Step 2: For each profile, score articles and generate a brief
  for (const profile of PROFILES) {
    const label = `${profile.roleTitle} — ${profile.industry}`;
    console.log("━".repeat(60));
    console.log(`\n📋 PROFILE: ${label}`);
    console.log(`   Tools: ${profile.tools?.join(", ")}`);
    console.log(`   Focus: ${profile.focusTopics?.join(", ")}\n`);

    // Score and rank
    const scored = allArticles
      .map((item) => ({
        item,
        score: scoreRelevance(item, profile as ContextProfile),
      }))
      .sort((a, b) => b.score - a.score);

    const relevant = scored.filter((s) => s.score > 0);
    console.log(`   Relevance scoring: ${relevant.length}/${allArticles.length} articles matched`);
    console.log(`   Top 5 scored articles:`);
    for (const { item, score } of scored.slice(0, 5)) {
      console.log(`     [${score}] ${item.title}`);
    }

    // Select top items for the brief
    const topItems = scored.slice(0, 30).map((s) => s.item);

    console.log(`\n   Generating brief with Claude...\n`);

    try {
      const brief = await generateBrief(profile as ContextProfile, topItems);

      console.log("   📰 WHAT DROPPED:");
      for (const item of brief.whatDropped) {
        console.log(`     • ${item.title}`);
        console.log(`       ${item.summary}\n`);
      }

      console.log("   🎯 RELEVANT TO YOU:");
      for (const item of brief.relevantToYou) {
        console.log(`     • ${item.title}`);
        console.log(`       Why: ${item.relevanceNote}\n`);
      }

      console.log("   🧪 WHAT TO TEST:");
      for (const item of brief.whatToTest) {
        console.log(`     • ${item.title}`);
        console.log(`       ${item.summary}\n`);
      }

      console.log("   🚫 FILTERED OUT:");
      console.log(`     ${brief.ignoreSummary}\n`);
    } catch (err) {
      console.log(`   ✗ Brief generation failed: ${err instanceof Error ? err.message : err}\n`);
    }
  }

  console.log("━".repeat(60));
  console.log("\nDone!");
}

main().catch(console.error);
