import { ProductResponse, ApiError } from "@/lib/types/productTypes";

export const fetchProducts = async (): Promise<ProductResponse | ApiError> => {
  try {
    const res = await fetch("/mocks/products.json", { cache: "no-store" });

    if (!res.ok) {
      return { error: true, message: "خطا در دریافت لیست محصولات" };
    }

    return await res.json();
  } catch (error) {
    return { error: true, message: "ارتباط با سرور برقرار نشد" };
  }
};
