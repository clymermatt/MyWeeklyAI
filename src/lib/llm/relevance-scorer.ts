import type { ContextProfile, NewsItem } from "@/generated/prisma/client";

/** Maps predefined industries to expanded keyword sets for better matching */
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "SaaS / Software": ["saas", "software", "cloud", "api", "developer", "devtools", "platform", "b2b", "subscription"],
  "Fintech / Financial Services": ["fintech", "finance", "banking", "payments", "trading", "insurance", "compliance", "fraud"],
  "Healthcare / Life Sciences": ["healthcare", "medical", "health", "clinical", "pharma", "biotech", "patient", "diagnosis", "drug"],
  "E-commerce / Retail": ["ecommerce", "e-commerce", "retail", "shopping", "marketplace", "consumer", "brand", "commerce"],
  "Education / EdTech": ["education", "edtech", "learning", "student", "teacher", "university", "course", "training"],
  "Media / Entertainment": ["media", "entertainment", "content", "video", "streaming", "music", "publishing", "creator"],
  "Marketing / Advertising": ["marketing", "advertising", "ad tech", "campaign", "brand", "seo", "social media", "analytics"],
  "Consulting / Professional Services": ["consulting", "advisory", "professional services", "strategy", "management"],
  "Manufacturing / Industrial": ["manufacturing", "industrial", "supply chain", "factory", "production", "robotics"],
  "Real Estate / PropTech": ["real estate", "proptech", "property", "housing", "mortgage", "construction"],
  "Legal / LegalTech": ["legal", "legaltech", "law", "compliance", "contract", "regulation", "attorney"],
  "Government / Public Sector": ["government", "public sector", "policy", "regulation", "civic", "federal", "defense"],
  "Cybersecurity": ["cybersecurity", "security", "threat", "vulnerability", "malware", "encryption", "privacy"],
  "Gaming": ["gaming", "game", "esports", "metaverse", "virtual reality", "unity", "unreal"],
  "Telecommunications": ["telecom", "telecommunications", "5g", "network", "wireless", "broadband"],
  "Energy / CleanTech": ["energy", "cleantech", "solar", "renewable", "climate", "sustainability", "carbon"],
  "Transportation / Logistics": ["transportation", "logistics", "autonomous", "self-driving", "fleet", "delivery", "shipping"],
};

/** Maps predefined roles to expanded keyword sets */
const ROLE_KEYWORDS: Record<string, string[]> = {
  "Software Engineer": ["engineer", "developer", "coding", "programming", "code", "development", "frontend", "backend", "fullstack"],
  "Product Manager": ["product", "roadmap", "feature", "user research", "prioritization", "stakeholder", "product-led"],
  "UX / Product Designer": ["ux", "design", "user experience", "interface", "usability", "prototype", "figma", "interaction"],
  "Data Scientist / ML Engineer": ["data science", "machine learning", "ml", "model", "training", "dataset", "neural", "deep learning"],
  "Engineering Manager": ["engineering", "team", "hiring", "sprint", "agile", "leadership", "technical debt"],
  "CTO / VP Engineering": ["cto", "architecture", "infrastructure", "scaling", "technical strategy", "engineering org"],
  "CEO / Founder": ["startup", "founder", "ceo", "fundraising", "growth", "business model", "venture", "investor"],
  "Marketing Manager": ["marketing", "campaign", "brand", "content", "seo", "conversion", "engagement", "audience"],
  "Content Strategist": ["content", "editorial", "copywriting", "blog", "newsletter", "storytelling", "publishing"],
  "Sales / Revenue": ["sales", "revenue", "pipeline", "crm", "deal", "prospect", "quota", "closing"],
  "DevOps / Platform Engineer": ["devops", "infrastructure", "ci/cd", "kubernetes", "docker", "deployment", "monitoring"],
  "Research Scientist": ["research", "paper", "experiment", "benchmark", "arxiv", "study", "findings"],
  "Business Analyst": ["analytics", "dashboard", "metrics", "kpi", "reporting", "business intelligence", "data"],
  "Project Manager": ["project", "timeline", "milestone", "deliverable", "stakeholder", "resource", "planning"],
  "Customer Success": ["customer success", "onboarding", "retention", "churn", "support", "nps", "satisfaction"],
  "Solutions Architect": ["architecture", "integration", "solution", "enterprise", "migration", "scalability"],
  "Consultant": ["consulting", "advisory", "strategy", "transformation", "recommendation", "assessment"],
  "Student / Researcher": ["research", "study", "academic", "learning", "thesis", "paper", "experiment"],
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
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  let matches = 0;

  // Industry match (high weight — primary personalization signal)
  if (profile.industry) {
    const industryLower = profile.industry.toLowerCase();
    // Direct match
    if (searchableText.includes(industryLower)) {
      score += 18;
      matches++;
    }
    // Expanded keyword match
    const expandedKeywords = INDUSTRY_KEYWORDS[profile.industry] ?? [];
    let industryKeywordHits = 0;
    for (const kw of expandedKeywords) {
      if (searchableText.includes(kw)) {
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
    const roleLower = profile.roleTitle.toLowerCase();
    // Direct match
    if (searchableText.includes(roleLower)) {
      score += 18;
      matches++;
    }
    // Expanded keyword match
    const expandedKeywords = ROLE_KEYWORDS[profile.roleTitle] ?? [];
    let roleKeywordHits = 0;
    for (const kw of expandedKeywords) {
      if (searchableText.includes(kw)) {
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
    if (searchableText.includes(topic.toLowerCase())) {
      score += 15;
      matches++;
    }
  }

  // Tools & platforms (high weight — directly actionable)
  for (const tool of profile.tools) {
    if (searchableText.includes(tool.toLowerCase())) {
      score += 12;
      matches++;
    }
  }

  // Goals match (partial keyword matching — split multi-word goals)
  for (const goal of profile.goals) {
    const keywords = goal.toLowerCase().split(/\s+/);
    const goalMatches = keywords.filter(
      (kw) => kw.length > 3 && searchableText.includes(kw),
    );
    if (goalMatches.length > 0) {
      score += 5 * Math.min(goalMatches.length, 3);
      matches++;
    }
  }

  // Penalize avoided topics
  for (const avoid of profile.avoidTopics) {
    if (searchableText.includes(avoid.toLowerCase())) {
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
