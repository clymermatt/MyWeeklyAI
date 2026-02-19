import type { ContextProfile, NewsItem } from "@/generated/prisma/client";

/** Escapes special regex characters in a string */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Tests whether a keyword appears as a whole word/phrase in text */
function wordMatch(text: string, keyword: string): boolean {
  // Multi-word phrases and hyphenated terms: use word boundaries at edges
  const pattern = new RegExp(`\\b${escapeRegex(keyword)}\\b`, "i");
  return pattern.test(text);
}

/** Maps predefined industries to expanded keyword sets for better matching */
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "SaaS / Software": [
    "saas", "software", "cloud", "developer", "devtools", "platform", "b2b",
    "subscription", "infrastructure", "devops", "container", "deployment",
    "open source", "automation", "tooling", "coding", "microservices",
  ],
  "Fintech / Financial Services": [
    "fintech", "finance", "financial", "banking", "bank", "payments",
    "trading", "insurance", "compliance", "fraud", "investment", "capital",
    "lending", "funding", "valuation", "blockchain", "crypto", "treasury",
    "underwriting", "wealth management",
  ],
  "Healthcare / Life Sciences": [
    "healthcare", "medical", "health", "clinical", "pharma", "biotech",
    "patient", "diagnosis", "diagnostic", "drug", "fda", "vaccine", "trial",
    "therapy", "hospital", "physician", "genomic", "regulatory", "wellness",
    "nursing", "oncology", "radiology",
  ],
  "E-commerce / Retail": [
    "ecommerce", "e-commerce", "retail", "shopping", "marketplace",
    "consumer", "brand", "commerce", "shopper", "merchant", "checkout",
    "fulfillment", "storefront", "inventory", "supply chain",
    "personalization", "pricing",
  ],
  "Education / EdTech": [
    "education", "edtech", "learning", "student", "teacher", "university",
    "course", "training", "school", "k-12", "classroom", "literacy",
    "curriculum", "district", "educator", "teaching", "academic", "stem",
    "tutoring", "pedagogy",
  ],
  "Media / Entertainment": [
    "entertainment", "content creation", "video", "streaming", "music",
    "publishing", "creator", "film", "movie", "cinema", "hollywood",
    "studio", "actor", "director", "animation", "television", "oscar",
    "franchise", "production", "box office",
  ],
  "Marketing / Advertising": [
    "marketing", "advertising", "ad tech", "campaign", "seo",
    "social media", "analytics", "targeting", "personalization", "roi",
    "ctr", "conversion", "funnel", "audience", "engagement", "attribution",
    "programmatic",
  ],
  "Consulting / Professional Services": [
    "consulting", "advisory", "professional services", "strategy",
    "management consulting", "transformation", "due diligence",
    "assessment", "advisory firm",
  ],
  "Manufacturing / Industrial": [
    "manufacturing", "industrial", "supply chain", "factory", "production",
    "robotics", "predictive maintenance", "quality inspection", "automation",
    "industrial iot",
  ],
  "Real Estate / PropTech": [
    "real estate", "proptech", "property", "housing", "mortgage",
    "construction", "valuation", "tenant", "lease", "commercial real estate",
  ],
  "Legal / LegalTech": [
    "legal", "legaltech", "law firm", "compliance", "contract", "regulation",
    "attorney", "lawyer", "litigation", "copyright", "patent", "trademark",
    "intellectual property", "infringement", "deposition", "court",
    "judicial", "paralegal",
  ],
  "Government / Public Sector": [
    "government", "public sector", "policy", "regulation", "civic",
    "federal", "defense", "municipal", "legislation", "procurement",
    "public service",
  ],
  "Cybersecurity": [
    "cybersecurity", "security", "threat", "vulnerability", "malware",
    "encryption", "privacy", "breach", "data breach", "hack", "hacker",
    "exploit", "zero-day", "attack", "ransomware", "phishing", "compromise",
    "credential", "authentication", "access management", "incident response",
    "siem", "soc",
  ],
  "Gaming": [
    "gaming", "game", "esports", "metaverse", "virtual reality", "unity",
    "unreal", "npc", "procedural generation", "game development",
  ],
  "Telecommunications": [
    "telecom", "telecommunications", "5g", "network", "wireless",
    "broadband", "spectrum", "carrier", "mobile network",
  ],
  "Energy / CleanTech": [
    "energy", "cleantech", "solar", "renewable", "climate",
    "sustainability", "carbon", "grid", "wind power", "battery",
    "electric vehicle",
  ],
  "Transportation / Logistics": [
    "transportation", "logistics", "autonomous", "self-driving", "fleet",
    "delivery", "shipping", "warehouse", "route optimization",
    "freight", "last mile",
  ],
};

