/**
 * Results page — shows the user their AI Disruption Score.
 *
 * State branches (spec §11.2 / §11.8):
 *   1. Anonymous viewer  → teaser score + auth gate (Google / Magic Link)
 *   2. Authenticated owner → full personalized report (7 sections, spec §6)
 *
 * Authenticated users with no claim on the result auto-claim it on first view
 * (spec §11.3 step 2). For owners on the first view we also fire 6 LLM calls to
 * generate report content (ensureReportContent in persist.ts); subsequent views
 * are served from the cached AssessmentResult.reportContent. Next's loading.tsx
 * shows during that ~6-10s first-time render.
 *
 * Shared-link mis-claim edge case is documented in persist.ts and v1-accepted.
 */

import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { renderToBuffer } from "@react-pdf/renderer";
import type { Metadata } from "next";

import { auth, signIn } from "@/lib/auth";
import FullReport from "@/components/ai-job-risk/full-report";
import { ReportPDF, pdfFilename } from "@/lib/ai-job-risk/pdf";
import { getRoleConfig } from "@/lib/ai-job-risk/roles";
import {
  claimAssessmentResult,
  ensureReportContent,
  getAssessmentResult,
} from "@/lib/ai-job-risk/persist";
import { getTier } from "@/lib/ai-job-risk/tiers";
import { sendAssessmentWelcomeEmail } from "@/lib/email/send";
import { generateUnsubscribeUrl } from "@/lib/unsubscribe";
import { utm, withUtm } from "@/lib/ai-job-risk/utm";
import type { RiskTierKey, SelectedPivotPath } from "@/lib/ai-job-risk/types";

const ASSESSMENT_COOKIE = "airisk_pending";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
};

export const metadata: Metadata = {
  // Result URLs are shareable to specific people, not search engines.
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ role: string; resultId: string }>;
}

