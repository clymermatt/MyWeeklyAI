/**
 * Marketing Manager role configuration (spec Section 4.2).
 *
 * Task library calibrated at the Q2 2026 capability baseline. Subject to the
 * quarterly review process (spec 4.2 inherits 4.1.3). Pivot path library:
 * 18 paths (1-12 IC, 13-15 junior, 16-18 executive), authored from packet-3-mm
 * for IC paths and packet-2 for executive paths.
 */

import type {
  PivotScoringContext,
  RoleConfig,
  TaskDefinition,
  UserResponses,
} from "../types";

/** Normalized time percent on a task (0 if not reported). */
const pct = (ctx: PivotScoringContext, taskId: string): number =>
  ctx.taskTimePercents[taskId] ?? 0;

/** Regulated verticals where domain expertise + AI fluency commands a premium. */
const REGULATED_INDUSTRIES = ["healthcare", "fintech", "legal", "government"];

const isDeepExpertise = (r: UserResponses) =>
  r.domainExpertise === "most" || r.domainExpertise === "significant";

const isGeneralist = (r: UserResponses) =>
  r.domainExpertise === "some" || r.domainExpertise === "little";

const isRelationshipStrong = (r: UserResponses) =>
  r.relationshipImportance === "critical" || r.relationshipImportance === "important";

const isHighStakes = (r: UserResponses) =>
  r.decisionStakes === "constant" || r.decisionStakes === "regular";

// ─── Task library (spec 4.2.1) ───────────────────────────────────────────────

const TASK_LIBRARY: TaskDefinition[] = [
  {
    id: "copywriting",
    name: "Writing marketing copy (ads, emails, social posts)",
    automatabilityRating: 85,
    reasoning:
      "Among the most directly automated marketing work today. ChatGPT, Claude, Jasper, and HubSpot AI handle ad variants, email drafts, and social copy at near-human quality for routine work. The bottleneck is brand voice consistency and conversion-grade refinement, not first-draft generation. Trajectory points to AR 90+ as brand-tuned models become standard.",
    whatsLeftForHumans:
      "Brand-voice judgment, high-stakes conversion copy, novel positioning, and copy where the wrong word triggers regulatory or reputational risk.",
  },
  {
    id: "content-calendar",
    name: "Content calendar planning and scheduling",
    automatabilityRating: 65,
    reasoning:
      "Calendar mechanics (slot filling, channel cadence, scheduling) automate well; AI suggests topics, batches posts, and resolves conflicts. The strategic layer — what to publish, why, and for whom — remains human and shapes everything downstream.",
    whatsLeftForHumans:
      "Editorial strategy, audience-fit judgment, deciding when to deviate from the plan, and coordination with concurrent campaigns.",
  },
  {
    id: "performance-analysis",
    name: "Campaign performance analysis and reporting",
    automatabilityRating: 70,
    reasoning:
      "AI pulls metrics, builds dashboards, writes narrative summaries, and flags anomalies. The diagnostic step — why a metric moved and what to do — is where judgment still matters, but routine reporting is largely automated.",
    whatsLeftForHumans:
      "Causal reasoning under attribution noise, stakeholder communication of bad results, and decisions about what to test next.",
  },
  {
    id: "market-research",
    name: "Competitor and market research",
    automatabilityRating: 75,
    reasoning:
      "Information gathering and competitor monitoring are well-served by AI tools (Perplexity, ChatGPT with browsing, dedicated CI tools). Synthesis into strategic implications still benefits from human judgment, but the work that used to take days now takes hours.",
    whatsLeftForHumans:
      "Strategic interpretation, identifying non-obvious patterns, and judging research quality and source bias.",
  },
  {
    id: "ab-testing",
    name: "A/B testing setup and analysis",
    automatabilityRating: 55,
    reasoning:
      "A split task. Test setup, variant generation, and statistical analysis are increasingly automated. Test design (what to test, what counts as a meaningful result, what to do with the result) remains a human judgment call that the metrics don't reveal.",
    whatsLeftForHumans:
      "Hypothesis generation, deciding when a result is signal vs noise, and translating wins into broader strategy.",
  },
  {
    id: "marketing-strategy",
    name: "Marketing strategy and positioning",
    automatabilityRating: 25,
    reasoning:
      "Among the most defensible marketing work. AI can produce candidate positioning statements and frameworks, but final strategy depends on business context, organizational reality, market timing, and competitive dynamics that don't live in any prompt.",
    whatsLeftForHumans:
      "Most of it — AI is an assistant in strategy, not a decision-maker.",
  },
  {
    id: "cross-functional",
    name: "Cross-functional stakeholder management",
    automatabilityRating: 15,
    reasoning:
      "Among the most AI-resistant marketing work. Meetings, executive alignment, negotiating priorities with sales and product, explaining marketing constraints to leadership all depend on relationships and judgment. AI assists (summarizing, drafting) without replacing the work.",
    whatsLeftForHumans: "Almost all of it — durable work.",
  },
  {
    id: "budget-roi",
    name: "Budget management and ROI accountability",
    automatabilityRating: 30,
    reasoning:
      "AI accelerates budget modeling, scenario analysis, and forecast updates. The decisions — where to spend, when to cut, how to defend trade-offs to a CFO — remain human and tied to organizational context.",
    whatsLeftForHumans:
      "Trade-off decisions, executive accountability for outcomes, and judgment under budget pressure.",
  },
  {
    id: "brand-voice",
    name: "Brand voice and creative direction",
    automatabilityRating: 35,
    reasoning:
      "AI can generate on-brand drafts once a voice is defined and can produce creative variants at scale. The strategic decisions — what the brand stands for, when to evolve voice, how to evaluate creative — remain human and become more important, not less, as AI commoditizes execution.",
    whatsLeftForHumans:
      "Voice definition, creative judgment, evaluating whether work expresses the brand authentically.",
  },
  {
    id: "vendor-management",
    name: "Vendor and agency management",
    automatabilityRating: 25,
    reasoning:
      "Relationship and accountability work. AI streamlines RFP processes, contract review, and performance scorecards, but vendor selection, escalation, and renegotiation remain human work with significant trust components.",
    whatsLeftForHumans:
      "Relationship management, contract negotiation, and decisions about which vendors to scale or terminate.",
  },
  {
    id: "customer-research",
    name: "Customer research and insight synthesis",
    automatabilityRating: 50,
    reasoning:
      "AI synthesizes survey responses, call transcripts, and support tickets at scale. The interpretation — what patterns matter, what they imply, how to act — remains a judgment call that depends on context AI doesn't have.",
    whatsLeftForHumans:
      "Strategic interpretation, deciding which insights are worth acting on, and connecting research to product/marketing decisions.",
  },
  {
    id: "team-leadership",
    name: "Team leadership and people management",
    automatabilityRating: 15,
    reasoning:
      "Depends on trust, judgment about specific people, modeling professional behavior, and emotional intelligence. AI supplements with feedback synthesis and 1:1 prep, but doesn't replace the human relationship. Among the most durable marketing work and often what determines advancement.",
    whatsLeftForHumans: "All of it.",
  },
];

// ─── Pivot path library (spec 4.2.2) ─────────────────────────────────────────

