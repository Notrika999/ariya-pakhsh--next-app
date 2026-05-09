"use client"

import React, { useEffect } from "react";
import ProductIntroduction from "./ProductIntroduction";
import Intro from "./Intro";
import Specifications from "./Specifications";
import Comments from "./Comments";
import Question from "./Question";
import ProductAction from "./ProductAction";

export default function Review() {
  useEffect(() => {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const sections = document.querySelectorAll(".tab-section");

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

      // اسکرول نرم
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    tabButtons.forEach((btn) => btn.addEventListener("click", handleClick));

    // -------------------------
    // ۲. فعال شدن تب هنگام اسکرول
    // -------------------------

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            activateTab(id);
          }
        });
      },
      {
        threshold: 0.3, // ۳۰٪ سکشن وارد ویو شود
      },
    );

    sections.forEach((sec) => observer.observe(sec));

    // cleanup
    return () => {
      tabButtons.forEach((btn) =>
        btn.removeEventListener("click", handleClick),
      );
      observer.disconnect();
    };
  }, []);
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* <!-- Review --> */}
      <section className="xl:col-span-3 col-span-4">
        {/* <!--Tab bar--> */}
        <nav
          id="topBar"
          className="lg:sticky top-0 border border-gray-200 shadow-sm dark:border-gray-700 z-10 px-5 bg-white dark:bg-zinc-800 lg:top-[75px] rounded-2xl mb-6"
          style={{ zIndex: "39" }}
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
        </nav>

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
        <ProductAction />
      </section>
    </div>
  );
}
