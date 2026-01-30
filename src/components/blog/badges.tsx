import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS } from "@/lib/categories";

export function CategoryBadge({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  return (
    <Badge variant="outline" asChild>
      <Link href={`/blog/categories/${category}`} className={className}>
        {CATEGORY_LABELS[category] ?? category}
      </Link>
    </Badge>
  );
}

export function SeriesBadge({
  series,
  order,
  count,
  className,
}: {
  series: string;
  order?: number;
  count?: number;
  className?: string;
}) {
  return (
    <Badge variant="default" asChild>
      <Link href={`/blog/series/${series}`} className={className}>
        {series}
        {order != null && count != null && ` (${order}/${count})`}
      </Link>
    </Badge>
  );
}

export function TagBadge({
  tag,
  className,
}: {
  tag: string;
  className?: string;
}) {
  return (
    <Badge variant="ghost" asChild>
      <Link href={`/blog/tags/${tag}`} className={className}>
        #{tag}
      </Link>
    </Badge>
  );
}
