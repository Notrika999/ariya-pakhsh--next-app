import Image from "next/image";
import Link from "next/link";
import NewsletterCTA from "./NewsletterCTA";
import MagazineArticleBody from "./MagazineArticleBody";
import MagazineRelatedProducts from "./MagazineRelatedProducts";
import MagazineReadingProgress from "./MagazineReadingProgress";
import ArticleGrid from "./ArticleGrid";
import { toMagazineArticle } from "./magazineView";
import { getBlogHomeHref } from "@/components/ui/Blog/blogHomeUtils";

function JsonLd({ data }) {
  if (!data?.length) return null;

  return data.map((item, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(item).replace(/</g, "\\u003c"),
      }}
    />
  ));
}

function ArticleBreadcrumb({ article }) {
  return (
    <nav aria-label="مسیر صفحه" className="text-sm text-gray-500 dark:text-gray-400">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link
            href="/"
            className="hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            فروشگاه
          </Link>
        </li>
        <li aria-hidden="true">
          <i className="fas fa-angle-left text-[10px]" />
        </li>
        <li>
          <Link
            href="/mag"
            className="hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            مجله
          </Link>
        </li>
        {article.category ? (
          <>
            <li aria-hidden="true">
              <i className="fas fa-angle-left text-[10px]" />
            </li>
            <li>
              <Link
                href={getBlogHomeHref({ category: article.category.slug })}
                className="hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {article.category.title}
              </Link>
            </li>
          </>
        ) : null}
        <li aria-hidden="true">
          <i className="fas fa-angle-left text-[10px]" />
        </li>
        <li className="line-clamp-1 font-medium text-gray-700 dark:text-gray-200">
          {article.title}
        </li>
      </ol>
    </nav>
  );
}

function TableOfContents({ items }) {
  if (!items?.length) return null;

  return (
    <nav
      aria-label="فهرست مطالب"
      className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-custom-dark"
    >
      <p className="mb-3 text-sm font-bold text-gray-900 dark:text-white">
        فهرست مطالب
      </p>
      <ol className="space-y-1.5">
        {items.map((item) => (
          <li key={item.anchor}>
            <a
              href={`#${item.anchor}`}
              className={`block text-sm leading-6 text-gray-600 hover:text-primary dark:text-gray-300 ${
                item.level > 2 ? "pr-3 text-[13px]" : "font-medium"
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function MagazineArticle({ article }) {
  const relatedArticles = article.relatedArticles
    .map(toMagazineArticle)
    .filter(Boolean);
  const extraFaqs = article.faqs || [];
  const contentHasFaqs = article.content.some((block) => block.type === "faqGroup");
  const metaParts = [
    article.author?.displayName,
    article.author?.jobTitle,
    article.publishedAt,
    article.readingTime,
  ].filter(Boolean);

  return (
    <article className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 pb-16 md:px-6 md:py-8 md:pb-16 lg:px-8">
      <JsonLd data={article.structuredData} />
      <ArticleBreadcrumb article={article} />

      <header className="space-y-4 rounded-xl bg-white p-5 md:p-8 dark:bg-custom-dark">
        <div className="flex flex-wrap items-center gap-2">
          {article.category ? (
            <Link
              href={getBlogHomeHref({ category: article.category.slug })}
              className="inline-flex rounded-sm bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
            >
              {article.category.title}
            </Link>
          ) : null}
          {article.articleTypeLabel ? (
            <span className="inline-flex rounded-sm bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
              {article.articleTypeLabel}
            </span>
          ) : null}
        </div>

        <h1 className="text-2xl font-bold leading-10 text-gray-900 md:text-3xl md:leading-12 dark:text-white">
          {article.title}
        </h1>

        {article.excerpt ? (
          <p className=" text-[15px] text-justify leading-8 text-gray-600 dark:text-gray-300">
            {article.excerpt}
          </p>
        ) : null}

        {metaParts.length ? (
          <p className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500 dark:text-gray-400">
            {article.author?.avatar ? (
              <Image
                src={article.author.avatar}
                alt=""
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
            ) : null}
            {metaParts.map((part, index) => (
              <span key={`${part}-${index}`} className="inline-flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden="true" className="opacity-50">
                    ·
                  </span>
                ) : null}
                {part}
              </span>
            ))}
          </p>
        ) : null}
      </header>

      {article.featuredImage ? (
        <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-800">
          <Image
            src={article.featuredImage}
            alt={article.featuredImageAlt || article.title}
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 1120px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-12">
        <div
          id="magazine-article-content"
          className="min-w-0 rounded-xl bg-white p-5 md:p-8 lg:col-span-8 dark:bg-custom-dark"
        >
          {article.tableOfContents.length ? (
            <div className="mb-6 lg:hidden">
              <details className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-custom-dark">
                <summary className="cursor-pointer text-sm font-bold text-gray-900 dark:text-white">
                  فهرست مطالب
                </summary>
                <ol className="mt-3 space-y-1.5">
                  {article.tableOfContents.map((item) => (
                    <li key={item.anchor}>
                      <a
                        href={`#${item.anchor}`}
                        className={`block text-sm leading-6 text-gray-600 hover:text-primary ${
                          item.level > 2 ? "pr-3" : ""
                        }`}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            </div>
          ) : null}

          <MagazineArticleBody
            blocks={article.content}
            articleId={article.articleId}
          />

          {!contentHasFaqs && extraFaqs.length ? (
            <MagazineArticleBody
              blocks={[{ type: "faqGroup", items: extraFaqs }]}
            />
          ) : null}

          {article.tags.length ? (
            <ul className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <li key={tag.slug}>
                  <Link
                    href={getBlogHomeHref({ tag: tag.slug })}
                    className="inline-flex rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition hover:border-primary hover:text-primary dark:border-zinc-700 dark:bg-custom-dark dark:text-gray-300"
                  >
                    {tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <aside className="lg:col-span-4">
          <div className="hidden lg:sticky lg:top-24 lg:block">
            <TableOfContents items={article.tableOfContents} />
          </div>
        </aside>
      </div>

      <MagazineRelatedProducts
        products={article.relatedProducts}
        articleId={article.articleId}
      />

      {relatedArticles.length ? (
        <section aria-labelledby="related-articles-heading">
          <h2
            id="related-articles-heading"
            className="mb-4 text-lg font-bold text-gray-900 dark:text-white"
          >
            مطالب مرتبط
          </h2>
          <ArticleGrid articles={relatedArticles} />
        </section>
      ) : null}

      <NewsletterCTA />
      <MagazineReadingProgress articleId={article.articleId} />
    </article>
  );
}
