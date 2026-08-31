import ArticleCard from "./ArticleCard";

export default function FeaturedArticleCard({ article }) {
  if (!article) return null;
  return <ArticleCard article={article} variant="overlay" />;
}
