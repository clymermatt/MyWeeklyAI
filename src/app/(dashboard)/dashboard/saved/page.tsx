import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SavedArticleCard from "@/components/saved-article-card";

export default async function SavedPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Articles</h1>
        <p className="mt-1 text-sm text-gray-600">
          Articles you&apos;ve bookmarked from your briefings.
        </p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            <SavedArticleCard
              key={b.id}
              id={b.id}
              url={b.url}
              title={b.title}
              summary={b.summary}
              source={b.source}
              createdAt={b.createdAt.toISOString()}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-sm text-gray-500">No saved articles yet.</p>
          <p className="mt-1 text-sm text-gray-400">
            Bookmark articles from your briefings to save them here.
          </p>
        </div>
      )}
    </div>
  );
}
