/**
 * The 7-section authed report (spec Section 6). Server component — receives
 * pre-generated content and renders it; no client interactivity yet.
 *
 * Deterministic content (scores, tier description, pivot-path metadata) comes
 * from the role config / score result; narrative content (opening, factor
 * explanations, task analyses, "why this fits you", action plan, progress
 * line) comes from the ReportContent passed in.
 */

import { factorQualitativeLabel, getTier, taskStatusLabel } from "@/lib/ai-job-risk/tiers";
import type {
  PivotPath,
  ReportContent,
  RiskTierKey,
  SelectedPivotPath,
  TaskDefinition,
} from "@/lib/ai-job-risk/types";

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
  higherIsBetter: boolean;
}

const FACTOR_ROWS: FactorRow[] = [
  { key: "taskAutomatability", contentKey: "taskAutomatability", label: "Task Automatability", higherIsBetter: false },
  { key: "adoptionVelocity", contentKey: "adoptionVelocity", label: "Adoption Velocity", higherIsBetter: false },
  { key: "skillDifferentiationRaw", contentKey: "skillDifferentiation", label: "Skill Differentiation", higherIsBetter: true },
  { key: "careerPortabilityRaw", contentKey: "careerPortability", label: "Career Portability", higherIsBetter: true },
  { key: "timeToImpactUrgency", contentKey: "timeToImpactUrgency", label: "Time-to-Impact Urgency", higherIsBetter: false },
];

export interface FullReportProps {
  resultId: string;
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
}

export default function FullReport({
  resultId,
  compositeScore,
  tier,
  factorBreakdown,
  selectedPivots,
  pivotPaths,
  taskLibrary,
  rolePlural,
  report,
}: FullReportProps) {
  const tierDef = getTier(tier);
  const sections = report.sections;
  const pathById = new Map(pivotPaths.map((p) => [p.id, p]));
  const taskById = new Map(taskLibrary.map((t) => [t.id, t]));

  return (
    <>
      {/* Section 1 — Headline Score */}
      <section className="mb-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-bold tracking-tight text-purple-700">
            {compositeScore}
          </span>
          <span className="text-base text-gray-400">/ 100</span>
        </div>
        <p className="mt-2 text-sm font-semibold text-gray-900">
          Risk Tier: {tierDef.label}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {tierDef.description}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-gray-700">
          {sections.openingSummary}
        </p>
      </section>

      {/* Section 2 — Score Breakdown */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Score breakdown</h2>
        <p className="mt-1 text-sm text-gray-500">
          Higher is better for Skill Differentiation and Career Portability;
          higher is more concerning for the other three.
        </p>
        <div className="mt-4 space-y-5">
          {FACTOR_ROWS.map((row) => {
            const score = factorBreakdown[row.key];
            return (
              <div key={row.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium text-gray-900">{row.label}</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {score} / 100{" "}
                    <span className="text-gray-400">
                      ({factorQualitativeLabel(score)})
                    </span>
                  </p>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {sections.factorExplanations[row.contentKey]}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3 — Task-by-task analysis */}
      {sections.taskAnalyses.length > 0 && (
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Task-by-task analysis
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            What&apos;s happening to each part of your week, sorted by how much
            time you reported on it.
          </p>
          <div className="mt-4 space-y-5">
            {sections.taskAnalyses.map((ta) => {
              const def = taskById.get(ta.taskId);
              const ar = def?.automatabilityRating ?? 0;
              return (
                <div key={ta.taskId}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {ta.taskName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ta.timePercent}% of your time
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-purple-600">
                    {taskStatusLabel(ar)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {ta.analysis}
                  </p>
                  {def?.whatsLeftForHumans && (
                    <p className="mt-2 text-xs italic text-gray-500">
                      <span className="font-medium not-italic text-gray-600">
                        What&apos;s left for humans:
                      </span>{" "}
                      {def.whatsLeftForHumans}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Section 4 — Top 3 Pivot Paths */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Your top 3 pivot paths
        </h2>
        <div className="mt-4 space-y-7">
          {selectedPivots.map((sel, i) => {
            const path = pathById.get(sel.pathId);
            if (!path) return null;
            const fit = sections.pivotPathFits[sel.pathId];
            return (
              <div key={sel.pathId}>
                <p className="text-sm font-semibold text-purple-700">
                  {i + 1}. {path.name}{" "}
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    {provenanceBadge(path.provenance)}
                  </span>
                </p>
                {fit && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    <span className="font-medium text-gray-900">Why this fits you:</span>{" "}
                    {fit}
                  </p>
                )}
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  <span className="font-medium text-gray-900">What it looks like:</span>{" "}
                  {path.dayToDay}
                </p>
                <dl className="mt-3 grid gap-x-4 gap-y-1 text-xs text-gray-500 sm:grid-cols-2">
                  <PathFact label="Required experience" value={path.requiredExperience} />
                  <PathFact label="Salary range" value={path.salaryRange} />
                  <PathFact label="Timeline to pivot" value={path.timeline} />
                  <PathFact label="Skill gaps to close" value={path.skillGaps} />
                </dl>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 5 — 30-day Action Plan */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Your 30-day action plan
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Three concrete moves you can make in the next month.
        </p>
        <div className="mt-4 space-y-5">
          <ActionItem label="Week 1" action={sections.actionPlan.action1} />
          <ActionItem label="Weeks 2-3" action={sections.actionPlan.action2} />
          <ActionItem label="Week 4" action={sections.actionPlan.action3} />
        </div>
      </section>

      {/* Section 6 — Progress Tracking */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Your score isn&apos;t fixed
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Specific actions can lower it meaningfully over 6-12 months:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
          <li>Moving into a less-exposed adjacent role lowers Task Automatability.</li>
          <li>Building stakeholder relationships increases Skill Differentiation.</li>
          <li>Developing specialized expertise increases Career Portability.</li>
          <li>Becoming the AI go-to person on your team increases your durability.</li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-gray-800">
          {sections.progressLine}
        </p>
      </section>

      {/* Section 7 — What's Next */}
      <section className="mb-6 rounded-2xl border border-purple-100 bg-purple-50/40 p-6 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">
          ✓ You&apos;re subscribed to the My Weekly AI brief for {rolePlural}.
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Your first issue arrives Sunday. We&apos;ve personalized it from your
          assessment — role, industry, tools, and topics are already set.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/dashboard"
            className="rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
          >
            Go to your dashboard →
          </a>
          <a
            href={`/api/ai-job-risk/pdf/${resultId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Download PDF
          </a>
          <a
            href="/dashboard/profile"
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Customize your briefing
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Tip: take this assessment again in about 6 months to see how your
          situation has evolved.
        </p>
      </section>
    </>
  );
}

function PathFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-gray-600">{label}</dt>
      <dd className="leading-relaxed text-gray-500">{value}</dd>
    </div>
  );
}

function ActionItem({
  label,
  action,
}: {
  label: string;
  action: { header: string; detail: string };
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{action.header}</p>
      <p className="mt-1 text-sm leading-relaxed text-gray-600">{action.detail}</p>
    </div>
  );
}

function provenanceBadge(p: PivotPath["provenance"]): string {
  switch (p) {
    case "established":
      return "🟢 Established";
    case "emerging":
      return "🟡 Emerging";
    case "forecast":
      return "🟠 Forecast";
  }
}
