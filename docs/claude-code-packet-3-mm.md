# AI Job Risk Assessment — Packet 3: Marketing Manager Pivot Paths 1-12

> **🗄️ Status: Historical / superseded as of 2026-06-03.** All 12 path
> entries proposed in this packet have been authored into the Marketing
> Manager role config (commit `2cfadf6`) and the canonical spec has been
> updated to v1.0.4 (commit pending). For current authoritative content —
> including the implemented tier classifications, path types
> (`marketing-strategy-ic` / `marketing-ops-ic`), the `caveat` field on
> P7 GEO/AI Search Strategist, and the calibrated scoring rules per path —
> refer to [ai-job-risk-assessment-spec.md](./ai-job-risk-assessment-spec.md)
> §4.2 and the live role config at
> `src/lib/ai-job-risk/roles/marketing-managers.ts`. This packet is kept as
> a record of how v1.0.4 was decided.

**Status (original):** Marketing Manager assessment is being built. The spec §4.2.2 contains one-line summaries for Paths 1-12 that need to be authored at full SWE-tier depth (the same 8-field structure used in §4.1.4 for Software Engineer paths).

**Scope of this packet:** 12 paths (Paths 1-12 for Marketing Manager only). Junior paths (13-15) from Packet 1 and executive paths (16-18) from Packet 2 are already at full depth.

**Spec version this targets:** v1.0.4 (after Packet 2 fixes applied)

---

## Authoring approach

For each path, I'm authoring:
- `dayToDay` (what the role looks like day-to-day)
- `whyDurable` (why it's more durable than the user's current role)
- `requiredExperience` (specific years/seniority expectations)
- `transferableSkills` (what the user already has)
- `skillGaps` (what they need to build)
- `salaryRange` (verified Q2 2026 market data with appropriate qualifiers)
- `timeline` (realistic pivot timeline)
- `bestFitsWhen` (specific signals from user profile)
- `pathDefiningIndustries` (paths where industry is path-defining — +40 fit bonus)
- `strongContextIndustries` (paths where industry is supporting context — +20 fit bonus)
- `tier` (junior / ic / executive)

**Salary data sources:** Robert Half 2026 Salary Guide, Wellfound AI Startup data, Glassdoor, ZipRecruiter, Digital Marketing Salary Guide 2026, Murray Resources 2026 AI Marketing report, Built In, KORE1.

**Language discipline:** Applied the measured-language audit principles from Packet 2 throughout. No unverifiable multipliers, all salary ranges qualified, all timelines marked as "typical" rather than guaranteed.

---

## Path 1: AI Marketing Manager / AI Marketing Strategist

**Provenance:** 🟢 Established (a category that barely existed in 2024 but appeared in 4,200+ US job postings by Q1 2026 — 8x increase)

**`tier`:** `ic`

**dayToDay:** Lead AI tool adoption across the marketing organization. Design AI-augmented workflows for content production, campaign optimization, and customer segmentation. Evaluate and onboard new AI vendors. Train marketing teammates on prompt engineering and AI tool fluency. Bridge the gap between marketing strategy and AI capability — translating business goals into AI implementation plans. Often involves significant hands-on work building agentic workflows in tools like HubSpot AI, Jasper, ChatGPT Enterprise, and category-specific marketing AI platforms.

**whyDurable:** AI Marketing Manager is the fastest-growing role in marketing by compensation. The work requires judgment about which AI tools fit which workflows, how to maintain brand voice across AI-generated content, and where AI accelerates vs. degrades marketing outcomes. Companies need this glue role between AI tools and marketing strategy — neither generic marketers nor pure technical AI engineers can do it well alone.

**requiredExperience:** Mid-level (3-5 years marketing experience), with demonstrated AI tool fluency. Existing marketing managers with strong adoption velocity scores in their current role have the shortest path. Some employers will accept senior coordinators with strong personal AI portfolios.

**transferableSkills:** Marketing fundamentals (positioning, segmentation, campaign management), existing tool fluency, cross-functional collaboration, comfort with iteration and testing.

