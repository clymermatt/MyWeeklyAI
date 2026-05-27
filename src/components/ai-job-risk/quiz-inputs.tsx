"use client";

/**
 * Reusable input components for the AI Job Risk assessment quiz (spec 5.13).
 * Mobile-first: 44px minimum tap targets, no hover-only affordances, selected
 * state never signalled by colour alone.
 */

import { useState } from "react";
import {
  AI_TOOLS,
  TASK_TIME_MIDPOINTS,
  TASK_TIME_OPTIONS,
  type Option,
} from "@/lib/ai-job-risk/questions";
import type { TaskTimeRange } from "@/lib/ai-job-risk/types";

// ─── Single-select buttons ───────────────────────────────────────────────────

export function SingleSelectButtons({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: Option[];
  value: string | null | undefined;
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="space-y-2">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            // Safari/WebKit bug: `display:flex` directly on <button> can swallow
            // click events on nested elements. Keep the button block-level and
            // put the flex on an inner wrapper span instead.
            className={`block min-h-[44px] w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
              selected
                ? "border-purple-500 bg-purple-50 ring-1 ring-purple-500"
                : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
          >
            <span className="flex items-start gap-3 pointer-events-none">
              <span
                aria-hidden
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  selected ? "border-purple-600 bg-purple-600" : "border-gray-400"
                }`}
              >
                {selected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <span>
                <span className="font-medium text-gray-900">{opt.label}</span>
                {opt.description && (
                  <span className="mt-0.5 block text-gray-500">{opt.description}</span>
                )}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Single-select dropdown ──────────────────────────────────────────────────

export function SingleSelectDropdown({
  options,
  value,
  onChange,
  placeholder,
  ariaLabel,
}: {
  options: { value: string; label: string }[];
  value: string | null | undefined;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ─── Tools multi-select (question C2) ────────────────────────────────────────

export interface ToolsValue {
  toolsUsed: string[];
  customTools: string[];
  noneSelected: boolean;
}

export function ToolsInput({
  value,
  onChange,
}: {
  value: ToolsValue;
  onChange: (next: ToolsValue) => void;
}) {
  const [showOther, setShowOther] = useState(value.customTools.length > 0);
  const [draft, setDraft] = useState("");

  const toggleTool = (id: string) => {
    const has = value.toolsUsed.includes(id);
    onChange({
      ...value,
      noneSelected: false,
      toolsUsed: has
        ? value.toolsUsed.filter((t) => t !== id)
        : [...value.toolsUsed, id],
    });
  };

  const selectNone = () => {
    setShowOther(false);
    onChange({ toolsUsed: [], customTools: [], noneSelected: true });
  };

  const addCustom = () => {
    const name = draft.trim();
    if (!name || value.customTools.includes(name)) return;
    onChange({ ...value, noneSelected: false, customTools: [...value.customTools, name] });
    setDraft("");
  };

  const chip = (selected: boolean) =>
    `min-h-[44px] rounded-full border px-4 py-2 text-sm transition-colors ${
      selected
        ? "border-purple-500 bg-purple-600 text-white"
        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {AI_TOOLS.map((tool) => (
          <button
            key={tool.value}
            type="button"
            aria-pressed={value.toolsUsed.includes(tool.value)}
            onClick={() => toggleTool(tool.value)}
            className={chip(value.toolsUsed.includes(tool.value))}
          >
            {tool.label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={showOther}
          onClick={() => setShowOther((s) => !s)}
          className={chip(showOther && value.customTools.length > 0)}
        >
          Other
        </button>
        <button
          type="button"
          aria-pressed={value.noneSelected}
          onClick={selectNone}
          className={chip(value.noneSelected)}
        >
          None of these
        </button>
      </div>

      {showOther && (
        <div className="space-y-2">
          {value.customTools.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {value.customTools.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...value,
                      customTools: value.customTools.filter((t) => t !== name),
                    })
                  }
                  className="min-h-[44px] rounded-full border border-purple-500 bg-purple-600 px-4 py-2 text-sm text-white"
                >
                  {name} ✕
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustom();
                }
              }}
              placeholder="Type a tool name"
              className="min-h-[44px] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={addCustom}
              className="min-h-[44px] rounded-lg bg-purple-600 px-4 text-sm font-medium text-white hover:bg-purple-700"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Task time grid (question B1) ────────────────────────────────────────────

export function TaskTimeInput({
  tasks,
  value,
  onChange,
}: {
  tasks: { id: string; name: string }[];
  value: Record<string, TaskTimeRange>;
  onChange: (next: Record<string, TaskTimeRange>) => void;
}) {
  const total = Object.values(value).reduce(
    (sum, range) => sum + (TASK_TIME_MIDPOINTS[range] ?? 0),
    0,
  );

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id}>
          <p className="mb-1.5 text-sm font-medium text-gray-900">{task.name}</p>
          <div role="radiogroup" aria-label={task.name} className="grid grid-cols-5 gap-1.5">
            {TASK_TIME_OPTIONS.map((opt) => {
              const selected = value[task.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange({ ...value, [task.id]: opt.value })}
                  className={`min-h-[44px] rounded-md border px-1 text-xs font-medium transition-colors ${
                    selected
                      ? "border-purple-500 bg-purple-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-sm text-gray-500">
        Time accounted for:{" "}
        <span className="font-semibold text-gray-700">{Math.round(total)}%</span>
        <span className="text-gray-400">
          {" "}
          — no need to hit 100%; we use the relative split.
        </span>
      </p>
    </div>
  );
}

// ─── Open text (question E3) ─────────────────────────────────────────────────

export function OpenTextInput({
  value,
  onChange,
  maxLength = 500,
}: {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        rows={4}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        placeholder="Optional — this won't affect your score."
      />
      <p className="mt-1 text-right text-xs text-gray-400">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}
