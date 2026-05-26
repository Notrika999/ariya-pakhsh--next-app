"use client";

import Link from "next/link";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import React, { useEffect, useState } from "react";
import MainContent from "./MainContent";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";

import { useFaq } from "@/lib/hooks/useFaq";
export default function Faq() {
  const { fetchAll, loading, faqs, tabs } = useFaq();
  const [activeTab, setActiveTab] = useState("all");
  const filteredFaqs =
    activeTab === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeTab);

  useEffect(() => {
    fetchAll();
  }, []);

  console.log(tabs);

  if (loading) return <div>در حال بارگذاری...</div>;

  return (
    <SectionContainer>
      {/* <!--Pagination and title--> */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <TitleAfter title={"سوالات متداول"} />
          <p className="text-gray-600 dark:text-gray-400">
            پاسخ به پرتکرارترین سوالات شما درباره محصولات و خدمات ما
          </p>
        </div>
      </div>

      {/* <!--Categories--> */}
      <div className="flex flex-wrap gap-3 mb-10">
        {tabs?.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`filter-btn px-4 py-2 rounded-lg font-medium transition
      ${
        activeTab === tab.id
          ? "bg-blue-600 text-white"
          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
      }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* <!--Main part of the questions--> */}
        <div className="lg:col-span-2 space-y-6">
          {filteredFaqs?.map((faq) => (
            <MainContent key={faq.id} content={faq} />
          ))}
        </div>

        {/* <!-- Sidebar --> */}
        <div className="space-y-8">
          {/* <!--Frequently Asked Questions--> */}
          {/* <div className="bg-white space-y-4 dark:bg-custom-dark border-gray-200 border dark:border-gray-700 rounded-2xl shadow-lg p-8">
              <TitleAfter title={"سوالات پرتکرار"} />

              <div className="space-y-4">
                <a
                  href="#"
                  className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  data-filter="products"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400 me-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      شرایط گارانتی محصولات چگونه است؟
                    </span>
                  </div>
                </a>
                <a
                  href="#"
                  className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  data-filter="shipping"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400 me-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      آیا امکان ارسال به خارج از کشور وجود دارد؟
                    </span>
                  </div>
                </a>
                <a
                  href="#"
                  className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  data-filter="account"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400 me-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      چگونه می‌توانم از تخفیف‌ها استفاده کنم؟
                    </span>
                  </div>
                </a>
                <a
                  href="#"
                  className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  data-filter="products"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400 me-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      آیا امکان خرید عمده وجود دارد؟
                    </span>
                  </div>
                </a>
              </div>
            </div> */}

          {/* <!-- Support --> */}
          <div className="bg-white space-y-4 dark:bg-custom-dark border-gray-200 border dark:border-gray-700 rounded-2xl shadow-lg p-8">
            <TitleAfter title={"پاسخ خود را پیدا نکردید؟"} />

            <p className="mb-6 opacity-90">
              اگر پاسخ سوال خود را در این صفحه پیدا نکردید، با پشتیبانی ما تماس
              بگیرید.
            </p>

            <div className="bg-blue-600 text-white rounded-xl p-4 mb-4 shadow text-center">
              <div className="text-2xl font-black tracking-wide">
                <a href="">۰۲۱-۱۲۳۴۵۶۷۸</a>
              </div>
            </div>

            <Link
              href="/contact"
              className="block w-full text-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition"
            >
              ارسال تیکت پشتیبانی
            </Link>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