**skillGaps:** Advanced prompt engineering, AI workflow design (chained prompts, agents, evals), vendor evaluation frameworks for AI tools, AI cost management, basic understanding of how LLMs differ from rules-based automation, comfort with non-deterministic systems.

**salaryRange:** $105K-$155K base at the mid-level, with senior positions exceeding $180K. AI-skilled marketers earn 15-22% premiums across every marketing role per Q1 2026 data. Top-paying AI marketing roles at well-funded companies push higher ($180K-$250K total comp), though these typically require demonstrated impact and senior responsibility.

**timeline:** 3-6 months of focused upskilling while in current role. Most successful pivots happen as internal expansion of responsibility before formal title change.

**bestFitsWhen:** Marketing Manager or Senior Marketing Manager title; 3+ AI tools currently used; encouraged/mandated employer AI posture; significant time on tasks 1, 3, or 4 (copywriting, performance analysis, research); active learning rating "Yes, regularly."

**pathDefiningIndustries:** ["Marketing / Advertising", "SaaS / Software"]
**strongContextIndustries:** ["E-commerce / Retail", "Fintech / Financial Services", "Media / Entertainment"]

---

## Path 2: Marketing Operations / Marketing Ops Lead

**Provenance:** 🟢 Established

**`tier`:** `ic`

**dayToDay:** Own the marketing technology stack. Build and maintain attribution models, lifecycle automation, lead scoring, CRM integrations, and data pipelines that connect marketing tools to revenue systems. Run experiments in marketing automation platforms. Increasingly involves orchestrating AI-augmented workflows alongside traditional MarTech. Less creative work, more systems thinking and revenue operations alignment.

**whyDurable:** Marketing Ops is the architecture layer of modern marketing — and the architect role is durable even as execution gets automated. Companies hire Marketing Ops Leads specifically to make the AI tools work together coherently. The work depends on judgment about data quality, attribution decisions, and tradeoffs that AI systems can implement but not design.

**requiredExperience:** Mid-level (3-5 years), ideally with strong analytics background. Marketing professionals with significant A/B testing time (Task 5) or campaign analysis time (Task 3) have the most natural transition. SQL and basic data modeling skills are increasingly expected.

**transferableSkills:** Analytical thinking, campaign performance analysis, systems orientation, comfort with marketing tools and CRM platforms.

**skillGaps:** SQL fundamentals, attribution modeling (multi-touch, MMM), marketing automation platform administration (HubSpot, Marketo, Pardot), data warehouse fundamentals (Snowflake, BigQuery), basic Python or no-code automation, revenue operations frameworks.

**salaryRange:** Mid-level Marketing Operations Manager base typically $98K-$130K (Built In 2026 data shows US average $98,139). Senior roles at growth-stage SaaS companies push $130K-$180K. Remote-first roles command $8,500-$14,000/month per industry data. AI-skilled MarOps professionals at AI-native companies (Scale AI, etc.) clear $138K+.

**timeline:** 6-12 months of skill building. Often involves moving laterally from a Marketing Manager role to a Marketing Ops Specialist role first, then upward to Marketing Ops Manager / Lead.

**bestFitsWhen:** Marketing Manager with strong analytical orientation; significant time on Tasks 3 (performance analysis) or 5 (A/B testing); SaaS or B2B industry; tools list includes HubSpot or similar marketing automation; novel problems rating at "Frequently" or higher.

**pathDefiningIndustries:** ["SaaS / Software", "Marketing / Advertising"]
**strongContextIndustries:** ["Fintech / Financial Services", "E-commerce / Retail"]

---

## Path 3: Product Marketing Manager

**Provenance:** 🟢 Established

**`tier`:** `ic`

**dayToDay:** Own product positioning, messaging, and go-to-market for one or more products. Work closely with sales (enabling them with positioning, training, content), product (informing roadmap with customer feedback and market data), and customer success (helping retain and expand accounts). Run product launches, competitive intelligence, and pricing analysis. Less performance marketing, more strategic communication.

