# My Weekly AI — Admin Guide

Internal operations reference for running My Weekly AI.

---

## Overview

My Weekly AI is a weekly AI news briefing service. Users sign up, set a context profile (role, industry, tools, goals), and receive a personalized AI news digest every Sunday. Free users get a generic brief; Pro subscribers get a personalized brief ranked by relevance to their profile.

**Tech stack:** Next.js 16, Prisma 7 (PrismaPg adapter), Tailwind 4, TypeScript

| Resource | URL |
|---|---|
| Production | https://my-weekly-ai.vercel.app |
| Admin — Jobs | https://my-weekly-ai.vercel.app/admin/jobs |
| Admin — Sources | https://my-weekly-ai.vercel.app/admin/sources |
| Admin — Social | https://my-weekly-ai.vercel.app/admin/social |
| Vercel Dashboard | https://vercel.com |
| Supabase Dashboard | https://supabase.com/dashboard (project: `myweeklyai`) |
| Stripe Dashboard | https://dashboard.stripe.com |
| Resend Dashboard | https://resend.com |

---

## Weekly Cadence

Two cron jobs run every Sunday, defined in `vercel.json`:

| Time (UTC) | Job | API Route | What it does |
|---|---|---|---|
| 4:00 PM | Ingestion | `POST /api/jobs/ingest` | Fetches all active RSS feeds, filters articles for AI relevance using a 55+ keyword list, and upserts new items into the `NewsItem` table. |
| 6:00 PM | Weekly Digest | `POST /api/jobs/weekly-digest` | Re-runs ingestion for freshness, then generates and delivers briefs. One shared Claude call for the free brief, one Claude call per paid user for personalized briefs. Delivers via email, Telegram, or both depending on each user's preference. |

The 2-hour gap gives ingestion time to complete before digests are generated.

**What happens if a job fails:** If `ADMIN_ALERT_EMAIL` is set, you'll receive an email alert with the job name, status, metrics, and error details. If healthcheck URLs are configured, they'll stop receiving pings and your monitoring service will fire an alert.

---

## RSS Sources

31 feeds across three categories, seeded from `prisma/seed.ts`:

### Industry News (19 feeds)

| Source | URL |
|---|---|
| The Verge - AI | theverge.com/rss/ai-artificial-intelligence |
| TechCrunch - AI | techcrunch.com/category/artificial-intelligence/feed/ |
| Ars Technica - AI | feeds.arstechnica.com/arstechnica/technology-lab |
| VentureBeat - AI | venturebeat.com/category/ai/feed/ |
| IEEE Spectrum - AI | spectrum.ieee.org/feeds/topic/artificial-intelligence.rss |
| The New Stack | thenewstack.io/feed/ |
| SaaStr | saastr.com/feed/ |
| PYMNTS - AI | pymnts.com/category/artificial-intelligence-2/feed/ |
| TechCrunch - Fintech | techcrunch.com/category/fintech/feed/ |
| Fierce Healthcare | fiercehealthcare.com/rss/xml |
| Fierce Biotech | fiercebiotech.com/rss/xml |
| Dark Reading | darkreading.com/rss.xml |
| SecurityWeek | securityweek.com/feed/ |
| Retail Dive - Technology | retaildive.com/feeds/topic/technology/ |
| Artificial Lawyer | artificiallawyer.com/feed/ |
| The Hollywood Reporter - AI | hollywoodreporter.com/t/ai-3/feed/ |
| Variety | variety.com/feed/ |
| EdSurge | edsurge.com/articles_rss |
| eSchool News | eschoolnews.com/feed/ |

### AI Lab (6 feeds)

| Source | URL |
|---|---|
| OpenAI Blog | openai.com/blog/rss.xml |
| Google AI Blog | blog.google/technology/ai/rss/ |
| Google DeepMind | deepmind.google/blog/rss.xml |
| Microsoft Research | microsoft.com/en-us/research/feed/ |
| NVIDIA Technical Blog | developer.nvidia.com/blog/feed/ |
| Hugging Face Blog | huggingface.co/blog/feed.xml |

### Research & Analysis (6 feeds)

| Source | URL |
|---|---|
| MIT Technology Review - AI | technologyreview.com/topic/artificial-intelligence/feed |
| Import AI | importai.substack.com/feed |
| AI Alignment Forum | alignmentforum.org/feed.xml |
| The Gradient | thegradient.pub/rss/ |
| Interconnects AI | interconnects.ai/feed |
| MIT News - AI | news.mit.edu/rss/topic/artificial-intelligence2 |

### Managing sources

- **Add/remove/disable** feeds at `/admin/sources`.
- To bulk-update the seed list, edit `prisma/seed.ts` and run `npx tsx prisma/seed.ts`. Sources removed from the seed list are automatically deactivated.

