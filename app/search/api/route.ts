import { NextResponse } from "next/server";
import { getSearchProductsFromSearchParams } from "@/src/services/search/search-products.server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function toSearchParamsRecord(searchParams: URLSearchParams) {
  const record: Record<string, string | string[]> = {};

  searchParams.forEach((value, key) => {
    const existing = record[key];
    if (Array.isArray(existing)) {
      existing.push(value);
      return;
    }

    if (existing !== undefined) {
      record[key] = [existing, value];
      return;
    }

    record[key] = value;
  });

  return record;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const result = await getSearchProductsFromSearchParams(
      toSearchParamsRecord(url.searchParams),
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[search/api] failed =>", error);
    return NextResponse.json(
      {
        items: [],
        products: [],
        page: 1,
        pageSize: 24,
        totalPages: 0,
        totalCount: 0,
        filterOptions: {
          brands: [],
          categories: [],
          attributes: [],
          colors: [],
          vehicles: [],
          minPrice: 0,
          maxPrice: 0,
        },
        errorMessage:
          error instanceof Error
            ? error.message
            : "خطا در دریافت نتایج جستجو",
      },
      { status: 500 },
    );
  }
}
