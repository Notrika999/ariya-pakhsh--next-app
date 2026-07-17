import React, { Suspense } from "react";
import OrdersReturn from "@/components/ui/UserProfile/OrdersReturn/OrdersReturn";

function OrdersReturnFallback() {
  return (
    <div className="space-y-8 lg:col-span-3">
      <div className="h-28 animate-pulse rounded-2xl bg-gray-100 dark:bg-zinc-800" />
      <div className="h-96 animate-pulse rounded-2xl bg-gray-100 dark:bg-zinc-800" />
    </div>
  );
}

function OrdersReturnPage() {
  return (
    <Suspense fallback={<OrdersReturnFallback />}>
      <OrdersReturn />
    </Suspense>
  );
}

export default OrdersReturnPage;

// NOINDEX
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
