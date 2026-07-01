"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import ProductCard from "@/components/modules/ProductCard/ProductCard";
import "swiper/css";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";
import ProductCardTest from "../ProductCard/ProductCard";
import { normalizeProduct } from "@/src/lib/mappers/product.mapper";
import { ProductCardModel } from "@/src/lib/types/productTypes";

type NormalizableProduct = Parameters<typeof normalizeProduct>[0];

interface SliderProductProps {
  loop?: boolean;
  products: Array<NormalizableProduct | ProductCardModel>;
  title: string;
  href?: string | false;
}

function toCardProduct(
  product: NormalizableProduct | ProductCardModel,
): ProductCardModel {
  if ("categoryName" in product && "currency" in product) {
    return product as ProductCardModel;
  }

  return normalizeProduct(product);
}

export default function SliderProduct({
  loop,
  products,
  title,
  href,
}: SliderProductProps) {
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
          {products.map((product) => {
            const cardProduct = toCardProduct(product);

            return (
              <SwiperSlide key={cardProduct.id}>
                <ProductCardTest product={cardProduct} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
}
