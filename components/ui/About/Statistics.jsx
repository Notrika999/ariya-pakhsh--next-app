import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import React from "react";

export default function Statistics() {
  return (
    <section className="space-y-4 mb-20 p-8">
      <div className="text-center mb-12 space-y-3">
        <TitleAfter title={"در مسیر رشد و تعالی"} />
        <p className="max-w-2xl mx-auto opacity-90">
          ما همواره در تلاش بوده‌ایم تا با ارائه خدمات بهتر، رضایت مشتریان خود
          را جلب کرده و در مسیر پیشرفت گام برداریم.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center p-4">
          <div className="text-4xl md:text-5xl font-bold mb-2">۱۰+</div>
          <div className="opacity-90">سال تجربه موفق</div>
        </div>
        <div className="text-center p-4">
          <div className="text-4xl md:text-5xl font-bold mb-2">۵,۰۰۰+</div>
          <div className="opacity-90">مشتری راضی</div>
        </div>
        <div className="text-center p-4">
          <div className="text-4xl md:text-5xl font-bold mb-2">400۰۰+</div>
          <div className="opacity-90">محصول متنوع</div>
        </div>
        <div className="text-center p-4">
          <div className="text-4xl md:text-5xl font-bold mb-2">۹۸%</div>
          <div className="opacity-90">رضایت مشتریان</div>
        </div>
      </div>
    </section>
  );
}
