import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import Link from "next/link";
import React from "react";

export default function Support() {
  return (
    <div className="bg-white space-y-4 dark:bg-custom-dark border-gray-200  border dark:border-gray-700 rounded-2xl shadow-lg p-8">
      <TitleAfter title={"پشتیبانی فوری"} />

      <p className="mb-6 opacity-90">
        برای مشکلات فوری و سوالات سریع، با شماره زیر تماس بگیرید:
      </p>

      <div className="bg-primary text-white rounded-xl p-4 mb-6 shadow text-center">
        <div className="text-2xl font-black tracking-wide">
          <Link href="">90007824</Link>
        </div>
      </div>

      <p className="text-sm opacity-80">
        این خط در ساعات کاری پاسخگوی شما خواهد بود.
      </p>
    </div>
  );
}
