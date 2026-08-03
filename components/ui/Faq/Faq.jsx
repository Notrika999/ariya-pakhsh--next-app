// components/ui/Faq/Faq.jsx
"use client";

import Link from "next/link";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import React, { useState } from "react";
import MainContent from "./MainContent";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";

const faqData = {
  tabs: [
    { id: "all", title: "همه سوالات" },
    { id: "products", title: "محصولات" },
    { id: "account", title: "حساب کاربری" },
    { id: "payment", title: "پرداخت" },
    { id: "shipping", title: "ارسال و تحویل" },
    { id: "return", title: "بازگشت کالا" },
  ],
  faqs: [
    {
      id: 1,
      category: "products",
      title: "چگونه می‌توانم محصولات را سفارش دهم؟",
      subTitle: "برای سفارش محصولات کافی است مراحل زیر را طی کنید:",
      items: [
        { id: 1, content: "وارد حساب کاربری خود شوید" },
        { id: 2, content: "محصول مورد نظر را به سبد خرید اضافه کنید" },
        { id: 3, content: "به صفحه سبد خرید بروید و آدرس تحویل را تایید کنید" },
        { id: 4, content: "روش پرداخت را انتخاب و سفارش خود را نهایی کنید" },
      ],
      details: "",
    },
    {
      id: 2,
      category: "payment",
      title: "روش‌های پرداخت شما کدامند؟",
      subTitle: "ما چندین روش پرداخت برای راحتی شما ارائه می‌دهیم:",
      items: [
        { id: 1, content: "پرداخت آنلاین با کارت‌های عضو شتاب" },
        { id: 2, content: "پرداخت در محل" },
        { id: 3, content: "پرداخت از طریق کیف پول الکترونیکی" },
        { id: 4, content: "کارت به کارت" },
      ],
      details: "",
    },
    {
      id: 3,
      category: "shipping",
      title: "زمان تحویل سفارش چقدر است؟",
      subTitle: "زمان تحویل بستگی به آدرس و نوع محصول دارد:",
      items: [
        { id: 1, content: "تهران: ۱ تا ۲ روز کاری" },
        { id: 2, content: "شهرستان‌ها: ۳ تا ۵ روز کاری" },
        { id: 3, content: "مناطق دورافتاده: ۵ تا ۷ روز کاری" },
      ],
      details: "برای محصولات خاص زمان تحویل در صفحه محصول ذکر شده است.",
    },
    {
      id: 4,
      category: "return",
      title: "چگونه می‌توانم کالا را مرجوع کنم؟",
      subTitle: "برای مرجوع کردن کالا باید شرایط زیر را داشته باشید:",
      items: [
        { id: 1, content: "کالا باید در شرایط اولیه باشد" },
        { id: 2, content: "بسته‌بندی سالم باشد" },
        { id: 3, content: "حداکثر تا ۷ روز درخواست ثبت شود" },
      ],
      details: "در بخش تیکت از پیگیری سفارش اقدام کنید.",
    },
    {
      id: 5,
      category: "account",
      title: "چگونه می‌توانم حساب کاربری ایجاد کنم؟",
      subTitle: "برای ایجاد حساب کاربری:",
      items: [
        { id: 1, content: "روی ثبت نام کلیک کنید" },
        { id: 2, content: "ایمیل و شماره تلفن را وارد کنید" },
        { id: 3, content: "کد تایید را وارد کنید" },
        { id: 4, content: "اطلاعات خود را تکمیل کنید" },
      ],
      details: "پس از ثبت نام امکانات کامل فعال می‌شود.",
    },
  ],
};

export default function Faq() {
  const [activeTab, setActiveTab] = useState("all");
  const filteredFaqs =
    activeTab === "all"
      ? faqData.faqs
      : faqData.faqs.filter((faq) => faq.category === activeTab);

  return (
    <SectionContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <TitleAfter title={"سوالات متداول"} />
          <p className="text-gray-600 dark:text-gray-400">
            پاسخ به پرتکرارترین سوالات شما درباره محصولات و خدمات ما
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        {faqData.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`filter-btn px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            type="button"
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {filteredFaqs.map((faq) => (
            <MainContent key={faq.id} content={faq} />
          ))}
        </div>

        <div className="space-y-8">
          <div className="bg-white space-y-4 dark:bg-custom-dark border-gray-200 border dark:border-gray-700 rounded-2xl shadow-lg p-8">
            <TitleAfter title={"پاسخ خود را پیدا نکردید؟"} />

            <p className="mb-6 opacity-90">
              اگر پاسخ سوال خود را در این صفحه پیدا نکردید، با پشتیبانی ما تماس
              بگیرید.
            </p>

            <div className="bg-blue-600 text-white rounded-xl p-4 mb-4 shadow text-center">
              <div className="text-2xl font-black tracking-wide">
                <a href="tel:90007824">90007824</a>
              </div>
            </div>

            <Link
              href="/contact"
              className="block w-full text-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition"
            >
              تماس با پشتیبانی
            </Link>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
