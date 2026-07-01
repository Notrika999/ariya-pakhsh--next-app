// src/services/brand/brand.server.ts
import "server-only";

import { proxyToBackend } from "@/src/lib/http/server-http";
import { Brand, GetBrandsParams, PaginatedResponse } from "@/src/lib/types/brand/brand.types";
import { ApiResponse } from "@/src/lib/types/common/api-response.types";

export type { GetBrandsParams };

export async function getBrands(
  params?: GetBrandsParams,
): Promise<PaginatedResponse<Brand>> {
  const response = await proxyToBackend<ApiResponse<PaginatedResponse<Brand>>>({
    method: "GET",
    path: "/api/v1/Brands/list",
    params: params as Record<string, string | number | boolean | undefined>,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`getBrands failed: ${response.status}`);
  }

  return response.data.data;
}
