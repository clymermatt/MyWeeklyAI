import { prisma } from "@/lib/prisma";
import SocialPostsAdmin from "@/components/social-posts-admin";

export default async function AdminSocialPage() {
  const weeks = await prisma.socialPost.findMany({
    select: { weekOf: true },
    distinct: ["weekOf"],
    orderBy: { weekOf: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Social Posts</h1>
      <SocialPostsAdmin
        initialWeeks={weeks.map((w) => w.weekOf.toISOString())}
      />
    </div>
  );
}
