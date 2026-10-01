"use client";

import { useEffect, useState } from "react";
import type {
  SelectedVehicle,
  VehicleTreeNode,
} from "@/src/lib/types/vehicle/vehicle.types";
import {
  formatVehicleLabel,
  hasChildren,
  isSameVehicle,
  searchVehicles,
  toSelectedVehicle,
} from "@/src/services/vehicle/vehicle.service";

type VehicleSelectorModalProps = {
  open: boolean;
  catalog: VehicleTreeNode[];
  catalogError: string | null;
  initialSelected: SelectedVehicle[];
  saving?: boolean;
  onClose: () => void;
  onConfirm: (vehicles: SelectedVehicle[]) => Promise<void>;
};

function toggleVehicle(
  current: SelectedVehicle[],
  next: SelectedVehicle,
): SelectedVehicle[] {
  const exists = current.some((item) => isSameVehicle(item, next));
  if (exists) {
    return current.filter((item) => !isSameVehicle(item, next));
  }
  return [...current, next];
}

function hasSelectionChanged(
  initial: SelectedVehicle[],
  draft: SelectedVehicle[],
): boolean {
  if (initial.length !== draft.length) return true;

  const initialIds = new Set(initial.map((vehicle) => vehicle.id));
  return draft.some((vehicle) => !initialIds.has(vehicle.id));
}

export default function VehicleSelectorModal({
  open,
  catalog,
  catalogError,
  initialSelected,
  saving = false,
  onClose,
  onConfirm,
}: VehicleSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [path, setPath] = useState<VehicleTreeNode[]>([]);
  const [draftSelected, setDraftSelected] =
    useState<SelectedVehicle[]>(initialSelected);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("vehicle-selector-open");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("vehicle-selector-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    queueMicrotask(() => {
      setSearchQuery("");
      setPath([]);
      setDraftSelected(initialSelected);
    });
  }, [open, initialSelected]);

  if (!open) return null;

  const currentNode = path[path.length - 1];
  const nodes = currentNode ? currentNode.children : catalog;
  const normalizedQuery = searchQuery.trim();
  const isSearching = normalizedQuery.length > 0;
  const searchResults = isSearching ? searchVehicles(normalizedQuery, catalog) : [];
  const catalogLoading = !catalogError && catalog.length === 0;
  const selectionChanged = hasSelectionChanged(initialSelected, draftSelected);

  const handleConfirm = async () => {
    if (!selectionChanged || saving) return;
    try {
      await onConfirm(draftSelected);
    } catch {
      // toast is shown by the store
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-selector-title"
      className="fixed inset-0 z-80 flex items-end justify-center bg-black/40 px-0 backdrop-blur-sm sm:items-center sm:px-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-2xl border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-custom-dark sm:max-h-[85vh] sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-gray-100 px-5 pb-4 pt-5 dark:border-gray-700">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2
                id="vehicle-selector-title"
                className="text-lg font-bold text-gray-800 dark:text-gray-100"
              >
                خودروت رو انتخاب کن
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                با انتخاب خودرو، سازگاری محصولات با خودروی شما راحت‌تر بررسی
                می‌شود.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <i className="far fa-x text-sm" />
            </button>
          </div>

          <label htmlFor="vehicle-selector-search" className="sr-only">
            جستجوی خودرو
          </label>
          <input
            id="vehicle-selector-search"
            type="search"
            autoFocus
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="جستجوی خودرو..."
            className="w-full rounded-xl border border-gray-200 p-3 text-sm dark:border-gray-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {catalogLoading ? (
            <p className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              در حال دریافت لیست خودروها...
            </p>
          ) : catalogError ? (
            <p className="px-3 py-8 text-center text-sm text-red-500">
              {catalogError}
            </p>
          ) : isSearching ? (
            <SearchResults
              results={searchResults}
              selected={draftSelected}
              onToggle={(vehicle) =>
                setDraftSelected((current) => toggleVehicle(current, vehicle))
              }
            />
          ) : (
            <>
              {currentNode ? (
                <button
                  type="button"
                  onClick={() => setPath((current) => current.slice(0, -1))}
                  className="mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-zinc-800"
                >
                  <i className="far fa-angle-right" aria-hidden="true" />
                  {currentNode.name}
                </button>
              ) : null}

              {currentNode?.isSelectable ? (
                <SelectableRow
                  label={formatVehicleLabel(toSelectedVehicle(path))}
                  checked={draftSelected.some((item) =>
                    isSameVehicle(item, toSelectedVehicle(path)),
                  )}
                  onToggle={() =>
                    setDraftSelected((current) =>
                      toggleVehicle(current, toSelectedVehicle(path)),
                    )
                  }
                />
              ) : null}

              <ul className="space-y-1">
                {nodes.map((node) => {
                  if (hasChildren(node)) {
                    return (
                      <li key={node.id}>
                        <button
                          type="button"
                          onClick={() =>
                            setPath((current) => [...current, node])
                          }
                          className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-start text-sm font-medium text-gray-800 transition hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-zinc-800"
                        >
                          {node.name}
                          <i
                            className="far fa-angle-left text-gray-400"
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                    );
                  }

                  if (!node.isSelectable) return null;

                  const selectable = toSelectedVehicle([...path, node]);
                  const checked = draftSelected.some((item) =>
                    isSameVehicle(item, selectable),
                  );

                  return (
                    <li key={node.id}>
                      <SelectableRow
                        label={formatVehicleLabel(selectable)}
                        checked={checked}
                        onToggle={() =>
                          setDraftSelected((current) =>
                            toggleVehicle(current, selectable),
                          )
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-700">
          <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
            خودروهای انتخاب‌شده:
          </p>
          {draftSelected.length === 0 ? (
            <p className="mb-4 text-sm text-gray-400 dark:text-gray-500">
              هنوز خودرویی انتخاب نشده است.
            </p>
          ) : (
            <ul className="mb-4 flex max-h-28 flex-col gap-2 overflow-y-auto">
              {draftSelected.map((vehicle) => (
                <li
                  key={vehicle.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:bg-zinc-800 dark:text-gray-100"
                >
                  <span>{formatVehicleLabel(vehicle)}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraftSelected((current) =>
                        current.filter((item) => !isSameVehicle(item, vehicle)),
                      )
                    }
                    aria-label={`حذف ${formatVehicleLabel(vehicle)}`}
                    className="flex size-7 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-200 dark:hover:bg-zinc-700"
                  >
                    <i className="far fa-x text-xs" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            disabled={!selectionChanged || saving}
            onClick={() => void handleConfirm()}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-zinc-700 dark:disabled:text-gray-400"
          >
            {saving ? "در حال ذخیره..." : "تأیید انتخاب"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchResults({
  results,
  selected,
  onToggle,
}: {
  results: SelectedVehicle[];
  selected: SelectedVehicle[];
  onToggle: (vehicle: SelectedVehicle) => void;
}) {
  if (results.length === 0) {
    return (
      <p className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        خودرویی با این مشخصات پیدا نشد.
      </p>
    );
  }

  return (
    <ul className="space-y-1">
      {results.map((vehicle) => {
        const checked = selected.some((item) => isSameVehicle(item, vehicle));
        return (
          <li key={vehicle.id}>
            <SelectableRow
              label={formatVehicleLabel(vehicle)}
              checked={checked}
              onToggle={() => onToggle(vehicle)}
            />
          </li>
        );
      })}
    </ul>
  );
}

function SelectableRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-800 transition hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-zinc-800">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary"
        aria-label={label}
      />
      <span>{label}</span>
    </label>
  );
}