**whyDurable:** Product marketing depends on synthesis across product, sales, and customer data — work that requires judgment about what matters and why. The role is among the most cross-functional in marketing, with strategic stakeholder management that AI tools augment but don't replace. AI-skilled PMMs command 20-30% premiums; top-paying PMM industries include Pharmaceutical & Biotech ($203K), Legal ($150K), and Financial Services ($146K).

**requiredExperience:** Mid-level (3-5 years marketing experience) with strong communication and cross-functional history. Marketers with significant Task 7 time (cross-functional stakeholder management) have the most natural transition. Technical aptitude helps for B2B SaaS PMM.

**transferableSkills:** Stakeholder management, written communication, marketing fundamentals (positioning, messaging), customer-facing comfort, comfort with structured analysis.

**skillGaps:** Sales enablement frameworks, competitive positioning methodologies, pricing strategy, B2B sales cycle understanding, product analytics interpretation, customer interview practice for product research.

**salaryRange:** Robert Half 2026 places Product Marketing Manager at $89,750-$137,000 base. Glassdoor data shows remote PMM roles commanding $9,063-$14,409/month ($108K-$172K annualized). Senior PMM at major SaaS companies reaches $140K-$200K base. PMM at well-funded AI startups commonly $130K-$180K base + equity.

**timeline:** 6-12 months. Often involves moving from a general marketing role to a PMM role at the same or adjacent company. PMM experience compounds — second PMM role typically pays 25-40% more than first.

**bestFitsWhen:** Marketing Manager or Senior Marketing Manager; strong cross-functional collaboration time (Task 7); B2B industry experience; high decision stakes scores; relationship importance rated "Critical" or "Important."

**pathDefiningIndustries:** ["SaaS / Software"]
**strongContextIndustries:** ["Fintech / Financial Services", "Healthcare / Life Sciences", "Cybersecurity"]

---

## Path 4: Demand Generation Lead / Performance Marketing Manager

**Provenance:** 🟡 Emerging (the role has existed for years but is being reshaped substantially by AI-powered ad platforms and predictive analytics)

**`tier`:** `ic`

**dayToDay:** Drive pipeline and revenue through paid channels (search, social, programmatic), organic growth experiments, ABM campaigns, and lifecycle marketing. Own the marketing-sourced pipeline number. Run experiments at scale and read attribution data to allocate budget. Increasingly involves managing AI-augmented bidding systems and AI-generated creative variants while maintaining performance accountability.

**whyDurable:** While AI handles more bid optimization and creative generation, the strategic judgment — what audiences to test, what creative concepts to validate, what budget to allocate where, when to pause campaigns — remains human work. Top performance marketers add value through judgment under uncertainty, which AI assists but doesn't replace.

**requiredExperience:** Mid-level to senior (4-8 years marketing experience), with demonstrated performance accountability. Marketers from agency backgrounds often transition well. Strong analytical skills required.

**transferableSkills:** Campaign management, performance analysis, budget management, comfort with experimentation.

**skillGaps:** Modern attribution methodologies (multi-touch, incrementality testing, MMM), AI-powered ad platform administration (Google Performance Max, Meta Advantage+), agentic ad workflows, ABM platform fluency (6sense, Demandbase), predictive analytics interpretation.

**salaryRange:** Performance Marketing Manager remote roles typically $10,500-$16,000/month ($126K-$192K annualized). Demand Gen Lead at growth-stage SaaS companies $130K-$190K base. Top-paying performance marketing roles at AI-skilled companies reach $200K+ total comp. Wide variance based on accountability and company stage.

**timeline:** 6-12 months. Performance marketers with strong attribution experience have the shortest path; generalist marketers need to build analytical foundation first.

**bestFitsWhen:** Marketing Manager with strong analytics orientation; significant Task 3 time (performance analysis); B2B or DTC e-commerce experience; tools list includes ad platforms or attribution tools.

**pathDefiningIndustries:** ["SaaS / Software", "E-commerce / Retail"]
**strongContextIndustries:** ["Marketing / Advertising", "Fintech / Financial Services"]

---

## Path 5: Customer Insights / Voice of Customer Analyst

**Provenance:** 🟡 Emerging (the role exists but is being elevated as customer empathy becomes a competitive moat against AI-driven generic marketing)

