"use client";
// components/ui/ProductPageClient/Gallery/GalleryLightbox.tsx
import { useCallback, useEffect, useRef, useState } from "react";
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

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 1;

type Point = { x: number; y: number };

export default function GalleryLightbox({
  open,
  images,
  initialIndex,
  productName,
  onClose,
}: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [thumbSwiper, setThumbSwiper] = useState<SwiperInstance | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [origin, setOrigin] = useState<Point>({ x: 50, y: 50 });
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const activeIndexRef = useRef(activeIndex);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<Point | null>(null);
  const offsetStartRef = useRef<Point>({ x: 0, y: 0 });
  const didDragRef = useRef(false);
  const zoomRef = useRef(zoom);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const resetZoom = useCallback(() => {
    setZoom(MIN_ZOOM);
    setOrigin({ x: 50, y: 50 });
    setOffset({ x: 0, y: 0 });
    setIsDragging(false);
    dragStartRef.current = null;
    didDragRef.current = false;
  }, []);

  const setZoomTowardPoint = useCallback(
    (nextZoom: number, clientX?: number, clientY?: number) => {
      const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));

      if (stageRef.current && clientX != null && clientY != null) {
        const rect = stageRef.current.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        setOrigin({
          x: Math.min(100, Math.max(0, x)),
          y: Math.min(100, Math.max(0, y)),
        });
      }

      if (clamped === MIN_ZOOM) {
        setOffset({ x: 0, y: 0 });
      }

      setZoom(clamped);
    },
    [],
  );

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const changeImage = useCallback(
    (nextIndex: number) => {
      setActiveIndex(nextIndex);
      resetZoom();
    },
    [resetZoom],
  );

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose(activeIndexRef.current);
      if (event.key === "ArrowRight") {
        const current = activeIndexRef.current;
        changeImage((current - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowLeft") {
        const current = activeIndexRef.current;
        changeImage((current + 1) % images.length);
      }
      if (event.key === "+" || event.key === "=") {
        setZoomTowardPoint(zoomRef.current + ZOOM_STEP);
      }
      if (event.key === "-") {
        setZoomTowardPoint(zoomRef.current - ZOOM_STEP);
      }
      if (event.key === "0") {
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, images.length, onClose, resetZoom, setZoomTowardPoint, changeImage]);

  useEffect(() => {
    if (open && thumbSwiper && !thumbSwiper.destroyed) {
      thumbSwiper.slideTo(activeIndex);
    }
  }, [activeIndex, open, thumbSwiper]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!open || !stage) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const currentZoom = zoomRef.current;
      if (event.deltaY < 0) {
        setZoomTowardPoint(currentZoom + ZOOM_STEP, event.clientX, event.clientY);
      } else if (event.deltaY > 0) {
        setZoomTowardPoint(currentZoom - ZOOM_STEP, event.clientX, event.clientY);
      }
    };

    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, [open, setZoomTowardPoint]);

  if (!open || images.length === 0) return null;

  const currentImage = images[activeIndex];
  const goPrev = () =>
    changeImage((activeIndex - 1 + images.length) % images.length);
  const goNext = () => changeImage((activeIndex + 1) % images.length);

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }

    if (zoom >= MAX_ZOOM) {
      resetZoom();
      return;
    }

    setZoomTowardPoint(zoom + ZOOM_STEP, event.clientX, event.clientY);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= MIN_ZOOM) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    didDragRef.current = false;
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    offsetStartRef.current = offset;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || zoom <= MIN_ZOOM) return;
    const dx = event.clientX - dragStartRef.current.x;
    const dy = event.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      didDragRef.current = true;
    }
    setOffset({
      x: offsetStartRef.current.x + dx,
      y: offsetStartRef.current.y + dy,
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
    dragStartRef.current = null;
  };

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

      <div className="absolute top-5 end-5 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setZoomTowardPoint(zoom - ZOOM_STEP);
          }}
          disabled={zoom <= MIN_ZOOM}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="کوچک‌نمایی"
        >
          <i className="far fa-minus"></i>
        </button>
        <span className="min-w-12 text-center text-sm text-white/90" dir="ltr">
          {zoom}x
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setZoomTowardPoint(zoom + ZOOM_STEP);
          }}
          disabled={zoom >= MAX_ZOOM}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="بزرگ‌نمایی"
        >
          <i className="far fa-plus"></i>
        </button>
      </div>

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

        <div
          ref={stageRef}
          onClick={handleImageClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={[
            "flex h-full max-h-[min(70vh,720px)] w-full max-w-[min(92vw,720px)] items-center justify-center overflow-hidden rounded-2xl bg-white p-6 md:p-10 touch-none select-none",
            zoom > MIN_ZOOM
              ? isDragging
                ? "cursor-grabbing"
                : "cursor-grab"
              : "cursor-zoom-in",
          ].join(" ")}
          role="img"
          aria-label={`${productName} - تصویر ${activeIndex + 1}. اسکرول یا کلیک برای زوم`}
        >
          <div
            className="will-change-transform transition-transform duration-150 ease-out"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transformOrigin: `${origin.x}% ${origin.y}%`,
            }}
          >
            <Image
              width={640}
              height={640}
              src={currentImage?.imgSrc ?? "/images/default.png"}
              alt={`${productName} - تصویر ${activeIndex + 1}`}
              className="max-h-[min(60vh,640px)] w-auto max-w-full object-contain pointer-events-none"
              priority
              draggable={false}
            />
          </div>
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
                onClick={() => changeImage(index)}
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
