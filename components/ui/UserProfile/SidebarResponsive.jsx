"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UserSidebar from "./UserSidebar";

export default function SidebarResponsive() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed z-20 bottom-28 start-3">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary px-3 py-3 rounded-lg drop-shadow"
          type="button"
          aria-label="باز کردن منوی پنل کاربر"
          aria-controls="offcanvas-right-filter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-8 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            ></path>
          </svg>
        </button>
      </div>

      {/* <!--User Panel--> */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        id="offcanvas-right-filter"
        className={`offcanvas overflow-y-scroll fixed top-0 right-0 sm:w-100 w-[80%] h-full bg-custom-light dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 border-e border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all duration-300 z-50 ${
          isOpen
            ? "translate-x-0 opacity-100 visible"
            : "translate-x-full opacity-0 invisible"
        }`}
        role="navigation"
        aria-labelledby="store-menu-title"
        aria-modal="true"
      >
        {/* <!-- header --> */}
        <div className="mb-12 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
          <h2 className="font-bold text-base">منو</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer"
            aria-label="بستن"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-8 text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* <!-- Menu --> */}
        <UserSidebar />
      </div>
      {/* <!-- End Filters --> */}
    </>
  );
}
