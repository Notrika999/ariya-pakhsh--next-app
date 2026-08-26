import Link from "next/link";
import React from "react";

function formatNumber(value) {
  return new Intl.NumberFormat("fa-IR").format(Number(value) || 0);
}

function formatMoney(value) {
  return `${formatNumber(Math.max(0, Math.round(Number(value) || 0)))} تومان`;
}

function StatCard({
  title,
  value,
  iconClass,
  iconWrapperClass,
  href,
  loading,
}) {
  return (
    <div className=" rounded-xl bg-white p-2 drop-shadow-lg dark:bg-custom-dark  md:rounded-2xl md:pb-2">
      <div className="w-full flex items-center justify-start gap-2">
        <div
          className={[
            "mb-2 size-6 absolute left-1.5 top-1.5 rounded-full md:size-6 flex items-center justify-center",
            iconWrapperClass,
          ].join(" ")}
        >
          <i className={`${iconClass} text-sm`}></i>
        </div>
        <div className="mb-3">
          <div>
            <p className="text-right text-xs font-semibold text-gray-600 dark:text-gray-400 md:text-sm">
              {title}
            </p>
            <p className="mt-2 text-left text-sm font-bold text-gray-800 dark:text-gray-200 ">
              {loading ? "..." : value}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 md:justify-end">
        {href ? (
          <Link
            href={href}
            className="block text-xs text-left font-semibold text-primary hover:text-primary/80 dark:text-primary-dark dark:hover:text-primary/70"
          >
            مشاهده همه
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default function StatisticsAndFigures({ dashboard, loading = false }) {
  const orders = dashboard?.orders ?? {};
  const wallet = dashboard?.wallet ?? {};
  const favorites = dashboard?.favorites ?? {};
  const loyalty = dashboard?.loyalty ?? {};

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      <StatCard
        title="سفارشات فعال"
        value={formatNumber(orders.activeCount)}
        href="/user-profile/orders"
        loading={loading}
        iconWrapperClass="bg-blue-100 dark:bg-blue-900"
        iconClass="fa-solid fa-bag-shopping text-blue-600 dark:text-blue-400"
      />

      <StatCard
        title="موجودی کیف پول"
        value={formatMoney(wallet.balance)}
        href="/user-profile/credit-history"
        loading={loading}
        iconWrapperClass="bg-green-100 dark:bg-green-900"
        iconClass="fa-solid fa-circle-dollar-to-slot text-green-600 dark:text-green-400"
      />

      <StatCard
        title="تعداد علاقه‌مندی‌ها"
        value={formatNumber(favorites.count)}
        href="/user-profile/favorites"
        loading={loading}
        iconWrapperClass="bg-red-100 dark:bg-red-900"
        iconClass="fa-regular fa-heart text-red-600 dark:text-red-400"
      />

      <StatCard
        title="امتیاز وفاداری"
        value={formatNumber(loyalty.totalPoints)}
        href="/user-profile/discount-points"
        loading={loading}
        iconWrapperClass="bg-purple-100 dark:bg-purple-900"
        iconClass="fa-regular fa-star text-purple-600 dark:text-purple-400"
      />
    </div>
  );
}
