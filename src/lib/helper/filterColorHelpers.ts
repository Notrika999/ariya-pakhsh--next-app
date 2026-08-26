// src/lib/helper/filterColorHelpers.ts

import { getColorOptionLabel } from "@/src/lib/helper/productListHelpers";

import type { CSSProperties } from "react";

const MAX_SWATCH_COLORS = 4;

export type ColorFilterOption = {
  optionId?: string | null;
  value?: string;
  displayText?: string;
  count?: number;
  colorCodes?: string;
  hex?: string;
};

export type ColorFilterAttribute = {
  attributeId: string;
  attributeName: string;
  attributeType?: number;
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
  attributeType?: number;
}): boolean {
  const attributeType = Number(attr.attributeType);
  const attributeId = String(attr.attributeId ?? "").trim().toLowerCase();
  const attributeName = String(attr.attributeName ?? "").trim().toLowerCase();

  return (
    attributeType === 7 ||
    attributeId === "color" ||
    attributeName === "رنگ" ||
    attributeName === "color"
  );
}

export function parseColorCodes(option: {
  colorCodes?: string;
  hex?: string;
}): string[] {
  if (option.colorCodes) {
    return option.colorCodes
      .split(",")
      .map((code) => code.trim())
      .filter(Boolean)
      .slice(0, MAX_SWATCH_COLORS);
  }
  if (option.hex) return [option.hex];
  return [];
}

export function parseColorLabels(option: {
  displayText?: string;
  value?: string;
}): string[] {
  const text = String(option.displayText ?? option.value ?? "").trim();
  return text ? [text] : [];
}

function itemFromSingleOption(
  option: ColorFilterOption,
  attributeId: string,
): ColorFilterItem {
  const optionId = String(option.optionId ?? "").trim();
  let labels = parseColorLabels(option);
  const fallbackLabel = getColorOptionLabel(option);
  if (labels.length === 0 && fallbackLabel) {
    labels = [fallbackLabel];
  }

  const codes = parseColorCodes(option);
  const resolvedCodes = codes.length > 0 ? codes : ["#e5e7eb"];

  return {
    key: optionId,
    attributeIds: [attributeId],
    optionIds: [optionId],
    labels,
    codes: resolvedCodes,
  };
}

export function buildColorFilterItems(
  attributes: ColorFilterAttribute[] | undefined,
): ColorFilterItem[] {
  const colorAttrs = (attributes ?? []).filter(isColorFilterAttribute);
  if (!colorAttrs.length) return [];

  return colorAttrs.flatMap((attr) =>
    (attr.options ?? [])
      .filter((option) => String(option.optionId ?? "").trim())
      .map((option) => itemFromSingleOption(option, attr.attributeId)),
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

  const visibleCodes = codes.slice(0, MAX_SWATCH_COLORS);
  const step = 100 / visibleCodes.length;
  const stops = visibleCodes
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
