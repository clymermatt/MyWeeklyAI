const PING_URLS: Record<string, string | undefined> = {
  "weekly-digest": process.env.HEALTHCHECK_PING_URL_DIGEST,
  ingestion: process.env.HEALTHCHECK_PING_URL_INGEST,
};

export async function pingHealthCheck(jobName: string) {
  const url = PING_URLS[jobName];
  if (!url) return;

  try {
    await fetch(url, { method: "GET" });
  } catch (err) {
    console.error(
      `Health check ping failed for ${jobName}:`,
      err instanceof Error ? err.message : err,
    );
  }
}
