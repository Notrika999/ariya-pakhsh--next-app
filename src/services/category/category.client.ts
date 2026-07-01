// src/services/category/category.client.ts
"use client";

import { apiClient } from "@/src/lib/http/api-client";
import {
  Category,
  MegaMenuResponse,
} from "@/src/lib/types/categories/menuType";

export async function getMegaMenu(): Promise<Category[]> {
  const res = await apiClient.get<MegaMenuResponse>("Categories/mega-menu");
  return res.data.data.rootCategories;
}