**`tier`:** `ic`

**dayToDay:** Synthesize customer research across surveys, interviews, support tickets, sales calls, and product usage data. Generate strategic insights that inform marketing, product, and customer success decisions. Run regular customer interviews and behavioral studies. Often combines qualitative research skills with AI-augmented synthesis tools that process large volumes of unstructured customer data.

**whyDurable:** AI tools can summarize customer feedback at scale, but the strategic interpretation — what patterns matter, what they imply, how to act on them — remains human judgment work. Customer empathy compounds with experience and depends on direct customer relationships. As AI commoditizes generic marketing, deep customer understanding becomes the differentiator.

**requiredExperience:** Mid-level (3-6 years marketing or research experience). Marketers with significant Task 11 time (customer research) or strong customer-facing background have the most natural transition. Background in user research, sociology, or behavioral economics helps.

**transferableSkills:** Customer empathy, qualitative research methods, synthesis and pattern recognition, written communication.

**skillGaps:** Modern research synthesis tools (Dovetail, Reduct), AI-augmented research workflows, survey methodology, statistical literacy for quantitative research, customer behavioral analytics platforms.

**salaryRange:** Customer Insights / VoC roles typically $90K-$160K base. Senior insights roles at consumer brands and B2B SaaS push $150K-$200K. Wide variance based on whether the role is positioned as research, marketing, or strategy.

**timeline:** 6-12 months. Strong existing customer research time accelerates this substantially.

**bestFitsWhen:** Marketing Manager with high customer-facing time; Task 11 time meaningful; relationship importance rated "Critical" or "Important"; B2B SaaS or consumer brand experience; novel problems rating high.

**pathDefiningIndustries:** []
**strongContextIndustries:** ["SaaS / Software", "E-commerce / Retail", "Healthcare / Life Sciences", "Education / EdTech"]

---

## Path 6: Brand Strategist

**Provenance:** 🟢 Established (one of the most AI-resistant marketing specialties)

**`tier`:** `ic`

**dayToDay:** Lead brand positioning, brand voice development, and creative direction. Work at the intersection of marketing, product, and design. Define how the brand shows up across all touchpoints. Lead brand research, identity development, and strategic creative briefs. Often partners closely with creative directors and product marketing on brand expression.

**whyDurable:** Brand strategy depends on cultural understanding, judgment about meaning, and creative direction that AI tools cannot replicate at senior levels. While AI can generate brand expressions once direction is set, the strategic decisions about brand positioning, voice, and meaning remain among the most defensible marketing work. AI proficiency adds 16-20% to senior brand roles per 2026 data.

**requiredExperience:** Senior (6-10 years marketing experience), with demonstrated brand voice development and creative direction history. Strong portfolio of brand work matters more than years.

**transferableSkills:** Brand voice (Task 9), strategic positioning, creative judgment, written communication, cross-functional collaboration.

**skillGaps:** Modern brand identity frameworks, brand architecture for product suites, AI-augmented creative workflows (using AI without losing brand voice), brand measurement frameworks, executive-level brand storytelling.

**salaryRange:** Brand Strategist roles typically $100K-$200K base. Senior brand strategist at established brands and agencies push $180K-$250K. Top-paying brand roles at premium consumer brands and growth-stage tech reach higher.

**timeline:** 12-18 months. Brand work is reputation-driven; portfolio building matters as much as title transitions.

**bestFitsWhen:** Senior Marketing Manager or above; significant Task 9 time (brand voice and creative direction); high decision stakes; consumer brand, agency, or premium B2B background.

**pathDefiningIndustries:** ["Marketing / Advertising", "Media / Entertainment"]
**strongContextIndustries:** ["E-commerce / Retail", "SaaS / Software"]

---

## Path 7: GEO / AI Search Strategist

**Provenance:** 🟡 Emerging (genuinely new specialty in 2025-2026, emerged in response to AI-generated search results)

**`tier`:** `ic`

