import { MetadataRoute } from "next";
import { absoluteUrl } from "@/src/lib/seo/site";

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
          "/incredible-offers",
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
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
