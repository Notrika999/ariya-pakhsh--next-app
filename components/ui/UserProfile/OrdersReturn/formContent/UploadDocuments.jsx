"use client";
// components/ui/UserProfile/OrdersReturn/formContent/UploadDocuments.jsx
import { useRef, useState } from "react";

const MAX_IMAGE_SIZE_MB = 2;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function formatFileSize(size) {
  if (!size) return "۰ کیلوبایت";
  const value = size / 1024;
  if (value < 1024) {
    return `${new Intl.NumberFormat("fa-IR").format(Math.ceil(value))} کیلوبایت`;
  }
  return `${new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: 1,
  }).format(value / 1024)} مگابایت`;
}

export default function UploadDocuments({
  title = "بارگذاری مدارک",
  description = "تصاویر مرتبط با درخواست مرجوعی را بارگذاری کنید.",
  guideDescription = "تصویر باید خوانا، واضح و حداکثر ۲ مگابایت باشد.",
  files = [],
  onChange,
  disabled = false,
}) {
  const fileInputRef = useRef(null);
  const [showUploadGuide, setShowUploadGuide] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const validFiles = [];
    let nextError = "";

    for (const file of selectedFiles) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        nextError = "فقط تصویر با فرمت JPG، PNG یا WEBP قابل بارگذاری است.";
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        nextError = `حجم هر تصویر باید حداکثر ${MAX_IMAGE_SIZE_MB} مگابایت باشد.`;
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onChange?.([...(files ?? []), ...validFiles]);
    }

    setErrorMessage(nextError);
    event.target.value = "";
  };

  const removeFile = (targetIndex) => {
    onChange?.(files.filter((_, index) => index !== targetIndex));
  };

  const openFileDialog = () => {
    setShowUploadGuide(false);
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-zinc-900/40">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
        {files.length ? (
          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {new Intl.NumberFormat("fa-IR").format(files.length)} فایل
          </span>
        ) : null}
      </div>

      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5 text-center dark:border-gray-600 dark:bg-zinc-800/70">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl text-gray-500 shadow-sm dark:bg-zinc-900 dark:text-gray-300">
          <i className="fa-solid fa-cloud-arrow-up"></i>
        </span>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          JPG، PNG، WEBP تا سقف {MAX_IMAGE_SIZE_MB} مگابایت
        </p>

        <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
          <button
            type="button"
            disabled={disabled}
            onClick={openFileDialog}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            انتخاب فایل
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowUploadGuide(true)}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-gray-200"
          >
            راهنمای فایل
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={disabled}
          onChange={handleFiles}
        />
      </div>

      {errorMessage ? (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">
          {errorMessage}
        </p>
      ) : null}

      {files.length ? (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-zinc-900"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-300">
                  <i className="fa-regular fa-file-image"></i>
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-800 dark:text-gray-100">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeFile(index)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-950/30"
                aria-label="حذف فایل"
              >
                <i className="fa-regular fa-trash-can"></i>
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {showUploadGuide ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowUploadGuide(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-5 shadow-xl dark:bg-custom-dark">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </span>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">
                  راهنمای بارگذاری تصویر
                </h4>
                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {guideDescription}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowUploadGuide(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={openFileDialog}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white transition hover:bg-primary/90"
              >
                انتخاب تصویر
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
