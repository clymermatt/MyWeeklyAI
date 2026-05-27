/**
 * Industry definitions and Adoption Velocity multipliers (spec 3.4).
 *
 * The 18 industries match the newsletter profile's Industry field exactly so
 * assessment data maps 1:1 onto ContextProfile.industry.
 */

export interface IndustryDefinition {
  slug: string;
  label: string;
  /** Adoption Velocity multiplier (spec 3.4) */
  multiplier: number;
}

export const INDUSTRIES: IndustryDefinition[] = [
  { slug: "saas-software", label: "SaaS / Software", multiplier: 1.2 },
  { slug: "media-entertainment", label: "Media / Entertainment", multiplier: 1.2 },
  { slug: "marketing-advertising", label: "Marketing / Advertising", multiplier: 1.2 },
  { slug: "fintech", label: "Fintech / Financial Services", multiplier: 1.15 },
  { slug: "consulting", label: "Consulting / Professional Services", multiplier: 1.15 },
  { slug: "legal", label: "Legal / LegalTech", multiplier: 1.1 },
  { slug: "ecommerce-retail", label: "E-commerce / Retail", multiplier: 1.05 },
  { slug: "education", label: "Education / EdTech", multiplier: 1.0 },
  { slug: "cybersecurity", label: "Cybersecurity", multiplier: 1.0 },
  { slug: "real-estate", label: "Real Estate / PropTech", multiplier: 1.0 },
  { slug: "gaming", label: "Gaming", multiplier: 1.0 },
  { slug: "telecommunications", label: "Telecommunications", multiplier: 0.95 },
  { slug: "manufacturing", label: "Manufacturing / Industrial", multiplier: 0.9 },
  { slug: "transportation", label: "Transportation / Logistics", multiplier: 0.9 },
  { slug: "healthcare", label: "Healthcare / Life Sciences", multiplier: 0.85 },
  { slug: "energy", label: "Energy / CleanTech", multiplier: 0.85 },
  { slug: "nonprofit", label: "Nonprofit / Social Impact", multiplier: 0.8 },
  { slug: "government", label: "Government / Public Sector", multiplier: 0.7 },
];

const INDUSTRY_BY_SLUG: Record<string, IndustryDefinition> = Object.fromEntries(
  INDUSTRIES.map((i) => [i.slug, i]),
);

export function getIndustry(slug: string): IndustryDefinition | undefined {
  return INDUSTRY_BY_SLUG[slug];
}

/** Adoption Velocity multiplier for an industry slug; defaults to 1.0 (spec 3.9). */
export function industryMultiplier(slug: string): number {
  return INDUSTRY_BY_SLUG[slug]?.multiplier ?? 1.0;
}
