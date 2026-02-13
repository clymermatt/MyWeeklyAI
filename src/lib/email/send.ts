import { Resend } from "resend";
import { render } from "@react-email/components";
import WeeklyBriefEmail from "./weekly-brief-template";
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
  periodStart,
  periodEnd,
}: {
  to: string;
  userName?: string;
  brief: BriefOutput;
  periodStart: Date;
  periodEnd: Date;
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
    }),
  );

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: "ContextBrief <noreply@contextbrief.com>",
    to,
    subject: `Your AI Brief — ${periodStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} to ${periodEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    html,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
