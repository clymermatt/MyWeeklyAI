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

const INDUSTRIES = [
  "SaaS / Software",
  "Fintech / Financial Services",
  "Healthcare / Life Sciences",
  "E-commerce / Retail",
  "Education / EdTech",
  "Media / Entertainment",
  "Marketing / Advertising",
  "Consulting / Professional Services",
  "Manufacturing / Industrial",
  "Real Estate / PropTech",
  "Legal / LegalTech",
  "Government / Public Sector",
  "Nonprofit / Social Impact",
  "Cybersecurity",
  "Gaming",
  "Telecommunications",
  "Energy / CleanTech",
  "Transportation / Logistics",
];

const ROLES = [
  "Software Engineer",
  "Product Manager",
  "UX / Product Designer",
  "Data Scientist / ML Engineer",
  "Engineering Manager",
  "CTO / VP Engineering",
  "CEO / Founder",
  "Marketing Manager",
  "Content Strategist",
  "Sales / Revenue",
  "DevOps / Platform Engineer",
  "Research Scientist",
  "Business Analyst",
  "Project Manager",
  "Customer Success",
  "Solutions Architect",
  "Consultant",
  "Student / Researcher",
];

const GOALS = [
  "Stay current on AI trends",
  "Automate repetitive workflows",
  "Build AI-powered products",
  "Improve team productivity with AI",
  "Learn prompt engineering",
  "Evaluate AI tools for my team",
  "Integrate AI into existing products",
  "Understand AI strategy & business impact",
  "Explore AI for content creation",
  "Keep up with AI research & papers",
  "Find AI use cases for my industry",
  "Reduce costs with AI automation",
];

const TOOLS = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Copilot",
  "Cursor",
  "Midjourney",
  "DALL-E",
  "Stable Diffusion",
  "Notion AI",
  "Jasper",
  "Perplexity",
  "Replit",
  "Hugging Face",
  "LangChain",
  "Vercel AI SDK",
  "AWS Bedrock",
  "Azure OpenAI",
  "Google Vertex AI",
];

const FOCUS_TOPICS = [
  "LLMs & foundation models",
  "AI agents & autonomy",
  "Code generation",
  "RAG & knowledge retrieval",
  "Prompt engineering",
  "AI product design & UX",
  "Computer vision",
  "Voice & speech AI",
  "AI regulation & policy",
  "AI safety & alignment",
  "Open source AI",
  "AI infrastructure & MLOps",
  "AI in healthcare",
  "AI in finance",
  "AI in education",
  "Robotics & embodied AI",
];

const AVOID_TOPICS = [
  "Crypto / Web3",
  "NFTs",
  "AI art controversy",
  "AI doomerism",
  "Celebrity AI news",
  "AI in military / weapons",
  "AI stock trading tips",
];

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </label>
      {value ? (
        <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
          <span className="flex-1 text-sm text-gray-900">{value}</span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
      ) : (
        <select
          value=""
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

function TagInput({
  label,
  value,
  onChange,
  placeholder,
  suggestions,
}: {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
  suggestions?: string[];
}) {
  const [input, setInput] = useState("");

  const addTag = (tag?: string) => {
    const t = (tag ?? input).trim();
    if (t && !value.includes(t)) {
      onChange([...value, t]);
      setInput("");
    }
  };

  const unusedSuggestions = suggestions?.filter((s) => !value.includes(s));

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
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
      {unusedSuggestions && unusedSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {unusedSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
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
          onClick={() => addTag()}
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
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/context-profile");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          const tools = data.tools ?? [];
          const focusTopics = data.focusTopics ?? [];
          const avoidTopics = data.avoidTopics ?? [];
          setProfile({
            roleTitle: data.roleTitle ?? "",
            industry: data.industry ?? "",
            goals: data.goals ?? [],
            tools,
            workflows: data.workflows ?? "",
            experienceLevel: data.experienceLevel ?? "",
            focusTopics,
            avoidTopics,
          });
          if (tools.length > 0 || focusTopics.length > 0 || avoidTopics.length > 0) {
            setAdvancedOpen(true);
          }
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
      <p className="text-xs text-gray-400">* Required fields</p>

      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          label="Role / Title *"
          value={profile.roleTitle}
          onChange={(roleTitle) => setProfile({ ...profile, roleTitle })}
          options={ROLES}
          placeholder="Select your role..."
        />
        <SelectField
          label="Industry *"
          value={profile.industry}
          onChange={(industry) => setProfile({ ...profile, industry })}
          options={INDUSTRIES}
          placeholder="Select your industry..."
        />
      </div>

      <TagInput
        label="Goals *"
        value={profile.goals}
        onChange={(goals) => setProfile({ ...profile, goals })}
        placeholder="Or type your own..."
        suggestions={GOALS}
      />

      {/* Advanced filtering — accordion */}
      <div className="rounded-lg border border-gray-200">
        <button
          type="button"
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <div>
            <span className="text-sm font-medium text-gray-700">
              Advanced filtering
            </span>
            <span className="ml-2 text-xs text-gray-400">
              Fine-tune your weekly brief with specific tools, topics, and filters
            </span>
          </div>
          <span className="text-gray-400">{advancedOpen ? "−" : "+"}</span>
        </button>
        {advancedOpen && (
          <div className="space-y-6 border-t border-gray-100 px-4 py-4">
            <TagInput
              label="Tools & Platforms"
              value={profile.tools}
              onChange={(tools) => setProfile({ ...profile, tools })}
              placeholder="Or type your own..."
              suggestions={TOOLS}
            />

            <TagInput
              label="Focus Topics"
              value={profile.focusTopics}
              onChange={(focusTopics) =>
                setProfile({ ...profile, focusTopics })
              }
              placeholder="Or type your own..."
              suggestions={FOCUS_TOPICS}
            />

            <TagInput
              label="Topics to Avoid"
              value={profile.avoidTopics}
              onChange={(avoidTopics) =>
                setProfile({ ...profile, avoidTopics })
              }
              placeholder="Or type your own..."
              suggestions={AVOID_TOPICS}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || !profile.roleTitle || !profile.industry || profile.goals.length === 0}
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
