"use client";
// components/ui/ProductPageClient/ConsumerProducts/ConsumerProducts.tsx
import { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";

import ProductCard from "@/components/modules/ProductCard/ProductCard";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import type {
  ProductDetailVariant,
  RelatedProduct,
} from "@/src/lib/types/products/productDetail.types";
import type { ProductCardModel } from "@/src/lib/types/productTypes";
import { getProductImage } from "@/src/utils/product-image";

interface ConsumerProductsProps {
  products?: RelatedProduct[] | null;
  title?: string;
  noClick?: boolean;
}

type SliderState = {
  canScroll: boolean;
  isBeginning: boolean;
  isEnd: boolean;
};

function getStringField(value: unknown, keys: string[]): string | undefined {
  if (!value || typeof value !== "object") return undefined;

  const record = value as Record<string, unknown>;
  for (const key of keys) {
    const fieldValue = record[key];
    if (typeof fieldValue === "string" && fieldValue.trim()) {
      return fieldValue.trim();
    }
  }

  return undefined;
}

function getNumberField(value: unknown, keys: string[]): number | undefined {
  if (!value || typeof value !== "object") return undefined;

  const record = value as Record<string, unknown>;
  for (const key of keys) {
    const parsed = Number(record[key]);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return undefined;
}

function getRelatedPricing(
  product: RelatedProduct,
  defaultVariant?: ProductDetailVariant,
) {
  const promotion = product.promotion;
  const finalPrice =
    product.salePrice ??
    product.finalPrice ??
    defaultVariant?.salePrice ??
    defaultVariant?.finalPrice ??
    promotion?.finalPrice;
  const price =
    finalPrice && finalPrice > 0
      ? finalPrice
      : (product.price ?? defaultVariant?.price ?? 0);
  const oldPrice =
    product.compareAtPrice && product.compareAtPrice > price
      ? product.compareAtPrice
      : product.originalPrice && product.originalPrice > price
        ? product.originalPrice
        : product.basePrice && product.basePrice > price
          ? product.basePrice
          : defaultVariant?.compareAtPrice && defaultVariant.compareAtPrice > price
            ? defaultVariant.compareAtPrice
            : defaultVariant?.originalPrice && defaultVariant.originalPrice > price
              ? defaultVariant.originalPrice
              : defaultVariant?.basePrice && defaultVariant.basePrice > price
                ? defaultVariant.basePrice
                : promotion?.basePrice && promotion.basePrice > price
                  ? promotion.basePrice
                  : product.compareAtPrice ?? product.price ?? defaultVariant?.price ?? price;
  const explicitDiscount =
    product.discountPercent && product.discountPercent > 0
      ? product.discountPercent
      : defaultVariant?.discountPercent && defaultVariant.discountPercent > 0
        ? defaultVariant.discountPercent
        : promotion?.discountPercent;
  const discountPercent =
    explicitDiscount && explicitDiscount > 0
      ? Math.round(explicitDiscount)
      : oldPrice > price && price > 0
        ? Math.round(((oldPrice - price) / oldPrice) * 100)
        : 0;

  return {
    price,
    oldPrice,
    discountPercent,
    isOnSale:
      Boolean(product.isOnSale) ||
      Boolean(defaultVariant?.isOnSale) ||
      discountPercent > 0 ||
      oldPrice > price,
  };
}

function getRelatedSaleBadge(
  product: RelatedProduct,
  defaultVariant?: ProductDetailVariant,
  discountPercent = 0,
) {
  const promotion = product.promotion;
  const label =
    getStringField(product, [
      "campaignLabel",
      "campaignTitle",
      "campaignName",
      "promotionLabel",
      "promotionTitle",
      "promotionTypeDisplayName",
      "typeLabel",
    ]) ??
    getStringField(defaultVariant, [
      "campaignLabel",
      "campaignTitle",
      "campaignName",
      "promotionLabel",
      "promotionTitle",
      "promotionTypeDisplayName",
      "typeLabel",
    ]) ??
    getStringField(promotion, [
      "promotionTypeDisplayName",
      "typeLabel",
      "campaignLabel",
      "campaignTitle",
      "campaignName",
    ]);

  if (!label) return undefined;

  return {
    label,
    promotionType:
      getNumberField(product, ["promotionType"]) ??
      getNumberField(defaultVariant, ["promotionType"]) ??
      promotion?.promotionType,
    promotionTypeValue:
      getStringField(product, ["promotionTypeValue"]) ??
      getStringField(defaultVariant, ["promotionTypeValue"]) ??
      promotion?.promotionTypeValue,
    discountPercent,
    endsAt:
      getStringField(product, ["campaignEndAt", "promotionEndAt"]) ??
      getStringField(defaultVariant, ["campaignEndAt", "promotionEndAt"]) ??
      promotion?.promotionEndAt,
    remainingSeconds:
      product.campaignRemainingSeconds ??
      defaultVariant?.campaignRemainingSeconds ??
      promotion?.remainingSeconds,
  };
}

function asPathSegment(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") {
    return null;
  }

  return trimmed;
}

function getRelatedProductHref(product: RelatedProduct): string | null {
  const variantPublicCode = asPathSegment(
    product.variants?.find((variant) => variant.isDefault)?.publicCode ??
      product.variants?.[0]?.publicCode,
  );
  const publicCode = asPathSegment(product.publicCode) ?? variantPublicCode;
  const slug = asPathSegment(product.slug);
  const productId = asPathSegment(product.productId);

  if (publicCode && slug) {
    return `/product/${publicCode}/${slug}`;
  }

  if (slug) {
    return `/product/${slug}`;
  }

  if (productId) {
    return `/product/${productId}`;
  }

  return null;
}

function getRelatedInStock(
  product: RelatedProduct,
  defaultVariant?: ProductDetailVariant,
): boolean | undefined {
  const availableQuantity =
    product.availableQuantity ?? defaultVariant?.availableQuantity;

  if (
    typeof availableQuantity === "number" &&
    availableQuantity <= 0 &&
    !defaultVariant?.allowBackorder
  ) {
    return false;
  }

  if (typeof product.inStock === "boolean") return product.inStock;
  if (typeof defaultVariant?.inStock === "boolean") return defaultVariant.inStock;

  return typeof availableQuantity === "number" ? availableQuantity > 0 : undefined;
}

function mapRelatedToCard(product: RelatedProduct): ProductCardModel | null {
  const href = getRelatedProductHref(product);
  if (!href) return null;

  const defaultVariant =
    product.variants?.find((v) => v.isDefault) ?? product.variants?.[0];

  const imagePath =
    product.thumbnailPath ??
    product.mediumPath ??
    defaultVariant?.images?.find((img) => img.isPrimary)?.mediumPath ??
    defaultVariant?.images?.[0]?.mediumPath ??
    defaultVariant?.images?.[0]?.thumbnailPath;

  const pricing = getRelatedPricing(product, defaultVariant);
  const saleBadge = getRelatedSaleBadge(
    product,
    defaultVariant,
    pricing.discountPercent,
  );
  const quantity = product.availableQuantity ?? defaultVariant?.availableQuantity ?? 0;

  return {
    id: product.productId,
    title: product.name,
    publicCode: asPathSegment(product.publicCode) ?? undefined,
    slug: asPathSegment(product.slug) ?? undefined,
    image: getProductImage(imagePath),
    imageSlider: [],
    primaryBrandName: product.primaryBrandName,
    primaryBrandSlug: product.primaryBrandSlug,
    categoryName: product.primaryCategoryName ?? "",
    currency: product.currencyCode ?? defaultVariant?.currencyCode ?? "IRT",
    price: pricing.price,
    oldPrice: pricing.oldPrice,
    originalPrice: pricing.oldPrice,
    discountedPrice: pricing.price,
    rating: product.averageRating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    colors: [],
    quantity,
    soldCount: product.soldCount ?? 0,
    inStock: getRelatedInStock(product, defaultVariant),
    isOnSale: pricing.isOnSale,
    href,
    discountPercent: pricing.discountPercent,
    showSaleBadge: saleBadge,
    specialSale: Boolean(saleBadge || product.isAmazingOffer),
    variantId: defaultVariant?.variantId,
    ...(saleBadge?.endsAt ? { dealEndsAt: saleBadge.endsAt } : {}),
  };
}

export default function ConsumerProducts({
  products = [],
  title = "محصولات مشابه",
  noClick = false,
}: ConsumerProductsProps) {
  const items = (products ?? []).filter((item) => Boolean(item?.productId));
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
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
  }, [items.length, swiper, syncSliderState]);

  const handleSlidePrev = () => {
    swiper?.slidePrev();
  };

  const handleSlideNext = () => {
    swiper?.slideNext();
  };

  if (items.length === 0) return null;

  const cards = items
    .map(mapRelatedToCard)
    .filter((card): card is ProductCardModel => card !== null);

  if (cards.length === 0) return null;

  return (
    <SectionContainer>
      <section>
        <h2 className="sr-only">{title}</h2>
        <SectionHeader title={title} href={false} />

        <div className="mt-3 space-y-3">
          {sliderState.canScroll && (
            <div className="flex justify-end">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
                <button
                  type="button"
                  aria-label="محصول مشابه قبلی"
                  onClick={handleSlidePrev}
                  disabled={sliderState.isBeginning}
                  className="flex md:h-9 md:w-9 h-5 w-6 cursor-pointer items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-gray-200 dark:hover:bg-gray-800 dark:disabled:text-gray-600"
                >
                  <ChevronRight size={20} strokeWidth={2.4} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="محصول مشابه بعدی"
                  onClick={handleSlideNext}
                  disabled={sliderState.isEnd}
                  className="flex md:h-9 md:w-9 h-5 w-6 cursor-pointer items-center justify-center rounded-lg bg-primary text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
                >
                  <ChevronLeft size={20} strokeWidth={2.4} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-linear-to-b from-white dark:from-[#121923] to-transparent rounded-2xl p-5 transition-colors">
            <div className="relative">
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
                spaceBetween={8}
                slidesPerView={1}
                watchOverflow
                onSwiper={(instance) => {
                  setSwiper(instance);
                  syncSliderState(instance);
                }}
                onAfterInit={syncSliderState}
                onBreakpoint={syncSliderState}
                onResize={syncSliderState}
                onUpdate={syncSliderState}
                onSlideChange={syncSliderState}
                onReachBeginning={syncSliderState}
                onReachEnd={syncSliderState}
                onFromEdge={syncSliderState}
                onLock={syncSliderState}
                onUnlock={syncSliderState}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                  1280: { slidesPerView: 5 },
                }}
              >
                {cards.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} noClick={noClick} noTimer />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </SectionContainer>
  );
}
