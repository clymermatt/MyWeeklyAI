/**
 * 30-day action plan templates (spec §6.7).
 *
 * Three deterministic templates per assessment-taker, derived from their tool
 * count, top pivot path, and role config. These get passed to the LLM (§6.9.5)
 * which wraps them with personalized prose; the templates themselves keep the
 * concrete substance (tool names, pivot-path names, portfolio artifacts) stable
 * and hallucination-proof.
 */

import type { PivotPath, RoleConfig } from "./types";

/**
 * Action 1 — audit and deepen tool fluency. Adapts to current tool count.
 *
 * For users with 2+ tools, the template intentionally does NOT name a tool —
 * the AI prompt fills in a tool from the user's actual selections, guided by
 * RoleConfig.toolFitHints (spec v1.0.2 fix). Previously this template
 * hardcoded `roleConfig.topRecommendedTool`, which led to references to tools
 * the user hadn't selected.
 */
export function buildAction1Template(
  roleConfig: RoleConfig,
  toolCount: number,
): string {
  if (toolCount <= 1) {
    return `Spend 2-3 hours getting fluent with ${roleConfig.topRecommendedTool}.`;
  }
  if (toolCount <= 3) {
    return "Identify one workflow you do manually each week. Pick one of your currently used AI tools that fits the workflow, and rebuild it over the next 7 days.";
  }
  return "Pick the AI tool you currently use least. Find 3 concrete use cases for it in your work this week.";
}

/** Action 2 — talk to one person already on the top pivot path. Generic across roles. */
export function buildAction2Template(topPivotPath: PivotPath): string {
  return `Find a ${topPivotPath.name} who made this transition in the last 2 years. Use LinkedIn or your existing network. Have one 30-minute conversation. Ask three questions: how they made the transition, what they would do differently in hindsight, and what to learn first.`;
}

/** Action 3 — ship a portfolio artifact aligned to the top pivot path. */
export function buildAction3Template(topPivotPath: PivotPath): string {
  return (
    topPivotPath.portfolioArtifactTemplate ??
    `Identify a concrete project that demonstrates skills for ${topPivotPath.name}. Allocate 8-10 hours over the month to build or write it. Make it shareable.`
  );
}
