"use client";
// components/ui/ProductPageClient/ProductPageClient.tsx
import { useState } from "react";
import Gallery from "./Gallery/Gallery";
import Description from "./Description/Description";
import Action from "./Action/Action";
import ConsumerProducts from "./ConsumerProducts/ConsumerProducts";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import { ProductDetail } from "@/src/lib/types/products/productDetail.types";
import Review from "./Review/Review";
import Breadcrumb from "@/components/modules/Breadcrumb/Breadcrumb";
import { getProductImage } from "@/src/utils/product-image";

interface Props {
  product: ProductDetail;
}

export default function ProductPageClient({ product }: Props) {
  const primaryCategory =
    product.categories?.find((c) => c.isPrimary) ?? product.categories?.[0];

  const productDetailsBreadcrumb = [
    {
      id: "0",
      name: "خانه",
      slug: "",
      link: `/`,

      depth: -1,
      position: 0,
      isActive: true,
    },
    ...(product.categoryPath?.length
      ? product.categoryPath.map((item, index) => ({
          id: item.categoryId,
          name: item.name,
          slug: item.slug,
          link: `/products/${item.slug}`,
          depth: item.depth,
          position: index + 1,
          isActive: false,
        }))
      : [
          {
            id: "1",
            name: primaryCategory?.name ?? "محصولات",
            slug: primaryCategory?.slug ?? "",
            link: primaryCategory?.slug
              ? `/products/${primaryCategory.slug}`
              : "/products",
            depth: 0,
            position: 1,
            isActive: false,
          },
        ]),
    {
      id: "2",
      name: product.name,
      slug: product.slug,
      depth: 0,
      position: (product.categoryPath?.length ?? 1) + 1,
      isActive: false,
    },
  ];

  const defaultVariant =
    product.variants?.find((v) => v.isDefault) ?? product.variants?.[0];

  const [selectedVariantId, setSelectedVariantId] = useState(
    defaultVariant?.variantId ?? "",
  );

  const selectedVariant =
    product.variants?.find((v) => v.variantId === selectedVariantId) ??
    defaultVariant;

  const isOutOfStock = !selectedVariant?.inStock;

  const variantImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : (product.variants?.flatMap((variant) => variant.images ?? []) ?? []);

  const images = variantImages.length
    ? variantImages.map((img) => ({
        imgSrc: getProductImage(img.largePath),
        thumbSrc: getProductImage(img.thumbnailPath),
      }))
    : [{ imgSrc: "/images/default.png", thumbSrc: "/images/default.png" }];

  return (
    <>
      <SectionContainer>
        <Breadcrumb items={productDetailsBreadcrumb} />
        <div className="bg-white dark:bg-custom-dark dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 dark:border-gray-700 mt-4 rounded-2xl px-6 py-4">
          <div className="grid grid-cols-12 gap-4 place-items-start">
            <Gallery
              key={selectedVariant?.variantId ?? "gallery"}
              images={images}
              isOutOfStock={isOutOfStock}
              productName={product.name}
              productId={product.productId}
              initialIsInWishlist={product.isInWishlist}
              promotion={product.promotion}
              isAmazingOffer={
                Boolean(product.promotion) ||
                (selectedVariant?.isAmazingOffer ?? product.isAmazingOffer)
              }
            />
            <Description
              product={product}
              selectedVariantId={selectedVariant?.variantId ?? ""}
              onSelectVariant={setSelectedVariantId}
              isOutOfStock={isOutOfStock}
            />
            <Action
              product={product}
              variant={selectedVariant}
              isOutOfStock={isOutOfStock}
            />
          </div>
        </div>
      </SectionContainer>

      <ConsumerProducts products={product.relatedProducts} />

      <SectionContainer>
        <Review
          product={product}
          attributes={product.attributes}
          variant={selectedVariant}
          isOutOfStock={isOutOfStock}
        />
      </SectionContainer>

      <ConsumerProducts
        products={product.crossSellProducts}
        title="محصولات مرتبط"
      />
    </>
  );
}
