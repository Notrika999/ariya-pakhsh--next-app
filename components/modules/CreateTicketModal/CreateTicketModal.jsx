"use client";
// components/modules/CreateTicketModal/CreateTicketModal.jsx
import { useState } from "react";
import {
  DEFAULT_TICKET_CATEGORY,
  DEFAULT_TICKET_PRIORITY,
  TICKET_PRIORITIES,
} from "@/src/lib/tickets/ticket-labels";
import { useTicketCategories } from "@/src/lib/hooks/use-ticket-categories";
import { FieldError, fieldClass } from "@/src/utils/form.validation";
import CustomSelect from "@/components/modules/UserProfile/CustomSelect";
import OrderAutocomplete from "@/components/modules/UserProfile/OrderAutocomplete";

const ticketAttachmentKey = (file) =>
  `${file.name}-${file.size}-${file.lastModified}`;

const formatFileSize = (size) => {
  if (!Number.isFinite(size) || size <= 0) return "0 KB";
  if (size < 1024 * 1024) {
    return `${new Intl.NumberFormat("fa-IR").format(Math.ceil(size / 1024))} KB`;
  }

  return `${new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: 1,
  }).format(size / (1024 * 1024))} MB`;
};

export default function CreateTicketModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}) {
  const { options: categoryOptions, requiresOrder } = useTicketCategories();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(DEFAULT_TICKET_CATEGORY);
  const [priority, setPriority] = useState(DEFAULT_TICKET_PRIORITY);
  const [messageBody, setMessageBody] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const isOrderTracking = requiresOrder(category);

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors = {};

    if (!subject.trim()) {
      nextErrors.subject = "موضوع الزامی است";
    }
    if (!category) {
      nextErrors.category = "دسته‌بندی الزامی است";
    }
    if (!messageBody.trim()) {
      nextErrors.messageBody = "متن پیام الزامی است";
    }
    if (isOrderTracking && !orderId.trim()) {
      nextErrors.orderId = "شناسه سفارش الزامی است";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const resetForm = () => {
    setSubject("");
    setCategory(DEFAULT_TICKET_CATEGORY);
    setPriority(DEFAULT_TICKET_PRIORITY);
    setMessageBody("");
    setOrderId("");
    setOrderNumber("");
    setAttachmentFiles([]);
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      subject: subject.trim(),
      category,
      priority,
      body: messageBody.trim(),
      orderId: orderId.trim(),
      orderNumber: orderNumber.trim(),
      attachmentFiles,
    };

    const ok = await onSubmit?.(payload);
    if (ok) {
      resetForm();
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    clearError("category");
    if (!requiresOrder(nextCategory)) {
      clearError("orderId");
    }
  };

  const handleOrderNumberChange = (nextOrderId, nextOrderNumber = "") => {
    setOrderId(nextOrderId);
    setOrderNumber(nextOrderNumber);
    clearError("orderId");
    clearError("orderNumber");
  };

  const handleAttachmentChange = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) return;

    setAttachmentFiles((prev) => {
      const existingKeys = new Set(prev.map(ticketAttachmentKey));
      const nextFiles = [...prev];

      selectedFiles.forEach((file) => {
        const key = ticketAttachmentKey(file);
        if (!existingKeys.has(key)) {
          existingKeys.add(key);
          nextFiles.push(file);
        }
      });

      return nextFiles;
    });

    event.target.value = "";
  };

  const removeAttachment = (fileKey) => {
    setAttachmentFiles((prev) =>
      prev.filter((file) => ticketAttachmentKey(file) !== fileKey),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-custom-dark">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
          ایجاد تیکت جدید
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              موضوع <span className="text-red-500">*</span>
            </label>
            <input
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
                clearError("subject");
              }}
              disabled={loading}
              className={fieldClass(errors.subject)}
              placeholder="موضوع تیکت"
            />
            <FieldError message={errors.subject} />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              دسته‌بندی <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              className="mt-1"
              buttonClassName={[
                fieldClass(errors.category),
                "flex items-center justify-between gap-2 text-start",
              ].join(" ")}
                options={categoryOptions}
              value={category}
              onChange={handleCategoryChange}
              disabled={loading}
            />
            <FieldError message={errors.category} />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              اولویت
            </label>
            <CustomSelect
              className="mt-1"
              buttonClassName="w-full flex items-center justify-between gap-2 rounded-md border p-2 text-start text-sm dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200"
              options={TICKET_PRIORITIES}
              value={priority}
              onChange={setPriority}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              {isOrderTracking ? (
                <>
                  شناسه سفارش <span className="text-red-500">*</span>
                </>
              ) : (
                "شناسه سفارش (اختیاری)"
              )}
            </label>
            <OrderAutocomplete
              inputClassName={fieldClass(errors.orderId)}
              value={orderId}
              onChange={handleOrderNumberChange}
              disabled={loading}
              placeholder={
                isOrderTracking
                  ? "شماره سفارش یا نام کالا را جستجو کنید"
                  : "در صورت مرتبط بودن با سفارش، جستجو کنید"
              }
            />
            <FieldError message={errors.orderId} />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              متن پیام <span className="text-red-500">*</span>
            </label>
            <textarea
              value={messageBody}
              onChange={(event) => {
                setMessageBody(event.target.value);
                clearError("messageBody");
              }}
              disabled={loading}
              rows={4}
              className={[fieldClass(errors.messageBody), "p-3"].join(" ")}
              placeholder="متن تیکت را وارد کنید..."
            />
            <FieldError message={errors.messageBody} />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              پیوست‌ها{" "}
              <span className="text-xs text-gray-400 dark:text-gray-500">
                (اختیاری)
              </span>
            </label>

            <label
              htmlFor="ticket-attachments"
              className={[
                "mt-1 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-sm transition",
                "hover:border-primary hover:bg-primary/5 dark:border-gray-700 dark:bg-zinc-800/60 dark:hover:border-primary/80",
                loading ? "cursor-not-allowed opacity-60" : "",
              ].join(" ")}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm dark:bg-zinc-900">
                <i className="far fa-paperclip"></i>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-gray-800 dark:text-gray-200">
                  انتخاب فایل
                </span>
                <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                  {attachmentFiles.length > 0
                    ? `${new Intl.NumberFormat("fa-IR").format(attachmentFiles.length)} فایل انتخاب شده`
                    : "فایلی انتخاب نشده است"}
                </span>
              </span>
              <span className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-zinc-900 dark:text-gray-300">
                افزودن
              </span>
            </label>

            <input
              id="ticket-attachments"
              type="file"
              multiple
              disabled={loading}
              onChange={handleAttachmentChange}
              className="sr-only"
            />

            {attachmentFiles.length > 0 && (
              <ul className="mt-3 space-y-2">
                {attachmentFiles.map((file) => {
                  const fileKey = ticketAttachmentKey(file);

                  return (
                    <li
                      key={fileKey}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-zinc-900"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <i className="far fa-file"></i>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-gray-800 dark:text-gray-200">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </span>
                      </span>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => removeAttachment(fileKey)}
                        aria-label={`حذف ${file.name}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        <i className="far fa-xmark"></i>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-60 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-5 py-2 text-white transition duration-200 hover:bg-primary/90 active:scale-95 disabled:opacity-60"
            >
              {loading ? "در حال ایجاد..." : "ایجاد تیکت"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
