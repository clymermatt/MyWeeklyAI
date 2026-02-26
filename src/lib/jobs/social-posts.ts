import { prisma } from "@/lib/prisma";
import { generateSocialPostsForSegment } from "@/lib/llm/generate-social-posts";
import type { Story } from "@/lib/llm/generate-social-posts";
import landingPages from "@/lib/landing-content";
import type { BriefOutput } from "@/types/brief";

export interface SocialPostsResult {
  segmentsProcessed: number;
  postsGenerated: number;
  errors: string[];
}

/** Extract stories from either a free brief or paid brief */
function extractStories(briefJson: unknown): Story[] {
  const brief = briefJson as Record<string, unknown>;
  const stories: Story[] = [];

  const industryNews = brief.industryNews as Story[] | undefined;
  const labUpdates = brief.labUpdates as Story[] | undefined;
  if (industryNews?.length) stories.push(...industryNews);
  if (labUpdates?.length) stories.push(...labUpdates);

  if (stories.length === 0) {
    const paid = brief as unknown as BriefOutput;
    if (paid.whatDropped?.length) stories.push(...paid.whatDropped);
    if (paid.relevantToYou?.length) stories.push(...paid.relevantToYou);
  }

  return stories;
}

/** Get stories from the latest digest */
export async function getLatestStories(): Promise<{ stories: Story[]; weekOf: Date }> {
  let digest = await prisma.weeklyDigest.findFirst({
    where: { isFree: true },
    orderBy: { createdAt: "desc" },
  });

  if (!digest) {
    digest = await prisma.weeklyDigest.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }

  if (!digest) {
    throw new Error("No weekly digest found");
  }

  const stories = extractStories(digest.briefJson);
  if (stories.length === 0) {
    throw new Error("Digest has no stories to generate posts from");
  }

  return { stories, weekOf: digest.periodEnd };
}

/**
 * Generate social posts for a single segment.
 * Called from the admin UI one segment at a time.
 */
export async function generatePostsForSegment(
  segmentSlug: string,
  { regenerate = false }: { regenerate?: boolean } = {},
): Promise<SocialPostsResult> {
  const segment = landingPages[segmentSlug];
  if (!segment) {
    throw new Error(`Unknown segment: ${segmentSlug}`);
  }

  const { stories, weekOf } = await getLatestStories();

  // Check if posts already exist for this segment + week
  const existing = await prisma.socialPost.count({
    where: { segment: segmentSlug, weekOf },
  });
  if (existing > 0) {
    if (regenerate) {
      // Delete existing posts for this segment + week so we can regenerate
      await prisma.socialPost.deleteMany({
        where: { segment: segmentSlug, weekOf },
      });
    } else {
      return {
        segmentsProcessed: 0,
        postsGenerated: 0,
        errors: [`Posts already exist for ${segmentSlug} this week`],
      };
    }
  }

  const result = await generateSocialPostsForSegment(segment, stories);

  await prisma.socialPost.createMany({
    data: [
      {
        platform: "LINKEDIN",
        segment: segment.slug,
        segmentType: segment.type,
        segmentLabel: segment.label,
        content: result.linkedIn.content,
        hashtags: result.linkedIn.hashtags || [],
        sourceHeadline: result.linkedIn.sourceHeadline,
        sourceUrl: result.linkedIn.sourceUrl,
        weekOf,
      },
      {
        platform: "TWITTER",
        segment: segment.slug,
        segmentType: segment.type,
        segmentLabel: segment.label,
        content: result.twitter.content,
        hashtags: result.twitter.hashtags || [],
        sourceHeadline: result.twitter.sourceHeadline,
        sourceUrl: result.twitter.sourceUrl,
        weekOf,
      },
    ],
  });

  return { segmentsProcessed: 1, postsGenerated: 2, errors: [] };
}
