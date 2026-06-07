// // components/ui/Categories/Filter/Filter.tsx
// import React, { useCallback, useRef } from "react";
// import {
//   usePathname,
//   useRouter,
//   useSearchParams,
// } from "next/navigation";

// import FilterColor from "./FilterColor";
// import PriceRangeFilter from "./PriceRangeFilter";
// import FilterBrand from "./FilterBrand";

// type Props = {
//   filters: any;
//   availableBrands: any[];
//   minLimit: number;
//   maxLimit: number;
// };

// export default function Filter({
//   filters,
//   availableBrands,
//   minLimit,
//   maxLimit,
// }: Props) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

// const handleSearchChange = (value: string) => {
//     const params = new URLSearchParams(searchParams.toString());

//     params.set("search", value);
//     params.set("page", "1");

//   router.replace(`${pathname}?${params.toString()}`, {
//   scroll: false,
// });
//   };

//   const priceDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
// const handlePriceChange = useCallback((range: { min: number; max: number }) => {
//   if (priceDebounce.current) clearTimeout(priceDebounce.current);
//   priceDebounce.current = setTimeout(() => {
//     const params = new URLSearchParams(searchParams.toString());
//     params.set("minPrice", String(range.min));
//     params.set("maxPrice", String(range.max));
//     params.set("page", "1");
//     router.replace(`${pathname}?${params.toString()}`, { scroll: false });
//   }, 400);
// }, [searchParams, pathname, router]);


//   return (
//     <section className="space-y-5 sticky top-0">
//        {/* Search */}
//       <section>
//         <div className="dark:bg-custom-dark bg-white rounded-lg border p-4">
//           <input
//             type="text"
//             value={filters.search}
//             onChange={(e) => handleSearchChange(e.target.value)}
//             placeholder="جستجوی محصولات ...."
//           />
//         </div>
//       </section>

//       {/* <!-- Color --> */}
//       <FilterColor />

//       {/* Price */}
//       <PriceRangeFilter
//         min={minLimit}
//         max={maxLimit}
//         value={{
//           min: filters.minPrice,
//           max: filters.maxPrice,
//         }}
//         onChange={handlePriceChange}
//       />

//        {/* Brand */}
//       <FilterBrand
//         brands={availableBrands}
//         selectedBrands={filters.brands}
//         onToggle={(id) => {
//           const params = new URLSearchParams(searchParams.toString());

//           const current = params.getAll("brandId");

//           if (current.includes(id)) {
//             const next = current.filter((x) => x !== id);

//             params.delete("brandId");
//             next.forEach((v) => params.append("brandId", v));
//           } else {
//             params.append("brandId", id);
//           }

//           params.set("page", "1");

//           router.push(`${pathname}?${params.toString()}`);
//         }}
//       />
//     </section>
//   );
// }

// components/ui/Categories/Filter/Filter.tsx
import React, { useCallback, useRef, TransitionStartFunction } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import FilterColor from "./FilterColor";
import PriceRangeFilter from "./PriceRangeFilter";
import FilterBrand from "./FilterBrand";

type Props = {
  filters: any;
  availableBrands: any[];
  minLimit: number;
  maxLimit: number;
  startTransition: TransitionStartFunction;
};

export default function Filter({
  filters,
  availableBrands,
  minLimit,
  maxLimit,
  startTransition,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = useCallback(
    (params: URLSearchParams) => {
      // تمام navigation ها داخل startTransition → isPending=true میشه → skeleton نمایش داده میشه
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, startTransition]
  );

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", value);
    params.set("page", "1");
    navigate(params);
  };

  const priceDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handlePriceChange = useCallback(
    (range: { min: number; max: number }) => {
      if (priceDebounce.current) clearTimeout(priceDebounce.current);
      priceDebounce.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("minPrice", String(range.min));
        params.set("maxPrice", String(range.max));
        params.set("page", "1");
        navigate(params);
      }, 400);
    },
    [searchParams, navigate]
  );

  const handleBrandToggle = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.getAll("brandId");

      if (current.includes(id)) {
        const next = current.filter((x) => x !== id);
        params.delete("brandId");
        next.forEach((v) => params.append("brandId", v));
      } else {
        params.append("brandId", id);
      }

      params.set("page", "1");
      navigate(params);
    },
    [searchParams, navigate]
  );

  return (
    <section className="space-y-5 sticky top-0">
      {/* Search */}
      <section>
        <div className="dark:bg-custom-dark bg-white rounded-lg border p-4">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="جستجوی محصولات ...."
          />
        </div>
      </section>

      {/* Color */}
      <FilterColor />

      {/* Price */}
      <PriceRangeFilter
        min={minLimit}
        max={maxLimit}
        value={{
          min: filters.minPrice,
          max: filters.maxPrice,
        }}
        onChange={handlePriceChange}
      />

      {/* Brand */}
      <FilterBrand
        brands={availableBrands}
        selectedBrands={filters.brands}
        onToggle={handleBrandToggle}
      />
    </section>
  );
}