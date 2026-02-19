import { prisma } from "@/lib/prisma";

export default async function AdminJobsPage() {
  const jobRuns = await prisma.jobRun.findMany({
    orderBy: { startedAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Job Runs</h1>

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
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      run.status === "SUCCESS"
                        ? "bg-green-50 text-green-700"
                        : run.status === "RUNNING"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {run.status}
                  </span>
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
