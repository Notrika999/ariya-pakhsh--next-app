"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { notify } from "@/src/utils/toast";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  priceText?: string | null;
  imageUrl?: string | null;
};

type ShareApp = {
  id: string;
  label: string;
  icon: ReactNode;
  color: string;
  bg: string;
  border: string;
  getUrl:
    | ((url: string, title: string, priceText?: string | null) => string)
    | null;
};

const PUBLIC_SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aryapakhsh.shop"
).replace(/\/$/, "");

function buildShareText(title: string, url: string, priceText?: string | null) {
  const normalizedTitle = title.trim();
  const normalizedPrice = priceText?.trim();
  const lines = [normalizedTitle, normalizedPrice, url].filter(Boolean);

  return lines.join("\n");
}

function getPublicShareUrl(currentUrl: string) {
  try {
    const url = new URL(currentUrl);
    const isLocalhost =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1";

    const pathSegments = url.pathname.split("/").filter(Boolean);
    const isProductPath = pathSegments[0] === "product";
    const shortProductPath =
      isProductPath && pathSegments[1]
        ? `/product/${pathSegments[1]}`
        : `${url.pathname}${url.search}${url.hash}`;

    if (!isLocalhost) {
      return new URL(shortProductPath, url.origin).href;
    }

    return new URL(shortProductPath, PUBLIC_SITE_URL).href;
  } catch {
    return currentUrl;
  }
}

const SHARE_APPS: ShareApp[] = [
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
    getUrl: (url, title, priceText) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
        [title.trim(), priceText?.trim()].filter(Boolean).join("\n"),
      )}`,
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
    getUrl: (url, title, priceText) =>
      `https://wa.me/?text=${encodeURIComponent(
        buildShareText(title, url, priceText),
      )}`,
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
    getUrl: (url, title, priceText) =>
      `https://ble.ir/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
        [title.trim(), priceText?.trim()].filter(Boolean).join("\n"),
      )}`,
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
    getUrl: (url, title, priceText) =>
      `https://eitaa.com/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
        [title.trim(), priceText?.trim()].filter(Boolean).join("\n"),
      )}`,
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

function resolveShareUrl(value: string | null | undefined, baseUrl: string) {
  if (!value?.trim()) return "";

  try {
    return new URL(value, baseUrl).href;
  } catch {
    return "";
  }
}

function getShareImageRequestUrl(imageUrl: string, baseUrl: string) {
  try {
    const resolvedImageUrl = new URL(imageUrl, baseUrl);
    const resolvedBaseUrl = new URL(baseUrl);

    if (resolvedImageUrl.origin === resolvedBaseUrl.origin) {
      return resolvedImageUrl.href;
    }

    return new URL(
      `/api/share-image?url=${encodeURIComponent(resolvedImageUrl.href)}`,
      resolvedBaseUrl.origin,
    ).href;
  } catch {
    return imageUrl;
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getImageExtension(mimeType: string) {
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  if (mimeType.includes("gif")) return "gif";
  return "jpg";
}

function getShareFileName(title: string, mimeType: string) {
  const normalizedTitle = title
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-")
    .slice(0, 80);

  return `${normalizedTitle || "product"}.${getImageExtension(mimeType)}`;
}

async function createImageShareFile(
  imageUrl: string,
  title: string,
): Promise<File | null> {
  if (!imageUrl) return null;

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const blob = await response.blob();
    if (!blob.type.startsWith("image/")) return null;

    return new File([blob], getShareFileName(title, blob.type), {
      type: blob.type,
    });
  } catch {
    return null;
  }
}

function canShareFiles(files: File[]) {
  try {
    return (
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files })
    );
  } catch {
    return false;
  }
}

export default function ShareModal({
  open,
  onClose,
  title,
  priceText,
  imageUrl,
}: ShareModalProps) {
  if (!open) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : PUBLIC_SITE_URL;
  const shareUrl = getPublicShareUrl(currentUrl);
  const previewImageUrl =
    resolveShareUrl(imageUrl, currentUrl) ||
    resolveShareUrl("/images/default.png", currentUrl);
  const shareImageRequestUrl = getShareImageRequestUrl(
    previewImageUrl,
    currentOrigin,
  );
  const shareText = buildShareText(title, shareUrl, priceText);
  const canUseNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const copyShareContent = async () => {
    const escapedTitle = escapeHtml(title);
    const escapedPriceText = escapeHtml(priceText?.trim() ?? "");
    const escapedUrl = escapeHtml(shareUrl);
    const escapedImageUrl = escapeHtml(previewImageUrl);

    try {
      if (
        typeof ClipboardItem !== "undefined" &&
        typeof navigator.clipboard?.write === "function"
      ) {
        const html = `
          <a href="${escapedUrl}">
            ${escapedImageUrl ? `<img src="${escapedImageUrl}" alt="${escapedTitle}" />` : ""}
            <strong>${escapedTitle}</strong>
          </a>
          ${escapedPriceText ? `<br /><span>${escapedPriceText}</span>` : ""}
        `;

        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": new Blob([shareText], { type: "text/plain" }),
            "text/html": new Blob([html], { type: "text/html" }),
          }),
        ]);
        notify.success("محصول با تصویر، نام و قیمت کپی شد");
        return;
      }

      if (typeof navigator.clipboard?.writeText !== "function") {
        notify.error("امکان کپی لینک در این مرورگر وجود ندارد");
        return;
      }

      await navigator.clipboard.writeText(shareText);
      notify.success("محصول با نام، قیمت و لینک کوتاه کپی شد");
    } catch {
      notify.error("خطا در کپی لینک");
    }
  };

  const handleNativeShare = async () => {
    const imageFile = await createImageShareFile(shareImageRequestUrl, title);
    const canShareImage = imageFile && canShareFiles([imageFile]);
    const shareData: ShareData = canShareImage
      ? {
          title,
          text: shareText,
          files: [imageFile],
        }
      : {
          title,
          text: [title.trim(), priceText?.trim()].filter(Boolean).join("\n"),
          url: shareUrl,
        };

    try {
      await navigator.share(shareData);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      notify.error("خطا در اشتراک‌گذاری محصول");
    }
  };

  const handleShare = async (app: ShareApp) => {
    if (app.id === "copy") {
      await copyShareContent();
      return;
    }

    if (app.getUrl) {
      window.open(
        app.getUrl(shareUrl, title, priceText),
        "_blank",
        "noopener,noreferrer",
      );
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
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            اشتراک‌گذاری محصول
          </h3>
          <button
            type="button"
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

        <div className="mx-5 mt-4 flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <Image
              fill
              sizes="56px"
              src={previewImageUrl || "/images/default.png"}
              alt={title}
              className="object-contain p-1"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
              {title}
            </p>
            {priceText && (
              <p className="mt-1 truncate text-xs font-medium text-gray-500 dark:text-gray-400">
                {priceText}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 p-5 sm:grid-cols-5">
          {canUseNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 bg-gray-50 transition-all duration-150 active:scale-95 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:hover:bg-gray-800"
            >
              <span className="text-gray-700 dark:text-gray-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M8.59 13.51l6.83 3.98" />
                  <path d="M15.41 6.51 8.59 10.49" />
                </svg>
              </span>
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                اشتراک
              </span>
            </button>
          )}

          {SHARE_APPS.map((app) => (
            <button
              key={app.id}
              type="button"
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
