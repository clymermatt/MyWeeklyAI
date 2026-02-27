import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");
  const token = req.nextUrl.searchParams.get("token");

  if (!uid || !token) {
    return NextResponse.redirect(
      new URL("/unsubscribe?error=invalid", req.url),
    );
  }

  if (!verifyUnsubscribeToken(uid, token)) {
    return NextResponse.redirect(
      new URL("/unsubscribe?error=invalid", req.url),
    );
  }

  try {
    await prisma.user.update({
      where: { id: uid },
      data: { unsubscribedAt: new Date() },
    });
  } catch {
    return NextResponse.redirect(
      new URL("/unsubscribe?error=not-found", req.url),
    );
  }

  return NextResponse.redirect(new URL("/unsubscribe?success=true", req.url));
}
