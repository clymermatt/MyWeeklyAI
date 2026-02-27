"use client";

import { useState } from "react";

export default function DeleteAccountCard() {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete account");
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-lg border border-red-200 bg-white p-6">
      <h2 className="text-sm font-medium text-red-600">Danger Zone</h2>

      {!confirming ? (
        <div className="mt-3">
          <button
            onClick={() => setConfirming(true)}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete my account
          </button>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <p className="text-sm text-gray-600">
            This will permanently delete your account and all associated data
            including your profile, digests, bookmarks, and subscription. This
            action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setConfirming(false);
                setError(null);
              }}
              disabled={deleting}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Yes, delete my account"}
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
