import type { MetadataRoute } from "next";
import { allSlugs } from "@/lib/landing-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai";

  const landingPages = allSlugs.map((slug) => ({
    url: `${baseUrl}/for/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/auth/signin`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...landingPages,
  ];
}
