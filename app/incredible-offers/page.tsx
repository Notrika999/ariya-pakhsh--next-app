// app/incredible-offers/page.tsx

import DealsClient from "@/components/ui/IncredibleOffers/DealsClient/DealsClient";
import {
  getAmazingFilteredProducts,
  getSpecialPromotionProducts,
} from "@/src/services/promotion/promotion.server";
import { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/src/lib/seo/site";
import {
  colorPaletteParams,
  getColorOptionLabel,
  listSearchParamValues,
  normalizeProductSearchParams,
} from "@/src/lib/helper/productListHelpers";
import {
  AmazingPageSearchParams,
  toAmazingFilterParams,
} from "@/src/lib/helper/amazingProductListHelpers";

// تعریف متادیتای سئو
export const metadata: Metadata = {
  title: "پیشنهادهای شگفت انگیز کارآپ 24 | تخفیف‌های ویژه امروز",
  description:
    "در صفحه پیشنهادهای شگفت‌انگیز کارآپ 24 هر روز منتظر بهترین تخفیف‌ها باشید. خرید محصولات با قیمت ویژه و تخفیف‌های باورنکردنی در دسته‌بندی‌های مختلف.",
  keywords: [
    "پیشنهاد شگفت انگیز",
    "تخفیف ویژه",
    "خرید ارزان",
    "حراج کارآپ 24",
    "قیمت های باورنکردنی",
  ],
  alternates: {
    canonical: absoluteUrl("/incredible-offers"),
  },
  openGraph: {
    title: "پیشنهادهای شگفت انگیز | تخفیف‌های ویژه روزانه",
    description: "بهترین تخفیف‌های روز را در پیشنهاد شگفت‌انگیز تجربه کنید.",
    url: absoluteUrl("/incredible-offers"),
    siteName: SITE_NAME,
    type: "website",
  },
};

async function IncredibleOffersPage({
  searchParams,
}: {
  searchParams?: Promise<AmazingPageSearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const paletteLabels = colorPaletteParams(resolvedSearchParams);
  const brandSlugs = listSearchParamValues(resolvedSearchParams, "brand");

  let colorOptionIds: string[] = [];
  let brandIds: string[] = [];

  if (paletteLabels.length > 0 || brandSlugs.length > 0) {
    const preview = await getAmazingFilteredProducts(
      toAmazingFilterParams(resolvedSearchParams),
    );
    const normalize = (value: string) => value.trim().toLowerCase();

    if (paletteLabels.length > 0) {
      const wanted = new Set(paletteLabels.map(normalize));
      colorOptionIds = preview.colorFilterOptions
        .filter((option) => wanted.has(normalize(getColorOptionLabel(option))))
        .map((option) => option.optionId);
    }

    if (brandSlugs.length > 0) {
      const wanted = new Set(brandSlugs.map(normalize));
      brandIds = preview.brands
        .filter((brand) => wanted.has(normalize(brand.slug ?? "")))
        .map((brand) => brand.brandId);
    }
  }

  const [amazingResult, specialProducts] = await Promise.all([
    getAmazingFilteredProducts(
      toAmazingFilterParams(resolvedSearchParams, {
        colorOptionIds,
        brandIds,
      }),
    ),
    getSpecialPromotionProducts(),
  ]);

  const prices = amazingResult.products.map(
    (product) => product.discountedPrice ?? product.price ?? 0,
  );
  const minLimit = prices.length ? Math.min(...prices) : 0;
  const maxLimit = prices.length ? Math.max(...prices) : 0;
  const filterOptions = {
    brands: amazingResult.brands.map((brand) => ({
      brandId: brand.brandId,
      name: brand.name,
      slug: brand.slug,
      count: 0,
    })),
    categories: [],
    attributes: amazingResult.colorFilterOptions.length
      ? [
          {
            attributeId: "color",
            attributeName: "رنگ",
            options: amazingResult.colorFilterOptions,
          },
        ]
      : [],
    minPrice: minLimit,
    maxPrice: maxLimit,
  };

  return (
    <main className="space-y-12 pb-8 mb-8">
      <DealsClient
        products={amazingResult.products}
        specialProducts={specialProducts}
        pagination={{
          page: amazingResult.pageNumber,
          totalPages: amazingResult.totalPages,
          totalCount: amazingResult.totalCount,
        }}
        filterOptions={filterOptions}
        minLimit={minLimit}
        maxLimit={maxLimit}
        serverSearchKey={normalizeProductSearchParams(resolvedSearchParams)}
      />
    </main>
  );
}

export default IncredibleOffersPage;
