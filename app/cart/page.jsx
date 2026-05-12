import Cart from "@/components/ui/Cart/Cart";
import CartEmpty from "@/components/ui/Cart/CartEmpty";
import React from "react";

function CartPage() {
  return (
    <>
      <Cart />
      <CartEmpty />
    </>
  );
}

export default CartPage;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
