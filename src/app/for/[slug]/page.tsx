import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getLandingPage, allSlugs } from "@/lib/landing-content";

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

  return (
    <>
      {/* Hero */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {page.hero.headline}
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            {page.hero.subheadline}
          </p>
          <div className="mt-8">
            <Link
              href="/auth/signin"
              className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
            >
              {page.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Source logos */}
      <section className="px-4 pb-16">
        <p className="text-center text-sm text-gray-400 mb-6">
          Curated from 20+ industry labs and publications
        </p>
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-x-8 grayscale opacity-50">
          <Image src="/logos/openai.svg" alt="OpenAI" width={88} height={25} />
          <Image src="/logos/anthropic.svg" alt="Anthropic" width={100} height={15} />
          <Image src="/logos/deepmind.svg" alt="Google DeepMind" width={112} height={18} />
          <Image src="/logos/the-verge.svg" alt="The Verge" width={62} height={12} />
          <Image src="/logos/techcrunch.svg" alt="TechCrunch" width={72} height={12} />
        </div>
        <div className="mx-auto mt-5 flex max-w-3xl items-center justify-center gap-x-8 grayscale opacity-50">
          <Image src="/logos/venturebeat.svg" alt="VentureBeat" width={106} height={15} />
          <Image src="/logos/mit-tech-review.svg" alt="MIT Technology Review" width={88} height={44} />
          <Image src="/logos/ieee-spectrum.svg" alt="IEEE Spectrum" width={88} height={12} />
        </div>
      </section>

      {/* Pain Points */}
      <section className="border-t border-gray-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Sound familiar?
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {page.painPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-lg border border-gray-200 p-6"
              >
                <h3 className="font-semibold text-gray-900">{point.title}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="border-t border-gray-200 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            AI news through the {page.label} lens
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {page.solution.map((item) => (
              <div key={item.title} className="text-center">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get — Free vs Pro */}
      <section className="border-t border-gray-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Free vs Pro
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            Start free. Upgrade when you want the full picture.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-6">
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
                  className="block rounded-lg border border-gray-300 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Get started free
                </Link>
              </div>
            </div>
            <div className="rounded-lg border-2 border-purple-600 p-6">
              <h3 className="text-lg font-bold text-gray-900">Pro</h3>
              <p className="mt-1 text-sm text-gray-500">$5/mo after 7-day free trial</p>
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
                  href="/auth/signin"
                  className="block rounded-lg bg-purple-600 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                >
                  Start Pro — 7 Days Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-purple-600 px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-white">{page.cta}</h2>
          <p className="mt-4 text-purple-100">
            Set up your context profile in 2 minutes and get your first brief
            today and then each Sunday.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/auth/signin"
              className="rounded-lg border border-purple-400 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
            >
              Get your free brief
            </Link>
            <Link
              href="/auth/signin"
              className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
            >
              Start Pro — 7 Days Free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
