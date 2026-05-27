/**
 * AI-generated report content for the AI Job Risk Assessment (spec Section 6).
 *
 * Six LLM calls run in parallel, each with a deterministic fallback. Result is
 * cached on AssessmentResult.reportContent so the same assessment renders the
 * same report on every view (spec §6.10, §A.18).
 *
 * The split between deterministic and generated content (spec §6.1) is strict:
 * scores, tier descriptions, salary ranges and pivot-path metadata are NOT
 * generated — they come from role config and tiers. Only the narrative
 * connective tissue is generated.
 */

import { AI_TOOLS } from "./questions";
import { buildAction1Template, buildAction2Template, buildAction3Template } from "./action-templates";
import { factorQualitativeLabel, getTier, taskStatusLabel } from "./tiers";
import { generateJson, generateText } from "./llm-client";
import { getIndustry } from "./industries";
import type {
  FactorScores,
  PivotPath,
  ReportContent,
  RoleConfig,
  ScoreResult,
  UserResponses,
} from "./types";

const PROMPT_VERSION = "1.0";

export interface GenerateReportInput {
  responses: UserResponses;
  scoreResult: ScoreResult;
  roleConfig: RoleConfig;
}

export async function generateReportContent(
  input: GenerateReportInput,
): Promise<ReportContent> {
  // Six LLM calls in parallel; each section falls back to deterministic content
  // on failure (spec §6.10). Total wall-time: ~6-10s vs ~20s sequential.
  const [opening, factorExplanations, taskAnalyses, pivotPathFits, actionPlan, progressLine] =
    await Promise.all([
      safeCall(() => generateOpeningSummary(input), () => fallbackOpening(input)),
      safeCall(
        () => generateFactorExplanations(input),
        () => fallbackFactorExplanations(input),
      ),
      safeCall(() => generateTaskAnalyses(input), () => fallbackTaskAnalyses(input)),
      safeCall(() => generatePivotPathFits(input), () => fallbackPivotPathFits(input)),
      safeCall(() => generateActionPlan(input), () => fallbackActionPlan(input)),
      safeCall(() => generateProgressLine(input), () => fallbackProgressLine(input)),
    ]);

  return {
    generatedAt: new Date().toISOString(),
    version: PROMPT_VERSION,
    sections: {
      openingSummary: opening,
      factorExplanations,
      taskAnalyses,
      pivotPathFits,
      actionPlan,
      progressLine,
    },
  };
}

async function safeCall<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("Report section generation failed; using fallback:", err);
    return fallback();
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface TaskWithTime {
  id: string;
  name: string;
  timePercent: number;
}

function topTasksByTime(input: GenerateReportInput): TaskWithTime[] {
  const times = input.scoreResult.normalizedTaskTimes;
  return input.roleConfig.taskLibrary
    .map((t) => ({ id: t.id, name: t.name, timePercent: times[t.id] ?? 0 }))
    .filter((t) => t.timePercent > 0)
    .sort((a, b) => b.timePercent - a.timePercent);
}

function rankFactorsByImpact(fb: FactorScores): string[] {
  const contributions: Array<[string, number]> = [
    ["Task Automatability", fb.taskAutomatability * 0.4],
    ["Adoption Velocity", fb.adoptionVelocity * 0.2],
    ["Skill Differentiation", (100 - fb.skillDifferentiationRaw) * 0.2],
    ["Career Portability", (100 - fb.careerPortabilityRaw) * 0.1],
    ["Time-to-Impact Urgency", fb.timeToImpactUrgency * 0.1],
  ];
  return contributions
    .sort((a, b) => b[1] - a[1])
    .map(([label]) => label);
}

function resolveToolLabels(responses: UserResponses): string[] {
  const byId = new Map(AI_TOOLS.map((t) => [t.value, t.label]));
  const presets = (responses.toolsUsed ?? []).map((id) => byId.get(id) ?? id);
  return presets.concat(responses.customTools ?? []);
}

