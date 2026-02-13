"use client";

import { useState } from "react";
import type { BriefOutput, BriefItem } from "@/types/brief";

interface DigestProps {
  digest: {
    id: string;
    briefJson: unknown;
    periodStart: Date | string;
    periodEnd: Date | string;
    sentAt: Date | string;
  };
}

function ItemSection({
  title,
  items,
  showRelevance,
}: {
  title: string;
  items: BriefItem[];
  showRelevance?: boolean;
}) {
  return (
    <div>
      <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {item.title}
            </a>
            <p className="mt-0.5 text-sm text-gray-600">{item.summary}</p>
            {showRelevance && item.relevanceNote && (
              <p className="mt-0.5 text-xs italic text-gray-400">
                {item.relevanceNote}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DigestCard({ digest }: DigestProps) {
  const [expanded, setExpanded] = useState(false);
  const brief = digest.briefJson as BriefOutput;
  const start = new Date(digest.periodStart).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const end = new Date(digest.periodEnd).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <div>
          <span className="text-sm font-medium text-gray-900">
            {start} &ndash; {end}
          </span>
          <span className="ml-3 text-xs text-gray-400">
            Sent {new Date(digest.sentAt).toLocaleDateString()}
          </span>
        </div>
        <span className="text-gray-400">{expanded ? "−" : "+"}</span>
      </button>

      {expanded && (
        <div className="space-y-6 border-t border-gray-100 px-6 py-4">
          <ItemSection title="What Dropped" items={brief.whatDropped} />
          <ItemSection
            title="Relevant To You"
            items={brief.relevantToYou}
            showRelevance
          />
          <ItemSection
            title="What To Test"
            items={brief.whatToTest}
            showRelevance
          />
          <div>
            <h3 className="mb-1 font-semibold text-gray-500">Filtered Out</h3>
            <p className="text-sm text-gray-400">{brief.ignoreSummary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
