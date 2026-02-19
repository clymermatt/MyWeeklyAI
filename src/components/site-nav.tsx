import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UserMenu from "@/components/user-menu";

export default async function SiteNav() {
  const session = await auth();

  let plan: "Free" | "Pro" = "Free";
  if (session?.user?.id) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: { status: true },
    });
    plan = subscription?.status === "ACTIVE" ? "Pro" : "Free";
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-bold text-gray-900">
            My Weekly AI
          </Link>
          <div className="flex gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              My Dashboard
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
              Saved Articles
            </Link>
          </div>
        </div>
        {session ? (
          <div className="flex items-center gap-4">
            <UserMenu
              name={session.user!.name?.split(" ")[0] || session.user!.email!.split("@")[0]}
              plan={plan}
            />
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
        ) : (
          <Link
            href="/auth/signin"
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
