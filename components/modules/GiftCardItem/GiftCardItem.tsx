// components/modules/GiftCardItem/GiftCardItem.tsx
import type { GiftCard } from "@/src/lib/types/userpanel/GiftCard";
import { notify } from "@/src/utils/toast";
//
function formatMoney(value: number, currency: string): string {
  const amount = new Intl.NumberFormat("fa-IR").format(
    Math.max(0, Math.round(value)),
  );

  return `${amount} ${currency || "تومان"}`;
}

function formatDate(value: string | null): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

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

export default function GiftCardItem({
  card,
  onDetails,
}: {
  card: GiftCard;
  onDetails?: (id: string) => void;
}) {

  const isActive = card.type === "active";

  const bgClass = isActive
    ? "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700"
    : "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-gray-700 opacity-75";

  const circleColor = isActive ? "bg-purple-500" : "bg-gray-400";

  const icon = isActive ? (
    <i className="fa-solid fa-check text-sm text-white"></i>
  ) : (
    <i className="fa-solid fa-xmark text-sm text-white"></i>
  );

  const handleCopyCardCode = async () => {
    const code = card.code?.trim();
    if (!code) return;

    try {
      await copyToClipboard(code);
      notify.success("شماره کارت کپی شده");
    } catch {
      notify.error("کپی شماره کارت ناموفق بود");
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 ${bgClass}`}
    >
      <div
        className={`absolute end-4 top-4 flex h-8 w-8 items-center justify-center rounded-full ${circleColor}`}
      >
        {icon}
      </div>

      <div className="mt-4 text-center">
        <div className="mb-4 rounded-lg bg-white p-4 dark:bg-zinc-800">
          <span
            className={`text-2xl font-bold ${
              isActive
                ? "text-purple-600 dark:text-purple-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {formatMoney(card.remainingBalance, "تومان")}
          </span>
          <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
            مانده از {formatMoney(card.amount, "تومان")}
          </span>
        </div>

        <h3
          className={`mb-2 font-semibold ${
            isActive
              ? "text-gray-800 dark:text-gray-200"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {card.title || "کارت هدیه"}
        </h3>

        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              شماره کارت:
            </span>
            <span
              className={`break-all text-left font-mono ${
                isActive
                  ? "text-gray-800 dark:text-gray-200"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {card.code}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              تاریخ انقضا:
            </span>
            <span
              className={isActive ? "text-gray-800 dark:text-gray-200" : "text-gray-500"}
            >
              {formatDate(card.expiresAt)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-gray-600 dark:text-gray-400">وضعیت:</span>
            <span
              className={
                isActive ? "text-green-600 dark:text-green-400" : "text-red-400"
              }
            >
              {card.statusTitle || (isActive ? "فعال" : "استفاده‌شده")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => onDetails?.(card.id)}
            className="w-full rounded-lg border border-purple-200 bg-white py-2 text-sm font-medium text-purple-700 transition duration-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:bg-zinc-900 dark:text-purple-300 dark:hover:bg-zinc-800"
          >
            مشاهده جزئیات
          </button>

          {isActive ? (
            <button
              type="button"
              className="copy-gift-card w-full rounded-lg bg-purple-600 py-2 text-sm font-medium text-white transition duration-200 hover:bg-purple-700"
              data-code={card.code}
              onClick={() => void handleCopyCardCode()}
            >
              کپی شماره کارت
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
