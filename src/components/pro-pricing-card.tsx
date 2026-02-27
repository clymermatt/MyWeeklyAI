"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";

type Interval = "monthly" | "yearly";

export default function ProPricingCard({ children }: { children: ReactNode }) {
  const [interval, setInterval] = useState<Interval>("monthly");

  const price = interval === "monthly" ? "$2.99/mo" : "$29.99/yr";

  return (
    <div className="pro-card-glow rounded-lg border-2 border-purple-600 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <h3 className="text-lg font-bold text-gray-900">Pro</h3>

      {/* Interval toggle */}
      <div className="mt-3 inline-flex rounded-full border border-gray-200 p-0.5 text-sm">
        <button
          onClick={() => setInterval("monthly")}
          className={`rounded-full px-3.5 py-1 font-medium transition-colors ${
            interval === "monthly"
              ? "bg-purple-600 text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setInterval("yearly")}
          className={`rounded-full px-3.5 py-1 font-medium transition-colors ${
            interval === "yearly"
              ? "bg-purple-600 text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Yearly
        </button>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        {price} after 7-day free trial
      </p>
      {interval === "yearly" && (
        <p className="mt-1 text-xs font-medium text-green-600">
          Save ~$6/yr vs monthly
        </p>
      )}

      {/* Feature list passed as children */}
      {children}

      <div className="mt-8">
        <Link
          href={`/auth/signin?plan=pro&interval=${interval}`}
          className="block rounded-lg bg-purple-600 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-purple-600/25 transition-all hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-600/30"
        >
          Start Pro — 7 Days Free
        </Link>
      </div>
    </div>
  );
}
