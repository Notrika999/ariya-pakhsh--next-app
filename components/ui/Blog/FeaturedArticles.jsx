import ArticleCard from "./ArticleCard";
import BlogSectionHeader from "./BlogSectionHeader";
import styles from "./blogHome.module.css";

export default function FeaturedArticles({ posts = [] }) {
  if (!posts.length) return null;

  const [heroPost, ...sidePosts] = posts;

  return (
    <section className={styles.section} aria-labelledby="featured-articles">
      <BlogSectionHeader title="مقالات منتخب" titleId="featured-articles" />

      <div className={styles.featuredGrid}>
        <div className={styles.featuredMain}>
          <ArticleCard post={heroPost} variant="featured" priority />
        </div>

        {sidePosts.map((post) => (
          <ArticleCard key={post.id} post={post} variant="compact" />
        ))}
      </div>
    </section>
  );
}
