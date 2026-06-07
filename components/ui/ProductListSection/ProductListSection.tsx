// components/templates/ProductListSection.tsx

import ProductCard from "@/components/modules/ProductCard/ProductCard";
import FilterResponsive from "../Categories/FilterResponsive/FilterResponsive";
import Filter from "../Categories/Filter/Filter";
import SortList from "@/components/modules/sortOptions/sortOptions";
import ProductCardTest from "@/components/modules/ProductCard/ProductCardTest";
import ProductCardSkeleton from "@/components/modules/ProductCard/ProductCardSkeleton";
import { normalizeProduct } from "@/src/lib/mappers/product.mapper";

// interface Props {
//   filters: any;
//   setFilters: (f: any) => void;
//   minLimit: number;
//   maxLimit: number;
//   products: any[]; // اینجا لیست محصولاتت رو بفرست
// }

interface Props {
  filters: any;

  pagination: {
    page: number;
    totalPages: number;
    totalCount: number;
  };

  filterOptions: any;

  minLimit: number;
  maxLimit: number;

  products: any[];

  isLoading?: boolean;
}

const SKELETON_COUNT = 8;

export default function ProductListSection({
  filters,
  // setFilters,
  minLimit,
  maxLimit,
  products,
  filterOptions,
  isLoading = false,
}: Props) {

  // تابعی برای تغییر فقط سورت
  const handleSortChange = (newSort: string) => {
    console.log(newSort);
  };

  return (
    <>
      {/* <FilterResponsive
        filters={filters}
        setFilters={setFilters}
        minLimit={minLimit}
        maxLimit={maxLimit}
      /> */}

      <div className="grid grid-cols-12 gap-5 mt-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-6">
            {/* <Filter
              filters={filters}
              setFilters={setFilters}
              minLimit={minLimit}
              maxLimit={maxLimit}
            /> */}

            <Filter
              filters={filters}
              availableBrands={filterOptions.brands}
              minLimit={minLimit}
              maxLimit={maxLimit}
            />
          </div>
        </aside>

        {/* Products */}
        <section className="lg:col-span-9 col-span-12">
          <div className="flex flex-wrap items-center sm:space-y-0 space-y-3 space-x-3">
            {/* Sort Buttons */}
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-sliders w-5 h-5 dark:text-white text-gray-700"></i>
              <span className="text-gray-700 dark:text-gray-200">
                مرتب سازی:
              </span>
            </div>

            <SortList
              currentSort={filters.sort}
              onSortChange={handleSortChange}
            />
          </div>

          <div className="grid grid-cols-12 gap-4 mt-4">
             {isLoading
              ? // حالت لودینگ — skeleton ها
                Array.from({ length: SKELETON_COUNT }, (_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="xl:col-span-3 md:col-span-4 sm:col-span-6 col-span-12"
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              : products.length === 0
                ? // حالت خالی
                  <div className="col-span-12 text-center py-16 text-gray-400">
                    <p className="text-lg">محصولی یافت نشد</p>
                  </div>
                : // حالت عادی
                  products.map((product) => (
                    <div
                      key={product.productId}
                      className="xl:col-span-3 md:col-span-4 sm:col-span-6 col-span-12"
                    >
                      <ProductCardTest product={normalizeProduct(product)} />
                    </div>
                  ))}
          </div>
        </section>
      </div>
    </>
  );
}
