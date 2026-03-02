import Link from "next/link";
import Image from "next/image";
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
        {/* About section */}
        <h1 className="text-3xl font-bold text-gray-900">About My Weekly AI</h1>

        <div className="mt-8 flex items-start gap-5">
          <Image
            src="/matt-clymer.jpeg"
            alt="Matt Clymer"
            width={64}
            height={64}
            className="flex-shrink-0 rounded-full"
          />
          <div className="space-y-4 text-sm leading-relaxed text-gray-700">
          <p>
            Hey, I&apos;m Matt &mdash; a UX/UI strategist at a leader in the tech industry.
            I help teams turn complex systems into intuitive experiences, with a more
            recent focus on how AI is changing the way people work and interact with
            products. My Weekly AI grew out of that obsession &mdash; I wanted a better
            way to stay on top of AI news relevant to my work without it taking over
            my week.
          </p>
          <p>
            So I built the tool I wished existed. An AI that reads everything so you
            don&apos;t have to, and surfaces only what matters based on who you are
            and what you do.
          </p>
          <p>
            Because staying informed shouldn&apos;t feel like a second job.
          </p>
          <p>
            <a
              href="https://www.linkedin.com/in/mattclymer/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700"
            >
              Connect with me on LinkedIn
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </p>
          </div>
        </div>

        {/* FAQ section */}
        <div className="mt-16 -mx-4 rounded-lg border border-gray-200 bg-white px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
            <section>
              <h3 className="text-lg font-semibold text-gray-900">How does the news filtering work?</h3>
              <p className="mt-2">
                Every week, we scan hundreds of articles from 20+ sources &mdash; AI labs like
                OpenAI, Anthropic, and Google DeepMind, plus publications like The Verge,
                TechCrunch, and MIT Technology Review.
              </p>
              <p className="mt-2">
                Each article is scored against your{" "}
                <Link href="/dashboard/profile" className="text-purple-600 hover:text-purple-700 underline">
                  context profile
                </Link>{" "}
                using a multi-factor relevance algorithm. The system looks at your industry,
                role, focus topics, tools, and goals &mdash; and checks each article for
                keyword matches across all of those dimensions. Articles that match multiple
                parts of your profile score higher, while topics you&apos;ve marked as
                &ldquo;avoid&rdquo; are penalized heavily so they don&apos;t clutter your brief.
              </p>
              <p className="mt-2">
                The top-scoring articles are passed to Claude (Anthropic&apos;s AI), which acts
                as a final editorial layer. Claude reads the pre-ranked articles with your full
                profile in context and selects the stories that deserve your attention &mdash;
                explaining in plain language exactly <em>why</em> each one matters to your
                specific work. It also suggests concrete experiments you can try that week based
                on the news.
              </p>
              <p className="mt-2">
                To keep things fresh, articles that appeared in your last two briefings are
                automatically excluded so you never see the same story twice.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900">How is my brief personalized?</h3>
              <p className="mt-2">
                When you sign up, you create a{" "}
                <Link href="/dashboard/profile" className="text-purple-600 hover:text-purple-700 underline">
                  context profile
                </Link>{" "}
                with your job title, industry, goals, tools you use, and the AI topics you care
                about. Every dimension of that profile influences which articles are surfaced and
                how they&apos;re explained. Two people in different roles will get completely
                different briefings from the same week of news.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900">When do I get my first brief?</h3>
              <p className="mt-2">
                Right away. As soon as you complete your{" "}
                <Link href="/dashboard/profile" className="text-purple-600 hover:text-purple-700 underline">
                  context profile
                </Link>
                , we generate your first personalized briefing on the spot and deliver it
                to your inbox (and Telegram, if connected). After that, you&apos;ll receive
                a new brief every Sunday automatically.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900">When are weekly briefings delivered?</h3>
              <p className="mt-2">
                Briefings are sent every Sunday evening (around 6 PM UTC). You&apos;ll receive
                yours via email, Telegram, or both &mdash; depending on your delivery preferences.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900">How do I connect email vs Telegram?</h3>
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
              <h3 className="text-lg font-semibold text-gray-900">Is it really free?</h3>
              <p className="mt-2">
                Yes. My Weekly AI is free to use &mdash; no credit card required. You get a
                personalized AI briefing every week at no cost.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900">Can I unsubscribe?</h3>
              <p className="mt-2">
                Absolutely. Every email includes an unsubscribe link, and you can pause or stop
                briefings anytime from your{" "}
                <Link href="/dashboard/profile" className="text-purple-600 hover:text-purple-700 underline">
                  profile settings
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
