import Image from "next/image";
import Link from "next/link";
import { getBlogHref } from "../blogData";
import styles from "./blogArticle.module.css";

export default function BlogRelatedReads({ posts = [] }) {
  const item = posts[0];
  if (!item) return null;

  return (
    <aside className={styles.block} aria-label="خواندنی‌ها">
      <div className={styles.reads}>
        <span className={styles.readsLabel}>خواندنی‌ها</span>
        <Link href={getBlogHref(item)} className={styles.readLink}>
          <span className={styles.readThumb}>
            <Image
              src={item.image || "/images/default.png"}
              alt={item.title}
              fill
              sizes="72px"
              className={styles.image}
            />
          </span>
          <span className={styles.readTitle}>{item.title}</span>
        </Link>
      </div>
    </aside>
  );
}
