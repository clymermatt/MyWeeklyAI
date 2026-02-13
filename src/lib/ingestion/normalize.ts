import type { RawFeedItem } from "./rss-fetcher";

export interface NormalizedItem {
  title: string;
  url: string;
  publishedAt: Date;
  summary: string | null;
  contentSnippet: string | null;
  tags: string[];
}

export function normalizeItems(
  items: RawFeedItem[],
): NormalizedItem[] {
  return items
    .filter((item) => item.title && item.link)
    .map((item) => ({
      title: item.title!.trim(),
      url: item.link!.trim(),
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      summary: item.contentSnippet?.slice(0, 500) ?? null,
      contentSnippet: item.content?.slice(0, 1000) ?? null,
      tags: item.categories ?? [],
    }));
}
