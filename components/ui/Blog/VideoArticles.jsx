import ArticleCard from "./ArticleCard";
import BlogSectionHeader from "./BlogSectionHeader";
import styles from "./blogHome.module.css";
import { getPostKey } from "./blogHomeUtils";

export default function VideoArticles({
  posts = [],
  title = "راهنمای ویدیویی",
  description,
}) {
  if (!posts.length) return null;

  return (
    <section className={styles.section} aria-labelledby="video-guides">
      <BlogSectionHeader
        title={title}
        description={description}
        titleId="video-guides"
      />

      <div className={styles.videoGrid}>
        {posts.map((post) => (
          <ArticleCard key={getPostKey(post)} post={post} variant="video" />
        ))}
      </div>
    </section>
  );
}
