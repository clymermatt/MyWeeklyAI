/**
 * Role-agnostic question definitions for the assessment (spec Section 5).
 *
 * Single source of truth shared by the scoring engine and the quiz UI, so
 * option keys and point values never drift between them. Role-specific content
 * (A1 role titles, B1 task library, D2 help text) lives in each role config.
 */

import type { TaskTimeRange } from "./types";

export interface Option<V extends string = string> {
  value: V;
  label: string;
  /** description shown beneath the option, where the spec provides one */
  description?: string;
  /** point contribution to the relevant factor (omitted when not scored) */
  points?: number;
}

// ─── A3: Years of experience (Career Portability input A) ────────────────────

export const YEARS_EXPERIENCE_OPTIONS: Option[] = [
  { value: "0-2", label: "0-2 years", points: 30 },
  { value: "3-5", label: "3-5 years", points: 50 },
  { value: "6-10", label: "6-10 years", points: 70 },
  { value: "11-15", label: "11-15 years", points: 85 },
  { value: "16+", label: "16+ years", points: 100 },
];

// ─── B1: Task time ranges ────────────────────────────────────────────────────

export const TASK_TIME_OPTIONS: Option<TaskTimeRange>[] = [
  { value: "none", label: "None" },
  { value: "0-10", label: "0-10%" },
  { value: "10-25", label: "10-25%" },
  { value: "25-50", label: "25-50%" },
  { value: "50+", label: "50%+" },
];

/** Midpoint time percent used for scoring each range (spec 5.3 B1). */
export const TASK_TIME_MIDPOINTS: Record<TaskTimeRange, number> = {
  none: 0,
  "0-10": 5,
  "10-25": 17.5,
  "25-50": 37.5,
  "50+": 60,
};

// ─── C1: Employer AI posture (Adoption Velocity Q-A) ─────────────────────────

export const EMPLOYER_ADOPTION_OPTIONS: Option[] = [
  {
    value: "mandated",
    label: "Mandated — we're expected to use specific AI tools and our usage is tracked",
    points: 100,
  },
  {
    value: "encouraged",
    label: "Encouraged — the company provides AI tools and pushes adoption",
    points: 75,
  },
  {
    value: "allowed",
    label: "Allowed — we can use AI tools but they're not provided",
    points: 50,
  },
  {
    value: "discouraged",
    label: "Discouraged — there are restrictions or skepticism around AI use",
    points: 25,
  },
  { value: "unknown", label: "Don't know / Not sure", points: 50 },
];

// ─── C2: AI tools used (Adoption Velocity Q-B) ───────────────────────────────

/**
 * The 18 preset AI tools — must match the newsletter profile's Tools &
 * Platforms field exactly (spec 11.3.3 / A.10).
 */
export const AI_TOOLS: Option[] = [
  { value: "chatgpt", label: "ChatGPT" },
  { value: "claude", label: "Claude" },
  { value: "gemini", label: "Gemini" },
  { value: "copilot", label: "Copilot" },
  { value: "cursor", label: "Cursor" },
  { value: "midjourney", label: "Midjourney" },
  { value: "dalle", label: "DALL-E" },
  { value: "stable-diffusion", label: "Stable Diffusion" },
  { value: "notion-ai", label: "Notion AI" },
  { value: "jasper", label: "Jasper" },
  { value: "perplexity", label: "Perplexity" },
  { value: "replit", label: "Replit" },
  { value: "hugging-face", label: "Hugging Face" },
  { value: "langchain", label: "LangChain" },
  { value: "vercel-ai-sdk", label: "Vercel AI SDK" },
  { value: "aws-bedrock", label: "AWS Bedrock" },
  { value: "azure-openai", label: "Azure OpenAI" },
  { value: "google-vertex-ai", label: "Google Vertex AI" },
];

/** Tool-count -> Adoption Velocity points (spec 3.4 Q-B / 5.4 C2). */
export function toolCountPoints(count: number): number {
  if (count >= 4) return 100;
  if (count === 3) return 75;
  if (count === 2) return 50;
  if (count === 1) return 30;
  return 10;
}

// ─── C3: Team headcount change (Adoption Velocity Q-C) ───────────────────────