function topPivotPathName(input: GenerateReportInput): PivotPath | undefined {
  const id = input.scoreResult.topPivotPaths[0]?.pathId;
  return input.roleConfig.pivotPaths.find((p) => p.id === id);
}

// ─── Validation (spec §6.10) ─────────────────────────────────────────────────

interface TextValidation {
  minWords?: number;
  maxWords?: number;
}

function validateText(text: string, opts: TextValidation = {}): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  if (opts.minWords && words < opts.minWords) throw new Error("Output too short");
  if (opts.maxWords && words > opts.maxWords * 1.5) throw new Error("Output too long");
  if (/\b(doomed|catastrophe|hopeless|disaster)\b/i.test(text)) {
    throw new Error("Alarmist tone detected");
  }
  if (/\bnothing to worry about\b/i.test(text)) {
    throw new Error("False reassurance detected");
  }
  return text;
}

// ─── Section 1: Opening summary (spec §6.9.1) ────────────────────────────────

function buildOpeningSummaryPrompt(input: GenerateReportInput): string {
  const { responses, scoreResult, roleConfig } = input;
  const industry = getIndustry(responses.industry)?.label ?? responses.industry;
  const topFactors = rankFactorsByImpact(scoreResult.factorBreakdown).slice(0, 3);
  const tier = getTier(scoreResult.tier);
  const pivotNames = scoreResult.topPivotPaths
    .map((p) => roleConfig.pivotPaths.find((rp) => rp.id === p.pathId)?.name)
    .filter(Boolean);
  return `You are generating a personalized opening summary for an AI Job Risk Assessment report.

USER PROFILE:
- Role: ${roleConfig.label}
- Industry: ${industry}
- Seniority: ${scoreResult.seniority.label}
- Years of experience: ${responses.yearsExperience}

SCORE DATA:
- Composite score: ${scoreResult.compositeScore}/100
- Tier: ${tier.label}
- Top contributing factors (highest to lowest impact on the composite): ${topFactors.join(", ")}

TOP PIVOT PATHS:
1. ${pivotNames[0] ?? ""}
2. ${pivotNames[1] ?? ""}
3. ${pivotNames[2] ?? ""}

Write a 2-3 sentence personalized opening summary that:
1. Honestly reflects the tier — no false reassurance for high scores, no doom for low scores.
2. References 1-2 specific factors driving the user's score.
3. Hints at the direction their pivot paths point.
4. Speaks in second person ("you", "your work").
5. Matches urgency to the tier (Severe = clear-eyed urgency without alarm; High = serious with constructive framing; Moderate-High = balanced; Moderate = calm, focus on differentiation; Low = reassuring but not dismissive).

Avoid: generic phrases like "great job", doom or hyperbole, specific salary numbers, promising specific outcomes.

Return only the 2-3 sentences. No headers, no quotes, no formatting.`;
}

async function generateOpeningSummary(input: GenerateReportInput): Promise<string> {
  const text = await generateText(buildOpeningSummaryPrompt(input), {
    temperature: 0.5,
    maxTokens: 300,
  });
  return validateText(text, { minWords: 20, maxWords: 120 });
}

function fallbackOpening(input: GenerateReportInput): string {
  const tier = getTier(input.scoreResult.tier);
  return `Your AI Disruption Score is ${input.scoreResult.compositeScore}/100 — ${tier.label}. ${tier.description}`;
}

// ─── Section 2: Factor explanations (spec §6.9.2, batched) ───────────────────

