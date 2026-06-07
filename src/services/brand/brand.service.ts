import { apiClient } from "@/src/lib/http/client-http";
import { Brand, PaginatedResponse } from "@/src/lib/types/brand/brand.types";
import { ApiResponse } from "@/src/lib/types/common/api-response.types";

export interface GetBrandsParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  isFeatured?: boolean;
}

export async function getBrands(
  params?: GetBrandsParams,
): Promise<PaginatedResponse<Brand>> {
  const res = await apiClient.get<ApiResponse<PaginatedResponse<Brand>>>(
    "/Brands/list",
    { params },
  );
  
  // console.log("brands raw response:", res);
  
  return res.data.data;
}
