// app/product/[...params]/page.tsx

import { Metadata } from "next";
import ProductDetails from "@/components/ui/ProductPageClient/ProductPageClient";
import { getProductById } from "@/src/services/product/product.server";
import { SITE_NAME, absoluteUrl } from "@/src/lib/seo/site";
import { getProductImage } from "@/src/utils/product-image";
import type { ProductDetail } from "@/src/lib/types/products/productDetail.types";

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

function getProductVariantPath(product: ProductDetail, variantId?: string) {
  const basePath = `/product/${encodeURIComponent(product.publicCode)}/${encodeURIComponent(product.slug)}`;
  const variantPublicCode = product.variants?.find(
    (variant) => variant.variantId === variantId,
  )?.publicCode;

  return variantPublicCode
    ? `${basePath}?${PUBLIC_CODE_QUERY_KEY}=${encodeURIComponent(variantPublicCode)}`
    : basePath;
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

export async function generateMetadata({
  params: pageParams,
  searchParams: pageSearchParams,
}: PageProps): Promise<Metadata> {
  const { params } = await pageParams;
  const searchParams = pageSearchParams ? await pageSearchParams : {};

  const [publicCodeOrProductId = "", slug = "", variantId = ""] = params;
  const productIdentifier = decodeURIComponent(slug || publicCodeOrProductId);
  const requestedVariantId =
    getSearchParamValue(searchParams[PUBLIC_CODE_QUERY_KEY]) ??
    getSearchParamValue(searchParams[VARIANT_QUERY_KEY]) ??
    (variantId ? decodeURIComponent(variantId) : "");

  const product = await getProductById(productIdentifier);

  const canonicalVariantId = getInitialVariantId(product, requestedVariantId);
  const title = `قیمت و خرید ${product?.metaTitle ?? product.name}`;
  const description = product?.metaDescription ?? product.shortDescription;
  const canonicalUrl = absoluteUrl(
    getProductVariantPath(product, canonicalVariantId),
  );
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
  const [publicCodeOrProductId = "", slug = "", variantId = ""] = params;

  const productIdentifier = decodeURIComponent(slug || publicCodeOrProductId);
  const initialVariantId =
    getSearchParamValue(searchParams[PUBLIC_CODE_QUERY_KEY]) ??
    getSearchParamValue(searchParams[VARIANT_QUERY_KEY]) ??
    (variantId ? decodeURIComponent(variantId) : "");

  const product = await getProductById(productIdentifier);
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
