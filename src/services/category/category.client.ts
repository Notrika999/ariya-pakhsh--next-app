// src/services/category/category.client.ts
"use client";

import { apiClient } from "@/src/lib/http/api-client";
import {
  Category,
  MegaMenuResponse,
} from "@/src/lib/types/categories/menuType";

let megaMenuCache: Category[] | null = null;
let megaMenuRequest: Promise<Category[]> | null = null;

export async function getMegaMenu(): Promise<Category[]> {
  if (megaMenuCache) {
    return megaMenuCache;
  }

  if (!megaMenuRequest) {
    megaMenuRequest = apiClient
      .get<MegaMenuResponse>("Categories/mega-menu")
      .then((res) => {
        const menu = res.data.data.rootCategories;
        megaMenuCache = menu;
        return menu;
      })
      .catch((error) => {
        megaMenuRequest = null;
        throw error;
      });
      
  }

  return megaMenuRequest;
}
