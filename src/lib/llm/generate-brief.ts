import Anthropic from "@anthropic-ai/sdk";
import type { ContextProfile, NewsItem } from "@/generated/prisma/client";
import type { BriefOutput } from "@/types/brief";

const anthropic = new Anthropic();

function buildPrompt(profile: ContextProfile, newsItems: NewsItem[]): string {
  const profileContext = `
## User Context Profile
- Role: ${profile.roleTitle || "Not specified"}
- Industry: ${profile.industry || "Not specified"}
- Experience Level: ${profile.experienceLevel || "Not specified"}
- Goals: ${profile.goals.length > 0 ? profile.goals.join(", ") : "Not specified"}
- Tools & Platforms: ${profile.tools.length > 0 ? profile.tools.join(", ") : "Not specified"}
- Workflows: ${profile.workflows || "Not specified"}
- Focus Topics: ${profile.focusTopics.length > 0 ? profile.focusTopics.join(", ") : "Not specified"}
- Topics to Avoid: ${profile.avoidTopics.length > 0 ? profile.avoidTopics.join(", ") : "None"}
`.trim();

  const newsContext = newsItems
    .map(
      (item, i) =>
        `${i + 1}. [${item.title}](${item.url})\n   Published: ${item.publishedAt.toISOString().split("T")[0]}\n   Summary: ${item.summary || "No summary available"}\n   Tags: ${item.tags.join(", ") || "None"}`,
    )
    .join("\n\n");

  return `You are ContextBrief, an AI assistant that creates personalized weekly AI news digests.

${profileContext}

## News Items from the Past 7 Days
${newsContext}

## Your Task
Analyze the news items above through the lens of the user's context profile. Create a personalized weekly brief with exactly 4 sections:

1. **What Dropped** — The 3-5 most significant AI developments this week, regardless of the user's profile. Brief summary of each.
2. **Relevant To You** — 3-5 items specifically relevant to the user's role, industry, tools, and goals. Explain WHY each is relevant to them.
3. **What To Test** — 1-3 actionable items the user could try this week based on their tools and workflows. Be specific and practical.
4. **Ignore Summary** — A single paragraph summarizing what you filtered out and why it wasn't relevant to this user.

Respond with valid JSON matching this exact schema:
{
  "whatDropped": [{ "title": "string", "url": "string", "summary": "string" }],
  "relevantToYou": [{ "title": "string", "url": "string", "summary": "string", "relevanceNote": "string" }],
  "whatToTest": [{ "title": "string", "url": "string", "summary": "string", "relevanceNote": "string" }],
  "ignoreSummary": "string"
}

Return ONLY the JSON object, no markdown code fences or other text.`;
}

export async function generateBrief(
  profile: ContextProfile,
  newsItems: NewsItem[],
): Promise<BriefOutput> {
  const prompt = buildPrompt(profile, newsItems);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const parsed = JSON.parse(text) as BriefOutput;

  // Basic validation
  if (
    !parsed.whatDropped ||
    !parsed.relevantToYou ||
    !parsed.whatToTest ||
    typeof parsed.ignoreSummary !== "string"
  ) {
    throw new Error("Invalid brief output schema from LLM");
  }

  return parsed;
}
