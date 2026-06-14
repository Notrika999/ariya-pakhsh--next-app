// image-cropper/components/image-cropper/hooks/useImageCropper.ts
'use client';

import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import type {
  Crop,
  CropImage,
  CropImageTransform,
  CropShape,
  AspectRatio,
  ImageCropperProps,
} from '../types';
import { generateId, isSupportedImage, readImageFile, revokeImagePreview } from '../utils/imageTransform';

const DEFAULT_ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface UseImageCropperReturn {
  images: CropImage[];
  activeImage: CropImage | undefined;
  activeId: string | null;
  isProcessing: boolean;
  cropShape: CropShape;
  aspectRatio: AspectRatio;
  setIsProcessing: (value: boolean) => void;
  addImages: (files: FileList | File[] | null) => Promise<void>;
  removeImage: (id: string) => void;
  setActiveId: (id: string | null) => void;
  updateTransform: (id: string, transform: Partial<CropImageTransform>) => void;
  updateCrop: (id: string, crop: Partial<Crop>) => void;
  setCropForActive: (crop: Crop) => void;
  resetImage: (id: string) => void;
  resetAll: () => void;
  setCropShape: (shape: CropShape) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  updateActiveImage: (image: CropImage) => void;
}

export function useImageCropper(props: ImageCropperProps): UseImageCropperReturn {
  const {
    images: controlledImages,
    defaultImages,
    maxFiles,
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
    onChange,
    onDelete,
    onError,
  } = props;

  const isControlled = controlledImages !== undefined;
  const [internalImages, setInternalImages] = useState<CropImage[]>(defaultImages ?? []);
  const images = isControlled ? controlledImages! : internalImages;

  const imagesRef = useRef<CropImage[]>(images);
  imagesRef.current = images;

  const setImages = useCallback(
    (updater: CropImage[] | ((prev: CropImage[]) => CropImage[])) => {
      if (!isControlled) {
        setInternalImages((prev) => {
          const next = typeof updater === 'function' ? updater(prev) : updater;
          onChange?.(next);
          return next;
        });
      } else {
        const next = typeof updater === 'function' ? updater(images) : updater;
        onChange?.(next);
      }
    },
    [isControlled, images, onChange]
  );

  const [activeId, setActiveIdState] = useState<string | null>(images[0]?.id ?? null);
  const [cropShape, setCropShape] = useState<CropShape>('rectangle');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('free');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (images.length > 0 && !images.some((image) => image.id === activeId)) {
      setActiveIdState(images[0].id);
    } else if (images.length === 0) {
      setActiveIdState(null);
    }
  }, [images, activeId]);

  const activeImage = useMemo(
    () => images.find((image) => image.id === activeId),
    [images, activeId]
  );

  const setActiveId = useCallback((id: string | null) => {
    setActiveIdState(id);
  }, []);

  const revokeOnRemoval = useCallback((image: CropImage) => {
    revokeImagePreview(image.preview);
    if (image.croppedUrl) revokeImagePreview(image.croppedUrl);
  }, []);

  const addImages = useCallback(
    async (files: FileList | File[] | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      if (maxFiles !== undefined && images.length + fileArray.length > maxFiles) {
        onError?.(new Error(`Maximum of ${maxFiles} images allowed`));
        return;
      }

      const validFiles: File[] = [];
      for (const file of fileArray) {
        if (!isSupportedImage(file, acceptedFormats)) {
          onError?.(new Error(`Unsupported file type: ${file.name}`));
          continue;
        }
        if (file.size > maxFileSize) {
          onError?.(new Error(`File too large: ${file.name}`));
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      try {
        const newImages = await Promise.all(
          validFiles.map(async (file) => {
            const { preview, naturalWidth, naturalHeight } = await readImageFile(file);
            return {
              id: generateId(),
              file,
              preview,
              naturalWidth,
              naturalHeight,
              transform: {
                zoom: 1,
                rotation: 0,
                flipX: false,
                flipY: false,
              },
              crop: { x: 0, y: 0, width: 0, height: 0 },
            } satisfies CropImage;
          })
        );

        setImages((prev) => {
          const combined = [...prev, ...newImages];
          return combined;
        });
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    },
    [acceptedFormats, images.length, maxFileSize, maxFiles, onError, setImages]
  );

  const removeImage = useCallback(
    (id: string) => {
      setImages((prev) => {
        const target = prev.find((image) => image.id === id);
        if (target) revokeOnRemoval(target);
        return prev.filter((image) => image.id !== id);
      });
      onDelete?.(id);
    },
    [onDelete, revokeOnRemoval, setImages]
  );

  const updateTransform = useCallback(
    (id: string, transform: Partial<CropImageTransform>) => {
      setImages((prev) =>
        prev.map((image) =>
          image.id === id ? { ...image, transform: { ...image.transform, ...transform } } : image
        )
      );
    },
    [setImages]
  );

  const updateCrop = useCallback(
    (id: string, crop: Partial<Crop>) => {
      setImages((prev) =>
        prev.map((image) => (image.id === id ? { ...image, crop: { ...image.crop, ...crop } } : image))
      );
    },
    [setImages]
  );

  const setCropForActive = useCallback(
    (crop: Crop) => {
      if (!activeId) return;
      updateCrop(activeId, crop);
    },
    [activeId, updateCrop]
  );

  const updateActiveImage = useCallback(
    (image: CropImage) => {
      setImages((prev) => prev.map((item) => (item.id === image.id ? image : item)));
    },
    [setImages]
  );

  const resetImage = useCallback(
    (id: string) => {
      setImages((prev) =>
        prev.map((image) => {
          if (image.id !== id) return image;
          if (image.croppedUrl) {
            revokeImagePreview(image.croppedUrl);
          }
          return {
            ...image,
            transform: { zoom: 1, rotation: 0, flipX: false, flipY: false },
            crop: { x: 0, y: 0, width: 0, height: 0 },
            croppedFile: undefined,
            croppedUrl: undefined,
          };
        })
      );
    },
    [setImages]
  );

  const resetAll = useCallback(() => {
    setImages((prev) =>
      prev.map((image) => {
        if (image.croppedUrl) revokeImagePreview(image.croppedUrl);
        return {
          ...image,
          transform: { zoom: 1, rotation: 0, flipX: false, flipY: false },
          crop: { x: 0, y: 0, width: 0, height: 0 },
          croppedFile: undefined,
          croppedUrl: undefined,
        };
      })
    );
  }, [setImages]);

  useEffect(() => {
    return () => {
      for (const image of imagesRef.current) {
        revokeOnRemoval(image);
      }
    };
  }, [revokeOnRemoval]);

  return {
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
  };
}
