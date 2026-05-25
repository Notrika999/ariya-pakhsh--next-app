import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "@/components/modules/ProductCard/ProductCard";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";

export default function ConsumerProducts() {
  const consumerProducts = [
    {
      id: 1,
      title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
      image: "/images/product/laptop-2.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 2,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-1.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 3,
      title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
      image: "/images/product/laptop-3.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 4,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/television-2.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 5,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-5.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 6,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-1.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 7,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/wach-2.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 8,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-1.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    // سایر محصولات را اینجا اضافه کنید...
  ];

  return (
    <section className="py-5">
      <h2 className="sr-only">محصولات مشابه</h2>

      <div className="container mx-auto">
        {/* <!-- header --> */}
       
        <SectionHeader title={"محصولات مشابه"} href={"#"} />

        {/* <!-- products background --> */}
        <div className="bg-linear-to-b from-white dark:from-[#121923] to-transparent rounded-2xl p-5 transition-colors">
          <div className="swiper product-carousel">
            <Swiper
              // modules={loop ? [Autoplay] : []}
              // loop={!!loop}
              // autoplay={
              //   loop
              //     ? {
              //         delay: 2500,
              //         disableOnInteraction: false,
              //         pauseOnMouseEnter: true,
              //       }
              //     : false
              // }
              spaceBetween={2}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
              }}
            >
              {consumerProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