export default async function ResultsPage({ params }: PageProps) {
  const { role, resultId } = await params;
  const roleConfig = getRoleConfig(role);
  if (!roleConfig) notFound();

  let result = await getAssessmentResult(resultId);
  if (!result || result.roleAssessed !== role) notFound();

  const session = await auth();

  // Opportunistic claim: authed user + still-anonymous result.
  let justClaimed = false;
  if (session?.user?.id && !result.userId) {
    justClaimed = await claimAssessmentResult(
      resultId,
      session.user.id,
      roleConfig,
    );
    if (justClaimed) {
      const refreshed = await getAssessmentResult(resultId);
      if (refreshed) result = refreshed;
    }
  }

  const isOwner = Boolean(
    session?.user?.id && result.userId === session.user.id,
  );

  // For owners, materialize the AI report content (cached after first view).
  const reportContent = isOwner
    ? await ensureReportContent(resultId, roleConfig)
    : null;

  // First-time claim: send the bespoke assessment welcome email with PDF
  // attached, then clear the funnel cookie. Best-effort: failures here must
  // not break the page render.
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  if (justClaimed && isOwner && reportContent && userId && userEmail) {
    const selectedPivotsForPdf = (result.selectedPivotPaths ??
      []) as unknown as SelectedPivotPath[];
    const pdfElement = (
      <ReportPDF
        compositeScore={result.compositeScore}
        tier={result.tier}
        factorBreakdown={{
          taskAutomatability: result.taskAutomatability,
          adoptionVelocity: result.adoptionVelocity,
          skillDifferentiationRaw: result.skillDifferentiationRaw,
          careerPortabilityRaw: result.careerPortabilityRaw,
          timeToImpactUrgency: result.timeToImpactUrgency,
        }}
        selectedPivots={selectedPivotsForPdf}
        pivotPaths={roleConfig.pivotPaths}
        taskLibrary={roleConfig.taskLibrary}
        rolePlural={roleConfig.pluralLabel}
        report={reportContent}
        date={result.createdAt}
        userEmail={userEmail}
      />
    );
    try {
      const pdfBuffer = await renderToBuffer(pdfElement);
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai";
      await sendAssessmentWelcomeEmail({
        to: userEmail,
        userName: session?.user?.name ?? undefined,
        rolePlural: roleConfig.pluralLabel,
        compositeScore: result.compositeScore,
        tierLabel: getTier(result.tier).label,
        resultUrl: withUtm(
          `${appUrl}/ai-job-risk/${role}/results/${resultId}`,
          utm.welcomeEmail("view_report"),
        ),
        dashboardUrl: withUtm(
          `${appUrl}/dashboard`,
          utm.welcomeEmail("dashboard"),
        ),
        pdfBuffer,
        pdfFilename: pdfFilename(roleConfig.pluralLabel, result.createdAt),
        unsubscribeUrl: generateUnsubscribeUrl(userId),
      });
    } catch (err) {
      console.error("Assessment welcome email failed:", err);
    }
    // Clear the funnel cookie regardless of email success.
    try {
      const cookieStore = await cookies();
      cookieStore.delete(ASSESSMENT_COOKIE);
    } catch {
      // ignore
    }
  }

  const redirectTo = `/ai-job-risk/${role}/results/${resultId}`;

  // Server actions for the auth gate — same providers as /auth/signin, with a
  // different redirectTo so the user returns here after authenticating. We
  // also set the funnel cookie so events.createUser and the post-claim path
  // know this signup originated from the assessment.
  const signInWithGoogle = async () => {
    "use server";
    const cookieStore = await cookies();
    cookieStore.set(ASSESSMENT_COOKIE, resultId, COOKIE_OPTIONS);
    await signIn("google", { redirectTo });
  };
  const signInWithEmail = async (formData: FormData) => {
    "use server";
    const email = formData.get("email");
    if (typeof email !== "string" || !email) return;
    const cookieStore = await cookies();
    cookieStore.set(ASSESSMENT_COOKIE, resultId, COOKIE_OPTIONS);
    await signIn("resend", { email, redirectTo });
  };

  const selectedPivots = (result.selectedPivotPaths ??
    []) as unknown as SelectedPivotPath[];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
          AI Job Risk Assessment
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
          Your AI Disruption Score
        </h1>
        <p className="mt-1 text-sm text-gray-500">{roleConfig.pluralLabel}</p>
      </header>

      {isOwner && reportContent ? (
        <FullReport
          resultId={resultId}
          compositeScore={result.compositeScore}
          tier={result.tier}
          factorBreakdown={{
            taskAutomatability: result.taskAutomatability,
            adoptionVelocity: result.adoptionVelocity,
            skillDifferentiationRaw: result.skillDifferentiationRaw,
            careerPortabilityRaw: result.careerPortabilityRaw,
            timeToImpactUrgency: result.timeToImpactUrgency,
          }}
          selectedPivots={selectedPivots}
          pivotPaths={roleConfig.pivotPaths}
          taskLibrary={roleConfig.taskLibrary}
          rolePlural={roleConfig.pluralLabel}
          report={reportContent}
        />
      ) : (
        <>
          <ScoreTeaserCard
            compositeScore={result.compositeScore}
            tier={result.tier}
          />
          <AuthGate
            signInWithGoogle={signInWithGoogle}
            signInWithEmail={signInWithEmail}
            rolePlural={roleConfig.pluralLabel}
          />
        </>
      )}
    </div>
  );
}

// ─── Teaser score card (anonymous viewers only) ──────────────────────────────

function ScoreTeaserCard({
  compositeScore,
  tier,
}: {
  compositeScore: number;
  tier: RiskTierKey;
}) {
  const tierDef = getTier(tier);
  return (
    <section className="mb-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
      <div className="flex items-baseline gap-3">
        <span className="text-5xl font-bold tracking-tight text-purple-700">
          {compositeScore}
        </span>
        <span className="text-base text-gray-400">/ 100</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-gray-900">
        Risk Tier: {tierDef.label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        {tierDef.description}
      </p>
    </section>
  );
}

// ─── Auth gate (spec §11.2) ──────────────────────────────────────────────────

function AuthGate({
  signInWithGoogle,
  signInWithEmail,
  rolePlural,
}: {
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (formData: FormData) => Promise<void>;
  rolePlural: string;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Get your full report
      </h2>
      <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
        <li>• Task-by-task analysis of what&apos;s exposed in your work</li>
        <li>• Your top 3 personalized pivot paths with salary ranges</li>
        <li>• A 30-day action plan</li>
        <li>• A PDF version delivered to your inbox</li>
      </ul>

      <form action={signInWithGoogle} className="mt-5">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-400">or</span>
        </div>
      </div>

      <form action={signInWithEmail} className="space-y-2">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
        >
          Send me my report →
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-500">
        By continuing, you&apos;ll also receive our free weekly AI brief for{" "}
        {rolePlural.toLowerCase()}. Unsubscribe anytime.
      </p>
    </section>
  );
}
