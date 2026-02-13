import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runIngestion } from "@/lib/ingestion/ingest";

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

    await prisma.jobRun.update({
      where: { id: jobRun.id },
      data: {
        status: result.errors.length > 0 ? "FAILURE" : "SUCCESS",
        endedAt: new Date(),
        error:
          result.errors.length > 0 ? result.errors.join("\n") : null,
        metrics: {
          sourcesProcessed: result.sourcesProcessed,
          itemsUpserted: result.itemsUpserted,
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
      { error: "Ingestion failed" },
      { status: 500 },
    );
  }
}
