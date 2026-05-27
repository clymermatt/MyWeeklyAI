/**
 * Persistence layer for AssessmentResult — save, fetch, claim (spec §11.3/§11.4).
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { deriveProfileFromAssessment } from "./profile-derivation";
import { generateReportContent } from "./report-generation";
import { generateResultId } from "./result-id";
import { calculateAIDisruptionScore } from "./scoring";
import type { ReportContent, RoleConfig, ScoreResult, UserResponses } from "./types";

export interface SaveResultInput {
  roleConfig: RoleConfig;
  responses: UserResponses;
  scoreResult: ScoreResult;
  completionTimeSeconds?: number;
  referrerUrl?: string;
}

/**
 * Persist an AssessmentResult and a paired anonymized AssessmentBenchmark row
 * (spec §8.2). The result starts with userId = null — it gets claimed when the
 * submitter signs in (see claimAssessmentResult).
 */
export async function saveAssessmentResult(input: SaveResultInput) {
  const { roleConfig, responses, scoreResult } = input;
  const resultId = generateResultId(roleConfig.resultIdPrefix);

  const benchmarkData = {
    role: roleConfig.slug,
    industry: responses.industry,
    seniorityLevel: scoreResult.seniority.levelKey,
    compositeScore: scoreResult.compositeScore,
    taskAutomatability: scoreResult.factorBreakdown.taskAutomatability,
    adoptionVelocity: scoreResult.factorBreakdown.adoptionVelocity,
    skillDifferentiationRaw: scoreResult.factorBreakdown.skillDifferentiationRaw,
    careerPortabilityRaw: scoreResult.factorBreakdown.careerPortabilityRaw,
    timeToImpactUrgency: scoreResult.factorBreakdown.timeToImpactUrgency,
  };

  const result = await prisma.assessmentResult.create({
    data: {
      resultId,
      roleAssessed: roleConfig.slug,
      industryAssessed: responses.industry,
      seniorityLevel: scoreResult.seniority.levelKey,
      yearsExperience: responses.yearsExperience,
      responses: responses as unknown as Prisma.InputJsonValue,
      compositeScore: scoreResult.compositeScore,
      tier: scoreResult.tier,
      taskAutomatability: scoreResult.factorBreakdown.taskAutomatability,
      adoptionVelocity: scoreResult.factorBreakdown.adoptionVelocity,
      skillDifferentiationRaw: scoreResult.factorBreakdown.skillDifferentiationRaw,
      careerPortabilityRaw: scoreResult.factorBreakdown.careerPortabilityRaw,
      timeToImpactUrgency: scoreResult.factorBreakdown.timeToImpactUrgency,
      selectedPivotPaths: scoreResult.topPivotPaths as unknown as Prisma.InputJsonValue,
      completionTimeSeconds: input.completionTimeSeconds,
      referrerUrl: input.referrerUrl,
    },
  });

  // Anonymized benchmark row for percentile calculations. Best-effort: if it
  // fails the user-visible flow still succeeds.
  try {
    await prisma.assessmentBenchmark.create({ data: benchmarkData });
  } catch (err) {
    console.error("Failed to write AssessmentBenchmark:", err);
  }

  return result;
}

export async function getAssessmentResult(resultId: string) {
  return prisma.assessmentResult.findUnique({ where: { resultId } });
}

/**
 * Link an anonymous AssessmentResult to a signed-in user, idempotently. Also
 * pre-populates a fresh ContextProfile if the user doesn't yet have one (spec
 * §11.3 / §11.4 — for existing subscribers we leave their profile alone).
 *
 * Returns true if this call did the linking, false if the result was already
 * claimed (either by this user or by someone else).
 *
 * NOTE: shared-link edge case. If User A submits anonymously and shares the
 * result URL with User B before A signs in, B's sign-in here would claim A's
 * result. v1 accepts that risk; a cookie-attribution check at submit time can
 * tighten it later.
 */
export async function claimAssessmentResult(
  resultId: string,
  userId: string,
  roleConfig: RoleConfig,
): Promise<boolean> {
  const updated = await prisma.assessmentResult.updateMany({
    where: { resultId, userId: null },
    data: { userId },
  });
  if (updated.count === 0) return false;

  const result = await prisma.assessmentResult.findUnique({ where: { resultId } });
  if (result) {
    await populateProfileIfMissing(userId, result, roleConfig);
  }
  return true;
}

/**
 * Get the cached report content if present; otherwise generate it (6 parallel
 * LLM calls, ~6-10s), persist it, and return. Idempotent — concurrent calls
 * may both generate, but the last write wins and downstream readers see
 * consistent content. Spec §6.10 / §A.18 require same-assessment-same-report.
 */
export async function ensureReportContent(
  resultId: string,
  roleConfig: RoleConfig,
): Promise<ReportContent | null> {
  const result = await prisma.assessmentResult.findUnique({ where: { resultId } });
  if (!result) return null;
  if (result.reportContent) {
    return result.reportContent as unknown as ReportContent;
  }

  const responses = result.responses as unknown as UserResponses;
  const scoreResult = calculateAIDisruptionScore(responses, roleConfig);
  const content = await generateReportContent({ responses, scoreResult, roleConfig });

  await prisma.assessmentResult.update({
    where: { resultId },
    data: { reportContent: content as unknown as Prisma.InputJsonValue },
  });
  return content;
}

async function populateProfileIfMissing(
  userId: string,
  result: { responses: Prisma.JsonValue; taskAutomatability: number },
  roleConfig: RoleConfig,
) {
  const existing = await prisma.contextProfile.findUnique({ where: { userId } });
  if (existing) return; // spec §11.4 — never overwrite an existing profile

  const responses = result.responses as unknown as UserResponses;
  const derived = deriveProfileFromAssessment(
    responses,
    result.taskAutomatability,
    roleConfig,
  );

  await prisma.contextProfile.create({
    data: {
      userId,
      roleTitle: derived.roleTitle,
      industry: derived.industry,
      experienceLevel: derived.experienceLevel,
      tools: derived.tools,
      goals: derived.goals,
      focusTopics: derived.focusTopics,
    },
  });
}
