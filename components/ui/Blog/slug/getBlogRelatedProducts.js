import "server-only";

import { getSearchProductsFromSearchParams } from "@/src/services/search/search-products.server";

const EMPTY_RESULT = {
  products: [],
  totalCount: 0,
  searchHref: "/search",
};

export async function getBlogRelatedProducts(keyword, pageSize = 8) {
  const query = String(keyword ?? "").trim();
  if (!query) return EMPTY_RESULT;

  const searchHref = `/search?Q=${encodeURIComponent(query)}`;

  try {
    const result = await getSearchProductsFromSearchParams({
      Q: query,
      PageSize: String(pageSize),
      pageSize: String(pageSize),
    });

    return {
      products: result.products ?? [],
      totalCount: Number(result.totalCount ?? 0),
      searchHref,
    };
  } catch (error) {
    console.error("[blog] related products failed =>", error);
    return { ...EMPTY_RESULT, searchHref };
  }
}
