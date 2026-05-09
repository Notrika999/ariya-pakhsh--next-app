"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

// استایل‌های مورد نیاز
import "swiper/css";
import "swiper/css/free-mode";

export default function CategorySlider({categories}) {
 

  return (
    <section className="py-5">
      <h2 className="sr-only">دسته‌بندی‌های فروشگاه</h2>

      <div className="container">
        {/* Header */}
        <header className="flex flex-wrap mb-2 justify-between items-center">
          <h2
            className="font-bold text-lg mb-4 relative pb-4 text-gray-900 dark:text-gray-200
                before:absolute before:start-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary
                after:absolute after:w-40 after:h-2 after:bottom-0 after:start-4 after:bg-primary after:rounded-lg"
          >
            دسته‌بندی‌های فروشگاه
          </h2>
          <a
            href="#"
            className="text-xs font-medium bg-primary text-white py-1.5 px-4 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
          >
            مشاهده همه
          </a>
        </header>

        {/* Categories Swiper */}
        <div className="py-5">
          {" "}
          {/* به جای !important در استایل، اینجا پدینگ دادیم */}
          <Swiper
            modules={[FreeMode]}
            freeMode={true}
            slidesPerView="auto"
            spaceBetween={16}
            className="mySwiper"
          >
            {categories.map((item, index) => (
              <SwiperSlide key={index} className="!w-40">
                <a href="">
                  <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
                    <figure>
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-20 dark:invert-0"
                      />
                    </figure>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center">
                      {item.title}
                    </h3>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
