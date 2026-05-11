import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function HeaderSetting() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dark-mode") === "true";
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("dark-mode", String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };
  return (
    <div className="lg:col-span-4 col-span-4 order-3 w-full">
      <div className="flex items-baseline justify-end">
        {/* basket and call and darkmode  */}
        <div className="flex items-center md:me-5 me-2">
          {/* heart  */}
          <a href="" className="lg:block hidden">
            <i className="fa-regular fa-heart"></i>
          </a>
          {/* basket  */}
          <div
            // onClick="toggleOffcanvas('offcanvas-left')"
            className="relative md:ms-5 ms-2 flex"
          >
            <i className="fa-regular fa-bag-shopping"></i>

            <span className="size-4 text-sm -top-2 -start-2 absolute bg-secondary dark:bg-primary-400 text-white dark:text-gray-100 rounded-lg text-center shadow-sm dark:shadow-[0_0_4px_rgba(255,255,255,0.2)] transition-colors duration-300">
              2
            </span>
          </div>
          {/* dark mode  */}
          <div className="md:ms-5 ">
            <button onClick={toggleDarkMode} className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 dark:block hidden dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 dark:hidden block dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="lg:inline-block hidden me-3 h-10 w-px self-stretch bg-gray-200 dark:bg-gray-700"></div>
        {/* login  */}
        <Link
          href="/auth/login"
          data-modal-target="LoginModal"
          className="flex items-center bg-white dark:bg-custom-dark text-gray-900 dark:text-gray-100 modal-trigger flex lg:py-2 lg:px-3 lg:border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f242c] transition-colors duration-200"
        >
          <i className="fa-regular fa-user-circle me-1"></i>
          <span className="lg:inline-block hidden">ورود / ثبت نام</span>
        </Link>
      </div>
    </div>
  );
}
