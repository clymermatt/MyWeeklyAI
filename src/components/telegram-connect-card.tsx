"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Channel = "EMAIL" | "TELEGRAM" | "BOTH";

interface TelegramConnectCardProps {
  isConnected: boolean;
  currentChannel: Channel;
}

export default function TelegramConnectCard({
  isConnected: initialConnected,
  currentChannel: initialChannel,
}: TelegramConnectCardProps) {
  const [connected, setConnected] = useState(initialConnected);
  const [channel, setChannel] = useState<Channel>(initialChannel);
  const [selectedChannel, setSelectedChannel] = useState<Channel>(initialChannel);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const needsTelegram = (ch: Channel) => ch === "TELEGRAM" || ch === "BOTH";

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      const res = await fetch("/api/telegram/channel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: "BOTH" }),
      });
      if (res.ok) {
        setConnected(true);
        setDeepLink(null);
        stopPolling();
        // Webhook already set BOTH; if user wanted TELEGRAM specifically, update now
        setChannel((prev) => {
          // Use selectedChannel from closure won't work in state setter,
          // so we return BOTH and handle TELEGRAM in the effect below
          return "BOTH";
        });
        return true;
      }
    } catch {}
    return false;
  }, [stopPolling]);

  // After connection detected, if user wanted TELEGRAM specifically, update channel
  useEffect(() => {
    if (connected && selectedChannel === "TELEGRAM" && channel === "BOTH") {
      (async () => {
        try {
          const res = await fetch("/api/telegram/channel", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channel: "TELEGRAM" }),
          });
          if (res.ok) setChannel("TELEGRAM");
        } catch {}
      })();
    }
  }, [connected, selectedChannel, channel]);

  // Poll for connection + check on tab focus when deep link is shown
  useEffect(() => {
    if (!deepLink || connected) {
      stopPolling();
      return;
    }

    // Check when user returns to this tab (after opening Telegram)
    const onFocus = () => void checkConnection();
    window.addEventListener("focus", onFocus);

    // Backup poll every 5s
    pollRef.current = setInterval(() => void checkConnection(), 5000);

    return () => {
      window.removeEventListener("focus", onFocus);
      stopPolling();
    };
  }, [deepLink, connected, checkConnection, stopPolling]);

  // Cleanup on unmount
  useEffect(() => stopPolling, [stopPolling]);

  const handleToggle = async (opt: Channel) => {
    setError(null);
    setSelectedChannel(opt);

    if (opt === "EMAIL") {
      // Switch to email — no Telegram needed
      setDeepLink(null);
      stopPolling();
      if (channel !== "EMAIL") {
        try {
          const res = await fetch("/api/telegram/channel", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channel: "EMAIL" }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to update channel");
          setChannel("EMAIL");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setSelectedChannel(channel); // revert
        }
      }
      return;
    }

    // Telegram or Both selected
    if (connected) {
      // Already connected — update channel preference
      try {
        const res = await fetch("/api/telegram/channel", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channel: opt }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update channel");
        setChannel(opt);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setSelectedChannel(channel); // revert
      }
    } else if (!deepLink && !linkLoading) {
      // Not connected — generate deep link for connect flow
      setLinkLoading(true);
      try {
        const res = await fetch("/api/telegram/link", { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to generate link");
        setDeepLink(data.deepLink);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setSelectedChannel(channel); // revert
      } finally {
        setLinkLoading(false);
      }
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    setError(null);
    try {
      const res = await fetch("/api/telegram/link", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to disconnect");
      }
      setConnected(false);
      setChannel("EMAIL");
      setSelectedChannel("EMAIL");
      setDeepLink(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDisconnecting(false);
    }
  };

  const labels: Record<Channel, string> = {
    EMAIL: "Email Only",
    TELEGRAM: "Telegram Only",
    BOTH: "Both",
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-sm font-medium text-gray-500">Delivery Channel</h2>

      {/* Channel toggles — always visible */}
      <div className="mt-3 flex gap-1.5">
        {(["EMAIL", "TELEGRAM", "BOTH"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => handleToggle(opt)}
            disabled={linkLoading}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedChannel === opt
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } disabled:opacity-50`}
          >
            {labels[opt]}
          </button>
        ))}
      </div>

      {/* Connect flow — Telegram/Both selected but not connected */}
      {needsTelegram(selectedChannel) && !connected && (
        <div className="mt-4">
          {linkLoading ? (
            <p className="text-sm text-gray-500">Generating link…</p>
          ) : deepLink ? (
            <>
              <p className="text-sm text-gray-600">
                Connect your Telegram account to receive briefs
              </p>
              <a
                href={deepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block rounded-lg bg-[#2AABEE] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#229ED9] transition-colors"
              >
                Open in Telegram
              </a>
              <p className="mt-2 text-xs text-gray-500">
                Link expires in 15 minutes
              </p>
            </>
          ) : null}
        </div>
      )}

      {/* Connected indicator — Telegram/Both selected and connected */}
      {needsTelegram(selectedChannel) && connected && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-600">Connected</span>
          </div>
          <button
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            {disconnecting ? "Disconnecting…" : "Disconnect"}
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
