import ArticleCard from "./ArticleCard";
import { getArticleKey } from "./magazineUtils";

/**
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
        </div>
      ))}
    </div>
  );
}
