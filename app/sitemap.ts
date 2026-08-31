import type { MetadataRoute } from "next";
import { blogPosts } from "@/components/ui/Blog/blogData";
import { buildBackendApiUrl } from "@/src/lib/api/backend-base";
import { absoluteUrl } from "@/src/lib/seo/site";

const REVALIDATE_SECONDS = 60 * 60;
const PRODUCT_PAGE_SIZE = 100;
const MAX_SITEMAP_URLS = 50_000;

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

async function fetchProductPage(page: number): Promise<ProductPage | null> {
  try {
    const response = await fetch(
      buildBackendApiUrl("/api/v1/Products/filter"),
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ page, pageSize: PRODUCT_PAGE_SIZE }),
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );

    if (!response.ok) return null;

    const payload = (await response.json()) as ApiEnvelope<ProductPage>;
    const succeeded = payload.success ?? payload.isSuccess ?? true;

    return succeeded && payload.data && Array.isArray(payload.data.items)
      ? payload.data
      : null;
  } catch {
    return null;
  }
}

async function fetchProducts(): Promise<unknown[]> {
  const firstPage = await fetchProductPage(1);
  if (!firstPage) return [];

  const reportedPageCount = Number(firstPage.totalPages) || 1;
  const maximumPageCount = Math.floor(
    MAX_SITEMAP_URLS / PRODUCT_PAGE_SIZE,
  );
  const pageCount = Math.min(
    Math.max(1, reportedPageCount),
    maximumPageCount,
  );

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      fetchProductPage(index + 2),
    ),
  );

  return [
    ...(firstPage.items ?? []),
    ...remainingPages.flatMap((page) => page?.items ?? []),
  ];
}

async function fetchCategories(): Promise<unknown[]> {
  try {
    const response = await fetch(
      buildBackendApiUrl("/api/v1/Categories/mega-menu"),
      { next: { revalidate: REVALIDATE_SECONDS } },
    );

    if (!response.ok) return [];

    const payload = (await response.json()) as ApiEnvelope<{
      rootCategories?: unknown[];
    }>;

    return Array.isArray(payload.data?.rootCategories)
      ? payload.data.rootCategories
      : [];
  } catch {
    return [];
  }
}

function mapProducts(items: unknown[]): MetadataRoute.Sitemap {
  return items
    .filter((item): item is SitemapProduct => isRecord(item))
    .map((product) => {
      const publicCode = asNonEmptyString(product.publicCode);
      const slug = asNonEmptyString(product.slug);
      const productId =
        asNonEmptyString(product.productId) ?? asNonEmptyString(product.id);

      const path =
        publicCode && slug
          ? `/product/${encodeURIComponent(publicCode)}/${encodeURIComponent(slug)}`
          : productId
            ? `/product/${encodeURIComponent(productId)}`
            : null;

      return path
        ? {
            url: absoluteUrl(path),
            changeFrequency: "daily" as const,
            priority: 0.8,
          }
        : null;
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

  return [...slugs].map((slug) => ({
    url: absoluteUrl(`/products/${encodeURIComponent(slug)}`),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
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
  return flattenCategorySlugs(items).map((slug) => ({
    url: absoluteUrl(`/products/${encodeURIComponent(slug)}`),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}

function mapArticles(): MetadataRoute.Sitemap {
  return blogPosts
    .map((post) => asNonEmptyString(post.slug))
    .filter((slug): slug is string => slug !== null)
    .map((slug) => ({
      url: absoluteUrl(`/mag/${encodeURIComponent(slug)}`),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
}

function deduplicate(
  entries: MetadataRoute.Sitemap,
): MetadataRoute.Sitemap {
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ]);

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
    ...mapArticles(),
  ]).slice(0, MAX_SITEMAP_URLS);
}
