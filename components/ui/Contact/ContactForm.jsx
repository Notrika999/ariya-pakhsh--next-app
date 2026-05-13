import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import React from "react";

export default function ContactForm() {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700">
      <div className="flex items-center mb-6">
        <TitleAfter title={"ارسال پیام به ما"} />
      </div>

      <form className="space-y-6" id="contact-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <!-- Name --> */}
          <div className="form-group relative">
            <input
              type="text"
              id="lname"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary-500"
              required
            />
            <label
              htmlFor="lname"
              className="floating-label text-gray-500 dark:text-gray-400"
            >
              نام و نام خانوادگی
            </label>
          </div>

          {/* <!-- Email --> */}
          <div className="form-group relative">
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary-500"
              required
            />
            <label
              htmlFor="email"
              className="floating-label text-gray-500 dark:text-gray-400"
            >
              آدرس ایمیل
            </label>
          </div>
        </div>

        {/* <!-- Subject --> */}
        <div className="form-group relative">
          <input
            type="text"
            id="subject"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary-500"
            required
          />
          <label
            htmlFor="subject"
            className="floating-label text-gray-500 dark:text-gray-400"
          >
            موضوع پیام
          </label>
        </div>

        {/* <!-- Message --> */}
        <div className="form-group relative">
          <textarea
            id="message"
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary-500"
            required
          ></textarea>
          <label
            htmlFor="message"
            className="floating-label text-gray-500 dark:text-gray-400"
          >
            متن پیام
          </label>
        </div>

        <div className="flex items-center">
          {/* <!-- Button --> */}
          <button
            type="submit"
            className="bg-primary text-white font-bold py-3 px-8 rounded-lg flex items-center hover:bg-primary-700 transition"
          >
            <i className="fas fa-angles-right"></i>
        
            ارسال پیام
          </button>

          {/* <!-- Response time --> */}
          <div className="ms-6 text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <i className="far fa-clock me-1"></i>
            
            میانگین زمان پاسخ‌گویی: ۲۴ ساعت
          </div>
        </div>
      </form>

      {/* <!-- Success message --> */}
      <div id="form-status" className="mt-6 hidden">
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 flex items-center">
          <svg
            className="w-6 h-6 text-green-600 dark:text-green-400 me-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <div>
            <h4 className="font-bold text-green-800 dark:text-green-300">
              پیام شما با موفقیت ارسال شد
            </h4>
            <p className="text-green-700 dark:text-green-400 text-sm mt-1">
              کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
