import type { BriefOutput, BriefItem, FreeBriefStored } from "@/types/brief";

/** Escape all 18 MarkdownV2 special characters */
function escMd(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
}

function formatItem(item: BriefItem): string {
  const title = `[${escMd(item.title)}](${item.url})`;
  const source = item.source ? `  _${escMd(item.source)}_` : "";
  const summary = escMd(item.summary);
  const relevance = item.relevanceNote
    ? `\n_Why this matters: ${escMd(item.relevanceNote)}_`
    : "";
  return `${title}${source}\n${summary}${relevance}`;
}

function formatSection(heading: string, items: BriefItem[]): string {
  if (items.length === 0) return "";
  const header = `*${escMd(heading)}*`;
  const body = items.map(formatItem).join("\n\n");
  return `${header}\n\n${body}`;
}

export function formatBriefForTelegram({
  brief,
  isFree,
  periodStart,
  periodEnd,
}: {
  brief: BriefOutput | FreeBriefStored;
  isFree: boolean;
  periodStart: Date;
  periodEnd: Date;
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
    lines.push(formatSection("News Relevant to You", brief.relevantToYou));
    lines.push("");
    lines.push(formatSection("What To Test This Week", brief.whatToTest));
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
