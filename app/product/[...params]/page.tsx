// product/[...params]/page.tsx

import { Metadata } from "next";
import ProductDetails from "@/components/ui/ProductPageClient/ProductPageClient";
import { getProductById } from "@/src/services/product/product.service";

interface PageProps {
  params: Promise<{
    params: string[];
  }>;
}

export async function generateMetadata({ params: pageParams }: PageProps): Promise<Metadata> {
  const { params } = await pageParams;
  const [publicCode, slug, id] = params;

  const product = await getProductById(id);

  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.shortDescription,
    keywords: product.metaKeywords,
    openGraph: {
      title: product.metaTitle ?? product.name,
      description: product.metaDescription ?? product.shortDescription,
      images: product.variants?.[0]?.images?.[0]?.largePath
        ? [`https://aryapakhsh.shop${product.variants[0].images[0].largePath}`]
        : [],
    },
  };
}

export default async function ProductDetailsPage({ params: pageParams }: PageProps) {
  const { params } = await pageParams;
  const [publicCode, slug, id] = params;

  const product = await getProductById(id);

  return <ProductDetails product={product} />;
}