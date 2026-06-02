/**
 * The AI Disruption Score engine — the deterministic 5-factor model (spec
 * Section 3). Pure functions: no I/O, no DB, no role-specific branching beyond
 * what the supplied RoleConfig provides.
 *
 * Implementation notes / spec interpretations (flagged for review):
 *  - Factor 4 "specialization durability" (spec 3.6 Q-B) is derived from D1
 *    (domain expertise depth) alone — the quiz has no question capturing which
 *    specialty the user holds, so durable-vs-commoditizing area cannot be tested.
 */

import {
  ACTIVE_LEARNING_OPTIONS,
  DECISION_STAKES_OPTIONS,
  DOMAIN_EXPERTISE_OPTIONS,
  EMPLOYER_ADOPTION_OPTIONS,
  HEADCOUNT_CHANGE_OPTIONS,
  MANAGER_CONVERSATION_OPTIONS,
  NOVEL_PROBLEMS_OPTIONS,
  RELATIONSHIP_OPTIONS,
  STRUCTURAL_CHANGE_OPTIONS,
  TASK_TIME_MIDPOINTS,
  YEARS_EXPERIENCE_OPTIONS,
  pointsFor,
  toolCountPoints,
} from "./questions";
import { industryMultiplier } from "./industries";
import { determineTier } from "./tiers";
import { selectPivotPaths } from "./pivot-selection";
import type {
  FactorScores,
  RoleConfig,
  ScoreResult,
  TaskTimeRange,
  UserResponses,
} from "./types";

const COMPOSITE_WEIGHTS = {
  taskAutomatability: 0.4,
  adoptionVelocity: 0.2,
  skillDifferentiationInverse: 0.2,
  careerPortabilityInverse: 0.1,
  timeToImpactUrgency: 0.1,
} as const;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Total tools used: presets + custom "Other" entries (spec 3.4 Q-B). */
export function toolCount(responses: UserResponses): number {
  return (responses.toolsUsed?.length ?? 0) + (responses.customTools?.length ?? 0);
}

/**
 * Factor 4 Q-B — specialization durability, derived from domain expertise depth.
 * See file-level note: there is no specialty question, so D1 is the proxy.
 */
function specializationDurabilityPoints(domainExpertise: string): number {
  switch (domainExpertise) {
    case "most":
      return 100;
    case "significant":
      return 70;
    case "some":
      return 50;
    default:
      return 25; // "little" or unknown
  }
}

/**
 * Normalize reported task times to percentages summing to 100 (spec 3.3 edge
 * case). Tasks with no time reported are omitted from the result.
 */
export function normalizeTaskTimes(
  taskTimes: Record<string, TaskTimeRange>,
): Record<string, number> {
  const midpoints: Record<string, number> = {};
  let total = 0;
  for (const [taskId, range] of Object.entries(taskTimes ?? {})) {
    const midpoint = TASK_TIME_MIDPOINTS[range] ?? 0;
    if (midpoint > 0) {
      midpoints[taskId] = midpoint;
      total += midpoint;
    }
  }
  if (total === 0) return {};
  const normalized: Record<string, number> = {};
  for (const [taskId, midpoint] of Object.entries(midpoints)) {
    normalized[taskId] = (midpoint / total) * 100;
  }
  return normalized;
}

/** Factor 1 — Task Automatability: time-weighted average of automatability ratings. */
function computeTaskAutomatability(
  normalizedTaskTimes: Record<string, number>,
  roleConfig: RoleConfig,
): number {
  const arById = new Map(
    roleConfig.taskLibrary.map((t) => [t.id, t.automatabilityRating]),
  );
  let weighted = 0;
  for (const [taskId, percent] of Object.entries(normalizedTaskTimes)) {
    weighted += percent * (arById.get(taskId) ?? 0);
  }
  return weighted / 100;
}

/** Factor 2 — Adoption Velocity: average of 4 inputs, scaled by industry. */
function computeAdoptionVelocity(responses: UserResponses): number {
  const a = pointsFor(EMPLOYER_ADOPTION_OPTIONS, responses.employerAdoption);
  const b = toolCountPoints(toolCount(responses));
  const c = pointsFor(HEADCOUNT_CHANGE_OPTIONS, responses.headcountChange);
  const d = pointsFor(STRUCTURAL_CHANGE_OPTIONS, responses.structuralChange);
  const raw = (a + b + c + d) / 4;
  return Math.min(100, raw * industryMultiplier(responses.industry));
}

/** Factor 3 — Skill Differentiation (raw, higher = more differentiated). */
function computeSkillDifferentiationRaw(responses: UserResponses): number {
  const a = pointsFor(DOMAIN_EXPERTISE_OPTIONS, responses.domainExpertise);
  const b = pointsFor(DECISION_STAKES_OPTIONS, responses.decisionStakes);
  const c = pointsFor(RELATIONSHIP_OPTIONS, responses.relationshipImportance);
  const d = pointsFor(NOVEL_PROBLEMS_OPTIONS, responses.novelProblems);
  let raw = (a + b + c + d) / 4;
  // Compression to prevent gaming when every input is maxed (spec 3.5 / 3.8).
  if (a === 100 && b === 100 && c === 100 && d === 100) raw *= 0.85;
  return raw;
}

