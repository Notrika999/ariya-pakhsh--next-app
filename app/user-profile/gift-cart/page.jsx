// app/user-profile/gift-cart/page.jsx
import GiftCart from "@/components/ui/UserProfile/GiftCart/GiftCart";
import React from "react";

function GiftCartPage() {
  return <GiftCart />;
}

export default GiftCartPage;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};