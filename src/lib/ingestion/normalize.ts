import type { RawFeedItem } from "./rss-fetcher";

export interface NormalizedItem {
  title: string;
  url: string;
  publishedAt: Date;
  summary: string | null;
  contentSnippet: string | null;
  tags: string[];
}

/**
 * Extracts a plain string title from an RSS item.
 * Some feeds (e.g. Fierce Healthcare/Biotech) wrap titles in <a> tags,
 * which rss-parser returns as nested objects instead of strings.
 */
function extractTitle(title: unknown): string | undefined {
  if (typeof title === "string") return title;
  if (title && typeof title === "object") {
    // Fierce-style: { a: [{ _: "Title Text", $: { href: "..." } }] }
    const obj = title as Record<string, unknown>;
    if ("a" in obj) {
      const anchor = obj.a;
      if (Array.isArray(anchor) && anchor[0]?._) {
        return String(anchor[0]._);
      }
    }
    // Fallback: try to extract any nested text
    if ("_" in obj && typeof obj._ === "string") return obj._;
  }
  return undefined;
}

/**
 * AI relevance keywords — if none of these appear in the title, summary,
 * or tags, the article is unlikely to be about AI and gets filtered out.
 * Uses word-boundary matching to avoid false positives.
 */
const AI_KEYWORDS = [
  // Core terms
  "ai", "artificial intelligence", "machine learning", "deep learning",
  "neural network", "neural net", "generative ai", "gen ai",
  // Models & architectures
  "llm", "large language model", "language model", "transformer",
  "diffusion model", "foundation model", "multimodal",
  // Specific technologies
  "gpt", "chatgpt", "openai", "claude", "anthropic", "gemini", "copilot",
  "midjourney", "stable diffusion", "dall-e", "sora", "llama", "mistral",
  "deepseek", "perplexity",
  // Techniques
  "natural language processing", "nlp", "computer vision",
  "reinforcement learning", "fine-tuning", "fine-tune", "rag",
  "retrieval augmented", "prompt engineering", "embeddings", "vector database",
  "agentic", "ai agent", "ai agents",
  // Applications
  "chatbot", "ai-powered", "ai powered", "ml model", "ml pipeline",
  "predictive model", "recommendation engine", "automation",
  "intelligent automation", "robotic process automation", "rpa",
  // Research
  "arxiv", "deepmind", "hugging face", "huggingface",
];

const aiPatterns = AI_KEYWORDS.map(
  (kw) => new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"),
);

/** Returns true if the text contains at least one AI-related keyword */
function isAIRelevant(text: string): boolean {
  return aiPatterns.some((pattern) => pattern.test(text));
}

export function normalizeItems(
  items: RawFeedItem[],
  opts: { skipAIFilter?: boolean } = {},
): NormalizedItem[] {
  return items
    .map((item) => ({ ...item, title: extractTitle(item.title) }))
    .filter((item) => item.title && item.link)
    .filter((item) => {
      if (opts.skipAIFilter) return true;
      const searchable = [
        item.title ?? "",
        item.contentSnippet ?? "",
        item.content ?? "",
        ...(item.categories ?? []),
      ].join(" ");
      return isAIRelevant(searchable);
    })
    .map((item) => ({
      title: item.title!.trim(),
      url: item.link!.trim(),
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      summary: item.contentSnippet?.slice(0, 500) ?? null,
      contentSnippet: item.content?.slice(0, 1000) ?? null,
      tags: item.categories ?? [],
    }));
}
