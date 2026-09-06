// lib/utils/product-image.ts

const BASE_URL = "https://aryapakhsh.shop";
const DEFAULT_IMAGE = "/images/default.png";

export function getProductImage(path?: string | null) {
  const trimmed = path?.trim();
  if (!trimmed) {
    return DEFAULT_IMAGE;
  }

  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/^http:\/\//i, "https://");
  }

  return `${BASE_URL}/${trimmed.replace(/^\/+/, "")}`;
}

type ImagePathLike =
  | string
  | null
  | undefined
  | {
      iconUrl?: string | null;
      thumbUrl?: string | null;
      cardUrl?: string | null;
      url?: string | null;
      path?: string | null;
    };

export function getCategoryImage(image?: ImagePathLike) {
  if (!image) {
    return DEFAULT_IMAGE;
  }

  if (typeof image === "string") {
    return getProductImage(image);
  }

  return getProductImage(
    image.cardUrl ?? image.thumbUrl ?? image.iconUrl ?? image.url ?? image.path,
  );
}
