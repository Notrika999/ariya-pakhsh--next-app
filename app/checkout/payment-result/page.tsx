import { Suspense } from "react";
import PaymentResult from "@/components/ui/Checkout/PaymentResult";

export const metadata = {
  title: "نتیجه پرداخت",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPaymentResultPage() {
  return (
    <Suspense
      fallback={
        <section className="py-5">
          <div className="container mx-auto px-4">
            <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-xl dark:border-gray-700 dark:bg-custom-dark dark:text-gray-400">
              در حال دریافت نتیجه پرداخت...
            </div>
          </div>
        </section>
      }
    >
      <PaymentResult />
    </Suspense>
  );
}
