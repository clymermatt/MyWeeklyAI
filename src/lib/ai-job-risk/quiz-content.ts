/**
 * Serializable projection of a RoleConfig for the client-side quiz.
 *
 * A RoleConfig contains functions (resolveSeniority, pivot scoring rules) that
 * cannot cross the server/client boundary as props. The quiz only needs display
 * data, so the server page projects a RoleConfig down to this plain object.
 */

import type { RoleConfig, RoleTitleOption } from "./types";

export interface QuizContent {
  slug: string;
  label: string;
  pluralLabel: string;
  headline: string;
  /** A1 role-title options */
  roleTitles: RoleTitleOption[];
  /** B1 task library — id, name, and AR (AR drives conditional branch 3) */
  tasks: { id: string; name: string; automatabilityRating: number }[];
  /** D2 role-specific help text */
  decisionStakesHelp: string;
}

export function toQuizContent(role: RoleConfig): QuizContent {
  return {
    slug: role.slug,
    label: role.label,
    pluralLabel: role.pluralLabel,
    headline: role.headline,
    roleTitles: role.roleTitles,
    tasks: role.taskLibrary.map((t) => ({
      id: t.id,
      name: t.name,
      automatabilityRating: t.automatabilityRating,
    })),
    decisionStakesHelp: role.decisionStakesHelp,
  };
}
