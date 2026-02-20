import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BriefingsPageClient from "@/components/briefings-page-client";

export default async function DigestsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [digests, bookmarks, profile] = await Promise.all([
    prisma.weeklyDigest.findMany({
      where: { userId },
      orderBy: { sentAt: "desc" },
      take: 20,
    }),
    prisma.bookmark.findMany({
      where: { userId },
      select: { url: true },
    }),
    prisma.contextProfile.findUnique({ where: { userId } }),
  ]);

  const serializedDigests = digests.map((d) => ({
    id: d.id,
    briefJson: d.briefJson,
    isFree: d.isFree,
    periodStart: d.periodStart.toISOString(),
    periodEnd: d.periodEnd.toISOString(),
    sentAt: d.sentAt.toISOString(),
  }));

  const bookmarkedUrls = bookmarks.map((b) => b.url);

  const profileTerms = profile
    ? [
        profile.roleTitle,
        profile.industry,
        ...profile.tools,
        ...profile.focusTopics,
      ].filter((t): t is string => !!t)
    : [];

  return (
    <BriefingsPageClient
      initialDigests={serializedDigests}
      bookmarkedUrls={bookmarkedUrls}
      profileTerms={profileTerms}
    />
  );
}