function buildFactorExplanationsPrompt(input: GenerateReportInput): string {
  const { responses, scoreResult, roleConfig } = input;
  const fb = scoreResult.factorBreakdown;
  const topTasks = topTasksByTime(input);
  const tools = resolveToolLabels(responses);
  const industry = getIndustry(responses.industry)?.label ?? responses.industry;

  return `You are generating personalized explanations of five factor scores in an AI Job Risk Assessment.

USER PROFILE:
- Role: ${roleConfig.label}
- Seniority: ${scoreResult.seniority.label}

For EACH factor below, write 1-2 sentences that:
1. State what the score means in plain language.
2. Reference at least one specific contributing input from the user's profile.
3. Use second person ("you", "your").
4. Be neutral in tone — this is data, not advice.

FACTOR DATA:

1. Task Automatability — share of time on work AI handles today.
   Score: ${fb.taskAutomatability}/100 (${factorQualitativeLabel(fb.taskAutomatability)}).
   Top tasks: ${topTasks
     .slice(0, 3)
     .map((t) => `${t.name} (${Math.round(t.timePercent)}%)`)
     .join(", ") || "(none reported)"}.

2. Adoption Velocity — how fast displacement is happening in this user's environment.
   Score: ${fb.adoptionVelocity}/100 (${factorQualitativeLabel(fb.adoptionVelocity)}).
   Industry: ${industry}. Employer posture: ${responses.employerAdoption}. Headcount change: ${responses.headcountChange}. Tools used: ${tools.length}.

3. Skill Differentiation — what makes the user's work hard to replicate (higher = better).
   Raw score: ${fb.skillDifferentiationRaw}/100 (${factorQualitativeLabel(fb.skillDifferentiationRaw)}).
   Domain expertise: ${responses.domainExpertise}. Decision stakes: ${responses.decisionStakes}. Novel problems: ${responses.novelProblems}.

4. Career Portability — how easily this user can pivot to adjacent roles (higher = better).
   Raw score: ${fb.careerPortabilityRaw}/100 (${factorQualitativeLabel(fb.careerPortabilityRaw)}).
   Years experience: ${responses.yearsExperience}.

5. Time-to-Impact Urgency — how soon major changes are likely for this user's situation.
   Score: ${fb.timeToImpactUrgency}/100 (${factorQualitativeLabel(fb.timeToImpactUrgency)}).
   Seniority bucket: ${scoreResult.seniority.label}. Structural change observed: ${responses.structuralChange}.

Return ONLY a JSON object with exactly these keys, each value a single string of 1-2 sentences:
{
  "taskAutomatability": "...",
  "adoptionVelocity": "...",
  "skillDifferentiation": "...",
  "careerPortability": "...",
  "timeToImpactUrgency": "..."
}`;
}

async function generateFactorExplanations(input: GenerateReportInput) {
  const result = await generateJson<{
    taskAutomatability: string;
    adoptionVelocity: string;
    skillDifferentiation: string;
    careerPortability: string;
    timeToImpactUrgency: string;
  }>(buildFactorExplanationsPrompt(input), { temperature: 0.4, maxTokens: 1000 });
  const keys = [
    "taskAutomatability",
    "adoptionVelocity",
    "skillDifferentiation",
    "careerPortability",
    "timeToImpactUrgency",
  ] as const;
  for (const k of keys) {
    if (typeof result[k] !== "string" || result[k].length < 20) {
      throw new Error(`Factor ${k} missing or too short`);
    }
  }
  return result;
}

function fallbackFactorExplanations(input: GenerateReportInput) {
  const fb = input.scoreResult.factorBreakdown;
  const lbl = (n: number) => factorQualitativeLabel(n);
  return {
    taskAutomatability: `Your Task Automatability score is ${fb.taskAutomatability}/100 (${lbl(fb.taskAutomatability)}). This reflects how much of your week goes to work AI tools currently handle competently.`,
    adoptionVelocity: `Your Adoption Velocity score is ${fb.adoptionVelocity}/100 (${lbl(fb.adoptionVelocity)}). This reflects how quickly AI displacement is moving in your specific employer and industry.`,
    skillDifferentiation: `Your Skill Differentiation score is ${fb.skillDifferentiationRaw}/100 (${lbl(fb.skillDifferentiationRaw)}). Higher is better — this is the part of your value that's hardest to replicate.`,
    careerPortability: `Your Career Portability score is ${fb.careerPortabilityRaw}/100 (${lbl(fb.careerPortabilityRaw)}). Higher is better — this reflects how easily you could move into adjacent durable roles.`,
    timeToImpactUrgency: `Your Time-to-Impact Urgency score is ${fb.timeToImpactUrgency}/100 (${lbl(fb.timeToImpactUrgency)}). This reflects how soon major change is likely for your specific situation.`,
  };
}

