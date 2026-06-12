"use client";

import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import SliderProductCard from "./SliderProductCard"; // کادر محصول (همان HTML کارت تو)
import ProductCard from "@/components/modules/ProductCard/ProductCard";
import Image from "next/image";
import Link from "next/link";
import ProductCardTest from "@/components/modules/ProductCard/ProductCard";

// اگر CSS/دکمه‌ها را با کلاس‌های سفارشی داری، این کلاس‌ها را همان نگه می‌داریم:
const prevBtnClass = ".swiper-button-prev-amazing";
const nextBtnClass = ".swiper-button-next-amazing";

export default function AmazingProductsSlider({ products }) {
  // products = [{id, image, title, colors, price, discount, countdownTo}, ...]
  const safeProducts = useMemo(() => products ?? [], [products]);

  const limitedProducts = useMemo(() => {
    const now = Date.now();

    return (products ?? [])
      .filter((product) => {
        const endTime = new Date(product.dealEndsAt).getTime();
        return !Number.isNaN(endTime) && endTime > now;
      })
      .slice(0, 11);
  }, [products]);

  return (
    <>
      <h2 className="sr-only">محصولات شگفت انگیز فروشگاه</h2>

      <div className="bg-brand-gradient dark:bg-[#20242b] py-3 rounded-xl transition-colors">
        {/* Product Swiper */}

        <div className="overflow-hidden xl:pb-0 pb-3">
          {/* MOBILE AMAZING HEADER */}
          <div className="xl:hidden flex items-center justify-between   rounded-2xl px-4 py-2  text-white">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-sm">پیشنهاد شگفت‌انگیز</h2>
            </div>

            <Link
              href="/incredible-offers"
              className="bg-white text-red-600 text-sm px-3 py-2 rounded-xl font-bold"
            >
              مشاهده
            </Link>
          </div>
          <Swiper
            modules={[Navigation]}
            slidesPerView={1}
            // spaceBetween={10}
            loop={false}
            watchOverflow
            navigation={{
              prevEl: prevBtnClass,
              nextEl: nextBtnClass,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              992: {
                slidesPerView: 4,
              },
              1160: {
                slidesPerView: 5,
              },
              1280: {
                slidesPerView: 6,
              },
            }}
            className="amazing-swiper"
          >
            {/* AMAZING SIDE */}
            <SwiperSlide className="!hidden xl:!block !w-[260px]">
              <div className=" text-white rounded-2xl h-full min-h-[340px] p-5 flex flex-col justify-between">
                <div className="space-y-6 flex flex-col items-center justify-center">
                  <Image
                    width={194}
                    height={120}
                    src="/images/amazing/amazing-light.webp"
                    className="w-44 object-contain dark:invert"
                    alt=""
                  />

                  <h2 className="font-extrabold text-xl">پیشنهاد شگفت‌انگیز</h2>

                  <Link
                    href="/incredible-offers"
                    className="bg-white text-red-600 px-4 py-2 rounded-xl font-bold"
                  >
                    مشاهده همه
                  </Link>
                </div>
              </div>
            </SwiperSlide>

            {/* PRODUCTS */}
            {limitedProducts.map((p) => (
              <SwiperSlide key={p.id}>
                <div className="mx-1">
                  <ProductCardTest product={p} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
