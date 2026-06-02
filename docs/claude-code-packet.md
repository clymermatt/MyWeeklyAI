# AI Job Risk Assessment — Validation Findings & Fix Packet

> **🗄️ Status: Historical / superseded as of 2026-06-01.** All fixes proposed
> in this packet have been implemented (commit `6e2f75e`) and the canonical
> spec has been updated to v1.0.2 (commit `9850639`). For current authoritative
> content — including the junior pivot paths for all 5 roles, the industry-bonus
> mechanism, and the Branch 2 / Action 1 / prompt-direction fixes — refer to
> [ai-job-risk-assessment-spec.md](./ai-job-risk-assessment-spec.md). This
> packet is kept as a record of how v1.0.2 was decided.

**Status (original):** Two personas validated (Persona 1: junior IC software engineer, Persona 2: staff/principal software engineer). Core scoring works well across the spectrum. This packet documents what works, what needs fixing, and provides the content needed for fixes.

**Spec version this references:** v1.0.1

---

## Section 1: What's working well (no action needed)

Validation against both personas confirmed:

1. **Scoring math is correct.** Composite scores match factor breakdown × weights at both extremes (Persona 1: 77 High Risk, Persona 2: 25 Low Risk).
2. **Tier mapping works correctly** per §3.2.
3. **Task time normalization works** — Persona 1's >100% total normalized properly per §5.3.
4. **Task analysis sort order works** — sorted by user-reported time, highest first, per §6.5.
5. **Junior IC conditional shortcut (§5.7 Branch 2) fires correctly** — E1 correctly hidden for 0-2 year junior IC; correctly shown for senior IC.
6. **Skill Differentiation compression rule (§3.5) fires correctly** — does not trigger when 3 of 4 are max but one is lower.
7. **Diversification rule in pivot path selection (§4.1.7) works for senior personas** — Persona 2 received paths across 3 different categories (Entrepreneurial, Leadership, Customer-Facing).
8. **AI-generated narrative quality is high** — references specific user data, doesn't feel template-y.
9. **PDF design is professional and shareable.**

The foundation is solid. Issues below are refinement work, not "the product is broken."

---

## Section 2: High priority fixes (before launching other 4 roles)

### Fix 1: Junior pivot paths missing across all roles

**Issue:** Persona 1 (0-2 year junior software engineer) received "AI Engineer (LLM-focused)" as their #1 pivot path, despite that path explicitly requiring "Mid-level or above (3+ years). Junior engineers face stiff competition."

**Root cause:** All 12 pivot paths in the Software Engineer library (§4.1.4) require 3+ years experience minimum. The same is true for the other 4 roles. A 0-2 year user has zero strictly eligible paths, so the algorithm returns the "least ineligible" options.

**Fix required:** Add 3 junior-eligible pivot paths to each role's pivot path library. Total: 15 new paths (3 per role × 5 roles).

**The 15 new junior paths are specified in Section 4 of this packet.** Each is researched from Q2 2026 market data with verified hiring demand and salary ranges.

**Updated path count per role:**
- Software Engineer: 12 → 15 paths
- Marketing Manager: 12 → 15 paths
- Content Creator: 12 → 15 paths
- Customer Success: 12 → 15 paths
- Product Manager: 12 → 15 paths

---

### Fix 2: Time-to-Impact direction confusion in AI prompt

**Issue:** Persona 2's report contained this incorrect narrative in the Progress Tracking section:

> "...your Time-to-Impact score of 8/100 signals you're in a **rapidly automating role**..."

**Root cause:** Time-to-Impact Urgency direction is "higher = more urgent." A score of 8/100 means very low urgency (major change unlikely in near term). The AI misread the direction and wrote as if low Time-to-Impact = bad.

**Fix required:** Update prompt template 6.9.6 (Progress tracking personalization prompt) to be explicit about factor direction.

**Replace this prompt:**

```
FACTOR SCORES (lower is better for first two, higher is better for the differentiation/portability):
- Task Automatability: {factor1}/100
- Adoption Velocity: {factor2}/100  
- Skill Differentiation (raw): {factor3Raw}/100
- Career Portability (raw): {factor4Raw}/100
- Time-to-Impact Urgency: {factor5}/100
```

**With this:**

