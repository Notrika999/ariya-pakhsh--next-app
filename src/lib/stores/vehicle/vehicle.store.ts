"use client";

import { create } from "zustand";
import type {
  SelectedVehicle,
  VehicleTreeNode,
} from "@/src/lib/types/vehicle/vehicle.types";
import {
  getMyVehicles,
  getVehicleTree,
  saveMyVehicle,
  saveMyVehicles,
} from "@/src/services/vehicle/vehicle.client";
import { userVehicleToSelected } from "@/src/services/vehicle/vehicle.mapper";
import { vehicleCookie } from "@/src/utils/vehicleCookie";
import { getIsAuthenticated } from "@/src/lib/stores/auth/auth.store";
import { notify } from "@/src/utils/toast";
import { recordVehiclePromptShown } from "@/src/utils/vehiclePromptStorage";

type VehicleState = {
  selectedVehicles: SelectedVehicle[];
  catalog: VehicleTreeNode[];
  isHydrated: boolean;
  isModalOpen: boolean;
  isSaving: boolean;
  catalogError: string | null;
  hydrate: () => Promise<void>;
  loadCatalog: () => Promise<void>;
  openModal: () => void;
  closeModal: () => void;
  confirmSelection: (vehicles: SelectedVehicle[]) => Promise<void>;
};

async function readSelectedVehicles(): Promise<SelectedVehicle[]> {
  if (getIsAuthenticated()) {
    try {
      const fromCookie = vehicleCookie.get();
      const fromApi = await getMyVehicles();
      const apiVehicleIds = new Set(
        fromApi.map((vehicle) => vehicle.vehicleId),
      );
      const guestVehiclesToAdd = fromCookie.filter(
        (vehicle) => !apiVehicleIds.has(vehicle.id),
      );

      if (guestVehiclesToAdd.length > 0) {
        await Promise.all(
          guestVehiclesToAdd.map((vehicle) => saveMyVehicle(vehicle.id)),
        );
      }

      const synchronizedVehicles =
        guestVehiclesToAdd.length > 0 ? await getMyVehicles() : fromApi;
      const selectedVehicles = synchronizedVehicles.map(userVehicleToSelected);

      vehicleCookie.set(selectedVehicles);
      return selectedVehicles;
    } catch {
      return vehicleCookie.get();
    }
  }

  return vehicleCookie.get();
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  selectedVehicles: [],
  catalog: [],
  isHydrated: false,
  isModalOpen: false,
  isSaving: false,
  catalogError: null,

  hydrate: async () => {
    vehicleCookie.clearLegacy();
    const selectedVehicles = await readSelectedVehicles();

    set({
      selectedVehicles,
      isHydrated: true,
      isModalOpen:
        selectedVehicles.length > 0 ? false : get().isModalOpen,
    });
  },

  loadCatalog: async () => {
    if (get().catalog.length > 0) return;

    try {
      const catalog = await getVehicleTree();
      set({ catalog, catalogError: null });
    } catch {
      set({ catalogError: "دریافت لیست خودروها با خطا مواجه شد." });
    }
  },

  openModal: () => {
    recordVehiclePromptShown();
    set({ isModalOpen: true });
    void get().loadCatalog();
  },

  closeModal: () => set({ isModalOpen: false }),

  confirmSelection: async (vehicles) => {
    set({ isSaving: true });

    try {
      if (getIsAuthenticated()) {
        await saveMyVehicles(vehicles);
      }

      vehicleCookie.set(vehicles);

      set({
        selectedVehicles: vehicles,
        isModalOpen: false,
      });
    } catch {
      notify.error("ذخیره خودروهای انتخاب‌شده با خطا مواجه شد.");
      throw new Error("SAVE_VEHICLES_FAILED");
    } finally {
      set({ isSaving: false });
    }
  },
}));

export const useSelectedVehicles = () =>
  useVehicleStore((state) => state.selectedVehicles);

export const useVehicleSelectorHydrated = () =>
  useVehicleStore((state) => state.isHydrated);

export const openVehicleSelector = () => useVehicleStore.getState().openModal;
