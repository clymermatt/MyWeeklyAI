import { Resend } from "resend";
import { render } from "@react-email/components";
import WeeklyBriefEmail from "./weekly-brief-template";
import WelcomeEmail from "./welcome-template";
import type { BriefOutput } from "@/types/brief";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set — skipping email send");
  return new Resend(key);
}

export async function sendWeeklyBrief({
  to,
  userName,
  brief,
  isFree = false,
  periodStart,
  periodEnd,
}: {
  to: string;
  userName?: string;
  brief: BriefOutput;
  isFree?: boolean;
  periodStart: Date;
  periodEnd: Date;
}) {
  const html = await render(
    WeeklyBriefEmail({
      brief,
      isFree,
      periodStart: periodStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      periodEnd: periodEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      userName,
    }),
  );

  const dateRange = `${periodStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} to ${periodEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  const subject = isFree
    ? `Your Free AI Brief — ${dateRange}`
    : `Your AI Brief — ${dateRange}`;

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: "My Weekly AI <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export async function sendWelcomeEmail({
  to,
  userName,
}: {
  to: string;
  userName?: string;
}) {
  const html = await render(WelcomeEmail({ userName }));

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: "My Weekly AI <onboarding@resend.dev>",
    to,
    subject: "Welcome to My Weekly AI",
    html,
  });

  if (error) {
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }
}
