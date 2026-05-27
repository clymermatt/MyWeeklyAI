/**
 * Risk-tier classification, labels, and descriptions (spec 3.2 and 6.3).
 */

import type { RiskTierKey } from "./types";

export interface TierDefinition {
  key: RiskTierKey;
  label: string;
  /** inclusive composite-score range */
  min: number;
  max: number;
  /** pre-written tier description shown in report Section 1 (spec 6.3) */
  description: string;
}

export const TIERS: TierDefinition[] = [
  {
    key: "LOW",
    label: "Low Risk",
    min: 0,
    max: 25,
    description:
      "Your role is largely AI-resistant in its current form. Your work centers on judgment, relationships, and novel problem-solving that current AI tools augment but don't replace.",
  },
  {
    key: "MODERATE",
    label: "Moderate Risk",
    min: 26,
    max: 45,
    description:
      "Some tasks in your work will be augmented or automated, but the core of your role persists. Your work will evolve over the next few years, but you have time to adapt.",
  },
  {
    key: "MODERATE_HIGH",
    label: "Moderate-High Risk",
    min: 46,
    max: 65,
    description:
      "Significant transformation is likely in your role. Real displacement pressure exists, but you also have clear pivot paths and time to make them. Proactive planning recommended.",
  },
  {
    key: "HIGH",
    label: "High Risk",
    min: 66,
    max: 85,
    description:
      "Major displacement pressure within 3-5 years. The work you do today will change substantially, and active pivot planning is urgent. The good news: clear paths forward exist.",
  },
  {
    key: "SEVERE",
    label: "Severe Risk",
    min: 86,
    max: 100,
    description:
      "Role-level disruption likely within 1-3 years. Your work as it exists today will change dramatically. Immediate action recommended — but with clear paths forward, this is navigable.",
  },
];

const TIER_BY_KEY: Record<RiskTierKey, TierDefinition> = Object.fromEntries(
  TIERS.map((t) => [t.key, t]),
) as Record<RiskTierKey, TierDefinition>;

/** Map a composite score (0-100) to its risk tier (spec 3.2). */
export function determineTier(compositeScore: number): RiskTierKey {
  const score = Math.max(0, Math.min(100, compositeScore));
  return (TIERS.find((t) => score >= t.min && score <= t.max) ?? TIERS[0]).key;
}

export function getTier(key: RiskTierKey): TierDefinition {
  return TIER_BY_KEY[key];
}

/** Qualitative label for an individual factor score (spec 6.4). */
export function factorQualitativeLabel(score: number): string {
  if (score >= 81) return "high";
  if (score >= 66) return "moderate-high";
  if (score >= 51) return "moderate";
  if (score >= 26) return "moderate-low";
  return "low";
}

/** Display label for a task's Automatability Rating (spec 6.5). */
export function taskStatusLabel(ar: number): string {
  if (ar >= 81) return "Among the most automated work in this category";
  if (ar >= 66) return "Heavily augmented today, increasingly automated";
  if (ar >= 46) return "Significantly augmented";
  if (ar >= 26) return "Augmented, role evolving";
  return "Largely AI-resistant";
}
