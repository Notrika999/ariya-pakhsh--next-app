"use client";

import { useState } from "react";
import SidebarResponsive from "../SidebarResponsive";
import UserSidebar from "../UserSidebar";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";

export default function TicketMessage({ ticketId, onBack }) {
  // Ticket Status
  const [ticketStatus, setTicketStatus] = useState("در حال بررسی");

  // Timeline steps (dynamic)
  const [timeline, setTimeline] = useState([
    {
      id: 1,
      title: "تیکت ایجاد شد",
      date: "۱۴۰۲/۱۱/۰۵ - ۱۰:۱۵",
      desc: "تیکت شما با موفقیت ثبت و تأیید شد",
      status: "done",
    },
    {
      id: 2,
      title: "ارسال به واحد فنی",
      date: "۱۴۰۲/۱۱/۰۵ - ۱۰:۴۵",
      desc: "تیکت شما برای بررسی به واحد فنی ارسال شد",
      status: "done",
    },
    {
      id: 3,
      title: "در حال بررسی",
      date: "۱۴۰۲/۱۱/۰۵ - ۱۱:۳۰",
      desc: "کارشناسان ما در حال بررسی تیکت شما هستند",
      status: "current",
    },
    {
      id: 4,
      title: "ارسال پاسخ",
      date: "در انتظار",
      desc: "پاسخ کارشناسان برای شما ارسال خواهد شد",
      status: "pending",
    },
    {
      id: 5,
      title: "بسته شدن تیکت",
      date: "در انتظار",
      desc: "تیکت پس از حل مشکل بسته خواهد شد",
      status: "pending",
    },
  ]);

  // Messages list
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "شما",
      type: "user",
      date: "۱۴۰۲/۱۱/۰۵ - ۱۰:۱۵",
      message: `با سلام،
من دو روز پیش محصول گوشی سامسونگ A73 را خریداری کردم اما متأسفانه صفحه نمایش آن مشکل دارد...`,
    },
    {
      id: 2,
      sender: "پشتیبانی فنی",
      type: "support",
      date: "۱۴۰۲/۱۱/۰۵ - ۱۱:۳۰",
      message: `با درود،
از اینکه مشکل را اطلاع دادید سپاس‌گزاریم...`,
    },
  ]);

  // Reply Form State
  const [replyText, setReplyText] = useState("");
  const [replyFile, setReplyFile] = useState(null);

  // Handle Reply Submit
  const handleReplySubmit = (e) => {
    e.preventDefault();

    if (!replyText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "شما",
      type: "user",
      date: "همین الان",
      message: replyText,
      file: replyFile ? replyFile.name : null,
    };

    setMessages((prev) => [...prev, newMessage]);
    setReplyText("");
    setReplyFile(null);

    console.log("پیام ارسال شد:", newMessage);
  };

  // Status icon function
  const getStatusIcon = (item) => {
    if (item.status === "done") return "bg-green-500";
    if (item.status === "current") return "bg-yellow-500";
    return "bg-gray-300";
  };

  console.log(ticketId);
  return (
    <div className="lg:col-span-3 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4 ">
            <div>
              <TitleAfter title={"تیکت پشتیبانی #TKT-4591"} />
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                مشاهده اطلاعات کامل تیکت پشتیبانی
              </p>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-3 ">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  وضعیت تیکت
                </p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                  {ticketStatus}
                </span>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-2 md:mt-0">
            <button
              onClick={onBack}
              className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition mb-4"
            >
              بازگشت به لیست تیکت‌ها
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"روند تیکت"} />

        <div className="relative">
          <div className="space-y-8">
            {timeline.map((step) => (
              <div key={step.id} className="flex items-start space-x-4 ">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getStatusIcon(
                    step,
                  )}`}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={
                        step.status === "current"
                          ? "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          : "M5 13l4 4L19 7"
                      }
                    ></path>
                  </svg>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-medium ${
                        step.status === "pending"
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <span
                      className={`text-sm ${
                        step.status === "pending"
                          ? "text-gray-400 dark:text-gray-500"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step.date}
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      step.status === "pending"
                        ? "text-gray-400 dark:text-gray-500"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Messages */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
            <TitleAfter title={"مکالمات تیکت"} />

            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className="flex items-start space-x-4 ">
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      msg.type === "user"
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "bg-green-100 dark:bg-green-900"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        msg.type === "user"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={
                          msg.type === "user"
                            ? "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            : "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 3.016z"
                        }
                      ></path>
                    </svg>
                  </div>

                  {/* Message body */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {msg.sender}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {msg.date}
                      </span>
                    </div>

                    <div
                      className={`rounded-lg p-4 mt-2 ${
                        msg.type === "support"
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "bg-gray-50 dark:bg-zinc-800"
                      }`}
                    >
                      <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
                        {msg.message}
                      </p>
                      {msg.file && (
                        <p className="text-xs mt-2 text-primary">
                          فایل: {msg.file}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
                پاسخ جدید
              </h3>

              <form onSubmit={handleReplySubmit}>
                <div className="mb-4">
                  <textarea
                    rows="4"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-200"
                    placeholder="پیام خود را اینجا بنویسید..."
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                      <svg
                        className="w-5 h-5 me-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        ></path>
                      </svg>
                      افزودن فایل
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setReplyFile(e.target.files[0])}
                      />
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      (حداکثر 5MB)
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 text-sm font-medium"
                  >
                    ارسال پاسخ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Ticket Info & Actions */}
        <div className="space-y-8">
          {/* Ticket Info */}
          {/* (این بخش فقط نمایش اطلاعات است، state نیاز ندارد) */}
          {/* UI بدون تغییر */}
          {/* دقت کن فقط JSX شده نه HTML */}

          <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
            <TitleAfter title={"اطلاعات تیکت"} />
            <div className="space-y-4">
              {[
                ["شماره تیکت", "#TKT-4591"],
                ["دسته‌بندی", "پشتیبانی فنی"],
                ["اولویت", "متوسط", "yellow"],
                ["تاریخ ایجاد", "۱۴۰۲/۱۱/۰۵ - ۱۰:۱۵"],
                ["آخرین بروزرسانی", "۱۴۰۲/۱۱/۰۵ - ۱۱:۳۰"],
                ["کارشناس پاسخگو", "امین کریمی"],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center ${
                    i === 5
                      ? "pt-4 border-t border-gray-200 dark:border-gray-700"
                      : ""
                  }`}
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {label}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Order */}
          <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
            <TitleAfter title={"سفارش مرتبط"} />
            <div className="space-y-4">
              {[
                ["شماره سفارش", "#ORD-7842"],
                ["محصول", "گوشی سامسونگ A73"],
                ["تاریخ سفارش", "۱۴۰۲/۱۰/۱۵"],
              ].map(([title, value], i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    {title}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {value}
                  </span>
                </div>
              ))}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition duration-200 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 me-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  مشاهده سفارش
                </button>
              </div>
            </div>
          </div>

          {/* Ticket Actions */}
          <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
            <TitleAfter title={"عملیات تیکت"} />
            <div className="space-y-3">
              <button className="w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 flex items-center justify-center">
                ویرایش تیکت
              </button>

              <button
                onClick={() => setTicketStatus("حل شد")}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 active:scale-95 transition duration-200 flex items-center justify-center"
              >
                تیکت حل شد
              </button>

              <button
                onClick={() => setTicketStatus("بسته شده")}
                className="w-full border border-red-300 text-red-600 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 transition duration-200 flex items-center justify-center"
              >
                بستن تیکت
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
