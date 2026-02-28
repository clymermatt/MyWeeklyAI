import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runWeeklyDigest } from "@/lib/jobs/weekly-digest";
import { sendJobAlertEmail } from "@/lib/email/send";
import { pingHealthCheck } from "@/lib/healthcheck";
import { verifyCronSecret } from "@/lib/verify-secret";

export async function POST(req: Request) {
  if (!verifyCronSecret(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobRun = await prisma.jobRun.create({
    data: { jobName: "weekly-digest", status: "RUNNING" },
  });

  try {
    const result = await runWeeklyDigest();

    const totalDelivered = result.emailsSent + result.telegramsSent;
    const status =
      result.usersProcessed === 0 && result.errors.length > 0
        ? "FAILURE"
        : totalDelivered === 0 && result.usersProcessed > 0 && result.errors.length > 0
          ? "FAILURE"
          : "SUCCESS";
    const endedAt = new Date();
    const metrics = {
      usersProcessed: result.usersProcessed,
      emailsSent: result.emailsSent,
      telegramsSent: result.telegramsSent,
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
        jobName: "weekly-digest",
        status,
        startedAt: jobRun.startedAt,
        endedAt,
        metrics,
        error: errorText,
      });
    }

    if (status === "SUCCESS") {
      await pingHealthCheck("weekly-digest");
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
      jobName: "weekly-digest",
      status: "FAILURE",
      startedAt: jobRun.startedAt,
      endedAt,
      error: errorText,
    });

    return NextResponse.json(
      { error: "Weekly digest failed" },
      { status: 500 },
    );
  }
}
