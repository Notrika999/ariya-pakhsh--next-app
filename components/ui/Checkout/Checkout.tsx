"use client";
// components/ui/Checkout/Checkout.tsx
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import GatewayRedirectConfirmation from "@/components/modules/GatewayRedirectConfirmation/GatewayRedirectConfirmation";
import CartSynchronizationModal from "@/components/ui/Cart/CartSynchronizationModal";
import { useCartSynchronization } from "@/components/ui/Cart/useCartSynchronization";
=======
import { useCallback, useEffect, useMemo, useState } from "react";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import GatewayRedirectConfirmation from "@/components/modules/GatewayRedirectConfirmation/GatewayRedirectConfirmation";
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
import CheckoutDeliveryAddress from "./CheckoutDeliveryAddress";
import { useCart } from "@/src/context/CartContext";
import type { CartItem } from "@/src/lib/types/cart/cartTypes";
import type { CustomerAddressDto } from "@/src/lib/types/address/address.type";
import type {
  CheckoutCouponDiscount,
  CheckoutCouponPayload,
  CheckoutGatewayFee,
  CheckoutPaymentMethod,
<<<<<<< HEAD
  PendingCheckoutOrder,
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  CheckoutShippingGroupItem,
  CheckoutShippingMethod,
  CheckoutShippingOptionsResult,
  PlaceOrderShippingAddress,
  PlaceOrderShippingSelection,
} from "@/src/lib/types/checkout/checkout.types";
import {
  applyCheckoutCoupon,
  ensureServerCartHasItems,
<<<<<<< HEAD
  getPendingCheckoutOrder,
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  getCheckoutPaymentMethods,
  placeCheckoutOrder,
  previewCheckoutDiscount,
  startOrderPayment,
} from "@/src/services/checkout/checkout.client";
<<<<<<< HEAD
import {
  cancelMyOrder,
  retryMyOrderPayment,
} from "@/src/services/orders/orders.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { resolveCustomerAddressLocationIds } from "@/src/services/location/location.client";
import { getProductImage } from "@/src/utils/product-image";
import { notify } from "@/src/utils/toast";
import { rememberPendingPaymentOrder } from "@/src/utils/paymentRetryStorage";
import { useCurrentUser } from "@/src/lib/stores/auth/auth.store";
=======
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";
import { rememberPendingPaymentOrder } from "@/src/utils/paymentRetryStorage";
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

const formatMoney = (value: number) =>
  `${new Intl.NumberFormat("fa-IR").format(Math.max(0, Math.round(value)))} تومان`;

const formatShippingPrice = (method: CheckoutShippingMethod) =>
  method.formattedPrice ??
  (method.price > 0 ? formatMoney(method.price) : "رایگان");

const GATEWAY_REDIRECT_SECONDS = 30;

