"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import ProductCard from "@/components/modules/ProductCard/ProductCard";
import "swiper/css";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";
import ProductCardTest from "../ProductCard/ProductCardTest";
import { normalizeProduct } from "@/src/lib/mappers/product.mapper";

export default function SliderProduct({ loop, products, title, href }) {
  return (
    <>
      <SectionHeader title={title} href={href} />

      <div className="bg-linear-to-b from-white dark:from-[#121923] to-transparent rounded-2xl px-3 py-6">
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
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              {/* <ProductCard product={product} /> */}
              <ProductCardTest product={normalizeProduct(product)} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
