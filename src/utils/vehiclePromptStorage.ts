export const VEHICLE_PROMPT_COOLDOWN_MS = 60 * 60 * 1000;
export const VEHICLE_PROMPT_STORAGE_KEY =
  "carup24_vehicle_selector_last_shown_at";

let fallbackLastShownAt: number | null = null;

function readLastShownAt(): number | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(VEHICLE_PROMPT_STORAGE_KEY);
    if (!value) return fallbackLastShownAt;

    const timestamp = Number(value);
    if (!Number.isFinite(timestamp) || timestamp <= 0) {
      window.localStorage.removeItem(VEHICLE_PROMPT_STORAGE_KEY);
      return null;
    }

    fallbackLastShownAt = timestamp;
    return timestamp;
  } catch {
    return fallbackLastShownAt;
  }
}

export function getVehiclePromptRemainingMs(now = Date.now()): number {
  const lastShownAt = readLastShownAt();
  if (lastShownAt === null) return 0;

  // Normalize a future timestamp after a device clock rollback so the prompt
  // cannot remain hidden longer than one cooldown period.
  if (lastShownAt > now) {
    recordVehiclePromptShown(now);
    return VEHICLE_PROMPT_COOLDOWN_MS;
  }

  return Math.max(0, lastShownAt + VEHICLE_PROMPT_COOLDOWN_MS - now);
}

export function recordVehiclePromptShown(now = Date.now()): void {
  if (typeof window === "undefined") return;

  fallbackLastShownAt = now;

  try {
    window.localStorage.setItem(VEHICLE_PROMPT_STORAGE_KEY, String(now));
  } catch {
    // Storage may be unavailable (for example in strict private browsing).
  }
}
