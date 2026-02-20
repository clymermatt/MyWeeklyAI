import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBrief, generateFreeBrief } from "@/lib/llm/generate-brief";
import { rankNewsForUser } from "@/lib/llm/relevance-scorer";
import { sendWeeklyBrief } from "@/lib/email/send";
import { freeBriefToBriefOutput } from "@/types/brief";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.contextProfile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(profile);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Check if user already has a digest (to detect first-time profile creation)
  const existingDigest = await prisma.weeklyDigest.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  const profile = await prisma.contextProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      roleTitle: body.roleTitle ?? null,
      industry: body.industry ?? null,
      goals: body.goals ?? [],
      tools: body.tools ?? [],
      workflows: body.workflows ?? null,
      experienceLevel: body.experienceLevel ?? null,
      focusTopics: body.focusTopics ?? [],
      avoidTopics: body.avoidTopics ?? [],
    },
    update: {
      roleTitle: body.roleTitle ?? null,
      industry: body.industry ?? null,
      goals: body.goals ?? [],
      tools: body.tools ?? [],
      workflows: body.workflows ?? null,
      experienceLevel: body.experienceLevel ?? null,
      focusTopics: body.focusTopics ?? [],
      avoidTopics: body.avoidTopics ?? [],
    },
  });

  // Trigger instant briefing on first profile creation (non-blocking)
  if (!existingDigest) {
    generateInstantBriefing(session.user.id, profile).catch((err) =>
      console.error("Instant briefing failed:", err),
    );
  }

  return NextResponse.json(profile);
}

async function generateInstantBriefing(
  userId: string,
  profile: Awaited<ReturnType<typeof prisma.contextProfile.upsert>>,
) {
  const periodEnd = new Date();
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - 7);

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { subscription: true },
  });

  const isPaid = user.subscription?.status === "ACTIVE";

  const allNewsItems = await prisma.newsItem.findMany({
    where: { publishedAt: { gte: periodStart } },
    include: { source: { select: { name: true, category: true } } },
    orderBy: { publishedAt: "desc" },
    take: 200,
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

    await sendWeeklyBrief({
      to: user.email,
      userName: user.name ?? undefined,
      brief: briefJson as never,
      isFree,
      periodStart,
      periodEnd,
      profileTerms,
    });
  } catch (emailErr) {
    console.error("Instant briefing email failed:", emailErr);
  }
}
