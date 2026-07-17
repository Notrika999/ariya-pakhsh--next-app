"use client";
// components/ui/UserProfile/Tickets/TicketMessage.jsx
import { useCallback, useEffect, useState } from "react";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import { FieldError, fieldClass } from "@/src/utils/form.validation";
import {
  closeTicket,
  getTicketById,
  sendTicketMessage,
} from "@/src/services/ticket/ticket.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import {
  formatTicketDate,
  getCategoryLabel,
  getPriorityMeta,
  getStatusMeta,
  isTicketClosed,
} from "@/src/lib/tickets/ticket-labels";
import { notify } from "@/src/utils/toast";

export default function TicketMessage({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState("");
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);

  const loadTicket = useCallback(async () => {
    if (!ticketId) return;
    setLoading(true);
    setError(null);

    try {
      const result = await getTicketById(ticketId);
      setTicket(result);

      console.log("[TicketMessage] ticket =>", result);
    } catch (err) {
      console.error("[TicketMessage] loadTicket failed =>", err);
      setError(getAuthErrorMessage(err));
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    void loadTicket();
  }, [loadTicket]);

  const handleReplySubmit = async (event) => {
    event.preventDefault();
    if (!ticketId) return;

    if (!replyText.trim()) {
      setReplyError("متن پاسخ الزامی است");
      return;
    }

    setReplyError("");
    setSending(true);
    try {
      await sendTicketMessage(ticketId, { body: replyText.trim() });
      notify.success("پیام ارسال شد");
      setReplyText("");
      await loadTicket();
    } catch (err) {
      console.error("[TicketMessage] send message failed =>", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!ticketId || closing) return;

    setClosing(true);
    try {
      await closeTicket(ticketId);
      notify.success("تیکت بسته شد");
      await loadTicket();
    } catch (err) {
      console.error("[TicketMessage] close ticket failed =>", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 lg:col-span-3">
        <div className="rounded-2xl bg-white p-8 text-center text-gray-500 drop-shadow-lg dark:bg-custom-dark">
          در حال بارگذاری تیکت...
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-8 lg:col-span-3">
        <div className="rounded-2xl bg-white p-8 text-center drop-shadow-lg dark:bg-custom-dark">
          <p className="mb-4 text-red-500">{error || "تیکت پیدا نشد"}</p>
          {onBack && (
            <button
              onClick={onBack}
              className="rounded-lg bg-gray-200 px-4 py-2 dark:bg-gray-700 dark:text-gray-200"
            >
              بازگشت
            </button>
          )}
        </div>
      </div>
    );
  }

  const statusMeta = getStatusMeta(ticket.status);
  const priorityMeta = getPriorityMeta(ticket.priority);
  const closed = isTicketClosed(ticket.status);

  const timeline = [
    {
      id: 1,
      title: "تیکت ایجاد شد",
      date: formatTicketDate(ticket.createdAt),
      desc: "تیکت شما با موفقیت ثبت شد",
      status: "done",
    },
    {
      id: 2,
      title: "در حال بررسی",
      date: formatTicketDate(ticket.lastMessageAt || ticket.createdAt),
      desc: ticket.assignedToDisplayName
        ? `ارجاع به ${ticket.assignedToDisplayName}`
        : "تیکت در صف پشتیبانی است",
      status: closed ? "done" : "current",
    },
    {
      id: 3,
      title: "بسته شدن تیکت",
      date: ticket.closedAt ? formatTicketDate(ticket.closedAt) : "در انتظار",
      desc: closed ? "تیکت بسته شده است" : "پس از حل مشکل تیکت بسته خواهد شد",
      status: closed ? "done" : "pending",
    },
  ];

  return (
    <div className="space-y-8 lg:col-span-3">
      <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <TitleAfter
              title={`تیکت پشتیبانی #${ticket.ticketNumber || ticket.id.slice(0, 8)}`}
            />
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {ticket.subject}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 md:mt-0">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.color}`}
            >
              {statusMeta.label}
            </span>
            {onBack && (
              <button
                onClick={onBack}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-900 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                بازگشت به لیست تیکت‌ها
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <TitleAfter title="روند تیکت" />
        <div className="space-y-8">
          {timeline.map((step) => (
            <div key={step.id} className="flex items-start space-x-4">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  step.status === "done"
                    ? "bg-green-500"
                    : step.status === "current"
                      ? "bg-yellow-500"
                      : "bg-gray-300"
                }`}
              >
                {step.status === "done" && (
                  <i className="far fa-check text-white"></i>
                )}
                {step.status === "current" && (
                  <i className="far fa-clock text-white"></i>
                )}
                {step.status === "pending" && (
                  <i className="far fa-hourglass text-white"></i>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    {step.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {step.date}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
            <TitleAfter title="مکالمات تیکت" />

            <div className="space-y-6">
              {ticket.messages.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  هنوز پیامی ثبت نشده است.
                </p>
              )}

              {ticket.messages.map((msg) => {
                const isCustomer = msg.senderType === "customer";
                return (
                  <div key={msg.id} className="flex items-start space-x-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        isCustomer
                          ? "bg-blue-100 dark:bg-blue-900"
                          : "bg-green-100 dark:bg-green-900"
                      }`}
                    >
                      <i
                        className={`${
                          isCustomer
                            ? "far fa-user text-blue-600 dark:text-blue-400"
                            : "far fa-headset text-green-600 dark:text-green-400"
                        }`}
                      ></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">
                          {msg.senderDisplayName ||
                            (isCustomer ? "شما" : "پشتیبانی")}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTicketDate(msg.createdAt)}
                        </span>
                      </div>
                      <div
                        className={`mt-2 rounded-lg p-4 ${
                          isCustomer
                            ? "bg-gray-50 dark:bg-zinc-800"
                            : "bg-blue-50 dark:bg-blue-900/20"
                        }`}
                      >
                        <p className="whitespace-pre-line text-sm text-gray-800 dark:text-gray-200">
                          {msg.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!closed && (
              <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                <h3 className="mb-4 font-medium text-gray-800 dark:text-gray-200">
                  پاسخ جدید
                </h3>
                <form onSubmit={handleReplySubmit} noValidate>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    متن پاسخ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    value={replyText}
                    onChange={(e) => {
                      setReplyText(e.target.value);
                      if (replyError) setReplyError("");
                    }}
                    disabled={sending}
                    className={[fieldClass(Boolean(replyError)), "mb-1 p-3"].join(
                      " ",
                    )}
                    placeholder="پیام خود را اینجا بنویسید..."
                  />
                  <FieldError message={replyError} />
                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={sending}
                      className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition duration-200 hover:bg-primary/90 active:scale-95 disabled:opacity-60"
                    >
                      {sending ? "در حال ارسال..." : "ارسال پاسخ"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
            <TitleAfter title="اطلاعات تیکت" />
            <div className="space-y-4">
              {[
                [
                  "شماره تیکت",
                  `#${ticket.ticketNumber || ticket.id.slice(0, 8)}`,
                ],
                ["دسته‌بندی", getCategoryLabel(ticket.category)],
                ["اولویت", priorityMeta.label],
                ["تاریخ ایجاد", formatTicketDate(ticket.createdAt)],
                [
                  "آخرین بروزرسانی",
                  formatTicketDate(ticket.lastMessageAt || ticket.createdAt),
                ],
                [
                  "کارشناس پاسخگو",
                  ticket.assignedToDisplayName || "هنوز تخصیص داده نشده",
                ],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className={`flex items-center justify-between gap-3 ${
                    index === 5
                      ? "border-t border-gray-200 pt-4 dark:border-gray-700"
                      : ""
                  }`}
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {label}
                  </span>
                  <span className="text-end font-medium text-gray-800 dark:text-gray-200">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {ticket.orderId && (
            <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
              <TitleAfter title="سفارش مرتبط" />
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600 dark:text-gray-400">
                  شناسه سفارش
                </span>
                <span
                  className="font-medium text-gray-800 dark:text-gray-200"
                  dir="ltr"
                >
                  {ticket.orderNumber}
                </span>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
            <TitleAfter title="عملیات تیکت" />
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleCloseTicket}
                disabled={closed || closing}
                className="flex w-full items-center justify-center rounded-lg border border-red-300 px-4 py-3 text-red-600 transition duration-200 hover:bg-red-50 active:scale-95 disabled:opacity-60 dark:hover:bg-red-900/20"
              >
                {closing
                  ? "در حال بستن..."
                  : closed
                    ? "تیکت بسته شده است"
                    : "بستن تیکت"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
