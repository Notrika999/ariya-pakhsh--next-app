// app/product/[...params]/page.tsx

import { Metadata } from "next";
import ProductDetails from "@/components/ui/ProductPageClient/ProductPageClient";
import { SITE_NAME, absoluteUrl } from "@/src/lib/seo/site";
import { buildCanonical } from "@/src/lib/seo/canonical";
import { getProductImage } from "@/src/utils/product-image";
import { formatPrice } from "@/src/utils/formatPrice";
import type { ProductDetail } from "@/src/lib/types/products/productDetail.types";
import { getProductIdentifier, loadProduct } from "./load-product";
import {
  getProductCanonicalPath,
  redirectLegacyProductPath,
} from "./product-url";

interface PageProps {
  params: Promise<{
    params: string[];
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const VARIANT_QUERY_KEY = "variant-id";
const PUBLIC_CODE_QUERY_KEY = "public-code";

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getInitialVariantId(
  product: ProductDetail,
  variantIdentifier?: string,
) {
  const normalizedVariantIdentifier = variantIdentifier?.trim();

  return (
    product.variants?.find(
      (variant) =>
        variant.variantId === normalizedVariantIdentifier ||
        variant.publicCode === normalizedVariantIdentifier,
    )?.variantId ??
    product.variants?.find((variant) => variant.isDefault)?.variantId ??
    product.variants?.[0]?.variantId ??
    ""
  );
}

function getProductShareImage(product: ProductDetail, variantId?: string) {
  const variantImages =
    product.variants?.find((variant) => variant.variantId === variantId)
      ?.images ?? [];
  const allImages =
    product.variants?.flatMap((variant) => variant.images) ?? [];
  const image =
    variantImages.find((item) => item.isPrimary) ??
    variantImages[0] ??
    allImages.find((item) => item.isPrimary) ??
    allImages[0];

  const imageUrl = getProductImage(
    image?.largePath ?? image?.mediumPath ?? image?.thumbnailPath,
  );

  return imageUrl.startsWith("http") ? imageUrl : absoluteUrl(imageUrl);
}

function getProductPreviewPrice(product: ProductDetail, variantId?: string) {
  const variant =
    product.variants?.find((item) => item.variantId === variantId) ??
    product.variants?.find((item) => item.isDefault) ??
    product.variants?.[0];
  const price =
    variant?.salePrice ?? variant?.finalPrice ?? variant?.price ?? null;

  if (typeof price !== "number" || price <= 0) return "";

  return `${formatPrice(price)} تومان`;
}

function getProductPreviewDescription(
  product: ProductDetail,
  variantId?: string,
) {
  const priceText = getProductPreviewPrice(product, variantId);
  const description = product.metaDescription ?? product.shortDescription ?? "";

  return [priceText, description].filter(Boolean).join(" | ");
}

export async function generateMetadata({
  params: pageParams,
  searchParams: pageSearchParams,
}: PageProps): Promise<Metadata> {
  const { params } = await pageParams;
  const searchParams = pageSearchParams ? await pageSearchParams : {};

  const [, , variantId = ""] = params;
  const productIdentifier = getProductIdentifier(params);
  const requestedVariantId =
    getSearchParamValue(searchParams[PUBLIC_CODE_QUERY_KEY]) ??
    getSearchParamValue(searchParams[VARIANT_QUERY_KEY]) ??
    (variantId ? decodeURIComponent(variantId) : "");

  const product = await loadProduct(productIdentifier);
  redirectLegacyProductPath(params, product, searchParams);

  const canonicalVariantId = getInitialVariantId(product, requestedVariantId);
  const title = `قیمت و خرید ${product?.metaTitle ?? product.name}`;
  const description = getProductPreviewDescription(product, canonicalVariantId);
  const canonicalUrl = buildCanonical(getProductCanonicalPath(product));
  const imageUrl = getProductShareImage(product, canonicalVariantId);

  return {
    title,
    description,
    keywords: product?.metaKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProductDetailsPage({
  params: pageParams,
  searchParams: pageSearchParams,
}: PageProps) {
  const { params } = await pageParams;
  const searchParams = pageSearchParams ? await pageSearchParams : {};
  const [, , variantId = ""] = params;

  const productIdentifier = getProductIdentifier(params);
  const initialVariantId =
    getSearchParamValue(searchParams[PUBLIC_CODE_QUERY_KEY]) ??
    getSearchParamValue(searchParams[VARIANT_QUERY_KEY]) ??
    (variantId ? decodeURIComponent(variantId) : "");

  const product = await loadProduct(productIdentifier);
  redirectLegacyProductPath(params, product, searchParams);

  const resolvedInitialVariantId = getInitialVariantId(
    product,
    initialVariantId,
  );

  return (
    <ProductDetails
      key={`${product.productId}-${resolvedInitialVariantId}`}
      product={product}
      initialVariantId={resolvedInitialVariantId}
    />
  );
}
