"use client";

// components/amazing-deals/DealsClient.tsx
import { useState, useMemo, useEffect } from "react";
import { Product, FilterState, SortOption } from "@/types/product";
import FilterSort from "@/components/modules/FilterBar/FilterSort";
import EmptyState from "../../ProductListSection/EmptyState";
import ProductCardTest from "@/components/modules/ProductCard/ProductCard";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import FilterResponsive from "../../Categories/FilterResponsive/FilterResponsive";
import Filter from "../../Categories/Filter/Filter";
import SortList from "@/components/modules/sortOptions/sortOptions";
import IncredibleOffersDay from "../IncredibleOffersDay/IncredibleOffersDay";
import IncredibleOffersCategoryies from "../IncredibleOffersCategoryies/IncredibleOffersCategoryies";
import IncredibleOffersBaner from "../IncredibleOffersBaner/IncredibleOffersBaner";
import SliderProduct from "@/components/modules/SliderProduct/SliderProduct";
import HeroSection from "../HeroSection/HeroSection";

interface DealsClientProps {
  products: Product[];
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const arr = [...products];
  switch (sort) {
    case "price_asc":
      return arr.sort((a, b) => a.discountedPrice - b.discountedPrice);
    case "price_desc":
      return arr.sort((a, b) => b.discountedPrice - a.discountedPrice);
    case "discount_desc":
      return arr.sort((a, b) => b.discountPercent - a.discountPercent);
    case "rating_desc":
      return arr.sort((a, b) => b.review.rating - a.review.rating);
    case "most_reviewed":
      return arr.sort((a, b) => b.review.count - a.review.count);
    default:
      // Featured first
      return arr.sort(
        (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0),
      );
  }
}

export default function DealsClient({ products }: DealsClientProps) {
  const minLimit = Math.min(...products.map((p) => p.discountedPrice));
  const maxLimit = Math.max(...products.map((p) => p.discountedPrice));

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    sort: "default",

    minPrice: minLimit,
    maxPrice: maxLimit,
  });

  const availableBrands = useMemo(
    () => [...new Set(products.map((p) => p.brand))],
    [products],
  );

  const availableCategories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products],
  );

  const availableBadges = useMemo(
    () => [...new Set(products.flatMap((p) => p.badges))],
    [products],
  );

  const filtered = useMemo(() => {
    let result = [...products];

    // search
    if (filters.search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    // category
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    // price range
    result = result.filter(
      (p) =>
        p.discountedPrice >= filters.minPrice &&
        p.discountedPrice <= filters.maxPrice,
    );

    return sortProducts(result, filters.sort);
  }, [products, filters]);

  const handleReset = () =>
    setFilters({
      search: "",
      category: "all",
      sort: "default",
      minPrice: minLimit,
      maxPrice: maxLimit,
    });

  const categories = [
    { id: 1, name: "کالای دیجیتال", icon: "📱" },
    { id: 2, name: "خانه و آشپزخانه", icon: "🏠" },
    { id: 3, name: "کالای دیجیتال", icon: "📱" },
    { id: 4, name: "خانه و آشپزخانه", icon: "🏠" },
    { id: 5, name: "کالای دیجیتال", icon: "📱" },
    { id: 6, name: "خانه و آشپزخانه", icon: "🏠" },
    { id: 7, name: "کالای دیجیتال", icon: "📱" },
    { id: 8, name: "خانه و آشپزخانه", icon: "🏠" },
    { id: 9, name: "کالای دیجیتال", icon: "📱" },
    { id: 10, name: "خانه و آشپزخانه", icon: "🏠" },
    { id: 11, name: "کالای دیجیتال", icon: "📱" },
    { id: 12, name: "خانه و آشپزخانه", icon: "🏠" },
  ];

  const newProducts = [
    {
      id: 1,
      name: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
      image: "/images/product/laptop-2.png",

      discountedPrice: 13550000,
      originalPrice: 13900000,
      rating: 4,
      review: { rating: 4.8, count: 214 },
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 2,
      name: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-1.png",

      discountedPrice: 13550000,
      originalPrice: 13900000,
      rating: 4,
      review: { rating: 4.8, count: 214 },
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 3,
      name: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
      image: "/images/product/laptop-3.png",

      discountedPrice: 13550000,
      originalPrice: 13900000,
      rating: 4,
      review: { rating: 4.8, count: 214 },
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 4,
      name: "تبلت سامسونگ مدل S8",
      image: "/images/product/television-2.png",

      discountedPrice: 13550000,
      originalPrice: 13900000,
      rating: 4,
      review: { rating: 4.8, count: 214 },
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 5,
      name: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-5.png",

      discountedPrice: 13550000,
      originalPrice: 13900000,
      rating: 4,
      review: { rating: 4.8, count: 214 },
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 6,
      name: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-1.png",

      discountedPrice: 13550000,
      originalPrice: 13900000,
      rating: 4,
      review: { rating: 4.8, count: 214 },
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 7,
      name: "تبلت سامسونگ مدل S8",
      image: "/images/product/wach-2.png",

      discountedPrice: 13550000,
      originalPrice: 13900000,
      rating: 4,
      review: { rating: 4.8, count: 214 },
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 8,
      name: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-1.png",

      discountedPrice: 13550000,
      originalPrice: 13900000,
      rating: 4,
      review: { rating: 4.8, count: 214 },
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    // سایر محصولات را اینجا اضافه کنید...
  ];

  return (
    <SectionContainer className="flex flex-col gap-6">
      {/* 1. اسلایدر محصولات شگفت‌انگیز */}

      <IncredibleOffersDay products={products} />

      {/* 2. اسلایدر دسته‌بندی‌ها */}
      <IncredibleOffersCategoryies categories={categories} />

      {/* 3. بنر تمام عرض ارتفاع کوتاه */}
      <IncredibleOffersBaner />

      <section>
        <SliderProduct
          products={newProducts}
          loop={false}
          title="شگفت‌انگیز سفارشی"
          href={false}
        />
      </section>

      <FilterSort
        filter={filters}
        onChange={setFilters}
        totalCount={products.length}
        filteredCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <EmptyState onReset={handleReset} />
      ) : (
        <>
          <FilterResponsive
            filters={filters}
            setFilters={setFilters}
            minLimit={minLimit}
            maxLimit={maxLimit}
            availableBrands={availableBrands}
            availableCategories={availableCategories}
            availableBadges={availableBadges}
          />
          <div id="products" className="grid grid-cols-12 gap-5 mt-6">
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-6">
                <Filter
                  filters={filters}
                  setFilters={setFilters}
                  minLimit={minLimit}
                  maxLimit={maxLimit}
                  availableBrands={availableBrands}
                  availableCategories={availableCategories}
                  availableBadges={availableBadges}
                />
              </div>
            </aside>
            <section className="col-span-12 lg:col-span-9">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((product) => (
                  <ProductCardTest key={product.id} product={product} />
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </SectionContainer>
  );
}
