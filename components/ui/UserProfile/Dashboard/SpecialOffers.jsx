import Link from "next/link";
import React from "react";
import UserProfileEmptyState from "../UserProfileEmptyState";

const BADGE_COLORS = {
  blue: "from-blue-400 to-blue-600",
  green: "from-green-400 to-green-600",
  purple: "from-purple-400 to-purple-600",
  red: "from-red-400 to-red-600",
  orange: "from-orange-400 to-orange-600",
  yellow: "from-yellow-400 to-yellow-600",
};

function getBadgeColor(colorKey = "") {
  const key = String(colorKey).toLowerCase();
  return BADGE_COLORS[key] ?? BADGE_COLORS.blue;
}

function getOfferHref(offer) {
  const payload = String(offer?.ctaPayload ?? "").trim();
  if (payload.startsWith("/")) return payload;
  if (offer?.sourceType === "product" && offer?.sourceId) {
    return `/product/${offer.sourceId}`;
  }
  return "";
}

function OffersSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`offer-skeleton-${index}`}
          className="h-24 animate-pulse rounded-lg bg-gray-100 dark:bg-zinc-800"
        />
      ))}
    </div>
  );
}

export default function SpecialOffers({ offers = [], loading = false }) {
  if (loading) return <OffersSkeleton />;

  if (offers.length === 0) {
    return (
      <UserProfileEmptyState
        title="پیشنهاد فعالی وجود ندارد"
        description="پیشنهادهای اختصاصی بعد از فعال شدن کمپین‌ها در این بخش نمایش داده می‌شود."
      />
    );
  }

  return (
    <div className="space-y-4">
      {offers.map((offer) => {
        const href = getOfferHref(offer);
        const ctaLabel = offer.ctaLabel || "مشاهده";
        const content = (
          <span className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
            {ctaLabel}
          </span>
        );

        return (
          <div
            key={offer.offerId || `${offer.title}-${offer.priority}`}
            className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div
              className={[
                "w-16 h-16 bg-gradient-to-r rounded-lg flex items-center justify-center flex-shrink-0",
                getBadgeColor(offer.badgeColorKey),
              ].join(" ")}
            >
              <span className="text-white font-bold text-xs text-center">
                {offer.typeBadge || "پیشنهاد"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {offer.title || offer.discountSummary || "پیشنهاد ویژه"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {offer.description || offer.discountSummary || offer.couponCode}
              </p>
              {offer.couponCode ? (
                <p className="mt-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  کد: {offer.couponCode}
                </p>
              ) : null}
            </div>
            {href ? (
              <Link href={href}>{content}</Link>
            ) : (
              <button type="button">{content}</button>
            )}
          </div>
        );
      })}
    </div>
  );
}
