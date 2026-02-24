import { prisma } from "@/lib/prisma";
import { runIngestion } from "@/lib/ingestion/ingest";
import { generateBrief } from "@/lib/llm/generate-brief";
import { generateFreeBrief } from "@/lib/llm/generate-brief";
import { rankNewsForUser } from "@/lib/llm/relevance-scorer";
import { deliverBrief } from "@/lib/delivery/send-brief";
import type { BriefOutput } from "@/types/brief";
import { freeBriefToBriefOutput } from "@/types/brief";

export interface DigestResult {
  freeUsersProcessed: number;
  paidUsersProcessed: number;
  emailsSent: number;
  telegramsSent: number;
  errors: string[];
}

/** Extract all article URLs from a stored brief */
function extractUrlsFromBrief(briefJson: unknown): Set<string> {
  const urls = new Set<string>();
  const brief = briefJson as BriefOutput;
  if (!brief) return urls;
  for (const item of brief.whatDropped ?? []) urls.add(item.url);
  for (const item of brief.relevantToYou ?? []) urls.add(item.url);
  for (const item of brief.whatToTest ?? []) urls.add(item.url);
  return urls;
}

export async function runWeeklyDigest(): Promise<DigestResult> {
  // Step 1: Run ingestion first to get fresh news
  await runIngestion();

  const periodEnd = new Date();
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - 7);

  // Step 2: Fetch news items from the past 7 days (with source category)
  const allNewsItems = await prisma.newsItem.findMany({
    where: {
      publishedAt: { gte: periodStart },
    },
    include: { source: { select: { name: true, category: true } } },
    orderBy: { publishedAt: "desc" },
    take: 400,
  });

  const industryItems = allNewsItems.filter((i) => i.source.category === "INDUSTRY_NEWS");
  const labItems = allNewsItems.filter((i) => i.source.category === "AI_LAB");

  let emailsSent = 0;
  let telegramsSent = 0;
  const errors: string[] = [];

  // ── Phase A: Generate shared free brief (1 Claude call) ──
  const freeBrief = await generateFreeBrief(industryItems, labItems);
  const freeBriefFull = freeBriefToBriefOutput(freeBrief);
  // Store subsections alongside the full shape for rendering
  const freeBriefJson = {
    ...freeBriefFull,
    industryNews: freeBrief.industryNews,
    labUpdates: freeBrief.labUpdates,
  };

  // ── Phase B: Free users (have profile, no ACTIVE subscription) ──
  const freeUsers = await prisma.user.findMany({
    where: {
      contextProfile: { isNot: null },
      OR: [
        { subscription: null },
        { subscription: { status: { not: "ACTIVE" } } },
      ],
    },
    include: { contextProfile: true },
  });

  for (const user of freeUsers) {
    try {
      // Skip if user already received a digest this period
      const existing = await prisma.weeklyDigest.findFirst({
        where: { userId: user.id, periodStart: { gte: periodStart } },
      });
      if (existing) continue;

      await prisma.weeklyDigest.create({
        data: {
          userId: user.id,
          briefJson: JSON.parse(JSON.stringify(freeBriefJson)),
          isFree: true,
          periodStart,
          periodEnd,
        },
      });

      try {
        const delivery = await deliverBrief({
          user,
          brief: freeBriefJson,
          isFree: true,
          periodStart,
          periodEnd,
        });
        if (delivery.emailSent) emailsSent++;
        if (delivery.telegramSent) telegramsSent++;
        errors.push(...delivery.errors);
      } catch (deliveryErr) {
        const msg = deliveryErr instanceof Error ? deliveryErr.message : "Unknown delivery error";
        console.log(`Delivery skipped for ${user.email}: ${msg}`);
        errors.push(`Delivery skipped for ${user.email}: ${msg}`);
      }
    } catch (err) {
      errors.push(
        `Free user ${user.email}: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }

  // ── Phase C: Paid users (ACTIVE subscription + profile) ──
  const paidUsers = await prisma.user.findMany({
    where: {
      subscription: { status: "ACTIVE" },
      contextProfile: { isNot: null },
    },
    include: {
      contextProfile: true,
      subscription: true,
    },
  });

  for (const user of paidUsers) {
    if (!user.contextProfile) continue;

    try {
      // Skip if user already received a digest this period
      const existingPaid = await prisma.weeklyDigest.findFirst({
        where: { userId: user.id, periodStart: { gte: periodStart } },
      });
      if (existingPaid) continue;

      // Dedup: get URLs from the user's last 2 digests
      const recentDigests = await prisma.weeklyDigest.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 2,
        select: { briefJson: true },
      });

      const previousUrls = new Set<string>();
      for (const d of recentDigests) {
        for (const url of extractUrlsFromBrief(d.briefJson)) {
          previousUrls.add(url);
        }
      }

      // Filter out previously featured articles
      const freshItems = allNewsItems.filter((item) => !previousUrls.has(item.url));

      // Rank and select the most relevant items for this user
      const rankedItems = rankNewsForUser(freshItems, user.contextProfile);

      const brief = await generateBrief(user.contextProfile, rankedItems);

      // Store the digest in DB
      await prisma.weeklyDigest.create({
        data: {
          userId: user.id,
          briefJson: JSON.parse(JSON.stringify(brief)),
          isFree: false,
          periodStart,
          periodEnd,
        },
      });

      try {
        const profile = user.contextProfile!;
        const profileTerms = [
          profile.roleTitle,
          profile.industry,
          ...profile.tools,
          ...profile.focusTopics,
        ].filter((t): t is string => !!t);

        const delivery = await deliverBrief({
          user,
          brief,
          isFree: false,
          periodStart,
          periodEnd,
          profileTerms,
        });
        if (delivery.emailSent) emailsSent++;
        if (delivery.telegramSent) telegramsSent++;
        errors.push(...delivery.errors);
      } catch (deliveryErr) {
        const msg = deliveryErr instanceof Error ? deliveryErr.message : "Unknown delivery error";
        console.log(`Delivery skipped for ${user.email}: ${msg}`);
        errors.push(`Delivery skipped for ${user.email}: ${msg}`);
      }
    } catch (err) {
      errors.push(
        `User ${user.email}: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }

  return {
    freeUsersProcessed: freeUsers.length,
    paidUsersProcessed: paidUsers.length,
    emailsSent,
    telegramsSent,
    errors,
  };
}
