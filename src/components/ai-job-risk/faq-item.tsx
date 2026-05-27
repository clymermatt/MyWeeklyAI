"use client";

/**
 * Client-controlled FAQ accordion. Replaces a native <details>/<summary> pair
 * because Safari/macOS leaves a sliver of the hidden content visible when the
 * summary uses display:flex. Keeping React state makes visibility deterministic.
 */

import { useState } from "react";

export default function FAQItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="p-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between text-left text-sm font-medium text-gray-900"
      >
        <span>{question}</span>
        <span
          aria-hidden
          className={`select-none text-lg leading-none text-gray-400 transition-transform ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{answer}</p>
      )}
    </div>
  );
}
