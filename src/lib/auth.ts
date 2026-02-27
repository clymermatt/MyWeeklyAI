import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
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

        // Determine persona from callback URL and existing account
        const isProSignup = url.includes("stripe") || url.includes("plan%3Dpro");
        const existingUser = await prisma.user.findUnique({ where: { email } });

        let subject: string;
        let heading: string;
        let body: string;
        let buttonText: string;

        if (existingUser) {
          // Returning user
          subject = "Sign in to My Weekly AI";
          heading = "Welcome back!";
          body = "Click the button below to sign in to your account.";
          buttonText = "Sign in to My Weekly AI";
        } else if (isProSignup) {
          // New user — Pro trial
          subject = "Welcome to My Weekly AI — let's get you set up";
          heading = "Let\u2019s get you started!";
          body = "Sign in to set up your 7-day free trial and get your first personalized AI briefing today.";
          buttonText = "Start my free trial";
        } else {
          // New user — Free
          subject = "Welcome to My Weekly AI — let's get you set up";
          heading = "Welcome to My Weekly AI!";
          body = "Sign in to set up your profile and get your first brief today.";
          buttonText = "Get started";
        }

        await resend.emails.send({
          from: "My Weekly AI <onboarding@resend.dev>",
          to: email,
          subject,
          html: `
            <body style="background-color:#f9fafb;font-family:sans-serif;padding:40px 0">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;padding:32px">
                <tr><td>
                  <h1 style="color:#9333ea;font-size:24px;margin:0 0 16px">My Weekly AI</h1>
                  <h2 style="color:#111827;font-size:20px;margin:0 0 8px">${heading}</h2>
                  <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px">
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
        if (user.email) {
          const unsubscribeUrl = user.id
            ? generateUnsubscribeUrl(user.id)
            : undefined;
          await sendWelcomeEmail({
            to: user.email,
            userName: user.name ?? undefined,
            unsubscribeUrl,
          });
        }
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
