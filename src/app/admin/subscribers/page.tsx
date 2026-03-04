import { prisma } from "@/lib/prisma";

export default async function SubscribersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      contextProfile: {
        select: { roleTitle: true, industry: true },
      },
      subscription: {
        select: { status: true },
      },
      _count: {
        select: { weeklyDigests: true },
      },
    },
  });

  const totalUsers = users.length;
  const withProfile = users.filter((u) => u.contextProfile).length;
  const activeDelivery = users.filter((u) => !u.unsubscribedAt).length;
  const telegramConnected = users.filter((u) => u.telegramChatId).length;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-gray-900">Subscribers</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
          <p className="text-xs text-gray-500">Total users</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-2xl font-bold text-gray-900">{withProfile}</p>
          <p className="text-xs text-gray-500">With profile</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-2xl font-bold text-gray-900">{activeDelivery}</p>
          <p className="text-xs text-gray-500">Active delivery</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-2xl font-bold text-gray-900">
            {telegramConnected}
          </p>
          <p className="text-xs text-gray-500">Telegram connected</p>
        </div>
      </div>

      {/* Subscribers table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role / Industry</th>
              <th className="px-4 py-3 font-medium">Channel</th>
              <th className="px-4 py-3 font-medium">Briefs</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">
                  {user.name || "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3 text-gray-600">
                  {user.contextProfile ? (
                    <span>
                      {user.contextProfile.roleTitle || "—"}
                      {user.contextProfile.industry && (
                        <span className="text-gray-400">
                          {" / "}
                          {user.contextProfile.industry}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-400">No profile</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-600">
                    {user.deliveryChannel === "BOTH"
                      ? "Email + Telegram"
                      : user.deliveryChannel === "TELEGRAM"
                        ? "Telegram"
                        : "Email"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {user._count.weeklyDigests}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {user.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  {user.unsubscribedAt ? (
                    <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      Unsubscribed
                    </span>
                  ) : (
                    <span className="inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                      Active
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
