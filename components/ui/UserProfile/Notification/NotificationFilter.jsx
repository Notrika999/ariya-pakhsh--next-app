import React from "react";
import CustomSelect from "@/components/modules/UserProfile/CustomSelect";

const STATUS_OPTIONS = [
  { value: "", label: "همه وضعیت‌ها" },
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "unread", label: "خوانده نشده" },
  { value: "read", label: "خوانده شده" },
];

const TYPE_OPTIONS = [
  { value: "", label: "همه نوع اعلان" },
  { value: "system", label: "سیستمی" },
  { value: "promotion", label: "تخفیف و پیشنهاد" },
  { value: "update", label: "بروزرسانی" },
  { value: "security", label: "امنیتی" },
];

export default function NotificationFilter({
  typeFilter,
  statusFilter,
  onTypeChange,
  onStatusChange,
  onMarkAllRead,
  onClearAll,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Filter by Type */}
        <CustomSelect
          className="sm:w-44"
          options={TYPE_OPTIONS}
          value={typeFilter}
          onChange={(val) => onTypeChange(val)}
        />

        <CustomSelect
          className="sm:w-44"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(val) => onStatusChange(val)}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMarkAllRead}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition duration-200 text-sm font-medium flex items-center"
        >
          <i className="far fa-check me-2"></i>
          همه خوانده شد
        </button>

        <button
          onClick={onClearAll}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium flex items-center"
        >
          <i className="far fa-trash-can me-2"></i>
          پاک کردن همه
        </button>
      </div>
    </div>
  );
}
