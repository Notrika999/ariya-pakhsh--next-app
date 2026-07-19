"use client";
// components/ui/Checkout/CheckoutPageClient.tsx
import { useRouter } from "next/navigation";
import Checkout from "@/components/ui/Checkout/Checkout";
import LoginModal from "@/components/modules/auth/LoginModal";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import {
  useIsAuthenticated,
  useIsAuthBootstrapping,
} from "@/src/lib/stores/auth/auth.store";

export default function CheckoutPageClient() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const isAuthBootstrapping = useIsAuthBootstrapping();
  const loginModalOpen = !isAuthBootstrapping && !isAuthenticated;

  const handleCloseLogin = () => {
    if (isAuthenticated) return;
    router.replace("/cart");
  };

  if (isAuthBootstrapping) {
    return (
      <SectionContainer>
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-400">
          در حال بررسی وضعیت ورود...
        </div>
      </SectionContainer>
    );
  }

  return (
    <>
      {isAuthenticated ? <Checkout /> : null}
      <LoginModal open={loginModalOpen} onClose={handleCloseLogin} />
    </>
  );
}
