// product/[...params]/page.tsx

import { Metadata } from "next";
import ProductDetails from "@/components/ui/ProductPageClient/ProductPageClient";
import { getProductById } from "@/src/services/product/product.server";
import { absoluteUrl } from "@/src/lib/seo/site";
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

function getInitialVariantId(product: ProductDetail, variantIdentifier?: string) {
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

  return {
    title: product?.metaTitle ?? product.name,
    description: product?.metaDescription ?? product.shortDescription,
    keywords: product?.metaKeywords,
    alternates: {
      canonical: absoluteUrl(getProductVariantPath(product, canonicalVariantId)),
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
  const resolvedInitialVariantId = getInitialVariantId(product, initialVariantId);

  return (
    <ProductDetails
      key={`${product.productId}-${resolvedInitialVariantId}`}
      product={product}
      initialVariantId={resolvedInitialVariantId}
    />
  );
}
