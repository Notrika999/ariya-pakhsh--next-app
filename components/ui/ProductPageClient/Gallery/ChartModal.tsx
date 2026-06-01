import ProductPriceChart from "@/components/modules/ProductPriceChart/ProductPriceChart";
import { useMemo, useState } from "react";
type Variant = { id: string; label: string };

export default function ChartModal({
  open,
  onClose,
  variants,
  variantDataMap, // Record<string, PriceChartItem[]>
}: {
  open: boolean;
  onClose: () => void;
  variants: Variant[];
  variantDataMap: Record<string, any[]>;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(variants?.[0]?.id);

  const data = useMemo(() => {
    return selectedVariantId && variantDataMap[selectedVariantId]
      ? variantDataMap[selectedVariantId]
      : [];
  }, [selectedVariantId, variantDataMap]);

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
          <ProductPriceChart data={data} />
        </div>
      </div>
    </div>
  );
}
