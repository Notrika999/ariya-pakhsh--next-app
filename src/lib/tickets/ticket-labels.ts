import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/src/lib/types/tickets/ticket.types";

/**
 * فقط مقادیری که با enum بک‌اند یکی هستند.
 * نمونه معتبر از API: orderTracking
 * مقادیر نامعتبر (مثل technical) کل مدل را fail می‌کنند و body هم required دیده می‌شود.
 */
export const TICKET_CATEGORIES: Array<{
  value: TicketCategory;
  label: string;
}> = [
  { value: "orderTracking", label: "پیگیری سفارش" },
  { value: "paymentIssue", label: "مشکل پرداخت" },
  { value: "returnRequest", label: "درخواست مرجوعی" },
  { value: "cancell", label: "لغو سفارش" },
  { value: "damageProduct", label: "محصول آسیب دیده" },
  { value: "shippingDelay", label: "تاخیر ارسال" },
  { value: "changeAddress", label: "تغییر آدرس" },
  { value: "prePurchaseConsultation", label: "مشاروه پیش از خرید" },
  { value: "other", label: "سایر" },
];

export const DEFAULT_TICKET_CATEGORY: TicketCategory = "orderTracking";
export const DEFAULT_TICKET_PRIORITY: TicketPriority = "low";

export const TICKET_PRIORITIES: Array<{
  value: TicketPriority;
  label: string;
}> = [
  { value: "low", label: "کم" },
  { value: "normal", label: "متوسط" },
  { value: "high", label: "بالا" },
  { value: "urgent", label: "فوری" },
];

export function getCategoryLabel(category: string): string {
  return (
    TICKET_CATEGORIES.find((item) => item.value === category)?.label ?? category
  );
}

export function getPriorityMeta(priority: string): {
  label: string;
  color: string;
} {
  switch (priority) {
    case "urgent":
      return {
        label: "فوری",
        color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
      };
    case "high":
      return {
        label: "بالا",
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
      };
    case "medium":
      return {
        label: "متوسط",
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
      };
    case "low":
    default:
      return {
        label: "کم",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
      };
  }
}

export function getStatusMeta(status: string): {
  label: string;
  color: string;
} {
  switch (status) {
    case "closed":
      return {
        label: "بسته شده",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      };
    case "answered":
      return {
        label: "پاسخ داده شده",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
      };
    case "pending":
      return {
        label: "در حال بررسی",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
      };
    case "open":
    default:
      return {
        label: "باز",
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
      };
  }
}

export function formatTicketDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function isTicketClosed(status: TicketStatus): boolean {
  return status === "closed";
}
