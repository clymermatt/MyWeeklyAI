# AI Job Risk Assessment — Product Specification

**Version:** 1.0.1 (Implementation-Ready)
**Last updated:** 2026-05-21

**Changelog:**
- v1.0.1: Resolved spec inconsistency between §3 and §5 — E1 (manager conversations) and E2 (active learning) now explicitly contribute to Factor 5 (Time-to-Impact Urgency) with modest modifier weights. See A.19.
**Owner:** My Weekly AI
**Status:** In active development

---

## How to use this document

This is the complete product specification for the AI Job Risk Assessment tool, a free assessment that scores how exposed a user's job is to AI displacement and recommends pivot paths. The assessment is a lead generation tool for the My Weekly AI newsletter (myweekly.ai) and the foundation for future paid products (pivot playbooks, resume rewrites, etc.).

**Status:** Specification complete. Ready for implementation.

Hand this document to Claude Code (or any AI coding assistant) to implement the tool. Each section is structured to give the AI everything it needs to build without extensive back-and-forth. Open questions and post-launch items are documented in Appendix B.

**Document scope:** This is a single-source specification covering product strategy, scoring methodology, role-specific content, question flow, report generation, landing pages, technical architecture, and integration with the existing newsletter system.

---

## Section 1: Product Overview

### 1.1 What we're building

The **AI Job Risk Assessment** is a free, web-based assessment that takes a user 5-7 minutes to complete. Based on their role, work patterns, and environment, it produces:

1. A composite **AI Disruption Score** (0-100) with a risk tier classification
2. A factor-by-factor breakdown showing which dimensions drive their risk
3. A task-by-task analysis showing what's at risk in their day-to-day work
4. Three personalized pivot path recommendations
5. A 30-day action plan
6. A downloadable PDF version of the full report

The assessment is delivered as a new section of the existing myweekly.ai application, living at `/ai-job-risk/[role]`.

### 1.2 Why we're building it

**Strategic context:** My Weekly AI is currently positioned as a personalized AI newsletter for professionals who want to stay informed. The product line we're building (assessments, pivot playbooks, etc.) targets a related but distinct audience: professionals worried about AI displacement.

The assessment serves three purposes:

1. **Lead generation** — Capture high-intent traffic from "will AI replace [job title]" searches
2. **Audience signal** — Learn which roles and industries are most worried, to guide future product development
3. **Trust building** — A genuinely useful free product earns the right to sell paid products later

### 1.3 Target user

The primary user is a working professional who has searched something like "will AI replace [their job title]" or has clicked through from the newsletter or external content. They are:

- Mid-career (typically 5-20 years of experience)
- Earning a professional salary ($60K-$300K range)
- Actively worried about AI impact on their career
- Willing to invest 5-7 minutes for personalized insight
- Comfortable with email signup for valuable content

### 1.4 Success criteria

**MVP launch (90 days):**
- 3 role assessments live (Software Engineers, Marketing Managers, one non-tech role TBD)
- Conversion rate of assessment-takers to newsletter subscribers: target 70%+
- Average time to complete: under 7 minutes
- Visual completion rate (start to finish): target 65%+

**Year 1:**
- 10-15 role assessments live
- 5,000+ completed assessments
- 3,500+ resulting newsletter subscribers from assessment funnel
- Validated direction for at least one paid product

### 1.5 The user journey end-to-end

The assessment flow and the newsletter signup flow are unified into a single user journey. See Section 11 for full integration details.

```
1. Discovery
   User searches "will AI replace [job title]" or clicks through from newsletter/social
   ↓
2. Landing page
   Role-specific landing page at /ai-job-risk/[role]
   Clear value prop, CTA: "Start Assessment"
   ↓
3. Assessment (5-7 min, 18-22 questions in 5 sections)
   Section A: About you (role, industry, experience)
   Section B: Your actual work (task time distribution)
   Section C: Your environment (employer adoption, tools, team changes)
   Section D: Your differentiation (expertise, stakes, relationships, novelty)
   Section E: Forward-looking signals (manager conversations, learning behavior)
   ↓
4. Teaser result + auth gate
   User sees their score and tier on screen
   Auth gate offers TWO options (matching existing /auth/signin):
     - "Continue with Google" (OAuth)
     - "Email me my report" (Magic link via email)
   Bundled value prop: full report + free weekly newsletter for their role
   ↓
5. Full report shown immediately
   On-screen: complete 7-section report (no waiting for email)
   Background: subscriber record created/updated, newsletter profile pre-populated
                from assessment data, welcome email sent
   ↓
6. Email delivery
   Email contains: 
     - PDF version of report (for saving/sharing)
     - Magic link to access dashboard (auto-authenticates magic link users)
     - First newsletter info
   Google OAuth users are already authenticated; their email is informational
   ↓
7. Dashboard access (existing infrastructure, enhanced)
   New "Your AI Job Risk Profile" section showing score, tier, and report link
   Newsletter profile pre-filled from assessment
   First Sunday brief scheduled
   ↓
8. Ongoing
   Sunday newsletter (existing infrastructure)
   Periodic prompts to retake assessment (6-month cadence)
   Future: paid product offers based on score and role
```

---

## Section 2: Information Architecture

### 2.1 URL structure

Assessment pages live in a dedicated top-level directory, parallel to the existing `/for/` directory used for newsletter SEO pages.

```
myweekly.ai/                                  → Homepage (newsletter funnel)
myweekly.ai/about                             → About page
myweekly.ai/for/                              → Newsletter SEO pages (existing)
  /for/software-engineers
  /for/marketing-managers
  /for/[industry]
  ...
myweekly.ai/ai-job-risk/                      → Assessment hub page
  /ai-job-risk/software-engineers             → Software Engineer assessment landing
  /ai-job-risk/marketing-managers             → Marketing Manager assessment landing
  /ai-job-risk/paralegals                     → Paralegal assessment landing (TBD third role)
  ...
  /ai-job-risk/[role]/quiz                    → Active quiz interface
  /ai-job-risk/[role]/results?id=[unique-id]  → Results page
```

### 2.2 Page-by-page flow

**Hub page (`/ai-job-risk/`):**
- Catches generic "AI job risk assessment" searches
- Lists all available role assessments
- Internal linking hub strengthening SEO of individual role pages

**Role landing pages (`/ai-job-risk/[role]`):**
- One per role
- Role-specific copy, examples, social proof
- Single primary CTA: "Start Assessment"
- SEO target: "will AI replace [role]" and related queries

**Quiz interface (`/ai-job-risk/[role]/quiz`):**
- Multi-step form with progress indicator
- Conditional logic between questions
- Mobile-optimized (significant share of traffic will be mobile)
- Save progress if user abandons mid-quiz (cookie/local storage)

**Results page (`/ai-job-risk/[role]/results?id=[unique-id]`):**
- Unique URL per result for shareability
- Email gate after teaser
- Full report on-screen after email submission
- Social sharing options

### 2.3 Cross-linking with existing site

**On each existing `/for/[role]` page**, add a section near the bottom:

> *Worried AI is coming for your role? Take our 5-minute AI Job Risk Assessment for [role] and see exactly which of your tasks are most exposed.*
> [→ Take the Assessment]

**On each assessment page**, the welcome email and confirmation flow includes:

> *Your score is a snapshot of today. The landscape changes weekly. Get our personalized AI brief for [role] — free, every Sunday.*
> [→ Already subscribed via the assessment]

Each role's assessment page should link to that role's newsletter landing page in a "Related: weekly AI news for [role] →" footer link.

### 2.4 Industry treatment

Industry pages (`/for/[industry]`) **remain as-is** for newsletter SEO. They do not get dedicated assessment pages because industries don't have careers — roles do.

Industry information is captured **inside the assessment** as a filter that customizes scoring (industry multipliers for adoption velocity) and recommendations.

Each industry page should include a section linking to relevant role assessments:

> *Are you a [common role] in [industry]? Take your role's AI Job Risk Assessment →*

---

## Section 3: The Assessment Engine (Scoring Model)

### 3.1 Composite score formula

The headline AI Disruption Score (0-100) is a weighted composite of five factor scores, each on a 0-100 scale.

```
AI_Disruption_Score = 
    (Task_Automatability × 0.40) +
    (Adoption_Velocity × 0.20) +
    (Skill_Differentiation_Inverse × 0.20) +
    (Career_Portability_Inverse × 0.10) +
    (Time_To_Impact_Urgency × 0.10)
```

**Note:** Skill Differentiation and Career Portability are inverted before being added to the composite. High differentiation and high portability *reduce* risk, so we compute them as `(100 - raw_score)` for the composite.

### 3.2 Risk tier classification

The final composite score maps to one of five risk tiers:

| Score Range | Tier | Description |
|-------------|------|-------------|
| 0-25 | **Low Risk** | Role is largely AI-resistant in current and near-term form |
| 26-45 | **Moderate Risk** | Some tasks will be augmented or automated; role evolves but persists |
| 46-65 | **Moderate-High Risk** | Significant transformation likely; proactive pivoting recommended |
| 66-85 | **High Risk** | Major displacement pressure within 3-5 years; pivot planning is urgent |
| 86-100 | **Severe Risk** | Role-level disruption likely within 1-3 years; immediate action warranted |

### 3.3 Factor 1: Task Automatability (40% weight)

**What it measures:** What percentage of the user's time goes to tasks that current or near-term AI can perform competently.

**Calculation:**

```
Task_Automatability = Σ (Task_Time_Percent × Task_Automatability_Rating) / Σ Task_Time_Percent
```

Each role has a **task library** of 10-12 tasks. Each task has a pre-assigned Automatability Rating (AR, 0-100) representing current AI capability plus realistic 24-month trajectory. The user reports what % of their week goes to each task category.

**Edge case:** If user-reported time percentages don't sum to 100%, normalize by dividing each value by the total sum.

**The full Software Engineer task library is in Section 4.1.**

### 3.4 Factor 2: Adoption Velocity (20% weight)

**What it measures:** How fast displacement is actually happening in the user's specific employer, team, and industry.

**Calculation:**

Four input questions, each scored 0-100, averaged, then adjusted by industry multiplier.

**Question A: Employer AI adoption posture**
- Mandated with tracked usage: 100
- Encouraged and provided: 75
- Allowed but not provided: 50
- Discouraged or restricted: 25
- Don't know: 50

**Question B: AI tools currently used by user (count)**
- 4+ tools: 100
- 3 tools: 75
- 2 tools: 50
- 1 tool: 30
- None: 10

**Important:** The list of selectable tools in the assessment must match the 18 preset tools in the existing newsletter profile (see Section 11.3.3). This enables direct mapping of tool selection to the profile and provides more accurate Adoption Velocity scoring by capturing breadth across creative, infrastructure, and developer tools.

The 18 tools are: ChatGPT, Claude, Gemini, Copilot, Cursor, Midjourney, DALL-E, Stable Diffusion, Notion AI, Jasper, Perplexity, Replit, Hugging Face, LangChain, Vercel AI SDK, AWS Bedrock, Azure OpenAI, Google Vertex AI. Plus "None" and "Other" (custom text entry).

**Question C: Team headcount change in last 12 months**
- Significant reduction: 100
- Some attrition not replaced: 75
- Flat: 50
- Some hiring: 25
- Significant hiring: 10

**Question D: Structural change due to AI in last 6 months**
- Yes significantly: 100
- Yes somewhat: 70
- No: 30
- Don't know: 50

```
Adoption_Velocity_Raw = (A + B + C + D) / 4
Adoption_Velocity = min(100, Adoption_Velocity_Raw × Industry_Multiplier)
```

**Industry multipliers:**

| Industry | Multiplier |
|----------|------------|
| SaaS / Software | 1.20 |
| Media / Entertainment | 1.20 |
| Marketing / Advertising | 1.20 |
| Fintech / Financial Services | 1.15 |
| Consulting / Professional Services | 1.15 |
| Legal / LegalTech | 1.10 |
| E-commerce / Retail | 1.05 |
| Education / EdTech | 1.00 |
| Cybersecurity | 1.00 |
| Real Estate / PropTech | 1.00 |
| Gaming | 1.00 |
| Telecommunications | 0.95 |
| Manufacturing / Industrial | 0.90 |
| Transportation / Logistics | 0.90 |
| Healthcare / Life Sciences | 0.85 |
| Energy / CleanTech | 0.85 |
| Nonprofit / Social Impact | 0.80 |
| Government / Public Sector | 0.70 |

### 3.5 Factor 3: Skill Differentiation (20% weight, inverted)

**What it measures:** How much of the user's value comes from work that's hard for AI — judgment, relationships, novel problems, regulated decisions.

**Calculation:**

Four self-report questions with anchor descriptions to reduce inflation.

**Question A: Domain expertise depth**
- Most of my value, sought out specifically: 100
- Significant, one of few who knows this: 75
- Some, others could learn: 40
- Little, my work is general-purpose: 15

**Question B: Decision consequence stakes**
- Constantly high-stakes decisions: 100
- Regularly: 75
- Sometimes: 40
- Rarely: 15

**Question C: Relationship/trust dependence**
- Relationships are core to effectiveness: 100
- Important: 70
- Somewhat important: 40
- Not really relevant: 15

**Question D: Novel problem frequency**
- Most work involves novel problems: 100
- Frequently: 75
- Occasionally: 40
- Rarely, I adapt existing patterns: 15

```
Skill_Differentiation_Raw = (A + B + C + D) / 4
if all four are max (100): Skill_Differentiation_Raw = Skill_Differentiation_Raw × 0.85  # compression to prevent gaming
Skill_Differentiation_Inverse = 100 - Skill_Differentiation_Raw
```

### 3.6 Factor 4: Career Capital Portability (10% weight, inverted)

**What it measures:** If the user's current role contracts, how easily can they pivot to adjacent durable roles?

**Calculation:**

Three inputs: two from user, one derived from role configuration.

**Question A: Years of experience in role**
- 16+: 100
- 11-15: 85
- 6-10: 70
- 3-5: 50
- 0-2: 30

**Question B: Specialization durability** (derived from Skill Differentiation Question A combined with role config)
- Deep specialist in durable area (per role config): 100
- Some specialization in durable area: 70
- Generalist: 50
- Specialist in commoditizing area: 25

**Derived input C: Pivot path availability** (set per role in role config)
- High (8+ viable pivot paths): 85-100
- Medium (4-7 viable paths): 60-84
- Low (1-3 viable paths): 30-59

```
Career_Portability_Raw = (A × 0.4) + (B × 0.4) + (C × 0.2)
Career_Portability_Inverse = 100 - Career_Portability_Raw
```

### 3.7 Factor 5: Time-to-Impact Urgency (10% weight)

**What it measures:** How quickly major displacement is likely to affect this specific user's situation.

**Calculation:**

Base urgency by role and seniority, modified by user-specific signals.

**Base urgency by role and seniority** (per role config). Example for Software Engineers:
- Junior engineer / boilerplate work: 80 (1-2 years to major impact)
- Mid-level general engineering: 65 (2-3 years)
- Senior IC general: 50 (3-5 years)
- Specialized senior IC: 35 (5-7 years)
- Engineering management: 25 (7+ years)

**Modifiers based on user input:**
- Adoption Velocity > 70: +15
- Adoption Velocity 50-70: +5
- Adoption Velocity < 30: -5
- Structural change already observed (Q2D = Yes significantly): +10
- Tool fluency low (Q2B = 0-1 tools): +10
- High differentiation (Q3 raw > 75): -10
- Very high differentiation (Q3 raw > 90): -15
- Manager conversations (E1) = "Yes, substantially": +8
- Manager conversations (E1) = "Yes, briefly": +3
- Manager conversations (E1) = "No": 0
- Active learning (E2) = "Yes, regularly": -7
- Active learning (E2) = "Occasionally": -2
- Active learning (E2) = "No": +3

**Rationale for E1 and E2 modifiers:**
The existing modifiers measure current state (employer adoption, tool count, differentiation). E1 and E2 add trajectory awareness — is change being discussed, and are you preparing? Both are genuine signals not captured elsewhere, but they're self-reports that may be subject to bias, so weights are deliberately modest.

The combined max modifier from E1 + E2 ranges from +11 (worst case: imminent change conversations, not learning) to -7 (best case: no manager warnings, actively learning). This is meaningful but does not dominate the established modifiers.

```
Time_To_Impact_Urgency = clamp(0, 100, Base_Urgency + Modifiers)
```

### 3.8 Edge case handling

**Inconsistent task time responses:**
If the user reports 0% for all but one task, or distributes time in an obviously implausible way, flag the result with a note: "Your responses suggest your week might be split across tasks we don't ask about. Consider retaking with more thought to time allocation."

**Time totaling over 100%:**
Normalize by dividing each value by the total sum.

**Extreme self-rating on differentiation:**
If all four Skill Differentiation questions are rated maximum, apply 15% compression to prevent score gaming.

**Senior executive outliers:**
For users selecting "CEO / Founder" role with 16+ years experience, use a separate executive variant of the scoring. [TBD — defer to phase 2]

**Career changers:**
Add optional question: "Total years of professional experience across all roles?" — use this for portability calculation if it differs significantly from current role tenure.

### 3.9 Scoring algorithm pseudocode

```
function calculateAIDisruptionScore(userResponses, roleConfig):
  
  // Normalize task time to 100%
  totalTaskTime = sum(userResponses.taskTimes)
  normalizedTaskTimes = userResponses.taskTimes / totalTaskTime * 100
  
  // Factor 1: Task Automatability
  taskAutomatability = 0
  for each task in normalizedTaskTimes:
    taskRating = roleConfig.taskLibrary[task.name].automatabilityRating
    taskAutomatability += task.timePercent × taskRating
  taskAutomatability = taskAutomatability / 100
  
  // Factor 2: Adoption Velocity
  adoptionRaw = (
    employerAdoptionPoints(userResponses.employerAdoption) +
    toolUsagePoints(userResponses.toolCount) +
    headcountPoints(userResponses.headcountChange) +
    structuralChangePoints(userResponses.structuralChange)
  ) / 4
  industryMult = INDUSTRY_MULTIPLIERS[userResponses.industry] || 1.0
  adoptionVelocity = min(100, adoptionRaw * industryMult)
  
  // Factor 3: Skill Differentiation (raw, then inverted)
  skillDiffRaw = (
    domainExpertisePoints(userResponses.domainExpertise) +
    stakesPoints(userResponses.decisionStakes) +
    relationshipPoints(userResponses.relationshipImportance) +
    noveltyPoints(userResponses.novelProblems)
  ) / 4
  
  // Compression for extreme self-rating
  if all four inputs == max value:
    skillDiffRaw = skillDiffRaw * 0.85
  
  skillDiffInverse = 100 - skillDiffRaw
  
  // Factor 4: Career Portability (raw, then inverted)
  portabilityRaw = (
    experiencePoints(userResponses.yearsExperience) * 0.4 +
    specializationDurabilityPoints(userResponses.domainExpertise, roleConfig.durableSpecializations) * 0.4 +
    roleConfig.pivotPathAvailability * 0.2
  )
  portabilityInverse = 100 - portabilityRaw
  
  // Factor 5: Time-to-Impact Urgency
  baseUrgency = roleConfig.baseUrgencyByLevel[userResponses.seniorityLevel]
  modifiers = 0
  
  // Existing modifiers
  if adoptionVelocity > 70: modifiers += 15
  else if adoptionVelocity > 50: modifiers += 5
  else if adoptionVelocity < 30: modifiers -= 5
  if userResponses.structuralChange == "Yes significantly": modifiers += 10
  if userResponses.toolCount <= 1: modifiers += 10
  if skillDiffRaw > 90: modifiers -= 15
  else if skillDiffRaw > 75: modifiers -= 10
  
  // E1 modifier: Manager conversations about AI
  if userResponses.managerConversations == "Yes, substantially": modifiers += 8
  else if userResponses.managerConversations == "Yes, briefly": modifiers += 3
  // else "No" → +0
  
  // E2 modifier: Active learning outside of work
  if userResponses.activeLearning == "Yes, regularly": modifiers -= 7
  else if userResponses.activeLearning == "Occasionally": modifiers -= 2
  else if userResponses.activeLearning == "No": modifiers += 3
  
  timeToImpact = clamp(0, 100, baseUrgency + modifiers)
  
  // Composite
  composite = (
    taskAutomatability * 0.40 +
    adoptionVelocity * 0.20 +
    skillDiffInverse * 0.20 +
    portabilityInverse * 0.10 +
    timeToImpact * 0.10
  )
  
  // Determine tier
  tier = determineTier(composite)
  
  // Select top 3 pivot paths
  topPaths = selectPivotPaths(
    roleConfig.pivotPathLibrary,
    userResponses,
    {taskAutomatability, adoptionVelocity, skillDiffRaw, portabilityRaw}
  )
  
  return {
    compositeScore: round(composite),
    tier: tier,
    factorBreakdown: {
      taskAutomatability: round(taskAutomatability),
      adoptionVelocity: round(adoptionVelocity),
      skillDifferentiation: round(skillDiffRaw),
      careerPortability: round(portabilityRaw),
      timeToImpactUrgency: round(timeToImpact)
    },
    topPivotPaths: topPaths,
    rawInputs: userResponses  // for report generation
  }
```