```
FACTOR SCORES with direction notes:
- Task Automatability: {factor1}/100 (LOWER IS BETTER — high score = more of your work is automatable)
- Adoption Velocity: {factor2}/100 (LOWER IS BETTER — high score = displacement happening faster)
- Skill Differentiation (raw): {factor3Raw}/100 (HIGHER IS BETTER — high score = harder to replicate)
- Career Portability (raw): {factor4Raw}/100 (HIGHER IS BETTER — high score = more pivot options)
- Time-to-Impact Urgency: {factor5}/100 (LOWER IS BETTER — high score = major change is imminent; low score = stability in near term)
```

This addition prevents the AI from misreading direction. It should be made to all 6 prompt templates in §6.9, but the Progress tracking prompt is the highest priority since that's where the bug surfaced.

---

### Fix 3: Action plan must dynamically reference tools user actually selected

**Issue:** Persona 2's Week 1 action said "Automate a recurring engineering workflow using Cursor" — but Persona 2 did NOT select Cursor in their tool list. They selected Claude and ChatGPT.

**Root cause:** Per §6.7, the Week 1 action template should use a tool the user actually selected. It appears the implementation may have a hardcoded fallback to Cursor for the Software Engineer role.

**Fix required:** Verify the Week 1 action template logic.

**Correct logic should be:**
- If user has 0-1 tools: recommend learning the top tool for their role (Cursor for SWE, ChatGPT for Marketing, etc.)
- If user has 2-3 tools: recommend deepening usage of one tool they ALREADY HAVE
- If user has 4+ tools: recommend deepening usage of one tool they ALREADY HAVE (the one they likely use least)

**For tool-selection logic when 2+ tools selected:** Pick from the user's actual selected tools. Don't reference tools they didn't select. The AI prompt template should explicitly receive the user's `toolsUsed` array and reference one from that list.

---

## Section 3: Medium priority issues (investigate and address before/during the 4-role rollout)

### Issue 4: Time-to-Impact math discrepancy for Persona 1

**Observation:** Persona 1's reported Time-to-Impact = 91. My recalculation per §3.7 modifiers = 88. Three-point discrepancy.

**Possible causes:**
- "Yes, somewhat" structural change may be applying a non-zero modifier (spec lists only "Yes significantly" as +10)
- Some other small adjustment

**Recommended action:** Spot-check the Factor 5 modifier code. Specifically verify that "Yes, somewhat" structural change returns 0 modifier per spec. If a different value is being used, either update the spec to document it, or fix the code to match the spec.

**Impact:** Small (~0.3 points of composite). Not launch-blocking but worth fixing for consistency.

---

### Issue 5: Industry signal weight in pivot path selection

**Observation:** Persona 2 was a Cybersecurity professional with deep domain expertise and "Constantly" high decision stakes — a near-perfect match for the "AI Security Engineer" pivot path per §4.1.4. But AI Security Engineer didn't make the top 3.

**Possible cause:** The pivot path scoring config may not be weighting industry-specific signals heavily enough, or the AI Security Engineer config doesn't reference Cybersecurity industry as a fit signal.

**Recommended action:** Review the fit-score scoring rules for each pivot path in the Software Engineer config. Industry matches should be a strong signal — Cybersecurity professionals should consistently get AI Security Engineer in their top paths.

**Suggested scoring boost:** Add an industry-match bonus of +20 to fit score for paths where industry is explicitly a fit signal (e.g., Cybersecurity → AI Security Engineer, Healthcare/Legal/Finance → Vertical AI Specialist, etc.).

---

### Issue 6: Senior leadership shortcut (§5.7 Branch 1) — untested

**Observation:** Branch 1 should skip D2 (decision stakes) for "Director of Engineering" or "VP Engineering / CTO" roles. Neither Persona 1 (Software Engineer/Developer) nor Persona 2 (Staff/Principal) triggers this branch.

**Recommended action:** No code change needed if Branch 2 (junior IC) works — they're parallel implementations. But worth a manual test post-fix to confirm Branch 1 fires when a Director/VP takes the assessment.

---

## Section 4: New junior pivot paths to add to each role

Each role needs 3 new pivot paths added that are realistically open to 0-2 year users. All paths below are verified against Q2 2026 market data.

