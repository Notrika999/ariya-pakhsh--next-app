import { ApiError, FaqResponse } from "../types/faqTypes";

export const fetchFaqs = async (): Promise<FaqResponse | ApiError> => {
  const res = await fetch("/mocks/faq.json", { cache: "no-store" });

  if (!res.ok) {
    return { error: true, message: "خطا در دریافت اطلاعات FAQ" };
  }

  return await res.json();
};
