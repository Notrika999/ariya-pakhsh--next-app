import ArticleCard from "./ArticleCard";
import SectionHeading from "./SectionHeading";
import { getArticleKey } from "./magazineUtils";
import { getBlogHomeHref } from "@/components/ui/magazine/magazineHomeUtils";

export default function LatestArticles({ articles = [] }) {
  if (!articles.length) return null;

  return (
    <section aria-labelledby="latest-articles-heading">
      <SectionHeading
        title="آخرین مطالب"
        titleId="latest-articles-heading"
        href={getBlogHomeHref({ list: true })}
      />
      <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
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
