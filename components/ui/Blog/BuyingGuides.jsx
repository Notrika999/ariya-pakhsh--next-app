import ArticleCard from "./ArticleCard";
import BlogSectionHeader from "./BlogSectionHeader";
import styles from "./blogHome.module.css";
import { getPostKey } from "./blogHomeUtils";

export default function BuyingGuides({
  posts = [],
  title = "راهنمای خرید",
  description = "برای انتخاب بهتر لوازم خودرو، قبل از خرید این راهنماها را ببینید.",
}) {
  if (!posts.length) return null;

  return (
    <section className={styles.section} aria-labelledby="buying-guides">
      <BlogSectionHeader
        title={title}
        titleId="buying-guides"
        description={description}
      />

      <div className={styles.buyingGrid}>
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
