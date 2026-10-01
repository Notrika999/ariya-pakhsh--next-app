"use client";

import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  SelectedVehicle,
  UserVehicle,
  VehicleTreeNode,
} from "@/src/lib/types/vehicle/vehicle.types";
import {
  mapDefaultUserVehicle,
  mapUserVehicles,
  mapVehicleTree,
} from "./vehicle.mapper";

export async function getVehicleTree(): Promise<VehicleTreeNode[]> {
  const response = await apiClient.get("vehicles/tree");
  return mapVehicleTree(response.data);
}

export async function getMyVehicles(): Promise<UserVehicle[]> {
  try {
    const response = await apiClient.get("me/vehicles");
    return mapUserVehicles(response.data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return [];
    }
    throw error;
  }
}

export async function getDefaultMyVehicle(): Promise<UserVehicle | null> {
  try {
    const response = await apiClient.get("me/vehicles/default");
    return mapDefaultUserVehicle(response.data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function saveMyVehicle(vehicleId: string): Promise<void> {
  await apiClient.post("me/vehicles", { vehicleId });
}

export async function saveMyVehicles(
  vehicles: SelectedVehicle[],
): Promise<void> {
<<<<<<< HEAD
  const currentVehicles = await getMyVehicles();
  const selectedVehicleIds = new Set(
    vehicles.map((vehicle) => vehicle.id.trim()).filter(Boolean),
  );
  const currentVehicleIds = new Set(
    currentVehicles.map((vehicle) => vehicle.vehicleId),
  );

  const vehiclesToDelete = currentVehicles.filter(
    (vehicle) => !selectedVehicleIds.has(vehicle.vehicleId),
  );
  const vehicleIdsToAdd = [...selectedVehicleIds].filter(
    (vehicleId) => !currentVehicleIds.has(vehicleId),
  );

  await Promise.all([
    ...vehiclesToDelete.map((vehicle) => deleteMyVehicle(vehicle.id)),
    ...vehicleIdsToAdd.map((vehicleId) => saveMyVehicle(vehicleId)),
  ]);
=======
  await Promise.all(vehicles.map((vehicle) => saveMyVehicle(vehicle.id)));
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
}

export async function setDefaultMyVehicle(userVehicleId: string): Promise<void> {
  await apiClient.put(`me/vehicles/${encodeURIComponent(userVehicleId)}/default`);
}

export async function deleteMyVehicle(userVehicleId: string): Promise<void> {
  await apiClient.delete(`me/vehicles/${encodeURIComponent(userVehicleId)}`);
}
