import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendJobAlertEmail } from "@/lib/email/send";
import { verifyCronSecret } from "@/lib/verify-secret";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!verifyCronSecret(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // The JobRun write is itself the keepalive query: it exercises the database
  // connection (preventing Supabase free-tier auto-pause) and leaves an audit
  // trail in /admin/jobs, which survives beyond Vercel's log retention.
  let jobRun;
  try {
    jobRun = await prisma.jobRun.create({
      data: { jobName: "keepalive", status: "RUNNING" },
    });
  } catch (error) {
    // Database unreachable — we can't record a JobRun, so alert directly.
    const errorText =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Keepalive failed:", errorText);
    await sendJobAlertEmail({
      jobName: "keepalive",
      status: "FAILURE",
      startedAt: new Date(),
      endedAt: new Date(),
      error: errorText,
    }).catch((e) => console.error("Keepalive alert email failed:", e));
    return NextResponse.json(
      { error: "Database unreachable" },
      { status: 500 },
    );
  }

  await prisma.jobRun.update({
    where: { id: jobRun.id },
    data: { status: "SUCCESS", endedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
