"use client";
// components/ui/Checkout/Checkout.tsx
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import GatewayRedirectConfirmation from "@/components/modules/GatewayRedirectConfirmation/GatewayRedirectConfirmation";
import CheckoutDeliveryAddress from "./CheckoutDeliveryAddress";
import { useCart } from "@/src/context/CartContext";
import type { CartItem } from "@/src/lib/types/cart/cartTypes";
import type { CustomerAddressDto } from "@/src/lib/types/address/address.type";
import type {
  CheckoutCouponDiscount,
  CheckoutPaymentMethod,
  CheckoutShippingGroupItem,
  CheckoutShippingMethod,
  CheckoutShippingOptionsResult,
  PlaceOrderShippingSelection,
} from "@/src/lib/types/checkout/checkout.types";
import {
  applyCheckoutCoupon,
  ensureServerCartHasItems,
  getCheckoutPaymentMethods,
  placeCheckoutOrder,
  previewCheckoutDiscount,
  startOrderPayment,
} from "@/src/services/checkout/checkout.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";
import { rememberPendingPaymentOrder } from "@/src/utils/paymentRetryStorage";

const formatMoney = (value: number) =>
  `${new Intl.NumberFormat("fa-IR").format(Math.max(0, Math.round(value)))} تومان`;

const formatShippingPrice = (method: CheckoutShippingMethod) =>
  method.formattedPrice ?? (method.price > 0 ? formatMoney(method.price) : "رایگان");

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
  addressTitle: string;
  itemCount: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  payableAmount: number;
};

