"use client";
// components/ui/Checkout/Checkout.tsx
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import CheckoutDeliveryAddress from "./CheckoutDeliveryAddress";
import { useCart } from "@/src/context/CartContext";
import type { CustomerAddressDto } from "@/src/lib/types/address/address.type";
import type {
  CheckoutPaymentMethod,
  CheckoutShippingMethod,
} from "@/src/lib/types/checkout/checkout.types";
import {
  ensureServerCartHasItems,
  getCheckoutPaymentMethods,
  placeCheckoutOrder,
  startOrderPayment,
} from "@/src/services/checkout/checkout.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";

const formatMoney = (value: number) =>
  `${new Intl.NumberFormat("fa-IR").format(Math.max(0, Math.round(value)))} تومان`;

const formatShippingPrice = (method: CheckoutShippingMethod) =>
  method.formattedPrice ?? (method.price > 0 ? formatMoney(method.price) : "رایگان");

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

export default function Checkout() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();

  const [selectedAddress, setSelectedAddress] =
    useState<CustomerAddressDto | null>(null);
  const [customerNote, setCustomerNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [giftCardCode, setGiftCardCode] = useState("");

  const [paymentMethods, setPaymentMethods] = useState<CheckoutPaymentMethod[]>(
    [],
  );
  const [shippingMethods, setShippingMethods] = useState<
    CheckoutShippingMethod[]
  >([]);
  const [selectedPaymentCode, setSelectedPaymentCode] = useState<string | null>(
    null,
  );
  const [selectedProviderCode, setSelectedProviderCode] = useState<string | null>(
    null,
  );
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  const selectPaymentMethod = (method: CheckoutPaymentMethod) => {
    setSelectedPaymentCode(method.code);
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
          setShippingMethods([]);
        }
      }
    }

    void loadMethods();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleShippingOptionsChange = useCallback((methods: CheckoutShippingMethod[]) => {
    const availableMethods = methods.filter((item) => item.isAvailable);
    setShippingMethods(availableMethods);
    setSelectedShippingId(availableMethods[0]?.id ?? null);
  }, []);

  const selectedShipping = useMemo(
    () =>
      shippingMethods.find((item) => item.id === selectedShippingId) ?? null,
    [shippingMethods, selectedShippingId],
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

  const shippingCost = selectedShipping?.price ?? 0;
  const payable = totalPrice + shippingCost;

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      notify.error("سبد خرید خالی است");
      return;
    }
    if (!selectedAddress) {
      notify.error("لطفاً آدرس تحویل را انتخاب کنید");
      return;
    }
    if (!selectedShippingId) {
      notify.error("لطفاً روش ارسال را انتخاب کنید");
      return;
    }
    if (!selectedPaymentCode) {
      notify.error("لطفاً روش پرداخت را انتخاب کنید");
      return;
    }
    if (
      selectedPayment &&
      selectedPayment.providers.length > 0 &&
      !selectedProviderCode
    ) {
      notify.error("لطفاً بانک مقصد را انتخاب کنید");
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
        shippingMethodId: selectedShippingId,
        shippingAddress: toShippingAddress(selectedAddress),
        paymentMethodCode: selectedPaymentCode,
        providerCode: selectedProviderCode || undefined,
        couponCode: couponCode.trim() || undefined,
        customerNote: customerNote.trim() || undefined,
        giftCardCode: giftCardCode.trim() || undefined,
      });

      let paymentUrl = result.paymentUrl || result.redirectUrl;

      if (!paymentUrl && result.orderId) {
        const payment = await startOrderPayment({
          orderId: result.orderId,
          providerCode: selectedProviderCode || undefined,
        });
        paymentUrl = payment.redirectUrl;
      }

      await clearCart();

      if (paymentUrl) {
        window.location.href = paymentUrl;
        return;
      }

      notify.success(result.message || "سفارش با موفقیت ثبت شد");
      router.push(
        result.orderId
          ? `/success-payment?orderId=${encodeURIComponent(result.orderId)}`
          : "/success-payment",
      );
    } catch (err) {
      console.error("[Checkout] place order failed =>", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

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
              <div className="space-y-4">
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
              onSelectAddress={setSelectedAddress}
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

            {/* Sending method */}
            <div className="mb-8">
              <h2 className="mb-4 flex items-center text-xl font-bold text-gray-800 dark:text-white">
                <i className="far fa-truck me-2 text-sm text-primary-500"></i>
                روش ارسال
              </h2>

              <div className="space-y-4">
                {shippingMethods.map((method, index) => {
                  const isSelected = selectedShippingId === method.id;
                  const style =
                    SHIPPING_ICON_STYLES[index % SHIPPING_ICON_STYLES.length];

                  return (
                    <div
                      key={method.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedShippingId(method.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedShippingId(method.id);
                        }
                      }}
                      className={[
                        "shipping-method cursor-pointer rounded-lg border p-4 transition-all",
                        isSelected
                          ? "selected border-primary-500 bg-blue-50 dark:bg-zinc-800"
                          : "border-gray-300 hover:border-primary-500 dark:border-gray-600",
                      ].join(" ")}
                      data-shipping-id={method.id}
                      data-shipping-cost={method.price}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`me-3 flex h-12 w-12 items-center justify-center rounded-lg ${style.wrap}`}
                          >
                            <i className={style.icon}></i>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-white">
                              {method.title}
                            </h3>
                            {method.description ? (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {method.description}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-gray-800 dark:text-white">
                            {formatShippingPrice(method)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment method */}
            <div className="mb-8">
              <h2 className="mb-4 flex items-center text-xl font-bold text-gray-800 dark:text-white">
                <i className="far fa-credit-card text-sm text-primary-500"></i>
                روش پرداخت
              </h2>

              <div className="space-y-4">
                {paymentMethods.map((method, index) => {
                
                  const isSelected = selectedPaymentCode === method.code;
                  const style =
                    PAYMENT_ICON_STYLES[index % PAYMENT_ICON_STYLES.length];
                  const availableProviders = method.providers.filter(
                    (provider) => provider.isAvailable,
                  );

                  return (
                    <div
                      key={method.code}
                      className={[
                        "payment-method rounded-lg border p-4 transition-all",
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
                        className="flex cursor-pointer items-center"
                      >
                        <div
                          className={`me-3 flex h-12 w-12 items-center justify-center rounded-lg ${style.wrap}`}
                        >
                          <i className={style.icon}></i>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">
                            {method.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {method.description}
                          </p>
                        </div>
                      </div>

                      {isSelected && availableProviders.length > 0 ? (
                        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                          <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                            بانک مقصد
                          </p>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {availableProviders.map((provider) => {
                              const isProviderSelected =
                                selectedProviderCode === provider.code;

                              return (
                                <button
                                  key={provider.code}
                                  type="button"
                                  onClick={() =>
                                    setSelectedProviderCode(provider.code)
                                  }
                                  className={[
                                    "flex flex-col items-center justify-center gap-2 rounded-lg border p-3 text-center transition-all",
                                    isProviderSelected
                                      ? "border-primary-500 bg-white ring-2 ring-primary-500/30 dark:bg-zinc-900"
                                      : "border-gray-300 bg-white hover:border-primary-500 dark:border-gray-600 dark:bg-zinc-900",
                                  ].join(" ")}
                                >
                                  {provider.logoUrl ? (
                                    <Image
                                      src={provider.logoUrl}
                                      alt={provider.title}
                                      width={40}
                                      height={40}
                                      className="h-10 w-10 object-contain"
                                    />
                                  ) : (
                                    <i className="far fa-building-columns text-lg text-primary-500"></i>
                                  )}
                                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                    {provider.title}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

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
            </div>
          </div>
        </div>

        {/* Left Section - Summary */}
        <div>
          <div className="sticky top-0 z-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
            <h2
              className="relative mb-4 pb-4 text-lg font-black text-gray-900 dark:text-gray-200
                before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary
                after:absolute after:inset-s-4 after:bottom-0 after:h-2 after:w-40 after:rounded-lg after:bg-primary"
            >
              خلاصه سفارش
            </h2>

            <div className="mb-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700"
                >
                  <div className="flex items-center">
                    <div className="me-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-gray-200 dark:bg-zinc-800">
                      <Image
                        width={56}
                        height={56}
                        src={item.image || "/images/default.png"}
                        alt={item.title}
                        className="h-14 w-14 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Intl.NumberFormat("fa-IR").format(item.quantity)}{" "}
                        عدد
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatMoney(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">جمع کل:</span>
                <span className="text-gray-800 dark:text-gray-200" id="subtotal">
                  {formatMoney(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">تخفیف:</span>
                <span
                  className="text-green-600 dark:text-green-400"
                  id="discount"
                >
                  {formatMoney(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  هزینه ارسال:
                </span>
                <span
                  className="text-gray-800 dark:text-gray-200"
                  id="shipping-cost"
                >
                  {selectedShipping
                    ? formatShippingPrice(selectedShipping)
                    : formatMoney(0)}
                </span>
              </div>
              <div
                className="hidden justify-between"
                id="delivery-time-cost-container"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  هزینه زمان تحویل:
                </span>
                <span
                  className="text-gray-800 dark:text-gray-200"
                  id="delivery-time-cost"
                >
                  {formatMoney(0)}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-3 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    مبلغ قابل پرداخت:
                  </span>
                  <span
                    className="text-lg font-bold text-gray-800 dark:text-gray-200"
                    id="total-cost"
                  >
                    {formatMoney(payable)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <h3 className="mb-2 font-medium text-blue-800 dark:text-blue-300">
                جزئیات انتخاب‌ها
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">
                    روش ارسال:
                  </span>
                  <span
                    className="text-blue-800 dark:text-blue-200"
                    id="selected-shipping"
                  >
                    {selectedShipping?.title ?? ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">
                    زمان تحویل:
                  </span>
                  <span
                    className="text-blue-800 dark:text-blue-200"
                    id="selected-delivery-time"
                  >
                    {selectedShipping?.estimatedDeliveryDays
                      ? `${new Intl.NumberFormat("fa-IR").format(
                          selectedShipping.estimatedDeliveryDays,
                        )} روز`
                      : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">
                    روش پرداخت:
                  </span>
                  <span
                    className="text-blue-800 dark:text-blue-200"
                    id="selected-payment"
                  >
                    {[selectedPayment?.title, selectedProvider?.title]
                      .filter(Boolean)
                      .join(" - ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                کد تخفیف
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 rounded-s-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-200"
                  placeholder="کد تخفیف را وارد کنید"
                />
                <button
                  type="button"
                  className="rounded-e-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700"
                >
                  اعمال
                </button>
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
              با کلیک بر روی دکمه پرداخت،
              <Link
                href="/rules"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500"
              >
                قوانین و شرایط
              </Link>
              را پذیرفته‌اید.
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-start">
              <i className="fas fa-shield-alt me-2 mt-1 text-blue-500 dark:text-blue-300"></i>
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-300">
                  پرداخت امن
                </h3>
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-200">
                  اطلاعات شما نزد ما کاملا محفوظ است و پرداخت از طریق درگاه امن
                  بانکی انجام می‌شود.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
