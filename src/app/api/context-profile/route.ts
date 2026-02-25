import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInstantBriefing } from "@/lib/jobs/instant-brief";

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
    generateInstantBriefing(session.user.id).catch((err) =>
      console.error("Instant briefing failed:", err),
    );
  }

  return NextResponse.json(profile);
}
