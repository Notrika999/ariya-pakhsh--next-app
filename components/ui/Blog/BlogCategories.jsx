import Link from "next/link";
import styles from "./blogHome.module.css";
import { getBlogHomeHref } from "./blogHomeUtils";

export default function BlogCategories({
  categories = [],
  activeCategory = "all",
  query = "",
  articleType = "",
  tag = "",
  sort = "",
}) {
  const items = [{ slug: "all", title: "همه" }, ...categories];

  return (
    <div className={styles.categoryBlock}>
      <nav aria-label="دسته‌بندی مطالب">
        <div className={styles.categories}>
          {items.map((item) => {
            const isActive = item.slug === activeCategory;

            return (
              <Link
                key={item.slug}
                href={getBlogHomeHref({
                  category: item.slug,
                  q: query,
                  articleType: item.slug === "all" ? "" : articleType,
                  tag,
                  sort,
                })}
                className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
