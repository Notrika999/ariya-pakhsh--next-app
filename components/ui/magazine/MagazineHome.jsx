import MagazineHero from "./MagazineHero";
import LatestArticles from "./LatestArticles";
import EditorialSection from "./EditorialSection";
import ArticleGrid from "./ArticleGrid";
import MagazineSidebar from "./MagazineSidebar";
import CategorySection from "./CategorySection";
import NewsletterCTA from "./NewsletterCTA";
import Pagination from "@/components/modules/Pagination/Pagination";
import { getCategoryLabel } from "@/components/ui/magazine/magazineHomeUtils";
import Link from "next/link";
import SectionRenderer from "./sections/SectionRenderer";
import { MAGAZINE_SECTION_SHELL } from "./sections/MagazineSection";

function MagazinePageFrame({ children }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 overflow-x-clip px-4 py-6 md:gap-5 md:px-6 md:py-8 lg:px-8">
      <nav
        aria-label="مسیر صفحه"
        className="text-sm text-gray-500 dark:text-gray-400"
      >
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
        </ol>
      </nav>
      {children}
      <NewsletterCTA />
    </div>
  );
}

export function MagazineListing({
  query = "",
  category = "all",
  categories = [],
  posts = [],
  page = 1,
  totalPages = 1,
}) {
  const title = query.trim()
    ? "نتایج جستجو"
    : getCategoryLabel(category, categories);

  return (
    <MagazinePageFrame>
      <section
        aria-labelledby="magazine-listing-title"
        className={MAGAZINE_SECTION_SHELL}
      >
        <h1
          id="magazine-listing-title"
          className="mb-5 text-lg font-bold text-gray-900 dark:text-white"
        >
          {title}
        </h1>
        <ArticleGrid
          articles={posts}
          emptyMessage="مقاله‌ای با این مشخصات پیدا نشد."
        />
        {totalPages > 1 ? (
          <Pagination page={page} totalPages={totalPages} />
        ) : null}
      </section>
    </MagazinePageFrame>
  );
}

function MagazineHomeFallback({ model }) {
  return (
    <>
      {model.heroMain || model.heroSide.length ? (
        <div className={MAGAZINE_SECTION_SHELL}>
          <MagazineHero main={model.heroMain} articles={model.heroSide} />
        </div>
      ) : null}
      {model.latest.length ? (
        <div className={MAGAZINE_SECTION_SHELL}>
          <LatestArticles articles={model.latest} />
        </div>
      ) : null}
      {model.editorial ? (
        <div className={MAGAZINE_SECTION_SHELL}>
          <EditorialSection article={model.editorial} />
        </div>
      ) : null}

      {model.grid.length || model.popular.length || model.newest.length ? (
        <section
          aria-labelledby="all-articles-heading"
          className={`grid gap-6 lg:grid-cols-12 ${MAGAZINE_SECTION_SHELL}`}
        >
          <div className="lg:col-span-9">
            <h2
              id="all-articles-heading"
              className="mb-4 text-lg font-bold text-gray-900 dark:text-white"
            >
              مطالب منتخب مجله
            </h2>
            <ArticleGrid articles={model.grid} />
          </div>
          <div className="lg:col-span-3">
            <MagazineSidebar popular={model.popular} latest={model.newest} />
          </div>
        </section>
      ) : null}

      {model.categorySections.map((section) => (
        <div key={section.slug} className={MAGAZINE_SECTION_SHELL}>
          <CategorySection
            title={section.title}
            slug={section.slug}
            articles={section.articles}
          />
        </div>
      ))}
    </>
  );
}

export default function MagazineHome({ model, sections = [] }) {
  const hasSections = sections.length > 0;
  const hasFallback = Boolean(model);

  return (
    <MagazinePageFrame>
      <h1 className="sr-only">
        مجله خودرو کارآپ۲۴ | راهنمای خرید، نگهداری و لوازم خودرو
      </h1>
      {hasSections ? (
        sections.map((section, index) => (
          <SectionRenderer
            key={section.key || section.id || index}
            section={section}
            priority={index === 0}
          />
        ))
      ) : hasFallback ? (
        <MagazineHomeFallback model={model} />
      ) : (
        <section className={MAGAZINE_SECTION_SHELL}>
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            به‌زودی مقالات مجله اینجا منتشر می‌شوند.
          </p>
        </section>
      )}
    </MagazinePageFrame>
  );
}
