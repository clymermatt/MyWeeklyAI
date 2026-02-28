"use client";

import { useState } from "react";
import Link from "next/link";
import type { BriefOutput, BriefItem } from "@/types/brief";
import BookmarkButton from "@/components/bookmark-button";

interface DigestProps {
  digest: {
    id: string;
    briefJson: unknown;
    isFree: boolean;
    periodStart: Date | string;
    periodEnd: Date | string;
    sentAt: Date | string;
  };
  bookmarkedUrls?: Set<string>;
  onBookmarkToggle?: (url: string, bookmarked: boolean) => void;
  profileTerms?: string[];
}

function highlightTerms(text: string, terms: string[]) {
  if (!terms.length) return text;

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
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <span key={i} className="font-semibold text-purple-600">
          {part}
        </span>
      );
    }
    return part;
  });
}

function ItemSection({
  title,
  items,
  showRelevance,
  digestId,
  bookmarkedUrls,
  onBookmarkToggle,
  profileTerms = [],
}: {
  title: string;
  items: BriefItem[];
  showRelevance?: boolean;
  digestId: string;
  bookmarkedUrls?: Set<string>;
  onBookmarkToggle?: (url: string, bookmarked: boolean) => void;
  profileTerms?: string[];
}) {
  return (
    <div>
      <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                {item.title}
              </a>
              {item.source && (
                <p className="mt-0.5 text-xs text-gray-400">{item.source}</p>
              )}
              <p className="mt-0.5 text-sm text-gray-600">{item.summary}</p>
              {showRelevance && item.relevanceNote && (
                <p className="mt-0.5 text-xs italic text-gray-400">
                  <span className="font-bold not-italic">Why this matters to you:</span> {highlightTerms(item.relevanceNote, profileTerms)}
                </p>
              )}
            </div>
            <BookmarkButton
              url={item.url}
              title={item.title}
              summary={item.summary}
              source={item.source}
              digestId={digestId}
              initialBookmarked={bookmarkedUrls?.has(item.url) ?? false}
              onToggle={onBookmarkToggle}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DigestCard({
  digest,
  bookmarkedUrls,
  onBookmarkToggle,
  profileTerms = [],
}: DigestProps) {
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
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {start} &ndash; {end}
          </span>
          <span className="text-xs text-gray-400">
            Sent {new Date(digest.sentAt).toLocaleDateString()}
          </span>
        </div>
        <span className="text-gray-400">{expanded ? "\u2212" : "+"}</span>
      </button>

      {expanded && (
        <div className="space-y-6 border-t border-gray-100 px-6 py-4">
          {/* Personalized sections */}
          <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-4 space-y-6">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="font-semibold text-purple-900">
                  News Relevant to You
                </h3>
                <Link
                  href="/dashboard/profile"
                  className="text-xs text-purple-500 hover:text-purple-600"
                  title="Changes apply to your next digest"
                >
                  Edit profile &rarr;
                </Link>
                <span className="text-xs text-gray-400">
                  (changes apply next week)
                </span>
              </div>
              <ul className="space-y-3">
                {(brief.relevantToYou ?? []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-purple-700 hover:text-purple-800"
                      >
                        {item.title}
                      </a>
                      <p className="mt-0.5 text-sm text-gray-700">
                        {item.summary}
                      </p>
                      {item.relevanceNote && (
                        <p className="mt-1 text-xs italic text-gray-500">
                          <span className="font-bold not-italic">Why this matters to you:</span> {highlightTerms(item.relevanceNote, profileTerms)}
                        </p>
                      )}
                    </div>
                    <BookmarkButton
                      url={item.url}
                      title={item.title}
                      summary={item.summary}
                      source={item.source}
                      digestId={digest.id}
                      initialBookmarked={
                        bookmarkedUrls?.has(item.url) ?? false
                      }
                      onToggle={onBookmarkToggle}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-purple-200 pt-4">
              <ItemSection
                title="What To Test This Week"
                items={brief.whatToTest ?? []}
                showRelevance
                digestId={digest.id}
                bookmarkedUrls={bookmarkedUrls}
                onBookmarkToggle={onBookmarkToggle}
                profileTerms={profileTerms}
              />
            </div>
          </div>
          <ItemSection
            title="Industry News"
            items={brief.whatDropped ?? []}
            digestId={digest.id}
            bookmarkedUrls={bookmarkedUrls}
            onBookmarkToggle={onBookmarkToggle}
          />
          <div>
            <h3 className="mb-1 font-semibold text-gray-500">
              Filtered Out
            </h3>
            <p className="text-sm text-gray-400">{brief.ignoreSummary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
