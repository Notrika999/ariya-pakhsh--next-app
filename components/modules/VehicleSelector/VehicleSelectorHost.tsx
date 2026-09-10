"use client";

import { useEffect } from "react";
import VehicleSelectorModal from "./VehicleSelectorModal";
import { useVehicleStore } from "@/src/lib/stores/vehicle/vehicle.store";
import {
  useIsAuthenticated,
  useIsAuthBootstrapping,
} from "@/src/lib/stores/auth/auth.store";

export default function VehicleSelectorHost() {
  const hydrate = useVehicleStore((state) => state.hydrate);
  const loadCatalog = useVehicleStore((state) => state.loadCatalog);
  const isHydrated = useVehicleStore((state) => state.isHydrated);
  const isModalOpen = useVehicleStore((state) => state.isModalOpen);
  const selectedVehicles = useVehicleStore((state) => state.selectedVehicles);
  const catalog = useVehicleStore((state) => state.catalog);
  const catalogError = useVehicleStore((state) => state.catalogError);
  const isSaving = useVehicleStore((state) => state.isSaving);
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
