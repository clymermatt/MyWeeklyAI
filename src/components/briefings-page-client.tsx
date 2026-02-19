"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import DigestCard from "@/components/digest-card";

interface SerializedDigest {
  id: string;
  briefJson: unknown;
  isFree: boolean;
  periodStart: string;
  periodEnd: string;
  sentAt: string;
}

interface BriefingsPageClientProps {
  initialDigests: SerializedDigest[];
  bookmarkedUrls: string[];
}

export default function BriefingsPageClient({
  initialDigests,
  bookmarkedUrls: initialBookmarkedUrls,
}: BriefingsPageClientProps) {
  const [digests, setDigests] = useState(initialDigests);
  const [bookmarkedSet, setBookmarkedSet] = useState(
    () => new Set(initialBookmarkedUrls),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [isSearchResult, setIsSearchResult] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBookmarkToggle = useCallback(
    (url: string, bookmarked: boolean) => {
      setBookmarkedSet((prev) => {
        const next = new Set(prev);
        if (bookmarked) {
          next.add(url);
        } else {
          next.delete(url);
        }
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!searchQuery.trim()) {
      setDigests(initialDigests);
      setIsSearchResult(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/digests/search?q=${encodeURIComponent(searchQuery.trim())}`,
        );
        if (res.ok) {
          const data = await res.json();
          setDigests(data);
          setIsSearchResult(true);
        }
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, initialDigests]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Briefings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Your past weekly AI briefs.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles across all briefings..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <svg
          className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
          />
        </svg>
        {searching && (
          <span className="absolute right-3 top-2.5 text-xs text-gray-400">
            Searching...
          </span>
        )}
      </div>

      {isSearchResult && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            Showing results for &ldquo;{searchQuery}&rdquo; ({digests.length}{" "}
            {digests.length === 1 ? "briefing" : "briefings"})
          </span>
          <button
            onClick={() => setSearchQuery("")}
            className="text-purple-600 hover:text-purple-700"
          >
            Clear
          </button>
        </div>
      )}

      {digests.length > 0 ? (
        <div className="space-y-4">
          {digests.map((digest) => (
            <DigestCard
              key={digest.id}
              digest={digest}
              bookmarkedUrls={bookmarkedSet}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
          {isSearchResult ? (
            <p className="text-sm text-gray-500">
              No briefings match your search.
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-500">No briefings yet.</p>
              <p className="mt-1 text-sm text-gray-400">
                Set up your context profile to start receiving weekly briefs.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
