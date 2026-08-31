import BlogHero from "./BlogHero";
import BlogSearch from "./BlogSearch";
import BlogCategories from "./BlogCategories";
import ArticleGrid from "./ArticleGrid";
import MagazineSections from "./MagazineSections";
import Pagination from "@/components/modules/Pagination/Pagination";
import { getCategoryLabel } from "./blogHomeUtils";
import styles from "./blogHome.module.css";

export default function Blog({
  query = "",
  category = "all",
  articleType = "",
  tag = "",
  sort = "",
  categories = [],
  sections = [],
  posts = [],
  page = 1,
  totalPages = 1,
  showListing = true,
}) {
  const searchQuery = query.trim();
  const latestTitle = searchQuery
    ? "نتایج جستجو"
    : getCategoryLabel(category, categories);

  return (
    <div className={styles.blogHome}>
      <div className={styles.container}>
        <BlogHero />
        <BlogSearch
          query={searchQuery}
          category={category}
          articleType={articleType}
          tag={tag}
          sort={sort}
        />
        <BlogCategories
          categories={categories}
          activeCategory={category}
          query={searchQuery}
          articleType={articleType}
          tag={tag}
          sort={sort}
        />

        {!showListing && sections.length ? (
          <MagazineSections sections={sections} />
        ) : (
          <>
            <ArticleGrid
              posts={posts}
              title={latestTitle}
              showViewAll={false}
              emptyMessage={
                searchQuery || category !== "all" || articleType || tag
                  ? "مقاله‌ای با این مشخصات پیدا نشد."
                  : "به‌زودی مقالات مجله اینجا منتشر می‌شوند."
              }
            />
            {totalPages > 1 ? (
              <Pagination page={page} totalPages={totalPages} />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
