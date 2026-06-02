/**
 * AI Job Risk Assessment — shared domain types.
 *
 * Mirrors the product spec (docs/ai-job-risk-assessment-spec.md), primarily
 * Sections 3 (scoring model), 4 (role content), 5 (question flow) and 6 (report).
 */

export type RiskTierKey = "LOW" | "MODERATE" | "MODERATE_HIGH" | "HIGH" | "SEVERE";

/** Discrete task-time buckets the user picks in quiz question B1. */
export type TaskTimeRange = "none" | "0-10" | "10-25" | "25-50" | "50+";

export type PathProvenance = "established" | "emerging" | "forecast";

/** Diversification buckets — selection avoids 3 paths of the same type (spec 4.1.7). */
export type PivotPathType =
  | "ai-engineering-ic"
  | "customer-facing-technical"
  | "leadership"
  | "entrepreneurial"
  | "specialized-ic";

// ─── Raw quiz input ──────────────────────────────────────────────────────────

/**
 * Raw answers collected by the quiz, stored verbatim in
 * AssessmentResult.responses. Values are stable option keys, not display labels.
 */
export interface UserResponses {
  /** A1 — role-title option value (defined per role config) */
  role: string;
  /** A2 — industry slug */
  industry: string;
  /** A3 — years-of-experience option value */
  yearsExperience: string;
  /** B1 — taskId -> selected time range (tasks set to "none" may be omitted) */
  taskTimes: Record<string, TaskTimeRange>;
  /** C1 — employer AI posture */
  employerAdoption: string;
  /** C2 — selected preset tool ids (excludes "none") */
  toolsUsed: string[];
  /** C2 — free-text custom tools entered via "Other" */
  customTools?: string[];
  /** C3 — team headcount change */
  headcountChange: string;
  /** C4 — structural change due to AI */
  structuralChange: string;
  /** D1 — domain expertise depth */
  domainExpertise: string;
  /** D2 — decision-consequence stakes (auto-assigned max for leadership roles) */
  decisionStakes: string;
  /** D3 — relationship/trust dependence */
  relationshipImportance: string;
  /** D4 — novel-problem frequency */
  novelProblems: string;
  /** E1 — manager conversations (Time-to-Impact Urgency modifier) */
  managerConversations?: string;
  /** E2 — active learning (Time-to-Impact Urgency modifier) */
  activeLearning?: string;
  /** E3 — optional free-text worry, never scored */
  openTextWorry?: string | null;
}

// ─── Role configuration (Section 4) ──────────────────────────────────────────

export interface TaskDefinition {
  id: string;
  name: string;
  /** Automatability Rating, 0-100 (spec 4.X.1) */
  automatabilityRating: number;
  /** Factual basis used to ground AI-generated task analysis (spec 6.9.3) */
  reasoning: string;
  /** Static "what's left for humans" copy shown in the report (spec 6.5) */
  whatsLeftForHumans: string;
}

export interface RoleTitleOption {
  /** stable key stored in UserResponses.role */
  value: string;
  label: string;
  /** ordinal seniority rank (0 = most junior) — used for pivot eligibility */
  seniorityOrdinal: number;
  /** triggers conditional branch 1: skip D2, auto-assign max decision stakes */
  isLeadership?: boolean;
  /** junior IC title — with A3 = "0-2" triggers branch 2 (skip E1) */
  isJuniorIC?: boolean;
  /**
   * The ContextProfile role label to use when pre-populating the newsletter
   * profile for a brand-new subscriber (spec 11.3.1). Must match one of the
   * preset role strings in context-profile-form.tsx.
   */
  profileRole: string;
}

/** A single data-driven pivot-path scoring signal (spec A.15, 4.1.7). */
export interface PivotScoringRule {
  /** human-readable reason, surfaced in "why we picked this path" */
  label: string;
  points: number;
  test: (ctx: PivotScoringContext) => boolean;
  /** rules sharing a group: only the highest-scoring match counts (not additive) */
  group?: string;
}

export interface PivotPath {
  id: string;
  /** canonical number in the role's library (1-12 originals, 13-15 junior paths) */
  number: number;
  name: string;
  provenance: PathProvenance;
  type: PivotPathType;
  dayToDay: string;
  whyDurable: string;
  requiredExperience: string;
  transferableSkills: string;
  skillGaps: string;
  salaryRange: string;
  timeline: string;
  bestFitsWhen: string;
  /** inclusive seniority ordinal eligibility window */
  minSeniorityOrdinal: number;
  maxSeniorityOrdinal: number;
  /** data-driven fit scoring rules (spec 4.1.7) */
  scoringRules: PivotScoringRule[];
  /**
   * Industries where this path is uniquely strong — a user in one of these
   * receives a +40 industry-match bonus on fit score (spec v1.0.2).
   */
  pathDefiningIndustries?: string[];
  /**
   * Industries that strongly align with this path (e.g. SaaS for AI Engineer).
   * Adds +20 to fit score (spec v1.0.2). Ignored if the user's industry is in
   * pathDefiningIndustries (the larger bonus wins).
   */
  strongContextIndustries?: string[];
  /** action-plan portfolio-artifact template, if this path has a bespoke one (spec 6.7) */
  portfolioArtifactTemplate?: string;
}

