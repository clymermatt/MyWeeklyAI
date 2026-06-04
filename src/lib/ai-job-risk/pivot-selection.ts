/**
 * Pivot-path selection — picks the top 3 paths for a user (spec 4.1.7).
 *
 * Spec interpretation (flagged for review): Section 4.1.7 describes fit as a
 * 4-component weighted score (skill alignment 0.40, task-profile match 0.25,
 * differentiation match 0.20, risk appropriateness 0.15), but only the skill-
 * alignment component is fully specified — and only for Path 1. v1 implements
 * fit as the clamped sum of each path's data-driven scoring rules, which encode
 * the spec's per-path "best fits when" signals (covering task, tool, seniority,
 * differentiation and risk signals together). The weighted decomposition can be
 * layered in later without changing the role configs.
 */

import type {
  PivotPath,
  PivotScoringContext,
  RoleConfig,
  SelectedPivotPath,
} from "./types";

/** Extract the highest "$NNNk" figure from a salary range, for tie-breaking. */
function parseSalaryCeiling(salaryRange: string): number {
  const matches = salaryRange.match(/(\d+(?:\.\d+)?)\s*K/gi);
  if (!matches) return 0;
  return Math.max(...matches.map((m) => parseFloat(m)));
}

interface ScoredPath {
  path: PivotPath;
  fitScore: number;
  matchedReasons: string[];
  salaryCeiling: number;
}

const PATH_DEFINING_BONUS = 40;
const STRONG_CONTEXT_BONUS = 20;

/** Industry match bonus — applied once per path (spec v1.0.2). Path-defining wins. */
function industryMatchBonus(
  path: PivotPath,
  industrySlug: string,
): { points: number; label: string } | null {
  if (path.pathDefiningIndustries?.includes(industrySlug)) {
    return {
      points: PATH_DEFINING_BONUS,
      label: "Your industry is a defining fit for this path",
    };
  }
  if (path.strongContextIndustries?.includes(industrySlug)) {
    return {
      points: STRONG_CONTEXT_BONUS,
      label: "Your industry strongly aligns with this path",
    };
  }
  return null;
}

/** Sum a path's matching scoring rules; grouped rules keep only their best match. */
function scorePathFit(
  path: PivotPath,
  ctx: PivotScoringContext,
): { fitScore: number; matchedReasons: string[] } {
  const groupBest = new Map<string, { points: number; label: string }>();
  let total = 0;
  const reasons: string[] = [];

  for (const rule of path.scoringRules) {
    if (!rule.test(ctx)) continue;
    if (rule.group) {
      const current = groupBest.get(rule.group);
      if (!current || rule.points > current.points) {
        groupBest.set(rule.group, { points: rule.points, label: rule.label });
      }
    } else {
      total += rule.points;
      reasons.push(rule.label);
    }
  }
  for (const best of groupBest.values()) {
    total += best.points;
    reasons.push(best.label);
  }

  // Apply industry-match bonus, if any (spec v1.0.2).
  const industryBonus = industryMatchBonus(path, ctx.industrySlug);
  if (industryBonus) {
    total += industryBonus.points;
    reasons.push(industryBonus.label);
  }

  return { fitScore: Math.max(0, Math.min(100, total)), matchedReasons: reasons };
}

/** Minimum fit score required for a non-executive path to fill an exec user's
 * slot (spec v1.0.3). Below this threshold we'd rather surface fewer than 3
 * paths than recommend a weak fit. */
const EXEC_FILLER_FIT_THRESHOLD = 70;

/**
 * Apply the type-diversification rule (max 2 paths of the same `PivotPathType`)
 * to an already-sorted candidate list, taking the top `limit` survivors.
 */
function pickWithDiversification(
  pool: ScoredPath[],
  limit: number,
  typeCount: Record<string, number>,
): ScoredPath[] {
  const selected: ScoredPath[] = [];
  for (const candidate of pool) {
    if ((typeCount[candidate.path.type] ?? 0) >= 2) continue;
    selected.push(candidate);
    typeCount[candidate.path.type] = (typeCount[candidate.path.type] ?? 0) + 1;
    if (selected.length === limit) break;
  }
  return selected;
}

/**
 * Select the top 3 pivot paths: filter by seniority eligibility, score fit,
 * then apply the diversification rule (max 2 paths of the same type).
 *
 * Director+ users (ctx.isExecutive) prefer `executive`-tier paths first; we
 * fall back to `ic` paths only when they score above EXEC_FILLER_FIT_THRESHOLD
 * (spec v1.0.3). When no qualifying filler exists, we surface fewer than 3
 * paths and let the report explain why.
 */
export function selectPivotPaths(
  roleConfig: RoleConfig,
  ctx: PivotScoringContext,
): SelectedPivotPath[] {
  const candidates: ScoredPath[] = roleConfig.pivotPaths
    .filter(
      (p) =>
        p.minSeniorityOrdinal <= ctx.seniorityOrdinal &&
        p.maxSeniorityOrdinal >= ctx.seniorityOrdinal,
    )
    .map((path) => {
      const { fitScore, matchedReasons } = scorePathFit(path, ctx);
      return {
        path,
        fitScore,
        matchedReasons,
        salaryCeiling: parseSalaryCeiling(path.salaryRange),
      };
    });

  // Highest fit first; ties go to higher salary potential, then path number.
  candidates.sort(
    (a, b) =>
      b.fitScore - a.fitScore ||
      b.salaryCeiling - a.salaryCeiling ||
      a.path.number - b.path.number,
  );

  const selected: ScoredPath[] = [];
  const typeCount: Record<string, number> = {};

  if (ctx.isExecutive) {
    // Director+ tier preference: fill from executive-tier first, then top up
    // from ic-tier only if the next-best ic path scores genuinely high.
    const execPool = candidates.filter((c) => c.path.tier === "executive");
    const icPool = candidates.filter(
      (c) => c.path.tier === "ic" && c.fitScore > EXEC_FILLER_FIT_THRESHOLD,
    );

    selected.push(...pickWithDiversification(execPool, 3, typeCount));
    if (selected.length < 3) {
      const remaining = 3 - selected.length;
      selected.push(...pickWithDiversification(icPool, remaining, typeCount));
    }
    // Intentional: no final top-up. Better to return 2 paths with a note than
    // to recommend a weak ic fit just to hit the quota.
  } else {
    // Non-exec users: existing logic — diversify, then top up if cap left short.
    selected.push(...pickWithDiversification(candidates, 3, typeCount));
    if (selected.length < 3) {
      for (const candidate of candidates) {
        if (selected.includes(candidate)) continue;
        selected.push(candidate);
        if (selected.length === 3) break;
      }
    }
  }

  return selected.map((c) => ({
    pathId: c.path.id,
    fitScore: c.fitScore,
    matchedReasons: c.matchedReasons,
  }));
}
