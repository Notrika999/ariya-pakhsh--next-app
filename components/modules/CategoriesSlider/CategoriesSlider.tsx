"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

// استایل‌های مورد نیاز
import "swiper/css";
import "swiper/css/free-mode";
import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/src/lib/types/categories/menuType";
import { truncateTitle } from "@/src/utils/truncateTitle";

type Props = {
  categories: Category[];
};

export default function CategoriesSlider({ categories }: Props) {
  return (
    <Swiper
      modules={[FreeMode]}
      freeMode={true}
      slidesPerView="auto"
      spaceBetween={16}
      className="mySwiper"
    >
      {categories.map((item, index) => (
        <SwiperSlide key={index} className="w-50!">
          <Link href={`/products/${item.slug}`}>
            <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
              <figure>
                <Image
                  width={80}
                  height={80}
                  src={item.src ?? "/images/default.png"}
                  alt={item.name}
                  className="w-20 dark:invert-0"
                />
              </figure>
              <span
                title={item.name}
                className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center block"
              >
                {truncateTitle(item.name)}
              </span>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
