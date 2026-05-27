/**
 * Derive newsletter profile fields from a completed assessment (spec §11.3).
 *
 * Used to pre-populate ContextProfile for brand-new subscribers who arrive via
 * the assessment funnel. For existing subscribers the spec says NOT to
 * overwrite — the caller in persist.ts checks for that before calling here.
 */

import { AI_TOOLS } from "./questions";
import { getIndustry } from "./industries";
import type { RoleConfig, UserResponses } from "./types";

// Goal preset labels — must match GOALS array in context-profile-form.tsx exactly.
const GOAL_STAY_CURRENT = "Stay current on AI trends";
const GOAL_AUTOMATE = "Automate repetitive workflows";
const GOAL_BUILD_AI = "Build AI-powered products";
const GOAL_TEAM_PRODUCTIVITY = "Improve team productivity with AI";
const GOAL_PROMPT_ENG = "Learn prompt engineering";
const GOAL_EVAL_TOOLS = "Evaluate AI tools for my team";
const GOAL_INTEGRATE = "Integrate AI into existing products";
const GOAL_STRATEGY = "Understand AI strategy & business impact";
const GOAL_CONTENT = "Explore AI for content creation";
const GOAL_RESEARCH = "Keep up with AI research & papers";
const GOAL_INDUSTRY = "Find AI use cases for my industry";
const GOAL_REDUCE_COSTS = "Reduce costs with AI automation";

// Focus-topic preset labels — must match FOCUS_TOPICS in context-profile-form.tsx.
const TOPIC_LLMS = "LLMs & foundation models";
const TOPIC_AGENTS = "AI agents & autonomy";
const TOPIC_CODE_GEN = "Code generation";
const TOPIC_RAG = "RAG & knowledge retrieval";
const TOPIC_PROMPT_ENG = "Prompt engineering";
const TOPIC_PRODUCT_DESIGN = "AI product design & UX";
const TOPIC_COMP_VISION = "Computer vision";
const TOPIC_VOICE = "Voice & speech AI";
const TOPIC_REGULATION = "AI regulation & policy";
const TOPIC_SAFETY = "AI safety & alignment";
const TOPIC_OPEN_SOURCE = "Open source AI";
const TOPIC_MLOPS = "AI infrastructure & MLOps";
const TOPIC_HEALTHCARE = "AI in healthcare";
const TOPIC_FINANCE = "AI in finance";
const TOPIC_EDUCATION = "AI in education";
const TOPIC_ROBOTICS = "Robotics & embodied AI";

const MANAGEMENT_ROLES = new Set([
  "Engineering Manager",
  "CTO / VP Engineering",
  "CEO / Founder",
]);
const EXECUTIVE_ROLES = new Set(["CTO / VP Engineering", "CEO / Founder"]);
const ENGINEERING_ROLES = new Set([
  "Software Engineer",
  "Data Scientist / ML Engineer",
  "DevOps / Platform Engineer",
  "Solutions Architect",
]);
const CONTENT_ROLES = new Set(["Marketing Manager", "Content Strategist"]);
const RESEARCH_ROLES = new Set(["Data Scientist / ML Engineer", "Research Scientist"]);

const REGULATED_INDUSTRY_SLUGS = new Set([
  "healthcare",
  "legal",
  "government",
  "fintech",
]);

const COST_PRESSURE_HEADCOUNTS = new Set(["reduction", "attrition"]);

const EXPERIENCE_LABEL: Record<string, string> = {
  "0-2": "0-2 years",
  "3-5": "3-5 years",
  "6-10": "6-10 years",
  "11-15": "11-15 years",
  "16+": "16+ years",
};

const CAP = 5;

export interface DerivedProfile {
  roleTitle: string;
  industry: string;
  experienceLevel: string;
  tools: string[];
  goals: string[];
  focusTopics: string[];
}

export function deriveProfileFromAssessment(
  responses: UserResponses,
  taskAutomatability: number,
  roleConfig: RoleConfig,
): DerivedProfile {
  const roleOption = roleConfig.roleTitles.find((t) => t.value === responses.role);
  const profileRole = roleOption?.profileRole ?? roleConfig.label;
  const industry = getIndustry(responses.industry);

  const toolLabels = mapToolIdsToLabels(responses.toolsUsed);
  const tools = dedupe([...toolLabels, ...(responses.customTools ?? [])]);

  return {
    roleTitle: profileRole,
    industry: industry?.label ?? "",
    experienceLevel: EXPERIENCE_LABEL[responses.yearsExperience] ?? "",
    tools,
    goals: deriveGoals({
      profileRole,
      industrySlug: responses.industry,
      headcountChange: responses.headcountChange,
      taskAutomatability,
      toolCount: tools.length,
    }),
    focusTopics: deriveFocusTopics({
      profileRole,
      industrySlug: responses.industry,
    }),
  };
}

function mapToolIdsToLabels(ids: string[]): string[] {
  const byId = new Map(AI_TOOLS.map((t) => [t.value, t.label]));
  return ids.map((id) => byId.get(id) ?? id).filter(Boolean);
}

