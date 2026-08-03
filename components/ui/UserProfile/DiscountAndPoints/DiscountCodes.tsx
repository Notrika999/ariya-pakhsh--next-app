// components/ui/UserProfile/DiscountAndPoints/DiscountCodes.tsx
import DiscountCard from "@/components/modules/DiscountCard/DiscountCard";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import type { DiscountCode } from "@/src/lib/types/userpanel/Discount";
import type {
  MyCouponItem,
  MyCouponsPage,
  MyCouponStatus,
} from "@/src/lib/types/userpanel/coupon";

type CouponPageKey = MyCouponStatus;

interface DiscountCodesProps {
  pages: Record<CouponPageKey, MyCouponsPage>;
  loading: boolean;
  error: string;
  pageSize: number;
  onPrevious: (key: CouponPageKey) => void;
  onNext: (key: CouponPageKey) => void;
}

const SECTION_CONFIG: Array<{
  key: CouponPageKey;
  title: string;
  emptyText: string;
}> = [
  {
    key: "active",
    title: "کدهای تخفیف فعال",
    emptyText: "کد تخفیف فعالی ندارید.",
  },
  {
    key: "used",
    title: "کدهای تخفیف استفاده‌شده",
    emptyText: "کد تخفیف استفاده‌شده‌ای ندارید.",
  },
  {
    key: "expired",
    title: "کدهای تخفیف منقضی شده",
    emptyText: "کد تخفیف منقضی‌شده‌ای ندارید.",
  },
];

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getCouponDisplayDate(coupon: MyCouponItem, status: CouponPageKey) {
  return status === "used" ? coupon.usedAt : coupon.validTo;
}

function getCouponVariant(discountType: string): DiscountCode["variant"] {
  switch (discountType.trim().toLowerCase()) {
    case "freeshipping":
      return "purple";
    case "percentage":
      return "blue";
    case "fixedamount":
      return "green";
    case "fixedshippingamount":
      return "teal";
    default:
      return "green";
  }
}

function discountLabel(coupon: MyCouponItem) {
  const numberFormatter = new Intl.NumberFormat("fa-IR");
  const discountType = coupon.discountType.trim().toLowerCase();

  if (discountType === "percentage" || discountType.includes("percent")) {
    return `${numberFormatter.format(coupon.discountValue)}٪ تخفیف`;
  }

  if (coupon.discountValue > 0) {
    return `${numberFormatter.format(coupon.discountValue)} تومان تخفیف`;
  }

  return coupon.description;
}

function mapCouponToDiscountCode(
  coupon: MyCouponItem,
  status: CouponPageKey,
): DiscountCode {
  const detailParts = [
    coupon.description,
    discountLabel(coupon),
    coupon.minPurchaseAmount > 0
      ? `حداقل خرید ${new Intl.NumberFormat("fa-IR").format(
          coupon.minPurchaseAmount,
        )} تومان`
      : "",
  ].filter(Boolean);

  return {
    id: coupon.couponCodeId || coupon.couponId || coupon.code,
    code: coupon.code,
    title: coupon.name || "کد تخفیف",
    description: detailParts.join(" - "),
    expireDate: formatDate(getCouponDisplayDate(coupon, status)),
    status,
    variant: getCouponVariant(coupon.discountType),
  };
}

function pageStart(page: MyCouponsPage, pageSize: number) {
  if (page.totalCount <= 0) return 0;
  return (Math.max(page.pageNumber, 1) - 1) * pageSize + 1;
}

function pageEnd(page: MyCouponsPage, pageSize: number) {
  if (page.totalCount <= 0) return 0;
  return Math.min(pageStart(page, pageSize) + pageSize - 1, page.totalCount);
}

function CouponSection({
  config,
  page,
  pageSize,
  onPrevious,
  onNext,
}: {
  config: (typeof SECTION_CONFIG)[number];
  page: MyCouponsPage;
  pageSize: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const numberFormatter = new Intl.NumberFormat("fa-IR");
  const safePageSize = Math.max(pageSize, 1);
  const currentPage = Math.max(page.pageNumber, 1);
  const computedTotalPages = Math.max(
    page.totalPages,
    Math.ceil(page.totalCount / safePageSize),
    1,
  );
  const canPrevious = page.hasPreviousPage || currentPage > 1;
  const canNext = page.hasNextPage || currentPage < computedTotalPages;
  const visibleItems = page.items.slice(0, safePageSize);
  const shouldShowPagination = computedTotalPages > 1 || canPrevious || canNext;

  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <TitleAfter title={config.title} tag={false} />

      {visibleItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleItems.map((item) => (
            <DiscountCard
              key={item.couponCodeId || item.couponId || item.code}
              data={mapCouponToDiscountCode(item, config.key)}
            />
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {config.emptyText}
        </p>
      )}

      {shouldShowPagination ? (
        <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            نمایش {numberFormatter.format(pageStart(page, safePageSize))} تا{" "}
            {numberFormatter.format(pageEnd(page, safePageSize))} از{" "}
            {numberFormatter.format(page.totalCount)} کد
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrevious}
              disabled={!canPrevious}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white"
            >
              <i className="far fa-angle-right me-1" />
              قبلی
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!canNext}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white"
            >
              بعدی
              <i className="far fa-angle-left ms-1" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function DiscountCodes({
  pages,
  loading,
  error,
  pageSize,
  onPrevious,
  onNext,
}: DiscountCodesProps) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 drop-shadow-lg dark:bg-custom-dark dark:text-gray-400">
        در حال دریافت کدهای تخفیف...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-sm text-red-500 drop-shadow-lg dark:bg-custom-dark">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {SECTION_CONFIG.map((config) => (
        <CouponSection
          key={config.key}
          config={config}
          page={pages[config.key]}
          pageSize={pageSize}
          onPrevious={() => onPrevious(config.key)}
          onNext={() => onNext(config.key)}
        />
      ))}
    </div>
  );
}
