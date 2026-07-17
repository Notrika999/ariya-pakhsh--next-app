"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import ProductCard from "@/components/modules/ProductCard/ProductCard";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import type { RelatedProduct } from "@/src/lib/types/products/productDetail.types";
import type { ProductCardModel } from "@/src/lib/types/productTypes";
import { getProductImage } from "@/src/utils/product-image";

interface ConsumerProductsProps {
  products?: RelatedProduct[] | null;
  title?: string;
  noClick?: boolean;
}

function mapRelatedToCard(product: RelatedProduct): ProductCardModel {
  const defaultVariant =
    product.variants?.find((v) => v.isDefault) ?? product.variants?.[0];

  const imagePath =
    product.thumbnailPath ??
    product.mediumPath ??
    defaultVariant?.images?.find((img) => img.isPrimary)?.mediumPath ??
    defaultVariant?.images?.[0]?.mediumPath ??
    defaultVariant?.images?.[0]?.thumbnailPath;

  const price =
    product.salePrice && product.salePrice > 0
      ? product.salePrice
      : (product.price ?? defaultVariant?.price ?? 0);

  const oldPrice =
    product.compareAtPrice && product.compareAtPrice > 0
      ? product.compareAtPrice
      : (product.price ?? defaultVariant?.price ?? price);

  const isOnSale =
    Boolean(product.isOnSale) ||
    Boolean(defaultVariant?.isOnSale) ||
    (oldPrice > price && price > 0);

  const discountPercent =
    isOnSale && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : undefined;

  return {
    id: product.productId,
    title: product.name,
    publicCode: product.publicCode,
    slug: product.slug,
    image: getProductImage(imagePath),
    imageSlider: [],
    primaryBrandName: product.primaryBrandName,
    primaryBrandSlug: product.primaryBrandSlug,
    categoryName: product.primaryCategoryName ?? "",
    currency: product.currencyCode ?? defaultVariant?.currencyCode ?? "IRT",
    price,
    oldPrice,
    rating: product.averageRating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    colors: [],
    quantity: product.availableQuantity ?? defaultVariant?.availableQuantity ?? 0,
    soldCount: product.soldCount ?? 0,
    inStock: product.inStock ?? defaultVariant?.inStock ?? true,
    isOnSale,
    href: `/product/${product.publicCode}/${product.slug}`,
    discountPercent,
    variantId: defaultVariant?.variantId,
  };
}

export default function ConsumerProducts({
  products = [],
  title = "محصولات مشابه",
  noClick = false,
}: ConsumerProductsProps) {
  const items = (products ?? []).filter((item) => Boolean(item?.productId));

  if (items.length === 0) return null;

  const cards = items.map(mapRelatedToCard);

  return (
    <SectionContainer>
      <section>
        <h2 className="sr-only">{title}</h2>
        <SectionHeader title={title} href={false} />

        <div className="bg-linear-to-b from-white dark:from-[#121923] to-transparent rounded-2xl p-5 transition-colors">
          <Swiper
            spaceBetween={8}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
          >
            {cards.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} noClick={noClick} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </SectionContainer>
  );
}
