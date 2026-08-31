import Image from "next/image";
import Link from "next/link";
import styles from "./blogHome.module.css";
import { getPostHref, getPostImage } from "./blogHomeUtils";

const MEDIA_SIZES = {
  featured: "(max-width: 1023px) 100vw, 58vw",
  compact: "(max-width: 1023px) 50vw, 28vw",
  default: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
  horizontal: "(max-width: 767px) 116px, 140px",
  video: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw",
};

export default function ArticleCard({
  post,
  variant = "default",
  priority = false,
}) {
  const href = getPostHref(post);
  const image = getPostImage(post);
  const showExcerpt =
    variant === "default" || variant === "featured" || variant === "video";
  const showPlay = variant === "video";
  const cardClass = styles[`card_${variant}`];

  return (
    <article className={`${styles.card} ${cardClass ?? ""}`.trim()}>
      <Link href={href} className={styles.cardLink}>
        <div className={styles.media}>
          <Image
            src={image}
            alt={post.imageAlt || post.title}
            fill
            sizes={MEDIA_SIZES[variant] ?? MEDIA_SIZES.default}
            priority={priority}
            className={styles.image}
          />
          {showPlay ? (
            <span className={styles.playButton} aria-hidden="true">
              <i className="far fa-circle-play" />
            </span>
          ) : null}
        </div>

        <div className={styles.body}>
          {post.keyword ? (
            <span className={styles.category}>{post.keyword}</span>
          ) : null}

          <h3 className={styles.cardTitle}>{post.title}</h3>

          {showExcerpt && post.description ? (
            <p className={styles.excerpt}>{post.description}</p>
          ) : null}

          <p className={styles.meta}>
            {post.authorName ? <span>{post.authorName}</span> : null}
            {post.authorName && (post.readTime || post.date) ? (
              <span className={styles.metaDot} aria-hidden="true">
                ·
              </span>
            ) : null}
            {post.readTime ? <span>{post.readTime}</span> : null}
            {post.readTime && post.date ? (
              <span className={styles.metaDot} aria-hidden="true">
                ·
              </span>
            ) : null}
            {post.date ? <span>{post.date}</span> : null}
          </p>
        </div>
      </Link>
    </article>
  );
}