const marketingManagers: RoleConfig = {
  slug: "marketing-managers",
  resultIdPrefix: "mkt",
  label: "Marketing Manager",
  pluralLabel: "Marketing Managers",
  headline: "Will AI replace your marketing manager job?",

  roleTitles: [
    { value: "coordinator", label: "Marketing Coordinator / Specialist", seniorityOrdinal: 0, isJuniorIC: true, profileRole: "Marketing Manager" },
    { value: "manager", label: "Marketing Manager", seniorityOrdinal: 1, profileRole: "Marketing Manager" },
    { value: "senior-manager", label: "Senior Marketing Manager", seniorityOrdinal: 2, profileRole: "Marketing Manager" },
    { value: "director", label: "Director of Marketing", seniorityOrdinal: 5, isLeadership: true, profileRole: "CMO / VP Marketing" },
    { value: "vp-cmo", label: "VP Marketing / CMO", seniorityOrdinal: 6, isLeadership: true, profileRole: "CMO / VP Marketing" },
  ],

  taskLibrary: TASK_LIBRARY,

  decisionStakesHelp:
    "Examples: revenue accountability, brand-defining positioning bets, regulatory or compliance exposure on messaging, large budget allocations, executive-visibility campaigns.",

  pivotPathAvailability: 85,

  baseUrgencyByLevel: {
    coordinator: 85,
    mid: 70,
    senior: 55,
    director: 35,
    "vp-cmo": 25,
  },

  durableSpecializations: {
    durable: [
      "Brand strategy at senior level",
      "Regulated industry marketing (healthcare, finance, legal)",
      "B2B technical product marketing",
      "Marketing leadership",
    ],
    moderate: [
      "Product marketing",
      "Demand generation",
      "Marketing operations",
      "Customer marketing",
    ],
    commoditizing: [
      "General content marketing",
      "Social media management (without strategy)",
      "Basic copywriting",
      "Generic SEO",
      "Routine campaign management",
    ],
  },

  topRecommendedTool: "ChatGPT or HubSpot AI",
  toolFitHints:
    "For content workflows (copywriting, social, email, ad variants): ChatGPT, Claude, Jasper, HubSpot AI, Canva AI. For research and synthesis (market research, customer insights, competitive intelligence): Perplexity, ChatGPT, Claude, Notion AI. For ops and automation (lifecycle, attribution, marketing automation): HubSpot AI, Marketo, Notion AI. For creative production (brand visuals, ad creative): Adobe Firefly, Midjourney, DALL-E, Canva AI. For presentations and decks (campaign reviews, executive comms): Gamma, Notion AI.",
  landingToolMentions: "ChatGPT, HubSpot AI, and Jasper",
  landingSamplePersona: "Senior Marketing Manager at a SaaS company",

  resolveSeniority: (r: UserResponses) => {
    switch (r.role) {
      case "coordinator":
        return { levelKey: "coordinator", label: "Marketing Coordinator / Specialist", ordinal: 0, isExecutive: false };
      case "manager":
        return { levelKey: "mid", label: "Marketing Manager", ordinal: 1, isExecutive: false };
      case "senior-manager":
        return isDeepExpertise(r)
          ? { levelKey: "senior", label: "Senior Marketing Manager, specialized", ordinal: 2, isExecutive: false }
          : { levelKey: "senior", label: "Senior Marketing Manager, generalist", ordinal: 2, isExecutive: false };
      case "director":
        return { levelKey: "director", label: "Director of Marketing", ordinal: 5, isExecutive: true };
      case "vp-cmo":
        return { levelKey: "vp-cmo", label: "VP Marketing / CMO", ordinal: 6, isExecutive: true };
      default:
        return { levelKey: "mid", label: "Marketing Manager", ordinal: 1, isExecutive: false };
    }
  },

  pivotPaths: [
    {
      id: "ai-marketing-manager",
      number: 1,
      name: "AI Marketing Manager / AI Marketing Strategist",
      provenance: "established",
      type: "marketing-strategy-ic",
      tier: "ic",
      dayToDay:
        "Lead AI tool adoption across the marketing organization. Design AI-augmented workflows for content production, campaign optimization, and customer segmentation. Evaluate and onboard new AI vendors. Train marketing teammates on prompt engineering and AI tool fluency. Bridge the gap between marketing strategy and AI capability — translating business goals into AI implementation plans.",
      whyDurable:
        "AI Marketing Manager is the fastest-growing role in marketing by compensation. The work requires judgment about which AI tools fit which workflows, how to maintain brand voice across AI-generated content, and where AI accelerates vs. degrades marketing outcomes. Companies need this glue role between AI tools and marketing strategy — neither generic marketers nor pure technical AI engineers can do it well alone.",
      requiredExperience:
        "Mid-level (3-5 years marketing experience), with demonstrated AI tool fluency. Existing marketing managers with strong adoption velocity scores have the shortest path.",
      transferableSkills:
        "Marketing fundamentals (positioning, segmentation, campaign management), existing tool fluency, cross-functional collaboration, comfort with iteration and testing.",
      skillGaps:
        "Advanced prompt engineering, AI workflow design (chained prompts, agents, evals), vendor evaluation frameworks for AI tools, AI cost management, basic understanding of how LLMs differ from rules-based automation, comfort with non-deterministic systems.",
      salaryRange:
        "$105K-$155K base at the mid-level; senior positions exceed $180K. AI-skilled marketers earn 15-22% premiums across every marketing role per Q1 2026 data. Top-paying AI marketing roles at well-funded companies push $180K-$250K total comp, though these typically require demonstrated impact and senior responsibility.",
      timeline:
        "3-6 months of focused upskilling while in current role. Most successful pivots happen as internal expansion of responsibility before formal title change.",
      bestFitsWhen:
        "Marketing Manager or Senior Marketing Manager title; 3+ AI tools currently used; encouraged or mandated employer AI posture; significant time on copywriting, performance analysis, or research; active learning rating regular.",
      minSeniorityOrdinal: 1,
      maxSeniorityOrdinal: 6,
      pathDefiningIndustries: ["marketing-advertising", "saas-software"],
      strongContextIndustries: ["ecommerce-retail", "fintech", "media-entertainment"],
      portfolioArtifactTemplate:
        "Build one AI-augmented marketing workflow in your current role — a content brief generator, a competitor monitor, or a lifecycle email sequence prompt chain. Document the design and impact in a short writeup.",
      scoringRules: [
        { label: "You already use 2+ AI tools", points: 20, group: "tools", test: (c) => c.toolCount >= 2 },
        { label: "You already use 3+ AI tools heavily", points: 30, group: "tools", test: (c) => c.toolCount >= 3 },
        { label: "Your employer mandates or encourages AI tools", points: 20, test: (c) => c.responses.employerAdoption === "mandated" || c.responses.employerAdoption === "encouraged" },
        { label: "You spend significant time writing marketing copy", points: 15, test: (c) => pct(c, "copywriting") > 15 },
        { label: "You're actively learning AI on your own time", points: 15, test: (c) => c.responses.activeLearning === "regular" },
        { label: "You're at mid-level or above", points: 10, test: (c) => c.seniorityOrdinal >= 1 },
      ],
    },
    {
      id: "marketing-ops",
      number: 2,
      name: "Marketing Operations / Marketing Ops Lead",
      provenance: "established",
      type: "marketing-ops-ic",
      tier: "ic",
      dayToDay:
        "Own the marketing technology stack. Build and maintain attribution models, lifecycle automation, lead scoring, CRM integrations, and data pipelines that connect marketing tools to revenue systems. Run experiments in marketing automation platforms. Increasingly involves orchestrating AI-augmented workflows alongside traditional MarTech. Less creative work, more systems thinking and revenue operations alignment.",
      whyDurable:
        "Marketing Ops is the architecture layer of modern marketing — and the architect role is durable even as execution gets automated. Companies hire Marketing Ops Leads specifically to make the AI tools work together coherently. The work depends on judgment about data quality, attribution decisions, and trade-offs that AI systems can implement but not design.",
      requiredExperience:
        "Mid-level (3-5 years), ideally with strong analytics background. Marketers with significant A/B testing or campaign analysis time have the most natural transition. SQL and basic data modeling skills are increasingly expected.",
      transferableSkills:
        "Analytical thinking, campaign performance analysis, systems orientation, comfort with marketing tools and CRM platforms.",
      skillGaps:
        "SQL fundamentals, attribution modeling (multi-touch, MMM), marketing automation platform administration (HubSpot, Marketo, Pardot), data warehouse fundamentals (Snowflake, BigQuery), basic Python or no-code automation, revenue operations frameworks.",
      salaryRange:
        "Mid-level Marketing Operations Manager base typically $98K-$130K. Senior roles at growth-stage SaaS companies push $130K-$180K. AI-skilled MarOps professionals at AI-native companies clear $138K+.",
      timeline:
        "6-12 months of skill building. Often involves moving laterally from a Marketing Manager role to a Marketing Ops Specialist role first, then upward to Marketing Ops Manager / Lead.",
      bestFitsWhen:
        "Marketing Manager with strong analytical orientation; significant time on performance analysis or A/B testing; SaaS or B2B industry; tools list includes a marketing-automation platform; novel-problems rating high.",
      minSeniorityOrdinal: 1,
      maxSeniorityOrdinal: 6,
      pathDefiningIndustries: ["saas-software", "marketing-advertising"],
      strongContextIndustries: ["fintech", "ecommerce-retail"],
      scoringRules: [
        { label: "You spend significant time on performance analysis", points: 25, test: (c) => pct(c, "performance-analysis") > 15 },
        { label: "You spend real time on A/B testing", points: 15, test: (c) => pct(c, "ab-testing") > 10 },
        { label: "You're comfortable with novel problems", points: 15, test: (c) => c.responses.novelProblems === "most" || c.responses.novelProblems === "frequently" },
        { label: "You're at mid-level or above", points: 10, test: (c) => c.seniorityOrdinal >= 1 },
        { label: "You already use 2+ AI tools", points: 10, test: (c) => c.toolCount >= 2 },
        { label: "You bring deep specialist expertise", points: 10, test: (c) => isDeepExpertise(c.responses) },
      ],
    },
    {
      id: "product-marketing-manager",
      number: 3,
      name: "Product Marketing Manager",
      provenance: "established",
      type: "marketing-strategy-ic",
      tier: "ic",
      dayToDay:
        "Own product positioning, messaging, and go-to-market for one or more products. Work closely with sales (enabling them with positioning, training, content), product (informing roadmap with customer feedback and market data), and customer success (helping retain and expand accounts). Run product launches, competitive intelligence, and pricing analysis. Less performance marketing, more strategic communication.",
      whyDurable:
        "Product marketing depends on synthesis across product, sales, and customer data — work that requires judgment about what matters and why. The role is among the most cross-functional in marketing, with strategic stakeholder management that AI tools augment but don't replace. AI-skilled PMMs command 20-30% premiums; top-paying PMM industries include Pharma/Biotech, Legal, and Financial Services.",
      requiredExperience:
        "Mid-level (3-5 years marketing experience) with strong communication and cross-functional history. Marketers with significant cross-functional time have the most natural transition. Technical aptitude helps for B2B SaaS PMM.",
      transferableSkills:
        "Stakeholder management, written communication, marketing fundamentals (positioning, messaging), customer-facing comfort, comfort with structured analysis.",
      skillGaps:
        "Sales enablement frameworks, competitive positioning methodologies, pricing strategy, B2B sales cycle understanding, product analytics interpretation, customer interview practice for product research.",
      salaryRange:
        "Mid-level PMM typically $89K-$137K base; senior PMM at major SaaS companies reaches $140K-$200K base. PMM at well-funded AI startups commonly $130K-$180K base plus equity.",
      timeline:
        "6-12 months. Often involves moving from a general marketing role to a PMM role at the same or adjacent company. PMM experience compounds — second PMM role typically pays 25-40% more than the first.",
      bestFitsWhen:
        "Marketing Manager or Senior Marketing Manager; strong cross-functional collaboration time; B2B industry experience; high decision-stakes scores; relationship importance critical or important.",
      minSeniorityOrdinal: 1,
      maxSeniorityOrdinal: 6,
      pathDefiningIndustries: ["saas-software"],
      strongContextIndustries: ["fintech", "healthcare", "cybersecurity"],
      scoringRules: [
        { label: "You spend significant time on cross-functional work", points: 25, test: (c) => pct(c, "cross-functional") > 15 },
        { label: "Relationships are central to your work", points: 20, test: (c) => isRelationshipStrong(c.responses) },
        { label: "You regularly make high-stakes decisions", points: 15, test: (c) => isHighStakes(c.responses) },
        { label: "You bring deep domain expertise", points: 10, test: (c) => isDeepExpertise(c.responses) },
        { label: "You're at mid-level or above", points: 10, test: (c) => c.seniorityOrdinal >= 1 },
      ],
    },
    {
      id: "demand-gen-lead",
      number: 4,
      name: "Demand Generation Lead / Performance Marketing Manager",
      provenance: "emerging",
      type: "marketing-ops-ic",
      tier: "ic",
      dayToDay:
        "Drive pipeline and revenue through paid channels (search, social, programmatic), organic growth experiments, ABM campaigns, and lifecycle marketing. Own the marketing-sourced pipeline number. Run experiments at scale and read attribution data to allocate budget. Increasingly involves managing AI-augmented bidding systems and AI-generated creative variants while maintaining performance accountability.",
      whyDurable:
        "While AI handles more bid optimization and creative generation, the strategic judgment — what audiences to test, what creative concepts to validate, what budget to allocate where, when to pause campaigns — remains human work. Top performance marketers add value through judgment under uncertainty, which AI assists but doesn't replace.",
      requiredExperience:
        "Mid-level to senior (4-8 years marketing experience), with demonstrated performance accountability. Marketers from agency backgrounds often transition well. Strong analytical skills required.",
      transferableSkills:
        "Campaign management, performance analysis, budget management, comfort with experimentation.",
      skillGaps:
        "Modern attribution methodologies (multi-touch, incrementality testing, MMM), AI-powered ad platform administration (Google Performance Max, Meta Advantage+), agentic ad workflows, ABM platform fluency (6sense, Demandbase), predictive analytics interpretation.",
      salaryRange:
        "Performance Marketing Manager typically $126K-$192K total comp. Demand Gen Lead at growth-stage SaaS companies $130K-$190K base. Top-paying performance marketing roles at AI-skilled companies reach $200K+ total comp. Wide variance based on accountability and company stage.",
      timeline:
        "6-12 months. Performance marketers with strong attribution experience have the shortest path; generalist marketers need to build analytical foundation first.",
      bestFitsWhen:
        "Marketing Manager with strong analytics orientation; significant performance-analysis time; B2B or DTC e-commerce experience; tools list includes ad platforms or attribution tools.",
      minSeniorityOrdinal: 1,
      maxSeniorityOrdinal: 6,
      pathDefiningIndustries: ["saas-software", "ecommerce-retail"],
      strongContextIndustries: ["marketing-advertising", "fintech"],
      scoringRules: [
        { label: "You spend significant time on performance analysis", points: 25, test: (c) => pct(c, "performance-analysis") > 15 },
        { label: "You spend time managing budget / ROI", points: 15, test: (c) => pct(c, "budget-roi") > 10 },
        { label: "You're comfortable with novel problems", points: 10, test: (c) => c.responses.novelProblems === "most" || c.responses.novelProblems === "frequently" },
        { label: "You regularly make high-stakes decisions", points: 10, test: (c) => isHighStakes(c.responses) },
        { label: "You're at mid-level or above", points: 10, test: (c) => c.seniorityOrdinal >= 1 },
        { label: "You already use 2+ AI tools", points: 10, test: (c) => c.toolCount >= 2 },
      ],
    },
    {
      id: "customer-insights",
      number: 5,
      name: "Customer Insights / Voice of Customer Analyst",
      provenance: "emerging",
      type: "specialized-ic",
      tier: "ic",
      dayToDay:
        "Synthesize customer research across surveys, interviews, support tickets, sales calls, and product usage data. Generate strategic insights that inform marketing, product, and customer success decisions. Run regular customer interviews and behavioral studies. Often combines qualitative research skills with AI-augmented synthesis tools that process large volumes of unstructured customer data.",
      whyDurable:
        "AI tools can summarize customer feedback at scale, but the strategic interpretation — what patterns matter, what they imply, how to act on them — remains human judgment work. Customer empathy compounds with experience and depends on direct customer relationships. As AI commoditizes generic marketing, deep customer understanding becomes the differentiator.",
      requiredExperience:
        "Mid-level (3-6 years marketing or research experience). Marketers with significant customer-research time or strong customer-facing background have the most natural transition. Background in user research, sociology, or behavioral economics helps.",
      transferableSkills:
        "Customer empathy, qualitative research methods, synthesis and pattern recognition, written communication.",
      skillGaps:
        "Modern research synthesis tools (Dovetail, Reduct), AI-augmented research workflows, survey methodology, statistical literacy for quantitative research, customer behavioral analytics platforms.",
      salaryRange:
        "Customer Insights / VoC roles typically $90K-$160K base. Senior insights roles at consumer brands and B2B SaaS push $150K-$200K. Wide variance based on whether the role is positioned as research, marketing, or strategy.",
      timeline:
        "6-12 months. Strong existing customer-research time accelerates this substantially.",
      bestFitsWhen:
        "Marketing Manager with high customer-research time; relationship importance critical or important; B2B SaaS or consumer brand experience; novel-problems rating high.",
      minSeniorityOrdinal: 1,
      maxSeniorityOrdinal: 6,
      strongContextIndustries: ["saas-software", "ecommerce-retail", "healthcare", "education"],
      scoringRules: [
        { label: "You spend significant time on customer research", points: 25, test: (c) => pct(c, "customer-research") > 15 },
        { label: "Relationships are central to your work", points: 20, test: (c) => isRelationshipStrong(c.responses) },
        { label: "You're comfortable with novel problems", points: 15, test: (c) => c.responses.novelProblems === "most" || c.responses.novelProblems === "frequently" },
        { label: "You bring deep domain expertise", points: 10, test: (c) => isDeepExpertise(c.responses) },
        { label: "You're at mid-level or above", points: 10, test: (c) => c.seniorityOrdinal >= 1 },
      ],
    },
    {
      id: "brand-strategist",
      number: 6,
      name: "Brand Strategist",
      provenance: "established",
      type: "marketing-strategy-ic",
      tier: "ic",
      dayToDay:
        "Lead brand positioning, brand voice development, and creative direction. Work at the intersection of marketing, product, and design. Define how the brand shows up across all touchpoints. Lead brand research, identity development, and strategic creative briefs. Often partners closely with creative directors and product marketing on brand expression.",
      whyDurable:
        "Brand strategy depends on cultural understanding, judgment about meaning, and creative direction that AI tools cannot replicate at senior levels. While AI can generate brand expressions once direction is set, the strategic decisions about brand positioning, voice, and meaning remain among the most defensible marketing work. AI proficiency adds 16-20% to senior brand roles per 2026 data.",
      requiredExperience:
        "Senior (6-10 years marketing experience), with demonstrated brand voice development and creative direction history. Strong portfolio of brand work matters more than years.",
      transferableSkills:
        "Brand voice, strategic positioning, creative judgment, written communication, cross-functional collaboration.",
      skillGaps:
        "Modern brand identity frameworks, brand architecture for product suites, AI-augmented creative workflows (using AI without losing brand voice), brand measurement frameworks, executive-level brand storytelling.",
      salaryRange:
        "Brand Strategist roles typically $100K-$200K base. Senior brand strategists at established brands and agencies push $180K-$250K. Top-paying brand roles at premium consumer brands and growth-stage tech reach higher.",
      timeline:
        "12-18 months. Brand work is reputation-driven; portfolio building matters as much as title transitions.",
      bestFitsWhen:
        "Senior Marketing Manager or above; significant brand-voice time; high decision-stakes; consumer brand, agency, or premium B2B background.",
      minSeniorityOrdinal: 2,
      maxSeniorityOrdinal: 6,
      pathDefiningIndustries: ["marketing-advertising", "media-entertainment"],
      strongContextIndustries: ["ecommerce-retail", "saas-software"],
      scoringRules: [
        { label: "You spend significant time on brand voice / creative direction", points: 25, test: (c) => pct(c, "brand-voice") > 15 },
        { label: "You regularly make high-stakes decisions", points: 15, test: (c) => isHighStakes(c.responses) },
        { label: "You bring deep domain expertise", points: 15, test: (c) => isDeepExpertise(c.responses) },
        { label: "You're at senior level or above", points: 10, test: (c) => c.seniorityOrdinal >= 2 },
        { label: "You spend time on cross-functional work", points: 10, test: (c) => pct(c, "cross-functional") > 10 },
      ],
    },
    {
      id: "geo-ai-search-strategist",
      number: 7,
      name: "GEO / AI Search Strategist",
      provenance: "emerging",
      type: "marketing-ops-ic",
      tier: "ic",
      dayToDay:
        "Optimize content and brand presence for AI-generated search results — Google AI Overviews, Perplexity citations, ChatGPT references, Claude citations. Build strategies for being recommended by AI systems when users ask questions in your domain. Combines traditional SEO with new disciplines: structured data for AI consumption, citation worthiness, and content patterns that AI systems favor.",
      whyDurable:
        "As AI-mediated search grows, organizations need specialists who understand both how AI systems retrieve and cite content and how to position brands within that retrieval. This is genuinely new territory with limited established expertise, creating opportunities for marketers who develop the specialty early.",
      requiredExperience:
        "Mid-level (3-6 years marketing or SEO experience). SEO professionals have the shortest path; content marketers with strong analytical orientation also transition well.",
      transferableSkills:
        "SEO fundamentals, content strategy, analytical thinking, comfort with new tooling, willingness to test and iterate.",
      skillGaps:
        "Understanding LLM retrieval patterns (RAG, citation behavior), structured data and schema markup for AI consumption, AI search analytics tools (still emerging), citation-worthy content frameworks, awareness of how different AI systems (OpenAI, Anthropic, Google, Perplexity) treat sources differently.",
      salaryRange:
        "$90K-$170K base, with wide variance because the role is still being defined. Some companies position this as SEO+ ($85K-$130K); others position it as a strategic new role ($130K-$170K+). Senior GEO specialists at AI-forward content companies can push higher, though the data here is thin.",
      timeline:
        "3-6 months. The specialty is new enough that visible expertise (writing publicly, building case studies) can establish credibility faster than traditional career paths.",
      bestFitsWhen:
        "Marketing Manager or content-focused marketer with SEO background; meaningful market-research time; willingness to operate in nascent territory; active learning rating regular.",
      caveat:
        "This is a highly emerging specialty. The role definition and best practices are still being established. Strong fit for marketers comfortable in nascent territory; less fit for those who need established career frameworks.",
      minSeniorityOrdinal: 1,
      maxSeniorityOrdinal: 6,
      strongContextIndustries: ["saas-software", "marketing-advertising", "media-entertainment", "ecommerce-retail"],
      scoringRules: [
        { label: "You spend significant time on market research", points: 20, test: (c) => pct(c, "market-research") > 15 },
        { label: "You're actively learning AI on your own time", points: 20, test: (c) => c.responses.activeLearning === "regular" },
        { label: "You already use 2+ AI tools", points: 15, test: (c) => c.toolCount >= 2 },
        { label: "You're comfortable with novel problems", points: 15, test: (c) => c.responses.novelProblems === "most" || c.responses.novelProblems === "frequently" },
        { label: "You're at mid-level or above", points: 10, test: (c) => c.seniorityOrdinal >= 1 },
      ],
    },
    {
      id: "content-operations",
      number: 8,
      name: "Content Operations Director / Manager",
      provenance: "emerging",
      type: "marketing-ops-ic",
      tier: "ic",
      dayToDay:
        "Run AI-augmented content production at scale. Oversee a mix of human writers, AI tools, and editorial workflows. Build quality control processes that catch AI hallucinations and voice inconsistencies. Manage content briefing, production, optimization, and distribution workflows. Often combines team management with systems design.",
      whyDurable:
        "As AI content generation scales, the production layer becomes critical. Companies need operators who can extract real value from AI tools while maintaining brand quality and editorial standards. Content Operations roles are among the strongest survival paths for content-heavy marketers, with AI proficiency adding 16-20% to compensation.",
      requiredExperience:
        "Mid-level to senior (4-8 years marketing or content experience). Marketers with significant content-calendar time and team-management experience have the shortest path.",
      transferableSkills:
        "Content calendar management, editorial judgment, team coordination, project management, brand voice understanding.",
      skillGaps:
        "AI content workflow design, evaluation rubric development for AI output, content operations tools (Contentful, Sanity, Storyblok with AI integrations), content attribution and analytics, governance frameworks for AI-generated content.",
      salaryRange:
        "Content Operations Manager $110K-$160K typical. Content Operations Director at growth-stage companies $140K-$200K. Senior roles at content-heavy AI companies push higher.",
      timeline:
        "6-12 months. Often a natural progression from Senior Content Manager or Content Strategist roles.",
      bestFitsWhen:
        "Senior Marketing Manager or content-focused marketer; significant content-calendar time; team leadership history; mid-to-large company background where content production scale matters.",
      minSeniorityOrdinal: 1,
      maxSeniorityOrdinal: 6,
      pathDefiningIndustries: ["media-entertainment", "marketing-advertising"],
      strongContextIndustries: ["saas-software", "ecommerce-retail", "education"],
      scoringRules: [
        { label: "You spend significant time on content calendar planning", points: 25, test: (c) => pct(c, "content-calendar") > 15 },
        { label: "You spend time leading a team", points: 20, test: (c) => pct(c, "team-leadership") > 10 },
        { label: "You spend time on brand voice / creative direction", points: 10, test: (c) => pct(c, "brand-voice") > 10 },
        { label: "You already use 2+ AI tools", points: 10, test: (c) => c.toolCount >= 2 },
        { label: "You're at mid-level or above", points: 10, test: (c) => c.seniorityOrdinal >= 1 },
      ],
    },
    {
      id: "founding-marketer",
      number: 9,
      name: "Founding Marketer at AI Startup",
      provenance: "emerging",
      type: "entrepreneurial",
      tier: "ic",
      dayToDay:
        "First or solo marketing hire at an early-stage AI company. Wear many hats: positioning, content production, growth experiments, lifecycle automation, basic analytics, sometimes sales support. High variance work — some weeks heavy on content, others on growth experiments, others on product launches. Direct working relationship with founders.",
      whyDurable:
        "Founding/early marketers at AI-native companies gain rare experience that compounds. The role rewards generalist skills and judgment about positioning, customer empathy, and rapid experimentation — work that AI itself cannot replicate. Equity upside compensates for moderate base salaries.",
      requiredExperience:
        "3-8 years marketing experience. Startup tolerance and generalist skill profile matter as much as years. Wide range of acceptable backgrounds.",
      transferableSkills:
        "Marketing fundamentals, comfort with ambiguity, generalist skill profile, written communication, willingness to do unglamorous work.",
      skillGaps:
        "Growth marketing for early-stage companies, lifecycle automation from scratch, building basic marketing infrastructure, working without senior marketing peers, sometimes basic SQL/analytics.",
      salaryRange:
        "Marketing Manager at AI startups averages around $135K base, with range $72K-$275K depending on company stage and location. Pre-seed/seed founding marketers typically $90K-$130K base + meaningful equity (0.25-1.5% common). Series A+ founding marketers $130K-$180K base + smaller equity.",
      timeline:
        "Can pivot immediately if willing to take startup risk. AngelList, Y Combinator's job board, and AI-specific startup job boards are best entry points.",
      bestFitsWhen:
        "Marketing Manager with generalist skill profile; low risk aversion; interest in AI as a category; comfortable with ambiguity; active learning rating regular.",
      minSeniorityOrdinal: 1,
      maxSeniorityOrdinal: 6,
      strongContextIndustries: ["saas-software", "fintech"],
      scoringRules: [
        { label: "You have a broad generalist profile", points: 20, test: (c) => isGeneralist(c.responses) },
        { label: "You're a heavy adopter of AI tools", points: 15, test: (c) => c.toolCount >= 3 },
        { label: "You're actively learning AI on your own time", points: 15, test: (c) => c.responses.activeLearning === "regular" },
        { label: "You're comfortable with novel problems", points: 10, test: (c) => c.responses.novelProblems === "most" || c.responses.novelProblems === "frequently" },
        { label: "You're at mid-level or above", points: 10, test: (c) => c.seniorityOrdinal >= 1 },
      ],
    },
    {
      id: "marketing-director-vp",
      number: 10,
      name: "Marketing Director / VP Marketing",
      provenance: "established",
      type: "leadership",
      // Deliberately `ic` rather than `executive`. From a Senior Marketing
      // Manager's perspective this is an aspirational upward move; from a
      // Director's perspective it's lateral; from a VP's perspective it's
      // downward. Tier-preference logic (§4.1.7) deprioritizes it for Director+
      // users so they see Paths 16-18 instead. Same rationale as SWE Path 4
      // (Engineering Manager).
      tier: "ic",
      dayToDay:
        "Lead marketing organization or major function. Set strategy, manage marketing org (typically 5-30 people), own pipeline/revenue accountability, work with executive team on go-to-market planning. Bridge between hands-on tactical work and executive strategy. Increasingly involves making decisions about AI investments at team and budget level.",
      whyDurable:
        "Marketing leadership is among the most AI-resistant marketing work. The premium for AI/ML skills is lower at leadership level — not because the skills don't matter, but because the work is inherently human (strategic judgment, organizational leadership, executive communication). As more tactical work gets automated, leverage shifts to those who decide what to do.",
      requiredExperience:
        "Senior (8-12 years marketing experience), with demonstrated team leadership and revenue accountability. Significant team-leadership time helps. Cross-functional history important.",
      transferableSkills:
        "Marketing strategy, cross-functional collaboration, budget management, team development, executive communication.",
      skillGaps:
        "Hiring at scale, performance management, budget allocation across channels, executive presence with founders/CEO, board-level marketing reporting, AI investment frameworks at team level.",
      salaryRange:
        "Marketing Director typically $180K-$280K base. VP Marketing $250K-$400K base; total comp $300K-$500K with equity. Top-paying VP Marketing roles at growth-stage tech and AI-native companies reach higher.",
      timeline:
        "12-24 months from Senior Marketing Manager. Internal promotion is faster; external moves take longer but often pay more.",
      bestFitsWhen:
        "Senior Marketing Manager; significant team-leadership time; relationship importance critical; decision stakes constant; 8+ years experience.",
      minSeniorityOrdinal: 2,
      maxSeniorityOrdinal: 6,
      pathDefiningIndustries: ["saas-software"],
      strongContextIndustries: ["ecommerce-retail", "fintech", "marketing-advertising"],
      scoringRules: [
        { label: "You spend significant time leading a team", points: 25, test: (c) => pct(c, "team-leadership") > 15 },
        { label: "Relationships are central to your work", points: 20, test: (c) => isRelationshipStrong(c.responses) },
        { label: "You spend significant time on cross-functional work", points: 15, test: (c) => pct(c, "cross-functional") > 15 },
        { label: "You regularly make high-stakes decisions", points: 10, test: (c) => isHighStakes(c.responses) },
        { label: "You're at senior level or above", points: 10, test: (c) => c.seniorityOrdinal >= 2 },
        { label: "You have a long professional track record (8+ years)", points: 10, test: (c) => c.responses.yearsExperience === "11-15" || c.responses.yearsExperience === "16+" || c.responses.yearsExperience === "6-10" },
      ],
    },
    {
      id: "vertical-ai-marketing-specialist",
      number: 11,
      name: "Vertical AI Marketing Specialist (Regulated Industries)",
      provenance: "emerging",
      type: "specialized-ic",
      tier: "ic",
      dayToDay:
        "Apply marketing expertise to a regulated vertical (fintech, healthtech, legaltech, pharma) where AI adoption is slower but specialization premium is higher. Lead marketing for products that need compliance-aware messaging, regulatory-sensitive content, and industry-specific positioning. Often combines marketing skills with deep domain immersion.",
      whyDurable:
        "Regulated industries adopt AI more slowly but with higher specialization premiums. Top-paying marketing manager industries include Pharmaceutical & Biotech, Legal, Financial Services, Energy, and Information Technology. Domain expertise + AI fluency is a rare and durable combination — and AI tools struggle with regulated-industry nuance.",
      requiredExperience:
        "Mid-level to senior (4-10 years), with existing industry experience strongly preferred but not strictly required. Marketing professionals willing to immerse in a specific vertical can transition with patience.",
      transferableSkills:
        "Marketing fundamentals, willingness to learn industry context, comfort with compliance constraints, written communication.",
      skillGaps:
        "Industry-specific regulatory knowledge (HIPAA for healthcare, FINRA for finance, etc.), vertical SaaS ecosystem fluency, technical product marketing for the chosen vertical, AI tool usage within compliance constraints.",
      salaryRange:
        "$110K-$200K base typically. Pharmaceutical & Biotech, Legal, and Financial Services command the highest premiums. Senior specialists with established vertical reputation reach $200K-$300K base at top employers.",
      timeline:
        "6-18 months. Pivoting to a vertical SaaS startup in your existing industry's adjacent space is the fastest path.",
      bestFitsWhen:
        "Marketing Manager with existing industry experience in fintech/healthtech/legaltech/pharma; or generalist marketer willing to specialize; high decision-stakes; significant marketing-strategy time.",
      minSeniorityOrdinal: 1,
      maxSeniorityOrdinal: 6,
      pathDefiningIndustries: REGULATED_INDUSTRIES,
      strongContextIndustries: ["cybersecurity"],
      scoringRules: [
        { label: "You bring deep domain expertise", points: 25, test: (c) => isDeepExpertise(c.responses) },
        { label: "You regularly make high-stakes decisions", points: 15, test: (c) => isHighStakes(c.responses) },
        { label: "Your work is highly differentiated", points: 10, test: (c) => c.scores.skillDifferentiationRaw > 65 },
        { label: "You spend significant time on marketing strategy", points: 10, test: (c) => pct(c, "marketing-strategy") > 10 },
        { label: "You're at mid-level or above", points: 10, test: (c) => c.seniorityOrdinal >= 1 },
      ],
    },
    {
      id: "independent-marketing-consultant",
      number: 12,
      name: "Independent Marketing Consultant",
      provenance: "forecast",
      type: "entrepreneurial",
      // `ic` not `executive` — P17 Fractional CMO is the proper executive
      // consulting path for Director+ users; this is senior IC consulting.
      tier: "ic",
      dayToDay:
        "Solo or small-team consulting practice helping companies adopt AI in marketing, restructure marketing operations, or solve specific strategic problems (positioning, launches, marketing audits). Project or retainer-based revenue. Mix of strategic advisory and hands-on implementation depending on engagement.",
      whyDurable:
        "Senior independent consultants in AI-augmented marketing command premium rates because the value is judgment, not execution. Established consultants with strong networks generate significant revenue. The AI consulting market in marketing is wide open and most enterprises are willing to pay for credible experts.",
      requiredExperience:
        "8+ years marketing experience, ideally with prior senior or leadership roles. Personal network and reputation matter as much as credentials. Specialization in a category (positioning, demand gen, AI marketing transformation) helps.",
      transferableSkills:
        "Marketing strategy, project management, cross-functional collaboration, business judgment, written and verbal communication.",
      skillGaps:
        "Business development, contract negotiation, pricing strategy (often the hardest skill), self-marketing, comfort with income variability, basic operations (taxes, accounting, contracts).",
      salaryRange:
        "Variable. Hourly rates $150-$400+ for senior marketing consultants. Annual revenue $100K-$400K achievable for established practices, with significant variance based on network and specialization. Top tier exceeds $500K but typically requires 5+ years of consulting practice building.",
      timeline:
        "12-24 months to build a sustainable practice. Most successful consultants start with one anchor client while wrapping up a previous role.",
      bestFitsWhen:
        "Senior Marketing Manager with 8+ years; strong network in their industry; willingness to do business development; comfort with variable income; demonstrated specialization in a marketing discipline.",
      minSeniorityOrdinal: 2,
      maxSeniorityOrdinal: 6,
      strongContextIndustries: ["marketing-advertising", "consulting", "saas-software"],
      scoringRules: [
        { label: "You have 8+ years of experience", points: 25, test: (c) => c.responses.yearsExperience === "16+" || c.responses.yearsExperience === "11-15" || c.responses.yearsExperience === "6-10" },
        { label: "You bring deep, marketable expertise", points: 20, test: (c) => isDeepExpertise(c.responses) },
        { label: "Relationships are central to your work", points: 15, test: (c) => isRelationshipStrong(c.responses) },
        { label: "You spend significant time on cross-functional work", points: 10, test: (c) => pct(c, "cross-functional") > 15 },
        { label: "You're at senior level or above", points: 10, test: (c) => c.seniorityOrdinal >= 2 },
      ],
    },

    // ─── Junior-eligible paths (spec v1.0.2 §4.2.2) ──────────────────────────

    {
      id: "ai-marketing-ops-associate",
      number: 13,
      name: "AI Marketing Operations Associate",
      provenance: "established",
      type: "marketing-ops-ic",
      tier: "junior",
      dayToDay:
        "Support marketing teams by managing AI tools, automating workflows, and producing AI-augmented content (HubSpot AI, Jasper, ChatGPT). Combines content production with tool administration and analytics. Often the first AI-adjacent role after an internship or junior role.",
      whyDurable:
        "Junior MarOps Associates with strong AI tool fluency compound rapidly. The role rewards AI fluency and judgment about tool selection — skills that traditional junior marketers are still building. Companies are actively positioning these roles as on-ramps to Marketing Ops careers.",
      requiredExperience:
        "0-2 years. Strong AI tool usage and willingness to learn matter more than credentials.",
      transferableSkills:
        "Marketing fundamentals (acquired via coursework or first role), comfort with tools, willingness to learn, attention to detail.",
      skillGaps:
        "Marketing automation platform admin (HubSpot, Marketo), basic SQL, attribution basics, lifecycle marketing patterns, evaluation skills for AI output.",
      salaryRange:
        "$55K-$85K base at most companies; higher at AI-forward marketing teams. AI-native startups commonly $70K-$95K + equity.",
      timeline:
        "0-3 months. Often the first AI-adjacent role after an internship or junior role.",
      bestFitsWhen:
        "Marketing coordinator/specialist title; 2+ AI tools used; high active-learning score; comfort with tools and data.",
      minSeniorityOrdinal: 0,
      maxSeniorityOrdinal: 1,
      strongContextIndustries: ["saas-software", "marketing-advertising"],
      scoringRules: [
        { label: "You're a junior IC", points: 25, test: (c) => c.seniorityOrdinal === 0 },
        { label: "You already use 2+ AI tools", points: 20, group: "tools-13", test: (c) => c.toolCount >= 2 },
        { label: "You already use 3+ AI tools heavily", points: 30, group: "tools-13", test: (c) => c.toolCount >= 3 },
        { label: "You're actively learning AI on your own time", points: 20, test: (c) => c.responses.activeLearning === "regular" },
        { label: "You spend time on performance analysis or A/B testing", points: 10, test: (c) => pct(c, "performance-analysis") > 5 || pct(c, "ab-testing") > 5 },
      ],
    },
    {
      id: "junior-prompt-engineer",
      number: 14,
      name: "Junior Prompt Engineer / AI Content Specialist",
      provenance: "emerging",
      type: "marketing-strategy-ic",
      tier: "junior",
      dayToDay:
        "Design and refine prompts for AI marketing tools at scale. Test prompt variations, document what works, build prompt libraries for teams. Combines creative work with systematic testing. Build a portfolio of documented prompt experiments first.",
      whyDurable:
        "Prompt engineering as a discipline is new enough that strong portfolios can substitute for years of experience. The role rewards writing skill plus systematic testing — a combination that AI itself doesn't yet do well at the strategic level.",
      requiredExperience:
        "0-2 years. Strong writing background and high differentiation on novel problems matter more than years.",
      transferableSkills:
        "Writing skill, attention to detail, comfort with iteration, ability to read documentation.",
      skillGaps:
        "Prompt design patterns, evaluation rubrics, brand-voice prompt engineering, output quality assessment, prompt library management.",
      salaryRange:
        "Entry-level prompt engineering roles typically $80K-$130K, with reported medians around $109K-$126K. Roles positioned as 'AI content specialist' or similar tend toward the lower end ($60K-$95K). Salary varies substantially by employer and how 'prompt engineering' is defined.",
      timeline:
        "3-6 months — build a portfolio of documented prompt experiments first.",
      bestFitsWhen:
        "Strong writing background; high differentiation on novel problems; multiple AI tools used; junior IC with a permissive AI policy.",
      minSeniorityOrdinal: 0,
      maxSeniorityOrdinal: 1,
      strongContextIndustries: ["saas-software", "marketing-advertising"],
      scoringRules: [
        { label: "You spend significant time writing marketing copy", points: 25, test: (c) => pct(c, "copywriting") > 15 },
        { label: "You're comfortable with novel problems", points: 20, test: (c) => c.responses.novelProblems === "most" || c.responses.novelProblems === "frequently" },
        { label: "You already use 2+ AI tools", points: 15, test: (c) => c.toolCount >= 2 },
        { label: "You're a junior or mid IC", points: 15, test: (c) => c.seniorityOrdinal <= 1 },
        { label: "You're actively learning AI on your own time", points: 10, test: (c) => c.responses.activeLearning === "regular" },
      ],
    },
    {
      id: "ai-marketing-assistant-startup",
      number: 15,
      name: "AI Marketing Assistant at AI-Native Startup",
      provenance: "emerging",
      type: "entrepreneurial",
      tier: "junior",
      dayToDay:
        "First or early marketing hire at an early-stage AI company. Wear many hats: content production, social media, email marketing, basic analytics, growth experiments. Equity upside compensates for lower base.",
      whyDurable:
        "Early marketing experience at an AI-native company compounds rapidly. The role rewards generalist skills and willingness to ship without senior marketing peers — work that AI itself cannot replicate.",
      requiredExperience:
        "0-2 years. Startup tolerance and generalist skill profile matter more than years.",
      transferableSkills:
        "Marketing fundamentals (from coursework or first role), willingness to learn, comfort with ambiguity, generalist orientation.",
      skillGaps:
        "Growth marketing for early-stage companies, lifecycle automation from scratch, building basic marketing infrastructure, working without senior marketing peers.",
      salaryRange:
        "$60K-$90K base + meaningful equity at seed/Series A. Top-paying AI startups in NYC and SF Bay Area push higher base.",
      timeline:
        "Can pivot now if willing to take startup risk — AngelList, Y Combinator's job board, and AI-specific startup boards are best.",
      bestFitsWhen:
        "Marketing coordinator/specialist title; generalist skill profile; low risk aversion; interest in AI as a category.",
      minSeniorityOrdinal: 0,
      maxSeniorityOrdinal: 1,
      strongContextIndustries: ["saas-software", "fintech"],
      scoringRules: [
        { label: "You're a junior IC", points: 25, test: (c) => c.seniorityOrdinal === 0 },
        { label: "You have a broad generalist profile", points: 20, test: (c) => isGeneralist(c.responses) },
        { label: "You're actively learning AI on your own time", points: 15, test: (c) => c.responses.activeLearning === "regular" },
        { label: "You're a heavy adopter of AI tools", points: 15, test: (c) => c.toolCount >= 3 },
        { label: "You're comfortable with novel problems", points: 10, test: (c) => c.responses.novelProblems === "most" || c.responses.novelProblems === "frequently" },
      ],
    },

    // ─── Executive-tier paths (spec v1.0.3 §4.2.2) ───────────────────────────

    {
      id: "vp-marketing-cmo",
      number: 16,
      name: "VP Marketing / CMO at AI-Native Company",
      provenance: "established",
      type: "leadership",
      tier: "executive",
      dayToDay:
        "Lead marketing organization at a venture-funded or growth-stage AI company. Set positioning and brand strategy, build marketing team, own pipeline and revenue marketing, work directly with CEO and board. Premium tier of marketing leadership in a high-growth segment.",
      whyDurable:
        "CMO/VP Marketing roles at AI-native companies require strategic judgment, organizational leadership, and external visibility that AI does not replicate. The work involves making positioning bets, building executive relationships, and developing a marketing organization — all human work.",
      requiredExperience:
        "12+ years marketing experience, with prior Director-level role (3+ years) and demonstrated revenue accountability.",
      transferableSkills:
        "Brand strategy, positioning, cross-functional collaboration, budget management, team development.",
      skillGaps:
        "Board-level communication, comfort with venture-backed financial models, AI product positioning fluency, executive presence with technical co-founders.",
      salaryRange:
        "Full-time CMO base typically $225K-$375K at growth-stage companies; total comp commonly $275K-$500K once equity is included. At public tech companies and frontier AI labs, total comp pushes substantially higher.",
      timeline:
        "12-24 months. Internal promotion or strategic external hire. Network and demonstrated revenue impact matter more than credentials.",
      bestFitsWhen:
        "Director of Marketing role with 12+ years experience, cross-functional history, critical relationships, revenue accountability.",
      minSeniorityOrdinal: 5,
      maxSeniorityOrdinal: 6,
      pathDefiningIndustries: ["saas-software", "marketing-advertising"],
      strongContextIndustries: ["fintech", "ecommerce-retail", "media-entertainment"],
      scoringRules: [
        { label: "You're at Director level or above", points: 30, test: (c) => c.seniorityOrdinal >= 5 },
        { label: "You have a long professional track record (12+ years)", points: 20, test: (c) => c.responses.yearsExperience === "16+" || c.responses.yearsExperience === "11-15" },
        { label: "You spend significant time on cross-functional work", points: 15, test: (c) => pct(c, "cross-functional") > 15 },
        { label: "Relationships are critical to your work", points: 15, test: (c) => c.responses.relationshipImportance === "critical" },
        { label: "You spend time leading a team", points: 10, test: (c) => pct(c, "team-leadership") > 5 },
        { label: "You already use 2+ AI tools", points: 10, test: (c) => c.toolCount >= 2 },
      ],
    },
    {
      id: "fractional-cmo",
      number: 17,
      name: "Fractional CMO / Independent Marketing Executive",
      provenance: "established",
      type: "entrepreneurial",
      tier: "executive",
      dayToDay:
        "Serve as part-time marketing executive for 2-4 companies simultaneously. Provide strategic marketing leadership, build marketing infrastructure, hire and manage team, own revenue outcomes — but on 8-40 hours per month per client. Operates with the authority of a full executive, not a consultant.",
      whyDurable:
        "Fractional marketing leadership has grown rapidly — the number of fractional leadership professionals in the US doubled from 60,000 in 2022 to 120,000 in 2024. The work requires strategic judgment and accountability that AI agents cannot match. Multiple concurrent engagements diversify income risk.",
      requiredExperience:
        "10+ years marketing experience, with prior VP/CMO or Director-level role. Brand or category expertise that companies will pay premium rates for.",
      transferableSkills:
        "Strategy, positioning, team management, vendor relationships, executive communication.",
      skillGaps:
        "Business development, contract negotiation, pricing strategy, self-marketing, comfort with income variability.",
      salaryRange:
        "Monthly retainers $5K-$20K per client; growth-stage companies ($10M-$200M revenue) pay $10K-$40K monthly. Hourly rates $500-$750. Established fractional CMOs commonly run portfolios producing $300K-$600K annually; top tier exceeds.",
      timeline:
        "12-24 months to build a sustainable practice. Most fractional CMOs start with one anchor client while wrapping up a previous role.",
      bestFitsWhen:
        "Senior marketing leader with 10+ years, strong network, willingness to do business development, comfort with variable income.",
      minSeniorityOrdinal: 5,
      maxSeniorityOrdinal: 6,
      strongContextIndustries: ["saas-software", "marketing-advertising", "consulting"],
      scoringRules: [
        { label: "You're at Director level or above", points: 25, test: (c) => c.seniorityOrdinal >= 5 },
        { label: "You have a long professional track record (10+ years)", points: 20, test: (c) => c.responses.yearsExperience === "16+" || c.responses.yearsExperience === "11-15" },
        { label: "Relationships are critical to your work", points: 20, test: (c) => c.responses.relationshipImportance === "critical" },
        { label: "You bring deep, marketable expertise", points: 15, test: (c) => isDeepExpertise(c.responses) },
        { label: "You spend significant time on cross-functional work", points: 10, test: (c) => pct(c, "cross-functional") > 15 },
      ],
    },
    {
      id: "chief-growth-officer",
      number: 18,
      name: "Chief Growth Officer / Head of Revenue Marketing",
      provenance: "emerging",
      type: "leadership",
      tier: "executive",
      dayToDay:
        "Lead the integration of marketing and revenue functions at a growth-stage company. Own pipeline, revenue marketing, sometimes sales enablement and customer marketing. Common role at PLG (product-led growth) companies and AI-native companies that have collapsed traditional marketing/sales boundaries.",
      whyDurable:
        "Growth leadership requires judgment about complex systems (acquisition, conversion, retention, expansion) and cross-functional execution. The role often reports directly to CEO and is responsible for the most strategic revenue decisions in the company.",
      requiredExperience:
        "12+ years experience, with prior Director-level role and demonstrated growth/revenue ownership.",
      transferableSkills:
        "Marketing strategy, analytical thinking, cross-functional collaboration, customer empathy.",
      skillGaps:
        "Deep funnel analytics, revenue operations frameworks, comfort with sales-side metrics, board-level revenue forecasting.",
      salaryRange:
        "Base $250K-$400K at growth-stage companies. Total comp commonly $400K-$700K with equity. Top performers at venture-backed companies push higher.",
      timeline:
        "12-24 months. Often involves first taking on growth or revenue marketing responsibility in a current role.",
      bestFitsWhen:
        "Senior marketing leader with strong analytical orientation, revenue accountability history, cross-functional collaboration time.",
      minSeniorityOrdinal: 5,
      maxSeniorityOrdinal: 6,
      pathDefiningIndustries: ["saas-software"],
      strongContextIndustries: ["fintech", "ecommerce-retail"],
      scoringRules: [
        { label: "You're at Director level or above", points: 25, test: (c) => c.seniorityOrdinal >= 5 },
        { label: "You spend significant time on performance analysis", points: 15, test: (c) => pct(c, "performance-analysis") > 10 },
        { label: "You spend significant time on cross-functional work", points: 15, test: (c) => pct(c, "cross-functional") > 15 },
        { label: "You spend time managing budget / ROI", points: 10, test: (c) => pct(c, "budget-roi") > 10 },
        { label: "You regularly make high-stakes decisions", points: 10, test: (c) => isHighStakes(c.responses) },
        { label: "You have a long professional track record (12+ years)", points: 10, test: (c) => c.responses.yearsExperience === "16+" || c.responses.yearsExperience === "11-15" },
      ],
    },
  ],
};

export default marketingManagers;
