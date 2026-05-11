
export default function StorePage() {
  const MIN_LIMIT = 0;
  const MAX_LIMIT = 50000000;

  // ۱. دریافت دیتا از هوک حرفه‌ای
  const { products, brands, loading, error } = useProducts();

  const [filters, setFilters] = useState({
    search: "",
    color: "",
    brands: [] as (number | string)[],
    minPrice: MIN_LIMIT,
    maxPrice: MAX_LIMIT, // مقدار اولیه بالا برای نمایش همه در ابتدا
    sort: "all",
  });

  return (
    

        <FilterResponsive filters={filters} setFilters={setFilters} />

       
              <Filter
                filters={filters}
                setFilters={setFilters}
                availableBrands={brands}
              />
        


  );
}

export default function Filter({ filters, setFilters, availableBrands }) {
  const handleToggleBrand = (id: string | number) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(id)
        ? prev.brands.filter((item) => item !== id)
        : [...prev.brands, id],
    }));
  };

  return (
   

      <PriceRangeFilter
        min={MIN_LIMIT} // ✅ ثابت
        max={MAX_LIMIT}
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

     
  );
}
