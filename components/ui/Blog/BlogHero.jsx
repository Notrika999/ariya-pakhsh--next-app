import Link from "next/link";
import styles from "./blogHome.module.css";

export default function BlogHero() {
  return (
    <header className={styles.hero}>
      <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
        <ol className={styles.breadcrumbList}>
          <li>
            <Link href="/" className={styles.breadcrumbLink}>
              خانه
            </Link>
          </li>
          <li className={styles.breadcrumbSep} aria-hidden="true">
            <i className="fas fa-angle-left" />
          </li>
          <li>
            <span className={styles.breadcrumbCurrent} aria-current="page">
              مجله
            </span>
          </li>
        </ol>
      </nav>

      <span className={styles.heroKicker} aria-hidden="true" />
      <h1 className={styles.heroTitle}>مجله کارآپ 24</h1>
      <p className={styles.heroSubtitle}>
        راهنمای انتخاب، خرید و استفاده از لوازم جانبی و تجهیزات خودرو
      </p>
      <p className={styles.heroLead}>
        نکات مقایسه، انتخاب و استفاده از تجهیزات خودرو را اینجا به‌صورت دقیق و
        کاربردی می‌خوانید.
      </p>
    </header>
  );
}
