// app/products/loading.tsx
import ProductListPageSkeleton from "@/components/ui/Categories/ProductListPageSkeleton";

export default function Loading() {
  // صفحه همه محصولات — بدون اسلایدر زیردسته
  return <ProductListPageSkeleton showCategorySlider={false} />;
}
