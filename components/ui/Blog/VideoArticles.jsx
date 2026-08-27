import ArticleCard from "./ArticleCard";
import BlogSectionHeader from "./BlogSectionHeader";
import styles from "./blogHome.module.css";

export default function VideoArticles({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section className={styles.section} aria-labelledby="video-guides">
      <BlogSectionHeader title="راهنمای ویدیویی" titleId="video-guides" />

      <div className={styles.videoGrid}>
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} variant="video" />
        ))}
      </div>
    </section>
  );
}
