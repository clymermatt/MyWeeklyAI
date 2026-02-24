import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runIngestion } from "@/lib/ingestion/ingest";
import { sendJobAlertEmail } from "@/lib/email/send";
import { pingHealthCheck } from "@/lib/healthcheck";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobRun = await prisma.jobRun.create({
    data: { jobName: "ingestion", status: "RUNNING" },
  });

  try {
    const result = await runIngestion();

    const status = result.errors.length > 0 ? "FAILURE" : "SUCCESS";
    const endedAt = new Date();
    const metrics = {
      sourcesProcessed: result.sourcesProcessed,
      itemsUpserted: result.itemsUpserted,
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
        jobName: "ingestion",
        status,
        startedAt: jobRun.startedAt,
        endedAt,
        metrics,
        error: errorText,
      });
    }

    if (status === "SUCCESS") {
      await pingHealthCheck("ingestion");
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
      jobName: "ingestion",
      status: "FAILURE",
      startedAt: jobRun.startedAt,
      endedAt,
      error: errorText,
    });

    return NextResponse.json(
      { error: "Ingestion failed" },
      { status: 500 },
    );
  }
}
