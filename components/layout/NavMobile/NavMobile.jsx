"use client";

// components/layout/NavMobile/NavMobile.jsx
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import HeaderSearch from "@/components/layout/Header/Top/HeaderSearch";
import { useCart } from "@/src/context/CartContext";
import LoginModal from "@/components/modules/auth/LoginModal";
import {
  useCurrentUser,
  useIsAuthenticated,
} from "@/src/lib/stores/auth/auth.store";

export default function NavMobile() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isStoreActive =
    pathname === "/products" || pathname.startsWith("/products/");
  const isCartActive = pathname === "/cart";
  const isProfileActive = pathname === "/user-profile";
  const showUserPanel = mounted && isAuthenticated && Boolean(user);

  const handleProfileClick = () => {
    if (showUserPanel) {
      router.push("/user-profile");
      return;
    }

    setLoginOpen(true);
  };

  return (
    <>
      {searchOpen && (
        <>
          <button
            type="button"
            aria-label="بستن جستجو"
            className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] lg:hidden"
            onClick={() => setSearchOpen(false)}
          />

          <div className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white px-3 pb-3 pt-[calc(env(safe-area-inset-top)+12px)] shadow-lg dark:border-gray-800 dark:bg-custom-dark lg:hidden">
            <div className="flex items-center gap-2" dir="rtl">
              <HeaderSearch
                autoFocus
                className="block w-full"
                onNavigate={() => setSearchOpen(false)}
                resultsId="mobileSearchResults"
              />
              <button
                type="button"
                aria-label="بستن جستجو"
                onClick={() => setSearchOpen(false)}
                className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-100"
              >
                <i className="far fa-xmark" aria-hidden="true" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* <!-- NAV MOBILE --> */}
      <nav className="fixed lg:hidden block bottom-0 inset-e-0 inset-s-0 z-30 py-1 px-2 rounded-t-2xl overflow-hidden bg-custom-light dark:bg-custom-dark before:content-[''] before:absolute before:top-0 before:right-0 before:w-full before:h-full before:opacity-30">
      <div className="flex justify-around items-center relative text-white dark:text-gray-100">
        {/* <!-- Home --> */}
        <Link
          href="/products"
          aria-label="فروشگاه"
          className="flex flex-col items-center px-1.5 py-1.5 rounded-lg transition-all duration-300 relative"
        >
          <div className="size-10 flex items-center justify-center rounded-lg bg-primary dark:bg-[rgba(255,255,255,0.05)] transition-all duration-300">
          <i className="far fa-store text-base"></i>

          </div>
        </Link>

        {/* <!-- Search --> */}
        <button
          type="button"
          aria-label="جستجو"
          aria-expanded={searchOpen}
          onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center px-1.5 py-1.5 rounded-lg transition-all duration-300 relative"
        >
          <div className="size-10 flex items-center justify-center rounded-lg bg-primary dark:bg-[rgba(255,255,255,0.05)] transition-all duration-300">
            <i className="far fa-search text-base"></i>
          </div>
        </button>

        {/* <!--Central button--> */}
        <div className="flex flex-col items-center relative">
          <Link
            href="/"
            aria-label="صفحه اصلی"
            aria-current={isStoreActive ? "page" : undefined}
            className={`size-12 bg-[linear-gradient(135deg,#D4AF37_0%,#F1C40F_100%)] dark:bg-[linear-gradient(135deg,#FFD700_0%,#B8860B_100%)] text-white rounded-xl border-2 flex items-center justify-center mt-[-12px] shadow-[0_4px_14px_rgba(212,175,55,0.35)] active:scale-90 transition-all duration-300 ${
              isStoreActive
                ? "border-primary ring-2 ring-primary/20"
                : "border-white/80 dark:border-gray-800"
            }`}
          >
            <i className="far fa-home text-lg"></i>
            </Link>
        </div>

        {/* <!--Shopping Cart--> */}
        <Link
          href="/cart"
          aria-current={isCartActive ? "page" : undefined}
          className="flex flex-col items-center px-1.5 py-1.5 rounded-lg transition-all duration-300 relative"
        >
          <div className="size-10 flex items-center justify-center rounded-lg bg-primary dark:bg-[rgba(255,255,255,0.05)] relative">
            <i className="fas fa-shopping-bag text-base"></i>
            {totalItems > 0 && (
              <span className="absolute -top-1 -end-1 min-w-4 h-4 px-1 bg-secondary dark:bg-primary-400 text-white dark:text-gray-100 text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm dark:shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </div>
        </Link>

        {/* <!-- Profile --> */}
        <button
          type="button"
          onClick={handleProfileClick}
          aria-label={showUserPanel ? "پنل کاربری" : "ورود / ثبت نام"}
          aria-current={isProfileActive ? "page" : undefined}
          className="flex flex-col items-center px-1.5 py-1.5 rounded-lg transition-all duration-300 relative"
        >
          <div
            className={`size-10 flex items-center justify-center rounded-lg bg-primary dark:bg-[rgba(255,255,255,0.05)] transition-all duration-300 ${
              isProfileActive ? "ring-2 ring-primary/20" : ""
            }`}
          >
            <i className="far fa-user text-base"></i>
          </div>
        </button>
      </div>
      </nav>
      {/* <!-- END NAV MOBILE --> */}

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