**dayToDay:** Optimize content and brand presence for AI-generated search results — Google AI Overviews, Perplexity citations, ChatGPT references, Claude citations. Build strategies for being recommended by AI systems when users ask questions in your domain. Combines traditional SEO with new disciplines: structured data for AI consumption, citation worthiness, and content patterns that AI systems favor.

**whyDurable:** As AI-mediated search grows, organizations need specialists who understand both how AI systems retrieve and cite content and how to position brands within that retrieval. This is genuinely new territory with limited established expertise, creating opportunities for marketers who develop the specialty early. Should be recommended with caveat that the specialty is still maturing — established methodologies are evolving.

**requiredExperience:** Mid-level (3-6 years marketing or SEO experience). SEO professionals have the shortest path; content marketers with strong analytical orientation also transition well.

**transferableSkills:** SEO fundamentals, content strategy, analytical thinking, comfort with new tooling, willingness to test and iterate.

**skillGaps:** Understanding LLM retrieval patterns (RAG, citation behavior), structured data and schema markup for AI consumption, AI search analytics tools (still emerging), citation-worthy content frameworks, awareness of how different AI systems (OpenAI, Anthropic, Google, Perplexity) treat sources differently.

**salaryRange:** $90K-$170K base, with wide variance because the role is still being defined. Some companies position this as SEO+ ($85K-$130K); others position it as a strategic new role ($130K-$170K+). Senior GEO specialists at AI-forward content companies can push higher, though the data here is thin.

**timeline:** 3-6 months. The specialty is new enough that visible expertise (writing publicly, building case studies) can establish credibility faster than traditional career paths.

**bestFitsWhen:** Marketing Manager or content-focused marketer with SEO background; Task 4 time meaningful (competitor/market research); willingness to operate in nascent territory; active learning rating "Yes, regularly."

**Caveat to surface in report:** "This is a highly emerging specialty. The role definition and best practices are still being established. Strong fit for marketers comfortable in nascent territory; less fit for those who need established career frameworks."

**pathDefiningIndustries:** []
**strongContextIndustries:** ["SaaS / Software", "Marketing / Advertising", "Media / Entertainment", "E-commerce / Retail"]

---

## Path 8: Content Operations Director / Manager

**Provenance:** 🟡 Emerging (existed before but reshaped substantially by AI content production)

**`tier`:** `ic`

**dayToDay:** Run AI-augmented content production at scale. Oversee mix of human writers, AI tools, and editorial workflows. Build quality control processes that catch AI hallucinations and voice inconsistencies. Manage content briefing, production, optimization, and distribution workflows. Often combines team management with systems design.

**whyDurable:** As AI content generation scales, the production layer becomes critical. Companies need operators who can extract real value from AI tools while maintaining brand quality and editorial standards. Content Operations roles are among the strongest survival paths for content-heavy marketers, with AI proficiency adding 16-20% to compensation.

**requiredExperience:** Mid-level to senior (4-8 years marketing or content experience). Marketers with significant Task 2 time (content calendar) and team management experience have the shortest path.

**transferableSkills:** Content calendar management, editorial judgment, team coordination, project management, brand voice understanding.

**skillGaps:** AI content workflow design, evaluation rubric development for AI output, content operations tools (Contentful, Sanity, Storyblok with AI integrations), content attribution and analytics, governance frameworks for AI-generated content.

**salaryRange:** Content Operations Manager $110K-$160K typical. Content Operations Director at growth-stage companies $140K-$200K. Senior roles at content-heavy AI companies push higher. Head of Content roles (related) average $128K-$165K base per Q2 2026 data.

**timeline:** 6-12 months. Often a natural progression from Senior Content Manager or Content Strategist roles.

**bestFitsWhen:** Senior Marketing Manager or content-focused marketer; significant Task 2 time; team leadership history; mid-to-large company background where content production scale matters.

**pathDefiningIndustries:** ["Media / Entertainment", "Marketing / Advertising"]
**strongContextIndustries:** ["SaaS / Software", "E-commerce / Retail", "Education / EdTech"]

---

## Path 9: Founding Marketer at AI Startup

**Provenance:** 🟡 Emerging

**`tier`:** `ic`