// ─── Section 3: Task-by-task analyses (spec §6.9.3, batched) ─────────────────

function buildTaskAnalysesPrompt(input: GenerateReportInput): string {
  const tasks = topTasksByTime(input);
  const taskBlocks = tasks
    .map((t, i) => {
      const def = input.roleConfig.taskLibrary.find((td) => td.id === t.id);
      if (!def) return null;
      return `${i + 1}. ${t.name} — ${Math.round(t.timePercent)}% of your time
   AR: ${def.automatabilityRating}/100 (${taskStatusLabel(def.automatabilityRating)})
   Factual basis: ${def.reasoning}`;
    })
    .filter(Boolean)
    .join("\n\n");

  return `You are generating personalized analyses for the user's reported tasks.

USER CONTEXT:
- Role: ${input.roleConfig.label}
- Seniority: ${input.scoreResult.seniority.label}

For EACH task below, write 1-3 sentences that:
1. Reference the user's specific time allocation.
2. Frame the task's current state and trajectory using the factual basis.
3. Match urgency to AR — AR > 75 = more urgent framing, AR < 30 = reassuring.
4. Use second person ("you", "your").
5. If a task takes more than 25% of the user's time, acknowledge it as a significant part of their week.

Do NOT invent tool names not in the factual basis. Do NOT predict exact dates. Do NOT recommend specific actions (those come later in the report).

TASKS:
${taskBlocks}

Return ONLY a JSON array, one entry per task, in the same order, shaped:
[
  { "taskId": "${tasks[0]?.id ?? "..."}", "analysis": "..." }
${tasks.length > 1 ? '  , { "taskId": "...", "analysis": "..." }\n  // etc' : ""}
]

Task ids in order: ${tasks.map((t) => `"${t.id}"`).join(", ")}.`;
}

async function generateTaskAnalyses(
  input: GenerateReportInput,
): Promise<ReportContent["sections"]["taskAnalyses"]> {
  const tasks = topTasksByTime(input);
  if (tasks.length === 0) return [];
  const raw = await generateJson<{ taskId: string; analysis: string }[]>(
    buildTaskAnalysesPrompt(input),
    { temperature: 0.4, maxTokens: 1500 },
  );
  return tasks.map((t) => {
    const match = raw.find((r) => r.taskId === t.id);
    return {
      taskId: t.id,
      taskName: t.name,
      timePercent: Math.round(t.timePercent),
      analysis: match?.analysis ?? fallbackTaskAnalysisLine(input, t),
    };
  });
}

function fallbackTaskAnalysisLine(
  input: GenerateReportInput,
  t: TaskWithTime,
): string {
  const def = input.roleConfig.taskLibrary.find((td) => td.id === t.id);
  return def?.reasoning ?? "";
}

function fallbackTaskAnalyses(
  input: GenerateReportInput,
): ReportContent["sections"]["taskAnalyses"] {
  return topTasksByTime(input).map((t) => ({
    taskId: t.id,
    taskName: t.name,
    timePercent: Math.round(t.timePercent),
    analysis: fallbackTaskAnalysisLine(input, t),
  }));
}

// ─── Section 4: "Why this fits you" per pivot path (spec §6.9.4, batched) ────

