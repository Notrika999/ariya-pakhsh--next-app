import type { MetadataRoute } from "next";
import { buildBackendApiUrl } from "@/src/lib/api/backend-base";
import { absoluteUrl } from "@/src/lib/seo/site";

const REVALIDATE_SECONDS = 60 * 60;
const PRODUCT_PAGE_SIZE = 100;
const ARTICLE_PAGE_SIZE = 100;
const MAX_SITEMAP_URLS = 50_000;
const FETCH_TIMEOUT_MS = 30_000;
const PAGE_FETCH_CONCURRENCY = 3;

export const dynamic = "force-dynamic";
export const revalidate = 3600;

type ApiEnvelope<T> = {
  data?: T | null;
  success?: boolean;
  isSuccess?: boolean;
};

type SitemapProduct = {
  productId?: unknown;
  id?: unknown;
  publicCode?: unknown;
  slug?: unknown;
  primaryBrandSlug?: unknown;
};

type ProductPage = {
  items?: unknown[];
  totalPages?: number;
};

type SitemapCategory = {
  slug?: unknown;
  children?: unknown;
};

type SitemapArticle = {
  slug?: unknown;
  publishedAt?: unknown;
  updatedAt?: unknown;
  modifiedAt?: unknown;
  canonicalUrl?: unknown;
  seo?: unknown;
  status?: unknown;
  isPublished?: unknown;
  published?: unknown;
  isDeleted?: unknown;
  deleted?: unknown;
  isActive?: unknown;
  active?: unknown;
};

type ArticlePage = {
  items?: unknown[];
  totalPages?: number;
};

class SitemapDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SitemapDataError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
  }

  return null;
}

function asValidDate(value: unknown): Date | undefined {
  const raw = asNonEmptyString(value);
  if (!raw) return undefined;

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function isValidSlugSegment(value: string): boolean {
  const decoded = decodeURIComponent(value).trim();
  return Boolean(decoded) && !decoded.includes("/") && !decoded.includes("..");
}

function isIndexableRobots(value: unknown): boolean {
  const raw = asNonEmptyString(value);
  if (!raw) return true;

  return !raw
    .toLowerCase()
    .split(/[,\s]+/)
    .filter(Boolean)
    .includes("noindex");
}

function isPublicListItem(item: SitemapArticle): boolean {
  const status = asNonEmptyString(item.status)?.toLowerCase();
  const isPublished = asBoolean(item.isPublished ?? item.published);
  const isDeleted = asBoolean(item.isDeleted ?? item.deleted);
  const isActive = asBoolean(item.isActive ?? item.active);

  if (status && ["draft", "deleted", "inactive", "archived"].includes(status)) {
    return false;
  }

  if (isPublished === false || isDeleted === true || isActive === false) {
    return false;
  }

  if (isRecord(item.seo) && !isIndexableRobots(item.seo.robots)) {
    return false;
  }

  return true;
}

function isSameSiteMagazineCanonical(
  canonicalUrl: string,
  slug: string,
): boolean {
  try {
    const url = new URL(canonicalUrl);
    const expectedUrl = new URL(absoluteUrl(`/mag/${encodeURIComponent(slug)}`));

    return (
      url.origin === expectedUrl.origin &&
      url.pathname === expectedUrl.pathname &&
      url.search === ""
    );
  } catch {
    return false;
  }
}

function createSitemapEntry(
  path: string,
  options: Omit<MetadataRoute.Sitemap[number], "url">,
): MetadataRoute.Sitemap[number] | null {
  if (!path || !path.startsWith("/")) return null;

  return {
    url: absoluteUrl(path),
    ...options,
  };
}

async function mapInBatches<T, R>(
  items: T[],
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];

  for (let index = 0; index < items.length; index += PAGE_FETCH_CONCURRENCY) {
    const batch = items.slice(index, index + PAGE_FETCH_CONCURRENCY);
    results.push(...(await Promise.all(batch.map(mapper))));
  }

  return results;
}

async function sitemapFetch(
  input: string | URL,
  init: RequestInit,
): Promise<Response> {
  const attempt = async () =>
    fetch(input, {
      ...init,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });

  try {
    return await attempt();
  } catch {
    return attempt();
  }
}

