import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookmarks);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { url, title, summary, source, digestId } = body;

  if (!url || !title || !summary) {
    return NextResponse.json(
      { error: "url, title, and summary are required" },
      { status: 400 },
    );
  }

  const existing = await prisma.bookmark.findUnique({
    where: { userId_url: { userId: session.user.id, url } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false });
  }

  await prisma.bookmark.create({
    data: {
      userId: session.user.id,
      url,
      title,
      summary,
      source: source ?? null,
      digestId: digestId ?? null,
    },
  });

  return NextResponse.json({ bookmarked: true });
}
