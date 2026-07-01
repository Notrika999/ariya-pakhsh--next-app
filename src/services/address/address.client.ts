"use client";

import { apiClient } from "@/src/lib/http/api-client";
import {
  CustomerAddressApiEnvelope,
  CustomerAddressBulkPayload,
  CustomerAddressDto,
  CustomerAddressPayload,
} from "@/src/lib/types/address/address.type";

const BASE_PATH = "/CustomerAddress";

function unwrapAddressList(payload: unknown): CustomerAddressDto[] {
  if (Array.isArray(payload)) return payload as CustomerAddressDto[];

  if (!payload || typeof payload !== "object") return [];

  const record = payload as CustomerAddressApiEnvelope<CustomerAddressDto[]>;
  if (Array.isArray(record.data)) return record.data;

  const nested = record.data as CustomerAddressApiEnvelope<CustomerAddressDto[]> | undefined;
  if (nested && Array.isArray(nested.data)) return nested.data;

  return [];
}

function unwrapAddressId(payload: unknown): string {
  if (typeof payload === "string" && payload.length > 0) return payload;

  if (!payload || typeof payload !== "object") {
    throw new Error("شناسه آدرس در پاسخ سرور پیدا نشد");
  }

  const record = payload as CustomerAddressApiEnvelope<string>;
  if (typeof record.data === "string" && record.data.length > 0) {
    return record.data;
  }

  throw new Error("شناسه آدرس در پاسخ سرور پیدا نشد");
}

export async function getCustomerAddresses(): Promise<CustomerAddressDto[]> {
  console.log("[address.client] GET", BASE_PATH);
  const response = await apiClient.get(BASE_PATH);
  console.log("[address.client] GET raw response =>", response.data);
  const addresses = unwrapAddressList(response.data);
  console.log("[address.client] GET parsed =>", addresses);
  return addresses;
}

export async function createCustomerAddress(
  payload: CustomerAddressPayload,
): Promise<string> {
  console.log("[address.client] POST", BASE_PATH, payload);
  const response = await apiClient.post(BASE_PATH, payload);
  console.log("[address.client] POST raw response =>", response.data);
  const id = unwrapAddressId(response.data);
  console.log("[address.client] POST parsed id =>", id);
  return id;
}

export async function createCustomerAddressesBulk(
  payload: CustomerAddressBulkPayload,
): Promise<void> {
  console.log("[address.client] POST", `${BASE_PATH}/bulk`, payload);
  const response = await apiClient.post(`${BASE_PATH}/bulk`, payload);
  console.log("[address.client] POST bulk raw response =>", response.data);
}

export async function updateCustomerAddress(
  addressId: string,
  payload: CustomerAddressPayload,
): Promise<void> {
  console.log("[address.client] PUT", `${BASE_PATH}/${addressId}`, payload);
  const response = await apiClient.put(`${BASE_PATH}/${addressId}`, payload);
  console.log("[address.client] PUT raw response =>", response.data);
}

export async function deleteCustomerAddress(addressId: string): Promise<void> {
  console.log("[address.client] DELETE", `${BASE_PATH}/${addressId}`);
  const response = await apiClient.delete(`${BASE_PATH}/${addressId}`);
  console.log("[address.client] DELETE raw response =>", response.data);
}

export async function setDefaultCustomerAddress(
  addressId: string,
): Promise<void> {
  console.log("[address.client] PATCH", `${BASE_PATH}/${addressId}/default`);
  const response = await apiClient.patch(`${BASE_PATH}/${addressId}/default`, {});
  console.log("[address.client] PATCH default raw response =>", response.data);
}
