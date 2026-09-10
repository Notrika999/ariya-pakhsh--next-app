export type VehicleTreeNode = {
  id: string;
  name: string;
  slug?: string;
  isSelectable: boolean;
  children: VehicleTreeNode[];
};

export type SelectedVehicle = {
  id: string;
  name: string;
  label: string;
};

export type UserVehicle = {
  id: string;
  vehicleId: string;
  name: string;
  pathLabel: string;
  slug: string;
  isDefault: boolean;
};
