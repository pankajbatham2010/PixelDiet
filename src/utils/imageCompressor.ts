import type { CompressionSettings } from '../types';
import { calculateSavings, getMimeType } from './formatters';

export interface ProcessImageResult {
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
  size: number;
  savedPercentage: number;
  mimeType: string;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image: ' + e));
    img.src = src;
  });
}

export function calculateTargetDimensions(
  originalWidth: number,
  originalHeight: number,
  settings: CompressionSettings
): { width: number; height: number } {
  const { resizeMode, customWidth, customHeight, scalePercentage, aspectRatioLocked } = settings;

  if (resizeMode === 'none') {
    return { width: originalWidth, height: originalHeight };
  }

  if (resizeMode === 'percentage') {
    const scale = Math.max(0.01, scalePercentage / 100);
    const width = Math.max(1, Math.round(originalWidth * scale));
    const height = Math.max(1, Math.round(originalHeight * scale));
    return { width, height };
  }

  // Custom or Preset mode
  let targetWidth = customWidth ?? originalWidth;
  let targetHeight = customHeight ?? originalHeight;

  if (aspectRatioLocked) {
    const originalRatio = originalWidth / originalHeight;
    if (customWidth && !customHeight) {
      targetWidth = Math.max(1, Math.round(customWidth));
      targetHeight = Math.max(1, Math.round(customWidth / originalRatio));
    } else if (customHeight && !customWidth) {
      targetHeight = Math.max(1, Math.round(customHeight));
      targetWidth = Math.max(1, Math.round(customHeight * originalRatio));
    } else if (customWidth && customHeight) {
      // Both provided (e.g. from preset) - calculate scale to fit proportionally within the box
      const scale = Math.min(customWidth / originalWidth, customHeight / originalHeight);
      targetWidth = Math.max(1, Math.round(originalWidth * scale));
      targetHeight = Math.max(1, Math.round(originalHeight * scale));
    }
  }

  return {
    width: Math.max(1, Math.round(targetWidth)),
    height: Math.max(1, Math.round(targetHeight)),
  };
}

export async function processImage(
  imageSource: HTMLImageElement | string,
  originalSize: number,
  originalWidth: number,
  originalHeight: number,
  originalMime: string,
  settings: CompressionSettings
): Promise<ProcessImageResult> {
  const img = typeof imageSource === 'string' ? await loadImage(imageSource) : imageSource;

  const { width: targetWidth, height: targetHeight } = calculateTargetDimensions(
    originalWidth,
    originalHeight,
    settings
  );

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const targetMime = getMimeType(settings.format, originalMime);

  // If output format is JPEG and source might have transparency (PNG/WebP), fill white background
  if (targetMime === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  // Draw scaled image
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // Convert to Blob with quality parameter
  // Quality applies to image/jpeg and image/webp. For PNG, quality is ignored by browser.
  const quality = Math.min(1.0, Math.max(0.05, settings.quality));

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Canvas toBlob conversion failed'));
      },
      targetMime,
      quality
    );
  });

  const previewUrl = URL.createObjectURL(blob);
  const size = blob.size;
  const { percentage: savedPercentage } = calculateSavings(originalSize, size);

  return {
    blob,
    previewUrl,
    width: targetWidth,
    height: targetHeight,
    size,
    savedPercentage,
    mimeType: targetMime,
  };
}