function buildPivotPathFitsPrompt(input: GenerateReportInput): string {
  const { responses, scoreResult, roleConfig } = input;
  const topTasks = topTasksByTime(input)
    .slice(0, 3)
    .map((t) => `${t.name} (${Math.round(t.timePercent)}%)`);
  const tools = resolveToolLabels(responses);
  const strengthsSummary = `domain expertise: ${responses.domainExpertise}; decision stakes: ${responses.decisionStakes}; relationships: ${responses.relationshipImportance}; novel problems: ${responses.novelProblems}`;

  const paths = scoreResult.topPivotPaths
    .map((sel, i) => {
      const path = roleConfig.pivotPaths.find((p) => p.id === sel.pathId);
      if (!path) return null;
      return `${i + 1}. ${path.name} (id: ${path.id})
   What it is: ${path.dayToDay}
   Why durable: ${path.whyDurable}
   Best fits when: ${path.bestFitsWhen}`;
    })
    .filter(Boolean)
    .join("\n\n");

  return `You are writing personalized "Why this fits you" explanations for three pivot-path recommendations.

USER PROFILE:
- Role: ${roleConfig.label}
- Seniority: ${scoreResult.seniority.label}
- Years experience: ${responses.yearsExperience}
- Top tasks by time: ${topTasks.join(", ") || "(none)"}
- AI tools used: ${tools.length > 0 ? tools.join(", ") : "(none)"}
- Strengths: ${strengthsSummary}

For EACH path below, write 2-3 sentences explaining why this specific path fits this specific user.

Requirements:
1. Reference 1-2 specific things from the user's profile (a task, a tool, a strength answer).
2. Connect those specifics to why this path fits.
3. Use second person.
4. Avoid generic statements like "great fit for your skills".
5. If there are clear gaps, acknowledge them briefly.

PATHS:
${paths}

Return ONLY a JSON object keyed by path id:
{
${scoreResult.topPivotPaths.map((p) => `  "${p.pathId}": "..."`).join(",\n")}
}`;
}

async function generatePivotPathFits(
  input: GenerateReportInput,
): Promise<Record<string, string>> {
  const result = await generateJson<Record<string, string>>(
    buildPivotPathFitsPrompt(input),
    { temperature: 0.5, maxTokens: 800 },
  );
  for (const sel of input.scoreResult.topPivotPaths) {
    if (typeof result[sel.pathId] !== "string" || result[sel.pathId].length < 20) {
      throw new Error(`Pivot fit for ${sel.pathId} missing or too short`);
    }
  }
  return result;
}

function fallbackPivotPathFits(
  input: GenerateReportInput,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const sel of input.scoreResult.topPivotPaths) {
    const path = input.roleConfig.pivotPaths.find((p) => p.id === sel.pathId);
    if (path) out[sel.pathId] = path.bestFitsWhen;
  }
  return out;
}

// ─── Section 5: 30-day action plan (spec §6.7, §6.9.5) ───────────────────────

function buildActionPlanPrompt(input: GenerateReportInput): string {
  const tools = resolveToolLabels(input.responses);
  const topPath = topPivotPathName(input);
  if (!topPath) throw new Error("No top pivot path for action plan");
  return `You are generating a personalized 30-day action plan.

USER PROFILE:
- Role: ${input.roleConfig.label}
- Seniority: ${input.scoreResult.seniority.label}
- Current AI tools used (${tools.length}): ${tools.join(", ") || "(none)"}
- Top pivot path: ${topPath.name}
- Top pivot path skill gaps: ${topPath.skillGaps}

ACTION TEMPLATES (use these as the substantive foundation — DO NOT change tool names, pivot-path names, or specific instructions; you may personalize wording):

Action 1 (Week 1): ${buildAction1Template(input.roleConfig, tools.length)}
Action 2 (Week 2-3): ${buildAction2Template(topPath)}
Action 3 (Week 4): ${buildAction3Template(topPath)}

For each action:
1. Write a clear 1-line header (verb + object).
2. Write 2-3 sentences of detail.
3. Be concrete and specific — not "learn AI" but the exact thing.
4. Tailor tone to the user's seniority and current tool fluency.

Return ONLY JSON:
{
  "action1": { "header": "...", "detail": "..." },
  "action2": { "header": "...", "detail": "..." },
  "action3": { "header": "...", "detail": "..." }
}`;
}

