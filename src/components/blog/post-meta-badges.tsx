import { CategoryBadge, SeriesBadge, TagBadge } from "./badges";

interface PostMetaBadgesProps {
  category: string;
  tags: string[];
  series?: string;
  order?: number;
  seriesCount?: number;
  linkClassName?: string;
}

export default function PostMetaBadges({
  category,
  tags,
  series,
  order,
  seriesCount,
  linkClassName,
}: PostMetaBadgesProps) {
  return (
    <>
      <CategoryBadge category={category} className={linkClassName} />
      {series && (
        <SeriesBadge
          series={series}
          order={order}
          count={seriesCount}
          className={linkClassName}
        />
      )}
      {tags.map((tag) => (
        <TagBadge key={tag} tag={tag} className={linkClassName} />
      ))}
    </>
  );
}
