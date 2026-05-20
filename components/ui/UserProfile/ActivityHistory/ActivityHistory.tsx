"use client";

import React, { useState } from "react";
import ActivityHistoryTop from "./ActivityHistoryTop";
import ActivityHistoryRecentViews from "./ActivityHistoryRecentViews";
import ActivityHistoryRecentActivities from "./ActivityHistoryRecentActivities";
import TabsNavigation from "../../../modules/TabsNavigation/TabsNavigation";

import {
  RecentViewItem,
  TabItem,
} from "@/src/lib/types/userpanel/activity-history";

export default function ActivityHistory() {
  const [activeTab, setActiveTab] = useState<string>("recent-views");

  const tabs: TabItem[] = [
    { id: "recent-views", title: "آخرین بازدیدها", icon: "fa-regular fa-eye" },
    {
      id: "recent-activities",
      title: "فعالیت‌های اخیر",
      icon: "fa-regular fa-clock",
    },
  ];

  const recentViews: RecentViewItem[] = [
    {
      id: 1,
      imgSrc: "/images/product/television-2.png",
      title: "گوشی موبایل سامسونگ گلکسی A73",
      productCode: "کد: PRD-001",
      date: "today",
      price: "۱۱۰۰۰۰۰",
    },
    {
      id: 2,
      imgSrc: "/images/product/wach-1.png",
      title: "قاب محافظ گوشی سامسونگ گلکسی A73",
      productCode: "کد: PRD-002",
      date: "today",
      price: "۱۱۰۰۰۰۰",
    },
    {
      id: 3,
      imgSrc: "/images/product/television-2.png",
      title: "گوشی موبایل سامسونگ گلکسی A73",
      productCode: "کد: PRD-001",
      date: "yesterday",
      price: "۱۱۰۰۰۰۰",
    },
  ];

  return (
    <div className="lg:col-span-3 space-y-8">
      {/* <!-- Dashboard header --> */}
      <ActivityHistoryTop />

      {/* <!-- Tabs Navigation --> */}
      <TabsNavigation
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* <!-- Recent Views Tab Content --> */}
      {activeTab === "recent-views" && (
        <ActivityHistoryRecentViews recentViews={recentViews} />
      )}

      {/* <!-- Recent Activities Tab Content --> */}
      {activeTab === "recent-activities" && <ActivityHistoryRecentActivities />}
    </div>
  );
}
