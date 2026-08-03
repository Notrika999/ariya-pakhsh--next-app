"use client";

const PENDING_PAYMENT_ORDER_KEY = "ariya:pending-payment-order";
const MAX_PENDING_PAYMENT_AGE_MS = 2 * 60 * 60 * 1000;

type PendingPaymentOrder = {
  orderId: string;
  orderNumber?: string;
  savedAt: number;
};

function readStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function rememberPendingPaymentOrder(
  orderId: string | null | undefined,
  orderNumber?: string | null,
) {
  const normalized = orderId?.trim();
  if (!normalized) return;

  const storage = readStorage();
  if (!storage) return;

  const payload: PendingPaymentOrder = {
    orderId: normalized,
    orderNumber: orderNumber?.trim() || undefined,
    savedAt: Date.now(),
  };

  storage.setItem(PENDING_PAYMENT_ORDER_KEY, JSON.stringify(payload));
}

export function getRememberedPendingPaymentOrder(): string | null {
  return getRememberedPendingPaymentOrderInfo()?.orderId ?? null;
}

export function getRememberedPendingPaymentOrderInfo(): PendingPaymentOrder | null {
  const storage = readStorage();
  if (!storage) return null;

  const raw = storage.getItem(PENDING_PAYMENT_ORDER_KEY);
  if (!raw) return null;

  try {
    const payload = JSON.parse(raw) as Partial<PendingPaymentOrder>;
    const orderId = payload.orderId?.trim();
    const savedAt = Number(payload.savedAt);

    if (!orderId || !Number.isFinite(savedAt)) {
      storage.removeItem(PENDING_PAYMENT_ORDER_KEY);
      return null;
    }

    if (Date.now() - savedAt > MAX_PENDING_PAYMENT_AGE_MS) {
      storage.removeItem(PENDING_PAYMENT_ORDER_KEY);
      return null;
    }

    return {
      orderId,
      orderNumber: payload.orderNumber?.trim() || undefined,
      savedAt,
    };
  } catch {
    storage.removeItem(PENDING_PAYMENT_ORDER_KEY);
    return null;
  }
}

export function clearRememberedPendingPaymentOrder() {
  const storage = readStorage();
  storage?.removeItem(PENDING_PAYMENT_ORDER_KEY);
}
