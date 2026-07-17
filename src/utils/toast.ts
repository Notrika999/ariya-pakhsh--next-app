// src/utils/toast.ts
import { toast } from "react-toastify";
import { createElement } from "react";

type ConfirmOptions = {
  confirmLabel?: string;
  cancelLabel?: string;
};

export const notify = {
  success: (message: string) => toast.success(message),

  error: (message: string) => toast.error(message),

  warning: (message: string) => toast.warning(message),

  info: (message: string) => toast.info(message),

  loading(message: string) {
    return toast.loading(message);
  },

  update(id: string | number, message: string) {
    toast.update(id, {
      render: message,
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
  },

  /** نمایش سوال تأیید با دکمه‌های تأیید/انصراف */
  confirm(message: string, options: ConfirmOptions = {}): Promise<boolean> {
    const confirmLabel = options.confirmLabel ?? "تأیید";
    const cancelLabel = options.cancelLabel ?? "انصراف";

    return new Promise((resolve) => {
      let settled = false;
      const finish = (value: boolean) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };

      toast(
        ({ closeToast }) =>
          createElement(
            "div",
            { className: "flex flex-col gap-3 text-sm text-gray-800" },
            createElement("p", { className: "font-medium leading-6" }, message),
            createElement(
              "div",
              { className: "flex items-center justify-end gap-2" },
              createElement(
                "button",
                {
                  type: "button",
                  className:
                    "rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200",
                  onClick: () => {
                    finish(false);
                    closeToast?.();
                  },
                },
                cancelLabel,
              ),
              createElement(
                "button",
                {
                  type: "button",
                  className:
                    "rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700",
                  onClick: () => {
                    finish(true);
                    closeToast?.();
                  },
                },
                confirmLabel,
              ),
            ),
          ),
        {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          closeButton: true,
          type: "warning",
          onClose: () => finish(false),
        },
      );
    });
  },
};
