import Anthropic from "@anthropic-ai/sdk";
import type { ContextProfile, NewsItem } from "@/generated/prisma/client";
import type { BriefOutput } from "@/types/brief";
import type { FreeBriefOutput } from "@/types/brief";

const anthropic = new Anthropic();

function buildPrompt(profile: ContextProfile, newsItems: NewsItem[]): string {
  const profileContext = `
## User Context Profile
- Role: ${profile.roleTitle || "Not specified"}
- Industry: ${profile.industry || "Not specified"}
- Experience Level: ${profile.experienceLevel || "Not specified"}
- Goals: ${profile.goals.length > 0 ? profile.goals.join(", ") : "Not specified"}
- Tools & Platforms: ${profile.tools.length > 0 ? profile.tools.join(", ") : "Not specified"}
- Focus Topics: ${profile.focusTopics.length > 0 ? profile.focusTopics.join(", ") : "Not specified"}
- Topics to Avoid: ${profile.avoidTopics.length > 0 ? profile.avoidTopics.join(", ") : "None"}
`.trim();

  const newsContext = newsItems
    .map(
      (item, i) =>
        `${i + 1}. [${item.title}](${item.url})\n   Published: ${item.publishedAt.toISOString().split("T")[0]}\n   Summary: ${item.summary || "No summary available"}\n   Tags: ${item.tags.join(", ") || "None"}`,
    )
    .join("\n\n");

  return `You are an expert AI news curator creating a personalized weekly digest.

${profileContext}

## Important Instructions
- The news items below have been PRE-RANKED by relevance to this user's profile. Items near the top are more likely relevant, but use your judgment.
- Every item in "Relevant To You" MUST have a direct, specific connection to the user's role, industry, tools, or goals. Do NOT include items that are only tangentially related.
- For "What To Test", suggest concrete actions using the user's specific tools and goals — not generic advice.
- If the user has "Topics to Avoid", strictly exclude those from all sections.
- Do NOT repeat articles the user has already seen (these have been pre-filtered, but double-check for near-duplicates with different URLs covering the same story).

## News Items from the Past 7 Days
${newsContext}

## Output Requirements
Create a personalized weekly brief with exactly 4 sections:

1. **What Dropped** — The 3-5 most significant AI developments this week, regardless of the user's profile. Brief summary of each.
2. **Relevant To You** — 3-5 items specifically relevant to the user's role, industry, tools, and goals. For each, explain in 1-2 sentences exactly WHY it matters for their specific work — reference their role, tools, or goals by name.
3. **What To Test** — 1-3 actionable items the user could try THIS WEEK based on their specific tools and goals. Be concrete: name the tool, describe the action, explain the expected outcome.
4. **Ignore Summary** — A single paragraph summarizing what you filtered out and why it wasn't relevant to this user's specific context.

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

  let text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Strip markdown code fences if present
  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

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

type NewsItemWithSource = NewsItem & { source: { name: string } };

function formatItems(items: NewsItemWithSource[]): string {
  return items
    .map(
      (item, i) =>
        `${i + 1}. [${item.title}](${item.url})\n   Source: ${item.source.name}\n   Published: ${item.publishedAt.toISOString().split("T")[0]}\n   Summary: ${item.summary || "No summary available"}\n   Tags: ${item.tags.join(", ") || "None"}`,
    )
    .join("\n\n");
}

function buildFreePrompt(industryItems: NewsItemWithSource[], labItems: NewsItemWithSource[]): string {
  return `You are an expert AI news curator creating a weekly digest of the biggest AI stories.

## Industry News Sources (The Verge, TechCrunch, Ars Technica, VentureBeat, IEEE Spectrum)
${formatItems(industryItems)}

## AI Lab Sources (OpenAI, Anthropic, Google, DeepMind, Microsoft Research, NVIDIA, Hugging Face)
${formatItems(labItems)}

## Output Requirements
Create two sections:

1. **Industry News** — Pick the 3-5 most significant AI industry stories this week from the Industry News sources above. Prioritize product launches, major funding rounds, partnerships, and regulatory developments over opinion pieces and tutorials.
2. **AI Lab Announcements** — Pick the 3-5 most notable announcements from the AI Lab sources above. Prioritize new model releases, major research breakthroughs, and significant product updates.

For each item, write a brief 1-2 sentence summary explaining why it matters.

Respond with valid JSON matching this exact schema:
{
  "industryNews": [{ "title": "string", "url": "string", "source": "string", "summary": "string" }],
  "labUpdates": [{ "title": "string", "url": "string", "source": "string", "summary": "string" }]
}

The "source" field must be the publication name exactly as listed (e.g., "The Verge - AI", "OpenAI Blog").

Return ONLY the JSON object, no markdown code fences or other text.`;
}

export async function generateFreeBrief(
  industryItems: NewsItemWithSource[],
  labItems: NewsItemWithSource[],
): Promise<FreeBriefOutput> {
  const prompt = buildFreePrompt(industryItems, labItems);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  let text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Strip markdown code fences if present
  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

  const parsed = JSON.parse(text) as FreeBriefOutput;

  if (!parsed.industryNews || !Array.isArray(parsed.industryNews) ||
      !parsed.labUpdates || !Array.isArray(parsed.labUpdates)) {
    throw new Error("Invalid free brief output schema from LLM");
  }

  return parsed;
}
