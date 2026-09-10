"use client";

import { Car } from "lucide-react";
import { formatVehicleLabel } from "@/src/services/vehicle/vehicle.service";
import {
  useSelectedVehicles,
  useVehicleSelectorHydrated,
  useVehicleStore,
} from "@/src/lib/stores/vehicle/vehicle.store";

type VehicleSelectorTriggerProps = {
  compact?: boolean;
  className?: string;
};

export default function VehicleSelectorTrigger({
  compact = false,
  className = "",
}: VehicleSelectorTriggerProps) {
  const isHydrated = useVehicleSelectorHydrated();
  const selectedVehicles = useSelectedVehicles();
  const openModal = useVehicleStore((state) => state.openModal);

  const summary = !isHydrated
    ? "خودروی من"
    : selectedVehicles.length === 0
      ? "انتخاب خودرو"
      : selectedVehicles.length === 1
        ? formatVehicleLabel(selectedVehicles[0])
        : `${formatVehicleLabel(selectedVehicles[0])} و ${selectedVehicles.length - 1} خودرو دیگر`;
  const hasSelection = isHydrated && selectedVehicles.length > 0;

  return (
    <button
      type="button"
      onClick={openModal}
      aria-label={
        selectedVehicles.length > 0
          ? `تغییر خودرو، انتخاب فعلی: ${summary}`
          : "انتخاب خودرو"
      }
      className={`group relative isolate inline-flex items-center justify-center overflow-hidden rounded-xl border font-semibold shadow-sm outline-none transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0 dark:focus-visible:ring-primary-300 dark:focus-visible:ring-offset-custom-dark ${
        compact
          ? `size-9 ${
              hasSelection
                ? "border-primary-500 bg-primary text-white shadow-primary-500/25 hover:bg-primary-600 dark:border-primary-400 dark:bg-primary-500 dark:text-white dark:hover:bg-primary-400"
                : "border-primary-200 bg-primary-50 text-primary-800 shadow-primary-500/10 hover:border-primary-300 hover:bg-primary-100 dark:border-primary-500/40 dark:bg-primary-500/15 dark:text-primary-100 dark:hover:bg-primary-500/25"
            }`
          : `h-11 max-w-60 gap-2 px-3.5 py-2 ${
              hasSelection
                ? "border-primary-500 bg-primary text-white shadow-primary-500/25 hover:bg-primary-600 dark:border-primary-400 dark:bg-primary-500 dark:text-white dark:hover:bg-primary-400"
                : "border-primary-200 bg-primary-50 text-primary-900 shadow-primary-500/10 hover:border-primary-300 hover:bg-primary-100 hover:text-primary-800 dark:border-primary-500/40 dark:bg-primary-500/15 dark:text-primary-100 dark:hover:bg-primary-500/25"
            }`
      } ${className}`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-lg transition-colors ${
          compact
            ? "size-7"
            : "size-8 bg-white/80 text-primary-700 group-hover:bg-white dark:bg-white/10 dark:text-primary-100 dark:group-hover:bg-primary-400/20"
        } ${
          hasSelection
            ? "bg-white/20 text-white shadow-sm dark:bg-white/20 dark:text-white"
            : ""
        }`}
      >
        <Car className={compact ? "size-4.5" : "size-4"} aria-hidden="true" />
      </span>
      {compact ? null : (
        <span className="min-w-0 truncate text-sm leading-5">{summary}</span>
      )}
    </button>
  );
}
