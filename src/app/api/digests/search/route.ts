import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json([]);
  }

  const pattern = `%${q}%`;

  // Search across all JSON sections for matching article titles/summaries
  const digests = await prisma.$queryRaw<
    {
      id: string;
      userId: string;
      briefJson: unknown;
      isFree: boolean;
      periodStart: Date;
      periodEnd: Date;
      sentAt: Date;
      createdAt: Date;
    }[]
  >(Prisma.sql`
    SELECT DISTINCT d."id", d."userId", d."briefJson", d."isFree",
           d."periodStart", d."periodEnd", d."sentAt", d."createdAt"
    FROM "WeeklyDigest" d,
    LATERAL (
      SELECT value FROM jsonb_array_elements(
        COALESCE(d."briefJson"->'whatDropped', '[]'::jsonb) ||
        COALESCE(d."briefJson"->'relevantToYou', '[]'::jsonb) ||
        COALESCE(d."briefJson"->'whatToTest', '[]'::jsonb) ||
        COALESCE(d."briefJson"->'industryNews', '[]'::jsonb) ||
        COALESCE(d."briefJson"->'labUpdates', '[]'::jsonb)
      ) AS value
    ) items
    WHERE d."userId" = ${session.user.id}
      AND (
        items.value->>'title' ILIKE ${pattern}
        OR items.value->>'summary' ILIKE ${pattern}
      )
    ORDER BY d."sentAt" DESC
    LIMIT 20
  `);

  // Serialize dates to ISO strings for client consumption
  const serialized = digests.map((d) => ({
    id: d.id,
    briefJson: d.briefJson,
    isFree: d.isFree,
    periodStart:
      d.periodStart instanceof Date
        ? d.periodStart.toISOString()
        : d.periodStart,
    periodEnd:
      d.periodEnd instanceof Date ? d.periodEnd.toISOString() : d.periodEnd,
    sentAt: d.sentAt instanceof Date ? d.sentAt.toISOString() : d.sentAt,
  }));

  return NextResponse.json(serialized);
}
