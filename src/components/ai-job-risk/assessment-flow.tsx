"use client";

/**
 * AI Job Risk assessment quiz — top-level flow orchestrator (spec Section 5).
 *
 * Walks the user through 5 sections (~14 questions), applies the conditional
 * branches from spec 5.7, then submits to /api/ai-job-risk/submit.
 *
 * Quiz progress save/resume (spec 5.9) is intentionally omitted — spec Section
 * 10 lists it as out of MVP scope. State is in-memory only.
 */

import { useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ACTIVE_LEARNING_OPTIONS,
  DECISION_STAKES_OPTIONS,
  DOMAIN_EXPERTISE_OPTIONS,
  EMPLOYER_ADOPTION_OPTIONS,
  HEADCOUNT_CHANGE_OPTIONS,
  MANAGER_CONVERSATION_OPTIONS,
  NOVEL_PROBLEMS_OPTIONS,
  RELATIONSHIP_OPTIONS,
  STRUCTURAL_CHANGE_OPTIONS,
  YEARS_EXPERIENCE_OPTIONS,
} from "@/lib/ai-job-risk/questions";
import { INDUSTRIES } from "@/lib/ai-job-risk/industries";
import type { QuizContent } from "@/lib/ai-job-risk/quiz-content";
import type { TaskTimeRange, UserResponses } from "@/lib/ai-job-risk/types";
import {
  OpenTextInput,
  SingleSelectButtons,
  SingleSelectDropdown,
  TaskTimeInput,
  ToolsInput,
  type ToolsValue,
} from "./quiz-inputs";

const SECTIONS = [
  { key: "A", name: "About you" },
  { key: "B", name: "Your work" },
  { key: "C", name: "Your environment" },
  { key: "D", name: "Your strengths" },
  { key: "E", name: "Looking ahead" },
] as const;

const HIGH_AR_THRESHOLD = 75;
const SUBSTANTIAL_TIME: TaskTimeRange[] = ["10-25", "25-50", "50+"];

interface QuizState {
  role: string;
  industry: string;
  yearsExperience: string;
  taskTimes: Record<string, TaskTimeRange>;
  employerAdoption: string;
  tools: ToolsValue;
  headcountChange: string;
  structuralChange: string;
  domainExpertise: string;
  decisionStakes: string;
  relationshipImportance: string;
  novelProblems: string;
  managerConversations: string;
  activeLearning: string;
  openTextWorry: string;
}

const EMPTY_STATE: QuizState = {
  role: "",
  industry: "",
  yearsExperience: "",
  taskTimes: {},
  employerAdoption: "",
  tools: { toolsUsed: [], customTools: [], noneSelected: false },
  headcountChange: "",
  structuralChange: "",
  domainExpertise: "",
  decisionStakes: "",
  relationshipImportance: "",
  novelProblems: "",
  managerConversations: "",
  activeLearning: "",
  openTextWorry: "",
};

function Question({
  title,
  help,
  children,
}: {
  title: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {help && <p className="mt-1 text-sm text-gray-500">{help}</p>}
      </div>
      {children}
    </div>
  );
}

