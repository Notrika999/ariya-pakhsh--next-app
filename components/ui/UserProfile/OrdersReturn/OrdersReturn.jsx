"use client";
// components/ui/UserProfile/OrdersReturn/OrdersReturn.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import OrdersReturnTop from "./OrdersReturnTop";
import ReturnProducts from "./formContent/ReturnProducts";
import ReturnReasons from "./formContent/ReturnReasons";
import AdditionalDetails from "./formContent/AdditionalDetails";
import RefundMethod from "./formContent/RefundMethod";
import UploadDocuments from "./formContent/UploadDocuments";
import ReturnSummary from "./formContent/ReturnSummary";
import ReturnTerms from "./formContent/ReturnTerms";
import SubmitSection from "./formContent/SubmitSection";
import {
  createMyOrderReturn,
  getMyOrderById,
  getMyOrderByNumber,
  getMyOrders,
} from "@/src/services/orders/orders.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { canRequestReturnForOrder } from "@/src/lib/helper/orderReturnEligibility";
import { notify } from "@/src/utils/toast";

export default function OrdersReturn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdFromQuery = searchParams.get("orderId")?.trim() || "";
  const orderNumberFromQuery = searchParams.get("orderNumber")?.trim() || "";

  const [orderOptions, setOrderOptions] = useState([]);
  const [fallbackOrderId, setFallbackOrderId] = useState("");
  const selectedOrderId = orderIdFromQuery || fallbackOrderId;
  const [orderDetail, setOrderDetail] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selections, setSelections] = useState({});
  const [returnReason, setReturnReason] = useState("");
  const [details, setDetails] = useState("");
  const [refundMethod, setRefundMethod] = useState("wallet");
  const [isPurchaseCardOwnedByCustomer, setIsPurchaseCardOwnedByCustomer] =
    useState(true);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [customerNationalIdFiles, setCustomerNationalIdFiles] = useState([]);
  const [cardOwnerNationalIdFiles, setCardOwnerNationalIdFiles] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const resetReturnForm = useCallback(() => {
    setReturnReason("");
    setDetails("");
    setRefundMethod("wallet");
    setIsPurchaseCardOwnedByCustomer(true);
    setEvidenceFiles([]);
    setCustomerNationalIdFiles([]);
    setCardOwnerNationalIdFiles([]);
    setTermsAccepted(false);
  }, []);

  const loadOrderList = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const page = await getMyOrders({ pageNumber: 1, pageSize: 50 });
      const eligibleOrders = (page.items ?? []).filter((order) =>
        canRequestReturnForOrder(order),
      );
      setOrderOptions(eligibleOrders);
      if (
        !orderIdFromQuery &&
        !orderNumberFromQuery &&
        eligibleOrders[0]?.orderId
      ) {
        setFallbackOrderId(eligibleOrders[0].orderId);
      }
    } catch (error) {
      console.error("[OrdersReturn] load orders failed =>", error);
      notify.error(getAuthErrorMessage(error));
      setOrderOptions([]);
    } finally {
      setLoadingOrders(false);
    }
  }, [orderIdFromQuery, orderNumberFromQuery]);

  const loadOrderDetail = useCallback(
    async ({ orderId, orderNumber }) => {
      if (!orderId && !orderNumber) {
        setOrderDetail(null);
        setSelections({});
        resetReturnForm();
        return;
      }

      setLoadingDetail(true);
      try {
        const detail = orderId
          ? await getMyOrderById(orderId)
          : await getMyOrderById(
              (await getMyOrderByNumber(orderNumber)).orderId,
            );

        if (!orderId && detail.orderId) {
          setFallbackOrderId(detail.orderId);
        }

        setOrderDetail(detail);

        const nextSelections = {};
        for (const item of detail.items) {
          nextSelections[item.orderItemId] = {
            checked: false,
            quantity: 1,
            condition: "unopened",
          };
        }
        setSelections(nextSelections);
        resetReturnForm();
      } catch (error) {
        console.error("[OrdersReturn] load order detail failed =>", error);
        notify.error(getAuthErrorMessage(error));
        setOrderDetail(null);
        setSelections({});
        resetReturnForm();
      } finally {
        setLoadingDetail(false);
      }
    },
    [resetReturnForm],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOrderList();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadOrderList]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOrderDetail({
        orderId: selectedOrderId,
        orderNumber: orderNumberFromQuery,
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedOrderId, orderNumberFromQuery, loadOrderDetail]);

  const handleSelectOrder = (orderId, orderNumber = "") => {
    setFallbackOrderId(orderId);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("orderId");
    params.delete("orderNumber");

    if (orderId) params.set("orderId", orderId);
    else if (orderNumber) params.set("orderNumber", orderNumber);

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const updateSelection = (orderItemId, value) => {
    setSelections((prev) => ({
      ...prev,
      [orderItemId]: value,
    }));
  };

  const updateCardOwnership = (value) => {
    setIsPurchaseCardOwnedByCustomer(value);
    if (value) setCardOwnerNationalIdFiles([]);
  };

  const orderItems = useMemo(
    () =>
      canRequestReturnForOrder(orderDetail)
        ? (orderDetail?.items ?? []).map((item) => ({
            ...item,
            canRequestReturn: true,
          }))
        : [],
    [orderDetail],
  );
  const selectedReturnOrderId = orderDetail?.orderId || selectedOrderId;

  const handleSubmit = async () => {
    if (!selectedReturnOrderId) {
      notify.error("لطفاً سفارش را انتخاب کنید");
      return;
    }

    const items = orderItems
      .filter(
        (item) =>
          item.canRequestReturn !== false &&
          selections[item.orderItemId]?.checked,
      )
      .map((item) => ({
        orderItemId: item.orderItemId,
        quantity: Math.min(
          Math.max(1, Number(selections[item.orderItemId]?.quantity) || 1),
          Number(item.quantity) || 1,
        ),
        productCondition: selections[item.orderItemId]?.condition || "unopened",
      }));

    if (items.length === 0) {
      notify.error("حداقل یک محصول را برای مرجوعی انتخاب کنید");
      return;
    }

    if (!returnReason) {
      notify.error("لطفاً دلیل مرجوعی را انتخاب کنید");
      return;
    }

    if (returnReason === "other" && !details.trim()) {
      notify.error("برای دلیل سایر، توضیحات تکمیلی را وارد کنید");
      return;
    }

    if (!termsAccepted) {
      notify.error("پذیرش شرایط و قوانین مرجوعی الزامی است");
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();

      payload.append("OrderId", selectedReturnOrderId);
      payload.append("ReasonCode", returnReason);
      if (details.trim()) payload.append("Description", details.trim());
      payload.append("RefundMethod", refundMethod);
      payload.append(
        "IsPurchaseCardOwnedByCustomer",
        String(isPurchaseCardOwnedByCustomer),
      );

      items.forEach((item, index) => {
        const prefix = `Items[${index}]`;
        payload.append(`${prefix}.OrderItemId`, item.orderItemId);
        payload.append(`${prefix}.Quantity`, String(item.quantity));
        payload.append(`${prefix}.ProductCondition`, item.productCondition);
      });

      evidenceFiles.forEach((file) => {
        payload.append("EvidenceFiles", file, file.name);
      });

      if (refundMethod === "bank_account") {
        customerNationalIdFiles.forEach((file) => {
          payload.append("CustomerNationalIdFiles", file, file.name);
        });
      }

      if (refundMethod === "bank_account" && !isPurchaseCardOwnedByCustomer) {
        cardOwnerNationalIdFiles.forEach((file) => {
          payload.append("CardOwnerNationalIdFiles", file, file.name);
        });
      }

      const result = await createMyOrderReturn(selectedReturnOrderId, payload);
      notify.success(result.message || "درخواست مرجوعی با موفقیت ثبت شد");
      if (result.returnId) {
        notify.info(`کد پیگیری: ${result.returnId}`);
      }
    } catch (error) {
      console.error("[OrdersReturn] submit failed =>", error);
      notify.error(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 lg:col-span-3">
      <OrdersReturnTop
        orderNumber={orderDetail?.publicOrderNumber}
        orderOptions={orderOptions}
        selectedOrderId={selectedOrderId}
        selectedOrderNumber={orderNumberFromQuery}
        onSelectOrder={handleSelectOrder}
        loading={loadingOrders}
      />

      <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <TitleAfter title={"فرم درخواست مرجوعی"} />

        {loadingDetail ? (
          <div className="space-y-4 py-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`return-item-skeleton-${index}`}
                className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-zinc-800"
              />
            ))}
            <div className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-zinc-800" />
            <div className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-zinc-800" />
          </div>
        ) : (
          <form
            className="space-y-8"
            id="returnForm"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}
          >
            <ReturnProducts
              orderItems={orderItems}
              selections={selections}
              onChange={updateSelection}
              disabled={submitting}
            />
            <ReturnReasons value={returnReason} onChange={setReturnReason} />
            <AdditionalDetails value={details} onChange={setDetails} />
            <RefundMethod
              value={refundMethod}
              onChange={setRefundMethod}
              isPurchaseCardOwnedByCustomer={isPurchaseCardOwnedByCustomer}
              onCardOwnershipChange={updateCardOwnership}
              disabled={submitting}
            />
            {refundMethod === "bank_account" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <UploadDocuments
                  title="مستندات مرجوعی"
                  description="تصویر ایراد کالا، بسته‌بندی یا فاکتور را بارگذاری کنید."
                  guideDescription="تصاویر باید خوانا، بدون لرزش و مرتبط با علت مرجوعی باشند. هر فایل حداکثر ۲ مگابایت باشد."
                  files={evidenceFiles}
                  onChange={setEvidenceFiles}
                  disabled={submitting}
                />
                <UploadDocuments
                  title="مدارک هویتی مشتری"
                  description="در صورت نیاز، تصویر کارت ملی خریدار را بارگذاری کنید."
                  guideDescription="📌 راهنمای بارگذاری مدارک

لطفاً تصویر کارت بانکی که پرداخت سفارش با آن انجام شده است و همچنین کارت ملی صاحب کارت را بارگذاری کنید.

تصاویر باید:

کاملاً واضح و خوانا باشند.
تار یا بی‌کیفیت نباشند.
اطلاعات موردنیاز در تصویر پوشیده یا مخدوش نشده باشد.
تمام بخش‌های ضروری کارت به‌طور کامل قابل مشاهده باشد.
حجم هر فایل کمتر از ۲ مگابایت باشد.

⚠️ توجه: کارت بانکی و کارت ملی باید متعلق به یک شخص باشند.(چنانچه با کارت شخص دیگری سفارش پرداخت شده است، کارت ملی صاحب کارت و کارت ملی خود را هم بارگذاری کنید)"
                  files={customerNationalIdFiles}
                  onChange={setCustomerNationalIdFiles}
                  disabled={submitting}
                />
                {!isPurchaseCardOwnedByCustomer ? (
                  <div className="md:col-span-2">
                    <UploadDocuments
                      title="مدارک هویتی مالک کارت"
                      description="وقتی کارت بانکی متعلق به خریدار نیست، مدارک مالک کارت را اضافه کنید."
                      guideDescription="تصویر کارت ملی مالک کارت باید با اطلاعات حساب بانکی معرفی‌شده قابل تطبیق باشد."
                      files={cardOwnerNationalIdFiles}
                      onChange={setCardOwnerNationalIdFiles}
                      disabled={submitting}
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <UploadDocuments
                title="مستندات مرجوعی"
                description="تصویر ایراد کالا، بسته‌بندی یا فاکتور را بارگذاری کنید."
                guideDescription="تصاویر باید خوانا، بدون لرزش و مرتبط با علت مرجوعی باشند. هر فایل حداکثر ۲ مگابایت باشد."
                files={evidenceFiles}
                onChange={setEvidenceFiles}
                disabled={submitting}
              />
            )}
            <ReturnSummary
              orderItems={orderItems}
              selections={selections}
              refundMethod={refundMethod}
              returnReason={returnReason}
              evidenceFileCount={evidenceFiles.length}
              customerNationalIdFileCount={customerNationalIdFiles.length}
              cardOwnerNationalIdFileCount={cardOwnerNationalIdFiles.length}
            />
            <ReturnTerms
              accepted={termsAccepted}
              onChange={setTermsAccepted}
              disabled={submitting}
            />
            <SubmitSection
              onSubmit={() => void handleSubmit()}
              submitting={submitting}
              disabled={!selectedReturnOrderId || orderItems.length === 0}
            />
          </form>
        )}
      </div>
    </div>
  );
}
