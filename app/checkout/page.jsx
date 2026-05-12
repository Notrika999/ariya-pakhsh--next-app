import Checkout from "@/components/ui/Checkout/Checkout";
import React from "react";

function CheckoutPage() {
  return <Checkout />
}

export default CheckoutPage;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};