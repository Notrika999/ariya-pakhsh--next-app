import { QuestionItem } from "@/lib/types/userpanel/comments";
import Image from "next/image";
import React from "react";

interface Props {
  questions: QuestionItem[];
}
export default function QuestionsSection({ questions }: Props) {
  return (
    <div className="space-y-6">
      {questions.map((q) => (
        <div
          key={q.id}
          className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
            {/* Product Image */}
            <div className="shrink-0">
              <Image
                width={80}
                height={80}
                src={q.productImage}
                className="size-20 rounded-lg"
                alt={q.productTitle}
              />
            </div>

            <div className="flex-1">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    {q.productTitle}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    کد محصول: {q.productCode}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="mt-2 md:mt-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${q.statusColor}`}
                  >
                    {q.statusLabel}
                  </span>
                </div>
              </div>

              {/* Question block */}
              <div className="mt-4 space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                    پرسش شما:
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {q.questionText}
                  </p>
                </div>

                {/* Answer block */}
                {q.status === "answered" && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                      پاسخ ادمین:
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {q.answerText}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      پاسخ داده شده در: {q.answerDateTime}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ارسال شده در: {q.questionDate}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="text-red-600 hover:text-red-800 transition duration-150 text-sm font-medium flex items-center">
                    <i className="fa-regular fa-trash-can ml-1"></i>
                    حذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
