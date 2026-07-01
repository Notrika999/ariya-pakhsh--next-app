// app/api/products/route.ts
// این API route برای infinite scroll توسط client استفاده میشه

import { NextRequest, NextResponse } from "next/server";
import { getProductList } from "@/src/services/product/product.server";
import type { SortOrder } from "@/src/lib/types/productTypes";

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

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const slug = sp.get("slug") ?? "";
  const categoryId = sp.get("categoryId") ?? undefined;
  const page = Number(sp.get("page") ?? "1");
  const brandId = sp.get("brandId") ?? undefined;
  const color = sp.get("color") ?? undefined;
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

  // اگه categoryId داریم → فیلتر دسته‌بندی، وگرنه → فیلتر برند
  const hasCategoryId = !!categoryId;

  try {
    const result = await getProductList({
      CategoryId: hasCategoryId ? categoryId : undefined,
      CategorySlug: hasCategoryId ? slug : undefined,
      BrandSlug: hasCategoryId ? undefined : slug,
      Page: page,
      BrandId: brandId,
      Color: color,
      MinPrice: minPrice,
      MaxPrice: maxPrice,
      SortOrder: sort,
      InStock: inStock,
      OnSaleOnly: onSaleOnly,
    });

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
