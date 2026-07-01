// src/services/brand/brand.client.ts
"use client";

import { apiClient } from "@/src/lib/http/api-client";
import {
  Brand,
  GetBrandsParams,
  PaginatedResponse,
} from "@/src/lib/types/brand/brand.types";
import { ApiResponse } from "@/src/lib/types/common/api-response.types";

export async function getBrands(
  params?: GetBrandsParams,
): Promise<PaginatedResponse<Brand>> {
  const res = await apiClient.get<ApiResponse<PaginatedResponse<Brand>>>(
    "Brands/list",
    { params },
  );
  return res.data.data;
}
