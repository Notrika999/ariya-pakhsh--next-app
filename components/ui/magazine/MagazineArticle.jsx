import Image from "next/image";
import Link from "next/link";
import NewsletterCTA from "./NewsletterCTA";
import MagazineTableOfContents from "./MagazineTableOfContents";
import MagazineArticleBody from "./MagazineArticleBody";
import MagazineRelatedProducts from "./MagazineRelatedProducts";
import MagazineReadingProgress from "./MagazineReadingProgress";
import ArticleGrid from "./ArticleGrid";
import { toMagazineArticle } from "./magazineView";
import { getBlogHomeHref } from "@/components/ui/magazine/magazineHomeUtils";

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
    <nav
      aria-label="مسیر صفحه"
      className="rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-xs text-slate-500 shadow-[0_10px_30px_-28px_rgba(15,23,42,0.55)] backdrop-blur-sm dark:border-zinc-800 dark:bg-custom-dark/80 dark:text-gray-400"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link
            href="/mag"
            className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-slate-200"
          >
            <i className="far fa-newspaper" aria-hidden="true" />
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

export default function MagazineArticle({ article }) {
  const relatedArticles = article.relatedArticles
    .map(toMagazineArticle)
    .filter(Boolean);
  const extraFaqs = article.faqs || [];
  const contentHasFaqs = article.content.some(
    (block) => block.type === "faqGroup",
  );
  const metaParts = [
    article.publishedAt
      ? { icon: "far fa-calendar", label: article.publishedAt }
      : null,
    article.readingTime
      ? { icon: "far fa-clock", label: article.readingTime }
      : null,
  ].filter(Boolean);

  return (
    <article className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-5 pb-16 md:gap-8 md:px-6 md:py-8 md:pb-16 lg:px-8">
      <JsonLd data={article.structuredData} />
      <ArticleBreadcrumb article={article} />

      <header className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-bl from-white via-white to-slate-100 shadow-[0_24px_65px_-46px_rgba(15,23,42,0.6)] dark:border-zinc-800 dark:from-custom-dark dark:via-custom-dark dark:to-slate-950">
        <span className="absolute inset-y-0 start-0 w-1 bg-slate-800 dark:bg-slate-500" aria-hidden="true" />
        <span className="absolute -end-16 -top-24 size-64 rounded-full border border-slate-200/80 dark:border-white/5" aria-hidden="true" />
        <div className="relative space-y-5 p-5 md:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            {article.category ? (
              <Link
                href={getBlogHomeHref({ category: article.category.slug })}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 transition hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:bg-amber-900/30 dark:text-amber-200"
              >
                <span className="size-1.5 rounded-full bg-amber-600" aria-hidden="true" />
                {article.category.title}
              </Link>
            ) : null}
            {article.articleTypeLabel ? (
              <span className="inline-flex rounded-full bg-slate-200/80 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-zinc-800 dark:text-gray-300">
                {article.articleTypeLabel}
              </span>
            ) : null}
          </div>

          <h1 className="max-w-6xl text-[1.65rem] font-black leading-[1.65] tracking-tight text-slate-950 md:text-4xl md:leading-[1.55] dark:text-white">
            {article.title}
          </h1>

          {article.excerpt ? (
            <p className="max-w-5xl text-justify text-[15px] leading-8 text-slate-600 md:text-base md:leading-9 dark:text-slate-300">
              {article.excerpt}
            </p>
          ) : null}

          <div className="flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
            {article.author ? (
              <div className="flex items-center gap-3">
                {article.author.avatar ? (
                  <Image
                    src={article.author.avatar}
                    alt={article.author.displayName}
                    width={40}
                    height={40}
                    className="size-10 rounded-full border-2 border-white object-cover shadow-sm dark:border-zinc-700"
                  />
                ) : (
                  <span className="grid size-10 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-slate-700" aria-hidden="true">
                    {article.author.displayName.slice(0, 1)}
                  </span>
                )}
                <span>
                  <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">
                    {article.author.displayName}
                  </span>
                  {article.author.jobTitle ? (
                    <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                      {article.author.jobTitle}
                    </span>
                  ) : null}
                </span>
              </div>
            ) : null}

            {metaParts.length ? (
              <p className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {metaParts.map((part) => (
                  <span
                    key={part.label}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1.5 ring-1 ring-slate-200 dark:bg-zinc-900/70 dark:ring-zinc-700"
                  >
                    <i className={part.icon} aria-hidden="true" />
                    {part.label}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      {article.featuredImage ? (
        <figure
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.65)] md:p-2 dark:border-zinc-800 dark:bg-custom-dark"
          itemProp="image"
        >
          <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-900">
            <Image
              src={article.featuredImage}
              alt={article.featuredImageAlt || article.title}
              fill
              priority
              fetchPriority="high"
              quality={86}
              sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1279px) calc(100vw - 3rem), 1184px"
              className="object-cover"
            />
          </div>
        </figure>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-8">
        <aside className="hidden lg:sticky lg:top-24 lg:block">
          <MagazineTableOfContents items={article.tableOfContents} />
        </aside>

        <div
          id="magazine-article-content"
          className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_22px_60px_-45px_rgba(15,23,42,0.6)] md:p-8 lg:p-10 dark:border-zinc-800 dark:bg-custom-dark"
        >
          {article.tableOfContents.length ? (
            <div className="mb-6 lg:hidden">
              <MagazineTableOfContents
                items={article.tableOfContents}
                collapsible
              />
            </div>
          ) : null}

          <div className="mx-auto max-w-3xl">
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
              <section className="mt-10 border-t border-slate-200 pt-6 dark:border-zinc-800" aria-labelledby="article-tags-heading">
                <h2 id="article-tags-heading" className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                  <i className="far fa-tags text-slate-400" aria-hidden="true" />
                  برچسب‌های این مطلب
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <li key={tag.slug}>
                      <Link
                        href={getBlogHomeHref({ tag: tag.slug })}
                        className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 transition hover:border-slate-400 hover:bg-white hover:text-slate-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300"
                      >
                        # {tag.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </div>

      </div>

      <MagazineRelatedProducts
        products={article.relatedProducts}
        articleId={article.articleId}
      />

      {relatedArticles.length ? (
        <section
          aria-labelledby="related-articles-heading"
          className="rounded-2xl border border-t-4 border-slate-200 border-t-cyan-700/70 bg-cyan-50/35 p-5 shadow-[0_18px_55px_-42px_rgba(15,23,42,0.55)] md:p-8 dark:border-cyan-950/70 dark:border-t-cyan-600 dark:bg-cyan-950/10"
        >
          <div className="mb-5 flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-900 text-white dark:bg-cyan-800" aria-hidden="true">
              <i className="far fa-layer-group" />
            </span>
            <div>
              <h2
                id="related-articles-heading"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                مطالب مرتبط
              </h2>
              <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">
                برای ادامه مطالعه، این مطالب را هم ببینید.
              </p>
            </div>
          </div>
          <ArticleGrid articles={relatedArticles} />
        </section>
      ) : null}

      <NewsletterCTA />
      <MagazineReadingProgress articleId={article.articleId} />
    </article>
  );
}
