import DealsClient from "@/components/ui/IncredibleOffers/DealsClient/DealsClient";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Metadata } from "next";

// تعریف متادیتای سئو
export const metadata: Metadata = {
  title: "پیشنهادهای شگفت انگیز آریاپخش | تخفیف‌های ویژه امروز",
  description:
    "در صفحه پیشنهادهای شگفت‌انگیز آریاپخش هر روز منتظر بهترین تخفیف‌ها باشید. خرید محصولات با قیمت ویژه و تخفیف‌های باورنکردنی در دسته‌بندی‌های مختلف.",
  keywords: [
    "پیشنهاد شگفت انگیز",
    "تخفیف ویژه",
    "خرید ارزان",
    "حراج آریاپخش",
    "قیمت های باورنکردنی",
  ],
  alternates: {
    canonical: "https://www.yourdomain.com/incredible-offers", // آدرس سایت خود را اینجا بگذارید
  },
  openGraph: {
    title: "پیشنهادهای شگفت انگیز | تخفیف‌های ویژه روزانه",
    description: "بهترین تخفیف‌های روز را در پیشنهاد شگفت‌انگیز تجربه کنید.",
    url: "https://www.yourdomain.com/incredible-offers",
    siteName: "فروشگاه آریاپخش",
    type: "website",
  },
};

function IncredibleOffersPage() {
  const products = MOCK_PRODUCTS;
  return (
    <main className="space-y-12 py-8 my-8">
      <DealsClient products={products} />
    </main>
  );
}

export default IncredibleOffersPage;
