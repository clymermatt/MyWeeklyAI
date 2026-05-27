/**
 * Software Engineer role configuration (spec Section 4.1).
 *
 * Task library calibrated at the Q2 2026 capability baseline. Subject to the
 * quarterly review process (spec 4.1.3). Pivot path library: 12 paths, audited
 * every 6 months (spec 4.1.8).
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

/** Industries where AI engineering hiring is strongest (pivot fit signal). */
const TECH_INDUSTRIES = [
  "saas-software",
  "fintech",
  "cybersecurity",
  "gaming",
  "media-entertainment",
];

const REGULATED_INDUSTRIES = ["healthcare", "legal", "fintech", "government"];

const isDeepExpertise = (r: UserResponses) =>
  r.domainExpertise === "most" || r.domainExpertise === "significant";

const isGeneralist = (r: UserResponses) =>
  r.domainExpertise === "some" || r.domainExpertise === "little";

const isRelationshipStrong = (r: UserResponses) =>
  r.relationshipImportance === "critical" || r.relationshipImportance === "important";

const isHighStakes = (r: UserResponses) =>
  r.decisionStakes === "constant" || r.decisionStakes === "regular";

// ─── Task library (spec 4.1.1) ───────────────────────────────────────────────

const TASK_LIBRARY: TaskDefinition[] = [
  {
    id: "feature-code",
    name: "Writing new feature code from clear specifications",
    automatabilityRating: 85,
    reasoning:
      "Among the most automated work in software engineering today. With clear specs and tools like Cursor, Claude Code, and GitHub Copilot, AI handles routine feature implementation competently — the bottleneck is increasingly spec quality, not coding speed. The 18-month trajectory points to AR 90+ as agents improve at multi-file changes and dependency reasoning.",
    whatsLeftForHumans:
      "Ambiguous requirements, novel patterns, integration with messy existing code, and judgment about when the spec itself is wrong.",
  },
  {
    id: "tests",
    name: "Writing tests",
    automatabilityRating: 90,
    reasoning:
      "Among the most automated coding tasks today. AI excels at unit tests, edge-case generation, and integration test scaffolding — highly pattern-driven work. The trajectory points toward AR 95 as generation improves at property-based and end-to-end tests.",
    whatsLeftForHumans:
      "Deciding what to test (test strategy), weighing test value against maintenance cost, and designing tests for genuinely novel behaviors.",
  },
  {
    id: "debug-routine",
    name: "Debugging routine bugs",
    automatabilityRating: 75,
    reasoning:
      "Common bugs — null references, off-by-one errors, type mismatches, common library misuse — are handled well by AI today; tools read stack traces, suggest fixes, and apply them. This improves steadily as AI reasons across larger codebases.",
    whatsLeftForHumans:
      "Bugs spanning multiple systems, bugs caused by misunderstood requirements, and bugs requiring deep institutional system knowledge.",
  },
  {
    id: "debug-novel",
    name: "Debugging novel or complex production issues",
    automatabilityRating: 35,
    reasoning:
      "Meaningfully different from routine debugging. Production incidents involve interactions between systems, data states that don't reproduce locally, and patterns nobody has seen before. AI assists with hypothesis generation and log analysis, but the diagnostic judgment remains human — and progress here is gated by runtime-context access, not model capability.",
    whatsLeftForHumans:
      "Pattern-matching against organizational history, decisions under uncertainty, and coordinating with humans during live incidents.",
  },
  {
    id: "refactor",
    name: "Refactoring or migrating legacy code",
    automatabilityRating: 80,
    reasoning:
      "Mechanical refactoring — renaming, extracting functions, modernizing syntax, framework migrations — is well-suited to AI's ability to make consistent changes across many files. The trajectory rises as large-scale codebase comprehension improves.",
    whatsLeftForHumans:
      "Deciding what to refactor, evaluating the risk of a refactor, and refactoring that depends on understanding business intent.",
  },
  {
    id: "code-review",
    name: "Code review",
    automatabilityRating: 55,
    reasoning:
      "A split task. Surface-level review — style, common bugs, security patterns, test coverage — is largely automated by tools like CodeRabbit and GitHub's AI review. Deep review — architectural fit, business-logic correctness, long-term maintainability — remains human, and most engineers do both.",
    whatsLeftForHumans:
      "Architectural judgment, mentorship delivered through review, and evaluating trade-offs that depend on business context.",
  },
  {
    id: "system-design",
    name: "System design and architecture decisions",
    automatabilityRating: 35,
    reasoning:
      "AI can suggest patterns, surface trade-offs, and produce candidate designs, but final architectural decisions require understanding business context, organizational reality, team capabilities, and long-term constraints found in no codebase. Among the most defensible work in software engineering.",
    whatsLeftForHumans:
      "Most of it — AI is an assistant, not a decision-maker, in architecture.",
  },
  {
    id: "docs",
    name: "Reading documentation and learning new tools",
    automatabilityRating: 70,
    reasoning:
      "Genuinely transformed by AI: engineers who once spent hours reading docs and searching Stack Overflow now get tailored explanations in minutes. One of the strongest augmentation stories in software work — though efficiency gains also mean fewer engineers are needed for the same output.",
    whatsLeftForHumans:
      "Evaluating whether explanations are correct, building deep (not surface) expertise, and judging which tools are worth learning.",
  },
  {
    id: "cross-functional",
    name: "Cross-functional collaboration (PM, design, business)",
    automatabilityRating: 15,
    reasoning:
      "Among the most AI-resistant work in software engineering. Meetings, async communication, negotiating priorities, explaining technical constraints to non-technical stakeholders, and building trust all depend on human relationships and judgment. AI assists — summarizing, drafting — but doesn't replace the work.",
    whatsLeftForHumans: "Almost all of it — durable work.",
  },
  {
    id: "mentoring",
    name: "Mentoring junior engineers",
    automatabilityRating: 10,
    reasoning:
      "Depends on trust, judgment about a specific person's growth, modeling professional behavior, and emotional intelligence. AI can supplement with code-review feedback and technical tutoring, but doesn't replace the human relationship. Among the most durable engineering work — and often what determines advancement toward leadership.",
    whatsLeftForHumans: "All of it.",
  },
  {
    id: "on-call",
    name: "On-call and incident response",
    automatabilityRating: 30,
    reasoning:
      "Modern incident response uses AI for log analysis, anomaly detection, and runbook execution, but the judgment work — deciding severity, coordinating response, making trade-offs under pressure, communicating with stakeholders — remains human. Improves as AI handles autonomous remediation for known incident types.",
    whatsLeftForHumans:
      "Novel incidents, severity judgment, organizational communication, and decisions requiring business context.",
  },
  {
    id: "research",
    name: "Research and technical prototyping",
    automatabilityRating: 50,
    reasoning:
      "Research-oriented work — evaluating new technologies, building prototypes, comparing approaches — sits in the middle. AI accelerates exploration significantly, but judgment about what to research and how to interpret results remains human. Rises as AI's scientific reasoning improves.",
    whatsLeftForHumans:
      "Choosing what to research, designing experiments, and interpreting results in context.",
  },
];

