import "server-only";
import { cookies } from "next/headers";
import { API_CONFIG } from "./config";

type RequestOptions = RequestInit & {
  params?: Record<string, string | number>;
};

function buildUrl(endpoint: string, params?: Record<string, string | number>) {
  const url = new URL(endpoint, API_CONFIG.BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, String(value))
    );
  }

  return url.toString();
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const { headers, params, ...rest } = options;
  const url = buildUrl(endpoint, params);

  const response = await fetch(url, {
    ...rest,
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
