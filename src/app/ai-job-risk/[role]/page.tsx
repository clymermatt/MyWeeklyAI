/**
 * Role-specific assessment landing page (spec §7.2–7.11).
 *
 * One per launch role. SEO target: "will AI replace [role]" and related
 * queries. Primary conversion surface — single dominant CTA to start the quiz.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import FAQItem from "@/components/ai-job-risk/faq-item";
import { MethodologySection } from "../page";
import { getRoleConfig, ROLE_SLUGS } from "@/lib/ai-job-risk/roles";

interface PageProps {
  params: Promise<{ role: string }>;
}

export function generateStaticParams() {
  return ROLE_SLUGS.map((role) => ({ role }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { role } = await params;
  const config = getRoleConfig(role);
  if (!config) return {};
  const title = `Will AI Replace ${config.pluralLabel}? Free Assessment`;
  const lowerPlural = config.pluralLabel.toLowerCase();
  const description = `A free 5-minute AI Job Risk Assessment built specifically for ${lowerPlural}. Get your AI Disruption Score, task-by-task analysis, and 3 pivot paths.`;
  const canonical = `/ai-job-risk/${role}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RoleLandingPage({ params }: PageProps) {
  const { role } = await params;
  const config = getRoleConfig(role);
  if (!config) notFound();

  const quizUrl = `/ai-job-risk/${role}/quiz`;
  const lowerPlural = config.pluralLabel.toLowerCase();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      {/* Hero */}
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
          AI Job Risk Assessment
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {config.headline}
        </h1>
        <p className="mt-4 text-lg text-gray-600">Find out in 5 minutes.</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-500">
          Take a 5-minute personalized assessment built specifically for{" "}
          {lowerPlural}. Get your AI Disruption Score, a task-by-task analysis
          of what&apos;s at risk, and three concrete pivot paths tailored to
          your experience.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href={quizUrl}
            className="rounded-lg bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
          >
            Start the assessment →
          </Link>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Free. No login required to start. Takes 5–7 minutes.
        </p>
      </header>

      {/* Sample score preview — a stylized mock, not real data */}
      <section className="mt-12">
        <SampleReportPreview persona={config.landingSamplePersona} />
      </section>

      {/* What you'll learn */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-gray-900">
          What you&apos;ll learn about your job
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <ValuePoint
            title="Your AI Disruption Score"
            body="A single number (0–100) showing your overall exposure, broken down across five factors: task automatability, adoption velocity, skill differentiation, career portability, and time-to-impact urgency."
          />
          <ValuePoint
            title="Task-by-task analysis"
            body={`See exactly which parts of your work are exposed today and which remain durable. For each task you get a current status and 18-month trajectory grounded in what tools like ${config.landingToolMentions} are actually doing.`}
          />
          <ValuePoint
            title="Three personalized pivot paths"
            body="Based on your experience and strengths, three specific career directions that compound your existing skills into more durable AI-era roles. Each path includes salary ranges, timelines, and the skill gaps to close."
          />
          <ValuePoint
            title="A 30-day action plan"
            body="Three concrete actions you can take in the next 30 days — not generic “learn AI” advice, but specific moves tailored to your situation and top pivot path."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-gray-900">How it works</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          <Step
            n="1"
            title="Tell us about your work"
            body="Answer 14 questions about your role, how you spend your time, and your environment. Takes 5–7 minutes."
          />
          <Step
            n="2"
            title="Get your personalized report"
            body="We calculate your score using a 5-factor methodology refined quarterly with current AI capability data. You see your full report immediately — no waiting for an email."
          />
          <Step
            n="3"
            title="Take action"
            body="Use your pivot path recommendations and 30-day plan to start making your work more durable."
          />
        </ol>
      </section>

      {/* Methodology — shared section */}
      <MethodologySection />

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-gray-900">
          Frequently asked questions
        </h2>
        <div className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          <FAQItem
            defaultOpen
            question="Is this free?"
            answer={`Yes. The assessment and report are completely free. You'll be subscribed to our weekly AI newsletter for ${lowerPlural} when you receive your full report, but you can unsubscribe anytime.`}
          />
          <FAQItem
            question="How accurate is the assessment?"
            answer="The methodology is built on a 5-factor model with task automatability ratings recalibrated quarterly. It's a rigorous personalized AI displacement assessment, but it's a model, not a prediction. The goal is to give you a clear-eyed view of your situation."
          />
          <FAQItem
            question="Will my employer see my results?"
            answer="No. Your results are private and tied to your email address. We don't share data with employers, recruiters, or anyone else."
          />
          <FAQItem
            question="How is this different from other AI career tools?"
            answer="Most generic AI assessments give the same advice to everyone. This one uses your specific tasks, your specific industry, and your specific experience to produce a score and recommendations that actually fit. The pivot paths are tailored to your strengths, not generic 'learn AI' advice."
          />
          <FAQItem
            question="Can I retake the assessment?"
            answer="Yes. We recommend retaking every 6 months to track how your situation evolves."
          />
          <FAQItem
            question="How long is the assessment?"
            answer="14 questions across 5 sections. Most people complete it in 5–7 minutes."
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-16 rounded-2xl border border-purple-100 bg-purple-50/40 p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">
          Find out where you stand.
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          5 minutes. Free. Built specifically for {lowerPlural}.
        </p>
        <Link
          href={quizUrl}
          className="mt-5 inline-block rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
        >
          Start the assessment →
        </Link>
      </section>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ValuePoint({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-base font-semibold text-gray-900">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
        Step {n}
      </p>
      <p className="mt-2 text-base font-semibold text-gray-900">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-gray-600">{body}</p>
    </li>
  );
}

function SampleReportPreview({ persona }: { persona: string }) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
          Sample report
        </p>
        <p className="text-xs italic text-gray-400">Not your data</p>
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-4xl font-bold tracking-tight text-purple-700">
          62
        </span>
        <span className="text-sm text-gray-400">/ 100</span>
        <span className="ml-3 text-sm font-semibold text-gray-900">
          Moderate-High Risk
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        Sample report for a {persona}. Yours will be personalized to your exact
        responses.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <SamplePill label="Task Automatability" value="68" />
        <SamplePill label="Skill Differentiation" value="55" />
        <SamplePill label="Adoption Velocity" value="74" />
        <SamplePill label="Career Portability" value="72" />
      </div>
    </div>
  );
}

function SamplePill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between rounded-lg bg-gray-50 px-3 py-2">
      <span className="text-xs text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}/100</span>
    </div>
  );
}
