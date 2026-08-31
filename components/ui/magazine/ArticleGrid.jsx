import ArticleCard from "./ArticleCard";
import { getArticleKey } from "./magazineUtils";

export default function ArticleGrid({ articles = [], emptyMessage }) {
  if (!articles.length) {
    return emptyMessage ? (
      <p className="rounded-lg border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500 dark:border-zinc-700 dark:text-gray-400">
        {emptyMessage}
      </p>
    ) : null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={getArticleKey(article)} article={article} />
      ))}
    </div>
  );
}
