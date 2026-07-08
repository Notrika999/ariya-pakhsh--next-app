"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";

type GalleryLightboxImage = {
  imgSrc?: string;
};

type GalleryLightboxProps = {
  open: boolean;
  images: GalleryLightboxImage[];
  initialIndex: number;
  productName: string;
  onClose: (activeIndex: number) => void;
};

export default function GalleryLightbox({
  open,
  images,
  initialIndex,
  productName,
  onClose,
}: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [thumbSwiper, setThumbSwiper] = useState<SwiperInstance | null>(null);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose(activeIndexRef.current);
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, images.length, onClose]);

  useEffect(() => {
    if (open && thumbSwiper && !thumbSwiper.destroyed) {
      thumbSwiper.slideTo(activeIndex);
    }
  }, [activeIndex, open, thumbSwiper]);

  if (!open || images.length === 0) return null;

  const currentImage = images[activeIndex];
  const goPrev = () =>
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  const goNext = () =>
    setActiveIndex((index) => (index + 1) % images.length);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`گالری تصاویر ${productName}`}
      className="fixed inset-0 z-[200] flex flex-col bg-black"
      onClick={() => onClose(activeIndex)}
    >
      <button
        type="button"
        onClick={() => onClose(activeIndex)}
        className="absolute top-5 start-5 z-20 flex h-10 w-10 items-center justify-center rounded-full text-2xl text-white transition hover:bg-white/10"
        aria-label="بستن گالری"
      >
        <i className="far fa-xmark"></i>
      </button>

      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-4 pt-16"
        onClick={(event) => event.stopPropagation()}
      >
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute start-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg transition hover:scale-105"
              aria-label="تصویر قبلی"
            >
              <i className="far fa-chevron-right text-lg"></i>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute end-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg transition hover:scale-105"
              aria-label="تصویر بعدی"
            >
              <i className="far fa-chevron-left text-lg"></i>
            </button>
          </>
        )}

        <div className="flex h-full max-h-[min(70vh,720px)] w-full max-w-[min(92vw,720px)] items-center justify-center rounded-2xl bg-white p-6 md:p-10">
          <Image
            width={640}
            height={640}
            src={currentImage?.imgSrc ?? "/images/default.png"}
            alt={`${productName} - تصویر ${activeIndex + 1}`}
            className="max-h-full w-full object-contain"
            priority
          />
        </div>
      </div>

      <div
        className="border-t border-white/10 px-4 pb-6 pt-4"
        onClick={(event) => event.stopPropagation()}
      >
        <Swiper
          onSwiper={setThumbSwiper}
          modules={[FreeMode]}
          freeMode
          spaceBetween={12}
          slidesPerView="auto"
          centeredSlides
          centeredSlidesBounds
          className="gallery-lightbox-thumbs"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="!w-24 md:!w-28">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  "flex h-20 w-full items-center justify-center overflow-hidden rounded-xl border-2 bg-white p-2 transition",
                  activeIndex === index
                    ? "border-white ring-2 ring-white"
                    : "border-transparent opacity-70 hover:opacity-100",
                ].join(" ")}
                aria-label={`نمایش تصویر ${index + 1}`}
                aria-current={activeIndex === index}
              >
                <Image
                  width={96}
                  height={96}
                  src={image.imgSrc ?? "/images/default.png"}
                  alt={`${productName} - بندانگشتی ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
