"use client";

import SliderProduct from "@/components/modules/SliderProduct/SliderProduct";
import IncredibleOffersDay from "./IncredibleOffersDay/IncredibleOffersDay";
import IncredibleOffersCategoryies from "./IncredibleOffersCategoryies/IncredibleOffersCategoryies";
import IncredibleOffersBaner from "./IncredibleOffersBaner/IncredibleOffersBaner";
import { useState } from "react";
import ProductListSection from "../ProductListSection/ProductListSection";

export default function IncredibleOffers() {
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

  const products = [
    { id: 1, title: "گوشی موبایل", price: "۱۲,۰۰۰,۰۰۰", discount: "۲۰٪" },
    { id: 2, title: "هدفون بی‌سیم", price: "۲,۵۰۰,۰۰۰", discount: "۱۰٪" },
    { id: 3, title: "گوشی موبایل", price: "۱۲,۰۰۰,۰۰۰", discount: "۲۰٪" },
    { id: 4, title: "هدفون بی‌سیم", price: "۲,۵۰۰,۰۰۰", discount: "۱۰٪" },
    { id: 5, title: "گوشی موبایل", price: "۱۲,۰۰۰,۰۰۰", discount: "۲۰٪" },
    { id: 6, title: "هدفون بی‌سیم", price: "۲,۵۰۰,۰۰۰", discount: "۱۰٪" },
    { id: 7, title: "گوشی موبایل", price: "۱۲,۰۰۰,۰۰۰", discount: "۲۰٪" },
    { id: 8, title: "هدفون بی‌سیم", price: "۲,۵۰۰,۰۰۰", discount: "۱۰٪" },
    { id: 9, title: "گوشی موبایل", price: "۱۲,۰۰۰,۰۰۰", discount: "۲۰٪" },
    { id: 10, title: "هدفون بی‌سیم", price: "۲,۵۰۰,۰۰۰", discount: "۱۰٪" },
    // ...
  ];

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
      title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
      image: "/images/product/laptop-2.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 2,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-1.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 3,
      title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
      image: "/images/product/laptop-3.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 4,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/television-2.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 5,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-5.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 6,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-1.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 7,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/wach-2.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 8,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-1.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    // سایر محصولات را اینجا اضافه کنید...
  ];

  return (
    <main className="space-y-12 py-8">
      {/* 1. اسلایدر محصولات شگفت‌انگیز */}
      <IncredibleOffersDay products={products} />

      {/* 2. اسلایدر دسته‌بندی‌ها */}
      <IncredibleOffersCategoryies categories={categories} />

      {/* 3. بنر تمام عرض ارتفاع کوتاه */}
      <IncredibleOffersBaner />

      <section className="px-4">
        <SliderProduct
          products={newProducts}
          loop={false}
          title="شگفت‌انگیز سفارشی"
          href={false}
        />
      </section>

      <ProductListSection
        filters={filters}
        setFilters={setFilters}
        minLimit={MIN_LIMIT}
        maxLimit={MAX_LIMIT}
        products={[]}
      />
    </main>
  );
}
