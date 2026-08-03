const RETURN_WINDOW_DAYS = 7;
const RETURN_WINDOW_MS = RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000;

type ReturnEligibleOrder = {
  statusKey?: string | null;
  statusTitleFa?: string | null;
  fulfillmentStatusKey?: string | null;
  fulfillmentStatusTitleFa?: string | null;
  createdAt?: string | null;
};

function normalize(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isDeliveredOrder(order: ReturnEligibleOrder | null | undefined) {
  const statusKey = normalize(order?.statusKey);
  const fulfillmentStatusKey = normalize(order?.fulfillmentStatusKey);
  const statusTitle = String(order?.statusTitleFa ?? "");
  const fulfillmentTitle = String(order?.fulfillmentStatusTitleFa ?? "");

  return (
    statusKey === "order.delivered" ||
    statusKey.includes("delivered") ||
    fulfillmentStatusKey.includes("delivered") ||
    statusTitle.includes("تحویل") ||
    fulfillmentTitle.includes("تحویل")
  );
}

export function isInsideReturnWindow(
  createdAt: string | null | undefined,
  now = new Date(),
) {
  const createdDate = parseDate(createdAt);
  if (!createdDate) return false;

  const elapsed = now.getTime() - createdDate.getTime();
  return elapsed >= 0 && elapsed < RETURN_WINDOW_MS;
}

export function canRequestReturnForOrder(
  order: ReturnEligibleOrder | null | undefined,
  now = new Date(),
) {
  return isDeliveredOrder(order) && isInsideReturnWindow(order?.createdAt, now);
}

