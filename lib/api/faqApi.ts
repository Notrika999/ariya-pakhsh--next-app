export const fetchFaqs = async () => {
  const res = await fetch("/mocks/faq.json", { cache: "no-store" });

  if (!res.ok) {
    return { error: true, message: "خطا در دریافت اطلاعات FAQ" };
  }

  return await res.json();
};
