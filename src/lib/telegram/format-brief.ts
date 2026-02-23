import type { BriefOutput, BriefItem, FreeBriefStored } from "@/types/brief";

/** Escape all 18 MarkdownV2 special characters */
function escMd(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
}

/**
 * Escape text with profile-term bolding for MarkdownV2.
 * Matched terms become *bold* (unescaped `*`); the rest is escaped normally.
 */
function escMdWithHighlights(text: string, terms: string[]): string {
  if (!terms.length) return escMd(text);

  // Expand compound terms into individual words (mirrors email logic)
  const allTerms = new Set<string>();
  for (const term of terms) {
    allTerms.add(term);
    for (const part of term.split(/[\s&,/]+/)) {
      if (part.length >= 3) allTerms.add(part);
    }
  }

  const sorted = [...allTerms].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  const parts = text.split(regex);
  if (parts.length === 1) return escMd(text);

  // Odd indices are captured matches
  return parts
    .map((part, i) => (i % 2 === 1 ? `*__${escMd(part)}__*` : escMd(part)))
    .join("");
}

function formatItem(item: BriefItem, profileTerms: string[]): string {
  const title = `[${escMd(item.title)}](${item.url})`;
  const source = item.source ? `  _${escMd(item.source)}_` : "";
  const summary = escMd(item.summary);
  const relevance = item.relevanceNote
    ? `\n_Why this matters to you: ${escMdWithHighlights(item.relevanceNote, profileTerms)}_`
    : "";
  return `${title}${source}\n${summary}${relevance}`;
}

function formatSection(heading: string, items: BriefItem[], profileTerms: string[] = []): string {
  if (items.length === 0) return "";
  const header = `*${escMd(heading)}*`;
  const body = items.map((item) => formatItem(item, profileTerms)).join("\n\n");
  return `${header}\n\n${body}`;
}

export function formatBriefForTelegram({
  brief,
  isFree,
  periodStart,
  periodEnd,
  profileTerms = [],
}: {
  brief: BriefOutput | FreeBriefStored;
  isFree: boolean;
  periodStart: Date;
  periodEnd: Date;
  profileTerms?: string[];
}): string {
  const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const dateRange = `${fmtDate(periodStart)} to ${fmtDate(periodEnd)}`;
  const tier = isFree ? "Free" : "Pro";

  const lines: string[] = [
    `*${escMd("My Weekly AI")}*  \\[${escMd(tier)}\\]`,
    escMd(dateRange),
    "",
  ];

  if (isFree && "industryNews" in brief) {
    const stored = brief as FreeBriefStored;
    lines.push(formatSection("Industry News", stored.industryNews));
    lines.push("");
    lines.push(formatSection("AI Lab Announcements", stored.labUpdates));
    lines.push("");
    lines.push(
      `_${escMd("Upgrade to Pro for personalized picks and action items tailored to your role.")}_`,
    );
  } else if (isFree) {
    lines.push(formatSection("Industry News", brief.whatDropped));
    lines.push("");
    lines.push(
      `_${escMd("Upgrade to Pro for personalized picks and action items tailored to your role.")}_`,
    );
  } else {
    lines.push(formatSection("News Relevant to You", brief.relevantToYou, profileTerms));
    lines.push("");
    lines.push(formatSection("What To Test This Week", brief.whatToTest, profileTerms));
    lines.push("");
    if (brief.ignoreSummary) {
      lines.push(`*${escMd("What We Filtered Out")}*`);
      lines.push(escMd(brief.ignoreSummary));
    }
  }

  lines.push("");
  lines.push(`${escMd("Powered by My Weekly AI")}`);

  return lines.join("\n");
}