**Eligibility for new paths:** `minSeniority` = "0-2 years" (the entry level). These are the only paths a junior user should match against.

**Important: Diversification rule should be updated** — if a junior user is eligible for multiple junior paths, recommend up to 3 of those before falling back to the more advanced paths. The current diversification rule per §4.1.7 should be updated to: "Filter eligible paths first; only stretch eligibility if fewer than 3 paths match."

---

### 4.1 Software Engineer — 3 new junior paths

**Path 13: AI Engineering Apprentice / Junior AI Engineer 🟡 Emerging**

What it looks like day-to-day: Entry-level position at an AI-native startup or larger company's AI division. Work on LLM integrations, RAG pipelines, and AI-powered features under mentorship. Often combines coding with prompt engineering, eval work, and learning AI fundamentals.

Why it's more durable than current role: Junior AI engineering roles compound rapidly — the field is so new that 2-3 years of focused AI work creates senior-level expertise. Companies are actively investing in apprenticeship-style programs because senior AI engineering talent is supply-constrained.

Required experience: 0-2 years. Strong portfolio of personal AI projects matters more than years.

Transferable skills: Coding fundamentals, willingness to learn, comfort with ambiguity, ability to read documentation.

Skill gaps to close: LLM API patterns, prompt engineering, RAG architectures, basic ML concepts, evaluation methodology.

Salary range: $95K-$140K base at most companies. Higher at AI-native startups + equity. Frontier labs (OpenAI, Anthropic) hire junior engineers in this category at $130K+ with significant equity.

Timeline to pivot: Can pivot in next job change with a strong portfolio. Build 2-3 personal AI projects publicly first.

Best fits when user shows: Junior IC with strong AI tool usage, high learning velocity (active learning = "Yes, regularly"), bachelors degree or equivalent, comfort with self-directed learning.

---

**Path 14: AI Trust & Safety Analyst 🟢 Established**

What it looks like day-to-day: Test AI systems for harmful outputs, evaluate model responses against safety guidelines, document failure modes, and help develop better guardrails. Work spans red-teaming, content policy, and structured evaluation. Often combines technical work with policy/judgment work.

Why it's more durable than current role: AI safety is among the fastest-growing functions at every major AI company. The work requires human judgment about edge cases, cultural context, and harm potential — durable from automation. OpenAI, Anthropic, Google, and Meta all have rapidly growing trust & safety teams.

Required experience: 0-2 years. Background in technical fields, content moderation, or policy helps. Strong writing and judgment skills required.

Transferable skills: Code reading ability, systematic thinking, attention to detail, writing skills, ethical reasoning.

Skill gaps to close: Red-teaming methodologies, content policy frameworks, AI safety concepts (alignment, jailbreaking, prompt injection), evaluation rubric design.

Salary range: $80K-$130K base for entry-level, climbing quickly. Senior trust & safety engineers clear $200K+.

Timeline to pivot: 3-6 months. Strong demand and lower technical bar than other AI roles makes this accessible.

Best fits when user shows: Strong decision-stakes scores even at junior level, interest in correctness/safety over building features, written communication skills, comfort with judgment calls.

---

**Path 15: AI-Augmented Developer (Specialist Track) 🟡 Emerging**

What it looks like day-to-day: Junior engineer role specifically positioned around heavy AI tool usage. Often at smaller companies or as a "10x junior" at AI-forward companies. Build features 3-5x faster than traditional juniors by leveraging Cursor, Claude Code, Devin, and similar tools.

Why it's more durable than current role: Companies are reorganizing around AI-augmented juniors who can ship at senior IC velocity. The role rewards AI fluency over coding-from-scratch ability. Junior engineers who already use multiple AI tools heavily are well-positioned.

Required experience: 0-2 years. AI tool fluency is more important than coding pedigree.

Transferable skills: Existing AI tool usage, comfort with iteration, debugging skills (validating AI output).

Skill gaps to close: Advanced patterns with Cursor/Claude Code, agent frameworks, evaluation skills (knowing when AI output is wrong), spec-writing skills.

Salary range: $100K-$150K base at AI-forward companies. Higher when role is positioned as "AI-augmented senior" by 12-18 months.

Timeline to pivot: 0-3 months. This is often a positioning shift rather than a credential shift — you may already be doing this work; reframe it on your resume.

