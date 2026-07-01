"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";

interface IncredibleOffersCategory {
  id: string | number;
  name: string;
  icon: string;
}

interface IncredibleOffersCategoryiesProps {
  categories: IncredibleOffersCategory[];
}

export default function IncredibleOffersCategoryies({
  categories,
}: IncredibleOffersCategoryiesProps) {
  return (
    <section className="px-4">
      <SectionHeader title={"دسته‌بندی‌های پیشنهادی"} href={false} />
      
        <Swiper slidesPerView={6} spaceBetween={20}>
          {categories.map((cat) => (
            <SwiperSlide key={cat.id} className="text-center">
              <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center text-3xl shadow-sm">
                {cat.icon}
              </div>
              <p className="mt-2 text-sm">{cat.name}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
  );
}
