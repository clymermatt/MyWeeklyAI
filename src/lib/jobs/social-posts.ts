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

export async function runSocialPostsGeneration(): Promise<SocialPostsResult> {
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

  // Step 2: Idempotency — skip if posts already exist for this week
  const weekOf = digest.periodEnd;
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

  // Step 3: Extract stories from the brief (handles both free and paid formats)
  const stories = extractStories(digest.briefJson);

  if (stories.length === 0) {
    throw new Error("Digest has no stories to generate posts from");
  }

  // Step 4: Get all segments and batch them (6 per Claude call)
  const allSegments = Object.values(landingPages);
  const BATCH_SIZE = 6;
  const batches: (typeof allSegments)[] = [];
  for (let i = 0; i < allSegments.length; i += BATCH_SIZE) {
    batches.push(allSegments.slice(i, i + BATCH_SIZE));
  }

  let segmentsProcessed = 0;
  let postsGenerated = 0;

  for (const batch of batches) {
    try {
      const results = await generateSocialPostsBatch(batch, stories);

      for (const result of results) {
        const segment = allSegments.find((s) => s.slug === result.segment);
        if (!segment) {
          errors.push(`Unknown segment slug returned: ${result.segment}`);
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
          postsGenerated += 2;
        } catch (dbErr) {
          errors.push(
            `DB error for ${segment.slug}: ${dbErr instanceof Error ? dbErr.message : "Unknown"}`,
          );
        }

        segmentsProcessed++;
      }
    } catch (batchErr) {
      const slugs = batch.map((s) => s.slug).join(", ");
      errors.push(
        `Batch error [${slugs}]: ${batchErr instanceof Error ? batchErr.message : "Unknown"}`,
      );
    }
  }

  return { segmentsProcessed, postsGenerated, errors };
}
