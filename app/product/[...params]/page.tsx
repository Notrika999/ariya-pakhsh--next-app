// product/[...params]/page.tsx

import { Metadata } from "next";
import ProductDetails from "@/components/ui/ProductPageClient/ProductPageClient";
import { getProductById } from "@/src/services/product/product.server";
import { absoluteUrl } from "@/src/lib/seo/site";

interface PageProps {
  params: Promise<{
    params: string[];
  }>;
}

export async function generateMetadata({
  params: pageParams,
}: PageProps): Promise<Metadata> {
  const { params } = await pageParams;

  const [publicCodeOrProductId = "", slug = ""] = params;
  const productIdentifier = decodeURIComponent(slug || publicCodeOrProductId);

  const product = await getProductById(productIdentifier);

  return {
    title: product?.metaTitle ?? product.name,
    description: product?.metaDescription ?? product.shortDescription,
    keywords: product?.metaKeywords,
    alternates: {
      canonical: absoluteUrl(
        `/product/${encodeURIComponent(product.publicCode)}/${encodeURIComponent(product.slug)}`,
      ),
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProductDetailsPage({ params: pageParams }: PageProps) {
  const { params } = await pageParams;
  const [publicCodeOrProductId = "", slug = ""] = params;

  const productIdentifier = decodeURIComponent(slug || publicCodeOrProductId);

  const product = await getProductById(productIdentifier);

  return <ProductDetails product={product} />;
}
