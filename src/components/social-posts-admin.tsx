"use client";

import { useState, useEffect, useCallback } from "react";

interface SocialPost {
  id: string;
  platform: "LINKEDIN" | "TWITTER";
  segment: string;
  segmentType: string;
  segmentLabel: string;
  content: string;
  hashtags: string[];
  sourceHeadline: string | null;
  sourceUrl: string | null;
  status: "DRAFT" | "APPROVED" | "SCHEDULED" | "PUBLISHED" | "REJECTED";
  scheduledFor: string | null;
  bufferPostId: string | null;
  weekOf: string;
  createdAt: string;
}

interface Props {
  initialWeeks: string[];
}

export default function SocialPostsAdmin({ initialWeeks }: Props) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [weeks, setWeeks] = useState<string[]>(initialWeeks);
  const [selectedWeek, setSelectedWeek] = useState(initialWeeks[0] || "");
  const [platformFilter, setPlatformFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!selectedWeek) return;
    setLoading(true);
    const params = new URLSearchParams({ weekOf: selectedWeek });
    if (platformFilter !== "ALL") params.set("platform", platformFilter);
    if (typeFilter !== "ALL") params.set("segmentType", typeFilter);
    if (statusFilter !== "ALL") params.set("status", statusFilter);

    const res = await fetch(`/api/admin/social-posts?${params}`);
    const data = await res.json();
    setPosts(data.posts || []);
    if (data.weeks?.length) setWeeks(data.weeks.map((w: string) => w));
    setSelected(new Set());
    setLoading(false);
  }, [selectedWeek, platformFilter, typeFilter, statusFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const stats = {
    total: posts.length,
    approved: posts.filter((p) => p.status === "APPROVED").length,
    scheduled: posts.filter((p) => p.status === "SCHEDULED").length,
    rejected: posts.filter((p) => p.status === "REJECTED").length,
  };

  async function bulkUpdateStatus(status: string) {
    if (selected.size === 0) return;
    await fetch("/api/admin/social-posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected], status }),
    });
    await fetchPosts();
  }

  async function updatePost(id: string, data: Partial<SocialPost>) {
    await fetch(`/api/admin/social-posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await fetchPosts();
  }

  async function scheduleToBuffer() {
    const approvedIds = posts
      .filter((p) => selected.has(p.id) && p.status === "APPROVED")
      .map((p) => p.id);
    if (approvedIds.length === 0) return;

    setScheduling(true);
    await fetch("/api/admin/social-posts/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: approvedIds }),
    });
    setScheduling(false);
    await fetchPosts();
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === posts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(posts.map((p) => p.id)));
    }
  }

  const platformBadge = (platform: string) => {
    const color =
      platform === "LINKEDIN"
        ? "bg-blue-100 text-blue-800"
        : "bg-sky-100 text-sky-800";
    return (
      <span
        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${color}`}
      >
        {platform === "LINKEDIN" ? "LinkedIn" : "X/Twitter"}
      </span>
    );
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-700",
      APPROVED: "bg-green-100 text-green-700",
      SCHEDULED: "bg-purple-100 text-purple-700",
      PUBLISHED: "bg-blue-100 text-blue-700",
      REJECTED: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || "bg-gray-100"}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          {weeks.map((w) => (
            <option key={w} value={w}>
              Week of {new Date(w).toLocaleDateString()}
            </option>
          ))}
        </select>
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="ALL">All Platforms</option>
          <option value="LINKEDIN">LinkedIn</option>
          <option value="TWITTER">Twitter/X</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="ALL">All Types</option>
          <option value="role">Role</option>
          <option value="industry">Industry</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="ALL">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="APPROVED">Approved</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
        <span className="text-gray-600">
          <strong>{stats.total}</strong> total
        </span>
        <span className="text-green-700">
          <strong>{stats.approved}</strong> approved
        </span>
        <span className="text-purple-700">
          <strong>{stats.scheduled}</strong> scheduled
        </span>
        <span className="text-red-700">
          <strong>{stats.rejected}</strong> rejected
        </span>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm">
          <span className="font-medium text-blue-900">
            {selected.size} selected
          </span>
          <button
            onClick={() => bulkUpdateStatus("APPROVED")}
            className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => bulkUpdateStatus("REJECTED")}
            className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
          >
            Reject
          </button>
          <button
            onClick={scheduleToBuffer}
            disabled={scheduling}
            className="rounded bg-purple-600 px-3 py-1 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {scheduling ? "Sending..." : "Send to Buffer"}
          </button>
        </div>
      )}

      {/* Posts grid */}
      {loading ? (
        <div className="py-12 text-center text-sm text-gray-500">
          Loading...
        </div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-500">
          No posts found for this week.
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-1 pb-2">
            <input
              type="checkbox"
              checked={selected.size === posts.length && posts.length > 0}
              onChange={toggleAll}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-xs text-gray-500">Select all</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected.has(post.id)}
                    onChange={() => toggleSelect(post.id)}
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                  <div className="min-w-0 flex-1">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2">
                      {platformBadge(post.platform)}
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {post.segmentLabel}
                      </span>
                      {statusBadge(post.status)}
                    </div>

                    {/* Content */}
                    {editingId === post.id ? (
                      <div className="mt-3 space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={6}
                          className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              await updatePost(post.id, {
                                content: editContent,
                              });
                              setEditingId(null);
                            }}
                            className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p
                        className="mt-3 cursor-pointer whitespace-pre-wrap text-sm text-gray-800 hover:bg-gray-50"
                        onClick={() => {
                          setEditingId(post.id);
                          setEditContent(post.content);
                        }}
                        title="Click to edit"
                      >
                        {post.content}
                      </p>
                    )}

                    {/* Hashtags */}
                    {post.hashtags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {post.hashtags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-blue-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Source */}
                    {post.sourceHeadline && (
                      <p className="mt-2 text-xs text-gray-500">
                        Source:{" "}
                        {post.sourceUrl ? (
                          <a
                            href={post.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {post.sourceHeadline}
                          </a>
                        ) : (
                          post.sourceHeadline
                        )}
                      </p>
                    )}

                    {/* Scheduled info */}
                    {post.scheduledFor && (
                      <p className="mt-1 text-xs text-purple-600">
                        Scheduled: {new Date(post.scheduledFor).toLocaleString()}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="mt-3 flex gap-2">
                      {post.status === "DRAFT" && (
                        <>
                          <button
                            onClick={() =>
                              updatePost(post.id, { status: "APPROVED" })
                            }
                            className="rounded bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              updatePost(post.id, { status: "REJECTED" })
                            }
                            className="rounded border border-gray-300 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {post.status === "APPROVED" && (
                        <button
                          onClick={() =>
                            updatePost(post.id, { status: "DRAFT" })
                          }
                          className="rounded border border-gray-300 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50"
                        >
                          Back to Draft
                        </button>
                      )}
                      {post.status === "REJECTED" && (
                        <button
                          onClick={() =>
                            updatePost(post.id, { status: "DRAFT" })
                          }
                          className="rounded border border-gray-300 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
