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

  const { searchParams } = new URL(req.url);
  const batchIndex = parseInt(searchParams.get("batch") || "0", 10);

  // Only create a JobRun on the first batch
  let jobRunId: string | null = null;
  if (batchIndex === 0) {
    const jobRun = await prisma.jobRun.create({
      data: { jobName: "social-posts", status: "RUNNING" },
    });
    jobRunId = jobRun.id;
  }

  try {
    const result = await runSocialPostsGeneration(batchIndex);

    // If there are more segments, chain the next invocation
    if (result.nextBatch !== undefined) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai";
      fetch(`${baseUrl}/api/jobs/social-posts?batch=${result.nextBatch}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
      }).catch(() => {
        // Fire and forget — errors will be caught by the next invocation
      });

      return NextResponse.json({
        ...result,
        message: `Batch ${batchIndex} done, triggering batch ${result.nextBatch}`,
      });
    }

    // Final batch — update the JobRun with aggregate metrics
    if (jobRunId || batchIndex > 0) {
      // Find the RUNNING job run for this job
      const runningJob = jobRunId
        ? { id: jobRunId }
        : await prisma.jobRun.findFirst({
            where: { jobName: "social-posts", status: "RUNNING" },
            orderBy: { startedAt: "desc" },
          });

      if (runningJob) {
        // Count all posts created for this week to get aggregate metrics
        const totalPosts = await prisma.socialPost.count({
          where: {
            createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
          },
        });

        const endedAt = new Date();
        const status = totalPosts > 0 ? "SUCCESS" : "FAILURE";
        const metrics = {
          segmentsProcessed: totalPosts / 2,
          postsGenerated: totalPosts,
          errorCount: result.errors.length,
          batches: batchIndex + 1,
        };

        await prisma.jobRun.update({
          where: { id: runningJob.id },
          data: { status, endedAt, metrics },
        });

        if (status === "SUCCESS") {
          await pingHealthCheck("social-posts");
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    const endedAt = new Date();
    const errorText =
      error instanceof Error ? error.message : "Unknown error";

    // Try to update the job run
    const runningJob = jobRunId
      ? { id: jobRunId }
      : await prisma.jobRun.findFirst({
          where: { jobName: "social-posts", status: "RUNNING" },
          orderBy: { startedAt: "desc" },
        });

    if (runningJob) {
      await prisma.jobRun.update({
        where: { id: runningJob.id },
        data: { status: "FAILURE", endedAt, error: errorText },
      });
    }

    await sendJobAlertEmail({
      jobName: "social-posts",
      status: "FAILURE",
      startedAt: new Date(),
      endedAt,
      error: errorText,
    });

    return NextResponse.json(
      { error: "Social posts generation failed", detail: errorText },
      { status: 500 },
    );
  }
}
