/**
 * UTM tagging for assessment outbound links.
 *
 * One campaign across the whole product (`ai_job_risk_assessment`); source +
 * medium identify the channel. Vercel Analytics auto-parses these — referral
 * traffic from the PDF and welcome email shows up in the dashboard with no
 * extra integration.
 */

const CAMPAIGN = "ai_job_risk_assessment";
const PLACEHOLDER_BASE = "https://placeholder.invalid";

export interface UtmInput {
  source: string;
  medium: string;
  /** optional sub-tag, e.g. role slug or click location */
  content?: string;
}

/** Append UTM params to a URL. Handles relative or absolute URLs. */
export function withUtm(url: string, input: UtmInput): string {
  const isAbsolute = /^https?:/i.test(url);
  const u = new URL(url, isAbsolute ? undefined : PLACEHOLDER_BASE);
  u.searchParams.set("utm_source", input.source);
  u.searchParams.set("utm_medium", input.medium);
  u.searchParams.set("utm_campaign", CAMPAIGN);
  if (input.content) u.searchParams.set("utm_content", input.content);
  return isAbsolute ? u.toString() : `${u.pathname}${u.search}`;
}

/** Common channel presets so call sites don't repeat the strings. */
export const utm = {
  pdf: (content?: string): UtmInput => ({
    source: "pdf",
    medium: "referral",
    content,
  }),
  welcomeEmail: (content?: string): UtmInput => ({
    source: "email",
    medium: "assessment_welcome",
    content,
  }),
} as const;