Best fits when user shows: 3+ AI tools currently used, strong willingness to learn, junior IC at a company with permissive AI tool policy, high active learning score.

---

### 4.2 Marketing Manager — 3 new junior paths

**Path 13: AI Marketing Operations Associate 🟢 Established**

What it looks like day-to-day: Support marketing teams by managing AI tools, automating workflows, and producing AI-augmented content. Work with HubSpot AI, Jasper, ChatGPT, and similar. Often combines content production with tool administration and analytics.

Why it's more durable than current role: AI Marketing Ops is the layer between AI tools and marketing strategy — companies need this glue role. The work requires judgment about which AI tools to use when, and how to maintain quality.

Required experience: 0-2 years. Bachelors degree often required; relevant internship or AI tool fluency helps.

Transferable skills: Marketing fundamentals from coursework or internships, AI tool usage, basic analytics.

Skill gaps to close: HubSpot/Salesforce administration, AI content workflow design, marketing analytics, CRM data hygiene.

Salary range: $55K-$85K base. Higher at AI-forward marketing teams and tech companies.

Timeline to pivot: 0-3 months for entry. Often the first AI-adjacent role after a marketing internship or junior role.

Best fits when user shows: Marketing coordinator or specialist title, 2+ AI tools used, high active learning score.

---

**Path 14: Junior Prompt Engineer / AI Content Specialist 🟡 Emerging**

What it looks like day-to-day: Design and refine prompts for AI marketing tools at scale. Test prompt variations, document what works, build prompt libraries for teams to use. Often combines creative work (writing prompts) with systematic testing.

Why it's more durable than current role: Prompt engineering is one of the most accessible AI specialties — average salary $109K-$126K according to industry data. The work is fundamentally human (requires judgment about nuance, domain context, edge cases) but doesn't require deep technical background.

Required experience: 0-2 years. Strong writing and pattern-recognition skills are more important than credentials.

Transferable skills: Writing skills, attention to detail, ability to think about edge cases, willingness to test systematically.

Skill gaps to close: Advanced prompt patterns, A/B testing prompts, evaluation methodology, working with API parameters (temperature, top-p, etc.).

Salary range: $95K-$130K at entry-level for prompt engineering roles, with median around $109K-$126K. Lower if the role is positioned as "AI content specialist" ($60K-$95K).

Timeline to pivot: 3-6 months. Build a portfolio of documented prompt experiments first.

Best fits when user shows: Strong writing background, high differentiation on novel problems even at junior level, multiple AI tools used.

---

**Path 15: AI Marketing Assistant at AI-Native Startup 🟡 Emerging**

What it looks like day-to-day: First or early marketing hire at an early-stage AI company. Wear many hats: content production, social media, email marketing, basic analytics, growth experiments. Equity upside compensates for lower base.

Why it's more durable than current role: Founding/early marketers at AI-native startups gain rare experience that compounds. The role is harder to automate because it requires judgment about positioning, customer empathy, and rapid experimentation.

Required experience: 0-2 years. Startup tolerance matters more than years.

Transferable skills: Marketing fundamentals, willingness to do unglamorous work, basic creative skills, written communication.

Skill gaps to close: Growth marketing fundamentals, lifecycle automation, basic SQL/analytics, comfort with ambiguity.

Salary range: $60K-$90K base + meaningful equity at seed/Series A AI companies.

Timeline to pivot: Can pivot now if willing to take startup risk. AngelList, Y Combinator's job board, and AI-specific startup boards are best.

Best fits when user shows: Marketing coordinator/specialist title, generalist skill profile, low risk aversion, interest in AI as a category.

---

### 4.3 Content Creator — 3 new junior paths

**Path 13: AI Content Editor / Quality Reviewer 🟡 Emerging**

What it looks like day-to-day: Review and refine AI-generated content for accuracy, voice, and quality. Work across blog posts, marketing copy, social media, and email content. Often at content agencies, marketing departments, or AI content platforms.

Why it's more durable than current role: As AI content generation scales, the quality control layer becomes critical. Companies need editors who understand both writing craft AND AI quirks (hallucinations, voice inconsistency, factual errors). This role is growing rapidly.

Required experience: 0-2 years. Strong writing and editing skills required; AI tool fluency helps.

