import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { createBufferPost, getProfileId } from "@/lib/buffer";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { ids: string[] };

  if (!body.ids?.length) {
    return NextResponse.json(
      { error: "ids array is required" },
      { status: 400 },
    );
  }

  const posts = await prisma.socialPost.findMany({
    where: { id: { in: body.ids }, status: "APPROVED" },
    orderBy: [{ platform: "asc" }, { segment: "asc" }],
  });

  if (posts.length === 0) {
    return NextResponse.json(
      { error: "No approved posts found for the given IDs" },
      { status: 400 },
    );
  }

  // Distribute across Tue-Fri, two slots per day (10am and 2pm ET)
  const now = new Date();
  const nextTuesday = new Date(now);
  const currentDay = now.getUTCDay(); // 0=Sun
  const daysUntilTuesday = currentDay <= 2 ? 2 - currentDay : 9 - currentDay;
  nextTuesday.setUTCDate(now.getUTCDate() + daysUntilTuesday);

  // 10am ET = 15:00 UTC, 2pm ET = 18:00 UTC
  const slotHoursUTC = [15, 18];
  const slots: Date[] = [];
  for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
    // Tue, Wed, Thu, Fri
    for (const hour of slotHoursUTC) {
      const slot = new Date(nextTuesday);
      slot.setUTCDate(nextTuesday.getUTCDate() + dayOffset);
      slot.setUTCHours(hour, 0, 0, 0);
      slots.push(slot);
    }
  }

  const results: { id: string; scheduled: boolean; error?: string }[] = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const scheduledAt = slots[i % slots.length]; // wrap around if > 8 posts

    try {
      const profileId = getProfileId(post.platform);
      const bufferResult = await createBufferPost({
        profileId,
        text: post.content,
        scheduledAt,
      });

      await prisma.socialPost.update({
        where: { id: post.id },
        data: {
          status: "SCHEDULED",
          scheduledFor: scheduledAt,
          bufferPostId: bufferResult.id,
        },
      });

      results.push({ id: post.id, scheduled: true });
    } catch (err) {
      results.push({
        id: post.id,
        scheduled: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({
    total: posts.length,
    scheduled: results.filter((r) => r.scheduled).length,
    failed: results.filter((r) => !r.scheduled).length,
    results,
  });
}
