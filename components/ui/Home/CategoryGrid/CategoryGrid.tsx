"use client";
// components/ ui/home/CategoryGrid/CategoryGrid.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";

import "swiper/css";

export type HomeCategoryGridItem = {
  id: string;
  name: string;
  slug: string;
  src?: string | null;
};

type Props = {
  categories: HomeCategoryGridItem[];
  title: string;
};

type SliderState = {
  canScroll: boolean;
  isBeginning: boolean;
  isEnd: boolean;
};

const ITEM_WIDTH = 150;
const ITEM_GAP = 18;
const MAX_ITEMS_PER_ROW = 9;
const MAX_STATIC_ITEMS = MAX_ITEMS_PER_ROW * 2;

function splitBalancedRows(categories: HomeCategoryGridItem[]) {
  const topRowCount = Math.min(
    MAX_ITEMS_PER_ROW,
    Math.ceil(categories.length / 2),
  );

  return {
    topRow: categories.slice(0, topRowCount),
    bottomRow: categories.slice(topRowCount),
    columnCount: Math.max(topRowCount, categories.length - topRowCount),
  };
}

function buildSwiperColumns(
  topRow: HomeCategoryGridItem[],
  bottomRow: HomeCategoryGridItem[],
) {
  const columns: HomeCategoryGridItem[][] = [];
  const columnCount = Math.max(topRow.length, bottomRow.length);

  for (let index = 0; index < columnCount; index += 1) {
    columns.push([topRow[index], bottomRow[index]].filter(Boolean));
  }

  return columns;
}

export default function CategoryGrid({ categories, title }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [sliderState, setSliderState] = useState<SliderState>({
    canScroll: false,
    isBeginning: true,
    isEnd: true,
  });

  const syncSliderState = useCallback((instance: SwiperInstance) => {
    setSliderState({
      canScroll: !instance.isLocked,
      isBeginning: instance.isBeginning,
      isEnd: instance.isEnd,
    });
  }, []);

  useEffect(() => {
    if (!swiper || swiper.destroyed) return;

    swiper.update();
    const frameId = window.requestAnimationFrame(() => {
      if (!swiper.destroyed) {
        syncSliderState(swiper);
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [categories.length, swiper, syncSliderState]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const updateWidth = () => {
      setViewportWidth(el.getBoundingClientRect().width);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, []);

  const handleSlidePrev = () => {
    swiper?.slidePrev();
  };

  const handleSlideNext = () => {
    swiper?.slideNext();
  };

  const { topRow, bottomRow, columnCount } = useMemo(
    () => splitBalancedRows(categories),
    [categories],
  );
  const requiredStaticWidth =
    columnCount * ITEM_WIDTH + Math.max(0, columnCount - 1) * ITEM_GAP;
  // Until the viewport is measured, treat the layout as overflowing so the
  // first paint never stretches the page (mobile horizontal scroll).
  const shouldUseSwiper =
    categories.length > MAX_STATIC_ITEMS ||
    viewportWidth <= 0 ||
    requiredStaticWidth > viewportWidth;
  const categoryColumns = useMemo(
    () => buildSwiperColumns(topRow, bottomRow),
    [bottomRow, topRow],
  );

  return (
    <>
      <SectionHeader title={title} />

      <div className="mt-1 w-full min-w-0 max-w-full space-y-1 overflow-hidden">
        {shouldUseSwiper && sliderState.canScroll && (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
              <button
                type="button"
                aria-label="دسته‌بندی قبلی"
                onClick={handleSlidePrev}
                disabled={sliderState.isBeginning}
                className="flex h-5 w-6 cursor-pointer items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-gray-200 dark:hover:bg-gray-800 dark:disabled:text-gray-600 md:h-9 md:w-9"
              >
                <ChevronRight size={20} strokeWidth={2.4} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="دسته‌بندی بعدی"
                onClick={handleSlideNext}
                disabled={sliderState.isEnd}
                className="flex h-5 w-6 cursor-pointer items-center justify-center rounded-lg bg-primary text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none dark:disabled:bg-gray-800 dark:disabled:text-gray-600 md:h-9 md:w-9"
              >
                <ChevronLeft size={20} strokeWidth={2.4} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <div
          ref={viewportRef}
          className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-linear-to-b from-white to-transparent px-3 py-6 dark:from-[#121923]"
        >
          <div className="relative w-full min-w-0 max-w-full overflow-hidden" dir="rtl">
            {!shouldUseSwiper ? (
              <div className="space-y-4 overflow-hidden">
                <div className="flex justify-center gap-[18px] overflow-hidden">
                  {topRow.map((category) => (
                    <CategoryGridCard key={category.id} category={category} />
                  ))}
                </div>

                {bottomRow.length > 0 && (
                  <div className="flex justify-center gap-[18px] overflow-hidden">
                    {bottomRow.map((category) => (
                      <CategoryGridCard
                        key={category.id}
                        category={category}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {sliderState.canScroll && !sliderState.isBeginning && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-white to-transparent dark:from-[#121923]"
                  />
                )}
                {sliderState.canScroll && !sliderState.isEnd && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-white to-transparent dark:from-[#121923]"
                  />
                )}

                <Swiper
                  dir="rtl"
                  className="!overflow-hidden"
                  slidesPerView="auto"
                  spaceBetween={18}
                  watchOverflow
                  onSwiper={(instance) => {
                    setSwiper(instance);
                    syncSliderState(instance);
                  }}
                  onAfterInit={syncSliderState}
                  onResize={syncSliderState}
                  onUpdate={syncSliderState}
                  onSlideChange={syncSliderState}
                  onReachBeginning={syncSliderState}
                  onReachEnd={syncSliderState}
                  onFromEdge={syncSliderState}
                  onLock={syncSliderState}
                  onUnlock={syncSliderState}
                >
                  {categoryColumns.map((column) => (
                    <SwiperSlide
                      key={column.map((category) => category.id).join("-")}
                      className="!w-[150px]"
                    >
                      <div className="grid grid-rows-2 gap-y-4">
                        {column.map((category) => (
                          <CategoryGridCard
                            key={category.id}
                            category={category}
                          />
                        ))}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function CategoryGridCard({ category }: { category: HomeCategoryGridItem }) {
  return (
    <Link
      href={`/products/${category.slug}`}
      prefetch={false}
      className="group flex w-[150px] max-w-[150px] min-w-0 shrink-0 flex-col items-center overflow-hidden text-center"
    >
      <div className="relative flex size-30 items-center justify-center rounded-full border border-gray-200 bg-[#f1f1f1] shadow-[inset_0_0_0_3px_#fff] transition duration-200 group-hover:-translate-y-1 group-hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-[inset_0_0_0_3px_#111827]">
        <Image
          width={100}
          height={100}
          src={category.src ?? "/images/default.png"}
          alt={category.name}
          className="max-h-[108%] w-auto max-w-[108%] object-contain transition duration-200 group-hover:scale-105"
        />
      </div>

      <span
        title={category.name}
        className="text-caption-180 h-9 w-full overflow-hidden text-center text-neutral-900 ellipsis-2 dark:text-gray-100 lg:text-sm"
      >
        {category.name}
      </span>
    </Link>
  );
}
