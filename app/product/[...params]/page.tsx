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

  const [publicCode = "", slug = ""] = params;

  const product = await getProductById(decodeURIComponent(slug));

  return {
    title: product?.metaTitle ?? product.name,
    description: product?.metaDescription ?? product.shortDescription,
    keywords: product?.metaKeywords,
    alternates: {
      canonical: absoluteUrl(
        `/product/${encodeURIComponent(publicCode)}/${encodeURIComponent(slug)}`,
      ),
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProductDetailsPage({ params: pageParams }: PageProps) {
  const { params } = await pageParams;
  const [, slug] = params;

  const title = await decodeURIComponent(slug);

  const product = await getProductById(title);

  return <ProductDetails product={product} />;
}