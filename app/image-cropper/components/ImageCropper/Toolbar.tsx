// image-cropper/components/image-cropper/Toolbar.tsx
"use client";

import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Undo2,
  Trash2,
  Check,
  Save,
  Crop,
} from "lucide-react";
import type { CropImageTransform, CropShape, AspectRatio } from "./types";

interface ToolbarProps {
  transform: CropImageTransform;
  cropShape: CropShape;
  aspectRatio: AspectRatio;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomChange: (zoom: number) => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onRotationChange: (rotation: number) => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onResetImage: () => void;
  onResetAll: () => void;
  onApplyCrop: () => void;
  onSave: () => void;
  onShapeChange: (shape: CropShape) => void;
  onAspectChange: (ratio: AspectRatio) => void;
  isProcessing: boolean;
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

export function Toolbar({
  transform,
  cropShape,
  aspectRatio,
  onZoomIn,
  onZoomOut,
  onZoomChange,
  onRotateLeft,
  onRotateRight,
  onRotationChange,
  onFlipHorizontal,
  onFlipVertical,
  onResetImage,
  onResetAll,
  onApplyCrop,
  onSave,
  onShapeChange,
  onAspectChange,
  isProcessing,
  minZoom = 0.1,
  maxZoom = 3,
  zoomStep = 0.1,
}: ToolbarProps) {
  const zoomPercent = Math.round(transform.zoom * 100);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-700 bg-slate-800/80 p-4 text-slate-100 shadow-lg backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <ToolbarGroup label="Zoom" value={`${zoomPercent}%`}>
          <IconButton
            onClick={onZoomOut}
            ariaLabel="Zoom out"
            icon={<ZoomOut className="h-4 w-4" />}
          />
          <input
            type="range"
            min={minZoom}
            max={maxZoom}
            step={zoomStep}
            value={transform.zoom}
            onChange={(event) => onZoomChange(parseFloat(event.target.value))}
            aria-label="Zoom slider"
            className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-600 accent-blue-500"
          />
          <IconButton
            onClick={onZoomIn}
            ariaLabel="Zoom in"
            icon={<ZoomIn className="h-4 w-4" />}
          />
        </ToolbarGroup>

        <ToolbarGroup
          label="Rotation"
          value={`${Math.round(transform.rotation)}°`}
        >
          <IconButton
            onClick={onRotateLeft}
            ariaLabel="Rotate left"
            icon={<RotateCcw className="h-4 w-4" />}
          />
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={transform.rotation}
            onChange={(event) =>
              onRotationChange(parseFloat(event.target.value))
            }
            aria-label="Rotation slider"
            className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-600 accent-blue-500"
          />
          <IconButton
            onClick={onRotateRight}
            ariaLabel="Rotate right"
            icon={<RotateCw className="h-4 w-4" />}
          />
        </ToolbarGroup>

        <ToolbarGroup
          label="Flip"
          value={transform.flipX || transform.flipY ? "On" : "Off"}
        >
          <IconButton
            onClick={onFlipHorizontal}
            ariaLabel="Flip horizontal"
            icon={<FlipHorizontal className="h-4 w-4" />}
            active={transform.flipX}
          />
          <IconButton
            onClick={onFlipVertical}
            ariaLabel="Flip vertical"
            icon={<FlipVertical className="h-4 w-4" />}
            active={transform.flipY}
          />
        </ToolbarGroup>

        <ToolbarGroup
          label="Crop shape"
          value={`${cropShape === "square" ? "Square" : "Rect"} · ${aspectRatio === "free" ? "Free" : aspectRatio === "square" ? "1:1" : String(aspectRatio)}`}
        >
          <select
            value={cropShape}
            onChange={(event) => onShapeChange(event.target.value as CropShape)}
            aria-label="Crop shape"
            className="rounded-md border border-slate-600 bg-slate-700 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rectangle">Rectangle</option>
            <option value="square">Square</option>
          </select>

          <select
            value={String(aspectRatio)}
            onChange={(event) => {
              const value = event.target.value;
              onAspectChange(
                value === "free"
                  ? "free"
                  : value === "square"
                    ? "square"
                    : parseFloat(value),
              );
            }}
            aria-label="Aspect ratio"
            className="rounded-md border border-slate-600 bg-slate-700 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="free">Free ratio</option>
            <option value="square">1:1</option>
            <option value="1.333333">4:3</option>
            <option value="1.777778">16:9</option>
            <option value="0.666667">3:4</option>
            <option value="0.5625">9:16</option>
          </select>
        </ToolbarGroup>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-700 pt-3">
        <ToolbarButton
          onClick={onResetImage}
          variant="secondary"
          icon={<Undo2 className="h-4 w-4" />}
        >
          Reset image
        </ToolbarButton>
        <ToolbarButton
          onClick={onResetAll}
          variant="secondary"
          icon={<Trash2 className="h-4 w-4" />}
        >
          Reset all
        </ToolbarButton>
        <ToolbarButton
          onClick={onApplyCrop}
          variant="secondary"
          icon={<Crop className="h-4 w-4" />}
        >
          Apply crop
        </ToolbarButton>
        <ToolbarButton
          onClick={onSave}
          variant="primary"
          isLoading={isProcessing}
          icon={<Save className="h-4 w-4" />}
        >
          {isProcessing ? "Processing..." : "Save all"}
        </ToolbarButton>
      </div>
    </div>
  );
}

interface ToolbarGroupProps {
  label: string;
  value: string;
  children: React.ReactNode;
}

function ToolbarGroup({ label, value, children }: ToolbarGroupProps) {
  return (
    <div className="flex flex-col gap-2 rounded-md bg-slate-900/50 p-3">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-400">
        <span>{label}</span>
        <span className="text-slate-200">{value}</span>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

interface IconButtonProps {
  onClick: () => void;
  ariaLabel: string;
  icon: React.ReactNode;
  active?: boolean;
}

function IconButton({ onClick, ariaLabel, icon, active }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        flex h-8 w-8 items-center justify-center rounded-md border transition-colors
        ${active ? "border-blue-500 bg-blue-500/20 text-blue-300" : "border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"}
      `}
    >
      {icon}
    </button>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  isLoading?: boolean;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  variant = "primary",
  icon,
  isLoading,
  children,
}: ToolbarButtonProps) {
  const isPrimary = variant === "primary";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors
        ${
          isPrimary
            ? "bg-blue-600 text-white hover:bg-blue-500 disabled:bg-blue-800"
            : "border border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"
        }
      `}
    >
      {isLoading ? <Check className="h-4 w-4 animate-pulse" /> : icon}
      {children}
    </button>
  );
}
