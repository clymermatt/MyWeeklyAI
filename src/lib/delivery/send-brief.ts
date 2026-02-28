import { sendWeeklyBrief } from "@/lib/email/send";
import { sendTelegramMessage } from "@/lib/telegram";
import { formatBriefForTelegram } from "@/lib/telegram/format-brief";
import { generateUnsubscribeUrl } from "@/lib/unsubscribe";
import type { BriefOutput } from "@/types/brief";
import type { DeliveryChannel } from "@/generated/prisma/client";

interface DeliverBriefParams {
  user: {
    id: string;
    email: string;
    name?: string | null;
    telegramChatId?: string | null;
    deliveryChannel: DeliveryChannel;
  };
  brief: BriefOutput;
  periodStart: Date;
  periodEnd: Date;
  profileTerms?: string[];
}

interface DeliverBriefResult {
  emailSent: boolean;
  telegramSent: boolean;
  errors: string[];
}

export async function deliverBrief({
  user,
  brief,
  periodStart,
  periodEnd,
  profileTerms = [],
}: DeliverBriefParams): Promise<DeliverBriefResult> {
  const result: DeliverBriefResult = {
    emailSent: false,
    telegramSent: false,
    errors: [],
  };

  const channel = user.deliveryChannel;
  const shouldEmail = channel === "EMAIL" || channel === "BOTH";
  const shouldTelegram =
    (channel === "TELEGRAM" || channel === "BOTH") && user.telegramChatId;

  if (shouldEmail) {
    try {
      const unsubscribeUrl = generateUnsubscribeUrl(user.id);
      await sendWeeklyBrief({
        to: user.email,
        userName: user.name ?? undefined,
        brief,
        periodStart,
        periodEnd,
        profileTerms,
        unsubscribeUrl,
      });
      result.emailSent = true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown email error";
      result.errors.push(`Email failed for ${user.email}: ${msg}`);
    }
  }

  if (shouldTelegram) {
    try {
      const text = formatBriefForTelegram({
        brief,
        periodStart,
        periodEnd,
        profileTerms,
      });
      await sendTelegramMessage(user.telegramChatId!, text);
      result.telegramSent = true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Unknown Telegram error";
      result.errors.push(`Telegram failed for ${user.email}: ${msg}`);
    }
  }

  return result;
}
