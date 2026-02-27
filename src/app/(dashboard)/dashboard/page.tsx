import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardUpgradeCard from "@/components/dashboard-upgrade-card";
import TelegramConnectCard from "@/components/telegram-connect-card";
import ResubscribeBanner from "@/components/resubscribe-banner";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgrade?: string; subscription?: string }>;
}) {
  const session = await auth();
  const userId = session!.user!.id!;
  const params = await searchParams;

  const [profile, subscription, recentDigests, user] = await Promise.all([
    prisma.contextProfile.findUnique({ where: { userId } }),
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.weeklyDigest.findMany({
      where: { userId },
      orderBy: { sentAt: "desc" },
      take: 3,
    }),
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { telegramChatId: true, deliveryChannel: true, unsubscribedAt: true },
    }),
  ]);

  const justSubscribed = params.subscription === "success";
  const isActive = subscription?.status === "ACTIVE" || justSubscribed;
  const showUpgradeBanner = params.upgrade === "pro" && !isActive;

  const needsProfile = !profile;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {session!.user!.name?.split(" ")[0] || session!.user!.email}
        </p>
      </div>

      {user.unsubscribedAt && <ResubscribeBanner />}

      {needsProfile && (
        <div className="rounded-lg border-2 border-amber-400 bg-amber-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                Set up your context profile to get your first brief
              </p>
              <p className="mt-0.5 text-sm text-gray-600">
                Takes about 2 minutes. Your first brief will be delivered instantly to your inbox.
              </p>
            </div>
            <Link
              href="/dashboard/profile"
              className="shrink-0 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
            >
              Set up profile
            </Link>
          </div>
        </div>
      )}

      {showUpgradeBanner && (
        <div className="rounded-lg border-2 border-purple-600 bg-purple-50 p-6 text-center">
          <h2 className="text-lg font-bold text-gray-900">
            Start your 7-day free trial
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Get personalized AI briefings tailored to your role and industry.
            No charge for 7 days — cancel anytime.
          </p>
          <div className="mt-4">
            <DashboardUpgradeCard />
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Context Profile Card */}
        <div className={`rounded-lg p-6 ${needsProfile ? "border-2 border-amber-400 bg-amber-50/30" : "border border-gray-200 bg-white"}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-500">
              Context Profile
            </h2>
            {needsProfile && (
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
              </span>
            )}
          </div>
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
                Action needed
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Create your profile to get your first brief delivered instantly to your inbox, then each following Sunday.
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
                {subscription?.currentPeriodEnd
                  ? `Renews ${subscription.currentPeriodEnd.toLocaleDateString()}`
                  : "7-day free trial started"}
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
                You get the weekly &ldquo;Industry News&rdquo; section.
                Upgrade to Pro and unlock personalized picks and action
                items tailored to your role.
              </p>
              <div className="mt-4">
                <DashboardUpgradeCard variant="outline" />
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
                Complete your profile to get your first brief instantly
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

        {/* Delivery Channel Card */}
        <TelegramConnectCard
          isConnected={!!user.telegramChatId}
          currentChannel={user.deliveryChannel}
        />
      </div>
    </div>
  );
}
