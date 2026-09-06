import Link from "next/link";

/**
 * @param {{
 *   title?: string,
 *   subtitle?: string,
 *   href?: string,
 *   actionLabel?: string,
 *   titleId?: string,
 * }} props
 */
export default function SectionHeading({
  title,
  subtitle,
  href,
  actionLabel = "مشاهده همه",
  titleId,
}) {
  if (!title && !href) return null;

  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {title ? (
          <h2
            id={titleId}
            className="text-lg font-bold text-gray-900 dark:text-white"
          >
            {title}
          </h2>
        ) : null}
        {subtitle ? (
          <p className="mt-1 text-sm leading-7 text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm text-primary transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {actionLabel}
          <i className="far fa-arrow-left-long text-xs" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
