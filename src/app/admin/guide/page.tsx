import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Guide — My Weekly AI",
  robots: { index: false, follow: false },
};

export default function AdminGuidePage() {
  return (
    <article className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-th:text-left prose-table:text-sm">
      <h1>My Weekly AI — Admin Guide</h1>
      <p className="lead">Internal operations reference for running My Weekly AI.</p>

      <hr />

      <h2>Overview</h2>
      <p>
        My Weekly AI is a weekly AI news briefing service. Users sign up, set a context profile
        (role, industry, tools, goals), and receive a personalized AI news digest every Sunday.
        Free users get a generic brief; Pro subscribers get a personalized brief ranked by
        relevance to their profile.
      </p>
      <p><strong>Tech stack:</strong> Next.js 16, Prisma 7 (PrismaPg adapter), Tailwind 4, TypeScript</p>

      <table>
        <thead>
          <tr><th>Resource</th><th>URL</th></tr>
        </thead>
        <tbody>
          <tr><td>Production</td><td><a href="https://my-weekly-ai.vercel.app">my-weekly-ai.vercel.app</a></td></tr>
          <tr><td>Admin — Jobs</td><td><a href="/admin/jobs">/admin/jobs</a></td></tr>
          <tr><td>Admin — Sources</td><td><a href="/admin/sources">/admin/sources</a></td></tr>
          <tr><td>Admin — Social</td><td><a href="/admin/social">/admin/social</a></td></tr>
          <tr><td>Vercel Dashboard</td><td><a href="https://vercel.com">vercel.com</a></td></tr>
          <tr><td>Supabase Dashboard</td><td><a href="https://supabase.com/dashboard">supabase.com/dashboard</a></td></tr>
          <tr><td>Stripe Dashboard</td><td><a href="https://dashboard.stripe.com">dashboard.stripe.com</a></td></tr>
          <tr><td>Resend Dashboard</td><td><a href="https://resend.com">resend.com</a></td></tr>
        </tbody>
      </table>

      <hr />

      <h2>Weekly Cadence</h2>
      <p>Two cron jobs run every Sunday, defined in <code>vercel.json</code>:</p>
      <table>
        <thead>
          <tr><th>Time (UTC)</th><th>Job</th><th>API Route</th><th>What it does</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>4:00 PM</td><td>Ingestion</td><td><code>POST /api/jobs/ingest</code></td>
            <td>Fetches all active RSS feeds, filters articles for AI relevance using a 55+ keyword list, and upserts new items into the <code>NewsItem</code> table.</td>
          </tr>
          <tr>
            <td>6:00 PM</td><td>Weekly Digest</td><td><code>POST /api/jobs/weekly-digest</code></td>
            <td>Re-runs ingestion for freshness, then generates and delivers briefs. One shared Claude call for the free brief, one Claude call per paid user for personalized briefs. Delivers via email, Telegram, or both depending on each user&apos;s preference.</td>
          </tr>
        </tbody>
      </table>
      <p>The 2-hour gap gives ingestion time to complete before digests are generated.</p>
      <p>
        <strong>What happens if a job fails:</strong> If <code>ADMIN_ALERT_EMAIL</code> is set,
        you&apos;ll receive an email alert with the job name, status, metrics, and error details. If
        healthcheck URLs are configured, they&apos;ll stop receiving pings and your monitoring service
        will fire an alert.
      </p>

      <hr />

      <h2>RSS Sources</h2>
      <p>31 feeds across three categories, seeded from <code>prisma/seed.ts</code>:</p>

      <h3>Industry News (19 feeds)</h3>
      <table>
        <thead><tr><th>Source</th><th>URL</th></tr></thead>
        <tbody>
          <tr><td>The Verge - AI</td><td>theverge.com/rss/ai-artificial-intelligence</td></tr>
          <tr><td>TechCrunch - AI</td><td>techcrunch.com/category/artificial-intelligence/feed/</td></tr>
          <tr><td>Ars Technica - AI</td><td>feeds.arstechnica.com/arstechnica/technology-lab</td></tr>
          <tr><td>VentureBeat - AI</td><td>venturebeat.com/category/ai/feed/</td></tr>
          <tr><td>IEEE Spectrum - AI</td><td>spectrum.ieee.org/feeds/topic/artificial-intelligence.rss</td></tr>
          <tr><td>The New Stack</td><td>thenewstack.io/feed/</td></tr>
          <tr><td>SaaStr</td><td>saastr.com/feed/</td></tr>
          <tr><td>PYMNTS - AI</td><td>pymnts.com/category/artificial-intelligence-2/feed/</td></tr>
          <tr><td>TechCrunch - Fintech</td><td>techcrunch.com/category/fintech/feed/</td></tr>
          <tr><td>Fierce Healthcare</td><td>fiercehealthcare.com/rss/xml</td></tr>
          <tr><td>Fierce Biotech</td><td>fiercebiotech.com/rss/xml</td></tr>
          <tr><td>Dark Reading</td><td>darkreading.com/rss.xml</td></tr>
          <tr><td>SecurityWeek</td><td>securityweek.com/feed/</td></tr>
          <tr><td>Retail Dive - Technology</td><td>retaildive.com/feeds/topic/technology/</td></tr>
          <tr><td>Artificial Lawyer</td><td>artificiallawyer.com/feed/</td></tr>
          <tr><td>The Hollywood Reporter - AI</td><td>hollywoodreporter.com/t/ai-3/feed/</td></tr>
          <tr><td>Variety</td><td>variety.com/feed/</td></tr>
          <tr><td>EdSurge</td><td>edsurge.com/articles_rss</td></tr>
          <tr><td>eSchool News</td><td>eschoolnews.com/feed/</td></tr>
        </tbody>
      </table>

      <h3>AI Lab (6 feeds)</h3>
      <table>
        <thead><tr><th>Source</th><th>URL</th></tr></thead>
        <tbody>
          <tr><td>OpenAI Blog</td><td>openai.com/blog/rss.xml</td></tr>
          <tr><td>Google AI Blog</td><td>blog.google/technology/ai/rss/</td></tr>
          <tr><td>Google DeepMind</td><td>deepmind.google/blog/rss.xml</td></tr>
          <tr><td>Microsoft Research</td><td>microsoft.com/en-us/research/feed/</td></tr>
          <tr><td>NVIDIA Technical Blog</td><td>developer.nvidia.com/blog/feed/</td></tr>
          <tr><td>Hugging Face Blog</td><td>huggingface.co/blog/feed.xml</td></tr>
        </tbody>
      </table>

      <h3>Research &amp; Analysis (6 feeds)</h3>
      <table>
        <thead><tr><th>Source</th><th>URL</th></tr></thead>
        <tbody>
          <tr><td>MIT Technology Review - AI</td><td>technologyreview.com/topic/artificial-intelligence/feed</td></tr>
          <tr><td>Import AI</td><td>importai.substack.com/feed</td></tr>
          <tr><td>AI Alignment Forum</td><td>alignmentforum.org/feed.xml</td></tr>
          <tr><td>The Gradient</td><td>thegradient.pub/rss/</td></tr>
          <tr><td>Interconnects AI</td><td>interconnects.ai/feed</td></tr>
          <tr><td>MIT News - AI</td><td>news.mit.edu/rss/topic/artificial-intelligence2</td></tr>
        </tbody>
      </table>

      <h3>Managing sources</h3>
      <ul>
        <li><strong>Add/remove/disable</strong> feeds at <a href="/admin/sources">/admin/sources</a>.</li>
        <li>To bulk-update the seed list, edit <code>prisma/seed.ts</code> and run <code>npx tsx prisma/seed.ts</code>. Sources removed from the seed list are automatically deactivated.</li>
      </ul>

      <hr />

      <h2>Brief Generation</h2>
      <p>All briefs use <strong>Claude Sonnet 4.5</strong> (<code>claude-sonnet-4-5-20250929</code>).</p>

      <h3>Free brief</h3>
      <p>One Claude call per week, shared by all free users. Max 2,048 tokens.</p>
      <table>
        <thead><tr><th>Section</th><th>Content</th></tr></thead>
        <tbody>
          <tr><td><strong>Industry News</strong></td><td>3–5 most significant stories from Industry News sources</td></tr>
          <tr><td><strong>AI Lab Announcements</strong></td><td>3–5 most significant stories from AI Lab sources</td></tr>
        </tbody>
      </table>
      <p>Each item includes title, source, URL, and a 1–2 sentence summary. Prioritizes product launches, funding rounds, partnerships, regulatory developments, model releases, and research breakthroughs.</p>

      <h3>Pro brief</h3>
      <p>One Claude call per paid user. Max 4,096 tokens. Personalized using the user&apos;s context profile.</p>
      <table>
        <thead><tr><th>Section</th><th>Content</th></tr></thead>
        <tbody>
          <tr><td><strong>What Dropped</strong></td><td>3–5 most significant AI developments this week, regardless of profile</td></tr>
          <tr><td><strong>Relevant to You</strong></td><td>3–5 items specifically matched to the user&apos;s role, industry, tools, and goals. Each includes a <code>relevanceNote</code> explaining why it matters for their work.</td></tr>
          <tr><td><strong>What to Test</strong></td><td>1–3 actionable items the user can try this week — names the tool, describes the action, explains the expected outcome</td></tr>
          <tr><td><strong>Ignore Summary</strong></td><td>A paragraph summarizing what was filtered out and why</td></tr>
        </tbody>
      </table>
      <p>In the email, free users see the &quot;Relevant to You&quot; and &quot;What to Test&quot; sections as locked grey boxes (upsell to Pro).</p>

      <h3>Relevance scoring</h3>
      <p>Before the Pro brief is generated, articles are ranked using a keyword-based scorer (<code>src/lib/llm/relevance-scorer.ts</code>). Each article gets a score from 0–100:</p>
      <table>
        <thead><tr><th>Signal</th><th>Points</th></tr></thead>
        <tbody>
          <tr><td>Direct industry name match</td><td>+18</td></tr>
          <tr><td>Industry expanded keywords (up to 15 terms)</td><td>+5 each, max +15</td></tr>
          <tr><td>Direct role title match</td><td>+18</td></tr>
          <tr><td>Role expanded keywords (up to ~20 terms)</td><td>+5 each, max +15</td></tr>
          <tr><td>Each focus topic match</td><td>+15</td></tr>
          <tr><td>Each tool/platform match</td><td>+12</td></tr>
          <tr><td>Goal keywords</td><td>+5 each, up to 3 per goal</td></tr>
          <tr><td>Matches in 3+ profile fields</td><td>+10 bonus</td></tr>
          <tr><td>Matches in 5+ profile fields</td><td>+10 bonus</td></tr>
          <tr><td>Each avoided topic match</td><td>-25 penalty</td></tr>
        </tbody>
      </table>
      <p>The top 30 articles (score &gt; 0) are selected, then up to 15 recent general articles are appended. Articles from the user&apos;s last 2 digests are deduplicated.</p>

      <hr />

      <h2>Delivery</h2>

      <h3>Email</h3>
      <p>Sent via <strong>Resend</strong>. See <a href="#email-addresses">Email Addresses</a> for from addresses.</p>
      <ul>
        <li>Free users: subject line <code>Your Free AI Brief — &lt;date range&gt;</code></li>
        <li>Pro users: subject line <code>Your AI Brief — &lt;date range&gt;</code></li>
        <li>Profile terms (role, industry, tools, focus topics) are highlighted in Pro emails</li>
      </ul>

      <h3>Telegram</h3>
      <p>Sent via the <strong>@myweeklyai_bot</strong> Telegram bot.</p>
      <ul>
        <li>Messages use MarkdownV2 formatting</li>
        <li>Messages over 4,096 characters are split at paragraph boundaries</li>
        <li>Web page previews are disabled</li>
        <li>Free briefs show Industry News + AI Lab sections, plus an upgrade prompt</li>
        <li>Pro briefs show Relevant to You + What to Test + What We Filtered Out</li>
        <li>Profile terms are bolded in the Telegram message</li>
      </ul>

      <h3>Channel selection</h3>
      <p>Users choose their delivery channel on the dashboard: <strong>Email Only</strong>, <strong>Telegram Only</strong>, or <strong>Both</strong>. The weekly digest respects this setting — both channels fire independently so one failing doesn&apos;t block the other.</p>

      <hr />

      <h2>Social Posts Workflow</h2>
      <p>Social posts are generated from the week&apos;s news, targeted at specific audience segments for LinkedIn and Twitter/X.</p>

      <h3>Segments</h3>
      <p>37 total segments: 18 role-based + 19 industry-based. Each maps to a landing page target audience.</p>
      <p><strong>Roles:</strong> Software Engineers, Product Managers, UX Designers, Data Scientists, Engineering Managers, CTO/VP Engineering, CEO/Founders, Marketing Managers, Content Strategists, Sales/Revenue, DevOps Engineers, Research Scientists, Business Analysts, Project Managers, Customer Success, Solutions Architects, Consultants, Students/Researchers.</p>
      <p><strong>Industries:</strong> SaaS/Software, Fintech, Healthcare, E-commerce/Retail, Education/EdTech, Media/Entertainment, Marketing/Advertising, Consulting, Manufacturing, Real Estate/PropTech, Legal/LegalTech, Government, Nonprofit, Cybersecurity, Gaming, Telecommunications, Energy/CleanTech, Transportation/Logistics, and more.</p>

      <h3>Step-by-step workflow</h3>
      <ol>
        <li><strong>Go to</strong> <a href="/admin/social">/admin/social</a></li>
        <li><strong>Select segments</strong> — check the ones you want to generate for (grouped by Roles and Industries). Already-generated segments show &quot;(done)&quot;.</li>
        <li><strong>Click Generate</strong> — calls the API for each selected segment sequentially. One Claude call per segment. Each generates 1 LinkedIn post (150–300 words) + 1 Twitter/X post (under 280 chars) about the most relevant story for that audience.</li>
        <li><strong>Review posts</strong> — posts appear in a 2-column grid with platform badge, segment label, status, content, hashtags, and source link.</li>
        <li><strong>Edit</strong> — click any post&apos;s content to open an inline editor. Save changes.</li>
        <li><strong>Approve or reject</strong> — per-card buttons or bulk select + bulk action bar.</li>
        <li><strong>Regenerate rejected</strong> — rejected posts have a Regenerate button that deletes the old post and creates a fresh one.</li>
        <li><strong>Schedule to Buffer</strong> — select approved posts, click &quot;Send to Buffer&quot;. Posts are distributed across <strong>Tuesday–Friday</strong>, two slots per day at <strong>10:00 AM ET</strong> and <strong>2:00 PM ET</strong>. Updates post status to <code>SCHEDULED</code>.</li>
      </ol>
      <p><strong>Post statuses:</strong> DRAFT → APPROVED → SCHEDULED → PUBLISHED (or REJECTED at any point).</p>
      <p><strong>Cost estimate:</strong> Each segment = 1 Claude Sonnet call (~2,048 tokens output). At ~37 segments, that&apos;s roughly 37 API calls per week.</p>

      <hr />

      <h2>Admin Pages</h2>

      <h3><a href="/admin/jobs">/admin/jobs</a> — Job Health &amp; History</h3>
      <ul>
        <li><strong>Summary cards</strong> at top for <code>weekly-digest</code>, <code>ingestion</code>, and <code>social-posts</code> — each shows a health dot (green/yellow/red based on last run status and age), last run time, and key metrics.</li>
        <li><strong>History table</strong> showing job name, status (SUCCESS/RUNNING/FAILURE), start time, end time, metrics JSON, and error text. Shows last 50 runs.</li>
      </ul>

      <h3><a href="/admin/sources">/admin/sources</a> — RSS Feed Management</h3>
      <ul>
        <li><strong>Add source form</strong> — name, URL, type (RSS or API).</li>
        <li><strong>Sources table</strong> — lists all sources with name, URL, type, item count, active/inactive toggle, and delete button.</li>
        <li>Changes take effect on the next ingestion run.</li>
      </ul>

      <h3><a href="/admin/social">/admin/social</a> — Social Post Management</h3>
      <p>See Social Posts Workflow above.</p>
      <p><strong>Note:</strong> Admin pages are only accessible to users with <code>role = &apos;ADMIN&apos;</code> in the database. The admin link appears in the user dropdown menu.</p>

      <hr />

      <h2>Subscriptions &amp; Stripe</h2>

      <h3>How the trial works</h3>
      <ol>
        <li>User clicks the Pro signup button → redirects to Stripe Checkout with a <strong>7-day free trial</strong> (<code>trial_period_days: 7</code>).</li>
        <li>No payment is charged during the trial.</li>
        <li>On <code>checkout.session.completed</code>, a <code>Subscription</code> record is created with status <code>ACTIVE</code> (trialing maps to ACTIVE internally).</li>
        <li>An <strong>instant personalized brief</strong> is generated and delivered immediately — the user doesn&apos;t have to wait until Sunday.</li>
        <li>During the trial, the user receives full Pro briefs every Sunday.</li>
        <li>After 7 days, Stripe charges the card. If payment fails or the user cancels, the status changes to <code>CANCELED</code> or <code>PAST_DUE</code> and the user falls back to free briefs.</li>
      </ol>

      <h3>Webhook events handled</h3>
      <table>
        <thead><tr><th>Event</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td><code>checkout.session.completed</code></td><td>Creates/updates subscription record, triggers instant brief</td></tr>
          <tr><td><code>invoice.paid</code></td><td>Updates <code>currentPeriodEnd</code>, sets status to <code>ACTIVE</code></td></tr>
          <tr><td><code>customer.subscription.updated</code></td><td>Maps Stripe status (<code>active</code>/<code>trialing</code> → <code>ACTIVE</code>, <code>canceled</code> → <code>CANCELED</code>, <code>past_due</code> → <code>PAST_DUE</code>)</td></tr>
          <tr><td><code>customer.subscription.deleted</code></td><td>Sets status to <code>CANCELED</code></td></tr>
        </tbody>
      </table>

      <h3>Checking subscription status</h3>
      <ul>
        <li><strong>In the database:</strong> Query the <code>Subscription</code> table by user ID.</li>
        <li><strong>In Stripe:</strong> Go to Stripe Dashboard → Customers → search by email.</li>
        <li><strong>Billing portal:</strong> Users can manage their subscription at <code>/api/stripe/portal</code> which redirects to Stripe&apos;s hosted billing portal.</li>
      </ul>

      <hr />

      <h2>Telegram Bot</h2>
      <p>Bot: <strong>@myweeklyai_bot</strong></p>

      <h3>How users connect</h3>
      <ol>
        <li>On the dashboard, user clicks to connect Telegram.</li>
        <li>A 16-byte hex token is generated with a 15-minute expiry.</li>
        <li>User opens a deep link: <code>https://t.me/myweeklyai_bot?start=&lt;token&gt;</code></li>
        <li>In Telegram, user sends <code>/start &lt;token&gt;</code> → the webhook validates the token, links their <code>telegramChatId</code>, and sets delivery channel to <code>BOTH</code>.</li>
        <li>The dashboard polls every 5 seconds to detect when the connection completes.</li>
      </ol>

      <h3>Commands</h3>
      <table>
        <thead><tr><th>Command</th><th>What it does</th></tr></thead>
        <tbody>
          <tr><td><code>/start &lt;token&gt;</code></td><td>Links the Telegram account to the user. Token must be valid and not expired.</td></tr>
          <tr><td><code>/start</code> (no token)</td><td>Replies asking the user to use the dashboard link.</td></tr>
          <tr><td><code>/stop</code></td><td>Disconnects the Telegram account and resets delivery channel to <code>EMAIL</code>.</td></tr>
          <tr><td>Any other message</td><td>Replies with available commands.</td></tr>
        </tbody>
      </table>

      <h3>Disconnecting</h3>
      <p>Users can disconnect via the dashboard (calls <code>DELETE /api/telegram/link</code>) or by sending <code>/stop</code> in Telegram. Both clear the <code>telegramChatId</code> and reset delivery channel to <code>EMAIL</code>.</p>

      <hr />

      <h2 id="email-addresses">Email Addresses</h2>
      <table>
        <thead><tr><th>From Address</th><th>Purpose</th><th>Service</th></tr></thead>
        <tbody>
          <tr><td><code>onboarding@resend.dev</code></td><td>Magic link sign-in emails</td><td>Resend (sandbox)</td></tr>
          <tr><td><code>hello@myweekly.ai</code></td><td>Welcome email sent on account creation</td><td>Resend</td></tr>
          <tr><td><code>digest@myweekly.ai</code></td><td>Weekly brief delivery</td><td>Resend</td></tr>
          <tr><td><code>alerts@myweekly.ai</code></td><td>Job failure/warning alerts to admin</td><td>Resend</td></tr>
        </tbody>
      </table>
      <p><strong>Note:</strong> The magic link from address uses <code>onboarding@resend.dev</code> (Resend&apos;s sandbox sender). This works for any recipient but shows Resend&apos;s domain. To use a custom from address for magic links, verify the sending domain in Resend and update <code>src/lib/auth.ts</code>.</p>

      <hr />

      <h2>Environment Variables</h2>

      <h3>Authentication</h3>
      <table>
        <thead><tr><th>Variable</th><th>Required</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>NEXTAUTH_SECRET</code></td><td>Yes</td><td>Signs/verifies JWT session tokens</td></tr>
          <tr><td><code>NEXTAUTH_URL</code></td><td>Yes</td><td>Base URL for auth callbacks and redirects</td></tr>
          <tr><td><code>GOOGLE_CLIENT_ID</code></td><td>Yes</td><td>Google OAuth client ID</td></tr>
          <tr><td><code>GOOGLE_CLIENT_SECRET</code></td><td>Yes</td><td>Google OAuth client secret</td></tr>
        </tbody>
      </table>

      <h3>Database</h3>
      <table>
        <thead><tr><th>Variable</th><th>Required</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>DATABASE_URL</code></td><td>Yes</td><td>Supabase Postgres connection string (session pooler)</td></tr>
        </tbody>
      </table>

      <h3>Email</h3>
      <table>
        <thead><tr><th>Variable</th><th>Required</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>RESEND_API_KEY</code></td><td>Yes</td><td>Resend API key for sending all emails (magic links, welcome, briefs, alerts)</td></tr>
        </tbody>
      </table>

      <h3>AI</h3>
      <table>
        <thead><tr><th>Variable</th><th>Required</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>ANTHROPIC_API_KEY</code></td><td>Yes</td><td>Claude API key — auto-read by the Anthropic SDK (not referenced as <code>process.env</code> in code)</td></tr>
        </tbody>
      </table>

      <h3>Payments</h3>
      <table>
        <thead><tr><th>Variable</th><th>Required</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>STRIPE_SECRET_KEY</code></td><td>Yes</td><td>Stripe server-side API key</td></tr>
          <tr><td><code>STRIPE_WEBHOOK_SECRET</code></td><td>Yes</td><td>Validates Stripe webhook signatures</td></tr>
          <tr><td><code>STRIPE_PRICE_ID</code></td><td>Yes</td><td>Price ID for the Pro subscription plan</td></tr>
          <tr><td><code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code></td><td>No</td><td>Client-side Stripe key (currently unused in code)</td></tr>
        </tbody>
      </table>

      <h3>Telegram</h3>
      <table>
        <thead><tr><th>Variable</th><th>Required</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>TELEGRAM_BOT_TOKEN</code></td><td>Yes</td><td>Bot token from @BotFather</td></tr>
          <tr><td><code>TELEGRAM_BOT_USERNAME</code></td><td>Yes</td><td>Bot username (without <code>@</code>) for deep link URLs</td></tr>
          <tr><td><code>TELEGRAM_WEBHOOK_SECRET</code></td><td>Yes</td><td>Validates incoming Telegram webhook requests</td></tr>
        </tbody>
      </table>

      <h3>Cron Jobs</h3>
      <table>
        <thead><tr><th>Variable</th><th>Required</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>CRON_SECRET</code></td><td>Yes</td><td>Bearer token for authenticating cron/job API requests</td></tr>
        </tbody>
      </table>

      <h3>Public</h3>
      <table>
        <thead><tr><th>Variable</th><th>Required</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>NEXT_PUBLIC_APP_URL</code></td><td>Yes</td><td>Public-facing base URL — used in metadata, sitemap, email templates, social post job chaining</td></tr>
        </tbody>
      </table>

      <h3>Monitoring (optional)</h3>
      <table>
        <thead><tr><th>Variable</th><th>Required</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>ADMIN_ALERT_EMAIL</code></td><td>No</td><td>Receives email alerts on job failures</td></tr>
          <tr><td><code>HEALTHCHECK_PING_URL_INGEST</code></td><td>No</td><td>Dead-man&apos;s-switch ping on successful ingestion</td></tr>
          <tr><td><code>HEALTHCHECK_PING_URL_DIGEST</code></td><td>No</td><td>Dead-man&apos;s-switch ping on successful digest delivery</td></tr>
          <tr><td><code>HEALTHCHECK_PING_URL_SOCIAL</code></td><td>No</td><td>Dead-man&apos;s-switch ping on successful social post generation</td></tr>
        </tbody>
      </table>

      <h3>Social Scheduling (optional)</h3>
      <table>
        <thead><tr><th>Variable</th><th>Required</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>BUFFER_ACCESS_TOKEN</code></td><td>No</td><td>Buffer API token for scheduling social posts</td></tr>
          <tr><td><code>BUFFER_LINKEDIN_PROFILE_ID</code></td><td>No</td><td>Buffer profile ID for LinkedIn</td></tr>
          <tr><td><code>BUFFER_TWITTER_PROFILE_ID</code></td><td>No</td><td>Buffer profile ID for Twitter/X</td></tr>
        </tbody>
      </table>

      <hr />

      <h2>Common Operations</h2>

      <h3>Trigger ingestion manually</h3>
      <pre><code>{`curl -X POST https://my-weekly-ai.vercel.app/api/jobs/ingest \\
  -H "Authorization: Bearer YOUR_CRON_SECRET"`}</code></pre>

      <h3>Trigger weekly digest manually</h3>
      <pre><code>{`curl -X POST https://my-weekly-ai.vercel.app/api/jobs/weekly-digest \\
  -H "Authorization: Bearer YOUR_CRON_SECRET"`}</code></pre>

      <h3>Trigger social post generation manually</h3>
      <pre><code>{`curl -X POST "https://my-weekly-ai.vercel.app/api/jobs/social-posts?index=0" \\
  -H "Authorization: Bearer YOUR_CRON_SECRET"`}</code></pre>
      <p>This starts at segment 0 and automatically chains through all segments.</p>

      <h3>Make a user an admin</h3>
      <pre><code>{`UPDATE "User" SET role = 'ADMIN' WHERE email = 'user@example.com';`}</code></pre>
      <p>Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).</p>

      <h3>Check job run history</h3>
      <p>Go to <a href="/admin/jobs">/admin/jobs</a> or query the database:</p>
      <pre><code>{`SELECT * FROM "JobRun" ORDER BY "startedAt" DESC LIMIT 20;`}</code></pre>

      <h3>Debug a failed job</h3>
      <ol>
        <li>Check <a href="/admin/jobs">/admin/jobs</a> — look for the red FAILURE badge and expand the error text.</li>
        <li>Check Vercel function logs: Vercel Dashboard → your project → Logs → filter by the API route (<code>/api/jobs/ingest</code> or <code>/api/jobs/weekly-digest</code>).</li>
        <li>If <code>ADMIN_ALERT_EMAIL</code> is set, check your inbox for the alert email with full error details.</li>
      </ol>

      <h3>Apply a Prisma migration to production</h3>
      <ol>
        <li>Write your migration SQL.</li>
        <li>Go to Supabase Dashboard → SQL Editor → New query.</li>
        <li>Paste and run the SQL.</li>
        <li>If the schema change affects the Prisma schema, update <code>prisma/schema.prisma</code> locally, run <code>npx prisma generate</code>, and deploy.</li>
      </ol>

      <h3>Re-seed RSS sources</h3>
      <pre><code>npx tsx prisma/seed.ts</code></pre>
      <p>This upserts all sources from the seed list and deactivates any sources no longer in the list.</p>

      <hr />

      <h2>Infrastructure</h2>
      <table>
        <thead><tr><th>Service</th><th>Provider</th><th>Plan</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td>Hosting</td><td>Vercel</td><td>Hobby (free)</td><td>Next.js app hosting, cron jobs, serverless functions</td></tr>
          <tr><td>Database</td><td>Supabase</td><td>Free tier</td><td>Postgres database (project: <code>myweeklyai</code>)</td></tr>
          <tr><td>DNS</td><td>GoDaddy</td><td>—</td><td>Domain registration and DNS management</td></tr>
          <tr><td>Email receiving</td><td>Microsoft 365</td><td>—</td><td>Receives email at the custom domain</td></tr>
          <tr><td>Email sending</td><td>Resend</td><td>Free tier</td><td>Sends transactional emails (magic links, briefs, alerts)</td></tr>
          <tr><td>Payments</td><td>Stripe</td><td>—</td><td>Subscription billing, checkout, billing portal</td></tr>
          <tr><td>AI</td><td>Anthropic</td><td>—</td><td>Claude API for brief and social post generation</td></tr>
          <tr><td>Telegram</td><td>Telegram Bot API</td><td>Free</td><td>Brief delivery via Telegram</td></tr>
          <tr><td>Social scheduling</td><td>Buffer</td><td>—</td><td>Schedules LinkedIn and Twitter/X posts</td></tr>
        </tbody>
      </table>
    </article>
  );
}
