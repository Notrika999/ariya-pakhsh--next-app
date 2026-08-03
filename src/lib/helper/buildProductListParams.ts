import { ProductListParams } from "../types/productTypes";

export default function buildProductListParams(params: ProductListParams) {
  const searchParams = new URLSearchParams();

  if (params.CategoryId) searchParams.append("CategoryId", params.CategoryId);

  if (params.BrandSlug) searchParams.append("BrandSlug", params.BrandSlug);

  if (params.BrandId) searchParams.append("BrandId", params.BrandId);

  if (params.BrandIds?.length) {
    searchParams.append("BrandIds", JSON.stringify(params.BrandIds));
  }

  if (params.CategoryIds?.length) {
    searchParams.append("CategoryIds", JSON.stringify(params.CategoryIds));
  }

  if (params.ColorOptionIds?.length) {
    searchParams.append("ColorOptionIds", JSON.stringify(params.ColorOptionIds));
  }

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