/** Maps predefined roles to expanded keyword sets */
const ROLE_KEYWORDS: Record<string, string[]> = {
  "Software Engineer": [
    "engineer", "developer", "coding", "programming", "code", "frontend",
    "backend", "fullstack", "infrastructure", "container", "docker",
    "kubernetes", "debugging", "testing", "architecture", "devtools",
    "ci/cd", "open source", "refactoring", "compiler",
  ],
  "Product Manager": [
    "product", "roadmap", "feature", "user research", "prioritization",
    "stakeholder", "product-led", "launch", "release", "adoption",
    "workflow", "integration", "onboarding", "mvp", "product strategy",
    "user experience",
  ],
  "UX / Product Designer": [
    "ux", "design", "user experience", "interface", "usability",
    "prototype", "figma", "interaction", "accessibility", "design system",
    "wireframe", "user testing",
  ],
  "Data Scientist / ML Engineer": [
    "data science", "machine learning", "model", "training", "dataset",
    "neural", "deep learning", "nlp", "computer vision", "fine-tuning",
    "inference", "benchmark", "embeddings", "vector",
  ],
  "Engineering Manager": [
    "engineering", "team", "hiring", "sprint", "agile", "leadership",
    "technical debt", "engineering org", "developer productivity",
    "code review", "on-call",
  ],
  "CTO / VP Engineering": [
    "cto", "architecture", "infrastructure", "scaling", "technical strategy",
    "engineering org", "build vs buy", "platform", "migration",
    "technical leadership",
  ],
  "CEO / Founder": [
    "startup", "founder", "ceo", "fundraising", "growth", "business model",
    "venture", "investor", "valuation", "series a", "seed round",
    "go-to-market", "revenue",
  ],
  "Marketing Manager": [
    "marketing", "campaign", "brand", "seo", "conversion", "engagement",
    "audience", "advertising", "ad creative", "targeting",
    "personalization", "roi", "ctr", "funnel", "analytics",
    "content marketing", "demand gen",
  ],
  "Content Strategist": [
    "content", "editorial", "copywriting", "blog", "newsletter",
    "storytelling", "publishing", "content strategy", "seo",
    "content marketing", "audience growth",
  ],
  "Sales / Revenue": [
    "sales", "revenue", "pipeline", "crm", "deal", "prospect", "quota",
    "closing", "outbound", "cold email", "sales enablement",
    "account executive",
  ],
  "DevOps / Platform Engineer": [
    "devops", "infrastructure", "ci/cd", "kubernetes", "docker",
    "deployment", "monitoring", "terraform", "observability",
    "incident response", "sre", "platform engineering",
  ],
  "Research Scientist": [
    "research", "paper", "experiment", "benchmark", "arxiv", "study",
    "findings", "methodology", "peer review", "reproducibility",
    "hypothesis",
  ],
  "Business Analyst": [
    "analytics", "dashboard", "metrics", "kpi", "reporting",
    "business intelligence", "data visualization", "sql", "tableau",
    "power bi", "forecasting",
  ],
  "Project Manager": [
    "project", "timeline", "milestone", "deliverable", "stakeholder",
    "resource", "planning", "agile", "scrum", "sprint", "risk management",
  ],
  "Customer Success": [
    "customer success", "onboarding", "retention", "churn", "support",
    "nps", "satisfaction", "customer experience", "renewal", "upsell",
  ],
  "Solutions Architect": [
    "architecture", "integration", "solution", "enterprise", "migration",
    "scalability", "system design", "api design", "microservices",
    "cloud architecture",
  ],
  "Consultant": [
    "consulting", "advisory", "strategy", "transformation",
    "recommendation", "assessment", "engagement", "deliverable",
    "client", "advisory firm",
  ],
  "Student / Researcher": [
    "research", "study", "academic", "learning", "thesis", "paper",
    "experiment", "coursework", "graduate", "phd", "scholarship",
  ],
};

