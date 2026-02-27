import Link from "next/link";
import SiteNav from "@/components/site-nav";

export const metadata = {
  title: "Privacy Policy",
  description: "My Weekly AI privacy policy — how we collect, use, and protect your data.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
    <SiteNav />
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: February 26, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Introduction</h2>
          <p className="mt-2">
            My Weekly AI (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website at{" "}
            <Link href="https://www.myweekly.ai" className="text-purple-600 underline">myweekly.ai</Link>.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you use our service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Information We Collect</h2>
          <p className="mt-2"><strong>Account information:</strong> When you sign up, we collect your name, email address, and profile image via Google OAuth or email sign-in.</p>
          <p className="mt-2"><strong>Context profile:</strong> You may provide your job title, industry, goals, tools, workflows, experience level, and topic preferences to personalize your briefings.</p>
          <p className="mt-2"><strong>Payment information:</strong> If you subscribe to a paid plan, payment is processed by Stripe. We do not store your credit card number. We receive your Stripe customer ID and subscription status.</p>
          <p className="mt-2"><strong>Usage data:</strong> We collect basic analytics data (page views, feature usage) via Vercel Analytics. This data is anonymized and does not include personal identifiers.</p>
          <p className="mt-2"><strong>Telegram:</strong> If you connect Telegram, we store your Telegram chat ID to deliver briefings.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. How We Use Your Information</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>To generate and deliver personalized AI news briefings</li>
            <li>To process payments and manage subscriptions</li>
            <li>To send transactional emails (welcome emails, briefings)</li>
            <li>To improve and maintain the service</li>
            <li>To communicate service updates or changes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Third-Party Services</h2>
          <p className="mt-2">We share data with the following third-party providers only as necessary to operate the service:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Google</strong> — OAuth authentication</li>
            <li><strong>Stripe</strong> — payment processing</li>
            <li><strong>Anthropic (Claude)</strong> — AI-powered briefing generation. Your context profile data is sent to generate personalized content. Anthropic does not use this data for training.</li>
            <li><strong>Resend</strong> — email delivery</li>
            <li><strong>Supabase</strong> — database hosting (PostgreSQL)</li>
            <li><strong>Vercel</strong> — application hosting and analytics</li>
            <li><strong>Telegram</strong> — optional message delivery</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Cookies</h2>
          <p className="mt-2">
            We use essential cookies to maintain your authenticated session. Vercel Analytics may set
            anonymized analytics cookies. We do not use advertising or tracking cookies from third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Data Retention</h2>
          <p className="mt-2">
            We retain your account and profile data for as long as your account is active. Briefing history
            is retained indefinitely to allow you to access past briefings. If you delete your account,
            all associated data is permanently removed within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Your Rights</h2>
          <p className="mt-2">Depending on your jurisdiction (including under GDPR and CCPA), you may have the right to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of email communications (via the unsubscribe link in any email)</li>
            <li>Export your data in a portable format</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, contact us at the email below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">8. Security</h2>
          <p className="mt-2">
            We use industry-standard security measures including HTTPS encryption, secure authentication
            tokens, and encrypted database connections. However, no method of transmission over the
            internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">9. Children&apos;s Privacy</h2>
          <p className="mt-2">
            Our service is not intended for children under 13. We do not knowingly collect personal
            information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">10. Changes to This Policy</h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. We will notify you of material changes
            by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">11. Contact Us</h2>
          <p className="mt-2">
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:contact@myweekly.ai" className="text-purple-600 underline">contact@myweekly.ai</a>.
          </p>
        </section>
      </div>
    </div>
    </div>
  );
}