function isGiftCardPaymentMethod(method: CheckoutPaymentMethod | null): boolean {
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

function toShippingAddress(address: CustomerAddressDto) {
  return {
    countryCode: "IR",
    countryName: "ایران",
    state: address.province,
    city: address.city,
    postalCode: address.postalCode,
    addressLine: address.addressLine,
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

function isBankGatewayPaymentMethod(method: CheckoutPaymentMethod): boolean {
  if (isGiftCardPaymentMethod(method)) return false;

  const value = `${method.code} ${method.title} ${method.description}`.toLowerCase();
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

export default function Checkout() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();

  const [selectedAddress, setSelectedAddress] =
    useState<CustomerAddressDto | null>(null);
  const [customerNote, setCustomerNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] =
    useState<CheckoutCouponDiscount | null>(null);
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponPreviewing, setCouponPreviewing] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState("");

  const [paymentMethods, setPaymentMethods] = useState<CheckoutPaymentMethod[]>(
    [],
  );
  const [shippingOptionsResult, setShippingOptionsResult] =
    useState<CheckoutShippingOptionsResult | null>(null);
  const [selectedPaymentCode, setSelectedPaymentCode] = useState<string | null>(
    null,
  );
  const [selectedProviderCode, setSelectedProviderCode] = useState<string | null>(
    null,
  );
  const [selectedShippingIdsByClass, setSelectedShippingIdsByClass] = useState<
    Record<string, string>
  >({});
  const [summaryStickyTop, setSummaryStickyTop] = useState(24);
  const [submitting, setSubmitting] = useState(false);
  const [pendingGatewayPayment, setPendingGatewayPayment] =
    useState<PendingGatewayPayment | null>(null);
  const [gatewayStarting, setGatewayStarting] = useState(false);

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

  const handleShippingOptionsChange = useCallback((result: CheckoutShippingOptionsResult | null) => {
    const groups = result?.groups ?? [];
    setShippingOptionsResult(result);
    setSelectedShippingIdsByClass((prev) => {
      const next: Record<string, string> = {};

      for (const group of groups) {
        const availableMethods = group.options.filter((item) => item.isAvailable);
        if (availableMethods.length === 0) continue;
        const classKey = group.shippingClassId;
        const previousSelection = prev[classKey];
        if (
          previousSelection &&
          availableMethods.some(
            (item) => item.id === previousSelection,
          )
        ) {
          next[classKey] = previousSelection;
          continue;
        }

        next[classKey] = availableMethods[0].id;
      }

      return next;
    });
  }, []);

  const handleSelectAddress = useCallback((address: CustomerAddressDto | null) => {
    setSelectedAddress(address);
    setCouponDiscount(null);
  }, []);

  const selectShippingMethod = useCallback(
    (classKey: string, methodId: string) => {
      setSelectedShippingIdsByClass((prev) => ({
        ...prev,
        [classKey]: methodId,
      }));
      setCouponDiscount(null);
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
        .filter(
          (method): method is CheckoutShippingMethod => Boolean(method),
        ),
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

  const selectedAvailableProviders = useMemo(
    () =>
      selectedPayment?.providers.filter((provider) => provider.isAvailable) ??
      [],
    [selectedPayment],
  );

  const selectedPaymentTitle = useMemo(
    () =>
      [selectedPayment?.title, selectedIsGiftCardPayment ? null : selectedProvider?.title]
        .filter(Boolean)
        .join(" - ") || selectedPaymentCode || "",
    [
      selectedIsGiftCardPayment,
      selectedPayment?.title,
      selectedPaymentCode,
      selectedProvider?.title,
    ],
  );

  const buildCouponPayload = useCallback(() => {
    const code = couponCode.trim();
    if (!code || !selectedAddress || !selectedShippingMethodId) return null;

    return {
      couponCode: code,
      shippingMethodId: selectedShippingMethodId,
      shippingAddress: toShippingAddress(selectedAddress),
    };
  }, [couponCode, selectedAddress, selectedShippingMethodId]);

  const shippingCost = selectedShippingMethods.reduce(
    (sum, method) => sum + method.price,
    0,
  );
  const discountAmount = couponDiscount?.couponIsApplicable
    ? couponDiscount.discount || couponDiscount.couponTotalDiscount
    : 0;
  const payable =
    couponDiscount?.couponIsApplicable && couponDiscount.payableAmount > 0
      ? couponDiscount.payableAmount
      : Math.max(0, totalPrice + shippingCost - discountAmount);
  const summarySubtotal =
    couponDiscount && couponDiscount.itemsSubtotal > 0
      ? couponDiscount.itemsSubtotal
      : totalPrice;
  const summaryShippingLabel =
    selectedShippingMethods.length === 0 &&
    shippingOptionsResult?.formattedCheapestTotalCost
      ? shippingOptionsResult.formattedCheapestTotalCost
      : selectedShippingMethods.length === 1
        ? formatShippingPrice(selectedShippingMethods[0])
        : formatMoney(shippingCost);

  useEffect(() => {
    const payload = buildCouponPayload();
    if (!couponDiscount?.couponIsApplicable || !payload) return;
    if (payload.couponCode !== couponDiscount.couponCode) return;
    const requestPayload = payload;

    let cancelled = false;

    async function previewDiscount() {
      setCouponPreviewing(true);
      try {
        const result = await previewCheckoutDiscount(requestPayload);
        if (cancelled) return;
        setCouponDiscount(result);
      } catch (err) {
        if (cancelled) return;
        console.error("[Checkout] preview discount failed =>", err);
        setCouponDiscount(null);
        notify.error(getAuthErrorMessage(err));
      } finally {
        if (!cancelled) {
          setCouponPreviewing(false);
        }
      }
    }

    void previewDiscount();
    return () => {
      cancelled = true;
    };
  }, [buildCouponPayload, couponDiscount?.couponCode, couponDiscount?.couponIsApplicable]);

  const handleCouponCodeChange = (value: string) => {
    setCouponCode(value);
    setCouponDiscount(null);
  };

  const handleApplyCoupon = async () => {
    const payload = buildCouponPayload();
    if (!couponCode.trim()) {
      notify.error("لطفاً کد تخفیف را وارد کنید");
      return;
    }
    if (!selectedAddress) {
      notify.error("لطفاً آدرس تحویل را انتخاب کنید");
      return;
    }
    if (selectedShippingMethods.length === 0) {
      notify.error("لطفاً روش ارسال را انتخاب کنید");
      return;
    }
    if (!payload) return;

    setCouponApplying(true);
    try {
      const result = await applyCheckoutCoupon(payload);
      setCouponDiscount(result);
      if (result.couponIsApplicable) {
        notify.success(result.couponMessage || "کد تخفیف اعمال شد");
      } else {
        notify.error(result.couponMessage || "کد تخفیف قابل اعمال نیست");
      }
    } catch (err) {
      console.error("[Checkout] apply coupon failed =>", err);
      setCouponDiscount(null);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setCouponApplying(false);
    }
  };

  // handlePlaceOrder is a function that places an order and redirects to the payment gateway
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      notify.error("سبد خرید خالی است");
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
    if (shippingSelections.length !== selectedShippingMethods.length) {
      notify.error("اطلاعات کلاس ارسال کامل نیست. لطفاً آدرس را دوباره انتخاب کنید.");
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

    setSubmitting(true);
    try {
      const serverItemCount = await ensureServerCartHasItems(items);
      if (serverItemCount < 1) {
        notify.error(
          "سبد خرید سرور خالی است. لطفاً دوباره محصول را به سبد اضافه کنید.",
        );
        return;
      }

      const result = await placeCheckoutOrder({
        shippingMethodId: selectedShippingMethodId,
        shippingSelections,
        shippingAddress: toShippingAddress(selectedAddress),
        paymentMethodCode: selectedPaymentCode,
        providerCode: selectedIsGiftCardPayment
          ? undefined
          : selectedProviderCode || undefined,
        couponCode: couponDiscount?.couponIsApplicable
          ? couponDiscount.couponCode
          : undefined,
        customerNote: customerNote.trim() || undefined,
        giftCardCode: giftCardCode.trim() || undefined,
      });

      const paymentUrl = result.paymentUrl || result.redirectUrl;

      notify.success(result.message || "سفارش با موفقیت ثبت شد");

      if (selectedIsGiftCardPayment) {
        await clearCart();
        setPendingGatewayPayment({
          orderId: result.orderId,
          orderNumber: result.orderNumber,
          paymentMethodTitle: selectedPaymentTitle || "کارت هدیه",
          isGiftCardPayment: true,
          addressTitle: selectedAddress.title,
          itemCount: totalItems,
          discount: discountAmount,
          shippingFee: shippingCost,
          totalAmount: totalPrice + shippingCost,
          payableAmount: payable,
        });
        return;
      }

      await clearCart();

      setPendingGatewayPayment({
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        providerCode: selectedProviderCode || undefined,
        directPaymentUrl: paymentUrl,
        paymentMethodTitle: selectedPaymentTitle,
        isGiftCardPayment: false,
        addressTitle: selectedAddress.title,
        itemCount: totalItems,
        discount: discountAmount,
        shippingFee: shippingCost,
        totalAmount: totalPrice + shippingCost,
        payableAmount: payable,
      });
    } catch (err) {
      console.error("[Checkout] place order failed =>", err);
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
      router.replace("/user-profile/orders");
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
      notify.error("شناسه سفارش برای شروع پرداخت دریافت نشد");
      return;
    }

    setGatewayStarting(true);
    try {
      const payment = await startOrderPayment({
        orderId: pendingGatewayPayment.orderId,
        providerCode: pendingGatewayPayment.providerCode,
      });

      if (!payment.redirectUrl) {
        notify.error("آدرس درگاه از سرویس پرداخت دریافت نشد");
        setGatewayStarting(false);
        return;
      }

      rememberPendingPaymentOrder(
        payment.orderId || pendingGatewayPayment.orderId,
        payment.orderNumber || pendingGatewayPayment.orderNumber,
      );
      window.location.href = payment.redirectUrl;
    } catch (err) {
      console.error("[Checkout] start payment failed =>", err);
      notify.error(getAuthErrorMessage(err));
      setGatewayStarting(false);
    }
  }, [gatewayStarting, pendingGatewayPayment, router]);

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

  return (
    <SectionContainer>
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
                <div className="timeline-title dark:text-white">جزئیات سفارش</div>
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
                                  تعداد: {new Intl.NumberFormat("fa-IR").format(item.quantity)}
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
                      پس از انتخاب آدرس، گزینه‌های ارسال هر گروه کالا نمایش داده می‌شود.
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
                            {new Intl.NumberFormat("fa-IR").format(group.itemCount)} کالا
                            {group.totalWeightGrams > 0
                              ? " • " + new Intl.NumberFormat("fa-IR").format(group.totalWeightGrams) + " گرم"
                              : ""}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {group.items.map((shippingItem) => {
                          const cartItem = findCartItemForShippingItem(shippingItem, items);
                          const quantity = shippingItem.quantity || cartItem?.quantity || 0;
                          const unitPrice = cartItem ? getCartItemUnitPrice(cartItem) : 0;
                          const lineTotal = unitPrice * quantity;

                          return (
                            <div
                              key={group.key + "-" + (shippingItem.productId || shippingItem.productName)}
                              className="grid grid-cols-1 gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800 sm:grid-cols-[1fr_auto]"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800">
                                  <Image
                                    width={56}
                                    height={56}
                                    src={cartItem?.image || "/images/default.png"}
                                    alt={cartItem?.title || shippingItem.productName}
                                    className="h-14 w-14 object-contain"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="truncate font-medium text-gray-800 dark:text-white">
                                    {cartItem?.title || shippingItem.productName}
                                  </h4>
                                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    تعداد: {new Intl.NumberFormat("fa-IR").format(quantity)}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-48">
                                <div>
                                  <span className="block text-gray-500 dark:text-gray-400">
                                    قیمت واحد
                                  </span>
                                  <span className="font-medium text-gray-800 dark:text-gray-100">
                                    {unitPrice > 0 ? formatMoney(unitPrice) : "?"}
                                  </span>
                                </div>
                                <div className="text-left">
                                  <span className="block text-gray-500 dark:text-gray-400">
                                    قیمت کل
                                  </span>
                                  <span className="font-bold text-gray-900 dark:text-white">
                                    {lineTotal > 0 ? formatMoney(lineTotal) : "?"}
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
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          {group.methods.map((method, methodIndex) => {
                            const isSelected = selectedShippingIdsByClass[group.key] === method.id;
                            const style =
                              SHIPPING_ICON_STYLES[
                                (groupIndex + methodIndex) % SHIPPING_ICON_STYLES.length
                              ];

                            return (
                              <div
                                key={method.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => selectShippingMethod(group.key, method.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    selectShippingMethod(group.key, method.id);
                                  }
                                }}
                                className={[
                                  "shipping-method flex aspect-square cursor-pointer flex-col justify-between rounded-lg border p-4 transition-all",
                                  isSelected
                                    ? "selected border-primary-500 bg-blue-50 ring-2 ring-primary-500/20 dark:bg-zinc-800"
                                    : "border-gray-300 hover:border-primary-500 dark:border-gray-600",
                                ].join(" ")}
                                data-shipping-id={method.shippingMethodId}
                                data-shipping-class-id={method.shippingClassId}
                                data-shipping-cost={method.price}
                              >
                                <div className="min-w-0">
                                  <div className="mb-3 flex items-start justify-between gap-2">
                                    <div
                                      className={["flex h-11 w-11 shrink-0 items-center justify-center rounded-lg", style.wrap].join(" ")}
                                    >
                                      <i className={style.icon}></i>
                                    </div>
                                    {isSelected ? (
                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                                        <i className="far fa-check"></i>
                                      </span>
                                    ) : null}
                                  </div>
                                  <h3 className="line-clamp-2 min-h-8 font-bold leading-6 text-gray-800 dark:text-white">
                                    {method.title}
                                  </h3>
                                  {method.description ? (
                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-600 dark:text-gray-400">
                                      {method.description}
                                    </p>
                                  ) : null}
                                </div>
                                <div>
                                  <div className="mb-3 flex flex-wrap gap-2 text-[11px]">
                                    {method.estimatedDeliveryDays ? (
                                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                                        {new Intl.NumberFormat("fa-IR").format(method.estimatedDeliveryDays)} روز کاری
                                      </span>
                                    ) : null}
                                    {method.cashOnDelivery ? (
                                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                        پرداخت در محل
                                      </span>
                                    ) : null}
                                  </div>
                                  <div className="font-bold text-gray-900 dark:text-white">
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

              <div className="flex flex-wrap gap-4">
                {paymentMethods.map((method, index) => {
                  const isSelected = selectedPaymentCode === method.code;
                  const isBankGateway = isBankGatewayPaymentMethod(method);
                  const style =
                    isBankGateway
                      ? BANK_GATEWAY_ICON_STYLE
                      : PAYMENT_ICON_STYLES[index % PAYMENT_ICON_STYLES.length];
                  const methodImageSrc = isBankGateway
                    ? null
                    : getRenderableImageSrc(method.imageUrl);

                  return (
                    <div
                      key={method.code}
                      className={[
                        "payment-method flex h-[200px] w-[200px] max-w-full rounded-lg border p-4 transition-all",
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
                        className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 text-center"
                      >
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-lg ${style.wrap}`}
                        >
                          {methodImageSrc ? (
                            <Image
                              src={methodImageSrc}
                              alt={method.title}
                              width={56}
                              height={56}
                              unoptimized
                              className="h-12 w-12 object-contain"
                            />
                          ) : (
                            <i className={style.icon}></i>
                          )}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium text-gray-800 dark:text-white">
                            {method.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
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
                  <div className="flex flex-wrap gap-4">
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
                            "flex h-[200px] w-[200px] max-w-full flex-col items-center justify-center gap-3 rounded-lg border p-4 text-center transition-all",
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
                              className="h-16 w-16 object-contain"
                            />
                          ) : (
                            <i className="far fa-building-columns text-2xl text-primary-500"></i>
                          )}
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
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
                  disabled={couponApplying || couponPreviewing}
                  onClick={() => void handleApplyCoupon()}
                  className="shrink-0 rounded-e-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {couponApplying
                    ? "اعمال..."
                    : couponPreviewing
                      ? "محاسبه..."
                      : "اعمال"}
                </button>
              </div>
              {couponDiscount ? (
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
                <span className="text-gray-600 dark:text-gray-400">جمع کالاها:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200" id="subtotal">
                  {formatMoney(summarySubtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">هزینه ارسال:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200" id="shipping-cost">
                  {summaryShippingLabel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">تخفیف:</span>
                <span className="font-medium text-green-600 dark:text-green-400" id="discount">
                  {formatMoney(discountAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">تعداد کالا:</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {new Intl.NumberFormat("fa-IR").format(totalItems)}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-4 dark:border-gray-700">
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
              disabled={submitting}
              onClick={() => void handlePlaceOrder()}
              className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-4 font-medium text-white transition-colors duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "در حال ثبت سفارش..." : "پرداخت و تکمیل سفارش"}
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
