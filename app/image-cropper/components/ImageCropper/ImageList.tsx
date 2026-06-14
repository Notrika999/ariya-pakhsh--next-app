// image-cropper/components/image-cropper/ImageList.tsx

'use client';

import { X, Plus, ImageIcon } from 'lucide-react';
import type { CropImage } from './types';

interface ImageListProps {
  images: CropImage[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onAddClick: () => void;
}

export function ImageList({ images, activeId, onSelect, onRemove, onAddClick }: ImageListProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-700 bg-slate-800/80 p-3 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Images ({images.length})</h3>
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-500"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
        {images.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-slate-600 py-8 text-slate-400">
            <ImageIcon className="h-8 w-8 opacity-50" />
            <p className="text-xs">No images yet</p>
          </div>
        )}

        {images.map((image) => (
          <div
            key={image.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(image.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') onSelect(image.id);
            }}
            className={`
              group relative flex cursor-pointer items-center gap-3 rounded-md border p-2 transition-colors
              ${
                activeId === image.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
              }
            `}
          >
            <img
              src={image.croppedUrl || image.preview}
              alt={image.file.name}
              className="h-12 w-12 rounded-md object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-slate-200">{image.file.name}</p>
              <p className="text-[10px] text-slate-400">
                {image.naturalWidth} × {image.naturalHeight}
                {image.croppedUrl && <span className="ml-1 text-emerald-400">• cropped</span>}
              </p>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(image.id);
              }}
              aria-label={`Remove ${image.file.name}`}
              className="rounded-md p-1 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
