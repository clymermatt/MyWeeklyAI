"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface MobileNavProps {
  isAuthenticated: boolean;
  userName?: string;
  plan?: "Free" | "Pro";
  isAdmin?: boolean;
}

const navLinks = [
  { href: "/dashboard", label: "My Dashboard" },
  { href: "/dashboard/briefings", label: "My Briefings" },
  { href: "/dashboard/saved", label: "Saved Articles" },
];

export default function MobileNav({
  isAuthenticated,
  userName,
  plan,
  isAdmin,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-600 hover:text-gray-900"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-16 border-b border-gray-200 bg-white shadow-lg">
          <div className="mx-auto max-w-5xl px-4 py-3">
            {isAuthenticated && userName && (
              <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-600">Hi, {userName}</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                    plan === "Pro"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {plan}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin/jobs"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  Admin
                </Link>
              )}
            </div>
            {!isAuthenticated && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <Link
                  href="/auth/signin"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-purple-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
