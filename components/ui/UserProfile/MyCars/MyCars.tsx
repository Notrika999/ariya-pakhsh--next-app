"use client";
// components/ui/UserProfile/MyCars/MyCars.tsx
import { useCallback, useEffect, useState } from "react";
import MyCarsTop from "./MyCarsTop";
import VehicleSelectorModal from "@/components/modules/VehicleSelector/VehicleSelectorModal";
import {
  deleteMyVehicle,
  getDefaultMyVehicle,
  getMyVehicles,
  getVehicleTree,
  saveMyVehicle,
  setDefaultMyVehicle,
} from "@/src/services/vehicle/vehicle.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import type {
  SelectedVehicle,
  UserVehicle,
  VehicleTreeNode,
} from "@/src/lib/types/vehicle/vehicle.types";
import { useVehicleStore } from "@/src/lib/stores/vehicle/vehicle.store";
import { notify } from "@/src/utils/toast";
import { MyCarsListSkeleton } from "../skeletons/UserProfileSkeletons";

function applyDefaultFlag(
  items: UserVehicle[],
  defaultVehicle: UserVehicle | null,
): UserVehicle[] {
  if (!defaultVehicle) return items;
  return items.map((item) => ({
    ...item,
    isDefault: item.id === defaultVehicle.id,
  }));
}

export default function MyCars() {
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [catalog, setCatalog] = useState<VehicleTreeNode[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const hydrateVehicleStore = useVehicleStore((state) => state.hydrate);

  const loadVehicles = useCallback(async () => {
    setLoading(true);

    try {
      const [items, defaultVehicle] = await Promise.all([
        getMyVehicles(),
        getDefaultMyVehicle(),
      ]);
      setVehicles(applyDefaultFlag(items, defaultVehicle));
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadVehicles();
    });
  }, [loadVehicles]);

  const openCreateModal = async () => {
    setIsModalOpen(true);
    if (catalog.length > 0) return;

    try {
      const tree = await getVehicleTree();
      setCatalog(tree);
      setCatalogError(null);
    } catch (error) {
      setCatalogError(getAuthErrorMessage(error));
    }
  };

  const handleAddVehicles = async (selected: SelectedVehicle[]) => {
    const existingIds = new Set(vehicles.map((item) => item.vehicleId));
    const toAdd = selected.filter((item) => !existingIds.has(item.id));

    if (toAdd.length === 0) {
      notify.info("این خودروها از قبل در لیست شما هستند.");
      setIsModalOpen(false);
      return;
    }

    setSaving(true);
    try {
      await Promise.all(toAdd.map((item) => saveMyVehicle(item.id)));
      setIsModalOpen(false);
      await loadVehicles();
      await hydrateVehicleStore();
      notify.success("خودرو با موفقیت اضافه شد.");
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (userVehicleId: string) => {
    setActionId(userVehicleId);
    try {
      await setDefaultMyVehicle(userVehicleId);
      await loadVehicles();
      await hydrateVehicleStore();
      notify.success("خودروی پیش‌فرض با موفقیت تنظیم شد.");
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (userVehicleId: string) => {
    setActionId(userVehicleId);
    try {
      await deleteMyVehicle(userVehicleId);
      await loadVehicles();
      await hydrateVehicleStore();
      notify.success("خودرو با موفقیت حذف شد.");
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-4 lg:col-span-3">
      <MyCarsTop vehicleCount={vehicles.length} />

      <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <button
          type="button"
          onClick={() => void openCreateModal()}
          disabled={loading}
          className="flex w-full items-center justify-center rounded-lg bg-primary px-6 py-4 text-white shadow-sm transition duration-200 hover:bg-primary/90 hover:shadow active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary/80 dark:text-white dark:hover:bg-primary/60"
        >
          <i className="far fa-plus me-2" />
          افزودن خودرو جدید
        </button>
      </div>

      {loading ? (
        <MyCarsListSkeleton />
      ) : vehicles.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center text-gray-500 drop-shadow-lg dark:bg-custom-dark dark:text-gray-400">
          هنوز خودرویی ثبت نشده است.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {vehicles.map((vehicle) => (
            <article
              key={vehicle.id}
              className={`relative rounded-2xl bg-white px-4 py-4 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark ${
                vehicle.isDefault ? "border-2 border-primary" : ""
              }`}
            >
              {vehicle.isDefault ? (
                <span className="absolute inset-e-4 top-4 inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  پیش‌فرض
                </span>
              ) : null}

              <div className="flex items-start gap-3 pe-16">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-200">
                  <i className="far fa-car" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-gray-800 dark:text-gray-200">
                    {vehicle.name}
                  </h3>
                  {vehicle.pathLabel && vehicle.pathLabel !== vehicle.name ? (
                    <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                      {vehicle.pathLabel}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                {!vehicle.isDefault ? (
                  <button
                    type="button"
                    onClick={() => void handleSetDefault(vehicle.id)}
                    disabled={Boolean(actionId)}
                    className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                  >
                    {actionId === vehicle.id
                      ? "در حال تنظیم..."
                      : "تنظیم به‌عنوان پیش‌فرض"}
                  </button>
                ) : (
                  <span className="flex-1 text-sm text-gray-500 dark:text-gray-400">
                    خودروی پیش‌فرض شما
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => void handleDelete(vehicle.id)}
                  disabled={Boolean(actionId)}
                  aria-label={`حذف ${vehicle.name}`}
                  className="flex size-10 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <i className="far fa-trash-can" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <VehicleSelectorModal
        open={isModalOpen}
        catalog={catalog}
        catalogError={catalogError}
        initialSelected={[]}
        saving={saving}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddVehicles}
      />
    </div>
  );
}
