// components/ui/UserProfile/UserProfile.jsx
import React from "react";
import Link from "next/link";
import DashboardHeader from "./Dashboard/DashboardHeader";
import StatisticsAndFigures from "./Dashboard/StatisticsAndFigures";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import RecentOrders from "./Dashboard/RecentOrders";
import RecentActivities from "./Dashboard/RecentActivities";
import SpecialOffers from "./Dashboard/SpecialOffers";
import SidebarResponsive from "./SidebarResponsive";
import {
  createEmptyDashboard,
  getDashboardErrorMessage,
  getMyDashboard,
} from "@/src/services/dashboard/dashboard.server";

const DASHBOARD_PARAMS = {
  recentOrdersTake: 5,
  offersTake: 5,
  activitiesTake: 4,
};

async function loadDashboard() {
  try {
    return {
      dashboard: await getMyDashboard(DASHBOARD_PARAMS),
      error: "",
    };
  } catch (error) {
    return {
      dashboard: createEmptyDashboard(),
      error: getDashboardErrorMessage(error),
    };
  }
}

export default async function UserProfile() {
  const { dashboard, error } = await loadDashboard();

  return (
    <div className="lg:col-span-3 space-y-4">
      <DashboardHeader
        displayName={dashboard.displayName}
        wallet={dashboard.wallet}
        loading={false}
      />

      {/* {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null} */}

      <StatisticsAndFigures dashboard={dashboard} loading={false} />

      <SidebarResponsive />

      <div className="bg-white rounded-3xl shadow-xl px-3 py-2 dark:bg-custom-dark dark:border dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <TitleAfter title="سفارشات اخیر" />
          <Link
            href="/user-profile/orders"
            className="text-xs font-medium bg-primary text-white py-1.5 px-4 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
          >
            مشاهده همه
          </Link>
        </div>

        <RecentOrders orders={dashboard.recentOrders} loading={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className=" bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
          <TitleAfter title="فعالیت‌های اخیر" />
          <RecentActivities
            activities={dashboard.recentActivities}
            loading={false}
          />
        </div>

        <div className=" bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
          <TitleAfter title="پیشنهادات ویژه برای شما" />
          <SpecialOffers offers={dashboard.specialOffers} loading={false} />
        </div>
      </div>
    </div>
  );
}
