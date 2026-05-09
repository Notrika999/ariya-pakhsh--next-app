"use client";

import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import SliderProductCard from "./SliderProductCard"; // کادر محصول (همان HTML کارت تو)

// اگر CSS/دکمه‌ها را با کلاس‌های سفارشی داری، این کلاس‌ها را همان نگه می‌داریم:
const prevBtnClass = ".swiper-button-prev-amazing";
const nextBtnClass = ".swiper-button-next-amazing";

export default function AmazingProductsSlider({ products }) {
  // products = [{id, image, title, colors, price, discount, countdownTo}, ...]
  const safeProducts = useMemo(() => products ?? [], [products]);

  return (
    <section className="py-5">
      <h2 className="sr-only">محصولات شگفت انگیز فروشگاه</h2>

      <div className="container">
        <div className="bg-gray-200 dark:bg-[#20242b] p-4 rounded-xl transition-colors">
          <div className="grid grid-cols-12 gap-4">
            {/* Title Section */}
            <div className="xl:col-span-2 col-span-12">
              <div className="xl:space-y-6 [@media(max-width:400px)]:space-y-3 flex-wrap h-full flex items-center xl:justify-center justify-between flex-row xl:flex-col">
                <div className="flex items-center justify-center">
                  <img
                    src="images/amazing/amazing-light.webp"
                    className="w-50 xl:inline-block hidden dark:invert"
                    alt=""
                  />
                  <h2 className="xl:hidden block font-bold">پیشنهاد شگفت انگیز</h2>
                </div>

                <div className="text-center">
                  <a
                    href="#"
                    className="bg-white xl:inline-block hidden dark:bg-zinc-800 dark:text-gray-200 text-gray-900 px-3 py-2 rounded-xl shadow-sm"
                  >
                    مشاهده محصولات
                  </a>
                </div>

                <div className="flex space-x-3 items-center justify-center">
                  <a
                    href="#"
                    className="bg-white xl:hidden block dark:bg-zinc-800 dark:text-gray-200 text-gray-900 px-3 py-2 rounded-xl shadow-sm"
                  >
                    مشاهده محصولات
                  </a>

                  <div className="bg-gray-800 dark:bg-gray-900 flex w-25 rounded-lg p-2 justify-between items-center">
                    <button className="swiper-button-prev-amazing hover:opacity-80 transition cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </button>

                    <div className="lg:inline-block hidden h-5 w-px self-stretch bg-gray-200 dark:bg-gray-700" />

                    <button className="swiper-button-next-amazing hover:opacity-80 transition cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5 8.25 12l7.5-7.5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Swiper */}
            <div className="xl:col-span-10 col-span-12">
              <Swiper
                modules={[Navigation]}
                slidesPerView={4}
                spaceBetween={2}
                loop={false}
                navigation={{
                  prevEl: prevBtnClass,
                  nextEl: nextBtnClass,
                }}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  480: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                }}
              >
                {safeProducts.map((p) => (
                  <SwiperSlide key={p.id} className="!w-60">
                    <SliderProductCard product={p} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
