import ProductListPage from "@/components/ui/Categories/ProductListPage";
import { getCategoryBySlug } from "@/src/services/category/category.service";


type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function CategorayPage({ params }: Props) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);

  console.log(category);

  return (
    <>
      <ProductListPage type="category" slug={slug} category={category} />
    </>
  );
}

export default CategorayPage;
