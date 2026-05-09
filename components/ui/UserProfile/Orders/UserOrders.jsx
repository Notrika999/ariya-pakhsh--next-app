import Image from "next/image";
import React from "react";
import SidebarResponsive from "../SidebarResponsive";
import UserSidebar from "../UserSidebar";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import UserOrdersTop from "./UserOrdersTop";
import UserOrdersFilter from "./UserOrdersFilter";
import UserOrdersList from "./UserOrdersList";

export default function UserOrders() {
  return (
    <div className="lg:col-span-3 space-y-8">
      {/* <!--Dashboard header--> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <UserOrdersTop />
      </div>

      {/* <!--Order Filter and Search--> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <UserOrdersFilter />
      </div>

      {/* <!--Orders List--> */}
      <UserOrdersList />
    </div>
  );
}
