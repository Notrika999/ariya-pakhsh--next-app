import Cart from "@/components/ui/Cart/Cart";
import React from "react";

function CartPage() {
  return <Cart />;
}

export default CartPage;

// NOINDEX
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
