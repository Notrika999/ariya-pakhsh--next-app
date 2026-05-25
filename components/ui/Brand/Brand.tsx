"use client";

import React, { useState } from "react";
import ProductListSection from "../ProductListSection/ProductListSection";
import DescriptionSection from "../landing/sections/DescriptionSection";

export default function Brand() {
  const MIN_LIMIT = 0;
  const MAX_LIMIT = 50000000;

  const [filters, setFilters] = useState({
    search: "",
    color: "",
    brands: [] as (number | string)[],
    minPrice: MIN_LIMIT,
    maxPrice: MAX_LIMIT,
    sort: "all",
  });
  console.log("Sort: ", filters);
  return (
    <div className="my-2">
      <ProductListSection
        filters={filters}
        setFilters={setFilters}
        minLimit={MIN_LIMIT}
        maxLimit={MAX_LIMIT}
        products={[]}
      />

      <DescriptionSection title="عنوان اول" text="متن اول" />

      <DescriptionSection title="عنوان دوم" text="متن دوم" />
    </div>
  );
}
