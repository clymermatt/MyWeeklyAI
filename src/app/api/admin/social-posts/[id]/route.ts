import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await req.json()) as {
    content?: string;
    hashtags?: string[];
    status?: string;
  };

  const data: Record<string, unknown> = {};
  if (body.content !== undefined) data.content = body.content;
  if (body.hashtags !== undefined) data.hashtags = body.hashtags;
  if (body.status !== undefined) data.status = body.status;

  const post = await prisma.socialPost.update({
    where: { id },
    data,
  });

  return NextResponse.json(post);
}
