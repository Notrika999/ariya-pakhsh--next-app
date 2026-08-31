import ArticleCard from "./ArticleCard";
import SectionHeading from "./SectionHeading";
import { getArticleKey } from "./magazineUtils";

export default function LatestArticles({ articles = [] }) {
  if (!articles.length) return null;

  return (
    <section aria-labelledby="latest-articles-heading">
      <SectionHeading
        title="آخرین مطالب"
        titleId="latest-articles-heading"
        href="/mag"
      />
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
        {articles.map((article) => (
          <div
            key={getArticleKey(article)}
            className="w-[78%] shrink-0 sm:w-[58%] md:w-auto"
          >
            <ArticleCard article={article} variant="latest" />
          </div>
        ))}
      </div>
    </section>
  );
}
