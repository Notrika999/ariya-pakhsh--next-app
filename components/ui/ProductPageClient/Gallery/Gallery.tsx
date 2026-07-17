"use client";
// components/ui/ProductPageClient/Gallery/Gallery.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Zoom } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import Image from "next/image";
import ShareModal from "./ShareModal";
import ChartModal from "./ChartModal";
import GalleryLightbox from "./GalleryLightbox";
import DiscountCountdown from "./DiscountCountdown";
import Link from "next/link";
import {
  useIsAuthenticated,
  useIsAuthBootstrapping,
} from "@/src/lib/stores/auth/auth.store";
import {
  addWishlistProduct,
  getWishlistProductStatus,
  removeWishlistProduct,
} from "@/src/services/wishlist/wishlist.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";
import { ProductDetailPromotion } from "@/src/lib/types/products/productDetail.types";

export type PriceChartItem = {
  date: string;
  price: number; // قیمت فروش فعلی
  originalPrice?: number; // قیمت بدون تخفیف (اختیاری)
  isAvailable: boolean; // موجود/ناموجود
};

type GalleryImage = {
  imgSrc?: string;
  thumbSrc?: string;
};

interface GalleryProps {
  images: GalleryImage[];
  isOutOfStock: boolean;
  productName: string;
  productId: string;
  initialIsInWishlist?: boolean;
  isAmazingOffer?: boolean;
  promotion?: ProductDetailPromotion | null;
  /** ISO یا ثانیه باقی‌مانده — اختیاری */
  countdownTarget?: string | number | null;
}

