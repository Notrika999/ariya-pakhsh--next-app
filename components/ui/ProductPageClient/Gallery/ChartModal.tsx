// components/ui/ProductPageClient/Gallery/ChartModal.tsx
"use client";

import ProductPriceChart, {
  type PriceChartItem,
} from "@/components/modules/ProductPriceChart/ProductPriceChart";
import { apiClient } from "@/src/lib/http/api-client";
import { useEffect, useMemo, useState } from "react";
type Variant = { id: string; label: string };

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function getChartPoints(root: unknown, selectedVariantId: string) {
  if (Array.isArray(root)) return root as PriceChartItem[];

  const rootRecord = getRecord(root);
  const dataRecord = getRecord(rootRecord?.data);
  const payload = dataRecord ?? rootRecord;

  if (!payload) return [];

  if (Array.isArray(payload.points)) {
    return payload.points as PriceChartItem[];
  }

  const variants = Array.isArray(payload.variants) ? payload.variants : [];
  const selectedVariant = variants
    .map(getRecord)
    .find((variant) => variant?.variantId === selectedVariantId);

  if (Array.isArray(selectedVariant?.points)) {
    return selectedVariant.points as PriceChartItem[];
  }

  const variantDataMap = getRecord(payload.variantDataMap);
  const selectedVariantKey =
    typeof selectedVariant?.key === "string"
      ? selectedVariant.key
      : typeof selectedVariant?.name === "string"
        ? selectedVariant.name
        : "";

  const mappedPoints = selectedVariantKey
    ? variantDataMap?.[selectedVariantKey]
    : undefined;

  return Array.isArray(mappedPoints) ? (mappedPoints as PriceChartItem[]) : [];
}

export default function ChartModal({
  open,
  onClose,
  productId,
  variants,
  initialVariantId,
}: {
  open: boolean;
  onClose: () => void;
  productId: string;
  variants: Variant[];
  initialVariantId?: string;
}) {
  const defaultVariantId = useMemo(() => {
    if (initialVariantId && variants.some((v) => v.id === initialVariantId)) {
      return initialVariantId;
    }

    return variants?.[0]?.id ?? "";
  }, [initialVariantId, variants]);

  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);
  const [data, setData] = useState<PriceChartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open || !productId || !selectedVariantId) return;

    let cancelled = false;

    async function loadPriceChart() {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await apiClient.get<unknown>(
          `/Products/${encodeURIComponent(productId)}/price-chart`,
          {
            params: {
              variantId: selectedVariantId,
            },
          },
        );

        if (!cancelled) {
          setData(getChartPoints(response.data, selectedVariantId));
        }
      } catch {
        if (!cancelled) {
          setData([]);
          setErrorMessage("دریافت تاریخچه قیمت انجام نشد.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPriceChart();

    return () => {
      cancelled = true;
    };
  }, [open, productId, selectedVariantId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/40">
      <div className="bg-white dark:bg-custom-dark rounded-lg shadow-lg w-full max-w-6xl border dark:border-gray-700">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <div>
            <h3 className="font-black text-lg text-gray-900 dark:text-white">
              نمودار تغییر قیمت
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              تاریخچه تغییر قیمت محصول
            </p>
          </div>

          <button onClick={onClose} className="text-gray-500 text-2xl">
            ✕
          </button>
        </div>

        {/* VARIANT CONTROL (بالای چارت) */}
        <div className="px-5 pt-5">
          <div className="flex items-center  gap-2 flex-wrap">
            <span className="text-sm text-gray-700 dark:text-gray-200 font-bold">
              انتخاب رنگ
            </span>

            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={[
                  "px-4 py-2 rounded-xl border text-sm",
                  selectedVariantId === v.id
                    ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300",
                ].join(" ")}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* CHART */}
        <div className="relative">
          {loading ? (
            <div className="flex h-[430px] items-center justify-center bg-white p-5 text-sm text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
              در حال دریافت تاریخچه قیمت...
            </div>
          ) : errorMessage ? (
            <div className="flex h-[430px] items-center justify-center bg-white p-5 text-sm text-red-500 dark:bg-zinc-900">
              {errorMessage}
            </div>
          ) : data.length > 0 ? (
            <ProductPriceChart data={data} />
          ) : (
            <div className="flex h-[430px] items-center justify-center bg-white p-5 text-sm text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
              تاریخچه قیمتی برای این ورینت ثبت نشده است.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
