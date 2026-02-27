import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import SiteNav from "@/components/site-nav";
import ProPricingCard from "@/components/pro-pricing-card";
import {
  FadeIn,
  CountUp,
  StickyCTA,
  LogoTicker,
} from "@/components/animations";

export default async function HomePage() {
  const session = await auth();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "My Weekly AI",
        url: process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai",
        description:
          "A personalized weekly AI news digest, tailored to your role, tools, and interests.",
      },
      {
        "@type": "WebSite",
        name: "My Weekly AI",
        url: process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai",
        description:
          "A personalized weekly AI news digest, tailored to your role, tools, and interests.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is My Weekly AI?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "My Weekly AI is a personalized AI news digest delivered weekly. It filters hundreds of AI articles to surface only what's relevant to your role, industry, and interests — so you spend less time scrolling and more time applying AI to your work.",
            },
          },
          {
            "@type": "Question",
            name: "How is My Weekly AI different from other AI newsletters?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Unlike generic AI roundups, My Weekly AI personalizes every brief based on your context profile — your role, industry, tools, and focus topics. Each brief includes a 'What to Test' section with actionable experiments you can try at work that week.",
            },
          },
          {
            "@type": "Question",
            name: "How much does My Weekly AI cost?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "My Weekly AI offers a free tier with curated top AI news delivered every Sunday, plus a Pro plan at $2.99/month or $29.99/year (with a 7-day free trial) that adds personalized picks, actionable experiments, and advanced filtering.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 text-center">
        {/* Gradient mesh blob */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2">
          <div className="h-[500px] w-[700px] rounded-full bg-gradient-to-br from-purple-200/40 via-indigo-100/30 to-transparent blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl">
          <FadeIn>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              The AI briefing{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                built for your role
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-6 text-xl text-gray-600">
              No hype, no noise, no one-size-fits-all roundups.
              <br />
              Every week we surface the AI developments, tools, and ideas that
              matter to you — so you spend less time scrolling and more time
              applying AI to your actual work.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="mt-8 flex items-center justify-center gap-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-purple-600/25 transition-all hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-600/30"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-purple-600/25 transition-all hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-600/30"
                >
                  Start Free — Get Your Brief Today
                </Link>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Source logos — ticker */}
      <section className="px-4 pb-16">
        <FadeIn>
          <p className="text-center text-sm text-gray-400 mb-6">
            Curated from 20+ industry labs and publications
          </p>
          <div className="mx-auto max-w-3xl grayscale opacity-50">
            <LogoTicker>
              <Image src="/logos/openai.svg" alt="OpenAI" width={88} height={25} className="flex-shrink-0" />
              <Image src="/logos/anthropic.svg" alt="Anthropic" width={100} height={15} className="flex-shrink-0" />
              <Image src="/logos/deepmind.svg" alt="Google DeepMind" width={112} height={18} className="flex-shrink-0" />
              <Image src="/logos/the-verge.svg" alt="The Verge" width={62} height={12} className="flex-shrink-0" />
              <Image src="/logos/techcrunch.svg" alt="TechCrunch" width={72} height={12} className="flex-shrink-0" />
              <Image src="/logos/venturebeat.svg" alt="VentureBeat" width={106} height={15} className="flex-shrink-0" />
              <Image src="/logos/mit-tech-review.svg" alt="MIT Technology Review" width={88} height={44} className="flex-shrink-0" />
              <Image src="/logos/ieee-spectrum.svg" alt="IEEE Spectrum" width={88} height={12} className="flex-shrink-0" />
            </LogoTicker>
          </div>
        </FadeIn>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              How it works
            </h2>
          </FadeIn>
          <div className="mt-16 space-y-20">
            {/* Step 1 */}
            <FadeIn>
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                    1
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    Tell us about yourself
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Your role, industry, tools you use, and what you care about. Takes 2 minutes.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Sample context profile
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-16 flex-shrink-0 text-xs text-gray-500">Role</span>
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                        Content Strategist
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 flex-shrink-0 text-xs text-gray-500">Industry</span>
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                        LegalTech
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 w-16 flex-shrink-0 text-xs text-gray-500">Topics</span>
                      <div className="flex flex-wrap gap-1.5">
                        {["Contract Review", "AI Writing Tools", "Compliance Automation"].map((term) => (
                          <span
                            key={term}
                            className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Step 2 */}
            <FadeIn delay={120}>
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                    2
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    AI curates your brief
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Every week, AI reads hundreds of articles and picks what&apos;s relevant to your specific context.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Sample AI curation
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                        <svg className="h-3.5 w-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Scanning 400+ articles weekly</p>
                        <p className="text-xs text-gray-500">From 20+ AI labs, publications, and research outlets</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                        <svg className="h-3.5 w-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Matching your context</p>
                        <p className="text-xs text-gray-500">
                          Filtering for{" "}
                          {["Content Strategist", "LegalTech", "Contract Review"].map((term, i) => (
                            <span key={term}>
                              {i > 0 && ", "}
                              <span className="font-medium text-purple-600">{term}</span>
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                        <svg className="h-3.5 w-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ranking by relevance</p>
                        <p className="text-xs text-gray-500">Surfacing only what matters to your role and priorities</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Step 3 */}
            <FadeIn delay={240}>
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                    3
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    Get it Sunday morning
                  </h3>
                  <p className="mt-2 text-gray-600">
                    A concise brief with what dropped, what&apos;s relevant to you, and what to try this week.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                        <path d="M19 8.839l-7.556 3.778a2.75 2.75 0 01-2.888 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                      </svg>
                      Email
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                      </svg>
                      Telegram
                    </span>
                  </div>
                </div>
                <div className="rounded-lg border border-purple-100 bg-white p-5 shadow-sm">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Sample personalized newsletter
                  </p>
                  <h4 className="mb-3 text-sm font-semibold text-purple-900">
                    News Relevant to You
                  </h4>
                  <ul className="space-y-4">
                    <li>
                      <p className="text-sm font-medium text-purple-700">
                        Google Introduces Gemini-Powered Contract Review for Workspace
                      </p>
                      <p className="mt-0.5 text-sm text-gray-700">
                        Google added AI-driven clause analysis and risk flagging
                        directly inside Google Docs, targeting legal and compliance
                        teams.
                      </p>
                      <p className="mt-1 text-xs italic text-gray-500">
                        Why this matters to you: Directly relevant to your{" "}
                        <span className="font-semibold text-purple-600">
                          LegalTech
                        </span>{" "}
                        focus — this could reshape how{" "}
                        <span className="font-semibold text-purple-600">
                          contract review
                        </span>{" "}
                        workflows integrate with tools your team already uses.
                      </p>
                    </li>
                    <li>
                      <p className="text-sm font-medium text-purple-700">
                        New Study: AI Content Tools Now Used by 62% of Marketing Teams
                      </p>
                      <p className="mt-0.5 text-sm text-gray-700">
                        Adoption of AI writing assistants hit a tipping point across
                        mid-market companies, with most teams using them for first
                        drafts and SEO.
                      </p>
                      <p className="mt-1 text-xs italic text-gray-500">
                        Why this matters to you: As a{" "}
                        <span className="font-semibold text-purple-600">
                          Content Strategist
                        </span>
                        , this signals that AI-assisted{" "}
                        <span className="font-semibold text-purple-600">
                          content
                        </span>{" "}
                        creation is now table stakes — worth evaluating your
                        team&apos;s current workflow.
                      </p>
                    </li>
                  </ul>
                  <div className="mt-4 border-t border-purple-200 pt-4">
                    <h4 className="mb-3 text-sm font-semibold text-purple-900">
                      What To Test This Week
                    </h4>
                    <ul className="space-y-4">
                      <li>
                        <p className="text-sm font-medium text-purple-700">
                          Try Clause-Level Redlining in Google Docs with Gemini
                        </p>
                        <p className="mt-0.5 text-sm text-gray-700">
                          Upload a sample NDA to the new Gemini sidebar and compare
                          its flagged clauses against your team&apos;s standard
                          playbook.
                        </p>
                        <p className="mt-1 text-xs italic text-gray-500">
                          Why this matters to you: A quick way to benchmark whether
                          Google&apos;s{" "}
                          <span className="font-semibold text-purple-600">
                            contract review
                          </span>{" "}
                          catches the same risks your current{" "}
                          <span className="font-semibold text-purple-600">
                            LegalTech
                          </span>{" "}
                          stack does.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Not another AI newsletter */}
      <section className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Not another AI newsletter
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
              Generic AI roundups waste your time. Here&apos;s how we&apos;re
              different.
            </p>
          </FadeIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Personalized, not broadcast",
                desc: "A product manager and a DevOps engineer shouldn\u2019t get the same newsletter. Yours is built from your context profile.",
              },
              {
                title: "Signal over noise",
                desc: "We filter out hype, funding announcements you don\u2019t need, and rewrites of the same press release. You get what\u2019s actionable.",
              },
              {
                title: "Actionable items, not just headlines",
                desc: 'Every brief includes a "What to Test" section \u2014 things you can actually try at work this week.',
              },
              {
                title: "Context-aware filtering",
                desc: "Set focus topics to go deeper and avoid topics to skip entirely. Your brief adapts to what matters right now.",
              },
            ].map((card, i) => (
              <FadeIn key={card.title} delay={i * 80}>
                <div className="rounded-lg border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <h3 className="font-semibold text-gray-900">{card.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Pro */}
      <section className="border-t border-gray-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Free vs Pro
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
              Start free. Upgrade when you want the full picture.
            </p>
          </FadeIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <FadeIn delay={0}>
              <div className="rounded-lg border border-gray-200 p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="text-lg font-bold text-gray-900">Free</h3>
                <p className="mt-2 text-sm font-medium text-gray-700">Stay informed in 5 minutes. The week's top AI news, delivered.</p>
                <p className="mt-1 text-sm text-gray-500">$0 / forever</p>
                <ul className="mt-6 space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">&#10003;</span>
                    The week's most impactful AI news and lab announcements, curated from 20+ AI industry publications
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">&#10003;</span>
                    Weekly email every Sunday - your first delivered TODAY
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">&#10003;</span>
                    Web dashboard to browse briefings
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">&#10003;</span>
                    Bookmark articles for later
                  </li>
                </ul>
                <div className="mt-8">
                  <Link
                    href="/auth/signin"
                    className="block rounded-lg border border-gray-300 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Start Free
                  </Link>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <ProPricingCard>
                <ul className="mt-6 space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">&#10003;</span>
                    Everything in Free
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">&#10003;</span>
                    &quot;Relevant To You&quot; — personalized picks for your role
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">&#10003;</span>
                    &quot;What To Test&quot; — actionable experiments for your work
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">&#10003;</span>
                    &quot;Filtered Out&quot; — see what was skipped and why
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">&#10003;</span>
                    Focus &amp; avoid topics for deeper personalization
                  </li>
                </ul>
              </ProPricingCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="grid gap-8 sm:grid-cols-3">
            <FadeIn delay={0}>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  <CountUp end={400} suffix="+" />
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  AI articles analyzed weekly
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  <CountUp end={18} />
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Industries covered
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={240}>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  <CountUp end={5} suffix=" min" />
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Average read time per brief
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative dot-pattern bg-gradient-to-br from-purple-600 to-blue-600 px-4 py-20 text-center">
        <div className="relative mx-auto max-w-2xl">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white">
              Your personalized filter for the AI firehose
            </h2>
            <p className="mt-4 text-purple-100">
              Set up your context profile in 2 minutes and get your first brief today.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/auth/signin"
                className="rounded-lg border border-purple-400 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-purple-700"
              >
                Start Free — No Personalization
              </Link>
              <Link
                href="/auth/signin?plan=pro"
                className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-purple-600 shadow-lg transition-all hover:bg-purple-50 hover:shadow-xl"
              >
                Start Pro — Personalized to Your Role (7 Days Free)
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <StickyCTA />
    </div>
  );
}
