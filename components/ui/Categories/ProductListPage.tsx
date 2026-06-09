// components/ui/Categories/ProductListPage.tsx

"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import DescriptionCategory from "./DescriptionCategory/DescriptionCategory";
import CategoriesSlider from "@/components/modules/CategoriesSlider/CategoriesSlider";
import SectionTitle from "@/components/modules/SectionTitle/SectionTitle";
import Breadcrumb from "@/components/modules/Breadcrumb/Breadcrumb";
import ProductListSection from "../ProductListSection/ProductListSection";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import Pagination from "@/components/modules/Pagination/Pagination";
import type { Category as MenuCategory } from "@/src/lib/types/categories/menuType";
import type { CategoryBreadcrumbItem } from "@/src/lib/types/categories/breadcrumb";
import type {
  ProductListItem,
  ProductListResponse,
} from "@/src/lib/types/productTypes";

type BreadcrumbItem = CategoryBreadcrumbItem & {
  link?: string;
};

interface Props {
  category: MenuCategory | null;
  breadcrumb: BreadcrumbItem[];
  products: ProductListItem[];
  pagination: {
    page: number;
    totalPages: number;
    totalCount: number;
  };
  filterOptions: ProductListResponse["filterOptions"];
}

export default function CategoryProductListPage({
  category,
  breadcrumb,
  products,
  pagination,
  filterOptions,
}: Props) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const prevSearchParams = useRef(searchParams.toString());

  const [priceLimit] = useState({
    min: filterOptions?.minPrice ?? 0,
    max: filterOptions?.maxPrice ?? 0,
  });

  const filters = {
    search: "",
    color: "",
    brands: searchParams.getAll("brandId"),
    minPrice: Number(searchParams.get("minPrice") ?? priceLimit.min),
    maxPrice: Number(searchParams.get("maxPrice") ?? priceLimit.max),
    sort: searchParams.get("sort") ?? "default",
  };

  const isLoading = isPending;

  // وقتی searchParams تغییر کرد، navigation رو داخل startTransition بذار
  // تا isPending=true بشه و skeleton نمایش داده بشه
  useEffect(() => {
    const current = searchParams.toString();
    if (current !== prevSearchParams.current) {
      prevSearchParams.current = current;
    }
  }, [searchParams]);

  return (
    <SectionContainer>
      <Breadcrumb items={breadcrumb} />

      {category && category.children.length > 0 && (
        <>
          <SectionTitle title={"دسته بندی ها"} />
          <div className="pb-10">
            <CategoriesSlider categories={category.children} />
          </div>
        </>
      )}

      <ProductListSection
        filters={filters}
        pagination={pagination}
        filterOptions={filterOptions}
        minLimit={priceLimit.min}
        maxLimit={priceLimit.max}
        products={products}
        isLoading={isLoading}
        startTransition={startTransition}
      />

      <Pagination page={pagination.page} totalPages={pagination.totalPages} />

      {category && <DescriptionCategory />}
    </SectionContainer>
  );
}
