// app/user-profile/orders/page.jsx

import UserOrders from "@/components/ui/UserProfile/Orders/UserOrders";
import React from "react";

function UserOrdersPage() {
  return <UserOrders />;
}

export default UserOrdersPage;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};