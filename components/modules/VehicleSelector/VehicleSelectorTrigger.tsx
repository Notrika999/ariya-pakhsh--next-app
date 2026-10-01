"use client";
// components/modules/VehicleSelector/VehicleSelectorTrigger.tsx
import { ChevronDown } from "lucide-react";
import {
  useSelectedVehicles,
  useVehicleSelectorHydrated,
  useVehicleStore,
} from "@/src/lib/stores/vehicle/vehicle.store";
import type { SelectedVehicle } from "@/src/lib/types/vehicle/vehicle.types";

type VehicleSelectorTriggerProps = {
  compact?: boolean;
  className?: string;
};

function getVehicleTriggerLabel(vehicle: SelectedVehicle): string {
  const value = vehicle.name.trim() || vehicle.label.trim();

  return value
    .split(/\s*(?:\/|\||-)\s*/g)
    .filter(Boolean)
    .at(-1) ?? value;
}

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
      : getVehicleTriggerLabel(selectedVehicles[0]);
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
          ? `h-9 max-w-[8.5rem] gap-1 px-2.5 py-2 max-[500px]:w-[4.75rem] max-[500px]:px-2 ${
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
        className={`min-w-0 truncate leading-5 ${compact ? "text-xs max-[500px]:hidden" : "text-sm"}`}
      >
        {summary}
      </span>
      {compact ? (
        <>
          <span className="hidden text-xs leading-5 max-[500px]:inline">
            خودرو
          </span>
          <ChevronDown
            className="hidden size-3.5 shrink-0 max-[500px]:block"
            aria-hidden="true"
          />
        </>
      ) : null}
    </button>
  );
}
