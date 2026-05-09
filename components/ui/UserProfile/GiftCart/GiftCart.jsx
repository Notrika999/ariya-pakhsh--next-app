"use client";

import React, { useState } from "react";
import SidebarResponsive from "../SidebarResponsive";
import UserSidebar from "../UserSidebar";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import GiftCartTop from "./GiftCartTop";
import TabsSection from "../../../modules/TabsSection/TabsSection";
import MyGiftCards from "./MyGiftCards";
import BuyGiftCard from "./BuyGiftCard";

export default function GiftCart() {
  const [activeTab, setActiveTab] = useState("my-gift-cards");
const fakeCards = [
  {
    id: 1,
    type: "active",
    title: "کارت هدیه طلایی",
    amount: "۵۰۰,۰۰۰",
    code: "GC-7842-1596-3247",
    date: "۱۴۰۲/۱۲/۱۵",
  },
  {
    id: 2,
    type: "active",
    title: "کارت هدیه نقره‌ای",
    amount: "۲۵۰,۰۰۰",
    code: "GC-9512-7534-8612",
    date: "۱۴۰۲/۱۱/۳۰",
  },
  {
    id: 3,
    type: "used",
    title: "کارت هدیه برنزی",
    amount: "۱۰۰,۰۰۰",
    code: "GC-1234-5678-9012",
    date: "۱۴۰۲/۱۰/۱۵",
  },
  {
    id: 4,
    type: "expired",
    title: "کارت هدیه ویژه",
    amount: "۱۵۰,۰۰۰",
    code: "GC-4567-8901-2345",
    date: "۱۴۰۲/۰۹/۲۰",
  },
];
  return (
    <div className="lg:col-span-3 space-y-8">
      {/* <!-- Dashboard header --> */}
      <GiftCartTop />

      {/* <!-- Tabs Navigation --> */}
      <TabsSection
        defaultTab="my-gift-cards"
        onChange={setActiveTab}
        tabs={[
          {
            key: "my-gift-cards",
            label: "کارت‌های هدیه من",
            iconClass: "fa-solid fa-gift", // 🎁 آیکن هدیه
          },
          {
            key: "buy-gift-card",
            label: "خرید کارت هدیه",
            iconClass: "fa-solid fa-cart-shopping", // 🛒 آیکن خرید
          },
        ]}
      />

      {/* <!-- My Gift Cards Tab Content --> */}
      {activeTab === "my-gift-cards" && <MyGiftCards data={fakeCards} />}
      {/* <!-- Buy Gift Card Tab Content --> */}
      {activeTab === "buy-gift-card" && <BuyGiftCard />}
    </div>
  );
}
