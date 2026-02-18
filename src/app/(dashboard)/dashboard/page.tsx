import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SubscriptionButton from "@/components/subscription-button";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [profile, subscription, recentDigests] = await Promise.all([
    prisma.contextProfile.findUnique({ where: { userId } }),
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.weeklyDigest.findMany({
      where: { userId },
      orderBy: { sentAt: "desc" },
      take: 3,
    }),
  ]);

  const isActive = subscription?.status === "ACTIVE";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {session!.user!.name?.split(" ")[0] || session!.user!.email}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Context Profile Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-medium text-gray-500">
            Context Profile
          </h2>
          {profile ? (
            <div className="mt-2">
              <p className="text-lg font-semibold text-green-600">Complete</p>
              <p className="mt-1 text-sm text-gray-600">
                {profile.roleTitle || "No role set"} &middot;{" "}
                {profile.industry || "No industry"}
              </p>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-lg font-semibold text-amber-600">
                Not set up
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Create your profile to get personalized briefs
              </p>
            </div>
          )}
          <Link
            href="/dashboard/profile"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {profile ? "Edit profile" : "Create profile"} &rarr;
          </Link>
        </div>

        {/* Subscription Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-medium text-gray-500">Plan</h2>
          {isActive ? (
            <div className="mt-2">
              <p className="text-lg font-semibold text-green-600">Pro</p>
              <p className="mt-1 text-sm text-gray-600">
                Renews{" "}
                {subscription.currentPeriodEnd?.toLocaleDateString() ?? "—"}
              </p>
              <a
                href="/api/stripe/portal"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Manage subscription &rarr;
              </a>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-900">Free</p>
              <p className="mt-1 text-sm text-gray-600">
                You get the weekly &ldquo;What Dropped&rdquo; section.
                Upgrade to unlock personalized picks and action items.
              </p>
              <div className="mt-4">
                <SubscriptionButton />
              </div>
            </div>
          )}
        </div>

        {/* Recent Digests Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-medium text-gray-500">
            Recent Briefings
          </h2>
          {recentDigests.length > 0 ? (
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-900">
                {recentDigests.length}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Latest: {recentDigests[0].sentAt.toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-400">None yet</p>
              <p className="mt-1 text-sm text-gray-600">
                Your first brief will arrive this Sunday
              </p>
            </div>
          )}
          <Link
            href="/dashboard/briefings"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
