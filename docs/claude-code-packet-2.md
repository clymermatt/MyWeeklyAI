# AI Job Risk Assessment — Packet 2: Executive-Tier Paths & Language Audit

**Status:** Three personas validated (Junior IC, Senior IC, Director). Algorithm and prompt fixes from Packet 1 all working. This packet addresses two remaining issues before launching the other 4 roles.

**Spec version this references:** v1.0.2 (after Packet 1 fixes applied)

---

## Summary of what's in this packet

1. **Executive-tier pivot paths** — 9 new paths total (3 each for Software Engineer, Marketing Manager, Content Creator). Customer Success and Product Manager already have executive-tier paths in the spec; those need minor refinement only.

2. **Language audit** — Targeted updates to specific path content where claims are overpromising. Focused on the 3 junior paths I drafted in Packet 1 (which had the most aggressive language) plus 4 places in the original spec where claims should be softened.

3. **Updated selection algorithm logic** — Add a senior-tier eligibility filter parallel to the junior filter, ensuring Directors/VPs get appropriate paths rather than lateral/downward moves.

---

## Section 1: Why this matters

Persona 6 (Director of Engineering, 16+ years) received these top 3 pivot paths:
- Forward Deployed Engineer (Senior IC role — lateral/downward move for a Director)
- Independent AI Consultant (appropriate)
- Engineering Manager (downward move from Director)

Two of three recommendations were moves down or sideways. The algorithm worked correctly — it filtered out junior paths and selected the highest-fit eligible paths. The library just didn't have appropriate executive-tier options.

Without this fix, every Director/VP taking the assessment across all 5 roles will get similarly mismatched recommendations.

---

## Section 2: Executive-tier pivot paths to add

### 2.1 Software Engineer — 3 new executive-tier paths

**Path 16: VP Engineering / CTO at AI-Native Company 🟢 Established**

What it looks like day-to-day: Lead engineering organization at a venture-funded or growth-stage AI company. Set technical strategy, hire and develop engineering leaders, work directly with founders and board, make decisions about infrastructure, AI model strategy, and team scaling. The premium tier of engineering leadership.

Why it's more durable than current role: VP/CTO roles at AI-native companies are among the highest-leverage positions in tech. The work requires technical depth, organizational judgment, and external visibility — a combination AI cannot replicate. Compensation reflects this: total comp regularly clears $1M at funded companies, with frontier AI labs and hyperscalers pushing higher.

Required experience: 12+ years engineering experience, with prior Director-level leadership (3+ years) and management of multiple teams.

Transferable skills: Cross-functional collaboration, technical strategy, mentorship and team development, architectural decision-making, business judgment.

Skill gaps to close: Board-level communication, fundraising fluency, fast hiring at scale, AI-specific technical depth (LLM systems, ML infrastructure), executive presence in customer settings.

Salary range: VP Engineering base $330K-$475K at recognizable enterprise software employers; total comp clears $1M at most public-traded tech companies with equity refresh and LTIs. CTO base $183K-$390K with total comp typically $600K+ at funded companies. Frontier AI labs and hyperscalers push significantly higher.

Timeline to pivot: 12-24 months. Most successful pivots happen via internal promotion or strategic external hire. Network and reputation matter more than credentials at this level.

Best fits when user shows: Director-level role with 12+ years experience, strong cross-functional collaboration time, critical relationships rating, history of leading multiple teams.

`pathDefiningIndustries: ["SaaS / Software", "Fintech / Financial Services"]`
`strongContextIndustries: ["Cybersecurity", "Healthcare / Life Sciences", "Media / Entertainment"]`

---

**Path 17: Founder / Technical Co-founder at AI Startup 🟡 Emerging**

What it looks like day-to-day: Start your own AI-native company, or join as technical co-founder. Set product direction, build initial team, raise capital, navigate early customer development. Higher risk, higher equity upside than employed leadership roles.

Why it's more durable than current role: Founders shape their own role entirely — by definition not subject to displacement from below. Founder-CEO and founder-CTO outcomes at AI-native companies in 2024-2026 have produced significant compensation events. The work draws on technical judgment, business judgment, and execution — all human work.

Required experience: 8+ years engineering experience, ideally with prior Staff+ or Director-level role. Risk tolerance and personal financial runway matter as much as credentials.

Transferable skills: Technical depth, architectural decision-making, ability to hire, cross-functional collaboration, comfort with ambiguity.

