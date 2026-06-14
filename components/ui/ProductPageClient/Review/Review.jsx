// components/ui/ProductPageClient/Review/Review.jsx
"use client";

import React, { useEffect, useRef } from "react";
import ProductIntroduction from "./ProductIntroduction";
import Intro from "./Intro";
import Specifications from "./Specifications";
import Comments from "./Comments";
import Question from "./Question";
import ProductAction from "./ProductAction";
import TabBar from "@/components/modules/TabBar/TabBar";

const TABS = [
  { id: "desc", label: "معرفی اجمالی" },
  { id: "intro", label: "معرفی تکمیلی" },
  { id: "specs", label: "مشخصات فنی" },
  { id: "comments", label: "نظرات" },
  { id: "question", label: "پرسش و پاسخ" },
];

export default function Review({ product, variant, isOutOfStock }) {
  const navRef = useRef(null);

  useEffect(() => {
    const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
    const sections = Array.from(document.querySelectorAll(".tab-section"));
    const nav = navRef.current;
    if (!tabButtons.length || !sections.length || !nav) return;

    const getHeaderHeight = () =>
      document.querySelector("body > header")?.getBoundingClientRect().height ??
      0;

    const getStickyOffset = () =>
      getHeaderHeight() + nav.getBoundingClientRect().height + 16;

    const updateNavTop = () => {
      nav.style.setProperty(
        "--review-sticky-top",
        `${getHeaderHeight() + 8}px`,
      );
    };

    // تابع برای فعال کردن یک تب (مشترک برای کلیک و اسکرول)
    const activateTab = (tabId) => {
      tabButtons.forEach((b) => {
        b.classList.remove("bg-primary", "text-white");
        b.classList.add("bg-blue-100", "text-primary-800");
      });

      const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
      if (activeBtn) {
        activeBtn.classList.remove("bg-blue-100", "text-primary-800");
        activeBtn.classList.add("bg-primary", "text-white");
      }
    };

    // -------------------------
    // ۱. کلیک روی تب
    // -------------------------
    const handleClick = (e) => {
      const btn = e.currentTarget;
      const tabId = btn.dataset.tab;

      const section = document.getElementById(tabId);
      if (!section) return;

      // اکتیو کردن تب
      activateTab(tabId);

      // اسکرول نرم با در نظر گرفتن هدر و تب‌بار sticky
      window.scrollTo({
        top:
          section.getBoundingClientRect().top +
          window.scrollY -
          getStickyOffset(),
        behavior: "smooth",
      });
    };

    tabButtons.forEach((btn) => btn.addEventListener("click", handleClick));

    // -------------------------
    // ۲. فعال شدن تب هنگام اسکرول
    // -------------------------
    const handleScroll = () => {
      updateNavTop();

      const offset = getStickyOffset();
      const currentSection =
        [...sections]
          .reverse()
          .find((section) => section.getBoundingClientRect().top <= offset) ??
        sections[0];

      if (currentSection) activateTab(currentSection.id);
    };

    updateNavTop();
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    const header = document.querySelector("body > header");
    const headerResizeObserver = header
      ? new ResizeObserver(() => handleScroll())
      : null;
    if (header) headerResizeObserver?.observe(header);

    // cleanup
    return () => {
      tabButtons.forEach((btn) =>
        btn.removeEventListener("click", handleClick),
      );
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      headerResizeObserver?.disconnect();
    };
  }, []);
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* <!-- Review --> */}
      <section className="xl:col-span-3 col-span-4">
        {/* <!--Tab bar--> */}
        <TabBar navRef={navRef} tabs={TABS} />

        {/* <nav
          ref={navRef}
          id="topBar"
          className="lg:sticky border border-gray-200 shadow-sm dark:border-gray-700 z-10 px-5 bg-white dark:bg-zinc-800 rounded-2xl mb-6"
          style={{ zIndex: "39", top: "var(--review-sticky-top, 0px)" }}
        >
          <ul
            className="flex space-x-1 min-w-48 overflow-x-scroll py-4 hide-scrollbar"
            id="tabContainer"
          >
            <li>
              <button
                className="tab-btn whitespace-nowrap px-6 py-3 rounded-xl transition-all bg-primary text-white dark:bg-blue-800/30 dark:text-gray-200"
                data-tab="desc"
              >
                معرفی اجمالی
              </button>
            </li>
            <li>
              <button
                className="tab-btn whitespace-nowrap px-6 py-3 rounded-xl transition-all bg-blue-100 text-primary-800 dark:bg-blue-800/30 dark:text-gray-200"
                data-tab="intro"
              >
                معرفی تکمیلی
              </button>
            </li>
            <li>
              <button
                className="tab-btn whitespace-nowrap px-6 py-3 rounded-xl transition-all bg-blue-100 text-primary-800 dark:bg-blue-800/30 dark:text-gray-200"
                data-tab="specs"
              >
                مشخصات فنی
              </button>
            </li>
            <li>
              <button
                className="tab-btn whitespace-nowrap px-6 py-3 rounded-xl transition-all bg-blue-100 text-primary-800 dark:bg-blue-800/30 dark:text-gray-200"
                data-tab="comments"
              >
                نظرات
              </button>
            </li>
            <li>
              <button
                className="tab-btn whitespace-nowrap px-6 py-3 rounded-xl transition-all bg-blue-100 text-primary-800 dark:bg-blue-800/30 dark:text-gray-200"
                data-tab="question"
              >
                پرسش و پاسخ
              </button>
            </li>
          </ul>
        </nav> */}

        {/* <!--The content of the tabs--> */}
        <div className="space-y-8">
          {/* <!--Tab 1 - Brief Introduction--> */}
          <div
            id="desc"
            className="tab-section p-8 bg-white dark:bg-custom-dark dark:border-gray-700 rounded-2xl shadow-md border border-gray-200"
          >
            <ProductIntroduction />
          </div>

          {/* <!--Tab 2 - Supplementary Introduction--> */}
          <div
            id="intro"
            className="tab-section p-8 bg-white dark:bg-custom-dark dark:border-gray-700 rounded-2xl shadow-md border border-gray-200"
          >
            <Intro />
          </div>

          {/* <!--Tab 3 - Technical specifications--> */}
          <div
            id="specs"
            className="tab-section p-8 bg-white dark:bg-custom-dark dark:border-gray-700 rounded-2xl shadow-md border border-gray-200"
          >
            <Specifications />
          </div>

          {/* <!--Tab 4 - Comments--> */}
          <div
            id="comments"
            className="tab-section p-8 bg-white dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md"
          >
            <Comments />
          </div>

          {/* <!--Tab 5 - Question--> */}
          <div
            id="question"
            className="tab-section p-8 bg-white dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg"
            data-content="5"
          >
            <Question />
          </div>
        </div>
      </section>

      {/* <!-- Product Action --> */}
      <section id="proAction" className="xl:col-span-1 col-span-4">
        <ProductAction
          product={product}
          variant={variant}
          isOutOfStock={isOutOfStock}
        />
      </section>
    </div>
  );
}
