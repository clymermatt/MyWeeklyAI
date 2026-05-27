/**
 * Shown while the results page is awaiting data — most importantly during the
 * first-claim render when ensureReportContent fires 6 LLM calls (~6-10s).
 */
export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
      <p className="text-base font-medium text-gray-700">
        Preparing your personalized report…
      </p>
      <p className="max-w-sm text-sm text-gray-500">
        We&apos;re generating your task-by-task analysis, pivot-path fit, and
        30-day action plan. This usually takes a few seconds.
      </p>
    </div>
  );
}
