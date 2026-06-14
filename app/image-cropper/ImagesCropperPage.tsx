"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";

// ─── Types ───────────────────────────────────────────────────────────────────

type AspectOption = {
  label: string;
  value: number | null; // null = free
};

type UploadStatus = "idle" | "uploading" | "success" | "error";

type CropImage = {
  id: string;
  file: File;
  preview: string;
  cropPixels: CroppedAreaPixels | null;
  croppedBlob: Blob | null;
  croppedUrl: string | null;
  crop: { x: number; y: number };
  zoom: number;
  rotation: number;
  uploadStatus: UploadStatus;
  uploadError?: string;
};

type CroppedAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const ASPECT_OPTIONS: AspectOption[] = [
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:4", value: 3 / 4 },
  { label: "16:9", value: 16 / 9 },
  { label: "9:16", value: 9 / 16 },
  { label: "آزاد", value: null },
];

// ─── Crop Utility ─────────────────────────────────────────────────────────────

async function getCroppedBlob(
  imageSrc: string,
  cropPixels: CroppedAreaPixels,
  rotation: number,
  outputWidth?: number,
  outputHeight?: number,
): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const finalW =
    outputWidth && outputWidth > 0 ? outputWidth : cropPixels.width;
  const finalH =
    outputHeight && outputHeight > 0 ? outputHeight : cropPixels.height;

  const canvas = document.createElement("canvas");
  canvas.width = finalW;
  canvas.height = finalH;
  const ctx = canvas.getContext("2d")!;

  // White background (for areas outside image)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, finalW, finalH);

  // Apply rotation around crop center
  ctx.save();
  ctx.translate(finalW / 2, finalH / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-finalW / 2, -finalH / 2);

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    finalW,
    finalH,
  );

  ctx.restore();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Canvas toBlob failed")),
      "image/jpeg",
      0.92,
    );
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────

type ImageCropperProps = {
  /** آدرس API برای آپلود فایل‌ها */
  uploadUrl?: string;
  /** هدرهای اضافه برای درخواست API */
  uploadHeaders?: Record<string, string>;
  /** نام فیلد فایل در FormData */
  uploadFieldName?: string;
  /** callback بعد از ذخیره موفق */
  onSaveSuccess?: (results: { id: string; url?: string }[]) => void;
  classWH: string;
};

