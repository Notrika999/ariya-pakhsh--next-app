import { apiFetch } from "../client";

export async function getProducts() {
  return apiFetch("/products");
}
