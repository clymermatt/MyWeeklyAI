import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import SiteNav from "@/components/site-nav";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNav />

      {/* Hero */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            The AI briefing built for your role
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            No hype, no noise, no one-size-fits-all roundups.
            <br />
            Every week we surface the AI developments, tools, and ideas that
            matter to you — so you spend less time scrolling and more time
            applying AI to your actual work.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
              >
                Get your free brief
              </Link>
            )}
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

      {/* How it works */}
      <section className="border-t border-gray-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                1
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">
                Tell us about yourself
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Your role, industry, tools you use, and what you care about.
                Takes 2 minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                2
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">
                AI curates your brief
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Every week, AI reads hundreds of articles and picks what&apos;s
                relevant to your specific context.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                3
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">
                Read it Sunday morning
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                A concise email with what dropped, what&apos;s relevant to you,
                and what to try this week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Not another AI newsletter */}
      <section className="border-t border-gray-200 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Not another AI newsletter
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            Generic AI roundups waste your time. Here&apos;s how we&apos;re
            different.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">
                Personalized, not broadcast
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                A product manager and a DevOps engineer shouldn&apos;t get the
                same newsletter. Yours is built from your context profile.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">
                Signal over noise
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                We filter out hype, funding announcements you don&apos;t need,
                and rewrites of the same press release. You get what&apos;s
                actionable.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">
                Actionable items, not just headlines
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Every brief includes a &quot;What to Test&quot; section — things
                you can actually try at work this week.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">
                Context-aware filtering
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Set focus topics to go deeper and avoid topics to skip entirely.
                Your brief adapts to what matters right now.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free vs Pro */}
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
              <p className="mt-1 text-sm text-gray-500">$5 / month</p>
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

      {/* Social proof placeholder */}
      <section className="border-t border-gray-200 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-bold text-gray-900">200+</p>
              <p className="mt-1 text-sm text-gray-600">
                AI sources analyzed weekly
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">18</p>
              <p className="mt-1 text-sm text-gray-600">
                Industries covered
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">5 min</p>
              <p className="mt-1 text-sm text-gray-600">
                Average read time per brief
              </p>
            </div>
          </div>
          <p className="mt-12 text-sm text-gray-400">
            Testimonials coming soon
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-purple-600 px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-white">
            Your personalized filter for the AI firehose
          </h2>
          <p className="mt-4 text-purple-100">
            Set up your context profile in 2 minutes and get your first brief today.
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
    </div>
  );
}
