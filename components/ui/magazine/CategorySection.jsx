import ArticleCard from "./ArticleCard";
import SectionHeading from "./SectionHeading";
import { getBlogHomeHref } from "@/components/ui/Blog/blogHomeUtils";
import { getArticleKey } from "./magazineUtils";

export default function CategorySection({
  title,
  slug,
  articles = [],
}) {
  if (!articles.length) return null;

  const [featured, ...rest] = articles;

  return (
    <section aria-labelledby={`category-${slug}`}>
      <SectionHeading
        title={title}
        titleId={`category-${slug}`}
        href={getBlogHomeHref({ category: slug })}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-2">
          <ArticleCard article={featured} variant="editorial" />
        </div>
        {rest.slice(0, 2).map((article) => (
          <ArticleCard key={getArticleKey(article)} article={article} />
        ))}
      </div>
    </section>
  );
}
