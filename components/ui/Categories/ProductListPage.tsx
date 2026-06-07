// components/ui/Categories/ProductListPage.tsx

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import DescriptionCategory from "./DescriptionCategory/DescriptionCategory";
import CategoriesSlider from "@/components/modules/CategoriesSlider/CategoriesSlider";
import SectionTitle from "@/components/modules/SectionTitle/SectionTitle";
import Breadcrumb from "@/components/modules/Breadcrumb/Breadcrumb";
import { Category } from "@/src/lib/types/categories/category";
import { BreadcrumbData } from "@/src/lib/types/categories/breadcrumb";
import ProductListSection from "../ProductListSection/ProductListSection";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import { ProductListItem } from "@/src/lib/types/productTypes";

import Pagination from "@/components/modules/Pagination/Pagination";

// interface Props {

//   slug: string;
//   category: Category;
//   breadcrumb: BreadcrumbData;

//   products: ProductListItem[];

//   pagination: {
//     page: number;
//     totalPages: number;
//     totalCount: number;
//   };

//   filterOptions: {
//     brands: BrandFilter[];
//     categories: CategoryFilter[];
//     attributes: AttributeFilter[];
//     minPrice: number;
//     maxPrice: number;
//   };
// }

interface Props {
  category: Category;
  breadcrumb: BreadcrumbData;

  products: any[];

  pagination: {
    page: number;
    totalPages: number;
    totalCount: number;
  };

  filterOptions: any;
}

export default function CategoryProductListPage({
  category,
  breadcrumb,
  products,
  pagination,
  filterOptions,
}: Props) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const prevSearchParams = useRef(searchParams.toString());

  const [priceLimit] = useState({
    min: filterOptions?.minPrice ?? 0,
    max: filterOptions?.maxPrice ?? 0,
  });

  const filters = {
    search: "",
    color: "",

    brands: searchParams.getAll("brandId"),

    // از URL میخونیم ولی fallback به همون مقدار اولیه ثابت
    minPrice: Number(searchParams.get("minPrice") ?? priceLimit.min),
    maxPrice: Number(searchParams.get("maxPrice") ?? priceLimit.max),

    sort: searchParams.get("sort") ?? "all",
  };

  useEffect(() => {
  const current = searchParams.toString();

  if (current !== prevSearchParams.current) {
    setIsLoading(true);
    prevSearchParams.current = current;
  }
}, [searchParams]);

useEffect(() => {
  if (!isLoading) return;

  // یه microtask تاخیر تا React فرصت داشته باشه skeleton رو رندر کنه
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 0);

  return () => clearTimeout(timer);
}, [products]); // eslint-disable-line react-hooks/exhaustive-deps

  console.log(products);
  return (
    <SectionContainer>
      {/* <Breadcrumb title={"دسته بندی"} href={"/category"} active={""} /> */}

      <Breadcrumb items={breadcrumb} />

      {category.children.length > 0 && (
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
        minLimit={priceLimit.min} // ← ثابت میمونه
        maxLimit={priceLimit.max} // ← ثابت میمونه
        products={products}
        isLoading={isLoading}
      />

      <Pagination page={pagination.page} totalPages={pagination.totalPages} />

      <DescriptionCategory />
    </SectionContainer>
  );
}
