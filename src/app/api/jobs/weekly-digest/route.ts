import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runWeeklyDigest } from "@/lib/jobs/weekly-digest";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobRun = await prisma.jobRun.create({
    data: { jobName: "weekly-digest", status: "RUNNING" },
  });

  try {
    const result = await runWeeklyDigest();

    await prisma.jobRun.update({
      where: { id: jobRun.id },
      data: {
        status: result.errors.length > 0 ? "FAILURE" : "SUCCESS",
        endedAt: new Date(),
        error:
          result.errors.length > 0 ? result.errors.join("\n") : null,
        metrics: {
          freeUsersProcessed: result.freeUsersProcessed,
          paidUsersProcessed: result.paidUsersProcessed,
          emailsSent: result.emailsSent,
          errorCount: result.errors.length,
        },
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    await prisma.jobRun.update({
      where: { id: jobRun.id },
      data: {
        status: "FAILURE",
        endedAt: new Date(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    return NextResponse.json(
      { error: "Weekly digest failed" },
      { status: 500 },
    );
  }
}
