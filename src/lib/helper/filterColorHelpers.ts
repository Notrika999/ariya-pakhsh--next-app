// src/lib/helper/filterColorHelpers.ts

import { getColorOptionLabel } from "@/src/lib/helper/productListHelpers";

import type { CSSProperties } from "react";

export type ColorFilterOption = {
  optionId: string;
  value: string;
  displayText?: string;
  count: number;
  colorCodes?: string;
  hex?: string;
};

export type ColorFilterAttribute = {
  attributeId: string;
  attributeName: string;
  options?: ColorFilterOption[];
};

export type ColorFilterItem = {
  key: string;
  attributeIds: string[];
  optionIds: string[];
  labels: string[];
  codes: string[];
};

export function isColorFilterAttribute(attr: {
  attributeId?: string;
  attributeName?: string;
}): boolean {
  return attr.attributeName === "رنگ" || attr.attributeId === "color";
}

export function parseColorCodes(option: {
  colorCodes?: string;
  hex?: string;
}): string[] {
  if (option.colorCodes) {
    return option.colorCodes
      .split(",")
      .map((code) => code.trim())
      .filter(Boolean);
  }
  if (option.hex) return [option.hex];
  return [];
}

export function parseColorLabels(option: {
  displayText?: string;
  value?: string;
  colorCodes?: string;
}): string[] {
  const text = String(option.displayText ?? option.value ?? "").trim();
  if (!text) return [];

  const parts = text
    .split(/[/|,،|]/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length > 1) return parts;

  const codeCount = parseColorCodes(option).length;
  if (codeCount > 1) {
    return Array.from({ length: codeCount }, (_, index) => parts[0] || `رنگ ${index + 1}`);
  }

  return parts;
}

function itemFromSingleOption(
  option: ColorFilterOption,
  attributeId: string,
): ColorFilterItem {
  let labels = parseColorLabels(option);
  const fallbackLabel = getColorOptionLabel(option);
  if (labels.length === 0 && fallbackLabel) {
    labels = [fallbackLabel];
  }

  const codes = parseColorCodes(option);
  const resolvedCodes = codes.length > 0 ? codes : ["#e5e7eb"];

  if (resolvedCodes.length > labels.length && labels.length === 1) {
    labels = resolvedCodes.map((_, index) =>
      index === 0 ? labels[0] : `${labels[0]} ${index + 1}`,
    );
  }

  return {
    key: option.optionId,
    attributeIds: [attributeId],
    optionIds: [option.optionId],
    labels,
    codes: resolvedCodes,
  };
}

/**
 * Builds swatches for filter sidebar.
 * - Multiple top-level color attributes → one combined split swatch.
 * - One attribute with multiple options → one combined split swatch.
 * - Single option with multiple colorCodes → split swatch with joined titles.
 */
export function buildColorFilterItems(
  attributes: ColorFilterAttribute[] | undefined,
): ColorFilterItem[] {
  const colorAttrs = (attributes ?? []).filter(isColorFilterAttribute);
  if (!colorAttrs.length) return [];

  return colorAttrs.flatMap((attr) =>
    (attr.options ?? []).map((option) =>
      itemFromSingleOption(option, attr.attributeId),
    ),
  );
}

export function isLightHex(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 200;
}

/** Equal-width color stripes inside one swatch */
export function colorSwatchStyle(codes: string[]): CSSProperties {
  if (codes.length === 0) {
    return { backgroundColor: "#e5e7eb" };
  }
  if (codes.length === 1) {
    return { backgroundColor: codes[0] };
  }
  if (codes.length === 2) {
    return {
      background: `linear-gradient(90deg, ${codes[0]} 50%, ${codes[1]} 50%)`,
    };
  }

  const step = 100 / codes.length;
  const stops = codes
    .map((code, index) => {
      const start = step * index;
      const end = step * (index + 1);
      return `${code} ${start}% ${end}%`;
    })
    .join(", ");

  return { background: `linear-gradient(90deg, ${stops})` };
}

export function formatColorFilterTitle(labels: string[]): string {
  return labels.filter(Boolean).join(" / ");
}
