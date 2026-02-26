import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import type { SocialPostStatus } from "@/generated/prisma/client";

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const weekOf = searchParams.get("weekOf");
  const platform = searchParams.get("platform");
  const segmentType = searchParams.get("segmentType");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (weekOf) where.weekOf = new Date(weekOf);
  if (platform) where.platform = platform;
  if (segmentType) where.segmentType = segmentType;
  if (status) where.status = status;

  const posts = await prisma.socialPost.findMany({
    where,
    orderBy: [{ segment: "asc" }, { platform: "asc" }],
  });

  // Also get available weeks for the filter dropdown
  const weeks = await prisma.socialPost.findMany({
    select: { weekOf: true },
    distinct: ["weekOf"],
    orderBy: { weekOf: "desc" },
  });

  return NextResponse.json({
    posts,
    weeks: weeks.map((w) => w.weekOf),
  });
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    ids: string[];
    status: SocialPostStatus;
  };

  if (!body.ids?.length || !body.status) {
    return NextResponse.json(
      { error: "ids and status are required" },
      { status: 400 },
    );
  }

  const updated = await prisma.socialPost.updateMany({
    where: { id: { in: body.ids } },
    data: { status: body.status },
  });

  return NextResponse.json({ updated: updated.count });
}
