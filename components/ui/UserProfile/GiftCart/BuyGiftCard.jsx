// components/ui/UserProfile/GiftCart/BuyGiftCard.jsx

import React, { useState } from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";
import GiftCardRules from "./GiftCardRules";

const AMOUNTS = [100000, 250000, 500000, 1000000];

export default function BuyGiftCard() {
  const [selectedAmount, setSelectedAmount] = useState(null > null);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");

  // ✅ مبلغ نهایی
  const finalAmount =
    customAmount && Number(customAmount) > 0
      ? Number(customAmount)
      : selectedAmount || 0;

  const formatPrice = (amount) => amount.toLocaleString("fa-IR");

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      amount: finalAmount,
      recipientName,
      recipientEmail,
      message,
    };



    // اینجا بعداً API صدا می‌زنی
  };

  return (
    <div className="tab-content space-y-6">
      {/* <!-- Gift Card Purchase Form --> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"خرید کارت هدیه جدید"} />
        <form onSubmit={handleSubmit}>
          {/* Amount Selection */}
          <div className="mb-6">
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              مبلغ کارت هدیه
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`gift-card-amount bg-white border rounded-lg p-4 text-center transition duration-200 dark:bg-zinc-800 dark:border-gray-600
                    ${
                      selectedAmount === amount
                        ? "border-primary bg-primary/5"
                        : "border-gray-300 hover:border-primary hover:bg-primary/5"
                    }`}
                >
                  <span className="block text-lg font-bold text-gray-800 dark:text-gray-200">
                    {formatPrice(amount)}
                  </span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                    تومان
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                مبلغ دلخواه
              </label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="مبلغ مورد نظر را وارد کنید"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Recipient Info */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
              اطلاعات دریافت کننده
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="نام کامل"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-200"
              />

              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="پیام تبریک خود را اینجا بنویسید..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-200 resize-none"
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
              خلاصه سفارش
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  مبلغ کارت هدیه:
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {formatPrice(finalAmount)} تومان
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    مبلغ قابل پرداخت:
                  </span>
                  <span className="font-bold text-primary">
                    {formatPrice(finalAmount)} تومان
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!finalAmount}
            className="w-full bg-primary text-white px-6 py-4 rounded-lg hover:bg-primary/90 transition duration-200 text-lg font-bold flex items-center justify-center disabled:opacity-50"
          >
            <i className="fa-solid fa-credit-card me-2"></i>
            پرداخت و خرید کارت هدیه
          </button>
        </form>
      </div>

      {/* <!-- Gift Card Rules --> */}
      <GiftCardRules />
    </div>
  );
}
