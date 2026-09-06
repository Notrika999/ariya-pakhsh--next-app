"use client";

import { FormEvent, useEffect, useState } from "react";
import { notify } from "@/src/utils/toast";
import { normalizeDigits, validateMobile } from "@/src/utils/auth.validation";

type StockNotifyModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function StockNotifyModal({
  open,
  onClose,
}: StockNotifyModalProps) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      queueMicrotask(() => {
        setPhone("");
        setError(null);
      });
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedPhone = normalizeDigits(phone).replace(/\D/g, "");
    if (!validateMobile(normalizedPhone)) {
      setError("شماره موبایل معتبر نیست");
      return;
    }

    notify.success("درخواست شما ثبت شد");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="stock-notify-title"
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-custom-dark"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id="stock-notify-title"
              className="text-lg font-bold text-gray-800 dark:text-gray-100"
            >
              موجود شد خبرم کن
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              شماره موبایل خود را وارد کنید تا در صورت موجود شدن اطلاع بدهیم.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex size-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <i className="far fa-x text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="tel"
            inputMode="numeric"
            autoFocus
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setError(null);
            }}
            placeholder="09xxxxxxxxx"
            className="w-full rounded-xl border border-gray-200 p-3 text-left dark:border-gray-700 dark:bg-zinc-900 dark:text-white"
            dir="ltr"
          />
          {error && (
            <p className="text-right text-sm text-red-500">{error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
          >
            ثبت درخواست
          </button>
        </form>
      </div>
    </div>
  );
}
