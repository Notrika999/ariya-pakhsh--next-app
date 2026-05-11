import ProductDetails from "@/components/ui/ProductDetails/ProductDetails";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;

  console.log(id);
  return <ProductDetails id={id} />;
}

export default ProductDetailsPage;
