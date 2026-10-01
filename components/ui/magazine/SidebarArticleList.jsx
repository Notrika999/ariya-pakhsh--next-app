import ArticleCard from "./ArticleCard";
import { getArticleKey } from "./magazineUtils";

/**
<<<<<<< HEAD
 * @param {{ articles?: object[], titleAs?: string, showRank?: boolean }} props
 */
export default function SidebarArticleList({
  articles = [],
  titleAs,
  showRank = false,
}) {
  if (!articles.length) return null;

  return (
    <div className="grid gap-3 lg:grid-cols-2 lg:gap-x-5">
      {articles.map((article, index) => (
        <div key={getArticleKey(article)} className="min-w-0">
          <ArticleCard
            article={article}
            variant="sidebar"
            titleAs={titleAs}
            rank={showRank ? index + 1 : undefined}
          />
=======
 * @param {{ articles?: object[], titleAs?: string }} props
 */
export default function SidebarArticleList({ articles = [], titleAs }) {
  if (!articles.length) return null;

  return (
    <div className="divide-y divide-gray-100 dark:divide-zinc-800">
      {articles.map((article) => (
        <div key={getArticleKey(article)} className="py-2 first:pt-0 last:pb-0">
          <ArticleCard article={article} variant="sidebar" titleAs={titleAs} />
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
        </div>
      ))}
    </div>
  );
}
