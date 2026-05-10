import { CommentItem } from "@/lib/types/userpanel/comments";
import React from "react";

interface Props {
  comments: CommentItem[];
}

export default function CommentSection({ comments }: Props) {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
            {/* Image */}
            <div className="flex-shrink-0">
              <img
                src={comment.productImage}
                className="size-20 rounded-lg"
                alt={comment.productTitle}
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    {comment.productTitle}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fa-solid fa-star w-5 h-5 ${
                            i < comment.rating
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        ></i>
                      ))}
                    </div>

                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {comment.rating}.0
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-2 md:mt-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${comment.statusColor}`}
                  >
                    {comment.statusLabel}
                  </span>
                </div>
              </div>

              {/* Text */}
              <div className="mt-4 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {comment.text}
                </p>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ارسال شده در: {comment.date}
                  </span>

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {comment.helpfulCount} نفر مفید دانستند
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="text-primary hover:text-primary/80 transition duration-150 text-sm font-medium flex items-center">
                    <i className="fa-regular fa-pen-to-square ml-1"></i>
                    ویرایش
                  </button>

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
