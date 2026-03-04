"use client";

import { useFormStatus } from "react-dom";

export default function SendBriefButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs text-purple-600 hover:text-purple-700 disabled:text-gray-400"
    >
      {pending ? "Sending…" : "Send brief"}
    </button>
  );
}
