import ArticleCard from "./ArticleCard";

/**
 * @param {{ article?: object | null, titleAs?: string }} props
 */
export default function FeaturedArticleCard({ article, titleAs }) {
  if (!article) return null;
  return <ArticleCard article={article} variant="overlay" titleAs={titleAs} />;
}
