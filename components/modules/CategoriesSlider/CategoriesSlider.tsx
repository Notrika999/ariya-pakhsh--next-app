"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

// استایل‌های مورد نیاز
import "swiper/css";
import "swiper/css/free-mode";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/src/lib/types/categories/category";
import { truncateTitle } from "@/src/utils/truncateTitle";

export default function CategoriesSlider({ categories }: Category) {
  console.log("CategoriesSlider: ", categories);
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
          <Link href={`/categoreis/${item.slug}`}>
            <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
              <figure>
                <Image
                  width={80}
                  height={80}
                  src={item.img}
                  // src={"https://aryapakhsh.shop/uploads/images/categories/4146f1c2-eb55-4c84-9904-bed64a9782e4/icon/72a9aea05a70498d975c386a19464f33_icon.webp"}
                  alt={item.title}
                  className="w-20 dark:invert-0"
                />
              </figure>
              <span
                title={item.title}
                className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center block"
              >
                {truncateTitle(item.title)}
              </span>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
