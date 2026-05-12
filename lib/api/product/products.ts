import { apiFetch } from "../apiClient";

export async function getProducts() {
  return apiFetch("/products");
}
