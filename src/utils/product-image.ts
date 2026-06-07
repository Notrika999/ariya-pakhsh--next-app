// lib/utils/product-image.ts

const BASE_URL = "https://aryapakhsh.shop";

export function getProductImage(path?: string | null) {
  if (!path?.trim()) {
    return "/images/default.png";
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
}