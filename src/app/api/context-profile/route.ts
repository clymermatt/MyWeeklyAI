import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  return NextResponse.json(profile);
}
