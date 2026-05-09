"use client";

import { useState } from "react";
import SidebarResponsive from "../SidebarResponsive";
import UserSidebar from "../UserSidebar";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import TicketMessage from "./TicketMessage";
import TicketList from "./TicketList";

export default function Tickets() {
  const [tickets] = useState([
    {
      id: "TKT-4587",
      title: "مشکل در پرداخت آنلاین",
      department: "technical",
      departmentLabel: "فنی",
      priority: {
        key: "high",
        label: "بالا",
        color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
      },
      status: {
        key: "pending",
        label: "در حال بررسی",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
      },
      lastUpdate: "۲ ساعت پیش",
    },
    {
      id: "TKT-4582",
      title: "سوال درباره محصول",
      department: "sales",
      departmentLabel: "فروش",
      priority: {
        key: "medium",
        label: "متوسط",
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
      },
      status: {
        key: "answered",
        label: "پاسخ داده شده",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
      },
      lastUpdate: "۱ روز پیش",
    },
    {
      id: "TKT-4576",
      title: "درخواست بازگشت کالا",
      department: "general",
      departmentLabel: "پشتیبانی",
      priority: {
        key: "low",
        label: "پایین",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
      },
      status: {
        key: "closed",
        label: "بسته شده",
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
      },
      lastUpdate: "۳ روز پیش",
    },
  ]);

  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    department: "",
    search: "",
  });

  const handleViewTicket = (id) => {
    setSelectedTicketId(id);
  };

  const handleBack = () => {
    setSelectedTicketId(null);
  };

  const handleFilterChange = (updatedFilter) => {
    setFilters((prev) => ({ ...prev, ...updatedFilter }));
  };

  const filteredTickets = tickets.filter((t) => {
    const statusMatch = filters.status ? t.status.key === filters.status : true;
    const priorityMatch = filters.priority
      ? t.priority.key === filters.priority
      : true;
    const departmentMatch = filters.department
      ? t.department === filters.department
      : true;
    const searchMatch = filters.search
      ? t.title.includes(filters.search) ||
        t.id.includes(filters.search) ||
        t.departmentLabel.includes(filters.search)
      : true;

    return statusMatch && priorityMatch && departmentMatch && searchMatch;
  });

  return (
    <>
      {selectedTicketId ? (
        <TicketMessage ticketId={selectedTicketId} onBack={handleBack} />
      ) : (
        <TicketList
          tickets={filteredTickets}
          onView={handleViewTicket}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}
    </>
  );
}
