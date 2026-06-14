// image-cropper/components/ImageCropper.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';

import { useImageCropper } from './hooks/useImageCropper';
import { CropCanvas } from './CropCanvas';
import { CropArea } from './CropArea';
import { Toolbar } from './Toolbar';
import { ImageList } from './ImageList';
import type { Crop, ImageCropperProps, ImageDimensions, ProcessedImage } from './types';
import {
  computeDefaultCrop,
  constrainCropToBounds,
  getImageBoundingBox,
} from './utils/imageTransform';
import { applyCropToImage, getProcessedImages } from './utils/cropImage';
import { cn } from '../../utils/cn';

export function ImageCropper(props: ImageCropperProps) {
  const {
    className,
    minZoom = 0.1,
    maxZoom = 3,
    zoomStep = 0.1,
    onCrop,
    onSave,
    onError,
    acceptedFormats,
  } = props;

  const {
    images,
    activeImage,
    activeId,
    isProcessing,
    cropShape,
    aspectRatio,
    setIsProcessing,
    addImages,
    removeImage,
    setActiveId,
    updateTransform,
    updateCrop,
    setCropForActive,
    resetImage,
    resetAll,
    setCropShape,
    setAspectRatio,
    updateActiveImage,
  } = useImageCropper(props);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [containerSize, setContainerSize] = useState<ImageDimensions>({ width: 0, height: 0 });
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // --- FIX 3: جلوگیری از اسکرول صفحه هنگام زوم ---
  // باید با addEventListener و passive: false ثبت بشه چون React به صورت پیش‌فرض passive می‌زنه
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelNative = (event: WheelEvent) => {
      if (!activeId) return;
      event.preventDefault();
      event.stopPropagation();
      const delta = event.deltaY > 0 ? -zoomStep : zoomStep;
      const currentZoom = activeImage?.transform.zoom ?? 1;
      const nextZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom + delta));
      updateTransform(activeId, { zoom: nextZoom });
    };

    container.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => container.removeEventListener('wheel', handleWheelNative);
  }, [activeId, activeImage?.transform.zoom, minZoom, maxZoom, zoomStep, updateTransform]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    if (!activeImage || containerSize.width === 0 || containerSize.height === 0) return;
    if (activeImage.crop.width > 0 && activeImage.crop.height > 0) return;

    const defaultCrop = computeDefaultCrop(
      containerSize.width,
      containerSize.height,
      activeImage.naturalWidth,
      activeImage.naturalHeight,
      activeImage.transform.zoom,
      activeImage.transform.rotation,
      cropShape,
      aspectRatio
    );
    setCropForActive(defaultCrop);
  }, [activeImage, containerSize, cropShape, aspectRatio, setCropForActive]);

  const clampZoom = useCallback(
    (value: number) => Math.max(minZoom, Math.min(maxZoom, value)),
    [minZoom, maxZoom]
  );

  const clampRotation = useCallback((value: number) => ((value % 360) + 360) % 360, []);

  const handleZoomIn = useCallback(() => {
    if (!activeId) return;
    updateTransform(activeId, { zoom: clampZoom((activeImage?.transform.zoom ?? 1) + zoomStep) });
  }, [activeId, activeImage?.transform.zoom, clampZoom, updateTransform, zoomStep]);

  const handleZoomOut = useCallback(() => {
    if (!activeId) return;
    updateTransform(activeId, { zoom: clampZoom((activeImage?.transform.zoom ?? 1) - zoomStep) });
  }, [activeId, activeImage?.transform.zoom, clampZoom, updateTransform, zoomStep]);

  const handleZoomChange = useCallback(
    (zoom: number) => {
      if (!activeId) return;
      updateTransform(activeId, { zoom: clampZoom(zoom) });
    },
    [activeId, clampZoom, updateTransform]
  );

  const handleRotateLeft = useCallback(() => {
    if (!activeId) return;
    updateTransform(activeId, { rotation: clampRotation((activeImage?.transform.rotation ?? 0) - 90) });
  }, [activeId, activeImage?.transform.rotation, clampRotation, updateTransform]);

  const handleRotateRight = useCallback(() => {
    if (!activeId) return;
    updateTransform(activeId, { rotation: clampRotation((activeImage?.transform.rotation ?? 0) + 90) });
  }, [activeId, activeImage?.transform.rotation, clampRotation, updateTransform]);

  const handleRotationChange = useCallback(
    (rotation: number) => {
      if (!activeId) return;
      updateTransform(activeId, { rotation: clampRotation(rotation) });
    },
    [activeId, clampRotation, updateTransform]
  );

  const handleFlipHorizontal = useCallback(() => {
    if (!activeId) return;
    updateTransform(activeId, { flipX: !(activeImage?.transform.flipX ?? false) });
  }, [activeId, activeImage?.transform.flipX, updateTransform]);

  const handleFlipVertical = useCallback(() => {
    if (!activeId) return;
    updateTransform(activeId, { flipY: !(activeImage?.transform.flipY ?? false) });
  }, [activeId, activeImage?.transform.flipY, updateTransform]);

  const handleResetImage = useCallback(() => {
    if (!activeId) return;
    resetImage(activeId);
  }, [activeId, resetImage]);

  const handleApplyCrop = useCallback(async () => {
    if (!activeImage || containerSize.width === 0) return;
    setIsProcessing(true);
    try {
      const updated = await applyCropToImage(activeImage, containerSize);
      updateActiveImage(updated);
      onCrop?.(updated);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsProcessing(false);
    }
  }, [activeImage, containerSize, onCrop, onError, setIsProcessing, updateActiveImage]);

  const handleSave = useCallback(async () => {
    if (images.length === 0 || containerSize.width === 0) return;
    setIsProcessing(true);
    try {
      const processed: ProcessedImage[] = await getProcessedImages(images, containerSize);
      onSave?.(processed);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsProcessing(false);
    }
  }, [images, containerSize, onSave, onError, setIsProcessing]);

  // --- FIX 1: کراپ می‌تونه از تصویر خارج بشه ---
  // constraint به bounds کانتینر (نه bounds تصویر) محدود می‌کنیم
  const handleCropChange = useCallback(
    (crop: Crop) => {
      if (!activeId || !activeImage) return;
      // فقط به مرزهای کانتینر محدود می‌کنیم، نه تصویر
      const containerBounds = {
        x: 0,
        y: 0,
        width: containerSize.width,
        height: containerSize.height,
      };
      updateCrop(activeId, constrainCropToBounds(crop, containerBounds, 20));
    },
    [activeId, activeImage, containerSize, updateCrop]
  );

  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();
      setIsDraggingOver(false);
      await addImages(event.dataTransfer.files);
    },
    [addImages]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(false);
  }, []);

  const openFilePicker = useCallback(() => fileInputRef.current?.click(), []);

  const handleFileInputChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      await addImages(event.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [addImages]
  );

  useEffect(() => {
    if (!activeImage || !activeId || containerSize.width === 0) return;
    const nextCrop = computeDefaultCrop(
      containerSize.width,
      containerSize.height,
      activeImage.naturalWidth,
      activeImage.naturalHeight,
      activeImage.transform.zoom,
      activeImage.transform.rotation,
      cropShape,
      aspectRatio
    );
    updateCrop(activeId, nextCrop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropShape, aspectRatio]);

  useEffect(() => {
    if (!activeImage || !activeId || containerSize.width === 0) return;
    const bounds = getImageBoundingBox(
      activeImage.naturalWidth,
      activeImage.naturalHeight,
      containerSize.width,
      containerSize.height,
      activeImage.transform.zoom,
      activeImage.transform.rotation
    );
    updateCrop(activeId, constrainCropToBounds(activeImage.crop, bounds, 20));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImage?.transform.zoom, activeImage?.transform.rotation]);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-100 shadow-2xl',
        className
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="order-2 flex-1 lg:order-1">
          <div
            ref={containerRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            // onWheel حذف شده - از useEffect با passive: false استفاده می‌کنیم
            className={cn(
              'relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors',
              isDraggingOver
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 bg-slate-950 hover:border-slate-500'
            )}
          >
            {activeImage ? (
              <>
                <CropCanvas
                  activeImage={activeImage}
                  crop={activeImage.crop}
                  containerRef={containerRef}
                  activeId={activeId}
                  onPan={(dx, dy) => {
                    // --- FIX 2: جابجایی تصویر با drag ---
                    if (!activeId || !activeImage) return;
                    const currentOffsetX = activeImage.transform.offsetX ?? 0;
                    const currentOffsetY = activeImage.transform.offsetY ?? 0;
                    updateTransform(activeId, {
                      offsetX: currentOffsetX + dx,
                      offsetY: currentOffsetY + dy,
                    });
                  }}
                />
                <CropArea
                  activeImage={activeImage}
                  crop={activeImage.crop}
                  containerSize={containerSize}
                  shape={cropShape}
                  aspectRatio={aspectRatio}
                  onChange={handleCropChange}
                  disabled={isProcessing}
                />
                <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                  {Math.round(activeImage.crop.width)} × {Math.round(activeImage.crop.height)} px
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={openFilePicker}
                className="flex flex-col items-center gap-2 text-slate-400 transition-colors hover:text-slate-200"
              >
                <Upload className="h-10 w-10" />
                <span className="text-sm font-medium">Drag & drop images here or click to upload</span>
                <span className="text-xs text-slate-500">JPG, PNG, WEBP up to 10MB</span>
              </button>
            )}
          </div>
        </div>

        <div className="order-1 w-full lg:order-2 lg:w-72">
          <ImageList
            images={images}
            activeId={activeId}
            onSelect={setActiveId}
            onRemove={removeImage}
            onAddClick={openFilePicker}
          />
        </div>
      </div>

      {activeImage && (
        <Toolbar
          transform={activeImage.transform}
          cropShape={cropShape}
          aspectRatio={aspectRatio}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomChange={handleZoomChange}
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          onRotationChange={handleRotationChange}
          onFlipHorizontal={handleFlipHorizontal}
          onFlipVertical={handleFlipVertical}
          onResetImage={handleResetImage}
          onResetAll={resetAll}
          onApplyCrop={handleApplyCrop}
          onSave={handleSave}
          onShapeChange={setCropShape}
          onAspectChange={setAspectRatio}
          isProcessing={isProcessing}
          minZoom={minZoom}
          maxZoom={maxZoom}
          zoomStep={zoomStep}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats?.join(',') ?? 'image/jpeg,image/png,image/webp'}
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />
    </div>
  );
}