Skill gaps to close: Fundraising and investor communication, go-to-market strategy, hiring outside of engineering, financial modeling, comfort with personal financial risk.

Salary range: Variable and stage-dependent. Pre-seed/seed founders often pay themselves $50K-$120K with significant equity (15-50% as cofounder). After Series A, typical founder comp $150K-$250K base + ongoing equity. Exit outcomes range from $0 to $50M+ depending on company outcome.

Timeline to pivot: Can pivot immediately if willing to commit. Most founders take 18-36 months to reach product-market fit.

Best fits when user shows: Senior or above experience, high differentiation scores, low risk aversion (inferred from open-text responses), prior startup experience or strong personal projects, willingness to work intensely.

`pathDefiningIndustries: []` — Industry-agnostic
`strongContextIndustries: ["SaaS / Software", "Fintech / Financial Services", "Healthcare / Life Sciences"]`

---

**Path 18: Engineering Advisor / Board Member / Fractional CTO 🟠 Forecast**

What it looks like day-to-day: Senior advisory role to multiple companies. Board seats at startups, fractional CTO engagements with growth-stage companies, paid advisor relationships with AI companies. Lower time commitment than full executive roles, higher rate per hour, multiple concurrent engagements.

Why it's more durable than current role: Advisory and board work depends entirely on reputation and judgment — work AI does not perform. This is often where senior engineering leaders go after Director/VP roles, either as a bridge to retirement or as a portfolio career.

Required experience: 15+ years engineering experience, with prior Director-level role (3+ years) and demonstrable network in the AI ecosystem.

Transferable skills: Cross-functional collaboration, strategic judgment, technical pattern recognition, mentorship of other leaders.

Skill gaps to close: Building advisor network, contract and equity negotiation, time management across multiple engagements, comfort with not running day-to-day operations.

Salary range: Variable. Fractional CTO engagements run $8K-$25K/month per company; typical portfolio of 2-4 companies. Board seats at startups typically pay $25K-$75K cash annually plus 0.25-1% equity. Paid advisor relationships vary widely. Total annual revenue commonly $300K-$700K for established advisors; ceiling pushes higher with strong network.

Timeline to pivot: 12-24 months to build a sustainable advisor practice. Often starts as side engagements while still in full-time role.

Best fits when user shows: Senior leadership history, high differentiation, critical relationships, willingness to handle business operations, 15+ years experience.

`pathDefiningIndustries: []`
`strongContextIndustries: ["SaaS / Software", "Fintech / Financial Services"]`

---

### 2.2 Marketing Manager — 3 new executive-tier paths

**Path 16: VP Marketing / CMO at AI-Native Company 🟢 Established**

What it looks like day-to-day: Lead marketing organization at venture-funded or growth-stage AI company. Set positioning and brand strategy, build marketing team, own pipeline and revenue marketing, work directly with CEO and board. Premium tier of marketing leadership in a high-growth segment.

Why it's more durable than current role: CMO/VP Marketing roles at AI-native companies require strategic judgment, organizational leadership, and external visibility that AI does not replicate. The work involves making positioning bets, building executive relationships, and developing a marketing organization — all human work.

Required experience: 12+ years marketing experience, with prior Director-level role (3+ years) and demonstrated revenue accountability.

Transferable skills: Brand strategy, positioning, cross-functional collaboration, budget management, team development.

Skill gaps to close: Board-level communication, comfort with venture-backed financial models, AI product positioning fluency, executive presence with technical co-founders.

Salary range: Full-time CMO base typically $225K-$375K at growth-stage companies; total comp commonly $275K-$500K once equity is included. At public tech companies and frontier AI labs, total comp pushes substantially higher.

Timeline to pivot: 12-24 months. Internal promotion or strategic external hire. Network and demonstrated revenue impact matter more than credentials.

Best fits when user shows: Director of Marketing role with 12+ years experience, cross-functional history, critical relationships, revenue accountability.

`pathDefiningIndustries: ["SaaS / Software", "Marketing / Advertising"]`
`strongContextIndustries: ["Fintech / Financial Services", "E-commerce / Retail", "Media / Entertainment"]`

---

**Path 17: Fractional CMO / Independent Marketing Executive 🟢 Established**

What it looks like day-to-day: Serve as part-time marketing executive for 2-4 companies simultaneously. Provide strategic marketing leadership, build marketing infrastructure, hire and manage team, own revenue outcomes — but on 8-40 hours per month per client. Operates with the authority of a full executive, not a consultant.

