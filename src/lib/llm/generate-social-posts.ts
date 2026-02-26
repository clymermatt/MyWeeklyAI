import Anthropic from "@anthropic-ai/sdk";
import type { LandingPage } from "@/lib/landing-content";

const anthropic = new Anthropic();

export interface SocialPostResult {
  segment: string;
  linkedIn: {
    content: string;
    hashtags: string[];
    sourceHeadline: string;
    sourceUrl: string;
  };
  twitter: {
    content: string;
    hashtags: string[];
    sourceHeadline: string;
    sourceUrl: string;
  };
}

export interface Story {
  title: string;
  url: string;
  source?: string;
  summary: string;
}

/**
 * Generate social posts for a single segment.
 * One Claude call → 1 LinkedIn + 1 Twitter post.
 */
export async function generateSocialPostsForSegment(
  segment: LandingPage,
  stories: Story[],
): Promise<SocialPostResult> {
  const storiesList = stories
    .map(
      (s, i) =>
        `${i + 1}. "${s.title}" (${s.source || "unknown source"})\n   URL: ${s.url}\n   Summary: ${s.summary}`,
    )
    .join("\n\n");

  const prompt = `You are a social media content strategist for "My Weekly AI", a service that delivers personalized AI news briefs to professionals.

## This Week's Top AI Stories
${storiesList}

## Target Audience
Segment: "${segment.label}" (${segment.type})
Keywords: ${segment.mockBrief.highlightTerms.join(", ")}

## Task
Pick the single most relevant story for this audience and create two social media posts:

**LinkedIn post:**
- Professional tone, 150-300 words
- Reference the segment audience explicitly (e.g., "If you're a ${segment.label.replace(/s$/, "")}...")
- Explain why this specific story matters for that audience
- End with a call to action to subscribe to My Weekly AI for personalized briefs
- 3-5 relevant hashtags

**Twitter/X post:**
- Punchy hook, under 280 characters total (including hashtags)
- Conversational tone
- 1-2 hashtags

## Output Format
Return valid JSON:
{
  "segment": "${segment.slug}",
  "linkedIn": {
    "content": "full post text",
    "hashtags": ["Tag1", "Tag2"],
    "sourceHeadline": "original story title",
    "sourceUrl": "original story url"
  },
  "twitter": {
    "content": "full tweet text including hashtags",
    "hashtags": ["Tag1"],
    "sourceHeadline": "original story title",
    "sourceUrl": "original story url"
  }
}

Return ONLY the JSON object, no markdown code fences or other text.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  let text =
    message.content[0].type === "text" ? message.content[0].text : "";

  text = text
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();

  const parsed = JSON.parse(text) as SocialPostResult;

  if (!parsed.segment || !parsed.linkedIn?.content || !parsed.twitter?.content) {
    throw new Error(`Invalid social post for segment "${segment.slug}"`);
  }

  return parsed;
}
