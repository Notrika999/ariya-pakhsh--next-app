"use client";
import React, { useMemo, useState } from "react";
import DescriptionCategory from "./DescriptionCategory/DescriptionCategory";
import ProductCard from "@/components/modules/ProductCard/ProductCard";
import Filter from "./Filter/Filter";
import FilterResponsive from "./FilterResponsive/FilterResponsive";
import CategoriesSlider from "@/components/modules/CategoriesSlider/CategoriesSlider";
import SectionTitle from "@/components/modules/SectionTitle/SectionTitle";
import Breadcrumb from "@/components/modules/Breadcrumb/Breadcrumb";

interface Props {
  type: "category";
  slug: string;
  category: Category;
}

export default function ProductListPage({ type, slug, category }: Props) {
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
    <section className="py-6">
      <div className="container mx-auto">
        {/* <Breadcrumb title={"دسته بندی"} href={"/category"} active={""} /> */}

        <Breadcrumb items={category.breadcrumb} />

        <SectionTitle title={"همه محصولات فروشگاه"} />

        {category.children.length > 0 && (
          <div className="pb-10">
            <CategoriesSlider categories={category.children} />
          </div>
        )}

        <FilterResponsive
          filters={filters}
          setFilters={setFilters}
          // brands={brands}
          minLimit={MIN_LIMIT}
          maxLimit={MAX_LIMIT}
        />

        <div className="grid grid-cols-12 gap-5 mt-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-6">
              <Filter
                filters={filters}
                setFilters={setFilters}
                // availableBrands={brands}
                minLimit={MIN_LIMIT}
                maxLimit={MAX_LIMIT}
              />
            </div>
          </aside>

          {/* Products */}
          <section className="lg:col-span-9 col-span-12">
            <div className="flex flex-wrap items-center sm:space-y-0 space-y-3  space-x-3">
              {/* <!--Icon and title--> */}
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-sliders w-5 h-5 dark:text-white text-gray-700"></i>

                <span className="text-gray-700 dark:text-gray-200">
                  مرتب سازی بر اساس:
                </span>
              </div>

              {/* <!--Filter list--> */}
              <div className="hidden md:flex items-center gap-6 text-gray-600 dark:text-gray-300 text-sm ">
                <button className="dark:bg-gray-800 dark:text-white bg-gray-900 text-white px-4 py-1 rounded-full">
                  همه
                </button>
                <button className="hover:text-gray-900 dark:hover:text-white transition">
                  پربازدید
                </button>
                <button className="hover:text-gray-900 dark:hover:text-white transition">
                  محبوب‌ترین
                </button>
                <button className="hover:text-gray-900 dark:hover:text-white transition">
                  پرفروش‌ترین
                </button>
                <button className="hover:text-gray-900 dark:hover:text-white transition">
                  گران‌ترین
                </button>
                <button className="hover:text-gray-900 dark:hover:text-white transition">
                  ارزان‌ترین
                </button>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
              {/* {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="xl:col-span-3 md:col-span-4 sm:col-span-6 col-span-12"
                >
                  <ProductCard product={product} />
                </div>
              ))} */}
            </div>
          </section>
        </div>

        <DescriptionCategory />
      </div>
    </section>
  );
}
