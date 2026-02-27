"use client";

import { useState } from "react";
import SubscriptionButton from "@/components/subscription-button";

export default function DashboardUpgradeCard({ variant = "primary" }: { variant?: "primary" | "outline" }) {
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");

  return (
    <div>
      <div className="mb-3 inline-flex rounded-full border border-gray-200 p-0.5 text-xs">
        <button
          onClick={() => setInterval("monthly")}
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            interval === "monthly"
              ? "bg-purple-600 text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          $2.99/mo
        </button>
        <button
          onClick={() => setInterval("yearly")}
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            interval === "yearly"
              ? "bg-purple-600 text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          $29.99/yr
        </button>
      </div>
      {interval === "yearly" && (
        <p className="mb-2 text-xs font-medium text-green-600">Save ~$6/yr vs monthly</p>
      )}
      <SubscriptionButton variant={variant} interval={interval} />
    </div>
  );
}
