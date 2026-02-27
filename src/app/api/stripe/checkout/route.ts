import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

function getPriceId(interval: string): string {
  if (interval === "yearly") {
    return process.env.STRIPE_PRICE_ID_YEARLY!;
  }
  return process.env.STRIPE_PRICE_ID_MONTHLY ?? process.env.STRIPE_PRICE_ID!;
}

async function createCheckoutSession(userId: string, interval: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) return null;

  // Reuse existing Stripe customer or create new one
  let customerId = user.subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
  }

  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: getPriceId(interval),
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 7,
    },
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?subscription=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    metadata: { userId: user.id },
  });
}

// POST: called by SubscriptionButton component (returns JSON)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let interval = "monthly";
  try {
    const body = await request.json();
    if (body.interval === "yearly") interval = "yearly";
  } catch {
    // no body or invalid JSON — default to monthly
  }

  const checkoutSession = await createCheckoutSession(session.user.id, interval);
  if (!checkoutSession) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ url: checkoutSession.url });
}

// GET: called after sign-in redirect for Pro sign-ups (redirects to Stripe)
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin?plan=pro");
  }

  const interval = request.nextUrl.searchParams.get("interval") === "yearly" ? "yearly" : "monthly";

  const checkoutSession = await createCheckoutSession(session.user.id, interval);
  if (!checkoutSession?.url) {
    redirect("/dashboard");
  }

  redirect(checkoutSession.url);
}
