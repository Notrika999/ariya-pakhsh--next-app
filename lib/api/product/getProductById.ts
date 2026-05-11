import { Product, ProductResponse, ApiError } from "@/lib/types/productTypes";

export const fetchProductById = async (
  id: string
): Promise<Product | ApiError> => {
  try {
    const res = await fetch("/mocks/products.json", { cache: "no-store" });

    if (!res.ok) {
      return { error: true, message: "خطا در دریافت اطلاعات محصول" };
    }

    const data: ProductResponse = await res.json();

    const product = data.products.find((p) => p.id === id);

    if (!product) {
      return { error: true, message: "محصول مورد نظر یافت نشد" };
    }

    return product;
  } catch (error) {
    return { error: true, message: "ارتباط با سرور برقرار نشد" };
  }
};