---

## Section 4: Role-Specific Content Libraries

### 4.1 Software Engineers

**Status:** Complete (v1). Task library, pivot path library, base urgency, durable specializations, and selection logic all populated. Subject to ongoing audit (see 4.1.3 and 4.1.8).

#### 4.1.1 Task library

The Software Engineer task library has 12 tasks. The user reports what percentage of their typical week goes to each task (using ranges: None, 0-10%, 10-25%, 25-50%, 50%+). The midpoint of each range is used for calculation. The weighted average of task time × automatability rating produces the Task Automatability score (Factor 1, 40% of composite).

**Initial automatability ratings (Q2 2026):**

| # | Task | AR | Tier |
|---|------|-----|------|
| 1 | Writing new feature code from clear specifications | 85 | High |
| 2 | Writing tests | 90 | High |
| 3 | Debugging routine bugs | 75 | High |
| 4 | Debugging novel or complex production issues | 35 | Moderate-Low |
| 5 | Refactoring or migrating legacy code | 80 | High |
| 6 | Code review | 55 | Moderate |
| 7 | System design and architecture decisions | 35 | Moderate-Low |
| 8 | Reading documentation and learning new tools | 70 | Moderate-High |
| 9 | Cross-functional collaboration (PM, design, business) | 15 | Low |
| 10 | Mentoring junior engineers | 10 | Low |
| 11 | On-call and incident response | 30 | Moderate-Low |
| 12 | Research and technical prototyping | 50 | Moderate |

**Detailed reasoning per task (for quarterly review and report content generation):**

**Task 1: Writing new feature code from clear specifications (AR: 85)**
- Among the most automated work in software engineering today. With clear specs and tools like Cursor, Claude Code, GitHub Copilot, and Devin, AI handles routine feature implementation competently
- The bottleneck is increasingly spec quality, not coding speed
- 18-month trajectory: AR likely climbs to 90+ as agents improve at multi-file changes and dependency reasoning
- What's left for humans: Ambiguous requirements, novel patterns, integration with messy existing code, judgment about when the spec is wrong

**Task 2: Writing tests (AR: 90)**
- Among the most automated coding tasks today
- AI excels at writing unit tests for existing code, generating edge cases, producing integration test scaffolding
- Highly pattern-driven work that benefits from AI's pattern recognition
- 18-month trajectory: AR pushes 95 as test generation gets better at property-based and end-to-end tests
- What's left for humans: Deciding *what* to test (test strategy), evaluating test value vs maintenance cost, designing tests for novel behaviors

**Task 3: Debugging routine bugs (AR: 75)**
- Common bugs (null references, off-by-one, type mismatches, common library misuse) handled well by AI today
- Tools can read stack traces, suggest fixes, even apply them
- 18-month trajectory: improving steadily as AI gets better at reasoning across larger codebases
- What's left for humans: Bugs spanning multiple systems, bugs caused by misunderstood requirements, bugs requiring deep system knowledge

**Task 4: Debugging novel or complex production issues (AR: 35)**
- Meaningfully different from routine debugging
- Production incidents often involve interactions between systems, data states that don't reproduce locally, patterns nobody has seen before
- AI can assist with hypothesis generation and log analysis, but judgment work of diagnosing novel issues remains human
- 18-month trajectory: improves but slowly — gated by access to runtime context, not AI capability
- What's left for humans: Pattern matching against organizational history, decisions under uncertainty, coordination with humans during incidents

**Task 5: Refactoring or migrating legacy code (AR: 80)**
- Mechanical refactoring (renaming, extracting functions, modernizing syntax, framework migrations) well-suited to AI
- Clear patterns and benefits from AI's ability to make consistent changes across many files
- 18-month trajectory: pushes higher as AI gets better at large-scale codebase comprehension
- What's left for humans: Decisions about *what* to refactor, evaluating risk of refactoring, refactoring that requires understanding business intent

**Task 6: Code review (AR: 55)**
- Split task. Surface-level review (style, common bugs, security patterns, test coverage) largely automated by tools like CodeRabbit, GitHub's AI review features
- Deep review (architectural fit, business logic correctness, judgment about future maintainability) remains human
- Most engineers do both, so average AR is moderate
- 18-month trajectory: AR climbs as AI gets better at architectural reasoning
- What's left for humans: Architectural judgment, mentorship through code review, evaluating tradeoffs that depend on business context

**Task 7: System design and architecture decisions (AR: 35)**
- AI can suggest patterns, identify tradeoffs, produce candidate designs
- Final architectural decisions require understanding business context, organizational reality, team capabilities, long-term constraints not in any codebase
- Some of the most defensible work in software engineering
- 18-month trajectory: improves modestly as AI gets better at context-aware design
- What's left for humans: Most of it. AI is an assistant, not a decision-maker, in this domain

**Task 8: Reading documentation and learning new tools (AR: 70)**
- Genuinely transformed by AI. Engineers used to spend hours reading docs and searching Stack Overflow; now they ask Claude or ChatGPT and get tailored explanations in minutes
- One of the strongest "AI as augmentation" stories in software work
- 18-month trajectory: continues to improve
- What's left for humans: Evaluating whether explanations are correct, developing deep expertise (vs surface knowledge), making judgment calls about which tools to learn
- **Nuance:** High AR here doesn't necessarily mean displacement — it means efficiency gain. But efficiency gains also mean fewer engineers needed for the same work, contributing to displacement risk indirectly

**Task 9: Cross-functional collaboration (PM, design, business) (AR: 15)**
- Among the most AI-resistant work in software engineering
- Meetings, async communication, negotiating priorities, explaining technical constraints to non-technical stakeholders, building trust — all depend on human relationships and judgment
- AI can assist (summarizing meetings, drafting messages) but doesn't replace the work
- 18-month trajectory: stays low
- What's left for humans: Almost all of it. Durable work

**Task 10: Mentoring junior engineers (AR: 10)**
- Depends on trust, judgment about a specific person's growth, modeling professional behavior, emotional intelligence
- AI can supplement (code review feedback, technical tutoring) but doesn't replace the human relationship
- Among the most durable engineering work
- 18-month trajectory: stays low
- What's left for humans: All of it. Also work that often determines career advancement toward management

**Task 11: On-call and incident response (AR: 30)**
- Modern incident response involves AI for log analysis, anomaly detection, runbook execution
- Human judgment work (deciding severity, coordinating response, making tradeoffs under pressure, communicating with stakeholders during incidents) remains
- 18-month trajectory: improves as AI gets better at autonomous remediation for known incident types
- What's left for humans: Novel incidents, severity judgment, organizational communication, decisions requiring business context

**Task 12: Research and technical prototyping (AR: 50)**
- Research-oriented work (evaluating new technologies, building prototypes to test ideas, comparing approaches) sits in the middle
- AI accelerates work significantly (faster prototyping, easier exploration of unfamiliar tools) but human judgment about what to research and how to interpret results remains
- 18-month trajectory: rises as AI gets better at scientific reasoning
- What's left for humans: Choosing what to research, designing experiments, interpreting results in context

#### 4.1.2 Calibration validation

The task library produces the following composite Task Automatability scores for typical engineering personas (validation that scoring matches intuition):

| Persona | Typical task distribution | Task Automatability | Expected tier |
|---|---|---|---|
| Junior engineer | Heavy on tasks 1, 2, 3, 5, 8 | 75-80 | High Risk |
| Mid-level engineer | Mix across most tasks | 60-65 | Moderate-High |
| Senior engineer (system design focus) | Heavy on 7, 9, 10 | 40-50 | Moderate |
| Engineering manager | Heavy on 9, 10, 12 + some 6 and 7 | 25-35 | Low to Moderate |

This calibration matches the underlying reality: junior coding work is most exposed, senior judgment work is more durable, management is most durable.

#### 4.1.3 Quarterly review process

AI capability changes faster than most software cycles. The task library MUST be reviewed quarterly to maintain accuracy. Without updates, the assessment becomes outdated and loses credibility.

**Quarterly review checklist:**

1. For each task, ask: "Has AI capability for this task meaningfully changed in the last 90 days?"
2. Sources to consult:
   - Recent newsletter content (My Weekly AI tracks this naturally)
   - Major model releases (Anthropic, OpenAI, Google)
   - New coding tools or significant updates (Cursor, Devin, GitHub Copilot, etc.)
   - Published benchmarks (SWE-bench, HumanEval, etc.)
3. If a task's AR has changed by 5+ points, update the rating
4. If a task should be split into sub-tasks (e.g., "Code review" splitting into "AI-assisted review" and "Architectural review"), note for next major version
5. Document each change in the spec with: date, old AR, new AR, reasoning

**Quarterly review owner:** [Operator — typically the newsletter author who tracks AI capability]

**First scheduled review:** 90 days after MVP launch

**Update history:** [Log changes here as reviews happen]
- 2026-05-20: Initial library created at Q2 2026 capability baseline

#### 4.1.4 Pivot path library

The pivot path library contains 12 pivot paths. The algorithm selects the top 3 for each user based on their assessment responses (see 4.1.7 for selection logic).

**Provenance labels:**
- 🟢 **Established** — well-defined in the market, salary data is reliable, hiring is broad
- 🟡 **Emerging** — exists but role definitions still solidifying; high growth but variance
- 🟠 **Forecast** — anticipated growth area, less defined currently

**Salary data note:** All ranges reflect US market data from Q1-Q2 2026 based on Levels.fyi, Glassdoor, MRJ Recruitment, KORE1, and Second Talent reports. Ranges represent base salary unless marked as total comp (TC). Senior/Staff levels at frontier AI labs (OpenAI, Anthropic, Google DeepMind) can significantly exceed these ranges. See 4.1.8 for 6-month audit process.

---

**Path 1: AI Engineer (LLM-focused) 🟢**

What it looks like day-to-day: Build production features powered by LLMs. Integrate APIs from Anthropic, OpenAI, Google. Design RAG pipelines, prompt systems, evaluation frameworks. Ship customer-facing AI features in standard application contexts.

Why it's more durable than current role: AI engineering work is *amplified* by AI tools, not replaced by them. The bottleneck is judgment about what to build with AI and how to make it production-grade — work that requires human engineering taste.

Required experience level: Mid-level or above (3+ years). Junior engineers face stiff competition.

Transferable skills from software engineering: Backend/API development, system design, production engineering judgment, debugging skills.

Skill gaps to close: LLM API patterns (function calling, streaming, structured outputs), RAG architectures, vector databases, evaluation frameworks, prompt engineering as discipline (not vibe-prompting), cost/latency optimization for inference.

Salary range: $145K-$310K base. Mid-level $155K-$200K typical. Senior $200K-$280K+ common. Total comp pushes $400K+ at top companies with equity.

Timeline to pivot: 3-6 months of focused learning while in current role. Pivot in next job change.

Best fits when user shows: Strong backend/API experience, comfort with messy production systems, has used at least 2-3 AI tools heavily already.

---

**Path 2: ML/AI Platform Engineer (MLOps) 🟢**

What it looks like day-to-day: Build and maintain the platforms that serve ML models in production. Data pipelines, model serving infrastructure, observability, evaluation harnesses, cost monitoring. Critical role at any company running ML at scale.

Why it's more durable than current role: ML platform work is severely supply-constrained. Companies report 11+ weeks to fill senior MLOps roles. The work requires both deep systems engineering and ML lifecycle understanding — a combination that AI can't easily replicate.

Required experience level: Mid-to-senior (5+ years), with strong infrastructure or backend background.

Transferable skills from software engineering: Distributed systems, Kubernetes/containers, CI/CD, observability/monitoring, cloud infrastructure (AWS/GCP/Azure).

Skill gaps to close: ML lifecycle (training → serving), model serving frameworks (Triton, vLLM, TGI), feature stores, ML-specific observability (drift detection, eval pipelines), vector databases.

Salary range: $130K-$257K base. Senior MLOps at top companies clears $250K. SF/NYC commands premium ($215K median total comp). Kubernetes + Terraform + ML deployment combo commands highest premium.

Timeline to pivot: 6-12 months focused learning while in current role. DevOps/SRE backgrounds can pivot faster (2-3 months).

Best fits when user shows: Distributed systems background, on-call/incident response experience, comfort with infrastructure tools, interest in operating production systems.

---

**Path 3: Forward Deployed Engineer 🟡**

What it looks like day-to-day: Embed with enterprise customers to deploy AI solutions in their environments. Customize, integrate, and ship AI applications that solve real business problems. Heavy customer-facing work combined with deep technical implementation.

Why it's more durable than current role: One of the fastest-growing roles in tech — job postings grew 800%+ YoY through 2026. Combines technical depth with customer-facing skills that AI cannot replicate. OpenAI, Anthropic, Google, and Palantir are all aggressively hiring.

Required experience level: Senior IC (6+ years). Requires both technical depth and communication skills.

Transferable skills from software engineering: Full-stack development, system design, working across multiple languages/frameworks, comfort with ambiguous requirements.

Skill gaps to close: LLM-specific patterns, agent frameworks (LangGraph, CrewAI, DSPy), evaluation engineering, customer-facing communication, comfort with travel (up to 50% in some roles).

Salary range: $180K-$700K total comp (highest variance of any role). $150K-$250K base typical at mid-level. Staff-level at frontier labs (OpenAI, Anthropic) regularly clears $500K+ total comp.

Timeline to pivot: 6-12 months. Production engineering experience + customer-facing work history accelerates this significantly.

Best fits when user shows: Strong communication scores in differentiation section, willingness to work with stakeholders, broad rather than deep technical skill, comfort with ambiguity.

---

**Path 4: Engineering Manager / Tech Lead 🟢**

What it looks like day-to-day: Lead a team of engineers. Hiring, coaching, technical strategy, organizational navigation, cross-functional work. Increasingly: deciding which AI tools your team adopts, how to evaluate them, and how to evolve team practices.

Why it's more durable than current role: Engineering management is among the most AI-resistant tech work. The premium for AI/ML skills is lower at management level (only 3% per Ravio 2026) precisely because the work is inherently human. Most coding work being automated *increases* the leverage of those who decide what to build and lead the people building it.

Required experience level: Senior IC level (6-10+ years) with mentorship and informal leadership history.

Transferable skills from software engineering: Code review, mentorship, architectural thinking, cross-functional collaboration experience.

Skill gaps to close: People management fundamentals (hiring, performance reviews, difficult conversations), organizational politics, budgeting, AI tool evaluation at team level.

Salary range: $350K-$550K total comp at major tech companies. $200K-$300K base + equity at growth-stage startups. AI-skilled engineering managers retain a premium.

Timeline to pivot: 12-24 months. Look for Tech Lead opportunities now as stepping stone. Internal moves are easier than external.

Best fits when user shows: Significant mentoring time (Task 10 > 10%), strong relationship importance scores, prior informal leadership history, age 30+ typical.

---

**Path 5: Founding Engineer at AI-Native Startup 🟡**

What it looks like day-to-day: Be one of the first 1-5 engineers at an early-stage AI company. Build product from scratch, wear many hats, make architectural decisions that shape the company. Equity upside is the primary compensation play.

Why it's more durable than current role: Founding engineers shape the product before it exists. AI accelerates execution but doesn't replace the judgment of what to build, for whom, and how. Equity at AI-native startups in 2024-2026 has produced significant outcomes.

Required experience level: Senior IC (6+ years). Founders want someone who can ship without supervision.

Transferable skills from software engineering: Generalist breadth, ability to ship MVPs quickly, comfort with ambiguity, willingness to do unsexy work.

Skill gaps to close: Comfort with foundational decisions (no roadmap, no playbook), modern AI APIs, willingness to be on-call constantly, business/product instincts.

Salary range: $132K-$392K base. Median around $200K-$250K base + 0.5-2% equity at seed/Series A. Equity is the real upside.

Timeline to pivot: Can pivot in next job change. Typically requires network, not credentials. Engineering managers and Staff ICs at larger companies are common hires.

Best fits when user shows: Generalist skill profile, low risk aversion (inferred from open-text responses or career history), willingness to work intensely, prior startup experience or strong personal projects.

---

**Path 6: AI/Agent Operations Engineer 🟡**

What it looks like day-to-day: Run the infrastructure under deployed agent systems. Model versioning, prompt deployment pipelines, evaluation cadence, incident response when an agent does something dumb in production. "DevOps for AI agents."

Why it's more durable than current role: Most companies that shipped agent systems in 2024-2025 are realizing they need someone whose actual job is keeping them running. This role barely existed 2 years ago and is now in high demand.

Required experience level: Mid-to-senior (4-8 years). SRE/DevOps backgrounds are natural fits.

Transferable skills from software engineering: SRE practices, incident management, on-call experience, comfort with debugging production issues, observability tools.

Skill gaps to close: LLM API patterns, eval pipelines, cost monitoring for inference, agent framework familiarity, prompt versioning systems.

Salary range: $155K-$275K. Hot demand because supply is severely constrained.

Timeline to pivot: 2-3 months for SRE/DevOps engineers. 4-6 months for backend engineers with on-call experience.

Best fits when user shows: On-call/incident response time (Task 11), infrastructure background, debugging novel issues skill (Task 4 high), interest in operating systems vs building features.

---

**Path 7: AI Evaluation & Testing Engineer 🟡**

What it looks like day-to-day: Build evaluation systems for AI products. Design eval sets, write rubrics, run regression testing against model updates, catch hallucinations before production. The "QA engineering" for AI systems.

Why it's more durable than current role: As AI is deployed in more contexts, evaluation becomes the bottleneck. This work requires domain knowledge + ML literacy + systems engineering — a rare combination that AI itself doesn't yet do well.

Required experience level: Mid-level (3+ years). QA engineers, test engineers, and ML engineers all pivot into this.

Transferable skills from software engineering: Testing skills, systematic thinking, comfort with statistics, debugging skills.

Skill gaps to close: ML evaluation frameworks (e.g., DSPy, Inspect, LangSmith), human evaluation methodology, eval set design, regression testing for non-deterministic systems.

Salary range: $130K-$220K base. Higher at frontier labs and consumer AI products.

Timeline to pivot: 3-6 months. Test engineers and QA leads have shortest path.

Best fits when user shows: Strong testing background (Task 2 high), debugging skills (Task 3, 4), systematic thinking, interest in correctness/quality over building features.

---

**Path 8: Solutions Engineer / Sales Engineer at AI Company 🟢**

What it looks like day-to-day: Pre-sales technical work for AI products. Demo capabilities to prospects, build proof-of-concepts, work with sales to close deals, partner with product to feedback customer needs. Heavy communication and customer work, less coding.

Why it's more durable than current role: Pre-sales technical work depends on relationships, judgment, and adapting to customer context — all areas where AI augments but doesn't replace humans. Solutions engineers are in chronic short supply at AI companies.

Required experience level: Mid-to-senior (4+ years) with strong communication.

Transferable skills from software engineering: Demo skills, ability to explain technical concepts to non-technical audiences, broad technical knowledge.

Skill gaps to close: Sales process literacy, ROI/business value framing, presentation skills, less coding (this is a hard transition for builders).

Salary range: $200K-$400K total comp. Base $130K-$220K + commission (typically 30-50% of OTE). Often higher than pure engineering at growth-stage AI companies.

Timeline to pivot: 3-6 months. Existing developer advocacy or pre-sales experience accelerates dramatically.

Best fits when user shows: Strong communication, customer-facing work history, broad technical skills (vs deep specialist), enjoyment of presentation/explanation work.

---

**Path 9: AI Security Engineer 🟡**

What it looks like day-to-day: Build security infrastructure around AI systems. Red-team LLM applications, design guardrails, evaluate prompt injection risks, work on AI safety controls in production. Bridge between security engineering and AI engineering.

Why it's more durable than current role: AI introduces entirely new attack surfaces — prompt injection, agent escape, training data poisoning. Companies are realizing standard security practices don't cover this. Demand is rapidly growing as AI deployments scale.

Required experience level: Senior IC (5+ years) with security background, or strong AI engineer transitioning to security.

Transferable skills from software engineering: Security mindset, systematic thinking, comfort with adversarial reasoning, infrastructure knowledge.

Skill gaps to close: LLM-specific attack patterns, red-teaming techniques, AI safety frameworks, regulatory landscape (especially EU AI Act).

Salary range: $200K-$350K base. Higher at frontier labs and security-focused AI startups. Founding security engineer roles offer $250-300K + 1% equity.

Timeline to pivot: 6-12 months. Existing security engineers have shortest path.

Best fits when user shows: High decision stakes score (Task differentiation Q2), interest in correctness/safety, adversarial thinking, prior security or compliance work.

