"use client";

import React, { useState, useMemo } from "react";
import SidebarResponsive from "../SidebarResponsive";
import UserSidebar from "../UserSidebar";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import UserFavoritesTop from "./UserFavoritesTop";
import UserFavoritesFilter from "./UserFavoritesFilter";
import FavoriteCard from "../../../modules/FavoriteCard/FavoriteCard";
import FilterBar from "../../../modules/FilterBar/FilterBar";

export default function UserFavorites() {
  const favorites = [
    {
      id: 1,
      category: "laptop",
      title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
      image: "/images/product/laptop-2.png",
      href: "#",
      discount: 3,
      rating: 4,
      originalPrice: "13,900,000",
      price: "13,550,000",
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
    },
    {
      id: 2,
      category: "mobile",
      title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
      image: "/images/product/laptop-1.png",
      href: "#",
      discount: 3,
      rating: 4,
      originalPrice: "13,900,000",
      price: "13,550,000",
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
    },
    {
      id: 3,
      category: "accessory",
      title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
      image: "/images/product/laptop-3.png",
      href: "#",
      discount: 3,
      rating: 4,
      originalPrice: "13,900,000",
      price: "13,550,000",
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
    },
  ];

  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("recent");
  const [search, setSearch] = useState("");

  const filteredFavorites = useMemo(() => {
    let result = [...favorites];

    // Filter by category
    if (category !== "all") {
      result = result.filter((item) => item.category === category);
    }

    // Search
    if (search.trim() !== "") {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Sorting
    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price.replace(/,/g, "")) - Number(b.price.replace(/,/g, "")),
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price.replace(/,/g, "")) - Number(a.price.replace(/,/g, "")),
      );
    }

    if (sort === "oldest") {
      result.reverse();
    }

    return result;
  }, [favorites, category, sort, search]);

  return (
    <div className="lg:col-span-3 space-y-8">
      {/* <!--Dashboard header--> */}
      <UserFavoritesTop />

      {/* <!--Products Filter and Search--> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <FilterBar
          selects={[
            {
              key: "category",
              value: category,
              onChange: setCategory,
              options: [
                { value: "all", label: "همه دسته‌بندی‌ها" },
                { value: "mobile", label: "موبایل" },
                { value: "laptop", label: "لپ‌تاپ" },
                { value: "accessory", label: "لوازم جانبی" },
                { value: "electronics", label: "الکترونیک" },
              ],
            },
            {
              key: "sort",
              value: sort,
              onChange: setSort,
              options: [
                { value: "recent", label: "جدیدترین" },
                { value: "oldest", label: "قدیمی‌ترین" },
                { value: "price-low", label: "قیمت (کم به زیاد)" },
                { value: "price-high", label: "قیمت (زیاد به کم)" },
              ],
            },
          ]}
          search={{
            value: search,
            onChange: setSearch,
            placeholder: "جستجوی نام محصول...",
          }}
        />
      </div>

      {/* <!--Saved Products List--> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"لیست محصولات ذخیره شده"} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((item) => (
            <FavoriteCard
              key={item.id}
              title={item.title}
              image={item.image}
              href={item.href}
              discount={item.discount}
              rating={item.rating}
              originalPrice={item.originalPrice}
              price={item.price}
              colors={item.colors}
            />
          ))}
        </div>

        {/* <!-- Pagination --> */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
            نمایش ۱ تا ۳ از ۸ محصول
          </p>
          <div className="flex items-center space-x-2 ">
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              قبلی
            </button>
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-lg hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/60">
              ۱
            </button>
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              ۲
            </button>
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              ۳
            </button>
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              بعدی
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
