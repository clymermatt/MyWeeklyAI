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

  return { fitScore: Math.max(0, Math.min(100, total)), matchedReasons: reasons };
}

/**
 * Select the top 3 pivot paths: filter by seniority eligibility, score fit,
 * then apply the diversification rule (max 2 paths of the same type).
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

  // Diversification: no more than 2 paths of the same type (spec 4.1.7).
  const selected: ScoredPath[] = [];
  const typeCount: Record<string, number> = {};
  for (const candidate of candidates) {
    if ((typeCount[candidate.path.type] ?? 0) >= 2) continue;
    selected.push(candidate);
    typeCount[candidate.path.type] = (typeCount[candidate.path.type] ?? 0) + 1;
    if (selected.length === 3) break;
  }

  // Fallback: if the type cap left us short, top up ignoring it (spec 4.1.7 edge case 1).
  if (selected.length < 3) {
    for (const candidate of candidates) {
      if (selected.includes(candidate)) continue;
      selected.push(candidate);
      if (selected.length === 3) break;
    }
  }

  return selected.map((c) => ({
    pathId: c.path.id,
    fitScore: c.fitScore,
    matchedReasons: c.matchedReasons,
  }));
}
