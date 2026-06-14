// image-cropper/components/ImageCropper/CropArea.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Crop,
  CropImage,
  CropShape,
  AspectRatio,
  ImageDimensions,
} from "./types";
import {
  clamp,
  constrainCropToBounds,
  getImageBoundingBox,
} from "./utils/imageTransform";

interface CropAreaProps {
  activeImage: CropImage;
  crop: Crop;
  containerSize: ImageDimensions;
  shape: CropShape;
  aspectRatio: AspectRatio;
  onChange: (crop: Crop) => void;
  disabled?: boolean;
}

const MIN_CROP_SIZE = 20;

const HANDLES: Array<{
  position: "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
  style: string;
}> = [
  {
    position: "nw",
    style: "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize",
  },
  {
    position: "n",
    style: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-n-resize",
  },
  {
    position: "ne",
    style: "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize",
  },
  {
    position: "e",
    style: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-e-resize",
  },
  {
    position: "se",
    style: "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-se-resize",
  },
  {
    position: "s",
    style: "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-s-resize",
  },
  {
    position: "sw",
    style: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize",
  },
  {
    position: "w",
    style: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-w-resize",
  },
];

export function CropArea({
  activeImage,
  crop,
  containerSize,
  shape,
  aspectRatio,
  onChange,
  disabled = false,
}: CropAreaProps) {
  const regionRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startCropRef = useRef<Crop>(crop);
  const startPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const activeHandleRef = useRef<string | null>(null);

  const effectiveAspect = getEffectiveAspect(shape, aspectRatio);

  const bounds = {
    x: 0,
    y: 0,
    width: containerSize.width,
    height: containerSize.height,
  };

  const commitCrop = useCallback(
    (nextCrop: Crop) => {
      onChange(constrainCropToBounds(nextCrop, bounds, MIN_CROP_SIZE));
    },
    [bounds, onChange],
  );

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!isDragging || !activeHandleRef.current) return;
      const dx = event.clientX - startPointerRef.current.x;
      const dy = event.clientY - startPointerRef.current.y;
      const nextCrop = applyResizeOrDrag(
        startCropRef.current,
        activeHandleRef.current,
        dx,
        dy,
        bounds,
        effectiveAspect,
      );
      onChange(nextCrop);
    };

    const handleUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      activeHandleRef.current = null;
    };

    const handleKey = (event: KeyboardEvent) => {
      if (disabled) return;
      if (event.key === "Escape") {
        if (isDragging) {
          setIsDragging(false);
          activeHandleRef.current = null;
          onChange(startCropRef.current);
        }
        return;
      }
      const step = event.shiftKey ? 10 : 1;
      let dx = 0;
      let dy = 0;
      if (event.key === "ArrowLeft") dx = -step;
      else if (event.key === "ArrowRight") dx = step;
      else if (event.key === "ArrowUp") dy = -step;
      else if (event.key === "ArrowDown") dy = step;
      else return;

      event.preventDefault();
      commitCrop({ ...crop, x: crop.x + dx, y: crop.y + dy });
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("keydown", handleKey);
    };
  }, [
    isDragging,
    bounds,
    effectiveAspect,
    onChange,
    commitCrop,
    disabled,
    crop,
  ]);

  const startDrag = (event: React.PointerEvent, handle: string | null) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();

    event.currentTarget.setPointerCapture(event.pointerId);

    startCropRef.current = crop;
    startPointerRef.current = { x: event.clientX, y: event.clientY };
    activeHandleRef.current = handle;

    setIsDragging(true);
  };

  if (crop.width <= 0 || crop.height <= 0) return null;

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label="Crop area"
      tabIndex={0}
      className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      style={{ width: containerSize.width, height: containerSize.height }}
    >
      <div
        className="absolute border-2 border-white/90 bg-transparent shadow-sm"
        style={{
          left: crop.x,
          top: crop.y,
          width: crop.width,
          height: crop.height,
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
          startDrag(event, null);
        }}
      >
        {isGridVisible(crop) && (
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute left-1/3 top-0 h-full w-px bg-white" />
            <div className="absolute left-2/3 top-0 h-full w-px bg-white" />
            <div className="absolute left-0 top-1/3 h-px w-full bg-white" />
            <div className="absolute left-0 top-2/3 h-px w-full bg-white" />
          </div>
        )}

        {HANDLES.map(({ position, style }) => (
          <div
            key={position}
            role="button"
            aria-label={`Resize ${position}`}
            className={`absolute z-10 h-3 w-3 rounded-full border border-white bg-blue-500 hover:bg-blue-400 ${style}`}
            onPointerDown={(event) => startDrag(event, position)}
          />
        ))}
      </div>
    </div>
  );
}

function getEffectiveAspect(
  shape: CropShape,
  aspectRatio: AspectRatio,
): number | null {
  if (shape === "square") return 1;
  if (aspectRatio === "free") return null;
  if (aspectRatio === "square") return 1;
  return aspectRatio;
}

function isGridVisible(crop: Crop): boolean {
  return crop.width >= 60 && crop.height >= 60;
}