---

**Path 10: Developer Advocate / DevRel for AI Tools 🟢**

What it looks like day-to-day: Be the public face of an AI developer product. Write technical content, build sample apps, speak at conferences, support the developer community, feed product insights back to engineering. Heavy content creation and community work.

Why it's more durable than current role: Developer relations is fundamentally about trust and teaching — areas AI augments but doesn't replace. AI tool companies need credible technical voices to build developer adoption.

Required experience level: Mid-to-senior (4+ years) with strong communication and content history.

Transferable skills from software engineering: Code skills (you still build demos), technical writing, presentation experience, community engagement.

Skill gaps to close: Public speaking, content strategy, social media presence, less direct ownership of product.

Salary range: $150K-$300K base. Senior developer advocates at major AI companies clear $250K+. Equity at AI startups can be substantial.

Timeline to pivot: 6-12 months. Build a portfolio of public content first.

Best fits when user shows: History of writing/speaking, side projects, comfort with public-facing work, generalist rather than deep specialist.

---

**Path 11: Vertical AI Specialist (Healthcare/Legal/Fintech AI) 🟡**

What it looks like day-to-day: Apply AI to a specific regulated industry. Combine engineering with deep domain knowledge to build AI products that handle the unique requirements of healthcare, legal, financial services, or government. Could be at a vertical AI startup or as a specialist at a larger company.

Why it's more durable than current role: Regulated industries adopt AI more slowly but with higher specialization premiums. Domain expertise + AI engineering is a rare and durable combination. AI in healthcare, AI in legal, AI in finance are all rapidly growing verticals.

Required experience level: Mid-to-senior. Domain experience helps significantly but isn't strictly required if willingness to learn is high.

Transferable skills from software engineering: All standard engineering skills, plus adaptability to compliance and regulatory contexts.

Skill gaps to close: Industry-specific regulations (HIPAA, SOC 2, SOX), domain workflows, vertical-specific AI patterns (e.g., medical evidence retrieval, legal precedent analysis).

Salary range: $160K-$280K base. Healthcare and finance command premium for compliance-aware engineers.

Timeline to pivot: 6-18 months. Pivoting to a vertical AI startup in your existing industry's adjacent space is fastest.

Best fits when user shows: Existing industry experience (especially healthcare, legal, financial services), high differentiation scores, interest in domain depth over breadth.

---

**Path 12: Independent AI Consultant / Boutique Founder 🟠**

What it looks like day-to-day: Solo or small-team consulting practice focused on helping businesses adopt AI. Could be enterprise AI integration, AI strategy advisory, fractional AI engineering for early-stage companies, or specialized boutique consulting. Often hourly or project-based revenue.

Why it's more durable than current role: Independent consulting is the highest-leverage path for senior engineers who've built reputation. Direct client relationships, premium hourly rates, and full control of which work to take. The AI consulting market is wide open and most enterprises are willing to pay premium for credible experts.

Required experience level: Senior IC or above (8+ years). Often pairs with prior management experience.

Transferable skills from software engineering: Deep technical expertise, ability to deliver projects end-to-end, client communication, business judgment.

Skill gaps to close: Business development, contract negotiation, pricing strategy, marketing yourself, comfort with income variability.

Salary range: Variable. Hourly rates $200-500+ for senior AI consultants. Annual revenue $250K-$1M+ achievable for established practices, but with 12-18 months of ramp time.

Timeline to pivot: 12-24 months. Requires building reputation and pipeline before leaving full-time work. Often starts as side consulting.

Best fits when user shows: Senior experience, strong communication, history of independent work or freelancing, willingness to handle business operations, prior client-facing work.

#### 4.1.5 Base urgency by seniority

Used in Factor 5 (Time-to-Impact Urgency) calculation. The user's seniority is captured in Section A of the assessment.

| Seniority Level | Base Urgency | Time to Major Impact |
|---|---|---|
| Junior Engineer (0-2 years) | 80 | 1-2 years |
| Mid-level Engineer (3-5 years) | 65 | 2-3 years |
| Senior IC, generalist (6-15 years) | 50 | 3-5 years |
| Senior IC, specialized (6-15 years in durable specialty) | 35 | 5-7 years |
| Staff/Principal/Architect | 30 | 5-7 years |
| Engineering Manager | 25 | 7+ years |
| Director / VP / CTO | 20 | 7+ years |

The "specialized" categorization is derived from the user's response to Skill Differentiation Question A (domain expertise depth) combined with whether their specialty is in a "durable" area (see 4.1.6).

#### 4.1.6 Durable specialization areas

Sub-specialties that confer high portability (used in Career Capital Portability Factor 4 calculation):

**Durable specialties (specialization score: 100):**
- Distributed systems / Systems engineering
- Security engineering (application or infrastructure)
- Database internals / Data infrastructure
- Compilers / Programming language design
- Real-time / Embedded systems
- High-performance computing
- ML infrastructure / MLOps
- Domain-specific expertise in regulated industries (healthtech, fintech, defense)

**Moderately durable specialties (specialization score: 70):**
- Backend services / API design
- DevOps / Platform engineering
- Mobile engineering (iOS/Android native)
- Game engine development
- Computer graphics
- Robotics software

**Commoditizing specialties (specialization score: 25):**
- Frontend web development (general)
- CRUD application development
- WordPress / CMS development
- Generic full-stack development without depth
- Standard REST API development
- Routine internal tooling

**Pivot path availability for software engineers: 90 (high)**
Software engineers have many viable pivot paths in adjacent durable roles. This becomes the Factor 4 input C for all software engineer assessments.

#### 4.1.7 Pivot path selection logic

The algorithm selects the top 3 pivot paths from the library for each user based on a scoring system. Each path has eligibility criteria and a fit score derived from the user's assessment responses.

**Selection algorithm:**

```
function selectPivotPaths(userResponses, scores):
  
  candidatePaths = []
  
  for each path in pivotPathLibrary:
    
    // Step 1: Eligibility check
    if path.minSeniority > userResponses.seniority: continue
    if path.maxSeniority < userResponses.seniority: continue
    
    // Step 2: Calculate fit score (0-100)
    fitScore = 0
    
    // Base alignment to user's strengths
    fitScore += skillAlignmentScore(path, userResponses) * 0.40
    
    // Task profile match
    fitScore += taskProfileMatchScore(path, userResponses.taskTimes) * 0.25
    
    // Differentiation alignment
    fitScore += differentiationMatchScore(path, scores.skillDifferentiation_raw) * 0.20
    
    // Risk profile match (high-risk users get more aggressive pivots)
    fitScore += riskAppropriatenessScore(path, scores.compositeScore) * 0.15
    
    candidatePaths.append({path, fitScore})
  
  // Step 3: Diversification rule — don't recommend 3 paths of same type
  // (e.g., not all 3 should be IC paths, or all 3 should be management paths)
  selectedPaths = []
  for path in candidatePaths sorted by fitScore desc:
    if pathTypeAlreadySelected(selectedPaths, path.type) >= 2: continue
    selectedPaths.append(path)
    if len(selectedPaths) == 3: break
  
  return selectedPaths
```

**Path type categorization (for diversification):**

| Path Type | Paths |
|---|---|
| AI Engineering IC | 1 (AI Engineer), 2 (ML/AI Platform), 6 (AI/Agent Ops), 7 (AI Eval) |
| Customer-Facing Technical | 3 (Forward Deployed), 8 (Solutions Engineer), 10 (DevRel) |
| Leadership | 4 (Engineering Manager) |
| Entrepreneurial | 5 (Founding Engineer), 12 (Independent Consultant) |
| Specialized IC | 9 (AI Security), 11 (Vertical AI Specialist) |

**Skill alignment scoring (example for Path 1: AI Engineer):**

| User signal | Score contribution |
|---|---|
| Time on Task 1 (writing code) > 25% | +20 |
| Time on Task 3 (debugging) > 15% | +15 |
| Uses 2+ AI tools currently | +20 |
| Uses 3+ AI tools currently | +30 (replaces above) |
| Seniority: Mid or above | +15 |
| Industry: SaaS, Fintech, or similar | +10 |
| Specialty in distributed systems or backend | +10 |

Each path has its own scoring rules following this pattern. Detailed scoring rules are encoded per path in the role config file (see Section 9.2 file structure: `lib/ai-job-risk/roles/software-engineers.ts`).

**Implementation guidance for Claude Code:**

Build the scoring as data-driven (each path has a scoring rules JSON/object) rather than hardcoded logic. This makes it easier to update paths quarterly without touching the algorithm.

**Edge cases:**

1. **Fewer than 3 eligible paths:** This shouldn't happen with 12 paths and reasonable eligibility criteria, but if it does, surface available paths and note "Based on your profile, these are the strongest fits available."

2. **Tied fit scores:** Break ties by preferring paths with higher salary potential (gives the user more upside in their pivot consideration).

3. **User explicitly tags interest in management vs IC track:** This can be captured in an optional question. If present, override diversification to honor user preference.

#### 4.1.8 Pivot path library audit process

The pivot path library evolves on a different cadence than the task library because the job market evolves slower than AI capability.

**Audit cadence: Every 6 months**

Schedule alongside the quarterly task library review:
- Q1: Task library review only
- Q2: Task library review + pivot path audit
- Q3: Task library review only
- Q4: Task library review + pivot path audit

**Audit checklist:**

1. **Verify each path still represents a meaningful, hireable role**
   - Search current job postings (Levels.fyi, LinkedIn Jobs) for each path's role title
   - If fewer than ~20 active US job postings exist, flag the path for downgrade or removal

2. **Update salary ranges**
   - Sources to consult: Levels.fyi, Glassdoor (verified data), MRJ Recruitment reports, KORE1 guides, Second Talent, Ravio
   - Update any range that has shifted by 10%+

3. **Check for new emerging roles to add**
   - Review industry hiring reports (especially from AI labs like OpenAI, Anthropic)
   - Newsletter content from the prior 6 months will surface candidate roles
   - Add new paths only if they have established hiring demand (not just theoretical)

4. **Check for roles that should be consolidated or split**
   - Example: If "AI Engineer" and "ML Engineer" effectively merge in hiring, consolidate
   - Example: If "Forward Deployed Engineer" splits into "Enterprise FDE" vs "Startup FDE" with meaningfully different compensation, consider splitting

5. **Update provenance labels**
   - 🟡 Emerging → 🟢 Established when role has 100+ active job postings and stable salary data
   - 🟠 Forecast → 🟡 Emerging when role appears in actual job postings

6. **Update skill gaps based on current job postings**
   - Pull 10-15 recent job postings per role
   - Note new must-have skills appearing (e.g., new frameworks, new patterns)
   - Update skill gap content

**Audit owner:** Operator (newsletter author tracks this naturally through weekly content work)

**Update history:**
- 2026-05-20: Initial library created with 12 paths based on Q2 2026 market research
- Next scheduled audit: 2026-11-20

### 4.2 Marketing Managers

**Status:** Complete (v1). Based on Q2 2026 market research.

**Market context:** Marketing is one of the most acutely displaced fields by AI. Research shows ~20% net headcount loss in early-career marketing/sales roles since 2023. Agencies report 60% team reductions to stay profitable. Simultaneously, AI-skilled marketers command 20-30% premiums. The "AI Marketing Manager" subspecialty has emerged as a distinct, well-paid role.

#### 4.2.1 Task library

| # | Task | AR | Tier |
|---|------|-----|------|
| 1 | Writing marketing copy (ads, emails, social posts) | 85 | High |
| 2 | Content calendar planning and scheduling | 65 | Moderate-High |
| 3 | Campaign performance analysis and reporting | 70 | Moderate-High |
| 4 | Competitor and market research | 75 | High |
| 5 | A/B testing setup and analysis | 55 | Moderate |
| 6 | Marketing strategy and positioning | 25 | Low |
| 7 | Cross-functional stakeholder management | 15 | Low |
| 8 | Budget management and ROI accountability | 30 | Moderate-Low |
| 9 | Brand voice and creative direction | 35 | Moderate-Low |
| 10 | Vendor and agency management | 25 | Low |
| 11 | Customer research and insight synthesis | 50 | Moderate |
| 12 | Team leadership and people management | 15 | Low |

**Key reasoning highlights:**
- Tasks 1, 3, 4 face direct displacement by ChatGPT/Claude + analytics tools
- Tasks 6, 7, 12 are durable (judgment, relationships, strategic context)
- Brand voice (Task 9) is partly automatable but final calls remain human

#### 4.2.2 Pivot path library

**Path 1: AI Marketing Manager / AI Marketing Strategist 🟢**
Lead AI tool adoption across marketing org. Design AI-augmented workflows, evaluate vendors, train team on AI tools. Salary: $110K-$200K. Best fit: existing marketing managers with high adoption velocity scores. Timeline: 3-6 months upskilling.

**Path 2: Marketing Operations / Marketing Ops Lead 🟢**
Own the marketing tech stack, data, attribution, lifecycle automation. Less creative work, more systems thinking. Increasingly AI-augmented but architect role is durable. Salary: $100K-$180K. Best fit: analytical marketers, those with strong A/B testing time. Timeline: 6-12 months.

**Path 3: Product Marketing Manager 🟢**
Position products, lead launches, work closely with sales and product. Heavy stakeholder and strategy work that AI can't easily replicate. Salary: $90K-$200K. Best fit: marketers with strong communication and cross-functional history. Timeline: 6-12 months.

**Path 4: Demand Generation Lead 🟡**
Drive pipeline through paid, organic, and ABM strategies. AI-heavy but human strategy remains valuable. Salary: $120K-$220K. Best fit: performance-oriented marketers. Timeline: 6-12 months.

**Path 5: Customer Insights / Voice of Customer Analyst 🟡**
Synthesize customer research, run user interviews, generate strategic insights. AI augments but customer empathy is durable. Salary: $90K-$160K. Best fit: marketers with research time and customer-facing experience. Timeline: 6-12 months.

**Path 6: Brand Strategist 🟢**
High-level brand work that depends on cultural understanding and creative judgment. Salary: $100K-$200K. Best fit: senior marketers with strong creative direction and brand voice experience. Timeline: 12-18 months.

**Path 7: GEO/AI Search Strategist 🟡**
New specialty: optimizing for AI-generated search results (Google AI Overviews, Perplexity, ChatGPT citations). Salary: $90K-$170K. Best fit: SEO-experienced marketers, content-focused. Timeline: 3-6 months. *Highly emerging — verify before recommending heavily.*

**Path 8: Content Operations Director 🟡**
Run AI-augmented content production at scale. Oversee both AI tools and human editors. Salary: $110K-$190K. Best fit: marketers with high content calendar time and editor instincts. Timeline: 6-12 months.

**Path 9: Founding Marketer at AI Startup 🟡**
Be the first or solo marketer at an early-stage AI company. High equity upside. Salary: $90K-$160K base + meaningful equity. Best fit: generalist marketers with startup tolerance. Timeline: Can pivot in next job change.

**Path 10: Marketing Director / VP Marketing 🟢**
Leadership track — manage marketing org, set strategy, work with exec team. Most AI-resistant marketing path. Salary: $180K-$350K. Best fit: senior marketers with management experience. Timeline: 12-24 months.

**Path 11: Vertical AI Marketing Specialist (FinTech/HealthTech/LegalTech) 🟡**
Apply marketing skills to regulated industries that need compliant AI-augmented marketing. Salary: $110K-$200K. Best fit: marketers with existing industry experience. Timeline: 6-18 months.

**Path 12: Independent Marketing Consultant 🟠**
Solo consulting or fractional CMO work. Higher AI premium for established consultants. Variable income $100K-$400K+. Best fit: senior marketers with network and reputation. Timeline: 12-24 months.

#### 4.2.3 Base urgency by seniority

| Seniority Level | Base Urgency | Time to Major Impact |
|---|---|---|
| Marketing Coordinator / Specialist (0-2 years) | 85 | 1-2 years |
| Marketing Manager (3-5 years) | 70 | 2-3 years |
| Senior Marketing Manager (6-10 years) | 55 | 3-5 years |
| Director of Marketing | 35 | 5-7 years |
| VP / CMO | 25 | 7+ years |

#### 4.2.4 Durable specializations

**Durable (100):** Brand strategy at senior level, regulated industry marketing (healthcare, finance, legal), B2B technical product marketing, marketing leadership

**Moderately durable (70):** Product marketing, demand generation, marketing operations, customer marketing

**Commoditizing (25):** General content marketing, social media management (without strategy), basic copywriting, generic SEO, routine campaign management

**Pivot path availability: 85 (high)**

---

### 4.3 Content Creators

**Status:** Complete (v1). Based on Q2 2026 market research.

**Market context:** Content creation is the most bifurcated market in this set. Commodity content writing has crashed — blog posts once charged $300-500 now compete with AI at fractions of the cost. Simultaneously, specialized content (direct response, conversion copy, SME-niched writing, AI-optimized content) is growing in demand with rates increasing. The pivot question for content creators is *which side* of the bifurcation they want to land on.

This role config covers: freelance copywriters, content marketers, bloggers/journalists, technical writers, social media writers, ghostwriters, and similar content-producing roles.

#### 4.3.1 Task library

| # | Task | AR | Tier |
|---|------|-----|------|
| 1 | Writing blog posts and articles | 80 | High |
| 2 | Writing social media content | 85 | High |
| 3 | Writing email copy and sequences | 75 | High |
| 4 | Writing ad copy and short-form marketing | 80 | High |
| 5 | Writing long-form sales pages or VSLs | 45 | Moderate |
| 6 | SEO research and keyword strategy | 70 | Moderate-High |
| 7 | Interviewing subject matter experts | 20 | Low |
| 8 | Editing and proofreading AI-generated content | 60 | Moderate |
| 9 | Developing brand voice guidelines | 35 | Moderate-Low |
| 10 | Client communication and project management | 15 | Low |
| 11 | Original research and analysis | 35 | Moderate-Low |
| 12 | Specialized/regulated industry writing (medical, legal, financial) | 35 | Moderate-Low |

**Key reasoning highlights:**
- General content (Tasks 1-4) faces severe displacement
- Specialized expertise (Task 12) is highly durable
- Original research/analysis (Task 11) is the strongest hedge for content creators
- Editing AI content (Task 8) is a transitional skill — useful now, automatable later

#### 4.3.2 Pivot path library

**Path 1: SME-Niched Specialist Writer (Healthcare/Legal/Finance/Tech) 🟢**
Write exclusively for regulated industries where AI can't credibly produce content. Cybersecurity writers, medical copywriters, financial analysts with writing skills. Salary: $80K-$200K. Best fit: writers with industry knowledge or willingness to deeply learn one. Timeline: 6-12 months for domain immersion.

**Path 2: Conversion Copywriter / Direct Response Specialist 🟢**
VSLs, sales pages, email funnels, conversion-optimized content. Tied to business outcomes (revenue) which protects from commoditization. Salary: $80K-$300K+ for top performers. Best fit: writers with sales/persuasion interest and outcome-driven mindset. Timeline: 6-12 months.

**Path 3: AI Content Operations Manager 🟡**
Run AI-augmented content production at scale — manage AI tools, human editors, quality systems. Salary: $90K-$160K. Best fit: writers with strong editing time and systems thinking. Timeline: 6-12 months.

**Path 4: GEO/AI Search Optimization Specialist 🟡**
Optimize content for AI search (Google AI Overviews, Perplexity, ChatGPT citations). Most writers haven't adapted yet — strong early-mover opportunity. Salary: $80K-$160K. Best fit: SEO-experienced writers. Timeline: 3-6 months.

**Path 5: Content Strategist (Senior/Director) 🟢**
Move from making content to deciding strategy. Editorial planning, content systems design, team leadership. Salary: $100K-$200K. Best fit: senior writers with strategy and team experience. Timeline: 12-18 months.

**Path 6: Independent Strategic Consultant 🟠**
Consult businesses on content strategy, AI content systems, voice/brand standards. Higher rates than content production. Variable income $80K-$300K+. Best fit: senior writers with business acumen. Timeline: 12-24 months.

**Path 7: Ghostwriter for Executives / Thought Leadership 🟢**
Write under others' names — LinkedIn, books, keynotes. High trust, high differentiation. Salary: $80K-$250K+. Best fit: writers with strong voice flexibility and executive comfort. Timeline: 6-12 months.

**Path 8: Technical Writer (Software Documentation, API Docs) 🟢**
Specialized technical writing for software products. AI assists but accuracy and clarity remain human. Salary: $80K-$180K. Best fit: writers with technical curiosity. Timeline: 6-12 months.

**Path 9: Newsletter Operator / Independent Publisher 🟠**
Build your own audience via Substack, Beehiiv, etc. Variable income but uncapped upside. Best fit: writers with niche expertise and willingness to build audience. Timeline: 18-36 months to meaningful income.

