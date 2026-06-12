// components/Categories/FilterFilterColor.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ColorOption = {
  optionId: string;
  value: string;
  count: number;
  colorCodes?: string; // comma-separated: "#000000" or "#000000,#FF0000"
  hex?: string;        // legacy single hex support
};

type Props = {
  attributeId: string;
  options: ColorOption[];
};

/** Parse colorCodes string into array of hex values */
function parseColorCodes(option: ColorOption): string[] {
  if (option.colorCodes) {
    return option.colorCodes.split(",").map((c) => c.trim()).filter(Boolean);
  }
  if (option.hex) return [option.hex];
  return [];
}

/** Returns true if a hex color is visually light */
function isLightHex(hex: string): boolean {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  // Perceived luminance
  return r * 0.299 + g * 0.587 + b * 0.114 > 200;
}

/** Build the inline background style for the swatch */
function swatchStyle(colors: string[]): React.CSSProperties {
  if (colors.length === 0) {
    return { backgroundColor: "#e5e7eb" };
  }
  if (colors.length === 1) {
    return { backgroundColor: colors[0] };
  }
  // Two colors: hard split diagonal gradient (no fade)
  return {
    background: `linear-gradient(135deg, ${colors[0]} 50%, ${colors[1]} 50%)`,
  };
}

export default function FilterColor({ attributeId, options }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedColors = searchParams.getAll(`attr_${attributeId}`);

  const handleToggle = (optionId: string) => {
  const params = new URLSearchParams(searchParams.toString());
  const paramKey = `attr_${attributeId}`;          // key یونیک per attribute
  const current = params.getAll(paramKey);

  params.delete(paramKey);

  if (current.includes(optionId)) {
    current.filter((c) => c !== optionId).forEach((c) => params.append(paramKey, c));
  } else {
    [...current, optionId].forEach((c) => params.append(paramKey, c));
  }

  params.set("page", "1");
  router.push(`${pathname}?${params.toString()}`);
};

  if (!options || options.length === 0) {
    return <p className="text-xs text-gray-400 text-center py-2">رنگی موجود نیست</p>;
  }

  return (
    <div className="flex flex-wrap gap-3 justify-end" dir="rtl">
      {options.map((option) => {
        const colors = parseColorCodes(option);
        const selected = selectedColors.includes(option.optionId);
        const needsBorder = colors.length > 0 && colors.every(isLightHex);

        return (
          <button
            key={option.optionId}
            type="button"
            onClick={() => !selected && handleToggle(option.optionId)}
            disabled={selected}
            className={`flex flex-col items-center gap-1.5 group ${selected ? "cursor-default" : "cursor-pointer"}`}
            title={option.value}
          >
            {/* سواچ رنگ */}
            <div
              className={`w-14 h-14 rounded-2xl transition-all duration-200 ${
                selected
                  ? "ring-2 ring-offset-2 ring-indigo-500 scale-105"
                  : "hover:scale-105"
              } ${needsBorder ? "border border-gray-200 dark:border-gray-600" : ""}`}
              style={swatchStyle(colors)}
            />
            {/* نام رنگ */}
            <span
              className={`text-xs font-medium transition-colors ${
                selected
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {option.value}
            </span>
          </button>
        );
      })}
    </div>
  );
}