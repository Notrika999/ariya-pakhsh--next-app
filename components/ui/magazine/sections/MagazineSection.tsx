import type { ReactNode } from "react";
<<<<<<< HEAD
import { normalizeSectionType } from "@/src/lib/magazine/section-config";
import SectionHeading from "../SectionHeading";

export const MAGAZINE_SECTION_SHELL =
  "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_55px_-42px_rgba(15,23,42,0.5)] md:p-8 dark:border-zinc-800 dark:bg-custom-dark";

export type MagazineSectionTone =
  | "neutral"
  | "charcoal"
  | "slate"
  | "sand"
  | "lavender"
  | "teal"
  | "sage"
  | "steel";

const SECTION_TONE_CLASSES: Record<MagazineSectionTone, string> = {
  neutral:
    "border-slate-200 border-t-slate-400 bg-white dark:border-zinc-800 dark:border-t-zinc-500 dark:bg-custom-dark",
  charcoal:
    "border-slate-200 border-t-slate-700 bg-gradient-to-bl from-white via-white to-slate-100 dark:border-zinc-800 dark:border-t-slate-400 dark:from-custom-dark dark:via-custom-dark dark:to-slate-900",
  slate:
    "border-slate-200 border-t-slate-500 bg-slate-50/80 dark:border-slate-800 dark:border-t-slate-400 dark:bg-slate-950/70",
  sand:
    "border-amber-100 border-t-amber-700/70 bg-amber-50/45 dark:border-amber-950/70 dark:border-t-amber-600 dark:bg-amber-950/15",
  lavender:
    "border-violet-100 border-t-violet-500/70 bg-violet-50/45 dark:border-violet-950/70 dark:border-t-violet-500 dark:bg-violet-950/15",
  teal:
    "border-cyan-100 border-t-cyan-700/70 bg-cyan-50/45 dark:border-cyan-950/70 dark:border-t-cyan-600 dark:bg-cyan-950/15",
  sage:
    "border-emerald-100 border-t-emerald-700/70 bg-emerald-50/40 dark:border-emerald-950/70 dark:border-t-emerald-600 dark:bg-emerald-950/15",
  steel:
    "border-slate-200 border-t-sky-700/60 bg-slate-50/65 dark:border-slate-800 dark:border-t-sky-600 dark:bg-slate-950/60",
};

function resolveCategoryTone(categorySlug?: string | null): MagazineSectionTone {
  switch (categorySlug) {
    case "buying-guide":
      return "sand";
    case "how-to":
      return "steel";
    case "reviews-comparisons":
      return "teal";
    case "car-maintenance":
      return "sage";
    case "troubleshooting":
      return "steel";
    case "news-technology":
      return "slate";
    case "car-accessories":
      return "lavender";
    case "video":
      return "charcoal";
    default:
      return "neutral";
  }
}

export function resolveMagazineSectionTone(
  sectionType?: string | null,
  categorySlug?: string | null,
): MagazineSectionTone {
  const type = normalizeSectionType(sectionType);

  switch (type) {
    case "featured":
    case "videoArticles":
      return "charcoal";
    case "latest":
      return "slate";
    case "buyingGuides":
      return "sand";
    case "popular":
    case "recommended":
      return "lavender";
    case "reviews":
    case "comparisons":
      return "teal";
    case "vehicleArticles":
      return "sage";
    case "compactArticles":
      return categorySlug === "troubleshooting" ? "steel" : "slate";
    case "categoryArticles":
      return resolveCategoryTone(categorySlug);
    default:
      return resolveCategoryTone(categorySlug);
  }
}
=======
import SectionHeading from "../SectionHeading";

export const MAGAZINE_SECTION_SHELL =
  "rounded-xl bg-white p-5 md:p-8 dark:bg-custom-dark";
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

type MagazineSectionProps = {
  title?: string;
  subtitle?: string;
  titleId: string;
  href?: string;
<<<<<<< HEAD
  sectionType?: string | null;
  categorySlug?: string | null;
  titleAs?: "h1" | "h2";
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  children: ReactNode;
};

export default function MagazineSection({
  title,
  subtitle,
  titleId,
  href,
<<<<<<< HEAD
  sectionType,
  categorySlug,
  titleAs = "h2",
  children,
}: MagazineSectionProps) {
  const tone = resolveMagazineSectionTone(sectionType, categorySlug);

=======
  children,
}: MagazineSectionProps) {
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : "بخش مجله"}
<<<<<<< HEAD
      data-section-tone={tone}
      className={`relative overflow-hidden rounded-2xl border border-t-4 p-5 shadow-[0_18px_55px_-42px_rgba(15,23,42,0.55)] md:p-8 ${SECTION_TONE_CLASSES[tone]}`}
=======
      className={MAGAZINE_SECTION_SHELL}
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    >
      <SectionHeading
        title={title}
        subtitle={subtitle}
        titleId={titleId}
        href={href}
<<<<<<< HEAD
        tone={tone}
        sectionType={sectionType}
        categorySlug={categorySlug}
        titleAs={titleAs}
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      />
      {children}
    </section>
  );
}
