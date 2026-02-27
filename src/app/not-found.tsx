import Link from "next/link";
import SiteNav from "@/components/site-nav";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNav />
      <div className="flex flex-col items-center justify-center px-4 py-32">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          404
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/"
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 hover:shadow-md transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