Why it's more durable than current role: Fractional marketing leadership has grown rapidly — the number of fractional leadership professionals in the US doubled from 60,000 in 2022 to 120,000 in 2024. The work requires strategic judgment and accountability that AI agents cannot match. Multiple concurrent engagements diversify income risk.

Required experience: 10+ years marketing experience, with prior VP/CMO or Director-level role. Brand or category expertise that companies will pay premium rates for.

Transferable skills: Strategy, positioning, team management, vendor relationships, executive communication.

Skill gaps to close: Business development, contract negotiation, pricing strategy, self-marketing, comfort with income variability.

Salary range: Monthly retainers $5K-$20K per client; growth-stage companies ($10M-$200M revenue) pay $10K-$40K monthly. Hourly rates $500-$750. Established fractional CMOs commonly run portfolios producing $300K-$600K annually; top tier exceeds.

Timeline to pivot: 12-24 months to build a sustainable practice. Most fractional CMOs start with one anchor client while wrapping up a previous role.

Best fits when user shows: Senior marketing leader with 10+ years, strong network, willingness to do business development, comfort with variable income.

`pathDefiningIndustries: []`
`strongContextIndustries: ["SaaS / Software", "Marketing / Advertising", "Consulting / Professional Services"]`

---

**Path 18: Chief Growth Officer / Head of Revenue Marketing 🟡 Emerging**

What it looks like day-to-day: Lead the integration of marketing and revenue functions at a growth-stage company. Own pipeline, revenue marketing, sometimes sales enablement and customer marketing. Common role at PLG (product-led growth) companies and AI-native companies that have collapsed traditional marketing/sales boundaries.

Why it's more durable than current role: Growth leadership requires judgment about complex systems (acquisition, conversion, retention, expansion) and cross-functional execution. The role often reports directly to CEO and is responsible for the most strategic revenue decisions in the company.

Required experience: 12+ years experience, with prior Director-level role and demonstrated growth/revenue ownership.

Transferable skills: Marketing strategy, analytical thinking, cross-functional collaboration, customer empathy.

Skill gaps to close: Deep funnel analytics, revenue operations frameworks, comfort with sales-side metrics, board-level revenue forecasting.

Salary range: Base $250K-$400K at growth-stage companies. Total comp commonly $400K-$700K with equity. Top performers at venture-backed companies push higher.

Timeline to pivot: 12-24 months. Often involves first taking on growth or revenue marketing responsibility in a current role.

Best fits when user shows: Senior marketing leader with strong analytical orientation, revenue accountability history, cross-functional collaboration time.

`pathDefiningIndustries: ["SaaS / Software"]`
`strongContextIndustries: ["Fintech / Financial Services", "E-commerce / Retail"]`

---

### 2.3 Content Creator — 3 new executive-tier paths

**Path 16: Head of Content / VP Content at AI-Native Company 🟢 Established**

What it looks like day-to-day: Lead content function at a venture-funded or growth-stage company. Set editorial strategy, manage content production team (often a mix of human writers and AI-augmented workflows), build brand authority through thought leadership, own content's contribution to revenue and brand outcomes.

Why it's more durable than current role: Content leadership requires editorial judgment, brand stewardship, and team development — all work that AI cannot replicate at the leadership level. The role is increasingly strategic as companies recognize content's role in AI search visibility and brand differentiation.

Required experience: 10+ years content experience, with prior Director-level role (3+ years) and demonstrated team leadership.

Transferable skills: Editorial judgment, brand voice development, cross-functional collaboration, team management.

Skill gaps to close: AI content tool orchestration, revenue attribution for content, GEO/AI search strategy, executive communication.

Salary range: VP Content base $180K-$300K; total comp $230K-$370K with equity at growth-stage companies. Head of Content base $125K-$230K; top earners $300K+ at major platforms.

Timeline to pivot: 12-24 months. Internal promotion or strategic external hire.

Best fits when user shows: Content Strategist / Content Director title with 10+ years experience, strong editorial judgment, team leadership history.

`pathDefiningIndustries: ["Media / Entertainment", "SaaS / Software", "Marketing / Advertising"]`
`strongContextIndustries: ["Education / EdTech", "Fintech / Financial Services"]`

---

**Path 17: Independent Publisher / Newsletter Operator (Mature) 🟠 Forecast**

