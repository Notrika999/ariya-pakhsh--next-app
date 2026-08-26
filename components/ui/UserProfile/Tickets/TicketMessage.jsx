"use client";
// components/ui/UserProfile/Tickets/TicketMessage.jsx
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import { FieldError, fieldClass } from "@/src/utils/form.validation";
import {
  closeTicket,
  getTicketById,
  sendTicketMessage,
} from "@/src/services/ticket/ticket.client";
import { getProductImage } from "@/src/utils/product-image";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import {
  formatTicketDate,
  getCategoryLabel,
  getPriorityMeta,
  getStatusMeta,
  isTicketClosed,
} from "@/src/lib/tickets/ticket-labels";
import { notify } from "@/src/utils/toast";
import { RETURN_REASONS } from "../OrdersReturn/formContent/ReturnReasons";

const formatAttachmentSize = (size) => {
  if (!Number.isFinite(size) || size <= 0) return "";
  if (size < 1024 * 1024) {
    return `${new Intl.NumberFormat("fa-IR").format(Math.ceil(size / 1024))} KB`;
  }

  return `${new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: 1,
  }).format(size / (1024 * 1024))} MB`;
};

const isImageAttachment = (attachment) =>
  attachment.contentType?.toLowerCase().startsWith("image/");

const RETURN_REASON_TITLE_BY_VALUE = new Map(
  RETURN_REASONS.map((reason) => [reason.value, reason.title]),
);

function formatTicketBody(body) {
  if (!body) return "";

  return body.replace(
    /(^|\n)(دلیل مرجوعی:\s*)([a-z_]+)(?=\n|$)/g,
    (match, lineStart, label, value) => {
      const title = RETURN_REASON_TITLE_BY_VALUE.get(value);
      return title ? `${lineStart}${label}${title}` : match;
    },
  );
}

function ticketTimelineStepMeta(status) {
  if (status === "current") {
    return {
      icon: "far fa-clock",
      iconClassName:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      lineClassName: "bg-yellow-200 dark:bg-yellow-900/60",
    };
  }

  if (status === "pending") {
    return {
      icon: "far fa-hourglass",
      iconClassName:
        "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
      lineClassName: "bg-gray-200 dark:bg-gray-700",
    };
  }

  return {
    icon: "far fa-check",
    iconClassName:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    lineClassName: "bg-green-200 dark:bg-green-900/60",
  };
}

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

    } catch (err) {
      console.error("[TicketMessage] loadTicket failed =>", err);
      setError(getAuthErrorMessage(err));
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <div className="space-y-4 lg:col-span-3">
        <div className="rounded-2xl bg-white p-8 text-center text-gray-500 drop-shadow-lg dark:bg-custom-dark">
          در حال بارگذاری تیکت...
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-4 lg:col-span-3">
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
    <div className="space-y-4 lg:col-span-3">
      <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
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

      <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <TitleAfter title="روند تیکت" />
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max items-start gap-3 pt-2 sm:min-w-0 sm:gap-0">
            {timeline.map((step, index) => {
              const meta = ticketTimelineStepMeta(step.status);
              const isLast = index === timeline.length - 1;

              return (
                <div
                  key={step.id}
                  className="relative flex w-40 shrink-0 flex-col items-center text-center sm:w-auto sm:flex-1"
                >
                  {!isLast ? (
                    <div
                      className={`absolute right-1/2 top-6 hidden h-0.5 w-full translate-x-6 sm:block ${meta.lineClassName}`}
                    />
                  ) : null}

                  <div
                    className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ${meta.iconClassName}`}
                  >
                    <i className={`${meta.icon} text-lg`}></i>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-gray-800 dark:text-gray-200">
                    {step.title}
                  </h3>
                  <span className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    {step.date}
                  </span>
                  <span className="mt-1 max-w-36 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    {step.desc}
                  </span>
                </div>
              );
            })}
            </div>
          </div>
        </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
            <TitleAfter title="مکالمات تیکت" />

            <div className="space-y-2">
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
                          {formatTicketBody(msg.body)}
                        </p>
                        {msg.attachments.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {msg.attachments.map((attachment) => {
                              const attachmentUrl = getProductImage(
                                attachment.url,
                              );
                              const attachmentSize = formatAttachmentSize(
                                attachment.fileSizeBytes,
                              );

                              if (isImageAttachment(attachment)) {
                                return (
                                  <a
                                    key={attachment.id}
                                    href={attachmentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:border-primary dark:border-gray-700 dark:bg-zinc-900"
                                  >
                                    <Image
                                      src={attachmentUrl}
                                      alt={attachment.fileName || "پیوست تیکت"}
                                      width={180}
                                      height={180}
                                      sizes="(min-width: 640px) 180px, 50vw"
                                      className="aspect-square w-full object-cover"
                                      loading="lazy"
                                    />
                                    <span className="block truncate border-t border-gray-100 px-2 py-1.5 text-xs text-gray-600 group-hover:text-primary dark:border-gray-800 dark:text-gray-300">
                                      {attachment.fileName || "پیوست"}
                                    </span>
                                  </a>
                                );
                              }

                              return (
                                <a
                                  key={attachment.id}
                                  href={attachmentUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 transition hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-zinc-900 dark:text-gray-300"
                                >
                                  <i className="far fa-file"></i>
                                  <span className="min-w-0 flex-1 truncate">
                                    {attachment.fileName || "پیوست"}
                                  </span>
                                  {attachmentSize && (
                                    <span className="shrink-0 text-gray-400">
                                      {attachmentSize}
                                    </span>
                                  )}
                                </a>
                              );
                            })}
                          </div>
                        )}
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

        <div className="space-y-4">
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
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {label}
                  </span>
                  <span className="text-end font-semibold text-gray-800 dark:text-gray-200 text-xs">
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
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  شناسه سفارش
                </span>
                <span
                  className="font-semibold text- text-gray-800 dark:text-gray-200"
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
