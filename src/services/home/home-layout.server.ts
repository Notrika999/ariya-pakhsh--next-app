import "server-only";
// src/services/home/home-layout.server.ts
import { proxyToBackend } from "@/src/lib/http/server-http";
import { ApiResponse } from "@/src/lib/types/common/api-response.types";
import { getBrands } from "@/src/services/brand/brand.server";
import { getCategoryBreadcrumb } from "@/src/services/category/category.server";
import { getProductById } from "@/src/services/product/product.server";
import type { ProductDetail } from "@/src/lib/types/products/productDetail.types";
import { getProductImage } from "@/src/utils/product-image";
import { resolveLandingHref } from "@/components/ui/landing/landingConfigs";
import {
  mapHomeLayoutSearchPromotion as mapSearchPromotionSections,
  type HomeSearchPromotion,
} from "@/src/services/home/search-promotion";

export type { HomeSearchPromotion };

export type HomeLayoutLink = {
  type: string | null;
  targetId: string | null;
  url: string | null;
  filterPayload: string | null;
  href?: string | null;
};

export type HomeLayoutFrame = {
  id: string;
  mediaType: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  posterUrl: string | null;
  imageMediaId: string | null;
  videoMediaId: string | null;
  posterMediaId: string | null;
  durationMs: number | null;
  link: HomeLayoutLink | null;
};

export type HomeLayoutItem = {
  id: string;
  title: string | null;
  subtitle: string | null;
  mediaType: string | null;
  imageUrl: string | null;
  mobileImageUrl: string | null;
  videoUrl: string | null;
  videoPosterUrl: string | null;
  imageMediaId: string | null;
  mobileImageMediaId: string | null;
  videoMediaId: string | null;
  videoPosterMediaId: string | null;
  thumbnailUrl: string | null;
  ctaText: string | null;
  link: HomeLayoutLink | null;
  frames: HomeLayoutFrame[];
};

export type HomeLayoutSection = {
  id: string;
  type: string | null;
  layout: string | null;
  title: string | null;
  subtitle: string | null;
  settings: unknown;
  items: HomeLayoutItem[];
};

export type HomeLayoutData = {
  sections: HomeLayoutSection[];
};

export type HomeStoryFrame = {
  id: string;
  mediaType: "Image" | "Video";
  imageUrl: string | null;
  videoUrl: string | null;
  posterUrl: string | null;
  durationMs: number;
  link: HomeLayoutLink | null;
};

export type HomeStory = {
  id: string;
  title: string;
  subtitle: string | null;
  thumbnailUrl: string;
  ctaText: string | null;
  href: string | null;
  link: HomeLayoutLink | null;
  frames: HomeStoryFrame[];
};

export type HomeCarouselSlide = {
  id: string;
  image: string;
  mobileImage: string | null;
  alt: string;
  href: string;
  title: string | null;
  subtitle: string | null;
  ctaText: string | null;
};

export type HomePromoCard = {
  id: string;
  image: string;
  alt: string;
  href: string;
  title: string | null;
  subtitle: string | null;
  ctaText: string | null;
};

const DEFAULT_FRAME_DURATION_MS = 5000;
const BRAND_LOOKUP_PAGE_SIZE = 20;
const BRAND_LOOKUP_MAX_PAGES = 20;

type ResolvableHomeLayoutLink = {
  key: string;
  type: "product" | "category" | "brand";
  targetId: string;
};

type BrandLookupItem = {
  id?: string | number | null;
  brandId?: string | number | null;
  slug?: string | null;
  nameInEnglish?: string | null;
  englishName?: string | null;
};

function normalizeMediaType(
  value: string | null | undefined,
): "Image" | "Video" {
  return String(value ?? "").toLowerCase() === "video" ? "Video" : "Image";
}

function normalizeFrame(
  frame: HomeLayoutFrame,
  fallback: HomeLayoutItem,
): HomeStoryFrame {
  const mediaType = normalizeMediaType(frame.mediaType ?? fallback.mediaType);
  const posterUrl =
    frame.posterUrl ??
    fallback.videoPosterUrl ??
    fallback.mobileImageUrl ??
    fallback.thumbnailUrl ??
    fallback.imageUrl;

  return {
    id: frame.id,
    mediaType,
    imageUrl: frame.imageUrl ? getProductImage(frame.imageUrl) : null,
    videoUrl: frame.videoUrl ? getProductImage(frame.videoUrl) : null,
    posterUrl: posterUrl ? getProductImage(posterUrl) : null,
    durationMs: frame.durationMs ?? DEFAULT_FRAME_DURATION_MS,
    link: isUsableHomeLayoutLink(frame.link) ? frame.link : fallback.link,
  };
}

