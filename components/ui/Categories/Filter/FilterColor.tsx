// components/ui/Categories/Filter/FilterColor.tsx
"use client";

import type { TransitionStartFunction } from "react";
import { useMemo, useState } from "react";
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
};

const MAX_VISIBLE_COLOR_LABEL_LENGTH = 8;

function truncateColorLabel(label: string): string {
  return label.length > MAX_VISIBLE_COLOR_LABEL_LENGTH
    ? `${label.slice(0, MAX_VISIBLE_COLOR_LABEL_LENGTH)}...`
    : label;
}

function ColorTitle({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null;

  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-xs font-medium">
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
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  const items = useMemo(
    () => buildColorFilterItems(colorAttributes),
    [colorAttributes],
  );
  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;

    return items.filter((item) =>
      item.labels.some((label) => label.toLowerCase().includes(term)),
    );
  }, [items, searchTerm]);

  const selectedColors = colorPaletteParams(searchParams);
  const selectedOptionIds = useMemo(() => {
    return new Set(colorOptionIdParams(searchParams));
  }, [searchParams]);

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

  const isItemSelected = (labels: string[], optionIds: string[]) =>
    (optionIds.length > 0 &&
      optionIds.every((optionId) => selectedOptionIds.has(optionId))) ||
    (labels.length > 0 &&
      labels.every((label) => selectedColors.includes(label)));

  const handleToggle = (item: (typeof items)[number]) => {
    if (item.optionIds.length === 0) return;

    const params = new URLSearchParams(searchParams.toString());
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
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="جستجوی رنگ ..."
          className="w-full py-2 px-3 pe-9 ps-9 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-zinc-800 outline-none focus:border-cyan-500 transition-colors text-right"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <i className="far fa-search absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
        {searchTerm ? (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-400 text-white text-xs hover:bg-gray-500 transition-colors"
            aria-label="پاک کردن جستجو"
          >
            ×
          </button>
        ) : null}
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-center text-xs text-gray-400 py-4">رنگی یافت نشد</p>
      ) : (
        <div className="max-h-72 overflow-y-auto custom-scrollbar">
          <div className="flex flex-wrap gap-3 justify-center p-2">
            {filteredItems.map((item) => {
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
                  className="group flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div
                    className={`h-14 w-14 overflow-hidden rounded-2xl transition-all duration-200 ${
                      selected
                        ? "scale-105 ring-2 ring-indigo-500 ring-offset-2"
                        : "hover:scale-105"
                    } ${
                      needsBorder
                        ? "border border-gray-200 dark:border-gray-600"
                        : ""
                    }`}
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
        </div>
      )}
    </div>
  );
}
