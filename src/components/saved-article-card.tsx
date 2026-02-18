"use client";

import { useState } from "react";

interface SavedArticleCardProps {
  id: string;
  url: string;
  title: string;
  summary: string;
  source?: string | null;
  createdAt: string;
  onRemoved?: (id: string) => void;
}

export default function SavedArticleCard({
  id,
  url,
  title,
  summary,
  source,
  createdAt,
  onRemoved,
}: SavedArticleCardProps) {
  const [removing, setRemoving] = useState(false);
  const [removed, setRemoved] = useState(false);

  async function handleRemove() {
    setRemoving(true);
    try {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title, summary, source }),
      });
      setRemoved(true);
      onRemoved?.(id);
    } finally {
      setRemoving(false);
    }
  }

  if (removed) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-6 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {title}
          </a>
          {source && (
            <p className="mt-0.5 text-xs text-gray-400">{source}</p>
          )}
          <p className="mt-1 text-sm text-gray-600">{summary}</p>
          <p className="mt-1 text-xs text-gray-400">
            Saved {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleRemove}
          disabled={removing}
          className="shrink-0 text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          {removing ? "Removing..." : "Remove"}
        </button>
      </div>
    </div>
  );
}