function fallbackFrame(item: HomeLayoutItem): HomeStoryFrame {
  const mediaType = normalizeMediaType(item.mediaType);

  return {
    id: item.id,
    mediaType,
    imageUrl: item.imageUrl ? getProductImage(item.imageUrl) : null,
    videoUrl: item.videoUrl ? getProductImage(item.videoUrl) : null,
    posterUrl: getProductImage(
      item.videoPosterUrl ??
        item.mobileImageUrl ??
        item.thumbnailUrl ??
        item.imageUrl,
    ),
    durationMs: DEFAULT_FRAME_DURATION_MS,
    link: item.link,
  };
}

function isUsableHomeLayoutLink(link: HomeLayoutLink | null | undefined) {
  if (!link) return false;

  return Boolean(
    link.href ||
      link.url ||
      link.targetId?.trim() ||
      link.filterPayload ||
      link.type?.trim(),
  );
}

function encodePathSegment(value: string) {
  return encodeURIComponent(value.trim());
}

function normalizeLookupValue(value: string | number | null | undefined) {
  return String(value ?? "").trim().toLowerCase();
}

function isAsciiBrandSlug(value: string) {
  return /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(value);
}

function normalizeBrandPathSlug(value: string | null | undefined) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "";

  if (/^[a-zA-Z0-9][a-zA-Z0-9\s_-]*$/.test(trimmed)) {
    return trimmed.toLowerCase().replace(/\s+/g, "-");
  }

  return trimmed;
}

function brandMatchesTargetId(brand: BrandLookupItem, targetId: string) {
  const target = normalizeLookupValue(targetId);

  return (
    normalizeLookupValue(brand.id) === target ||
    normalizeLookupValue(brand.brandId) === target
  );
}

function getBrandLookupSlug(brand: BrandLookupItem) {
  const candidates = [brand.slug, brand.nameInEnglish, brand.englishName]
    .map((value) => normalizeBrandPathSlug(value))
    .filter(Boolean);

  return candidates.find(isAsciiBrandSlug) ?? candidates[0] ?? "";
}

function getDefaultVariantPublicCode(product: ProductDetail) {
  const defaultVariantPublicCode = product.variants
    ?.find((variant) => variant.isDefault)
    ?.publicCode?.trim();

  if (defaultVariantPublicCode) return defaultVariantPublicCode;

  return (
    product.variants
      ?.find((variant) => variant.publicCode?.trim())
      ?.publicCode?.trim() ?? ""
  );
}

function getProductHomeLayoutHref(product: ProductDetail) {
  const publicCode = product.publicCode?.trim();
  const slug = product.slug?.trim();

  if (!publicCode || !slug) return null;

  const basePath = `/product/${encodePathSegment(publicCode)}/${encodePathSegment(
    slug,
  )}`;
  const variantPublicCode = getDefaultVariantPublicCode(product);

  return variantPublicCode
    ? `${basePath}?public-code=${encodeURIComponent(variantPublicCode)}`
    : basePath;
}

async function resolveProductHomeLayoutHref(targetId: string) {
  const product = await getProductById(targetId);
  return getProductHomeLayoutHref(product);
}

async function resolveCategoryHomeLayoutHref(targetId: string) {
  const breadcrumb = await getCategoryBreadcrumb({
    categoryId: targetId,
    includeHome: false,
  });
  const slug = breadcrumb
    ?.slice()
    .reverse()
    .find((item) => item.slug?.trim())?.slug;

  return slug ? `/products/${encodePathSegment(slug)}` : null;
}

async function resolveBrandHomeLayoutHref(targetId: string) {
  for (let pageNumber = 1; pageNumber <= BRAND_LOOKUP_MAX_PAGES; pageNumber += 1) {
    const brands = await getBrands({
      pageNumber,
      pageSize: BRAND_LOOKUP_PAGE_SIZE,
      grouped: false,
    });
    const brand = (brands.items as BrandLookupItem[]).find((item) =>
      brandMatchesTargetId(item, targetId),
    );
    const slug = brand ? getBrandLookupSlug(brand) : "";

    if (slug) return `/products/${encodePathSegment(slug)}`;
    if (!brands.hasNextPage) break;
  }

  return null;
}

