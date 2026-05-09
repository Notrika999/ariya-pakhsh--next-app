"use client";

import React, { useState } from "react";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import DiscountAndPointsTop from "./DiscountAndPointsTop";
import TabsSection from "../../../modules/TabsSection/TabsSection";
import DiscountCodes from "./DiscountCodes";
import PointsTab from "./PointsTab";

const fakeDiscounts = [
  {
    id: 1,
    code: "WELCOME20",
    title: "تخفیف ویژه",
    description: "۲۰٪ تخفیف روی تمام خریدها",
    expireDate: "۱۴۰۲/۱۲/۱۵",
    status: "active",
    variant: "green",
  },
  {
    id: 2,
    code: "SUMMER35",
    title: "تخفیف فصل",
    description: "۳۵٪ تخفیف روی خریدهای بالای ۵۰۰ هزار تومان",
    expireDate: "۱۴۰۲/۱۱/۳۰",
    status: "active",
    variant: "blue",
  },
  {
    id: 3,
    code: "FREESHIP",
    title: "ارسال رایگان",
    description: "ارسال رایگان برای تمام سفارشات",
    expireDate: "۱۴۰۲/۱۲/۰۵",
    status: "active",
    variant: "purple",
  },
  {
    id: 4,
    code: "NEWYEAR25",
    title: "تخفیف نوروزی",
    description: "۲۵٪ تخفیف روی تمام خریدها",
    expireDate: "۱۴۰۲/۰۱/۱۵",
    status: "expired",
  },
];

export default function DiscountAndPoints() {
  const [activeTab, setActiveTab] = useState("discount-code");
  return (
    <div className="lg:col-span-3 space-y-8">
      {/* <!-- Dashboard header --> */}
      <DiscountAndPointsTop />

      {/* <!-- Tabs Navigation --> */}
      <TabsSection
        defaultTab="discount-code"
        onChange={setActiveTab}
        tabs={[
          {
            key: "discount-code",
            label: "کدهای تخفیف",
            iconClass: "fa-solid fa-ticket", // 🎁 آیکن هدیه
          },
          {
            key: "my-score",
            label: "امتیازات من",
            iconClass: "fa-solid fa-arrow-trend-up", // 🛒 آیکن خرید
          },
        ]}
      />

      {/* <!-- Discount Codes Tab Content --> */}
      {activeTab === "discount-code" && <DiscountCodes data={fakeDiscounts} />}

      {/* <!-- Points Tab Content --> */}
      {activeTab === "my-score" && <PointsTab />}
    </div>
  );
}