Transferable skills: Writing and editing background, attention to detail, ability to articulate what makes good content.

Skill gaps to close: Understanding AI failure modes, prompt refinement, evaluation rubric design, fact-checking workflows.

Salary range: $50K-$80K base for in-house roles. Freelance rates $30-60/hour.

Timeline to pivot: 0-3 months for entry. Build a small portfolio of "before/after" examples showing AI content you've edited.

Best fits when user shows: Junior writer with editing instinct, attention to detail, willingness to work with AI tools rather than against them.

---

**Path 14: Domain-Specialist Content Creator (Apprentice Track) 🟢 Established**

What it looks like day-to-day: Junior content creator specifically focused on a specialty area where AI struggles — cybersecurity, healthcare, finance, legal, or another regulated/technical domain. Work as a junior writer or content marketer in a vertical where domain accuracy matters more than volume.

Why it's more durable than current role: Specialized content writing in regulated industries is among the most AI-resistant content work. A cybersecurity writer who understands threat assessments, or a medical copywriter with FDA submission familiarity, faces essentially zero AI competition because the accuracy bar is too high for current models.

Required experience: 0-2 years. Domain knowledge from education or interest matters more than years.

Transferable skills: Writing skills, research ability, curiosity about specific fields.

Skill gaps to close: Domain immersion in your chosen specialty (e.g., learn cybersecurity fundamentals, healthcare regulations, financial terminology), industry-specific writing conventions.

Salary range: $55K-$90K at entry-level, climbing fast as expertise builds. Senior specialist writers in regulated industries clear $150K+.

Timeline to pivot: 6-12 months for domain immersion. Pick one specialty and write 3-5 in-depth pieces in that area first.

Best fits when user shows: Junior writer with interest in a specific industry, willingness to immerse in unfamiliar territory, prefers depth over breadth.

---

**Path 15: AI Content Trainer / Annotator (Writing-Specific) 🟢 Established**

What it looks like day-to-day: Train AI models on writing quality. RLHF (Reinforcement Learning from Human Feedback) for content generation, evaluation rubric design, ranking AI-generated content quality. Often at AI labs (OpenAI, Anthropic, Scale AI) or content quality platforms.

Why it's more durable than current role: AI labs need humans with writing taste to teach models what good content looks like. The work is genuinely hard for AI to do itself. RLHF specialists for writing earn $30-65/hour, with domain-specialized roles commanding higher rates.

Required experience: 0-2 years. Strong writing portfolio matters more than years.

Transferable skills: Writing taste, ability to articulate why content works or doesn't, systematic thinking.

Skill gaps to close: RLHF methodology, evaluation rubric design, working with AI labeling platforms (Scale, Mercor, Surge, Outlier).

Salary range: $30-65/hour part-time, $80K-$120K full-time at AI labs. Specialized domain writers (legal, medical, technical) command premium rates of $100+/hour.

Timeline to pivot: 1-3 months. Apply directly through Mercor, Scale AI, Outlier, or Anthropic's contractor programs.

Best fits when user shows: Strong writing background, comfort with feedback/critique, willingness to do detail-oriented evaluation work.

---

### 4.4 Customer Success — 3 new junior paths

**Path 13: AI Implementation Specialist / Onboarding Engineer 🟢 Established**

What it looks like day-to-day: Help enterprise customers adopt and configure AI tools. Onboarding workflows, integration setup, customer training, troubleshooting. Often combines CS skills with technical configuration work.

Why it's more durable than current role: Enterprise AI implementation is complex enough that customers need hands-on human help. The role combines customer empathy with technical configuration — neither part is easily automated. SaaS companies are hiring aggressively for these roles.

Required experience: 0-2 years. Technical comfort + customer-facing skill is the combination.

Transferable skills: Customer communication, basic technical aptitude, project management.

Skill gaps to close: Integration patterns (API, SSO, webhooks), specific platform expertise (Gainsight, Salesforce, HubSpot), basic SQL for data work.

Salary range: $55K-$85K base. Higher at AI-native companies where implementation is more complex.

Timeline to pivot: 0-3 months for entry-level roles. Junior implementation roles are widely available.

Best fits when user shows: Junior CSM/specialist title, technical curiosity, comfort with customer-facing work, attention to detail.

