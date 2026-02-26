import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { generatePostsForSegment } from "@/lib/jobs/social-posts";

export const maxDuration = 60;

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { segment: string; regenerate?: boolean };

  if (!body.segment) {
    return NextResponse.json(
      { error: "segment is required" },
      { status: 400 },
    );
  }

  try {
    const result = await generatePostsForSegment(body.segment, {
      regenerate: body.regenerate ?? false,
    });
    return NextResponse.json(result);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Generation failed", detail },
      { status: 500 },
    );
  }
}
