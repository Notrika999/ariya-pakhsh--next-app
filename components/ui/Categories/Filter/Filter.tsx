import React from "react";

import FilterColor from "./FilterColor";
import PriceRangeFilter from "./PriceRangeFilter";
import FilterBrand from "./FilterBrand";

type Props = {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  // availableBrands: any[];
  minLimit: number;
  maxLimit: number;
};

export default function Filter({
  filters,
  setFilters,
  // availableBrands,
  minLimit,
  maxLimit,
}: Props) {
  const handleToggleBrand = (id: string | number) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(id)
        ? prev.brands.filter((item) => item !== id)
        : [...prev.brands, id],
    }));
  };
  console.log(minLimit);

  return (
    <section className="space-y-5 sticky top-0">
      {/* <!-- Search --> */}
      <section>
        <div className="dark:bg-custom-dark dark:border-gray-700 dark:text-white bg-white rounded-lg drop-shadow-lg border-gray-300 border p-4">
          <h2 className="font-bold text-base mb-4 relative pb-4 before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary after:absolute after:w-40 after:h-2 after:bottom-0 after:inset-s-4 after:bg-primary after:rounded-lg">
            جستجوی محصولات
          </h2>
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                }))
              }
              className="w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-700 py-3 ps-4 pe-10 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-custom-dark text-gray-900 dark:text-gray-100 transition-colors duration-300"
              placeholder="جستجوی محصولات ...."
            />

            <button className="p-2 rounded-3xl absolute inset-e-1 hover:opacity-90 transition-opacity">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>
      </section>

      {/* <!-- Color --> */}
      <FilterColor />

      {/* <!-- Range --> */}
      <PriceRangeFilter
        min={minLimit}
        max={maxLimit}
        value={{
          min: filters.minPrice,
          max: filters.maxPrice,
        }}
        onChange={(range) =>
          setFilters((prev) => ({
            ...prev,
            minPrice: range.min,
            maxPrice: range.max,
          }))
        }
      />

      {/* <!-- Brand --> */}
      {/* <FilterBrand
        brands={availableBrands}
        selectedBrands={filters.brands}
        onToggle={handleToggleBrand}
      /> */}
    </section>
  );
}
