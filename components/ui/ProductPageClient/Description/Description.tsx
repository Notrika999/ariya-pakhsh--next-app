"use client";
// components/ui/ProductPageClient/Description/Description.tsx
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import {
  ProductDetail,
  ProductDetailAttribute,
  ProductDetailCompatibility,
  ProductDetailVariant,
} from "@/src/lib/types/products/productDetail.types";
import {
  useIsAuthenticated,
  useIsAuthBootstrapping,
} from "@/src/lib/stores/auth/auth.store";
import { useSelectedVehicles } from "@/src/lib/stores/vehicle/vehicle.store";
import {
  getProductCompatibility,
  type ProductCompatibilityResult,
} from "@/src/services/product/product.client";
import { getDefaultMyVehicle } from "@/src/services/vehicle/vehicle.client";
import { vehicleCookie } from "@/src/utils/vehicleCookie";

export type ProductColorOption = {
  variantId: string;
  titles: string[];
  codes: string[];
  inStock: boolean;
};

interface Props {
  product: ProductDetail;
  selectedVariantId: string;
  onSelectVariant: (variantId: string) => void;
  isOutOfStock: boolean;
}

function isColorAttribute(attr: ProductDetailAttribute) {
  return (
    Boolean(attr.colorCode) ||
    Boolean(attr.colorHexCodes) ||
    attr.attributeName === "رنگ" ||
    attr.attributeName?.toLowerCase() === "color"
  );
}

function normalizeColorCodes(value?: string | string[] | null): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeColorCodes(item));
  }

  if (typeof value !== "string") return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveColorHexes(attr?: ProductDetailAttribute | null) {
  const colorCodeParts = normalizeColorCodes(attr?.colorCode);
  if (colorCodeParts.length > 0) return colorCodeParts;

  const colorHexParts = normalizeColorCodes(attr?.colorHexCodes);
  return colorHexParts.length > 0 ? colorHexParts : ["#ccc"];
}

function resolveColorLabel(
  attr?: ProductDetailAttribute | null,
  fallback = "",
) {
  return attr?.displayText?.trim() || attr?.value?.trim() || fallback;
}

export function isLightHex(hex: string) {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 180;
}

