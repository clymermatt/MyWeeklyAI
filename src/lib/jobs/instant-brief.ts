import { prisma } from "@/lib/prisma";
import { generateBrief } from "@/lib/llm/generate-brief";
import { rankNewsForUser } from "@/lib/llm/relevance-scorer";
import { deliverBrief } from "@/lib/delivery/send-brief";

/**
 * Generate and deliver an instant personalized brief for a user.
 */
export async function generateInstantBriefing(userId: string) {
  const periodEnd = new Date();
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - 7);

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { contextProfile: true },
  });

  if (user.unsubscribedAt) return;

  const profile = user.contextProfile;
  if (!profile) return;

  const allNewsItems = await prisma.newsItem.findMany({
    where: { publishedAt: { gte: periodStart } },
    include: { source: { select: { name: true, category: true } } },
    orderBy: { publishedAt: "desc" },
    take: 400,
  });

  if (allNewsItems.length === 0) return;

  const rankedItems = rankNewsForUser(allNewsItems, profile);
  const brief = await generateBrief(profile, rankedItems);
  const briefJson = JSON.parse(JSON.stringify(brief));

  await prisma.weeklyDigest.create({
    data: {
      userId,
      briefJson: briefJson as never,
      isFree: false,
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
      periodStart,
      periodEnd,
      profileTerms,
    });
  } catch (deliveryErr) {
    console.error("Instant briefing delivery failed:", deliveryErr);
  }
}
