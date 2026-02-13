import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: `Webhook signature verification failed: ${err instanceof Error ? err.message : "unknown"}`,
      },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId || !session.subscription || !session.customer) break;

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          status: "ACTIVE",
        },
        update: {
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          status: "ACTIVE",
        },
      });
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId =
        invoice.parent?.subscription_details?.subscription;
      if (!subscriptionId || typeof subscriptionId !== "string") break;

      const sub = await stripe.subscriptions.retrieve(subscriptionId);

      // Calculate period end from billing_cycle_anchor + interval
      const periodEnd = sub.trial_end
        ? new Date(sub.trial_end * 1000)
        : new Date(sub.billing_cycle_anchor * 1000);

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          currentPeriodEnd: periodEnd,
          status: "ACTIVE",
        },
      });
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const statusMap: Record<string, "ACTIVE" | "CANCELED" | "PAST_DUE"> = {
        active: "ACTIVE",
        canceled: "CANCELED",
        past_due: "PAST_DUE",
      };
      const status = statusMap[sub.status] ?? "INACTIVE";

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { status },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { status: "CANCELED" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
