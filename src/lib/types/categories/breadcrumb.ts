// src/lib/types/categories/breadcrumb.ts

export interface CategoryBreadcrumbItem {
  id: string;
  name: string;
  slug: string;
  depth: number;
  position: number;
  isActive: boolean;
}

export interface BreadcrumbData {
  items: CategoryBreadcrumbItem[];
  // fullPath: string;
  depth: number;
}

export interface BreadcrumbResponse {
  data: BreadcrumbData;
  success: boolean;
  message?: string;
  timestamp?: string;
}