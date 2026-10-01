"use client";

import { apiClient } from "@/src/lib/http/api-client";
import type { CustomerAddressDto } from "@/src/lib/types/address/address.type";

const PROVINCES_PATH = "/locations/provinces";

export type LocationOption = {
  id: string;
  name: string;
  parentId?: string;
};

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function unwrapLocationItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  const root = getRecord(payload);
  if (Array.isArray(root.data)) return root.data;

  const data = getRecord(root.data);
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.provinces)) return data.provinces;
  if (Array.isArray(data.cities)) return data.cities;

  return [];
}

function normalizeLocationName(value: string): string {
  return value
    .trim()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function mapLocationOption(value: unknown, parentId?: string): LocationOption | null {
  const record = getRecord(value);
  const id = String(
    record.id ?? record.provinceId ?? record.cityId ?? "",
  ).trim();
  const name = String(record.name ?? record.title ?? "").trim();
  if (!id || !name) return null;

  const resolvedParentId = String(
    record.parentId ?? record.provinceId ?? parentId ?? "",
  ).trim();

  return resolvedParentId
    ? { id, name, parentId: resolvedParentId }
    : { id, name };
}

function findLocationOption(
  options: readonly LocationOption[],
  name: string,
  id?: string,
): LocationOption | undefined {
  const normalizedId = id?.trim();
  const normalizedName = normalizeLocationName(name);

  return (
    options.find((option) => option.id === normalizedId) ??
    options.find(
      (option) => normalizeLocationName(option.name) === normalizedName,
    )
  );
}

export async function getLocationProvinces(): Promise<LocationOption[]> {
  const response = await apiClient.get(PROVINCES_PATH);

  return unwrapLocationItems(response.data)
    .map((item) => mapLocationOption(item))
    .filter((item): item is LocationOption => Boolean(item));
}

export async function getLocationCities(
  provinceId: string,
): Promise<LocationOption[]> {
  const response = await apiClient.get(
    `${PROVINCES_PATH}/${encodeURIComponent(provinceId)}/cities`,
  );

  return unwrapLocationItems(response.data)
    .map((item) => mapLocationOption(item, provinceId))
    .filter((item): item is LocationOption => Boolean(item));
}

export async function resolveCustomerAddressLocationIds(
  address: CustomerAddressDto,
): Promise<CustomerAddressDto> {
  if (address.provinceId?.trim() && address.cityId?.trim()) {
    return address;
  }

  const provinces = await getLocationProvinces();
  const province = findLocationOption(
    provinces,
    address.province,
    address.provinceId,
  );

  if (!province) {
    throw new Error("شناسه استان آدرس انتخاب‌شده پیدا نشد.");
  }

  const cities = await getLocationCities(province.id);
  const city = findLocationOption(cities, address.city, address.cityId);

  if (!city) {
    throw new Error("شناسه شهر آدرس انتخاب‌شده پیدا نشد.");
  }

  return {
    ...address,
    province: province.name,
    city: city.name,
    provinceId: province.id,
    cityId: city.id,
  };
}