function applyResizeOrDrag(
  startCrop: Crop,
  handle: string | null,
  dx: number,
  dy: number,
  bounds: { x: number; y: number; width: number; height: number },
  aspect: number | null,
): Crop {
  if (!handle) {
    const next = { ...startCrop, x: startCrop.x + dx, y: startCrop.y + dy };
    return constrainCropToBounds(next, bounds, MIN_CROP_SIZE);
  }

  let { x, y, width, height } = startCrop;
  const minSize = MIN_CROP_SIZE;

  const applyEast = (delta: number) => {
    if (aspect !== null) {
      const newWidth = clamp(
        width + delta,
        minSize,
        bounds.x + bounds.width - x,
      );
      const newHeight = newWidth / aspect;
      const newY = y + (height - newHeight) / 2;
      width = newWidth;
      height = newHeight;
      y = newY;
    } else {
      width = clamp(width + delta, minSize, bounds.x + bounds.width - x);
    }
  };

  const applyWest = (delta: number) => {
    if (aspect !== null) {
      const newX = clamp(x + delta, bounds.x, x + width - minSize);
      const newWidth = width - (newX - x);
      const newHeight = newWidth / aspect;
      const newY = y + (height - newHeight) / 2;
      x = newX;
      width = newWidth;
      height = newHeight;
      y = newY;
    } else {
      const newX = clamp(x + delta, bounds.x, x + width - minSize);
      width = width - (newX - x);
      x = newX;
    }
  };

  const applySouth = (delta: number) => {
    if (aspect !== null) {
      const newHeight = clamp(
        height + delta,
        minSize,
        bounds.y + bounds.height - y,
      );
      const newWidth = newHeight * aspect;
      const newX = x + (width - newWidth) / 2;
      width = newWidth;
      height = newHeight;
      x = newX;
    } else {
      height = clamp(height + delta, minSize, bounds.y + bounds.height - y);
    }
  };

  const applyNorth = (delta: number) => {
    if (aspect !== null) {
      const newY = clamp(y + delta, bounds.y, y + height - minSize);
      const newHeight = height - (newY - y);
      const newWidth = newHeight * aspect;
      const newX = x + (width - newWidth) / 2;
      y = newY;
      height = newHeight;
      width = newWidth;
      x = newX;
    } else {
      const newY = clamp(y + delta, bounds.y, y + height - minSize);
      height = height - (newY - y);
      y = newY;
    }
  };

  switch (handle) {
    case "e":
      applyEast(dx);
      break;
    case "w":
      applyWest(dx);
      break;
    case "s":
      applySouth(dy);
      break;
    case "n":
      applyNorth(dy);
      break;
    case "se": {
      if (aspect !== null) {
        const driver = Math.abs(dx) > Math.abs(dy) ? dx : dy;
        const newWidth = clamp(
          width + driver,
          minSize,
          bounds.x + bounds.width - x,
        );
        height = clamp(
          newWidth / aspect,
          minSize,
          bounds.y + bounds.height - y,
        );
        width = height * aspect;
      } else {
        width = clamp(width + dx, minSize, bounds.x + bounds.width - x);
        height = clamp(height + dy, minSize, bounds.y + bounds.height - y);
      }
      break;
    }
    case "sw": {
      if (aspect !== null) {
        const driver = Math.abs(dx) > Math.abs(dy) ? -dx : dy;
        const newWidth = clamp(width + driver, minSize, width + x - bounds.x);
        height = clamp(
          newWidth / aspect,
          minSize,
          bounds.y + bounds.height - y,
        );
        width = height * aspect;
        x = x + (startCrop.width - width);
      } else {
        const newX = clamp(x + dx, bounds.x, x + width - minSize);
        width = width - (newX - x);
        x = newX;
        height = clamp(height + dy, minSize, bounds.y + bounds.height - y);
      }
      break;
    }
    case "ne": {
      if (aspect !== null) {
        const driver = Math.abs(dx) > Math.abs(dy) ? dx : -dy;
        const newWidth = clamp(
          width + driver,
          minSize,
          bounds.x + bounds.width - x,
        );
        height = clamp(
          newWidth / aspect,
          minSize,
          startCrop.y + startCrop.height - bounds.y,
        );
        width = height * aspect;
        y = y + (startCrop.height - height);
      } else {
        width = clamp(width + dx, minSize, bounds.x + bounds.width - x);
        const newY = clamp(y + dy, bounds.y, y + height - minSize);
        height = height - (newY - y);
        y = newY;
      }
      break;
    }
    case "nw": {
      if (aspect !== null) {
        const driver = Math.abs(dx) > Math.abs(dy) ? -dx : -dy;
        const newWidth = clamp(width + driver, minSize, width + x - bounds.x);
        height = clamp(
          newWidth / aspect,
          minSize,
          startCrop.y + startCrop.height - bounds.y,
        );
        width = height * aspect;
        x = x + (startCrop.width - width);
        y = y + (startCrop.height - height);
      } else {
        const newX = clamp(x + dx, bounds.x, x + width - minSize);
        width = width - (newX - x);
        x = newX;
        const newY = clamp(y + dy, bounds.y, y + height - minSize);
        height = height - (newY - y);
        y = newY;
      }
      break;
    }
  }

  return constrainCropToBounds({ x, y, width, height }, bounds, minSize);
}
