import FeaturedArticle from "./FeaturedArticle";
import FeaturedArticleCard from "./FeaturedArticleCard";
import { getArticleKey } from "./magazineUtils";

/**
 * @param {{
 *   main?: object | null,
 *   articles?: object[],
 *   titleAs?: string,
 *   priority?: boolean,
 * }} props
 */
export default function MagazineHero({
  main,
  articles = [],
  titleAs,
  priority = true,
}) {
  const side = articles.filter(Boolean);
  const featured = main ?? side[0] ?? null;
  const rest = main ? side : side.slice(1);

  if (!featured) return null;

  if (!rest.length) {
    return (
      <div>
        <FeaturedArticle
          article={featured}
          priority={priority}
          titleAs={titleAs}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-5">
      <div className="min-w-0 lg:col-span-3">
        <FeaturedArticle
          article={featured}
          priority={priority}
          titleAs={titleAs}
        />
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2">
        {rest.map((article) => (
          <div key={getArticleKey(article)} className="min-h-36 min-w-0">
            <FeaturedArticleCard article={article} titleAs={titleAs} />
          </div>
        ))}
      </div>
    </div>
  );
}