---

**Path 14: AI Operations Associate (Customer-Facing) 🟢 Established**

What it looks like day-to-day: Monitor AI tool performance for customer accounts, resolve escalations, collect feedback for product team, run audits on AI output quality, handle the operational backbone of AI-driven customer experiences.

Why it's more durable than current role: As more customer interactions involve AI agents, companies need human operators to monitor quality, handle edge cases, and coordinate with product teams. The role grew significantly in 2025-2026 as agent deployments scaled.

Required experience: 0-2 years. Customer service or CS background helps.

Transferable skills: Customer service skills, systematic thinking, attention to detail, comfort with data.

Skill gaps to close: AI tool monitoring frameworks, basic data analysis, ticketing systems with AI integration, root cause analysis.

Salary range: $50K-$80K base at most companies. Higher at AI-native customer experience companies.

Timeline to pivot: 0-3 months. Junior ops roles are widely available.

Best fits when user shows: Junior CSM or customer service background, interest in systematic improvement work, comfort with metrics.

---

**Path 15: Customer Success Operations Associate (CS Ops) 🟢 Established**

What it looks like day-to-day: Support the operational backbone of CS teams — maintain processes, documentation, internal systems, customer health scoring frameworks, retention reporting. Often the first hire on a CS Ops team or a junior role supporting senior CS Ops leaders.

Why it's more durable than current role: CS Ops as a function is rapidly growing as customer success becomes more data-driven. The role requires both operational thinking and customer empathy — a combination that's hard to automate.

Required experience: 0-2 years. Strong organizational skills required.

Transferable skills: Customer-facing experience, basic analytics, communication skills.

Skill gaps to close: CRM administration (Salesforce, HubSpot), CS platform admin (Gainsight, ChurnZero), basic SQL, dashboards and reporting.

Salary range: $55K-$85K at entry-level. Mid-level CS Ops clears $100K+.

Timeline to pivot: 0-3 months. Widely available at any SaaS company with mature CS function.

Best fits when user shows: Junior CSM or specialist title, organizational/process orientation, comfort with data and systems.

---

### 4.5 Product Manager — 3 new junior paths

**Path 13: AI Product Operations Associate 🟢 Established**

What it looks like day-to-day: Support PM team operations for AI products. Help with roadmap maintenance, OKR tracking, customer feedback synthesis, AI tool admin, cross-functional coordination. Often a stepping stone to APM/PM roles.

Why it's more durable than current role: Product Ops is the operational backbone PMs rely on. As PM work involves more AI tools, product ops associates become essential. The work requires judgment about prioritization and stakeholder management — durable from automation.

Required experience: 0-2 years. Bachelor's degree typical; relevant internship or AI product experience helps.

Transferable skills: Organizational skills, written communication, analytical thinking, comfort with ambiguity.

Skill gaps to close: PM tooling (Linear, Jira, Productboard), basic data analysis, customer feedback frameworks, AI product fundamentals.

Salary range: $80K-$115K base. Higher at AI-native companies.

Timeline to pivot: 0-3 months. Common stepping stone for new grads or career changers.

Best fits when user shows: Associate PM title or aspiring PM, organizational mindset, AI tool fluency.

---

**Path 14: Junior AI Product Manager (Apprentice Track) 🟡 Emerging**

What it looks like day-to-day: First PM hire at an early-stage AI startup, or a junior PM role at a larger company's AI division. Define AI features, work with engineers on LLM integrations, talk to early customers, learn product fundamentals under mentorship.

Why it's more durable than current role: Junior AI PM roles are growing fastest at mid-sized companies (junior PM hires increased by 243% at mid-size companies). The work requires technical curiosity, customer empathy, and judgment about AI capabilities — a combination AI itself can't replicate.

Required experience: 0-2 years. Strong portfolio of personal projects or technical background helps.

Transferable skills: Existing AI tool usage, customer interview skills, basic technical literacy.

Skill gaps to close: PM fundamentals (PRDs, roadmapping, user research), AI product patterns, technical depth on LLMs.

Salary range: $110K-$160K base at established companies. Lower base + meaningful equity at startups.

Timeline to pivot: 0-6 months. Build 1-2 small AI products yourself first to demonstrate capability.

