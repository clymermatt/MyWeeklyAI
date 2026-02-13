import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/auth/signin", process.env.NEXTAUTH_URL!));
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription?.stripeCustomerId) {
    return NextResponse.redirect(new URL("/dashboard", process.env.NEXTAUTH_URL!));
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  });

  return NextResponse.redirect(portalSession.url);
}