**Path 10: Investigative Journalist / Original Reporter 🟢**
Original reporting is durable because it requires source relationships, on-the-ground work, and judgment. Salary: $50K-$150K (lower than other paths but durable). Best fit: writers with research time and curiosity. Timeline: 12-24 months.

**Path 11: AI Content Trainer / Annotator (Specialized) 🟡**
Train AI models on specialized writing — RLHF, eval rubrics for content quality. Often domain-specific. Salary: $80K-$180K. Best fit: writers with technical comfort and quality instincts. Timeline: 3-6 months.

**Path 12: Educational Content Creator (Courses, Coaching) 🟠**
Teach writing or your specialty area through courses, coaching, or community. Variable income. Best fit: writers with teaching instinct and audience. Timeline: 12-24 months.

#### 4.3.3 Base urgency by seniority

| Seniority Level | Base Urgency | Time to Major Impact |
|---|---|---|
| Junior writer / Entry-level (0-2 years) | 90 | Now-2 years (already happening) |
| Mid-level content writer (3-5 years) | 80 | 1-3 years |
| Senior writer (6-10 years) | 60 | 3-5 years |
| Content Strategist / Director | 40 | 5-7 years |
| Editor in Chief / VP Content | 30 | 7+ years |

**Note:** Urgency is highest in this role of all five — the market is actively contracting for generalist writers right now.

#### 4.3.4 Durable specializations

**Durable (100):** Regulated industry writing (medical, legal, financial), direct response/conversion copywriting, original investigative journalism, specialized technical writing

**Moderately durable (70):** Content strategy, brand storytelling, ghostwriting for executives, niche newsletter publishing

**Commoditizing (25):** General blogging, social media writing without strategy, basic SEO content, product descriptions, generic email marketing

**Pivot path availability: 75 (moderate-high)**

---

### 4.4 Customer Success

**Status:** Complete (v1). Based on Q2 2026 market research.

**Market context:** Customer success is being aggressively automated. Every major CS platform (Gainsight, ChurnZero, Vitally, Totango, Catalyst, Planhat) shipped AI agents between 2024-2026. 71% of executives aim for touchless customer service by 2027. Routine CS work (onboarding emails, check-ins, basic support) is being agent-handled. Strategic account work and relationship-driven CS remains durable.

This role config covers: Customer Success Managers, Account Managers, Customer Support, Customer Experience roles.

#### 4.4.1 Task library

| # | Task | AR | Tier |
|---|------|-----|------|
| 1 | Routine check-in emails and account follow-ups | 90 | High |
| 2 | Onboarding new customers (standard workflow) | 75 | High |
| 3 | Health score monitoring and risk identification | 80 | High |
| 4 | Renewal forecasting and reporting | 70 | Moderate-High |
| 5 | Customer training and education delivery | 50 | Moderate |
| 6 | Strategic business reviews with key accounts | 20 | Low |
| 7 | Expansion conversations and upsell discovery | 30 | Moderate-Low |
| 8 | Resolving complex customer escalations | 25 | Low |
| 9 | Cross-functional coordination (with product, engineering, sales) | 15 | Low |
| 10 | Building executive-level customer relationships | 10 | Low |
| 11 | Voice of customer feedback synthesis | 50 | Moderate |
| 12 | Internal team coordination and mentoring | 15 | Low |

**Key reasoning highlights:**
- Routine work (Tasks 1, 2, 3, 4) is heavily exposed — AI agents already do this
- Strategic and relationship work (Tasks 6, 8, 9, 10) is durable
- Complex escalations remain human because they require judgment and trust

#### 4.4.2 Pivot path library

**Path 1: Strategic Account Manager (Enterprise) 🟢**
Move upmarket — manage fewer, larger, more complex accounts where relationships matter. AI handles tactical work, you handle strategic. Salary: $120K-$250K + commission. Best fit: CSMs with executive relationships and strategic account history. Timeline: 6-12 months.

**Path 2: AI/CS Operations Lead 🟡**
Own the CS tech stack and AI tooling — Gainsight admin, agent configuration, workflow design. Salary: $100K-$180K. Best fit: CSMs with operational/systems orientation. Timeline: 6-12 months.

**Path 3: Customer Success Architect (Enterprise/Solutions) 🟡**
Hybrid CS/Solutions role at enterprise software vendors. Technical depth on the product + customer-facing skill. Salary: $130K-$220K. Best fit: technically curious CSMs at SaaS companies. Timeline: 6-12 months.

**Path 4: Implementation/Onboarding Specialist (Complex/Strategic) 🟢**
Specialized onboarding for complex products — security, healthcare, financial software. Less likely to be fully automated due to integration complexity. Salary: $90K-$170K. Best fit: CSMs with strong project management instincts. Timeline: 6-12 months.

**Path 5: Revenue Operations (RevOps) 🟢**
Move from CS into RevOps — own the systems and processes across sales, marketing, CS. AI-heavy but architect role is durable. Salary: $110K-$200K. Best fit: data-oriented CSMs. Timeline: 12-18 months.

**Path 6: Customer Marketing Manager 🟡**
Bridge CS and marketing — case studies, advocacy programs, customer-led growth. Salary: $90K-$170K. Best fit: CSMs with content/marketing interest. Timeline: 6-12 months.

**Path 7: VP / Director of Customer Success 🟢**
Leadership track — own CS strategy at org level. Most AI-resistant CS path because of cross-functional and people leadership. Salary: $200K-$400K total comp. Best fit: senior CSMs with management interest. Timeline: 12-24 months.

**Path 8: Account Executive (Sales) 🟢**
Pivot from CS to sales. Existing customer knowledge is huge advantage. Higher upside via commission. Salary: $120K-$300K+ OTE. Best fit: CSMs with high expansion success and outgoing personality. Timeline: 6-12 months.

**Path 9: Founding CSM at AI Startup 🟡**
First CS hire at early-stage AI company. Build the function from scratch. Salary: $100K-$170K base + equity. Best fit: senior CSMs with entrepreneurial drive. Timeline: Can pivot in next job change.

**Path 10: Product Manager (Customer-Focused) 🟡**
Move into product, specifically focused on customer-facing products. CS background gives natural customer empathy. Salary: $130K-$250K. Best fit: CSMs with strong product feedback history. Timeline: 12-18 months.

**Path 11: Vertical CS Specialist (Healthcare/Legal/Financial) 🟡**
Deep CS expertise in a regulated vertical. Higher barriers, higher compensation. Salary: $110K-$190K. Best fit: CSMs with existing industry experience. Timeline: 6-18 months.

**Path 12: Independent CS Consultant 🟠**
Consult companies on CS strategy, tool selection, team building. Variable income $100K-$300K+. Best fit: senior CSMs with reputation and network. Timeline: 12-24 months.

#### 4.4.3 Base urgency by seniority

| Seniority Level | Base Urgency | Time to Major Impact |
|---|---|---|
| CSM / Specialist (0-2 years) | 85 | 1-2 years |
| Senior CSM (3-5 years) | 70 | 2-3 years |
| Strategic Account Manager / Lead (6-10 years) | 45 | 3-5 years |
| Director of CS | 30 | 5-7 years |
| VP / Chief Customer Officer | 25 | 7+ years |

#### 4.4.4 Durable specializations

**Durable (100):** Enterprise strategic accounts, vertical specialty (healthcare/legal/financial), CS leadership, complex implementations

**Moderately durable (70):** Mid-market account management, CS operations, customer marketing

**Commoditizing (25):** SMB/tech-touch CS, basic onboarding, generic check-in workflows, low-touch renewals

**Pivot path availability: 80 (high)**

---

### 4.5 Product Managers

**Status:** Complete (v1). Based on Q2 2026 market research.

**Market context:** Unlike the previous four roles, Product Management faces more *augmentation* than *displacement*. The role is splitting into AI-native PMs ($150K-$300K+) and traditional PMs (under pressure). AI product manager job openings have surpassed 14,000 globally and salary ranges now reach $307,000 at top-tier companies. Junior PM roles at startups are contracting; senior PM roles at large companies are growing.

#### 4.5.1 Task library

| # | Task | AR | Tier |
|---|------|-----|------|
| 1 | Writing PRDs and product specifications | 65 | Moderate-High |
| 2 | User research interviews and synthesis | 30 | Moderate-Low |
| 3 | Data analysis and metrics review | 60 | Moderate |
| 4 | Roadmap planning and prioritization | 25 | Low |
| 5 | Stakeholder management and updates | 15 | Low |
| 6 | Cross-functional collaboration (engineering, design, marketing) | 15 | Low |
| 7 | Customer interviews and discovery | 20 | Low |
| 8 | Competitive analysis and market research | 70 | Moderate-High |
| 9 | A/B test design and analysis | 50 | Moderate |
| 10 | Launch planning and execution | 30 | Moderate-Low |
| 11 | Strategy development and OKR setting | 20 | Low |
| 12 | People management (if applicable) | 10 | Low |

**Key reasoning highlights:**
- PM work is mostly judgment, relationships, and decision-making — relatively AI-resistant
- Document production (PRDs, specs, research summaries) is augmented
- Junior PM execution work is more exposed than senior strategic work

#### 4.5.2 Pivot path library

**Path 1: AI Product Manager 🟢**
Specialize in AI products. Bridge customer needs to AI infrastructure. Salary: $150K-$310K. Best fit: PMs with technical curiosity and AI tool fluency. Timeline: 6-12 months upskilling.

**Path 2: Platform Product Manager 🟢**
Own infrastructure or developer platform products. Highly technical, less AI displacement. Salary: $160K-$280K. Best fit: PMs with engineering background or technical orientation. Timeline: 6-12 months.

**Path 3: Product Strategy Lead / Group PM 🟢**
Higher-level role focused on strategy across multiple products. Leadership track. Salary: $200K-$350K. Best fit: senior PMs with strong strategic and communication skills. Timeline: 12-18 months.

**Path 4: AI/ML PM at Frontier Lab 🟡**
PM at OpenAI, Anthropic, Google DeepMind, or similar. Premium compensation. Salary: $200K-$500K+ total comp. Best fit: PMs with deep AI literacy and strong technical communication. Timeline: 6-12 months for top candidates.

**Path 5: Founding PM at AI Startup 🟡**
First or solo PM at early-stage AI company. Define product from scratch. Salary: $130K-$200K base + meaningful equity. Best fit: PMs with startup tolerance and generalist skills. Timeline: Can pivot in next job change.

**Path 6: Product Operations / ProductOps Lead 🟡**
Run the systems, processes, and tooling that PMs use. AI-augmented but architect role is durable. Salary: $120K-$220K. Best fit: process-oriented PMs. Timeline: 6-12 months.

**Path 7: VP Product / CPO 🟢**
Leadership track — own product strategy at company level. Most AI-resistant PM path. Salary: $300K-$600K+ total comp. Best fit: senior PMs (10+ years) with management experience. Timeline: 18-36 months.

**Path 8: Technical Program Manager (TPM) 🟢**
Cross between PM and engineering management. Coordinate complex technical initiatives. Salary: $150K-$280K. Best fit: technical PMs with strong execution skills. Timeline: 6-12 months.

**Path 9: Solutions Engineer / AI Solutions Architect 🟡**
Pre-sales technical role at AI companies. Customer-facing + technical work. Salary: $200K-$400K OTE. Best fit: PMs with technical depth and presentation skills. Timeline: 6-12 months.

**Path 10: Vertical Product Manager (HealthTech, FinTech, LegalTech) 🟢**
PM at a regulated vertical AI company. Domain expertise + product skills are highly durable. Salary: $140K-$260K. Best fit: PMs with existing industry experience. Timeline: 6-18 months.

**Path 11: Founder of AI-Native Product Startup 🟠**
Start your own product company. AI tools make solo or small founder teams more viable. Variable income (often zero for 1-2 years then potentially significant). Best fit: PMs with strong execution and product instincts. Timeline: 18-36 months.

**Path 12: Independent Product Consultant / Fractional Head of Product 🟠**
Consult or take fractional leadership roles. Higher hourly rates than employment. Variable income $150K-$400K+. Best fit: senior PMs with reputation and network. Timeline: 12-24 months.

#### 4.5.3 Base urgency by seniority

| Seniority Level | Base Urgency | Time to Major Impact |
|---|---|---|
| Associate PM (0-2 years) | 75 | 2-3 years |
| Product Manager (3-5 years) | 55 | 3-5 years |
| Senior Product Manager (6-10 years) | 40 | 5-7 years |
| Group PM / Principal PM | 30 | 5-7 years |
| Director / VP Product | 20 | 7+ years |
| CPO | 15 | 7+ years |

**Note:** PM has the lowest urgency curve of the 5 launch roles. The work is more augmented than displaced, but the bifurcation (AI-native vs traditional PMs) creates real career risk.

#### 4.5.4 Durable specializations

**Durable (100):** AI product management, platform PM, regulated vertical PM, product leadership

**Moderately durable (70):** B2B SaaS PM, technical PM (TPM-adjacent), product operations

**Commoditizing (25):** Junior PM at non-technical products, basic feature management without strategy, internal tooling PM at non-strategic level

**Pivot path availability: 85 (high)**

---

## Section 5: Question Flow Specification

This section specifies every question, answer option, point value, and conditional logic for the assessment. The structure is identical across all 5 roles; role-specific content (task lists, role title options) is pulled from Section 4.X role configurations.

### 5.1 Overall flow structure

```
Section A: About you (3 questions, ~30 seconds)
Section B: Your work (1 multi-task input, ~2 minutes)
Section C: Your environment (4 questions, ~1 minute)
Section D: Your strengths (4 questions, ~1.5 minutes)
Section E: Looking ahead (2-3 questions, ~30 seconds)
─────────────
Total: ~14 questions across 5 sections, ~5-7 minutes
```

**Design principles applied:**
- Front-load easy/concrete questions, save subjective questions for later
- Mobile-first UI with thumb-friendly tap targets
- Discrete answer buttons over sliders or free text where possible
- Progress indication at section level
- Allow "Don't know" on factual questions
- Conversational tone, not clinical HR survey language

### 5.2 Section A: About you

#### Question A1: Current role

**Question text:** "What's your current role?"
**Answer type:** Single-select dropdown
**Required:** Yes
**Help text:** "Choose the option closest to your current title. We'll personalize your results based on this."

**Options per role assessment:**

*Software Engineer assessment:*
- Software Engineer / Developer
- Senior Software Engineer
- Staff / Principal Engineer
- Software Architect
- Engineering Manager
- Director of Engineering
- VP Engineering / CTO

*Marketing Manager assessment:*
- Marketing Coordinator / Specialist
- Marketing Manager
- Senior Marketing Manager
- Director of Marketing
- VP Marketing / CMO

*Content Creator assessment:*
- Junior Writer / Entry-level
- Content Writer / Copywriter (mid-level)
- Senior Writer / Senior Copywriter
- Content Strategist / Content Director
- Editor in Chief / VP Content

*Customer Success assessment:*
- CSM / Customer Success Specialist
- Senior CSM
- Strategic Account Manager / Lead CSM
- Director of Customer Success
- VP Customer Success / Chief Customer Officer

*Product Manager assessment:*
- Associate Product Manager
- Product Manager
- Senior Product Manager
- Group PM / Principal PM
- Director / VP Product
- CPO

**Maps to scoring:** Sets `seniorityLevel` which determines `baseUrgency` (per role config Section 4.X.3).

#### Question A2: Industry

**Question text:** "What industry are you in?"
**Answer type:** Single-select dropdown
**Required:** Yes
**Help text:** None

**Options:** The existing 18 industries from the newsletter profile:
SaaS / Software, Fintech / Financial Services, Healthcare / Life Sciences, E-commerce / Retail, Education / EdTech, Media / Entertainment, Marketing / Advertising, Consulting / Professional Services, Manufacturing / Industrial, Real Estate / PropTech, Legal / LegalTech, Government / Public Sector, Nonprofit / Social Impact, Cybersecurity, Gaming, Telecommunications, Energy / CleanTech, Transportation / Logistics

**Maps to scoring:** Sets `industry` which applies the Industry Multiplier on Adoption Velocity (per Section 3.4) and influences pivot path selection.

#### Question A3: Years of experience

**Question text:** "How long have you been working in this field?"
**Answer type:** Single-select buttons (5 options)
**Required:** Yes
**Help text:** "Total professional experience, including any related earlier roles."

**Options (with point values for Career Portability):**
- 0-2 years → 30
- 3-5 years → 50
- 6-10 years → 70
- 11-15 years → 85
- 16+ years → 100

**Maps to scoring:** Sets `yearsExperience` for Factor 4 (Career Portability) input A.

### 5.3 Section B: Your work

#### Question B1: Task time distribution

**Question text:** "How does your typical week break down?"
**Answer type:** Multi-task discrete-button input. Each task has 5 buttons: "None" | "0-10%" | "10-25%" | "25-50%" | "50%+"
**Required:** User must select something for at least 3 tasks
**Help text:** "Think about a normal recent week. Roughly how much time goes to each? Skip any that don't apply to your work."

**Tasks shown:** Pulled from the role-specific task library in Section 4.X.1.

**UI behavior:**
- Each task starts unselected (no default value)
- Show running total at bottom: "Time accounted for: X%" — but allow >100% or <100%
- Validation: must select for ≥3 tasks before "Continue" is enabled
- Normalize task percentages in scoring algorithm (divide each by total)
- Range-to-midpoint mapping for scoring: None=0, 0-10%=5, 10-25%=17.5, 25-50%=37.5, 50%+=60

**Edge case prompts:**
- If user selects ≥50%+ on only one task: show one-time prompt "Your week seems concentrated in one task. Are you sure?" — accept user confirmation
- If user selects "None" on every task: block with error "Please indicate at least 3 tasks that take up some of your time"

**Maps to scoring:** Sets `taskTimes` for Factor 1 (Task Automatability) calculation. The weighted average of task time × automatability rating produces Factor 1.

### 5.4 Section C: Your environment

#### Question C1: Employer AI posture

**Question text:** "How is your employer approaching AI tools right now?"
**Answer type:** Single-select buttons
**Required:** Yes
**Help text:** "Think about official policy and how leadership talks about AI, not just what your team does informally."

**Options (with point values for Adoption Velocity):**
- "Mandated — we're expected to use specific AI tools and our usage is tracked" → 100
- "Encouraged — the company provides AI tools and pushes adoption" → 75
- "Allowed — we can use AI tools but they're not provided" → 50
- "Discouraged — there are restrictions or skepticism around AI use" → 25
- "Don't know / Not sure" → 50

#### Question C2: Tools you use

**Question text:** "Which AI tools do you currently use in your work?"
**Answer type:** Multi-select chips
**Required:** Yes (at least one option, including "None of these")
**Help text:** "Select all that you've used in the past month."

**Options (must match the newsletter profile Tools & Platforms field exactly):**
ChatGPT, Claude, Gemini, Copilot, Cursor, Midjourney, DALL-E, Stable Diffusion, Notion AI, Jasper, Perplexity, Replit, Hugging Face, LangChain, Vercel AI SDK, AWS Bedrock, Azure OpenAI, Google Vertex AI, Other (text input), None of these

**UI behavior:**
- "None of these" is mutually exclusive with all other selections (clears them when selected)
- Selecting "Other" reveals a text input for custom tool names
- This data also pre-populates the newsletter profile's Tools & Platforms field (see Section 11.3.3)

**Maps to scoring:**
- Count of selected tools (excluding "None of these") → point values:
  - 4+ tools → 100
  - 3 tools → 75
  - 2 tools → 50
  - 1 tool → 30
  - None → 10
- These points feed Adoption Velocity Factor 2 Question B

**Optional soft prompt:** If user selects "None of these" AND has reported ≥10% time on at least one high-AR task (AR ≥75), display a soft inline note before continuing:
> "Heads up — your tasks include work that AI tools currently handle, but you haven't used any. This will affect your score."

#### Question C3: Team headcount changes

**Question text:** "Has your team's headcount changed in the last 12 months?"
**Answer type:** Single-select buttons
**Required:** Yes
**Help text:** "Think about your immediate team or function, not the whole company."

**Options (with point values):**
- "Significant reduction (layoffs or major restructuring)" → 100
- "Some attrition not replaced (people left and weren't backfilled)" → 75
- "Flat (about the same size)" → 50
- "Some hiring (a few new people)" → 25
- "Significant hiring (substantial team growth)" → 10

#### Question C4: Structural change

**Question text:** "In the last 6 months, has AI changed how your team is structured or how work is assigned?"
**Answer type:** Single-select buttons
**Required:** Yes
**Help text:** None

**Options (with point values):**
- "Yes, significantly (clear restructuring, new roles, or major workflow changes)" → 100
- "Yes, somewhat (some changes but business mostly as usual)" → 70
- "No (nothing noticeable yet)" → 30
- "Don't know" → 50

### 5.5 Section D: Your strengths

