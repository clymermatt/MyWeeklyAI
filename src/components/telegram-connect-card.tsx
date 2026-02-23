"use client";

import { useState } from "react";

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
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/telegram/link", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate link");
      setDeepLink(data.deepLink);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/telegram/link", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to disconnect");
      }
      setConnected(false);
      setChannel("EMAIL");
      setDeepLink(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChannelChange = async (newChannel: Channel) => {
    setError(null);
    try {
      const res = await fetch("/api/telegram/channel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: newChannel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update channel");
      setChannel(newChannel);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-sm font-medium text-gray-500">Delivery Channel</h2>

      {connected ? (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            <p className="text-lg font-semibold text-green-600">
              Telegram Connected
            </p>
          </div>

          <div className="mt-3 flex gap-1.5">
            {(["EMAIL", "TELEGRAM", "BOTH"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => handleChannelChange(opt)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  channel === opt
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {opt === "EMAIL"
                  ? "Email Only"
                  : opt === "TELEGRAM"
                    ? "Telegram Only"
                    : "Both"}
              </button>
            ))}
          </div>

          <button
            onClick={handleDisconnect}
            disabled={loading}
            className="mt-3 text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
          >
            {loading ? "Disconnecting..." : "Disconnect Telegram"}
          </button>
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-lg font-semibold text-gray-400">Not connected</p>
          <p className="mt-1 text-sm text-gray-600">
            Get your weekly briefs delivered straight to Telegram.
          </p>

          {deepLink ? (
            <div className="mt-3">
              <a
                href={deepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-[#2AABEE] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#229ED9] transition-colors"
              >
                Open in Telegram
              </a>
              <p className="mt-2 text-xs text-gray-500">
                Link expires in 15 minutes
              </p>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="mt-4 inline-block rounded-lg bg-[#2AABEE] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#229ED9] transition-colors disabled:opacity-50"
            >
              {loading ? "Generating link..." : "Connect Telegram"}
            </button>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