export default function ImagesCropper({
  uploadUrl,
  uploadHeaders = {},
  uploadFieldName = "file",
  onSaveSuccess,
  classWH,
}: ImageCropperProps) {
  const [images, setImages] = useState<CropImage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [aspect, setAspect] = useState<number | null>(1);
  const [outputWidth, setOutputWidth] = useState<string>("");
  const [outputHeight, setOutputHeight] = useState<string>("");
  const [currentCropPixels, setCurrentCropPixels] =
    useState<CroppedAreaPixels | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFree = aspect === null;

  const activeImage = images[activeIndex] ?? null;

  // ── File Selection ──────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const mapped: CropImage[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      cropPixels: null,
      croppedBlob: null,
      croppedUrl: null,
      crop: { x: 0, y: 0 },
      zoom: 1,
      rotation: 0,
      uploadStatus: "idle" as UploadStatus,
    }));

    setImages((prev) => [...prev, ...mapped]);
    setActiveIndex(images.length); // jump to first new image
  };

  // ── Crop Handlers ───────────────────────────────────────────────────────────

  const handleCropChange = useCallback(
    (crop: { x: number; y: number }) => {
      setImages((prev) => {
        const updated = [...prev];
        if (updated[activeIndex])
          updated[activeIndex] = { ...updated[activeIndex], crop };
        return updated;
      });
    },
    [activeIndex],
  );

  const handleZoomChange = useCallback(
    (zoom: number) => {
      setImages((prev) => {
        const updated = [...prev];
        if (updated[activeIndex])
          updated[activeIndex] = { ...updated[activeIndex], zoom };
        return updated;
      });
    },
    [activeIndex],
  );

  const handleRotationChange = useCallback(
    (rotation: number) => {
      setImages((prev) => {
        const updated = [...prev];
        if (updated[activeIndex])
          updated[activeIndex] = { ...updated[activeIndex], rotation };
        return updated;
      });
    },
    [activeIndex],
  );

  const onCropComplete = useCallback(
    (_: unknown, croppedAreaPixels: CroppedAreaPixels) => {
      setCurrentCropPixels(croppedAreaPixels);
    },
    [],
  );

  // ── Upload a single blob to API ───────────────────────────────────────────────

  const uploadBlob = async (
    imgIndex: number,
    blob: Blob,
    fileName: string,
  ): Promise<{ id: string; url?: string }> => {
    if (!uploadUrl) throw new Error("uploadUrl is not set");

    // mark as uploading
    setImages((prev) => {
      const u = [...prev];
      u[imgIndex] = { ...u[imgIndex], uploadStatus: "uploading" };
      return u;
    });

    try {
      const formData = new FormData();
      formData.append(uploadFieldName, blob, `cropped_${fileName}`);

      console.log("ارسال فایل:", `cropped_${fileName}`, "size:", blob.size);

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: uploadHeaders,
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json().catch(() => ({}));
      const serverUrl = json?.url ?? json?.data?.url;

      setImages((prev) => {
        const u = [...prev];
        u[imgIndex] = { ...u[imgIndex], uploadStatus: "success" };
        return u;
      });

      return { id: images[imgIndex]?.id ?? "", url: serverUrl };
    } catch (err: any) {
      setImages((prev) => {
        const u = [...prev];
        u[imgIndex] = {
          ...u[imgIndex],
          uploadStatus: "error",
          uploadError: err.message,
        };
        return u;
      });
      throw err;
    }
  };

  // ── Save Crop for Active Image (then auto-upload if uploadUrl set) ────────────

  const saveCrop = async () => {
    if (!activeImage || !currentCropPixels) return;
    setIsSaving(true);
    try {
      const blob = await getCroppedBlob(
        activeImage.preview,
        currentCropPixels,
        activeImage.rotation,
        outputWidth ? Number(outputWidth) : undefined,
        outputHeight ? Number(outputHeight) : undefined,
      );
      const url = URL.createObjectURL(blob);

      setImages((prev) => {
        const updated = [...prev];
        updated[activeIndex] = {
          ...updated[activeIndex],
          cropPixels: currentCropPixels,
          croppedBlob: blob,
          croppedUrl: url,
          uploadStatus: "idle",
        };
        return updated;
      });

      if (uploadUrl) {
        const result = await uploadBlob(
          activeIndex,
          blob,
          activeImage.file.name,
        );
        onSaveSuccess?.([result]);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ── Apply Same Crop to All Images (then auto-upload each) ────────────────────

  const saveCropToAll = async () => {
    if (!currentCropPixels) return;
    setIsSaving(true);
    const results: { id: string; url?: string }[] = [];
    try {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const blob = await getCroppedBlob(
          img.preview,
          currentCropPixels,
          img.rotation,
          outputWidth ? Number(outputWidth) : undefined,
          outputHeight ? Number(outputHeight) : undefined,
        );
        const url = URL.createObjectURL(blob);

        setImages((prev) => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            cropPixels: currentCropPixels,
            croppedBlob: blob,
            croppedUrl: url,
            uploadStatus: "idle",
          };
          return updated;
        });

        if (uploadUrl) {
          const result = await uploadBlob(i, blob, img.file.name);
          results.push(result);
        }
      }

      if (results.length) onSaveSuccess?.(results);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete Image ──────────────────────────────────────────────────────────────

  const deleteImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      if (updated[index].croppedUrl)
        URL.revokeObjectURL(updated[index].croppedUrl!);
      updated.splice(index, 1);
      return updated;
    });
    setActiveIndex((p) => Math.max(0, Math.min(p, images.length - 2)));
  };

  useEffect(() => {
    if (aspect === null) return;

    const width = Number(outputWidth);
    const height = Number(outputHeight);

    if (!width || !height) return;

    const newHeight = Math.round(width / aspect);
    setOutputHeight(String(newHeight));
  }, [aspect]);

  return (
    <div className={`flex flex-col gap-4 p-4 ${classWH}`} dir="rtl">
      {/* ─── Toolbar ─── */}
      <div className="flex flex-wrap items-end gap-3 p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* File Input */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            انتخاب تصویر
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-56 text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white file:cursor-pointer hover:file:bg-blue-700 cursor-pointer"
          />
        </div>

        {/* Aspect Ratio */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            نسبت تصویر
          </label>
          <select
            className="rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={aspect === null ? "null" : String(aspect)}
            onChange={(e) =>
              setAspect(
                e.target.value === "null" ? null : Number(e.target.value),
              )
            }
          >
            {ASPECT_OPTIONS.map((opt) => (
              <option
                key={opt.label}
                value={opt.value === null ? "null" : String(opt.value)}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Output Width */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            عرض خروجی (px)
          </label>
          <input
            type="number"
            placeholder="اختیاری"
            value={outputWidth}
            disabled={!isFree}
            onChange={(e) => setOutputWidth(e.target.value)}
            className="w-28 rounded-lg border border-gray-300 p-2 text-center text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Output Height */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            ارتفاع خروجی (px)
          </label>
          <input
            type="number"
            placeholder="اختیاری"
            value={outputHeight}
            disabled={!isFree}
            onChange={(e) => setOutputHeight(e.target.value)}
            className="w-28 rounded-lg border border-gray-300 p-2 text-center text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Zoom Slider */}
        {activeImage && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              زوم: {activeImage.zoom.toFixed(1)}×
            </label>
            <input
              type="number"
              min={0.5}
              max={5}
              step={0.05}
              value={activeImage.zoom}
              onChange={(e) => handleZoomChange(Number(e.target.value))}
              className="w-28 rounded-lg border border-gray-300 p-2 text-center text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        )}

        {/* Rotation Slider */}
        {activeImage && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              چرخش: {activeImage.rotation}°
            </label>
            <input
              type="number"
              min={-180}
              max={180}
              step={1}
              value={activeImage.rotation}
              onChange={(e) => handleRotationChange(Number(e.target.value))}
              className="w-28 rounded-lg border border-gray-300 p-2 text-center text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        )}

        <div className="text-sm text-gray-500">
          خروجی قفل شده روی نسبت {aspect}
        </div>
      </div>

      {/* ─── Cropper Area ─── */}
      {activeImage ? (
        <div
          className={`relative rounded-xl overflow-hidden border border-gray-200 bg-gray-900 w-full h-full`}
        >
          <Cropper
            image={activeImage.preview}
            crop={activeImage.crop}
            zoom={activeImage.zoom}
            rotation={activeImage.rotation}
            cropSize={
              outputWidth && outputHeight
                ? {
                    width: Number(outputWidth),
                    height: Number(outputHeight),
                  }
                : undefined
            }
            aspect={aspect ?? undefined}
            onCropChange={handleCropChange}
            onZoomChange={handleZoomChange}
            onRotationChange={handleRotationChange}
            onCropComplete={onCropComplete}
            restrictPosition={false}
            cropShape="rect"
            showGrid
          />
        </div>
      ) : (
        <div
          className="flex items-center justify-center w-full h-[500px] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center">
            <p className="text-gray-500 text-lg">تصویری انتخاب نشده</p>
            <p className="text-gray-400 text-sm mt-1">
              برای انتخاب تصویر کلیک کنید
            </p>
          </div>
        </div>
      )}

      {/* ─── Action Buttons ─── */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={saveCrop}
            disabled={isSaving || !currentCropPixels}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSaving
              ? "در حال پردازش..."
              : uploadUrl
                ? "کراپ و ارسال این تصویر"
                : "ذخیره کراپ این تصویر"}
          </button>

          <button
            onClick={saveCropToAll}
            disabled={isSaving || !currentCropPixels || images.length < 2}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {uploadUrl ? "کراپ و ارسال همه تصاویر" : "اعمال روی همه تصاویر"}
          </button>

          {/* Summary */}
          {uploadUrl && (
            <span className="text-xs text-gray-500">
              {images.filter((i) => i.uploadStatus === "success").length}/
              {images.length} آپلود شده
            </span>
          )}
        </div>
      )}

      {/* ─── Image Thumbnails ─── */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, index) => (
            <div
              key={img.id}
              className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? "border-blue-500 shadow-md"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              style={{ width: 100, height: 100 }}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={img.croppedUrl ?? img.preview}
                alt={img.file.name}
                className="w-full h-full object-cover"
              />

              {/* Status badge */}
              <span
                className={`absolute top-1 right-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  img.uploadStatus === "success"
                    ? "bg-green-500 text-white"
                    : img.uploadStatus === "uploading"
                      ? "bg-yellow-400 text-yellow-900"
                      : img.uploadStatus === "error"
                        ? "bg-red-500 text-white"
                        : img.croppedUrl
                          ? "bg-blue-500 text-white"
                          : "bg-gray-800/70 text-gray-200"
                }`}
                title={img.uploadError}
              >
                {img.uploadStatus === "success"
                  ? "✓"
                  : img.uploadStatus === "uploading"
                    ? "..."
                    : img.uploadStatus === "error"
                      ? "!"
                      : img.croppedUrl
                        ? "کراپ"
                        : "—"}
              </span>

              {/* Delete button */}
              <button
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs hidden group-hover:flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteImage(index);
                }}
              >
                ×
              </button>

              {/* Image name */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5">
                <p className="text-white text-[10px] truncate">
                  {img.file.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