Best fits when user shows: Associate PM with strong AI tool fluency, technical curiosity, willingness to operate without much structure.

---

**Path 15: AI Solutions Associate / Customer Engineer 🟢 Established**

What it looks like day-to-day: Pre-sales and post-sales technical role at AI companies. Work with customers to understand needs, build demos and proofs-of-concept, support sales teams, provide technical input to product. Customer-facing version of product work.

Why it's more durable than current role: AI products require significant customer education and customization. Solutions associates bridge sales, product, and customer success — work that requires relationships and judgment. Entry-level into a high-paid track.

Required experience: 0-2 years. Customer-facing experience and technical aptitude both matter.

Transferable skills: Customer empathy, basic technical aptitude, presentation skills, project coordination.

Skill gaps to close: Sales process literacy, demo-building skills, ROI framing, basic API/integration knowledge.

Salary range: $80K-$130K base + commission. OTE often $120K-$180K at entry-level.

Timeline to pivot: 0-3 months. Junior solutions roles widely available at AI companies.

Best fits when user shows: Associate PM with strong communication skills, comfort with customer-facing work, broad rather than deep technical interest.

---

## Section 5: Updated selection algorithm logic

Update §4.1.7 to handle junior eligibility properly:

```
function selectPivotPaths(userResponses, scores):
  
  candidatePaths = []
  
  // Step 1: Strict eligibility check
  for each path in pivotPathLibrary:
    if path.minSeniority > userResponses.seniority: continue
    if path.maxSeniority < userResponses.seniority: continue
    // ... existing fit scoring
    candidatePaths.append({path, fitScore})
  
  // Step 2: If fewer than 3 strictly eligible paths, do NOT relax eligibility
  // For junior users who are eligible only for junior paths, this means
  // they'll get their 3 best-fit junior paths from the new library.
  
  // Step 3: Apply diversification rule among eligible paths
  // (existing logic — but now applied only to paths the user is actually eligible for)
  
  return top 3 paths
```

The key insight: **never recommend a path the user is not eligible for**, even if it means the diversification rule has fewer paths to work with.

---

## Section 6: Summary of changes Claude Code should make

1. **Add 15 new pivot paths** (3 per role) to the role config files. Content provided in Section 4 of this packet.

2. **Update prompt template 6.9.6** (Progress tracking personalization) to include explicit factor direction notes. New prompt text provided in Section 2 of this packet (Fix 2).

3. **Verify and fix the Week 1 action plan tool reference** to dynamically use a tool the user actually selected.

4. **Update the pivot path selection algorithm** to respect strict eligibility — never recommend a path whose `minSeniority` exceeds the user's seniority. Code update in Section 5.

5. **Spot-check Factor 5 modifier logic** for "Yes, somewhat" structural change (currently appears to be applying a small modifier where spec says 0).

6. **Add industry-match bonus to pivot path fit scoring** — boost paths where the user's industry matches the path's "best fits when user shows" industry signal. Suggested bonus: +20 to fit score.

---

## Section 7: After fixes — recommended testing approach

Once the above changes are deployed:

1. **Re-test Persona 1** (junior IC software engineer) — should now receive junior-eligible pivot paths (Junior AI Engineer, AI Trust & Safety Analyst, AI-Augmented Developer) instead of paths requiring 3+ years.

2. **Test a new Persona 6** (Director of Engineering or VP Engineering) — validate Branch 1 of §5.7 (senior leadership shortcut skipping D2).

3. **Test a Cybersecurity senior IC variant of Persona 2** — verify AI Security Engineer now appears in top 3 paths after industry bonus.

4. **Roll out the same fix pattern to the other 4 roles** as their assessments are built — they'll inherit the corrected selection logic and have junior paths from day one.

---

## Section 8: Spec updates needed

After Claude Code implements these fixes, the spec should be updated to v1.0.2 with:

- §4.1.4 through §4.5.4: Add 3 junior paths per role (15 total paths added)
- §4.1.7: Update selection logic to respect strict eligibility
- §6.9.6: Update Progress tracking prompt with factor direction notes
- §6.7: Clarify that Week 1 action template must use a tool from user's actual selections
- Appendix A: Document decisions A.20-A.25 covering the above changes
- Appendix B: Mark "junior pivot path coverage" as resolved
