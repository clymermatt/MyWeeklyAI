import RSSParser from "rss-parser";

const parser = new RSSParser();

export interface RawFeedItem {
  title?: string;
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
