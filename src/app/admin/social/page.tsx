import { prisma } from "@/lib/prisma";
import SocialPostsAdmin from "@/components/social-posts-admin";

export default async function AdminSocialPage() {
  let weekStrings: string[] = [];
  try {
    const weeks = await prisma.socialPost.findMany({
      select: { weekOf: true },
      distinct: ["weekOf"],
      orderBy: { weekOf: "desc" },
    });
    weekStrings = weeks.map((w) => w.weekOf.toISOString());
  } catch {
    // Table may not exist yet if migration hasn't been applied
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Social Posts</h1>
      <SocialPostsAdmin initialWeeks={weekStrings} />
    </div>
  );
}
