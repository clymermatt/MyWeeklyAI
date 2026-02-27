"use client";

import { useState } from "react";

export default function SubscriptionButton({
  variant = "primary",
  interval = "monthly",
}: {
  variant?: "primary" | "outline";
  interval?: "monthly" | "yearly";
}) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`rounded-lg px-6 py-2.5 text-sm font-medium disabled:opacity-50 transition-colors ${
        variant === "outline"
          ? "border border-purple-600 text-purple-600 hover:bg-purple-50"
          : "bg-purple-600 text-white hover:bg-purple-700"
      }`}
    >
      {loading ? "Loading..." : "Try Pro for 7 Days Free"}
    </button>
  );
}
