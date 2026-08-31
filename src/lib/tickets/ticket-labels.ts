

import type {
  TicketCategory,
  TicketCategoryDefinition,
  TicketPriority,
  TicketRequiredField,
  TicketStatus,
} from "@/src/lib/types/tickets/ticket.types";

const ORDER_NUMBER_FIELD: TicketRequiredField = {
  name: "orderNumber",
  label: "شماره سفارش",
  fieldType: "orderNumber",
};

const CATEGORY_ALIASES: Record<string, TicketCategory> = {
  cancel: "cancelRequest",
  cancell: "cancelRequest",
  cancellrequest: "cancelRequest",
  cancelrequest: "cancelRequest",
  damageproduct: "damagedProduct",
  damagedproduct: "damagedProduct",
};

/**
 * fallback وقتی API دسته‌ها در دسترس نیست.
 * منبع اصلی: GET /Tickets/categories
 */
export const TICKET_CATEGORIES: Array<{
  value: TicketCategory;
  label: string;
}> = [
  { value: "orderTracking", label: "پیگیری سفارش" },
  { value: "paymentIssue", label: "مشکل پرداخت" },
  { value: "returnRequest", label: "درخواست مرجوعی" },
  { value: "cancelRequest", label: "لغو سفارش" },
  { value: "damagedProduct", label: "محصول آسیب‌دیده" },
  { value: "shippingDelay", label: "تاخیر ارسال" },
  { value: "changeAddress", label: "تغییر آدرس" },
  { value: "prePurchaseConsultation", label: "مشاوره پیش از خرید" },
  { value: "other", label: "سایر" },
];

const ORDER_REQUIRED_FALLBACK = new Set([
  "orderTracking",
  "paymentIssue",
  "returnRequest",
  "cancelRequest",
  "damagedProduct",
  "shippingDelay",
  "changeAddress",
]);

export const ORDER_ITEM_TICKET_CATEGORIES = ["returnRequest", "cancelRequest"];

export const DEFAULT_TICKET_CATEGORY: TicketCategory = "orderTracking";
export const DEFAULT_TICKET_PRIORITY: TicketPriority = "low";

export function normalizeTicketCategoryKey(category: string): string {
  const value = category?.trim() ?? "";
  if (!value) return value;
  return CATEGORY_ALIASES[value.toLowerCase()] ?? value;
}

export function fallbackTicketCategoryDefinitions(): TicketCategoryDefinition[] {
  return TICKET_CATEGORIES.map((item) => ({
    category: item.value,
    categoryLabel: item.label,
    requiredFields: ORDER_REQUIRED_FALLBACK.has(item.value)
      ? [ORDER_NUMBER_FIELD]
      : [],
  }));
}

export function ticketCategoryRequiresOrder(
  definition?: TicketCategoryDefinition | null,
  category?: string,
): boolean {
  if (definition) {
    return definition.requiredFields.some((field) => {
      const name = String(field.name ?? "").toLowerCase();
      const fieldType = String(field.fieldType ?? "").toLowerCase();
      return (
        name === "ordernumber" ||
        name === "orderid" ||
        fieldType === "ordernumber" ||
        fieldType === "orderid"
      );
    });
  }

  return ORDER_REQUIRED_FALLBACK.has(normalizeTicketCategoryKey(category ?? ""));
}

export function resolveTicketCategoryLabel(
  category: string,
  apiLabel?: string | null,
): string {
  const normalized = normalizeTicketCategoryKey(category);
  const fallback =
    TICKET_CATEGORIES.find((item) => item.value === normalized)?.label ??
    category;
  const label = String(apiLabel ?? "").trim();
  if (!label) return fallback;
  if (/[\u0600-\u06FF]/.test(label)) return label;
  return fallback;
}

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
  return resolveTicketCategoryLabel(category);
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
