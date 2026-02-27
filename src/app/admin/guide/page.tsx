import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Guide — My Weekly AI",
  robots: { index: false, follow: false },
};

/* ─── shared style constants ─── */
const h2 = "mt-12 mb-4 text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2";
const h3 = "mt-8 mb-3 text-lg font-semibold text-gray-900";
const p = "mt-3 text-sm leading-relaxed text-gray-700";
const ul = "mt-3 list-disc pl-6 space-y-1.5 text-sm text-gray-700";
const ol = "mt-3 list-decimal pl-6 space-y-1.5 text-sm text-gray-700";
const table = "mt-4 w-full text-sm border border-gray-200 rounded-lg overflow-hidden";
const th = "bg-gray-50 px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200";
const td = "px-4 py-2.5 text-gray-700 border-b border-gray-100";
const link = "text-purple-600 hover:underline";
const code = "rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-800";
const pre = "mt-3 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100 font-mono leading-relaxed";
const hr = "my-10 border-gray-200";

export default function AdminGuidePage() {
  return (
    <div className="max-w-none">
      <h1 className="text-3xl font-bold text-gray-900">Admin Guide</h1>
      <p className={p}>Internal operations reference for running My Weekly AI.</p>

      {/* ─── Table of Contents ─── */}
      <nav className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Table of Contents</h2>
        <ol className="columns-2 gap-8 list-decimal pl-5 space-y-1 text-sm">
          <li><a href="#overview" className={link}>Overview</a></li>
          <li><a href="#weekly-cadence" className={link}>Weekly Cadence</a></li>
          <li><a href="#rss-sources" className={link}>RSS Sources</a></li>
          <li><a href="#brief-generation" className={link}>Brief Generation</a></li>
          <li><a href="#delivery" className={link}>Delivery</a></li>
          <li><a href="#social-posts" className={link}>Social Posts Workflow</a></li>
          <li><a href="#admin-pages" className={link}>Admin Pages</a></li>
          <li><a href="#subscriptions" className={link}>Subscriptions &amp; Stripe</a></li>
          <li><a href="#telegram" className={link}>Telegram Bot</a></li>
          <li><a href="#email-addresses" className={link}>Email Addresses</a></li>
          <li><a href="#env-vars" className={link}>Environment Variables</a></li>
          <li><a href="#common-ops" className={link}>Common Operations</a></li>
          <li><a href="#infrastructure" className={link}>Infrastructure</a></li>
        </ol>
      </nav>

      <hr className={hr} />

      {/* ─── Overview ─── */}
      <h2 id="overview" className={h2}>Overview</h2>
      <p className={p}>
        My Weekly AI is a weekly AI news briefing service. Users sign up, set a context profile
        (role, industry, tools, goals), and receive a personalized AI news digest every Sunday.
        Free users get a generic brief; Pro subscribers get a personalized brief ranked by
        relevance to their profile.
      </p>
      <p className={p}><strong>Tech stack:</strong> Next.js 16, Prisma 7 (PrismaPg adapter), Tailwind 4, TypeScript</p>

      <table className={table}>
        <thead>
          <tr><th className={th}>Resource</th><th className={th}>URL</th></tr>
        </thead>
        <tbody>
          <tr><td className={td}>Production</td><td className={td}><a href="https://my-weekly-ai.vercel.app" className={link}>my-weekly-ai.vercel.app</a></td></tr>
          <tr><td className={td}>Admin — Jobs</td><td className={td}><a href="/admin/jobs" className={link}>/admin/jobs</a></td></tr>
          <tr><td className={td}>Admin — Sources</td><td className={td}><a href="/admin/sources" className={link}>/admin/sources</a></td></tr>
          <tr><td className={td}>Admin — Social</td><td className={td}><a href="/admin/social" className={link}>/admin/social</a></td></tr>
          <tr><td className={td}>Vercel Dashboard</td><td className={td}><a href="https://vercel.com" className={link}>vercel.com</a></td></tr>
          <tr><td className={td}>Supabase Dashboard</td><td className={td}><a href="https://supabase.com/dashboard" className={link}>supabase.com/dashboard</a></td></tr>
          <tr><td className={td}>Stripe Dashboard</td><td className={td}><a href="https://dashboard.stripe.com" className={link}>dashboard.stripe.com</a></td></tr>
          <tr><td className={td}>Resend Dashboard</td><td className={td}><a href="https://resend.com" className={link}>resend.com</a></td></tr>
        </tbody>
      </table>

      <hr className={hr} />

      {/* ─── Weekly Cadence ─── */}
      <h2 id="weekly-cadence" className={h2}>Weekly Cadence</h2>
      <p className={p}>Two cron jobs run every Sunday, defined in <code className={code}>vercel.json</code>:</p>
      <table className={table}>
        <thead>
          <tr><th className={th}>Time (UTC)</th><th className={th}>Job</th><th className={th}>API Route</th><th className={th}>What it does</th></tr>
        </thead>
        <tbody>
          <tr>
            <td className={td}>4:00 PM</td><td className={td}>Ingestion</td><td className={td}><code className={code}>POST /api/jobs/ingest</code></td>
            <td className={td}>Fetches all active RSS feeds, filters articles for AI relevance using a 55+ keyword list, and upserts new items into the <code className={code}>NewsItem</code> table.</td>
          </tr>
          <tr>
            <td className={td}>6:00 PM</td><td className={td}>Weekly Digest</td><td className={td}><code className={code}>POST /api/jobs/weekly-digest</code></td>
            <td className={td}>Re-runs ingestion for freshness, then generates and delivers briefs. One shared Claude call for the free brief, one Claude call per paid user for personalized briefs.</td>
          </tr>
        </tbody>
      </table>
      <p className={p}>The 2-hour gap gives ingestion time to complete before digests are generated.</p>
      <p className={p}>
        <strong>What happens if a job fails:</strong> If <code className={code}>ADMIN_ALERT_EMAIL</code> is set,
        you&apos;ll receive an email alert with the job name, status, metrics, and error details. If
        healthcheck URLs are configured, they&apos;ll stop receiving pings and your monitoring service
        will fire an alert.
      </p>

      <hr className={hr} />

      {/* ─── RSS Sources ─── */}
      <h2 id="rss-sources" className={h2}>RSS Sources</h2>
      <p className={p}>31 feeds across three categories, seeded from <code className={code}>prisma/seed.ts</code>:</p>

      <h3 className={h3}>Industry News (19 feeds)</h3>
      <table className={table}>
        <thead><tr><th className={th}>Source</th><th className={th}>URL</th></tr></thead>
        <tbody>
          {[
            ["The Verge - AI", "theverge.com/rss/ai-artificial-intelligence"],
            ["TechCrunch - AI", "techcrunch.com/category/artificial-intelligence/feed/"],
            ["Ars Technica - AI", "feeds.arstechnica.com/arstechnica/technology-lab"],
            ["VentureBeat - AI", "venturebeat.com/category/ai/feed/"],
            ["IEEE Spectrum - AI", "spectrum.ieee.org/feeds/topic/artificial-intelligence.rss"],
            ["The New Stack", "thenewstack.io/feed/"],
            ["SaaStr", "saastr.com/feed/"],
            ["PYMNTS - AI", "pymnts.com/category/artificial-intelligence-2/feed/"],
            ["TechCrunch - Fintech", "techcrunch.com/category/fintech/feed/"],
            ["Fierce Healthcare", "fiercehealthcare.com/rss/xml"],
            ["Fierce Biotech", "fiercebiotech.com/rss/xml"],
            ["Dark Reading", "darkreading.com/rss.xml"],
            ["SecurityWeek", "securityweek.com/feed/"],
            ["Retail Dive - Technology", "retaildive.com/feeds/topic/technology/"],
            ["Artificial Lawyer", "artificiallawyer.com/feed/"],
            ["The Hollywood Reporter - AI", "hollywoodreporter.com/t/ai-3/feed/"],
            ["Variety", "variety.com/feed/"],
            ["EdSurge", "edsurge.com/articles_rss"],
            ["eSchool News", "eschoolnews.com/feed/"],
          ].map(([name, url]) => (
            <tr key={name}><td className={td}>{name}</td><td className={`${td} font-mono text-xs`}>{url}</td></tr>
          ))}
        </tbody>
      </table>

      <h3 className={h3}>AI Lab (6 feeds)</h3>
      <table className={table}>
        <thead><tr><th className={th}>Source</th><th className={th}>URL</th></tr></thead>
        <tbody>
          {[
            ["OpenAI Blog", "openai.com/blog/rss.xml"],
            ["Google AI Blog", "blog.google/technology/ai/rss/"],
            ["Google DeepMind", "deepmind.google/blog/rss.xml"],
            ["Microsoft Research", "microsoft.com/en-us/research/feed/"],
            ["NVIDIA Technical Blog", "developer.nvidia.com/blog/feed/"],
            ["Hugging Face Blog", "huggingface.co/blog/feed.xml"],
          ].map(([name, url]) => (
            <tr key={name}><td className={td}>{name}</td><td className={`${td} font-mono text-xs`}>{url}</td></tr>
          ))}
        </tbody>
      </table>

      <h3 className={h3}>Research &amp; Analysis (6 feeds)</h3>
      <table className={table}>
        <thead><tr><th className={th}>Source</th><th className={th}>URL</th></tr></thead>
        <tbody>
          {[
            ["MIT Technology Review - AI", "technologyreview.com/topic/artificial-intelligence/feed"],
            ["Import AI", "importai.substack.com/feed"],
            ["AI Alignment Forum", "alignmentforum.org/feed.xml"],
            ["The Gradient", "thegradient.pub/rss/"],
            ["Interconnects AI", "interconnects.ai/feed"],
            ["MIT News - AI", "news.mit.edu/rss/topic/artificial-intelligence2"],
          ].map(([name, url]) => (
            <tr key={name}><td className={td}>{name}</td><td className={`${td} font-mono text-xs`}>{url}</td></tr>
          ))}
        </tbody>
      </table>

      <h3 className={h3}>Managing sources</h3>
      <ul className={ul}>
        <li><strong>Add/remove/disable</strong> feeds at <a href="/admin/sources" className={link}>/admin/sources</a>.</li>
        <li>To bulk-update the seed list, edit <code className={code}>prisma/seed.ts</code> and run <code className={code}>npx tsx prisma/seed.ts</code>. Sources removed from the seed list are automatically deactivated.</li>
      </ul>

      <hr className={hr} />

      {/* ─── Brief Generation ─── */}
      <h2 id="brief-generation" className={h2}>Brief Generation</h2>
      <p className={p}>All briefs use <strong>Claude Sonnet 4.5</strong> (<code className={code}>claude-sonnet-4-5-20250929</code>).</p>

      <h3 className={h3}>Free brief</h3>
      <p className={p}>One Claude call per week, shared by all free users. Max 2,048 tokens.</p>
      <table className={table}>
        <thead><tr><th className={th}>Section</th><th className={th}>Content</th></tr></thead>
        <tbody>
          <tr><td className={`${td} font-semibold`}>Industry News</td><td className={td}>3–5 most significant stories from Industry News sources</td></tr>
          <tr><td className={`${td} font-semibold`}>AI Lab Announcements</td><td className={td}>3–5 most significant stories from AI Lab sources</td></tr>
        </tbody>
      </table>
      <p className={p}>Each item includes title, source, URL, and a 1–2 sentence summary. Prioritizes product launches, funding rounds, partnerships, regulatory developments, model releases, and research breakthroughs.</p>

      <h3 className={h3}>Pro brief</h3>
      <p className={p}>One Claude call per paid user. Max 4,096 tokens. Personalized using the user&apos;s context profile.</p>
      <table className={table}>
        <thead><tr><th className={th}>Section</th><th className={th}>Content</th></tr></thead>
        <tbody>
          <tr><td className={`${td} font-semibold`}>What Dropped</td><td className={td}>3–5 most significant AI developments this week, regardless of profile</td></tr>
          <tr><td className={`${td} font-semibold`}>Relevant to You</td><td className={td}>3–5 items matched to the user&apos;s role, industry, tools, and goals. Each includes a <code className={code}>relevanceNote</code>.</td></tr>
          <tr><td className={`${td} font-semibold`}>What to Test</td><td className={td}>1–3 actionable items — names the tool, describes the action, explains the expected outcome</td></tr>
          <tr><td className={`${td} font-semibold`}>Ignore Summary</td><td className={td}>A paragraph summarizing what was filtered out and why</td></tr>
        </tbody>
      </table>
      <p className={p}>In the email, free users see the &quot;Relevant to You&quot; and &quot;What to Test&quot; sections as locked grey boxes (upsell to Pro).</p>

      <h3 className={h3}>Relevance scoring</h3>
      <p className={p}>Before the Pro brief is generated, articles are ranked using a keyword-based scorer (<code className={code}>src/lib/llm/relevance-scorer.ts</code>). Each article gets a score from 0–100:</p>
      <table className={table}>
        <thead><tr><th className={th}>Signal</th><th className={th}>Points</th></tr></thead>
        <tbody>
          {[
            ["Direct industry name match", "+18"],
            ["Industry expanded keywords (up to 15 terms)", "+5 each, max +15"],
            ["Direct role title match", "+18"],
            ["Role expanded keywords (up to ~20 terms)", "+5 each, max +15"],
            ["Each focus topic match", "+15"],
            ["Each tool/platform match", "+12"],
            ["Goal keywords", "+5 each, up to 3 per goal"],
            ["Matches in 3+ profile fields", "+10 bonus"],
            ["Matches in 5+ profile fields", "+10 bonus"],
            ["Each avoided topic match", "-25 penalty"],
          ].map(([signal, points]) => (
            <tr key={signal}><td className={td}>{signal}</td><td className={`${td} font-mono`}>{points}</td></tr>
          ))}
        </tbody>
      </table>
      <p className={p}>The top 30 articles (score &gt; 0) are selected, then up to 15 recent general articles are appended. Articles from the user&apos;s last 2 digests are deduplicated.</p>

      <hr className={hr} />

      {/* ─── Delivery ─── */}
      <h2 id="delivery" className={h2}>Delivery</h2>

      <h3 className={h3}>Email</h3>
      <p className={p}>Sent via <strong>Resend</strong>. See <a href="#email-addresses" className={link}>Email Addresses</a> for from addresses.</p>
      <ul className={ul}>
        <li>Free users: subject line <code className={code}>Your Free AI Brief — &lt;date range&gt;</code></li>
        <li>Pro users: subject line <code className={code}>Your AI Brief — &lt;date range&gt;</code></li>
        <li>Profile terms (role, industry, tools, focus topics) are highlighted in Pro emails</li>
      </ul>

      <h3 className={h3}>Telegram</h3>
      <p className={p}>Sent via the <strong>@myweeklyai_bot</strong> Telegram bot.</p>
      <ul className={ul}>
        <li>Messages use MarkdownV2 formatting</li>
        <li>Messages over 4,096 characters are split at paragraph boundaries</li>
        <li>Web page previews are disabled</li>
        <li>Free briefs show Industry News + AI Lab sections, plus an upgrade prompt</li>
        <li>Pro briefs show Relevant to You + What to Test + What We Filtered Out</li>
        <li>Profile terms are bolded in the Telegram message</li>
      </ul>

      <h3 className={h3}>Channel selection</h3>
      <p className={p}>Users choose their delivery channel on the dashboard: <strong>Email Only</strong>, <strong>Telegram Only</strong>, or <strong>Both</strong>. Both channels fire independently so one failing doesn&apos;t block the other.</p>

      <hr className={hr} />

      {/* ─── Social Posts ─── */}
      <h2 id="social-posts" className={h2}>Social Posts Workflow</h2>
      <p className={p}>Social posts are generated from the week&apos;s news, targeted at specific audience segments for LinkedIn and Twitter/X.</p>

      <h3 className={h3}>Segments</h3>
      <p className={p}>37 total segments: 18 role-based + 19 industry-based. Each maps to a landing page target audience.</p>
      <p className={p}><strong>Roles:</strong> Software Engineers, Product Managers, UX Designers, Data Scientists, Engineering Managers, CTO/VP Engineering, CEO/Founders, Marketing Managers, Content Strategists, Sales/Revenue, DevOps Engineers, Research Scientists, Business Analysts, Project Managers, Customer Success, Solutions Architects, Consultants, Students/Researchers.</p>
      <p className={p}><strong>Industries:</strong> SaaS/Software, Fintech, Healthcare, E-commerce/Retail, Education/EdTech, Media/Entertainment, Marketing/Advertising, Consulting, Manufacturing, Real Estate/PropTech, Legal/LegalTech, Government, Nonprofit, Cybersecurity, Gaming, Telecommunications, Energy/CleanTech, Transportation/Logistics, and more.</p>

      <h3 className={h3}>Step-by-step workflow</h3>
      <ol className={ol}>
        <li><strong>Go to</strong> <a href="/admin/social" className={link}>/admin/social</a></li>
        <li><strong>Select segments</strong> — check the ones you want to generate for. Already-generated segments show &quot;(done)&quot;.</li>
        <li><strong>Click Generate</strong> — one Claude call per segment. Each generates 1 LinkedIn post (150–300 words) + 1 Twitter/X post (under 280 chars).</li>
        <li><strong>Review posts</strong> — posts appear in a 2-column grid with platform badge, segment label, status, content, hashtags, and source link.</li>
        <li><strong>Edit</strong> — click any post&apos;s content to open an inline editor.</li>
        <li><strong>Approve or reject</strong> — per-card buttons or bulk select + bulk action bar.</li>
        <li><strong>Regenerate rejected</strong> — rejected posts have a Regenerate button.</li>
        <li><strong>Schedule to Buffer</strong> — select approved posts, click &quot;Send to Buffer&quot;. Posts are distributed across <strong>Tuesday–Friday</strong>, two slots per day at <strong>10:00 AM ET</strong> and <strong>2:00 PM ET</strong>.</li>
      </ol>
      <p className={p}><strong>Post statuses:</strong> DRAFT → APPROVED → SCHEDULED → PUBLISHED (or REJECTED at any point).</p>
      <p className={p}><strong>Cost estimate:</strong> ~37 Claude Sonnet calls per week (~2,048 tokens output each).</p>

      <hr className={hr} />

      {/* ─── Admin Pages ─── */}
      <h2 id="admin-pages" className={h2}>Admin Pages</h2>

      <h3 className={h3}><a href="/admin/jobs" className={link}>/admin/jobs</a> — Job Health &amp; History</h3>
      <ul className={ul}>
        <li><strong>Summary cards</strong> for <code className={code}>weekly-digest</code>, <code className={code}>ingestion</code>, and <code className={code}>social-posts</code> — health dot (green/yellow/red), last run time, and key metrics.</li>
        <li><strong>History table</strong> — job name, status, start/end time, metrics JSON, and error text. Shows last 50 runs.</li>
      </ul>

      <h3 className={h3}><a href="/admin/sources" className={link}>/admin/sources</a> — RSS Feed Management</h3>
      <ul className={ul}>
        <li><strong>Add source form</strong> — name, URL, type (RSS or API).</li>
        <li><strong>Sources table</strong> — name, URL, type, item count, active/inactive toggle, and delete button.</li>
        <li>Changes take effect on the next ingestion run.</li>
      </ul>

      <h3 className={h3}><a href="/admin/social" className={link}>/admin/social</a> — Social Post Management</h3>
      <p className={p}>See <a href="#social-posts" className={link}>Social Posts Workflow</a> above.</p>

      <hr className={hr} />

      {/* ─── Subscriptions ─── */}
      <h2 id="subscriptions" className={h2}>Subscriptions &amp; Stripe</h2>

      <h3 className={h3}>How the trial works</h3>
      <ol className={ol}>
        <li>User clicks Pro signup → Stripe Checkout with a <strong>7-day free trial</strong>.</li>
        <li>No payment is charged during the trial.</li>
        <li>On <code className={code}>checkout.session.completed</code>, a Subscription record is created with status <code className={code}>ACTIVE</code>.</li>
        <li>An <strong>instant personalized brief</strong> is generated and delivered immediately.</li>
        <li>During the trial, the user receives full Pro briefs every Sunday.</li>
        <li>After 7 days, Stripe charges the card. If payment fails or the user cancels, status changes to <code className={code}>CANCELED</code> or <code className={code}>PAST_DUE</code>.</li>
      </ol>

      <h3 className={h3}>Webhook events handled</h3>
      <table className={table}>
        <thead><tr><th className={th}>Event</th><th className={th}>Action</th></tr></thead>
        <tbody>
          <tr><td className={td}><code className={code}>checkout.session.completed</code></td><td className={td}>Creates/updates subscription record, triggers instant brief</td></tr>
          <tr><td className={td}><code className={code}>invoice.paid</code></td><td className={td}>Updates <code className={code}>currentPeriodEnd</code>, sets status to ACTIVE</td></tr>
          <tr><td className={td}><code className={code}>customer.subscription.updated</code></td><td className={td}>Maps Stripe status (active/trialing → ACTIVE, canceled → CANCELED, past_due → PAST_DUE)</td></tr>
          <tr><td className={td}><code className={code}>customer.subscription.deleted</code></td><td className={td}>Sets status to CANCELED</td></tr>
        </tbody>
      </table>

      <h3 className={h3}>Checking subscription status</h3>
      <ul className={ul}>
        <li><strong>In the database:</strong> Query the <code className={code}>Subscription</code> table by user ID.</li>
        <li><strong>In Stripe:</strong> Dashboard → Customers → search by email.</li>
        <li><strong>Billing portal:</strong> <code className={code}>/api/stripe/portal</code> redirects to Stripe&apos;s hosted billing portal.</li>
      </ul>

      <hr className={hr} />

      {/* ─── Telegram ─── */}
      <h2 id="telegram" className={h2}>Telegram Bot</h2>
      <p className={p}>Bot: <strong>@myweeklyai_bot</strong></p>

      <h3 className={h3}>How users connect</h3>
      <ol className={ol}>
        <li>On the dashboard, user clicks to connect Telegram.</li>
        <li>A 16-byte hex token is generated with a 15-minute expiry.</li>
        <li>User opens a deep link: <code className={code}>https://t.me/myweeklyai_bot?start=&lt;token&gt;</code></li>
        <li>User sends <code className={code}>/start &lt;token&gt;</code> → webhook validates, links <code className={code}>telegramChatId</code>, sets channel to BOTH.</li>
        <li>Dashboard polls every 5 seconds to detect when connection completes.</li>
      </ol>

      <h3 className={h3}>Commands</h3>
      <table className={table}>
        <thead><tr><th className={th}>Command</th><th className={th}>What it does</th></tr></thead>
        <tbody>
          <tr><td className={td}><code className={code}>/start &lt;token&gt;</code></td><td className={td}>Links the Telegram account. Token must be valid and not expired.</td></tr>
          <tr><td className={td}><code className={code}>/start</code> (no token)</td><td className={td}>Replies asking the user to use the dashboard link.</td></tr>
          <tr><td className={td}><code className={code}>/stop</code></td><td className={td}>Disconnects Telegram and resets delivery channel to EMAIL.</td></tr>
          <tr><td className={td}>Any other message</td><td className={td}>Replies with available commands.</td></tr>
        </tbody>
      </table>

      <h3 className={h3}>Disconnecting</h3>
      <p className={p}>Users can disconnect via the dashboard (<code className={code}>DELETE /api/telegram/link</code>) or by sending <code className={code}>/stop</code> in Telegram. Both clear <code className={code}>telegramChatId</code> and reset delivery channel to EMAIL.</p>

      <hr className={hr} />

      {/* ─── Email Addresses ─── */}
      <h2 id="email-addresses" className={h2}>Email Addresses</h2>
      <table className={table}>
        <thead><tr><th className={th}>From Address</th><th className={th}>Purpose</th><th className={th}>Service</th></tr></thead>
        <tbody>
          <tr><td className={td}><code className={code}>onboarding@resend.dev</code></td><td className={td}>Magic link sign-in emails</td><td className={td}>Resend (sandbox)</td></tr>
          <tr><td className={td}><code className={code}>hello@myweekly.ai</code></td><td className={td}>Welcome email on account creation</td><td className={td}>Resend</td></tr>
          <tr><td className={td}><code className={code}>digest@myweekly.ai</code></td><td className={td}>Weekly brief delivery</td><td className={td}>Resend</td></tr>
          <tr><td className={td}><code className={code}>alerts@myweekly.ai</code></td><td className={td}>Job failure/warning alerts to admin</td><td className={td}>Resend</td></tr>
        </tbody>
      </table>
      <p className={p}><strong>Note:</strong> The magic link uses <code className={code}>onboarding@resend.dev</code> (Resend sandbox). To use a custom from address, verify the sending domain in Resend and update <code className={code}>src/lib/auth.ts</code>.</p>

      <hr className={hr} />

      {/* ─── Environment Variables ─── */}
      <h2 id="env-vars" className={h2}>Environment Variables</h2>

      {[
        {
          title: "Authentication",
          vars: [
            ["NEXTAUTH_SECRET", "Yes", "Signs/verifies JWT session tokens"],
            ["NEXTAUTH_URL", "Yes", "Base URL for auth callbacks and redirects"],
            ["GOOGLE_CLIENT_ID", "Yes", "Google OAuth client ID"],
            ["GOOGLE_CLIENT_SECRET", "Yes", "Google OAuth client secret"],
          ],
        },
        {
          title: "Database",
          vars: [["DATABASE_URL", "Yes", "Supabase Postgres connection string (session pooler)"]],
        },
        {
          title: "Email",
          vars: [["RESEND_API_KEY", "Yes", "Resend API key for all emails"]],
        },
        {
          title: "AI",
          vars: [["ANTHROPIC_API_KEY", "Yes", "Claude API key — auto-read by the Anthropic SDK"]],
        },
        {
          title: "Payments",
          vars: [
            ["STRIPE_SECRET_KEY", "Yes", "Stripe server-side API key"],
            ["STRIPE_WEBHOOK_SECRET", "Yes", "Validates Stripe webhook signatures"],
            ["STRIPE_PRICE_ID", "Yes", "Price ID for the Pro subscription"],
            ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "No", "Client-side Stripe key (currently unused)"],
          ],
        },
        {
          title: "Telegram",
          vars: [
            ["TELEGRAM_BOT_TOKEN", "Yes", "Bot token from @BotFather"],
            ["TELEGRAM_BOT_USERNAME", "Yes", "Bot username (without @) for deep link URLs"],
            ["TELEGRAM_WEBHOOK_SECRET", "Yes", "Validates incoming Telegram webhook requests"],
          ],
        },
        {
          title: "Cron Jobs",
          vars: [["CRON_SECRET", "Yes", "Bearer token for authenticating cron/job API requests"]],
        },
        {
          title: "Public",
          vars: [["NEXT_PUBLIC_APP_URL", "Yes", "Public-facing base URL"]],
        },
        {
          title: "Monitoring (optional)",
          vars: [
            ["ADMIN_ALERT_EMAIL", "No", "Receives email alerts on job failures"],
            ["HEALTHCHECK_PING_URL_INGEST", "No", "Dead-man's-switch ping on successful ingestion"],
            ["HEALTHCHECK_PING_URL_DIGEST", "No", "Dead-man's-switch ping on successful digest delivery"],
            ["HEALTHCHECK_PING_URL_SOCIAL", "No", "Dead-man's-switch ping on successful social post generation"],
          ],
        },
        {
          title: "Social Scheduling (optional)",
          vars: [
            ["BUFFER_ACCESS_TOKEN", "No", "Buffer API token for scheduling social posts"],
            ["BUFFER_LINKEDIN_PROFILE_ID", "No", "Buffer profile ID for LinkedIn"],
            ["BUFFER_TWITTER_PROFILE_ID", "No", "Buffer profile ID for Twitter/X"],
          ],
        },
      ].map((section) => (
        <div key={section.title}>
          <h3 className={h3}>{section.title}</h3>
          <table className={table}>
            <thead><tr><th className={th}>Variable</th><th className={th}>Required</th><th className={th}>Purpose</th></tr></thead>
            <tbody>
              {section.vars.map(([name, req, purpose]) => (
                <tr key={name}><td className={td}><code className={code}>{name}</code></td><td className={td}>{req}</td><td className={td}>{purpose}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <hr className={hr} />

      {/* ─── Common Operations ─── */}
      <h2 id="common-ops" className={h2}>Common Operations</h2>

      <h3 className={h3}>Trigger ingestion manually</h3>
      <pre className={pre}>{`curl -X POST https://my-weekly-ai.vercel.app/api/jobs/ingest \\
  -H "Authorization: Bearer YOUR_CRON_SECRET"`}</pre>

      <h3 className={h3}>Trigger weekly digest manually</h3>
      <pre className={pre}>{`curl -X POST https://my-weekly-ai.vercel.app/api/jobs/weekly-digest \\
  -H "Authorization: Bearer YOUR_CRON_SECRET"`}</pre>

      <h3 className={h3}>Trigger social post generation manually</h3>
      <pre className={pre}>{`curl -X POST "https://my-weekly-ai.vercel.app/api/jobs/social-posts?index=0" \\
  -H "Authorization: Bearer YOUR_CRON_SECRET"`}</pre>
      <p className={p}>This starts at segment 0 and automatically chains through all segments.</p>

      <h3 className={h3}>Make a user an admin</h3>
      <pre className={pre}>{`UPDATE "User" SET role = 'ADMIN' WHERE email = 'user@example.com';`}</pre>
      <p className={p}>Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).</p>

      <h3 className={h3}>Check job run history</h3>
      <p className={p}>Go to <a href="/admin/jobs" className={link}>/admin/jobs</a> or query the database:</p>
      <pre className={pre}>{`SELECT * FROM "JobRun" ORDER BY "startedAt" DESC LIMIT 20;`}</pre>

      <h3 className={h3}>Debug a failed job</h3>
      <ol className={ol}>
        <li>Check <a href="/admin/jobs" className={link}>/admin/jobs</a> — look for the red FAILURE badge and expand the error text.</li>
        <li>Check Vercel function logs: Vercel Dashboard → your project → Logs → filter by the API route.</li>
        <li>If <code className={code}>ADMIN_ALERT_EMAIL</code> is set, check your inbox for the alert email.</li>
      </ol>

      <h3 className={h3}>Apply a Prisma migration to production</h3>
      <ol className={ol}>
        <li>Write your migration SQL.</li>
        <li>Go to Supabase Dashboard → SQL Editor → New query.</li>
        <li>Paste and run the SQL.</li>
        <li>If the schema change affects the Prisma schema, update <code className={code}>prisma/schema.prisma</code> locally, run <code className={code}>npx prisma generate</code>, and deploy.</li>
      </ol>

      <h3 className={h3}>Re-seed RSS sources</h3>
      <pre className={pre}>npx tsx prisma/seed.ts</pre>
      <p className={p}>This upserts all sources from the seed list and deactivates any sources no longer in the list.</p>

      <hr className={hr} />

      {/* ─── Infrastructure ─── */}
      <h2 id="infrastructure" className={h2}>Infrastructure</h2>
      <table className={table}>
        <thead><tr><th className={th}>Service</th><th className={th}>Provider</th><th className={th}>Plan</th><th className={th}>Purpose</th></tr></thead>
        <tbody>
          {[
            ["Hosting", "Vercel", "Hobby (free)", "Next.js app hosting, cron jobs, serverless functions"],
            ["Database", "Supabase", "Free tier", "Postgres database (project: myweeklyai)"],
            ["DNS", "GoDaddy", "—", "Domain registration and DNS management"],
            ["Email receiving", "Microsoft 365", "—", "Receives email at the custom domain"],
            ["Email sending", "Resend", "Free tier", "Sends transactional emails"],
            ["Payments", "Stripe", "—", "Subscription billing, checkout, billing portal"],
            ["AI", "Anthropic", "—", "Claude API for brief and social post generation"],
            ["Telegram", "Telegram Bot API", "Free", "Brief delivery via Telegram"],
            ["Social scheduling", "Buffer", "—", "Schedules LinkedIn and Twitter/X posts"],
          ].map(([service, provider, plan, purpose]) => (
            <tr key={service}><td className={`${td} font-semibold`}>{service}</td><td className={td}>{provider}</td><td className={td}>{plan}</td><td className={td}>{purpose}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
