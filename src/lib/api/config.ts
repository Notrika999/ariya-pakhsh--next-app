import { getBackendBaseUrl } from "@/src/lib/api/backend-base";

export const API_CONFIG = {
  BASE_URL: getBackendBaseUrl(),
  DEFAULT_HEADERS: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
} as const;
