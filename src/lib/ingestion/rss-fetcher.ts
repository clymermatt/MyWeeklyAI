import RSSParser from "rss-parser";

const parser = new RSSParser({
  headers: {
    "User-Agent": "ContextBrief/1.0 (RSS Reader)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

export interface RawFeedItem {
  title?: string | Record<string, unknown>;
  link?: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  categories?: string[];
}

export interface FetchResult {
  items: RawFeedItem[];
  error?: string;
}

export async function fetchRSSFeed(url: string): Promise<FetchResult> {
  try {
    const feed = await parser.parseURL(url);
    return { items: feed.items as RawFeedItem[] };
  } catch (error) {
    return {
      items: [],
      error: error instanceof Error ? error.message : "Unknown fetch error",
    };
  }
}
