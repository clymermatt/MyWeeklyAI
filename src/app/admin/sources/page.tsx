import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminSourcesPage() {
  const sources = await prisma.source.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { newsItems: true } } },
  });

  async function toggleSource(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const currentActive = formData.get("active") === "true";
    await prisma.source.update({
      where: { id },
      data: { active: !currentActive },
    });
    revalidatePath("/admin/sources");
  }

  async function deleteSource(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.source.delete({ where: { id } });
    revalidatePath("/admin/sources");
  }

  async function addSource(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const type = (formData.get("type") as string) || "RSS";
    if (!name || !url) return;

    await prisma.source.create({
      data: { name, url, type: type as "RSS" | "API", active: true },
    });
    revalidatePath("/admin/sources");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Sources</h1>

      {/* Add Source Form */}
      <form action={addSource} className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-medium text-gray-700">Add New Source</h2>
        <div className="flex gap-3">
          <input
            name="name"
            placeholder="Source name"
            required
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            name="url"
            placeholder="Feed URL"
            required
            className="flex-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <select
            name="type"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="RSS">RSS</option>
            <option value="API">API</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            Add
          </button>
        </div>
      </form>

      {/* Sources List */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Items</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source.id} className="border-b border-gray-100">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{source.name}</div>
                  <div className="text-xs text-gray-400 truncate max-w-xs">{source.url}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{source.type}</td>
                <td className="px-4 py-3 text-gray-600">{source._count.newsItems}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      source.active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {source.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <form action={toggleSource}>
                      <input type="hidden" name="id" value={source.id} />
                      <input type="hidden" name="active" value={String(source.active)} />
                      <button
                        type="submit"
                        className="text-xs text-purple-600 hover:text-purple-700"
                      >
                        {source.active ? "Disable" : "Enable"}
                      </button>
                    </form>
                    <form action={deleteSource}>
                      <input type="hidden" name="id" value={source.id} />
                      <button
                        type="submit"
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sources.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">
            No sources yet. Add one above.
          </div>
        )}
      </div>
    </div>
  );
}
