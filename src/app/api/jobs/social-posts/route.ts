import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runSocialPostsGeneration } from "@/lib/jobs/social-posts";
import { sendJobAlertEmail } from "@/lib/email/send";
import { pingHealthCheck } from "@/lib/healthcheck";

export const maxDuration = 60;

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobRun = await prisma.jobRun.create({
    data: { jobName: "social-posts", status: "RUNNING" },
  });

  try {
    const result = await runSocialPostsGeneration();

    const status =
      result.postsGenerated === 0 && result.errors.length > 0
        ? "FAILURE"
        : "SUCCESS";
    const endedAt = new Date();
    const metrics = {
      segmentsProcessed: result.segmentsProcessed,
      postsGenerated: result.postsGenerated,
      errorCount: result.errors.length,
    };
    const errorText =
      result.errors.length > 0 ? result.errors.join("\n") : null;

    await prisma.jobRun.update({
      where: { id: jobRun.id },
      data: { status, endedAt, error: errorText, metrics },
    });

    if (status === "FAILURE") {
      await sendJobAlertEmail({
        jobName: "social-posts",
        status,
        startedAt: jobRun.startedAt,
        endedAt,
        metrics,
        error: errorText,
      });
    }

    if (status === "SUCCESS") {
      await pingHealthCheck("social-posts");
    }

    return NextResponse.json(result);
  } catch (error) {
    const endedAt = new Date();
    const errorText =
      error instanceof Error ? error.message : "Unknown error";

    await prisma.jobRun.update({
      where: { id: jobRun.id },
      data: { status: "FAILURE", endedAt, error: errorText },
    });

    await sendJobAlertEmail({
      jobName: "social-posts",
      status: "FAILURE",
      startedAt: jobRun.startedAt,
      endedAt,
      error: errorText,
    });

    return NextResponse.json(
      { error: "Social posts generation failed", detail: errorText },
      { status: 500 },
    );
  }
}