/** Factor 4 — Career Capital Portability (raw, higher = more portable). */
function computeCareerPortabilityRaw(
  responses: UserResponses,
  roleConfig: RoleConfig,
): number {
  const a = pointsFor(YEARS_EXPERIENCE_OPTIONS, responses.yearsExperience);
  const b = specializationDurabilityPoints(responses.domainExpertise);
  const c = roleConfig.pivotPathAvailability;
  return a * 0.4 + b * 0.4 + c * 0.2;
}

/** Factor 5 — Time-to-Impact Urgency: role base urgency adjusted by signals. */
function computeTimeToImpact(
  responses: UserResponses,
  baseUrgency: number,
  adoptionVelocity: number,
  skillDifferentiationRaw: number,
): number {
  let modifiers = 0;
  if (adoptionVelocity > 70) modifiers += 15;
  else if (adoptionVelocity > 50) modifiers += 5;
  else if (adoptionVelocity < 30) modifiers -= 5;

  if (responses.structuralChange === "yes_significant") modifiers += 10;
  if (toolCount(responses) <= 1) modifiers += 10;

  if (skillDifferentiationRaw > 90) modifiers -= 15;
  else if (skillDifferentiationRaw > 75) modifiers -= 10;

  // E1/E2 trajectory-awareness modifiers (spec 3.7 / 3.9, v1.0.1). The junior-IC
  // conditional branch (spec 5.7) auto-assigns E1 = "no" at submit time
  // (0 modifier) per spec v1.0.2 — juniors aren't in those conversations,
  // so 0 is the honest default. A genuinely absent value also contributes 0.
  modifiers += pointsFor(MANAGER_CONVERSATION_OPTIONS, responses.managerConversations);
  modifiers += pointsFor(ACTIVE_LEARNING_OPTIONS, responses.activeLearning);

  return clamp(baseUrgency + modifiers, 0, 100);
}

const roundFactors = (f: FactorScores): FactorScores => ({
  taskAutomatability: Math.round(f.taskAutomatability),
  adoptionVelocity: Math.round(f.adoptionVelocity),
  skillDifferentiationRaw: Math.round(f.skillDifferentiationRaw),
  careerPortabilityRaw: Math.round(f.careerPortabilityRaw),
  timeToImpactUrgency: Math.round(f.timeToImpactUrgency),
});

/**
 * Compute the full AI Disruption Score for a set of quiz responses.
 * Implements the algorithm in spec Section 3.9.
 */
export function calculateAIDisruptionScore(
  responses: UserResponses,
  roleConfig: RoleConfig,
): ScoreResult {
  const normalizedTaskTimes = normalizeTaskTimes(responses.taskTimes);
  const seniority = roleConfig.resolveSeniority(responses);
  const baseUrgency = roleConfig.baseUrgencyByLevel[seniority.levelKey] ?? 50;

  const taskAutomatability = computeTaskAutomatability(
    normalizedTaskTimes,
    roleConfig,
  );
  const adoptionVelocity = computeAdoptionVelocity(responses);
  const skillDifferentiationRaw = computeSkillDifferentiationRaw(responses);
  const careerPortabilityRaw = computeCareerPortabilityRaw(responses, roleConfig);
  const timeToImpactUrgency = computeTimeToImpact(
    responses,
    baseUrgency,
    adoptionVelocity,
    skillDifferentiationRaw,
  );

  const factors: FactorScores = {
    taskAutomatability,
    adoptionVelocity,
    skillDifferentiationRaw,
    careerPortabilityRaw,
    timeToImpactUrgency,
  };

  // High differentiation / portability REDUCE risk, so invert for the composite.
  const skillDifferentiationInverse = 100 - skillDifferentiationRaw;
  const careerPortabilityInverse = 100 - careerPortabilityRaw;

  const composite =
    taskAutomatability * COMPOSITE_WEIGHTS.taskAutomatability +
    adoptionVelocity * COMPOSITE_WEIGHTS.adoptionVelocity +
    skillDifferentiationInverse * COMPOSITE_WEIGHTS.skillDifferentiationInverse +
    careerPortabilityInverse * COMPOSITE_WEIGHTS.careerPortabilityInverse +
    timeToImpactUrgency * COMPOSITE_WEIGHTS.timeToImpactUrgency;

  const compositeScore = clamp(Math.round(composite), 0, 100);

  const topPivotPaths = selectPivotPaths(roleConfig, {
    responses,
    taskTimePercents: normalizedTaskTimes,
    toolCount: toolCount(responses),
    seniorityOrdinal: seniority.ordinal,
    scores: factors,
    compositeScore,
    industrySlug: responses.industry,
  });

  return {
    compositeScore,
    tier: determineTier(compositeScore),
    factors,
    factorBreakdown: roundFactors(factors),
    topPivotPaths,
    seniority,
    normalizedTaskTimes,
  };
}
