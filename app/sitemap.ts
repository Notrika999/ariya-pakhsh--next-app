// app/sitemap.ts
import { MetadataRoute } from "next";
import { buildBackendApiUrl } from "@/src/lib/api/backend-base";
import { absoluteUrl, SITE_URL } from "@/src/lib/seo/site";

type SitemapProduct = {
  publicCode?: string;
  slug?: string;
  id?: string;
};

type SitemapBlog = {
  slug?: string;
};

type SitemapCategory = {
  slug?: string;
  children?: SitemapCategory[];
};

function unwrapList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;

  if (Array.isArray(record.data)) return record.data;

  if (record.data && typeof record.data === "object") {
    const inner = record.data as Record<string, unknown>;
    if (Array.isArray(inner.items)) return inner.items;
    if (Array.isArray(inner.data)) return inner.data;
    if (Array.isArray(inner.rootCategories)) return inner.rootCategories;
  }

  return [];
}

async function fetchSitemapList(path: string): Promise<unknown[]> {
  try {
    const res = await fetch(buildBackendApiUrl(path), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const payload = await res.json();
    return unwrapList(payload);
  } catch {
    return [];
  }
}

function mapProducts(items: unknown[]): MetadataRoute.Sitemap {
  return items
    .filter((item): item is SitemapProduct =>
      Boolean(item && typeof item === "object"),
    )
    .map((product) => {
      if (product.publicCode && product.slug) {
        return {
          url: absoluteUrl(`/product/${product.publicCode}/${product.slug}`),
          lastModified: new Date(),
          priority: 0.9,
        };
      }
      if (product.id) {
        return {
          url: absoluteUrl(`/product/${product.id}`),
          lastModified: new Date(),
          priority: 0.9,
        };
      }
      return null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

function mapBlogs(items: unknown[]): MetadataRoute.Sitemap {
  return items
    .filter((item): item is SitemapBlog =>
      Boolean(item && typeof item === "object"),
    )
    .filter((blog) => typeof blog.slug === "string" && blog.slug.length > 0)
    .map((blog) => ({
      url: absoluteUrl(`/blog/${blog.slug}`),
      lastModified: new Date(),
      priority: 0.7,
    }));
}

function flattenCategorySlugs(categories: SitemapCategory[]): string[] {
  const slugs: string[] = [];
  const stack = [...categories];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    if (typeof current.slug === "string" && current.slug.length > 0) {
      slugs.push(current.slug);
    }

    if (Array.isArray(current.children) && current.children.length > 0) {
      stack.push(...current.children);
    }
  }

  return Array.from(new Set(slugs));
}

function mapCategories(items: unknown[]): MetadataRoute.Sitemap {
  const categories = items.filter(
    (item): item is SitemapCategory =>
      Boolean(item && typeof item === "object"),
  );

  return flattenCategorySlugs(categories).map((slug) => ({
    url: absoluteUrl(`/products/${slug}`),
    lastModified: new Date(),
    priority: 0.8,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogs, categories] = await Promise.all([
    fetchSitemapList("api/v1/products/sitemap"),
    fetchSitemapList("api/v1/blogs/sitemap"),
    fetchSitemapList("api/v1/Categories/mega-menu"),
  ]);

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: absoluteUrl("/products"),
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: absoluteUrl("/incredible-offers"),
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: new Date(),
      priority: 0.4,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: new Date(),
      priority: 0.4,
    },
    {
      url: absoluteUrl("/faq"),
      lastModified: new Date(),
      priority: 0.4,
    },
    {
      url: absoluteUrl("/privacy-policy"),
      lastModified: new Date(),
      priority: 0.2,
    },
    {
      url: absoluteUrl("/rules"),
      lastModified: new Date(),
      priority: 0.2,
    },
    ...mapCategories(categories),
    ...mapProducts(products),
    ...mapBlogs(blogs),
  ];
}
