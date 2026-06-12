import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/product/",
          "/products",
          "/blog/",
          "/about",
          "/contact",
          "/faq",
          "/privacy-policy",
          "/rules",
        ],
        disallow: [
          "/cart",
          "/checkout",
          "/auth",
          "/user-profile",
          "/compare",
          "/success-payment",
          "/fail-payment",
          "/api",
        ],
      },
    ],
    sitemap: "https://carup24.com/sitemap.xml",
  };
}