export interface RoleConfig {
  /** URL slug, e.g. "software-engineers" */
  slug: string;
  /** short prefix used in shareable result IDs, e.g. "swe" → "swe-7f3a9b2c" */
  resultIdPrefix: string;
  /** singular label, e.g. "Software Engineer" */
  label: string;
  /** plural label, e.g. "Software Engineers" */
  pluralLabel: string;
  /** search-intent headline (spec 7.3), e.g. "Will AI replace your software engineering job?" */
  headline: string;
  /** A1 role-title options for this assessment */
  roleTitles: RoleTitleOption[];
  /** B1 task library (10-12 tasks) */
  taskLibrary: TaskDefinition[];
  /** pivot path library (12 paths) */
  pivotPaths: PivotPath[];
  /** D2 role-specific help text (spec 5.5 D2) */
  decisionStakesHelp: string;
  /** Factor 4 input C — per-role pivot path availability, 0-100 (spec 4.X.4) */
  pivotPathAvailability: number;
  /** Factor 5 base urgency keyed by seniority-level key (spec 4.X.3 / 4.X.5) */
  baseUrgencyByLevel: Record<string, number>;
  /** durable-specialization reference lists (report content; spec 4.X.6) */
  durableSpecializations: {
    durable: string[];
    moderate: string[];
    commoditizing: string[];
  };
  /** top recommended AI tool(s) for the 30-day action plan (spec 6.7 Action 1) */
  topRecommendedTool: string;
  /**
   * Role-specific guidance for which AI tools fit which workflows. Passed to
   * the action-plan prompt so the AI picks a tool from the user's own
   * selections that matches the action — preventing references to tools the
   * user didn't select (spec v1.0.2 fix).
   */
  toolFitHints: string;
  /** Concrete AI tools to name-drop in the landing-page "What you'll learn" section (spec 7.5) */
  landingToolMentions: string;
  /** Sample-report persona description for the landing-page preview (spec 7.7) */
  landingSamplePersona: string;
  /**
   * Resolve the seniority level for Factor 5 base-urgency lookup.
   * Role-specific because it depends on role title, years, and expertise depth.
   */
  resolveSeniority: (responses: UserResponses) => SeniorityResolution;
}

export interface SeniorityResolution {
  /** key into RoleConfig.baseUrgencyByLevel */
  levelKey: string;
  /** human-readable label, e.g. "Senior IC, specialized" */
  label: string;
  /** effective seniority ordinal (0 = most junior) for pivot-path eligibility */
  ordinal: number;
}

// ─── Scoring output (Section 3) ──────────────────────────────────────────────

export interface FactorScores {
  /** Factor 1, 40% weight */
  taskAutomatability: number;
  /** Factor 2, 20% weight */
  adoptionVelocity: number;
  /** Factor 3 raw (higher = more differentiated). Inverted inside the composite. */
  skillDifferentiationRaw: number;
  /** Factor 4 raw (higher = more portable). Inverted inside the composite. */
  careerPortabilityRaw: number;
  /** Factor 5, 10% weight */
  timeToImpactUrgency: number;
}

export interface SelectedPivotPath {
  pathId: string;
  fitScore: number;
  /** the rule labels that scored this path — feeds "why we picked this" (spec 6.6) */
  matchedReasons: string[];
}

export interface ScoreResult {
  compositeScore: number;
  tier: RiskTierKey;
  factors: FactorScores;
  /** rounded factor values, as displayed in the report */
  factorBreakdown: FactorScores;
  topPivotPaths: SelectedPivotPath[];
  seniority: SeniorityResolution;
  /** taskId -> normalized time percent (sums to 100 across reported tasks) */
  normalizedTaskTimes: Record<string, number>;
}

// ─── Pivot scoring context ───────────────────────────────────────────────────

// ─── Report generation (Section 6) ───────────────────────────────────────────

/**
 * Cached AI-generated report content, stored in AssessmentResult.reportContent.
 * Generated once on the first authed view and reused on every subsequent view
 * (spec §6.10 / §A.18).
 */
export interface ReportContent {
  generatedAt: string;
  version: string;
  sections: {
    openingSummary: string;
    factorExplanations: {
      taskAutomatability: string;
      adoptionVelocity: string;
      skillDifferentiation: string;
      careerPortability: string;
      timeToImpactUrgency: string;
    };
    taskAnalyses: { taskId: string; taskName: string; timePercent: number; analysis: string }[];
    pivotPathFits: Record<string, string>;
    actionPlan: {
      action1: { header: string; detail: string };
      action2: { header: string; detail: string };
      action3: { header: string; detail: string };
    };
    progressLine: string;
  };
}

/** Everything a pivot-path scoring rule can inspect. */
export interface PivotScoringContext {
  responses: UserResponses;
  /** taskId -> normalized time percent */
  taskTimePercents: Record<string, number>;
  /** count of preset + custom tools selected */
  toolCount: number;
  /** ordinal seniority rank from the chosen role title */
  seniorityOrdinal: number;
  scores: FactorScores;
  compositeScore: number;
  industrySlug: string;
}