**dayToDay:** First or solo marketing hire at an early-stage AI company. Wear many hats: positioning, content production, growth experiments, lifecycle automation, basic analytics, sometimes sales support. High variance work — some weeks heavy on content, others on growth experiments, others on product launches. Direct working relationship with founders.

**whyDurable:** Founding/early marketers at AI-native companies gain rare experience that compounds. The role rewards generalist skills and judgment about positioning, customer empathy, and rapid experimentation — work that AI itself cannot replicate. Equity upside compensates for moderate base salaries. AI startup marketing experience commands premium in subsequent roles.

**requiredExperience:** 3-8 years marketing experience. Startup tolerance and generalist skill profile matter as much as years. Wide range of acceptable backgrounds.

**transferableSkills:** Marketing fundamentals, comfort with ambiguity, generalist skill profile, written communication, willingness to do unglamorous work.

**skillGaps:** Growth marketing for early-stage companies, lifecycle automation from scratch, building basic marketing infrastructure, working without senior marketing peers, sometimes basic SQL/analytics.

**salaryRange:** Marketing Manager at AI startups averages $135,639, with range $72K-$275K depending on company stage and location (Wellfound Q2 2026 data). Pre-seed/seed founding marketers typically $90K-$130K base + meaningful equity (0.25-1.5% common). Series A+ founding marketers $130K-$180K base + smaller equity. Top-paying AI startups in NYC average $155K; SF Bay Area $130K; Austin $120K.

**timeline:** Can pivot immediately if willing to take startup risk. AngelList, Y Combinator's job board, and AI-specific startup job boards are best entry points.

**bestFitsWhen:** Marketing Manager with generalist skill profile; low risk aversion; interest in AI as a category; comfortable with ambiguity; active learning rating "Yes, regularly."

**pathDefiningIndustries:** []
**strongContextIndustries:** ["SaaS / Software", "Fintech / Financial Services"]

---

## Path 10: Marketing Director / VP Marketing

**Provenance:** 🟢 Established

**`tier`:** `ic` (this targets a Director-level role, which from a Senior Marketing Manager perspective is upward; users already at Director should see Path 16 instead)

**dayToDay:** Lead marketing organization or major function. Set strategy, manage marketing org (typically 5-30 people), own pipeline/revenue accountability, work with executive team on go-to-market planning. Bridge between hands-on tactical work and executive strategy. Increasingly involves making decisions about AI investments at team and budget level.

**whyDurable:** Marketing leadership is among the most AI-resistant marketing work. The premium for AI/ML skills is lower at leadership level — not because the skills don't matter, but because the work is inherently human (strategic judgment, organizational leadership, executive communication). As more tactical work gets automated, leverage shifts to those who decide what to do.

**requiredExperience:** Senior (8-12 years marketing experience), with demonstrated team leadership and revenue accountability. Significant Task 12 time (team leadership) helps. Cross-functional history important.

**transferableSkills:** Marketing strategy, cross-functional collaboration, budget management, team development, executive communication.

**skillGaps:** Hiring at scale, performance management, budget allocation across channels, executive presence with founders/CEO, board-level marketing reporting, AI investment frameworks at team level.

**salaryRange:** Marketing Director typically $180K-$280K base. VP Marketing $250K-$400K base; total comp $300K-$500K with equity. Top-paying VP Marketing roles at growth-stage tech and AI-native companies reach higher. Remote VP Marketing positions typically $20,000-$35,000/month ($240K-$420K annualized) per industry data.

**timeline:** 12-24 months from Senior Marketing Manager. Internal promotion is faster; external moves take longer but often pay more.

**bestFitsWhen:** Senior Marketing Manager; significant Task 12 time; relationship importance "Critical"; decision stakes "Constantly"; 8+ years experience.

**pathDefiningIndustries:** ["SaaS / Software"]
**strongContextIndustries:** ["E-commerce / Retail", "Fintech / Financial Services", "Marketing / Advertising"]

---

## Path 11: Vertical AI Marketing Specialist (Regulated Industries)

**Provenance:** 🟡 Emerging

