import ArticleCard from "./ArticleCard";
import BlogSectionHeader from "./BlogSectionHeader";
import styles from "./blogHome.module.css";
import { getPostKey } from "./blogHomeUtils";

export default function FeaturedArticles({
  posts = [],
  title = "مقالات منتخب",
  description,
}) {
  if (!posts.length) return null;

  const [heroPost, ...sidePosts] = posts;

  return (
    <section className={styles.section} aria-labelledby="featured-articles">
      <BlogSectionHeader
        title={title}
        description={description}
        titleId="featured-articles"
      />

      <div className={styles.featuredGrid}>
        <div className={styles.featuredMain}>
          <ArticleCard post={heroPost} variant="featured" priority />
        </div>

        {sidePosts.map((post) => (
          <ArticleCard
            key={getPostKey(post)}
            post={post}
            variant="compact"
          />
        ))}
      </div>
    </section>
  );
}
