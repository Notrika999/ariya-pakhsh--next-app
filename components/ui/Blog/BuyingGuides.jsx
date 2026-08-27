import ArticleCard from "./ArticleCard";
import BlogSectionHeader from "./BlogSectionHeader";
import styles from "./blogHome.module.css";

export default function BuyingGuides({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section className={styles.section} aria-labelledby="buying-guides">
      <BlogSectionHeader
        title="راهنمای خرید"
        titleId="buying-guides"
        description="برای انتخاب بهتر لوازم خودرو، قبل از خرید این راهنماها را ببینید."
      />

      <div className={styles.buyingGrid}>
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} variant="horizontal" />
        ))}
      </div>
    </section>
  );
}