**Section intro shown above first question:**
> "These next questions help us understand what's unique about your work — the things that are hardest to replicate."

#### Question D1: Domain expertise depth

**Question text:** "How much of your value comes from deep expertise in a specific area?"
**Answer type:** Single-select buttons with descriptions
**Required:** Yes
**Help text:** "Think about your most specialized knowledge — a specific technology, industry, regulated environment, or rare technical skill."

**Options (with point values for Skill Differentiation):**
- "Most of it — I'm specifically sought out for this expertise" → 100
- "Significant — I'm one of few people who knows this well" → 75
- "Some — I know it but others could learn it" → 40
- "Little — my work is mostly general-purpose" → 15

#### Question D2: Decision consequence stakes

**Question text:** "How often do you make decisions where being wrong has serious consequences?"
**Answer type:** Single-select buttons with descriptions
**Required:** Yes
**Help text:** Role-specific examples. See per-role text below.

**Role-specific help text examples:**
- *Software Engineer:* "Examples: security or safety implications, significant financial impact, irreversible architectural choices, compliance or regulatory consequences."
- *Marketing Manager:* "Examples: major campaign budget calls, brand crisis response, strategic pivots, regulated industry messaging."
- *Content Creator:* "Examples: legal or compliance review of content, brand voice decisions for major launches, factual claims in regulated industries."
- *Customer Success:* "Examples: enterprise renewal decisions, churn risk escalations, executive-level customer issues, contract negotiation calls."
- *Product Manager:* "Examples: major product strategy decisions, prioritization with significant revenue impact, technical architecture choices with long-term implications."

**Options (with point values):**
- "Constantly — high-stakes decisions are core to my role" → 100
- "Regularly — multiple times a week" → 75
- "Sometimes — occasionally important calls to make" → 40
- "Rarely — my decisions are mostly reversible" → 15

#### Question D3: Relationship dependence

**Question text:** "How important are relationships and trust to getting your work done?"
**Answer type:** Single-select buttons with descriptions
**Required:** Yes
**Help text:** "Think about how much your work depends on trust with stakeholders, customers, or teammates."

**Options (with point values):**
- "Critical — relationships are core to my effectiveness" → 100
- "Important — they meaningfully affect my outcomes" → 70
- "Somewhat important — they help but aren't central" → 40
- "Not really relevant — I work mostly independently" → 15

#### Question D4: Novel problem frequency

**Question text:** "When you face a problem, how often is the solution something not already in documentation or prior examples?"
**Answer type:** Single-select buttons with descriptions
**Required:** Yes
**Help text:** "Be honest. Most work involves applying known patterns — that's not a weakness, it's just relevant for this assessment."

**Options (with point values):**
- "Most of my work involves genuinely novel problems" → 100
- "Frequently — much of my work has no clear template" → 75
- "Occasionally — sometimes new, often familiar" → 40
- "Rarely — I usually adapt existing patterns" → 15

### 5.6 Section E: Looking ahead

#### Question E1: Manager conversations

**Question text:** "In the last year, has your manager talked about how AI is changing your role or team?"
**Answer type:** Single-select buttons
**Required:** Yes
**Help text:** None

**Options:**
- "Yes, substantially (multiple serious conversations)"
- "Yes, briefly (it's come up but not in depth)"
- "No (it hasn't really come up)"

**Maps to scoring:** Used as a Time-to-Impact Urgency modifier (Factor 5).

#### Question E2: Active learning

**Question text:** "Are you actively learning AI tools or skills outside of work?"
**Answer type:** Single-select buttons
**Required:** Yes
**Help text:** None

**Options:**
- "Yes, regularly (weekly or more)"
- "Occasionally (when something interests me)"
- "No (not really)"

**Maps to scoring:** Used as a Time-to-Impact Urgency modifier (Factor 5).

#### Question E3 (Optional): Open text

**Question text:** "What's your biggest worry about AI and your career? (Optional)"
**Answer type:** Free text input (max ~500 characters)
**Required:** No — explicit "Skip" button equally prominent as "Continue"
**Help text:** "Skip if you'd rather not say. This won't affect your score — it just helps us understand what people in your role are experiencing."

**Storage:** Stored as qualitative signal in `assessment_results.responses.openTextWorry`. Not used in scoring. Valuable for newsletter content development and aggregate insights.

### 5.7 Conditional logic

#### Branch 1: Senior leadership shortcut

**Trigger:** Question A1 = "Director of Engineering" OR "VP Engineering / CTO" (or equivalent in other roles: "Director of Marketing", "VP Marketing / CMO", etc.)

**Action:** Skip Question D2 (decision stakes). Auto-assign 100 points (max).

**Rationale:** Leadership roles inherently involve constant high-stakes decisions. Asking the question is redundant and slightly insulting.

#### Branch 2: Junior IC simplification

**Trigger:** Question A1 = junior IC role (e.g., "Software Engineer / Developer", "Junior Writer", "CSM Specialist", "Associate Product Manager") AND Question A3 = "0-2 years"

**Action:** Skip Question E1 (manager conversations). Auto-assign middle value (40 points equivalent).

**Rationale:** Junior ICs typically don't have detailed strategic conversations with managers about AI displacement. The question yields noise more than signal.

#### Branch 3: Transparency soft prompt

**Trigger:** Question C2 = "None of these" AND task time distribution shows ≥10% on any task with AR ≥75

**Action:** Display inline note before continuing: "Heads up — your tasks include work that AI tools currently handle, but you haven't used any. This will affect your score."

**Rationale:** Transparency builds trust. Showing the user what the assessment is measuring (rather than hiding the logic) signals integrity.

### 5.8 Progress indication

**Section progress (primary):**
Shown at top of every question: "Section 2 of 5: Your work"

**Question progress (secondary):**
Shown subtly: "Question 5 of 14"

**Why not percentage:** Sections take different amounts of time. A % progress bar can mislead (e.g., 50% through questions might be 80% through actual time spent).

### 5.9 Save and resume behavior

**Save:**
- After every section completion, save state to localStorage with timestamp
- Key: `ai-job-risk-assessment-progress-[role]`
- Value: JSON of all answers so far + current section + timestamp

**Resume:**
- On landing page visit, check for localStorage entry matching this role
- If entry exists AND timestamp < 7 days ago: show modal "You started this assessment on [date]. Continue where you left off?"
  - "Continue": jump to current section with answers pre-filled
  - "Start over": clear localStorage, start fresh
- If entry exists AND timestamp > 7 days ago: silently clear localStorage, show normal landing page

**Cross-device note:**
LocalStorage doesn't sync across devices. Users who start on mobile and resume on desktop will start fresh. This is acceptable for v1; cross-device save can be added post-auth in a future version (when we have a subscriber ID to save against).

### 5.10 Completion and transition to results

**On completion of Question E (last question):**
1. Show interstitial: "Calculating your AI Disruption Score..." with brief loading animation (1-2 seconds)
2. Compute scores server-side via `/api/ai-job-risk/submit` endpoint
3. Generate unique result_id
4. Save anonymized record to assessment_results table (with NULL subscriber_id at this point)
5. Display teaser result page (see Section 11.2 for full UX)

**Background timing:**
The 1-2 second interstitial gives the user a sense that "something is happening" — the assessment is being processed. In reality, scoring is fast. The pause adds perceived value and prepares the user for the result reveal.

### 5.11 Mobile-specific considerations

- All buttons minimum 44×44px tap targets
- Single-column layout
- Question text and help text legible at default font size (no zooming required)
- Question B (task time distribution) is the trickiest on mobile — 12 tasks × 5 buttons each. Consider:
  - Show 4-6 tasks per screen with "More tasks below" indicator
  - Or use accordion expansion for tasks the user hasn't selected yet
  - Keep total scroll length manageable
- Sticky "Continue" button at bottom of screen
- Avoid hover states (use focus and tap feedback only)

### 5.12 Accessibility (WCAG considerations)

