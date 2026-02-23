import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_CHANNELS = ["EMAIL", "TELEGRAM", "BOTH"] as const;

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { channel } = await req.json();

  if (!VALID_CHANNELS.includes(channel)) {
    return NextResponse.json(
      { error: "Invalid channel. Must be EMAIL, TELEGRAM, or BOTH." },
      { status: 400 },
    );
  }

  if (channel === "TELEGRAM" || channel === "BOTH") {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { telegramChatId: true },
    });

    if (!user.telegramChatId) {
      return NextResponse.json(
        { error: "Connect Telegram first before selecting this channel." },
        { status: 400 },
      );
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { deliveryChannel: channel },
  });

  return NextResponse.json({ channel });
}
