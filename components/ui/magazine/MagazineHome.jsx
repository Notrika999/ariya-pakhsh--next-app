import MagazineHero from "./MagazineHero";
import LatestArticles from "./LatestArticles";
import EditorialSection from "./EditorialSection";
import ArticleGrid from "./ArticleGrid";
import MagazineSidebar from "./MagazineSidebar";
import CategorySection from "./CategorySection";
import NewsletterCTA from "./NewsletterCTA";
import MagazinePagination from "@/components/ui/magazine/MagazinePagination";
import { getCategoryLabel } from "@/components/ui/magazine/magazineHomeUtils";
import Link from "next/link";
import SectionRenderer from "./sections/SectionRenderer";
import MagazineSection, {
  MAGAZINE_SECTION_SHELL,
} from "./sections/MagazineSection";

const CATEGORY_DESCRIPTIONS = {
  "buying-guide": "راهنماهای دقیق برای انتخاب و خرید مطمئن‌تر لوازم و تجهیزات خودرو",
  "how-to": "آموزش‌های مرحله‌به‌مرحله برای استفاده بهتر و انجام کارهای ضروری خودرو",
  "reviews-comparisons": "بررسی تخصصی و مقایسه واقعی محصولات، امکانات و تجهیزات خودرو",
  "car-maintenance": "نکات کاربردی برای نگهداری اصولی، افزایش عمر و عملکرد بهتر خودرو",
  video: "آموزش‌ها، بررسی‌ها و راهنماهای ویدیویی مجله خودرو",
  "news-technology": "تازه‌ترین خبرها و فناوری‌های مهم صنعت خودرو",
  "car-accessories": "معرفی، انتخاب و استفاده از تجهیزات و لوازم جانبی خودرو",
  troubleshooting: "نشانه‌ها، علت‌ها و راه‌حل مشکلات متداول خودرو",
};

const ARTICLE_TYPE_LABELS = {
  standard: "مقاله",
  buyingGuide: "راهنمای خرید",
  howTo: "آموزش",
  review: "بررسی",
  comparison: "مقایسه",
  video: "ویدئو",
  news: "خبر",
};

function getListingPresentation({
  query,
  category,
  categories,
  articleType,
  tag,
  vehicle,
  list,
}) {
  const categoryTitle = getCategoryLabel(category, categories);
  const categorySlug = category !== "all" ? category : null;

  if (query.trim()) {
    return {
      title: "نتایج جستجو",
      subtitle: `مطالب مرتبط با «${query.trim()}» در مجله کارآپ۲۴`,
      sectionType: categorySlug ? "categoryArticles" : "compactArticles",
      categorySlug,
    };
  }

  if (tag.trim()) {
    return {
      title: `برچسب «${tag.trim()}»`,
      subtitle: "تمام مطالب منتشرشده با این برچسب",
      sectionType: categorySlug ? "categoryArticles" : "compactArticles",
      categorySlug,
    };
  }

  if (vehicle.trim()) {
    return {
      title: "مطالب مرتبط با خودروی انتخاب‌شده",
      subtitle: "راهنماها و مطالبی که با خودروی انتخاب‌شده ارتباط دارند",
      sectionType: "vehicleArticles",
      categorySlug,
    };
  }

  if (list) {
    return {
      title: "همه مطالب مجله",
      subtitle: "آرشیو کامل راهنماها، آموزش‌ها، بررسی‌ها و مطالب خودرو به ترتیب انتشار",
      sectionType: "latest",
      categorySlug,
    };
  }

  if (categorySlug) {
    return {
      title: categoryTitle,
      subtitle:
        CATEGORY_DESCRIPTIONS[categorySlug] ||
        `جدیدترین مطالب منتشرشده در دسته ${categoryTitle}`,
      sectionType: "categoryArticles",
      categorySlug,
    };
  }

  if (articleType) {
    const typeLabel = ARTICLE_TYPE_LABELS[articleType] || "مقالات منتخب";
    return {
      title: typeLabel,
      subtitle: `تمام مطالب مجله با نوع ${typeLabel}`,
      sectionType:
        articleType === "buyingGuide"
          ? "buyingGuides"
          : articleType === "review"
            ? "reviews"
            : articleType === "comparison"
              ? "comparisons"
              : "compactArticles",
      categorySlug: null,
    };
  }

  return {
    title: "آخرین مقالات",
    subtitle: "جدیدترین مطالب منتشرشده در مجله خودرو کارآپ۲۴",
    sectionType: "latest",
    categorySlug: null,
  };
}

function MagazinePageFrame({ children, breadcrumbLabel = "" }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 overflow-x-clip px-4 py-5 md:gap-6 md:px-6 md:py-8 lg:px-8">
      <nav
        aria-label="مسیر صفحه"
        className="text-sm text-slate-500 dark:text-gray-400"
      >
        <ol className="flex flex-wrap items-center">
          <li aria-current={breadcrumbLabel ? undefined : "page"}>
            <Link
              href="/mag"
              className="inline-flex items-center gap-2 rounded-lg bg-white/70 px-3 py-1.5 font-medium text-slate-600 shadow-sm ring-1 ring-slate-200/80 transition hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:bg-zinc-900/70 dark:text-slate-300 dark:ring-zinc-800"
            >
              <i className="far fa-newspaper text-xs" aria-hidden="true" />
              مجله
            </Link>
          </li>
          {breadcrumbLabel ? (
            <>
              <li aria-hidden="true" className="px-2 text-slate-400">
                <i className="far fa-angle-left text-[10px]" />
              </li>
              <li
                aria-current="page"
                className="max-w-[min(65vw,28rem)] truncate font-medium text-slate-700 dark:text-slate-200"
              >
                {breadcrumbLabel}
              </li>
            </>
          ) : null}
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
  articleType = "",
  tag = "",
  vehicle = "",
  sort = "",
  list = false,
  pageSize,
}) {
  const presentation = getListingPresentation({
    query,
    category,
    categories,
    articleType,
    tag,
    vehicle,
    list,
  });

  const activeFilters = [
    articleType
      ? `نوع: ${ARTICLE_TYPE_LABELS[articleType] || articleType}`
      : "",
    tag.trim() ? `برچسب: ${tag.trim()}` : "",
    vehicle.trim() ? "فیلتر خودرو فعال است" : "",
    sort === "popular" ? "مرتب‌سازی: محبوب‌ترین" : "",
  ].filter(Boolean);

  return (
    <MagazinePageFrame breadcrumbLabel={presentation.title}>
      <MagazineSection
        title={presentation.title}
        subtitle={presentation.subtitle}
        titleId="magazine-listing-title"
        titleAs="h1"
        sectionType={presentation.sectionType}
        categorySlug={presentation.categorySlug}
      >
        {activeFilters.length ? (
          <div className="mb-5 flex flex-wrap gap-2" aria-label="فیلترهای فعال">
            {activeFilters.map((filter) => (
              <span
                key={filter}
                className="inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-slate-300"
              >
                {filter}
              </span>
            ))}
          </div>
        ) : null}
        <ArticleGrid
          articles={posts}
          emptyMessage="مقاله‌ای با این مشخصات پیدا نشد."
          titleAs="h2"
          priorityCount={3}
        />
        <MagazinePagination
          page={page}
          totalPages={totalPages}
          hrefParams={{
            category,
            q: query,
            articleType,
            tag,
            vehicle,
            sort,
            list,
            pageSize,
          }}
        />
      </MagazineSection>
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
