import FeaturedArticle from "./FeaturedArticle";
import FeaturedArticleCard from "./FeaturedArticleCard";
import { getArticleKey } from "./magazineUtils";

export default function MagazineHero({ main, articles = [] }) {
  if (!main && !articles.length) return null;

  return (
    <section aria-label="مطالب منتخب" className="grid gap-3 lg:grid-cols-5 lg:grid-rows-2">
      <div className="lg:col-span-3 lg:row-span-2">
        <FeaturedArticle article={main} />
      </div>
      {articles.slice(0, 4).map((article) => (
        <div key={getArticleKey(article)} className="min-h-36">
          <FeaturedArticleCard article={article} />
        </div>
      ))}
    </section>
  );
}
