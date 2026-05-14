"use client";

import React, { useMemo, useState } from "react";
import CreditHistoryTop from "./CreditHistoryTop";
import CreditHistorySummary from "./CreditHistorySummary";
import FilterBar from "../../../modules/FilterBar/FilterBar";
import TransactionCard from "../../../modules/Transactions/TransactionCard";
//
const transactions = [
  {
    id: 1,
    type: "income",
    icon: "fa-check-circle",
    title: "واریز اعتبار",
    transactionId: "TRX-7842",
    amount: 100000,
    date: "1402/10/15",
    time: "03:30",
    status: "success",
  },
  {
    id: 2,
    type: "expense",
    icon: "fa-arrow-down",
    title: "خرید از فروشگاه",
    transactionId: "TRX-7839",
    orderId: "ORD-7839",
    amount: 85000,
    date: "1402/10/12",
    time: "03:30",
    status: "success",
  },
  {
    id: 3,
    type: "income",
    icon: "fa-star",
    title: "پاداش ثبت نظر",
    transactionId: "TRX-7838",
    amount: 50000,
    date: "1402/10/09",
    time: "03:30",
    status: "success",
  },
  {
    id: 4,
    type: "expense",
    icon: "fa-arrow-down",
    title: "خرید از فروشگاه",
    transactionId: "TRX-7835",
    orderId: "ORD-7835",
    amount: 150000,
    date: "1402/10/07",
    time: "03:30",
    status: "success",
  },
];

export default function CreditHistory() {
  const [type, setType] = useState("all");
  const [period, setPeriod] = useState("all");
  const [search, setSearch] = useState("");

  const filteredTransactions = useMemo(() => {
    let result = transactions; // احتیاج به spread نیست

    if (type !== "all") {
      result = result.filter((item) => item.type === type);
    }

    if (search.trim() !== "") {
      result = result.filter((item) =>
        item.transactionId.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return result;
  }, [transactions, type, search]);

  return (
    <div className="lg:col-span-3 space-y-8">
      {/* <!--Dashboard header--> */}
      <CreditHistoryTop />

      {/* <!--Credit Summary Cards--> */}
      <CreditHistorySummary />

      {/* <!--Credit Filter and Search-->/ */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <FilterBar
          selects={[
            {
              key: "type",
              value: type,
              onChange: setType,
              options: [
                { value: "all", label: "همه نوع تراکنش" },
                { value: "income", label: "واریز" },
                { value: "expense", label: "برداشت" },
                { value: "refund", label: "عودت" },
                { value: "bonus", label: "پاداش" },
              ],
            },
            {
              key: "period",
              value: period,
              onChange: setPeriod,
              options: [
                { value: "all", label: "همه زمان‌ها" },
                { value: "7", label: "۷ روز گذشته" },
                { value: "30", label: "۳۰ روز گذشته" },
                { value: "90", label: "۳ ماه گذشته" },
                { value: "365", label: "یک سال گذشته" },
              ],
            },
          ]}
          search={{
            value: search,
            onChange: setSearch,
            placeholder: "جستجوی شماره تراکنش...",
          }}
        />
      </div>

      {/* <!--Transactions List--> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <h2 className="font-bold text-xl with-highlight dark:text-gray-200 mb-6">
          لیست تراکنش‌ها
        </h2>

        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((item) => {
              return <TransactionCard key={item.id} item={item} />;
            })
          ) : (
            <p>چیزی یافت نشد</p>
          )}
        </div>

        {/* <!-- Pagination --> */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p
            id="pagination-info"
            className="text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-0"
          >
            نمایش ۱ تا ۴ از ۱۲ تراکنش
          </p>
          <div className="flex items-center space-x-2 pagination-buttons">
            <button className="pagination-prev inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              قبلی
            </button>
            <button
              data-page="1"
              className="pagination-btn inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-lg hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/60"
            >
              ۱
            </button>
            <button
              data-page="2"
              className="pagination-btn inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              ۲
            </button>
            <button
              data-page="3"
              className="pagination-btn inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              ۳
            </button>
            <button className="pagination-next inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              بعدی
            </button>
          </div>
        </div>
      </div>

      {/* <!--Add Credit Section--> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <h2 className="font-bold text-xl with-highlight dark:text-gray-200 mb-6">
          افزایش اعتبار
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <!-- Quick Amounts --> */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              مبلغ سریع
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                data-amount="50000"
                className="quick-amount-btn bg-gray-100 dark:bg-zinc-800 rounded-lg py-3 text-center hover:bg-primary hover:text-white transition-colors"
              >
                ۵۰,۰۰۰ تومان
              </button>
              <button
                data-amount="100000"
                className="quick-amount-btn bg-gray-100 dark:bg-zinc-800 rounded-lg py-3 text-center hover:bg-primary hover:text-white transition-colors"
              >
                ۱۰۰,۰۰۰ تومان
              </button>
              <button
                data-amount="200000"
                className="quick-amount-btn bg-gray-100 dark:bg-zinc-800 rounded-lg py-3 text-center hover:bg-primary hover:text-white transition-colors"
              >
                ۲۰۰,۰۰۰ تومان
              </button>
            </div>
          </div>

          {/* <!-- Custom Amount --> */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              مبلغ دلخواه
            </p>
            <div className="flex space-x-3">
              <input
                id="custom-amount"
                type="number"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
                placeholder="مبلغ به تومان"
              />
              <button
                id="payment-btn"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 font-medium"
              >
                پرداخت
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