async function generateActionPlan(
  input: GenerateReportInput,
): Promise<ReportContent["sections"]["actionPlan"]> {
  const result = await generateJson<ReportContent["sections"]["actionPlan"]>(
    buildActionPlanPrompt(input),
    { temperature: 0.4, maxTokens: 800 },
  );
  for (const key of ["action1", "action2", "action3"] as const) {
    const a = result[key];
    if (!a || !a.header || !a.detail || a.detail.length < 20) {
      throw new Error(`Action ${key} missing or too short`);
    }
  }
  return result;
}

function fallbackActionPlan(
  input: GenerateReportInput,
): ReportContent["sections"]["actionPlan"] {
  const tools = resolveToolLabels(input.responses);
  const topPath = topPivotPathName(input);
  if (!topPath) {
    return {
      action1: {
        header: "Deepen your AI tool fluency",
        detail: buildAction1Template(input.roleConfig, tools.length),
      },
      action2: {
        header: "Talk to someone on an adjacent durable path",
        detail:
          "Find a peer who recently moved into a more durable adjacent role. Have a 30-minute conversation about how they made the transition.",
      },
      action3: {
        header: "Build a portfolio artifact",
        detail:
          "Allocate 8-10 hours over the next month to a concrete project that demonstrates your direction. Make it shareable.",
      },
    };
  }
  return {
    action1: {
      header: "Deepen your AI tool fluency",
      detail: buildAction1Template(input.roleConfig, tools.length),
    },
    action2: {
      header: `Talk to a ${topPath.name}`,
      detail: buildAction2Template(topPath),
    },
    action3: {
      header: `Ship a portfolio artifact for ${topPath.name}`,
      detail: buildAction3Template(topPath),
    },
  };
}

// ─── Section 6: Progress-tracking personalized line (spec §6.9.6) ────────────

function buildProgressLinePrompt(input: GenerateReportInput): string {
  const fb = input.scoreResult.factorBreakdown;
  const topPath = topPivotPathName(input);
  return `You are identifying the highest-leverage move a user could make in the next 6 months to lower their AI Job Risk score.

FACTOR SCORES (lower is better for the first two; higher is better for differentiation/portability):
- Task Automatability: ${fb.taskAutomatability}/100
- Adoption Velocity: ${fb.adoptionVelocity}/100
- Skill Differentiation (raw): ${fb.skillDifferentiationRaw}/100
- Career Portability (raw): ${fb.careerPortabilityRaw}/100
- Time-to-Impact Urgency: ${fb.timeToImpactUrgency}/100

USER PROFILE:
- Role: ${input.roleConfig.label}
- Top pivot path: ${topPath?.name ?? "(none)"}

Identify the single factor most "movable" for this user — where targeted action over 6 months would most reduce their composite score.

Write 1-2 sentences in this format:
"Based on your profile, the highest-leverage move you could make in the next 6 months is [specific action that improves the most movable factor]."

Be specific — not "develop more expertise" but "specializing in one durable area like distributed systems or security engineering."

Return only the 1-2 sentences. No quotes, no headers.`;
}

async function generateProgressLine(input: GenerateReportInput): Promise<string> {
  const text = await generateText(buildProgressLinePrompt(input), {
    temperature: 0.5,
    maxTokens: 200,
  });
  return validateText(text, { minWords: 15, maxWords: 80 });
}

function fallbackProgressLine(input: GenerateReportInput): string {
  const topPath = topPivotPathName(input);
  return `Based on your profile, the highest-leverage move you could make in the next 6 months is deepening a durable specialty${
    topPath ? ` aligned with ${topPath.name}` : ""
  }.`;
}
