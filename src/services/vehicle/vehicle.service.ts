import type {
  SelectedVehicle,
  VehicleTreeNode,
} from "@/src/lib/types/vehicle/vehicle.types";

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ");
}

function stripParentPrefix(name: string, parentName?: string): string {
  if (!parentName) return name;
  if (name.startsWith(parentName)) {
    return name.slice(parentName.length).trim();
  }
  return name;
}

export function formatTreePath(path: VehicleTreeNode[]): string {
  return path
    .map((node, index) =>
      stripParentPrefix(node.name, index > 0 ? path[index - 1]?.name : undefined),
    )
    .filter(Boolean)
    .join(" - ");
}

export function formatVehicleLabel(vehicle: SelectedVehicle): string {
  return vehicle.label || vehicle.name;
}

export function isSameVehicle(
  left: SelectedVehicle,
  right: SelectedVehicle,
): boolean {
  return left.id === right.id;
}

export function hasChildren(node: VehicleTreeNode): boolean {
  return node.children.length > 0;
}

export function toSelectedVehicle(path: VehicleTreeNode[]): SelectedVehicle {
  const leaf = path[path.length - 1];
  const label = formatTreePath(path);
  return {
    id: leaf.id,
    name: leaf.name,
    label,
  };
}

export function flattenSelectableVehicles(
  nodes: VehicleTreeNode[],
  ancestors: VehicleTreeNode[] = [],
): SelectedVehicle[] {
  return nodes.flatMap((node) => {
    const path = [...ancestors, node];
    const current = node.isSelectable ? [toSelectedVehicle(path)] : [];
    return [...current, ...flattenSelectableVehicles(node.children, path)];
  });
}

export function searchVehicles(
  query: string,
  catalog: VehicleTreeNode[],
): SelectedVehicle[] {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return [];

  return flattenSelectableVehicles(catalog).filter((item) => {
    const haystack = normalizeSearch(`${item.name} ${item.label}`);
    return haystack.includes(normalizedQuery);
  });
}
