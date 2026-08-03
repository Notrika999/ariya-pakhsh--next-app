// app/api/products/route.ts
// این API route برای infinite scroll توسط client استفاده میشه

import { NextRequest, NextResponse } from "next/server";
import {
  getProductListFromSearchParams,
  ProductServiceError,
} from "@/src/services/product/product.server";
import {
  allBrandSlugParams,
  parseSortOrder,
} from "@/src/lib/helper/productListHelpers";

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

  const sort = parseSortOrder(sortRaw);

  const hasCategoryId = !!categoryId;
  const isAllProductsPath = !slug || slug === "products";

  try {
    const result = await getProductListFromSearchParams(
      {
        CategoryId: hasCategoryId ? categoryId : null,
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

    if (error instanceof ProductServiceError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: "خطا در دریافت محصولات" },
      { status: 500 },
    );
  }
}
