import React from "react";
import DiscountAndPoints from "@/components/ui/UserProfile/DiscountAndPoints/DiscountAndPoints";

function DiscountAndPointsPage() {
  return <DiscountAndPoints />;
}

export default DiscountAndPointsPage;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};