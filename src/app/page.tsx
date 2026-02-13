import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          ContextBrief
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          A personalized weekly AI news digest, tailored to your role, tools,
          and interests.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          )}
        </div>

        <div className="mt-16 grid gap-8 text-left sm:grid-cols-3">
          <div>
            <h3 className="font-semibold text-gray-900">
              Create Your Context
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Tell us your role, industry, tools, and goals. We use this to
              filter and rank AI news that matters to you.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              AI-Powered Curation
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Claude analyzes hundreds of AI articles weekly and picks what's
              relevant to your specific context.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Weekly Email Brief
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Get a concise, actionable email every Sunday with what dropped,
              what's relevant, and what to test.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