What it looks like day-to-day: Run your own content business as a senior operator. Newsletter, podcast, video channel, or hybrid. Generate revenue through subscriptions, sponsorships, or productized services tied to your content. Unlike the junior newsletter path, this is for established content leaders monetizing built audiences.

Why it's more durable than current role: Independent publishers control their own work, audience, and revenue. The work depends on editorial judgment and audience relationships — durable from automation. Most successful independent publishers built audiences while still employed before going full-time.

Required experience: 10+ years content experience, ideally with existing audience or strong personal brand. The path is most viable for those who have built reputation in a specific domain.

Transferable skills: Editorial judgment, audience understanding, consistent execution, brand voice.

Skill gaps to close: Business operations (taxes, contracts, accounting), audience growth strategy, sponsorship and partnership development, comfort with income variability.

Salary range: Variable and trajectory-dependent. Established niche newsletters and content businesses commonly generate $200K-$600K annually for solo operators. Top tier exceeds $1M for established names in valuable verticals.

Timeline to pivot: 24-48 months to reach replacement-level income. Most successful publishers build for 2-3 years on the side first.

Best fits when user shows: Senior content creator with existing personal brand or audience, strong consistency in content production, niche expertise that can support a publishing business.

`pathDefiningIndustries: []`
`strongContextIndustries: ["Media / Entertainment"]`

---

**Path 18: Chief Content Officer / Editorial Director (Enterprise/Agency) 🟢 Established**

What it looks like day-to-day: Senior editorial leadership at a content-focused enterprise (publication, media company, agency) or a content-heavy enterprise function (marketing-led B2B, education). Set editorial standards, lead distributed teams of writers and editors, ensure brand consistency across high content volumes.

Why it's more durable than current role: Senior editorial roles at content-focused organizations remain critical even as AI tools accelerate production. The work involves brand stewardship, quality control at scale, and team development — all human work.

Required experience: 12+ years editorial experience, with prior Director-level role and demonstrated brand-building or publication leadership.

Transferable skills: Editorial standards, brand voice, team leadership, cross-functional collaboration with marketing/product.

Skill gaps to close: AI-augmented editorial workflows at scale, content attribution and analytics, executive-level brand strategy.

Salary range: Editorial Director and Head of Content roles typically $130K-$230K. VP/Chief Content Officer roles at major publishers and agencies $200K-$350K base; total comp can exceed $400K at large enterprises.

Timeline to pivot: 12-24 months. Often involves moving between organizations to reach senior editorial leadership.

Best fits when user shows: Content Director or Editor in Chief title with 12+ years, team leadership history, strong brand voice development experience.

`pathDefiningIndustries: ["Media / Entertainment"]`
`strongContextIndustries: ["Marketing / Advertising", "Education / EdTech", "Nonprofit / Social Impact"]`

---

### 2.4 Customer Success — Already covered, minor refinements

The spec §4.4.2 already includes:
- Path 7: VP / Director of Customer Success
- Path 12: Independent CS Consultant

These cover executive-tier needs. Recommended refinement: **add explicit industry weighting to these existing paths** using the same `pathDefiningIndustries` / `strongContextIndustries` pattern:

- **Path 7 (VP / Director of CS):**
  - `pathDefiningIndustries: ["SaaS / Software"]`
  - `strongContextIndustries: ["Fintech / Financial Services", "Healthcare / Life Sciences"]`

- **Path 12 (Independent CS Consultant):**
  - `pathDefiningIndustries: []`
  - `strongContextIndustries: ["SaaS / Software", "Consulting / Professional Services"]`

No new paths needed for Customer Success.

---

### 2.5 Product Manager — Already covered, minor refinements

The spec §4.5.2 already includes:
- Path 7: VP Product / CPO
- Path 11: Founder of AI-Native Product Startup
- Path 12: Independent Product Consultant / Fractional Head of Product

These cover executive-tier needs. Recommended refinement: **add explicit industry weighting**:

- **Path 7 (VP Product / CPO):**
  - `pathDefiningIndustries: ["SaaS / Software"]`
  - `strongContextIndustries: ["Fintech / Financial Services", "E-commerce / Retail", "Healthcare / Life Sciences"]`

- **Path 11 (Founder):**
  - `pathDefiningIndustries: []`
  - `strongContextIndustries: ["SaaS / Software"]`

- **Path 12 (Independent Consultant):**
  - `pathDefiningIndustries: []`
  - `strongContextIndustries: ["SaaS / Software", "Consulting / Professional Services"]`

