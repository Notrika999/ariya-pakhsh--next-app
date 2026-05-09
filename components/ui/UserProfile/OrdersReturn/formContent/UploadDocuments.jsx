"use client";

import { useRef } from "react";

export default function UploadDocuments({ files, onChange }) {
  const fileInputRef = useRef(null);

  const handleFiles = (e) => {
    const newFiles = [...files, ...Array.from(e.target.files)];
    onChange(newFiles);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4">
        بارگذاری مدارک
      </h3>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">

        <svg
          className="w-12 h-12 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>

        <p className="text-gray-600 dark:text-gray-400 mb-2">
          تصویر فاکتور یا فیلم از مشکل محصول را اینجا بارگذاری کنید
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          فرمت‌های مجاز: JPG, PNG, PDF, MP4 (حداکثر ۱۰ مگابایت)
        </p>

        <button
          type="button"
          id="uploadButton"
          onClick={openFileDialog}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition duration-200"
        >
          انتخاب فایل
        </button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf,.mp4"
          multiple
          onChange={handleFiles}
        />
      </div>

      <div id="uploadedFiles" className="mt-4 space-y-2">
        {files?.map((file, index) => (
          <div
            key={index}
            className="text-sm text-gray-700 dark:text-gray-300 border p-2 rounded"
          >
            {file.name}
          </div>
        ))}
      </div>
    </div>
  );
}
