/**
 * React-PDF document for the AI Job Risk report (spec §6.12).
 *
 * Takes the same content shape as the on-screen FullReport and renders to PDF
 * via @react-pdf/renderer. Cover page + flowing body. Pure React on the server
 * — no Chromium dependency, deploys cleanly to Vercel functions.
 */

import {
  Document,
  Link as PdfLink,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { factorQualitativeLabel, getTier, taskStatusLabel } from "./tiers";
import { utm, withUtm } from "./utm";
import type {
  PivotPath,
  ReportContent,
  RiskTierKey,
  SelectedPivotPath,
  TaskDefinition,
} from "./types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai";
const HUB_PATH = "/ai-job-risk";

/** Hub URL with PDF-channel UTM params for referral tracking. */
function hubUrl(content?: string): string {
  return withUtm(`${APP_URL}${HUB_PATH}`, utm.pdf(content));
}
/** Display version of the URL — used as link text where the full URL is shown. */
function hubDisplayUrl(): string {
  return `${APP_URL.replace(/^https?:\/\//, "")}${HUB_PATH}`;
}

const C = {
  primary: "#7e22ce",
  accent: "#9333ea",
  accentLight: "#f3e8ff",
  text900: "#111827",
  text700: "#374151",
  text600: "#4b5563",
  text500: "#6b7280",
  text400: "#9ca3af",
  border: "#e5e7eb",
  white: "#ffffff",
} as const;

const styles = StyleSheet.create({
  // Cover page
  coverPage: {
    padding: 64,
    backgroundColor: C.white,
    fontFamily: "Helvetica",
  },
  brand: {
    fontSize: 10,
    color: C.primary,
    letterSpacing: 1.5,
    fontFamily: "Helvetica-Bold",
  },
  coverTitle: {
    fontSize: 28,
    color: C.text900,
    fontFamily: "Helvetica-Bold",
    marginTop: 80,
  },
  coverSubtitle: {
    fontSize: 14,
    color: C.text500,
    marginTop: 6,
  },
  scoreBlock: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 80,
  },
  scoreNumber: {
    fontSize: 96,
    color: C.primary,
    fontFamily: "Helvetica-Bold",
  },
  scoreOutOf: {
    fontSize: 18,
    color: C.text400,
    marginLeft: 12,
    marginBottom: 18,
  },
  tierBadge: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: C.text900,
    marginTop: 12,
  },
  coverMeta: {
    marginTop: 200,
  },
  coverMetaRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  coverMetaLabel: {
    fontSize: 9,
    color: C.text400,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    width: 130,
  },
  coverMetaValue: {
    fontSize: 11,
    color: C.text700,
    flex: 1,
  },

  // Body pages
  page: {
    padding: 48,
    paddingBottom: 64,
    backgroundColor: C.white,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: C.text700,
    lineHeight: 1.5,
  },
  sectionHeading: {
    fontSize: 18,
    color: C.text900,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    marginTop: 18,
  },
  sectionNote: {
    fontSize: 10,
    color: C.text500,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 11,
    color: C.text700,
    marginBottom: 6,
  },
  factorRow: {
    marginBottom: 14,
  },
  factorRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  factorLabel: {
    fontSize: 12,
    color: C.text900,
    fontFamily: "Helvetica-Bold",
  },
  factorScore: {
    fontSize: 11,
    color: C.text600,
    fontFamily: "Helvetica-Bold",
  },
  taskBlock: {
    marginBottom: 14,
  },
  taskTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  taskName: {
    fontSize: 12,
    color: C.text900,
    fontFamily: "Helvetica-Bold",
  },
  taskTime: {
    fontSize: 10,
    color: C.text500,
  },
  taskStatus: {
    fontSize: 9,
    color: C.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  whatsLeft: {
    fontSize: 10,
    color: C.text500,
    fontStyle: "italic",
    marginTop: 4,
  },
  pathBlock: {
    marginBottom: 18,
  },
  pathName: {
    fontSize: 13,
    color: C.primary,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  pathFactsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  pathFactCol: {
    width: "50%",
    marginBottom: 6,
    paddingRight: 8,
  },
  pathFactLabel: {
    fontSize: 9,
    color: C.text900,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  pathFactValue: {
    fontSize: 10,
    color: C.text600,
  },
  actionItem: {
    marginBottom: 12,
  },
  actionWeek: {
    fontSize: 9,
    color: C.primary,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  actionHeader: {
    fontSize: 12,
    color: C.text900,
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bullet: {
    width: 10,
    fontSize: 11,
    color: C.text500,
  },
  bulletText: {
    flex: 1,
    fontSize: 11,
    color: C.text700,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    fontSize: 9,
    color: C.text400,
    textAlign: "center",
  },
  shareCallout: {
    marginTop: 28,
    padding: 14,
    backgroundColor: C.accentLight,
    borderRadius: 6,
  },
  shareTitle: {
    fontSize: 12,
    color: C.text900,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  shareBody: {
    fontSize: 11,
    color: C.text700,
    marginBottom: 6,
  },
  shareLink: {
    fontSize: 11,
    color: C.primary,
    fontFamily: "Helvetica-Bold",
    textDecoration: "none",
  },
  coverHubLink: {
    position: "absolute",
    bottom: 64,
    left: 64,
    right: 64,
    fontSize: 10,
    color: C.text500,
  },
  appendixDivider: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 18,
  },
  appendixHeading: {
    fontSize: 14,
    color: C.text900,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  appendixText: {
    fontSize: 10,
    color: C.text600,
    marginBottom: 6,
  },
  disclaimerBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#fef9c3",
    borderRadius: 6,
  },
  disclaimerLabel: {
    fontSize: 9,
    color: "#854d0e",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 10,
    color: "#713f12",
    lineHeight: 1.5,
  },
  legalLine: {
    marginTop: 12,
    fontSize: 10,
    color: C.text500,
  },
  legalLink: {
    color: C.primary,
    textDecoration: "none",
  },
  fieldLabel: {
    fontSize: 9,
    color: C.text900,
    fontFamily: "Helvetica-Bold",
    marginTop: 4,
  },
});

interface FactorRow {
  key:
    | "taskAutomatability"
    | "adoptionVelocity"
    | "skillDifferentiationRaw"
    | "careerPortabilityRaw"
    | "timeToImpactUrgency";
  contentKey:
    | "taskAutomatability"
    | "adoptionVelocity"
    | "skillDifferentiation"
    | "careerPortability"
    | "timeToImpactUrgency";
  label: string;
}

const FACTOR_ROWS: FactorRow[] = [
  { key: "taskAutomatability", contentKey: "taskAutomatability", label: "Task Automatability" },
  { key: "adoptionVelocity", contentKey: "adoptionVelocity", label: "Adoption Velocity" },
  { key: "skillDifferentiationRaw", contentKey: "skillDifferentiation", label: "Skill Differentiation" },
  { key: "careerPortabilityRaw", contentKey: "careerPortability", label: "Career Portability" },
  { key: "timeToImpactUrgency", contentKey: "timeToImpactUrgency", label: "Time-to-Impact Urgency" },
];

export interface ReportPDFProps {
  compositeScore: number;
  tier: RiskTierKey;
  factorBreakdown: {
    taskAutomatability: number;
    adoptionVelocity: number;
    skillDifferentiationRaw: number;
    careerPortabilityRaw: number;
    timeToImpactUrgency: number;
  };
  selectedPivots: SelectedPivotPath[];
  pivotPaths: PivotPath[];
  taskLibrary: TaskDefinition[];
  rolePlural: string;
  report: ReportContent;
  /** When the assessment was taken (AssessmentResult.createdAt). */
  date: Date;
  /** Email of the user the report is prepared for. Shown on the cover. */
  userEmail: string;
}

export function ReportPDF(props: ReportPDFProps) {
  const tierDef = getTier(props.tier);
  const sections = props.report.sections;
  const dateStr = props.date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const pathById = new Map(props.pivotPaths.map((p) => [p.id, p]));
  const taskById = new Map(props.taskLibrary.map((t) => [t.id, t]));

  return (
    <Document title={`AI Job Risk Report — ${props.rolePlural}`}>
      {/* Cover */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.brand}>MY WEEKLY AI</Text>
        <Text style={styles.coverTitle}>AI Job Risk Assessment</Text>
        <Text style={styles.coverSubtitle}>for {props.rolePlural}</Text>
        <View style={styles.scoreBlock}>
          <Text style={styles.scoreNumber}>{props.compositeScore}</Text>
          <Text style={styles.scoreOutOf}>/ 100</Text>
        </View>
        <Text style={styles.tierBadge}>Risk Tier: {tierDef.label}</Text>
        <View style={styles.coverMeta}>
          <View style={styles.coverMetaRow}>
            <Text style={styles.coverMetaLabel}>ASSESSMENT DATE</Text>
            <Text style={styles.coverMetaValue}>{dateStr}</Text>
          </View>
          <View style={styles.coverMetaRow}>
            <Text style={styles.coverMetaLabel}>PREPARED FOR</Text>
            <Text style={styles.coverMetaValue}>{props.userEmail}</Text>
          </View>
        </View>
        <Text style={styles.coverHubLink}>
          Take your own assessment:{" "}
          <PdfLink src={hubUrl("cover")} style={styles.shareLink}>
            {hubDisplayUrl()}
          </PdfLink>
        </Text>
      </Page>

      {/* Body */}
      <Page size="A4" style={styles.page} wrap>
        {/* Section 1: Headline */}
        <Text style={styles.sectionHeading} minPresenceAhead={100}>Your AI Disruption Score</Text>
        <Text style={styles.bodyText}>{tierDef.description}</Text>
        <Text style={[styles.bodyText, { marginTop: 6 }]}>
          {sections.openingSummary}
        </Text>

        {/* Section 2: Score breakdown */}
        <Text style={styles.sectionHeading} minPresenceAhead={100}>Score breakdown</Text>
        <Text style={styles.sectionNote}>
          Higher is better for Skill Differentiation and Career Portability;
          higher is more concerning for the other three.
        </Text>
        {FACTOR_ROWS.map((r) => (
          <View key={r.key} style={styles.factorRow} wrap={false}>
            <View style={styles.factorRowTop}>
              <Text style={styles.factorLabel}>{r.label}</Text>
              <Text style={styles.factorScore}>
                {props.factorBreakdown[r.key]} / 100 (
                {factorQualitativeLabel(props.factorBreakdown[r.key])})
              </Text>
            </View>
            <Text style={styles.bodyText}>
              {sections.factorExplanations[r.contentKey]}
            </Text>
          </View>
        ))}

        {/* Section 3: Task-by-task analysis */}
        {sections.taskAnalyses.length > 0 && (
          <>
            <Text style={styles.sectionHeading} minPresenceAhead={100}>Task-by-task analysis</Text>
            {sections.taskAnalyses.map((ta) => {
              const def = taskById.get(ta.taskId);
              const ar = def?.automatabilityRating ?? 0;
              return (
                <View key={ta.taskId} style={styles.taskBlock} wrap={false}>
                  <View style={styles.taskTitleRow}>
                    <Text style={styles.taskName}>{ta.taskName}</Text>
                    <Text style={styles.taskTime}>
                      {ta.timePercent}% of your time
                    </Text>
                  </View>
                  <Text style={styles.taskStatus}>{taskStatusLabel(ar).toUpperCase()}</Text>
                  <Text style={styles.bodyText}>{ta.analysis}</Text>
                  {def?.whatsLeftForHumans && (
                    <Text style={styles.whatsLeft}>
                      What&apos;s left for humans: {def.whatsLeftForHumans}
                    </Text>
                  )}
                </View>
              );
            })}
          </>
        )}

        {/* Section 4: Top 3 pivot paths */}
        <Text style={styles.sectionHeading} minPresenceAhead={100}>Your top 3 pivot paths</Text>
        {props.selectedPivots.map((sel, i) => {
          const path = pathById.get(sel.pathId);
          if (!path) return null;
          const fit = sections.pivotPathFits[sel.pathId];
          return (
            <View key={sel.pathId} style={styles.pathBlock} wrap={false}>
              <Text style={styles.pathName}>
                {i + 1}. {path.name} ({provenanceText(path.provenance)})
              </Text>
              {fit && (
                <Text style={styles.bodyText}>
                  <Text style={{ fontFamily: "Helvetica-Bold", color: C.text900 }}>
                    Why this fits you:{" "}
                  </Text>
                  {fit}
                </Text>
              )}
              <Text style={[styles.bodyText, { marginTop: 4 }]}>
                <Text style={{ fontFamily: "Helvetica-Bold", color: C.text900 }}>
                  What it looks like:{" "}
                </Text>
                {path.dayToDay}
              </Text>
              <View style={styles.pathFactsGrid}>
                <PathFact label="Required experience" value={path.requiredExperience} />
                <PathFact label="Salary range" value={path.salaryRange} />
                <PathFact label="Timeline to pivot" value={path.timeline} />
                <PathFact label="Skill gaps to close" value={path.skillGaps} />
              </View>
            </View>
          );
        })}

        {/* Section 5: 30-day action plan */}
        <Text style={styles.sectionHeading} minPresenceAhead={100}>Your 30-day action plan</Text>
        <ActionEntry label="WEEK 1" action={sections.actionPlan.action1} />
        <ActionEntry label="WEEKS 2-3" action={sections.actionPlan.action2} />
        <ActionEntry label="WEEK 4" action={sections.actionPlan.action3} />

        {/* Section 6: Progress tracking */}
        <Text style={styles.sectionHeading} minPresenceAhead={100}>Your score isn&apos;t fixed</Text>
        <Text style={styles.bodyText}>
          Specific actions can lower it meaningfully over 6-12 months:
        </Text>
        <Bullet>
          Moving into a less-exposed adjacent role lowers Task Automatability.
        </Bullet>
        <Bullet>
          Building stakeholder relationships increases Skill Differentiation.
        </Bullet>
        <Bullet>
          Developing specialized expertise increases Career Portability.
        </Bullet>
        <Bullet>
          Becoming the AI go-to person on your team increases your durability.
        </Bullet>
        <Text style={[styles.bodyText, { marginTop: 8, color: C.text900 }]}>
          {sections.progressLine}
        </Text>

        {/* Share callout — invites PDF recipients to take their own assessment */}
        <View style={styles.shareCallout} wrap={false}>
          <Text style={styles.shareTitle}>Worried about your own AI risk?</Text>
          <Text style={styles.shareBody}>
            Take the free 5-minute assessment for your role.
          </Text>
          <PdfLink src={hubUrl("final_cta")} style={styles.shareLink}>
            {hubDisplayUrl()}
          </PdfLink>
        </View>

        {/* Methodology + disclaimer appendix (spec §6.12 page 12) */}
        <View style={styles.appendixDivider} wrap={false}>
          <Text style={styles.appendixHeading}>The methodology</Text>
          <Text style={styles.appendixText}>
            Your score is a weighted composite of five factors:
          </Text>
          <Bullet>Task Automatability (40%) — share of your time on work AI handles today.</Bullet>
          <Bullet>Adoption Velocity (20%) — pace of AI displacement in your employer and industry.</Bullet>
          <Bullet>Skill Differentiation (20%) — what makes your work hard to replicate.</Bullet>
          <Bullet>Career Portability (10%) — ease of pivoting to adjacent durable roles.</Bullet>
          <Bullet>Time-to-Impact Urgency (10%) — how soon major change is likely for your situation.</Bullet>
          <Text style={[styles.appendixText, { marginTop: 8 }]}>
            Task automatability ratings are recalibrated quarterly against current AI capabilities. Pivot-path salary data refreshes every six months.
          </Text>

          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerLabel}>DISCLAIMER</Text>
            <Text style={styles.disclaimerText}>
              This assessment is a model, not a prediction. It&apos;s designed to give you a clear-eyed view of your situation, not a precise forecast of your career outcome. It is informational only and is not a substitute for professional career advice.
            </Text>
          </View>

          <Text style={styles.legalLine}>
            <PdfLink src={`${APP_URL}/privacy`} style={styles.legalLink}>
              Privacy Policy
            </PdfLink>
            {"   ·   "}
            <PdfLink src={`${APP_URL}/terms`} style={styles.legalLink}>
              Terms of Service
            </PdfLink>
          </Text>
        </View>

        {/* Footer on every body page */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Take your own at ${hubDisplayUrl()}  ·  ${dateStr}  ·  Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

function PathFact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.pathFactCol}>
      <Text style={styles.pathFactLabel}>{label}</Text>
      <Text style={styles.pathFactValue}>{value}</Text>
    </View>
  );
}

function ActionEntry({
  label,
  action,
}: {
  label: string;
  action: { header: string; detail: string };
}) {
  return (
    <View style={styles.actionItem} wrap={false}>
      <Text style={styles.actionWeek}>{label}</Text>
      <Text style={styles.actionHeader}>{action.header}</Text>
      <Text style={styles.bodyText}>{action.detail}</Text>
    </View>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function provenanceText(p: PivotPath["provenance"]): string {
  switch (p) {
    case "established":
      return "Established";
    case "emerging":
      return "Emerging";
    case "forecast":
      return "Forecast";
  }
}

/** Standard download filename. */
export function pdfFilename(rolePlural: string, date: Date): string {
  const roleSlug = rolePlural.replace(/\s+/g, "-");
  const dateStr = date.toISOString().split("T")[0];
  return `AI-Job-Risk-Report-${roleSlug}-${dateStr}.pdf`;
}
