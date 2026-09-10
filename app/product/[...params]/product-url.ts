import { headers } from "next/headers";
import { permanentRedirect } from "next/navigation";
import type { ProductDetail } from "@/src/lib/types/products/productDetail.types";
import {
  buildProductCanonicalPath,
  encodePathSegment,
} from "@/src/lib/seo/canonical";

type SearchParams = Record<string, string | string[] | undefined>;

const VARIANT_QUERY_KEY = "variant-id";
const PUBLIC_CODE_QUERY_KEY = "public-code";

export function getProductCanonicalPath(product: ProductDetail): string {
  return buildProductCanonicalPath(product);
}

function firstSearchValue(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

function hasVariantQuery(searchParams: SearchParams): boolean {
  return Boolean(
    firstSearchValue(searchParams[VARIANT_QUERY_KEY]) ||
      firstSearchValue(searchParams[PUBLIC_CODE_QUERY_KEY]),
  );
}

/**
 * Redirect duplicate product URLs to `/product/{publicCode}/{slug}`:
 * - one segment: `/product/{slug}` or `/product/{productId}`
 * - three+ segments: `/product/{code}/{slug}/{variantId}`
 * Query string is preserved. Path variants without a query are copied to
 * `variant-id` so the destination still selects the same variant.
 */
export function getLegacyProductRedirectPath(
  params: string[],
  product: ProductDetail,
): string | null {
  const publicCode = product.publicCode?.trim();
  const slug = product.slug?.trim();
  if (!publicCode || !slug) return null;
  if (params.length === 2) return null;

  return `/product/${encodePathSegment(publicCode)}/${encodePathSegment(slug)}`;
}

function appendSearchParams(path: string, searchParams: SearchParams): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue;

    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (item !== "") query.append(key, item);
    }
  }

  const serialized = query.toString();
  return serialized ? `${path}?${serialized}` : path;
}

function parseSearchParamsFromQuery(query: string): SearchParams {
  const normalized = query.startsWith("?") ? query.slice(1) : query;
  const parsed: SearchParams = {};
  const search = new URLSearchParams(normalized);

  search.forEach((value, key) => {
    const existing = parsed[key];
    if (existing === undefined) {
      parsed[key] = value;
      return;
    }
    parsed[key] = Array.isArray(existing)
      ? [...existing, value]
      : [existing, value];
  });

  return parsed;
}

export async function getRequestSearchParams(
  fallback: SearchParams = {},
): Promise<SearchParams> {
  if (Object.keys(fallback).length > 0) return fallback;

  const headerStore = await headers();
  const searchHeader = headerStore.get("x-search");
  if (searchHeader) {
    return parseSearchParamsFromQuery(searchHeader);
  }

  const invokeQuery = headerStore.get("x-invoke-query");
  if (invokeQuery) {
    try {
      return parseSearchParamsFromQuery(decodeURIComponent(invokeQuery));
    } catch {
      return parseSearchParamsFromQuery(invokeQuery);
    }
  }

  const requestUrl =
    headerStore.get("x-url") ??
    headerStore.get("next-url") ??
    headerStore.get("x-next-url") ??
    "";
  const queryIndex = requestUrl.indexOf("?");
  if (queryIndex >= 0) {
    return parseSearchParamsFromQuery(requestUrl.slice(queryIndex + 1));
  }

  return {};
}

export function redirectLegacyProductPath(
  params: string[],
  product: ProductDetail,
  searchParams: SearchParams = {},
): void {
  const targetPath = getLegacyProductRedirectPath(params, product);
  if (!targetPath) return;

  const nextSearch: SearchParams = { ...searchParams };
  const pathVariant = params[2] ? decodeURIComponent(params[2]).trim() : "";

  if (pathVariant && !hasVariantQuery(nextSearch)) {
    nextSearch[VARIANT_QUERY_KEY] = pathVariant;
  }

  permanentRedirect(appendSearchParams(targetPath, nextSearch));
}
