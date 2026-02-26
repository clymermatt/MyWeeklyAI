import Link from "next/link";
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
    <nav className="relative border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#9333ea"/>
              <path d="M16 6 A10 10 0 0 0 7.34 11" fill="none" stroke="white" strokeWidth="2.5" opacity="0.7" strokeLinecap="round"/>
              <path d="M7.34 11 A10 10 0 0 0 7.34 21" fill="none" stroke="white" strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>
              <path d="M7.34 21 A10 10 0 0 0 16 26" fill="none" stroke="white" strokeWidth="2.5" opacity="0.35" strokeLinecap="round"/>
              <path d="M16 26 A10 10 0 0 0 24.66 21" fill="none" stroke="white" strokeWidth="2.5" opacity="0.2" strokeLinecap="round"/>
              <path d="M24.66 21 A10 10 0 0 0 24.66 11" fill="none" stroke="white" strokeWidth="2.5" opacity="0.1" strokeLinecap="round"/>
              <path d="M24.66 11 A10 10 0 0 0 16 6" fill="none" stroke="white" strokeWidth="2.5" opacity="0.05" strokeLinecap="round"/>
              <path d="M16 9.5 A6.5 6.5 0 0 0 10.37 12.75" fill="none" stroke="white" strokeWidth="2.5" opacity="0.75" strokeLinecap="round"/>
              <path d="M10.37 12.75 A6.5 6.5 0 0 0 10.37 19.25" fill="none" stroke="white" strokeWidth="2.5" opacity="0.55" strokeLinecap="round"/>
              <path d="M10.37 19.25 A6.5 6.5 0 0 0 16 22.5" fill="none" stroke="white" strokeWidth="2.5" opacity="0.38" strokeLinecap="round"/>
              <path d="M16 22.5 A6.5 6.5 0 0 0 21.63 19.25" fill="none" stroke="white" strokeWidth="2.5" opacity="0.22" strokeLinecap="round"/>
              <path d="M21.63 19.25 A6.5 6.5 0 0 0 21.63 12.75" fill="none" stroke="white" strokeWidth="2.5" opacity="0.12" strokeLinecap="round"/>
              <path d="M21.63 12.75 A6.5 6.5 0 0 0 16 9.5" fill="none" stroke="white" strokeWidth="2.5" opacity="0.05" strokeLinecap="round"/>
              <path d="M16 13 A3 3 0 0 0 13.4 14.5" fill="none" stroke="white" strokeWidth="2.5" opacity="0.8" strokeLinecap="round"/>
              <path d="M13.4 14.5 A3 3 0 0 0 13.4 17.5" fill="none" stroke="white" strokeWidth="2.5" opacity="0.6" strokeLinecap="round"/>
              <path d="M13.4 17.5 A3 3 0 0 0 16 19" fill="none" stroke="white" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
              <path d="M16 19 A3 3 0 0 0 18.6 17.5" fill="none" stroke="white" strokeWidth="2.5" opacity="0.25" strokeLinecap="round"/>
              <path d="M18.6 17.5 A3 3 0 0 0 18.6 14.5" fill="none" stroke="white" strokeWidth="2.5" opacity="0.12" strokeLinecap="round"/>
              <path d="M18.6 14.5 A3 3 0 0 0 16 13" fill="none" stroke="white" strokeWidth="2.5" opacity="0.05" strokeLinecap="round"/>
              <line x1="16" y1="16" x2="16" y2="5.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="20" cy="10" r="2" fill="white"/>
            </svg>
            <span className="hidden sm:inline text-gray-900">My Weekly AI</span>
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
