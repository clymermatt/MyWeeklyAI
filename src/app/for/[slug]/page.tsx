import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import React from "react";
import { getLandingPage, allSlugs } from "@/lib/landing-content";
import {
  FadeIn,
  StickyCTA,
  LogoTicker,
} from "@/components/animations";

function highlightTerms(text: string, terms: string[]): React.ReactNode {
  if (!terms.length) return text;
  const pattern = new RegExp(
    `\\b(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
    "gi"
  );
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    if (terms.some((t) => t.toLowerCase() === part.toLowerCase())) {
      return (
        <span key={i} className="font-semibold text-purple-600">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) return {};
  return {
    title: page.meta.title,
    description: page.meta.description,
    openGraph: {
      title: page.meta.title,
      description: page.meta.description,
    },
    twitter: {
      title: page.meta.title,
      description: page.meta.description,
    },
    alternates: {
      canonical: `/for/${slug}`,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: page.painPoints.map((point) => ({
          "@type": "Question",
          name: point.title,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${point.description} My Weekly AI solves this by delivering a personalized AI news brief tailored for ${page.label} professionals every week.`,
          },
        })),
      },
      {
        "@type": "Product",
        name: `My Weekly AI for ${page.label}`,
        description: page.meta.description,
        brand: { "@type": "Organization", name: "My Weekly AI" },
        offers: [
          {
            "@type": "Offer",
            name: "Free",
            price: "0",
            priceCurrency: "USD",
            description:
              "Weekly AI news digest curated from 20+ publications",
          },
          {
            "@type": "Offer",
            name: "Pro",
            price: "9.99",
            priceCurrency: "USD",
            description: `Personalized AI brief filtered for ${page.label} with actionable experiments`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 text-center">
        {/* Gradient mesh blob */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2">
          <div className="h-[500px] w-[700px] rounded-full bg-gradient-to-br from-purple-200/40 via-indigo-100/30 to-transparent blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {page.hero.headline}
            </h1>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-6 text-lg text-gray-600">
              {page.hero.subheadline}
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="mt-8">
              <Link
                href="/auth/signin"
                className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-purple-600/25 transition-all hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-600/30"
              >
                {page.cta}
              </Link>
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

      {/* Pain Points */}
      <section className="border-t border-gray-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Sound familiar?
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {page.painPoints.map((point, i) => (
              <FadeIn key={point.title} delay={i * 80}>
                <div className="rounded-lg border border-gray-200 p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <h3 className="font-semibold text-gray-900">{point.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {point.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="text-center text-2xl font-bold text-gray-900">
              AI news through the{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {page.label}
              </span>{" "}
              lens
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {page.solution.map((item, i) => (
              <FadeIn key={item.title} delay={i * 120}>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Mock brief preview */}
          <div className="mt-14">
            <FadeIn>
              <p className="mb-4 text-center text-base font-bold text-gray-800">
                Build your personal context profile
              </p>
              <div className="mx-auto max-w-2xl mb-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Sample context profile
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-16 flex-shrink-0 text-xs text-gray-500">
                      {page.type === "role" ? "Role" : "Industry"}
                    </span>
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                      {page.label}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 w-16 flex-shrink-0 text-xs text-gray-500">Topics</span>
                    <div className="flex flex-wrap gap-1.5">
                      {page.mockBrief.highlightTerms.map((term) => (
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
            </FadeIn>
            <FadeIn delay={100}>
              <div className="mx-auto my-6 flex justify-center">
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                </svg>
              </div>
              <div className="mx-auto max-w-2xl mb-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
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
                      <p className="font-medium text-gray-900">Scanning 200+ articles</p>
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
                        {[page.label, ...page.mockBrief.highlightTerms.slice(0, 2)].map((term, i) => (
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
              <div className="mx-auto flex justify-center">
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                </svg>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="mt-6 mb-3 flex items-center justify-center gap-2 text-center text-base font-bold text-gray-800">
                Receive a personalized AI newsletter every Sunday in your
                <span className="inline-flex items-center gap-1">
                  <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.556 3.778a2.75 2.75 0 01-2.888 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                  email
                </span>
                or
                <span className="inline-flex items-center gap-1">
                  <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>
                  Telegram
                </span>
              </p>
              <div className="mx-auto max-w-2xl rounded-lg border border-purple-100 bg-white p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Sample personalized newsletter
                </p>
                <h3 className="mb-3 text-sm font-semibold text-purple-900">
                  News Relevant to You
                </h3>
                <ul className="space-y-4">
                  {page.mockBrief.relevantToYou.map((item) => (
                    <li key={item.title}>
                      <p className="text-sm font-medium text-purple-700">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-700">
                        {item.summary}
                      </p>
                      <p className="mt-1 text-xs italic text-gray-500">
                        Why this matters to you:{" "}
                        {highlightTerms(
                          item.relevanceNote,
                          page.mockBrief.highlightTerms
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t border-purple-200 pt-4">
                  <h3 className="mb-3 text-sm font-semibold text-purple-900">
                    What To Test This Week
                  </h3>
                  <ul className="space-y-4">
                    {page.mockBrief.whatToTest.map((item) => (
                      <li key={item.title}>
                        <p className="text-sm font-medium text-purple-700">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-700">
                          {item.summary}
                        </p>
                        <p className="mt-1 text-xs italic text-gray-500">
                          Why this matters to you:{" "}
                          {highlightTerms(
                            item.relevanceNote,
                            page.mockBrief.highlightTerms
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* What You Get — Free vs Pro */}
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
                <p className="mt-1 text-sm text-gray-500">$0 / forever</p>
                <ul className="mt-6 space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">&#10003;</span>
                    Top AI news of the week, curated from 20+ industry publications
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
                    Get started free
                  </Link>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="pro-card-glow rounded-lg border-2 border-purple-600 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <h3 className="text-lg font-bold text-gray-900">Pro</h3>
                <p className="mt-1 text-sm text-gray-500">$9.99/mo after 7-day free trial</p>
                <ul className="mt-6 space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">&#10003;</span>
                    Everything in Free
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">&#10003;</span>
                    Personalized brief filtered for your role and industry
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">&#10003;</span>
                    &quot;What To Test&quot; — actionable experiments for your work
                  </li>
                </ul>
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Topics we watch for you include
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-500">
                  {page.whatYouGet.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5">&#128269;</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/auth/signin?plan=pro"
                    className="block rounded-lg bg-purple-600 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-purple-600/25 transition-all hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-600/30"
                  >
                    Start Pro — 7 Days Free
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative dot-pattern bg-purple-600 px-4 py-20 text-center">
        <div className="relative mx-auto max-w-2xl">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white">{page.cta}</h2>
            <p className="mt-4 text-purple-100">
              Set up your context profile in 2 minutes and get your first brief
              today and then each Sunday.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/auth/signin"
                className="rounded-lg border border-purple-400 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-purple-700"
              >
                Get your free brief
              </Link>
              <Link
                href="/auth/signin?plan=pro"
                className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-purple-600 shadow-lg transition-all hover:bg-purple-50 hover:shadow-xl"
              >
                Start Pro — 7 Days Free
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <StickyCTA />
    </>
  );
}
