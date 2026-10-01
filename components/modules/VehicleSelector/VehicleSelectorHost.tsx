"use client";

import { useEffect } from "react";
import VehicleSelectorModal from "./VehicleSelectorModal";
import { useVehicleStore } from "@/src/lib/stores/vehicle/vehicle.store";
import {
  useIsAuthenticated,
  useIsAuthBootstrapping,
} from "@/src/lib/stores/auth/auth.store";
<<<<<<< HEAD
import {
  getVehiclePromptRemainingMs,
  VEHICLE_PROMPT_STORAGE_KEY,
} from "@/src/utils/vehiclePromptStorage";
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

export default function VehicleSelectorHost() {
  const hydrate = useVehicleStore((state) => state.hydrate);
  const loadCatalog = useVehicleStore((state) => state.loadCatalog);
  const isHydrated = useVehicleStore((state) => state.isHydrated);
  const isModalOpen = useVehicleStore((state) => state.isModalOpen);
  const selectedVehicles = useVehicleStore((state) => state.selectedVehicles);
  const catalog = useVehicleStore((state) => state.catalog);
  const catalogError = useVehicleStore((state) => state.catalogError);
  const isSaving = useVehicleStore((state) => state.isSaving);
<<<<<<< HEAD
  const openModal = useVehicleStore((state) => state.openModal);
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  const closeModal = useVehicleStore((state) => state.closeModal);
  const confirmSelection = useVehicleStore((state) => state.confirmSelection);
  const isAuthenticated = useIsAuthenticated();
  const isAuthBootstrapping = useIsAuthBootstrapping();

  useEffect(() => {
    if (isAuthBootstrapping) return;
    void hydrate();
  }, [hydrate, isAuthBootstrapping, isAuthenticated]);

  useEffect(() => {
    if (!isHydrated) return;
    void loadCatalog();
  }, [isHydrated, loadCatalog]);

<<<<<<< HEAD
  useEffect(() => {
    if (!isHydrated || selectedVehicles.length > 0 || isModalOpen) return;

    let timerId: number | null = null;

    const clearTimer = () => {
      if (timerId === null) return;
      window.clearTimeout(timerId);
      timerId = null;
    };

    const schedulePrompt = () => {
      clearTimer();

      // Do not consume the cooldown while the tab is in the background. The
      // timestamp is recorded only when the user can actually see the modal.
      if (document.visibilityState !== "visible") return;

      const remainingMs = getVehiclePromptRemainingMs();
      if (remainingMs === 0) {
        openModal();
        return;
      }

      timerId = window.setTimeout(schedulePrompt, remainingMs);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === VEHICLE_PROMPT_STORAGE_KEY) schedulePrompt();
    };

    schedulePrompt();
    document.addEventListener("visibilitychange", schedulePrompt);
    window.addEventListener("storage", handleStorage);

    return () => {
      clearTimer();
      document.removeEventListener("visibilitychange", schedulePrompt);
      window.removeEventListener("storage", handleStorage);
    };
  }, [isHydrated, isModalOpen, openModal, selectedVehicles.length]);

=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  if (!isHydrated) return null;

  return (
    <VehicleSelectorModal
      open={isModalOpen}
      catalog={catalog}
      catalogError={catalogError}
      initialSelected={selectedVehicles}
      saving={isSaving}
      onClose={closeModal}
      onConfirm={confirmSelection}
    />
  );
}