function getResolvableHomeLayoutLink(
  link: HomeLayoutLink | null | undefined,
): ResolvableHomeLayoutLink | null {
  if (!link) return null;

  const targetId = link.targetId?.trim();
  if (!targetId) return null;

  const type = String(link.type ?? "").toLowerCase();
  if (type !== "product" && type !== "category" && type !== "brand") {
    return null;
  }

  return {
    key: `${type}:${targetId}`,
    type,
    targetId,
  };
}

function shouldResolveHomeLayoutSection(section: HomeLayoutSection) {
  const type = section.type?.toLowerCase();
  const layout = section.layout?.toLowerCase();

  return (
    (type === "stories" && layout === "horizontalscroll") ||
    (type === "herocarousel" && layout === "carousel") ||
    (type === "promocards" && layout === "grid") ||
    type === "searchpromotion"
  );
}

function collectResolvableHomeLayoutLinks(sections: HomeLayoutSection[]) {
  const links = new Map<string, ResolvableHomeLayoutLink>();

  for (const section of sections) {
    if (!shouldResolveHomeLayoutSection(section)) continue;

    for (const item of section.items ?? []) {
      const itemLink = getResolvableHomeLayoutLink(item.link);
      if (itemLink) links.set(itemLink.key, itemLink);

      for (const frame of item.frames ?? []) {
        const frameLink = getResolvableHomeLayoutLink(frame.link);
        if (frameLink) links.set(frameLink.key, frameLink);
      }
    }
  }

  return links;
}

async function resolveHomeLayoutLinkMap(sections: HomeLayoutSection[]) {
  const links = collectResolvableHomeLayoutLinks(sections);
  const resolvedLinks = new Map<string, string>();

  await Promise.all(
    [...links.values()].map(async (link) => {
      try {
        let href: string | null = null;

        if (link.type === "product") {
          href = await resolveProductHomeLayoutHref(link.targetId);
        } else if (link.type === "category") {
          href = await resolveCategoryHomeLayoutHref(link.targetId);
        } else {
          href = await resolveBrandHomeLayoutHref(link.targetId);
        }

        if (href) resolvedLinks.set(link.key, href);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(
          `[home-layout] Failed to resolve ${link.type} link ${link.targetId}: ${message}`,
        );
      }
    }),
  );

  return resolvedLinks;
}

function withResolvedHomeLayoutLink(
  link: HomeLayoutLink | null,
  resolvedLinks: Map<string, string>,
): HomeLayoutLink | null {
  const resolvableLink = getResolvableHomeLayoutLink(link);
  if (!link || !resolvableLink) return link;

  const href = resolvedLinks.get(resolvableLink.key);
  return href ? { ...link, href } : link;
}

async function resolveHomeLayoutLinks(
  sections: HomeLayoutSection[],
): Promise<HomeLayoutSection[]> {
  const resolvedLinks = await resolveHomeLayoutLinkMap(sections);
  if (resolvedLinks.size === 0) return sections;

  return sections.map((section) => {
    if (!shouldResolveHomeLayoutSection(section)) return section;

    return {
      ...section,
      items: section.items.map((item) => ({
        ...item,
        link: withResolvedHomeLayoutLink(item.link, resolvedLinks),
        frames: (item.frames ?? []).map((frame) => ({
          ...frame,
          link: withResolvedHomeLayoutLink(frame.link, resolvedLinks),
        })),
      })),
    };
  });
}

function resolveHomeLayoutHref(link: HomeLayoutLink | null | undefined) {
  if (!link) return null;

  const type = String(link.type ?? "").toLowerCase();
  const rawTargetId = String(link.targetId ?? "").trim();
  const targetId = rawTargetId ? encodeURIComponent(rawTargetId) : null;

  if (link.href) return link.href;
  if (link.url) return link.url;
  if (type === "category" && targetId)
    return `/products?categoryId=${targetId}`;
  if (type === "brand" && targetId) return `/products?brandId=${targetId}`;
  if (type === "landing") return resolveLandingHref(rawTargetId);
  if (type === "campaign" && targetId) {
    return `/incredible-offers?campaignId=${targetId}`;
  }
  if (link.filterPayload) {
    return `/products?filterPayload=${encodeURIComponent(link.filterPayload)}`;
  }

  return null;
}

