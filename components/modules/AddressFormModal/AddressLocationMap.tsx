"use client";

<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";
=======
import { useEffect, useRef } from "react";
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { notify } from "@/src/utils/toast";

const DEFAULT_CENTER: L.LatLngExpression = [35.6892, 51.389];
const DEFAULT_ZOOM = 13;
<<<<<<< HEAD
const CURRENT_LOCATION_ZOOM = 17;
const LOCATION_TIMEOUT_MS = 12_000;
const LOCATION_DESIRED_ACCURACY_METERS = 25;
const LOCATION_ACCEPTED_ACCURACY_METERS = 50;
const LOCATION_MAX_VISIBLE_ACCURACY_METERS = 1_000;
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

function hasCoords(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0)
  );
}

<<<<<<< HEAD
function formatAccuracy(accuracy: number): string {
  if (accuracy >= 1_000) {
    const kilometers = accuracy / 1_000;
    return `${kilometers.toLocaleString("fa-IR", {
      maximumFractionDigits: kilometers >= 10 ? 0 : 1,
    })} کیلومتر`;
  }

  return `${accuracy.toLocaleString("fa-IR")} متر`;
}

function createPinIcon(): L.DivIcon {
  return L.divIcon({
    className: "address-location-pin",
    html: `<svg width="28" height="36" viewBox="0 0 28 36" aria-hidden="true" focusable="false" style="display:block;filter:drop-shadow(0 2px 4px rgba(0,0,0,.35));">
      <path d="M14 35C14 35 3 22.5 3 14C3 7.925 7.925 3 14 3C20.075 3 25 7.925 25 14C25 22.5 14 35 14 35Z" fill="#e11d48" stroke="#fff" stroke-width="2"/>
      <circle cx="14" cy="14" r="4.5" fill="#fff"/>
    </svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
  });
}

function createApproximateLocationIcon(): L.DivIcon {
  return L.divIcon({
    className: "address-location-pin",
    html: `<div style="
      width: 18px;
      height: 18px;
      border-radius: 9999px;
      background: #2563eb;
      border: 3px solid #fff;
      box-shadow: 0 0 0 4px rgba(37,99,235,.22), 0 2px 8px rgba(0,0,0,.3);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
=======
function createPinIcon(): L.DivIcon {
  return L.divIcon({
    className: "address-location-pin",
    html: `<div style="
      width: 28px;
      height: 28px;
      border-radius: 50% 50% 50% 0;
      background: #e11d48;
      transform: rotate(-45deg);
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,.35);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  });
}

type AddressLocationMapProps = {
  latitude: number;
  longitude: number;
  disabled?: boolean;
  hasError?: boolean;
  onChange: (coords: { latitude: number; longitude: number }) => void;
};

export default function AddressLocationMap({
  latitude,
  longitude,
  disabled = false,
  hasError = false,
  onChange,
}: AddressLocationMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
<<<<<<< HEAD
  const approximateMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const onChangeRef = useRef(onChange);
  const disabledRef = useRef(disabled);
  const locationWatchIdRef = useRef<number | null>(null);
  const locationTimeoutIdRef = useRef<number | null>(null);
  const locationRequestIdRef = useRef(0);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
=======
  const onChangeRef = useRef(onChange);
  const disabledRef = useRef(disabled);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

<<<<<<< HEAD
  const clearLocationWatch = () => {
    if (locationWatchIdRef.current !== null) {
      navigator.geolocation.clearWatch(locationWatchIdRef.current);
      locationWatchIdRef.current = null;
    }

    if (locationTimeoutIdRef.current !== null) {
      window.clearTimeout(locationTimeoutIdRef.current);
      locationTimeoutIdRef.current = null;
    }
  };

  const setAccuracyCircle = (lat: number, lng: number, accuracy: number) => {
    const map = mapRef.current;
    if (!map || !Number.isFinite(accuracy)) return;

    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.setLatLng([lat, lng]);
      accuracyCircleRef.current.setRadius(accuracy);
    } else {
      accuracyCircleRef.current = L.circle([lat, lng], {
        radius: accuracy,
        color: "#2563eb",
        weight: 1,
        opacity: 0.7,
        fillColor: "#3b82f6",
        fillOpacity: 0.12,
        interactive: false,
      }).addTo(map);
    }
  };

  const setApproximateMarker = (lat: number, lng: number) => {
    const map = mapRef.current;
    if (!map) return;

    if (approximateMarkerRef.current) {
      approximateMarkerRef.current.setLatLng([lat, lng]);
    } else {
      approximateMarkerRef.current = L.marker([lat, lng], {
        icon: createApproximateLocationIcon(),
        interactive: false,
        keyboard: false,
      }).addTo(map);
    }
  };

  const clearApproximateMarker = () => {
    approximateMarkerRef.current?.remove();
    approximateMarkerRef.current = null;
  };

  const focusAccuracyCircle = (lat: number, lng: number, accuracy: number) => {
    const map = mapRef.current;
    if (!map) return;

    setAccuracyCircle(lat, lng, accuracy);

    if (accuracyCircleRef.current) {
      map.fitBounds(accuracyCircleRef.current.getBounds(), {
        maxZoom: CURRENT_LOCATION_ZOOM,
        padding: [24, 24],
      });
    } else {
      map.setView([lat, lng], Math.max(map.getZoom(), CURRENT_LOCATION_ZOOM));
    }
  };

  const clearAccuracyCircle = () => {
    accuracyCircleRef.current?.remove();
    accuracyCircleRef.current = null;
  };

  useEffect(() => {
    return () => {
      locationRequestIdRef.current += 1;
      clearLocationWatch();
    };
  }, []);

=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initial = hasCoords(latitude, longitude)
      ? ([latitude, longitude] as L.LatLngExpression)
      : DEFAULT_CENTER;

    const map = L.map(containerRef.current, {
      center: initial,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const setMarker = (lat: number, lng: number, pan = false) => {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          icon: createPinIcon(),
          draggable: !disabledRef.current,
        }).addTo(map);

        markerRef.current.on("dragend", () => {
          const pos = markerRef.current?.getLatLng();
          if (!pos) return;
<<<<<<< HEAD
          clearAccuracyCircle();
          clearApproximateMarker();
          setLocationMessage(null);
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
          onChangeRef.current({
            latitude: Number(pos.lat.toFixed(6)),
            longitude: Number(pos.lng.toFixed(6)),
          });
        });
      }

      if (pan) {
        map.panTo([lat, lng]);
      }
    };

    if (hasCoords(latitude, longitude)) {
      setMarker(latitude, longitude);
    }

    map.on("click", (event: L.LeafletMouseEvent) => {
      if (disabledRef.current) return;
      const { lat, lng } = event.latlng;
<<<<<<< HEAD
      clearAccuracyCircle();
      clearApproximateMarker();
      setLocationMessage(null);
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      setMarker(lat, lng);
      onChangeRef.current({
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
      });
    });

    mapRef.current = map;

    const resizeTimer = window.setTimeout(() => {
      map.invalidateSize();
    }, 80);

    return () => {
      window.clearTimeout(resizeTimer);
<<<<<<< HEAD
      accuracyCircleRef.current?.remove();
      approximateMarkerRef.current?.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      approximateMarkerRef.current = null;
      accuracyCircleRef.current = null;
=======
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    };
    // Mount once; later lat/lng sync handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !hasCoords(latitude, longitude)) return;

    const next: L.LatLngExpression = [latitude, longitude];
    if (markerRef.current) {
      markerRef.current.setLatLng(next);
      markerRef.current.dragging?.[disabled ? "disable" : "enable"]();
    } else {
      markerRef.current = L.marker(next, {
        icon: createPinIcon(),
        draggable: !disabled,
      }).addTo(map);

      markerRef.current.on("dragend", () => {
        const pos = markerRef.current?.getLatLng();
        if (!pos) return;
<<<<<<< HEAD
        clearAccuracyCircle();
        clearApproximateMarker();
        setLocationMessage(null);
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
        onChangeRef.current({
          latitude: Number(pos.lat.toFixed(6)),
          longitude: Number(pos.lng.toFixed(6)),
        });
      });
    }

    map.setView(next, map.getZoom(), { animate: false });
  }, [latitude, longitude, disabled]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const frameId = window.requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
    });
    const timeoutId = window.setTimeout(() => {
      map.invalidateSize({ pan: false });
    }, 120);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [hasError, disabled]);

  const handleUseMyLocation = () => {
<<<<<<< HEAD
    if (disabled || locating) return;
=======
    if (disabled) return;
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    if (!navigator.geolocation) {
      notify.error("مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.");
      return;
    }

<<<<<<< HEAD
    clearLocationWatch();
    setLocationMessage(null);
    const requestId = locationRequestIdRef.current + 1;
    locationRequestIdRef.current = requestId;
    let bestPosition: GeolocationPosition | null = null;

    const applyPosition = (position: GeolocationPosition) => {
      if (locationRequestIdRef.current !== requestId) return;

      clearLocationWatch();
      setLocating(false);

      const nextLat = Number(position.coords.latitude.toFixed(6));
      const nextLng = Number(position.coords.longitude.toFixed(6));
      const accuracy = Math.ceil(position.coords.accuracy);

      if (accuracy > LOCATION_ACCEPTED_ACCURACY_METERS) {
        const accuracyLabel = formatAccuracy(accuracy);
        const isTooBroad = accuracy > LOCATION_MAX_VISIBLE_ACCURACY_METERS;
        const map = mapRef.current;

        setApproximateMarker(nextLat, nextLng);

        if (isTooBroad) {
          clearAccuracyCircle();
          map?.setView([nextLat, nextLng], DEFAULT_ZOOM);
        } else {
          focusAccuracyCircle(nextLat, nextLng, accuracy);
        }

        const message = isTooBroad
          ? `دقت موقعیت فعلی حدود ${accuracyLabel} است و محدوده آن بیش از حد گسترده است. لطفاً GPS دستگاه را روشن کنید یا پین را دستی روی نقطه دقیق قرار دهید.`
          : `دقت موقعیت فعلی حدود ${accuracyLabel} است و برای ثبت آدرس کافی نیست. محدوده تقریبی روی نقشه مشخص شد؛ لطفاً پین را دستی روی نقطه دقیق قرار دهید.`;
        setLocationMessage(message);
        notify.warning(message);
        return;
      }

      clearAccuracyCircle();
      clearApproximateMarker();
      setLocationMessage(null);
      onChange({ latitude: nextLat, longitude: nextLng });

      const map = mapRef.current;
      if (map) {
        map.setView(
          [nextLat, nextLng],
          Math.max(map.getZoom(), CURRENT_LOCATION_ZOOM),
        );
      }
    };

    setLocating(true);

    locationWatchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        if (
          !bestPosition ||
          position.coords.accuracy < bestPosition.coords.accuracy
        ) {
          bestPosition = position;
        }

        if (position.coords.accuracy <= LOCATION_DESIRED_ACCURACY_METERS) {
          applyPosition(position);
        }
      },
      () => {
        if (locationRequestIdRef.current !== requestId) return;

        if (bestPosition) {
          applyPosition(bestPosition);
          return;
        }

        clearLocationWatch();
        setLocating(false);
        notify.error("دسترسی به موقعیت مکانی ممکن نشد.");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10_000 },
    );

    locationTimeoutIdRef.current = window.setTimeout(() => {
      if (bestPosition) {
        applyPosition(bestPosition);
        return;
      }

      clearLocationWatch();
      setLocating(false);
      setLocationMessage("دریافت موقعیت فعلی بیش از حد طول کشید.");
      notify.error("دریافت موقعیت فعلی بیش از حد طول کشید.");
    }, LOCATION_TIMEOUT_MS);
=======
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLat = Number(position.coords.latitude.toFixed(6));
        const nextLng = Number(position.coords.longitude.toFixed(6));
        onChange({ latitude: nextLat, longitude: nextLng });
        mapRef.current?.setView(
          [nextLat, nextLng],
          Math.max(mapRef.current.getZoom(), 15),
        );
      },
      () => {
        notify.error("دسترسی به موقعیت مکانی ممکن نشد.");
      },
      { enableHighAccuracy: true, timeout: 12_000 },
    );
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          روی نقشه کلیک کنید یا پین را جابه‌جا کنید
        </p>
        <button
          type="button"
          onClick={handleUseMyLocation}
<<<<<<< HEAD
          disabled={disabled || locating}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
        >
          <i className={`fa ${locating ? "fa-spinner fa-spin" : "fa-crosshairs"}`} />
          {locating ? "در حال دریافت موقعیت..." : "موقعیت فعلی من"}
        </button>
      </div>

      {locationMessage && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-6 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
          {locationMessage}
        </div>
      )}

=======
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
        >
          <i className="fa fa-crosshairs" />
          موقعیت فعلی من
        </button>
      </div>

>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      <div
        className={[
          "h-64 w-full overflow-hidden rounded-lg border z-0",
          hasError
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-600",
        ].join(" ")}
      >
        <div ref={containerRef} className="h-full w-full" />
      </div>

      {hasCoords(latitude, longitude) && (
        <p className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </p>
      )}
    </div>
  );
}
