import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description: "My Weekly AI terms of service — rules and guidelines for using our service.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: February 26, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Service Description</h2>
          <p className="mt-2">
            My Weekly AI (&ldquo;the Service&rdquo;) is a personalized AI news digest that delivers weekly
            briefings tailored to your role, industry, and interests. The Service is operated at{" "}
            <Link href="https://www.myweekly.ai" className="text-purple-600 underline">myweekly.ai</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Accounts</h2>
          <p className="mt-2">
            You must create an account to use the Service. You are responsible for maintaining the
            security of your account and for all activity that occurs under it. You must provide
            accurate information when creating your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Subscriptions and Billing</h2>
          <p className="mt-2">
            The Service offers a free tier and a paid Pro subscription. Pro subscriptions include a
            7-day free trial. After the trial, your payment method will be charged on a recurring
            basis until you cancel.
          </p>
          <p className="mt-2">
            You may cancel your subscription at any time through your dashboard or Stripe customer
            portal. Cancellation takes effect at the end of the current billing period.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Refund Policy</h2>
          <p className="mt-2">
            If you are unsatisfied with the Service, you may request a refund within 7 days of your
            initial payment. Refunds are issued at our discretion for the most recent billing period
            only. To request a refund, contact us at the email below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. AI-Generated Content Disclaimer</h2>
          <p className="mt-2">
            Briefings are generated using artificial intelligence and are provided for informational
            purposes only. While we strive for accuracy, AI-generated content may contain errors,
            omissions, or outdated information. You should independently verify any information before
            making decisions based on it. We are not responsible for actions taken based on
            AI-generated content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Intellectual Property</h2>
          <p className="mt-2">
            The Service, including its design, code, and branding, is owned by My Weekly AI. Your
            briefings are generated for your personal use. News articles and sources linked in
            briefings are the property of their respective publishers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Acceptable Use</h2>
          <p className="mt-2">You agree not to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to the Service or its systems</li>
            <li>Redistribute or resell briefing content commercially</li>
            <li>Use automated systems to access the Service beyond normal use</li>
            <li>Interfere with or disrupt the Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">8. Limitation of Liability</h2>
          <p className="mt-2">
            To the maximum extent permitted by law, My Weekly AI shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, or any loss of profits or revenue,
            whether incurred directly or indirectly, or any loss of data, use, goodwill, or other
            intangible losses resulting from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">9. Termination</h2>
          <p className="mt-2">
            We may suspend or terminate your account at any time for violation of these terms or for
            any other reason at our discretion. You may delete your account at any time. Upon
            termination, your right to use the Service ceases immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">10. Changes to These Terms</h2>
          <p className="mt-2">
            We reserve the right to modify these terms at any time. We will notify you of material
            changes by posting the updated terms on this page. Your continued use of the Service
            after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">11. Governing Law</h2>
          <p className="mt-2">
            These terms shall be governed by and construed in accordance with the laws of the United
            States. Any disputes shall be resolved in the courts of competent jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">12. Contact Us</h2>
          <p className="mt-2">
            If you have questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:support@myweekly.ai" className="text-purple-600 underline">support@myweekly.ai</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