/**
 * Scores a news item against a user's context profile using keyword matching.
 * Returns a score from 0-100 indicating estimated relevance.
 */
export function scoreRelevance(
  item: NewsItem,
  profile: ContextProfile,
): number {
  const searchableText = [
    item.title,
    item.summary ?? "",
    ...item.tags,
  ].join(" ");

  let score = 0;
  let matches = 0;

  // Industry match (high weight — primary personalization signal)
  if (profile.industry) {
    // Direct match
    if (wordMatch(searchableText, profile.industry)) {
      score += 18;
      matches++;
    }
    // Expanded keyword match
    const expandedKeywords = INDUSTRY_KEYWORDS[profile.industry] ?? [];
    let industryKeywordHits = 0;
    for (const kw of expandedKeywords) {
      if (wordMatch(searchableText, kw)) {
        industryKeywordHits++;
      }
    }
    if (industryKeywordHits > 0) {
      score += Math.min(industryKeywordHits * 5, 15);
      matches++;
    }
  }

  // Role match (high weight — primary personalization signal)
  if (profile.roleTitle) {
    // Direct match
    if (wordMatch(searchableText, profile.roleTitle)) {
      score += 18;
      matches++;
    }
    // Expanded keyword match
    const expandedKeywords = ROLE_KEYWORDS[profile.roleTitle] ?? [];
    let roleKeywordHits = 0;
    for (const kw of expandedKeywords) {
      if (wordMatch(searchableText, kw)) {
        roleKeywordHits++;
      }
    }
    if (roleKeywordHits > 0) {
      score += Math.min(roleKeywordHits * 5, 15);
      matches++;
    }
  }

  // Focus topics (high weight — explicit user interest)
  for (const topic of profile.focusTopics) {
    if (wordMatch(searchableText, topic)) {
      score += 15;
      matches++;
    }
  }

  // Tools & platforms (high weight — directly actionable)
  for (const tool of profile.tools) {
    if (wordMatch(searchableText, tool)) {
      score += 12;
      matches++;
    }
  }

  // Goals match (partial keyword matching — split multi-word goals)
  for (const goal of profile.goals) {
    const keywords = goal.toLowerCase().split(/\s+/);
    const goalMatches = keywords.filter(
      (kw) => kw.length > 3 && wordMatch(searchableText, kw),
    );
    if (goalMatches.length > 0) {
      score += 5 * Math.min(goalMatches.length, 3);
      matches++;
    }
  }

  // Penalize avoided topics
  for (const avoid of profile.avoidTopics) {
    if (wordMatch(searchableText, avoid)) {
      score -= 25;
    }
  }

  // Bonus for multiple profile field matches (cross-relevance)
  if (matches >= 3) score += 10;
  if (matches >= 5) score += 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * Ranks and filters news items for a user's profile.
 * Returns top relevant items + top general items (by recency), deduped.
 */
export function rankNewsForUser(
  items: NewsItem[],
  profile: ContextProfile,
  opts: { maxRelevant?: number; maxGeneral?: number } = {},
): NewsItem[] {
  const maxRelevant = opts.maxRelevant ?? 30;
  const maxGeneral = opts.maxGeneral ?? 15;

  const scored = items.map((item) => ({
    item,
    score: scoreRelevance(item, profile),
  }));

  // Top relevant items by score
  const relevant = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRelevant)
    .map((s) => s.item);

  const relevantUrls = new Set(relevant.map((i) => i.url));

  // Top general items by recency (fill remaining slots, skip already-included)
  const general = items
    .filter((i) => !relevantUrls.has(i.url))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, maxGeneral);

  return [...relevant, ...general];
}
