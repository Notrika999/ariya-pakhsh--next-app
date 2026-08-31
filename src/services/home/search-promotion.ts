import { resolveStoryHref } from "@/components/ui/Home/Story/story-links";
import { getProductImage } from "@/src/utils/product-image";

export type HomeSearchPromotion = {
  id: string;
  image: string;
  alt: string;
  href: string;
  title: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function getHomeLayoutSections(payload: unknown): unknown[] {
  if (!isRecord(payload)) return [];

  const nestedData = isRecord(payload.data) ? payload.data : payload;
  const layoutData = isRecord(nestedData.data) ? nestedData.data : nestedData;

  if (Array.isArray(layoutData.sections)) return layoutData.sections;
  if (Array.isArray(nestedData.sections)) return nestedData.sections;
  if (Array.isArray(payload.sections)) return payload.sections;

  return [];
}

function resolveSearchPromotionHref(
  item: Record<string, unknown>,
  title: string | null,
): string {
  const link = isRecord(item.link) ? item.link : null;
  const href = resolveStoryHref(link);
  if (href) return href;

  if (title) return `/search?Q=${encodeURIComponent(title)}`;

  return "/products";
}

export function mapHomeLayoutSearchPromotion(
  sections: unknown[] = [],
): HomeSearchPromotion[] {
  const section = sections.find((item) => {
    return (
      isRecord(item) && getString(item.type).toLowerCase() === "searchpromotion"
    );
  });

  if (!isRecord(section) || !Array.isArray(section.items)) return [];

  const sectionTitle = getString(section.title);

  return section.items
    .map((item, index) => {
      if (!isRecord(item)) return null;

      const thumbnailUrl =
        getString(item.thumbnailUrl) ||
        getString(item.mobileImageUrl) ||
        getString(item.imageUrl);

      if (!thumbnailUrl) return null;

      const title = getString(item.title) || null;
      const id = getString(item.id) || `search-promotion-${index}`;

      return {
        id,
        image: getProductImage(thumbnailUrl),
        alt: title || sectionTitle || "پیشنهاد ویژه جستجو",
        href: resolveSearchPromotionHref(item, title),
        title,
      };
    })
    .filter((item): item is HomeSearchPromotion => Boolean(item));
}
