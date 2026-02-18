"use client";

import { useState } from "react";

interface BookmarkButtonProps {
  url: string;
  title: string;
  summary: string;
  source?: string;
  digestId?: string;
  initialBookmarked: boolean;
  onToggle?: (url: string, bookmarked: boolean) => void;
}

export default function BookmarkButton({
  url,
  title,
  summary,
  source,
  digestId,
  initialBookmarked,
  onToggle,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (pending) return;
    const next = !bookmarked;
    setBookmarked(next); // optimistic
    setPending(true);

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title, summary, source, digestId }),
      });
      const data = await res.json();
      setBookmarked(data.bookmarked);
      onToggle?.(url, data.bookmarked);
    } catch {
      setBookmarked(!next); // revert on error
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      className="shrink-0 p-1 text-gray-400 hover:text-blue-600 transition-colors"
      title={bookmarked ? "Remove bookmark" : "Save article"}
      aria-label={bookmarked ? "Remove bookmark" : "Save article"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className={`h-4 w-4 ${bookmarked ? "text-blue-600" : ""}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z"
        />
      </svg>
    </button>
  );
}
