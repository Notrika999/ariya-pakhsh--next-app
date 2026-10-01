import Image from "next/image";
import Link from "next/link";
import { getArticleHref, getArticleImage } from "./magazineUtils";

const SIZE_MAP = {
  featured: "(max-width: 767px) 100vw, (max-width: 1279px) 70vw, 760px",
  overlay: "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 320px",
  default: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 360px",
  latest: "(max-width: 767px) 80vw, (max-width: 1279px) 30vw, 240px",
  sidebar: "120px",
  compact: "(max-width: 767px) 120px, 160px",
  editorial: "(max-width: 1023px) 100vw, 720px",
  video: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 360px",
  featuredVideo: "(max-width: 767px) 100vw, 720px",
};

function CategoryBadge({ label, tone = "solid" }) {
  if (!label) return null;

  if (tone === "overlay") {
    return (
<<<<<<< HEAD
      <span className="inline-flex rounded-full bg-primary/95 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur-sm">
=======
      <span className="inline-flex rounded-sm bg-primary px-2 py-0.5 text-[11px] font-medium text-white">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
        {label}
      </span>
    );
  }

  return (
<<<<<<< HEAD
    <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
=======
    <span className="inline-flex rounded-sm bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      {label}
    </span>
  );
}

function Meta({ article, className = "text-gray-500 dark:text-gray-400" }) {
  const parts = [
    article.author,
    article.readingTime,
    article.publishedAt,
  ].filter(Boolean);
  if (!parts.length) return null;

  return (
    <p className={`flex flex-wrap items-center gap-x-2 text-xs ${className}`}>
      {parts.map((part, index) => (
        <span
          key={`${part}-${index}`}
          className="inline-flex items-center gap-2"
        >
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

function PlayBadge({ size = "md" }) {
  const className =
    size === "lg"
      ? "grid size-14 place-items-center rounded-full bg-white/95 text-2xl text-primary shadow-md"
      : "grid size-12 place-items-center rounded-full bg-white/95 text-xl text-primary shadow-md";

  return (
    <span className="absolute inset-0 grid place-items-center">
      <span className={className} aria-hidden="true">
        <i className="far fa-circle-play" />
      </span>
    </span>
  );
}

/**
 * @param {{
 *   article?: object | null,
 *   variant?: string,
 *   priority?: boolean,
 *   titleAs?: string,
<<<<<<< HEAD
 *   rank?: number,
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
 * }} props
 */
export default function ArticleCard({
  article,
  variant = "default",
  priority = false,
  titleAs,
<<<<<<< HEAD
  rank,
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
}) {
  if (!article) return null;

  const href = getArticleHref(article);
  const isHero = variant === "featured";
  const isOverlay = variant === "overlay" || isHero;
  const useThumbnail = !isHero && variant !== "editorial" && variant !== "featuredVideo";
  const image = getArticleImage(article, { preferThumbnail: useThumbnail });
  const alt = article.imageAlt || article.title;
  const TitleTag = titleAs || (isHero ? "h2" : "h3");

  if (variant === "sidebar") {
    return (
<<<<<<< HEAD
      <article className="h-full">
        <Link
          href={href}
          className={`group grid h-full items-center gap-3 rounded-xl border border-white/80 bg-white/85 p-2.5 shadow-[0_12px_30px_-26px_rgba(15,23,42,0.6)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-[0_16px_34px_-24px_rgba(15,23,42,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-zinc-800 dark:bg-zinc-900/75 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 ${
            rank
              ? "grid-cols-[2rem_5.5rem_minmax(0,1fr)]"
              : "grid-cols-[5.5rem_minmax(0,1fr)]"
          }`}
        >
          {rank ? (
            <span className="grid size-8 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-900">
              {new Intl.NumberFormat("fa-IR").format(rank)}
            </span>
          ) : null}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-zinc-800">
=======
      <article>
        <Link
          href={href}
          className="group grid grid-cols-[88px_minmax(0,1fr)] items-start gap-3 rounded-md p-1.5 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:hover:bg-zinc-800"
        >
          <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100 dark:bg-zinc-800">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
            <Image
              src={image}
              alt={alt}
              fill
              sizes={SIZE_MAP.sidebar}
<<<<<<< HEAD
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
=======
              className="object-contain p-1"
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
            />
          </div>
          <div className="min-w-0">
            <CategoryBadge label={article.category} />
            <TitleTag className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
              {article.title}
            </TitleTag>
<<<<<<< HEAD
            <Meta
              article={article}
              className="mt-1 line-clamp-1 text-[11px] text-gray-500 dark:text-gray-400"
            />
=======
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
              {article.publishedAt || article.views}
            </p>
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="h-full min-w-0">
        <Link
          href={href}
<<<<<<< HEAD
          className="group grid h-full grid-cols-[7.25rem_minmax(0,1fr)] gap-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_12px_30px_-27px_rgba(15,23,42,0.55)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_36px_-28px_rgba(15,23,42,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:grid-cols-[8.5rem_minmax(0,1fr)] dark:border-zinc-700 dark:bg-custom-dark"
        >
          <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-slate-100 dark:bg-zinc-800">
=======
          className="group grid h-full grid-cols-[7.25rem_minmax(0,1fr)] gap-3 rounded-lg border border-gray-200 bg-white p-2 transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:grid-cols-[8.5rem_minmax(0,1fr)] dark:border-zinc-700 dark:bg-custom-dark"
        >
          <div className="relative aspect-4/3 overflow-hidden rounded-md bg-gray-100 dark:bg-zinc-800">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
            <Image
              src={image}
              alt={alt}
              fill
              sizes={SIZE_MAP.compact}
<<<<<<< HEAD
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
=======
              className="object-contain p-1"
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
            />
          </div>
          <div className="flex min-w-0 flex-col py-0.5 pe-1">
            <CategoryBadge label={article.category} />
            <TitleTag className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
              {article.title}
            </TitleTag>
<<<<<<< HEAD
            <Meta
              article={article}
              className="mt-auto pt-2 text-gray-500 dark:text-gray-400"
            />
=======
            <Meta article={article} className="mt-auto pt-2" />
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
          </div>
        </Link>
      </article>
    );
  }

  if (isOverlay) {
    return (
      <article className="h-full min-w-0">
        <Link
          href={href}
<<<<<<< HEAD
          className={`group relative block h-full overflow-hidden rounded-xl bg-zinc-900 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.85)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
=======
          className={`group relative block h-full overflow-hidden rounded-md bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
            isHero ? "min-h-72 lg:min-h-112" : "min-h-36"
          }`}
        >
          <Image
            src={image}
            alt={alt}
            fill
            sizes={isHero ? SIZE_MAP.featured : SIZE_MAP.overlay}
            priority={priority}
<<<<<<< HEAD
            className="object-cover transition duration-500 group-hover:scale-[1.025]"
=======
            className="object-contain"
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
          />
          <span className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/5" />
          <span
            className={`absolute inset-x-0 bottom-0 ${isHero ? "p-5 md:p-6" : "p-3"}`}
          >
            <CategoryBadge label={article.category} tone="overlay" />
            {isHero ? (
              <TitleTag className="mt-2 text-xl font-bold leading-8 text-white md:text-2xl md:leading-10 lg:text-[1.7rem]">
                {article.title}
              </TitleTag>
            ) : (
              <TitleTag className="mt-1.5 line-clamp-2 text-sm font-bold leading-6 text-white">
                {article.title}
              </TitleTag>
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

  const isFeatured = variant === "editorial" || variant === "featuredVideo";
<<<<<<< HEAD
  const showExcerpt = isFeatured;
=======
  const showExcerpt = variant === "default" || variant === "video" || isFeatured;
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  const showPlay = variant === "video" || variant === "featuredVideo";

  return (
    <article className="h-full min-w-0">
      <Link
        href={href}
<<<<<<< HEAD
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_14px_34px_-28px_rgba(15,23,42,0.55)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_20px_42px_-28px_rgba(15,23,42,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-zinc-700 dark:bg-custom-dark dark:hover:border-zinc-600"
      >
        <div
          className={`relative overflow-hidden bg-slate-100 dark:bg-zinc-800 ${
=======
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-zinc-700 dark:bg-custom-dark"
      >
        <div
          className={`relative overflow-hidden bg-gray-100 dark:bg-zinc-800 ${
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
            isFeatured ? "aspect-video min-h-52" : "aspect-video"
          }`}
        >
          <Image
            src={image}
            alt={alt}
            fill
            sizes={SIZE_MAP[variant] ?? SIZE_MAP.default}
            priority={priority}
<<<<<<< HEAD
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
=======
            className="object-contain p-1"
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
          />
          {showPlay ? <PlayBadge size={isFeatured ? "lg" : "md"} /> : null}
          {article.category ? (
            <span className="absolute inset-s-2.5 top-2.5">
              <CategoryBadge label={article.category} tone="overlay" />
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-3.5">
          <TitleTag
            className={`font-bold leading-7 text-gray-900 dark:text-gray-100 ${
              isFeatured ? "text-xl lg:text-2xl" : "line-clamp-2 text-[15px]"
            }`}
          >
            {article.title}
          </TitleTag>
          {showExcerpt && article.excerpt ? (
            <p className="mt-2 line-clamp-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
              {article.excerpt}
            </p>
          ) : null}
<<<<<<< HEAD
          <Meta
            article={article}
            className="mt-auto pt-3 text-gray-500 dark:text-gray-400"
          />
=======
          <Meta article={article} className="mt-auto pt-3" />
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
        </div>
      </Link>
    </article>
  );
}
