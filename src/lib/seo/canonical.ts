import { absoluteUrl } from "@/src/lib/seo/site";

type SearchParamValue = string | string[] | undefined;
type SearchParamsLike = Record<string, SearchParamValue> | undefined;

export function encodePathSegment(value: string): string {
  return encodeURIComponent(value);
}

export function buildCanonical(path: string): string {
  const pathname = path.split("?")[0];
  if (!pathname || pathname === "/") {
    return absoluteUrl();
  }

  return absoluteUrl(pathname);
}

function firstSearchValue(
  value: SearchParamValue | number | null,
): string | undefined {
  if (value === null || typeof value === "number") return undefined;
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parsePageParam(value: SearchParamValue | number | null): number {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 1 ? Math.floor(value) : 1;
  }

  const parsed = Number.parseInt(String(firstSearchValue(value) ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 1 ? parsed : 1;
}

export function getPageFromSearchParams(searchParams: SearchParamsLike): number {
  if (!searchParams) return 1;
  return parsePageParam(searchParams.page ?? searchParams.Page);
}

export function buildPaginatedCanonical(
  path: string,
  page?: SearchParamValue | number | null,
): string {
  const canonical = buildCanonical(path);
  const pageNumber = parsePageParam(page);
  if (pageNumber <= 1) return canonical;
  return `${canonical}?page=${pageNumber}`;
}

export function buildMagazineCanonical({
  category,
  page,
}: {
  category?: string | null;
  page?: SearchParamValue | number | null;
}): string {
  const slug = category?.trim();
  if (!slug || slug === "all") {
    return buildCanonical("/mag");
  }

  const params = new URLSearchParams();
  params.set("category", slug);

  const pageNumber = parsePageParam(page);
  if (pageNumber > 1) {
    params.set("page", String(pageNumber));
  }

  return `${buildCanonical("/mag")}?${params.toString()}`;
}

export function buildProductCanonicalPath(product: {
  publicCode?: string | null;
  slug?: string | null;
  productId?: string | null;
}): string {
  const publicCode = product.publicCode?.trim();
  const slug = product.slug?.trim();
  const productId = product.productId?.trim();

  if (publicCode && slug) {
    return `/product/${encodePathSegment(publicCode)}/${encodePathSegment(slug)}`;
  }

  if (slug) {
    return `/product/${encodePathSegment(slug)}`;
  }

  return `/product/${encodePathSegment(productId ?? "")}`;
}
