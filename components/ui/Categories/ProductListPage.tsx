"use client";
import React, { useMemo, useState } from "react";
import DescriptionCategory from "./DescriptionCategory/DescriptionCategory";
import CategoriesSlider from "@/components/modules/CategoriesSlider/CategoriesSlider";
import SectionTitle from "@/components/modules/SectionTitle/SectionTitle";
import Breadcrumb from "@/components/modules/Breadcrumb/Breadcrumb";
import { Category } from "@/src/lib/types/categories/category";
import { BreadcrumbData } from "@/src/lib/types/categories/breadcrumb";
import ProductListSection from "../ProductListSection/ProductListSection";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";

interface Props {
  type: "category";
  slug: string;
  category: Category;
  breadcrumb: BreadcrumbData;
}

export default function CategoryProductListPage({
  category,
  breadcrumb,
}: Props) {
  const MIN_LIMIT = 0;
  const MAX_LIMIT = 50000000;

  const [filters, setFilters] = useState({
    search: "",
    color: "",
    brands: [] as (number | string)[],
    minPrice: MIN_LIMIT,
    maxPrice: MAX_LIMIT, // مقدار اولیه بالا برای نمایش همه در ابتدا
    sort: "all",
  });

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
        setFilters={setFilters}
        minLimit={MIN_LIMIT}
        maxLimit={MAX_LIMIT}
        products={[]}
      />

      <DescriptionCategory />
    </SectionContainer>
  );
}
