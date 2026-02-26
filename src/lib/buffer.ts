const BUFFER_API_BASE = "https://api.bufferapp.com/1";

function getAccessToken(): string {
  const token = process.env.BUFFER_ACCESS_TOKEN;
  if (!token) throw new Error("BUFFER_ACCESS_TOKEN not configured");
  return token;
}

export function getProfileId(platform: "LINKEDIN" | "TWITTER"): string {
  const envKey =
    platform === "LINKEDIN"
      ? "BUFFER_LINKEDIN_PROFILE_ID"
      : "BUFFER_TWITTER_PROFILE_ID";
  const id = process.env[envKey];
  if (!id) throw new Error(`${envKey} not configured`);
  return id;
}

export async function createBufferPost({
  profileId,
  text,
  scheduledAt,
}: {
  profileId: string;
  text: string;
  scheduledAt: Date;
}): Promise<{ id: string; success: boolean }> {
  const params = new URLSearchParams({
    access_token: getAccessToken(),
    text,
    "profile_ids[]": profileId,
    scheduled_at: scheduledAt.toISOString(),
  });

  const res = await fetch(`${BUFFER_API_BASE}/updates/create.json`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Buffer API error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as { success: boolean; updates?: { id: string }[] };
  return {
    id: data.updates?.[0]?.id || "",
    success: data.success,
  };
}
