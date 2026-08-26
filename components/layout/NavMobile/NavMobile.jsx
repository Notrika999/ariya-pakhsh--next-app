"use client";

// components/layout/NavMobile/NavMobile.jsx
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import OffcanvasRight from "@/components/layout/Header/MegaMenu/OffcanvasRight";
import { useCart } from "@/src/context/CartContext";
import LoginModal from "@/components/modules/auth/LoginModal";
import {
  useCurrentUser,
  useIsAuthenticated,
} from "@/src/lib/stores/auth/auth.store";
import { getMegaMenu } from "@/src/services/category/category.client";

export default function NavMobile() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const [loginOpen, setLoginOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [menu, setMenu] = useState([]);
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
  const isHomeActive = pathname === "/";
  const isProfileActive = pathname === "/user-profile";
  const showUserPanel = mounted && isAuthenticated && Boolean(user);

  useEffect(() => {
    let mounted = true;

    async function loadMenu() {
      try {
        const data = await getMegaMenu();
        if (mounted) setMenu(data);
      } catch (error) {
        console.error("[NavMobile] failed to load category menu:", error);
        if (mounted) setMenu([]);
      }
    }

    void loadMenu();

    return () => {
      mounted = false;
    };
  }, []);

  const handleProfileClick = () => {
    if (showUserPanel) {
      router.push("/user-profile");
      return;
    }

    setLoginOpen(true);
  };

  const navItems = [
    {
      key: "home",
      label: "خانه",
      icon: "fa-solid fa-house",
      href: "/",
      active: isHomeActive,
    },
    {
      key: "categories",
      label: "دسته‌بندی",
      icon: "fa-solid fa-grid-2",
      active: isStoreActive || categoryOpen,
      onClick: () => setCategoryOpen(true),
      expanded: categoryOpen,
    },
    {
      key: "cart",
      label: "سبد خرید",
      icon: "far fa-cart-shopping",
      href: "/cart",
      active: isCartActive,
      badge: totalItems > 0 ? (totalItems > 99 ? "99+" : totalItems) : "",
    },
    {
      key: "profile",
      label: "کارآپ من",
      icon: "far fa-user",
      active: isProfileActive,
      onClick: handleProfileClick,
    },
  ];

  return (
    <>
      {/* <!-- NAV MOBILE --> */}
      <nav className="fixed inset-x-0 bottom-0 z-30 block border-t border-gray-100 bg-white px-1 pb-[calc(env(safe-area-inset-bottom)+6px)] pt-2 shadow-[0_-6px_20px_rgba(15,23,42,0.06)] dark:border-gray-800 dark:bg-custom-dark lg:hidden">
        <div className="grid grid-cols-4 items-end">
          {navItems.map((item) => {
            const content = (
              <>
                <span className="relative flex h-6 items-center justify-center">
                  <i
                    className={`${item.icon} text-[22px] leading-none ${
                      item.active
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                    aria-hidden="true"
                  />
                  {item.badge ? (
                    <span className="absolute -end-2 -top-1 flex min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px]  leading-4 text-white dark:bg-primary-400">
                      {item.badge}
                    </span>
                  ) : null}
                </span>
                <span
                  className={`mt-1 max-w-full truncate text-[13px] leading-5 ${
                    item.active
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </>
            );

            const className =
              "flex min-w-0 flex-col items-center justify-center px-1 text-center transition-colors";

            if (item.onClick) {
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={item.onClick}
                  aria-label={item.label}
                  aria-current={item.active ? "page" : undefined}
                  aria-expanded={item.expanded}
                  className={className}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                aria-label={item.label}
                aria-current={item.active ? "page" : undefined}
                className={className}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>
      {/* <!-- END NAV MOBILE --> */}

      <OffcanvasRight
        isOpen={categoryOpen}
        onClose={() => setCategoryOpen(false)}
        menu={menu}
      />

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
