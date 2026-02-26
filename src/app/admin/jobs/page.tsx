import { prisma } from "@/lib/prisma";
import type { JobRun } from "@/generated/prisma/client";

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "SUCCESS"
      ? "bg-green-50 text-green-700"
      : status === "RUNNING"
        ? "bg-purple-50 text-purple-700"
        : "bg-red-50 text-red-700";
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${color}`}
    >
      {status}
    </span>
  );
}

function HealthIndicator({
  lastRun,
}: {
  lastRun: JobRun | undefined;
}) {
  if (!lastRun) {
    return (
      <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-300" title="No runs yet" />
    );
  }

  const daysSince =
    (Date.now() - lastRun.startedAt.getTime()) / (1000 * 60 * 60 * 24);

  if (lastRun.status === "FAILURE") {
    return (
      <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" title="Last run failed" />
    );
  }
  if (daysSince > 7) {
    return (
      <span
        className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-400"
        title={`Last run ${Math.floor(daysSince)}d ago`}
      />
    );
  }
  return (
    <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" title="Healthy" />
  );
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function MetricPill({ label, value }: { label: string; value: unknown }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
      <span className="text-gray-500">{label}:</span> {String(value)}
    </span>
  );
}

function JobSummaryCard({
  title,
  lastRun,
  metricKeys,
}: {
  title: string;
  lastRun: JobRun | undefined;
  metricKeys: string[];
}) {
  const metrics = (lastRun?.metrics ?? {}) as Record<string, unknown>;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HealthIndicator lastRun={lastRun} />
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
        {lastRun && <StatusBadge status={lastRun.status} />}
      </div>
      {lastRun ? (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-gray-500">
            Ran {timeAgo(lastRun.startedAt)} &middot;{" "}
            {lastRun.startedAt.toLocaleString()}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {metricKeys.map(
              (key) =>
                metrics[key] != null && (
                  <MetricPill key={key} label={key} value={metrics[key]} />
                ),
            )}
          </div>
          {lastRun.error && (
            <p className="text-xs text-red-600 line-clamp-2">
              {lastRun.error}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-3 text-xs text-gray-400">No runs yet</p>
      )}
    </div>
  );
}

export default async function AdminJobsPage() {
  const jobRuns = await prisma.jobRun.findMany({
    orderBy: { startedAt: "desc" },
    take: 50,
  });

  const lastDigest = jobRuns.find((r) => r.jobName === "weekly-digest");
  const lastIngest = jobRuns.find((r) => r.jobName === "ingestion");
  const lastSocial = jobRuns.find((r) => r.jobName === "social-posts");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Job Runs</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <JobSummaryCard
          title="Weekly Digest"
          lastRun={lastDigest}
          metricKeys={[
            "freeUsersProcessed",
            "paidUsersProcessed",
            "emailsSent",
            "telegramsSent",
            "errorCount",
          ]}
        />
        <JobSummaryCard
          title="Ingestion"
          lastRun={lastIngest}
          metricKeys={["sourcesProcessed", "itemsUpserted", "errorCount"]}
        />
        <JobSummaryCard
          title="Social Posts"
          lastRun={lastSocial}
          metricKeys={["segmentsProcessed", "postsGenerated", "errorCount"]}
        />
      </div>

      {/* Full history table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left font-medium text-gray-500">Job</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Started</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Ended</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Metrics</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Error</th>
            </tr>
          </thead>
          <tbody>
            {jobRuns.map((run) => (
              <tr key={run.id} className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {run.jobName}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={run.status} />
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {run.startedAt.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {run.endedAt?.toLocaleString() ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {run.metrics ? (
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(run.metrics, null, 2)}
                    </pre>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  {run.error ? (
                    <span className="text-xs text-red-600 line-clamp-2">
                      {run.error}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobRuns.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">
            No job runs yet.
          </div>
        )}
      </div>
    </div>
  );
}
