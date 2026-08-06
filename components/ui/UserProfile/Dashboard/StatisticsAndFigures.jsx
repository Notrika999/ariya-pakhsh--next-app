import Link from "next/link";
import React from "react";

function formatNumber(value) {
  return new Intl.NumberFormat("fa-IR").format(Number(value) || 0);
}

function formatMoney(value) {
  return `${formatNumber(Math.max(0, Math.round(Number(value) || 0)))} تومان`;
}

function trendText(value) {
  const trend = Number(value) || 0;
  if (trend === 0) return "بدون تغییر نسبت به دوره قبل";

  return `${formatNumber(Math.abs(trend))}٪ ${
    trend > 0 ? "افزایش" : "کاهش"
  } نسبت به دوره قبل`;
}

function trendClass(value) {
  const trend = Number(value) || 0;
  if (trend < 0) return "text-red-600 dark:text-red-400";
  return "text-green-600 dark:text-green-400";
}

function StatCard({
  title,
  value,
  iconClass,
  iconWrapperClass,
  footer,
  href,
  loading,
}) {
  return (
    <div className=" bg-white rounded-2xl drop-shadow-lg px-3 pb-6 pt-3 dark:bg-custom-dark">
        <div
          className={[
            "w-12 h-12 rounded-full flex items-center justify-center mb-2",
            iconWrapperClass,
          ].join(" ")}
        >
          <i className={iconClass}></i>
        </div>
      <div className="flex items-center justify-center ">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          <p className="text-lg text-center text-nowrap font-semibold text-gray-800 dark:text-gray-200 mt-1">
            {loading ? "..." : value}
          </p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center gap-3">
        {/* <span className="text-xs text-gray-500 dark:text-gray-400">
          {loading ? "در حال دریافت..." : footer}
        </span> */}
        {href ? (
          <Link
            href={href}
            className="text-xs text-nowrap text-primary hover:text-primary/80 dark:text-primary-dark dark:hover:text-primary/70"
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
  const tierProgress = loyalty?.tierProgress ?? {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="سفارشات فعال"
        value={formatNumber(orders.activeCount)}
        footer={`${formatNumber(orders.shippingCount)} سفارش در حال ارسال`}
        href="/user-profile/orders"
        loading={loading}
        iconWrapperClass="bg-blue-100 dark:bg-blue-900"
        iconClass="fa-solid fa-bag-shopping text-blue-600 dark:text-blue-400"
      />

      <StatCard
        title="موجودی کیف پول"
        value={formatMoney(wallet.balance)}
        footer={
          <span className={trendClass(wallet.trendPercent)}>
            <i className="fa-solid fa-arrow-trend-up me-1"></i>
            {trendText(wallet.trendPercent)}
          </span>
        }
        href="/user-profile/credit-history"
        loading={loading}
        iconWrapperClass="bg-green-100 dark:bg-green-900"
        iconClass="fa-solid fa-circle-dollar-to-slot text-green-600 dark:text-green-400"
      />

      <StatCard
        title="تعداد علاقه‌مندی‌ها"
        value={formatNumber(favorites.count)}
        footer={
          <span className={trendClass(favorites.trendPercent)}>
            <i className="fa-solid fa-arrow-trend-up me-1"></i>
            {trendText(favorites.trendPercent)}
          </span>
        }
        href="/user-profile/favorites"
        loading={loading}
        iconWrapperClass="bg-red-100 dark:bg-red-900"
        iconClass="fa-regular fa-heart text-red-600 dark:text-red-400"
      />

      <StatCard
        title="امتیاز وفاداری"
        value={formatNumber(loyalty.totalPoints)}
        footer={
          tierProgress.nextTierName
            ? `${formatNumber(tierProgress.pointsToNextTier)} امتیاز تا سطح ${tierProgress.nextTierName}`
            : `امتیاز قابل استفاده: ${formatNumber(loyalty.usablePoints)}`
        }
        href="/user-profile/discount-points"
        loading={loading}
        iconWrapperClass="bg-purple-100 dark:bg-purple-900"
        iconClass="fa-regular fa-star text-purple-600 dark:text-purple-400"
      />
    </div>
  );
}
