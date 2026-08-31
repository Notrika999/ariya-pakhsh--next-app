// app/robots.ts
import { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/src/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/serwist/",
        "/products/api",
        "/search/api",
        "/incredible-offers/api",
        "/cart",
        "/compare",
        "/user-profile",
        "/checkout",
        "/payment-result",
        "/success-payment",
        "/fail-payment",
        "/accept",
        "/mellat/",
        "/~offline",
      ],
    },
    host: SITE_URL,
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