function getRenderableImageSrc(value?: string | null): string | null {
  const src = value?.trim();
  if (!src) return null;
  if (src.startsWith("/") || /^https?:\/\//i.test(src)) return src;
  return null;
}

type PendingGatewayPayment = {
  orderId?: string;
  orderNumber?: string;
  providerCode?: string;
  directPaymentUrl?: string;
  paymentMethodTitle: string;
  isGiftCardPayment: boolean;
  isInstallmentPayment: boolean;
  addressTitle: string;
  itemCount: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  payableAmount: number;
  gatewayFee: CheckoutGatewayFee | null;
};

<<<<<<< HEAD
function formatPendingExpiresAt(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatRemainingTime(remainingSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(remainingSeconds));
  const totalMinutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formatter = new Intl.NumberFormat("fa-IR", {
    minimumIntegerDigits: 2,
  });

  if (hours > 0) {
    return `${formatter.format(hours)}:${formatter.format(minutes)}:${formatter.format(seconds)}`;
  }

  return `${formatter.format(minutes)}:${formatter.format(seconds)}`;
}

=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
function isGiftCardPaymentMethod(
  method: CheckoutPaymentMethod | null,
): boolean {
  if (!method) return false;

  const value = `${method.code} ${method.title}`.toLowerCase();
  return (
    value.includes("gift") ||
    value.includes("giftcard") ||
    value.includes("gift-card") ||
    value.includes("gift_card") ||
    value.includes("کارت هدیه")
  );
}

function isInstallmentPaymentMethod(
  method: CheckoutPaymentMethod | null,
): boolean {
  if (!method) return false;

  const value =
    `${method.code} ${method.title} ${method.description}`.toLowerCase();
  return (
    method.code === "installment_provider" ||
    value.includes("installment") ||
    value.includes("اقساط") ||
    method.providers.some((provider) => provider.gatewayType === "installment")
  );
}

function toShippingAddress(
  address: CustomerAddressDto,
<<<<<<< HEAD
  userEmail: string,
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
): PlaceOrderShippingAddress {
  return {
    countryCode: "IR",
    countryName: "ایران",
    state: address.province,
    city: address.city,
<<<<<<< HEAD
    provinceId: address.provinceId,
    cityId: address.cityId,
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    postalCode: address.postalCode,
    addressLine: address.addressLine,
    recipientFirstName: address.receiverFirstName,
    recipientLastName: address.receiverLastName,
    mobile: address.receiverMobile,
<<<<<<< HEAD
    phone: address.receiverMobile,
    email: userEmail.trim(),
    latitude: address.latitude,
    longitude: address.longitude,
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  };
}

const SHIPPING_ICON_STYLES = [
  {
    wrap: "bg-green-100 dark:bg-green-900/20",
    icon: "far fa-truck text-green-600 dark:text-green-400",
  },
  {
    wrap: "bg-primary-100 dark:bg-zinc-800",
    icon: "far fa-truck text-primary-600 dark:text-primary-400",
  },
  {
    wrap: "bg-purple-100 dark:bg-purple-900/20",
    icon: "far fa-paper-plane -rotate-45 text-purple-600 dark:text-purple-400 text-lg",
  },
] as const;

const PAYMENT_ICON_STYLES = [
  {
    wrap: "bg-primary-100 dark:bg-zinc-800",
    icon: "far fa-lock text-primary-600 dark:text-primary-400",
  },
  {
    wrap: "bg-green-100 dark:bg-green-900/20",
    icon: "far fa-money-bills text-green-600 dark:text-green-400",
  },
  {
    wrap: "bg-orange-100 dark:bg-orange-900/20",
    icon: "far fa-money-bills text-orange-600 dark:text-orange-400",
  },
] as const;

const BANK_GATEWAY_ICON_STYLE = {
  wrap: "bg-primary-100 dark:bg-zinc-800",
  icon: "far fa-building-columns text-primary-600 dark:text-primary-400 text-xl",
} as const;

type ShippingClassGroup = {
  key: string;
  title: string;
  totalWeightGrams: number;
  itemCount: number;
  items: CheckoutShippingGroupItem[];
  methods: CheckoutShippingMethod[];
};

function getCartItemUnitPrice(item: CartItem): number {
  return item.unitPrice ?? item.price;
}

function getCartItemLineTotal(item: CartItem): number {
  return item.price * item.quantity;
}

function findCartItemForShippingItem(
  shippingItem: CheckoutShippingGroupItem,
  cartItems: CartItem[],
): CartItem | undefined {
  const productId = shippingItem.productId.trim();
  return cartItems.find((item) => {
    if (productId && item.productId === productId) return true;
    return item.title.trim() === shippingItem.productName.trim();
  });
}

function normalizeTitleTokens(value: string): string[] {
  return value
    .replace(/[ـ‌\u200c]/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function isRepeatedTitlePart(base: string, candidate: string): boolean {
  const baseTokens = new Set(normalizeTitleTokens(base));
  const candidateTokens = normalizeTitleTokens(candidate);

  return (
    candidateTokens.length > 0 &&
    candidateTokens.every((token) => baseTokens.has(token))
  );
}

function formatCheckoutItemTitle(title: string): string {
  const parts = title
    .split(/\s*[—–-]\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) return title;

  const longestPart = parts.reduce((longest, part) =>
    part.length > longest.length ? part : longest,
  );
  const hasRepeatedPart = parts.some(
    (part) => part !== longestPart && isRepeatedTitlePart(longestPart, part),
  );

  return hasRepeatedPart ? longestPart : title;
}

function getCheckoutItemColorLabel(item: CheckoutShippingGroupItem): string {
  return item.productColorName?.trim() || item.productColorHex?.trim() || "";
}

function isBankGatewayPaymentMethod(method: CheckoutPaymentMethod): boolean {
  if (isGiftCardPaymentMethod(method)) return false;

  const value =
    `${method.code} ${method.title} ${method.description}`.toLowerCase();
  return (
    method.providers.length > 0 ||
    value.includes("gateway") ||
    value.includes("online") ||
    value.includes("bank") ||
    value.includes("درگاه") ||
    value.includes("آنلاین") ||
    value.includes("بانک")
  );
}

<<<<<<< HEAD
function PendingPaymentWarning({
  order,
  loading,
  action,
  onPay,
  onCancel,
}: {
  order: PendingCheckoutOrder;
  loading: boolean;
  action: "pay" | "cancel" | null;
  onPay: () => void;
  onCancel: () => void;
}) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    order.remainingSeconds,
  );
  const items = order.items;
  const visibleItems = items.slice(0, 4);
  const hiddenItemsCount = Math.max(0, items.length - visibleItems.length);

  useEffect(() => {
    const intervalId = window.setInterval(
      () => setRemainingSeconds((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="mb-6 rounded-2xl border-2 border-red-700 bg-white p-4 text-red-800 dark:border-red-500 dark:bg-custom-dark dark:text-red-300 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-red-700 text-white dark:bg-red-500">
            <i className="fa-solid fa-info text-sm"></i>
          </span>
          <div>
            <h2 className="text-lg font-black sm:text-xl">
              {order.displayStatus || "در انتظار پرداخت"}
            </h2>
            <p className="mt-1 text-sm font-bold">
              سفارش شما ثبت نهایی نشده
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-red-500">
          <i className="far fa-clock text-2xl"></i>
          <span className="text-xl font-black" dir="ltr">
            {formatRemainingTime(remainingSeconds)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {visibleItems.length ? (
              <>
                {visibleItems.map((item) => (
                  <div
                    key={item.orderItemId}
                    className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-900 sm:size-20"
                    title={item.productTitle || "محصول"}
                  >
                    <Image
                      src={getProductImage(item.imageUrl)}
                      alt={item.productTitle || "محصول"}
                      width={80}
                      height={80}
                      unoptimized
                      className="h-[85%] w-[85%] object-contain"
                    />
                  </div>
                ))}
                {hiddenItemsCount > 0 ? (
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-black text-gray-700 dark:bg-zinc-900 dark:text-gray-200 sm:size-20">
                    +{new Intl.NumberFormat("fa-IR").format(hiddenItemsCount)}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex size-16 items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-900 sm:size-20">
                <Image
                  src="/images/default.png"
                  alt="محصول"
                  width={80}
                  height={80}
                  className="h-[85%] w-[85%] object-contain"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 dark:text-gray-300 sm:grid-cols-2">
            <span>
              کد سفارش:{" "}
              <b className="text-gray-900 dark:text-gray-100">
                {order.publicOrderNumber || order.orderId}
              </b>
            </span>
            <span>
              انقضا:{" "}
              <b className="text-gray-900 dark:text-gray-100">
                {formatPendingExpiresAt(order.expiresAt)}
              </b>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(180px,1fr)_auto] lg:min-w-[520px]">
          <div className="flex items-center text-xl font-black text-gray-900 dark:text-gray-100">
            {formatMoney(order.payableAmount)}
          </div>
          <div className="flex flex-wrap gap-3 sm:min-w-80 sm:justify-end">
            {order.allowedActions.canCancel ? (
              <button
                type="button"
                disabled={loading || Boolean(action)}
                onClick={onCancel}
                className="min-w-28 flex-1 rounded-xl border border-red-300 px-4 py-4 font-black text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950/30"
              >
                {action === "cancel" ? "در حال لغو..." : "لغو سفارش"}
              </button>
            ) : null}
            {order.allowedActions.canContinuePayment ? (
              <button
                type="button"
                disabled={loading || Boolean(action)}
                onClick={onPay}
                className="min-w-40 flex-1 rounded-xl bg-red-600 px-4 py-4 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {action === "pay" ? "در حال انتقال..." : "ادامه پرداخت"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const router = useRouter();
  const currentUser = useCurrentUser();
=======
export default function Checkout() {
  const router = useRouter();
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  const {
    items,
    totalItems,
    totalPrice,
    loading: cartLoading,
    syncing: cartSyncing,
    clearCart,
<<<<<<< HEAD
    refreshCart,
  } = useCart();
  const cartSync = useCartSynchronization({
    enabled: !cartLoading && !cartSyncing && items.length > 0,
    refreshCart,
    autoCheck: false,
  });
=======
  } = useCart();
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

  const [selectedAddress, setSelectedAddress] =
    useState<CustomerAddressDto | null>(null);
  const [customerNote, setCustomerNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null,
  );
  const [couponDiscount, setCouponDiscount] =
    useState<CheckoutCouponDiscount | null>(null);
  const [couponApplying, setCouponApplying] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState("");

  const [paymentMethods, setPaymentMethods] = useState<CheckoutPaymentMethod[]>(
    [],
  );
  const [shippingOptionsResult, setShippingOptionsResult] =
    useState<CheckoutShippingOptionsResult | null>(null);
  const [selectedPaymentCode, setSelectedPaymentCode] = useState<string | null>(
    null,
  );
  const [selectedProviderCode, setSelectedProviderCode] = useState<
    string | null
  >(null);
  const [selectedShippingIdsByClass, setSelectedShippingIdsByClass] = useState<
    Record<string, string>
  >({});
  const [summaryStickyTop, setSummaryStickyTop] = useState(24);
  const [submitting, setSubmitting] = useState(false);
  const [pendingGatewayPayment, setPendingGatewayPayment] =
    useState<PendingGatewayPayment | null>(null);
  const [gatewayStarting, setGatewayStarting] = useState(false);
<<<<<<< HEAD
  const [pendingPaymentOrder, setPendingPaymentOrder] =
    useState<PendingCheckoutOrder | null>(null);
  const [pendingPaymentLoading, setPendingPaymentLoading] = useState(true);
  const [pendingPaymentError, setPendingPaymentError] = useState<string | null>(
    null,
  );
  const [pendingPaymentAction, setPendingPaymentAction] = useState<
    "pay" | "cancel" | null
  >(null);
  const gatewayEntryFailureHandledRef = useRef(false);

  const handleGatewayEntryFailure = useCallback(
    (message: string) => {
      if (gatewayEntryFailureHandledRef.current) return;

      gatewayEntryFailureHandledRef.current = true;
      notify.error(message);
      setPendingGatewayPayment(null);
      setGatewayStarting(false);
      setPendingPaymentAction(null);
      router.replace("/");
    },
    [router],
  );

  const loadPendingPaymentOrder = useCallback(async () => {
    setPendingPaymentLoading(true);
    setPendingPaymentError(null);
    try {
      const order = await getPendingCheckoutOrder();
      setPendingPaymentOrder(order);
    } catch (err) {
      // console.error("[Checkout] load pending payment order failed =>", err);
      setPendingPaymentError(getAuthErrorMessage(err));
    } finally {
      setPendingPaymentLoading(false);
    }
  }, []);
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

  const selectPaymentMethod = (method: CheckoutPaymentMethod) => {
    setSelectedPaymentCode(method.code);

    if (!isGiftCardPaymentMethod(method)) {
      setGiftCardCode("");
    }

    const preferredProvider =
      method.providers.find(
        (provider) => provider.isDefault && provider.isAvailable,
      ) ??
      method.providers.find((provider) => provider.isAvailable) ??
      method.providers[0];
    setSelectedProviderCode(preferredProvider?.code ?? null);
  };

  useEffect(() => {
    let cancelled = false;

    async function loadMethods() {
      try {
        const payments = await getCheckoutPaymentMethods().catch(
          () => [] as CheckoutPaymentMethod[],
        );

        if (cancelled) return;

        const availablePayments = payments.filter((item) => item.isAvailable);

        setPaymentMethods(availablePayments);

        const firstPayment = availablePayments[0] ?? null;
        if (firstPayment) {
          setSelectedPaymentCode(firstPayment.code);
          const preferredProvider =
            firstPayment.providers.find(
              (provider) => provider.isDefault && provider.isAvailable,
            ) ??
            firstPayment.providers.find((provider) => provider.isAvailable) ??
            firstPayment.providers[0];
          setSelectedProviderCode(preferredProvider?.code ?? null);
        } else {
          setSelectedPaymentCode(null);
          setSelectedProviderCode(null);
        }
      } catch {
        if (!cancelled) {
          setPaymentMethods([]);
          setShippingOptionsResult(null);
        }
      }
    }

    void loadMethods();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    const timer = window.setTimeout(() => {
      void loadPendingPaymentOrder();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadPendingPaymentOrder]);

  useEffect(() => {
    if (!pendingPaymentOrder) return;

    const refreshDelay =
      pendingPaymentOrder.remainingSeconds > 0
        ? (pendingPaymentOrder.remainingSeconds + 1) * 1000
        : 5000;
    const timer = window.setTimeout(
      () => void loadPendingPaymentOrder(),
      Math.min(refreshDelay, 2_147_000_000),
    );

    return () => window.clearTimeout(timer);
  }, [loadPendingPaymentOrder, pendingPaymentOrder]);

  useEffect(() => {
    if (!pendingGatewayPayment) return;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pendingGatewayPayment]);

  useEffect(() => {
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    const header = document.querySelector("body > header");

    const updateStickyTop = () => {
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      setSummaryStickyTop(headerHeight + 16);
    };

    updateStickyTop();
    window.addEventListener("resize", updateStickyTop);

    const resizeObserver =
      header && "ResizeObserver" in window
        ? new ResizeObserver(updateStickyTop)
        : null;
    if (header) {
      resizeObserver?.observe(header);
    }

    return () => {
      window.removeEventListener("resize", updateStickyTop);
      resizeObserver?.disconnect();
    };
  }, []);

  const handleShippingOptionsChange = useCallback(
    (result: CheckoutShippingOptionsResult | null) => {
      const groups = result?.groups ?? [];
      setShippingOptionsResult(result);
      setSelectedShippingIdsByClass((prev) => {
        const next: Record<string, string> = {};

        for (const group of groups) {
          const availableMethods = group.options.filter(
            (item) => item.isAvailable,
          );
          if (availableMethods.length === 0) continue;
          const classKey = group.shippingClassId;
          const previousSelection = prev[classKey];
          if (
            previousSelection &&
            availableMethods.some((item) => item.id === previousSelection)
          ) {
            next[classKey] = previousSelection;
            continue;
          }

          next[classKey] = availableMethods[0].id;
        }

        return next;
      });
    },
    [],
  );

  const handleSelectAddress = useCallback(
    (address: CustomerAddressDto | null) => {
      setSelectedAddress(address);
      setCouponDiscount(null);
    },
    [],
  );

  const selectShippingMethod = useCallback(
    (classKey: string, methodId: string) => {
      setSelectedShippingIdsByClass((prev) => ({
        ...prev,
        [classKey]: methodId,
      }));
    },
    [],
  );

  const shippingClassGroups = useMemo<ShippingClassGroup[]>(() => {
    return (shippingOptionsResult?.groups ?? [])
      .map((group, index) => ({
        key: group.shippingClassId,
        title: group.shippingClassName || `گروه ارسال ${index + 1}`,
        totalWeightGrams: group.totalWeightGrams,
        itemCount: group.itemCount,
        items: group.items,
        methods: group.options.filter((method) => method.isAvailable),
      }))
      .filter((group) => group.methods.length > 0);
  }, [shippingOptionsResult]);

  const selectedShippingMethods = useMemo(
    () =>
      shippingClassGroups
        .map((group) => {
          const selectedId = selectedShippingIdsByClass[group.key];
          return (
            group.methods.find((method) => method.id === selectedId) ??
            group.methods[0] ??
            null
          );
        })
        .filter((method): method is CheckoutShippingMethod => Boolean(method)),
    [selectedShippingIdsByClass, shippingClassGroups],
  );

  const selectedShippingMethodId =
    selectedShippingMethods[0]?.shippingMethodId ?? null;

  const shippingSelections = useMemo<PlaceOrderShippingSelection[]>(
    () =>
      selectedShippingMethods
        .filter((method) => Boolean(method.shippingClassId))
        .map((method) => ({
          shippingClassId: method.shippingClassId as string,
          shippingMethodId: method.shippingMethodId,
        })),
    [selectedShippingMethods],
  );

  const selectedPayment = useMemo(
    () =>
      paymentMethods.find((item) => item.code === selectedPaymentCode) ?? null,
    [paymentMethods, selectedPaymentCode],
  );

  const selectedProvider = useMemo(
    () =>
      selectedPayment?.providers.find(
        (provider) => provider.code === selectedProviderCode,
      ) ?? null,
    [selectedPayment, selectedProviderCode],
  );

  const selectedIsGiftCardPayment = useMemo(
    () => isGiftCardPaymentMethod(selectedPayment),
    [selectedPayment],
  );

  const selectedIsInstallmentPayment = useMemo(
    () =>
      isInstallmentPaymentMethod(selectedPayment) ||
      selectedProvider?.gatewayType === "installment",
    [selectedPayment, selectedProvider?.gatewayType],
  );

  const selectedAvailableProviders = useMemo(
    () =>
      selectedPayment?.providers.filter((provider) => provider.isAvailable) ??
      [],
    [selectedPayment],
  );

  const selectedPaymentTitle = useMemo(
    () =>
      [
        selectedPayment?.title,
        selectedIsGiftCardPayment ? null : selectedProvider?.title,
      ]
        .filter(Boolean)
        .join(" - ") ||
      selectedPaymentCode ||
      "",
    [
      selectedIsGiftCardPayment,
      selectedPayment?.title,
      selectedPaymentCode,
      selectedProvider?.title,
    ],
  );

  const buildPreviewPayload = useCallback((): CheckoutCouponPayload | null => {
    if (!selectedAddress && shippingSelections.length === 0) {
      return null;
    }

    const payload: CheckoutCouponPayload = {};

    if (selectedProviderCode) {
      payload.providerCode = selectedProviderCode;
    }
    if (selectedShippingMethodId) {
      payload.shippingMethodId = selectedShippingMethodId;
    }
    if (shippingSelections.length > 0) {
      payload.shippingSelections = shippingSelections;
    }
    if (selectedAddress) {
<<<<<<< HEAD
      payload.shippingAddress = toShippingAddress(
        selectedAddress,
        currentUser?.email ?? "",
      );
=======
      payload.shippingAddress = toShippingAddress(selectedAddress);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    }

    return payload;
  }, [
    selectedAddress,
<<<<<<< HEAD
    currentUser?.email,
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    selectedProviderCode,
    selectedShippingMethodId,
    shippingSelections,
  ]);

  const shippingCost = couponDiscount
    ? couponDiscount.shippingFee || couponDiscount.shippingPrice
    : selectedShippingMethods.reduce((sum, method) => sum + method.price, 0);
  const discountAmount = couponDiscount?.couponIsApplicable
    ? couponDiscount.discount || couponDiscount.couponTotalDiscount
    : 0;
  const gatewayFee = couponDiscount?.gatewayFee ?? null;
  const payable = couponDiscount
    ? couponDiscount.payableAmount || couponDiscount.onlinePayableAmount
    : Math.max(0, totalPrice + shippingCost - discountAmount);
  const summarySubtotal =
    couponDiscount && couponDiscount.itemsSubtotal > 0
      ? couponDiscount.itemsSubtotal
      : totalPrice;
  const summaryShippingLabel = couponDiscount
    ? formatMoney(couponDiscount.shippingFee || couponDiscount.shippingPrice)
    : selectedShippingMethods.length === 0 &&
        shippingOptionsResult?.formattedCheapestTotalCost
      ? shippingOptionsResult.formattedCheapestTotalCost
      : selectedShippingMethods.length === 1
        ? formatShippingPrice(selectedShippingMethods[0])
        : formatMoney(shippingCost);

  useEffect(() => {
    const payload = buildPreviewPayload();
    if (!payload) return;
    const requestPayload = payload;

    let cancelled = false;

    async function previewDiscount() {
      try {
        const result = await previewCheckoutDiscount(requestPayload);
        if (cancelled) return;
        setCouponDiscount(result);
      } catch {
        // preview بدون کد تخفیف است؛ خطای الزامی بودن کوپن نشان داده نمی‌شود
      }
    }

    void previewDiscount();
    return () => {
      cancelled = true;
    };
  }, [buildPreviewPayload]);

  const handleCouponCodeChange = (value: string) => {
    setCouponCode(value);
    if (appliedCouponCode && value.trim() !== appliedCouponCode) {
      setAppliedCouponCode(null);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      notify.error("کد تخفیف الزامی است.");
      return;
    }
    if (!selectedAddress) {
      notify.error("لطفاً آدرس تحویل را انتخاب کنید");
      return;
    }
    if (selectedShippingMethods.length === 0 || !selectedShippingMethodId) {
      notify.error("لطفاً روش ارسال را انتخاب کنید");
      return;
    }
    if (!selectedPaymentCode) {
      notify.error("لطفاً روش پرداخت را انتخاب کنید");
      return;
    }
    if (shippingSelections.length === 0) {
      notify.error(
        "اطلاعات کلاس ارسال کامل نیست. لطفاً آدرس را دوباره انتخاب کنید.",
      );
      return;
    }

    if (
      selectedPayment &&
      !selectedIsGiftCardPayment &&
      selectedPayment.providers.length > 0 &&
      !selectedProviderCode
    ) {
      notify.error("لطفاً بانک مقصد را انتخاب کنید");
      return;
    }

<<<<<<< HEAD
    setCouponApplying(true);
    try {
      const resolvedAddress =
        await resolveCustomerAddressLocationIds(selectedAddress);
      setSelectedAddress(resolvedAddress);

      const payload: CheckoutCouponPayload = {
        couponCode: couponCode.trim(),
        providerCode: selectedProviderCode || undefined,
        shippingMethodId: selectedShippingMethodId,
        shippingSelections,
        shippingAddress: toShippingAddress(
          resolvedAddress,
          currentUser?.email ?? "",
        ),
      };

=======
    const payload: CheckoutCouponPayload = {
      couponCode: couponCode.trim(),
      providerCode: selectedProviderCode || undefined,
      shippingMethodId: selectedShippingMethodId,
      shippingSelections,
      shippingAddress: toShippingAddress(selectedAddress),
    };

    setCouponApplying(true);
    try {
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      const result = await applyCheckoutCoupon(payload);
      setCouponDiscount(result);
      if (result.couponIsApplicable) {
        setAppliedCouponCode(couponCode.trim());
        notify.success(result.couponMessage || "کد تخفیف اعمال شد");
      } else {
        setAppliedCouponCode(null);
        notify.error(result.couponMessage || "کد تخفیف قابل اعمال نیست");
      }
    } catch (err) {
<<<<<<< HEAD
      // console.error("[Checkout] apply coupon failed =>", err);
=======
      console.error("[Checkout] apply coupon failed =>", err);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      setAppliedCouponCode(null);
      setCouponDiscount(null);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setCouponApplying(false);
    }
  };

<<<<<<< HEAD
  const handlePayPendingPaymentOrder = async () => {
    if (
      !pendingPaymentOrder?.orderId ||
      !pendingPaymentOrder.allowedActions.canContinuePayment ||
      pendingPaymentAction
    ) {
      return;
    }

    setPendingPaymentAction("pay");
    try {
      const result = await retryMyOrderPayment(pendingPaymentOrder.orderId);
      const paymentUrl = result.paymentUrl || result.redirectUrl;

      if (!paymentUrl) {
        notify.error(
          "ورود به درگاه پرداخت انجام نشد. لطفاً بعداً دوباره تلاش کنید.",
        );
        return;
      }

      rememberPendingPaymentOrder(
        pendingPaymentOrder.orderId,
        pendingPaymentOrder.publicOrderNumber,
      );
      window.location.href = paymentUrl;
    } catch (err) {
      // console.error("[Checkout] retry pending payment failed =>", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setPendingPaymentAction(null);
    }
  };

  const handleCancelPendingPaymentOrder = async () => {
    if (
      !pendingPaymentOrder?.orderId ||
      !pendingPaymentOrder.allowedActions.canCancel ||
      pendingPaymentAction
    ) {
      return;
    }

    setPendingPaymentAction("cancel");
    try {
      const result = await cancelMyOrder(pendingPaymentOrder.orderId, {
        reason: "customer_cancelled_pending_payment",
      });
      notify.success(result.message || "سفارش در انتظار پرداخت لغو شد");
      await loadPendingPaymentOrder();
    } catch (err) {
      // console.error("[Checkout] cancel pending order failed =>", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setPendingPaymentAction(null);
    }
  };

=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  // handlePlaceOrder is a function that places an order and redirects to the payment gateway
  const handlePlaceOrder = async () => {
    if (cartLoading || cartSyncing) {
      notify.info("سبد خرید در حال آماده‌سازی است");
      return;
    }
    if (items.length === 0) {
      notify.error("سبد خرید خالی است");
      return;
    }
<<<<<<< HEAD
    if (pendingPaymentLoading) {
      notify.info("وضعیت سفارش در انتظار پرداخت در حال بررسی است");
      return;
    }
    if (pendingPaymentError) {
      notify.error(
        "بررسی سفارش در انتظار پرداخت انجام نشد. ابتدا دوباره تلاش کنید.",
      );
      return;
    }
    if (pendingPaymentOrder) {
      notify.error(
        "ابتدا سفارش در انتظار پرداخت را تعیین تکلیف کنید، سپس سفارش جدید ثبت کنید.",
      );
      return;
    }

    const cartIsCurrent = await cartSync.checkCart();
    if (!cartIsCurrent) return;

=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    if (!selectedAddress) {
      notify.error("لطفاً آدرس تحویل را انتخاب کنید");
      return;
    }
    if (selectedShippingMethods.length === 0 || !selectedShippingMethodId) {
      notify.error("لطفاً روش ارسال را انتخاب کنید");
      return;
    }
    if (shippingSelections.length !== selectedShippingMethods.length) {
      notify.error(
        "اطلاعات کلاس ارسال کامل نیست. لطفاً آدرس را دوباره انتخاب کنید.",
      );
      return;
    }
    if (!selectedPaymentCode) {
      notify.error("لطفاً روش پرداخت را انتخاب کنید");
      return;
    }
    if (selectedIsGiftCardPayment && !giftCardCode.trim()) {
      notify.error("لطفاً کد کارت هدیه را وارد کنید");
      return;
    }
    if (
      selectedPayment &&
      !selectedIsGiftCardPayment &&
      selectedPayment.providers.length > 0 &&
      !selectedProviderCode
    ) {
      notify.error("لطفاً بانک مقصد را انتخاب کنید");
      return;
    }
    if (couponCode.trim() && !couponDiscount?.couponIsApplicable) {
      notify.error("لطفاً ابتدا کد تخفیف را اعمال کنید");
      return;
    }
<<<<<<< HEAD
=======

>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    setSubmitting(true);
    try {
      const serverItemCount = await ensureServerCartHasItems(items);
      if (serverItemCount < 1) {
        notify.error(
          "سبد خرید سرور خالی است. لطفاً دوباره محصول را به سبد اضافه کنید.",
        );
        return;
      }

<<<<<<< HEAD
      const resolvedAddress =
        await resolveCustomerAddressLocationIds(selectedAddress);
      setSelectedAddress(resolvedAddress);

      const shippingAddress = toShippingAddress(
        resolvedAddress,
        currentUser?.email ?? "",
      );
      const placeOrderPayload = {
        shippingMethodId: selectedShippingMethodId,
        shippingSelections,
        shippingAddress,
=======
      const result = await placeCheckoutOrder({
        shippingMethodId: selectedShippingMethodId,
        shippingSelections,
        shippingAddress: toShippingAddress(selectedAddress),
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
        paymentMethodCode: selectedPaymentCode,
        providerCode: selectedIsGiftCardPayment
          ? undefined
          : selectedProviderCode || undefined,
        couponCode: couponDiscount?.couponIsApplicable
          ? couponDiscount.couponCode
          : undefined,
        customerNote: customerNote.trim() || undefined,
        giftCardCode: giftCardCode.trim() || undefined,
<<<<<<< HEAD
      };

      const result = await placeCheckoutOrder(placeOrderPayload);
=======
      });
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

      const paymentUrl = result.paymentUrl || result.redirectUrl;

      notify.success(result.message || "سفارش با موفقیت ثبت شد");

      if (selectedIsGiftCardPayment) {
        await clearCart();
        setPendingGatewayPayment({
          orderId: result.orderId,
          orderNumber: result.orderNumber,
          paymentMethodTitle: selectedPaymentTitle || "کارت هدیه",
          isGiftCardPayment: true,
          isInstallmentPayment: false,
          addressTitle: selectedAddress.title,
          itemCount: totalItems,
          discount: discountAmount,
          shippingFee: shippingCost,
          totalAmount: couponDiscount?.totalOrderAmount || payable,
          payableAmount: payable,
          gatewayFee,
        });
        return;
      }

      await clearCart();

      setPendingGatewayPayment({
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        providerCode: selectedProviderCode || undefined,
        directPaymentUrl: selectedIsInstallmentPayment ? undefined : paymentUrl,
        paymentMethodTitle: selectedPaymentTitle,
        isGiftCardPayment: false,
        isInstallmentPayment: selectedIsInstallmentPayment,
        addressTitle: selectedAddress.title,
        itemCount: totalItems,
        discount: discountAmount,
        shippingFee: shippingCost,
        totalAmount: couponDiscount?.totalOrderAmount || payable,
        payableAmount: payable,
        gatewayFee,
      });
    } catch (err) {
<<<<<<< HEAD
      // console.error("[Checkout] place order failed =>", err);
=======
      console.error("[Checkout] place order failed =>", err);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      notify.error(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelGatewayRedirect = useCallback(() => {
    router.replace("/user-profile/orders");
  }, [router]);

  const handleProceedToGateway = useCallback(async () => {
    if (!pendingGatewayPayment || gatewayStarting) return;

    if (pendingGatewayPayment.isGiftCardPayment) {
      const params = new URLSearchParams({
        status: "success",
        message: "سفارش با موفقیت ثبت و پرداخت شد.",
      });

      if (pendingGatewayPayment.orderId) {
        params.set("orderId", pendingGatewayPayment.orderId);
      }
      if (pendingGatewayPayment.orderNumber) {
        params.set("orderNumber", pendingGatewayPayment.orderNumber);
      }

      router.replace(`/checkout/payment-result?${params.toString()}`);
      return;
    }

    if (pendingGatewayPayment.directPaymentUrl) {
      rememberPendingPaymentOrder(
        pendingGatewayPayment.orderId,
        pendingGatewayPayment.orderNumber,
      );
      window.location.href = pendingGatewayPayment.directPaymentUrl;
      return;
    }

    if (!pendingGatewayPayment.orderId) {
<<<<<<< HEAD
      handleGatewayEntryFailure(
        "ورود به درگاه پرداخت انجام نشد. لطفاً بعداً دوباره تلاش کنید.",
      );
=======
      notify.error("شناسه سفارش برای شروع پرداخت دریافت نشد");
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      return;
    }

    setGatewayStarting(true);
    try {
      const payment = await startOrderPayment({
        orderId: pendingGatewayPayment.orderId,
        providerCode: pendingGatewayPayment.providerCode,
        digipayType: pendingGatewayPayment.isInstallmentPayment
          ? "bnpl"
          : undefined,
      });

      if (!payment.redirectUrl) {
<<<<<<< HEAD
        handleGatewayEntryFailure(
          "ورود به درگاه پرداخت انجام نشد. لطفاً بعداً دوباره تلاش کنید.",
        );
=======
        notify.error("آدرس درگاه از سرویس پرداخت دریافت نشد");
        setGatewayStarting(false);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
        return;
      }

      rememberPendingPaymentOrder(
        payment.orderId || pendingGatewayPayment.orderId,
        payment.orderNumber || pendingGatewayPayment.orderNumber,
      );
      window.location.href = payment.redirectUrl;
<<<<<<< HEAD
    } catch {
      handleGatewayEntryFailure(
        "ورود به درگاه پرداخت انجام نشد. لطفاً بعداً دوباره تلاش کنید.",
      );
    }
  }, [
    gatewayStarting,
    handleGatewayEntryFailure,
    pendingGatewayPayment,
    router,
  ]);
=======
    } catch (err) {
      console.error("[Checkout] start payment failed =>", err);
      notify.error(getAuthErrorMessage(err));
      setGatewayStarting(false);
    }
  }, [gatewayStarting, pendingGatewayPayment, router]);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

  if (pendingGatewayPayment) {
    return (
      <GatewayRedirectConfirmation
        title={
          pendingGatewayPayment.isGiftCardPayment
            ? "سفارش با کارت هدیه ثبت شد"
            : "تایید انتقال به درگاه"
        }
        description={
          pendingGatewayPayment.isGiftCardPayment
            ? "پرداخت سفارش با کارت هدیه با موفقیت انجام شد. جزئیات سفارش را بررسی کنید و سپس به صفحه سفارش‌ها بروید."
            : "سفارش ثبت شده است. قبل از ورود به درگاه، خلاصه پرداخت را بررسی کنید."
        }
        iconClassName={
          pendingGatewayPayment.isGiftCardPayment
            ? "far fa-gift text-lg"
            : "far fa-credit-card text-lg"
        }
        iconWrapClassName={
          pendingGatewayPayment.isGiftCardPayment
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
            : "bg-primary/10 text-primary"
        }
        details={[
          { label: "محل دریافت", value: pendingGatewayPayment.addressTitle },
          {
            label: "روش پرداخت",
            value: pendingGatewayPayment.paymentMethodTitle,
            tone: pendingGatewayPayment.isGiftCardPayment
              ? "success"
              : "primary",
          },
          {
            label: "تعداد کالا",
            value: new Intl.NumberFormat("fa-IR").format(
              pendingGatewayPayment.itemCount,
            ),
          },
          {
            label: "تخفیف",
            value: formatMoney(pendingGatewayPayment.discount),
            tone: "success",
          },
          {
            label: "هزینه ارسال",
            value: formatMoney(pendingGatewayPayment.shippingFee),
          },
          pendingGatewayPayment.gatewayFee &&
          pendingGatewayPayment.gatewayFee.amount > 0
            ? {
                label: pendingGatewayPayment.gatewayFee.title,
                value: formatMoney(pendingGatewayPayment.gatewayFee.amount),
              }
            : { label: "کارمزد", value: null },
          {
            label: "مبلغ کل",
            value: formatMoney(pendingGatewayPayment.totalAmount),
          },
        ]}
        amountLabel="مبلغ قابل پرداخت"
        amountValue={formatMoney(pendingGatewayPayment.payableAmount)}
        starting={gatewayStarting}
        seconds={GATEWAY_REDIRECT_SECONDS}
        showCountdown={!pendingGatewayPayment.isGiftCardPayment}
        showCancel={!pendingGatewayPayment.isGiftCardPayment}
        proceedLabel={
          pendingGatewayPayment.isGiftCardPayment
            ? "مشاهده سفارش‌ها"
            : "انتقال به درگاه"
        }
        onCancel={handleCancelGatewayRedirect}
        onProceed={() => void handleProceedToGateway()}
      />
    );
  }

  if (cartLoading || cartSyncing) {
    return (
      <SectionContainer>
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-400">
          در حال آماده‌سازی سبد خرید...
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
<<<<<<< HEAD
      <CartSynchronizationModal {...cartSync.modalProps} />
      {pendingPaymentOrder ? (
        <PendingPaymentWarning
          key={pendingPaymentOrder.orderId}
          order={pendingPaymentOrder}
          loading={pendingPaymentLoading}
          action={pendingPaymentAction}
          onPay={() => void handlePayPendingPaymentOrder()}
          onCancel={() => void handleCancelPendingPaymentOrder()}
        />
      ) : null}
      {pendingPaymentError && !pendingPaymentOrder ? (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-700 dark:bg-amber-950/20 dark:text-amber-200 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold">
            بررسی سفارش در انتظار پرداخت انجام نشد. تا زمان بررسی مجدد، ثبت
            سفارش جدید غیرفعال است.
          </p>
          <button
            type="button"
            disabled={pendingPaymentLoading}
            onClick={() => void loadPendingPaymentOrder()}
            className="shrink-0 rounded-xl border border-amber-500 px-4 py-2 text-sm font-black transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-amber-900/30"
          >
            {pendingPaymentLoading ? "در حال بررسی..." : "تلاش دوباره"}
          </button>
        </div>
      ) : null}

=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Right section */}
        <div className="lg:col-span-2">
          <div className="sticky top-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
            <div className="mb-6 flex items-baseline justify-between">
              <h1
                className="relative mb-4 pb-4 text-lg font-black text-gray-900 dark:text-gray-200
                  before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary
                  after:absolute after:inset-s-4 after:bottom-0 after:h-2 after:w-40 after:rounded-lg after:bg-primary"
              >
                جزئیات سفارش
              </h1>
              <span className="text-gray-600 dark:text-gray-400">
                {new Intl.NumberFormat("fa-IR").format(totalItems)} کالا
              </span>
            </div>

            {/* Horizontal timeline */}
            <div className="timeline-horizontal relative mb-8 flex items-center justify-between">
              <div className="timeline-step completed flex flex-col items-center text-center">
                <div className="timeline-icon">
                  <i className="far fa-check"></i>
                </div>
                <div className="timeline-title">سبد خرید</div>
              </div>
              <div className="timeline-step active flex flex-col items-center text-center">
                <div className="timeline-icon dark:bg-gray-700 dark:text-gray-200">
                  <i className="far fa-credit-card"></i>
                </div>
                <div className="timeline-title dark:text-white">
                  جزئیات سفارش
                </div>
              </div>
              <div className="timeline-step flex flex-col items-center text-center">
                <div className="timeline-icon dark:bg-gray-700 dark:text-gray-200">
                  <i className="far fa-circle-check"></i>
                </div>
                <div className="timeline-title dark:text-white">تأیید</div>
              </div>
              <div className="timeline-step flex flex-col items-center text-center">
                <div className="timeline-icon dark:bg-gray-700 dark:text-gray-200">
                  <i className="far fa-check"></i>
                </div>
                <div className="timeline-title dark:text-white">تکمیل</div>
              </div>
            </div>

            {/* Personal information (template kept, hidden) */}
            <div className="mb-8 hidden">
              <h2 className="mb-4 flex items-center text-xl font-bold text-gray-800 dark:text-white">
                <i className="far fa-user"></i>
                اطلاعات شخصی
              </h2>
              <div className="flex flex-wrap gap-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      نام
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-4 text-gray-800 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-200"
                      placeholder="نام خود را وارد کنید"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      نام خانوادگی
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-4 text-gray-800 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-200"
                      placeholder="نام خانوادگی خود را وارد کنید"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    شماره موبایل
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-4 text-gray-800 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-200"
                    placeholder="09xxxxxxxxx"
                    readOnly
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    آدرس ایمیل (اختیاری)
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-4 text-gray-800 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-200"
                    placeholder="email@example.com"
                    readOnly
                  />
                </div>
              </div>
            </div>

            <CheckoutDeliveryAddress
              selectedAddressId={selectedAddress?.id ?? null}
<<<<<<< HEAD
              userEmail={currentUser?.email ?? ""}
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
              onSelectAddress={handleSelectAddress}
              onShippingOptionsChange={handleShippingOptionsChange}
              customerNote={customerNote}
              onCustomerNoteChange={setCustomerNote}
            />

            {/* Delivery time (template kept, hidden) */}
            <div className="mb-8 hidden">
              <h2 className="relative mb-4 pb-4 font-bold text-lg before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary after:absolute after:inset-s-4 after:bottom-0 after:h-0.5 after:w-40 after:rounded-lg after:bg-primary">
                زمان تحویل را انتخاب کنید
              </h2>
              <div className="mb-6">
                <div className="flex space-x-2 overflow-x-auto pb-2" />
              </div>
              <h3 className="mb-3 font-medium text-gray-700 dark:text-gray-300">
                بازه زمانی تحویل
              </h3>
              <div className="grid grid-cols-2 gap-3" />
            </div>

            {/* Order items and shipping */}
            <div className="mb-8">
              <h2 className="mb-4 flex items-center text-xl font-bold text-gray-800 dark:text-white">
                <i className="far fa-truck me-2 text-sm text-primary-500"></i>
                اقلام سفارش و ارسال
              </h2>

              <div className="space-y-5">
                {shippingClassGroups.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-zinc-900/40">
                    <div className="space-y-3">
                      {items.map((item) => {
                        const unitPrice = getCartItemUnitPrice(item);
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 rounded-lg bg-white p-3 dark:bg-zinc-900"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800">
                                <Image
                                  width={56}
                                  height={56}
                                  src={item.image || "/images/default.png"}
                                  alt={item.title}
                                  className="h-14 w-14 object-contain"
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="truncate font-medium text-gray-800 dark:text-white">
                                  {item.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  تعداد:{" "}
                                  {new Intl.NumberFormat("fa-IR").format(
                                    item.quantity,
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="shrink-0 text-left text-sm">
                              <div className="text-gray-500 dark:text-gray-400">
                                {formatMoney(unitPrice)}
                              </div>
                              <div className="font-bold text-gray-800 dark:text-white">
                                {formatMoney(getCartItemLineTotal(item))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      پس از انتخاب آدرس، گزینه‌های ارسال هر گروه کالا نمایش داده
                      می‌شود.
                    </p>
                  </div>
                ) : (
                  shippingClassGroups.map((group, groupIndex) => (
                    <section
                      key={group.key}
                      className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-zinc-900/40"
                    >
                      <div className="mb-4 flex flex-col gap-2 border-b border-gray-200 pb-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-bold text-gray-800 dark:text-white">
                            {group.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {new Intl.NumberFormat("fa-IR").format(
                              group.itemCount,
                            )}{" "}
                            کالا
                            {group.totalWeightGrams > 0
                              ? " • " +
                                new Intl.NumberFormat("fa-IR").format(
                                  group.totalWeightGrams,
                                ) +
                                " گرم"
                              : ""}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {group.items.map((shippingItem) => {
                          const cartItem = findCartItemForShippingItem(
                            shippingItem,
                            items,
                          );
                          const productTitle = formatCheckoutItemTitle(
                            shippingItem.productName ||
                              cartItem?.title ||
                              "محصول",
                          );
                          const productColorLabel =
                            getCheckoutItemColorLabel(shippingItem);
                          const quantity =
                            shippingItem.quantity || cartItem?.quantity || 0;
                          const unitPrice = cartItem
                            ? getCartItemUnitPrice(cartItem)
                            : 0;
                          const lineTotal = unitPrice * quantity;

                          return (
                            <div
                              key={
                                group.key +
                                "-" +
                                (shippingItem.productId ||
                                  shippingItem.productName)
                              }
                              className="grid grid-cols-1 gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800 sm:grid-cols-[1fr_auto]"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800">
                                  <Image
                                    width={56}
                                    height={56}
                                    src={
                                      cartItem?.image || "/images/default.png"
                                    }
                                    alt={productTitle}
                                    className="h-14 w-14 object-contain"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex min-w-0 items-center gap-2">
                                    <h4 className="truncate font-medium text-gray-800 dark:text-white">
                                      {productTitle}
                                    </h4>
                                    {productColorLabel ? (
                                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                                        رنگ:
                                        {shippingItem.productColorHex ? (
                                          <span
                                            className="inline-block h-3 w-3 rounded-full border border-gray-300 dark:border-gray-600"
                                            style={{
                                              backgroundColor:
                                                shippingItem.productColorHex,
                                            }}
                                          />
                                        ) : null}
                                        <span>{productColorLabel}</span>
                                      </span>
                                    ) : null}
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    تعداد:{" "}
                                    {new Intl.NumberFormat("fa-IR").format(
                                      quantity,
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-48">
                                <div>
                                  <span className="block text-gray-500 dark:text-gray-400">
                                    قیمت واحد
                                  </span>
                                  <span className="font-medium text-gray-800 dark:text-gray-100">
                                    {unitPrice > 0
                                      ? formatMoney(unitPrice)
                                      : "?"}
                                  </span>
                                </div>
                                <div className="text-left">
                                  <span className="block text-gray-500 dark:text-gray-400">
                                    قیمت کل
                                  </span>
                                  <span className="font-bold text-gray-900 dark:text-white">
                                    {lineTotal > 0
                                      ? formatMoney(lineTotal)
                                      : "?"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-5">
                        <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          روش ارسال این بخش
                        </h4>
<<<<<<< HEAD
                        <div className="grid grid-cols-1 gap-3 max-[559px]:grid-cols-2 max-[559px]:gap-2 sm:grid-cols-2 lg:grid-cols-4">
=======
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                          {group.methods.map((method, methodIndex) => {
                            const isSelected =
                              selectedShippingIdsByClass[group.key] ===
                              method.id;
                            const style =
                              SHIPPING_ICON_STYLES[
                                (groupIndex + methodIndex) %
                                  SHIPPING_ICON_STYLES.length
                              ];

                            return (
                              <div
                                key={method.id}
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                  selectShippingMethod(group.key, method.id)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    selectShippingMethod(group.key, method.id);
                                  }
                                }}
                                className={[
<<<<<<< HEAD
                                  "shipping-method flex aspect-square cursor-pointer flex-col justify-between rounded-lg border p-4 transition-all max-[559px]:aspect-auto max-[559px]:min-h-44 max-[559px]:p-2.5",
=======
                                  "shipping-method flex aspect-square cursor-pointer flex-col justify-between rounded-lg border p-4 transition-all",
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                                  isSelected
                                    ? "selected border-primary-500 bg-blue-50 ring-2 ring-primary-500/20 dark:bg-zinc-800"
                                    : "border-gray-300 hover:border-primary-500 dark:border-gray-600",
                                ].join(" ")}
                                data-shipping-id={method.shippingMethodId}
                                data-shipping-class-id={method.shippingClassId}
                                data-shipping-cost={method.price}
                              >
                                <div className="min-w-0">
<<<<<<< HEAD
                                  <div className="mb-3 flex items-start justify-between gap-2 max-[559px]:mb-2">
                                    <div
                                      className={[
                                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg max-[559px]:h-9 max-[559px]:w-9 max-[559px]:text-sm",
=======
                                  <div className="mb-3 flex items-start justify-between gap-2">
                                    <div
                                      className={[
                                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                                        style.wrap,
                                      ].join(" ")}
                                    >
                                      <i className={style.icon}></i>
                                    </div>
                                    {isSelected ? (
<<<<<<< HEAD
                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white max-[559px]:h-5 max-[559px]:w-5 max-[559px]:text-[10px]">
=======
                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                                        <i className="far fa-check"></i>
                                      </span>
                                    ) : null}
                                  </div>
<<<<<<< HEAD
                                  <h3 className="line-clamp-2 min-h-8 font-bold leading-6 text-gray-800 max-[559px]:text-sm max-[559px]:leading-5 dark:text-white">
=======
                                  <h3 className="line-clamp-2 min-h-8 font-bold leading-6 text-gray-800 dark:text-white">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                                    {method.title}
                                  </h3>
                                  {method.description ? (
                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-600 dark:text-gray-400">
                                      {method.description}
                                    </p>
                                  ) : null}
                                </div>
                                <div>
<<<<<<< HEAD
                                  <div className="mb-3 flex flex-wrap gap-2 text-[11px] max-[559px]:mb-2 max-[559px]:gap-1 max-[559px]:text-[10px]">
=======
                                  <div className="mb-3 flex flex-wrap gap-2 text-[11px]">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                                    {method.estimatedDeliveryDays ? (
                                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                                        {new Intl.NumberFormat("fa-IR").format(
                                          method.estimatedDeliveryDays,
                                        )}{" "}
                                        روز کاری
                                      </span>
                                    ) : null}
                                    {method.cashOnDelivery ? (
                                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                        پرداخت در محل
                                      </span>
                                    ) : null}
                                  </div>
<<<<<<< HEAD
                                  <div className="font-bold text-gray-900 max-[559px]:text-sm dark:text-white">
=======
                                  <div className="font-bold text-gray-900 dark:text-white">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                                    {formatShippingPrice(method)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </section>
                  ))
                )}
              </div>
            </div>

            {/* Payment method */}
            <div className="mb-8">
              <h2 className="mb-4 flex items-center text-xl font-bold text-gray-800 dark:text-white">
                <i className="far fa-credit-card text-sm text-primary-500"></i>
                روش پرداخت
              </h2>

<<<<<<< HEAD
              <div className="flex flex-wrap gap-4 max-[559px]:grid max-[559px]:grid-cols-2 max-[559px]:gap-2">
=======
              <div className="flex flex-wrap gap-4">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                {paymentMethods.map((method, index) => {
                  const isSelected = selectedPaymentCode === method.code;
                  const isBankGateway = isBankGatewayPaymentMethod(method);
                  const style = isBankGateway
                    ? BANK_GATEWAY_ICON_STYLE
                    : PAYMENT_ICON_STYLES[index % PAYMENT_ICON_STYLES.length];
                  const methodImageSrc = isBankGateway
                    ? null
                    : getRenderableImageSrc(method.imageUrl);

                  return (
                    <div
                      key={method.code}
                      className={[
<<<<<<< HEAD
                        "payment-method flex h-[200px] w-[200px] max-w-full rounded-lg border p-4 transition-all max-[559px]:h-36 max-[559px]:w-full max-[559px]:p-2.5",
=======
                        "payment-method flex h-[200px] w-[200px] max-w-full rounded-lg border p-4 transition-all",
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                        isSelected
                          ? "selected border-primary-500 bg-blue-50 dark:bg-zinc-800"
                          : "border-gray-300 hover:border-primary-500 dark:border-gray-600",
                      ].join(" ")}
                      data-payment-code={method.code}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => selectPaymentMethod(method)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            selectPaymentMethod(method);
                          }
                        }}
<<<<<<< HEAD
                        className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 text-center max-[559px]:gap-2"
                      >
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-lg max-[559px]:h-10 max-[559px]:w-10 ${style.wrap}`}
=======
                        className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 text-center"
                      >
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-lg ${style.wrap}`}
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                        >
                          {methodImageSrc ? (
                            <Image
                              src={methodImageSrc}
                              alt={method.title}
                              width={56}
                              height={56}
                              unoptimized
<<<<<<< HEAD
                              className="h-12 w-12 object-contain max-[559px]:h-9 max-[559px]:w-9"
=======
                              className="h-12 w-12 object-contain"
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                            />
                          ) : (
                            <i className={style.icon}></i>
                          )}
                        </div>
                        <div className="space-y-1">
<<<<<<< HEAD
                          <h3 className="font-medium text-gray-800 max-[559px]:text-sm dark:text-white">
                            {method.title}
                          </h3>
                          <p className="text-sm text-gray-600 max-[559px]:line-clamp-2 max-[559px]:text-xs dark:text-gray-400">
=======
                          <h3 className="font-medium text-gray-800 dark:text-white">
                            {method.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!selectedIsGiftCardPayment &&
              selectedAvailableProviders.length > 0 ? (
                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    بانک مقصد
                  </p>
<<<<<<< HEAD
                  <div className="flex flex-wrap gap-4 max-[559px]:grid max-[559px]:grid-cols-2 max-[559px]:gap-2">
=======
                  <div className="flex flex-wrap gap-4">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                    {selectedAvailableProviders.map((provider) => {
                      const isProviderSelected =
                        selectedProviderCode === provider.code;
                      const providerImageSrc = getRenderableImageSrc(
                        provider.imageUrl ?? provider.logoUrl,
                      );

                      return (
                        <button
                          key={provider.code}
                          type="button"
                          onClick={() => setSelectedProviderCode(provider.code)}
                          className={[
<<<<<<< HEAD
                            "flex h-[200px] w-[200px] max-w-full flex-col items-center justify-center gap-3 rounded-lg border p-4 text-center transition-all max-[559px]:h-36 max-[559px]:w-full max-[559px]:gap-2 max-[559px]:p-2.5",
=======
                            "flex h-[200px] w-[200px] max-w-full flex-col items-center justify-center gap-3 rounded-lg border p-4 text-center transition-all",
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                            isProviderSelected
                              ? "border-primary-500 bg-white ring-2 ring-primary-500/30 dark:bg-zinc-900"
                              : "border-gray-300 bg-white hover:border-primary-500 dark:border-gray-600 dark:bg-zinc-900",
                          ].join(" ")}
                        >
                          {providerImageSrc ? (
                            <Image
                              src={providerImageSrc}
                              alt={provider.title}
                              width={72}
                              height={72}
                              unoptimized
<<<<<<< HEAD
                              className="h-16 w-16 object-contain max-[559px]:h-10 max-[559px]:w-10"
                            />
                          ) : (
                            <i className="far fa-building-columns text-2xl text-primary-500 max-[559px]:text-xl"></i>
                          )}
                          <span className="text-sm font-medium text-gray-800 max-[559px]:text-xs dark:text-gray-200">
=======
                              className="h-16 w-16 object-contain"
                            />
                          ) : (
                            <i className="far fa-building-columns text-2xl text-primary-500"></i>
                          )}
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                            {provider.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {selectedIsGiftCardPayment ? (
                <div className="mt-4">
                  <label
                    htmlFor="gift-card-code"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    کد کارت هدیه
                  </label>
                  <input
                    id="gift-card-code"
                    type="text"
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value)}
                    placeholder="کد کارت هدیه را وارد کنید"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-200"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Left Section - Summary */}
        <div>
          <aside
            className="sticky z-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-custom-dark"
            style={{ top: summaryStickyTop }}
          >
            <h2
              className="relative mb-6 pb-4 text-lg font-black text-gray-900 dark:text-gray-200
                before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary
                after:absolute after:inset-s-4 after:bottom-0 after:h-2 after:w-40 after:rounded-lg after:bg-primary"
            >
              خلاصه سفارش
            </h2>

            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-zinc-900/60">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                کد تخفیف
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => handleCouponCodeChange(e.target.value)}
                  className="min-w-0 flex-1 rounded-s-lg border border-gray-300 bg-white px-3 py-3 text-sm dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-200"
                  placeholder="کد تخفیف"
                />
                <button
                  type="button"
                  disabled={couponApplying}
                  onClick={() => void handleApplyCoupon()}
                  className="shrink-0 rounded-e-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {couponApplying ? "اعمال..." : "اعمال"}
                </button>
              </div>
              {appliedCouponCode && couponDiscount ? (
                <p
                  className={[
                    "mt-2 text-sm leading-6",
                    couponDiscount.couponIsApplicable
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400",
                  ].join(" ")}
                >
                  {couponDiscount.couponMessage ||
                    (couponDiscount.couponIsApplicable
                      ? "کد تخفیف اعمال شد"
                      : "کد تخفیف قابل اعمال نیست")}
                </p>
              ) : null}
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  جمع کالاها:
                </span>
                <span
                  className="font-medium text-gray-800 dark:text-gray-200"
                  id="subtotal"
                >
                  {formatMoney(summarySubtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  هزینه ارسال:
                </span>
                <span
                  className="font-medium text-gray-800 dark:text-gray-200"
                  id="shipping-cost"
                >
                  {summaryShippingLabel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">تخفیف:</span>
                <span
                  className="font-medium text-green-600 dark:text-green-400"
                  id="discount"
                >
                  {formatMoney(discountAmount)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  تعداد کالا:
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {new Intl.NumberFormat("fa-IR").format(totalItems)}
                </span>
              </div>

              <div className="border-t border-gray-300 pt-4 dark:border-gray-700">
                {gatewayFee && gatewayFee.amount > 0 ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {gatewayFee.title}:
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {formatMoney(gatewayFee.amount)}
                    </span>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4">
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    مبلغ قابل پرداخت:
                  </span>
                  <span
                    className="text-lg font-bold text-gray-900 dark:text-white"
                    id="total-cost"
                  >
                    {formatMoney(payable)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
<<<<<<< HEAD
              disabled={
                submitting ||
                !cartSync.canCheckout ||
                pendingPaymentLoading ||
                Boolean(pendingPaymentError) ||
                Boolean(pendingPaymentOrder)
              }
              onClick={() => void handlePlaceOrder()}
              className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-4 font-medium text-white transition-colors duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pendingPaymentOrder
                ? "ابتدا سفارش در انتظار پرداخت را تعیین تکلیف کنید"
                : pendingPaymentLoading
                  ? "در حال بررسی سفارش در انتظار پرداخت..."
                  : pendingPaymentError
                    ? "بررسی سفارش در انتظار پرداخت ناموفق بود"
                : cartSync.checking
                  ? "در حال بررسی وضعیت سبد خرید..."
                  : submitting
                  ? "در حال ثبت سفارش..."
                  : "پرداخت و تکمیل سفارش"}
=======
              disabled={submitting}
              onClick={() => void handlePlaceOrder()}
              className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-4 font-medium text-white transition-colors duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "در حال ثبت سفارش..." : "پرداخت و تکمیل سفارش"}
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
            </button>

            <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
              با تکمیل سفارش،{" "}
              <Link
                href="/rules"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500"
              >
                قوانین و شرایط
              </Link>{" "}
              را می‌پذیرید.
            </p>
          </aside>
        </div>
      </div>
    </SectionContainer>
  );
}
