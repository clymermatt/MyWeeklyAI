"use client";

import { useState, useEffect, useCallback } from "react";

interface ProfileData {
  roleTitle: string;
  industry: string;
  goals: string[];
  tools: string[];
  workflows: string;
  experienceLevel: string;
  focusTopics: string[];
  avoidTopics: string[];
}

const EXPERIENCE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

function TagInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
      setInput("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 flex flex-wrap gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="text-blue-400 hover:text-blue-600"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={addTag}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function ContextProfileForm() {
  const [profile, setProfile] = useState<ProfileData>({
    roleTitle: "",
    industry: "",
    goals: [],
    tools: [],
    workflows: "",
    experienceLevel: "",
    focusTopics: [],
    avoidTopics: [],
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/context-profile");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setProfile({
            roleTitle: data.roleTitle ?? "",
            industry: data.industry ?? "",
            goals: data.goals ?? [],
            tools: data.tools ?? [],
            workflows: data.workflows ?? "",
            experienceLevel: data.experienceLevel ?? "",
            focusTopics: data.focusTopics ?? [],
            avoidTopics: data.avoidTopics ?? [],
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/context-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role / Title
          </label>
          <input
            type="text"
            value={profile.roleTitle}
            onChange={(e) =>
              setProfile({ ...profile, roleTitle: e.target.value })
            }
            placeholder="e.g. Product Manager, ML Engineer"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Industry
          </label>
          <input
            type="text"
            value={profile.industry}
            onChange={(e) =>
              setProfile({ ...profile, industry: e.target.value })
            }
            placeholder="e.g. Healthcare, Fintech, SaaS"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Experience Level
        </label>
        <select
          value={profile.experienceLevel}
          onChange={(e) =>
            setProfile({ ...profile, experienceLevel: e.target.value })
          }
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select level...</option>
          {EXPERIENCE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <TagInput
        label="Goals"
        value={profile.goals}
        onChange={(goals) => setProfile({ ...profile, goals })}
        placeholder="e.g. Automate workflows, Stay current on LLMs"
      />

      <TagInput
        label="Tools & Platforms"
        value={profile.tools}
        onChange={(tools) => setProfile({ ...profile, tools })}
        placeholder="e.g. ChatGPT, Cursor, Midjourney"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Workflows & Use Cases
        </label>
        <textarea
          value={profile.workflows}
          onChange={(e) =>
            setProfile({ ...profile, workflows: e.target.value })
          }
          rows={3}
          placeholder="Describe how you currently use AI in your work..."
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <TagInput
        label="Focus Topics"
        value={profile.focusTopics}
        onChange={(focusTopics) => setProfile({ ...profile, focusTopics })}
        placeholder="e.g. Agent frameworks, Code generation, RAG"
      />

      <TagInput
        label="Topics to Avoid"
        value={profile.avoidTopics}
        onChange={(avoidTopics) => setProfile({ ...profile, avoidTopics })}
        placeholder="e.g. Crypto, NFTs"
      />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        {status === "saved" && (
          <span className="text-sm text-green-600">Profile saved!</span>
        )}
        {status === "error" && (
          <span className="text-sm text-red-600">
            Failed to save. Please try again.
          </span>
        )}
      </div>
    </form>
  );
}