---

## Brief Generation

All briefs use **Claude Sonnet 4.5** (`claude-sonnet-4-5-20250929`).

### Free brief

One Claude call per week, shared by all free users. Max 2,048 tokens.

| Section | Content |
|---|---|
| **Industry News** | 3–5 most significant stories from Industry News sources |
| **AI Lab Announcements** | 3–5 most significant stories from AI Lab sources |

Each item includes title, source, URL, and a 1–2 sentence summary. Prioritizes product launches, funding rounds, partnerships, regulatory developments, model releases, and research breakthroughs.

### Pro brief

One Claude call per paid user. Max 4,096 tokens. Personalized using the user's context profile.

| Section | Content |
|---|---|
| **What Dropped** | 3–5 most significant AI developments this week, regardless of profile |
| **Relevant to You** | 3–5 items specifically matched to the user's role, industry, tools, and goals. Each includes a `relevanceNote` explaining why it matters for their work. |
| **What to Test** | 1–3 actionable items the user can try this week — names the tool, describes the action, explains the expected outcome |
| **Ignore Summary** | A paragraph summarizing what was filtered out and why |

In the email, free users see the "Relevant to You" and "What to Test" sections as locked grey boxes (upsell to Pro).

### Relevance scoring

Before the Pro brief is generated, articles are ranked using a keyword-based scorer (`src/lib/llm/relevance-scorer.ts`). Each article gets a score from 0–100:

| Signal | Points |
|---|---|
| Direct industry name match | +18 |
| Industry expanded keywords (up to 15 terms) | +5 each, max +15 |
| Direct role title match | +18 |
| Role expanded keywords (up to ~20 terms) | +5 each, max +15 |
| Each focus topic match | +15 |
| Each tool/platform match | +12 |
| Goal keywords | +5 each, up to 3 per goal |
| Matches in 3+ profile fields | +10 bonus |
| Matches in 5+ profile fields | +10 bonus |
| Each avoided topic match | -25 penalty |

The top 30 articles (score > 0) are selected, then up to 15 recent general articles are appended. Articles from the user's last 2 digests are deduplicated.

---

## Delivery

### Email

