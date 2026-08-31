import ArticleCard from "./ArticleCard";

export default function EditorialSection({ article }) {
  if (!article) return null;

  return (
    <section aria-labelledby="editorial-heading">
      <h2 id="editorial-heading" className="sr-only">
        مطلب منتخب تحریریه
      </h2>
      <ArticleCard article={article} variant="editorial" />
    </section>
  );
}
