import ArticleCard from "./ArticleCard";

/**
 * @param {{ article?: object | null, priority?: boolean, titleAs?: string }} props
 */
export default function FeaturedArticle({
  article,
  priority = true,
  titleAs,
}) {
  if (!article) return null;
  return (
    <ArticleCard
      article={article}
      variant="featured"
      priority={priority}
      titleAs={titleAs}
    />
  );
}
