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
  await Promise.all(vehicles.map((vehicle) => saveMyVehicle(vehicle.id)));
}

export async function setDefaultMyVehicle(userVehicleId: string): Promise<void> {
  await apiClient.put(`me/vehicles/${encodeURIComponent(userVehicleId)}/default`);
}

export async function deleteMyVehicle(userVehicleId: string): Promise<void> {
  await apiClient.delete(`me/vehicles/${encodeURIComponent(userVehicleId)}`);
}
