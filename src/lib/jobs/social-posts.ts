import { prisma } from "@/lib/prisma";
import { generateSocialPostsBatch } from "@/lib/llm/generate-social-posts";
import landingPages from "@/lib/landing-content";
import type { BriefOutput } from "@/types/brief";

interface StoryItem {
  title: string;
  url: string;
  source?: string;
  summary: string;
}

export interface SocialPostsResult {
  segmentsProcessed: number;
  postsGenerated: number;
  errors: string[];
}

/** Extract stories from either a free brief (industryNews/labUpdates) or paid brief (whatDropped) */
function extractStories(briefJson: unknown): StoryItem[] {
  const brief = briefJson as Record<string, unknown>;
  const stories: StoryItem[] = [];

  // Free brief format
  const industryNews = brief.industryNews as StoryItem[] | undefined;
  const labUpdates = brief.labUpdates as StoryItem[] | undefined;
  if (industryNews?.length) stories.push(...industryNews);
  if (labUpdates?.length) stories.push(...labUpdates);

  // Paid brief format fallback
  if (stories.length === 0) {
    const paid = brief as unknown as BriefOutput;
    if (paid.whatDropped?.length) stories.push(...paid.whatDropped);
    if (paid.relevantToYou?.length) stories.push(...paid.relevantToYou);
  }

  return stories;
}

const SEGMENTS_PER_INVOCATION = 12; // 2 concurrent Claude calls of 6 each
const BATCH_SIZE = 6;

export async function runSocialPostsGeneration(
  batchIndex = 0,
): Promise<SocialPostsResult & { nextBatch?: number }> {
  const errors: string[] = [];

  // Step 1: Find the latest WeeklyDigest (prefer free, fall back to any)
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

  const weekOf = digest.periodEnd;

  // Step 2: On first batch only, check idempotency
  if (batchIndex === 0) {
    const existingCount = await prisma.socialPost.count({
      where: { weekOf },
    });
    if (existingCount > 0) {
      return {
        segmentsProcessed: 0,
        postsGenerated: 0,
        errors: ["Posts already exist for this week — skipped"],
      };
    }
  }

  // Step 3: Extract stories from the brief
  const stories = extractStories(digest.briefJson);

  if (stories.length === 0) {
    throw new Error("Digest has no stories to generate posts from");
  }

  // Step 4: Get this invocation's slice of segments
  const allSegments = Object.values(landingPages);
  const start = batchIndex * SEGMENTS_PER_INVOCATION;
  const sliceSegments = allSegments.slice(start, start + SEGMENTS_PER_INVOCATION);

  if (sliceSegments.length === 0) {
    return { segmentsProcessed: 0, postsGenerated: 0, errors: [] };
  }

  // Split into sub-batches and run concurrently (2 calls of 6)
  const batches: (typeof sliceSegments)[] = [];
  for (let i = 0; i < sliceSegments.length; i += BATCH_SIZE) {
    batches.push(sliceSegments.slice(i, i + BATCH_SIZE));
  }

  let segmentsProcessed = 0;
  let postsGenerated = 0;

  const batchResults = await Promise.allSettled(
    batches.map((batch) => generateSocialPostsBatch(batch, stories)),
  );

  for (let b = 0; b < batchResults.length; b++) {
    const result = batchResults[b];
    if (result.status === "rejected") {
      const slugs = batches[b].map((s) => s.slug).join(", ");
      errors.push(
        `Batch error [${slugs}]: ${result.reason instanceof Error ? result.reason.message : "Unknown"}`,
      );
      continue;
    }

    for (const post of result.value) {
      const segment = allSegments.find((s) => s.slug === post.segment);
      if (!segment) {
        errors.push(`Unknown segment slug returned: ${post.segment}`);
        continue;
      }

      try {
        await prisma.socialPost.createMany({
          data: [
            {
              platform: "LINKEDIN",
              segment: segment.slug,
              segmentType: segment.type,
              segmentLabel: segment.label,
              content: post.linkedIn.content,
              hashtags: post.linkedIn.hashtags || [],
              sourceHeadline: post.linkedIn.sourceHeadline,
              sourceUrl: post.linkedIn.sourceUrl,
              weekOf,
            },
            {
              platform: "TWITTER",
              segment: segment.slug,
              segmentType: segment.type,
              segmentLabel: segment.label,
              content: post.twitter.content,
              hashtags: post.twitter.hashtags || [],
              sourceHeadline: post.twitter.sourceHeadline,
              sourceUrl: post.twitter.sourceUrl,
              weekOf,
            },
          ],
        });
        postsGenerated += 2;
      } catch (dbErr) {
        errors.push(
          `DB error for ${segment.slug}: ${dbErr instanceof Error ? dbErr.message : "Unknown"}`,
        );
      }

      segmentsProcessed++;
    }
  }

  // Signal whether there are more segments to process
  const hasMore = start + SEGMENTS_PER_INVOCATION < allSegments.length;

  return {
    segmentsProcessed,
    postsGenerated,
    errors,
    nextBatch: hasMore ? batchIndex + 1 : undefined,
  };
}
