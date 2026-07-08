"use client";
// components/modules/CreateTicketModal/CreateTicketModal.jsx
import { useState } from "react";
import {
  DEFAULT_TICKET_CATEGORY,
  DEFAULT_TICKET_PRIORITY,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
} from "@/src/lib/tickets/ticket-labels";
import { FieldError, fieldClass } from "@/src/utils/form.validation";

export default function CreateTicketModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(DEFAULT_TICKET_CATEGORY);
  const [priority, setPriority] = useState(DEFAULT_TICKET_PRIORITY);
  const [messageBody, setMessageBody] = useState("");
  const [orderId, setOrderId] = useState("");
  const [errors, setErrors] = useState({});

  const isOrderTracking =
    category === DEFAULT_TICKET_CATEGORY ||
    category === "paymentIssue" ||
    category === "returnRequest" ||
    category === "damageProduct" ||
    category === "shippingDelay";

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
      orderId: orderId.trim() || undefined,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-custom-dark">
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
            <select
              value={category}
              onChange={(event) => {
                const nextCategory = event.target.value;
                setCategory(nextCategory);
                clearError("category");
                if (
                  nextCategory !== DEFAULT_TICKET_CATEGORY ||
                  nextCategory !== "paymentIssue" ||
                  nextCategory !== "returnRequest" ||
                  nextCategory !== "damageProduct" ||
                  nextCategory !== "shippingDelay"
                ) {
                  clearError("orderId");
                }
              }}
              disabled={loading}
              className={fieldClass(errors.category)}
            >
              {TICKET_CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <FieldError message={errors.category} />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              اولویت
            </label>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              disabled={loading}
              className="mt-1 w-full rounded-md border p-2 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200"
            >
              {TICKET_PRIORITIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
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
            <input
              value={orderId}
              onChange={(event) => {
                setOrderId(event.target.value);
                clearError("orderId");
              }}
              disabled={loading}
              className={fieldClass(errors.orderId)}
              placeholder={
                isOrderTracking
                  ? "شناسه سفارش را وارد کنید"
                  : "در صورت مرتبط بودن با سفارش"
              }
              dir="ltr"
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
