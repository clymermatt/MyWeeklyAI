"use client";

import { useState } from "react";
import Link from "next/link";
import type { BriefOutput, BriefItem, FreeBriefStored } from "@/types/brief";
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
}

function ItemSection({
  title,
  items,
  showRelevance,
  digestId,
  bookmarkedUrls,
  onBookmarkToggle,
}: {
  title: string;
  items: BriefItem[];
  showRelevance?: boolean;
  digestId: string;
  bookmarkedUrls?: Set<string>;
  onBookmarkToggle?: (url: string, bookmarked: boolean) => void;
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
                  {item.relevanceNote}
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

function LockedSectionPlaceholder({ title }: { title: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4">
      {/* Blurred placeholder lines */}
      <div className="select-none blur-sm" aria-hidden="true">
        <h3 className="mb-2 font-semibold text-gray-400">{title}</h3>
        <div className="space-y-2">
          <div className="h-3 w-3/4 rounded bg-gray-300" />
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-2/3 rounded bg-gray-300" />
          <div className="h-3 w-5/6 rounded bg-gray-200" />
        </div>
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60">
        <p className="mb-2 text-sm font-medium text-gray-700">
          {title} — Pro only
        </p>
        <Link
          href="/dashboard"
          className="rounded-md bg-purple-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-purple-700"
        >
          Upgrade to unlock
        </Link>
      </div>
    </div>
  );
}

export default function DigestCard({
  digest,
  bookmarkedUrls,
  onBookmarkToggle,
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
          {digest.isFree && (
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-500">
              Free
            </span>
          )}
          <span className="text-xs text-gray-400">
            Sent {new Date(digest.sentAt).toLocaleDateString()}
          </span>
        </div>
        <span className="text-gray-400">{expanded ? "−" : "+"}</span>
      </button>

      {expanded && (
        <div className="space-y-6 border-t border-gray-100 px-6 py-4">
          {digest.isFree ? (
            <>
              {"industryNews" in brief ? (
                <>
                  <ItemSection
                    title="Industry News"
                    items={(brief as FreeBriefStored).industryNews}
                    digestId={digest.id}
                    bookmarkedUrls={bookmarkedUrls}
                    onBookmarkToggle={onBookmarkToggle}
                  />
                  <ItemSection
                    title="AI Lab Announcements"
                    items={(brief as FreeBriefStored).labUpdates}
                    digestId={digest.id}
                    bookmarkedUrls={bookmarkedUrls}
                    onBookmarkToggle={onBookmarkToggle}
                  />
                </>
              ) : (
                <ItemSection
                  title="What Dropped"
                  items={brief.whatDropped}
                  digestId={digest.id}
                  bookmarkedUrls={bookmarkedUrls}
                  onBookmarkToggle={onBookmarkToggle}
                />
              )}
              <LockedSectionPlaceholder title="Relevant To You" />
              <LockedSectionPlaceholder title="What To Test This Week" />
            </>
          ) : (
            <>
              {/* Relevant To You — shown first as the primary value */}
              <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="font-semibold text-purple-900">
                    Relevant To You
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
                  {brief.relevantToYou.map((item, i) => (
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
                          <p className="mt-1 text-xs text-purple-600/70">
                            Why this matters to you: {item.relevanceNote}
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

              <ItemSection
                title="What To Test This Week"
                items={brief.whatToTest}
                showRelevance
                digestId={digest.id}
                bookmarkedUrls={bookmarkedUrls}
                onBookmarkToggle={onBookmarkToggle}
              />
              <ItemSection
                title="What Dropped"
                items={brief.whatDropped}
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
