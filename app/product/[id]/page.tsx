import ProductDetails from "@/components/ui/ProductPageClient/ProductPageClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return <ProductDetails id={id} />;
}

export default ProductDetailsPage;
