"use client";
// components/ui/ProductPageClient/ProductPageClient.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Gallery from "./Gallery/Gallery";
import Description from "./Description/Description";
import Action from "./Action/Action";
import ConsumerProducts from "./ConsumerProducts/ConsumerProducts";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import Review from "./Review/Review";
import Breadcrumb from "@/components/modules/Breadcrumb/Breadcrumb";
import { getProductImage } from "@/src/utils/product-image";
import { createProductView } from "@/src/services/product/product.client";
import type {
  ProductDetail,
  ProductDetailVariant,
} from "@/src/lib/types/products/productDetail.types";

interface Props {
  product: ProductDetail;
  initialVariantId?: string;
}

const VARIANT_QUERY_KEY = "variant-id";
const PUBLIC_CODE_QUERY_KEY = "public-code";
const PRODUCT_SERVICE_ITEMS = [
  // {
  //   title: "امکان تحویل اکسپرس",
  //   icon: "far fa-box-open",
  // },
  {
    title: "۲۴ ساعته، ۷ روز هفته",
    icon: "far fa-headset",
  },
  {
    title: "امکان پرداخت در محل",
    icon: "far fa-credit-card",
  },
  {
    title: "هفت روز ضمانت بازگشت کالا",
    icon: "far fa-box-arrow-left",
  },
  {
    title: "ضمانت اصل بودن کالا",
    icon: "far fa-badge-check",
  },
] as const;

function isVariantOutOfStock(variant?: ProductDetailVariant): boolean {
  if (!variant) return true;
  if (!variant.allowBackorder && variant.availableQuantity <= 0) return true;
  return variant.inStock === false;
}

function getDefaultVariant(product: ProductDetail) {
  return product.variants?.find((v) => v.isDefault) ?? product.variants?.[0];
}

function getProductVariant(product: ProductDetail, variantId?: string) {
  const normalizedVariantIdentifier = variantId?.trim();
  if (!normalizedVariantIdentifier) return undefined;

  return product.variants?.find(
    (variant) =>
      variant.variantId === normalizedVariantIdentifier ||
      variant.publicCode === normalizedVariantIdentifier,
  );
}

function getProductVariantPath(product: ProductDetail, publicCode: string) {
  const basePath = `/product/${encodeURIComponent(product.publicCode)}/${encodeURIComponent(product.slug)}`;
  const params = new URLSearchParams(
    typeof window === "undefined" ? "" : window.location.search,
  );

  params.delete(VARIANT_QUERY_KEY);
  params.set(PUBLIC_CODE_QUERY_KEY, publicCode);

  return `${basePath}?${params.toString()}`;
}

export default function ProductPageClient({
  product,
  initialVariantId = "",
}: Props) {
  const router = useRouter();
  const viewedSlugsRef = useRef<Set<string>>(new Set());
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

  const defaultVariant = useMemo(() => getDefaultVariant(product), [product]);

  const [selectedVariantId, setSelectedVariantId] = useState(
    () =>
      getProductVariant(product, initialVariantId)?.variantId ??
      defaultVariant?.variantId ??
      "",
  );

  useEffect(() => {
    const slug = product.slug?.trim();
    if (!slug || viewedSlugsRef.current.has(slug)) return;

    viewedSlugsRef.current.add(slug);
    void createProductView(slug).catch((error) => {
      console.error("[ProductPageClient] create product view failed =>", error);
    });
  }, [product.slug]);

  const selectedVariant =
    product.variants?.find((v) => v.variantId === selectedVariantId) ??
    defaultVariant;

  useEffect(() => {
    const publicCode = selectedVariant?.publicCode?.trim();
    if (!publicCode) return;

    const nextPath = getProductVariantPath(product, publicCode);
    const currentPath = `${window.location.pathname}${window.location.search}`;
    if (currentPath === nextPath) return;

    router.replace(nextPath, { scroll: false });
  }, [product, router, selectedVariant?.publicCode]);

  function handleSelectVariant(variantId: string) {
    const nextVariant = getProductVariant(product, variantId);
    if (!nextVariant) return;

    setSelectedVariantId(nextVariant.variantId);
  }

  const isOutOfStock = isVariantOutOfStock(selectedVariant);
  const campaignLabel =
    selectedVariant?.campaignLabel ?? product.campaignLabel ?? null;
  const campaignEndAt =
    selectedVariant?.campaignEndAt ?? product.campaignEndAt ?? null;
  const campaignRemainingSeconds =
    selectedVariant?.campaignRemainingSeconds ??
    product.campaignRemainingSeconds ??
    null;

  const variantImages =
    product.variants?.flatMap((variant) =>
      (variant.images ?? []).map((image) => ({
        ...image,
        variantId: variant.variantId,
      })),
    ) ?? [];

  const images = variantImages.length
    ? variantImages.map((img) => ({
        imgSrc: getProductImage(img.largePath),
        thumbSrc: getProductImage(img.thumbnailPath),
        variantId: img.variantId,
        isPrimary: img.isPrimary,
      }))
    : [{ imgSrc: "/images/default.png", thumbSrc: "/images/default.png" }];

  return (
    <>
      <SectionContainer>
        <Breadcrumb items={productDetailsBreadcrumb} />
        <div className="bg-white dark:bg-custom-dark dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 dark:border-gray-700 mt-4 rounded-2xl px-6 py-4">
          <div className="grid grid-cols-12 gap-4 place-items-start">
            <Gallery
              images={images}
              isOutOfStock={isOutOfStock}
              productName={product.name}
              productId={product.productId}
              variants={product.variants}
              selectedVariantId={selectedVariant?.variantId ?? ""}
              initialIsInWishlist={product.isInWishlist}
              promotion={product.promotion}
              campaignLabel={campaignLabel}
              campaignEndAt={campaignEndAt}
              campaignRemainingSeconds={campaignRemainingSeconds}
              isAmazingOffer={
                Boolean(product.promotion) ||
                (selectedVariant?.isAmazingOffer ?? product.isAmazingOffer)
              }
            />
            <Description
              product={product}
              selectedVariantId={selectedVariant?.variantId ?? ""}
              onSelectVariant={handleSelectVariant}
              isOutOfStock={isOutOfStock}
            />
            <Action
              product={product}
              variant={selectedVariant}
              isOutOfStock={isOutOfStock}
            />
          </div>

          <div className="mt-2 grid justify-center border-y border-gray-100 py-5 dark:border-gray-700">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-5 text-gray-400 dark:text-gray-500 sm:grid-cols-3 lg:grid-cols-5">
              {PRODUCT_SERVICE_ITEMS.map((item) => (
                <li
                  key={item.title}
                  className="flex items-center justify-center gap-1 text-center"
                >
                  <i
                    className={`${item.icon}  leading-none`}
                    aria-hidden="true"
                  />
                  <span className="text-xs text-nowrap font-semibold leading-6">
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
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