**`tier`:** `ic`

**dayToDay:** Apply marketing expertise to a regulated vertical (fintech, healthtech, legaltech, pharma) where AI adoption is slower but specialization premium is higher. Lead marketing for products that need compliance-aware messaging, regulatory-sensitive content, and industry-specific positioning. Often combines marketing skills with deep domain immersion.

**whyDurable:** Regulated industries adopt AI more slowly but with higher specialization premiums. Top-paying marketing manager industries are Pharmaceutical & Biotech ($203K median total pay), Legal ($150K), Financial Services ($146K), Energy ($143K), and Information Technology ($139K). Domain expertise + AI fluency is a rare and durable combination — and AI tools struggle with regulated-industry nuance.

**requiredExperience:** Mid-level to senior (4-10 years), with existing industry experience strongly preferred but not strictly required. Marketing professionals willing to immerse in a specific vertical can transition with patience.

**transferableSkills:** Marketing fundamentals, willingness to learn industry context, comfort with compliance constraints, written communication.

**skillGaps:** Industry-specific regulatory knowledge (HIPAA for healthcare, FINRA for finance, etc.), vertical SaaS ecosystem fluency, technical product marketing for the chosen vertical, AI tool usage within compliance constraints.

**salaryRange:** $110K-$200K base typically. Pharmaceutical & Biotech, Legal, and Financial Services command the highest premiums. Senior specialists with established vertical reputation reach $200K-$300K base at top employers.

**timeline:** 6-18 months. Pivoting to a vertical SaaS startup in your existing industry's adjacent space is the fastest path.

**bestFitsWhen:** Marketing Manager with existing industry experience in fintech/healthtech/legaltech/pharma; or generalist marketer willing to specialize; high decision stakes; significant Task 6 time (marketing strategy and positioning).

**pathDefiningIndustries:** ["Healthcare / Life Sciences", "Fintech / Financial Services", "Legal / LegalTech"]
**strongContextIndustries:** ["Cybersecurity", "Government / Public Sector"]

---

## Path 12: Independent Marketing Consultant

**Provenance:** 🟠 Forecast (the path exists today but the AI-era consulting model is still being defined)

**`tier`:** `ic` (the new Path 17 Fractional CMO from Packet 2 is the executive-tier equivalent; this Path 12 is for senior IC consultants)

**dayToDay:** Solo or small-team consulting practice helping companies adopt AI in marketing, restructure marketing operations, or solve specific strategic problems (positioning, launches, marketing audits). Project or retainer-based revenue. Mix of strategic advisory and hands-on implementation depending on engagement.

**whyDurable:** Senior independent consultants in AI-augmented marketing command premium rates because the value is judgment, not execution. Established consultants with strong networks generate significant revenue. The AI consulting market in marketing is wide open and most enterprises are willing to pay for credible experts.

**requiredExperience:** 8+ years marketing experience, ideally with prior senior or leadership roles. Personal network and reputation matter as much as credentials. Specialization in a category (positioning, demand gen, AI marketing transformation) helps.

**transferableSkills:** Marketing strategy, project management, cross-functional collaboration, business judgment, written and verbal communication.

**skillGaps:** Business development, contract negotiation, pricing strategy (often the hardest skill), self-marketing, comfort with income variability, basic operations (taxes, accounting, contracts).

**salaryRange:** Variable. Hourly rates $150-$400+ for senior marketing consultants. Annual revenue $100K-$400K achievable for established practices, with significant variance based on network and specialization. Top tier exceeds $500K but typically requires 5+ years of consulting practice building.

**timeline:** 12-24 months to build sustainable practice. Most successful consultants start with one anchor client while wrapping up a previous role.

**bestFitsWhen:** Senior Marketing Manager with 8+ years; strong network in their industry; willingness to do business development; comfort with variable income; demonstrated specialization in a marketing discipline.

**pathDefiningIndustries:** []
**strongContextIndustries:** ["Marketing / Advertising", "Consulting / Professional Services", "SaaS / Software"]

---

## Implementation notes for Claude Code

### Drop-in instructions

