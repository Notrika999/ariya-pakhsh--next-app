import Link from "next/link";

export default function SectionHeading({
  title,
  href,
  actionLabel = "مشاهده همه",
  titleId,
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2
        id={titleId}
        className="text-lg font-bold text-gray-900 dark:text-white"
      >
        {title}
      </h2>
      {href ? (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm text-primary transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {actionLabel}
          <i className="far fa-arrow-left-long text-xs" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
