import ArticleCard from "./ArticleCard";
import BlogSectionHeader from "./BlogSectionHeader";
import styles from "./blogHome.module.css";
import { getPostKey } from "./blogHomeUtils";

export default function PopularArticles({
  posts = [],
  title = "مطالب پیشنهادی",
  description,
}) {
  if (!posts.length) return null;

  return (
    <section className={styles.section} aria-labelledby="popular-articles">
      <BlogSectionHeader
        title={title}
        description={description}
        titleId="popular-articles"
      />

      <div className={styles.popularGrid}>
        {posts.map((post) => (
          <ArticleCard
            key={getPostKey(post)}
            post={post}
            variant="horizontal"
          />
        ))}
      </div>
    </section>
  );
}
