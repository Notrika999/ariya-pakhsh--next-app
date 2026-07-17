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
import BankDetails from "./formContent/BankDetails";
import UploadDocuments from "./formContent/UploadDocuments";
import ReturnSummary from "./formContent/ReturnSummary";
import ReturnTerms from "./formContent/ReturnTerms";
import SubmitSection from "./formContent/SubmitSection";
import {
  createMyOrderReturn,
  getMyOrderById,
  getMyOrders,
} from "@/src/services/orders/orders.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";

const REASON_LABELS = {
  defective: "کالای معیوب یا ناقص",
  wrong_item: "کالای نادرست ارسال شده",
  not_as_described: "مغایرت با توضیحات",
  change_mind: "تغییر نظر",
  damaged: "آسیب دیده در حمل و نقل",
  other: "سایر دلایل",
};

function buildReasonText(returnReason, details) {
  const label = REASON_LABELS[returnReason] || returnReason || "";
  const note = details.trim();
  if (label && note) return `${label}: ${note}`;
  return note || label;
}

export default function OrdersReturn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdFromQuery = searchParams.get("orderId")?.trim() || "";

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
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    sheba: "",
    cardNumber: "",
    owner: "",
  });
  const [documents, setDocuments] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const loadOrderList = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const page = await getMyOrders({ pageNumber: 1, pageSize: 50 });
      setOrderOptions(page.items);
      if (!orderIdFromQuery && page.items[0]?.orderId) {
        setFallbackOrderId(page.items[0].orderId);
      }
    } catch (error) {
      console.error("[OrdersReturn] load orders failed =>", error);
      notify.error(getAuthErrorMessage(error));
      setOrderOptions([]);
    } finally {
      setLoadingOrders(false);
    }
  }, [orderIdFromQuery]);

  const loadOrderDetail = useCallback(async (orderId) => {
    if (!orderId) {
      setOrderDetail(null);
      setSelections({});
      return;
    }

    setLoadingDetail(true);
    try {
      const detail = await getMyOrderById(orderId);
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
    } catch (error) {
      console.error("[OrdersReturn] load order detail failed =>", error);
      notify.error(getAuthErrorMessage(error));
      setOrderDetail(null);
      setSelections({});
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOrderList();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadOrderList]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOrderDetail(selectedOrderId);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedOrderId, loadOrderDetail]);

  const handleSelectOrder = (orderId) => {
    setFallbackOrderId(orderId);
    const params = new URLSearchParams(searchParams.toString());
    if (orderId) params.set("orderId", orderId);
    else params.delete("orderId");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const updateSelection = (orderItemId, value) => {
    setSelections((prev) => ({
      ...prev,
      [orderItemId]: value,
    }));
  };

  const updateBankField = (key, value) => {
    setBankDetails((prev) => ({ ...prev, [key]: value }));
  };

  const orderItems = useMemo(
    () => orderDetail?.items ?? [],
    [orderDetail],
  );

  const handleSubmit = async () => {
    if (!selectedOrderId) {
      notify.error("لطفاً سفارش را انتخاب کنید");
      return;
    }

    const items = orderItems
      .filter((item) => selections[item.orderItemId]?.checked)
      .map((item) => ({
        orderItemId: item.orderItemId,
        quantity: Math.min(
          Math.max(1, Number(selections[item.orderItemId]?.quantity) || 1),
          Number(item.quantity) || 1,
        ),
      }));

    if (items.length === 0) {
      notify.error("حداقل یک محصول را برای مرجوعی انتخاب کنید");
      return;
    }

    const reason = buildReasonText(returnReason, details);
    if (!reason) {
      notify.error("لطفاً دلیل مرجوعی یا توضیحات را وارد کنید");
      return;
    }

    if (!termsAccepted) {
      notify.error("پذیرش شرایط و قوانین مرجوعی الزامی است");
      return;
    }

    // UI-only fields kept for later API expansion
    console.log("[OrdersReturn] UI-only fields (not sent) =>", {
      refundMethod,
      bankDetails,
      documentsCount: documents.length,
      conditions: Object.fromEntries(
        Object.entries(selections).map(([id, value]) => [id, value.condition]),
      ),
      termsAccepted,
    });

    const payload = { reason, items };
    setSubmitting(true);

    try {
      const result = await createMyOrderReturn(selectedOrderId, payload);
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
        onSelectOrder={handleSelectOrder}
        loading={loadingOrders}
      />

      <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <TitleAfter title={"فرم درخواست مرجوعی"} />

        {loadingDetail ? (
          <div className="space-y-4 py-6">
            <div className="h-28 animate-pulse rounded-xl bg-gray-100 dark:bg-zinc-800" />
            <div className="h-28 animate-pulse rounded-xl bg-gray-100 dark:bg-zinc-800" />
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
            <ReturnReasons
              value={returnReason}
              onChange={setReturnReason}
            />
            <AdditionalDetails value={details} onChange={setDetails} />
            <RefundMethod value={refundMethod} onChange={setRefundMethod} />
            <BankDetails
              value={bankDetails}
              onChange={updateBankField}
              visible={refundMethod === "bank"}
            />
            <UploadDocuments files={documents} onChange={setDocuments} />
            <ReturnSummary
              orderItems={orderItems}
              selections={selections}
            />
            <ReturnTerms
              accepted={termsAccepted}
              onChange={setTermsAccepted}
              disabled={submitting}
            />
            <SubmitSection
              onSubmit={() => void handleSubmit()}
              submitting={submitting}
              disabled={!selectedOrderId || orderItems.length === 0}
            />
          </form>
        )}
      </div>
    </div>
  );
}
