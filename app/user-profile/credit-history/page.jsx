import CreditHistory from "@/components/ui/UserProfile/CreditHistory/CreditHistory";
import React from "react";

function CreditHistoryPage() {
  return <CreditHistory />;
}

export default CreditHistoryPage;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};