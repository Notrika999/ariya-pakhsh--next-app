"use client";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

import type { DiscountCode } from "@/src/lib/types/userpanel/Discount";
import { notify } from "@/src/utils/toast";

const variantStyles = {
  green: {
    activeBg:
      "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700",
    inactiveBg:
      "bg-gradient-to-br from-green-50/60 to-green-100/40 dark:from-green-900/10 dark:to-green-800/10 border border-green-100 dark:border-green-900/50 opacity-70",
    activeText: "text-green-600 dark:text-green-400",
    inactiveText: "text-green-500/70 dark:text-green-400/60",
    circle: "bg-green-500",
    inactiveCircle: "bg-green-400/60 dark:bg-green-500/40",
    focusRing: "focus:ring-green-400",
  },
  blue: {
    activeBg:
      "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700",
    inactiveBg:
      "bg-gradient-to-br from-blue-50/60 to-blue-100/40 dark:from-blue-900/10 dark:to-blue-800/10 border border-blue-100 dark:border-blue-900/50 opacity-70",
    activeText: "text-blue-600 dark:text-blue-400",
    inactiveText: "text-blue-500/70 dark:text-blue-400/60",
    circle: "bg-blue-500",
    inactiveCircle: "bg-blue-400/60 dark:bg-blue-500/40",
    focusRing: "focus:ring-blue-400",
  },
  purple: {
    activeBg:
      "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700",
    inactiveBg:
      "bg-gradient-to-br from-purple-50/60 to-purple-100/40 dark:from-purple-900/10 dark:to-purple-800/10 border border-purple-100 dark:border-purple-900/50 opacity-70",
    activeText: "text-purple-600 dark:text-purple-400",
    inactiveText: "text-purple-500/70 dark:text-purple-400/60",
    circle: "bg-purple-500",
    inactiveCircle: "bg-purple-400/60 dark:bg-purple-500/40",
    focusRing: "focus:ring-purple-400",
  },
  teal: {
    activeBg:
      "bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-800/20 border border-teal-200 dark:border-teal-700",
    inactiveBg:
      "bg-gradient-to-br from-teal-50/60 to-cyan-100/40 dark:from-teal-900/10 dark:to-cyan-800/10 border border-teal-100 dark:border-teal-900/50 opacity-70",
    activeText: "text-teal-600 dark:text-teal-400",
    inactiveText: "text-teal-500/70 dark:text-teal-400/60",
    circle: "bg-teal-500",
    inactiveCircle: "bg-teal-400/60 dark:bg-teal-500/40",
    focusRing: "focus:ring-teal-400",
  },
};

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export default function DiscountCard({ data }: { data: DiscountCode }) {
  const isExpired = data.status === "expired";
  const isUsed = data.status === "used";
  const isInactive = isExpired || isUsed;
  const dateLabel = isUsed
    ? "استفاده شده:"
    : isExpired
      ? "منقضی شده:"
      : "منقضی می‌شود:";

  const styles = data.variant
    ? variantStyles[data.variant]
    : variantStyles.green;

  const handleCopyCode = async () => {
    const code = data.code.trim();
    if (!code) return;

    try {
      await copyToClipboard(code);
      notify.success("کد تخفیف کپی شد");
    } catch {
      notify.error("کپی کد تخفیف ناموفق بود");
    }
  };

  return (
    <div
      className={`rounded-2xl p-6 relative overflow-hidden ${
        isInactive ? styles.inactiveBg : styles.activeBg
      }`}
    >
      {/* Status Icon */}
      <div
        className={`absolute top-4 end-4 w-8 h-8 rounded-full flex items-center justify-center ${
          isInactive ? styles.inactiveCircle : styles.circle
        }`}
      >
        <i
          className={`fa-solid ${
            isInactive ? "fa-xmark" : "fa-check"
          } text-white text-sm`}
        ></i>
      </div>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => void handleCopyCode()}
          className={`${inter.className} inline-block cursor-copy bg-white dark:bg-zinc-800 text-2xl font-bold px-4 py-2 rounded-lg mb-3 transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isInactive
              ? `${styles.inactiveText} line-through ${styles.focusRing}`
              : `${styles.activeText} ${styles.focusRing}`
          }`}
          dir="ltr"
          aria-label={`کپی کد تخفیف ${data.code}`}
          title="کپی کد تخفیف"
        >
          {data.code}
        </button>

        <h3
          className={`font-semibold mb-2 ${
            isInactive
              ? "text-gray-500 dark:text-gray-400"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {data.title}
        </h3>

        <p
          className={`text-sm mb-4 ${
            isInactive ? "text-gray-400" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {data.description}
        </p>

        <div
          className={`flex justify-between items-center text-xs ${
            isInactive ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <span>{dateLabel}</span>
          <span>{data.expireDate}</span>
        </div>
      </div>
    </div>
  );
}
