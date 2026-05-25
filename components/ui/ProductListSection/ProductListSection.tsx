// components/templates/ProductListSection.tsx

import ProductCard from "@/components/modules/ProductCard/ProductCard";
import FilterResponsive from "../Categories/FilterResponsive/FilterResponsive";
import Filter from "../Categories/Filter/Filter";
import SortList from "@/components/modules/sortOptions/sortOptions";

interface Props {
  filters: any;
  setFilters: (f: any) => void;
  minLimit: number;
  maxLimit: number;
  products: any[]; // اینجا لیست محصولاتت رو بفرست
}


export default function ProductListSection({
  filters,
  setFilters,
  minLimit,
  maxLimit,
  products,
}: Props) {

   // تابعی برای تغییر فقط سورت
  const handleSortChange = (newSort: string) => {
    setFilters({ ...filters, sort: newSort });
  };
  return (
    <>
      <FilterResponsive
        filters={filters}
        setFilters={setFilters}
        minLimit={minLimit}
        maxLimit={maxLimit}
      />

      <div className="grid grid-cols-12 gap-5 mt-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-6">
            <Filter
              filters={filters}
              setFilters={setFilters}
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
            
            <SortList currentSort={filters.sort} 
              onSortChange={handleSortChange}  />
          </div>

          <div className="grid grid-cols-12 gap-4 mt-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="xl:col-span-3 md:col-span-4 sm:col-span-6 col-span-12"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
