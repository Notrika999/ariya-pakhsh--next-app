import CheckoutPageClient from "@/components/ui/Checkout/CheckoutPageClient";
import React from "react";

function CheckoutPage() {
  return <CheckoutPageClient />;
}

export default CheckoutPage;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};