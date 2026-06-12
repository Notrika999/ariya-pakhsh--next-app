// product/[...params]/page.tsx

import { Metadata } from "next";
import ProductDetails from "@/components/ui/ProductPageClient/ProductPageClient";
import { getProductById } from "@/src/services/product/product.service";

interface PageProps {
  params: Promise<{
    params: string[];
  }>;
}

export async function generateMetadata({
  params: pageParams,
}: PageProps): Promise<Metadata> {
  const { params } = await pageParams;

  const [, slug] = params;

  const product = await getProductById(decodeURIComponent(slug));

  return {
    title: product?.metaTitle ?? product.name,
    description: product?.metaDescription ?? product.shortDescription,
    keywords: product?.metaKeywords,
  };
}

export default async function ProductDetailsPage({ params: pageParams }: PageProps) {
  const { params } = await pageParams;
  const [publicCode, slug, id] = params;

  const title = await decodeURIComponent(slug);

  const product = await getProductById(title);

  return <ProductDetails product={product} />;
}