- All buttons must have descriptive labels (not just visual styling)
- Keyboard navigation must work for full assessment flow
- Color is not the only signal (e.g., selected state shouldn't rely solely on color change)
- Screen reader announces section transitions
- Error messages are tied to their inputs via aria-describedby

### 5.13 Implementation notes for Claude Code

**Component structure recommendation:**
```
components/ai-job-risk/
├── AssessmentFlow.tsx              # Top-level orchestrator
├── ProgressIndicator.tsx           # Section + question indicator
├── sections/
│   ├── SectionA_About.tsx          # 3 questions
│   ├── SectionB_Work.tsx           # 1 multi-task input
│   ├── SectionC_Environment.tsx    # 4 questions
│   ├── SectionD_Strengths.tsx      # 4 questions
│   └── SectionE_Ahead.tsx          # 2-3 questions
├── inputs/
│   ├── SingleSelectButtons.tsx     # Reusable for most questions
│   ├── SingleSelectDropdown.tsx    # For role/industry
│   ├── MultiSelectChips.tsx        # For tools (C2)
│   ├── TaskTimeInput.tsx           # Multi-task button grid for B1
│   └── OpenTextInput.tsx           # For E3
└── ResultsGate.tsx                 # Teaser + auth gate
```

**State management:**
Local React state with reducer is sufficient. No need for Redux/Zustand. State shape:
```
{
  currentSection: 'A' | 'B' | 'C' | 'D' | 'E',
  responses: {
    role: string | null,
    industry: string | null,
    yearsExperience: string | null,
    taskTimes: { [taskId: string]: string | null },
    employerAdoption: string | null,
    toolsUsed: string[],
    headcountChange: string | null,
    structuralChange: string | null,
    domainExpertise: string | null,
    decisionStakes: string | null,
    relationshipImportance: string | null,
    novelProblems: string | null,
    managerConversations: string | null,
    activeLearning: string | null,
    openTextWorry: string | null
  },
  isSubmitting: false
}
```

**Persistence:**
Sync state to localStorage on every section transition via `useEffect`.

**API call on completion:**
POST to `/api/ai-job-risk/submit` with the full responses object. Server computes scores, stores result, returns `{ resultId, compositeScore, tier }` for the teaser.

---

## Section 6: Report Generation

This section specifies how the deterministic scoring output (from Section 3), role-specific content (from Section 4), and user responses (from Section 5) combine into the personalized report the user receives.

### 6.1 Architectural split: deterministic vs AI-generated content

A critical design decision shapes everything in this section: **what is generated by AI vs what comes from templates vs what is pure scoring output.**

**Pure scoring output (deterministic, from algorithm):**
- Composite score number
- Tier classification
- Five factor scores
- Percentile context (vs synthetic benchmarks initially)
- Selected pivot paths (algorithm picks top 3)

**Template-based content (deterministic, from spec):**
- Tier descriptions (5 pre-written tier paragraphs)
- Pivot path metadata (from Section 4 role configs)
- Task library content (status labels, "what's left for humans")
- 30-day action plan templates per role and per pivot path
- Section 6 (Progress Tracking) and Section 7 (What's Next) static content

**AI-generated content (LLM call):**
- Personalized opening summary
- Per-factor explanations referencing user's specific data
- Per-task analysis with user-specific framing
- "Why this fits you" narrative for each top 3 pivot path
- Personalized action plan items
- One "highest-leverage move" line in Progress Tracking

This split keeps factual content reliable (scores, salaries, pivot path details) while making narrative content feel personalized.

### 6.2 Report structure (7 sections)

The on-screen results page and the PDF both contain the same 7 sections in this order:

1. **Headline Score** — Composite score, tier, percentile context, opening summary
2. **Score Breakdown** — Five factors with personal values and explanations
3. **Task-by-Task Analysis** — User's reported tasks with personalized analysis
4. **Top 3 Pivot Paths** — Personalized recommendations with full metadata
5. **30-Day Action Plan** — Three specific, doable actions
6. **Progress Tracking** — How the score can change over time
7. **What's Next** — Newsletter handoff and future product teasers

### 6.3 Report Section 1: Headline Score

**On-screen layout:**

```
┌─────────────────────────────────────────────────┐
│  [Visual: Score gauge or ring showing 62/100]   │
│                                                 │
│  Your AI Disruption Score: 62 / 100             │
│  Risk Tier: Moderate-High Risk                  │
│                                                 │
│  [Personalized opening summary — 2-3 sentences] │
│                                                 │
│  You scored higher than 71% of Software         │
│  Engineers we've assessed.                      │
│                                                 │
│  [Download PDF] [Share Results] [Retake in 6mo] │
└─────────────────────────────────────────────────┘
```

**Tier descriptions (deterministic, pre-written):**

| Tier | Score Range | Description |
|---|---|---|
| Low Risk | 0-25 | Your role is largely AI-resistant in its current form. Your work centers on judgment, relationships, and novel problem-solving that current AI tools augment but don't replace. |
| Moderate Risk | 26-45 | Some tasks in your work will be augmented or automated, but the core of your role persists. Your work will evolve over the next few years, but you have time to adapt. |
| Moderate-High Risk | 46-65 | Significant transformation is likely in your role. Real displacement pressure exists, but you also have clear pivot paths and time to make them. Proactive planning recommended. |
| High Risk | 66-85 | Major displacement pressure within 3-5 years. The work you do today will change substantially, and active pivot planning is urgent. The good news: clear paths forward exist. |
| Severe Risk | 86-100 | Role-level disruption likely within 1-3 years. Your work as it exists today will change dramatically. Immediate action recommended — but with clear paths forward, this is navigable. |

**Percentile context:**
- Initial launch: Use synthetic benchmarks per role (estimated distributions based on persona modeling in Section 4.X.2)
- After 500+ assessments per role: switch to real percentile calculations from `assessment_benchmarks` table
- Display format: "You scored higher than X% of [Role]s we've assessed"

**AI-generated opening summary:** See prompt template 6.9.1 below.

### 6.4 Report Section 2: Score Breakdown

**Layout:** Five factors shown in order, each with score, qualitative label, and 1-2 sentence explanation.

**Per-factor content structure:**

```
[Factor name]: [User's score]/100 ([qualitative label])
[1-2 sentence AI-generated explanation referencing user-specific data]
```

**Qualitative labels by score range:**
- 0-25: low
- 26-50: moderate-low
- 51-65: moderate
- 66-80: moderate-high
- 81-100: high

**Note on inverted factors:** For Skill Differentiation and Career Portability, display the **raw score** (not the inverted score used in the composite). This is what the user wants to see. The score breakdown should show:
- Skill Differentiation: [raw score, where higher = more differentiated]
- Career Portability: [raw score, where higher = more portable]

A note in the UI clarifies: "Higher is better for Skill Differentiation and Career Portability. Higher is more concerning for the other three factors."

**Per-factor explanation prompts:** See prompt template 6.9.2 below.

### 6.5 Report Section 3: Task-by-Task Analysis

**Layout:** Each task the user reported time on (excluding "None" selections) shown as its own block. Sort by user's reported time, highest first.

**Per-task content structure:**

```
[Task name] — [User's reported time %]

Status: [Status label]
[1-3 sentence AI-generated personalized analysis]
What's left for humans: [Static content from task library]
```

**Status labels (deterministic, mapped from AR ranges):**

| AR Range | Status Label |
|---|---|
| 0-25 | Largely AI-resistant |
| 26-45 | Augmented, role evolving |
| 46-65 | Significantly augmented |
| 66-80 | Heavily augmented today, increasingly automated |
| 81-100 | Among the most automated work in this category |

**Content source for each block:**
- Task name: from user's selection in Section 5 Question B1
- User's reported time %: from the user's button selection (midpoint of range)
- Status label: derived from task's AR in role config
- Personalized analysis: AI-generated using prompt template 6.9.3
- "What's left for humans": static content from task library (Section 4.X.1)

**Tasks shown:** Only tasks where user reported >0% time. If user selected "None" for a task, don't show that task in the analysis.

### 6.6 Report Section 4: Top 3 Pivot Paths

**Layout:** Three pivot paths shown in order of fit score (highest first). Each path is a substantial block.

**Per-path content structure:**

```
[Path number]. [Path name] [Provenance badge: 🟢 Established | 🟡 Emerging | 🟠 Forecast]

Why this fits you:
[2-3 sentence AI-generated explanation]

What it looks like day-to-day:
[Description from path metadata in Section 4.X.2]

Salary range: [From path metadata]
Timeline to pivot: [From path metadata]
Skill gaps to close: [From path metadata]
Required experience: [From path metadata]

[Optional expandable: "Why we picked this path for you"]
- Lists the specific user signals that scored this path highly
- 3-5 bullet points
```

**Content source per path:**
- Path number (1, 2, 3): based on fit score ranking from selection algorithm
- Path name and provenance badge: from path metadata
- "Why this fits you": AI-generated using prompt template 6.9.4
- All other content (description, salary, timeline, skill gaps, experience): directly from path metadata in Section 4.X.2

**On-screen interactivity:** Each path can be expandable for the "Why we picked this" detail. PDF version shows everything inline (no expansion).

### 6.7 Report Section 5: 30-Day Action Plan

**Layout:** Three numbered actions, each with a header and 2-3 sentence detail.

**Content structure:**

```
Week 1: [Action 1 header]
[Action 1 detail — 2-3 sentences]

Week 2-3: [Action 2 header]
[Action 2 detail]

Week 4: [Action 3 header]
[Action 3 detail]
```

**Action template framework:**

The three actions follow a consistent pattern across all roles, with role-specific customization:

**Action 1: Audit and deepen your current AI tool fluency**

Adapts based on user's tool count:
- 0-1 tools: "Spend 2-3 hours getting fluent with [top recommended tool for role]"
- 2-3 tools: "Identify one workflow you do manually each week. Rebuild it using [tool] over the next 7 days."
- 4+ tools: "Pick the tool you use least. Find 3 use cases for it in your work this week."

Role-specific top recommended tools:
- Software Engineer: Cursor or Claude Code
- Marketing Manager: ChatGPT + a marketing-specific tool (Jasper, HubSpot AI)
- Content Creator: Claude or ChatGPT for drafting + Perplexity for research
- Customer Success: ChatGPT for communications + the user's CS platform's AI features
- Product Manager: Claude or ChatGPT + AI analytics tools

**Action 2: Have one conversation with someone on your top pivot path**

Generic template, customized with the user's top pivot path name:
"Find a [pivot path name] who made this transition in the last 2 years. Use LinkedIn or your existing network. Have one 30-minute conversation. Ask three questions:
1. How did you make the transition?
2. What would you do differently in hindsight?
3. What should I learn first?"

**Action 3: Build a portfolio artifact aligned to your top pivot path**

Templates per pivot path (selected based on user's #1 pivot path):

*If top path is AI Engineer:* "Build a small RAG application using OpenAI or Anthropic APIs. It doesn't need to be production-quality — it needs to be a learning experience and a portfolio artifact you can talk about."

*If top path is ML/AI Platform Engineer:* "Deploy an open-source model (e.g., Llama 3) on a small VM or cloud service. Add basic monitoring. Document the process."

*If top path is Forward Deployed Engineer:* "Identify a real business problem at your current company that could be solved with an LLM. Write a 1-page proposal with specific implementation approach. Share it with one stakeholder."

*If top path is Engineering Manager:* "Volunteer to lead one cross-functional initiative this month. Document your approach to coordination and decision-making."

*If top path is AI Marketing Strategist:* "Audit your current marketing stack. Identify 3 workflows that could be AI-augmented. Build a 1-page proposal showing time savings and required investment."

*If top path is Content Operations Manager:* "Set up an AI-augmented content workflow for one specific content type at your current job. Document the quality control process."

*If top path is SME-Niched Specialist Writer:* "Write one in-depth piece in your target specialization. Get it published or shared in a way that establishes credibility."

*If top path is Strategic Account Manager:* "Pick your highest-value account. Build a strategic account plan document that goes beyond standard CS frameworks."

*If top path is AI Product Manager:* "Build a small AI feature prototype (or detailed PRD) for a product problem at your current company. Get feedback from one engineer and one customer."

*If top path is Vertical AI Specialist (any role):* "Write a detailed analysis of how AI is reshaping [your industry]. Publish it on LinkedIn, your blog, or a substack. 1500-2500 words."

*Fallback template (for paths without specific templates):* "Identify a concrete project that demonstrates skills for [pivot path]. Allocate 8-10 hours over the month to build or write it. Make it shareable."

**AI customization layer:** A single AI call wraps these template-derived actions with personalization based on the user's role, seniority, and current tools (prompt template 6.9.5).

### 6.8 Report Sections 6 and 7: Progress Tracking and What's Next

#### Section 6: Progress Tracking

**Static content (same for all users):**

```
Your AI Disruption Score isn't fixed. Specific actions can lower it 
meaningfully over 6-12 months:

• Moving into a less-exposed adjacent role lowers Task Automatability
• Building stakeholder relationships increases Skill Differentiation  
• Developing specialized expertise increases Career Capital Portability
• Becoming the AI go-to person on your team increases your durability

[Personalized line — AI-generated]

Retake this assessment in 6 months to see how your score has changed.

[Button: Schedule a 6-month retake reminder]
```

**Personalized line:** AI-generated using prompt template 6.9.6. Identifies the user's most-movable factor and suggests a specific action.

**Retake reminder button:** Sends an iCal/Google Calendar invite for 6 months out with the assessment URL.

#### Section 7: What's Next

**Static content (same for all users, with role substitution):**

```
Your weekly AI briefing for [Role] starts Sunday.

Every week, we'll send you the AI news and tools that matter for your 
specific role — including which new tools are reshaping [Role] work.

[If not yet subscribed: Subscribe button]
[If already subscribed: ✓ Subscribed indicator]

Coming soon for [Role]s worried about AI displacement:
• The [Role] Pivot Playbook — deep-dive on each pivot path
• LinkedIn and resume positioning for AI-era roles

[Sign up to be notified when these launch]

We'll only email you about products that are directly relevant to your role.
```

**Variables:** `[Role]` substituted with the user's assessment role (e.g., "Software Engineers", "Marketing Managers").

**Future products notice:** Don't promise specific dates. "Coming soon" is honest; "launching in March" might not be.

### 6.9 AI prompt templates

All prompts use Claude Sonnet (current production model) with temperature 0.3-0.5. Each prompt returns plain text unless specified otherwise.

#### 6.9.1 Opening summary prompt

```
You are generating a personalized opening summary for an AI Job Risk Assessment report.

USER PROFILE:
- Role: {role}
- Industry: {industry}
- Seniority: {seniority}
- Years of experience: {yearsExperience}

SCORE DATA:
- Composite score: {compositeScore}/100
- Tier: {tier}
- Top 3 contributing factors (highest to lowest impact on score): {topFactors}

TOP PIVOT PATHS (names only):
1. {pivotPath1Name}
2. {pivotPath2Name}
3. {pivotPath3Name}

Write a 2-3 sentence personalized opening summary that:
1. Honestly reflects the tier (no false reassurance for high scores, no doom for low scores)
2. References 1-2 specific factors that drive the user's score
3. Hints at the direction their pivot paths point
4. Speaks directly to the user in second person ("you", "your work")
5. Matches the urgency to the tier:
   - Severe Risk: clear-eyed about urgency, but not alarmist
   - High Risk: serious tone with constructive framing
   - Moderate-High Risk: balanced — real pressure, real options
   - Moderate Risk: calm, with focus on differentiation
   - Low Risk: reassuring but not dismissive

Avoid:
- Generic phrases like "great job" or "challenging times"
- Doom language or hyperbole
- Specific salary numbers (those come later in the report)
- Promising specific outcomes

Return only the 2-3 sentences, no headers or formatting.
```

#### 6.9.2 Factor explanation prompt

```
You are generating a personalized explanation of one factor score in an AI Job Risk Assessment.

FACTOR: {factorName}
USER'S SCORE: {factorScore}/100
QUALITATIVE LABEL: {qualitativeLabel}

CONTRIBUTING INPUTS (top 2-3 things that drove this score for this user):
{contributingInputs}

FACTOR DEFINITION: {factorDefinition}

Write 1-2 sentences that:
1. State what this factor's score means in plain language
2. Reference at least one specific contributing input from the user's profile
3. Use second person ("you", "your")
4. Be neutral in tone (this is data, not advice yet)

Return only the 1-2 sentences.
```

**Contributing inputs by factor:**
- *Task Automatability:* Top 2-3 highest-time tasks with their ARs
- *Adoption Velocity:* Industry, employer adoption posture, headcount change
- *Skill Differentiation:* The 1-2 highest-rated differentiation responses
- *Career Portability:* Years of experience, specialization area
- *Time-to-Impact Urgency:* Seniority, structural change signal

#### 6.9.3 Task analysis prompt

```
You are generating a personalized analysis of a single task for an AI Job Risk Assessment.

TASK: {taskName}
USER'S TIME ON TASK: {userTimePercent}%
TASK AUTOMATABILITY RATING: {automatabilityRating}/100
TASK STATUS LABEL: {statusLabel}
TASK REASONING (factual basis): {taskReasoning}

USER CONTEXT:
- Role: {role}
- Seniority: {seniority}

Write 1-3 sentences that:
1. Reference the user's specific time allocation
2. Frame the task's current state and trajectory using the task reasoning as factual basis
3. Match urgency to the AR (AR >75 = more urgent framing; AR <30 = reassuring)
4. Use second person ("you", "your")
5. If this task takes >25% of their time, acknowledge it as a significant part of their week

Do not:
- Invent specific tool names not in the task reasoning
- Make precise time predictions ("In exactly 18 months...")
- Recommend specific actions (those come in the action plan section)

Return only the 1-3 sentences.
```

#### 6.9.4 Pivot path "Why this fits you" prompt

```
You are generating a "Why this fits you" explanation for a pivot path recommendation.

PIVOT PATH: {pathName}
PATH DESCRIPTION: {pathDescription}

USER PROFILE:
- Role: {role}
- Seniority: {seniority}
- Years of experience: {yearsExperience}
- Top 3 highest-time tasks: {topTasks}
- AI tools currently used: {toolsUsed}
- Key strengths from differentiation responses: {strengthsAnswers}

Write 2-3 sentences explaining why this specific path makes sense for this specific user.

Requirements:
1. Reference 1-2 specific things from the user's profile (a task they do, a tool they use, an answer they gave)
2. Connect those specifics to why this path is a fit
3. Use second person ("you", "your")
4. Avoid generic statements like "This is a great fit for your skills"
5. Be honest — if the user has clear gaps for this path, acknowledge them briefly

Return only the 2-3 sentences.
```

#### 6.9.5 Action plan prompt

```
You are generating a personalized 30-day action plan based on an AI Job Risk Assessment.

USER PROFILE:
- Role: {role}
- Seniority: {seniority}
- Current AI tool count: {toolCount}
- Tools currently used: {toolsUsed}
- Top pivot path: {topPivotPathName}
- Top pivot path skill gaps: {topPivotPathSkillGaps}

ACTION TEMPLATES (use these as a foundation, customize for the user):
Action 1 template: {action1Template}
Action 2 template: {action2Template}  
Action 3 template: {action3Template}

Generate 3 specific, doable actions for the next 30 days. For each:
1. Provide a clear 1-line header (action verb + object)
2. Write 2-3 sentences of detail
3. Be concrete and specific (not "learn AI" but "spend 2 hours on Cursor docs")
4. Tailor to the user's seniority and tool count

Return as JSON:
{
  "action1": {"header": "...", "detail": "..."},
  "action2": {"header": "...", "detail": "..."},
  "action3": {"header": "...", "detail": "..."}
}
```

#### 6.9.6 Progress tracking personalization prompt

```
You are identifying the highest-leverage action a user could take to improve their AI Job Risk score.

FACTOR SCORES (lower is better for first two, higher is better for the differentiation/portability):
- Task Automatability: {factor1}/100
- Adoption Velocity: {factor2}/100  
- Skill Differentiation (raw): {factor3Raw}/100
- Career Portability (raw): {factor4Raw}/100
- Time-to-Impact Urgency: {factor5}/100

USER PROFILE:
- Role: {role}
- Top pivot path: {topPivotPath}

Identify the single factor most "movable" for this user — the one where targeted action over 6 months would have the largest impact on lowering their composite score.

Write 1-2 sentences in this format:
"Based on your profile, the highest-leverage move you could make in the next 6 months is [specific action that improves the most movable factor]."

Be specific. Don't say "develop more expertise" — say "specializing in one durable area like distributed systems or security engineering."

Return only the 1-2 sentences.
```

### 6.10 Quality and consistency controls

**Temperature:** All prompts use temperature 0.3-0.5. Sweet spot between rigid and varied.

**Output validation:** Each AI response is validated before display:
- Length check: within expected range (varies per prompt)
- No hallucinated specifics: no salary numbers not in input, no specific company names not in input, no specific dates
- Tone check: no extreme alarm language ("disaster", "doomed"), no false reassurance ("nothing to worry about")
- Second-person check: uses "you" appropriately

If validation fails, fall back to a deterministic template for that section. Log validation failures for prompt improvement.

**Caching:** All AI-generated content is stored in `assessment_results.report_content` (JSON) keyed by section. Same assessment produces the same report on second view. This is critical for shareability — if a user shares their result link, viewers must see the same report.

**Regeneration:** Reports are not regenerated unless explicitly requested (e.g., new pivot path library released). Users always see their original report unless they retake the assessment.

### 6.11 Performance and cost

**API calls per report:**
- 1 call for opening summary
- 1 call for all 5 factor explanations (batched)
- 1 call for all task analyses (batched, varies by user)
- 1 call for all 3 pivot path "why this fits you" (batched)
- 1 call for action plan
- 1 call for progress tracking personalization
- **Total: ~6 calls per report**

**Token usage:**
- Input tokens per report: ~3,000-5,000
- Output tokens per report: ~1,500-2,500
- Estimated cost per report with Claude Sonnet: $0.03-0.06

**Generation time:**
- Sequential: 12-20 seconds total
- Parallel where possible: 6-10 seconds total

**Streaming UX:**
Recommended: stream sections as they complete rather than waiting for the full report. Show the headline score immediately (deterministic), then sections appear progressively. This dramatically improves perceived performance.

### 6.12 PDF generation

**Library recommendation:** Use Puppeteer (self-hosted on Vercel/Node) or an external service (DocRaptor, PDFShift). Puppeteer gives more control but requires more setup.

**Generation trigger:**
- Lazy generation: first time user requests PDF download, generate and cache URL in `assessment_results.pdf_url`
- Subsequent downloads serve cached PDF
- If report content is regenerated, invalidate PDF cache

**PDF structure (12 pages):**

| Page | Content |
|---|---|
| 1 | Cover page: title, role, score, tier, date, optional "Prepared for [name]" |
| 2-3 | Score breakdown: composite score visual + 5 factor scores with explanations |
| 4-6 | Task-by-task analysis: each task as a block (page breaks as needed) |
| 7-9 | Top 3 pivot paths: one path per page with full metadata |
| 10 | 30-day action plan: 3 numbered actions |
| 11 | Progress tracking + newsletter info + future products teaser |
| 12 | Footer page: methodology summary, calibration date, URL |

**Design specs:**
- Use My Weekly AI brand colors (purple/violet accent based on existing site)
- Sans-serif for headers (system font stack), serif for body text (Charter, Source Serif Pro, or similar)
- Generous whitespace
- Subtle page numbers in footer
- Footer on every page: "AI Job Risk Assessment | My Weekly AI | myweekly.ai/ai-job-risk"
- No advertising or aggressive product pitching
- Score visualization on cover should be impactful (ring/gauge, large numbers)

**File naming:** `AI-Job-Risk-Report-{Role}-{Date}.pdf` (e.g., `AI-Job-Risk-Report-Software-Engineer-2026-05-20.pdf`)

### 6.13 Implementation notes for Claude Code

**Service architecture:**
```
lib/ai-job-risk/
├── report-generation/
│   ├── generate-report.ts          # Top-level orchestrator
│   ├── prompts/
│   │   ├── opening-summary.ts      # Each prompt as its own module
│   │   ├── factor-explanation.ts
│   │   ├── task-analysis.ts
│   │   ├── pivot-path-fit.ts
│   │   ├── action-plan.ts
│   │   └── progress-personalization.ts
│   ├── templates/
│   │   ├── tier-descriptions.ts
│   │   ├── action-templates.ts     # Per role and per pivot path
│   │   └── static-content.ts       # Sections 6 and 7
│   ├── validation.ts               # Output validators
│   └── pdf-generation.ts           # PDF rendering
```

**Key implementation principles:**

1. **Separate the data layer from the AI generation layer.** Scoring is one service, report generation is another. They don't share code.

2. **Each AI prompt is its own module** with clear inputs, outputs, and validation. Easy to test and iterate.

3. **Store report content persistently** in `assessment_results.report_content` as structured JSON. Don't regenerate on each view.

4. **PDF generated lazily** — first time someone requests download, generate and cache URL.

5. **All AI calls server-side** — Anthropic API keys must never be exposed to client.

6. **Deterministic fallback for every AI section** — if API call fails, user still sees a functional report with template content. Log the failure but don't fail the user-visible flow.

7. **Parallel generation where possible** — opening summary, factor explanations, task analysis, pivot paths, action plan, and progress line can all run in parallel after the deterministic scoring completes.

**Report content JSON shape:**
```typescript
{
  generatedAt: string,
  version: string, // For tracking prompt versions
  sections: {
    openingSummary: string,
    factorExplanations: {
      taskAutomatability: string,
      adoptionVelocity: string,
      skillDifferentiation: string,
      careerPortability: string,
      timeToImpactUrgency: string
    },
    taskAnalyses: Array<{
      taskName: string,
      timePercent: number,
      analysis: string
    }>,
    pivotPathFits: {
      [pathId: string]: string
    },
    actionPlan: {
      action1: {header: string, detail: string},
      action2: {header: string, detail: string},
      action3: {header: string, detail: string}
    },
    progressLine: string
  }
}
```

This structure makes the report content queryable, updateable, and reusable for the PDF.

---

## Section 7: Landing Page Specification

This section specifies the role-specific assessment landing pages (`/ai-job-risk/[role]`) and the hub page (`/ai-job-risk/`). These pages are the primary entry points for assessment traffic, optimized for SEO search intent and conversion to assessment completion.

### 7.1 Page architecture overview

Two distinct page types:

**Type 1: The Hub Page** — `/ai-job-risk/`
- Single page listing all 5 role assessments
- Catches generic searches like "AI job risk assessment"
- Acts as internal linking hub for SEO
- Captures email signups from visitors whose role isn't yet covered

**Type 2: Role-Specific Landing Pages** — `/ai-job-risk/[role]/`
- Five pages (one per launch role)
- Each targets a specific keyword cluster ("will AI replace [role]")
- Primary conversion surface (~95% of conversions expected here)
- Each has nearly identical structure with role-specific content

### 7.2 Role-specific landing page structure

Vertical scroll layout, mobile-first. Nine sections in this order:

1. Hero
2. Social proof bar
3. "What you'll learn" 
4. "How the assessment works"
5. Sample report preview
6. Methodology
7. FAQ
8. Final CTA
9. Footer

### 7.3 Role landing page: Hero section

**Primary headline (H1):**

Use search-intent-matching version: `Will AI Replace Your [Role] Job?`

Examples per role:
- Software Engineer: "Will AI Replace Your Software Engineering Job?"
- Marketing Manager: "Will AI Replace Your Marketing Job?"
- Content Creator: "Will AI Replace Your Writing Work?"
- Customer Success: "Will AI Replace Customer Success Managers?"
- Product Manager: "Will AI Replace Product Managers?"

**Tagline below H1:**
"Find out in 5 minutes."

**Subheadline:**
Template: "Take a 5-minute personalized assessment built specifically for [role plural]. Get your AI Disruption Score, a task-by-task analysis of what's at risk, and three concrete pivot paths tailored to your experience."

Examples per role:
- Software Engineer: "...built specifically for software engineers..."
- Marketing Manager: "...built specifically for marketers..."
- Content Creator: "...built specifically for writers and content creators..."
- Customer Success: "...built specifically for customer success professionals..."
- Product Manager: "...built specifically for product managers..."

**Primary CTA button:**
"Start the Assessment →"

**Microcopy below button:**
"Free. No login required to start. Takes 5-7 minutes."

**Visual element:**
Stylized score gauge with a partial report preview behind it, slightly blurred to suggest "this is what you'll see" without spoiling specifics. Use My Weekly AI brand colors (purple/violet accent).

**Mobile considerations:**
- CTA button must be visible without scrolling on average mobile screens
- Visual element below CTA, not next to it

### 7.4 Role landing page: Social proof bar

**Initial launch (no testimonials yet):**

```
Built on research from 20+ AI labs and publications
[Logo strip: OpenAI, Anthropic, Google DeepMind, MIT Tech Review, IEEE Spectrum, The Verge, TechCrunch, VentureBeat]
```

Reuse source logos from the existing newsletter site.

**Post-launch (after 500+ assessments per role):**

Replace with:
```
"[Authentic quote from real assessment taker]" 
— [Role] at [Company type]

Based on [count]+ assessments | Updated quarterly with latest AI capability data
```

### 7.5 Role landing page: "What you'll learn" section

**Section heading:** "What you'll learn about your job."

**Four value points with icons and 2-3 sentence descriptions:**

**1. Your AI Disruption Score**
"A single number (0-100) showing your overall exposure to AI displacement, with a breakdown across five factors: task automatability, adoption velocity, skill differentiation, career portability, and time-to-impact urgency."

**2. Task-by-task analysis**
Role-specific framing. Template: "See exactly which parts of your work are exposed to AI today and which remain durable. For each task, you'll get a current status and 18-month trajectory based on what tools like [role-specific tools] are actually doing."

Role-specific tools to mention:
- Software Engineer: "Cursor, Claude Code, and GitHub Copilot"
- Marketing Manager: "ChatGPT, Jasper, and HubSpot AI"
- Content Creator: "Claude, ChatGPT, and AI content tools"
- Customer Success: "Gainsight AI, ChurnZero, and customer service agents"
- Product Manager: "AI product copilots, analytics tools, and emerging agentic systems"

**3. Three personalized pivot paths**
"Based on your experience and strengths, get three specific career directions that compound your existing skills into more durable AI-era roles. Includes salary ranges, timeline estimates, and skill gaps for each path."

**4. A 30-day action plan**
"Three concrete actions you can take in the next 30 days — not generic 'learn AI' advice, but specific moves tailored to your situation."

### 7.6 Role landing page: "How it works" section

**Section heading:** "How it works."

**Three steps (horizontal on desktop, stacked on mobile):**

**1. Tell us about your work**
"Answer 14 questions about your role, how you spend your time, and your environment. Takes 5-7 minutes."

**2. Get your personalized report**
"We calculate your score using a 5-factor methodology refined quarterly with current AI capability data. You'll see your full report immediately — no waiting for an email."

**3. Take action**
"Use your pivot path recommendations and 30-day action plan to start making your work more durable."

### 7.7 Role landing page: Sample report preview

**Section heading:** "What your report looks like."

**Content:** Visual mockup or screenshot of an actual sample report showing:
- Score visualization
- One factor explanation
- One task analysis block
- One pivot path block

**Framing copy below the preview:**
"Here's a sample report for a [seniority] [role] at a [industry] company. Yours will be personalized to your exact responses."

Use a representative example per role (e.g., "Senior Software Engineer at a SaaS company" for the Software Engineer page).

**Design considerations:**
- Sample report image must be high resolution and legible
- On mobile, may show only one or two report sections enlarged rather than full report

### 7.8 Role landing page: Methodology section

**Section heading:** "The methodology."

**Content (deterministic, same across all roles):**

```
The assessment uses a 5-factor model that weighs:

• Task Automatability (40%) — what percentage of your time goes to 
  tasks AI tools currently handle well

• Adoption Velocity (20%) — how fast displacement is happening at 
  your employer and in your industry

• Skill Differentiation (20%) — what makes your work hard to replicate

• Career Portability (10%) — how easily you can pivot to adjacent 
  durable roles

• Time-to-Impact Urgency (10%) — how soon major changes are likely

The task automatability ratings are recalibrated quarterly based on 
actual AI tool capabilities. Salary data and pivot path information 
is updated every six months from market sources including Levels.fyi, 
Glassdoor, and recent industry hiring reports.
```

**Optional link:** "Read our full methodology" → links to a more detailed methodology page (defer for post-launch)

### 7.9 Role landing page: FAQ section

**Section heading:** "Frequently asked questions."

**FAQ items (use accordion expansion, only first one open by default):**

**Is this free?**
"Yes. The assessment and report are completely free. You'll be subscribed to our weekly AI newsletter for [role plural] when you receive your full report, but you can unsubscribe anytime."

**How accurate is the assessment?**
"The methodology is built on a 5-factor model with task automatability ratings recalibrated quarterly. It's the most rigorous personalized AI displacement assessment available, but it's a model, not a prediction. The goal is to give you a clear-eyed view of your situation, not a precise forecast."

**Will my employer see my results?**
"No. Your results are private and tied to your email address. We don't share data with employers, recruiters, or anyone else. Read our Privacy Policy for details."

**What if my role isn't listed?**
"We're launching with five roles: Software Engineer, Marketing Manager, Content Creator, Customer Success, and Product Manager. If yours isn't here yet, sign up for our newsletter and we'll let you know when your role assessment goes live."

**How is this different from other AI career tools?**
"Most generic AI assessments give the same advice to everyone. This assessment uses your specific tasks, your specific industry, and your specific experience to produce a score and recommendations that actually fit your situation. The pivot path recommendations are tailored to your strengths, not generic 'learn AI' advice."

**Can I retake the assessment?**
"Yes. We recommend retaking every 6 months to track how your situation evolves. You can schedule a 6-month reminder when you complete the assessment."

**How long is the assessment?**
"14 questions across 5 sections. Most people complete it in 5-7 minutes."

### 7.10 Role landing page: Final CTA section

**Section content:**

```
Find out where you stand.

5 minutes. Free. Built specifically for [role plural].

[Start the Assessment →]
```

### 7.11 Role landing page: Footer

Standard footer matching the rest of the site. Important: include a link to the existing newsletter page for the same role (`/for/[role]`), providing an alternative for visitors who don't want to take the assessment but want AI news for their role.

### 7.12 Hub page (`/ai-job-risk/`) structure

**Page structure:**

1. Hero (general framing)
2. Role selector (5 cards)
3. "What the assessment does" (brief)
4. Methodology summary
5. General FAQ
6. Newsletter CTA for non-listed roles
7. Footer

### 7.13 Hub page: Hero section

**Headline:** "Will AI Replace Your Job?"

**Tagline:** "Take a 5-minute role-specific assessment."

**Subheadline:** "Get a personalized AI Disruption Score, a breakdown of what's at risk in your specific work, and three pivot paths tailored to your experience. Built specifically for your role, updated quarterly with current AI capability data."

**Primary CTA:** Choose your role below to start (scrolls to role selector)

### 7.14 Hub page: Role selector

**Section heading:** "Choose your role to begin."

**Layout:**
- Desktop: 5 cards in a row (or 3 + 2)
- Mobile: Stacked vertically

**Each card structure:**

```
┌────────────────────────────────┐
│  [Role-specific icon]          │
│                                │
│  [Role name]                   │
│                                │
│  [One-sentence question]       │
│                                │
│  [Take the Assessment →]       │
└────────────────────────────────┘
```

**The 5 cards (in this order):**

1. **Software Engineer** — "How exposed is your dev work to AI displacement?"
2. **Marketing Manager** — "How is AI reshaping marketing work?"
3. **Content Creator** — "Is AI replacing your writing work?"
4. **Customer Success** — "Are AI agents coming for CS roles?"
5. **Product Manager** — "Where do PMs land in the AI shift?"

### 7.15 Hub page: Secondary sections

**"What you'll get" (brief version):**

```
What you'll get with every assessment:

• Your AI Disruption Score (0-100) across 5 factors
• Task-by-task analysis of your specific work
• 3 personalized pivot paths
• A 30-day action plan
• A free weekly AI brief tailored to your role
```

**Methodology summary:** Same content as role page Section 7.8 (above), unmodified.

**General FAQ:** Subset of role page FAQ items. Include "Is this free?", "Will my employer see my results?", "What if my role isn't listed?", and "How is this different from other AI career tools?"

**Newsletter CTA for non-listed roles:**

```
Don't see your role?

We're adding more role assessments. Get notified when yours launches.

[Email signup form: "Your email" + "Notify me" button]

Meanwhile, get our weekly AI brief personalized to your work.

[Subscribe to the newsletter]
```

The dual CTA captures both "notify me when my role launches" intent and immediate newsletter signup intent.

### 7.16 SEO meta tags

#### 7.16.1 Per-role landing page meta tags

**Title tag template (55-60 chars):**
`Will AI Replace [Role]? Take the Free Assessment`

Per role:
- Software Engineer: "Will AI Replace Software Engineers? Free Assessment"
- Marketing Manager: "Will AI Replace Marketing Managers? Free Assessment"
- Content Creator: "Will AI Replace Writers? Free 5-Minute Assessment"
- Customer Success: "Will AI Replace Customer Success? Free Assessment"
- Product Manager: "Will AI Replace Product Managers? Free Assessment"

**Meta description template (150-160 chars):**
"A free 5-minute AI Job Risk Assessment built specifically for [role plural]. Get your AI Disruption Score, task-by-task analysis, and 3 pivot paths."

**OG title:** Same as title tag, slightly more conversational
**OG description:** Same as meta description
**OG image:** 1200×630px image showing sample score visualization with role name
**Canonical URL:** `https://myweekly.ai/ai-job-risk/[role-slug]`

**Schema markup (JSON-LD):**
- WebPage schema with name, description, URL
- Quiz schema indicating this is an interactive assessment
- BreadcrumbList linking back to hub page

#### 7.16.2 Keyword targets per role

**Software Engineer assessment:**
- Primary: "will AI replace software engineers"
- Secondary: "AI software engineer displacement", "software engineer AI risk", "is software engineering safe from AI", "AI replacing programmers", "software engineer career AI"

**Marketing Manager assessment:**
- Primary: "will AI replace marketing managers"
- Secondary: "AI marketing job displacement", "marketing career AI risk", "is marketing safe from AI", "AI marketing jobs"

**Content Creator assessment:**
- Primary: "will AI replace writers"
- Secondary: "AI replacing copywriters", "content writer AI displacement", "is freelance writing dead", "AI replacing content creators", "will AI replace copywriters"

**Customer Success assessment:**
- Primary: "will AI replace customer success"
- Secondary: "AI replacing customer service", "CSM AI displacement", "customer success AI risk", "AI agents customer service"

**Product Manager assessment:**
- Primary: "will AI replace product managers"
- Secondary: "AI product manager career", "PM displacement AI", "product manager AI risk", "AI product management"

#### 7.16.3 Hub page meta tags

**Title tag:** "AI Job Risk Assessment — Free 5-Minute Personalized Score"
**Meta description:** "Take a free personalized assessment for your specific role. Get your AI Disruption Score, what's at risk in your work, and 3 pivot paths."
**OG image:** Generic My Weekly AI branded image showing the 5 role categories
**Canonical URL:** `https://myweekly.ai/ai-job-risk/`

### 7.17 Mobile considerations

The assessment will receive significant mobile traffic. Specific requirements:

- Hero CTA button visible without scrolling on average mobile screens (e.g., iPhone 12+ standard view)
- Sample report preview readable on mobile — consider showing only one section enlarged rather than full report
- FAQ items use accordion expansion on mobile, only first one open by default
- Sticky CTA button appearing after user scrolls past hero (footer-anchored)
- Page weight under 2MB for fast mobile load
- All tap targets minimum 44×44px
- No horizontal scroll on any device width 320px+

### 7.18 A/B testing roadmap (post-launch)

The landing page is the highest-leverage thing to optimize after launch. Recommended tests in priority order:

**Test 1: Headline variants** (2-week test minimum)
- A: "Will AI replace your [role] job?" (search-intent-matching)
- B: "How exposed is your [role] to AI displacement?" (more sophisticated)
- C: "What's your AI Disruption Score?" (curiosity-driven)

**Test 2: CTA button text**
- A: "Start the Assessment →"
- B: "Take the 5-minute Assessment →"
- C: "Get Your AI Disruption Score →"

**Test 3: Microcopy under CTA**
- A: "Free. No login required to start. Takes 5-7 minutes."
- B: "Free. 5-7 minutes. Personalized to your work."
- C: "Join 1,000+ [role plural] who've already taken the assessment." (once true)

**Test 4: Hero visual**
- A: Stylized score gauge with blurred report
- B: Clean illustration
- C: Actual report screenshot

**Test 5: Sample report placement**
- A: Section 5 (current)
- B: Move to right after hero (more aggressive proof)
- C: Remove entirely, replace with anonymized testimonials

Each test should run for 2+ weeks with statistical significance threshold before drawing conclusions.

### 7.19 Implementation notes for Claude Code

**Component structure:**
```
components/ai-job-risk/landing/
├── HeroSection.tsx               # Reused across all role pages
├── SocialProofBar.tsx            # Logo strip
├── WhatYouLearnSection.tsx       # 4-value-point grid
├── HowItWorksSection.tsx         # 3-step explanation
├── SampleReportPreview.tsx       # Sample report mockup
├── MethodologySection.tsx        # 5-factor explanation
├── FAQSection.tsx                # Accordion FAQ
├── FinalCTASection.tsx           # Closing CTA
└── HubPage/
    ├── HubHero.tsx
    └── RoleSelector.tsx          # 5-card grid
```

**Per-role content:**
Use a content config file per role that the landing page components consume:
```
content/ai-job-risk/landing/
├── software-engineers.ts
├── marketing-managers.ts
├── content-creators.ts
├── customer-success.ts
└── product-managers.ts
```

Each config exports the role-specific copy variables (headline, subheadline, tool mentions, sample report context, etc.) that the shared landing page components use.

**Static generation:**
These pages should be statically generated (Next.js `generateStaticParams` for the `[role]` segment) for optimal SEO and load performance. No need for client-side data fetching on landing pages.

**Image optimization:**
- Use Next.js Image component for all visuals
- Provide proper width, height, and alt text
- OG images should be pre-generated and stored as static assets

**Analytics events to track on landing pages:**
- `landing_page_view` (with role parameter)
- `cta_click` (with section parameter — hero, final, etc.)
- `faq_expand` (with question parameter)
- `sample_report_view` (when user scrolls to the section)
- `assessment_start` (when user clicks through to quiz)

---

## Section 8: Data Capture & Analytics

### 8.1 User data storage

The assessment integrates with the **existing subscriber record system**. See Section 11 for the full data model and integration specification.

**Summary:**
- Assessment results are stored as a related record linked to the subscriber account (one-to-many: a subscriber can have multiple assessments over time)
- Subscriber records are created or updated when a user completes the assessment
- Newsletter profile fields are pre-populated from assessment responses
- Anonymous assessment progress is saved in localStorage before email/auth capture

For each completed assessment, store:

- Unique result ID (for shareable URL)
- Linked subscriber ID
- Role and industry (as provided in assessment — may differ from profile)
- All assessment responses
- Computed scores (composite + 5 factors)
- Selected pivot paths
- Timestamp
- Referrer (URL parameter tracking)
- Completion time
- Whether this is a retake (sequence number)

### 8.2 Anonymization for benchmarking

Maintain a separate anonymized table for percentile calculations:
- Role
- Industry
- Seniority
- Composite score and factor scores
- No PII

### 8.3 Analytics events to track

[TBD — full event list with parameters, integration with existing analytics]

Key events at minimum:
- `assessment_landing_view`
- `assessment_started`
- `assessment_section_completed` (per section)
- `assessment_abandoned` (with last section reached)
- `assessment_completed`
- `email_submitted`
- `pdf_downloaded`
- `result_shared` (with channel)

### 8.4 GDPR / privacy considerations

[TBD — consent flow, data deletion requests, privacy policy updates needed]

---

## Section 9: Technical Requirements

### 9.1 Tech stack

Building into the existing myweekly.ai codebase. Current site appears to be Next.js based on URL patterns and Vercel deployment hints. Build the assessment as new pages and API routes in the existing application.

### 9.2 Recommended file structure

```
myweekly.ai/
├── app/
│   ├── ai-job-risk/
│   │   ├── page.tsx                          # Hub page
│   │   ├── [role]/
│   │   │   ├── page.tsx                      # Role landing page
│   │   │   ├── quiz/
│   │   │   │   └── page.tsx                  # Quiz interface
│   │   │   └── results/
│   │   │       └── [resultId]/
│   │   │           └── page.tsx              # Results page
│   ├── api/
│   │   ├── ai-job-risk/
│   │   │   ├── submit/
│   │   │   │   └── route.ts                  # Submit assessment, get score
│   │   │   ├── result/
│   │   │   │   └── [resultId]/
│   │   │   │       └── route.ts              # Fetch result
│   │   │   └── pdf/
│   │   │       └── [resultId]/
│   │   │           └── route.ts              # Generate PDF
├── lib/
│   ├── ai-job-risk/
│   │   ├── scoring.ts                        # Core scoring algorithm
│   │   ├── roles/
│   │   │   ├── software-engineers.ts         # Role config (task library, pivot paths, base urgency)
│   │   │   ├── marketing-managers.ts
│   │   │   └── [role].ts
│   │   ├── industry-multipliers.ts           # Industry config
│   │   ├── report-generation.ts              # AI-assisted narrative generation
│   │   └── pdf-generation.ts                 # PDF rendering
```

### 9.3 Integration with existing newsletter infrastructure

The assessment flow and the newsletter signup flow are **unified** rather than parallel. See **Section 11: Integration with Existing Newsletter System** for full specification including data model, user flows, edge cases, and dashboard integration.

**Summary of key integration points:**

- The existing `/auth/signin` page offers Google OAuth and Magic Link — the assessment auth gate uses the same two options
- Subscriber records are created or updated based on email match
- Newsletter profile fields (Job Role, Industry, optional interest fields) are pre-populated from assessment data
- Assessment results are accessible from the user's dashboard as a new section
- The unique result URL works without authentication (for shareability) but the dashboard requires authentication (existing behavior)

### 9.4 Third-party services needed

- **PDF generation:** Consider Puppeteer (self-hosted) or external service (DocRaptor, PDFShift). Recommendation: [TBD]
- **AI content generation:** Anthropic Claude API for narrative report content
- **Email delivery:** Existing newsletter infrastructure
- **Analytics:** Existing analytics + custom event tracking

### 9.5 Performance requirements

- Assessment submission to result display: under 5 seconds
- PDF generation and email delivery: under 60 seconds
- Mobile-first design — significant traffic will be mobile
- Quiz state should persist if user abandons (cookie or localStorage)

---

## Section 10: Implementation Phases

### Phase 1: MVP (target: 60-90 days)

**Scope:**
- **5 roles complete:** Software Engineers, Marketing Managers, Content Creators, Customer Success, Product Managers
- Full scoring algorithm
- On-screen results page
- Auth gate (Google OAuth + Magic Link)
- Basic PDF generation
- Integration with newsletter subscriber database
- Hub page (`/ai-job-risk/`) with all 5 role assessments listed
- Cross-links between assessment pages and existing `/for/[role]` newsletter pages

**Out of scope for MVP:**
- Additional roles beyond the 5
- Percentile benchmarking (use synthetic)
- Advanced analytics
- Social sharing optimizations
- Quiz progress save/resume

### Phase 2: Expansion (target: 90-180 days post-MVP)

**Scope:**
- Add 3-5 additional roles based on assessment data (which roles drove most traffic, conversion)
- Likely candidates based on existing newsletter audience: Data Scientist / ML Engineer, UX/Product Designer, Engineering Manager
- Improved PDF design
- Quiz progress save/resume
- Social sharing optimization
- A/B testing infrastructure for landing page copy
- Basic admin dashboard for monitoring assessment completion
- First quarterly task library audit
- First 6-month pivot path library audit

### Phase 3: Optimization (target: 180-365 days)

**Scope:**
- Full role coverage (12-15 roles total)
- Real percentile benchmarking from stored data
- Quarterly task library updates ongoing
- Optional second-pass assessment ("retake in 6 months")
- Foundation for paid product integration (pivot playbook upsells)
- Consider expanding to industry-vertical-specific variants if data supports

---

## Section 11: Integration with Existing Newsletter System

This section specifies how the assessment integrates with the existing My Weekly AI newsletter infrastructure. **The two flows are unified, not parallel** — assessment-takers and newsletter signups share the same subscriber accounts, dashboard, and authentication.

### 11.1 Existing system context

The existing newsletter system has the following relevant components:

**Authentication (`/auth/signin`):**
- Two options offered to users: Continue with Google (OAuth) and Magic Link (email-based)
- Both result in an authenticated session

**Newsletter profile:**
- Critical fields: **Job Role**, **Industry**
- Optional interest fields: "learn about new AI tools," "use AI to automate tasks," and similar
- Profile is editable from the dashboard at any time
- Profile drives newsletter content personalization

**Dashboard (`/dashboard`):**
- Authenticated users land here after signin
- Existing sections: My Briefings, Saved Articles, profile management
- Past newsletter archive accessible

### 11.2 Unified authentication flow

The assessment auth gate offers the **same two options** as the existing `/auth/signin` page. This consistency is intentional — it's the same authentication system, just contextually positioned differently.

**Auth gate UI on the assessment results page (after teaser):**

```
┌─────────────────────────────────────────────────┐
│  Your AI Disruption Score: 62 / 100             │
│  Risk Tier: Moderate-High                       │
│                                                 │
│  Get your full report:                          │
│  • Task-by-task analysis                        │
│  • Your top 3 pivot paths                       │
│  • Personalized 30-day action plan              │
│  • PDF version delivered to your inbox          │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ [G]  Continue with Google                │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ───────────── or ─────────────                 │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ your@email.com                          │    │
│  └─────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────┐    │
│  │ Send me my report →                     │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  By continuing, you'll also receive our free    │
│  weekly AI brief for [role]. Unsubscribe        │
│  anytime.                                       │
└─────────────────────────────────────────────────┘
```

**Critical UX principle: the full report displays immediately on the page** after auth gate is submitted, regardless of which path (Google OAuth or magic link). The user does not wait for an email to see their report. The email contains the PDF version (for saving/sharing) and the dashboard access link.

### 11.3 Data flow on assessment completion

When a user submits the assessment auth gate, the following happens server-side:

```
1. Check if subscriber exists with this email
   ├── Exists: Update existing subscriber record (see 11.4 below)
   └── New: Create new subscriber record
   
2. Save assessment result
   - Link to subscriber ID
   - Generate unique result_id (URL-safe, e.g., "sw-eng-7f3a9b2c")
   - Store all responses, computed scores, selected pivot paths
   - Mark as primary if first assessment, otherwise increment sequence
   
3. Pre-populate or update newsletter profile (NEW subscribers only)
   See Section 11.3.1 for complete field-by-field mapping
   
4. Generate PDF report (async)
   
5. Send welcome email (see 11.5)
   
6. Authentication
   ├── Google OAuth: User is already authenticated. Redirect/render full report on page.
   └── Magic link: Render full report on page. User can access dashboard later via email link.
   
7. Schedule first newsletter
   Existing newsletter system picks up new subscriber for next Sunday delivery
```

### 11.3.1 Complete profile field mapping

The existing newsletter profile has these fields (verified from current UI):

| Field | Type | Required | Source from Assessment |
|---|---|---|---|
| Role / Title | Single-select (18 options) | Yes | Direct mapping |
| Industry | Single-select (18 options) | Yes | Direct mapping |
| Goals | Multi-select chips + custom (12 preset options) | Yes | Derived mapping (see 11.3.2) |
| Tools & Platforms | Multi-select chips + custom (18 preset options) | Optional | Direct mapping (see 11.3.3) |
| Focus Topics | Multi-select chips + custom (~18 preset options) | Optional | Derived mapping (see 11.3.4) |
| Topics to Avoid | Multi-select chips + custom (7 preset options) | Optional | Not pre-populated (see 11.3.5) |

**Profile is considered fully configured when:** Role, Industry, and Goals are populated (the three required fields). All other fields enhance personalization but are not required.

### 11.3.2 Goals field derivation logic

The Goals field has 12 preset options. Pre-select 3-5 based on assessment responses using this logic:

**Universal pre-selection (everyone):**
- ✅ Stay current on AI trends (assessment-takers want this by definition)

**Score-derived pre-selections:**

| Assessment Signal | Pre-select Goal |
|---|---|
| Task Automatability score > 60 | Automate repetitive workflows |
| Task Automatability score > 60 AND user reports 0-1 AI tools | Learn prompt engineering |
| User reports 0-1 AI tools used | Learn prompt engineering |

**Role-derived pre-selections:**

| Role Category | Pre-select Goals |
|---|---|
| Management roles (Engineering Manager, CTO/VP, CEO/Founder) | Evaluate AI tools for my team, Improve team productivity with AI |
| CEO/Founder, CTO/VP Engineering | Understand AI strategy & business impact |
| Content-focused roles (Marketing Manager, Content Strategist) | Explore AI for content creation |
| Engineering/Technical roles (Software Engineer, Data Scientist, DevOps, Solutions Architect) | Build AI-powered products, Integrate AI into existing products |
| Research-oriented roles (Research Scientist, Data Scientist) | Keep up with AI research & papers |

**Industry-derived pre-selections:**

| Industry | Pre-select Goal |
|---|---|
| Regulated industries (Healthcare, Legal, Government, Financial Services) | Find AI use cases for my industry |
| All industries where adoption velocity signals cost pressure (declining headcount in Section C) | Reduce costs with AI automation |

**Cap at 5 pre-selected goals.** If logic generates more than 5, prioritize in this order:
1. Stay current on AI trends (always)
2. Industry-specific goals
3. Role-specific goals
4. Score-derived goals
5. Universal optional goals

### 11.3.3 Tools & Platforms field — direct mapping

The Tools & Platforms field has these 18 preset options (verified from current UI):

ChatGPT, Claude, Gemini, Copilot, Cursor, Midjourney, DALL-E, Stable Diffusion, Notion AI, Jasper, Perplexity, Replit, Hugging Face, LangChain, Vercel AI SDK, AWS Bedrock, Azure OpenAI, Google Vertex AI

**Implementation:** The assessment Section C question about AI tools used must offer these exact 18 options + "None" + "Other" (with text input). Whatever the user selects in the assessment maps directly to the Tools & Platforms profile field.

**Why this matters for scoring:** The current scoring algorithm uses tool count for Adoption Velocity (Factor 2). The expanded tool list more accurately captures adoption breadth across creative tools, infrastructure tools, and developer tools — not just engineering-focused tools.

**Custom tool entries:** If user enters a custom tool via "Other," include it in the Tools field as a custom entry (the profile UI supports this with "type your own").

### 11.3.4 Focus Topics field — derived mapping

The Focus Topics field has 18 preset options (verified from current UI):

LLMs & foundation models, AI agents & autonomy, Code generation, RAG & knowledge retrieval, Prompt engineering, AI product design & UX, Computer vision, Voice & speech AI, AI regulation & policy, AI safety & alignment, Open source AI, AI infrastructure & MLOps, AI in healthcare, AI in finance, AI in education, Robotics & embodied AI, [potentially 2 more not visible in screenshot]

**Universal pre-selections (everyone):**
- ✅ AI agents & autonomy (the macro trend driving displacement)
- ✅ AI regulation & policy (affects employment and professional standards)

**Role-derived pre-selections:**

| Role | Add Focus Topics |
|---|---|
| Software Engineer | LLMs & foundation models, Code generation, AI infrastructure & MLOps, Open source AI |
| Data Scientist / ML Engineer | LLMs & foundation models, RAG & knowledge retrieval, AI infrastructure & MLOps, Open source AI |
| DevOps / Platform Engineer | AI infrastructure & MLOps, Open source AI |
| Research Scientist | LLMs & foundation models, AI safety & alignment, Open source AI |
| Solutions Architect | AI infrastructure & MLOps, LLMs & foundation models |
| UX / Product Designer | AI product design & UX |
| Product Manager | AI product design & UX, LLMs & foundation models |
| Engineering Manager | AI infrastructure & MLOps, AI safety & alignment |
| CTO / VP Engineering | AI infrastructure & MLOps, AI safety & alignment, AI regulation & policy |
| CEO / Founder | AI safety & alignment, AI regulation & policy |
| Marketing Manager | Prompt engineering, AI product design & UX |
| Content Strategist | Prompt engineering |
| Sales / Revenue | Prompt engineering |
| Business Analyst | Prompt engineering, RAG & knowledge retrieval |
| Project Manager | Prompt engineering |
| Consultant | Prompt engineering, AI regulation & policy |
| Customer Success | Prompt engineering |
| Student / Researcher | LLMs & foundation models, Open source AI, AI safety & alignment |

**Industry-derived pre-selections (additive):**

| Industry | Add Focus Topic |
|---|---|
| Healthcare / Life Sciences | AI in healthcare |
| Fintech / Financial Services | AI in finance |
| Education / EdTech | AI in education |
| Manufacturing / Industrial | Robotics & embodied AI |
| Transportation / Logistics | Robotics & embodied AI |
| Media / Entertainment | Voice & speech AI, Computer vision |
| Gaming | Computer vision, Voice & speech AI |
| Cybersecurity | AI safety & alignment, Open source AI |

**Cap at 5 pre-selected topics.** If logic generates more than 5, prioritize:
1. Industry-specific topics (most distinctive)
2. Role-specific technical topics
3. Universal topics (AI agents & autonomy, AI regulation & policy)

**Rationale for this approach:** Pre-selecting all relevant topics defeats personalization. The cap forces selection of the *most* relevant, not just the *all* relevant. Users can always add more in their dashboard.

### 11.3.5 Topics to Avoid field — not pre-populated

The Topics to Avoid field has 7 preset options (verified from current UI):

Crypto / Web3, NFTs, AI art controversy, AI doomerism, Celebrity AI news, AI in military / weapons, AI stock trading tips

Plus the "type your own" custom entry.

**Default behavior: leave this field empty for new assessment-takers.**

**Rationale:**
- **Avoidance is highly personal.** Unlike Focus Topics (predictable from role/industry), Avoid Topics reflect personal taste that isn't predictable from professional signals
- **False positives are costly.** Incorrectly adding an item to someone's avoid list degrades their newsletter without their consent; avoid lists actively filter content
- **Empty default creates dashboard engagement.** Users encounter the field in their dashboard and can configure it intentionally — this drives initial profile customization

**For existing subscribers taking the assessment:** Preserve their existing Topics to Avoid as-is. Never auto-modify this field.

**One consideration for future iteration:** After 6+ months of usage data, we may see patterns suggesting useful auto-suggestions (e.g., users with X role frequently add Y topic to avoid). At that point, consider surfacing as a *suggestion* in the dashboard, not an auto-population in the profile.

### 11.4 Handling existing subscribers who take the assessment

When an existing newsletter subscriber takes the assessment, we do **not** overwrite their existing profile fields. Instead, we apply field-specific logic:

**Role and Industry:**
- If they match the assessment, do nothing
- If they differ, surface a gentle prompt (don't auto-update):

```
We noticed your assessment role (Marketing Manager) differs from your 
newsletter profile (Content Strategist). Would you like to:

[Update profile to Marketing Manager]
[Keep profile as Content Strategist]
[Get briefings for both]
```

**Tools & Platforms:**
- Existing tools are preserved
- Tools from assessment that aren't in profile are added (merge, not replace)
- Tools in profile that aren't in assessment are kept (user may have added them manually)
- Surface in dashboard: "Based on your assessment, we noticed you also use [X]. Want to add it to your tool list?"

**Goals:**
- Existing goals are preserved
- Don't auto-add new goals to existing subscribers (their goal selection is intentional)
- Optionally surface: "Based on your assessment, you might also be interested in [Goal X]. Add it?"

**Focus Topics:**
- Existing focus topics are preserved
- Don't auto-modify; the user has tuned their newsletter
- Optionally surface in dashboard: "We've added [Topic X] as a suggestion based on your assessment. Add to your focus topics?"

**Topics to Avoid:**
- Existing avoid topics are preserved
- Never auto-modify or add to this field, even for new users
- This field requires explicit user input

The principle throughout: **for existing subscribers, the assessment data informs suggestions, not overrides**. The user has invested in their profile; we respect that.

For brand-new users coming in through the assessment, we apply the full mapping (Section 11.3) for Role, Industry, Goals, Tools, and Focus Topics. Topics to Avoid remains empty by default.

### 11.5 Welcome email specification

The post-assessment welcome email is **different from the existing newsletter welcome flow**. It serves both first-time signups (from assessment) and is the primary delivery mechanism for the PDF report.

**Subject line options to test:**
- "Your AI Job Risk Report is ready"
- "[First name], here's your AI Disruption Score breakdown"
- "Your AI Job Risk assessment — full report inside"

**Email contents:**

```
Subject: Your AI Job Risk Report is ready

Hi [first name if available, else nothing],

Your AI Job Risk Assessment is complete. Your score: [X]/100 — [Tier].

[View your full report online →]
(links to /ai-job-risk/[role]/results/[result-id])

We've also attached a PDF version you can save or share.

────────────────────────────────────────

WHAT'S NEXT

You're now subscribed to My Weekly AI for [role] — a 5-minute weekly 
brief with the AI news that matters for your work. Your first issue 
arrives this Sunday.

We've personalized your newsletter automatically based on your 
assessment — your role, industry, tools, and focus topics are all 
already configured. You don't need to do anything else.

[Access your dashboard →]
(magic link — auto-authenticates for magic-link users)

In your dashboard you can:
• Revisit your assessment report anytime
• Fine-tune your newsletter preferences if you want
• Browse past briefings once they start arriving

────────────────────────────────────────

If you have questions or feedback, just reply to this email — it goes 
straight to me.

— [Your name]
My Weekly AI

[Unsubscribe] [Privacy Policy]
```

**Attachment:** PDF report (named `AI-Job-Risk-Report-[Role]-[Date].pdf`)

### 11.6 Dashboard integration

The existing dashboard gains a new section: **"Your AI Job Risk Profile"**.

**Placement recommendation:** Prominent card or section on the main dashboard view, above or alongside My Briefings.

**Section contents:**

```
┌──────────────────────────────────────────────────┐
│  YOUR AI JOB RISK PROFILE                        │
│                                                  │
│  Score: 62 / 100        Tier: Moderate-High      │
│  Last assessed: April 15, 2026                   │
│                                                  │
│  [View full report]  [Retake assessment]         │
│                                                  │
│  💡 We recommend retaking every 6 months         │
│  to track how your situation is evolving.        │
└──────────────────────────────────────────────────┘
```

**If the user has retaken (2+ assessments):**

```
┌──────────────────────────────────────────────────┐
│  YOUR AI JOB RISK PROFILE                        │
│                                                  │
│  Score: 54 / 100  (▼ 8 points from October)     │
│  Tier: Moderate-High                             │
│  Last assessed: April 15, 2026                   │
│                                                  │
│  [View latest report]  [View history]            │
│  [Retake assessment]                             │
└──────────────────────────────────────────────────┘
```

**Dedicated risk profile page (`/dashboard/risk-profile`):**
Full results displayed (same content as the public results URL but in the dashboard context). Includes historical comparison if user has retaken.

### 11.7 Data model

**Subscriber table (existing, may need extension):**
```
subscribers
├── id (PK)
├── email (unique)
├── google_oauth_id (nullable)
├── created_at
├── ... existing fields ...
├── newsletter_profile:
│   ├── job_role
│   ├── industry
│   ├── interests (array or boolean flags)
│   ├── focus_topics
│   ├── avoid_topics
│   └── ... other existing fields ...
└── source (existing field or new) — values: 'newsletter_signup', 'assessment', etc.
```

**Assessment results table (new):**
```
assessment_results
├── id (PK)
├── result_id (unique, URL-safe slug)
├── subscriber_id (FK → subscribers.id)
├── sequence (1 for first assessment, 2 for second, etc.)
├── role_assessed (may differ from subscriber.newsletter_profile.job_role)
├── industry_assessed
├── seniority_level
├── years_experience
├── responses (JSON — all raw responses)
├── scores:
│   ├── composite_score
│   ├── tier
│   ├── task_automatability
│   ├── adoption_velocity
│   ├── skill_differentiation_raw
│   ├── career_portability_raw
│   └── time_to_impact_urgency
├── selected_pivot_paths (JSON or array)
├── report_content (JSON — generated narrative content for each section)
├── pdf_url (nullable, populated when PDF is generated)
├── created_at
├── completion_time_seconds
├── referrer_url (nullable)
└── retaken_from_id (nullable, FK to previous assessment if this is a retake)
```

**Anonymous benchmark table (new):**
For percentile calculations, maintain a separate anonymized table:
```
assessment_benchmarks
├── role
├── industry
├── seniority_level
├── composite_score
├── task_automatability
├── adoption_velocity
├── skill_differentiation_raw
├── career_portability_raw
├── time_to_impact_urgency
└── created_at
(No subscriber_id, no email, no identifying data)
```

### 11.8 Edge cases

**Edge case 1: Existing newsletter subscriber takes the assessment**
- Match by email
- Attach result to existing subscriber
- Do NOT overwrite newsletter profile fields
- If assessment role/industry differs from profile, surface gentle prompt to user
- Treat as retake if they've assessed before

**Edge case 2: User takes assessment for a different role than their profile**
- Assessment role and profile role can differ — this is intentional
- Career changers may be exploring options
- Store assessment role in `assessment_results.role_assessed`
- Newsletter profile remains as-is unless user explicitly updates

**Edge case 3: User takes assessment multiple times**
- Each assessment stored as separate record, linked to same subscriber
- `sequence` field increments
- `retaken_from_id` points to previous assessment
- Dashboard shows most recent prominently, with delta from previous
- Historical view available

**Edge case 4: Anonymous result viewing (shared link)**
- Result URLs (`/ai-job-risk/[role]/results/[result-id]`) are viewable WITHOUT authentication
- This enables sharing (drives word-of-mouth and viral growth)
- Shared viewers see the report with a CTA: "Take your own assessment →"
- After 90 days, result links can optionally require authentication (deferred decision)

**Edge case 5: User abandons before auth gate**
- Assessment progress saved in localStorage
- If they return within 7 days from same browser, offer to resume
- No subscriber record yet (no email)
- After completion, capture email and link saved progress to new subscriber

**Edge case 6: User signs in with Google but the Google email differs from one they used previously**
- This is an existing system concern, not unique to the assessment
- Should follow existing system behavior
- If creating a duplicate subscriber, may need merge tooling (deferred)

**Edge case 7: User completes assessment but bounces before clicking magic link**
- Subscriber record exists with email
- Newsletter delivery proceeds (no auth required for receiving newsletters)
- Result is accessible via public URL in the email
- Magic link can be re-requested by visiting `/auth/signin`

### 11.9 Implementation notes for Claude Code

When implementing this integration:

1. **Reuse the existing auth components** from `/auth/signin` — don't build new auth UI. The assessment auth gate should embed or invoke the same components.

2. **Subscriber lookup should be by email**, with normalization (lowercase, trim). Race conditions on signup are possible if a user starts the assessment in one tab and signs up via the newsletter homepage in another — handle gracefully.

3. **The result_id should be URL-safe and human-shareable**. Format suggestion: `[role-slug]-[short-random]` like `sw-eng-7f3a9b2c`. Avoid sequential IDs (privacy/security).

4. **Newsletter profile updates should be additive, not destructive**, for existing subscribers. New fields can be populated; existing fields are preserved.

5. **The PDF generation is async** and should not block the user from seeing their on-page report. Send the email with the PDF link/attachment once it's ready, but show the report immediately on the results page.

6. **Magic link emails should follow existing infrastructure**. If the existing system uses NextAuth.js or similar, the assessment welcome email is a custom transactional email that includes a magic link generated through the same auth provider.

**A.1 Separate directory vs nested under `/for/`**
Decision: Separate top-level directory (`/ai-job-risk/`)
Rationale: SEO signal clarity, analytics segmentation, future product flexibility

**A.2 Role-specific vs industry-specific assessment pages**
Decision: Role-specific only; industries are filters within the assessment
Rationale: Roles get displaced, industries provide context. Search intent is role-specific.

**A.3 Composite score weighting (40/20/20/10/10)**
Decision: Task Automatability weighted heaviest, soft factors weighted lighter
Rationale: Task automatability is the most concrete and defensible measurement. Self-report factors are valuable but less reliable.

**A.4 Calibration over alarm**
Decision: Use honest, calibrated scoring even when this produces reassuring results
Rationale: Trust is the long-term moat. Inflating scores destroys credibility.

**A.5 Email gate after teaser, not before**
Decision: Show score and tier on screen, gate full report behind auth
Rationale: Reciprocity dynamic — they've invested 5 minutes, seeing partial value first dramatically improves conversion.

**A.6 Unified auth flow with existing newsletter signup**
Decision: Assessment auth gate uses the same Google OAuth + Magic Link options as existing /auth/signin
Rationale: Single account model is simpler. The existing auth options (especially magic link) eliminate friction at the critical conversion moment.

**A.7 Full report shown immediately on results page, not gated behind email**
Decision: After auth gate submission, render full report on page immediately. Email contains PDF and dashboard access link.
Rationale: User has invested 5-7 minutes. Making them wait for an email at this moment kills the experience. The PDF and dashboard access are bonuses, not gates.

**A.8 Assessment results stored in single subscriber data model**
Decision: Assessment results are a related record linked to the same subscriber table used by newsletter signups
Rationale: Single source of truth. Allows dashboard integration, retakes over time, and segmentation for future product offers.

**A.9 Pre-populate but don't overwrite for existing subscribers**
Decision: New subscribers get profile fields populated from assessment. Existing subscribers retain their profile; assessment data is attached but profile is not overwritten unless user explicitly chooses.
Rationale: Respects user agency. Career changers and refined preferences shouldn't be destructively overwritten.

**A.10 Assessment tool list must match profile tool list exactly**
Decision: The assessment's "Which AI tools do you use?" question offers the same 18 tools as the newsletter profile's Tools & Platforms field
Rationale: Enables direct 1:1 mapping with zero translation logic. Also produces more accurate Adoption Velocity scoring by capturing creative, infrastructure, and developer tool breadth.

**A.11 Goals and Focus Topics use derived (not direct) mapping**
Decision: These fields are pre-populated based on intelligent rules from assessment responses (role, industry, scores, task patterns) rather than direct field-to-field mapping
Rationale: Assessment doesn't directly ask "what are your goals" — but the pattern of responses strongly suggests them. Rule-based derivation creates a personalized profile without making the assessment longer.

**A.12 Cap pre-populated multi-select fields at 5 items**
Decision: For Goals and Focus Topics, pre-select a maximum of 5 items even when more rules apply
Rationale: Pre-selecting all relevant options defeats personalization. The user can always add more in the dashboard. The cap forces selection of the most relevant items.

**A.13 Topics to Avoid is never auto-populated**
Decision: The Topics to Avoid field remains empty by default for all assessment-takers (new and existing)
Rationale: Avoidance is highly personal and not predictable from professional signals. False positives degrade the newsletter without user consent. Empty default drives intentional dashboard engagement.

**A.14 Task library reviewed quarterly; pivot path library reviewed every 6 months**
Decision: Separate audit cadences for the two role-specific content libraries
Rationale: AI capability evolves faster than the job market. Task automatability ratings change quarter-to-quarter as new tools emerge. Pivot path data (salaries, role definitions, hiring demand) is more stable and benefits from longer review cycles. Staggering also reduces operator workload.

**A.15 Pivot path scoring is data-driven, not hardcoded**
Decision: Each pivot path has its scoring rules encoded as data (in the role config), not hardcoded in the algorithm
Rationale: Enables the operator to update pivot path scoring quarterly without code changes. Makes it easier to A/B test scoring variations later.

**A.16 Launch with 5 roles: Software Engineer, Marketing Manager, Content Creator, Customer Success, Product Manager**
Decision: Launch with these 5 specific roles rather than starting with 1-3
Rationale: Diverse audience coverage (technical, business, creative, customer-facing, cross-functional) validates cross-role product fit from day one. All 5 verified with strong displacement signals and pivot path data in Q2 2026 market research. "Content Creator" was chosen over the narrower "Content Strategist" title to capture broader audience.

**A.17 Hybrid deterministic + AI-generated report content**
Decision: Scoring outputs, tier descriptions, pivot path metadata, and salary data are deterministic (templates and config). Only narrative connective tissue is AI-generated (opening summary, per-factor explanations, task analysis, pivot path fit reasoning, action plan, one progress line).
Rationale: Keeps factual content reliable while making narrative feel personalized. Reduces hallucination risk (no AI inventing salary numbers or fake company examples). Easier to update — fact changes only require config updates, not prompt changes.

**A.18 Report content cached against result_id, never regenerated on view**
Decision: AI-generated content is generated once and stored in `assessment_results.report_content`. Same assessment shows same report on every view.
Rationale: Essential for shareability (shared link must show consistent content). Saves API costs. Prevents users from confusion if regenerated text differs.

**A.19 E1 and E2 contribute modest modifiers to Factor 5 (Time-to-Impact Urgency)**
Decision: Surfaced during Claude Code implementation — §5 stated E1 and E2 fed Factor 5 but §3 did not list them as modifiers. Resolved by adding them with modest weights: E1 (manager conversations) up to +8, E2 (active learning) up to -7.
Rationale: Existing Factor 5 modifiers measure current state (employer adoption, tool count, differentiation). E1 and E2 add trajectory awareness (is change being discussed? are you preparing?) — a genuinely different dimension. Weights are deliberately modest because both are self-reports subject to bias and to avoid disrupting the calibration validation in Section 4.X.2. Combined max modifier from E1+E2 ranges from +11 (worst case) to -7 (best case), meaningful but not dominant.

---

## Appendix B: Open questions and parking lot

- Which third role to launch alongside Software Engineers and Marketing Managers? Candidates: Paralegals, Customer Success, Content Strategists, Data Scientists
- **Confirm Focus Topics field has 18 options total.** Screenshot showed 16 visible; spec assumes 18 but could be 16 or 17. Implementation should verify against actual database before launch.
- Should results be public-shareable by default (current spec assumption), or should we offer a privacy toggle?
- After 90 days, should public result URLs continue to be accessible without authentication, or expire?
- Should we offer a "compare with peer benchmarks" feature in v1 or defer to v2?
- Should we capture company size as an additional assessment signal?
- How should we handle subscribers who came in through assessment and later want to delete their assessment data but keep their newsletter subscription? (Privacy/GDPR consideration)
- Welcome email subject line A/B test plan — defer to launch
- Should the existing `/auth/signin` page mention "or take an assessment to sign up" as an alternative entry path?
- After 6+ months of usage data, consider whether Topics to Avoid could be intelligently suggested (not auto-populated) based on observed patterns

---

*End of document*
