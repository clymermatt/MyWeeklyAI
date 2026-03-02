import Link from "next/link";
import SiteNav from "@/components/site-nav";

export const metadata = {
  title: "About My Weekly AI",
  description: "Learn how My Weekly AI filters AI news and delivers a personalized weekly briefing based on your role, industry, and interests.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900">About My Weekly AI</h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
          <section>
            <p>
              I was spending hours each week trying to keep up with AI news &mdash;
              scrolling Twitter threads, skimming newsletters, bookmarking articles
              I&apos;d never read. Most of it was noise. The breakthroughs that
              actually affected my work? Buried under fundraising announcements and
              hot takes.
            </p>
            <p className="mt-4">
              So I built My Weekly AI &mdash; the tool I wished existed. An AI that
              reads everything so you don&apos;t have to, and surfaces only what
              matters based on who you are and what you do.
            </p>
            <p className="mt-4">
              Because staying informed shouldn&apos;t feel like a second job.
            </p>
          </section>

          <section>
            <p>
              <a
                href="https://www.linkedin.com/in/mattclymer/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700"
              >
                Matt Clymer on LinkedIn
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">How does the news filtering work?</h2>
            <p className="mt-2">
              Every week, we scan hundreds of articles from 20+ sources &mdash; AI labs like
              OpenAI, Anthropic, and Google DeepMind, plus publications like The Verge,
              TechCrunch, and MIT Technology Review. Claude (Anthropic&apos;s AI) reads and
              ranks every article, then filters them through your context profile to surface
              only what&apos;s relevant to your role, industry, and interests.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">How is my brief personalized?</h2>
            <p className="mt-2">
              When you sign up, you create a context profile with your job title, industry,
              and the AI topics you care about. Each week, Claude uses that profile to decide
              which stories matter to you and explains <em>why</em> each one is relevant to
              your specific work. Two people in different roles will get completely different
              briefings from the same week of news.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">When do I get my first brief?</h2>
            <p className="mt-2">
              Briefings are generated every Sunday. If you sign up mid-week, you&apos;ll
              receive your first personalized brief the following Sunday. In the meantime,
              you can explore your dashboard and fine-tune your context profile.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">When are weekly briefings delivered?</h2>
            <p className="mt-2">
              Briefings are sent every Sunday evening (around 6 PM UTC). You&apos;ll receive
              yours via email, Telegram, or both &mdash; depending on your delivery preferences.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">How do I connect email vs Telegram?</h2>
            <p className="mt-2">
              Email delivery is set up automatically when you create your account. To add
              Telegram, go to your{" "}
              <Link href="/dashboard/profile" className="text-purple-600 hover:text-purple-700 underline">
                profile settings
              </Link>{" "}
              and follow the one-click Telegram connection flow. You can use one or both
              delivery channels.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Is it really free?</h2>
            <p className="mt-2">
              Yes. My Weekly AI is free to use &mdash; no credit card required. You get a
              personalized AI briefing every week at no cost.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Can I unsubscribe?</h2>
            <p className="mt-2">
              Absolutely. Every email includes an unsubscribe link, and you can pause or stop
              briefings anytime from your{" "}
              <Link href="/dashboard/profile" className="text-purple-600 hover:text-purple-700 underline">
                profile settings
              </Link>
              . No guilt trips, no hoops to jump through.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