async function fetchProductPage(page: number): Promise<ProductPage> {
  try {
    const response = await sitemapFetch(
      buildBackendApiUrl("/api/v1/Products/filter"),
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ page, pageSize: PRODUCT_PAGE_SIZE }),
      },
    );

    if (!response.ok) {
      throw new SitemapDataError(
        `Products sitemap request failed on page ${page}: ${response.status}`,
      );
    }

    const payload = (await response.json()) as ApiEnvelope<ProductPage>;
    const succeeded = payload.success ?? payload.isSuccess ?? true;

    if (!succeeded || !payload.data || !Array.isArray(payload.data.items)) {
      throw new SitemapDataError(
        `Products sitemap response is invalid on page ${page}`,
      );
    }

    return payload.data;
  } catch (error) {
    console.error("[sitemap] Failed to fetch products", { page, error });
    throw error;
  }
}

async function fetchProducts(): Promise<unknown[]> {
  const firstPage = await fetchProductPage(1);

  const reportedPageCount = Number(firstPage.totalPages) || 1;
  const maximumPageCount = Math.floor(
    MAX_SITEMAP_URLS / PRODUCT_PAGE_SIZE,
  );
  const pageCount = Math.min(
    Math.max(1, reportedPageCount),
    maximumPageCount,
  );

  const remainingPages = await mapInBatches(
    Array.from({ length: pageCount - 1 }, (_, index) => index + 2),
    fetchProductPage,
  );

  return [
    ...(firstPage.items ?? []),
    ...remainingPages.flatMap((page) => page?.items ?? []),
  ];
}

async function fetchCategories(): Promise<unknown[]> {
  try {
    const response = await sitemapFetch(
      buildBackendApiUrl("/api/v1/Categories/mega-menu"),
      {},
    );

    if (!response.ok) {
      throw new SitemapDataError(
        `Categories sitemap request failed: ${response.status}`,
      );
    }

    const payload = (await response.json()) as ApiEnvelope<{
      rootCategories?: unknown[];
    }>;

    if (!Array.isArray(payload.data?.rootCategories)) {
      throw new SitemapDataError("Categories sitemap response is invalid");
    }

    return payload.data.rootCategories;
  } catch (error) {
    console.error("[sitemap] Failed to fetch categories", error);
    throw error;
  }
}

async function fetchArticlePage(page: number): Promise<ArticlePage> {
  try {
    const url = new URL(buildBackendApiUrl("/api/v1/magazine/articles"));
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(ARTICLE_PAGE_SIZE));
    url.searchParams.set("sort", "latest");

    const pagedResponse = await sitemapFetch(url, {
      headers: { accept: "application/json" },
    });

    if (!pagedResponse.ok) {
      throw new SitemapDataError(
        `Magazine sitemap request failed on page ${page}: ${pagedResponse.status}`,
      );
    }

    const payload = (await pagedResponse.json()) as ApiEnvelope<ArticlePage>;
    const succeeded = payload.success ?? payload.isSuccess ?? true;

    if (!succeeded || !payload.data || !Array.isArray(payload.data.items)) {
      throw new SitemapDataError(
        `Magazine sitemap response is invalid on page ${page}`,
      );
    }

    return payload.data;
  } catch (error) {
    console.error("[sitemap] Failed to fetch magazine articles", {
      page,
      error,
    });
    throw error;
  }
}

async function fetchArticles(): Promise<unknown[]> {
  const firstPage = await fetchArticlePage(1);
  const reportedPageCount = Number(firstPage.totalPages) || 1;
  const remainingCapacity = Math.max(1, MAX_SITEMAP_URLS);
  const maximumPageCount = Math.floor(remainingCapacity / ARTICLE_PAGE_SIZE);
  const pageCount = Math.min(Math.max(1, reportedPageCount), maximumPageCount);

  const remainingPages = await mapInBatches(
    Array.from({ length: pageCount - 1 }, (_, index) => index + 2),
    fetchArticlePage,
  );

  return [
    ...(firstPage.items ?? []),
    ...remainingPages.flatMap((page) => page.items ?? []),
  ];
}