// ─── Pivot path library (spec 4.1.4) ─────────────────────────────────────────

const softwareEngineers: RoleConfig = {
  slug: "software-engineers",
  resultIdPrefix: "swe",
  label: "Software Engineer",
  pluralLabel: "Software Engineers",
  headline: "Will AI replace your software engineering job?",

  roleTitles: [
    { value: "engineer", label: "Software Engineer / Developer", seniorityOrdinal: 0, isJuniorIC: true, profileRole: "Software Engineer" },
    { value: "senior-engineer", label: "Senior Software Engineer", seniorityOrdinal: 2, profileRole: "Software Engineer" },
    { value: "staff", label: "Staff / Principal Engineer", seniorityOrdinal: 3, profileRole: "Software Engineer" },
    { value: "architect", label: "Software Architect", seniorityOrdinal: 3, profileRole: "Software Engineer" },
    { value: "manager", label: "Engineering Manager", seniorityOrdinal: 4, profileRole: "Engineering Manager" },
    { value: "director", label: "Director of Engineering", seniorityOrdinal: 5, isLeadership: true, profileRole: "CTO / VP Engineering" },
    { value: "vp-cto", label: "VP Engineering / CTO", seniorityOrdinal: 6, isLeadership: true, profileRole: "CTO / VP Engineering" },
  ],

  taskLibrary: TASK_LIBRARY,

  decisionStakesHelp:
    "Examples: security or safety implications, significant financial impact, irreversible architectural choices, compliance or regulatory consequences.",

  pivotPathAvailability: 90,

  baseUrgencyByLevel: {
    junior: 80,
    mid: 65,
    "senior-generalist": 50,
    "senior-specialized": 35,
    staff: 30,
    manager: 25,
    exec: 20,
  },

  durableSpecializations: {
    durable: [
      "Distributed systems / Systems engineering",
      "Security engineering (application or infrastructure)",
      "Database internals / Data infrastructure",
      "Compilers / Programming language design",
      "Real-time / Embedded systems",
      "High-performance computing",
      "ML infrastructure / MLOps",
      "Domain expertise in regulated industries (healthtech, fintech, defense)",
    ],
    moderate: [
      "Backend services / API design",
      "DevOps / Platform engineering",
      "Mobile engineering (iOS/Android native)",
      "Game engine development",
      "Computer graphics",
      "Robotics software",
    ],
    commoditizing: [
      "Frontend web development (general)",
      "CRUD application development",
      "WordPress / CMS development",
      "Generic full-stack development without depth",
      "Standard REST API development",
      "Routine internal tooling",
    ],
  },

  topRecommendedTool: "Cursor or Claude Code",
  landingToolMentions: "Cursor, Claude Code, and GitHub Copilot",
  landingSamplePersona: "Senior Software Engineer at a SaaS company",

  resolveSeniority: (r: UserResponses) => {
    switch (r.role) {
      case "engineer":
        return r.yearsExperience === "0-2"
          ? { levelKey: "junior", label: "Junior Engineer", ordinal: 0 }
          : { levelKey: "mid", label: "Mid-level Engineer", ordinal: 1 };
      case "senior-engineer":
        return isDeepExpertise(r)
          ? { levelKey: "senior-specialized", label: "Senior IC, specialized", ordinal: 2 }
          : { levelKey: "senior-generalist", label: "Senior IC, generalist", ordinal: 2 };
      case "staff":
        return { levelKey: "staff", label: "Staff / Principal Engineer", ordinal: 3 };
      case "architect":
        return { levelKey: "staff", label: "Software Architect", ordinal: 3 };
      case "manager":
        return { levelKey: "manager", label: "Engineering Manager", ordinal: 4 };
      case "director":
        return { levelKey: "exec", label: "Director of Engineering", ordinal: 5 };
      case "vp-cto":
        return { levelKey: "exec", label: "VP Engineering / CTO", ordinal: 6 };
      default:
        return { levelKey: "mid", label: "Mid-level Engineer", ordinal: 1 };
    }
  },

  pivotPaths: [
    {
      id: "ai-engineer",
      number: 1,
      name: "AI Engineer (LLM-focused)",
      provenance: "established",
      type: "ai-engineering-ic",
      dayToDay:
        "Build production features powered by LLMs. Integrate APIs from Anthropic, OpenAI, and Google. Design RAG pipelines, prompt systems, and evaluation frameworks. Ship customer-facing AI features in standard application contexts.",
      whyDurable:
        "AI engineering work is amplified by AI tools, not replaced by them. The bottleneck is judgment about what to build with AI and how to make it production-grade — work that requires human engineering taste.",
      requiredExperience: "Mid-level or above (3+ years). Junior engineers face stiff competition.",
      transferableSkills:
        "Backend/API development, system design, production engineering judgment, debugging skills.",
      skillGaps:
        "LLM API patterns (function calling, streaming, structured outputs), RAG architectures, vector databases, evaluation frameworks, prompt engineering as a discipline, cost/latency optimization for inference.",
      salaryRange: "$145K-$310K base; total comp pushes $400K+ at top companies with equity.",
      timeline: "3-6 months of focused learning while in your current role; pivot at your next job change.",
      bestFitsWhen:
        "Strong backend/API experience, comfort with messy production systems, and heavy use of 2-3 AI tools already.",
      minSeniorityOrdinal: 0,
      maxSeniorityOrdinal: 6,
      portfolioArtifactTemplate:
        "Build a small RAG application using OpenAI or Anthropic APIs. It doesn't need to be production-quality — it needs to be a learning experience and a portfolio artifact you can talk about.",
      scoringRules: [
        { label: "You spend significant time writing feature code", points: 20, test: (c) => pct(c, "feature-code") > 25 },
        { label: "You spend regular time debugging", points: 15, test: (c) => pct(c, "debug-routine") > 15 },
        { label: "You already use 2+ AI tools", points: 20, group: "tools", test: (c) => c.toolCount >= 2 },
        { label: "You already use 3+ AI tools heavily", points: 30, group: "tools", test: (c) => c.toolCount >= 3 },
        { label: "You're at mid-level or above", points: 15, test: (c) => c.seniorityOrdinal >= 1 },
        { label: "You work in an AI-forward industry", points: 10, test: (c) => TECH_INDUSTRIES.includes(c.industrySlug) },
        { label: "You bring backend / system depth", points: 10, test: (c) => isDeepExpertise(c.responses) },
      ],
    },
    {
      id: "ml-platform-engineer",
      number: 2,
      name: "ML/AI Platform Engineer (MLOps)",
      provenance: "established",
      type: "ai-engineering-ic",
      dayToDay:
        "Build and maintain the platforms that serve ML models in production: data pipelines, model serving infrastructure, observability, evaluation harnesses, and cost monitoring.",
      whyDurable:
        "ML platform work is severely supply-constrained — companies report 11+ weeks to fill senior MLOps roles. It requires both deep systems engineering and ML lifecycle understanding, a combination AI can't easily replicate.",
      requiredExperience: "Mid-to-senior (5+ years), with a strong infrastructure or backend background.",
      transferableSkills:
        "Distributed systems, Kubernetes/containers, CI/CD, observability/monitoring, cloud infrastructure.",
      skillGaps:
        "ML lifecycle (training to serving), model serving frameworks (Triton, vLLM, TGI), feature stores, ML-specific observability (drift detection, eval pipelines), vector databases.",
      salaryRange: "$130K-$257K base; senior MLOps at top companies clears $250K.",
      timeline:
        "6-12 months of focused learning while in your current role; DevOps/SRE backgrounds can pivot in 2-3 months.",
      bestFitsWhen:
        "Distributed-systems background, on-call/incident-response experience, comfort with infrastructure tools.",
      minSeniorityOrdinal: 0,
      maxSeniorityOrdinal: 6,
      portfolioArtifactTemplate:
        "Deploy an open-source model (e.g., Llama 3) on a small VM or cloud service. Add basic monitoring. Document the process.",
      scoringRules: [
        { label: "You spend real time on on-call / incident response", points: 20, test: (c) => pct(c, "on-call") > 10 },
        { label: "You handle complex production debugging", points: 10, test: (c) => pct(c, "debug-novel") > 10 },
        { label: "You're at senior level or above", points: 15, test: (c) => c.seniorityOrdinal >= 2 },
        { label: "You already use 2+ AI tools", points: 10, test: (c) => c.toolCount >= 2 },
        { label: "You bring deep systems expertise", points: 15, test: (c) => isDeepExpertise(c.responses) },
        { label: "You do refactoring / migration work", points: 5, test: (c) => pct(c, "refactor") > 10 },
      ],
    },
    {
      id: "forward-deployed-engineer",
      number: 3,
      name: "Forward Deployed Engineer",
      provenance: "emerging",
      type: "customer-facing-technical",
      dayToDay:
        "Embed with enterprise customers to deploy AI solutions in their environments. Customize, integrate, and ship AI applications that solve real business problems — heavy customer-facing work combined with deep technical implementation.",
      whyDurable:
        "One of the fastest-growing roles in tech — postings grew 800%+ YoY through 2026. It combines technical depth with customer-facing skills AI cannot replicate; OpenAI, Anthropic, Google, and Palantir are all hiring aggressively.",
      requiredExperience: "Senior IC (6+ years). Requires both technical depth and communication skills.",
      transferableSkills:
        "Full-stack development, system design, working across multiple languages/frameworks, comfort with ambiguous requirements.",
      skillGaps:
        "LLM-specific patterns, agent frameworks (LangGraph, CrewAI, DSPy), evaluation engineering, customer-facing communication, comfort with travel.",
      salaryRange: "$180K-$700K total comp (highest variance of any path); $150K-$250K base typical at mid-level.",
      timeline: "6-12 months; production engineering plus customer-facing history accelerates this significantly.",
      bestFitsWhen:
        "Strong communication, willingness to work with stakeholders, broad rather than deep technical skill, comfort with ambiguity.",
      minSeniorityOrdinal: 2,
      maxSeniorityOrdinal: 6,
      portfolioArtifactTemplate:
        "Identify a real business problem at your current company that could be solved with an LLM. Write a 1-page proposal with a specific implementation approach. Share it with one stakeholder.",
      scoringRules: [
        { label: "Relationships are central to your work", points: 25, test: (c) => isRelationshipStrong(c.responses) },
        { label: "You spend significant time on cross-functional work", points: 20, test: (c) => pct(c, "cross-functional") > 15 },
        { label: "You're comfortable with novel, ambiguous problems", points: 15, test: (c) => c.responses.novelProblems === "most" || c.responses.novelProblems === "frequently" },
        { label: "You already use 2+ AI tools", points: 10, test: (c) => c.toolCount >= 2 },
        { label: "You're at senior level or above", points: 10, test: (c) => c.seniorityOrdinal >= 2 },
        { label: "You have a broad generalist profile", points: 10, test: (c) => isGeneralist(c.responses) },
      ],
    },
    {
      id: "engineering-manager",
      number: 4,
      name: "Engineering Manager / Tech Lead",
      provenance: "established",
      type: "leadership",
      dayToDay:
        "Lead a team of engineers: hiring, coaching, technical strategy, organizational navigation, cross-functional work — and increasingly, deciding which AI tools your team adopts and how to evolve team practices.",
      whyDurable:
        "Engineering management is among the most AI-resistant tech work. As coding is automated, the leverage of those who decide what to build and lead the people building it only increases.",
      requiredExperience: "Senior IC level (6-10+ years) with mentorship and informal leadership history.",
      transferableSkills:
        "Code review, mentorship, architectural thinking, cross-functional collaboration experience.",
      skillGaps:
        "People-management fundamentals (hiring, performance reviews, difficult conversations), organizational politics, budgeting, AI tool evaluation at team level.",
      salaryRange: "$350K-$550K total comp at major tech companies; $200K-$300K base + equity at startups.",
      timeline: "12-24 months; look for Tech Lead opportunities now as a stepping stone. Internal moves are easier.",
      bestFitsWhen:
        "Significant mentoring time, strong relationship-importance scores, and prior informal leadership history.",
      minSeniorityOrdinal: 2,
      maxSeniorityOrdinal: 6,
      portfolioArtifactTemplate:
        "Volunteer to lead one cross-functional initiative this month. Document your approach to coordination and decision-making.",
      scoringRules: [
        { label: "You already spend meaningful time mentoring", points: 30, test: (c) => pct(c, "mentoring") > 10 },
        { label: "Relationships are central to your work", points: 20, test: (c) => isRelationshipStrong(c.responses) },
        { label: "You spend significant time on cross-functional work", points: 15, test: (c) => pct(c, "cross-functional") > 15 },
        { label: "You're at senior level or above", points: 15, test: (c) => c.seniorityOrdinal >= 2 },
        { label: "You're active in code review", points: 10, test: (c) => pct(c, "code-review") > 10 },
      ],
    },
    {
      id: "founding-engineer",
      number: 5,
      name: "Founding Engineer at an AI-Native Startup",
      provenance: "emerging",
      type: "entrepreneurial",
      dayToDay:
        "Be one of the first 1-5 engineers at an early-stage AI company. Build product from scratch, wear many hats, and make architectural decisions that shape the company. Equity upside is the primary compensation play.",
      whyDurable:
        "Founding engineers shape the product before it exists. AI accelerates execution but doesn't replace the judgment of what to build, for whom, and how.",
      requiredExperience: "Senior IC (6+ years). Founders want someone who can ship without supervision.",
      transferableSkills:
        "Generalist breadth, ability to ship MVPs quickly, comfort with ambiguity, willingness to do unglamorous work.",
      skillGaps:
        "Comfort with foundational decisions (no roadmap, no playbook), modern AI APIs, constant on-call, business/product instincts.",
      salaryRange: "$132K-$392K base; median ~$200K-$250K base + 0.5-2% equity at seed/Series A.",
      timeline: "Can pivot at your next job change; typically requires network, not credentials.",
      bestFitsWhen:
        "Generalist skill profile, low risk aversion, willingness to work intensely, prior startup experience or strong personal projects.",
      minSeniorityOrdinal: 2,
      maxSeniorityOrdinal: 6,
      scoringRules: [
        { label: "You have a broad generalist profile", points: 20, test: (c) => isGeneralist(c.responses) },
        { label: "You're comfortable with novel problems", points: 15, test: (c) => c.responses.novelProblems === "most" || c.responses.novelProblems === "frequently" },
        { label: "You're a heavy adopter of AI tools", points: 15, test: (c) => c.toolCount >= 3 },
        { label: "You work in software/SaaS", points: 10, test: (c) => c.industrySlug === "saas-software" },
        { label: "You're at senior level or above", points: 10, test: (c) => c.seniorityOrdinal >= 2 },
        { label: "You ship feature code at pace", points: 10, test: (c) => pct(c, "feature-code") > 25 },
      ],
    },
    {
      id: "ai-agent-ops-engineer",
      number: 6,
      name: "AI/Agent Operations Engineer",
      provenance: "emerging",
      type: "ai-engineering-ic",
      dayToDay:
        "Run the infrastructure under deployed agent systems: model versioning, prompt deployment pipelines, evaluation cadence, and incident response when an agent misbehaves in production. 'DevOps for AI agents.'",
      whyDurable:
        "Most companies that shipped agent systems in 2024-2025 now realize they need someone whose actual job is keeping them running. The role barely existed two years ago and is now in high demand.",
      requiredExperience: "Mid-to-senior (4-8 years). SRE/DevOps backgrounds are natural fits.",
      transferableSkills:
        "SRE practices, incident management, on-call experience, debugging production issues, observability tools.",
      skillGaps:
        "LLM API patterns, eval pipelines, cost monitoring for inference, agent-framework familiarity, prompt versioning systems.",
      salaryRange: "$155K-$275K. Hot demand because supply is severely constrained.",
      timeline: "2-3 months for SRE/DevOps engineers; 4-6 months for backend engineers with on-call experience.",
      bestFitsWhen:
        "On-call/incident-response time, infrastructure background, novel-debugging skill, interest in operating systems over building features.",
      minSeniorityOrdinal: 0,
      maxSeniorityOrdinal: 6,
      scoringRules: [
        { label: "You spend significant time on on-call / incident response", points: 30, test: (c) => pct(c, "on-call") > 15 },
        { label: "You're skilled at complex production debugging", points: 20, test: (c) => pct(c, "debug-novel") > 15 },
        { label: "You already use 2+ AI tools", points: 10, test: (c) => c.toolCount >= 2 },
        { label: "You're at mid-level or above", points: 10, test: (c) => c.seniorityOrdinal >= 1 },
        { label: "Your work leans operational rather than feature-building", points: 10, test: (c) => pct(c, "feature-code") < 15 },
      ],
    },
    {
      id: "ai-eval-engineer",
      number: 7,
      name: "AI Evaluation & Testing Engineer",
      provenance: "emerging",
      type: "ai-engineering-ic",
      dayToDay:
        "Build evaluation systems for AI products: design eval sets, write rubrics, run regression testing against model updates, and catch hallucinations before production. The 'QA engineering' for AI systems.",
      whyDurable:
        "As AI is deployed in more contexts, evaluation becomes the bottleneck. The work requires domain knowledge plus ML literacy plus systems engineering — a rare combination AI itself doesn't yet do well.",
      requiredExperience: "Mid-level (3+ years). QA, test, and ML engineers all pivot into this.",
      transferableSkills: "Testing skills, systematic thinking, comfort with statistics, debugging skills.",
      skillGaps:
        "ML evaluation frameworks (DSPy, Inspect, LangSmith), human-evaluation methodology, eval-set design, regression testing for non-deterministic systems.",
      salaryRange: "$130K-$220K base; higher at frontier labs and consumer AI products.",
      timeline: "3-6 months; test engineers and QA leads have the shortest path.",
      bestFitsWhen:
        "Strong testing background, debugging skills, systematic thinking, interest in correctness over building features.",
      minSeniorityOrdinal: 0,
      maxSeniorityOrdinal: 6,
      scoringRules: [
        { label: "You spend significant time writing tests", points: 30, test: (c) => pct(c, "tests") > 15 },
        { label: "You're active in routine debugging", points: 15, test: (c) => pct(c, "debug-routine") > 10 },
        { label: "You handle complex production debugging", points: 10, test: (c) => pct(c, "debug-novel") > 10 },
        { label: "You bring a quality / correctness mindset", points: 10, test: (c) => isHighStakes(c.responses) },
        { label: "You already use 2+ AI tools", points: 10, test: (c) => c.toolCount >= 2 },
      ],
    },
    {
      id: "solutions-engineer",
      number: 8,
      name: "Solutions Engineer / Sales Engineer at an AI Company",
      provenance: "established",
      type: "customer-facing-technical",
      dayToDay:
        "Pre-sales technical work for AI products: demo capabilities to prospects, build proofs-of-concept, partner with sales to close deals, and feed customer needs back to product. Heavy communication, less coding.",
      whyDurable:
        "Pre-sales technical work depends on relationships, judgment, and adapting to customer context — areas where AI augments but doesn't replace humans. Solutions engineers are in chronic short supply at AI companies.",
      requiredExperience: "Mid-to-senior (4+ years) with strong communication.",
      transferableSkills:
        "Demo skills, ability to explain technical concepts to non-technical audiences, broad technical knowledge.",
      skillGaps:
        "Sales-process literacy, ROI/business-value framing, presentation skills, less coding (a hard transition for builders).",
      salaryRange: "$200K-$400K total comp; base $130K-$220K + commission.",
      timeline: "3-6 months; developer-advocacy or pre-sales experience accelerates this dramatically.",
      bestFitsWhen:
        "Strong communication, customer-facing work history, broad technical skills, enjoyment of presentation work.",
      minSeniorityOrdinal: 0,
      maxSeniorityOrdinal: 6,
      scoringRules: [
        { label: "You spend significant time on cross-functional work", points: 25, test: (c) => pct(c, "cross-functional") > 15 },
        { label: "Relationships are central to your work", points: 20, test: (c) => isRelationshipStrong(c.responses) },
        { label: "You have a broad generalist profile", points: 15, test: (c) => isGeneralist(c.responses) },
        { label: "You spend time learning and explaining tools", points: 10, test: (c) => pct(c, "docs") > 10 },
        { label: "You already use 2+ AI tools", points: 10, test: (c) => c.toolCount >= 2 },
      ],
    },
    {
      id: "ai-security-engineer",
      number: 9,
      name: "AI Security Engineer",
      provenance: "emerging",
      type: "specialized-ic",
      dayToDay:
        "Build security infrastructure around AI systems: red-team LLM applications, design guardrails, evaluate prompt-injection risk, and work on AI safety controls in production.",
      whyDurable:
        "AI introduces entirely new attack surfaces — prompt injection, agent escape, training-data poisoning — that standard security practices don't cover. Demand grows rapidly as AI deployments scale.",
      requiredExperience:
        "Senior IC (5+ years) with a security background, or a strong AI engineer moving into security.",
      transferableSkills:
        "Security mindset, systematic thinking, adversarial reasoning, infrastructure knowledge.",
      skillGaps:
        "LLM-specific attack patterns, red-teaming techniques, AI safety frameworks, the regulatory landscape (especially the EU AI Act).",
      salaryRange: "$200K-$350K base; higher at frontier labs and security-focused AI startups.",
      timeline: "6-12 months; existing security engineers have the shortest path.",
      bestFitsWhen:
        "High decision-stakes score, interest in correctness/safety, adversarial thinking, prior security or compliance work.",
      minSeniorityOrdinal: 2,
      maxSeniorityOrdinal: 6,
      scoringRules: [
        { label: "You regularly make high-stakes decisions", points: 30, test: (c) => isHighStakes(c.responses) },
        { label: "You work in cybersecurity", points: 20, test: (c) => c.industrySlug === "cybersecurity" },
        { label: "You're at senior level or above", points: 15, test: (c) => c.seniorityOrdinal >= 2 },
        { label: "You bring deep specialist expertise", points: 15, test: (c) => isDeepExpertise(c.responses) },
        { label: "You're skilled at novel-problem debugging", points: 10, test: (c) => pct(c, "debug-novel") > 10 },
      ],
    },
    {
      id: "devrel",
      number: 10,
      name: "Developer Advocate / DevRel for AI Tools",
      provenance: "established",
      type: "customer-facing-technical",
      dayToDay:
        "Be the public face of an AI developer product: write technical content, build sample apps, speak at conferences, support the developer community, and feed product insights back to engineering.",
      whyDurable:
        "Developer relations is fundamentally about trust and teaching — areas AI augments but doesn't replace. AI tool companies need credible technical voices to build developer adoption.",
      requiredExperience: "Mid-to-senior (4+ years) with strong communication and a content history.",
      transferableSkills:
        "Code skills (you still build demos), technical writing, presentation experience, community engagement.",
      skillGaps:
        "Public speaking, content strategy, social-media presence, less direct ownership of product.",
      salaryRange: "$150K-$300K base; senior advocates at major AI companies clear $250K+.",
      timeline: "6-12 months; build a portfolio of public content first.",
      bestFitsWhen:
        "A history of writing or speaking, side projects, comfort with public-facing work, a generalist profile.",
      minSeniorityOrdinal: 0,
      maxSeniorityOrdinal: 6,
      scoringRules: [
        { label: "You're comfortable in communication-heavy work", points: 20, test: (c) => pct(c, "cross-functional") > 15 },
        { label: "You spend time learning and explaining tools", points: 15, test: (c) => pct(c, "docs") > 15 },
        { label: "You have a broad generalist profile", points: 15, test: (c) => isGeneralist(c.responses) },
        { label: "You're a heavy adopter of AI tools", points: 15, test: (c) => c.toolCount >= 3 },
        { label: "Relationships matter to your work", points: 10, test: (c) => isRelationshipStrong(c.responses) },
        { label: "You're at mid-level or above", points: 10, test: (c) => c.seniorityOrdinal >= 1 },
      ],
    },
    {
      id: "vertical-ai-specialist",
      number: 11,
      name: "Vertical AI Specialist (Healthcare / Legal / Fintech AI)",
      provenance: "emerging",
      type: "specialized-ic",
      dayToDay:
        "Apply AI to a specific regulated industry, combining engineering with deep domain knowledge to build AI products that handle the unique requirements of healthcare, legal, financial services, or government.",
      whyDurable:
        "Regulated industries adopt AI more slowly but with higher specialization premiums. Domain expertise plus AI engineering is a rare, durable combination.",
      requiredExperience:
        "Mid-to-senior. Domain experience helps significantly but isn't strictly required given strong willingness to learn.",
      transferableSkills:
        "All standard engineering skills, plus adaptability to compliance and regulatory contexts.",
      skillGaps:
        "Industry-specific regulations (HIPAA, SOC 2, SOX), domain workflows, vertical-specific AI patterns.",
      salaryRange: "$160K-$280K base; healthcare and finance command a premium for compliance-aware engineers.",
      timeline: "6-18 months; pivoting to a vertical AI startup adjacent to your current industry is fastest.",
      bestFitsWhen:
        "Existing industry experience, high differentiation scores, interest in domain depth over breadth.",
      minSeniorityOrdinal: 0,
      maxSeniorityOrdinal: 6,
      scoringRules: [
        { label: "You already work in a regulated industry", points: 30, test: (c) => REGULATED_INDUSTRIES.includes(c.industrySlug) },
        { label: "You bring deep domain expertise", points: 25, test: (c) => isDeepExpertise(c.responses) },
        { label: "Your work is highly differentiated", points: 15, test: (c) => c.scores.skillDifferentiationRaw > 65 },
        { label: "You regularly make high-stakes decisions", points: 10, test: (c) => isHighStakes(c.responses) },
        { label: "You're at mid-level or above", points: 10, test: (c) => c.seniorityOrdinal >= 1 },
      ],
    },
    {
      id: "independent-consultant",
      number: 12,
      name: "Independent AI Consultant / Boutique Founder",
      provenance: "forecast",
      type: "entrepreneurial",
      dayToDay:
        "Run a solo or small-team consulting practice helping businesses adopt AI — enterprise AI integration, AI strategy advisory, fractional AI engineering, or specialized boutique consulting. Often hourly or project-based revenue.",
      whyDurable:
        "Independent consulting is the highest-leverage path for senior engineers who've built a reputation: direct client relationships, premium rates, and full control of which work to take. The AI consulting market is wide open.",
      requiredExperience: "Senior IC or above (8+ years), often paired with prior management experience.",
      transferableSkills:
        "Deep technical expertise, ability to deliver projects end-to-end, client communication, business judgment.",
      skillGaps:
        "Business development, contract negotiation, pricing strategy, self-marketing, comfort with income variability.",
      salaryRange: "Variable; hourly rates $200-500+, annual revenue $250K-$1M+ for established practices.",
      timeline: "12-24 months; requires building reputation and pipeline first, often starting as side consulting.",
      bestFitsWhen:
        "Senior experience, strong communication, a history of independent work, willingness to handle business operations.",
      minSeniorityOrdinal: 2,
      maxSeniorityOrdinal: 6,
      scoringRules: [
        { label: "You have staff-level or leadership experience", points: 25, test: (c) => c.seniorityOrdinal >= 3 },
        { label: "Relationships are central to your work", points: 20, test: (c) => isRelationshipStrong(c.responses) },
        { label: "You bring deep, marketable expertise", points: 20, test: (c) => isDeepExpertise(c.responses) },
        { label: "You spend significant time on cross-functional work", points: 15, test: (c) => pct(c, "cross-functional") > 15 },
        { label: "You have a long professional track record", points: 15, test: (c) => c.responses.yearsExperience === "16+" || c.responses.yearsExperience === "11-15" },
      ],
    },
  ],
};

export default softwareEngineers;
