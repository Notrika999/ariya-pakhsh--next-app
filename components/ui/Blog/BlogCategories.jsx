import Link from "next/link";
import styles from "./blogHome.module.css";
import { BLOG_CATEGORIES, getBlogHomeHref } from "./blogHomeUtils";

export default function BlogCategories({
  activeCategory = "all",
  query = "",
}) {
  return (
    <div className={styles.categoryBlock}>
      <nav aria-label="دسته‌بندی مطالب">
        <div className={styles.categories}>
          {BLOG_CATEGORIES.map((item) => {
            const isActive = item.id === activeCategory;

            return (
              <Link
                key={item.id}
                href={getBlogHomeHref({ category: item.id, q: query })}
                className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
