"use client";

import { notify } from "@/src/utils/toast";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
};

const SHARE_APPS = [
  {
    id: "telegram",
    label: "تلگرام",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    color: "text-sky-500",
    bg: "bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-950/70",
    border: "border-sky-200 dark:border-sky-800",
    getUrl: (url: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}`,
  },
  {
    id: "whatsapp",
    label: "واتساپ",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/40 hover:bg-green-100 dark:hover:bg-green-950/70",
    border: "border-green-200 dark:border-green-800",
    getUrl: (url: string) => `https://wa.me/?text=${encodeURIComponent(url)}`,
  },
  {
    id: "bale",
    label: "بله",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 7.5l-1.5 7-3-2.5-1.5 1.5-1-4 7-2z" />
      </svg>
    ),
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-950/70",
    border: "border-purple-200 dark:border-purple-800",
    getUrl: (url: string) =>
      `https://ble.ir/share?url=${encodeURIComponent(url)}`,
  },
  {
    id: "eitaa",
    label: "ایتا",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-950/70",
    border: "border-orange-200 dark:border-orange-800",
    getUrl: (url: string) =>
      `https://eitaa.com/share/url?url=${encodeURIComponent(url)}`,
  },
  {
    id: "copy",
    label: "کپی لینک",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    ),
    color: "text-gray-600 dark:text-gray-300",
    bg: "bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800",
    border: "border-gray-200 dark:border-gray-700",
    getUrl: null,
  },
];

export default function ShareModal({ open, onClose, title }: ShareModalProps) {
  if (!open) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async (app: (typeof SHARE_APPS)[number]) => {
    if (app.id === "copy") {
      try {
        await navigator.clipboard.writeText(currentUrl);
        notify.success("لینک با موفقیت کپی شد");
      } catch {
        notify.error("خطا در کپی لینک");
      }
      return;
    }

    if (app.getUrl) {
      window.open(app.getUrl(currentUrl), "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm border border-gray-100 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            اشتراک‌گذاری محصول
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="بستن"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="w-4 h-4"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* URL preview */}
        <div className="mx-5 mt-4 flex items-center gap-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="w-4 h-4 text-gray-400 shrink-0"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span
            className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1 text-left"
            dir="ltr"
          >
            {title}
          </span>
        </div>

        {/* Apps grid */}
        <div className="grid grid-cols-5 gap-2 p-5">
          {SHARE_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => handleShare(app)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-150 active:scale-95 ${app.bg} ${app.border}`}
            >
              <span className={app.color}>{app.icon}</span>
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {app.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
