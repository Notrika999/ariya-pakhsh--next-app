// app/user-profile/orders/[id]/page.jsx

import React, { Suspense } from "react";
import OrderDetails from "@/components/ui/UserProfile/Orders/OrderDetails";
import { OrderDetailsSkeleton } from "@/components/ui/UserProfile/skeletons/UserProfileSkeletons";

function OrderDetailsPage() {
  return (
    <Suspense fallback={<OrderDetailsSkeleton />}>
      <OrderDetails />
    </Suspense>
  );
}

export default OrderDetailsPage;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};