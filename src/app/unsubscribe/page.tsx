import Link from "next/link";
import SiteNav from "@/components/site-nav";

export const metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const success = params.success === "true";
  const error = params.error;

  return (
    <div className="min-h-screen bg-gray-50">
    <SiteNav />
    <div className="flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-sm">
        {success ? (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              You&apos;ve been unsubscribed
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              You will no longer receive email briefings from My Weekly AI. You
              can resubscribe at any time from your dashboard.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {error === "not-found"
                ? "We couldn't find your account. It may have been deleted."
                : "This unsubscribe link is invalid or expired."}
            </p>
          </>
        )}
        <div className="mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-purple-600 hover:text-purple-700"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
