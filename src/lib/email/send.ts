import { Resend } from "resend";
import { render } from "@react-email/components";
import WeeklyBriefEmail from "./weekly-brief-template";
import type { BriefOutput } from "@/types/brief";

const resend = new Resend(process.env.RESEND_API_KEY);

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
