// API base (Swagger): https://aryapakhsh.shop/swagger-api
// Legacy site origin: https://aryapakhsh.shop
const DEFAULT_BACKEND_ORIGIN = "https://aryapakhsh.shop/swagger-api";

export function getBackendBaseUrl(): string {
  return (process.env.BACKEND_ORIGIN?.trim() || DEFAULT_BACKEND_ORIGIN).replace(
    /\/$/,
    "",
  );
}

export function buildBackendApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getBackendBaseUrl()}${normalizedPath}`;
}