// Goals: build by priority bucket, dedupe, cap at 5 (spec 11.3.2).
function deriveGoals(input: {
  profileRole: string;
  industrySlug: string;
  headcountChange: string;
  taskAutomatability: number;
  toolCount: number;
}): string[] {
  const universal = [GOAL_STAY_CURRENT];
  const industry: string[] = [];
  const role: string[] = [];
  const score: string[] = [];

  if (REGULATED_INDUSTRY_SLUGS.has(input.industrySlug)) industry.push(GOAL_INDUSTRY);
  if (COST_PRESSURE_HEADCOUNTS.has(input.headcountChange))
    industry.push(GOAL_REDUCE_COSTS);

  if (MANAGEMENT_ROLES.has(input.profileRole))
    role.push(GOAL_EVAL_TOOLS, GOAL_TEAM_PRODUCTIVITY);
  if (EXECUTIVE_ROLES.has(input.profileRole)) role.push(GOAL_STRATEGY);
  if (CONTENT_ROLES.has(input.profileRole)) role.push(GOAL_CONTENT);
  if (ENGINEERING_ROLES.has(input.profileRole))
    role.push(GOAL_BUILD_AI, GOAL_INTEGRATE);
  if (RESEARCH_ROLES.has(input.profileRole)) role.push(GOAL_RESEARCH);

  if (input.taskAutomatability > 60) score.push(GOAL_AUTOMATE);
  if (input.toolCount <= 1) score.push(GOAL_PROMPT_ENG);

  return capByPriority([universal, industry, role, score], CAP);
}

// Focus Topics: industry first, then role, then universal; cap at 5 (spec 11.3.4).
function deriveFocusTopics(input: {
  profileRole: string;
  industrySlug: string;
}): string[] {
  const universal = [TOPIC_AGENTS, TOPIC_REGULATION];
  const industry: string[] = [];
  const role: string[] = [];

  switch (input.industrySlug) {
    case "healthcare":
      industry.push(TOPIC_HEALTHCARE);
      break;
    case "fintech":
      industry.push(TOPIC_FINANCE);
      break;
    case "education":
      industry.push(TOPIC_EDUCATION);
      break;
    case "manufacturing":
    case "transportation":
      industry.push(TOPIC_ROBOTICS);
      break;
    case "media-entertainment":
      industry.push(TOPIC_VOICE, TOPIC_COMP_VISION);
      break;
    case "gaming":
      industry.push(TOPIC_COMP_VISION, TOPIC_VOICE);
      break;
    case "cybersecurity":
      industry.push(TOPIC_SAFETY, TOPIC_OPEN_SOURCE);
      break;
  }

  switch (input.profileRole) {
    case "Software Engineer":
      role.push(TOPIC_LLMS, TOPIC_CODE_GEN, TOPIC_MLOPS, TOPIC_OPEN_SOURCE);
      break;
    case "Data Scientist / ML Engineer":
      role.push(TOPIC_LLMS, TOPIC_RAG, TOPIC_MLOPS, TOPIC_OPEN_SOURCE);
      break;
    case "DevOps / Platform Engineer":
      role.push(TOPIC_MLOPS, TOPIC_OPEN_SOURCE);
      break;
    case "Research Scientist":
      role.push(TOPIC_LLMS, TOPIC_SAFETY, TOPIC_OPEN_SOURCE);
      break;
    case "Solutions Architect":
      role.push(TOPIC_MLOPS, TOPIC_LLMS);
      break;
    case "UX / Product Designer":
      role.push(TOPIC_PRODUCT_DESIGN);
      break;
    case "Product Manager":
      role.push(TOPIC_PRODUCT_DESIGN, TOPIC_LLMS);
      break;
    case "Engineering Manager":
      role.push(TOPIC_MLOPS, TOPIC_SAFETY);
      break;
    case "CTO / VP Engineering":
      role.push(TOPIC_MLOPS, TOPIC_SAFETY, TOPIC_REGULATION);
      break;
    case "CEO / Founder":
      role.push(TOPIC_SAFETY, TOPIC_REGULATION);
      break;
    case "Marketing Manager":
      role.push(TOPIC_PROMPT_ENG, TOPIC_PRODUCT_DESIGN);
      break;
    case "Content Strategist":
    case "Sales / Revenue":
    case "Project Manager":
    case "Customer Success":
      role.push(TOPIC_PROMPT_ENG);
      break;
    case "Business Analyst":
      role.push(TOPIC_PROMPT_ENG, TOPIC_RAG);
      break;
    case "Consultant":
      role.push(TOPIC_PROMPT_ENG, TOPIC_REGULATION);
      break;
    case "Student / Researcher":
      role.push(TOPIC_LLMS, TOPIC_OPEN_SOURCE, TOPIC_SAFETY);
      break;
  }

  return capByPriority([industry, role, universal], CAP);
}

function capByPriority(buckets: string[][], cap: number): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const bucket of buckets) {
    for (const item of bucket) {
      if (seen.has(item)) continue;
      seen.add(item);
      result.push(item);
      if (result.length === cap) return result;
    }
  }
  return result;
}

function dedupe<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}