export function mapHomeLayoutStories(
  sections: HomeLayoutSection[] = [],
): HomeStory[] {
  const storiesSection = sections.find(
    (section) =>
      section.type?.toLowerCase() === "stories" &&
      section.layout?.toLowerCase() === "horizontalscroll",
  );

  return (storiesSection?.items ?? [])
    .map((item) => {
      const frames =
        (item.frames?.length ?? 0) > 0
          ? item.frames.map((frame) => normalizeFrame(frame, item))
          : [fallbackFrame(item)];

      return {
        id: item.id,
        title: item.title ?? "",
        subtitle: item.subtitle,
        thumbnailUrl: getProductImage(
          item.thumbnailUrl ?? item.mobileImageUrl ?? item.imageUrl,
        ),
        ctaText: item.ctaText,
        href: resolveHomeLayoutHref(item.link),
        link: item.link,
        frames: frames.filter((frame) =>
          frame.mediaType === "Video"
            ? Boolean(frame.videoUrl)
            : Boolean(frame.imageUrl),
        ),
      };
    })
    .filter((story) => story.title && story.frames.length > 0);
}

export function mapHomeLayoutCarousel(
  sections: HomeLayoutSection[] = [],
): HomeCarouselSlide[] {
  const carouselSection = sections.find(
    (section) =>
      section.type?.toLowerCase() === "herocarousel" &&
      section.layout?.toLowerCase() === "carousel",
  );

  return (carouselSection?.items ?? [])
    .map((item) => {
      const image = item.imageUrl ? getProductImage(item.imageUrl) : null;
      const href = resolveHomeLayoutHref(item.link ?? item.frames?.[0]?.link);

      if (!image || !href) return null;

      const title = item.title?.trim() || null;
      const subtitle = item.subtitle?.trim() || null;

      return {
        id: item.id,
        image,
        mobileImage: item.mobileImageUrl
          ? getProductImage(item.mobileImageUrl)
          : null,
        alt: title ?? subtitle ?? "اسلایدر فروشگاه",
        href,
        title,
        subtitle,
        ctaText: item.ctaText?.trim() || null,
      };
    })
    .filter((slide): slide is HomeCarouselSlide => Boolean(slide));
}

export function mapHomeLayoutPromoCards(
  sections: HomeLayoutSection[] = [],
): HomePromoCard[] {
  const promoCardsSection = sections.find(
    (section) =>
      section.type?.toLowerCase() === "promocards" &&
      section.layout?.toLowerCase() === "grid",
  );

  return (promoCardsSection?.items ?? [])
    .map((item) => {
      const imagePath = item.imageUrl ?? item.thumbnailUrl;
      const image = imagePath ? getProductImage(imagePath) : null;
      const href = resolveHomeLayoutHref(item.link);

      if (!image || !href) return null;

      const title = item.title?.trim() || null;
      const subtitle = item.subtitle?.trim() || null;

      return {
        id: item.id,
        image,
        alt: title ?? subtitle ?? promoCardsSection?.title ?? "بنر فروشگاه",
        href,
        title,
        subtitle,
        ctaText: item.ctaText?.trim() || null,
      };
    })
    .filter((card): card is HomePromoCard => Boolean(card));
}

export function mapHomeLayoutSearchPromotion(
  sections: HomeLayoutSection[] = [],
): HomeSearchPromotion[] {
  return mapSearchPromotionSections(sections);
}

async function fetchHomeLayoutSections(): Promise<HomeLayoutSection[]> {
  const response = await proxyToBackend<ApiResponse<HomeLayoutData>>({
    method: "GET",
    path: "/api/v1/Home/layout",
    cache: "no-store",
  });

  const isSuccess = response.data.success ?? response.data.isSuccess;
  if (!response.ok || !isSuccess) {
    throw new Error(response.data.message ?? "Failed to fetch home layout");
  }

  return response.data.data?.sections ?? [];
}

export async function getHomeSearchPromotions(): Promise<HomeSearchPromotion[]> {
  const sections = await fetchHomeLayoutSections();
  const searchSections = sections.filter(
    (section) => section.type?.toLowerCase() === "searchpromotion",
  );

  try {
    const resolved = await resolveHomeLayoutLinks(searchSections);
    const promotions = mapSearchPromotionSections(resolved);
    if (promotions.length > 0) return promotions;
  } catch (error) {
    console.error("[home/search-promotions] link resolve failed =>", error);
  }

  return mapSearchPromotionSections(searchSections);
}

export async function getHomeLayout(): Promise<HomeLayoutData> {
  const sections = await fetchHomeLayoutSections();

  return {
    sections: await resolveHomeLayoutLinks(sections),
  };
}
