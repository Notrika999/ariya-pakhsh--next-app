// app/api/products/route.ts
// این API route برای infinite scroll توسط client استفاده میشه

import { NextRequest, NextResponse } from "next/server";
import { getProductListFromSearchParams } from "@/src/services/product/product.server";
import type { SortOrder } from "@/src/lib/types/productTypes";
import { allBrandSlugParams } from "@/src/lib/helper/productListHelpers";

const SORT_ORDERS: SortOrder[] = [
  "newest",
  "oldest",
  "priceAsc",
  "priceDesc",
  "bestSelling",
  "mostRated",
];

const SORT_ORDER_ALIASES: Record<string, SortOrder> = {
  priceAsc: "priceAsc",
  priceDesc: "priceDesc",
  bestSelling: "bestSelling",
  mostRated: "mostRated",
};

function searchParamsToRecord(
  sp: URLSearchParams,
): Record<string, string | string[] | undefined> {
  const record: Record<string, string | string[] | undefined> = {};
  sp.forEach((value, key) => {
    const existing = record[key];
    if (existing === undefined) {
      record[key] = value;
      return;
    }
    if (Array.isArray(existing)) {
      existing.push(value);
      return;
    }
    record[key] = [existing, value];
  });
  return record;
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const slug = sp.get("slug") ?? "";
  const categoryId = sp.get("categoryId") ?? undefined;
  const page = Number(sp.get("page") ?? "1");
  const queryBrands = allBrandSlugParams(sp);
  const minPrice = sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined;
  const maxPrice = sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined;
  const sortRaw = sp.get("sort") ?? undefined;
  const inStock = sp.get("inStock") === "true" ? true : undefined;
  const onSaleOnly = sp.get("onSaleOnly") === "true" ? true : undefined;

  const sort =
    sortRaw && SORT_ORDER_ALIASES[sortRaw]
      ? SORT_ORDER_ALIASES[sortRaw]
      : SORT_ORDERS.includes(sortRaw as SortOrder)
        ? (sortRaw as SortOrder)
        : undefined;

  const hasCategoryId = !!categoryId;
  const isAllProductsPath = !slug || slug === "products";

  try {
    const result = await getProductListFromSearchParams(
      {
        CategoryId: hasCategoryId ? categoryId : undefined,
        CategorySlug: hasCategoryId ? slug : undefined,
        PathBrandSlug:
          !hasCategoryId && !isAllProductsPath && queryBrands.length === 0
            ? slug
            : undefined,
        Page: page,
        MinPrice: minPrice,
        MaxPrice: maxPrice,
        SortOrder: sort,
        InStock: inStock,
        OnSaleOnly: onSaleOnly,
      },
      searchParamsToRecord(sp),
    );

    return NextResponse.json({
      items: result.items,
      page: result.page,
      totalPages: result.totalPages,
      totalCount: result.totalCount,
    });
  } catch (error) {
    console.error("API products error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت محصولات" },
      { status: 500 },
    );
  }
}