export default function Gallery({
  images,
  isOutOfStock,
  productName,
  productId,
  initialIsInWishlist = false,
  isAmazingOffer = false,
  promotion = null,
  countdownTarget = "2026-10-01T15:30:00.000Z",
}: GalleryProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperInstance | null>(null);
  const mainSwiperRef = useRef<SwiperInstance | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
  const [wishlistBusy, setWishlistBusy] = useState(false);

  const isAuthenticated = useIsAuthenticated();
  const isAuthBootstrapping = useIsAuthBootstrapping();
  const showFilledHeart = isAuthenticated && isInWishlist;
  const promotionTitle =
    promotion?.promotionTypeDisplayName || promotion?.typeLabel || "فروش ویژه";
  const promotionCountdownTarget = promotion?.promotionEndAt ?? countdownTarget;

  useEffect(() => {
    if (!productId || isAuthBootstrapping || !isAuthenticated) {
      return;
    }

    let cancelled = false;

    async function loadWishlistStatus() {
      try {
        const status = await getWishlistProductStatus(productId);
        if (!cancelled) {
          setIsInWishlist(status.isInWishlist);
        }
      } catch {
        if (!cancelled) {
          setIsInWishlist(false);
        }
      }
    }

    void loadWishlistStatus();

    return () => {
      cancelled = true;
    };
  }, [productId, isAuthenticated, isAuthBootstrapping]);

  const handleToggleWishlist = useCallback(async () => {
    if (wishlistBusy) return;

    if (!isAuthenticated) {
      notify.info("برای افزودن به علاقه‌مندی‌ها ابتدا وارد حساب کاربری شوید.");
      return;
    }

    if (!productId) {
      notify.error("شناسه محصول نامعتبر است.");
      return;
    }

    setWishlistBusy(true);
    try {
      if (isInWishlist) {
        await removeWishlistProduct(productId);
        setIsInWishlist(false);
        notify.success("محصول از علاقه‌مندی‌ها حذف شد.");
      } else {
        await addWishlistProduct(productId);
        setIsInWishlist(true);
        notify.success("محصول به علاقه‌مندی‌ها اضافه شد.");
      }
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
    } finally {
      setWishlistBusy(false);
    }
  }, [isAuthenticated, isInWishlist, productId, wishlistBusy]);

  const handleThumbsSwiper = useCallback((swiper: SwiperInstance) => {
    setThumbsSwiper((prev) => (prev === swiper ? prev : swiper));
  }, []);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(
    (index: number) => {
      setLightboxIndex(index);
      setLightboxOpen(false);
      mainSwiperRef.current?.slideTo(index);
      thumbsSwiper?.slideTo(index);
    },
    [thumbsSwiper],
  );

  const variants = [
    { id: "black", label: "مشکی" },
    { id: "white", label: "سفید" },
  ];

  const variantDataMap = {
    black: [
      {
        date: "1 اردیبهشت",
        price: 7100000,
        originalPrice: 7100000,
        isAvailable: true,
      },
      {
        date: "2 اردیبهشت",
        price: 7100000,
        originalPrice: 7100000,
        isAvailable: true,
      },
      {
        date: "3 اردیبهشت",
        price: 7100000,
        originalPrice: 7100000,
        isAvailable: true,
      },
      {
        date: "4 اردیبهشت",
        price: 5200000,
        originalPrice: 5700000,
        isAvailable: true,
      },
      {
        date: "5 اردیبهشت",
        price: 5200000,
        originalPrice: 5700000,
        isAvailable: true,
      },
      {
        date: "6 اردیبهشت",
        price: 5200000,
        originalPrice: 5700000,
        isAvailable: false,
      },
      {
        date: "7 اردیبهشت",
        price: 5200000,
        originalPrice: 5700000,
        isAvailable: false,
      },
      {
        date: "8 اردیبهشت",
        price: 5200000,
        originalPrice: 5700000,
        isAvailable: false,
      },
      {
        date: "9 اردیبهشت",
        price: 5200000,
        originalPrice: 5700000,
        isAvailable: false,
      },
      {
        date: "10 اردیبهشت",
        price: 7000000,
        originalPrice: 7000000,
        isAvailable: true,
      },
      {
        date: "11 اردیبهشت",
        price: 7125000,
        originalPrice: 7125000,
        isAvailable: true,
      },
      {
        date: "12 اردیبهشت",
        price: 7250000,
        originalPrice: 7250000,
        isAvailable: true,
      },
      {
        date: "13 اردیبهشت",
        price: 7375000,
        originalPrice: 7375000,
        isAvailable: true,
      },
      {
        date: "14 اردیبهشت",
        price: 7500000,
        originalPrice: 7500000,
        isAvailable: true,
      },
      {
        date: "15 اردیبهشت",
        price: 7625000,
        originalPrice: 7625000,
        isAvailable: true,
      },
      {
        date: "16 اردیبهشت",
        price: 7750000,
        originalPrice: 7750000,
        isAvailable: true,
      },
      {
        date: "17 اردیبهشت",
        price: 7875000,
        originalPrice: 7875000,
        isAvailable: true,
      },
      {
        date: "18 اردیبهشت",
        price: 8000000,
        originalPrice: 8000000,
        isAvailable: true,
      },
      {
        date: "19 اردیبهشت",
        price: 8125000,
        originalPrice: 8125000,
        isAvailable: true,
      },
      {
        date: "20 اردیبهشت",
        price: 7500000,
        originalPrice: 7500000,
        isAvailable: false,
      },
      {
        date: "21 اردیبهشت",
        price: 7320000,
        originalPrice: 7320000,
        isAvailable: false,
      },
      {
        date: "22 اردیبهشت",
        price: 7140000,
        originalPrice: 7140000,
        isAvailable: false,
      },
      {
        date: "23 اردیبهشت",
        price: 6960000,
        originalPrice: 6960000,
        isAvailable: false,
      },
      {
        date: "24 اردیبهشت",
        price: 6780000,
        originalPrice: 6780000,
        isAvailable: false,
      },
      {
        date: "25 اردیبهشت",
        price: 6600000,
        originalPrice: 6600000,
        isAvailable: true,
      },
      {
        date: "26 اردیبهشت",
        price: 6180000,
        originalPrice: 6200000,
        isAvailable: true,
      },
      {
        date: "27 اردیبهشت",
        price: 5960000,
        originalPrice: 6800000,
        isAvailable: true,
      },
      {
        date: "28 اردیبهشت",
        price: 5400000,
        originalPrice: 5640000,
        isAvailable: true,
      },
      {
        date: "29 اردیبهشت",
        price: 5000000,
        originalPrice: 5320000,
        isAvailable: true,
      },
      {
        date: "30 اردیبهشت",
        price: 5000000,
        originalPrice: 5000000,
        isAvailable: true,
      },
      {
        date: "31 اردیبهشت",
        price: 5000000,
        originalPrice: 5000000,
        isAvailable: true,
      },
    ],
    white: [
      {
        date: "1 اردیبهشت",
        price: 6_900_000,
        originalPrice: 7_300_000,
        isAvailable: false,
      },
      {
        date: "1 خرداد",
        price: 4_900_000,
        originalPrice: 4_900_000,
        isAvailable: true,
      },
    ],
  };

  return (
    <section className="xl:col-span-4 mt-7 col-span-12 pb-10 w-full">
      {isAmazingOffer && (
        <div className="bg-secondary-200 dark:bg-custom-dark dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-2xl flex items-center justify-between mb-4 transition-all duration-200">
          <h3 className="font-black text-gray-800 dark:text-gray-100">
            {promotionTitle}
          </h3>
          <DiscountCountdown target={promotionCountdownTarget} />
        </div>
       )} 

      {/* <!-- Out of Stock Badge --> */}
      {isOutOfStock && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 shadow-sm border border-red-200 dark:border-red-800 px-3 py-2 rounded-2xl flex items-center justify-between mb-4 transition-all duration-200">
          <h3 className="font-black">اتمام موجودی</h3>
          <i className="far fa-exclamation-triangle"></i>
        </div>
      )}

      {/* <!-- Large gallery --> */}
      <div className="bg-primary relative mb-12 aspect-square w-full rounded-[15px] p-3 dark:bg-custom-dark dark:border dark:border-gray-700">
        {/* <!-- Action buttons --> */}
        <div className="flex rounded-2xl px-2 bg-gray-100 dark:bg-custom-dark gap-2 absolute top-0.75 inset-e-1/2 -translate-x-1/2 z-10 ">
          {/* Share */}
          <button
            onClick={() => setShareOpen(true)}
            className="flex z-10 group relative items-center justify-center w-full p-2 transition dark:border-gray-700 drop-shadow rounded"
          >
            <i className="far fa-share-nodes"></i>
          </button>

          {/* Compare */}
          <Link
            href={"/compare"}
            className="flex z-10 group relative items-center justify-center w-full p-2 transition dark:border-gray-700 drop-shadow rounded"
          >
            <i className="fas fa-code-compare"></i>
          </Link>

          {/* Favorite */}
          <button
            type="button"
            onClick={() => void handleToggleWishlist()}
            disabled={wishlistBusy || isAuthBootstrapping}
            aria-label={
              showFilledHeart
                ? "حذف از علاقه‌مندی‌ها"
                : "افزودن به علاقه‌مندی‌ها"
            }
            aria-pressed={showFilledHeart}
            className="flex z-10 group relative items-center justify-center w-full p-2 transition dark:border-gray-700 drop-shadow rounded disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i
              className={`${
                showFilledHeart ? "fas text-red-500" : "far"
              } fa-heart transition-colors`}
            ></i>
          </button>

          {/* Chart */}
          <button
            onClick={() => setChartOpen(true)}
            className="flex z-10 group relative items-center justify-center w-full p-2 transition dark:border-gray-700 drop-shadow rounded"
          >
            <i className="fas fa-chart-line"></i>
          </button>
        </div>

        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          title={productName}
        />

        <ChartModal
          open={chartOpen}
          onClose={() => setChartOpen(false)}
          variants={variants}
          variantDataMap={variantDataMap}
        />

        {/* <!-- Gallery --> */}
        <Swiper
          onSwiper={(swiper) => {
            mainSwiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setLightboxIndex(swiper.activeIndex)}
          modules={[Navigation, Pagination, Thumbs, Zoom]}
          navigation
          pagination={{ clickable: true }}
          zoom
          spaceBetween={10}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          className="h-full"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <button
                type="button"
                onClick={() => openLightbox(index)}
                className="group relative flex h-full w-full cursor-zoom-in items-center justify-center overflow-hidden border border-gray-300 rounded-lg bg-white dark:bg-zinc-800 dark:border-gray-700"
                aria-label={`بزرگ‌نمایی تصویر ${index + 1}`}
              >
                <div className="swiper-zoom-container relative aspect-square h-full w-full">
                  <Image
                    fill
                    sizes="(min-width: 1280px) 33vw, 100vw"
                    src={img.imgSrc ?? "/images/default.png"}
                    alt={`product-${index}`}
                    className="object-contain p-4 transition group-hover:scale-[1.02]"
                  />
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* <!-- Thumbnail gallery --> */}
      <Swiper
        onSwiper={handleThumbsSwiper}
        modules={[Thumbs]}
        spaceBetween={10}
        slidesPerView={4}
        watchSlidesProgress
        freeMode={true}
        className="mt-3"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <button
              type="button"
              onClick={() => {
                mainSwiperRef.current?.slideTo(index);
                openLightbox(index);
              }}
              className="relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-zinc-800"
              aria-label={`نمایش تصویر ${index + 1}`}
            >
              <Image
                fill
                sizes="25vw"
                src={img.thumbSrc ?? img.imgSrc ?? "/images/default.png"}
                alt={`thumb-${index}`}
                className="object-contain p-2"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <GalleryLightbox
        key={lightboxOpen ? `lightbox-${lightboxIndex}` : "lightbox-closed"}
        open={lightboxOpen}
        images={images}
        initialIndex={lightboxIndex}
        productName={productName}
        onClose={closeLightbox}
      />
    </section>
  );
}