No new paths needed for Product Manager.

---

## Section 3: Language audit — targeted updates

Reviewed all 60 existing pivot paths plus the 15 new junior paths from Packet 1. The overpromising language is concentrated in 7 specific places. Recommended replacements below.

### 3.1 AI-Augmented Developer (Path 15, Software Engineer)

**Current "What it looks like":**
> "Junior engineer role specifically positioned around heavy AI tool usage. Often at smaller companies or as a '10x junior' at AI-forward companies. Build features 3-5x faster than traditional juniors by leveraging Cursor, Claude Code, Devin, and similar tools."

**Replace with:**
> "Junior engineer role specifically positioned around heavy AI tool usage. Found at AI-forward companies that organize work around engineers who use AI tools extensively. Ship features and complete tasks notably faster than traditional juniors by leveraging Cursor, Claude Code, and similar tools — exact productivity gains vary by task and team."

**Current "Why it's more durable":**
> "Companies are reorganizing around AI-augmented juniors who can ship at senior IC velocity."

**Replace with:**
> "Companies are increasingly hiring junior engineers who can ship more independently by leveraging AI tools. The role rewards AI fluency and judgment about when to trust AI output — skills that traditional juniors are still building."

**Current "Salary range":**
> "$100K-$150K base at AI-forward companies. Higher when role is positioned as 'AI-augmented senior' by 12-18 months."

**Replace with:**
> "$100K-$150K base at AI-forward companies. Compensation typically increases with demonstrated AI fluency and impact, though specific timeline varies by company."

---

### 3.2 Junior AI Engineer (Path 13, Software Engineer)

**Current "Salary range":**
> "$95K-$140K base at most companies. Higher at AI-native startups + equity. Frontier labs (OpenAI, Anthropic) hire junior engineers in this category at $130K+ with significant equity."

**Replace with:**
> "$95K-$140K base at most companies. Higher at AI-native startups + equity. Frontier labs hire junior engineers in this category at higher bands, often with equity packages that vary substantially by company and role."

---

### 3.3 AI Trust & Safety Analyst (Path 14, Software Engineer)

**Current "Salary range":**
> "$80K-$130K base for entry-level, climbing quickly. Senior trust & safety engineers clear $200K+."

**Replace with:**
> "$80K-$130K base for entry-level. Senior trust & safety engineers at established companies typically reach $150K-$200K+; ceiling varies by employer."

---

### 3.4 Junior Prompt Engineer (Path 14, Marketing Manager)

**Current "Salary range":**
> "$95K-$130K at entry-level for prompt engineering roles, with median around $109K-$126K. Lower if the role is positioned as 'AI content specialist' ($60K-$95K)."

**Replace with:**
> "Entry-level prompt engineering roles typically range $80K-$130K, with reported medians around $109K-$126K. Roles positioned as 'AI content specialist' or similar tend toward the lower end ($60K-$95K). Salary varies substantially by employer and how 'prompt engineering' is defined."

---

### 3.5 AI-Augmented Developer (Path 15, Software Engineer) — Best fits section

**Current "Best fits when user shows":**
> "3+ AI tools currently used, strong willingness to learn, junior IC at a company with permissive AI tool policy, high active learning score."

This is fine as written, no change needed.

---

### 3.6 Original spec — AI Engineer (Path 1)

**Current "Salary range":**
> "$145K-$310K base. Mid-level $155K-$200K typical. Senior $200K-$280K+ common. Total comp pushes $400K+ at top companies with equity."

This is well-bounded. No change needed.

---

### 3.7 Forward Deployed Engineer (Path 3)

**Current "Salary range":**
> "$180K-$700K total comp (highest variance of any role). $150K-$250K base typical at mid-level. Staff-level at frontier labs (OpenAI, Anthropic) regularly clears $500K+ total comp."

**Replace "regularly clears" with "can reach":**
> "$180K-$700K total comp (highest variance of any role). $150K-$250K base typical at mid-level. Staff-level at frontier labs can reach $500K+ total comp depending on role and equity package."

**Reasoning:** "Regularly clears" implies it's the standard outcome. "Can reach" is more honest about variance.

---

### 3.8 Independent AI Consultant (Path 12, Software Engineer)

**Current "Salary range":**
> "Variable. Hourly rates $200-500+ for senior AI consultants. Annual revenue $250K-$1M+ achievable for established practices, but with 12-18 months of ramp time."

This is well-qualified. No change needed.

