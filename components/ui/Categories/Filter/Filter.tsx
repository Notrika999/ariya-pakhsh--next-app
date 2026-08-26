"use client";
// components/ui/Categories/Filter/Filter.tsx
import React, {
  ReactNode,
  TransitionStartFunction,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import FilterColor from "./FilterColor";
import PriceRangeFilter from "./PriceRangeFilter";
import FilterBrand from "./FilterBrand";
import {
  BRAND_PARAM,
  brandMatchesParam,
  colorPaletteParams,
  colorOptionIdParams,
  listVehicleParams,
  normalizeBrandParamToSlug,
  resolveVehicleParamsToIds,
  writeVehicleParams,
} from "@/src/lib/helper/productListHelpers";
import { isColorFilterAttribute } from "@/src/lib/helper/filterColorHelpers";

type FilterState = {
  search?: string;
  minPrice: number;
  maxPrice: number;
  brands?: string[];
  categoryId?: string;
  inStock?: boolean;
  onSaleOnly?: boolean;
};

type BrandOption = {
  id?: string | number;
  brandId: string | number;
  name: string;
  slug?: string;
};

type RawBrandOption = BrandOption | string;

function getBrandUrlValue(brand: BrandOption): string {
  return String(brand.slug || brand.name || brand.brandId).trim();
}

function getBrandIdValue(brand: BrandOption): string {
  return String(brand.brandId ?? "").trim();
}

type ColorOption = {
  optionId?: string | null;
  value?: string;
  displayText?: string;
  count?: number;
  colorCodes?: string;
  hex?: string;
};

type ColorFilterOption = ColorOption & {
  attributeId?: string;
  attributeName?: string;
};

type FilterAttribute = {
  attributeId: string;
  attributeName: string;
  attributeType?: number;
  options?: ColorOption[];
};

type CategoryOption = {
  categoryId: string;
  parentId?: string | null;
  parentCategoryId?: string | null;
  name: string;
  slug: string;
  count: number;
  children?: CategoryOption[];
};

type CategoryTreeNode = CategoryOption & {
  children: CategoryTreeNode[];
};

type VehicleOption = {
  id: string;
  parentId?: string | null;
  name: string;
  englishName?: string;
  company?: string;
  depth?: number;
  sortOrder?: number;
  isLeaf?: boolean;
  hasChildren?: boolean;
  children?: VehicleOption[] | string[];
};

type FilterOptions = {
  attributes?: FilterAttribute[];
  brands?: BrandOption[];
  categories?: CategoryOption[];
  vehicles?: VehicleOption[];
  colors?: ColorFilterOption[];
};

type Props = {
  filters: FilterState;
  availableBrands?: RawBrandOption[];
  minLimit: number;
  maxLimit: number;
  startTransition?: TransitionStartFunction;
  filterOptions?: FilterOptions;
  onFilterNavigate?: (params: URLSearchParams) => void;
  setFilters?: unknown;
  availableCategories?: unknown[];
  availableBadges?: unknown[];
};

type FilterDropdownProps = {
  title: string;
  children: ReactNode;
  isActive?: boolean;
  forceOpen?: boolean;
};

function FilterDropdown({
  title,
  children,
  isActive = false,
  forceOpen = false,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(isActive);
  const isOpen = open || forceOpen;

  return (
    <section className="dark:bg-custom-dark dark:border-gray-700 dark:text-white bg-white   border-gray-300 border-b overflow-hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 p-4 text-start"
      >
        <span className=" text-xs font-semiBold leading-4 text-gray-700 lg:text-sm lg:font-medium">
          {title}
          {isActive ? (
            <span
              className="inline-block w-2 h-2 rounded-full bg-blue-500 shrink-0"
              aria-label="فیلتر فعال"
            />
          ) : null}
        </span>
        <i
          className={`far fa-chevron-down text-sm text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-1">
          {children}
        </div>
      )}
    </section>
  );
}

function BooleanFilterButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-bold transition ${
        active
          ? "border-primary bg-primary/10 text-primary dark:border-primary/70 dark:bg-primary/15"
          : "border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:text-primary dark:border-gray-700 dark:bg-zinc-900 dark:text-gray-200"
      }`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <i className={`${icon} text-base`} aria-hidden="true" />
        <span className="truncate">{label}</span>
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
          active
            ? "border-primary bg-primary text-white"
            : "border-gray-300 text-gray-300 dark:border-gray-600 dark:text-gray-600"
        }`}
        aria-hidden="true"
      >
        {active ? <i className="far fa-check" /> : null}
      </span>
    </button>
  );
}

function getCategoryParentId(category: CategoryOption): string | null {
  return category.parentCategoryId ?? category.parentId ?? null;
}

function buildCategoryTree(categories: CategoryOption[]): CategoryTreeNode[] {
  const nodes = new Map<string, CategoryTreeNode>();

  for (const category of categories) {
    const children = category.children?.length
      ? buildCategoryTree(category.children)
      : [];

    nodes.set(category.categoryId, {
      ...category,
      children,
    });
  }

  const roots: CategoryTreeNode[] = [];

  for (const node of nodes.values()) {
    const parentId = getCategoryParentId(node);
    const parent = parentId ? nodes.get(parentId) : null;

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function CategoryTree({
  nodes,
  selectedCategoryId,
  onToggle,
  level = 0,
}: {
  nodes: CategoryTreeNode[];
  selectedCategoryId?: string;
  onToggle: (categoryId: string) => void;
  level?: number;
}) {
  return (
    <ul className={level === 0 ? "space-y-1" : "mt-1 space-y-1"}>
      {nodes.map((node) => {
        const isSelected = selectedCategoryId === node.categoryId;

        return (
          <li key={node.categoryId}>
            <button
              type="button"
              onClick={() => onToggle(node.categoryId)}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-start text-sm transition ${
                isSelected
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
              style={{ paddingInlineStart: 12 + level * 14 }}
            >
              <span className="min-w-0 truncate">{node.name}</span>
              {/* <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {node.count}
              </span> */}
            </button>

            {node.children.length > 0 ? (
              <CategoryTree
                nodes={node.children}
                selectedCategoryId={selectedCategoryId}
                onToggle={onToggle}
                level={level + 1}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

type VehicleApiResponse = {
  success?: boolean;
  isSuccess?: boolean;
  data?: VehicleOption[];
  message?: string;
};

async function fetchVehicleOptions(url: string): Promise<VehicleOption[]> {
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch vehicles");
  }

  const payload = (await response.json()) as VehicleApiResponse;
  const isSuccess = payload.success ?? payload.isSuccess ?? true;

  if (!isSuccess) {
    throw new Error(payload.message ?? "Failed to fetch vehicles");
  }

  return payload.data ?? [];
}

function normalizeVehicleChildren(children: VehicleOption["children"]) {
  if (!Array.isArray(children)) return [];
  return children.filter(
    (child): child is VehicleOption =>
      typeof child === "object" && child !== null && "id" in child,
  );
}

function collectVehicleIds(vehicle: VehicleOption): string[] {
  const childIds = normalizeVehicleChildren(vehicle.children).flatMap((child) =>
    collectVehicleIds(child),
  );

  return [vehicle.id, ...childIds];
}

function collectVehicleLookupMap(
  vehicles: VehicleOption[],
  map = new Map<string, VehicleOption>(),
) {
  vehicles.forEach((vehicle) => {
    map.set(vehicle.id, vehicle);
    collectVehicleLookupMap(normalizeVehicleChildren(vehicle.children), map);
  });

  return map;
}

const VEHICLE_LOOKUP_CACHE_KEY = "product-filter-vehicle-lookup";

function readCachedVehicleLookup() {
  if (typeof window === "undefined") return new Map<string, VehicleOption>();

  try {
    const rawCache = window.sessionStorage.getItem(VEHICLE_LOOKUP_CACHE_KEY);
    if (!rawCache) return new Map<string, VehicleOption>();

    const parsed = JSON.parse(rawCache) as VehicleOption[];
    return collectVehicleLookupMap(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Map<string, VehicleOption>();
  }
}

function writeCachedVehicleLookup(vehicles: VehicleOption[]) {
  if (typeof window === "undefined" || vehicles.length === 0) return;

  try {
    const vehicleMap = readCachedVehicleLookup();
    collectVehicleLookupMap(vehicles, vehicleMap);
    window.sessionStorage.setItem(
      VEHICLE_LOOKUP_CACHE_KEY,
      JSON.stringify([...vehicleMap.values()]),
    );
  } catch {
    // Cache is only for display labels; filter behavior must not depend on it.
  }
}

function extraVehiclesFromCache(): VehicleOption[] {
  return [...readCachedVehicleLookup().values()];
}

function getVehicleDisplayName(
  vehicle: VehicleOption | undefined,
  vehicleMap: Map<string, VehicleOption>,
  fallbackId: string,
) {
  if (!vehicle) return fallbackId;

  const names: string[] = [];
  const visitedIds = new Set<string>();
  let current: VehicleOption | undefined = vehicle;

  while (current && !visitedIds.has(current.id)) {
    visitedIds.add(current.id);
    names.unshift(current.name);

    const parentId: string | undefined = current.parentId?.trim() || undefined;
    current = parentId ? vehicleMap.get(parentId) : undefined;
  }

  return names.join(" - ");
}

function VehicleCheckbox({
  checked,
  indeterminate = false,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate && !checked;
    }
  }, [checked, indeterminate]);

  return (
    <input
      ref={inputRef}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary disabled:cursor-wait disabled:opacity-60"
      aria-label={label}
    />
  );
}

function VehicleName({ vehicle }: { vehicle: VehicleOption }) {
  return (
    <span className="min-w-0 truncate">
      {vehicle.name}
      {vehicle.englishName ? (
        <span className="text-gray-400 dark:text-gray-500 text-[11px] text-gray-400">
          {" "}
          ({vehicle.englishName})
        </span>
      ) : null}
    </span>
  );
}

function VehicleTree({
  nodes,
  selectedVehicleIds,
  onToggle,
  onToggleMany,
  loadedChildren,
  setLoadedChildren,
  level = 0,
}: {
  nodes: VehicleOption[];
  selectedVehicleIds: string[];
  onToggle: (vehicleId: string) => void;
  onToggleMany: (vehicleIds: string[], shouldSelect: boolean) => void;
  loadedChildren: Record<string, VehicleOption[]>;
  setLoadedChildren: React.Dispatch<
    React.SetStateAction<Record<string, VehicleOption[]>>
  >;
  level?: number;
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
  const [loadingIds, setLoadingIds] = useState<Set<string>>(() => new Set());
  const [selectingIds, setSelectingIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [errorIds, setErrorIds] = useState<Set<string>>(() => new Set());

  const loadChildren = async (vehicle: VehicleOption) => {
    const cachedChildren = loadedChildren[vehicle.id];
    if (cachedChildren) return cachedChildren;

    const localChildren = normalizeVehicleChildren(vehicle.children);
    if (localChildren.length) {
      setLoadedChildren((prev) => ({ ...prev, [vehicle.id]: localChildren }));
      writeCachedVehicleLookup(localChildren);
      return localChildren;
    }

    if (!vehicle.hasChildren) return [];

    setLoadingIds((prev) => new Set(prev).add(vehicle.id));
    setErrorIds((prev) => {
      const next = new Set(prev);
      next.delete(vehicle.id);
      return next;
    });

    try {
      const children = await fetchVehicleOptions(
        `/api/v1/Products/vehicles/${encodeURIComponent(vehicle.id)}/children`,
      );
      setLoadedChildren((prev) => ({ ...prev, [vehicle.id]: children }));
      writeCachedVehicleLookup(children);
      return children;
    } catch {
      setErrorIds((prev) => new Set(prev).add(vehicle.id));
      return [];
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(vehicle.id);
        return next;
      });
    }
  };

  const handleExpand = async (vehicle: VehicleOption) => {
    if (!vehicle.hasChildren) return;

    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(vehicle.id)) {
        next.delete(vehicle.id);
      } else {
        next.add(vehicle.id);
      }
      return next;
    });

    await loadChildren(vehicle);
  };

  const collectVehicleIdsWithChildren = async (
    vehicle: VehicleOption,
  ): Promise<string[]> => {
    const children = await loadChildren(vehicle);
    const childIds = await Promise.all(
      children.map((child) =>
        child.hasChildren ? collectVehicleIdsWithChildren(child) : [child.id],
      ),
    );

    return [vehicle.id, ...childIds.flat()];
  };

  const handleCheckboxChange = async (vehicle: VehicleOption) => {
    if (!vehicle.hasChildren) {
      onToggle(vehicle.id);
      return;
    }

    setSelectingIds((prev) => new Set(prev).add(vehicle.id));

    try {
      const vehicleIds = await collectVehicleIdsWithChildren(vehicle);
      const shouldSelect = !vehicleIds.every((id) =>
        selectedVehicleIds.includes(id),
      );

      onToggleMany(vehicleIds, shouldSelect);
    } finally {
      setSelectingIds((prev) => {
        const next = new Set(prev);
        next.delete(vehicle.id);
        return next;
      });
    }
  };

  return (
    <ul className={level === 0 ? "space-y-1" : "mt-1 space-y-1"}>
      {nodes.map((vehicle) => {
        const isOpen = openIds.has(vehicle.id);
        const isLoading = loadingIds.has(vehicle.id);
        const isSelecting = selectingIds.has(vehicle.id);
        const hasError = errorIds.has(vehicle.id);
        const children =
          loadedChildren[vehicle.id] ?? normalizeVehicleChildren(vehicle.children);
        const rowIds = collectVehicleIds({ ...vehicle, children });
        const selectedCount = rowIds.filter((id) =>
          selectedVehicleIds.includes(id),
        ).length;
        const isSelected =
          rowIds.length > 0 && selectedCount === rowIds.length;
        const isPartiallySelected =
          selectedCount > 0 && selectedCount < rowIds.length;

        return (
          <li key={vehicle.id}>
            <div
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                isSelected
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
              style={{ paddingInlineStart: 12 + level * 14 }}
            >
              <VehicleCheckbox
                checked={isSelected}
                indeterminate={isPartiallySelected}
                disabled={isSelecting}
                onChange={() => void handleCheckboxChange(vehicle)}
                label={`انتخاب ${vehicle.name}`}
              />

              <button
                type="button"
                onClick={() =>
                  vehicle.hasChildren
                    ? void handleExpand(vehicle)
                    : onToggle(vehicle.id)
                }
                className="flex min-w-0 flex-1 items-center justify-between gap-2 text-start"
                aria-expanded={vehicle.hasChildren ? isOpen : undefined}
                aria-pressed={!vehicle.hasChildren ? isSelected : undefined}
              >
                <VehicleName vehicle={vehicle} />
                {vehicle.hasChildren ? (
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-500 transition-transform ${
                      isOpen ? "-rotate-90" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <i className="far fa-chevron-circle-left"></i>
                  </span>
                ) : null}
              </button>
            </div>

            {isLoading ? (
              <p className="px-3 py-1 text-xs text-gray-400">در حال دریافت...</p>
            ) : null}
            {hasError ? (
              <p className="px-3 py-1 text-xs text-red-500">
                خطا در دریافت زیرمجموعه
              </p>
            ) : null}

            {isOpen && children.length > 0 ? (
              <VehicleTree
                nodes={children}
                selectedVehicleIds={selectedVehicleIds}
                onToggle={onToggle}
                onToggleMany={onToggleMany}
                loadedChildren={loadedChildren}
                setLoadedChildren={setLoadedChildren}
                level={level + 1}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function VehicleFilter({
  vehicles,
  selectedVehicleIds,
  allVehiclesSelected,
  onSelectAll,
  onToggle,
  onToggleMany,
}: {
  vehicles: VehicleOption[];
  selectedVehicleIds: string[];
  allVehiclesSelected: boolean;
  onSelectAll: () => void;
  onToggle: (vehicleId: string) => void;
  onToggleMany: (vehicleIds: string[], shouldSelect: boolean) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [lookupItems, setLookupItems] = useState<VehicleOption[]>([]);
  const [loadedChildren, setLoadedChildren] = useState<
    Record<string, VehicleOption[]>
  >({});
  const [isSearching, setIsSearching] = useState(false);
  const [lookupError, setLookupError] = useState(false);

  const selectedVehicles = useMemo(() => {
    const vehicleMap = readCachedVehicleLookup();
    collectVehicleLookupMap(vehicles, vehicleMap);

    Object.values(loadedChildren).forEach((children) => {
      collectVehicleLookupMap(children, vehicleMap);
    });
    collectVehicleLookupMap(lookupItems, vehicleMap);

    let currentVehicleName = "";

    return [...new Set(selectedVehicleIds)].map((vehicleId) => {
      const vehicle = vehicleMap.get(vehicleId);
      const label = getVehicleDisplayName(vehicle, vehicleMap, vehicleId);

      if (vehicle && !vehicle.parentId) {
        currentVehicleName = vehicle.name;
      }

      return {
        id: vehicleId,
        vehicle,
        label: vehicle ? label : currentVehicleName || vehicleId,
      };
    });
  }, [loadedChildren, lookupItems, selectedVehicleIds, vehicles]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setLookupItems([]);
    setLookupError(false);
    setIsSearching(false);
  };

  useEffect(() => {
    const term = searchTerm.trim();
    if (term.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      setLookupError(false);

      try {
        const response = await fetch(
          `/api/v1/Products/vehicles/lookup?SearchTerm=${encodeURIComponent(term)}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) throw new Error("Failed to search vehicles");

        const payload = (await response.json()) as VehicleApiResponse;
        const isSuccess = payload.success ?? payload.isSuccess ?? true;
        if (!isSuccess) throw new Error(payload.message);

        const nextItems = payload.data ?? [];
        setLookupItems(nextItems);
        writeCachedVehicleLookup(nextItems);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLookupError(true);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [searchTerm]);

  return (
    <div dir="rtl">
      <button
        type="button"
        aria-pressed={allVehiclesSelected}
        onClick={onSelectAll}
        className={`mb-3 flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm font-bold transition ${
          allVehiclesSelected
            ? "border-primary bg-primary/10 text-primary dark:border-primary/70 dark:bg-primary/15"
            : "border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:text-primary dark:border-gray-700 dark:bg-zinc-900 dark:text-gray-200"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <i className="far fa-cars text-base" aria-hidden="true" />
          <span className="truncate">همه خودروها</span>
        </span>
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
            allVehiclesSelected
              ? "border-primary bg-primary text-white"
              : "border-gray-300 text-gray-300 dark:border-gray-600 dark:text-gray-600"
          }`}
          aria-hidden="true"
        >
          {allVehiclesSelected ? <i className="far fa-check" /> : null}
        </span>
      </button>

      {selectedVehicles.length > 0 ? (
        <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/70 p-3 dark:border-blue-900/50 dark:bg-blue-950/20">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
              خودروهای انتخاب‌شده
            </span>
            <button
              type="button"
              onClick={() => onToggleMany(selectedVehicleIds, false)}
              className="shrink-0 text-xs font-medium text-red-500 transition-colors hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            >
              حذف همه
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedVehicles.map(({ id, vehicle, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onToggle(id)}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:border-red-200 hover:text-red-500 dark:border-blue-900 dark:bg-zinc-900 dark:text-gray-200 dark:hover:border-red-900 dark:hover:text-red-400"
                title="حذف از فیلتر خودرو"
              >
                <span className="min-w-0 truncate">
                  {label}
                  {vehicle?.englishName ? (
                    <span className="text-gray-400 dark:text-gray-500">
                      {" "}
                      ({vehicle.englishName})
                    </span>
                  ) : null}
                </span>
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-500 dark:bg-gray-800 dark:text-gray-300"
                  aria-hidden="true"
                >
                  ×
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="جستجوی خودرو ..."
          className="w-full py-2 px-3 pe-9 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-zinc-800 outline-none focus:border-cyan-500 transition-colors text-right"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <i className="far fa-search absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
        {searchTerm ? (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-400 text-white text-xs hover:bg-gray-500 transition-colors"
            aria-label="پاک کردن جستجو"
          >
            ×
          </button>
        ) : null}
      </div>

      {searchTerm.trim().length >= 2 ? (
        <div className="mb-4 max-h-56 overflow-y-auto rounded-lg border border-gray-100 dark:border-gray-700">
          {isSearching ? (
            <p className="px-3 py-3 text-xs text-gray-400">در حال جستجو...</p>
          ) : lookupError ? (
            <p className="px-3 py-3 text-xs text-red-500">خطا در جستجوی خودرو</p>
          ) : lookupItems.length > 0 ? (
            lookupItems.map((vehicle) => {
              const selected = selectedVehicleIds.includes(vehicle.id);
              return (
                <label
                  key={vehicle.id}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-start text-sm ${
                    selected
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <VehicleCheckbox
                      checked={selected}
                      onChange={() => onToggle(vehicle.id)}
                      label={`انتخاب ${vehicle.name}`}
                    />
                    <VehicleName vehicle={vehicle} />
                  </span>
                  {vehicle.company ? (
                    <span className="shrink-0 text-[11px] text-gray-400">
                      {vehicle.company}
                    </span>
                  ) : null}
                </label>
              );
            })
          ) : (
            <p className="px-3 py-3 text-xs text-gray-400">خودرویی یافت نشد</p>
          )}
        </div>
      ) : null}

      <div className="max-h-72 overflow-y-auto custom-scrollbar">
        <VehicleTree
          nodes={vehicles}
          selectedVehicleIds={selectedVehicleIds}
          onToggle={onToggle}
          onToggleMany={onToggleMany}
          loadedChildren={loadedChildren}
          setLoadedChildren={setLoadedChildren}
        />
      </div>
    </div>
  );
}

type DynamicAttributeKind =
  | "multi-options"
  | "single-option"
  | "text"
  | "number"
  | "date-range"
  | "boolean";

const TEXT_ATTRIBUTE_TYPE = 1;
const NUMBER_ATTRIBUTE_TYPE = 2;
const SINGLE_SELECT_ATTRIBUTE_TYPE = 3;
const MULTI_SELECT_ATTRIBUTE_TYPE = 4;
const DATE_ATTRIBUTE_TYPE = 6;

function getAttributeFilterKind(attribute: FilterAttribute): DynamicAttributeKind {
  const type = Number(attribute.attributeType);
  const hasOptions = (attribute.options?.length ?? 0) > 0;

  if (hasOptions && type === SINGLE_SELECT_ATTRIBUTE_TYPE) {
    return "single-option";
  }

  if (
    hasOptions &&
    (type === TEXT_ATTRIBUTE_TYPE || type === MULTI_SELECT_ATTRIBUTE_TYPE)
  ) {
    return "multi-options";
  }

  if (hasOptions) return "multi-options";
  if (type === NUMBER_ATTRIBUTE_TYPE) return "number";
  if (type === DATE_ATTRIBUTE_TYPE) return "date-range";
  if (type === SINGLE_SELECT_ATTRIBUTE_TYPE) return "boolean";

  return "text";
}

function getAttributeOptionLabel(option: ColorOption) {
  return String(option.displayText ?? option.value ?? "").trim();
}

function getAttributeOptionId(option: ColorOption) {
  return String(option.optionId ?? "").trim();
}

function getAttributeOptionValue(option: ColorOption) {
  return String(option.value ?? option.displayText ?? "").trim();
}

function getAttributeOptionKey(option: ColorOption) {
  return getAttributeOptionId(option) || getAttributeOptionValue(option);
}

function DynamicAttributeFilter({
  attribute,
  selectedOptionIds,
  selectedValues,
  textValue,
  boolValue,
  onToggleOption,
  onToggleValue,
  onSetValues,
  onTextChange,
  onBoolChange,
  shouldFocusTextInput = false,
  onTextInputFocus,
}: {
  attribute: FilterAttribute;
  selectedOptionIds: string[];
  selectedValues: string[];
  textValue: string;
  boolValue: boolean | null;
  onToggleOption: (
    attributeId: string,
    optionId: string,
    singleSelect?: boolean,
  ) => void;
  onToggleValue: (
    attributeId: string,
    value: string,
    singleSelect?: boolean,
  ) => void;
  onSetValues: (attributeId: string, values: string[]) => void;
  onTextChange: (attributeId: string, value: string) => void;
  onBoolChange: (attributeId: string, value: boolean | null) => void;
  shouldFocusTextInput?: boolean;
  onTextInputFocus?: (attributeId: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [draftTextValue, setDraftTextValue] = useState(textValue);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const kind = getAttributeFilterKind(attribute);
  const selectedOptionSet = useMemo(
    () => new Set(selectedOptionIds),
    [selectedOptionIds],
  );
  const selectedValueSet = useMemo(
    () => new Set(selectedValues),
    [selectedValues],
  );
  const options = useMemo(
    () =>
      (attribute.options ?? []).filter((option) => {
        const label = getAttributeOptionLabel(option);
        return Boolean(label && getAttributeOptionKey(option));
      }),
    [attribute.options],
  );
  const selectedOptions = useMemo(
    () =>
      options.filter((option) => {
        const optionId = getAttributeOptionId(option);
        const optionValue = getAttributeOptionValue(option);

        return optionId
          ? selectedOptionSet.has(optionId)
          : selectedValueSet.has(optionValue);
      }),
    [options, selectedOptionSet, selectedValueSet],
  );
  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const visibleOptions = options.filter(
      (option) => !selectedOptions.includes(option),
    );
    if (!term) return visibleOptions;

    return visibleOptions.filter((option) =>
      getAttributeOptionLabel(option).toLowerCase().includes(term),
    );
  }, [options, searchTerm, selectedOptions]);

  useEffect(() => {
    if (kind !== "text" && kind !== "number") return;
    if (document.activeElement === textInputRef.current) return;

    setDraftTextValue(textValue);
  }, [kind, textValue]);

  useEffect(() => {
    if ((kind !== "text" && kind !== "number") || !shouldFocusTextInput) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const input = textInputRef.current;
      if (!input) return;

      input.focus({ preventScroll: true });

      const cursorPosition = input.value.length;
      input.setSelectionRange(cursorPosition, cursorPosition);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [attribute.attributeId, kind, shouldFocusTextInput, textValue]);

  useEffect(() => {
    if (kind !== "text" && kind !== "number") return;

    const timer = window.setTimeout(() => {
      if (draftTextValue.trim() !== textValue) {
        onTextChange(attribute.attributeId, draftTextValue.trim());
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [
    attribute.attributeId,
    draftTextValue,
    kind,
    onTextChange,
    textValue,
  ]);

  if (kind === "boolean") {
    return (
      <div className="grid grid-cols-2 gap-2" dir="rtl">
        {[
          { label: "بله", value: true },
          { label: "خیر", value: false },
        ].map((item) => {
          const selected = boolValue === item.value;

          return (
            <button
              key={String(item.value)}
              type="button"
              aria-pressed={selected}
              onClick={() =>
                onBoolChange(
                  attribute.attributeId,
                  selected ? null : item.value,
                )
              }
              className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                selected
                  ? "border-primary bg-primary/10 text-primary dark:border-primary/70 dark:bg-primary/15"
                  : "border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:text-primary dark:border-gray-700 dark:bg-zinc-900 dark:text-gray-200"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (kind === "text" || kind === "number") {
    return (
      <div className="relative" dir="rtl">
        <input
          ref={textInputRef}
          type={kind === "number" ? "number" : "text"}
          value={draftTextValue}
          onFocus={() => onTextInputFocus?.(attribute.attributeId)}
          onChange={(event) => {
            onTextInputFocus?.(attribute.attributeId);
            setDraftTextValue(event.target.value);
          }}
          placeholder={`${attribute.attributeName} را وارد کنید`}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 pe-9 text-right text-sm outline-none transition-colors focus:border-cyan-500 dark:border-gray-600 dark:bg-zinc-800"
        />
        <i
          className="far fa-keyboard pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"
          aria-hidden="true"
        />
        {draftTextValue ? (
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onTextInputFocus?.(attribute.attributeId);
              setDraftTextValue("");
              onTextChange(attribute.attributeId, "");
              textInputRef.current?.focus({ preventScroll: true });
            }}
            className="absolute end-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-gray-400 text-xs text-white transition-colors hover:bg-gray-500"
            aria-label="پاک کردن مقدار"
          >
            ×
          </button>
        ) : null}
      </div>
    );
  }

  if (kind === "date-range") {
    const fromValue = selectedValues[0] ?? "";
    const toValue = selectedValues[1] ?? "";

    return (
      <div className="space-y-3" dir="rtl">
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
          از تاریخ
          <input
            type="date"
            value={fromValue}
            onChange={(event) => {
              onSetValues(
                attribute.attributeId,
                [event.target.value, toValue].filter(Boolean),
              );
            }}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-cyan-500 dark:border-gray-600 dark:bg-zinc-800"
          />
        </label>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
          تا تاریخ
          <input
            type="date"
            value={toValue}
            onChange={(event) => {
              onSetValues(
                attribute.attributeId,
                [fromValue, event.target.value].filter(Boolean),
              );
            }}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-cyan-500 dark:border-gray-600 dark:bg-zinc-800"
          />
        </label>
      </div>
    );
  }

  if (options.length === 0) return null;

  return (
    <div dir="rtl">
      {options.length > 0 ? (
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={`جستجوی ${attribute.attributeName} ...`}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 pe-9 ps-9 text-right text-sm outline-none transition-colors focus:border-cyan-500 dark:border-gray-600 dark:bg-zinc-800"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <i
            className="far fa-search pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"
            aria-hidden="true"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute end-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-gray-400 text-xs text-white transition-colors hover:bg-gray-500"
              aria-label="پاک کردن جستجو"
            >
              ×
            </button>
          ) : null}
        </div>
      ) : null}

      {selectedOptions.length > 0 ? (
        <div className="mb-2 max-h-40 overflow-y-auto custom-scrollbar">
          <p className="mb-1 text-xs text-gray-400 dark:text-gray-500">
            انتخاب شما
          </p>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {selectedOptions.map((option) => {
              const optionId = getAttributeOptionId(option);
              const optionValue = getAttributeOptionValue(option);
              const label = getAttributeOptionLabel(option);
              const optionKey = getAttributeOptionKey(option);
              const isSingleSelect = kind === "single-option";

              return (
                <button
                  key={optionKey}
                  type="button"
                  onClick={() => {
                    if (optionId) {
                      onToggleOption(
                        attribute.attributeId,
                        optionId,
                        isSingleSelect,
                      );
                      return;
                    }

                    onToggleValue(
                      attribute.attributeId,
                      optionValue,
                      isSingleSelect,
                    );
                  }}
                  className="flex w-full items-center gap-3 py-3 text-start cursor-pointer group"
                  aria-pressed="true"
                >
                  <span
                    className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 bg-red-600 border-red-600"
                    aria-hidden
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-white">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {selectedOptions.length === 0 && filteredOptions.length === 0 ? (
        <p className="py-4 text-center text-xs text-gray-400">
          گزینه‌ای یافت نشد
        </p>
      ) : (
        <div className="max-h-72 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {filteredOptions.map((option) => {
              const optionId = getAttributeOptionId(option);
              const optionValue = getAttributeOptionValue(option);
              const label = getAttributeOptionLabel(option);
              const optionKey = getAttributeOptionKey(option);
              const selected = optionId
                ? selectedOptionSet.has(optionId)
                : selectedValueSet.has(optionValue);
              const isSingleSelect = kind === "single-option";
              const handleToggle = () => {
                if (optionId) {
                  onToggleOption(
                    attribute.attributeId,
                    optionId,
                    isSingleSelect,
                  );
                  return;
                }

                onToggleValue(
                  attribute.attributeId,
                  optionValue,
                  isSingleSelect,
                );
              };

              return (
                <button
                  key={optionKey}
                  type="button"
                  onClick={handleToggle}
                  className="flex w-full items-center gap-3 py-3 text-start cursor-pointer group"
                  aria-pressed={selected}
                >
                  <span
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      selected
                        ? "bg-red-600 border-red-600"
                        : "border-gray-400 dark:border-gray-500 bg-transparent group-hover:border-gray-500"
                    }`}
                    aria-hidden
                  >
                    {selected ? (
                      <svg
                        className="w-3 h-3 text-white"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 6L5 9L10 3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </span>
                  <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <span
                      className={`text-sm font-medium truncate ${
                        selected
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {label}
                    </span>
                    {/* {typeof option.count === "number" ? (
                      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        {new Intl.NumberFormat("fa-IR").format(option.count)}
                      </span>
                    ) : null} */}
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

function buildColorAttributesFromFilterOptions(
  filterOptions?: FilterOptions,
): FilterAttribute[] {
  const attributesByKey = new Map<string, FilterAttribute>();

  const upsertAttribute = (attribute: FilterAttribute) => {
    const key = attribute.attributeId || attribute.attributeName;
    const existing = attributesByKey.get(key);

    if (!existing) {
      attributesByKey.set(key, {
        ...attribute,
        options: [...(attribute.options ?? [])],
      });
      return;
    }

    const options = existing.options ?? [];

    for (const option of attribute.options ?? []) {
      const optionIndex = options.findIndex(
        (item) => item.optionId === option.optionId,
      );

      if (optionIndex >= 0) {
        options[optionIndex] = {
          ...option,
          ...options[optionIndex],
          colorCodes: options[optionIndex].colorCodes ?? option.colorCodes,
          hex: options[optionIndex].hex ?? option.hex,
          displayText: options[optionIndex].displayText ?? option.displayText,
          value: options[optionIndex].value ?? option.value,
          count: options[optionIndex].count ?? option.count,
        };
      } else {
        options.push(option);
      }
    }

    existing.options = options;
  };

  for (const attribute of filterOptions?.attributes ?? []) {
    if (isColorFilterAttribute(attribute)) {
      upsertAttribute(attribute);
    }
  }

  for (const color of filterOptions?.colors ?? []) {
    const attributeId = color.attributeId || "color";
    const attributeName = color.attributeName || "رنگ";

    upsertAttribute({
      attributeId,
      attributeName,
      options: [
        {
          optionId: color.optionId,
          value: color.value ?? color.displayText ?? "",
          displayText: color.displayText,
          count: color.count,
          colorCodes: color.colorCodes,
          hex: color.hex,
        },
      ],
    });
  }

  return Array.from(attributesByKey.values());
}

function Filter({
  filters,
  availableBrands = [],
  minLimit,
  maxLimit,
  startTransition,
  filterOptions,
  onFilterNavigate,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const [optimisticSearch, setOptimisticSearch] = useState(searchString);
  const [activeTextAttributeId, setActiveTextAttributeId] = useState<
    string | null
  >(null);
  const optimisticSearchRef = useRef(searchString);
  const lastObservedSearchRef = useRef(searchString);

  useEffect(() => {
    const currentOptimisticSearch = optimisticSearchRef.current;
    const lastObservedSearch = lastObservedSearchRef.current;
    lastObservedSearchRef.current = searchString;

    if (
      currentOptimisticSearch === lastObservedSearch ||
      currentOptimisticSearch === searchString
    ) {
      optimisticSearchRef.current = searchString;
      setOptimisticSearch(searchString);
    }
  }, [searchString]);

  const activeSearchParams = useMemo(
    () => new URLSearchParams(optimisticSearch),
    [optimisticSearch],
  );

  const createParams = useCallback(
    () => new URLSearchParams(optimisticSearchRef.current),
    [],
  );

  const navigate = useCallback(
    (params: URLSearchParams) => {
      const nextSearch = params.toString();
      optimisticSearchRef.current = nextSearch;
      setOptimisticSearch(nextSearch);

      if (onFilterNavigate) {
        onFilterNavigate(params);
        return;
      }

      const replaceUrl = () => {
        router.replace(`${pathname}?${nextSearch}`, { scroll: false });
      };

      if (startTransition) {
        startTransition(replaceUrl);
        return;
      }

      replaceUrl();
    },
    [onFilterNavigate, pathname, router, startTransition],
  );

  const handleSearchChange = (value: string) => {
    const params = createParams();
    params.set("search", value);
    params.set("page", "1");
    navigate(params);
  };

  const priceDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handlePriceChange = useCallback(
    (range: { min: number; max: number }) => {
      if (priceDebounce.current) clearTimeout(priceDebounce.current);
      priceDebounce.current = setTimeout(() => {
        const params = createParams();
        params.set("minPrice", String(range.min));
        params.set("maxPrice", String(range.max));
        params.set("page", "1");
        navigate(params);
      }, 400);
    },
    [createParams, navigate],
  );

  const normalizedBrands: BrandOption[] = availableBrands
    .map((brand) =>
      typeof brand === "string"
        ? { brandId: brand, name: brand, slug: brand }
        : brand,
    )
    .filter((brand) => Boolean(brand.slug || brand.brandId));

  const handleBrandToggle = useCallback(
    (slug: string) => {
      const params = createParams();
      const selectedParams = [
        ...params.getAll(BRAND_PARAM),
        ...params.getAll("brandSlug"),
        ...params.getAll("brandId"),
        ...params.getAll("BrandIds"),
        ...params.getAll("brandIds"),
      ].filter(Boolean);
      const targetBrand = normalizedBrands.find((brand) =>
        brandMatchesParam(brand, slug),
      );

      params.delete("brandId");
      params.delete("brandIds");
      params.delete("brandSlug");
      params.delete("BrandIds");
      params.delete(BRAND_PARAM);

      if (!targetBrand) {
        const canonicalSlug = normalizeBrandParamToSlug(slug, normalizedBrands);
        const current = selectedParams
          .map((value) => normalizeBrandParamToSlug(value, normalizedBrands))
          .filter(Boolean);
        const uniqueCurrent = [...new Set(current)];

        if (uniqueCurrent.includes(canonicalSlug)) {
          uniqueCurrent
            .filter((value) => value !== canonicalSlug)
            .forEach((value) => params.append(BRAND_PARAM, value));
        } else {
          [...uniqueCurrent, canonicalSlug].forEach((value) =>
            params.append(BRAND_PARAM, value),
          );
        }

        params.set("page", "1");
        navigate(params);
        return;
      }

      const selectedBrandIds = new Set(
        normalizedBrands
          .filter((brand) =>
            selectedParams.some((param) => brandMatchesParam(brand, param)),
          )
          .map(getBrandIdValue)
          .filter(Boolean),
      );
      const targetBrandId = getBrandIdValue(targetBrand);

      if (!targetBrandId) {
        const readableValue = getBrandUrlValue(targetBrand);
        const current = selectedParams
          .map((value) => normalizeBrandParamToSlug(value, normalizedBrands))
          .filter(Boolean);
        const uniqueCurrent = [...new Set(current)];

        if (uniqueCurrent.includes(readableValue)) {
          uniqueCurrent
            .filter((value) => value !== readableValue)
            .forEach((value) => params.append(BRAND_PARAM, value));
        } else {
          [...uniqueCurrent, readableValue].forEach((value) =>
            params.append(BRAND_PARAM, value),
          );
        }

        params.set("page", "1");
        navigate(params);
        return;
      }

      if (selectedBrandIds.has(targetBrandId)) {
        selectedBrandIds.delete(targetBrandId);
      } else {
        selectedBrandIds.add(targetBrandId);
      }

      normalizedBrands
        .filter((brand) => selectedBrandIds.has(getBrandIdValue(brand)))
        .forEach((brand) => {
          const readableValue = getBrandUrlValue(brand);

          if (readableValue) params.append(BRAND_PARAM, readableValue);
        });

      params.set("page", "1");
      navigate(params);
    },
    [createParams, navigate, normalizedBrands],
  );

  const categoryTree = useMemo(
    () => buildCategoryTree(filterOptions?.categories ?? []),
    [filterOptions?.categories],
  );

  const selectedCategoryParam =
    activeSearchParams.get("categoryId") ??
    activeSearchParams.get("CategoryId") ??
    undefined;
  const selectedCategoryId =
    selectedCategoryParam ?? filters.categoryId ?? undefined;
  const onlyInStock =
    activeSearchParams.get("inStock") === "true" ||
    activeSearchParams.get("InStock") === "true" ||
    Boolean(filters.inStock);
  const onlyOnSale =
    activeSearchParams.get("onSaleOnly") === "true" ||
    activeSearchParams.get("OnSaleOnly") === "true" ||
    Boolean(filters.onSaleOnly);

  const handleCategoryToggle = useCallback(
    (categoryId: string) => {
      const params = createParams();

      params.delete("categoryId");
      params.delete("CategoryId");

      if (selectedCategoryId !== categoryId) {
        params.set("CategoryId", categoryId);
      }

      params.set("page", "1");
      navigate(params);
    },
    [createParams, navigate, selectedCategoryId],
  );

  const handleBooleanToggle = useCallback(
    (key: "inStock" | "onSaleOnly") => {
      const params = createParams();
      const isActive = params.get(key) === "true";

      if (isActive) {
        params.delete(key);
      } else {
        params.set(key, "true");
      }

      params.set("page", "1");
      navigate(params);
    },
    [createParams, navigate],
  );

  const vehicles = filterOptions?.vehicles ?? [];
  const extraVehicles = extraVehiclesFromCache();
  const selectedVehicleIds = resolveVehicleParamsToIds(
    listVehicleParams(activeSearchParams),
    vehicles,
    extraVehicles,
  );
  const allVehiclesSelected = activeSearchParams.get("vehicleMode") === "all";

  const handleAllVehiclesSelect = useCallback(() => {
    const params = createParams();
    params.delete("vehicleId");
    params.delete("vehicle");
    params.set("vehicleMode", "all");
    params.set("page", "1");
    navigate(params);
  }, [createParams, navigate]);

  const handleVehicleToggle = useCallback(
    (vehicleId: string) => {
      const params = createParams();
      const current = new Set(
        resolveVehicleParamsToIds(
          listVehicleParams(params),
          vehicles,
          extraVehiclesFromCache(),
        ),
      );

      if (current.has(vehicleId)) {
        current.delete(vehicleId);
      } else {
        current.add(vehicleId);
      }

      params.delete("vehicleMode");
      writeVehicleParams(
        params,
        [...current],
        vehicles,
        extraVehiclesFromCache(),
      );
      params.set("page", "1");
      navigate(params);
    },
    [createParams, navigate, vehicles],
  );

  const handleVehicleBulkToggle = useCallback(
    (vehicleIds: string[], shouldSelect: boolean) => {
      const params = createParams();
      const current = new Set(
        resolveVehicleParamsToIds(
          listVehicleParams(params),
          vehicles,
          extraVehiclesFromCache(),
        ),
      );

      vehicleIds.filter(Boolean).forEach((vehicleId) => {
        if (shouldSelect) {
          current.add(vehicleId);
        } else {
          current.delete(vehicleId);
        }
      });

      params.delete("vehicleMode");
      writeVehicleParams(
        params,
        [...current],
        vehicles,
        extraVehiclesFromCache(),
      );
      params.set("page", "1");
      navigate(params);
    },
    [createParams, navigate, vehicles],
  );

  const colorAttributes = useMemo(
    () => buildColorAttributesFromFilterOptions(filterOptions),
    [filterOptions],
  );
  const hasColorOptions = colorAttributes.some(
    (attr) => (attr.options?.length ?? 0) > 0,
  );
  const colorAttributeIds = useMemo(
    () =>
      new Set(
        colorAttributes
          .map((attribute) => attribute.attributeId)
          .filter(Boolean),
      ),
    [colorAttributes],
  );
  const dynamicAttributes = useMemo(
    () =>
      (filterOptions?.attributes ?? []).filter(
        (attribute) =>
          !isColorFilterAttribute(attribute) &&
          Boolean(attribute.attributeId),
      ),
    [filterOptions?.attributes],
  );
  const selectedAttributeOptionIds = useMemo(() => {
    const selected: Record<string, string[]> = {};

    for (const attribute of dynamicAttributes) {
      selected[attribute.attributeId] = activeSearchParams
        .getAll(`attr_${attribute.attributeId}`)
        .filter(Boolean);
    }

    return selected;
  }, [dynamicAttributes, activeSearchParams]);
  const selectedAttributeValues = useMemo(() => {
    const selected: Record<string, string[]> = {};

    for (const attribute of dynamicAttributes) {
      selected[attribute.attributeId] = activeSearchParams
        .getAll(`attr_values_${attribute.attributeId}`)
        .filter(Boolean);
    }

    return selected;
  }, [dynamicAttributes, activeSearchParams]);
  const selectedAttributeTextValues = useMemo(() => {
    const selected: Record<string, string> = {};

    for (const attribute of dynamicAttributes) {
      selected[attribute.attributeId] =
        activeSearchParams.get(`attr_value_${attribute.attributeId}`)?.trim() ??
        "";
    }

    return selected;
  }, [dynamicAttributes, activeSearchParams]);
  const selectedAttributeBoolValues = useMemo(() => {
    const selected: Record<string, boolean | null> = {};

    for (const attribute of dynamicAttributes) {
      const rawValue = activeSearchParams
        .get(`attr_bool_${attribute.attributeId}`)
        ?.trim()
        .toLowerCase();

      selected[attribute.attributeId] =
        rawValue === "true" ? true : rawValue === "false" ? false : null;
    }

    return selected;
  }, [dynamicAttributes, activeSearchParams]);

  const selectedBrands =
    activeSearchParams.getAll(BRAND_PARAM).length > 0
      ? activeSearchParams.getAll(BRAND_PARAM)
      : activeSearchParams.getAll("brandSlug").length > 0
        ? activeSearchParams.getAll("brandSlug")
        : activeSearchParams.getAll("brandId").length > 0
          ? activeSearchParams.getAll("brandId")
          : activeSearchParams.getAll("BrandIds");
  const selectedSearch =
    activeSearchParams.get("search") ?? filters.search ?? "";
  const selectedMinPrice = Number(
    activeSearchParams.get("minPrice") ??
      activeSearchParams.get("MinPrice") ??
      filters.minPrice,
  );
  const selectedMaxPrice = Number(
    activeSearchParams.get("maxPrice") ??
      activeSearchParams.get("MaxPrice") ??
      filters.maxPrice,
  );
  const hasMinPriceParam =
    activeSearchParams.has("minPrice") || activeSearchParams.has("MinPrice");
  const hasMaxPriceParam =
    activeSearchParams.has("maxPrice") || activeSearchParams.has("MaxPrice");

  const hasColorFilter =
    colorOptionIdParams(activeSearchParams).length > 0 ||
    colorPaletteParams(activeSearchParams).length > 0 ||
    Array.from(colorAttributeIds).some(
      (attributeId) =>
        activeSearchParams.getAll(`attr_${attributeId}`).length > 0,
    );
  const hasDynamicAttributeFilter = dynamicAttributes.some(
    (attribute) =>
      (selectedAttributeOptionIds[attribute.attributeId]?.length ?? 0) > 0 ||
      (selectedAttributeValues[attribute.attributeId]?.length ?? 0) > 0 ||
      Boolean(selectedAttributeTextValues[attribute.attributeId]) ||
      typeof selectedAttributeBoolValues[attribute.attributeId] === "boolean",
  );

  const hasBrandFilter = selectedBrands.length > 0;
  const hasCategoryFilter = Boolean(selectedCategoryParam);
  const hasVehicleFilter = allVehiclesSelected || selectedVehicleIds.length > 0;

  const hasPriceFilter =
    (hasMinPriceParam && selectedMinPrice > minLimit) ||
    (hasMaxPriceParam && selectedMaxPrice < maxLimit);
  const hasBooleanFilter =
    activeSearchParams.get("inStock") === "true" ||
    activeSearchParams.get("InStock") === "true" ||
    activeSearchParams.get("onSaleOnly") === "true" ||
    activeSearchParams.get("OnSaleOnly") === "true";

  const hasActiveFilters =
    hasBrandFilter ||
    hasCategoryFilter ||
    hasVehicleFilter ||
    hasPriceFilter ||
    hasColorFilter ||
    hasDynamicAttributeFilter ||
    hasBooleanFilter;

  const handleAttributeOptionToggle = useCallback(
    (attributeId: string, optionId: string, singleSelect = false) => {
      const params = createParams();
      const key = `attr_${attributeId}`;
      const current = params.getAll(key).filter(Boolean);

      params.delete(key);

      if (singleSelect) {
        if (current[0] !== optionId) {
          params.append(key, optionId);
        }
      } else if (current.includes(optionId)) {
        current
          .filter((value) => value !== optionId)
          .forEach((value) => params.append(key, value));
      } else {
        [...current, optionId].forEach((value) => params.append(key, value));
      }

      params.set("page", "1");
      navigate(params);
    },
    [createParams, navigate],
  );

  const handleAttributeValueToggle = useCallback(
    (attributeId: string, value: string, singleSelect = false) => {
      const params = createParams();
      const key = `attr_values_${attributeId}`;
      const current = params.getAll(key).filter(Boolean);

      params.delete(key);

      if (singleSelect) {
        if (current[0] !== value) {
          params.append(key, value);
        }
      } else if (current.includes(value)) {
        current
          .filter((item) => item !== value)
          .forEach((item) => params.append(key, item));
      } else {
        [...current, value].forEach((item) => params.append(key, item));
      }

      params.set("page", "1");
      navigate(params);
    },
    [createParams, navigate],
  );

  const handleAttributeValuesChange = useCallback(
    (attributeId: string, values: string[]) => {
      const params = createParams();
      const key = `attr_values_${attributeId}`;

      params.delete(key);
      [...new Set(values.map((value) => value.trim()).filter(Boolean))].forEach(
        (value) => params.append(key, value),
      );

      params.set("page", "1");
      navigate(params);
    },
    [createParams, navigate],
  );

  const handleAttributeTextChange = useCallback(
    (attributeId: string, value: string) => {
      const params = createParams();
      const key = `attr_value_${attributeId}`;
      const normalizedValue = value.trim();

      if (normalizedValue) {
        params.set(key, normalizedValue);
      } else {
        params.delete(key);
      }

      params.set("page", "1");
      navigate(params);
    },
    [createParams, navigate],
  );

  const handleAttributeBoolChange = useCallback(
    (attributeId: string, value: boolean | null) => {
      const params = createParams();
      const key = `attr_bool_${attributeId}`;

      if (typeof value === "boolean") {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }

      params.set("page", "1");
      navigate(params);
    },
    [createParams, navigate],
  );

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams();
    const query = activeSearchParams.get("Q") ?? activeSearchParams.get("q");

    if (query) {
      params.set("Q", query);
    }

    params.set("page", "1");
    navigate(params);
  }, [activeSearchParams, navigate]);

  return (
    <section className="">
      {hasActiveFilters && (
        <div
          className="dark:bg-custom-dark bg-white rounded-t-lg border-b border-gray-300 p-4"
          dir="rtl"
        >
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors group"
          >
            <span>حذف فیلترها</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-90"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      <section className="hidden">
        <div className="dark:bg-custom-dark bg-white rounded-lg border p-4">
          <input
            type="text"
            value={selectedSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="جستجوی محصولات ...."
          />
        </div>
      </section>

      <FilterDropdown title="وضعیت کالا" isActive={hasBooleanFilter}>
        <div className="space-y-2">
          <BooleanFilterButton
            active={onlyInStock}
            icon="far fa-box-check"
            label="فقط کالاهای موجود"
            onClick={() => handleBooleanToggle("inStock")}
          />
          <BooleanFilterButton
            active={onlyOnSale}
            icon="far fa-badge-percent"
            label="فقط کالاهای تخفیف‌خورده"
            onClick={() => handleBooleanToggle("onSaleOnly")}
          />
        </div>
      </FilterDropdown>

      {hasColorOptions ? (
        <FilterDropdown title="رنگ ها" isActive={hasColorFilter}>
          <FilterColor
            colorAttributes={colorAttributes}
            searchParamsOverride={activeSearchParams}
            onNavigate={navigate}
          />
        </FilterDropdown>
      ) : null}

      <FilterDropdown title="محدوده قیمت" isActive={hasPriceFilter}>
        <PriceRangeFilter
          min={minLimit}
          max={maxLimit}
          value={{
            min: selectedMinPrice,
            max: selectedMaxPrice,
          }}
          onChange={handlePriceChange}
        />
      </FilterDropdown>

      <FilterDropdown title="برند" isActive={hasBrandFilter}>
        <FilterBrand
          brands={normalizedBrands}
          selectedBrands={selectedBrands}
          onToggle={handleBrandToggle}
        />
      </FilterDropdown>

      {dynamicAttributes.map((attribute) => {
        const selectedOptions =
          selectedAttributeOptionIds[attribute.attributeId] ?? [];
        const selectedValues =
          selectedAttributeValues[attribute.attributeId] ?? [];
        const textValue =
          selectedAttributeTextValues[attribute.attributeId] ?? "";
        const boolValue =
          selectedAttributeBoolValues[attribute.attributeId] ?? null;
        const isTextAttribute = getAttributeFilterKind(attribute) === "text";
        const isActive =
          selectedOptions.length > 0 ||
          selectedValues.length > 0 ||
          Boolean(textValue) ||
          typeof boolValue === "boolean";
        const shouldFocusTextInput =
          isTextAttribute &&
          isActive &&
          (activeTextAttributeId === attribute.attributeId ||
            activeTextAttributeId === null);

        return (
          <FilterDropdown
            key={attribute.attributeId}
            title={attribute.attributeName}
            isActive={isActive}
            forceOpen={shouldFocusTextInput}
          >
            <DynamicAttributeFilter
              attribute={attribute}
              selectedOptionIds={selectedOptions}
              selectedValues={selectedValues}
              textValue={textValue}
              boolValue={boolValue}
              onToggleOption={handleAttributeOptionToggle}
              onToggleValue={handleAttributeValueToggle}
              onSetValues={handleAttributeValuesChange}
              onTextChange={handleAttributeTextChange}
              onBoolChange={handleAttributeBoolChange}
              shouldFocusTextInput={shouldFocusTextInput}
              onTextInputFocus={(attributeId) => {
                setActiveTextAttributeId(attributeId);
              }}
            />
          </FilterDropdown>
        );
      })}

      {vehicles.length > 0 ? (
        <FilterDropdown title="خودرو" isActive={hasVehicleFilter}>
          <VehicleFilter
            vehicles={vehicles}
            selectedVehicleIds={selectedVehicleIds}
            allVehiclesSelected={allVehiclesSelected}
            onSelectAll={handleAllVehiclesSelect}
            onToggle={handleVehicleToggle}
            onToggleMany={handleVehicleBulkToggle}
          />
        </FilterDropdown>
      ) : null}

      {categoryTree.length > 0 ? (
        <FilterDropdown title="دسته‌بندی" isActive={hasCategoryFilter}>
          <div className="max-h-72 overflow-y-auto custom-scrollbar" dir="rtl">
            <CategoryTree
              nodes={categoryTree}
              selectedCategoryId={selectedCategoryId}
              onToggle={handleCategoryToggle}
            />
          </div>
        </FilterDropdown>
      ) : null}
    </section>
  );
}

export default memo(Filter);
