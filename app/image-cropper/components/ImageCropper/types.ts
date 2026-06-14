// image-cropper/components/image-cropper/types.ts
'use client';

export interface CropImageTransform {
  zoom: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
}

export interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropImage {
  id: string;
  file: File;
  preview: string;
  naturalWidth: number;
  naturalHeight: number;
  transform: CropImageTransform;
  crop: Crop;
  croppedFile?: File;
  croppedUrl?: string;
}

export interface ProcessedImage {
  id: string;
  originalFile: File;
  croppedFile: File;
  blob: Blob;
  previewUrl: string;
  metadata: {
    width: number;
    height: number;
    rotation: number;
    flipX: boolean;
    flipY: boolean;
  };
}

export type CropShape = 'rectangle' | 'square';

export type AspectRatio = 'free' | 'square' | number;

export interface ImageCropperProps {
  images?: CropImage[];
  defaultImages?: CropImage[];
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFormats?: string[];
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
  className?: string;
  onChange?: (images: CropImage[]) => void;
  onCrop?: (image: CropImage) => void;
  onSave?: (images: ProcessedImage[]) => void;
  onDelete?: (imageId: string) => void;
  onError?: (error: Error) => void;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface CropHandle {
  position: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
  cursor: string;
}