export default function AssessmentFlow({ content }: { content: QuizContent }) {
  const router = useRouter();
  const startedAt = useRef(Date.now());
  const [sectionIndex, setSectionIndex] = useState(0);
  const [state, setState] = useState<QuizState>(EMPTY_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof QuizState>(key: K, value: QuizState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  // ─── Conditional branches (spec 5.7) ──────────────────────────────────────
  const roleTitle = content.roleTitles.find((t) => t.value === state.role);
  const isLeadership = Boolean(roleTitle?.isLeadership); // branch 1: skip D2
  const isJuniorICBranch =
    Boolean(roleTitle?.isJuniorIC) && state.yearsExperience === "0-2"; // branch 2: skip E1

  // Branch 3: tools = none AND ≥10% time on any task with AR ≥ 75.
  const showToolWarning = useMemo(() => {
    if (!state.tools.noneSelected) return false;
    return content.tasks.some(
      (t) =>
        t.automatabilityRating >= HIGH_AR_THRESHOLD &&
        SUBSTANTIAL_TIME.includes(state.taskTimes[t.id]),
    );
  }, [state.tools.noneSelected, state.taskTimes, content.tasks]);

  const reportedTaskCount = Object.values(state.taskTimes).filter(
    (r) => r && r !== "none",
  ).length;
  const toolsAnswered =
    state.tools.toolsUsed.length > 0 ||
    state.tools.customTools.length > 0 ||
    state.tools.noneSelected;

  // ─── Per-section validation ───────────────────────────────────────────────
  const sectionValid = (index: number): boolean => {
    switch (index) {
      case 0:
        return Boolean(state.role && state.industry && state.yearsExperience);
      case 1:
        return reportedTaskCount >= 3;
      case 2:
        return Boolean(
          state.employerAdoption &&
            toolsAnswered &&
            state.headcountChange &&
            state.structuralChange,
        );
      case 3:
        return Boolean(
          state.domainExpertise &&
            (isLeadership || state.decisionStakes) &&
            state.relationshipImportance &&
            state.novelProblems,
        );
      case 4:
        return Boolean(
          (isJuniorICBranch || state.managerConversations) && state.activeLearning,
        );
      default:
        return false;
    }
  };

  const buildResponses = (): UserResponses => ({
    role: state.role,
    industry: state.industry,
    yearsExperience: state.yearsExperience,
    taskTimes: state.taskTimes,
    employerAdoption: state.employerAdoption,
    toolsUsed: state.tools.toolsUsed,
    customTools: state.tools.customTools,
    headcountChange: state.headcountChange,
    structuralChange: state.structuralChange,
    domainExpertise: state.domainExpertise,
    // Branch 1: leadership roles skip D2 and are auto-assigned max stakes.
    decisionStakes: isLeadership ? "constant" : state.decisionStakes,
    relationshipImportance: state.relationshipImportance,
    novelProblems: state.novelProblems,
    // Branch 2: junior ICs skip E1 and are auto-assigned "no" (0 modifier).
    // Junior ICs generally aren't having those manager conversations, so a
    // zero contribution is the honest default (spec v1.0.2 correction to
    // v1.0's "middle value" language that pre-dated the modifier scale).
    managerConversations: isJuniorICBranch ? "no" : state.managerConversations,
    activeLearning: state.activeLearning,
    openTextWorry: state.openTextWorry.trim() || null,
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-job-risk/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: content.slug,
          responses: buildResponses(),
          completionTimeSeconds: Math.round((Date.now() - startedAt.current) / 1000),
        }),
      });
      if (!res.ok) throw new Error(`Submit failed (${res.status})`);
      const data: { resultId: string } = await res.json();
      router.push(`/ai-job-risk/${content.slug}/results/${data.resultId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  };

  const goNext = () => {
    if (sectionIndex < SECTIONS.length - 1) {
      setSectionIndex((i) => i + 1);
      window.scrollTo({ top: 0 });
    } else {
      void handleSubmit();
    }
  };

  if (submitting) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
        <p className="text-lg font-medium text-gray-700">
          Calculating your AI Disruption Score…
        </p>
      </div>
    );
  }

  const section = SECTIONS[sectionIndex];

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      {/* Page heading */}
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
          AI Job Risk Assessment
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
          {content.headline}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {content.pluralLabel} · about 5 minutes
        </p>
      </header>

      {/* Progress */}
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-purple-700">
          Section {sectionIndex + 1} of {SECTIONS.length}: {section.name}
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {SECTIONS.map((s, i) => (
            <div
              key={s.key}
              className={`h-1.5 flex-1 rounded-full ${
                i <= sectionIndex ? "bg-purple-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {sectionIndex === 0 && (
          <>
            <Question
              title="What's your current role?"
              help="Choose the option closest to your current title. We'll personalize your results based on this."
            >
              <SingleSelectDropdown
                ariaLabel="Current role"
                placeholder="Select your role"
                value={state.role}
                onChange={(v) => set("role", v)}
                options={content.roleTitles}
              />
            </Question>
            <Question title="What industry are you in?">
              <SingleSelectDropdown
                ariaLabel="Industry"
                placeholder="Select your industry"
                value={state.industry}
                onChange={(v) => set("industry", v)}
                options={INDUSTRIES.map((i) => ({ value: i.slug, label: i.label }))}
              />
            </Question>
            <Question
              title="How long have you been working in this field?"
              help="Total professional experience, including any related earlier roles."
            >
              <SingleSelectButtons
                ariaLabel="Years of experience"
                options={YEARS_EXPERIENCE_OPTIONS}
                value={state.yearsExperience}
                onChange={(v) => set("yearsExperience", v)}
              />
            </Question>
          </>
        )}

        {sectionIndex === 1 && (
          <Question
            title="How does your typical week break down?"
            help="Think about a normal recent week. Roughly how much time goes to each? Skip any that don't apply — but mark at least three."
          >
            <TaskTimeInput
              tasks={content.tasks}
              value={state.taskTimes}
              onChange={(v) => set("taskTimes", v)}
            />
            {reportedTaskCount > 0 && reportedTaskCount < 3 && (
              <p className="text-sm text-amber-600">
                Please indicate at least 3 tasks that take up some of your time.
              </p>
            )}
          </Question>
        )}

        {sectionIndex === 2 && (
          <>
            <Question
              title="How is your employer approaching AI tools right now?"
              help="Think about official policy and how leadership talks about AI, not just what your team does informally."
            >
              <SingleSelectButtons
                ariaLabel="Employer AI posture"
                options={EMPLOYER_ADOPTION_OPTIONS}
                value={state.employerAdoption}
                onChange={(v) => set("employerAdoption", v)}
              />
            </Question>
            <Question
              title="Which AI tools do you currently use in your work?"
              help="Select all that you've used in the past month."
            >
              <ToolsInput value={state.tools} onChange={(v) => set("tools", v)} />
              {showToolWarning && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  Heads up — your tasks include work that AI tools currently handle,
                  but you haven&apos;t used any. This will affect your score.
                </p>
              )}
            </Question>
            <Question
              title="Has your team's headcount changed in the last 12 months?"
              help="Think about your immediate team or function, not the whole company."
            >
              <SingleSelectButtons
                ariaLabel="Team headcount change"
                options={HEADCOUNT_CHANGE_OPTIONS}
                value={state.headcountChange}
                onChange={(v) => set("headcountChange", v)}
              />
            </Question>
            <Question title="In the last 6 months, has AI changed how your team is structured or how work is assigned?">
              <SingleSelectButtons
                ariaLabel="Structural change"
                options={STRUCTURAL_CHANGE_OPTIONS}
                value={state.structuralChange}
                onChange={(v) => set("structuralChange", v)}
              />
            </Question>
          </>
        )}

        {sectionIndex === 3 && (
          <>
            <p className="text-sm text-gray-500">
              These next questions help us understand what&apos;s unique about your
              work — the things that are hardest to replicate.
            </p>
            <Question
              title="How much of your value comes from deep expertise in a specific area?"
              help="Think about your most specialized knowledge — a specific technology, industry, regulated environment, or rare technical skill."
            >
              <SingleSelectButtons
                ariaLabel="Domain expertise depth"
                options={DOMAIN_EXPERTISE_OPTIONS}
                value={state.domainExpertise}
                onChange={(v) => set("domainExpertise", v)}
              />
            </Question>
            {!isLeadership && (
              <Question
                title="How often do you make decisions where being wrong has serious consequences?"
                help={content.decisionStakesHelp}
              >
                <SingleSelectButtons
                  ariaLabel="Decision stakes"
                  options={DECISION_STAKES_OPTIONS}
                  value={state.decisionStakes}
                  onChange={(v) => set("decisionStakes", v)}
                />
              </Question>
            )}
            <Question
              title="How important are relationships and trust to getting your work done?"
              help="Think about how much your work depends on trust with stakeholders, customers, or teammates."
            >
              <SingleSelectButtons
                ariaLabel="Relationship dependence"
                options={RELATIONSHIP_OPTIONS}
                value={state.relationshipImportance}
                onChange={(v) => set("relationshipImportance", v)}
              />
            </Question>
            <Question
              title="When you face a problem, how often is the solution something not already in documentation or prior examples?"
              help="Be honest. Most work involves applying known patterns — that's not a weakness, it's just relevant for this assessment."
            >
              <SingleSelectButtons
                ariaLabel="Novel problem frequency"
                options={NOVEL_PROBLEMS_OPTIONS}
                value={state.novelProblems}
                onChange={(v) => set("novelProblems", v)}
              />
            </Question>
          </>
        )}

        {sectionIndex === 4 && (
          <>
            {!isJuniorICBranch && (
              <Question title="In the last year, has your manager talked about how AI is changing your role or team?">
                <SingleSelectButtons
                  ariaLabel="Manager conversations"
                  options={MANAGER_CONVERSATION_OPTIONS}
                  value={state.managerConversations}
                  onChange={(v) => set("managerConversations", v)}
                />
              </Question>
            )}
            <Question title="Are you actively learning AI tools or skills outside of work?">
              <SingleSelectButtons
                ariaLabel="Active learning"
                options={ACTIVE_LEARNING_OPTIONS}
                value={state.activeLearning}
                onChange={(v) => set("activeLearning", v)}
              />
            </Question>
            <Question
              title="What's your biggest worry about AI and your career?"
              help="Optional. Skip if you'd rather not say — this won't affect your score."
            >
              <OpenTextInput
                value={state.openTextWorry}
                onChange={(v) => set("openTextWorry", v)}
              />
            </Question>
          </>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            setSectionIndex((i) => Math.max(0, i - 1));
            window.scrollTo({ top: 0 });
          }}
          disabled={sectionIndex === 0}
          className="rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:invisible"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!sectionValid(sectionIndex)}
          className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {sectionIndex === SECTIONS.length - 1 ? "See my score →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
