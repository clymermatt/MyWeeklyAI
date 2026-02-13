import { prisma } from "@/lib/prisma";
import { runIngestion } from "@/lib/ingestion/ingest";
import { generateBrief } from "@/lib/llm/generate-brief";
import { sendWeeklyBrief } from "@/lib/email/send";

export interface DigestResult {
  usersProcessed: number;
  emailsSent: number;
  errors: string[];
}

export async function runWeeklyDigest(): Promise<DigestResult> {
  // Step 1: Run ingestion first to get fresh news
  await runIngestion();

  // Step 2: Fetch all users with active subscriptions and a context profile
  const users = await prisma.user.findMany({
    where: {
      subscription: { status: "ACTIVE" },
      contextProfile: { isNot: null },
    },
    include: {
      contextProfile: true,
      subscription: true,
    },
  });

  const periodEnd = new Date();
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - 7);

  // Step 3: Fetch news items from the past 7 days
  const newsItems = await prisma.newsItem.findMany({
    where: {
      publishedAt: { gte: periodStart },
    },
    orderBy: { publishedAt: "desc" },
    take: 100,
  });

  let emailsSent = 0;
  const errors: string[] = [];

  // Step 4: For each user, generate a personalized brief and send email
  for (const user of users) {
    if (!user.contextProfile) continue;

    try {
      const brief = await generateBrief(user.contextProfile, newsItems);

      // Store the digest in DB regardless of email sending
      await prisma.weeklyDigest.create({
        data: {
          userId: user.id,
          briefJson: JSON.parse(JSON.stringify(brief)),
          periodStart,
          periodEnd,
        },
      });

      // Try sending email (may fail if RESEND_API_KEY not set)
      try {
        await sendWeeklyBrief({
          to: user.email,
          userName: user.name ?? undefined,
          brief,
          periodStart,
          periodEnd,
        });
        emailsSent++;
      } catch (emailErr) {
        const msg = emailErr instanceof Error ? emailErr.message : "Unknown email error";
        console.log(`Email skipped for ${user.email}: ${msg}`);
        errors.push(`Email skipped for ${user.email}: ${msg}`);
      }
    } catch (err) {
      errors.push(
        `User ${user.email}: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }

  return {
    usersProcessed: users.length,
    emailsSent,
    errors,
  };
}
