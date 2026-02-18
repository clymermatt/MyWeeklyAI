import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-lg font-bold text-gray-900"
            >
              ContextBrief
            </Link>
            <div className="flex gap-6">
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/profile"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                My Profile
              </Link>
              <Link
                href="/dashboard/briefings"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                My Briefings
              </Link>
              <Link
                href="/dashboard/saved"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Saved
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user.email}</span>
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
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
