"use client";

import React, { memo, useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import SliderProductCard from "./SliderProductCard"; // کادر محصول (همان HTML کارت تو)
import ProductCard from "@/components/modules/ProductCard/ProductCard";
import Image from "next/image";
import Link from "next/link";

// اگر CSS/دکمه‌ها را با کلاس‌های سفارشی داری، این کلاس‌ها را همان نگه می‌داریم:
const prevBtnClass = ".swiper-button-prev-amazing";
const nextBtnClass = ".swiper-button-next-amazing";

function pad(value) {
  return String(value).padStart(2, "0");
}

const AmazingHeaderTimer = memo(function AmazingHeaderTimer({ enabled }) {
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (!enabled) return 0;
    return Math.floor(Math.random() * (24 * 60 * 60 - 60 * 60 + 1)) + 60 * 60;
  });

  useEffect(() => {
    if (!enabled) return;

    const id = window.setInterval(() => {
      setRemainingSeconds((seconds) => {
        if (seconds <= 1) return 24 * 60 * 60;
        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [enabled]);

  if (!enabled) return null;

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div
      className="flex items-center gap-1 rounded-xl bg-white/15 px-3 py-2 font-mono text-sm font-black text-white"
      dir="ltr"
      aria-label="زمان باقی‌مانده پیشنهاد شگفت‌انگیز"
    >
      <span>{pad(hours)}</span>
      <span>:</span>
      <span>{pad(minutes)}</span>
      <span>:</span>
      <span>{pad(seconds)}</span>
    </div>
  );
});

export default function AmazingProductsSlider({ products }) {
  // products = [{id, image, title, colors, price, discount, countdownTo}, ...]
  const safeProducts = useMemo(() => products ?? [], [products]);

  const limitedProducts = useMemo(() => {
    return safeProducts.slice(0, 11);
  }, [safeProducts]);

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
            <SwiperSlide className="hidden! xl:block! w-[260px]!">
              <div className=" text-white rounded-2xl h-full min-h-[340px] p-5 flex flex-col justify-between">
                <div className="space-y-6 flex flex-col items-center justify-center">
                  <Image
                    width={194}
                    height={120}
                    src="/images/amazing/amazing-light.webp"
                    className="w-44 object-contain dark:invert"
                    alt=""
                  />

                  <h2 className="font-extrabold text-xl">
                    پیشنهاد شگفت‌انگیز
                  </h2>
                  <AmazingHeaderTimer enabled={safeProducts.length > 0} />

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
                  <ProductCard product={p} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
