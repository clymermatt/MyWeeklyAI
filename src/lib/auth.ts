import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email/send";
import { generateUnsubscribeUrl } from "@/lib/unsubscribe";
import { Resend as ResendClient } from "resend";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "My Weekly AI <onboarding@resend.dev>",
      async sendVerificationRequest({ identifier: email, url }) {
        const resend = new ResendClient(process.env.RESEND_API_KEY);
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai";

        // Detect funnel via the magic-link's callbackUrl — assessment takers get
        // a results-oriented email, not a newsletter-onboarding one.
        let callbackUrl = "";
        try {
          callbackUrl = new URL(url).searchParams.get("callbackUrl") ?? "";
        } catch {
          // Malformed url — fall through to default branches.
        }
        const isAssessmentFunnel = callbackUrl.includes("/ai-job-risk/");

        const existingUser = await prisma.user.findUnique({ where: { email } });

        let subject: string;
        let heading: string;
        let body: string;
        let buttonText: string;

        if (isAssessmentFunnel) {
          subject = "Your AI Job Risk Report is ready";
          heading = "Your AI Job Risk Report is ready";
          body =
            "Click below to view your personalized AI Job Risk Assessment results and unlock the full breakdown.";
          buttonText = "View my report";
        } else if (existingUser) {
          subject = "Sign in to My Weekly AI";
          heading = "Welcome back!";
          body = "Click the button below to sign in to your account.";
          buttonText = "Sign in to My Weekly AI";
        } else {
          subject = "Welcome to My Weekly AI — let's get you set up";
          heading = "Welcome to My Weekly AI!";
          body = "Sign in to set up your profile and get your first personalized AI briefing today.";
          buttonText = "Get started";
        }

        const { error: sendError } = await resend.emails.send({
          from: "My Weekly AI <onboarding@resend.dev>",
          to: email,
          subject,
          html: `
            <body style="background-color:#f9fafb;font-family:sans-serif;padding:40px 0">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;padding:32px">
                <tr><td>
                  <img src="${appUrl}/logos/nav-logo.png" alt="myweeklyai" width="160" height="37" style="margin-bottom:16px" />
                  <h2 style="color:#1f2937;font-size:18px;font-weight:700;margin:0 0 8px">${heading}</h2>
                  <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 24px">
                    ${body}
                  </p>
                  <table cellpadding="0" cellspacing="0"><tr><td style="border-radius:6px;background-color:#9333ea">
                    <a href="${url}" style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none">
                      ${buttonText}
                    </a>
                  </td></tr></table>
                  <p style="color:#9ca3af;font-size:12px;line-height:1.6;margin:24px 0 0">
                    If you didn&apos;t request this email, you can safely ignore it.
                  </p>
                </td></tr>
              </table>
            </body>
          `,
        });
        if (sendError) {
          // Surface to Vercel logs AND propagate so NextAuth redirects the user
          // to the error page instead of silently sending them to verify-request.
          console.error("Resend sendVerificationRequest failed:", sendError);
          throw new Error(`Failed to send verification email: ${sendError.message}`);
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  events: {
    async createUser({ user }) {
      try {
        if (!user.email) return;

        // Assessment-funnel signups get a bespoke welcome email (with the
        // report + PDF) sent from the claim path. The cookie is set by the
        // assessment auth gate's signIn server actions and survives the OAuth
        // round-trip (and same-browser magic-link clicks). Cross-browser magic
        // link clicks miss the cookie → fall through to the newsletter welcome.
        try {
          const cookieStore = await cookies();
          if (cookieStore.get("airisk_pending")?.value) return;
        } catch {
          // cookies() outside a request context — proceed with newsletter welcome.
        }

        const unsubscribeUrl = user.id
          ? generateUnsubscribeUrl(user.id)
          : undefined;
        await sendWelcomeEmail({
          to: user.email,
          userName: user.name ?? undefined,
          unsubscribeUrl,
        });
      } catch (err) {
        console.error("Failed to send welcome email:", err);
      }
    },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});
