import React from "react";
import UserProfileTop from "../UserProfileTop";

type CommentsTopProps = {
  reviewsCount: number;
  questionsCount: number;
};

export default function CommentsTop({
  reviewsCount,
  questionsCount,
}: CommentsTopProps) {
  const numberFormatter = new Intl.NumberFormat("fa-IR");

  return (
    <UserProfileTop
      title="نظرات و پرسش‌های من"
      titleTag={false}
      description="مدیریت نظرات و سوالات شما در مورد محصولات"
      aside={
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              تعداد کل نظرات
            </p>
            <span className="text-lg font-bold text-primary">
              {numberFormatter.format(reviewsCount)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              تعداد کل پرسش‌ها
            </p>
            <span className="text-lg font-bold text-primary">
              {numberFormatter.format(questionsCount)}
            </span>
          </div>
        </div>
      }
    />
  );
}
