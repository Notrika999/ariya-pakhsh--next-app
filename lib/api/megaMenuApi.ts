export const fetchMegaMenu = async () => {
  const res = await fetch("/mocks/megaMenuData.json", {
    cache: "no-store",
  });

  if (!res.ok) {
    return { error: true, message: "خطا در دریافت مگامنو" };
  }

  return await res.json();
};
