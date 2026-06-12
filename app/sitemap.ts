import { MetadataRoute } from "next";

const BASE_URL = "https://carup24.com";

/**
 * ⚠️ این توابع باید از بک‌اند .NET دیتا بگیرند
 * فقط slug / id برگردانند
 */

async function getProducts() {
  const res = await fetch(`${process.env.API_URL}/products/sitemap`, {
    cache: "no-store",
  });
  return res.json(); // [{ id: "1" }, ...]
}

async function getBlogs() {
  const res = await fetch(`${process.env.API_URL}/blogs/sitemap`, {
    cache: "no-store",
  });
  return res.json(); // [{ slug: "post-title" }, ...]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogs] = await Promise.all([
    getProducts(),
    getBlogs(),
  ]);

  return [
    // ✅ صفحات ثابت و مهم
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/contact`,
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/faq`,
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/rules`,
      priority: 0.2,
    },

    // ✅ صفحات محصول
    ...products.map((product: { id: string }) => ({
      url: `${BASE_URL}/product/${product.id}`,
      lastModified: new Date(),
      priority: 0.9,
    })),

    // ✅ بلاگ
    ...blogs.map((blog: { slug: string }) => ({
      url: `${BASE_URL}/blog/${blog.slug}`,
      lastModified: new Date(),
      priority: 0.7,
    })),
  ];
}
