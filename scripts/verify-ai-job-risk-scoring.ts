/**
 * Calibration check for the AI Job Risk scoring engine.
 *
 * Runs the four reference personas from spec section 4.1.2 through the scorer
 * and verifies the Task Automatability factor and the resulting risk tier match
 * the spec's calibration table. This is the project's lightweight stand-in for
 * a unit test — the repo has no test runner, so it runs via tsx like the seed.
 *
 *   npx tsx scripts/verify-ai-job-risk-scoring.ts
 */

import { calculateAIDisruptionScore } from "../src/lib/ai-job-risk/scoring";
import softwareEngineers from "../src/lib/ai-job-risk/roles/software-engineers";
import { getTier } from "../src/lib/ai-job-risk/tiers";
import type {
  RiskTierKey,
  TaskTimeRange,
  UserResponses,
} from "../src/lib/ai-job-risk/types";

interface Persona {
  name: string;
  /** spec 4.1.2 expected Task Automatability range */
  expectedTaskAutomatability: [number, number];
  /** spec 4.1.2 expected composite tier(s) */
  expectedTiers: RiskTierKey[];
  /** optional — pivot-path ids that MUST appear in the top 3 */
  expectedPivotIncludes?: string[];
  /** spec v1.0.3 — minimum number of executive-tier paths in the result */
  expectedExecutiveCount?: number;
  responses: UserResponses;
}

/** Pivot-path ids whose `tier === "executive"` in the SWE config (spec v1.0.3). */
const SWE_EXECUTIVE_PATH_IDS = new Set([
  "vp-engineering-cto",
  "founder-technical-cofounder",
  "engineering-advisor-fractional-cto",
]);

const tasks = (entries: Record<string, TaskTimeRange>) => entries;

const PERSONAS: Persona[] = [
  {
    name: "Junior engineer (heavy on coding tasks)",
    expectedTaskAutomatability: [75, 80],
    expectedTiers: ["HIGH"],
    responses: {
      role: "engineer",
      industry: "saas-software",
      yearsExperience: "0-2",
      taskTimes: tasks({
        "feature-code": "50+",
        tests: "25-50",
        "debug-routine": "25-50",
        refactor: "10-25",
        docs: "10-25",
        "code-review": "0-10",
        "cross-functional": "0-10",
      }),
      employerAdoption: "encouraged",
      toolsUsed: ["chatgpt", "copilot"],
      headcountChange: "flat",
      structuralChange: "no",
      domainExpertise: "little",
      decisionStakes: "rarely",
      relationshipImportance: "somewhat",
      novelProblems: "rarely",
      // Branch 2 (junior IC + 0-2 years): submit flow auto-assigns E1 = "no"
      // per spec v1.0.2, so the verification persona reflects that.
      managerConversations: "no",
      activeLearning: "occasional",
    },
  },
  {
    name: "Mid-level engineer (mix across most tasks)",
    expectedTaskAutomatability: [60, 65],
    expectedTiers: ["MODERATE_HIGH"],
    responses: {
      role: "engineer",
      industry: "saas-software",
      yearsExperience: "6-10",
      taskTimes: tasks({
        "feature-code": "25-50",
        tests: "10-25",
        "debug-routine": "10-25",
        "debug-novel": "10-25",
        refactor: "10-25",
        "code-review": "10-25",
        "system-design": "10-25",
        docs: "10-25",
        "cross-functional": "10-25",
        "on-call": "0-10",
        research: "0-10",
      }),
      employerAdoption: "encouraged",
      toolsUsed: ["chatgpt", "claude", "copilot"],
      headcountChange: "attrition",
      structuralChange: "yes_somewhat",
      domainExpertise: "some",
      decisionStakes: "sometimes",
      relationshipImportance: "important",
      novelProblems: "occasionally",
      managerConversations: "brief",
      activeLearning: "occasional",
    },
  },
  {
    name: "Senior engineer (system-design focus)",
    expectedTaskAutomatability: [40, 50],
    expectedTiers: ["MODERATE"],
    responses: {
      role: "senior-engineer",
      industry: "saas-software",
      yearsExperience: "11-15",
      taskTimes: tasks({
        "system-design": "25-50",
        "code-review": "25-50",
        "cross-functional": "10-25",
        mentoring: "10-25",
        "feature-code": "10-25",
        "debug-novel": "10-25",
        research: "10-25",
      }),
      employerAdoption: "encouraged",
      toolsUsed: ["chatgpt", "claude", "cursor"],
      headcountChange: "flat",
      structuralChange: "yes_somewhat",
      domainExpertise: "significant",
      decisionStakes: "regular",
      relationshipImportance: "important",
      novelProblems: "frequently",
      managerConversations: "substantial",
      activeLearning: "regular",
    },
  },
  {
    // Spec v1.0.2 regression check: industry-match bonus should surface
    // AI Security Engineer for senior cybersecurity ICs (packet §3).
    name: "Senior cybersecurity engineer",
    expectedTaskAutomatability: [40, 55],
    expectedTiers: ["MODERATE"],
    expectedPivotIncludes: ["ai-security-engineer"],
    responses: {
      role: "senior-engineer",
      industry: "cybersecurity",
      yearsExperience: "11-15",
      taskTimes: tasks({
        "system-design": "25-50",
        "code-review": "25-50",
        "debug-novel": "10-25",
        "cross-functional": "10-25",
        mentoring: "10-25",
        "feature-code": "10-25",
        research: "10-25",
      }),
      employerAdoption: "encouraged",
      toolsUsed: ["chatgpt", "claude", "cursor"],
      headcountChange: "flat",
      structuralChange: "yes_somewhat",
      domainExpertise: "most",
      decisionStakes: "constant",
      relationshipImportance: "important",
      novelProblems: "frequently",
      managerConversations: "substantial",
      activeLearning: "regular",
    },
  },
  {
    name: "Engineering manager",
    expectedTaskAutomatability: [25, 35],
    expectedTiers: ["LOW", "MODERATE"],
    responses: {
      role: "manager",
      industry: "saas-software",
      yearsExperience: "16+",
      taskTimes: tasks({
        "cross-functional": "50+",
        mentoring: "25-50",
        research: "25-50",
        "code-review": "10-25",
        "system-design": "10-25",
      }),
      employerAdoption: "encouraged",
      toolsUsed: ["chatgpt", "claude", "copilot"],
      headcountChange: "flat",
      structuralChange: "no",
      domainExpertise: "significant",
      decisionStakes: "regular",
      relationshipImportance: "critical",
      novelProblems: "frequently",
      managerConversations: "substantial",
      activeLearning: "regular",
    },
  },
  {
    // Spec v1.0.3 regression check: Director+ users should see executive-tier
    // pivot paths surface (packet-2 §2.1). Persona 6 from validation testing.
    name: "Director of Engineering (exec-tier check)",
    expectedTaskAutomatability: [20, 35],
    expectedTiers: ["LOW", "MODERATE"],
    expectedExecutiveCount: 2,
    responses: {
      role: "director",
      industry: "saas-software",
      yearsExperience: "16+",
      taskTimes: tasks({
        "cross-functional": "50+",
        mentoring: "25-50",
        "system-design": "10-25",
        "code-review": "10-25",
        research: "10-25",
      }),
      employerAdoption: "encouraged",
      toolsUsed: ["chatgpt", "claude", "cursor"],
      headcountChange: "flat",
      structuralChange: "yes_somewhat",
      domainExpertise: "significant",
      // Branch 1 (leadership) auto-assigns decisionStakes = "constant"; we set
      // it explicitly here for clarity.
      decisionStakes: "constant",
      relationshipImportance: "critical",
      novelProblems: "frequently",
      managerConversations: "substantial",
      activeLearning: "regular",
    },
  },
];