Sent via **Resend**. See [Email Addresses](#email-addresses) for from addresses.

- Free users: subject line `Your Free AI Brief — <date range>`
- Pro users: subject line `Your AI Brief — <date range>`
- Profile terms (role, industry, tools, focus topics) are highlighted in Pro emails

### Telegram

Sent via the **@myweeklyai_bot** Telegram bot.

- Messages use MarkdownV2 formatting
- Messages over 4,096 characters are split at paragraph boundaries
- Web page previews are disabled
- Free briefs show Industry News + AI Lab sections, plus an upgrade prompt
- Pro briefs show Relevant to You + What to Test + What We Filtered Out
- Profile terms are bolded in the Telegram message

### Channel selection

Users choose their delivery channel on the dashboard: **Email Only**, **Telegram Only**, or **Both**. The weekly digest respects this setting — both channels fire independently so one failing doesn't block the other.

---

## Social Posts Workflow

Social posts are generated from the week's news, targeted at specific audience segments for LinkedIn and Twitter/X.

### Segments

37 total segments: 18 role-based + 19 industry-based. Each maps to a landing page target audience.

**Roles:** Software Engineers, Product Managers, UX Designers, Data Scientists, Engineering Managers, CTO/VP Engineering, CEO/Founders, Marketing Managers, Content Strategists, Sales/Revenue, DevOps Engineers, Research Scientists, Business Analysts, Project Managers, Customer Success, Solutions Architects, Consultants, Students/Researchers.

**Industries:** SaaS/Software, Fintech, Healthcare, E-commerce/Retail, Education/EdTech, Media/Entertainment, Marketing/Advertising, Consulting, Manufacturing, Real Estate/PropTech, Legal/LegalTech, Government, Nonprofit, Cybersecurity, Gaming, Telecommunications, Energy/CleanTech, Transportation/Logistics, and more.

### Step-by-step workflow

1. **Go to** `/admin/social`
2. **Select segments** — check the ones you want to generate for (grouped by Roles and Industries). Already-generated segments show "(done)".
3. **Click Generate** — calls the API for each selected segment sequentially. One Claude call per segment. Each generates 1 LinkedIn post (150–300 words) + 1 Twitter/X post (under 280 chars) about the most relevant story for that audience.
4. **Review posts** — posts appear in a 2-column grid with platform badge, segment label, status, content, hashtags, and source link.
5. **Edit** — click any post's content to open an inline editor. Save changes.
6. **Approve or reject** — per-card buttons or bulk select + bulk action bar.
7. **Regenerate rejected** — rejected posts have a Regenerate button that deletes the old post and creates a fresh one.
8. **Schedule to Buffer** — select approved posts, click "Send to Buffer". Posts are distributed across **Tuesday–Friday**, two slots per day at **10:00 AM ET** and **2:00 PM ET**. Updates post status to `SCHEDULED`.

**Post statuses:** DRAFT → APPROVED → SCHEDULED → PUBLISHED (or REJECTED at any point).

**Cost estimate:** Each segment = 1 Claude Sonnet call (~2,048 tokens output). At ~37 segments, that's roughly 37 API calls per week.

---

## Admin Pages

### `/admin/jobs` — Job Health & History

- **Summary cards** at top for `weekly-digest`, `ingestion`, and `social-posts` — each shows a health dot (green/yellow/red based on last run status and age), last run time, and key metrics.
- **History table** showing job name, status (SUCCESS/RUNNING/FAILURE), start time, end time, metrics JSON, and error text. Shows last 50 runs.

### `/admin/sources` — RSS Feed Management

- **Add source form** — name, URL, type (RSS or API).
- **Sources table** — lists all sources with name, URL, type, item count, active/inactive toggle, and delete button.
- Changes take effect on the next ingestion run.

### `/admin/social` — Social Post Management

- See [Social Posts Workflow](#social-posts-workflow) above.

**Note:** Admin pages are only accessible to users with `role = "ADMIN"` in the database. The admin link appears in the user dropdown menu.

---

## Subscriptions & Stripe

### How the trial works

1. User clicks the Pro signup button → redirects to Stripe Checkout with a **7-day free trial** (`trial_period_days: 7`).
2. No payment is charged during the trial.
3. On `checkout.session.completed`, a `Subscription` record is created with status `ACTIVE` (trialing maps to ACTIVE internally).
4. An **instant personalized brief** is generated and delivered immediately — the user doesn't have to wait until Sunday.
5. During the trial, the user receives full Pro briefs every Sunday.
6. After 7 days, Stripe charges the card. If payment fails or the user cancels, the status changes to `CANCELED` or `PAST_DUE` and the user falls back to free briefs.

### Webhook events handled

| Event | Action |
|---|---|
| `checkout.session.completed` | Creates/updates subscription record, triggers instant brief |
| `invoice.paid` | Updates `currentPeriodEnd`, sets status to `ACTIVE` |
| `customer.subscription.updated` | Maps Stripe status (`active`/`trialing` → `ACTIVE`, `canceled` → `CANCELED`, `past_due` → `PAST_DUE`) |
| `customer.subscription.deleted` | Sets status to `CANCELED` |

### Checking subscription status

- **In the database:** Query the `Subscription` table by user ID.
- **In Stripe:** Go to Stripe Dashboard → Customers → search by email.
- **Billing portal:** Users can manage their subscription at `/api/stripe/portal` which redirects to Stripe's hosted billing portal.

---

## Telegram Bot

Bot: **@myweeklyai_bot**

### How users connect

1. On the dashboard, user clicks to connect Telegram.
2. A 16-byte hex token is generated with a 15-minute expiry.
3. User opens a deep link: `https://t.me/myweeklyai_bot?start=<token>`
4. In Telegram, user sends `/start <token>` → the webhook validates the token, links their `telegramChatId`, and sets delivery channel to `BOTH`.
5. The dashboard polls every 5 seconds to detect when the connection completes.

### Commands

| Command | What it does |
|---|---|
| `/start <token>` | Links the Telegram account to the user. Token must be valid and not expired. |
| `/start` (no token) | Replies asking the user to use the dashboard link. |
| `/stop` | Disconnects the Telegram account and resets delivery channel to `EMAIL`. |
| Any other message | Replies with available commands. |

### Disconnecting

Users can disconnect via the dashboard (calls `DELETE /api/telegram/link`) or by sending `/stop` in Telegram. Both clear the `telegramChatId` and reset delivery channel to `EMAIL`.

---

## Email Addresses

| From Address | Purpose | Service |
|---|---|---|
| `onboarding@resend.dev` | Magic link sign-in emails | Resend (sandbox) |
| `hello@myweekly.ai` | Welcome email sent on account creation | Resend |
| `digest@myweekly.ai` | Weekly brief delivery | Resend |
| `alerts@myweekly.ai` | Job failure/warning alerts to admin | Resend |

**Note:** The magic link from address uses `onboarding@resend.dev` (Resend's sandbox sender). This works for any recipient but shows Resend's domain. To use a custom from address for magic links, verify the sending domain in Resend and update `src/lib/auth.ts`.

---

## Environment Variables

### Authentication

| Variable | Required | Purpose |
|---|---|---|
| `NEXTAUTH_SECRET` | Yes | Signs/verifies JWT session tokens |
| `NEXTAUTH_URL` | Yes | Base URL for auth callbacks and redirects |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |

### Database

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Supabase Postgres connection string (session pooler) |

### Email

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Yes | Resend API key for sending all emails (magic links, welcome, briefs, alerts) |

### AI

| Variable | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Claude API key — auto-read by the Anthropic SDK (not referenced as `process.env` in code) |

### Payments

| Variable | Required | Purpose |
|---|---|---|
| `STRIPE_SECRET_KEY` | Yes | Stripe server-side API key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Validates Stripe webhook signatures |
| `STRIPE_PRICE_ID` | Yes | Price ID for the Pro subscription plan |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Client-side Stripe key (currently unused in code) |

### Telegram

| Variable | Required | Purpose |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Yes | Bot token from @BotFather |
| `TELEGRAM_BOT_USERNAME` | Yes | Bot username (without `@`) for deep link URLs |
| `TELEGRAM_WEBHOOK_SECRET` | Yes | Validates incoming Telegram webhook requests |

### Cron Jobs

| Variable | Required | Purpose |
|---|---|---|
| `CRON_SECRET` | Yes | Bearer token for authenticating cron/job API requests |

### Public

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Yes | Public-facing base URL — used in metadata, sitemap, email templates, social post job chaining |

### Monitoring (optional)

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_ALERT_EMAIL` | No | Receives email alerts on job failures |
| `HEALTHCHECK_PING_URL_INGEST` | No | Dead-man's-switch ping on successful ingestion |
| `HEALTHCHECK_PING_URL_DIGEST` | No | Dead-man's-switch ping on successful digest delivery |
| `HEALTHCHECK_PING_URL_SOCIAL` | No | Dead-man's-switch ping on successful social post generation |

### Social Scheduling (optional)

| Variable | Required | Purpose |
|---|---|---|
| `BUFFER_ACCESS_TOKEN` | No | Buffer API token for scheduling social posts |
| `BUFFER_LINKEDIN_PROFILE_ID` | No | Buffer profile ID for LinkedIn |
| `BUFFER_TWITTER_PROFILE_ID` | No | Buffer profile ID for Twitter/X |

---

## Common Operations

### Trigger ingestion manually

```bash
curl -X POST https://my-weekly-ai.vercel.app/api/jobs/ingest \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Trigger weekly digest manually

```bash
curl -X POST https://my-weekly-ai.vercel.app/api/jobs/weekly-digest \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Trigger social post generation manually

```bash
curl -X POST "https://my-weekly-ai.vercel.app/api/jobs/social-posts?index=0" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

This starts at segment 0 and automatically chains through all segments.

### Make a user an admin

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'user@example.com';
```

Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).

### Check job run history

Go to `/admin/jobs` or query the database:

```sql
SELECT * FROM "JobRun" ORDER BY "startedAt" DESC LIMIT 20;
```

### Debug a failed job

1. Check `/admin/jobs` — look for the red FAILURE badge and expand the error text.
2. Check Vercel function logs: Vercel Dashboard → your project → Logs → filter by the API route (`/api/jobs/ingest` or `/api/jobs/weekly-digest`).
3. If `ADMIN_ALERT_EMAIL` is set, check your inbox for the alert email with full error details.

### Apply a Prisma migration to production

1. Write your migration SQL.
2. Go to Supabase Dashboard → SQL Editor → New query.
3. Paste and run the SQL.
4. If the schema change affects the Prisma schema, update `prisma/schema.prisma` locally, run `npx prisma generate`, and deploy.

### Re-seed RSS sources

```bash
npx tsx prisma/seed.ts
```

This upserts all sources from the seed list and deactivates any sources no longer in the list.

---

## Infrastructure

| Service | Provider | Plan | Purpose |
|---|---|---|---|
| Hosting | Vercel | Hobby (free) | Next.js app hosting, cron jobs, serverless functions |
| Database | Supabase | Free tier | Postgres database (project: `myweeklyai`) |
| DNS | GoDaddy | — | Domain registration and DNS management |
| Email receiving | Microsoft 365 | — | Receives email at the custom domain |
| Email sending | Resend | Free tier | Sends transactional emails (magic links, briefs, alerts) |
| Payments | Stripe | — | Subscription billing, checkout, billing portal |
| AI | Anthropic | — | Claude API for brief and social post generation |
| Telegram | Telegram Bot API | Free | Brief delivery via Telegram |
| Social scheduling | Buffer | — | Schedules LinkedIn and Twitter/X posts |
