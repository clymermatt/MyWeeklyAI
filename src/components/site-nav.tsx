import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UserMenu from "@/components/user-menu";
import MobileNav from "@/components/mobile-nav";

export default async function SiteNav() {
  const session = await auth();

  let plan: "Free" | "Pro" = "Free";
  let isAdmin = false;
  if (session?.user?.id) {
    const [subscription, user] = await Promise.all([
      prisma.subscription.findUnique({
        where: { userId: session.user.id },
        select: { status: true },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      }),
    ]);
    plan = subscription?.status === "ACTIVE" ? "Pro" : "Free";
    isAdmin = user?.role === "ADMIN";
  }

  const userName = session?.user?.name?.split(" ")[0] || session?.user?.email?.split("@")[0];

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="shrink-0">
            <Image
              src="/logos/nav-logo.svg"
              alt="My Weekly AI"
              width={180}
              height={32}
              className="hidden sm:block h-8 w-auto"
              priority
            />
            <Image
              src="/logos/icon.svg"
              alt="My Weekly AI"
              width={32}
              height={32}
              className="block sm:hidden h-7 w-7"
              priority
            />
          </Link>
          <div className="hidden md:flex gap-6">
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
          <div className="hidden md:flex items-center gap-4">
            <UserMenu
              name={userName!}
              plan={plan}
              isAdmin={isAdmin}
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
            className="hidden md:inline-flex rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
          >
            Sign In
          </Link>
        )}
        <MobileNav
          isAuthenticated={!!session}
          userName={userName}
          plan={plan}
          isAdmin={isAdmin}
        />
      </div>
    </nav>
  );
}