let failures = 0;

console.log("\nAI Job Risk — scoring calibration check (spec 4.1.2)\n");
console.log(
  "Persona".padEnd(40) +
    "TaskAuto".padEnd(12) +
    "Composite".padEnd(12) +
    "Tier".padEnd(16) +
    "Result",
);
console.log("-".repeat(90));

for (const persona of PERSONAS) {
  const result = calculateAIDisruptionScore(persona.responses, softwareEngineers);
  const taskAuto = result.factorBreakdown.taskAutomatability;
  const [lo, hi] = persona.expectedTaskAutomatability;
  const taskAutoOk = taskAuto >= lo && taskAuto <= hi;
  const tierOk = persona.expectedTiers.includes(result.tier);
  const pivotIds = result.topPivotPaths.map((p) => p.pathId);
  const missingPivots = (persona.expectedPivotIncludes ?? []).filter(
    (id) => !pivotIds.includes(id),
  );
  const pivotOk = missingPivots.length === 0;
  const execCount = pivotIds.filter((id) => SWE_EXECUTIVE_PATH_IDS.has(id)).length;
  const execOk =
    persona.expectedExecutiveCount === undefined ||
    execCount >= persona.expectedExecutiveCount;
  const ok = taskAutoOk && tierOk && pivotOk && execOk;
  if (!ok) failures++;

  console.log(
    persona.name.padEnd(40) +
      `${taskAuto} (${lo}-${hi})`.padEnd(12) +
      String(result.compositeScore).padEnd(12) +
      getTier(result.tier).label.padEnd(16) +
      (ok ? "PASS" : "FAIL"),
  );
  if (!taskAutoOk) {
    console.log(`   ! Task Automatability ${taskAuto} outside spec range ${lo}-${hi}`);
  }
  if (!tierOk) {
    console.log(
      `   ! Tier ${result.tier} not in expected ${persona.expectedTiers.join("/")}`,
    );
  }
  if (!pivotOk) {
    console.log(
      `   ! Missing required pivot path(s): ${missingPivots.join(", ")}`,
    );
  }
  if (!execOk) {
    console.log(
      `   ! Expected ≥${persona.expectedExecutiveCount} executive-tier path(s) in top 3, got ${execCount}`,
    );
  }
  // Surface the selected pivot paths for eyeball review.
  const paths = result.topPivotPaths
    .map((p) => `${p.pathId} (fit ${p.fitScore})`)
    .join(", ");
  console.log(`   pivot paths: ${paths}`);
}

console.log("-".repeat(90));
if (failures === 0) {
  console.log("\nAll personas match the spec calibration table.\n");
  process.exit(0);
} else {
  console.log(`\n${failures} persona(s) failed calibration.\n`);
  process.exit(1);
}
