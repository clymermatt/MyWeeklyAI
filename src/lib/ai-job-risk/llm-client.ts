/**
 * Thin wrapper over the Anthropic SDK for report-generation calls. Matches the
 * project's existing pattern (see src/lib/llm/generate-brief.ts) — same client,
 * same model — so this lib stays consistent with the rest of the app.
 */

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const MODEL = "claude-sonnet-4-5-20250929";

export interface LLMOptions {
  /** spec §6.10 sweet spot is 0.3–0.5 */
  temperature?: number;
  maxTokens?: number;
}

export async function generateText(
  prompt: string,
  options: LLMOptions = {},
): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: options.maxTokens ?? 1024,
    temperature: options.temperature ?? 0.4,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  if (!block || block.type !== "text") {
    throw new Error("Unexpected LLM response shape");
  }
  return block.text.trim();
}

/** Same as generateText but parses the response as JSON, tolerating ```json fences. */
export async function generateJson<T>(
  prompt: string,
  options: LLMOptions = {},
): Promise<T> {
  const text = await generateText(prompt, options);
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned) as T;
}
