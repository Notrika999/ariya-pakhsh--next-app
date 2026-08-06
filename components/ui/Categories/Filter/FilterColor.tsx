"use client";
// components/ui/Categories/Filter/FilterColor.tsx

import type { TransitionStartFunction } from "react";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  COLOR_PALETTE_PARAM,
  LEGACY_COLOR_PALETTE_PARAM,
  colorPaletteParams,
  colorOptionIdParams,
} from "@/src/lib/helper/productListHelpers";
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
  searchParamsOverride?: URLSearchParams;
  onNavigate?: (params: URLSearchParams) => void;
};

const MAX_VISIBLE_COLOR_LABEL_LENGTH = 10;

function truncateColorLabel(label: string): string {
  return label.length > MAX_VISIBLE_COLOR_LABEL_LENGTH
    ? `${label.slice(0, MAX_VISIBLE_COLOR_LABEL_LENGTH)}...`
    : label;
}

function ColorTitle({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null;

  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5 text-[10px] font-semibold">
      {labels.map((label, index) => (
        <span
          key={`${label}-${index}`}
          className="inline-flex items-center gap-1.5"
        >
          {index > 0 ? (
            <span className="text-gray-400 dark:text-gray-500">/</span>
          ) : null}
          <span>{truncateColorLabel(label)}</span>
        </span>
      ))}
    </span>
  );
}

export default function FilterColor({
  colorAttributes,
  startTransition,
  searchParamsOverride,
  onNavigate,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSearchParams = searchParamsOverride ?? searchParams;

  const items = useMemo(
    () => buildColorFilterItems(colorAttributes),
    [colorAttributes],
  );

  const selectedColors = colorPaletteParams(activeSearchParams);
  const selectedOptionIds = useMemo(() => {
    return new Set(colorOptionIdParams(activeSearchParams));
  }, [activeSearchParams]);

  const navigate = (params: URLSearchParams) => {
    if (onNavigate) {
      onNavigate(params);
      return;
    }

    const replaceUrl = () => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    if (startTransition) {
      startTransition(replaceUrl);
      return;
    }

    replaceUrl();
  };

  const isItemSelected = (labels: string[], optionIds: string[]) =>
    (optionIds.length > 0 &&
      optionIds.every((optionId) => selectedOptionIds.has(optionId))) ||
    (labels.length > 0 &&
      labels.every((label) => selectedColors.includes(label)));

  const handleToggle = (item: (typeof items)[number]) => {
    if (item.optionIds.length === 0) return;

    const params = new URLSearchParams(activeSearchParams.toString());
    const selected = isItemSelected(item.labels, item.optionIds);

    for (const attributeId of item.attributeIds) {
      params.delete(`attr_${attributeId}`);
    }
    params.delete("attr_color");
    params.delete("ColorOptionIds");
    params.delete("colorOptionIds");
    params.delete("colorOptionId");
    params.delete(COLOR_PALETTE_PARAM);
    params.delete(LEGACY_COLOR_PALETTE_PARAM);

    const remainingItems = items.filter((candidate) => {
      if (candidate.key === item.key) return false;

      return isItemSelected(candidate.labels, candidate.optionIds);
    });

    if (!selected) {
      remainingItems.push(item);
    }

    for (const selectedItem of remainingItems) {
      selectedItem.labels.forEach((label) => {
        if (label) params.append(COLOR_PALETTE_PARAM, label);
      });
    }

    params.set("page", "1");
    navigate(params);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div dir="rtl">
      <div className="max-h-80 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(60px,1fr))] gap-x-2 gap-y-5 px-1 py-2">
          {items.map((item) => {
            const selected = isItemSelected(item.labels, item.optionIds);
            const hoverTitle = formatColorFilterTitle(item.labels);
            const needsBorder =
              item.codes.length > 0 && item.codes.every(isLightHex);

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleToggle(item)}
                aria-pressed={selected}
                title={hoverTitle}
                className="group flex min-w-0 cursor-pointer flex-col items-center gap-2 text-center outline-none"
              >
                <span
                  className={`flex size-[45px] items-center justify-center rounded-[10px] bg-gray-100 transition-all duration-200 dark:bg-zinc-900 ${
                    selected
                      ? "border-[3px] border-primary p-0.5"
                      : "border-2 border-[#dedfe3] p-[5px] group-hover:border-[#c7cad1] dark:border-gray-700 dark:group-hover:border-gray-600"
                  }`}
                >
                  <span
                    className={`block size-[35px] overflow-hidden rounded-md ${
                      needsBorder
                        ? "border border-[#d9dce3] dark:border-gray-600"
                        : ""
                    }`}
                    style={colorSwatchStyle(item.codes)}
                  />
                </span>
                <span className="min-h-3 max-w-full text-xs font-semibold text-nowrap leading-5 text-[#16264b] transition-colors group-hover:text-[#0f1c39] dark:text-gray-200 dark:group-hover:text-white">
                  <ColorTitle labels={item.labels} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
