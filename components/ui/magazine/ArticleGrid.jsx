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
 *   priorityCount?: number,
 * }} props
 */
export default function ArticleGrid({
  articles = [],
  emptyMessage,
  columns = 3,
  cardVariant = "default",
  titleAs,
  priorityCount = 0,
}) {
  if (!articles.length) {
    return emptyMessage ? (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white/65 px-4 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
        <span className="mx-auto grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-slate-300" aria-hidden="true">
          <i className="far fa-file-circle-question" />
        </span>
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-gray-300">
          {emptyMessage}
        </p>
      </div>
    ) : null;
  }

  return (
    <div className={COLUMN_CLASS[columns] ?? COLUMN_CLASS[3]}>
      {articles.map((article, index) => (
        <ArticleCard
          key={getArticleKey(article)}
          article={article}
          variant={cardVariant}
          titleAs={titleAs}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
