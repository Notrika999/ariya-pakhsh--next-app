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

function unwrapList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;

  if (Array.isArray(record.data)) return record.data;

  if (record.data && typeof record.data === "object") {
    const inner = record.data as Record<string, unknown>;
    if (Array.isArray(inner.items)) return inner.items;
    if (Array.isArray(inner.data)) return inner.data;
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
    .filter((item): item is SitemapProduct => Boolean(item && typeof item === "object"))
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
    .filter((item): item is SitemapBlog => Boolean(item && typeof item === "object"))
    .filter((blog) => typeof blog.slug === "string" && blog.slug.length > 0)
    .map((blog) => ({
      url: absoluteUrl(`/blog/${blog.slug}`),
      lastModified: new Date(),
      priority: 0.7,
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogs] = await Promise.all([
    fetchSitemapList("/api/v1/products/sitemap"),
    fetchSitemapList("/api/v1/blogs/sitemap"),
  ]);

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: absoluteUrl("/products"),
      priority: 0.9,
    },
    {
      url: absoluteUrl("/incredible-offers"),
      priority: 0.8,
    },
    {
      url: absoluteUrl("/blog"),
      priority: 0.7,
    },
    {
      url: absoluteUrl("/about"),
      priority: 0.4,
    },
    {
      url: absoluteUrl("/contact"),
      priority: 0.4,
    },
    {
      url: absoluteUrl("/faq"),
      priority: 0.4,
    },
    {
      url: absoluteUrl("/privacy-policy"),
      priority: 0.2,
    },
    {
      url: absoluteUrl("/rules"),
      priority: 0.2,
    },
    ...mapProducts(products),
    ...mapBlogs(blogs),
  ];
}
