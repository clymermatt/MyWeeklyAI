/**
 * Role config registry. Each launch role (spec 4.x) registers here so the
 * scoring engine, quiz, and pages can resolve a config from a URL slug.
 */

import type { RoleConfig } from "../types";
import marketingManagers from "./marketing-managers";
import softwareEngineers from "./software-engineers";

export const ROLE_CONFIGS: Record<string, RoleConfig> = {
  [softwareEngineers.slug]: softwareEngineers,
  [marketingManagers.slug]: marketingManagers,
};

/** All registered role slugs (drives static generation of role pages). */
export const ROLE_SLUGS = Object.keys(ROLE_CONFIGS);

export function getRoleConfig(slug: string): RoleConfig | undefined {
  return ROLE_CONFIGS[slug];
}
