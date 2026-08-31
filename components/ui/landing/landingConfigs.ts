// landing/landingConfigs.ts

import { LandingConfig } from "@/src/lib/types/landing/landing.types";

export const landingConfigs: Record<string, LandingConfig> = {
  coffee: {
    slug: "coffee",
    sections: [
      {
        type: "heroBannerGrid",
        items: [
          { image: "/banners/coffee1.jpg" },
          { image: "/banners/coffee2.jpg" },
          { image: "/banners/coffee3.jpg" }
        ]
      },
      {
        type: "productSlider",
        title: "شگفت انگیز",
        query: {
          category: "coffee",
          type: "amazing"
        }
      },
      {
        type: "productSlider",
        title: "پیشنهادی",
        query: {
          category: "coffee",
          type: "suggested"
        }
      },
      {
        type: "description",
        title: "قهوه تازه",
        text: "توضیحات دسته قهوه"
      }
    ]
  },

  tea: {
    slug: "tea",
    sections: [
      {
        type: "productSlider",
        title: "محصولات چای",
        query: {
          category: "tea"
        }
      },
      {
        type: "banner",
        image: "/banners/tea-sale.jpg"
      },
      {
        type: "description",
        title: "چای ایرانی",
        text: "توضیحات دسته چای"
      }
    ]
  }
}

export function resolveLandingHref(targetId: unknown): string | null {
  const slug = String(targetId ?? "").trim();

  if (!slug || !Object.prototype.hasOwnProperty.call(landingConfigs, slug)) {
    return null;
  }

  return `/landing/${encodeURIComponent(slug)}`;
}