/** Hard split from the center — no soft blend edge */
export function swatchStyle(codes: string[]): CSSProperties {
  if (codes.length === 0) return { backgroundColor: "#e5e7eb" };
  if (codes.length === 1) return { backgroundColor: codes[0] };
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

function getProductListSlugHref(slug?: string | null) {
  const normalizedSlug = slug?.trim();
  return normalizedSlug
    ? `/products/${encodeURIComponent(normalizedSlug)}`
    : "/products";
}

function getBrandProductListHref(brand: ProductDetail["brands"][number]) {
  return getProductListSlugHref(brand.name || brand.slug);
}

/** One selectable swatch per variant; multi-color attrs become a split circle. */
export function buildProductColorOptions(
  variants?: ProductDetailVariant[] | null,
): ProductColorOption[] {
  const options: ProductColorOption[] = [];

  for (const variant of variants ?? []) {
    const colorAttrs = variant.attributes?.filter(isColorAttribute) ?? [];
    if (colorAttrs.length === 0) continue;

    options.push({
      variantId: variant.variantId,
      titles: colorAttrs.map((attr) => resolveColorLabel(attr, variant.name)),
      codes: colorAttrs.flatMap((attr) => resolveColorHexes(attr)),
      inStock: variant.inStock,
    });
  }

  return options;
}

type DefaultVehicleSummary = {
  id: string;
  name: string;
};

type CompatibilityState = {
  slug: string;
  vehicleId: string;
  result: ProductCompatibilityResult | null;
};

function getCompatibilityVehicleId(item: ProductDetailCompatibility) {
  return item.carId?.trim() ?? "";
}

export default function Description({
  product,
  selectedVariantId,
  onSelectVariant,
  isOutOfStock,
}: Props) {
  const isAuthenticated = useIsAuthenticated();
  const isAuthBootstrapping = useIsAuthBootstrapping();
  const selectedVehicles = useSelectedVehicles();
  const [defaultVehicle, setDefaultVehicle] =
    useState<DefaultVehicleSummary | null>(null);
  const [compatibilityState, setCompatibilityState] =
    useState<CompatibilityState | null>(null);
  const [showAllCompatibilities, setShowAllCompatibilities] = useState(false);

  useEffect(() => {
    if (isAuthBootstrapping) return;

    let cancelled = false;

    async function loadDefaultVehicle() {
      try {
        if (isAuthenticated) {
          const vehicle = await getDefaultMyVehicle();
          if (!cancelled && vehicle) {
            setDefaultVehicle({
              id: vehicle.vehicleId,
              name: vehicle.pathLabel || vehicle.name,
            });
            return;
          }
        } else {
          const cookieVehicles = vehicleCookie.get();
          if (!cancelled && cookieVehicles.length === 1) {
            const vehicle = cookieVehicles[0];
            setDefaultVehicle({
              id: vehicle.id,
              name: vehicle.label || vehicle.name,
            });
            return;
          }
        }
      } catch {
        // keep current empty state
      }

      if (!cancelled) setDefaultVehicle(null);
    }

    void loadDefaultVehicle();

    return () => {
      cancelled = true;
    };
  }, [isAuthBootstrapping, isAuthenticated, selectedVehicles]);

  useEffect(() => {
    const vehicleId = defaultVehicle?.id?.trim();
    const slug = product.slug?.trim();

    if (!vehicleId || !slug) {
      return;
    }

    let cancelled = false;

    async function loadCompatibility(
      compatibilitySlug: string,
      compatibilityVehicleId: string,
    ) {
      try {
        const result = await getProductCompatibility(
          compatibilitySlug,
          compatibilityVehicleId,
        );
        if (!cancelled) {
          setCompatibilityState({
            slug: compatibilitySlug,
            vehicleId: compatibilityVehicleId,
            result,
          });
        }
      } catch (error) {
        // console.error(
        //   "[Description] get product compatibility failed =>",
        //   error,
        // );
        if (!cancelled) {
          setCompatibilityState({
            slug: compatibilitySlug,
            vehicleId: compatibilityVehicleId,
            result: null,
          });
        }
      }
    }

    void loadCompatibility(slug, vehicleId);

    return () => {
      cancelled = true;
    };
  }, [defaultVehicle?.id, product.slug]);

  const selectedVariant =
    product.variants?.find((v) => v.variantId === selectedVariantId) ??
    product.variants?.find((v) => v.isDefault) ??
    product.variants?.[0];

  const colorOptions = buildProductColorOptions(product.variants);

  const selectedColor =
    colorOptions.find((c) => c.variantId === selectedVariantId) ??
    colorOptions[0];

  const displayAttributes =
    selectedVariant?.attributes?.filter((attr) => !isColorAttribute(attr)) ??
    [];

  const primaryCategory =
    product.categories?.find((c) => c.isPrimary) ?? product.categories?.[0];
  const primaryBrand =
    product.brands?.find((b) => b.isPrimary) ?? product.brands?.[0];

  const rating = product.averageRating ?? 0;
  const reviewCount = product.reviewCount ?? 0;
  const showReview = rating > 0 || reviewCount > 0;
  const compatibilities = product.compatibilities ?? [];
  const hasCompatibilities = compatibilities.length > 0;
  const hiddenCompatibilitiesCount = Math.max(compatibilities.length - 2, 0);
  const visibleCompatibilities = showAllCompatibilities
    ? compatibilities
    : compatibilities.slice(0, 2);
  const compatibilityResult =
    compatibilityState?.slug === product.slug?.trim() &&
    compatibilityState.vehicleId === defaultVehicle?.id?.trim()
      ? compatibilityState.result
      : null;
  const isCompatible =
    defaultVehicle && compatibilityResult
      ? compatibilityResult.isCompatible ||
        compatibilityResult.isCompatibleWithAllVehicles
      : null;

  return (
    <section className="xl:col-span-5 md:mt-7 mt-1 col-span-12 md:pb-10 w-full dark:text-gray-200">
      {/* Category */}
      <ul className="text-xs space-x-1 flex items-center">
        {primaryBrand && (
          <>
            <li>
              <Link
                href={getBrandProductListHref(primaryBrand)}
                className="text-primary"
              >
                {primaryBrand.name}
              </Link>
            </li>
            <i className="far fa-chevron-left dark:text-gray-500"></i>
          </>
        )}
        {primaryCategory && (
          <li>
            <Link
              href={getProductListSlugHref(primaryCategory.slug)}
              className="text-primary"
            >
              {primaryCategory.name}
            </Link>
          </li>
        )}
      </ul>

      {/* Title */}
      <div className="space-y-2 mt-2 pb-2 border-b border-b-gray-300 dark:border-b-gray-700">
        <h1 className="font-black leading-8">{product.name}</h1>
        {product.shortDescription && (
          <div
            className="text-gray-400 dark:text-gray-500 text-sm leading-8 text-justify"
            dangerouslySetInnerHTML={{ __html: product.shortDescription }}
          />
        )}
      </div>

      {/* Rating, Comments */}
      {showReview && (
        <div className="flex flex-wrap items-center pt-2 mt-2 space-x-2">
          <div className="flex items-center space-x-1">
            <i className="fas fa-star text-amber-400"></i>
            <h4 className="text-sm font-bold">{rating.toFixed(1)}</h4>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              (امتیاز {new Intl.NumberFormat("fa-IR").format(reviewCount)}{" "}
              خریدار)
            </span>
          </div>

          <div>
            <a
              href="#comments"
              className="bg-gray-200 hover:bg-primary/20 transition dark:bg-zinc-800 dark:text-gray-200 px-2 py-1 space-x-1 rounded-full flex items-center"
            >
              <span className="text-xs">
                {new Intl.NumberFormat("fa-IR").format(reviewCount)} دیدگاه
              </span>
              <i className="far fa-angle-left"></i>
            </a>
          </div>
        </div>
      )}

      {/* Out of Stock Notice */}
      {isOutOfStock && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <i className="far fa-exclamation-triangle text-red-500"></i>
            <span className="text-red-700 dark:text-red-300 font-medium">
              این محصول در حال حاضر موجود نمی‌باشد
            </span>
          </div>
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">
            می‌توانید از طریق دکمه زیر، در صورت موجود شدن به شما اطلاع‌رسانی
            کنیم.
          </p>
        </div>
      )}

      {/* Color Picker — one swatch per variant */}
      {colorOptions.length > 0 && selectedColor && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="size-4 shrink-0 rounded-full border border-gray-300"
              style={swatchStyle(selectedColor.codes)}
            />
            <p className="font-semibold text-lg">
              رنگ:{" "}
              <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-1">
                {selectedColor.titles.map((title, index) => (
                  <span
                    key={`${selectedColor.variantId}-label-${index}`}
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

          <div className="flex flex-wrap items-center gap-4">
            {colorOptions.map((color) => {
              const isActive = selectedVariantId === color.variantId;
              const titleText = color.titles.filter(Boolean).join(" / ");
              const avgLight =
                color.codes.filter(isLightHex).length >=
                Math.ceil(color.codes.length / 2);
              const checkClass = avgLight
                ? "text-gray-800"
                : "text-white drop-shadow";

              return (
                <button
                  key={color.variantId}
                  type="button"
                  title={titleText}
                  aria-label={`انتخاب رنگ ${titleText}`}
                  aria-pressed={isActive}
                  onClick={() => onSelectVariant(color.variantId)}
                  className={[
                    "relative flex w-12 h-12 items-center justify-center rounded-full",
                    !color.inStock ? "opacity-50" : "",
                  ].join(" ")}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full border-4 border-sky-400" />
                  )}
                  <span
                    className="relative z-10 flex size-8 items-center justify-center rounded-full border border-gray-300"
                    style={swatchStyle(color.codes)}
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
      )}

      {/* Compatibilities */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center gap-2">
          <h4 className="flex items-center gap-2 text-lg font-bold">
            <i className="fas fa-car-side text-primary" aria-hidden="true" />
            خودروهای سازگار
          </h4>

          {defaultVehicle && isCompatible !== null ? (
            <p
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                isCompatible
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              <i
                className={`far ${isCompatible ? "fa-circle-check" : "fa-circle-xmark"}`}
                aria-hidden="true"
              />
              {isCompatible
                ? "سازگار با خودروی شما"
                : "با خودروی شما سازگار نیست"}
            </p>
          ) : null}
        </div>

        {hasCompatibilities ? (
          <ul className="flex flex-wrap items-center gap-3">
            {visibleCompatibilities.map((item) => {
              const isDefaultMatch =
                defaultVehicle?.id === getCompatibilityVehicleId(item);
              const chipClass = isDefaultMatch
                ? isCompatible === true
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : isCompatible === false
                    ? "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-300"
                    : "bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                : "bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-100";

              return (
                <li
                  key={item.carId}
                  className={`flex w-fit items-center gap-3 rounded-lg p-3 ${chipClass}`}
                >
                  <p className="line-clamp-1 text-sm font-semibold">
                    {item.name}
                  </p>
                </li>
              );
            })}

            {hiddenCompatibilitiesCount > 0 ? (
              <li>
                <button
                  type="button"
                  aria-expanded={showAllCompatibilities}
                  onClick={() =>
                    setShowAllCompatibilities((current) => !current)
                  }
                  className="flex w-fit items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm font-semibold text-primary transition hover:bg-primary/15 dark:border-primary/40 dark:bg-primary/15"
                >
                  {showAllCompatibilities
                    ? "نمایش کمتر"
                    : `${new Intl.NumberFormat("fa-IR").format(
                        hiddenCompatibilitiesCount,
                      )} خودروی دیگر`}
                  <i
                    className={`far ${
                      showAllCompatibilities ? "fa-angle-up" : "fa-angle-down"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </li>
            ) : null}
          </ul>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
            <li
              className={`flex items-center justify-between gap-3 rounded-lg p-3 ${
                isCompatible === true
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : "bg-gray-200 dark:bg-zinc-800"
              }`}
            >
              <span className="text-sm font-medium">همه خودروها</span>
            </li>
          </ul>
        )}
      </div>

      {/* Attributes of selected variant (non-color) */}
      {displayAttributes.length > 0 && (
        <div className="mt-8 space-y-3">
          <h4 className="font-bold text-lg">ویژگی‌ها</h4>
          <div className="grid gap-3 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {displayAttributes.map((attr) => {
              const label = resolveColorLabel(attr, attr.value);
              return (
                <div
                  key={`${attr.attributeId}-${attr.optionId ?? attr.value}`}
                  className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group"
                >
                  <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
                    {attr.attributeName}
                  </h5>
                  <h6 className="line-clamp-1 mt-3 text-xs">{label}</h6>
                  <span className="absolute text-nowrap z-50 inset-e-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
                    <span className="absolute inset-e-1/2 -bottom-2.5 rotate-90 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Warranty / Alert */}
      {product.warrantyInfo && (
        <div className="rounded my-3 mx-5 lg:mx-0">
          <div className="flex">
            <div className="flex mt-1">
              <i className="fas fa-circle-exclamation text-gray-500 dark:text-gray-400"></i>
            </div>
            <span className="ms-2 text-xs leading-6 text-justify text-neutral-500 dark:text-neutral-400">
              {product.warrantyInfo}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
