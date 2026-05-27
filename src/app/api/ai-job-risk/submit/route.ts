/**
 * POST /api/ai-job-risk/submit — score and persist an assessment, return the
 * shareable result ID so the client can navigate to /results/[resultId].
 *
 * Per spec §5.10 the score is computed server-side from the raw responses; we
 * do not trust scores submitted by the client.
 */

import { NextResponse } from "next/server";
import { calculateAIDisruptionScore } from "@/lib/ai-job-risk/scoring";
import { getRoleConfig } from "@/lib/ai-job-risk/roles";
import { saveAssessmentResult } from "@/lib/ai-job-risk/persist";
import type { UserResponses } from "@/lib/ai-job-risk/types";

export const maxDuration = 30;

interface SubmitBody {
  role?: unknown;
  responses?: unknown;
  completionTimeSeconds?: unknown;
  referrerUrl?: unknown;
}

export async function POST(req: Request) {
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.role !== "string" || !body.responses || typeof body.responses !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const roleConfig = getRoleConfig(body.role);
  if (!roleConfig) {
    return NextResponse.json({ error: "Unknown role" }, { status: 400 });
  }

  const validationError = validateResponses(body.responses as Partial<UserResponses>);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const responses = body.responses as UserResponses;

  try {
    const scoreResult = calculateAIDisruptionScore(responses, roleConfig);
    const saved = await saveAssessmentResult({
      roleConfig,
      responses,
      scoreResult,
      completionTimeSeconds:
        typeof body.completionTimeSeconds === "number"
          ? body.completionTimeSeconds
          : undefined,
      referrerUrl: typeof body.referrerUrl === "string" ? body.referrerUrl : undefined,
    });
    return NextResponse.json({
      resultId: saved.resultId,
      compositeScore: saved.compositeScore,
      tier: saved.tier,
    });
  } catch (err) {
    console.error("AI Job Risk submit failed:", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}

/** Mirror the per-section validation from the quiz UI; defensive against client bypass. */
function validateResponses(r: Partial<UserResponses>): string | null {
  if (!r.role || !r.industry || !r.yearsExperience) return "Section A is incomplete";

  const reported = Object.values(r.taskTimes ?? {}).filter(
    (range) => range && range !== "none",
  );
  if (reported.length < 3) return "Please report time on at least 3 tasks";

  if (!r.employerAdoption || !r.headcountChange || !r.structuralChange) {
    return "Section C is incomplete";
  }

  const toolsAnswered =
    (r.toolsUsed && r.toolsUsed.length > 0) ||
    (r.customTools && r.customTools.length > 0) ||
    Array.isArray(r.toolsUsed); // empty array = "none of these"
  if (!toolsAnswered) return "Please answer the AI tools question";

  if (
    !r.domainExpertise ||
    !r.decisionStakes ||
    !r.relationshipImportance ||
    !r.novelProblems
  ) {
    return "Section D is incomplete";
  }

  if (!r.activeLearning) return "Section E is incomplete";

  return null;
}
