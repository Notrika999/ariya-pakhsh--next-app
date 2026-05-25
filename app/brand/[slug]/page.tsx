import Brand from "@/components/ui/Brand/Brand";
import { Metadata } from "next";

// اگر برند داینامیک است (مثل [brandName]) از params استفاده کنید
export async function generateMetadata({ params }: { params: { brandName: string } }): Promise<Metadata> {


  return {
    title: `خرید محصولات برند TEST | فروشگاه اینترنتی`,
    description: `مشاهده و خرید آنلاین جدیدترین محصولات برند TEST با بهترین قیمت، گارانتی اصالت و ارسال سریع از فروشگاه.`,
    keywords: [`خرید TEST`, `قیمت محصولات TEST`, `فروشگاه TEST`],
    openGraph: {
      title: `خرید محصولات برند TEST`,
      description: `خرید آنلاین محصولات برند TEST با تضمین کیفیت.`,
      type: "website",
    },
  };
}

function BrandPage() {
  return <Brand />;
}

export default BrandPage;
