import Image from "next/image";
import Link from "next/link";
import { getArticleHref, getArticleImage } from "./magazineUtils";

const SIZE_MAP = {
  featured:
    "(max-width: 767px) 100vw, (max-width: 1279px) 70vw, 760px",
  overlay: "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 320px",
  default: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 360px",
  latest: "(max-width: 767px) 80vw, (max-width: 1279px) 30vw, 240px",
  sidebar: "120px",
  editorial: "(max-width: 1023px) 100vw, 720px",
};

function CategoryBadge({ label, tone = "solid" }) {
  if (!label) return null;

  if (tone === "overlay") {
    return (
      <span className="inline-flex rounded-sm bg-primary px-2 py-0.5 text-[11px] font-medium text-white">
        {label}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-sm bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
      {label}
    </span>
  );
}

function Meta({ article, className = "text-gray-500 dark:text-gray-400" }) {
  const parts = [article.author, article.readingTime, article.publishedAt].filter(
    Boolean,
  );
  if (!parts.length) return null;

  return (
    <p className={`flex flex-wrap items-center gap-x-2 text-xs ${className}`}>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`} className="inline-flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden="true" className="opacity-50">
              ·
            </span>
          ) : null}
          {part}
        </span>
      ))}
    </p>
  );
}

export default function ArticleCard({
  article,
  variant = "default",
  priority = false,
}) {
  if (!article) return null;

  const href = getArticleHref(article);
  const image = getArticleImage(article);
  const alt = article.imageAlt || article.title;

  if (variant === "sidebar") {
    return (
      <article>
        <Link
          href={href}
          className="group grid grid-cols-[88px_minmax(0,1fr)] items-start gap-3 rounded-md p-1.5 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:hover:bg-zinc-800"
        >
          <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100 dark:bg-zinc-800">
            <Image
              src={image}
              alt={alt}
              fill
              sizes={SIZE_MAP.sidebar}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            />
          </div>
          <div className="min-w-0">
            <CategoryBadge label={article.category} />
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
              {article.title}
            </h3>
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
              {article.publishedAt || article.views}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "overlay" || variant === "featured") {
    const isHero = variant === "featured";

    return (
      <article className="h-full">
        <Link
          href={href}
          className={`group relative block h-full overflow-hidden rounded-md bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            isHero ? "min-h-72 lg:min-h-[28rem]" : "min-h-36"
          }`}
        >
          <Image
            src={image}
            alt={alt}
            fill
            sizes={isHero ? SIZE_MAP.featured : SIZE_MAP.overlay}
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          <span className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/5" />
          <span className={`absolute inset-x-0 bottom-0 ${isHero ? "p-5 md:p-6" : "p-3"}`}>
            <CategoryBadge label={article.category} tone="overlay" />
            {isHero ? (
              <h2 className="mt-2 text-xl font-bold leading-8 text-white md:text-2xl md:leading-10 lg:text-[1.7rem]">
                {article.title}
              </h2>
            ) : (
              <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-6 text-white">
                {article.title}
              </h3>
            )}
            {isHero && article.excerpt ? (
              <p className="mt-2 hidden max-w-2xl text-sm leading-7 text-white/80 md:line-clamp-2 md:block">
                {article.excerpt}
              </p>
            ) : null}
            {isHero ? (
              <Meta article={article} className="mt-3 text-white/70" />
            ) : null}
          </span>
        </Link>
      </article>
    );
  }

  const isFeatured = variant === "featured" || variant === "editorial";
  const showExcerpt = variant === "default" || isFeatured;

  return (
    <article className="h-full">
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-zinc-700 dark:bg-custom-dark"
      >
        <div
          className={`relative overflow-hidden bg-gray-100 dark:bg-zinc-800 ${
            isFeatured ? "aspect-video min-h-52" : "aspect-video"
          }`}
        >
          <Image
            src={image}
            alt={alt}
            fill
            sizes={SIZE_MAP[variant] ?? SIZE_MAP.default}
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {article.category ? (
            <span className="absolute inset-s-2.5 top-2.5">
              <CategoryBadge label={article.category} tone="overlay" />
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-3.5">
          <h3
            className={`font-bold leading-7 text-gray-900 dark:text-gray-100 ${
              isFeatured ? "text-xl lg:text-2xl" : "line-clamp-2 text-[15px]"
            }`}
          >
            {article.title}
          </h3>
          {showExcerpt && article.excerpt ? (
            <p className="mt-2 line-clamp-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
              {article.excerpt}
            </p>
          ) : null}
          <Meta article={article} className="mt-auto pt-3" />
        </div>
      </Link>
    </article>
  );
}