---

## Section 4: Selection algorithm update — senior-tier eligibility filter

The Packet 1 update added strict eligibility for junior paths. Now we need a parallel update for senior-tier paths.

**Updated logic in §4.X.7 (pivot path selection):**

```
function selectPivotPaths(userResponses, scores):
  
  candidatePaths = []
  
  // Step 1: Strict eligibility check
  for each path in pivotPathLibrary:
    if path.minSeniority > userResponses.seniority: continue
    if path.maxSeniority < userResponses.seniority: continue
    candidatePaths.append({path, fitScore})
  
  // Step 2: Seniority-tier preference
  // For Director+ users (seniority >= "Director"):
  //   Prefer executive-tier paths in the top 3
  //   Only fall back to senior IC paths if fewer than 3 executive paths score well
  if userResponses.seniority >= "Director":
    execTierPaths = filter(candidatePaths, p => p.tier == "executive")
    if len(execTierPaths) >= 2:
      // Reserve at least 2 slots for executive-tier paths
      // Third slot can be highest-fit from any tier
  
  // Step 3: Apply diversification rule (existing logic)
  
  return top 3 paths
```

**Implementation note:**

Each path needs a `tier` attribute added to its config:
- `tier: "junior"` for paths 13-15 (the new junior paths)
- `tier: "ic"` for paths 1-12 in the original library (most are senior IC)
- `tier: "executive"` for paths 16-18 (the new executive paths) and existing VP/CTO/Founder/Independent paths

For paths that span tiers (e.g., Engineering Manager spans senior IC to early executive), use the upper tier.

---

## Section 5: Summary of changes Claude Code should make

### High priority (blocking other role rollouts)

1. **Add 9 new executive-tier pivot paths** (3 each for SWE, Marketing Manager, Content Creator) from Section 2 of this packet.

2. **Add `pathDefiningIndustries` / `strongContextIndustries` arrays** to existing VP/CMO/CPO paths in Customer Success and Product Manager configs (Section 2.4 and 2.5).

3. **Apply targeted language updates** to 4 specific paths from Section 3 (3.1, 3.2, 3.3, 3.4, 3.7).

4. **Add `tier` attribute** to all pivot paths (junior/ic/executive) and update selection logic per Section 4.

### Medium priority (worth doing alongside high priority)

5. **Re-validate with Persona 6** after changes to confirm executive paths surface for Director-level users.

### After this packet

After applying these changes, the Software Engineer role config is complete and battle-tested. The Marketing Manager, Content Creator, Customer Success, and Product Manager configs can be built using the same patterns:
- Original spec paths 1-12 (from §4.2-§4.5)
- Junior paths 13-15 (from Packet 1)
- Executive paths 16-18 (from this Packet 2, where applicable)

For Customer Success and Product Manager, paths 16-18 don't need to be added — their existing path libraries already include executive-tier options. Just apply the industry weighting refinements from Section 2.4 and 2.5.

---

## Section 6: Spec updates needed (v1.0.3)

After implementation, update the spec with:

- §4.1.4, §4.2.2, §4.3.2: Add paths 16-18 with full metadata
- §4.4.2, §4.5.2: Add industry weighting to existing VP-tier paths
- §4.X.7 across all roles: Update selection logic with tier-based preference
- Language updates per Section 3 (changes to Path 1, 3, 12, 13, 14, 15 of SWE; Path 14 of Marketing Manager)
- Appendix A: Document decisions A.20-A.23 covering the executive tier addition and language audit
- Appendix B: Mark "executive-tier pivot path coverage" as resolved

---

## Appendix: A note on what we're not changing

After full audit of the 60 existing paths plus 15 junior paths, the language is generally well-bounded. Most paths include qualifiers ("typically," "established practices," "with equity," "at top companies") that protect against overpromising. The 7 places flagged in Section 3 are exceptions that should be brought in line with the rest.

A few patterns I deliberately preserved:

1. **"Highest variance of any role"** for Forward Deployed Engineer is defensible — the actual market data shows $180K to $700K, which is genuinely the highest variance among the paths.

2. **"Premium consulting rates"** language is fine for senior independent paths — the market does pay senior AI consultants premium rates.

3. **"Most AI-resistant"** language is fine when applied to specific work types like cross-functional collaboration or mentorship — these are genuinely among the most AI-resistant work types.

The principle: keep specific, defensible claims; soften unverifiable multipliers, percentages, or promises about future outcomes.
