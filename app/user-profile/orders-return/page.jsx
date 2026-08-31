// app/user-profile/orders-return/page.jsx
import React, { Suspense } from "react";
import OrdersReturn from "@/components/ui/UserProfile/OrdersReturn/OrdersReturn";
import { OrdersReturnPageSkeleton } from "@/components/ui/UserProfile/skeletons/UserProfileSkeletons";

function OrdersReturnFallback() {
  return <OrdersReturnPageSkeleton />;
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
