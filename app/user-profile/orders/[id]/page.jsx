// app/user-profile/orders/[id]/page.jsx

import React from "react";
import OrderDetails from "@/components/ui/UserProfile/Orders/OrderDetails";

function OrderDetailsPage() {
  return <OrderDetails />;
}

export default OrderDetailsPage;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};