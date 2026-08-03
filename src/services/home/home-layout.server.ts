import "server-only";

import { proxyToBackend } from "@/src/lib/http/server-http";
import { ApiResponse } from "@/src/lib/types/common/api-response.types";
import { getProductImage } from "@/src/utils/product-image";

export type HomeLayoutLink = {
  type: string | null;
  targetId: string | null;
  url: string | null;
  filterPayload: string | null;
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
    link: frame.link ?? fallback.link,
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
      item.videoPosterUrl ?? item.mobileImageUrl ?? item.thumbnailUrl ?? item.imageUrl,
    ),
    durationMs: DEFAULT_FRAME_DURATION_MS,
    link: item.link,
  };
}

function resolveHomeLayoutHref(link: HomeLayoutLink | null | undefined) {
  if (!link) return null;

  const type = String(link.type ?? "").toLowerCase();
  const targetId = link.targetId ? encodeURIComponent(link.targetId) : null;

  if (link.url) return link.url;
  if (type === "product" && targetId) return `/product/${targetId}`;
  if (type === "category" && targetId) return `/products?categoryId=${targetId}`;
  if (type === "landing" && targetId) return `/landing/${targetId}`;
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
        item.frames.length > 0
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
      const href = resolveHomeLayoutHref(item.link);

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

export async function getHomeLayout(): Promise<HomeLayoutData> {
  const response = await proxyToBackend<ApiResponse<HomeLayoutData>>({
    method: "GET",
    path: "/api/v1/Home/layout",
    cache: "no-store",
  });

  const isSuccess = response.data.success ?? response.data.isSuccess;
  if (!response.ok || !isSuccess) {
    throw new Error(response.data.message ?? "Failed to fetch home layout");
  }

  return {
    sections: response.data.data?.sections ?? [],
  };
}
