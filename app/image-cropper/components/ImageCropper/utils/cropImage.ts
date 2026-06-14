// image-cropper/components/image-cropper/utils/cropImage.ts
'use client';

import type { CropImage, ImageDimensions, ProcessedImage } from '../types';
import {
  computeBaseScale,
  getDisplayScale,
  getTransformedImageBounds,
  loadImage,
  applyCanvasTransform,
  revokeImagePreview,
} from './imageTransform';

export async function processImage(
  image: CropImage,
  containerSize: ImageDimensions
): Promise<ProcessedImage> {
  const img = await loadImage(image.preview);

  const { naturalWidth, naturalHeight } = image;
  const { zoom, rotation, flipX, flipY } = image.transform;
  const baseScale = computeBaseScale(
    naturalWidth,
    naturalHeight,
    containerSize.width,
    containerSize.height
  );
  const displayScale = getDisplayScale(baseScale, zoom);

  const processScale = 1;
  const bounds = getTransformedImageBounds(naturalWidth, naturalHeight, processScale, rotation);

  const processCanvas = document.createElement('canvas');
  processCanvas.width = Math.max(1, Math.ceil(bounds.width));
  processCanvas.height = Math.max(1, Math.ceil(bounds.height));
  const processCtx = processCanvas.getContext('2d');
  if (!processCtx) {
    throw new Error('Unable to create 2D context for image processing');
  }

  const centerX = processCanvas.width / 2;
  const centerY = processCanvas.height / 2;

  processCtx.save();
  applyCanvasTransform(processCtx, centerX, centerY, rotation, flipX, flipY);
  processCtx.drawImage(
    img,
    -naturalWidth / 2,
    -naturalHeight / 2,
    naturalWidth,
    naturalHeight
  );
  processCtx.restore();

  const containerCenterX = containerSize.width / 2;
  const containerCenterY = containerSize.height / 2;

  const processCrop = {
    x: centerX + (image.crop.x - containerCenterX) / displayScale,
    y: centerY + (image.crop.y - containerCenterY) / displayScale,
    width: image.crop.width / displayScale,
    height: image.crop.height / displayScale,
  };

  const outputWidth = Math.max(1, Math.round(processCrop.width));
  const outputHeight = Math.max(1, Math.round(processCrop.height));

  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = outputWidth;
  outputCanvas.height = outputHeight;
  const outputCtx = outputCanvas.getContext('2d');
  if (!outputCtx) {
    throw new Error('Unable to create output 2D context');
  }

  outputCtx.drawImage(
    processCanvas,
    processCrop.x,
    processCrop.y,
    processCrop.width,
    processCrop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  const mimeType = image.file.type || 'image/png';
  const blob = await canvasToBlob(outputCanvas, mimeType, 0.92);
  const croppedFile = new File([blob], image.file.name, { type: mimeType });
  const previewUrl = URL.createObjectURL(blob);

  return {
    id: image.id,
    originalFile: image.file,
    croppedFile,
    blob,
    previewUrl,
    metadata: {
      width: outputWidth,
      height: outputHeight,
      rotation,
      flipX,
      flipY,
    },
  };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob returned null'));
      },
      type,
      quality
    );
  });
}

export async function applyCropToImage(
  image: CropImage,
  containerSize: ImageDimensions
): Promise<CropImage> {
  const processed = await processImage(image, containerSize);
  if (image.croppedUrl) {
    revokeImagePreview(image.croppedUrl);
  }
  return {
    ...image,
    croppedFile: processed.croppedFile,
    croppedUrl: processed.previewUrl,
  };
}

export async function getProcessedImages(
  images: CropImage[],
  containerSize: ImageDimensions
): Promise<ProcessedImage[]> {
  return Promise.all(images.map((image) => processImage(image, containerSize)));
}
