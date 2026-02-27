import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-lg font-bold text-gray-900">
              My Weekly AI <span className="text-xs font-normal text-red-500">Admin</span>
            </Link>
            <div className="flex gap-6">
              <Link
                href="/admin/sources"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sources
              </Link>
              <Link
                href="/admin/jobs"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Jobs
              </Link>
              <Link
                href="/admin/social"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Social
              </Link>
              <Link
                href="/admin/guide"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Guide
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
