// components/ui/UserProfile/UserProfile.jsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import SidebarResponsive from "./SidebarResponsive";
import UserSidebar from "./UserSidebar";
import DashboardHeader from "./Dashboard/DashboardHeader";
import StatisticsAndFigures from "./Dashboard/StatisticsAndFigures";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import RecentOrders from "./Dashboard/RecentOrders";
import RecentActivities from "./Dashboard/RecentActivities";
import SpecialOffers from "./Dashboard/SpecialOffers";

export default function UserProfile() {
  return (
    <>
      <div className="lg:col-span-3 space-y-8">
        {/* <!--Dashboard header--> */}
        <DashboardHeader />

        {/* <!--Statistics and figures--> */}
        <StatisticsAndFigures />

        {/* <!--Recent orders--> */}
        <div className="bg-white rounded-3xl shadow-xl p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <TitleAfter title={"سفارشات اخیر"} />
            <Link
              href="#"
              className="text-xs font-medium bg-primary text-white py-1.5 px-4 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
            >
              مشاهده همه
            </Link>
          </div>

          <RecentOrders />
        </div>

        {/* <!--Recent activities and special offers--> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* <!--Recent activities--> */}
          <div className=" bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
            <TitleAfter title={"فعالیت‌های اخیر"} />

            <RecentActivities />
          </div>

          {/* <!--Special offers--> */}
          <div className=" bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
            <TitleAfter title={"پیشنهادات ویژه برای شما"} />

            <SpecialOffers />
          </div>
        </div>
      </div>
    </>
  );
}
