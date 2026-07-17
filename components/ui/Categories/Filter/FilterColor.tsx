// components/ui/Categories/Filter/FilterColor.tsx
"use client";

import type { TransitionStartFunction } from "react";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { COLOR_PALETTE_PARAM } from "@/src/lib/helper/productListHelpers";
import {
  buildColorFilterItems,
  colorSwatchStyle,
  formatColorFilterTitle,
  isLightHex,
  type ColorFilterAttribute,
} from "@/src/lib/helper/filterColorHelpers";

type Props = {
  colorAttributes: ColorFilterAttribute[];
  startTransition?: TransitionStartFunction;
};

function ColorTitle({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null;

  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-xs font-medium">
      {labels.map((label, index) => (
        <span key={`${label}-${index}`} className="inline-flex items-center gap-1.5">
          {index > 0 ? (
            <span className="text-gray-400 dark:text-gray-500">/</span>
          ) : null}
          <span>{label}</span>
        </span>
      ))}
    </span>
  );
}

export default function FilterColor({
  colorAttributes,
  startTransition,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const items = useMemo(
    () => buildColorFilterItems(colorAttributes),
    [colorAttributes],
  );

  const selectedColors = searchParams.getAll(COLOR_PALETTE_PARAM);

  const navigate = (params: URLSearchParams) => {
    const replaceUrl = () => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    if (startTransition) {
      startTransition(replaceUrl);
      return;
    }

    replaceUrl();
  };

  const isItemSelected = (labels: string[]) =>
    labels.length > 0 && labels.every((label) => selectedColors.includes(label));

  const handleToggle = (labels: string[], attributeIds: string[]) => {
    if (labels.length === 0) return;

    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(COLOR_PALETTE_PARAM);
    const selected = isItemSelected(labels);

    for (const attributeId of attributeIds) {
      params.delete(`attr_${attributeId}`);
    }
    params.delete("attr_color");
    params.delete("ColorOptionIds");
    params.delete(COLOR_PALETTE_PARAM);

    if (selected) {
      current
        .filter((value) => !labels.includes(value))
        .forEach((value) => params.append(COLOR_PALETTE_PARAM, value));
    } else {
      const next = [...new Set([...current, ...labels])];
      next.forEach((value) => params.append(COLOR_PALETTE_PARAM, value));
    }

    params.set("page", "1");
    navigate(params);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 justify-end" dir="rtl">
      {items.map((item) => {
        const selected = isItemSelected(item.labels);
        const hoverTitle = formatColorFilterTitle(item.labels);
        const needsBorder =
          item.codes.length > 0 && item.codes.every(isLightHex);

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => handleToggle(item.labels, item.attributeIds)}
            aria-pressed={selected}
            title={hoverTitle}
            className="group flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div
              className={`h-14 w-14 overflow-hidden rounded-2xl transition-all duration-200 ${
                selected
                  ? "scale-105 ring-2 ring-indigo-500 ring-offset-2"
                  : "hover:scale-105"
              } ${needsBorder ? "border border-gray-200 dark:border-gray-600" : ""}`}
              style={colorSwatchStyle(item.codes)}
            />
            <span
              className={`transition-colors ${
                selected
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-100"
              }`}
            >
              <ColorTitle labels={item.labels} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
