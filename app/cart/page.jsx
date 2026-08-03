// app/cart/page.jsx
import Cart from "@/components/ui/Cart/Cart";

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
