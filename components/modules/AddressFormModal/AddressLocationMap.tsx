"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { notify } from "@/src/utils/toast";

const DEFAULT_CENTER: L.LatLngExpression = [35.6892, 51.389];
const DEFAULT_ZOOM = 13;

function hasCoords(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0)
  );
}

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
  const onChangeRef = useRef(onChange);
  const disabledRef = useRef(disabled);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

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
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
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
        onChangeRef.current({
          latitude: Number(pos.lat.toFixed(6)),
          longitude: Number(pos.lng.toFixed(6)),
        });
      });
    }

    map.setView(next, map.getZoom(), { animate: false });
  }, [latitude, longitude, disabled]);

  const handleUseMyLocation = () => {
    if (disabled) return;
    if (!navigator.geolocation) {
      notify.error("مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.");
      return;
    }

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
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
        >
          <i className="fa fa-crosshairs" />
          موقعیت فعلی من
        </button>
      </div>

      <div
        ref={containerRef}
        className={[
          "h-64 w-full overflow-hidden rounded-lg border z-0",
          hasError
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-600",
        ].join(" ")}
      />

      {hasCoords(latitude, longitude) && (
        <p className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </p>
      )}
    </div>
  );
}
