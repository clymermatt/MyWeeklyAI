const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

const MAX_LENGTH = 4096;

/** Split text into chunks at double-newline boundaries without exceeding MAX_LENGTH */
function splitMessage(text: string): string[] {
  if (text.length <= MAX_LENGTH) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= MAX_LENGTH) {
      chunks.push(remaining);
      break;
    }

    // Find the last double-newline within the limit
    let splitAt = remaining.lastIndexOf("\n\n", MAX_LENGTH);
    if (splitAt <= 0) {
      // Fall back to single newline
      splitAt = remaining.lastIndexOf("\n", MAX_LENGTH);
    }
    if (splitAt <= 0) {
      // Hard split as last resort
      splitAt = MAX_LENGTH;
    }

    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).replace(/^\n+/, "");
  }

  return chunks;
}

export async function sendTelegramMessage(chatId: string, text: string) {
  const chunks = splitMessage(text);

  let lastResult;
  for (const chunk of chunks) {
    const res = await fetch(`${API_BASE}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: chunk,
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Telegram API error ${res.status}: ${body}`);
    }

    lastResult = await res.json();
  }

  return lastResult;
}

export async function setWebhook(url: string) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const res = await fetch(`${API_BASE}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      secret_token: secret,
      allowed_updates: ["message"],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to set webhook: ${body}`);
  }

  return res.json();
}