export const HEADCOUNT_CHANGE_OPTIONS: Option[] = [
  {
    value: "reduction",
    label: "Significant reduction (layoffs or major restructuring)",
    points: 100,
  },
  {
    value: "attrition",
    label: "Some attrition not replaced (people left and weren't backfilled)",
    points: 75,
  },
  { value: "flat", label: "Flat (about the same size)", points: 50 },
  { value: "hiring", label: "Some hiring (a few new people)", points: 25 },
  {
    value: "growth",
    label: "Significant hiring (substantial team growth)",
    points: 10,
  },
];

// ─── C4: Structural change due to AI (Adoption Velocity Q-D) ─────────────────

export const STRUCTURAL_CHANGE_OPTIONS: Option[] = [
  {
    value: "yes_significant",
    label:
      "Yes, significantly (clear restructuring, new roles, or major workflow changes)",
    points: 100,
  },
  {
    value: "yes_somewhat",
    label: "Yes, somewhat (some changes but business mostly as usual)",
    points: 70,
  },
  { value: "no", label: "No (nothing noticeable yet)", points: 30 },
  { value: "unknown", label: "Don't know", points: 50 },
];

// ─── D1: Domain expertise depth (Skill Differentiation Q-A) ──────────────────

export const DOMAIN_EXPERTISE_OPTIONS: Option[] = [
  {
    value: "most",
    label: "Most of it — I'm specifically sought out for this expertise",
    points: 100,
  },
  {
    value: "significant",
    label: "Significant — I'm one of few people who knows this well",
    points: 75,
  },
  { value: "some", label: "Some — I know it but others could learn it", points: 40 },
  {
    value: "little",
    label: "Little — my work is mostly general-purpose",
    points: 15,
  },
];

// ─── D2: Decision-consequence stakes (Skill Differentiation Q-B) ─────────────

export const DECISION_STAKES_OPTIONS: Option[] = [
  {
    value: "constant",
    label: "Constantly — high-stakes decisions are core to my role",
    points: 100,
  },
  { value: "regular", label: "Regularly — multiple times a week", points: 75 },
  {
    value: "sometimes",
    label: "Sometimes — occasionally important calls to make",
    points: 40,
  },
  { value: "rarely", label: "Rarely — my decisions are mostly reversible", points: 15 },
];

// ─── D3: Relationship dependence (Skill Differentiation Q-C) ─────────────────

export const RELATIONSHIP_OPTIONS: Option[] = [
  {
    value: "critical",
    label: "Critical — relationships are core to my effectiveness",
    points: 100,
  },
  {
    value: "important",
    label: "Important — they meaningfully affect my outcomes",
    points: 70,
  },
  {
    value: "somewhat",
    label: "Somewhat important — they help but aren't central",
    points: 40,
  },
  {
    value: "not_relevant",
    label: "Not really relevant — I work mostly independently",
    points: 15,
  },
];

// ─── D4: Novel-problem frequency (Skill Differentiation Q-D) ─────────────────

export const NOVEL_PROBLEMS_OPTIONS: Option[] = [
  {
    value: "most",
    label: "Most of my work involves genuinely novel problems",
    points: 100,
  },
  {
    value: "frequently",
    label: "Frequently — much of my work has no clear template",
    points: 75,
  },
  {
    value: "occasionally",
    label: "Occasionally — sometimes new, often familiar",
    points: 40,
  },
  {
    value: "rarely",
    label: "Rarely — I usually adapt existing patterns",
    points: 15,
  },
];

// ─── E1 / E2: Looking-ahead questions ────────────────────────────────────────
// Time-to-Impact Urgency (Factor 5) modifiers — spec 3.7 / 3.9 (v1.0.1).
// Weights are deliberately modest: these are self-reports subject to bias.

export const MANAGER_CONVERSATION_OPTIONS: Option[] = [
  {
    value: "substantial",
    label: "Yes, substantially (multiple serious conversations)",
    points: 8,
  },
  { value: "brief", label: "Yes, briefly (it's come up but not in depth)", points: 3 },
  { value: "no", label: "No (it hasn't really come up)", points: 0 },
];

export const ACTIVE_LEARNING_OPTIONS: Option[] = [
  { value: "regular", label: "Yes, regularly (weekly or more)", points: -7 },
  { value: "occasional", label: "Occasionally (when something interests me)", points: -2 },
  { value: "no", label: "No (not really)", points: 3 },
];

// ─── Lookup helper ───────────────────────────────────────────────────────────

/** Point value for a selected option; 0 if unknown. */
export function pointsFor(options: Option[], value: string | undefined): number {
  return options.find((o) => o.value === value)?.points ?? 0;
}
