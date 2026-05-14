import React, { useState } from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";
import TicketFilters from "./TicketFilters";
import TicketStatCard from "../../../modules/TicketStatCard/TicketStatCard";
import CreateTicketModal from "../../../modules/CreateTicketModal/CreateTicketModal";

export default function TicketList({
  tickets,
  onView,
  filters,
  onFilterChange,
}) {
  const [showModal, setShowModal] = useState(false);

  const total = tickets.length;

  const open = tickets.filter((t) => t.status.key === "open").length;
  const pending = tickets.filter((t) => t.status.key === "pending").length;
  const closed = tickets.filter((t) => t.status.key === "closed").length;
  return (
    <div className="lg:col-span-3 space-y-8">
      {/* <!--Dashboard header with create ticket button--> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4 ">
            <div>
              <TitleAfter title={"تیکت‌های پشتیبانی"} />
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                مدیریت و پیگیری تیکت‌های پشتیبانی
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 text-sm font-medium flex items-center justify-center"
            >
              <i className="far fa-plus me-2"></i>
              ایجاد تیکت جدید
            </button>
          </div>
        </div>
      </div>

      {/* <!--Statistics Cards--> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TicketStatCard
          title="کل تیکت‌ها"
          count={total}
          bg="bg-blue-100 dark:bg-blue-900"
          icon={
            <i className="far fa-file-lines text-blue-600 dark:text-blue-400 text-xl"></i>
          }
        />

        <TicketStatCard
          title="تیکت‌های باز"
          count={open}
          bg="bg-orange-100 dark:bg-orange-900"
          icon={
            <i className="far fa-exclamation-triangle text-orange-600 dark:text-orange-400 text-xl"></i>
          }
        />

        <TicketStatCard
          title="در حال بررسی"
          count={pending}
          bg="bg-yellow-100 dark:bg-yellow-900"
          icon={
            <i className="far fa-clock text-yellow-600 dark:text-yellow-400 text-xl"></i>
          }
        />

        <TicketStatCard
          title="بسته شده"
          count={closed}
          bg="bg-green-100 dark:bg-green-900"
          icon={
            <i className="far fa-clock text-green-600 dark:text-green-400 text-xl"></i>
          }
        />
      </div>

      {/* <!--Filters and Search--> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TicketFilters filters={filters} onFilterChange={onFilterChange} />
      </div>

      {/* <!--Tickets List--> */}
      <div className="bg-white rounded-3xl shadow-xl p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-xl with-highlight dark:text-gray-200">
            تیکت‌های اخیر
          </h2>
          <a
            href="#"
            className="text-xs font-medium bg-primary text-white py-1.5 px-4 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
          >
            مشاهده همه
          </a>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm text-right">
            <thead className="text-xs bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 sticky top-0">
              <tr>
                <th className="px-5 py-4">شماره تیکت</th>
                <th className="px-5 py-4">موضوع</th>
                <th className="px-5 py-4">دپارتمان</th>
                <th className="px-5 py-4">اولویت</th>
                <th className="px-5 py-4">وضعیت</th>
                <th className="px-5 py-4">آخرین بروزرسانی</th>
                <th className="px-5 py-4">عملیات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {tickets.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                    #{item.id}
                  </td>

                  <td className="px-5 py-4">{item.title}</td>

                  <td className="px-5 py-4">{item.department}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs text-nowrap font-semibold ${item.priority.color}`}
                    >
                      {item.priority.label}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs text-nowrap font-semibold ${item.status.color}`}
                    >
                      {item.status.label}
                    </span>
                  </td>

                  <td className="px-5 py-4">{item.lastUpdate}</td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => onView(item.id)}
                      className="text-xs font-medium bg-primary text-white py-1.5 px-4 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
                    >
                      مشاهده
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tickets.length === 0 && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              تیکتی با این فیلترها پیدا نشد.
            </div>
          )}
        </div>
      </div>

      <CreateTicketModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => {
          console.log("ticket payload:", data);
          setShowModal(false); // بستن مودال
        }}
      />
    </div>
  );
}
