import Sidebar from "@/components/blog/sidebar";
import { CATEGORY_GROUPS } from "@/lib/categories";
import {
  getAllCategories,
  getAllSeries,
  getAllTags,
  getTilDates,
} from "@/lib/posts";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allCategories = getAllCategories();
  const countMap = new Map(allCategories.map((c) => [c.name, c.count]));

  const categoryGroups = CATEGORY_GROUPS.map((group) => ({
    label: group.label,
    items: group.categories
      .filter((c) => countMap.has(c.id))
      .map((c) => ({ id: c.id, label: c.label, count: countMap.get(c.id)! })),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex gap-8 py-8">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24">
          <Sidebar
            categoryGroups={categoryGroups}
            tags={getAllTags()}
            series={getAllSeries()}
            tilDates={getTilDates()}
          />
        </div>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
