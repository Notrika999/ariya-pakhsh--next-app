import DealsClient from "@/components/ui/IncredibleOffers/DealsClient/DealsClient";
import {
  AmazingFilterParams,
  getAmazingFilteredProducts,
  getSpecialPromotionProducts,
} from "@/src/services/promotion/promotion.server";
import { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/src/lib/seo/site";

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

function toAmazingFilterParams(
  searchParams: PageSearchParams,
): AmazingFilterParams {
  const sortBy =
    firstParam(searchParams, "SortBy") ?? firstParam(searchParams, "sort");
  const defaultVariantBy = firstParam(searchParams, "DefaultVariantBy");
  const colorOptionIds = [
    ...listParam(searchParams, "ColorOptionIds"),
    ...listParam(searchParams, "attr_color"),
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
    BrandIds: [
      ...listParam(searchParams, "BrandIds"),
      ...listParam(searchParams, "brandId"),
    ],
    ColorOptionIds: colorOptionIds,
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
    SortBy:
      sortBy === "priceAsc" ||
      sortBy === "priceDesc" ||
      sortBy === "newest" ||
      sortBy === "bestSelling"
        ? sortBy
        : sortBy === "discountDesc" || sortBy === "default"
          ? "bestDiscount"
        : "bestDiscount",
    DefaultVariantBy:
      defaultVariantBy === "basePrice" ? "basePrice" : "finalPrice",
  };
}

async function IncredibleOffersPage({
  searchParams,
}: {
  searchParams?: Promise<PageSearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const [amazingResult, specialProducts] = await Promise.all([
    getAmazingFilteredProducts(toAmazingFilterParams(resolvedSearchParams)),
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
