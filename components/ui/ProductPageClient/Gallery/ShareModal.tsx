"use client";

import { notify } from "@/src/utils/toast";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ShareModal({ open, onClose }: ShareModalProps) {
  if (!open) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      notify.success("لینک با موفقیت کپی شد");
    } catch (error) {
      notify.error("خطا در کپی لینک");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/40">
      <div className="bg-white dark:bg-custom-dark rounded-lg shadow-lg w-full max-w-md border dark:border-gray-700">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-xl dark:text-white">اشتراک گذاری محصول</h3>

          <button onClick={onClose} className="text-gray-500 text-2xl">
            ✕
          </button>
        </div>

        <div className="p-4 flex items-center justify-center">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-md bg-primary text-white"
          >
            کپی لینک
          </button>
        </div>
      </div>
    </div>
  );
}
