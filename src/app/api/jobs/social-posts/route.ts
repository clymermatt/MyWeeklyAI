import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePostsForSegment } from "@/lib/jobs/social-posts";
import { sendJobAlertEmail } from "@/lib/email/send";
import { pingHealthCheck } from "@/lib/healthcheck";
import landingPages from "@/lib/landing-content";
import { verifyCronSecret } from "@/lib/verify-secret";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!verifyCronSecret(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const segmentIndex = parseInt(searchParams.get("index") || "0", 10);
  const allSlugs = Object.keys(landingPages);
  const slug = allSlugs[segmentIndex];

  // First segment: clean up stale RUNNING records and create a new job run
  let jobRunId: string | null = null;
  if (segmentIndex === 0) {
    await prisma.jobRun.updateMany({
      where: { jobName: "social-posts", status: "RUNNING" },
      data: { status: "FAILURE", endedAt: new Date(), error: "Timed out (stale)" },
    });
    const jobRun = await prisma.jobRun.create({
      data: { jobName: "social-posts", status: "RUNNING" },
    });
    jobRunId = jobRun.id;
  }

  try {
    if (!slug) {
      // All segments processed — finalize
      return await finalizeJobRun();
    }

    const result = await generatePostsForSegment(slug);

    // Chain the next segment
    const nextIndex = segmentIndex + 1;
    if (nextIndex < allSlugs.length) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai";
      fetch(`${baseUrl}/api/jobs/social-posts?index=${nextIndex}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
      }).catch(() => {});
    } else {
      // Last segment — finalize asynchronously
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai";
      fetch(`${baseUrl}/api/jobs/social-posts?index=${allSlugs.length}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
      }).catch(() => {});
    }

    return NextResponse.json({
      segment: slug,
      index: segmentIndex,
      total: allSlugs.length,
      ...result,
    });
  } catch (error) {
    const errorText = error instanceof Error ? error.message : "Unknown error";

    // Log the error but continue with the next segment
    console.error(`Social post error for ${slug}: ${errorText}`);

    const nextIndex = segmentIndex + 1;
    if (nextIndex <= allSlugs.length) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai";
      fetch(`${baseUrl}/api/jobs/social-posts?index=${nextIndex}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
      }).catch(() => {});
    }

    return NextResponse.json(
      { error: "Social posts generation failed", detail: errorText, segment: slug },
      { status: 500 },
    );
  }
}

async function finalizeJobRun() {
  const runningJob = await prisma.jobRun.findFirst({
    where: { jobName: "social-posts", status: "RUNNING" },
    orderBy: { startedAt: "desc" },
  });

  if (runningJob) {
    const totalPosts = await prisma.socialPost.count({
      where: { createdAt: { gte: runningJob.startedAt } },
    });

    const endedAt = new Date();
    const status = totalPosts > 0 ? "SUCCESS" : "FAILURE";
    const metrics = {
      segmentsProcessed: totalPosts / 2,
      postsGenerated: totalPosts,
    };

    await prisma.jobRun.update({
      where: { id: runningJob.id },
      data: { status, endedAt, metrics },
    });

    if (status === "SUCCESS") {
      await pingHealthCheck("social-posts");
    } else {
      await sendJobAlertEmail({
        jobName: "social-posts",
        status: "FAILURE",
        startedAt: runningJob.startedAt,
        endedAt,
        error: "No posts were generated",
      });
    }
  }

  return NextResponse.json({ message: "Job finalized" });
}
