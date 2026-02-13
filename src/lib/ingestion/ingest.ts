import { prisma } from "@/lib/prisma";
import { fetchRSSFeed } from "./rss-fetcher";
import { normalizeItems } from "./normalize";

export interface IngestResult {
  sourcesProcessed: number;
  itemsUpserted: number;
  errors: string[];
}

export async function runIngestion(): Promise<IngestResult> {
  const sources = await prisma.source.findMany({ where: { active: true } });

  let itemsUpserted = 0;
  const errors: string[] = [];

  for (const source of sources) {
    try {
      const { items, error } = await fetchRSSFeed(source.url);
      if (error) {
        errors.push(`${source.name}: ${error}`);
        continue;
      }

      const normalized = normalizeItems(items);

      for (const item of normalized) {
        try {
          await prisma.newsItem.upsert({
            where: { url: item.url },
            create: {
              sourceId: source.id,
              title: item.title,
              url: item.url,
              publishedAt: item.publishedAt,
              summary: item.summary,
              contentSnippet: item.contentSnippet,
              tags: item.tags,
            },
            update: {
              title: item.title,
              summary: item.summary,
              contentSnippet: item.contentSnippet,
              tags: item.tags,
            },
          });
          itemsUpserted++;
        } catch (err) {
          // Skip duplicate URL errors silently
          if (
            err instanceof Error &&
            err.message.includes("Unique constraint")
          ) {
            continue;
          }
          errors.push(
            `${source.name} item "${item.title}": ${err instanceof Error ? err.message : "Unknown error"}`,
          );
        }
      }
    } catch (err) {
      errors.push(
        `${source.name}: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }

  return {
    sourcesProcessed: sources.length,
    itemsUpserted,
    errors,
  };
}
