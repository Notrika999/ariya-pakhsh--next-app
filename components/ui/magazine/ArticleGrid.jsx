import ArticleCard from "./ArticleCard";
import { getArticleKey } from "./magazineUtils";

const COLUMN_CLASS = {
  3: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3",
  4: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * @param {{
 *   articles?: object[],
 *   emptyMessage?: string,
 *   columns?: number,
 *   cardVariant?: string,
 *   titleAs?: string,
 * }} props
 */
export default function ArticleGrid({
  articles = [],
  emptyMessage,
  columns = 3,
  cardVariant = "default",
  titleAs,
}) {
  if (!articles.length) {
    return emptyMessage ? (
      <p className="rounded-lg border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500 dark:border-zinc-700 dark:text-gray-400">
        {emptyMessage}
      </p>
    ) : null;
  }

  return (
    <div className={COLUMN_CLASS[columns] ?? COLUMN_CLASS[3]}>
      {articles.map((article) => (
        <ArticleCard
          key={getArticleKey(article)}
          article={article}
          variant={cardVariant}
          titleAs={titleAs}
        />
      ))}
    </div>
  );
}
