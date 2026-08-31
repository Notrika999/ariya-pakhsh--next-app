import ArticleCard from "./ArticleCard";

export default function FeaturedArticle({ article, priority = true }) {
  if (!article) return null;
  return <ArticleCard article={article} variant="featured" priority={priority} />;
}
