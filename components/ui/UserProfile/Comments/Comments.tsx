"use client";

import React, { useState } from "react";
import CommentsTop from "./CommentsTop";
import TabsSection from "../../../modules/TabsSection/TabsSection";
import CommentSection from "./CommentSection";
import QuestionsSection from "./QuestionsSection";

import type { CommentItem } from "@/types/comments";
import { QuestionItem } from "@/lib/types/userpanel/comments";

export default function Comments() {
  const [activeTab, setActiveTab] = useState("my-comments");

  const tabs = [
    { id: "comments", title: "نظرات", icon: "fa-regular fa-comment" },
    {
      id: "questions",
      title: "پرسش و پاسخ",
      icon: "fa-regular fa-circle-question",
    },
  ];

  const comments: CommentItem[] = [
    {
      id: 1,
      productImage: "/images/product/television-2.png",
      productTitle: "گوشی موبایل سامسونگ گلکسی A73",
      rating: 5,
      status: "approved",
      statusLabel: "تأیید شده",
      statusColor:
        "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
      text: "این گوشی واقعا عالیه! باتری فوق‌العاده، دوربین عالی، واقعا ارزش خرید داره.",
      date: "۱۴۰۲/۱۰/۲۰",
      helpfulCount: 124,
    },
    {
      id: 2,
      productImage: "/images/product/wach-1.png",
      productTitle: "قاب محافظ گوشی سامسونگ گلکسی A73",
      rating: 4,
      status: "pending",
      statusLabel: "در انتظار تأیید",
      statusColor:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
      text: "کیفیت خوبه اما کمی ضخیمه و دکمه‌هارو سفت می‌کنه.",
      date: "۱۴۰۲/۱۱/۰۵",
      helpfulCount: 0,
    },
  ];

  const questions: QuestionItem[] = [
    {
      id: 1,
      productImage: "/images/product/television-2.png",
      productTitle: "گوشی موبایل سامسونگ گلکسی A73",
      productCode: "PRD-001",
      questionText: "آیا این گوشی قابلیت شارژ سریع داره؟",
      questionDate: "۱۴۰۲/۱۰/۲۱",
      status: "answered",
      statusLabel: "پاسخ داده شده",
      statusColor:
        "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
      answerText:
        "بله، این مدل از شارژ سریع 25 واتی پشتیبانی می‌کند و حدود ۱ ساعت و ۱۵ دقیقه زمان لازم دارد.",
      answerDateTime: "۱۴۰۲/۱۰/۲۲ - ۱۴:۳۰",
    },

    {
      id: 2,
      productImage: "/images/product/wach-1.png",
      productTitle: "قاب محافظ گوشی سامسونگ گلکسی A73",
      productCode: "PRD-002",
      questionText: "آیا قاب با شارژ بی‌سیم سازگاری دارد؟",
      questionDate: "۱۴۰۲/۱۱/۰۵",
      status: "pending",
      statusLabel: "در انتظار پاسخ",
      statusColor:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    },
  ];

  return (
    <div className="lg:col-span-3 space-y-8">
      {/* <!--Dashboard header--> */}
      <CommentsTop />

      {/* <!--Tabs Navigation--> */}
      <TabsSection
        defaultTab="my-comments"
        onChange={setActiveTab}
        tabs={[
          {
            key: "my-comments",
            label: "نظرات من",
            iconClass: "fa fa-star", // 🎁 آیکن هدیه
          },
          {
            key: "my-questions",
            label: "پرسش‌های من",
            iconClass: "fa-solid fa-question", // 🛒 آیکن خرید
          },
        ]}
      />

      {/* <!--Comments Section--> */}
      {activeTab === "my-comments" && <CommentSection comments={comments} />}

      {/* <!--Questions Section (Hidden by default)--> */}
      {activeTab === "my-questions" && (
        <QuestionsSection questions={questions} />
      )}

      {/* <!--Pagination--> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            نمایش ۱ تا ۲ از ۱۵ نظر
          </div>
          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white">
              <svg
                className="w-4 h-4 me-1"
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
              قبلی
            </button>
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white">
              بعدی
              <svg
                className="w-4 h-4 ms-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
