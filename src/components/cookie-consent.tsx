"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-4 shadow-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          We use essential cookies to keep you signed in and analytics cookies to improve the
          service. By continuing to use this site, you agree to our{" "}
          <Link href="/privacy" className="text-purple-600 underline">
            Privacy Policy
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-lg bg-purple-600 px-5 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
