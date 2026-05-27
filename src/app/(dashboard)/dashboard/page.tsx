import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTier } from "@/lib/ai-job-risk/tiers";
import TelegramConnectCard from "@/components/telegram-connect-card";
import ResubscribeBanner from "@/components/resubscribe-banner";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [profile, recentDigests, user, recentAssessments, bookmarkCount] =
    await Promise.all([
      prisma.contextProfile.findUnique({ where: { userId } }),
      prisma.weeklyDigest.findMany({
        where: { userId, isFree: false },
        orderBy: { sentAt: "desc" },
        take: 3,
      }),
      prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          telegramChatId: true,
          deliveryChannel: true,
          unsubscribedAt: true,
        },
      }),
      // Top 2 so we can compute the delta against the prior assessment (spec §11.6).
      prisma.assessmentResult.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 2,
        select: {
          resultId: true,
          roleAssessed: true,
          compositeScore: true,
          tier: true,
          createdAt: true,
        },
      }),
      prisma.bookmark.count({ where: { userId } }),
    ]);

  const needsProfile = !profile;
  const latestAssessment = recentAssessments[0];
  const previousAssessment = recentAssessments[1];
  // Only compare against the previous result if it was for the same role —
  // delta between different roles is meaningless.
  const scoreDelta =
    latestAssessment && previousAssessment &&
    latestAssessment.roleAssessed === previousAssessment.roleAssessed
      ? latestAssessment.compositeScore - previousAssessment.compositeScore
      : null;

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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* AI Job Risk Profile Card (spec §11.6) */}
        <div className="rounded-lg border border-purple-200 bg-purple-50/30 p-6">
          <h2 className="text-sm font-medium text-gray-500">
            AI Job Risk Profile
          </h2>
          {latestAssessment ? (
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-purple-700">
                  {latestAssessment.compositeScore}
                  <span className="text-base font-normal text-gray-400">/100</span>
                </p>
                {scoreDelta !== null && scoreDelta !== 0 && (
                  <span
                    className={`text-xs font-semibold ${
                      scoreDelta < 0 ? "text-green-600" : "text-amber-600"
                    }`}
                    aria-label={`${scoreDelta < 0 ? "Down" : "Up"} ${Math.abs(scoreDelta)} points from previous`}
                  >
                    {scoreDelta < 0 ? "▼" : "▲"} {Math.abs(scoreDelta)} pts
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {getTier(latestAssessment.tier).label} · Last assessed{" "}
                {latestAssessment.createdAt.toLocaleDateString()}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <Link
                  href={`/ai-job-risk/${latestAssessment.roleAssessed}/results/${latestAssessment.resultId}`}
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  View report &rarr;
                </Link>
                <Link
                  href={`/ai-job-risk/${latestAssessment.roleAssessed}/quiz`}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Retake
                </Link>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                We recommend retaking every 6 months to see how your situation
                evolves.
              </p>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-400">Not taken yet</p>
              <p className="mt-1 text-sm text-gray-600">
                See exactly which parts of your work are most exposed to AI
                displacement.
              </p>
              <Link
                href="/ai-job-risk"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Take the assessment &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Recent Briefings Card */}
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

        {/* Saved Articles Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-medium text-gray-500">Saved Articles</h2>
          {bookmarkCount > 0 ? (
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-900">
                {bookmarkCount}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {bookmarkCount === 1 ? "article" : "articles"} saved
              </p>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-400">None yet</p>
              <p className="mt-1 text-sm text-gray-600">
                Bookmark articles from your weekly briefings to revisit them
                later.
              </p>
            </div>
          )}
          <Link
            href="/dashboard/saved"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all &rarr;
          </Link>
        </div>

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

        {/* Plan Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-medium text-gray-500">Plan</h2>
          <div className="mt-2">
            <p className="text-lg font-semibold text-green-600">Free</p>
            <p className="mt-1 text-sm text-gray-600">
              Personalized briefings delivered every Sunday
            </p>
          </div>
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
