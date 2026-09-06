import type {
  MagazineDisplayVariant,
  MagazineSectionLayout,
  MagazineSectionSource,
  MagazineSectionType,
} from "@/src/lib/types/magazine/magazine.types";

export const MAGAZINE_SECTION_TYPES = [
  "featured",
  "latest",
  "popular",
  "recommended",
  "categoryArticles",
  "videoArticles",
  "compactArticles",
  "vehicleArticles",
  "buyingGuides",
  "reviews",
  "comparisons",
] as const;

export const MAGAZINE_DISPLAY_VARIANTS = [
  "heroGrid",
  "largeWithSmallCards",
  "threeColumnGrid",
  "fourColumnGrid",
  "compactList",
  "videoGrid",
  "featuredVideo",
] as const;

export const MAGAZINE_SECTION_SOURCES = [
  "manual",
  "automatic",
  "mixed",
] as const;

export type CanonicalSectionType = (typeof MAGAZINE_SECTION_TYPES)[number];
export type CanonicalDisplayVariant = (typeof MAGAZINE_DISPLAY_VARIANTS)[number];

function compactKey(value: string): string {
  return value.trim().toLowerCase().replace(/[-_\s]/g, "");
}

const SECTION_TYPE_ALIASES: Record<string, CanonicalSectionType> = {
  featured: "featured",
  latest: "latest",
  popular: "popular",
  recommended: "recommended",
  categoryarticles: "categoryArticles",
  category: "categoryArticles",
  videoarticles: "videoArticles",
  videos: "videoArticles",
  video: "videoArticles",
  compactarticles: "compactArticles",
  compact: "compactArticles",
  vehiclearticles: "vehicleArticles",
  cararticles: "vehicleArticles",
  buyingguides: "buyingGuides",
  reviews: "reviews",
  comparisons: "comparisons",
};

const DISPLAY_VARIANT_ALIASES: Record<string, CanonicalDisplayVariant> = {
  herogrid: "heroGrid",
  largewithsmallcards: "largeWithSmallCards",
  threecolumngrid: "threeColumnGrid",
  grid3: "threeColumnGrid",
  fourcolumngrid: "fourColumnGrid",
  grid4: "fourColumnGrid",
  compactlist: "compactList",
  compact: "compactList",
  videogrid: "videoGrid",
  featuredvideo: "featuredVideo",
  featured: "largeWithSmallCards",
  grid: "threeColumnGrid",
  video: "videoGrid",
};

const SOURCE_ALIASES: Record<string, MagazineSectionSource> = {
  manual: "manual",
  automatic: "automatic",
  auto: "automatic",
  mixed: "mixed",
};

const SECTION_TYPE_DEFAULT_VARIANT: Partial<
  Record<CanonicalSectionType, CanonicalDisplayVariant>
> = {
  featured: "largeWithSmallCards",
  videoArticles: "videoGrid",
  compactArticles: "compactList",
  popular: "compactList",
  recommended: "compactList",
};

export function normalizeSectionType(
  value: string | null | undefined,
): MagazineSectionType | null {
  if (!value) return null;
  return SECTION_TYPE_ALIASES[compactKey(value)] ?? value.trim();
}

export function normalizeDisplayVariant(
  value: string | null | undefined,
): CanonicalDisplayVariant | null {
  if (!value) return null;
  return DISPLAY_VARIANT_ALIASES[compactKey(value)] ?? null;
}

export function normalizeSectionSource(
  value: string | null | undefined,
): MagazineSectionSource | null {
  if (!value) return null;
  return SOURCE_ALIASES[compactKey(value)] ?? null;
}

export function resolveDisplayVariant(
  displayVariant: string | null | undefined,
  sectionType: string | null | undefined,
): CanonicalDisplayVariant {
  const fromDisplay = normalizeDisplayVariant(displayVariant);
  if (fromDisplay) return fromDisplay;

  const type = normalizeSectionType(sectionType);
  if (type && type in SECTION_TYPE_DEFAULT_VARIANT) {
    return SECTION_TYPE_DEFAULT_VARIANT[type as CanonicalSectionType]!;
  }

  return "threeColumnGrid";
}

export function layoutFromDisplayVariant(
  variant: MagazineDisplayVariant | null | undefined,
): MagazineSectionLayout {
  switch (variant) {
    case "heroGrid":
    case "largeWithSmallCards":
      return "featured";
    case "videoGrid":
    case "featuredVideo":
      return "video";
    case "compactList":
      return "compact";
    default:
      return "grid";
  }
}
