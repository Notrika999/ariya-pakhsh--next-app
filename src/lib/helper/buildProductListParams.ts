import { ProductListParams } from "../types/productTypes";

export default function buildProductListParams(params: ProductListParams) {
  const searchParams = new URLSearchParams();

  if (params.CategoryId) searchParams.append("CategoryId", params.CategoryId);

  if (params.BrandId) searchParams.append("BrandId", params.BrandId);

  if (params.MinPrice) searchParams.append("MinPrice", String(params.MinPrice));

  if (params.MaxPrice) searchParams.append("MaxPrice", String(params.MaxPrice));

  if (params.InStock !== undefined)
    searchParams.append("InStock", String(params.InStock));

  if (params.OnSaleOnly !== undefined)
    searchParams.append("OnSaleOnly", String(params.OnSaleOnly));

  if (params.SortOrder) searchParams.append("SortOrder", params.SortOrder);

  searchParams.append("Page", String(params.Page ?? 1));
  searchParams.append("PageSize", String(params.PageSize ?? 24));

  if (params.AttributeFilters) {
    searchParams.append(
      "AttributeFilters",
      JSON.stringify(params.AttributeFilters),
    );
  }

  return searchParams;
}
