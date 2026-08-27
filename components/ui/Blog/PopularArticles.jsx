import ArticleCard from "./ArticleCard";
import BlogSectionHeader from "./BlogSectionHeader";
import styles from "./blogHome.module.css";

export default function PopularArticles({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section className={styles.section} aria-labelledby="popular-articles">
      <BlogSectionHeader title="مطالب پیشنهادی" titleId="popular-articles" />

      <div className={styles.popularGrid}>
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} variant="horizontal" />
        ))}
      </div>
    </section>
  );
}
