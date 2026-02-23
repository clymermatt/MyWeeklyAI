import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

function escMd(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
}

export async function POST(req: Request) {
  // Validate webhook secret
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const message = body.message;
  if (!message?.text || !message?.chat?.id) {
    return NextResponse.json({ ok: true });
  }

  const chatId = String(message.chat.id);
  const text = message.text.trim();

  // Handle /start <token>
  if (text.startsWith("/start")) {
    const token = text.split(" ")[1];
    if (!token) {
      await sendTelegramMessage(
        chatId,
        escMd("Please use the link from your dashboard to connect your account."),
      );
      return NextResponse.json({ ok: true });
    }

    const user = await prisma.user.findUnique({
      where: { telegramLinkToken: token },
    });

    if (!user) {
      await sendTelegramMessage(
        chatId,
        escMd("Invalid or expired link token. Please generate a new one from your dashboard."),
      );
      return NextResponse.json({ ok: true });
    }

    if (user.telegramLinkExpires && user.telegramLinkExpires < new Date()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { telegramLinkToken: null, telegramLinkExpires: null },
      });
      await sendTelegramMessage(
        chatId,
        escMd("This link has expired. Please generate a new one from your dashboard."),
      );
      return NextResponse.json({ ok: true });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        telegramChatId: chatId,
        telegramLinkToken: null,
        telegramLinkExpires: null,
        deliveryChannel: "BOTH",
      },
    });

    await sendTelegramMessage(
      chatId,
      escMd("Your Telegram account is now connected! You'll receive your weekly AI briefs here.\n\nSend /stop to disconnect."),
    );
    return NextResponse.json({ ok: true });
  }

  // Handle /stop
  if (text === "/stop") {
    const user = await prisma.user.findUnique({
      where: { telegramChatId: chatId },
    });

    if (!user) {
      await sendTelegramMessage(
        chatId,
        escMd("No account is linked to this chat."),
      );
      return NextResponse.json({ ok: true });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        telegramChatId: null,
        deliveryChannel: "EMAIL",
      },
    });

    await sendTelegramMessage(
      chatId,
      escMd("Your account has been disconnected. Briefs will be sent to your email only.\n\nTo reconnect, use the link from your dashboard."),
    );
    return NextResponse.json({ ok: true });
  }

  // Unknown command
  await sendTelegramMessage(
    chatId,
    escMd("Available commands:\n/stop - Disconnect your account"),
  );
  return NextResponse.json({ ok: true });
}
