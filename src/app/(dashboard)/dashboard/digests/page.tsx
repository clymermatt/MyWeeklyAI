import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DigestCard from "@/components/digest-card";

export default async function DigestsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const digests = await prisma.weeklyDigest.findMany({
    where: { userId },
    orderBy: { sentAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Digest History</h1>
        <p className="mt-1 text-sm text-gray-600">
          Your past weekly AI briefs.
        </p>
      </div>

      {digests.length > 0 ? (
        <div className="space-y-4">
          {digests.map((digest) => (
            <DigestCard key={digest.id} digest={digest} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-sm text-gray-500">No digests yet.</p>
          <p className="mt-1 text-sm text-gray-400">
            Subscribe and set up your context profile to start receiving weekly
            briefs.
          </p>
        </div>
      )}
    </div>
  );
}
