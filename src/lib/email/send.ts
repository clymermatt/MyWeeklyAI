import { Resend } from "resend";
import { render } from "@react-email/components";
import WeeklyBriefEmail from "./weekly-brief-template";
import WelcomeEmail from "./welcome-template";
import type { BriefOutput } from "@/types/brief";
import type { JobStatus } from "@/generated/prisma/client";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set — skipping email send");
  return new Resend(key);
}

export async function sendWeeklyBrief({
  to,
  userName,
  brief,
  periodStart,
  periodEnd,
  profileTerms = [],
  unsubscribeUrl,
}: {
  to: string;
  userName?: string;
  brief: BriefOutput;
  periodStart: Date;
  periodEnd: Date;
  profileTerms?: string[];
  unsubscribeUrl?: string;
}) {
  const html = await render(
    WeeklyBriefEmail({
      brief,
      periodStart: periodStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      periodEnd: periodEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      userName,
      profileTerms,
      unsubscribeUrl,
    }),
  );

  const dateRange = `${periodStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} to ${periodEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  const subject = `Your AI Brief — ${dateRange}`;

  const resend = getResend();
  const headers: Record<string, string> = {};
  if (unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  const { error } = await resend.emails.send({
    from: "My Weekly AI <digest@myweekly.ai>",
    to,
    subject,
    html,
    headers,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export async function sendWelcomeEmail({
  to,
  userName,
  unsubscribeUrl,
}: {
  to: string;
  userName?: string;
  unsubscribeUrl?: string;
}) {
  const html = await render(WelcomeEmail({ userName, unsubscribeUrl }));

  const resend = getResend();
  const headers: Record<string, string> = {};
  if (unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  const { error } = await resend.emails.send({
    from: "My Weekly AI <hello@myweekly.ai>",
    to,
    subject: "Welcome to My Weekly AI — let's get you set up",
    html,
    headers,
  });

  if (error) {
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }
}

export async function sendJobAlertEmail({
  jobName,
  status,
  startedAt,
  endedAt,
  metrics,
  error,
}: {
  jobName: string;
  status: JobStatus;
  startedAt: Date;
  endedAt?: Date | null;
  metrics?: Record<string, unknown> | null;
  error?: string | null;
}) {
  const to = process.env.ADMIN_ALERT_EMAIL;
  if (!to) return;

  const adminUrl = process.env.NEXTAUTH_URL
    ? `${process.env.NEXTAUTH_URL}/admin/jobs`
    : "https://contextbrief.com/admin/jobs";

  const metricsLines = metrics
    ? Object.entries(metrics)
        .map(([k, v]) => `  ${k}: ${v}`)
        .join("\n")
    : "  (none)";

  const html = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: ${status === "FAILURE" ? "#dc2626" : "#f59e0b"};">
    Job Alert: ${jobName} — ${status}
  </h2>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <tr><td style="padding: 4px 8px; color: #6b7280;">Job</td><td style="padding: 4px 8px;">${jobName}</td></tr>
    <tr><td style="padding: 4px 8px; color: #6b7280;">Status</td><td style="padding: 4px 8px; font-weight: bold; color: ${status === "FAILURE" ? "#dc2626" : "#f59e0b"};">${status}</td></tr>
    <tr><td style="padding: 4px 8px; color: #6b7280;">Started</td><td style="padding: 4px 8px;">${startedAt.toISOString()}</td></tr>
    <tr><td style="padding: 4px 8px; color: #6b7280;">Ended</td><td style="padding: 4px 8px;">${endedAt?.toISOString() ?? "—"}</td></tr>
  </table>
  <h3 style="margin-top: 16px;">Metrics</h3>
  <pre style="background: #f3f4f6; padding: 12px; border-radius: 6px; font-size: 13px;">${metricsLines}</pre>
  ${error ? `<h3 style="color: #dc2626;">Error</h3><pre style="background: #fef2f2; padding: 12px; border-radius: 6px; font-size: 13px; color: #dc2626;">${error}</pre>` : ""}
  <p style="margin-top: 16px;"><a href="${adminUrl}" style="color: #2563eb;">View Admin Dashboard →</a></p>
</div>`.trim();

  const resend = getResend();
  const { error: sendError } = await resend.emails.send({
    from: "My Weekly AI <alerts@myweekly.ai>",
    to,
    subject: `[${status}] Job Alert: ${jobName}`,
    html,
  });

  if (sendError) {
    console.error(`Failed to send job alert email: ${sendError.message}`);
  }
}
