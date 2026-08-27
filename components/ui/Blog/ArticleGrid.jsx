import Link from "next/link";
import ArticleCard from "./ArticleCard";
import BlogSectionHeader from "./BlogSectionHeader";
import styles from "./blogHome.module.css";
import { getBlogHomeHref } from "./blogHomeUtils";

export default function ArticleGrid({
  posts = [],
  title = "آخرین مقالات",
  showViewAll = true,
  viewAllHref,
  emptyMessage = "مقاله‌ای با این مشخصات پیدا نشد.",
}) {
  return (
    <section
      className={styles.section}
      id="latest-articles"
      aria-labelledby="latest-articles-title"
    >
      <BlogSectionHeader
        title={title}
        titleId="latest-articles-title"
        action={
          showViewAll ? (
            <Link
              href={viewAllHref ?? getBlogHomeHref()}
              className={styles.sectionAction}
            >
              مشاهده همه مقالات
              <i className="far fa-arrow-left-long" aria-hidden="true" />
            </Link>
          ) : null
        }
      />

      {posts.length ? (
        <div className={styles.articleGrid}>
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>{emptyMessage}</p>
      )}
    </section>
  );
}
