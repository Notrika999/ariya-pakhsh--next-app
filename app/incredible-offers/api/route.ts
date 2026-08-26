import { NextRequest, NextResponse } from "next/server";

import { getAmazingFilteredProducts } from "@/src/services/promotion/promotion.server";
import {
  searchParamsToRecord,
  toAmazingFilterParams,
} from "@/src/lib/helper/amazingProductListHelpers";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
  try {
    const result = await getAmazingFilteredProducts(
      toAmazingFilterParams(searchParamsToRecord(request.nextUrl.searchParams)),
    );
    const prices = result.products.map(
      (product) => product.discountedPrice ?? product.price ?? 0,
    );

    return NextResponse.json({
      products: result.products,
      page: result.pageNumber,
      totalPages: result.totalPages,
      totalCount: result.totalCount,
      filterOptions: {
        brands: result.brands.map((brand) => ({
          brandId: brand.brandId,
          name: brand.name,
          slug: brand.slug,
          count: 0,
        })),
        categories: [],
        attributes: result.colorFilterOptions.length
          ? [
              {
                attributeId: "color",
                attributeName: "رنگ",
                options: result.colorFilterOptions,
              },
            ]
          : [],
        minPrice: prices.length ? Math.min(...prices) : 0,
        maxPrice: prices.length ? Math.max(...prices) : 0,
      },
    });
  } catch (error) {
    console.error("Amazing products API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch amazing products" },
      { status: 500 },
    );
  }
}