function mapProducts(items: unknown[]): MetadataRoute.Sitemap {
  return items
    .filter((item): item is SitemapProduct => isRecord(item))
    .map((product) => {
      const publicCode = asNonEmptyString(product.publicCode);
      const slug = asNonEmptyString(product.slug);

      if (!publicCode || !slug || !isValidSlugSegment(slug)) {
        return null;
      }

      return createSitemapEntry(
        `/product/${encodeURIComponent(publicCode)}/${encodeURIComponent(slug)}`,
        {
          changeFrequency: "daily" as const,
          priority: 0.8,
        },
      );
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

function mapBrandsFromProducts(items: unknown[]): MetadataRoute.Sitemap {
  const slugs = new Set(
    items
      .filter((item): item is SitemapProduct => isRecord(item))
      .map((product) => asNonEmptyString(product.primaryBrandSlug))
      .filter((slug): slug is string => slug !== null),
  );

  return [...slugs]
    .filter(isValidSlugSegment)
    .map((slug) =>
      createSitemapEntry(`/products/${encodeURIComponent(slug)}`, {
        changeFrequency: "weekly",
        priority: 0.7,
      }),
    )
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

function flattenCategorySlugs(items: unknown[]): string[] {
  const slugs = new Set<string>();
  const stack = items.filter(
    (item): item is SitemapCategory => isRecord(item),
  );

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    const slug = asNonEmptyString(current.slug);
    if (slug) slugs.add(slug);

    if (Array.isArray(current.children)) {
      stack.push(
        ...current.children.filter(
          (child): child is SitemapCategory => isRecord(child),
        ),
      );
    }
  }

  return [...slugs];
}

function mapCategories(items: unknown[]): MetadataRoute.Sitemap {
  return flattenCategorySlugs(items)
    .filter(isValidSlugSegment)
    .map((slug) =>
      createSitemapEntry(`/products/${encodeURIComponent(slug)}`, {
        changeFrequency: "weekly",
        priority: 0.7,
      }),
    )
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

function mapArticles(items: unknown[]): MetadataRoute.Sitemap {
  return items
    .filter((item): item is SitemapArticle => isRecord(item))
    .filter(isPublicListItem)
    .map((article) => {
      const slug = asNonEmptyString(article.slug);
      if (!slug || !isValidSlugSegment(slug)) return null;

      const seo = isRecord(article.seo) ? article.seo : {};
      const canonicalUrl =
        asNonEmptyString(article.canonicalUrl) ??
        asNonEmptyString(seo.canonicalUrl) ??
        absoluteUrl(`/mag/${encodeURIComponent(slug)}`);

      if (!isSameSiteMagazineCanonical(canonicalUrl, slug)) {
        return null;
      }

      return createSitemapEntry(`/mag/${encodeURIComponent(slug)}`, {
        changeFrequency: "monthly",
        priority: 0.6,
        lastModified: asValidDate(
          article.updatedAt ?? article.modifiedAt ?? article.publishedAt,
        ),
      });
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

function deduplicate(
  entries: MetadataRoute.Sitemap,
): MetadataRoute.Sitemap {
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, articles] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
    fetchArticles(),
  ]);

  const categorySlugs = new Set(flattenCategorySlugs(categories));
  const brandSlugs = new Set(
    products
      .filter((item): item is SitemapProduct => isRecord(item))
      .map((product) => asNonEmptyString(product.primaryBrandSlug))
      .filter((slug): slug is string => slug !== null),
  );
  const collisions = [...categorySlugs].filter((slug) => brandSlugs.has(slug));

  if (collisions.length > 0) {
    console.warn("[sitemap] Category/brand slug collisions detected", {
      collisions,
    });
  }

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/products"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/incredible-offers"),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/mag"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/about"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/contact"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/faq"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/privacy-policy"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: absoluteUrl("/rules"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  return deduplicate([
    ...staticEntries,
    ...mapCategories(categories),
    ...mapBrandsFromProducts(products),
    ...mapProducts(products),
    ...mapArticles(articles),
  ]).slice(0, MAX_SITEMAP_URLS);
}
