// components/ui/ProductPageClient/Gallery/ChartModal.tsx
"use client";

import ProductPriceChart, {
  type PriceChartItem,
} from "@/components/modules/ProductPriceChart/ProductPriceChart";
import {
  isLightHex,
  swatchStyle,
} from "@/components/ui/ProductPageClient/Description/Description";
import { apiClient } from "@/src/lib/http/api-client";
import { useEffect, useMemo, useState } from "react";
type Variant = {
  id: string;
  label: string;
  titles?: string[];
  codes?: string[];
  inStock?: boolean;
};

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
  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ??
    variants[0];
  const selectedTitles =
    selectedVariant?.titles?.filter(Boolean) ??
    (selectedVariant?.label ? [selectedVariant.label] : []);
  const selectedCodes = selectedVariant?.codes?.filter(Boolean) ?? [];

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
          <div className="space-y-4">
            {selectedVariant && (
              <div className="flex flex-wrap items-center gap-2">
                {selectedCodes.length > 0 && (
                  <span
                    className="size-4 shrink-0 rounded-full border border-gray-300"
                    style={swatchStyle(selectedCodes)}
                  />
                )}
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  رنگ:{" "}
                  <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-1 font-semibold text-gray-900 dark:text-white">
                    {selectedTitles.map((title, index) => (
                      <span
                        key={`${selectedVariant.id}-label-${index}`}
                        className="inline-flex items-center gap-1.5"
                      >
                        {index > 0 && (
                          <span className="text-gray-400 dark:text-gray-500">
                            /
                          </span>
                        )}
                        {title}
                      </span>
                    ))}
                  </span>
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {variants.map((variant) => {
                const isActive = selectedVariantId === variant.id;
                const titleText =
                  variant.titles?.filter(Boolean).join(" / ") ||
                  variant.label;
                const codes = variant.codes?.filter(Boolean) ?? [];
                const avgLight =
                  codes.length > 0 &&
                  codes.filter(isLightHex).length >=
                    Math.ceil(codes.length / 2);
                const checkClass = avgLight
                  ? "text-gray-800"
                  : "text-white drop-shadow";

                if (codes.length === 0) {
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      title={titleText}
                      aria-label={`انتخاب رنگ ${titleText}`}
                      aria-pressed={isActive}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={[
                        "rounded-xl border px-4 py-2 text-sm transition",
                        isActive
                          ? "border-gray-900 text-gray-900 dark:border-white dark:text-white"
                          : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300",
                        variant.inStock === false ? "opacity-50" : "",
                      ].join(" ")}
                    >
                      {variant.label}
                    </button>
                  );
                }

                return (
                  <button
                    key={variant.id}
                    type="button"
                    title={titleText}
                    aria-label={`انتخاب رنگ ${titleText}`}
                    aria-pressed={isActive}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={[
                      "relative flex h-12 w-12 items-center justify-center rounded-full",
                      variant.inStock === false ? "opacity-50" : "",
                    ].join(" ")}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-full border-4 border-sky-400" />
                    )}
                    <span
                      className="relative z-10 flex size-8 items-center justify-center rounded-full border border-gray-300"
                      style={swatchStyle(codes)}
                    >
                      {isActive && (
                        <svg
                          className={`size-4 ${checkClass}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
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
