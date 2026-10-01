import Link from "next/link";

const TONE_STYLES = {
  neutral: {
    icon: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-200",
    line: "border-slate-200/80 dark:border-zinc-700/80",
  },
  charcoal: {
    icon: "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900",
    line: "border-slate-300/80 dark:border-slate-700/80",
  },
  slate: {
    icon: "bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    line: "border-slate-200 dark:border-slate-800",
  },
  sand: {
    icon: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300",
    line: "border-amber-200/70 dark:border-amber-900/60",
  },
  lavender: {
    icon: "bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300",
    line: "border-violet-200/70 dark:border-violet-900/60",
  },
  teal: {
    icon: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300",
    line: "border-cyan-200/70 dark:border-cyan-900/60",
  },
  sage: {
    icon: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300",
    line: "border-emerald-200/70 dark:border-emerald-900/60",
  },
  steel: {
    icon: "bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300",
    line: "border-sky-200/70 dark:border-sky-900/60",
  },
};

function getSectionIcon(sectionType, categorySlug) {
  if (categorySlug === "troubleshooting") return "far fa-screwdriver-wrench";
  if (categorySlug === "car-maintenance") return "far fa-car-wrench";
  if (categorySlug === "reviews-comparisons") return "far fa-scale-balanced";
  if (categorySlug === "buying-guide") return "far fa-basket-shopping";
  if (categorySlug === "how-to") return "far fa-graduation-cap";
  if (categorySlug === "news-technology") return "far fa-microchip";
  if (categorySlug === "car-accessories") return "far fa-toolbox";
  if (categorySlug === "video") return "far fa-circle-play";

  switch (sectionType) {
    case "featured":
      return "far fa-star";
    case "latest":
      return "far fa-clock";
    case "popular":
      return "far fa-fire";
    case "recommended":
      return "far fa-sparkles";
    case "buyingGuides":
      return "far fa-basket-shopping";
    case "reviews":
    case "comparisons":
      return "far fa-scale-balanced";
    case "vehicleArticles":
      return "far fa-car-side";
    case "videoArticles":
      return "far fa-circle-play";
    default:
      return "far fa-newspaper";
  }
}

/**
 * @param {{
 *   title?: string,
 *   subtitle?: string,
 *   href?: string,
 *   actionLabel?: string,
 *   titleId?: string,
 *   tone?: string,
 *   sectionType?: string | null,
 *   categorySlug?: string | null,
 *   titleAs?: "h1" | "h2",
 * }} props
 */
export default function SectionHeading({
  title,
  subtitle,
  href,
  actionLabel = "مشاهده همه",
  titleId,
  tone = "neutral",
  sectionType,
  categorySlug,
  titleAs = "h2",
}) {
  if (!title && !href) return null;

  const toneStyles = TONE_STYLES[tone] ?? TONE_STYLES.neutral;
  const icon = getSectionIcon(sectionType, categorySlug);
  const TitleTag = titleAs === "h1" ? "h1" : "h2";

  return (
    <div className={`mb-5 flex items-end justify-between gap-4 border-b pb-4 md:mb-6 ${toneStyles.line}`}>
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={`mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl ${toneStyles.icon}`}
          aria-hidden="true"
        >
          <i className={icon} />
        </span>
        <div className="min-w-0">
        {title ? (
          <TitleTag
            id={titleId}
            className="text-lg font-bold tracking-tight text-slate-900 md:text-xl dark:text-white"
          >
            {title}
          </TitleTag>
        ) : null}
        {subtitle ? (
          <p className="mt-1 text-sm leading-7 text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        ) : null}
        </div>
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-white/70 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-slate-300 dark:hover:bg-white/5"
        >
          {actionLabel}
          <i className="far fa-arrow-left-long text-xs" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
