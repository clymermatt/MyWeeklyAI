/**
 * AI Job Risk Assessment hub page (spec §7.12–7.16).
 *
 * Catches generic "AI job risk" searches, lists all role assessments, and
 * routes traffic to the role-specific landing pages. Coming-soon roles surface
 * a newsletter signup so we don't leak high-intent visitors.
 */

import type { Metadata } from "next";
import Link from "next/link";
import FAQItem from "@/components/ai-job-risk/faq-item";
import { getRoleConfig } from "@/lib/ai-job-risk/roles";

const PAGE_TITLE = "AI Job Risk Assessment — Free 5-Minute Personalized Score";
const PAGE_DESCRIPTION =
  "Take a free personalized assessment for your specific role. Get your AI Disruption Score, what's at risk in your work, and 3 pivot paths.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/ai-job-risk" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/ai-job-risk",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

interface RoleTile {
  slug: string;
  label: string;
  tagline: string;
}

const ROLE_TILES: RoleTile[] = [
  { slug: "software-engineers", label: "Software Engineer", tagline: "How exposed is your dev work to AI displacement?" },
  { slug: "marketing-managers", label: "Marketing Manager", tagline: "How is AI reshaping marketing work?" },
  { slug: "content-creators", label: "Content Creator", tagline: "Is AI replacing your writing work?" },
  { slug: "customer-success", label: "Customer Success", tagline: "Are AI agents coming for CS roles?" },
  { slug: "product-managers", label: "Product Manager", tagline: "Where do PMs land in the AI shift?" },
];

export default function AiJobRiskHubPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      {/* Hero */}
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
          AI Job Risk Assessment
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Will AI replace your job?
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Take a 5-minute role-specific assessment.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-500">
          Get a personalized AI Disruption Score, a breakdown of what&apos;s at
          risk in your specific work, and three pivot paths tailored to your
          experience. Built specifically for your role, updated quarterly with
          current AI capability data.
        </p>
      </header>

      {/* Role selector */}
      <section className="mt-12">
        <h2 className="text-center text-xl font-semibold text-gray-900">
          Choose your role to begin.
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROLE_TILES.map((tile) => {
            const isActive = Boolean(getRoleConfig(tile.slug));
            return isActive ? (
              <Link
                key={tile.slug}
                href={`/ai-job-risk/${tile.slug}`}
                className="group flex flex-col rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition-colors hover:border-purple-300 hover:bg-purple-50/40"
              >
                <p className="text-base font-semibold text-gray-900">
                  {tile.label}
                </p>
                <p className="mt-2 flex-1 text-sm text-gray-600">
                  {tile.tagline}
                </p>
                <p className="mt-4 text-sm font-semibold text-purple-700 group-hover:text-purple-800">
                  Take the assessment →
                </p>
              </Link>
            ) : (
              <div
                key={tile.slug}
                className="flex flex-col rounded-2xl border border-gray-200 bg-gray-50 p-6"
              >
                <p className="text-base font-semibold text-gray-700">
                  {tile.label}
                </p>
                <p className="mt-2 flex-1 text-sm text-gray-500">
                  {tile.tagline}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Coming soon
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* What you'll get */}
      <section className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          What you&apos;ll get with every assessment
        </h2>
        <ul className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
          <li>• Your AI Disruption Score (0–100) across 5 factors</li>
          <li>• Task-by-task analysis of your specific work</li>
          <li>• 3 personalized pivot paths with salary ranges</li>
          <li>• A 30-day action plan</li>
          <li>• A PDF report you can save or share</li>
          <li>• A free weekly AI brief tailored to your role</li>
        </ul>
      </section>

      {/* Methodology */}
      <MethodologySection />

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-gray-900">
          Frequently asked questions
        </h2>
        <div className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          <FAQItem
            question="Is this free?"
            answer="Yes. The assessment and report are completely free. You'll be subscribed to our weekly AI newsletter when you receive your full report, but you can unsubscribe anytime."
          />
          <FAQItem
            question="Will my employer see my results?"
            answer="No. Your results are private and tied to your email address. We don't share data with employers, recruiters, or anyone else. Read our Privacy Policy for details."
          />
          <FAQItem
            question="What if my role isn't listed?"
            answer="We're rolling out more role assessments. Sign up for our newsletter below and we'll let you know when your role launches."
          />
          <FAQItem
            question="How is this different from other AI career tools?"
            answer="Most generic AI assessments give the same advice to everyone. This one uses your specific tasks, industry, and experience to produce a score and recommendations that actually fit your situation. The pivot paths are tailored to your strengths, not generic 'learn AI' advice."
          />
        </div>
      </section>

      {/* Newsletter CTA for non-listed roles */}
      <section className="mt-16 rounded-2xl border border-purple-100 bg-purple-50/40 p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Don&apos;t see your role?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We&apos;re adding more role assessments. Get notified when yours
          launches by subscribing to our weekly brief.
        </p>
        <Link
          href="/auth/signin"
          className="mt-4 inline-block rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
        >
          Subscribe to the newsletter →
        </Link>
      </section>
    </div>
  );
}

// ─── Shared sections ─────────────────────────────────────────────────────────

export function MethodologySection() {
  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold text-gray-900">The methodology</h2>
      <p className="mt-2 text-sm text-gray-600">
        The assessment uses a 5-factor model that weighs:
      </p>
      <ul className="mt-3 space-y-2 text-sm text-gray-600">
        <li>
          <span className="font-medium text-gray-900">Task Automatability (40%)</span>{" "}
          — what percentage of your time goes to tasks AI tools currently handle
          well.
        </li>
        <li>
          <span className="font-medium text-gray-900">Adoption Velocity (20%)</span>{" "}
          — how fast displacement is happening at your employer and in your
          industry.
        </li>
        <li>
          <span className="font-medium text-gray-900">Skill Differentiation (20%)</span>{" "}
          — what makes your work hard to replicate.
        </li>
        <li>
          <span className="font-medium text-gray-900">Career Portability (10%)</span>{" "}
          — how easily you can pivot to adjacent durable roles.
        </li>
        <li>
          <span className="font-medium text-gray-900">Time-to-Impact Urgency (10%)</span>{" "}
          — how soon major changes are likely.
        </li>
      </ul>
      <p className="mt-4 text-sm text-gray-500">
        Task-automatability ratings are recalibrated quarterly against actual AI
        tool capabilities. Salary data and pivot-path information is refreshed
        every six months from sources including Levels.fyi, Glassdoor, and
        recent industry hiring reports.
      </p>
    </section>
  );
}

