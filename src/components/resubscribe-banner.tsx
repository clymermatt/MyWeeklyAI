"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResubscribeBanner() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleResubscribe() {
    setLoading(true);
    try {
      const res = await fetch("/api/user/resubscribe", { method: "POST" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border-2 border-amber-400 bg-amber-50 px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51" />
          </svg>
        </span>
        <div className="flex-1">
          <p className="font-medium text-gray-900">
            Email briefings are paused
          </p>
          <p className="mt-0.5 text-sm text-gray-600">
            You previously unsubscribed from email briefings. Resubscribe to start receiving them again.
          </p>
        </div>
        <button
          onClick={handleResubscribe}
          disabled={loading}
          className="shrink-0 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Resubscribing..." : "Resubscribe"}
        </button>
      </div>
    </div>
  );
}
