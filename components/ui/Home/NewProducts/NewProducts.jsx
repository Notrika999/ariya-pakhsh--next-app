"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import ProductCard from "@/components/modules/ProductCard/ProductCard";
import "swiper/css";

export default function NewProductsSlider({ loop, products }) {
  return (
    <section className="py-5">
      <div className="container">
        <header className="flex flex-wrap mb-2 justify-between items-center">
          <h2 className="font-bold text-lg mb-4 relative pb-4 text-gray-900 dark:text-gray-200 before:absolute before:start-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary after:absolute after:w-40 after:h-2 after:bottom-0 after:start-4 after:bg-primary after:rounded-lg">
            جدیدترین محصولات
          </h2>
          <a
            href="#"
            className="text-xs font-medium bg-primary text-white py-1.5 px-4 rounded-lg"
          >
            مشاهده همه
          </a>
        </header>

        <div className="bg-gradient-to-b from-white dark:from-[#121923] to-transparent rounded-2xl p-5">
          <Swiper
            modules={loop ? [Autoplay] : []}
            loop={!!loop}
            autoplay={
              loop
                ? {
                    delay: 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            spaceBetween={2}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
