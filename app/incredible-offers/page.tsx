// app/incredible-offers/page.tsx

import DealsClient from "@/components/ui/IncredibleOffers/DealsClient/DealsClient";
import {
  AmazingFilterParams,
  getAmazingFilteredProducts,
  getSpecialPromotionProducts,
} from "@/src/services/promotion/promotion.server";
import { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/src/lib/seo/site";
import {
  colorPaletteParams,
  getColorOptionLabel,
  listSearchParamValues,
} from "@/src/lib/helper/productListHelpers";

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

type PageSearchParams = Record<string, string | string[] | undefined>;

function firstParam(
  searchParams: PageSearchParams,
  key: string,
): string | undefined {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function listParam(searchParams: PageSearchParams, key: string): string[] {
  const value = searchParams[key];
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberParam(
  searchParams: PageSearchParams,
  key: string,
): number | undefined {
  const value = firstParam(searchParams, key);
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function booleanParam(
  searchParams: PageSearchParams,
  key: string,
): boolean | undefined {
  const value = firstParam(searchParams, key);
  if (value === undefined) return undefined;
  return value === "true";
}

function sortByParam(value?: string): AmazingFilterParams["SortBy"] {
  switch (value) {
    case "bestDiscount":
    case "priceAsc":
    case "priceDesc":
    case "newest":
    case "bestSelling":
      return value;
    case "discountDesc":
    case "default":
    case "Default":
      return "bestDiscount";
    default:
      return "bestDiscount";
  }
}

function defaultVariantByParam(
  value?: string,
): AmazingFilterParams["DefaultVariantBy"] {
  return value === "basePrice" ? "basePrice" : "finalPrice";
}

function toAmazingFilterParams(
  searchParams: PageSearchParams,
  options?: {
    colorOptionIds?: string[];
    brandIds?: string[];
  },
): AmazingFilterParams {
  const sortBy =
    firstParam(searchParams, "SortBy") ?? firstParam(searchParams, "sort");
  const defaultVariantBy = firstParam(searchParams, "DefaultVariantBy");
  const resolvedColorOptionIds = [
    ...(options?.colorOptionIds ?? []),
    ...listParam(searchParams, "ColorOptionIds"),
    ...listParam(searchParams, "attr_color"),
  ];
  const resolvedBrandIds = [
    ...(options?.brandIds ?? []),
    ...listParam(searchParams, "BrandIds"),
    ...listParam(searchParams, "brandId"),
  ];

  return {
    Page:
      numberParam(searchParams, "Page") ??
      numberParam(searchParams, "page") ??
      1,
    PageSize:
      numberParam(searchParams, "PageSize") ??
      numberParam(searchParams, "pageSize") ??
      24,
    BrandIds: [...new Set(resolvedBrandIds)],
    ColorOptionIds: [...new Set(resolvedColorOptionIds)],
    CategoryId: firstParam(searchParams, "CategoryId"),
    InStockOnly:
      booleanParam(searchParams, "InStockOnly") ??
      booleanParam(searchParams, "inStock"),
    MinPrice:
      numberParam(searchParams, "MinPrice") ??
      numberParam(searchParams, "minPrice"),
    MaxPrice:
      numberParam(searchParams, "MaxPrice") ??
      numberParam(searchParams, "maxPrice"),
    SortBy: sortByParam(sortBy),
    DefaultVariantBy: defaultVariantByParam(defaultVariantBy),
  };
}

async function IncredibleOffersPage({
  searchParams,
}: {
  searchParams?: Promise<PageSearchParams>;
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
    <main className="space-y-12 py-8 my-8">
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
      />
    </main>
  );
}

export default IncredibleOffersPage;
