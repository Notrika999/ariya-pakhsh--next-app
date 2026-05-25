"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function IncredibleOffersDay({ products }) {
  return (
    <section className="bg-red-600 p-6 rounded-2xl">
      <h2 className="text-white text-2xl font-bold mb-6">
        پیشنهادهای شگفت‌انگیز
      </h2>
      <Swiper slidesPerView={4} spaceBetween={16}>
        {products.map((p) => (
          <SwiperSlide key={p.id} className="bg-white rounded-xl p-4">
            <div className="h-40 bg-gray-200 mb-4 rounded-lg" />
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-red-500 font-bold">{p.price} تومان</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
