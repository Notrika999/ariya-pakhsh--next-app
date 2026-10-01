import type { SelectedVehicle } from "@/src/lib/types/vehicle/vehicle.types";

export const VEHICLE_COOKIE_NAME = "vehicleId";
const LEGACY_STORAGE_KEY = "carup24_selected_vehicles";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${name}=`;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(prefix));

  if (!match) return null;

  try {
    return decodeURIComponent(match.slice(prefix.length));
  } catch {
    return match.slice(prefix.length);
  }
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;

  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

function clearCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function normalizeStoredVehicle(value: unknown): SelectedVehicle | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const id = String(item.id ?? item.vehicleId ?? "").trim();
  const name = String(
    item.name ?? item.vehicleName ?? item.label ?? "",
  ).trim();
  if (!id || !name) return null;
  return {
    id,
    name,
    label: String(item.label ?? name),
  };
}

export const vehicleCookie = {
  get(): SelectedVehicle[] {
    if (typeof window === "undefined") return [];

    try {
      const raw = readCookie(VEHICLE_COOKIE_NAME);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      return list
        .map(normalizeStoredVehicle)
        .filter((item): item is SelectedVehicle => Boolean(item));
    } catch {
      return [];
    }
  },

  set(vehicles: SelectedVehicle[]): void {
    if (typeof window === "undefined") return;

<<<<<<< HEAD
    if (vehicles.length === 0) {
      this.clear();
      return;
    }

    const payload = vehicles.map((vehicle) => ({
      id: vehicle.id,
      name: vehicle.name,
      label: vehicle.label,
=======
    const payload = vehicles.map((vehicle) => ({
      id: vehicle.id,
      name: vehicle.name,
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    }));

    writeCookie(VEHICLE_COOKIE_NAME, JSON.stringify(payload));
    this.clearLegacy();
  },

  clear(): void {
    clearCookie(VEHICLE_COOKIE_NAME);
    this.clearLegacy();
  },

  clearLegacy(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};
<<<<<<< HEAD
=======

>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
