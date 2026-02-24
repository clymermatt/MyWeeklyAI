import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import SiteFooter from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai"
  ),
  title: {
    default: "My Weekly AI — Personalized AI News Digest",
    template: "%s | My Weekly AI",
  },
  description:
    "A personalized weekly AI news digest, tailored to your role, tools, and interests.",
  openGraph: {
    type: "website",
    siteName: "My Weekly AI",
    title: "My Weekly AI — Personalized AI News Digest",
    description:
      "A personalized weekly AI news digest, tailored to your role, tools, and interests.",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Weekly AI — Personalized AI News Digest",
    description:
      "A personalized weekly AI news digest, tailored to your role, tools, and interests.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SiteFooter />
      </body>
    </html>
  );
}