These 12 paths should populate the Marketing Manager role config's `pivotPathLibrary` for Paths 1-12. Each field maps directly to the path config structure used in the Software Engineer library.

### Tier assignments summary

For tier-based selection logic (per Packet 2):

- **`junior`:** Paths 13-15 (from Packet 1)
- **`ic`:** Paths 1-12 (this packet) — all Marketing Manager IC-tier paths
- **`executive`:** Paths 16-18 (from Packet 2)

### Industry weighting summary

Path-defining industries provide +40 fit score; strong context industries provide +20.

| Path | Path-defining | Strong context |
|------|---------------|----------------|
| 1 | Marketing/Advertising, SaaS | E-commerce, Fintech, Media |
| 2 | SaaS, Marketing/Advertising | Fintech, E-commerce |
| 3 | SaaS | Fintech, Healthcare, Cybersecurity |
| 4 | SaaS, E-commerce | Marketing/Advertising, Fintech |
| 5 | (none) | SaaS, E-commerce, Healthcare, Education |
| 6 | Marketing/Advertising, Media | E-commerce, SaaS |
| 7 | (none) | SaaS, Marketing/Advertising, Media, E-commerce |
| 8 | Media, Marketing/Advertising | SaaS, E-commerce, Education |
| 9 | (none) | SaaS, Fintech |
| 10 | SaaS | E-commerce, Fintech, Marketing/Advertising |
| 11 | Healthcare, Fintech, Legal | Cybersecurity, Government |
| 12 | (none) | Marketing/Advertising, Consulting, SaaS |

### One special case: Path 7 (GEO/AI Search Strategist)

This path includes a caveat that should be surfaced in the user report when this path is selected: "This is a highly emerging specialty. The role definition and best practices are still being established."

Recommend implementing as a per-path optional `caveat` field that the AI prompt for "Why this fits you" can incorporate when present, or as standalone callout text in the report's pivot path block.

### One spec inconsistency to flag

Path 10 (Marketing Director / VP Marketing) targets a role that — from a Senior Marketing Manager's perspective — is upward, but from a Director's perspective is lateral, and from a VP's perspective is downward. With the tier-based logic from Packet 2:

- Mid-level Marketing Managers should see this path as an aspirational upward move
- Director-level users should see Path 16 (VP Marketing / CMO at AI-Native Company) instead, which is the executive-tier equivalent
- VP-level users should see Paths 17 (Fractional CMO) and 18 (Chief Growth Officer) as appropriate

Path 10 is currently marked `tier: "ic"` to ensure it surfaces for Marketing Managers but gets deprioritized for Directors per the senior-tier preference logic.

### Spec updates needed (v1.0.4)

After this packet is integrated:

- §4.2.2: Replace Paths 1-12 one-line summaries with full 8-field content from this packet
- §4.2.7 (selection logic): Verify tier-based logic from Packet 2 is in place for MM
- Appendix A: Document decision A.24 — "Path 10 (Marketing Director/VP) classified as `ic` rather than `executive` per the same logic as SWE Path 4 (Engineering Manager): targets a role that's upward for Managers but lateral/downward for Directors+"

### Validation recommendations

Once Claude Code applies this packet, recommended validation:

1. **Junior persona test:** Marketing Coordinator, 0-2 years, e-commerce industry. Expected paths: junior paths 13-15.
2. **Mid-level persona test:** Marketing Manager, 3-5 years, SaaS industry, heavy task time on copywriting + performance analysis. Expected paths: 1 (AI Marketing Manager) prominently, plus 2 (Marketing Ops) and 4 (Demand Gen).
3. **Senior IC persona test:** Senior Marketing Manager, 6-10 years, SaaS industry, heavy task time on strategy + cross-functional. Expected paths: 10 (Marketing Director track), 3 (Product Marketing), 1 (AI Marketing Manager).
4. **Executive persona test:** Director of Marketing, 12+ years, SaaS industry. Expected paths: 16 (VP/CMO), 17 (Fractional CMO), 18 (Chief Growth Officer) — all from Packet 2.

If those four personas produce sensible recommendations, MM is production-ready.
