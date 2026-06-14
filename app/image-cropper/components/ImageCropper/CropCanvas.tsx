// image-cropper/components/image-cropper/CropCanvas.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { CropImage, Crop, ImageDimensions } from "./types";
import {
  applyCanvasTransform,
  computeBaseScale,
  getDisplayScale,
} from "./utils/imageTransform";

interface CropCanvasProps {
  activeImage: CropImage;
  crop: Crop;
  containerRef: React.RefObject<HTMLDivElement | null>;
  activeId: string | null;
  onPan: (dx: number, dy: number) => void;
}

export function CropCanvas({
  activeImage,
  crop,
  containerRef,
  activeId,
  onPan,
}: CropCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [size, setSize] = useState<ImageDimensions>({ width: 0, height: 0 });

  // --- FIX 2: state برای drag/pan تصویر ---
  const isPanningRef = useRef(false);
  const lastPanPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef]);

  // --- FIX 2: handler های pan روی canvas ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (!activeId) return;
      isPanningRef.current = true;
      lastPanPosRef.current = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPanningRef.current) return;
      const dx = e.clientX - lastPanPosRef.current.x;
      const dy = e.clientY - lastPanPosRef.current.y;
      lastPanPosRef.current = { x: e.clientX, y: e.clientY };
      onPan(dx, dy);
    };

    const handlePointerUp = () => {
      isPanningRef.current = false;
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [activeId, onPan]);

  useEffect(() => {
    let cancelled = false;
    const imgElement = new Image();
    imgElement.crossOrigin = "anonymous";
    imgElement.onload = () => {
      if (!cancelled) {
        imageRef.current = imgElement;
        draw();
      }
    };
    imgElement.src = activeImage.preview;

    return () => {
      cancelled = true;
      imgElement.onload = null;
    };
  }, [activeImage.preview]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, crop, activeImage.transform]);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = imageRef.current;
    if (!canvas || !ctx || !img || size.width === 0 || size.height === 0)
      return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, size.width, size.height);

    const baseScale = computeBaseScale(
      activeImage.naturalWidth,
      activeImage.naturalHeight,
      size.width,
      size.height,
    );
    const displayScale = getDisplayScale(baseScale, activeImage.transform.zoom);

    // --- FIX 2: offset برای pan تصویر ---
    const offsetX = activeImage.transform.offsetX ?? 0;
    const offsetY = activeImage.transform.offsetY ?? 0;

    const centerX = size.width / 2 + offsetX;
    const centerY = size.height / 2 + offsetY;
    const drawWidth = activeImage.naturalWidth * displayScale;
    const drawHeight = activeImage.naturalHeight * displayScale;

    ctx.save();
    applyCanvasTransform(
      ctx,
      centerX,
      centerY,
      activeImage.transform.rotation,
      activeImage.transform.flipX,
      activeImage.transform.flipY,
    );
    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    drawOverlay(ctx, crop, centerX, centerY, displayScale);
  };

  const drawOverlay = (
    ctx: CanvasRenderingContext2D,
    cropRect: Crop,
    centerX: number,
    centerY: number,
    displayScale: number,
  ) => {
    const { x, y, width, height } = cropRect;
    if (width <= 0 || height <= 0) return;

    // پس‌زمینه تیره روی همه چیز
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, size.width, size.height);

    // ناحیه کراپ را برش بزن
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    roundRectPath(ctx, x, y, width, height, 4);
    ctx.fill();
    ctx.restore();

    // --- FIX 1: رندر ناحیه کراپ ---
    // اول سفید پر می‌کنیم (برای فضای خارج از تصویر)
    ctx.save();
    ctx.beginPath();
    roundRectPath(ctx, x, y, width, height, 4);
    ctx.clip();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, width, height);

    // سپس تصویر رو روش رسم می‌کنیم
    applyCanvasTransform(
      ctx,
      centerX,
      centerY,
      activeImage.transform.rotation,
      activeImage.transform.flipX,
      activeImage.transform.flipY,
    );
    const drawWidth = activeImage.naturalWidth * displayScale;
    const drawHeight = activeImage.naturalHeight * displayScale;
    ctx.drawImage(
      imageRef.current!,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight,
    );
    ctx.restore();

    // border کراپ
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    roundRectPath(ctx, x, y, width, height, 4);
    ctx.stroke();
    ctx.restore();
  };

  const roundRectPath = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) => {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ cursor: "grab" }}
      aria-label="Image crop canvas"
    />
  );
}
