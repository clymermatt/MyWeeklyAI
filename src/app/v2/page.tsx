import Link from "next/link";
import { auth } from "@/lib/auth";
import SiteNav from "@/components/site-nav";
import { FadeIn } from "@/components/animations";

export default async function HomepageV2() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNav />

      {/* 1. Hero */}
      <section className="relative overflow-hidden px-4 py-24 text-center">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2">
          <div className="h-[500px] w-[700px] rounded-full bg-gradient-to-br from-purple-200/40 via-indigo-100/30 to-transparent blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl">
          <FadeIn>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              Stop trying to keep up with AI.{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Start keeping ahead of it.
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-6 text-xl text-gray-600">
              My Weekly AI turns the chaos of AI into a personalized weekly brief{" "}
              <span className="font-semibold text-purple-600">built for your role.</span>
              <br />
              No hype. No noise. Just what matters to you.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="mt-8 flex flex-col items-center gap-3">
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
                  Get your free personalized brief
                </Link>
              )}
              <p className="text-sm text-gray-400">
                Free forever &middot; 5-minute read &middot; Unsubscribe anytime
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Spacer between hero and problem section */}
      <div className="pb-8" />

      {/* 3. Problem Section — The Hook */}
      <section className="border-t border-gray-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              AI is moving faster than anyone can keep up with.
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "New tools every day",
                desc: "A new model, framework, or product launches every single day. You can\u2019t evaluate them all.",
              },
              {
                title: "Signal buried in noise",
                desc: "Most AI content is hype, fundraising PR, or rephrased press releases. The important stuff gets lost.",
              },
              {
                title: "Generic newsletters don\u2019t help",
                desc: "One-size-fits-all roundups cover everything and nothing. What matters to a designer isn\u2019t what matters to a CTO.",
              },
              {
                title: "Fear of falling behind",
                desc: "You know AI will reshape your work. But you don\u2019t have hours each week to doom-scroll Twitter and Reddit to figure out how.",
              },
            ].map((card, i) => (
              <FadeIn key={card.title} delay={i * 80}>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <h3 className="font-semibold text-gray-900">{card.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={350}>
            <p className="mt-10 text-center text-lg font-medium text-gray-700">
              The hard part isn&apos;t finding AI news anymore.{" "}
              <span className="text-purple-600">
                It&apos;s knowing what actually matters to you.
              </span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 4. Solution Positioning */}
      <section className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold text-gray-900">
              My Weekly AI is your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                personal AI filter.
              </span>
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-6 text-lg text-gray-600">
              Every week, we scan hundreds of articles, filter them through your
              context profile — your role, industry, tools, and focus areas — and
              deliver a concise AI briefing with{" "}
              <span className="text-purple-600">only what&apos;s relevant to you.</span>
            </p>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="mt-8 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Roles
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { label: "Software Engineer", slug: "software-engineers" },
                  { label: "Product Manager", slug: "product-managers" },
                  { label: "UX / Product Designer", slug: "ux-designers" },
                  { label: "Data Scientist / ML Engineer", slug: "data-scientists" },
                  { label: "Engineering Manager", slug: "engineering-managers" },
                  { label: "CTO / VP Engineering", slug: "cto-vp-engineering" },
                  { label: "CEO / Founder", slug: "ceo-founders" },
                  { label: "Marketing Manager", slug: "marketing-managers" },
                  { label: "Content Strategist", slug: "content-strategists" },
                  { label: "Sales / Revenue", slug: "sales-revenue" },
                  { label: "DevOps / Platform Engineer", slug: "devops-engineers" },
                  { label: "Research Scientist", slug: "research-scientists" },
                  { label: "Business Analyst", slug: "business-analysts" },
                  { label: "Project Manager", slug: "project-managers" },
                  { label: "Customer Success", slug: "customer-success" },
                  { label: "Solutions Architect", slug: "solutions-architects" },
                  { label: "Consultant", slug: "consultants" },
                  { label: "Student / Researcher", slug: "students-researchers" },
                ].map((role) => (
                  <Link
                    key={role.slug}
                    href={`/for/${role.slug}`}
                    className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-100"
                  >
                    {role.label}
                  </Link>
                ))}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 pt-2">
                Industries
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { label: "SaaS / Software", slug: "saas-software" },
                  { label: "Fintech / Financial Services", slug: "fintech" },
                  { label: "Healthcare / Life Sciences", slug: "healthcare" },
                  { label: "E-commerce / Retail", slug: "ecommerce-retail" },
                  { label: "Education / EdTech", slug: "education-edtech" },
                  { label: "Media / Entertainment", slug: "media-entertainment" },
                  { label: "Marketing / Advertising", slug: "marketing-advertising" },
                  { label: "Consulting / Professional Services", slug: "consulting" },
                  { label: "Manufacturing / Industrial", slug: "manufacturing" },
                  { label: "Real Estate / PropTech", slug: "real-estate-proptech" },
                  { label: "Legal / LegalTech", slug: "legal-legaltech" },
                  { label: "Government / Public Sector", slug: "government" },
                  { label: "Nonprofit / Social Impact", slug: "nonprofit" },
                  { label: "Cybersecurity", slug: "cybersecurity" },
                  { label: "Gaming", slug: "gaming" },
                  { label: "Telecommunications", slug: "telecommunications" },
                  { label: "Energy / CleanTech", slug: "energy-cleantech" },
                  { label: "Transportation / Logistics", slug: "transportation-logistics" },
                ].map((industry) => (
                  <Link
                    key={industry.slug}
                    href={`/for/${industry.slug}`}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                  >
                    {industry.label}
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mt-8 text-base font-medium text-gray-500">
              No hype. No noise. No doom-scrolling.
              <br />
              Just the signal you need to stay sharp.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 5. Benefits (Transformation focused) */}
      <section className="border-t border-gray-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              In 5 minutes a week, you&apos;ll:
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: (
                  <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                title: "Know which AI tools matter for your role",
                desc: "Stop guessing which launches are relevant. Your brief highlights what\u2019s actually useful for your specific work.",
              },
              {
                icon: (
                  <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Have something concrete to try each week",
                desc: "Every brief includes a \u201CWhat to Test\u201D section with experiments tailored to your context.",
              },
              {
                icon: (
                  <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                ),
                title: "Sound informed in every AI conversation",
                desc: "Walk into meetings knowing the key developments, not scrambling to catch up.",
              },
              {
                icon: (
                  <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Reclaim hours of scrolling time",
                desc: "Replace scattered reading across Twitter, Reddit, and newsletters with one focused briefing.",
              },
            ].map((card, i) => (
              <FadeIn key={card.title} delay={i * 80}>
                <div className="rounded-lg border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    {card.icon}
                  </div>
                  <h3 className="mt-3 font-semibold text-gray-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6. How It Works */}
      <section className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white px-4 py-20">
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
                    Your role, industry, tools you use, and what you care about.
                    Takes 2 minutes.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Sample context profile
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-16 flex-shrink-0 text-xs text-gray-500">
                        Role
                      </span>
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                        Content Strategist
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 flex-shrink-0 text-xs text-gray-500">
                        Industry
                      </span>
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                        LegalTech
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 w-16 flex-shrink-0 text-xs text-gray-500">
                        Topics
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Contract Review",
                          "AI Writing Tools",
                          "Compliance Automation",
                        ].map((term) => (
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
                    Every week, AI reads hundreds of articles and picks
                    what&apos;s relevant to your specific context.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Sample AI curation
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                        <svg
                          className="h-3.5 w-3.5 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Scanning 400+ articles weekly
                        </p>
                        <p className="text-xs text-gray-500">
                          From 20+ AI labs, publications, and research outlets
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                        <svg
                          className="h-3.5 w-3.5 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Matching your context
                        </p>
                        <p className="text-xs text-gray-500">
                          Filtering for{" "}
                          {[
                            "Content Strategist",
                            "LegalTech",
                            "Contract Review",
                          ].map((term, i) => (
                            <span key={term}>
                              {i > 0 && ", "}
                              <span className="font-medium text-purple-600">
                                {term}
                              </span>
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                        <svg
                          className="h-3.5 w-3.5 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Ranking by relevance
                        </p>
                        <p className="text-xs text-gray-500">
                          Surfacing only what matters to your role and priorities
                        </p>
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
                    A concise brief with what dropped, what&apos;s relevant to
                    you, and what to try this week.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                        <path d="M19 8.839l-7.556 3.778a2.75 2.75 0 01-2.888 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                      </svg>
                      Email
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
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
                        Google Introduces Gemini-Powered Contract Review for
                        Workspace
                      </p>
                      <p className="mt-0.5 text-sm text-gray-700">
                        Google added AI-driven clause analysis and risk flagging
                        directly inside Google Docs, targeting legal and
                        compliance teams.
                      </p>
                      <p className="mt-1 text-xs italic text-gray-500">
                        <span className="font-bold not-italic">
                          Why this matters to you:
                        </span>{" "}
                        Directly relevant to your{" "}
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
                          Upload a sample NDA to the new Gemini sidebar and
                          compare its flagged clauses against your team&apos;s
                          standard playbook.
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

      {/* 7. Differentiation */}
      <section className="border-t border-gray-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Why My Weekly AI is different
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {/* Most AI newsletters */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Most AI newsletters
                </h3>
                <ul className="space-y-3">
                  {[
                    "Same content for every subscriber",
                    "Heavy on hype and funding news",
                    "Headlines without context",
                    "No actionable takeaways",
                    "You have to figure out what\u2019s relevant",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* My Weekly AI */}
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-purple-600">
                  My Weekly AI
                </h3>
                <ul className="space-y-3">
                  {[
                    "Personalized to your role and interests",
                    "Filtered for signal, not noise",
                    "Context on why each item matters to you",
                    "\u201CWhat to Test\u201D experiments every week",
                    "AI does the filtering — you do the applying",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-purple-900"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mt-8 text-center text-base font-medium text-gray-600">
              It&apos;s the difference between broadcast news and a{" "}
              <span className="text-purple-600">personal briefing.</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 9. Trust / Philosophy */}
      <section className="border-t border-gray-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold text-gray-900">
              Built by someone tired of the AI hype cycle
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-6 text-lg text-gray-600">
              I was spending hours each week trying to keep up with AI news —
              scrolling Twitter threads, skimming newsletters, bookmarking
              articles I&apos;d never read. Most of it was noise. The
              breakthroughs that actually affected my work? Buried under
              fundraising announcements and hot takes.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mt-4 text-lg text-gray-600">
              So I built My Weekly AI — the tool I wished existed. An AI that reads
              everything so you don&apos;t have to, and surfaces only what
              matters based on who you are and what you do.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="mt-6 text-base font-medium text-purple-600">
              Because staying informed shouldn&apos;t feel like a second job.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 10. Final CTA Block */}
      <section className="relative dot-pattern bg-gradient-to-br from-purple-600 to-blue-600 px-4 py-20 text-center">
        <div className="relative mx-auto max-w-2xl">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white">
              The AI wave isn&apos;t slowing down.
              <br />
              Make sure you&apos;re riding it.
            </h2>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link
                href="/auth/signin"
                className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-purple-600 shadow-lg transition-all hover:bg-purple-50 hover:shadow-xl"
              >
                Get your free personalized brief
              </Link>
              <p className="text-sm text-purple-200">
                Free forever &middot; No credit card required
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
