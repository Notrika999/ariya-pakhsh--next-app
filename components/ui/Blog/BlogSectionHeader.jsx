import styles from "./blogHome.module.css";

export default function BlogSectionHeader({
  title,
  description,
  action,
  titleId,
}) {
  return (
    <header className={styles.sectionHeader}>
      <div>
        <h2 id={titleId} className={styles.sectionTitle}>
          {title}
        </h2>
        {description ? (
          <p className={styles.sectionDesc}>{description}</p>
        ) : null}
      </div>
      {action ?? null}
    </header>
  );
}
