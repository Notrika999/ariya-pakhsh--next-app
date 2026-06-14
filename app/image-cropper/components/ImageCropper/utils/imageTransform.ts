// image-cropper/components/image-cropper/utils/imageTransform.ts
"use client";

import type { Crop, CropShape, AspectRatio, ImageDimensions } from "../types";

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export async function readImageFile(file: File): Promise<{
  preview: string;
  naturalWidth: number;
  naturalHeight: number;
}> {
  const preview = URL.createObjectURL(file);
  const img = await loadImage(preview);
  return {
    preview,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
  };
}

export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

export function revokeImagePreview(url: string | undefined): void {
  if (url) URL.revokeObjectURL(url);
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function computeBaseScale(
  naturalWidth: number,
  naturalHeight: number,
  containerWidth: number,
  containerHeight: number,
): number {
  if (
    naturalWidth === 0 ||
    naturalHeight === 0 ||
    containerWidth === 0 ||
    containerHeight === 0
  ) {
    return 1;
  }
  return Math.min(
    containerWidth / naturalWidth,
    containerHeight / naturalHeight,
  );
}

export function getDisplayScale(baseScale: number, zoom: number): number {
  return baseScale * zoom;
}

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function getTransformedImageBounds(
  naturalWidth: number,
  naturalHeight: number,
  displayScale: number,
  rotationDegrees: number,
): ImageDimensions {
  const rad = toRadians(rotationDegrees);
  const absCos = Math.abs(Math.cos(rad));
  const absSin = Math.abs(Math.sin(rad));
  const width = displayScale * (naturalWidth * absCos + naturalHeight * absSin);
  const height =
    displayScale * (naturalWidth * absSin + naturalHeight * absCos);
  return { width, height };
}

export function getImageBoundingBox(
  naturalWidth: number,
  naturalHeight: number,
  containerWidth: number,
  containerHeight: number,
  zoom: number,
  rotationDegrees: number,
): { x: number; y: number; width: number; height: number } {
  const baseScale = computeBaseScale(
    naturalWidth,
    naturalHeight,
    containerWidth,
    containerHeight,
  );
  const displayScale = getDisplayScale(baseScale, zoom);
  const bounds = getTransformedImageBounds(
    naturalWidth,
    naturalHeight,
    displayScale,
    rotationDegrees,
  );
  return {
    x: containerWidth / 2 - bounds.width / 2,
    y: containerHeight / 2 - bounds.height / 2,
    width: bounds.width,
    height: bounds.height,
  };
}

export function applyCanvasTransform(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  rotationDegrees: number,
  flipX: boolean,
  flipY: boolean,
): void {
  ctx.translate(centerX, centerY);
  ctx.rotate(toRadians(rotationDegrees));
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
}

function effectiveAspectRatio(
  shape: CropShape,
  aspectRatio: AspectRatio,
): number | null {
  if (shape === "square") return 1;
  if (aspectRatio === "free") return null;
  if (aspectRatio === "square") return 1;
  return aspectRatio;
}

export function computeDefaultCrop(
  containerWidth: number,
  containerHeight: number,
  naturalWidth: number,
  naturalHeight: number,
  zoom: number,
  rotationDegrees: number,
  shape: CropShape,
  aspectRatio: AspectRatio,
): Crop {
  const bbox = getImageBoundingBox(
    naturalWidth,
    naturalHeight,
    containerWidth,
    containerHeight,
    zoom,
    rotationDegrees,
  );

  const maxWidth = bbox.width * 0.8;
  const maxHeight = bbox.height * 0.8;
  const aspect = effectiveAspectRatio(shape, aspectRatio);

  let width = maxWidth;
  let height = maxHeight;

  if (aspect !== null) {
    if (width / height > aspect) {
      width = height * aspect;
    } else {
      height = width / aspect;
    }
  }

  return {
    x: bbox.x + (bbox.width - width) / 2,
    y: bbox.y + (bbox.height - height) / 2,
    width,
    height,
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function constrainCropToBounds(
  crop: Crop,
  bounds: { x: number; y: number; width: number; height: number },
  minSize = 20,
): Crop {
  let x = clamp(crop.x, bounds.x, bounds.x + bounds.width - minSize);
  let y = clamp(crop.y, bounds.y, bounds.y + bounds.height - minSize);
  let width = clamp(crop.width, minSize, bounds.x + bounds.width - x);
  let height = clamp(crop.height, minSize, bounds.y + bounds.height - y);

  if (x + width > bounds.x + bounds.width) width = bounds.x + bounds.width - x;
  if (y + height > bounds.y + bounds.height)
    height = bounds.y + bounds.height - y;

  return { x, y, width, height };
}

export function isSupportedImage(
  file: File,
  acceptedFormats: string[],
): boolean {
  if (acceptedFormats.includes(file.type)) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext) return false;
  const mimeMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };
  return acceptedFormats.includes(mimeMap[ext] ?? "");
}
