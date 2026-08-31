import type { MetadataRoute } from "next";
import {
  SITE_BACKGROUND_COLOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_THEME_COLOR,
} from "@/src/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: SITE_BACKGROUND_COLOR,
    theme_color: SITE_THEME_COLOR,
    lang: "fa",
    dir: "rtl",
    categories: ["shopping", "automotive"],
    icons: [
      {
        src: "/icons/carup24-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/carup24-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/carup24-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/carup24-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "همه محصولات",
        short_name: "محصولات",
        description: "مشاهده و جستجوی همه محصولات کارآپ 24",
        url: "/products",
      },
      {
        name: "پیشنهادهای شگفت‌انگیز",
        short_name: "شگفت‌انگیز",
        description: "مشاهده تخفیف‌ها و پیشنهادهای ویژه",
        url: "/incredible-offers",
      },
      {
        name: "مجله کارآپ 24",
        short_name: "مجله",
        description: "راهنمای خرید و نگهداری لوازم خودرو",
        url: "/mag",
      },
    ],
  };
}
