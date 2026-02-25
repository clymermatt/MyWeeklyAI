import { prisma } from "@/lib/prisma";
import { generateBrief, generateFreeBrief } from "@/lib/llm/generate-brief";
import { rankNewsForUser } from "@/lib/llm/relevance-scorer";
import { deliverBrief } from "@/lib/delivery/send-brief";
import { freeBriefToBriefOutput } from "@/types/brief";

/**
 * Generate and deliver an instant brief for a user.
 * Works for both free and paid users based on subscription status.
 */
export async function generateInstantBriefing(userId: string) {
  const periodEnd = new Date();
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - 7);

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { subscription: true, contextProfile: true },
  });

  const profile = user.contextProfile;
  if (!profile) return;

  const isPaid = user.subscription?.status === "ACTIVE";

  const allNewsItems = await prisma.newsItem.findMany({
    where: { publishedAt: { gte: periodStart } },
    include: { source: { select: { name: true, category: true } } },
    orderBy: { publishedAt: "desc" },
    take: 400,
  });

  if (allNewsItems.length === 0) return;

  let briefJson: Record<string, unknown>;
  let isFree: boolean;

  if (isPaid) {
    const rankedItems = rankNewsForUser(allNewsItems, profile);
    const brief = await generateBrief(profile, rankedItems);
    briefJson = JSON.parse(JSON.stringify(brief));
    isFree = false;
  } else {
    const industryItems = allNewsItems.filter(
      (i) => i.source.category === "INDUSTRY_NEWS",
    );
    const labItems = allNewsItems.filter(
      (i) => i.source.category === "AI_LAB",
    );
    const freeBrief = await generateFreeBrief(industryItems, labItems);
    const freeBriefFull = freeBriefToBriefOutput(freeBrief);
    briefJson = {
      ...JSON.parse(JSON.stringify(freeBriefFull)),
      industryNews: freeBrief.industryNews,
      labUpdates: freeBrief.labUpdates,
    };
    isFree = true;
  }

  await prisma.weeklyDigest.create({
    data: {
      userId,
      briefJson: briefJson as never,
      isFree,
      periodStart,
      periodEnd,
    },
  });

  try {
    const profileTerms = [
      profile.roleTitle,
      profile.industry,
      ...profile.tools,
      ...profile.focusTopics,
    ].filter((t): t is string => !!t);

    await deliverBrief({
      user,
      brief: briefJson as never,
      isFree,
      periodStart,
      periodEnd,
      profileTerms,
    });
  } catch (deliveryErr) {
    console.error("Instant briefing delivery failed:", deliveryErr);
  }
}
