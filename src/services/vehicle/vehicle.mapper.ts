import type {
  SelectedVehicle,
  UserVehicle,
  VehicleTreeNode,
} from "@/src/lib/types/vehicle/vehicle.types";

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function unwrapData(payload: unknown): unknown {
  const root = getRecord(payload);
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(root.data)) return root.data;
  const nested = getRecord(root.data);
  if (Array.isArray(nested.items)) return nested.items;
  if (Array.isArray(nested.data)) return nested.data;
  if (Array.isArray(root.items)) return root.items;
  return root.data ?? payload;
}

export function mapVehicleTreeNode(value: unknown): VehicleTreeNode | null {
  const record = getRecord(value);
  const id = String(record.id ?? "").trim();
  const name = String(record.name ?? "").trim();
  if (!id || !name) return null;

  const childrenRaw = Array.isArray(record.children) ? record.children : [];
  const children = childrenRaw
    .map(mapVehicleTreeNode)
    .filter((node): node is VehicleTreeNode => Boolean(node));

  return {
    id,
    name,
    slug: record.slug ? String(record.slug) : undefined,
    isSelectable: Boolean(record.isSelectable),
    children,
  };
}

export function mapVehicleTree(payload: unknown): VehicleTreeNode[] {
  const data = unwrapData(payload);
  if (!Array.isArray(data)) return [];
  return data
    .map(mapVehicleTreeNode)
    .filter((node): node is VehicleTreeNode => Boolean(node));
}

export function mapUserVehicle(value: unknown): UserVehicle | null {
  if (!value || typeof value !== "object") return null;

  const record = getRecord(value);
  const id = String(record.id ?? "").trim();
  const vehicleId = String(record.vehicleId ?? "").trim();
  const name = String(record.name ?? "").trim();
  if (!id || !vehicleId) return null;

  return {
    id,
    vehicleId,
    name: name || vehicleId,
    pathLabel: String(record.pathLabel ?? (name || vehicleId)).trim(),
    slug: String(record.slug ?? "").trim(),
    isDefault: Boolean(record.isDefault),
  };
}

export function mapUserVehicles(payload: unknown): UserVehicle[] {
  const data = unwrapData(payload);
  if (!Array.isArray(data)) {
    const single = mapUserVehicle(data);
    return single ? [single] : [];
  }

  return data
    .map(mapUserVehicle)
    .filter((item): item is UserVehicle => Boolean(item));
}

export function mapDefaultUserVehicle(payload: unknown): UserVehicle | null {
  const root = getRecord(payload);
  const data = getRecord(root.data ?? payload);
  if (data.vehicle == null) return null;
  return mapUserVehicle(data.vehicle);
}

export function userVehicleToSelected(vehicle: UserVehicle): SelectedVehicle {
  return {
    id: vehicle.vehicleId,
    name: vehicle.name,
    label: vehicle.pathLabel || vehicle.name,
  };
}
