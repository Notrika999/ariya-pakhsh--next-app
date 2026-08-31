import ArticleCard from "./ArticleCard";
import { getArticleKey } from "./magazineUtils";

export default function SidebarArticleList({ articles = [] }) {
  if (!articles.length) return null;

  return (
    <div className="divide-y divide-gray-100 dark:divide-zinc-800">
      {articles.map((article) => (
        <div key={getArticleKey(article)} className="py-2 first:pt-0 last:pb-0">
          <ArticleCard article={article} variant="sidebar" />
        </div>
      ))}
    </div>
  );
}
